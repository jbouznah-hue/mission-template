import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { livrables } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const [row] = await db.update(livrables)
      .set({
        fileName: file.name,
        fileData: base64,
        updatedAt: new Date()
      })
      .where(eq(livrables.id, parseInt(id)))
      .returning();

    return NextResponse.json({ id: row.id, fileName: row.fileName });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
