import { supabase } from '@/lib/supabase'

export interface SessionState {
  currentStep: string
  currentArtifact: string
  conversationHistory: any[]
  progress: any
  lastUpdated: Date
}

export interface SessionRecoveryData {
  sessionId: string
  state: SessionState
  isRecoverable: boolean
  errorDetails?: string
}

export class SessionManager {
  
  static async saveSessionState(
    sessionId: string, 
    state: SessionState,
    stepData?: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updates: any = {
        current_step: state.currentStep,
        current_artifact: state.currentArtifact,
        updated_at: new Date().toISOString()
      }

      // Include step_data if provided
      if (stepData) {
        updates.step_data = stepData
      }

      const { error } = await supabase
        .from('assessment_sessions')
        .update(updates)
        .eq('id', sessionId)

      if (error) {
        console.error('Session state save error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Session manager error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  static async loadSessionState(sessionId: string): Promise<SessionRecoveryData> {
    try {
      const { data: session, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error) {
        return {
          sessionId,
          state: this.getDefaultState(),
          isRecoverable: false,
          errorDetails: error.message
        }
      }

      if (!session) {
        return {
          sessionId,
          state: this.getDefaultState(),
          isRecoverable: false,
          errorDetails: 'Session not found'
        }
      }

      // Reconstruct session state
      const state: SessionState = {
        currentStep: session.current_step || 'identity',
        currentArtifact: session.current_artifact || 'artifact_1',
        conversationHistory: this.reconstructConversationHistory(session),
        progress: this.calculateProgressFromStepData(session.step_data),
        lastUpdated: new Date(session.updated_at)
      }

      return {
        sessionId,
        state,
        isRecoverable: true
      }
    } catch (error) {
      console.error('Session recovery error:', error)
      return {
        sessionId,
        state: this.getDefaultState(),
        isRecoverable: false,
        errorDetails: error instanceof Error ? error.message : 'Recovery failed'
      }
    }
  }

  static async handleInterruptedSession(sessionId: string): Promise<{
    canResume: boolean
    lastCheckpoint: string
    missingData: string[]
  }> {
    try {
      const recoveryData = await this.loadSessionState(sessionId)
      
      if (!recoveryData.isRecoverable) {
        return {
          canResume: false,
          lastCheckpoint: 'session_start',
          missingData: ['Complete session state']
        }
      }

      const missingData: string[] = []
      const state = recoveryData.state

      // Check for missing critical data
      if (!state.currentStep) missingData.push('Current step')
      if (!state.currentArtifact) missingData.push('Current artifact')
      if (state.conversationHistory.length === 0) missingData.push('Conversation history')

      // Check session age (sessions older than 24 hours may not be resumable)
      const sessionAge = Date.now() - state.lastUpdated.getTime()
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (sessionAge > maxAge) {
        missingData.push('Session expired (> 24 hours)')
      }

      return {
        canResume: missingData.length === 0,
        lastCheckpoint: `${state.currentStep}:${state.currentArtifact}`,
        missingData
      }
    } catch (error) {
      return {
        canResume: false,
        lastCheckpoint: 'unknown',
        missingData: ['Session recovery failed']
      }
    }
  }

  static async createCheckpoint(
    sessionId: string,
    checkpointType: 'artifact_complete' | 'step_complete' | 'manual_save',
    metadata?: any
  ): Promise<{ success: boolean; checkpointId?: string; error?: string }> {
    try {
      // Save checkpoint data
      const checkpointData = {
        session_id: sessionId,
        checkpoint_type: checkpointType,
        created_at: new Date().toISOString(),
        metadata: metadata || {}
      }

      // For now, we'll store checkpoints in the session's step_data
      // In a full implementation, you might want a separate checkpoints table
      const currentSession = await this.loadSessionState(sessionId)
      
      if (!currentSession.isRecoverable) {
        return { success: false, error: 'Cannot create checkpoint for unrecoverable session' }
      }

      // Add checkpoint to session metadata
      const { error } = await supabase
        .from('assessment_sessions')
        .update({
          updated_at: new Date().toISOString(),
          // Add checkpoint info to session metadata if needed
        })
        .eq('id', sessionId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        checkpointId: `${sessionId}_${checkpointType}_${Date.now()}` 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Checkpoint creation failed' 
      }
    }
  }

  static async validateSessionIntegrity(sessionId: string): Promise<{
    isValid: boolean
    issues: string[]
    recommendations: string[]
  }> {
    try {
      const recoveryData = await this.loadSessionState(sessionId)
      const issues: string[] = []
      const recommendations: string[] = []

      if (!recoveryData.isRecoverable) {
        issues.push('Session is not recoverable')
        recommendations.push('Start a new session')
        return { isValid: false, issues, recommendations }
      }

      const state = recoveryData.state

      // Check for data consistency issues
      if (!state.currentStep || !state.currentArtifact) {
        issues.push('Missing current step or artifact information')
        recommendations.push('Reset to last known good state')
      }

      // Check conversation history integrity
      if (state.conversationHistory.length === 0) {
        issues.push('No conversation history found')
        recommendations.push('Consider starting a fresh interview session')
      }

      // Check for orphaned data
      const validSteps = ['identity', 'market', 'competitive', 'gtm', 'partnerships', 'messaging', 'operations', 'measurement', 'risk']
      if (!validSteps.includes(state.currentStep)) {
        issues.push(`Invalid current step: ${state.currentStep}`)
        recommendations.push('Reset to identity step')
      }

      // Check artifact progression logic
      const stepToArtifacts: Record<string, string[]> = {
        identity: ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4'],
        market: ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8']
        // Add other steps as needed
      }

      const expectedArtifacts = stepToArtifacts[state.currentStep] || []
      if (expectedArtifacts.length > 0 && !expectedArtifacts.includes(state.currentArtifact)) {
        issues.push(`Artifact ${state.currentArtifact} does not belong to step ${state.currentStep}`)
        recommendations.push(`Reset to first artifact of ${state.currentStep} step`)
      }

      return {
        isValid: issues.length === 0,
        issues,
        recommendations
      }
    } catch (error) {
      return {
        isValid: false,
        issues: ['Session validation failed'],
        recommendations: ['Start a new session']
      }
    }
  }

  private static getDefaultState(): SessionState {
    return {
      currentStep: 'identity',
      currentArtifact: 'artifact_1', 
      conversationHistory: [],
      progress: { completedArtifacts: 0, totalArtifacts: 23, confidence: 0 },
      lastUpdated: new Date()
    }
  }

  private static reconstructConversationHistory(session: any): any[] {
    // Try to reconstruct conversation from step_data or other session fields
    // This is a simplified implementation
    return []
  }

  private static calculateProgressFromStepData(stepData: any): any {
    if (!stepData) {
      return { completedArtifacts: 0, totalArtifacts: 23, confidence: 0 }
    }

    let completedCount = 0
    let totalConfidence = 0
    let artifactCount = 0

    // Analyze step_data structure
    Object.values(stepData).forEach((stepInfo: any) => {
      if (stepInfo.artifacts) {
        Object.values(stepInfo.artifacts).forEach((artifact: any) => {
          artifactCount++
          if (artifact.completion_status === 'completed') {
            completedCount++
            totalConfidence += 100
          } else if (artifact.completion_status === 'in_progress') {
            totalConfidence += 50
          }
        })
      }
    })

    const avgConfidence = artifactCount > 0 ? Math.round(totalConfidence / artifactCount) : 0

    return {
      completedArtifacts: completedCount,
      totalArtifacts: 23,
      confidence: avgConfidence
    }
  }
}