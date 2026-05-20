import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tempsEntries } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(tempsEntries).orderBy(desc(tempsEntries.createdAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [row] = await db.insert(tempsEntries).values({
      date: body.date,
      dureeMinutes: body.duree_minutes,
      categorie: body.categorie || 'autre',
      description: body.description || '',
    }).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
