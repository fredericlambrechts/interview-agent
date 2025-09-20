import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id, model_id } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = voice_id || process.env.ELEVENLABS_VOICE_ID;
    const modelId = model_id || process.env.ELEVENLABS_MODEL_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    if (!voiceId) {
      return NextResponse.json(
        { error: 'Voice ID not configured' },
        { status: 500 }
      );
    }

    // Call ElevenLabs TTS API
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorData = await elevenLabsResponse.text();
      console.error('ElevenLabs API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        { status: elevenLabsResponse.status }
      );
    }

    // Get the audio buffer
    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    // Return the audio as a streaming response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'ElevenLabs TTS API endpoint',
      usage: 'POST with { text: string, voice_id?: string, model_id?: string }'
    },
    { status: 200 }
  );
}