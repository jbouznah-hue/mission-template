import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comptesRendus } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (body.titre !== undefined) updateData.titre = body.titre;
    if (body.contenu !== undefined) updateData.contenu = body.contenu;
    if (body.statut !== undefined) updateData.statut = body.statut;
    if (body.transcriptBrut !== undefined) updateData.transcriptBrut = body.transcriptBrut;
    if (body.transcriptNettoye !== undefined) updateData.transcriptNettoye = body.transcriptNettoye;
    if (body.audioUrl !== undefined) updateData.audioUrl = body.audioUrl;

    const [row] = await db.update(comptesRendus)
      .set(updateData)
      .where(eq(comptesRendus.id, parseInt(id)))
      .returning();
    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(comptesRendus).where(eq(comptesRendus.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
