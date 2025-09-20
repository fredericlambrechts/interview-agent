'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob: Blob | null;
  duration: number;
  error: string | null;
  isSupported: boolean;
}

export interface VoiceRecordingActions {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  transcribeAudio: () => Promise<string | null>;
}

export function useVoiceRecording(): VoiceRecordingState & VoiceRecordingActions {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    audioBlob: null,
    duration: 0,
    error: null,
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if the browser supports audio recording
  useEffect(() => {
    const isSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  const startRecording = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Audio recording is not supported in this browser' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, error: null, isProcessing: true }));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        setState(prev => ({ ...prev, audioBlob, isRecording: false, isProcessing: false }));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Clear duration interval
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setState(prev => ({ 
          ...prev, 
          error: 'Recording failed', 
          isRecording: false, 
          isProcessing: false 
        }));
      };

      mediaRecorder.start(100); // Collect data every 100ms
      startTimeRef.current = Date.now();

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({ 
          ...prev, 
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000)
        }));
      }, 1000);

      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        isProcessing: false, 
        duration: 0,
        audioBlob: null 
      }));

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to access microphone. Please check permissions.', 
        isProcessing: false 
      }));
    }
  }, [state.isSupported]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [state.isRecording]);

  const clearRecording = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      audioBlob: null, 
      duration: 0, 
      error: null 
    }));
    audioChunksRef.current = [];
  }, []);

  const transcribeAudio = useCallback(async (): Promise<string | null> => {
    if (!state.audioBlob) {
      setState(prev => ({ ...prev, error: 'No audio to transcribe' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));

      const formData = new FormData();
      formData.append('audio', state.audioBlob, 'recording.webm');

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();
      setState(prev => ({ ...prev, isProcessing: false }));
      
      return result.text || null;

    } catch (error) {
      console.error('Transcription error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Transcription failed',
        isProcessing: false 
      }));
      return null;
    }
  }, [state.audioBlob]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [state.isRecording]);

  return {
    ...state,
    startRecording,
    stopRecording,
    clearRecording,
    transcribeAudio,
  };
}