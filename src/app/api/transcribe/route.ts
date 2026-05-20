import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as File;

    if (!audio) {
      return NextResponse.json({ error: 'Aucun fichier audio fourni' }, { status: 400 });
    }

    const whisperUrl = process.env.WHISPER_URL || 'http://whisper:9000';

    // Check if Whisper is reachable
    try {
      const healthCheck = await fetch(whisperUrl, { signal: AbortSignal.timeout(3000) });
      if (!healthCheck.ok) throw new Error('not reachable');
    } catch {
      return NextResponse.json({
        error: 'Service Whisper non disponible. Lancez le conteneur Docker Whisper ou utilisez la saisie manuelle.',
        whisperUrl,
      }, { status: 503 });
    }

    // Forward to Whisper ASR service
    const whisperFormData = new FormData();
    whisperFormData.append('audio_file', audio);

    const response = await fetch(`${whisperUrl}/asr?task=transcribe&language=fr&output=json`, {
      method: 'POST',
      body: whisperFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Erreur Whisper: ${errorText}` }, { status: 502 });
    }

    const result = await response.json();
    return NextResponse.json({ text: result.text || result });
  } catch (e) {
    return NextResponse.json({ error: `Erreur: ${String(e)}` }, { status: 500 });
  }
}
