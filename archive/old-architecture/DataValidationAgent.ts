import { supabase } from '@/lib/supabase'

export interface ArtifactData {
  research_input?: any
  user_confirmations?: any
  user_corrections?: any
  user_additions?: any
  completion_status: 'pending' | 'in_progress' | 'completed'
}

export interface StepData {
  artifacts: Record<string, ArtifactData>
  step_completion_status: 'pending' | 'in_progress' | 'completed'
  open_questions: string[]
  step_confidence_score: number
}

export interface UserResponse {
  type: 'confirmation' | 'correction' | 'addition' | 'discussion'
  content: string
  artifact: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface CompletionStatus {
  status: 'pending' | 'in_progress' | 'completed'
  confidence: number
  completedFields: string[]
  missingFields: string[]
  openQuestions: string[]
}

export class DataValidationAgent {
  private supabaseClient = supabase

  async processUserResponse(
    sessionId: string,
    artifactId: string,
    userResponse: UserResponse
  ): Promise<void> {
    try {
      // Get current session data
      const { data: session, error: sessionError } = await this.supabaseClient
        .from('assessment_sessions')
        .select('step_data')
        .eq('id', sessionId)
        .single()

      if (sessionError) {
        throw new Error(`Failed to get session: ${sessionError.message}`)
      }

      // Initialize step_data structure if needed
      const stepData = this.ensureStepDataStructure(session.step_data, artifactId)
      
      // Update artifact data based on response type
      this.updateArtifactData(stepData, artifactId, userResponse)
      
      // Recalculate completion status and confidence
      this.updateCompletionMetrics(stepData, artifactId)
      
      // Save updated step_data
      const { error: updateError } = await this.supabaseClient
        .from('assessment_sessions')
        .update({ 
          step_data: stepData,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (updateError) {
        throw new Error(`Failed to update session: ${updateError.message}`)
      }

    } catch (error) {
      console.error('DataValidationAgent error:', error)
      throw error
    }
  }

  async getArtifactCompletionStatus(
    sessionId: string,
    artifactId: string
  ): Promise<CompletionStatus> {
    try {
      const { data: session, error } = await this.supabaseClient
        .from('assessment_sessions')
        .select('step_data')
        .eq('id', sessionId)
        .single()

      if (error) {
        throw new Error(`Failed to get session: ${error.message}`)
      }

      const stepData = session.step_data || {}
      const artifactData = this.getArtifactData(stepData, artifactId)
      
      return this.calculateCompletionStatus(artifactData)
    } catch (error) {
      console.error('Failed to get completion status:', error)
      return {
        status: 'pending',
        confidence: 0,
        completedFields: [],
        missingFields: ['all'],
        openQuestions: []
      }
    }
  }

  async getStepProgress(sessionId: string, stepId: string): Promise<{
    completedArtifacts: number
    totalArtifacts: number
    overallConfidence: number
    openQuestions: string[]
  }> {
    try {
      const { data: session, error } = await this.supabaseClient
        .from('assessment_sessions')
        .select('step_data')
        .eq('id', sessionId)
        .single()

      if (error) {
        throw new Error(`Failed to get session: ${error.message}`)
      }

      const stepData = session.step_data?.[stepId] as StepData
      if (!stepData) {
        const totalArtifacts = await this.getStepTotalArtifacts(stepId)
        return {
          completedArtifacts: 0,
          totalArtifacts,
          overallConfidence: 0,
          openQuestions: []
        }
      }

      const artifacts = Object.values(stepData.artifacts)
      const completedArtifacts = artifacts.filter(a => a.completion_status === 'completed').length
      
      return {
        completedArtifacts,
        totalArtifacts: artifacts.length,
        overallConfidence: stepData.step_confidence_score,
        openQuestions: stepData.open_questions
      }
    } catch (error) {
      console.error('Failed to get step progress:', error)
      return {
        completedArtifacts: 0,
        totalArtifacts: 4, // Default fallback
        overallConfidence: 0,
        openQuestions: []
      }
    }
  }

  private ensureStepDataStructure(currentStepData: any, artifactId: string): any {
    const stepData = currentStepData || {}
    const stepKey = this.getStepKey(artifactId)
    
    // Initialize step structure if needed
    if (!stepData[stepKey]) {
      stepData[stepKey] = {
        artifacts: {},
        step_completion_status: 'pending',
        open_questions: [],
        step_confidence_score: 0
      }
    }

    // Initialize artifact if needed
    const stepInfo = stepData[stepKey]
    if (!stepInfo.artifacts[this.getArtifactKey(artifactId)]) {
      stepInfo.artifacts[this.getArtifactKey(artifactId)] = {
        research_input: null,
        user_confirmations: null,
        user_corrections: null,
        user_additions: null,
        completion_status: 'pending'
      }
    }

    return stepData
  }

  private updateArtifactData(stepData: any, artifactId: string, userResponse: UserResponse): void {
    const stepKey = this.getStepKey(artifactId)
    const artifactKey = this.getArtifactKey(artifactId)
    const artifact = stepData[stepKey].artifacts[artifactKey]

    switch (userResponse.type) {
      case 'confirmation':
        artifact.user_confirmations = artifact.user_confirmations || []
        artifact.user_confirmations.push({
          content: userResponse.content,
          timestamp: userResponse.timestamp
        })
        break

      case 'correction':
        artifact.user_corrections = artifact.user_corrections || []
        artifact.user_corrections.push({
          content: userResponse.content,
          timestamp: userResponse.timestamp
        })
        break

      case 'addition':
        artifact.user_additions = artifact.user_additions || []
        artifact.user_additions.push({
          content: userResponse.content,
          timestamp: userResponse.timestamp
        })
        break

      case 'discussion':
        // Track as general discussion - doesn't directly update artifact data
        // but marks artifact as in_progress
        if (artifact.completion_status === 'pending') {
          artifact.completion_status = 'in_progress'
        }
        break
    }
  }

  private updateCompletionMetrics(stepData: any, artifactId: string): void {
    const stepKey = this.getStepKey(artifactId)
    const artifactKey = this.getArtifactKey(artifactId)
    const artifact = stepData[stepKey].artifacts[artifactKey]
    
    // Calculate artifact completion
    const completionStatus = this.calculateCompletionStatus(artifact)
    artifact.completion_status = completionStatus.status

    // Update step-level metrics
    const stepInfo = stepData[stepKey]
    const allArtifacts = Object.values(stepInfo.artifacts) as ArtifactData[]
    
    const completedCount = allArtifacts.filter(a => a.completion_status === 'completed').length
    const inProgressCount = allArtifacts.filter(a => a.completion_status === 'in_progress').length
    
    // Calculate step confidence score
    stepInfo.step_confidence_score = Math.round(
      ((completedCount * 100) + (inProgressCount * 50)) / allArtifacts.length
    )

    // Update step completion status
    if (completedCount === allArtifacts.length) {
      stepInfo.step_completion_status = 'completed'
    } else if (completedCount > 0 || inProgressCount > 0) {
      stepInfo.step_completion_status = 'in_progress'
    }
  }

  private calculateCompletionStatus(artifactData: ArtifactData): CompletionStatus {
    const completedFields: string[] = []
    const missingFields: string[] = []

    // Check for user input
    if (artifactData.user_confirmations && artifactData.user_confirmations.length > 0) {
      completedFields.push('confirmations')
    } else {
      missingFields.push('confirmations')
    }

    // Determine overall status
    let status: 'pending' | 'in_progress' | 'completed' = 'pending'
    let confidence = 0

    if (completedFields.length > 0) {
      status = 'in_progress'
      confidence = 40
    }

    // Consider completed if user has provided substantial input
    const hasSubstantialInput = (
      (artifactData.user_confirmations?.length || 0) +
      (artifactData.user_corrections?.length || 0) +
      (artifactData.user_additions?.length || 0)
    ) >= 2

    if (hasSubstantialInput) {
      status = 'completed'
      confidence = 85
    }

    return {
      status,
      confidence,
      completedFields,
      missingFields,
      openQuestions: [] // Will be populated based on gaps
    }
  }

  private getArtifactData(stepData: any, artifactId: string): ArtifactData {
    const stepKey = this.getStepKey(artifactId)
    const artifactKey = this.getArtifactKey(artifactId)
    return stepData[stepKey]?.artifacts?.[artifactKey] || {
      research_input: null,
      user_confirmations: null,
      user_corrections: null,
      user_additions: null,
      completion_status: 'pending'
    }
  }

  private getStepKey(artifactId: string): string {
    // Map artifact IDs to step keys
    if (['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4'].includes(artifactId)) {
      return 'step_1_core_identity'
    } else if (['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8'].includes(artifactId)) {
      return 'step_2_customer_market'
    }
    
    return 'step_1_core_identity' // Default fallback
  }

  private getArtifactKey(artifactId: string): string {
    // Map artifact IDs to step_data keys
    const keyMap: Record<string, string> = {
      // Step 1 artifacts
      'artifact_1': 'artifact_1_company_mission_vision',
      'artifact_2': 'artifact_2_core_offering_definition', 
      'artifact_3': 'artifact_3_regulatory_pathway',
      'artifact_4': 'artifact_4_revenue_streams_pricing',
      // Step 2 artifacts
      'artifact_5': 'artifact_5_market_sizing',
      'artifact_6': 'artifact_6_clinical_evidence',
      'artifact_7': 'artifact_7_ideal_customer_profile',
      'artifact_8': 'artifact_8_customer_pains_gains'
    }
    
    return keyMap[artifactId] || artifactId
  }

  async getStepTotalArtifacts(stepId: string): Promise<number> {
    // Return the total number of artifacts for each step
    switch (stepId) {
      case 'step_1_core_identity':
        return 4
      case 'step_2_customer_market':
        return 4
      default:
        return 4
    }
  }
}