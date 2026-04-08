import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || ''
const COOKIE_NAME = 'mosaic-unlocked'

export function middleware(req: NextRequest) {
  // Skip password for API routes, Studio, and static files
  if (
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/studio') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname === '/unlock'
  ) {
    return NextResponse.next()
  }

  // No password set = no gate
  if (!PASSWORD) return NextResponse.next()

  // Check cookie
  if (req.cookies.get(COOKIE_NAME)?.value === 'true') {
    return NextResponse.next()
  }

  // Show password form
  return new NextResponse(passwordPageHtml(req.nextUrl.pathname), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  })
}

function passwordPageHtml(returnPath: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mosaic – Enter Password</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,sans-serif;background:#F5F7FA;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1.5rem}.card{background:#fff;border-radius:1rem;border:1px solid #E2E8F0;padding:2.5rem;max-width:24rem;width:100%;text-align:center}.card h1{font-size:1.25rem;font-weight:700;color:#2D3748;margin-bottom:.5rem}.card p{font-size:.875rem;color:#64748B;margin-bottom:1.5rem}input{width:100%;border:1px solid #E2E8F0;border-radius:.75rem;padding:.75rem 1rem;font-size:.875rem;margin-bottom:.75rem}input:focus{outline:none;border-color:#2A9D8F}button{width:100%;background:#4E8EBE;color:#fff;font-weight:600;padding:.75rem;border:none;border-radius:9999px;cursor:pointer;font-size:.875rem}button:hover{background:#3E7BA6}.error{color:#ef4444;font-size:.75rem;margin-bottom:.75rem}</style></head>
<body><div class="card"><h1>Mosaic Christian Fellowship</h1><p>Enter the password to view this site.</p>
<form method="POST" action="/api/unlock"><input type="hidden" name="returnPath" value="${returnPath}">
<input type="password" name="password" placeholder="Password" autofocus required>
<div class="error" id="err"></div><button type="submit">Enter</button></form></div>
<script>const u=new URL(window.location);if(u.searchParams.get('error')){document.getElementById('err').textContent='Incorrect password. Try again.'}</script>
</body></html>`
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
