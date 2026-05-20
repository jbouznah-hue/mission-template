import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'changeme';

  if (username === validUsername && password === validPassword) {
    await createSession(username);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
}
