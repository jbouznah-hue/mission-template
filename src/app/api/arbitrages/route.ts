import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { arbitrages } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(arbitrages).orderBy(desc(arbitrages.createdAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [row] = await db.insert(arbitrages).values({
      source: body.source || '',
      typeChangement: body.type_changement || 'ajout',
      description: body.description || '',
      impact: body.impact,
      statut: body.statut || 'propose',
    }).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
