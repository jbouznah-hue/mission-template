import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { livrables } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [row] = await db.select().from(livrables).where(eq(livrables.id, parseInt(id)));

    if (!row || !row.fileData || !row.fileName) {
      return NextResponse.json({ error: 'No file found' }, { status: 404 });
    }

    const buffer = Buffer.from(row.fileData, 'base64');

    const ext = row.fileName.split('.').pop()?.toLowerCase() || '';
    const contentTypes: Record<string, string> = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      html: 'text/html',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentTypes[ext] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${row.fileName}"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
