'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface VoicePlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  error: string | null;
  audioUrl: string | null;
}

export interface VoicePlaybackActions {
  speak: (text: string, voiceId?: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
}

export function useVoicePlayback(): VoicePlaybackState & VoicePlaybackActions {
  const [state, setState] = useState<VoicePlaybackState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    error: null,
    audioUrl: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setState(prev => ({ 
          ...prev, 
          duration: audio.duration || 0,
          isLoading: false 
        }));
      };

      const handleTimeUpdate = () => {
        setState(prev => ({ 
          ...prev, 
          currentTime: audio.currentTime || 0 
        }));
      };

      const handleEnded = () => {
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          currentTime: 0 
        }));
      };

      const handleError = () => {
        setState(prev => ({ 
          ...prev, 
          error: 'Audio playback failed',
          isPlaying: false,
          isLoading: false 
        }));
      };

      const handleCanPlay = () => {
        setState(prev => ({ ...prev, isLoading: false }));
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
    };
  }, []);

  const speak = useCallback(async (text: string, voiceId?: string) => {
    if (!text.trim()) {
      setState(prev => ({ ...prev, error: 'No text provided for speech synthesis' }));
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        isPlaying: false 
      }));

      // Clean up previous audio URL
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }

      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: voiceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Speech synthesis failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrlRef.current = audioUrl;

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load(); // Reload audio with new source
      }

      setState(prev => ({ 
        ...prev, 
        audioUrl,
        currentTime: 0
      }));

    } catch (error) {
      console.error('Speech synthesis error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Speech synthesis failed',
        isLoading: false 
      }));
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && state.audioUrl) {
      audioRef.current.play()
        .then(() => {
          setState(prev => ({ ...prev, isPlaying: true, error: null }));
        })
        .catch((error) => {
          console.error('Playback error:', error);
          setState(prev => ({ 
            ...prev, 
            error: 'Playback failed', 
            isPlaying: false 
          }));
        });
    }
  }, [state.audioUrl]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentTime: 0 
      }));
    }
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    if (audioRef.current && state.duration > 0) {
      const clampedTime = Math.max(0, Math.min(time, state.duration));
      audioRef.current.currentTime = clampedTime;
      setState(prev => ({ ...prev, currentTime: clampedTime }));
    }
  }, [state.duration]);

  return {
    ...state,
    speak,
    play,
    pause,
    stop,
    setCurrentTime,
  };
}