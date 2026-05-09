import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

/**
 * POST /api/admin/auth
 * Compares submitted password with env-provided bcrypt hash.
 * Sets a session cookie on success.
 *
 * DELETE /api/admin/auth
 * Clears the admin session cookie (logout).
 */

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const hash = process.env.ADMIN_MASTER_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json(
        { error: 'Admin password not configured. Set ADMIN_MASTER_PASSWORD_HASH.' },
        { status: 500 },
      );
    }

    const ok = await bcrypt.compare(String(password), hash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
