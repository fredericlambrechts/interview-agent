export interface VoiceEventData {
  status?: string
  text?: string
  voiceId?: string
  error?: string
  context?: string
  [key: string]: unknown
}

export interface VoiceInputEvent {
  type: 'speech_start' | 'speech_end' | 'transcription' | 'error'
  data: VoiceEventData
  timestamp: Date
}

export interface VoiceOutputEvent {
  type: 'speech_generation_start' | 'speech_generation_complete' | 'speech_playback_start' | 'speech_playback_end' | 'error'
  data: VoiceEventData
  timestamp: Date
}

export type VoiceEventHandler = (event: VoiceInputEvent | VoiceOutputEvent) => void

export interface VoiceAgentConfig {
  voiceId?: string
  apiKey?: string
  onEvent?: VoiceEventHandler
}

export class VoiceAgent {
  private config: VoiceAgentConfig
  private eventHandlers: VoiceEventHandler[] = []
  
  constructor(config: VoiceAgentConfig = {}) {
    this.config = config
    if (config.onEvent) {
      this.eventHandlers.push(config.onEvent)
    }
  }

  addEventListener(handler: VoiceEventHandler): void {
    this.eventHandlers.push(handler)
  }

  removeEventListener(handler: VoiceEventHandler): void {
    const index = this.eventHandlers.indexOf(handler)
    if (index > -1) {
      this.eventHandlers.splice(index, 1)
    }
  }

  private emitEvent(event: VoiceInputEvent | VoiceOutputEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error('VoiceAgent event handler error:', error)
      }
    })
  }

  async startListening(): Promise<void> {
    try {
      this.emitEvent({
        type: 'speech_start',
        data: { status: 'listening' },
        timestamp: new Date()
      })

      // Pure ElevenLabs I/O - delegates to existing voice recording hooks
      // Implementation will use existing useVoiceRecording hook
      
    } catch (error) {
      this.emitEvent({
        type: 'error',
        data: { error: error.message, context: 'start_listening' },
        timestamp: new Date()
      })
      throw error
    }
  }

  async stopListening(): Promise<string> {
    try {
      this.emitEvent({
        type: 'speech_end',
        data: { status: 'processing' },
        timestamp: new Date()
      })

      // Pure ElevenLabs I/O - delegates to existing transcription
      // Implementation will use existing transcription API
      const transcription = '' // Placeholder - will be handled by VoiceInterface component
      
      this.emitEvent({
        type: 'transcription',
        data: { text: transcription },
        timestamp: new Date()
      })

      return transcription
    } catch (error) {
      this.emitEvent({
        type: 'error',
        data: { error: error.message, context: 'stop_listening' },
        timestamp: new Date()
      })
      throw error
    }
  }

  async speak(text: string, voiceId?: string): Promise<void> {
    try {
      this.emitEvent({
        type: 'speech_generation_start',
        data: { text, voiceId: voiceId || this.config.voiceId },
        timestamp: new Date()
      })

      // Pure ElevenLabs I/O - delegates to existing voice playback hooks
      // Implementation will use existing useVoicePlayback hook
      
      this.emitEvent({
        type: 'speech_generation_complete',
        data: { text, voiceId: voiceId || this.config.voiceId },
        timestamp: new Date()
      })

    } catch (error) {
      this.emitEvent({
        type: 'error',
        data: { error: error.message, context: 'speak' },
        timestamp: new Date()
      })
      throw error
    }
  }

  async playGenerated(): Promise<void> {
    try {
      this.emitEvent({
        type: 'speech_playback_start',
        data: { status: 'playing' },
        timestamp: new Date()
      })

      // Pure ElevenLabs I/O - delegates to existing playback
      // Implementation will use existing useVoicePlayback hook

    } catch (error) {
      this.emitEvent({
        type: 'error',
        data: { error: error.message, context: 'play_generated' },
        timestamp: new Date()
      })
      throw error
    }
  }

  onPlaybackEnd(): void {
    this.emitEvent({
      type: 'speech_playback_end',
      data: { status: 'completed' },
      timestamp: new Date()
    })
  }

  // Configuration methods
  setVoiceId(voiceId: string): void {
    this.config.voiceId = voiceId
  }

  getVoiceId(): string | undefined {
    return this.config.voiceId
  }

  isSupported(): boolean {
    // Check if browser supports required APIs
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }
}