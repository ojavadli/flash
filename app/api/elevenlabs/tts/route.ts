import { NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/elevenlabs';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const audioStream = await textToSpeech(text, voiceId);
    
    // Convert stream to buffer
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    
    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('ElevenLabs TTS Error:', error);
    return NextResponse.json({ 
      error: "Failed to generate speech",
      details: error.message 
    }, { status: 500 });
  }
}

