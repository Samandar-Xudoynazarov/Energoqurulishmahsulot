import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSessionToken, ADMIN_COOKIE_NAME } from '../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (typeof password !== 'string' || !checkPassword(password)) {
      return NextResponse.json({ error: 'Parol noto\'g\'ri' }, { status: 401 });
    }

    const token = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
