import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from './app/lib/admin-auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and login API itself
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdminArea) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
