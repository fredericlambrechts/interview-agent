import { InterviewOrchestrator, InterviewContext } from './InterviewOrchestrator'
import { VoiceAgent, VoiceEventHandler } from './VoiceAgent'
import { DataValidationAgent } from '../data-validation/DataValidationAgent'
import { SessionManager } from './SessionManager'

export interface AgentCommunicationConfig {
  sessionId: string
  voiceId?: string
  onStateChange?: (state: InterviewState) => void
  onError?: (error: Error, context: string) => void
}

export interface InterviewState {
  isActive: boolean
  currentStep: string
  currentArtifact: string
  isListening: boolean
  isSpeaking: boolean
  lastTranscription?: string
  lastResponse?: string
  progress?: {
    completedArtifacts: number
    totalArtifacts: number
    confidence: number
  }
}

export class AgentCommunication {
  private orchestrator: InterviewOrchestrator
  private voiceAgent: VoiceAgent
  private dataValidationAgent: DataValidationAgent
  private config: AgentCommunicationConfig
  private state: InterviewState

  constructor(config: AgentCommunicationConfig) {
    this.config = config
    this.state = {
      isActive: false,
      currentStep: 'identity',
      currentArtifact: 'artifact_1',
      isListening: false,
      isSpeaking: false
    }

    // Initialize agents
    this.dataValidationAgent = new DataValidationAgent()
    this.voiceAgent = new VoiceAgent({
      voiceId: config.voiceId,
      onEvent: this.handleVoiceEvent.bind(this)
    })

    // Initialize orchestrator with context
    const initialContext: InterviewContext = {
      sessionId: config.sessionId,
      currentStep: this.state.currentStep,
      currentArtifact: this.state.currentArtifact,
      conversationHistory: []
    }

    this.orchestrator = new InterviewOrchestrator(
      this.voiceAgent,
      this.dataValidationAgent,
      initialContext
    )
  }

  async startInterview(): Promise<void> {
    try {
      // Check if session can be recovered
      const recoveryCheck = await SessionManager.handleInterruptedSession(this.config.sessionId)
      
      if (recoveryCheck.canResume) {
        // Attempt to recover session
        const recoveryData = await SessionManager.loadSessionState(this.config.sessionId)
        
        if (recoveryData.isRecoverable) {
          // Restore state from recovery data
          this.state.currentStep = recoveryData.state.currentStep
          this.state.currentArtifact = recoveryData.state.currentArtifact
          this.state.progress = recoveryData.state.progress
          
          // Update orchestrator context
          this.orchestrator.updateContext({
            currentStep: recoveryData.state.currentStep,
            currentArtifact: recoveryData.state.currentArtifact,
            conversationHistory: recoveryData.state.conversationHistory
          })
          
          console.log(`Session recovered from checkpoint: ${recoveryCheck.lastCheckpoint}`)
        }
      }

      this.state.isActive = true
      this.updateState({ isActive: true })

      // Start interview with orchestrator
      const response = await this.orchestrator.startInterview()
      
      // Generate opening question and speak it
      if (response.questions.length > 0) {
        const openingQuestion = response.questions[0].question
        await this.speakResponse(openingQuestion)
      }

      // Create initial checkpoint
      await SessionManager.createCheckpoint(
        this.config.sessionId,
        'manual_save',
        { event: 'interview_started', timestamp: new Date().toISOString() }
      )

      // Start listening for user input
      await this.startListening()

    } catch (error) {
      this.handleError(error as Error, 'start_interview')
    }
  }

  async stopInterview(): Promise<void> {
    try {
      this.state.isActive = false
      this.updateState({ isActive: false })
      
      // Stop any ongoing voice operations
      if (this.state.isListening) {
        await this.stopListening()
      }

    } catch (error) {
      this.handleError(error as Error, 'stop_interview')
    }
  }

  async startListening(): Promise<void> {
    if (!this.state.isActive || this.state.isListening) return

    try {
      this.updateState({ isListening: true })
      await this.voiceAgent.startListening()
    } catch (error) {
      this.updateState({ isListening: false })
      this.handleError(error as Error, 'start_listening')
    }
  }

  async stopListening(): Promise<void> {
    if (!this.state.isListening) return

    try {
      const transcription = await this.voiceAgent.stopListening()
      this.updateState({ 
        isListening: false,
        lastTranscription: transcription
      })

      // Process user input through orchestrator
      if (transcription.trim()) {
        await this.processUserInput(transcription)
      }

    } catch (error) {
      this.updateState({ isListening: false })
      this.handleError(error as Error, 'stop_listening')
    }
  }

  private async processUserInput(transcription: string): Promise<void> {
    try {
      // Route to orchestrator for analysis and response generation
      const response = await this.orchestrator.processUserInput(transcription)
      
      // Handle artifact transitions
      if (response.shouldTransition && response.nextArtifact) {
        await this.handleArtifactTransition(response.nextArtifact)
      }

      // Generate and speak response
      if (response.questions.length > 0) {
        const responseText = this.formatResponseFromQuestions(response.questions)
        await this.speakResponse(responseText)
        this.updateState({ lastResponse: responseText })
      }

      // Update progress
      await this.updateProgress()

      // Continue listening
      setTimeout(() => {
        if (this.state.isActive) {
          this.startListening()
        }
      }, 1000)

    } catch (error) {
      this.handleError(error as Error, 'process_user_input')
    }
  }

  private async handleArtifactTransition(nextArtifact: string): Promise<void> {
    if (nextArtifact === 'completed') {
      await this.stopInterview()
      return
    }

    // Update context
    this.state.currentArtifact = nextArtifact
    this.orchestrator.updateContext({
      currentArtifact: nextArtifact
    })

    this.updateState({ currentArtifact: nextArtifact })

    // Save session state after artifact transition
    await SessionManager.saveSessionState(this.config.sessionId, {
      currentStep: this.state.currentStep,
      currentArtifact: this.state.currentArtifact,
      conversationHistory: this.orchestrator.getContext().conversationHistory,
      progress: this.state.progress || { completedArtifacts: 0, totalArtifacts: 23, confidence: 0 },
      lastUpdated: new Date()
    })

    // Create checkpoint for artifact completion
    await SessionManager.createCheckpoint(
      this.config.sessionId,
      'artifact_complete',
      { 
        previousArtifact: this.state.currentArtifact,
        nextArtifact,
        timestamp: new Date().toISOString()
      }
    )
  }

  private async speakResponse(text: string): Promise<void> {
    try {
      this.updateState({ isSpeaking: true })
      await this.voiceAgent.speak(text)
      await this.voiceAgent.playGenerated()
    } catch (error) {
      this.updateState({ isSpeaking: false })
      this.handleError(error as Error, 'speak_response')
    }
  }

  private formatResponseFromQuestions(questions: Array<{ question: string; followUps: string[] }>): string {
    const primaryQuestion = questions[0]?.question || ''
    
    // Add a follow-up if available
    if (questions[0]?.followUps?.length > 0) {
      return `${primaryQuestion} ${questions[0].followUps[0]}`
    }
    
    return primaryQuestion
  }

  private async updateProgress(): Promise<void> {
    try {
      const progress = await this.dataValidationAgent.getStepProgress(
        this.config.sessionId,
        'step_1_core_identity'
      )
      
      this.updateState({
        progress: {
          completedArtifacts: progress.completedArtifacts,
          totalArtifacts: progress.totalArtifacts,
          confidence: progress.overallConfidence
        }
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  private handleVoiceEvent: VoiceEventHandler = (event) => {
    switch (event.type) {
      case 'speech_start':
        this.updateState({ isListening: true })
        break
        
      case 'speech_end':
        this.updateState({ isListening: false })
        break
        
      case 'transcription':
        this.updateState({ lastTranscription: event.data.text })
        break
        
      case 'speech_generation_start':
        this.updateState({ isSpeaking: true })
        break
        
      case 'speech_playback_end':
        this.updateState({ isSpeaking: false })
        break
        
      case 'error':
        this.handleError(new Error(event.data.error), event.data.context)
        break
    }
  }

  private updateState(updates: Partial<InterviewState>): void {
    this.state = { ...this.state, ...updates }
    this.config.onStateChange?.(this.state)
  }

  private handleError(error: Error, context: string): void {
    console.error(`AgentCommunication error in ${context}:`, error)
    this.config.onError?.(error, context)
    
    // Reset state on error
    this.updateState({
      isListening: false,
      isSpeaking: false
    })
  }

  // Public getters
  getState(): InterviewState {
    return { ...this.state }
  }

  getCurrentContext(): InterviewContext {
    return this.orchestrator.getContext()
  }

  // Manual control methods
  async forceTransition(artifactId: string): Promise<void> {
    await this.handleArtifactTransition(artifactId)
  }

  async injectUserInput(text: string): Promise<void> {
    await this.processUserInput(text)
  }
}