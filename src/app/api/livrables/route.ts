import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { livrables } from '@/db/schema';

export async function GET() {
  try {
    const rows = await db.select().from(livrables).orderBy(livrables.ordre);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [row] = await db.insert(livrables).values({
      phase: body.phase,
      numero: body.numero,
      titre: body.titre,
      description: body.description || '',
      responsabilite: body.responsabilite || 'ORRTYL',
      statut: body.statut || 'a_faire',
      ordre: body.ordre || 0,
    }).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
