import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const password = formData.get('password') as string
  const returnPath = (formData.get('returnPath') as string) || '/'

  if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
    const res = NextResponse.redirect(new URL(returnPath, req.url))
    res.cookies.set('mosaic-unlocked', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return res
  }

  return NextResponse.redirect(new URL(`${returnPath}?error=1`, req.url))
}
