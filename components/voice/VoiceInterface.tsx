'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useVoiceRecording } from '@/lib/voice/useVoiceRecording';
import { useVoicePlayback } from '@/lib/voice/useVoicePlayback';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX,
  Loader2,
  AlertCircle
} from 'lucide-react';

export interface VoiceInterfaceProps {
  onTranscription?: (text: string) => void;
  onSpeechStart?: () => void;
  className?: string;
  voiceId?: string;
}

export function VoiceInterface({
  onTranscription,
  onSpeechStart,
  className = '',
  voiceId
}: VoiceInterfaceProps) {
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  const recording = useVoiceRecording();
  const playback = useVoicePlayback();

  const handleStartRecording = async () => {
    setTranscribedText('');
    await recording.startRecording();
  };

  const handleStopRecording = () => {
    recording.stopRecording();
  };

  const handleTranscribe = async () => {
    const text = await recording.transcribeAudio();
    if (text) {
      setTranscribedText(text);
      onTranscription?.(text);
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text.trim()) return;
    
    setLastSpokenText(text);
    onSpeechStart?.();
    await playback.speak(text, voiceId);
    
    // Auto-play after generation
    setTimeout(() => {
      playback.play();
    }, 100);
  };


  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 p-6 border rounded-lg bg-card ${className}`}>
      {/* Voice Recording Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voice Recording</h3>
          <Badge 
            variant={recording.isSupported ? "default" : "destructive"}
            className="text-xs"
          >
            {recording.isSupported ? "Supported" : "Not Supported"}
          </Badge>
        </div>

        {!recording.isSupported && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">
              Voice recording is not supported in this browser
            </span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button
            onClick={recording.isRecording ? handleStopRecording : handleStartRecording}
            disabled={!recording.isSupported || recording.isProcessing}
            variant={recording.isRecording ? "destructive" : "default"}
            size="lg"
            className="flex items-center gap-2"
          >
            {recording.isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : recording.isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {recording.isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          {recording.isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono">
                {formatDuration(recording.duration)}
              </span>
            </div>
          )}
        </div>

        {recording.audioBlob && !recording.isRecording && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Recording Complete ({formatDuration(recording.duration)})
              </Badge>
              <Button
                onClick={handleTranscribe}
                disabled={recording.isProcessing}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                {recording.isProcessing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : null}
                Transcribe
              </Button>
              <Button
                onClick={recording.clearRecording}
                variant="ghost"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {transcribedText && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-1">Transcription:</p>
            <p className="text-sm">{transcribedText}</p>
          </div>
        )}

        {recording.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{recording.error}</span>
          </div>
        )}
      </div>

      {/* Voice Playback Section */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voice Playback</h3>
          {playback.isLoading && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating...
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={() => handleSpeak("Hello! This is a test of the voice synthesis system.")}
              disabled={playback.isLoading}
              variant="outline"
              size="sm"
            >
              Test Voice
            </Button>
            {transcribedText && (
              <Button
                onClick={() => handleSpeak(transcribedText)}
                disabled={playback.isLoading || !transcribedText}
                variant="outline"
                size="sm"
              >
                Speak Transcription
              </Button>
            )}
          </div>
        </div>

        {playback.audioUrl && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Button
                onClick={playback.isPlaying ? playback.pause : playback.play}
                disabled={playback.isLoading}
                variant="default"
                size="lg"
                className="flex items-center gap-2"
              >
                {playback.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {playback.isPlaying ? 'Pause' : 'Play'}
              </Button>

              <Button
                onClick={playback.stop}
                disabled={!playback.isPlaying && playback.currentTime === 0}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>

              <div className="flex items-center gap-2">
                {playback.isPlaying ? (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-mono text-muted-foreground">
                  {formatDuration(Math.floor(playback.currentTime))} / {formatDuration(Math.floor(playback.duration))}
                </span>
              </div>
            </div>

            {playback.duration > 0 && (
              <div className="space-y-1">
                <Progress 
                  value={(playback.currentTime / playback.duration) * 100} 
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max={playback.duration}
                  step="0.1"
                  value={playback.currentTime}
                  onChange={(e) => playback.setCurrentTime(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            {lastSpokenText && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Last spoken:</p>
                <p className="text-sm">{lastSpokenText}</p>
              </div>
            )}
          </div>
        )}

        {playback.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{playback.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}