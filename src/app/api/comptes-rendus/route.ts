import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comptesRendus } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db.select().from(comptesRendus).orderBy(desc(comptesRendus.createdAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [row] = await db.insert(comptesRendus).values({
      titre: body.titre || '',
      dateReunion: body.date_reunion,
      dureeReunion: body.duree_reunion,
      audioUrl: body.audio_url,
      transcriptBrut: body.transcript_brut,
      transcriptNettoye: body.transcript_nettoye,
      contenu: body.contenu || '',
      statut: body.statut || 'brouillon',
    }).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
