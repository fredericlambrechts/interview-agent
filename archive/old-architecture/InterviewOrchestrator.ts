import { VoiceAgent } from './VoiceAgent'
import { DataValidationAgent } from '../data-validation/DataValidationAgent'
import { Step1AssessmentEngine } from './Step1Assessment'
import { Step2AssessmentEngine } from './Step2Assessment'
import { QuestionGenerationEngine } from './QuestionGenerationEngine'

export interface ResearchData {
  companyUrl: string
  analysisContent?: string
  completedAt?: string
  artifactsCompleted?: number
  totalArtifacts?: number
  [key: string]: unknown
}

export interface ConversationMetadata {
  confidence?: number
  artifact?: string
  step?: string
  responseType?: string
  [key: string]: unknown
}

export interface ArtifactInfo {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  questions?: string[]
  [key: string]: unknown
}

export interface UpdateInstructions {
  action: string
  data: Record<string, unknown>
  confidence?: number
  timestamp?: string
}

export interface InterviewContext {
  sessionId: string
  currentStep: string
  currentArtifact: string
  conversationHistory: ConversationEntry[]
  researchData?: ResearchData
}

export interface ConversationEntry {
  timestamp: Date
  speaker: 'user' | 'interviewer'
  content: string
  artifact?: string
  metadata?: ConversationMetadata
}

export interface QuestionData {
  questions: Array<{
    type: string
    question: string
    followUps: string[]
  }>
  context: string
  artifactInfo: ArtifactInfo
}

export interface OrchestratorResponse {
  questions: QuestionData['questions']
  context: string
  nextArtifact?: string
  shouldTransition?: boolean
  updateInstructions?: UpdateInstructions
  stepValidation?: {
    canTransition: boolean
    reason?: string
    requiredCompletions?: string[]
  }
  sessionRecovery?: {
    recovered: boolean
    resumeFromCheckpoint?: boolean
  }
}

export class InterviewOrchestrator {
  private voiceAgent: VoiceAgent
  private dataValidationAgent: DataValidationAgent
  private context: InterviewContext

  constructor(
    voiceAgent: VoiceAgent,
    dataValidationAgent: DataValidationAgent,
    initialContext: InterviewContext
  ) {
    this.voiceAgent = voiceAgent
    this.dataValidationAgent = dataValidationAgent
    this.context = initialContext
  }

  async processUserInput(userInput: string): Promise<OrchestratorResponse> {
    try {
      // Add user input to conversation history
      this.addToConversationHistory('user', userInput)

      // Analyze input for confirmations, corrections, or new information
      const analysisResult = await this.analyzeUserInput(userInput)
      
      // Route information updates to Data Validation Agent
      if (analysisResult.hasUpdates) {
        await this.dataValidationAgent.processUserResponse(
          this.context.sessionId,
          this.context.currentArtifact,
          analysisResult.updates
        )
      }

      // Generate contextual follow-up questions
      const questionData = await this.generateContextualQuestions(analysisResult)
      
      // Determine if we should transition to next artifact
      const shouldTransition = await this.shouldTransitionArtifact()
      
      return {
        questions: questionData.questions,
        context: questionData.context,
        nextArtifact: shouldTransition ? await this.getNextArtifact() : undefined,
        shouldTransition,
        updateInstructions: analysisResult.hasUpdates ? analysisResult.updates : undefined
      }
    } catch (error) {
      console.error('InterviewOrchestrator error:', error)
      throw new Error('Failed to process user input')
    }
  }

  async startInterview(): Promise<OrchestratorResponse> {
    // Load research data for contextual questions
    const researchData = await this.loadResearchData()
    this.context.researchData = researchData

    // Generate opening questions for current artifact
    const questionData = await this.generateContextualQuestions({
      hasUpdates: false,
      updates: {},
      isInitial: true
    })

    return {
      questions: questionData.questions,
      context: questionData.context
    }
  }

  private async analyzeUserInput(userInput: string): Promise<{
    hasUpdates: boolean
    updates: UpdateInstructions
    isInitial?: boolean
  }> {
    // Use enhanced question generation engine for response type analysis
    const responseType = QuestionGenerationEngine.processUserResponseType(userInput)
    
    const hasUpdates = responseType !== 'discussion'

    return {
      hasUpdates,
      updates: {
        type: responseType,
        content: userInput,
        artifact: this.context.currentArtifact,
        timestamp: new Date(),
        responseType
      }
    }
  }

  private async generateContextualQuestions(analysisResult: { hasUpdates: boolean; updates: UpdateInstructions; isInitial?: boolean }): Promise<QuestionData> {
    // Use Step 1 Assessment Engine for Step 1 artifacts
    if (this.context.currentStep === 'identity' && 
        ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4'].includes(this.context.currentArtifact)) {
      
      // Get completion status from Data Validation Agent
      const completionStatus = await this.dataValidationAgent.getArtifactCompletionStatus(
        this.context.sessionId,
        this.context.currentArtifact
      )

      // Analyze research gaps for targeted questioning
      const researchGaps = QuestionGenerationEngine.analyzeResearchGaps(
        this.context.researchData,
        this.context.currentArtifact
      )

      // Generate targeted question based on gaps and context
      const questionContext = {
        researchData: this.context.researchData,
        conversationHistory: this.context.conversationHistory,
        completionStatus: completionStatus.status,
        userResponseType: analysisResult.updates?.responseType || 'discussion'
      }

      const generatedQuestion = QuestionGenerationEngine.generateTargetedQuestion(
        questionContext,
        researchGaps,
        this.context.currentArtifact
      )

      // Get artifact assessment details for additional context
      const artifactAssessment = Step1AssessmentEngine.getArtifactAssessment(this.context.currentArtifact)

      return {
        questions: [{
          type: generatedQuestion.type,
          question: generatedQuestion.question,
          followUps: generatedQuestion.followUps
        }],
        context: `Assessing ${artifactAssessment?.name || 'artifact'}: ${artifactAssessment?.description || ''}. Research gaps identified: ${researchGaps.length > 0 ? researchGaps[0].missingInformation.join(', ') : 'none'}`,
        artifactInfo: {
          ...artifactAssessment,
          researchGaps,
          questionPriority: generatedQuestion.priority
        }
      }
    }

    // Use Step 2 Assessment Engine for Step 2 artifacts
    if (this.context.currentStep === 'customer_market' && 
        ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8'].includes(this.context.currentArtifact)) {
      
      // Get completion status from Data Validation Agent
      const completionStatus = await this.dataValidationAgent.getArtifactCompletionStatus(
        this.context.sessionId,
        this.context.currentArtifact
      )

      // Analyze research gaps for targeted questioning
      const researchGaps = QuestionGenerationEngine.analyzeResearchGaps(
        this.context.researchData,
        this.context.currentArtifact
      )

      // Generate targeted question based on gaps and context
      const questionContext = {
        researchData: this.context.researchData,
        conversationHistory: this.context.conversationHistory,
        completionStatus: completionStatus.status,
        userResponseType: analysisResult.updates?.responseType || 'discussion'
      }

      const generatedQuestion = QuestionGenerationEngine.generateTargetedQuestion(
        questionContext,
        researchGaps,
        this.context.currentArtifact
      )

      // Get artifact assessment details for additional context
      const artifactAssessment = Step2AssessmentEngine.getArtifactAssessment(this.context.currentArtifact)

      return {
        questions: [{
          type: generatedQuestion.type,
          question: generatedQuestion.question,
          followUps: generatedQuestion.followUps
        }],
        context: `Assessing ${artifactAssessment?.name || 'artifact'}: ${artifactAssessment?.description || ''}. Research gaps identified: ${researchGaps.length > 0 ? researchGaps[0].missingInformation.join(', ') : 'none'}`,
        artifactInfo: {
          ...artifactAssessment,
          researchGaps,
          questionPriority: generatedQuestion.priority
        }
      }
    }

    // Fallback to existing orchestrator API for other steps
    try {
      const response = await fetch('/api/interview/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.context.sessionId,
          currentStep: this.context.currentStep,
          currentArtifact: this.context.currentArtifact,
          conversationContext: JSON.stringify(this.context.conversationHistory)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      return {
        questions: data.questions,
        context: data.context,
        artifactInfo: data.artifactInfo
      }
    } catch {
      // Fallback question if API fails
      return {
        questions: [{
          type: 'general',
          question: 'Can you tell me more about this aspect of your business?',
          followUps: []
        }],
        context: 'General discussion',
        artifactInfo: null
      }
    }
  }

  private async shouldTransitionArtifact(): Promise<boolean> {
    // Check if current artifact has sufficient completion
    const completionStatus = await this.dataValidationAgent.getArtifactCompletionStatus(
      this.context.sessionId,
      this.context.currentArtifact
    )
    
    return completionStatus.status === 'completed' || completionStatus.confidence > 80
  }

  async validateStepCompletion(stepId: string): Promise<{
    isComplete: boolean
    confidence: number
    completedArtifacts: number
    totalArtifacts: number
    missingArtifacts: string[]
  }> {
    try {
      // Get step progress from Data Validation Agent
      const stepProgress = await this.dataValidationAgent.getStepProgress(
        this.context.sessionId,
        stepId
      )

      // Check individual artifact completion
      const stepArtifacts = this.getArtifactsForStep(stepId)
      const missingArtifacts: string[] = []

      for (const artifactId of stepArtifacts) {
        const artifactStatus = await this.dataValidationAgent.getArtifactCompletionStatus(
          this.context.sessionId,
          artifactId
        )
        
        if (artifactStatus.status !== 'completed' && artifactStatus.confidence < 75) {
          missingArtifacts.push(artifactId)
        }
      }

      // Step is complete if overall confidence is high and no critical artifacts missing
      const isComplete = stepProgress.overallConfidence >= 75 && missingArtifacts.length === 0

      return {
        isComplete,
        confidence: stepProgress.overallConfidence,
        completedArtifacts: stepProgress.completedArtifacts,
        totalArtifacts: stepProgress.totalArtifacts,
        missingArtifacts
      }
    } catch (error) {
      console.error('Failed to validate step completion:', error)
      return {
        isComplete: false,
        confidence: 0,
        completedArtifacts: 0,
        totalArtifacts: 4,
        missingArtifacts: this.getArtifactsForStep(stepId)
      }
    }
  }

  async canTransitionToStep(targetStep: string): Promise<{
    canTransition: boolean
    reason?: string
    requiredCompletions?: string[]
  }> {
    // Step 1 → Step 2 validation
    if (targetStep === 'customer_market') {
      const step1Validation = await this.validateStepCompletion('step_1_core_identity')
      
      if (!step1Validation.isComplete) {
        return {
          canTransition: false,
          reason: `Step 1 completion required. Confidence: ${step1Validation.confidence}%`,
          requiredCompletions: step1Validation.missingArtifacts
        }
      }
      
      return { canTransition: true }
    }

    // Step 2 → Step 1 (always allowed for review/editing)
    if (targetStep === 'identity') {
      return { canTransition: true }
    }

    // Future steps validation
    return {
      canTransition: false,
      reason: 'Target step not yet implemented'
    }
  }

  private getArtifactsForStep(stepId: string): string[] {
    switch (stepId) {
      case 'step_1_core_identity':
        return ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4']
      case 'step_2_customer_market':
        return ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8']
      default:
        return []
    }
  }

  private async getNextArtifact(): Promise<string> {
    // Use Step 1 Assessment Engine for Step 1 navigation
    if (this.context.currentStep === 'identity') {
      const nextArtifact = Step1AssessmentEngine.getNextArtifactInStep(this.context.currentArtifact)
      if (nextArtifact) {
        return nextArtifact
      } else {
        // Step 1 complete, transition to Step 2
        this.context.currentStep = 'customer_market'
        return Step2AssessmentEngine.getFirstArtifactInStep() // artifact_5
      }
    }

    // Use Step 2 Assessment Engine for Step 2 navigation
    if (this.context.currentStep === 'customer_market') {
      const nextArtifact = Step2AssessmentEngine.getNextArtifactInStep(this.context.currentArtifact)
      if (nextArtifact) {
        return nextArtifact
      } else {
        // Step 2 complete, move to next step (future implementation)
        return 'completed' // For now, mark as completed when Step 2 is done
      }
    }

    // Fallback to existing orchestrator logic for other steps
    try {
      const response = await fetch(`/api/interview/orchestrator?sessionId=${this.context.sessionId}`)
      const data = await response.json()
      return data.nextArtifact || 'completed'
    } catch {
      return 'completed'
    }
  }

  private async loadResearchData(): Promise<ResearchData | null> {
    // Load research data from Tier 1 for contextual questions
    try {
      const response = await fetch(`/api/research/status/${this.context.sessionId}`)
      if (response.ok) {
        return await response.json()
      }
    } catch {
      console.log('No research data available')
    }
    return null
  }

  private addToConversationHistory(speaker: 'user' | 'interviewer', content: string): void {
    this.context.conversationHistory.push({
      timestamp: new Date(),
      speaker,
      content,
      artifact: this.context.currentArtifact
    })

    // Keep conversation history scoped to current step (last 20 entries)
    if (this.context.conversationHistory.length > 20) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-20)
    }
  }

  async recoverInterruptedSession(): Promise<{
    recovered: boolean
    currentStep: string
    currentArtifact: string
    resumeFromCheckpoint?: boolean
  }> {
    try {
      // Load session data from database
      const { data: session, error } = await fetch(`/api/interview/session/${this.context.sessionId}`)
        .then(res => res.json())
        .catch(() => ({ error: 'Failed to fetch session' }))

      if (error || !session) {
        return {
          recovered: false,
          currentStep: 'identity',
          currentArtifact: 'artifact_1'
        }
      }

      // Determine current step and artifact based on step_data
      const stepData = session.step_data || {}
      let currentStep = 'identity'
      let currentArtifact = 'artifact_1'
      let resumeFromCheckpoint = false

      // Check Step 1 completion
      const step1Data = stepData.step_1_core_identity
      if (step1Data && step1Data.step_completion_status === 'completed') {
        // Step 1 complete, check Step 2
        const step2Data = stepData.step_2_customer_market
        if (step2Data) {
          currentStep = 'customer_market'
          currentArtifact = this.findLastActiveArtifact(step2Data.artifacts, ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8'])
          resumeFromCheckpoint = true
        } else {
          // Transition to Step 2
          currentStep = 'customer_market'
          currentArtifact = 'artifact_5'
        }
      } else if (step1Data) {
        // Step 1 in progress
        currentStep = 'identity'
        currentArtifact = this.findLastActiveArtifact(step1Data.artifacts, ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4'])
        resumeFromCheckpoint = true
      }

      // Update context with recovered state
      this.context.currentStep = currentStep
      this.context.currentArtifact = currentArtifact
      
      // Load conversation history if available
      if (session.conversation_history) {
        this.context.conversationHistory = session.conversation_history.map((msg: any) => ({
          timestamp: new Date(msg.timestamp),
          speaker: msg.speaker,
          content: msg.content,
          artifact: msg.artifact,
          metadata: msg.metadata
        }))
      }

      return {
        recovered: true,
        currentStep,
        currentArtifact,
        resumeFromCheckpoint
      }
    } catch (error) {
      console.error('Failed to recover interrupted session:', error)
      return {
        recovered: false,
        currentStep: 'identity',
        currentArtifact: 'artifact_1'
      }
    }
  }

  private findLastActiveArtifact(artifacts: Record<string, any>, artifactOrder: string[]): string {
    // Find the last artifact that has been started or completed
    for (let i = artifactOrder.length - 1; i >= 0; i--) {
      const artifactKey = this.getArtifactKeyFromId(artifactOrder[i])
      const artifact = artifacts[artifactKey]
      
      if (artifact && (
        artifact.completion_status === 'in_progress' || 
        artifact.completion_status === 'completed' ||
        artifact.user_confirmations?.length > 0 ||
        artifact.user_corrections?.length > 0 ||
        artifact.user_additions?.length > 0
      )) {
        return artifactOrder[i]
      }
    }
    
    // Default to first artifact if none found
    return artifactOrder[0]
  }

  private getArtifactKeyFromId(artifactId: string): string {
    const keyMap: Record<string, string> = {
      'artifact_1': 'artifact_1_company_mission_vision',
      'artifact_2': 'artifact_2_core_offering_definition',
      'artifact_3': 'artifact_3_regulatory_pathway',
      'artifact_4': 'artifact_4_revenue_streams_pricing',
      'artifact_5': 'artifact_5_market_sizing',
      'artifact_6': 'artifact_6_clinical_evidence',
      'artifact_7': 'artifact_7_ideal_customer_profile',
      'artifact_8': 'artifact_8_customer_pains_gains'
    }
    return keyMap[artifactId] || artifactId
  }

  async createSessionCheckpoint(): Promise<void> {
    try {
      // Save current session state to database for recovery
      await fetch(`/api/interview/checkpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.context.sessionId,
          currentStep: this.context.currentStep,
          currentArtifact: this.context.currentArtifact,
          conversationHistory: this.context.conversationHistory,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to create session checkpoint:', error)
    }
  }

  updateContext(updates: Partial<InterviewContext>): void {
    this.context = { ...this.context, ...updates }
  }

  getContext(): InterviewContext {
    return { ...this.context }
  }
}