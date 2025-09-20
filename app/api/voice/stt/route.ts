import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Prepare form data for ElevenLabs STT API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('file', audioFile, audioFile.name || 'recording.webm');
    elevenLabsFormData.append('model_id', 'eleven_multilingual_v2');

    // Call ElevenLabs STT API
    const elevenLabsResponse = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
        body: elevenLabsFormData,
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorData = await elevenLabsResponse.text();
      console.error('ElevenLabs STT API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to transcribe speech' },
        { status: elevenLabsResponse.status }
      );
    }

    const transcriptionResult = await elevenLabsResponse.json();

    return NextResponse.json({
      text: transcriptionResult.text,
      confidence: transcriptionResult.confidence || null,
      processing_time: transcriptionResult.processing_time || null
    });

  } catch (error) {
    console.error('STT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'ElevenLabs STT API endpoint',
      usage: 'POST with multipart/form-data containing audio file'
    },
    { status: 200 }
  );
}