/**
 * Checks that a pull request stays inside its author's lane.
 *
 * Lanes are configured in .github/lanes.json. Maintainers are exempt. Anyone
 * not listed gets the default (strictest) lane, so a brand-new volunteer is
 * guarded before anybody remembers to configure them.
 *
 * This is a guide rail, not a gate. It leaves a comment explaining what tripped
 * and what to do instead, and fails the check so the signal is visible — but
 * the maintainer can always merge anyway, or add the skip label.
 *
 * Deliberate limitation, worth knowing: this checks *which files* changed, not
 * what changed inside them. It cannot tell a copy edit from a Tailwind class
 * change in the same page file. Reviewing still matters.
 */

const MARKER = '<!-- scope-check -->'

/** Minimal glob matcher: supports ** (any depth), * (one segment), and literals. */
export function matches(pattern, filePath) {
  const escaped = pattern
    .split(/(\*\*\/|\*\*|\*)/)
    .map((part) => {
      if (part === '**/') return '(?:.*/)?'
      if (part === '**') return '.*'
      if (part === '*') return '[^/]*'
      return part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\?/g, '.')
    })
    .join('')
  return new RegExp(`^${escaped}$`).test(filePath)
}

export default async function scopeCheck({ github, context, core }) {
  const { readFileSync } = await import('fs')
  const config = JSON.parse(readFileSync('.github/lanes.json', 'utf8'))

  const pr = context.payload.pull_request
  const author = pr.user.login
  const { owner, repo } = context.repo

  if (config.maintainers.includes(author)) {
    core.info(`${author} is a maintainer — nothing to check.`)
    return
  }

  const labels = (pr.labels ?? []).map((l) => l.name)
  if (config.skipLabel && labels.includes(config.skipLabel)) {
    core.info(`Waived by the "${config.skipLabel}" label.`)
    return
  }

  const laneName =
    Object.keys(config.lanes).find((name) => config.lanes[name].members.includes(author)) ??
    config.defaultLane
  const lane = config.lanes[laneName]
  const isAssigned = lane.members.includes(author)

  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: pr.number,
    per_page: 100,
  })

  const flagged = files
    .map((f) => f.filename)
    .filter((name) => lane.restricted.some((pattern) => matches(pattern, name)))

  const body = flagged.length
    ? [
        MARKER,
        `### This pull request reaches outside the **${laneName}** lane`,
        '',
        `Hi @${author} — thanks for this. Before it can be reviewed, some of these changes need to move to a conversation instead of code:`,
        '',
        ...flagged.map((f) => `- \`${f}\``),
        '',
        `The **${laneName}** lane covers: ${lane.description}`,
        '',
        isAssigned
          ? ''
          : `_You aren't assigned a lane yet, so you're getting the default one. If that's wrong, a maintainer can add your username to \`.github/lanes.json\`._`,
        '',
        '**What to do now.** Nothing here is lost. Either take those files back out of this pull request and keep the rest, or leave it and raise the idea in Slack — a maintainer can wave it through with the `' +
          (config.skipLabel ?? 'scope-approved') +
          '` label if it turns out to be the right call.',
        '',
        "This isn't a judgement on the work. Lanes exist so two people don't quietly undo each other, and so nobody spends an evening on something that has to be unpicked.",
      ]
        .filter((line) => line !== '')
        .join('\n')
    : [
        MARKER,
        `### Scope check passed`,
        '',
        `Everything here sits inside the **${laneName}** lane. Good to review.`,
      ].join('\n')

  // Reuse one comment rather than stacking a new one on every push.
  try {
    const comments = await github.paginate(github.rest.issues.listComments, {
      owner,
      repo,
      issue_number: pr.number,
      per_page: 100,
    })
    const existing = comments.find((c) => c.body?.includes(MARKER))
    if (existing) {
      await github.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body })
    } else {
      await github.rest.issues.createComment({ owner, repo, issue_number: pr.number, body })
    }
  } catch (err) {
    core.warning(`Could not post the explanation comment: ${err.message}`)
  }

  if (flagged.length) {
    core.setFailed(
      `${flagged.length} file(s) outside the ${laneName} lane: ${flagged.join(', ')}`,
    )
  } else {
    core.info(`All changes sit inside the ${laneName} lane.`)
  }
}
