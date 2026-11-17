// Builds a short CSS selector for the element a reviewer clicked, so pins can
// find it again on a later visit. Order of preference: a unique id, then a
// unique data attribute, then a tag path with :nth-of-type, anchored at the
// nearest ancestor that has a unique id.

const DATA_ATTRS = ['data-testid', 'data-section', 'data-slot', 'data-name']
const MAX_DEPTH = 8

function esc(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value)
  return value.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`)
}

function isUnique(doc: Document, selector: string): boolean {
  try {
    return doc.querySelectorAll(selector).length === 1
  } catch {
    return false
  }
}

function idSelector(el: Element): string | null {
  if (!el.id) return null
  const sel = `#${esc(el.id)}`
  return isUnique(el.ownerDocument, sel) ? sel : null
}

function dataSelector(el: Element): string | null {
  for (const attr of DATA_ATTRS) {
    const value = el.getAttribute(attr)
    if (!value) continue
    const sel = `${el.tagName.toLowerCase()}[${attr}="${value.replace(/"/g, '\\"')}"]`
    if (isUnique(el.ownerDocument, sel)) return sel
  }
  return null
}

function nthOfType(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const parent = el.parentElement
  if (!parent) return tag
  const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName)
  if (siblings.length === 1) return tag
  return `${tag}:nth-of-type(${siblings.indexOf(el) + 1})`
}

export function buildSelector(el: Element): string {
  const doc = el.ownerDocument
  const direct = idSelector(el) ?? dataSelector(el)
  if (direct) return direct

  const parts: string[] = []
  let current: Element | null = el
  let depth = 0
  while (current && current !== doc.documentElement && depth < MAX_DEPTH) {
    if (current !== el) {
      const anchor = idSelector(current) ?? dataSelector(current)
      if (anchor) {
        parts.unshift(anchor)
        break
      }
    }
    if (current === doc.body) {
      parts.unshift('body')
      break
    }
    parts.unshift(nthOfType(current))
    current = current.parentElement
    depth += 1
  }

  const selector = parts.join(' > ')
  return selector || 'body'
}

/** The element a saved selector points to, or null if the page has changed. */
export function findBySelector(doc: Document, selector: string): Element | null {
  if (!selector) return null
  try {
    const matches = doc.querySelectorAll(selector)
    return matches.length === 1 ? matches[0] : null
  } catch {
    return null
  }
}
