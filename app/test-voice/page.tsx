'use client';

import { VoiceInterface } from '@/components/voice';

export default function TestVoicePage() {
  const handleTranscription = (text: string) => {
    console.log('Transcribed text:', text);
  };

  const handleSpeechStart = () => {
    console.log('Speech started');
  };


  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Voice Interface Test Page
        </h1>
        
        <VoiceInterface
          onTranscription={handleTranscription}
          onSpeechStart={handleSpeechStart}
          className="w-full"
          voiceId={process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID}
        />

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Test Instructions</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Click &quot;Start Recording&quot; to begin voice capture</p>
            <p>2. Speak clearly into your microphone</p>
            <p>3. Click &quot;Stop Recording&quot; to end capture</p>
            <p>4. Click &quot;Transcribe&quot; to convert speech to text</p>
            <p>5. Click &quot;Speak Transcription&quot; to hear the text spoken back</p>
            <p>6. Use playback controls to manage audio</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Browser Requirements</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Microphone access permissions required</li>
            <li>• Modern browser with MediaRecorder API support</li>
            <li>• HTTPS connection recommended for production</li>
            <li>• Audio playback capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}