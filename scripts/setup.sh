#!/usr/bin/env bash
# =============================================================================
# Mosaic Website — One-time setup
# =============================================================================
# Gets a new computer ready to run the Mosaic site locally.
#
# You don't need to understand this script. You can simply ask Claude:
#   "Please run the setup script."
# ...or run it yourself from the mosaic-nextjs folder:
#   bash scripts/setup.sh
#
# It is safe to run more than once.
# =============================================================================

set -euo pipefail

# --- pretty output ----------------------------------------------------------
bold=$'\033[1m'; green=$'\033[0;32m'; yellow=$'\033[0;33m'; red=$'\033[0;31m'; dim=$'\033[2m'; reset=$'\033[0m'
say()  { printf "%s\n" "${bold}$1${reset}"; }
ok()   { printf "%s✓ %s%s\n" "$green" "$1" "$reset"; }
warn() { printf "%s! %s%s\n" "$yellow" "$1" "$reset"; }
err()  { printf "%s✗ %s%s\n" "$red" "$1" "$reset"; }
step() { printf "\n%s── %s%s\n" "$bold" "$1 ──${reset}"; }

# --- locate project root (this script lives in <root>/scripts) --------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

say "Setting up the Mosaic website 🧩"
printf "%sProject folder: %s%s\n" "$dim" "$ROOT_DIR" "$reset"

# --- 1. make sure bun is installed ------------------------------------------
step "1/4  Checking for bun (the tool that runs the site)"
if command -v bun >/dev/null 2>&1; then
  ok "bun is already installed ($(bun --version))"
else
  warn "bun isn't installed yet — installing it now (this is normal)…"
  curl -fsSL https://bun.sh/install | bash
  # make bun available in THIS session without restarting the terminal
  export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
  export PATH="$BUN_INSTALL/bin:$PATH"
  if command -v bun >/dev/null 2>&1; then
    ok "bun installed ($(bun --version))"
  else
    err "bun was installed but isn't on your PATH yet."
    echo "  Close this terminal, open a new one, and run this script again."
    exit 1
  fi
fi

# --- 2. install the project's building blocks -------------------------------
step "2/4  Installing the site's building blocks (dependencies)"
bun install
ok "Dependencies installed"

# --- 3. create .env.local if it doesn't exist -------------------------------
step "3/4  Setting up your secret values file (.env.local)"
if [ -f .env.local ]; then
  ok ".env.local already exists — leaving it as-is"
else
  cp .env.example .env.local
  ok "Created .env.local from the template"
  warn "ACTION NEEDED: open .env.local and paste in the Redis value you were given."
  echo "  Find the line:   mosaic_REDIS_URL="
  echo "  Paste your value right after the = sign (no spaces, no quotes)."
  echo "  ${dim}Tip: you can ask Claude — 'help me fill in my .env.local'.${reset}"
fi

# Gentle check: is the one value a volunteer needs actually filled in?
if grep -qE '^mosaic_REDIS_URL=.+' .env.local 2>/dev/null; then
  ok "Redis value looks filled in"
else
  warn "Redis value is still blank — the site will run but won't show live data until it's set."
fi

# --- 4. confirm everything compiles -----------------------------------------
step "4/4  Quick health check"
if bun run lint >/dev/null 2>&1; then
  ok "Project looks healthy"
else
  warn "Lint reported some issues — that's usually fine for getting started."
fi

# --- done -------------------------------------------------------------------
printf "\n"
say "🎉 Setup complete!"
echo "To see the website on your computer, run:"
echo "    ${bold}bun dev${reset}"
echo "...then open ${bold}http://localhost:3000${reset} in your browser."
echo "${dim}(Or just ask Claude: \"start the site so I can see it\".)${reset}"
