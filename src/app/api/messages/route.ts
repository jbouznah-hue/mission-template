import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { desc, eq, and } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get('item_type');
    const itemId = searchParams.get('item_id');

    if (itemType && itemId) {
      const rows = await db.select().from(messages)
        .where(and(
          eq(messages.itemType, itemType as 'livrable' | 'phase' | 'arbitrage' | 'general'),
          eq(messages.itemId, itemId)
        ))
        .orderBy(messages.createdAt);
      return NextResponse.json(rows);
    }

    const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [row] = await db.insert(messages).values({
      itemType: body.item_type || 'general',
      itemId: body.item_id,
      auteur: body.auteur || 'client',
      contenu: body.contenu,
    }).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
