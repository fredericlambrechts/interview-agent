"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target,
  ChevronDown,
  ArrowLeft,
  Pause,
  Play,
  Save
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"

interface ResearchData {
  companyUrl: string
  analysisContent?: string
  completedAt?: string
  artifactsCompleted: number
  totalArtifacts: number
}

interface UserInfo {
  name: string
  role: string
  linkedinUrl?: string
}

interface InterviewConductProps {
  sessionId: string
}

export default function InterviewConduct({ sessionId }: InterviewConductProps) {
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const [currentArtifact, setCurrentArtifact] = useState<string>('artifact_1')
  const [interviewProgress, setInterviewProgress] = useState<any>(null)
  const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [sessionStatus, setSessionStatus] = useState<'active' | 'paused' | 'saving'>('active')
  const router = useRouter()

  // Assessment structure with traffic light status (will be updated dynamically)
  const [assessmentStructure, setAssessmentStructure] = useState({
    'part1': {
      name: 'Strategic Foundation',
      steps: [
        { id: 'identity', name: 'Core Identity & Business Model', status: 'completed', active: false },
        { id: 'market', name: 'Customer & Market Intelligence', status: 'in-progress', active: true }
      ]
    },
    'part2': {
      name: 'Strategy & Positioning', 
      steps: [
        { id: 'competitive', name: 'Competitive Landscape', status: 'not-started', active: false },
        { id: 'gtm', name: 'Channel & Go-to-Market', status: 'not-started', active: false },
        { id: 'partnerships', name: 'Partnership & Alliance Strategy', status: 'not-started', active: false },
        { id: 'messaging', name: 'Brand & Messaging', status: 'not-started', active: false }
      ]
    },
    'part3': {
      name: 'Execution & Operations',
      steps: [
        { id: 'operations', name: 'GTM Operations & Execution', status: 'not-started', active: false },
        { id: 'measurement', name: 'Performance Measurement & KPIs', status: 'not-started', active: false },
        { id: 'risk', name: 'Risk & Mitigation', status: 'not-started', active: false }
      ]
    }
  })

  useEffect(() => {
    // Load research data and user info
    const loadSessionData = async () => {
      try {
        // First try to restore session state
        await restoreSessionState()

        // Get session data from assessment_sessions table
        const response = await fetch(`/api/interview/session?sessionId=${sessionId}`)
        const data = await response.json()
        
        if (data.success && data.session) {
          const researchInfo = {
            companyUrl: data.session.company_url || 'Unknown Company',
            analysisContent: data.session.research_data?.analysis_content,
            completedAt: data.session.completed_at,
            artifactsCompleted: data.session.artifacts_completed || 23,
            totalArtifacts: data.session.total_artifacts || 23
          }
          setResearchData(researchInfo)

          // Get user info from session storage
          const storedUserInfo = {
            name: sessionStorage.getItem('userName') || 'Unknown User',
            role: sessionStorage.getItem('userRole') || 'Unknown Role',
            linkedinUrl: sessionStorage.getItem('userLinkedinUrl') || undefined
          }
          setUserInfo(storedUserInfo)

          // Configure ElevenLabs agent with SuperSwift persona and research context
          await configureAgent(researchInfo, storedUserInfo)
          
          // Initialize interview orchestration
          await initializeOrchestrator()
        }
      } catch (error) {
        console.error('Failed to load session data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSessionData()
  }, [sessionId])

  // Auto-save every 2 minutes
  useEffect(() => {
    if (!loading && sessionStatus === 'active' && !isPaused) {
      const autoSaveInterval = setInterval(() => {
        handleSaveProgress()
      }, 120000) // 2 minutes

      return () => clearInterval(autoSaveInterval)
    }
  }, [loading, sessionStatus, isPaused])

  const restoreSessionState = async () => {
    try {
      const response = await fetch(`/api/interview/session?sessionId=${sessionId}`)
      const result = await response.json()
      
      if (result.success && result.state) {
        // Restore session state
        if (result.status === 'paused') {
          setIsPaused(true)
          setSessionStatus('paused')
        }
        
        if (result.state.currentArtifact) {
          setCurrentArtifact(result.state.currentArtifact)
        }
        
        if (result.state.progress) {
          setInterviewProgress(result.state.progress)
          updateAssessmentStructure(result.state.progress)
        }

        console.log('Session state restored successfully')
      }
    } catch (error) {
      console.error('Failed to restore session state:', error)
    }
  }

  const configureAgent = async (researchInfo: ResearchData, userInfo: UserInfo) => {
    try {
      const response = await fetch('/api/interview/agent-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          researchData: researchInfo,
          userInfo
        })
      })

      const result = await response.json()
      if (result.success) {
        console.log('ElevenLabs agent configured with SuperSwift persona')
        
        // Log initial system message
        await logConversation('system', 'Interview session initialized with SuperSwift consulting persona')
      } else {
        console.error('Failed to configure agent:', result.error)
      }
    } catch (error) {
      console.error('Agent configuration error:', error)
    }
  }

  const logConversation = async (type: 'user' | 'agent' | 'system', content: string, metadata?: any) => {
    try {
      await fetch('/api/interview/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          type,
          content,
          timestamp: new Date().toISOString(),
          metadata
        })
      })
    } catch (error) {
      console.error('Conversation logging error:', error)
    }
  }

  const handleVoiceMessage = async (event: any) => {
    try {
      // Log user messages and agent responses
      if (event.type === 'user_message') {
        await logConversation('user', event.message, {
          audioLength: event.audioLength,
          confidence: event.confidence,
          artifact: currentArtifact
        })
        
        // Check if user response indicates artifact completion
        await checkArtifactCompletion(event.message)
        
      } else if (event.type === 'agent_message') {
        await logConversation('agent', event.message, {
          responseTime: event.responseTime,
          sentiment: event.sentiment,
          artifact: currentArtifact
        })
        
        // Check if agent is moving to next artifact
        await checkArtifactProgression(event.message)
      }
    } catch (error) {
      console.error('Voice message handling error:', error)
    }
  }

  const checkArtifactCompletion = async (userMessage: string) => {
    // Simple keyword detection for artifact completion
    const completionKeywords = [
      'that&apos;s all', 'complete', 'finished', 'done with that',
      'move on', 'next topic', 'next question', 'covered everything'
    ]
    
    const hasCompletionSignal = completionKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    )
    
    if (hasCompletionSignal) {
      // Calculate confidence based on message length and keywords
      const confidence = calculateResponseConfidence(userMessage)
      await updateArtifactStatus(currentArtifact, 'completed', confidence)
      
      // Update step completion if needed
      await updateStepCompletion()
      
      await fetchNextQuestion()
    }
  }

  const calculateResponseConfidence = (message: string): number => {
    // Simple confidence calculation based on response quality indicators
    let confidence = 0.5 // Base confidence
    
    // Longer responses generally indicate more thoughtful answers
    if (message.length > 100) confidence += 0.1
    if (message.length > 200) confidence += 0.1
    
    // Specific details indicate higher confidence
    const detailIndicators = ['specifically', 'example', 'for instance', 'such as', 'percent', '%', 'dollar', '$']
    const detailCount = detailIndicators.filter(indicator => 
      message.toLowerCase().includes(indicator)
    ).length
    confidence += Math.min(detailCount * 0.1, 0.2)
    
    // Uncertainty indicators reduce confidence
    const uncertaintyIndicators = ['maybe', 'perhaps', 'not sure', 'might be', 'i think']
    const uncertaintyCount = uncertaintyIndicators.filter(indicator => 
      message.toLowerCase().includes(indicator)
    ).length
    confidence -= Math.min(uncertaintyCount * 0.1, 0.2)
    
    return Math.max(0.1, Math.min(1.0, confidence))
  }

  const updateStepCompletion = async () => {
    try {
      const currentStep = getCurrentStepId()
      const conversationHistory = global.conversationData?.get(sessionId) || []
      const stepResponses = conversationHistory
        .filter((msg: any) => msg.metadata?.step === currentStep)
        .map((msg: any) => ({
          type: msg.type,
          content: msg.content,
          timestamp: msg.timestamp,
          artifact: msg.metadata?.artifact
        }))

      await fetch('/api/interview/assessment-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'update_step',
          data: {
            stepId: currentStep,
            status: 'completed',
            responses: stepResponses,
            metadata: {
              completedAt: new Date().toISOString(),
              artifactsInStep: getArtifactsForStep(currentStep)
            }
          }
        })
      })
    } catch (error) {
      console.error('Error updating step completion:', error)
    }
  }

  const getCurrentStepId = () => {
    const artifactToStep: any = {
      'artifact_1': 'identity', 'artifact_2': 'identity', 'artifact_3': 'identity', 'artifact_4': 'identity',
      'artifact_5': 'market', 'artifact_6': 'market', 'artifact_7': 'market', 'artifact_8': 'market',
      'artifact_9': 'competitive', 'artifact_10': 'competitive',
      'artifact_11': 'gtm', 'artifact_12': 'gtm', 'artifact_13': 'gtm',
      'artifact_14': 'partnerships', 'artifact_15': 'partnerships',
      'artifact_16': 'messaging', 'artifact_17': 'messaging',
      'artifact_18': 'operations', 'artifact_19': 'operations', 'artifact_20': 'operations',
      'artifact_21': 'measurement', 'artifact_22': 'measurement',
      'artifact_23': 'risk'
    }
    return artifactToStep[currentArtifact] || 'unknown'
  }

  const getArtifactsForStep = (stepId: string): string[] => {
    const stepToArtifacts: any = {
      'identity': ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4'],
      'market': ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8'],
      'competitive': ['artifact_9', 'artifact_10'],
      'gtm': ['artifact_11', 'artifact_12', 'artifact_13'],
      'partnerships': ['artifact_14', 'artifact_15'],
      'messaging': ['artifact_16', 'artifact_17'],
      'operations': ['artifact_18', 'artifact_19', 'artifact_20'],
      'measurement': ['artifact_21', 'artifact_22'],
      'risk': ['artifact_23']
    }
    return stepToArtifacts[stepId] || []
  }

  const checkArtifactProgression = async (agentMessage: string) => {
    // Look for agent transitioning to new topics/artifacts
    const transitionKeywords = [
      'let&apos;s move on to', 'next i&apos;d like to discuss', 'moving to our next topic',
      'now let&apos;s talk about', 'shifting focus to', 'our next area'
    ]
    
    const hasTransition = transitionKeywords.some(keyword => 
      agentMessage.toLowerCase().includes(keyword)
    )
    
    if (hasTransition) {
      await updateArtifactStatus(currentArtifact, 'completed')
      await fetchNextQuestion()
    }
  }

  const updateArtifactStatus = async (artifactId: string, status: 'completed' | 'in_progress', confidence?: number) => {
    try {
      // Update conversation log
      await fetch('/api/interview/conversation', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          artifact: artifactId,
          status,
          timestamp: new Date().toISOString()
        })
      })

      // Update assessment session with artifact completion
      const conversationHistory = global.conversationData?.get(sessionId) || []
      const artifactResponses = conversationHistory
        .filter((msg: any) => msg.metadata?.artifact === artifactId)
        .map((msg: any) => ({
          type: msg.type,
          content: msg.content,
          timestamp: msg.timestamp,
          metadata: msg.metadata
        }))

      await fetch('/api/interview/assessment-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'update_artifact',
          data: {
            artifactId,
            status,
            confidence: confidence || 0.8, // Default confidence
            responses: artifactResponses,
            metadata: {
              completedAt: new Date().toISOString(),
              currentStep: getCurrentStepName()
            }
          }
        })
      })
    } catch (error) {
      console.error('Error updating artifact status:', error)
    }
  }

  const initializeOrchestrator = async () => {
    try {
      // Get initial orchestrator state
      const response = await fetch('/api/interview/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          currentStep: 'identity',
          currentArtifact: 'artifact_1'
        })
      })

      const data = await response.json()
      if (data.success) {
        setCurrentArtifact(data.currentArtifact)
        setDynamicQuestions(data.questions)
        setInterviewProgress(data.progress)
        
        // Update assessment structure based on progress
        updateAssessmentStructure(data.progress)
        
        console.log('Interview orchestrator initialized with artifact:', data.currentArtifact)
      }
    } catch (error) {
      console.error('Orchestrator initialization error:', error)
    }
  }

  const updateAssessmentStructure = (progress: any) => {
    if (!progress) return

    // Map artifacts to steps
    const artifactToStep: any = {
      'artifact_1': 'identity', 'artifact_2': 'identity', 'artifact_3': 'identity', 'artifact_4': 'identity',
      'artifact_5': 'market', 'artifact_6': 'market', 'artifact_7': 'market', 'artifact_8': 'market',
      'artifact_9': 'competitive', 'artifact_10': 'competitive',
      'artifact_11': 'gtm', 'artifact_12': 'gtm', 'artifact_13': 'gtm',
      'artifact_14': 'partnerships', 'artifact_15': 'partnerships',
      'artifact_16': 'messaging', 'artifact_17': 'messaging',
      'artifact_18': 'operations', 'artifact_19': 'operations', 'artifact_20': 'operations',
      'artifact_21': 'measurement', 'artifact_22': 'measurement',
      'artifact_23': 'risk'
    }

    // Update structure based on completed artifacts
    const updatedStructure = { ...assessmentStructure }
    
    // Reset all statuses
    Object.values(updatedStructure).forEach((part: any) => {
      part.steps.forEach((step: any) => {
        step.status = 'not-started'
        step.active = false
      })
    })

    // Mark completed steps
    progress.completedArtifacts.forEach((artifactId: string) => {
      const stepId = artifactToStep[artifactId]
      if (stepId) {
        Object.values(updatedStructure).forEach((part: any) => {
          const step = part.steps.find((s: any) => s.id === stepId)
          if (step && step.status !== 'completed') {
            step.status = 'completed'
          }
        })
      }
    })

    // Mark in-progress steps
    progress.inProgressArtifacts.forEach((artifactId: string) => {
      const stepId = artifactToStep[artifactId]
      if (stepId) {
        Object.values(updatedStructure).forEach((part: any) => {
          const step = part.steps.find((s: any) => s.id === stepId)
          if (step && step.status === 'not-started') {
            step.status = 'in-progress'
            step.active = true
          }
        })
      }
    })

    // Mark current artifact's step as active
    if (currentArtifact) {
      const stepId = artifactToStep[currentArtifact]
      if (stepId) {
        Object.values(updatedStructure).forEach((part: any) => {
          const step = part.steps.find((s: any) => s.id === stepId)
          if (step) {
            step.active = true
            if (step.status === 'not-started') {
              step.status = 'in-progress'
            }
          }
        })
      }
    }

    setAssessmentStructure(updatedStructure)
  }

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch('/api/interview/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          currentArtifact,
          conversationContext: 'next_question'
        })
      })

      const data = await response.json()
      if (data.success) {
        if (data.nextArtifact === 'completed') {
          // Interview is complete
          await handleInterviewCompletion()
        } else {
          setCurrentArtifact(data.nextArtifact)
          setDynamicQuestions(data.questions)
          setInterviewProgress(data.progress)
          updateAssessmentStructure(data.progress)
        }
      }
    } catch (error) {
      console.error('Error fetching next question:', error)
    }
  }

  const handleInterviewCompletion = async () => {
    try {
      // Complete the assessment session
      const response = await fetch('/api/interview/assessment-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'complete_interview',
          data: {
            metadata: {
              completedAt: new Date().toISOString(),
              finalArtifact: currentArtifact,
              interviewMethod: 'voice_conversation'
            }
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        // Log completion
        await logConversation('system', 'Interview completed successfully', {
          finalStats: result.finalStats,
          conversationSummary: result.conversationSummary
        })

        // Redirect to completion or summary page
        setTimeout(() => {
          router.push(`/interview/${sessionId}/completed`)
        }, 2000)
      }
    } catch (error) {
      console.error('Error completing interview:', error)
    }
  }

  const handleStateChange = async (event: any) => {
    try {
      // Log important state changes
      if (event.type === 'conversation_started') {
        await logConversation('system', 'Voice conversation started', {
          startTime: new Date().toISOString()
        })
      } else if (event.type === 'conversation_ended') {
        await logConversation('system', 'Voice conversation ended', {
          endTime: new Date().toISOString(),
          duration: event.duration
        })
      } else if (event.type === 'step_completed') {
        // Track interview progress
        await fetch('/api/interview/conversation', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId,
            step: event.step,
            artifact: event.artifact,
            status: 'completed',
            confidence: event.confidence
          })
        })
      } else if (event.type === 'error') {
        // Handle voice/network errors gracefully
        await handleVoiceError(event)
      } else if (event.type === 'connection_lost') {
        // Auto-save when connection is lost
        await handleConnectionLost()
      }
    } catch (error) {
      console.error('State change handling error:', error)
    }
  }

  const handleVoiceError = async (errorEvent: any) => {
    console.error('Voice error:', errorEvent)
    
    // Log the error
    await logConversation('system', `Voice error: ${errorEvent.message || 'Unknown error'}`, {
      errorType: errorEvent.errorType,
      errorCode: errorEvent.code,
      timestamp: new Date().toISOString()
    })

    // Auto-save current progress
    await handleSaveProgress()
    
    // Show user-friendly error message
    // Could add a toast notification here in the future
  }

  const handleConnectionLost = async () => {
    console.warn('Connection lost - auto-saving progress')
    
    // Auto-save current state
    await handleSaveProgress()
    
    // Log connection loss
    await logConversation('system', 'Connection lost - progress auto-saved', {
      timestamp: new Date().toISOString(),
      currentArtifact
    })
  }

  // Calculate overall progress
  const allSteps = Object.values(assessmentStructure).flatMap(part => part.steps)
  const completedSteps = allSteps.filter(step => step.status === 'completed').length
  const inProgressSteps = allSteps.filter(step => step.status === 'in-progress').length
  const totalSteps = allSteps.length
  const progressPercentage = Math.round(((completedSteps + inProgressSteps * 0.5) / totalSteps) * 100)

  // Traffic light colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'not-started': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'not-started': return 'Not Started'
      default: return 'Unknown'
    }
  }

  const getCurrentStepName = () => {
    const artifactToStep: any = {
      'artifact_1': 'identity', 'artifact_2': 'identity', 'artifact_3': 'identity', 'artifact_4': 'identity',
      'artifact_5': 'market', 'artifact_6': 'market', 'artifact_7': 'market', 'artifact_8': 'market',
      'artifact_9': 'competitive', 'artifact_10': 'competitive',
      'artifact_11': 'gtm', 'artifact_12': 'gtm', 'artifact_13': 'gtm',
      'artifact_14': 'partnerships', 'artifact_15': 'partnerships',
      'artifact_16': 'messaging', 'artifact_17': 'messaging',
      'artifact_18': 'operations', 'artifact_19': 'operations', 'artifact_20': 'operations',
      'artifact_21': 'measurement', 'artifact_22': 'measurement',
      'artifact_23': 'risk'
    }

    const stepNames: any = {
      'identity': 'Core Identity & Business Model',
      'market': 'Customer & Market Intelligence',
      'competitive': 'Competitive Landscape',
      'gtm': 'Channel & Go-to-Market',
      'partnerships': 'Partnership & Alliance Strategy',
      'messaging': 'Brand & Messaging',
      'operations': 'GTM Operations & Execution',
      'measurement': 'Performance Measurement & KPIs',
      'risk': 'Risk & Mitigation'
    }

    const stepId = artifactToStep[currentArtifact]
    return stepNames[stepId] || 'Unknown Step'
  }

  const getCurrentPartName = () => {
    const artifactNumber = parseInt(currentArtifact?.replace('artifact_', '') || '1')
    
    if (artifactNumber <= 8) return 'Part 1: Strategic Foundation'
    if (artifactNumber <= 17) return 'Part 2: Strategy & Positioning'
    return 'Part 3: Execution & Operations'
  }

  const handlePauseInterview = async () => {
    try {
      setSessionStatus('saving')
      
      // Save current session state
      const sessionState = {
        currentArtifact,
        progress: interviewProgress,
        conversationData: global.conversationData?.get(sessionId) || [],
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'pause',
          state: sessionState
        })
      })

      const result = await response.json()
      if (result.success) {
        setIsPaused(true)
        setSessionStatus('paused')
        
        // Log pause action
        await logConversation('system', 'Interview paused by user', {
          pausedAt: result.pausedAt,
          currentArtifact
        })
      } else {
        console.error('Failed to pause interview:', result.error)
        setSessionStatus('active')
      }
    } catch (error) {
      console.error('Error pausing interview:', error)
      setSessionStatus('active')
    }
  }

  const handleResumeInterview = async () => {
    try {
      setSessionStatus('saving')

      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'resume'
        })
      })

      const result = await response.json()
      if (result.success) {
        setIsPaused(false)
        setSessionStatus('active')
        
        // Restore state if available
        if (result.state) {
          setCurrentArtifact(result.state.currentArtifact || currentArtifact)
          setInterviewProgress(result.state.progress || interviewProgress)
        }

        // Log resume action
        await logConversation('system', 'Interview resumed by user', {
          resumedAt: result.resumedAt,
          currentArtifact
        })
      } else {
        console.error('Failed to resume interview:', result.error)
        setSessionStatus('paused')
      }
    } catch (error) {
      console.error('Error resuming interview:', error)
      setSessionStatus('paused')
    }
  }

  const handleSaveProgress = async () => {
    try {
      setSessionStatus('saving')

      const sessionState = {
        currentArtifact,
        progress: interviewProgress,
        conversationData: global.conversationData?.get(sessionId) || [],
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/interview/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          action: 'save',
          state: sessionState
        })
      })

      const result = await response.json()
      if (result.success) {
        await logConversation('system', 'Progress saved', {
          savedAt: result.savedAt,
          currentArtifact
        })
        
        setTimeout(() => {
          setSessionStatus('active')
        }, 1000)
      } else {
        console.error('Failed to save progress:', result.error)
        setSessionStatus('active')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      setSessionStatus('active')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-superswift-orange"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white font-inter flex flex-col">
      {/* Main Content Area - Split Layout with Left Sidebar */}
      <div className="flex flex-1 min-h-0">
        
        {/* Left Sidebar Navigation */}
        <div className="w-80 bg-superswift-gray border-r border-superswift-gray-border flex flex-col flex-shrink-0">
          {/* Assessment Header */}
          <div className="p-4 border-b border-superswift-gray-border bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-superswift-orange rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-superswift-black">Strategic Assessment</h2>
                <div className="text-xs text-superswift-gray-text">Go-to-Market Strategy Analysis</div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Overall Progress</span>
                <span className="text-sm font-medium text-superswift-orange">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-superswift-gray-border rounded-full h-2">
                <div 
                  className="bg-superswift-orange h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-superswift-gray-text">
                {completedSteps} completed, {inProgressSteps} in progress, {totalSteps - completedSteps - inProgressSteps} remaining
              </div>
            </div>
          </div>

          {/* Navigation Steps */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(assessmentStructure).map(([partId, part]) => (
              <div key={partId} className="border-b border-superswift-gray-border">
                {/* Part Header */}
                <div className="p-3 bg-white border-b border-superswift-gray-border">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 text-superswift-gray-text" />
                    <span className="font-medium text-sm text-superswift-black">{part.name}</span>
                    <div className="ml-auto text-xs text-superswift-gray-text">
                      {part.steps.filter(s => s.status === 'completed').length}/{part.steps.length}
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-superswift-gray">
                  {part.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`p-3 border-b border-superswift-gray-border cursor-pointer hover:bg-white transition-colors ${
                        step.active ? 'bg-white border-l-4 border-l-superswift-orange' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Traffic Light Status */}
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`}></div>
                        
                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${
                            step.active ? 'text-superswift-orange' : 'text-superswift-black'
                          }`}>
                            {index + 1}. {step.name}
                          </div>
                          <div className="text-xs text-superswift-gray-text mt-1">
                            {getStatusText(step.status)}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {step.active && (
                          <div className="h-2 w-2 bg-superswift-orange rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Current Step Info */}
          <div className="p-4 border-t border-superswift-gray-border bg-white">
            <div className="text-center">
              {interviewProgress && (
                <>
                  <div className="text-sm font-medium text-superswift-black">
                    Current: {getCurrentStepName()}
                  </div>
                  <div className="text-xs text-superswift-gray-text mt-1">
                    Artifact {currentArtifact?.replace('artifact_', '')} of 23 • {getCurrentPartName()}
                  </div>
                  <div className="text-xs text-superswift-orange mt-1">
                    {interviewProgress.progressPercentage}% Complete
                  </div>
                </>
              )}
              {!interviewProgress && (
                <div className="text-sm text-superswift-gray-text">
                  Initializing interview...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Center */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header with Back Button */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Link href={`/interview/${sessionId}`}>
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Overview
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-superswift-orange-bg rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-superswift-orange" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-superswift-black">
                        Strategic Assessment Interview
                      </h2>
                      <p className="text-sm text-superswift-gray-text">Voice conversation with AI interviewer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Instructions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Interview Instructions</CardTitle>
                  <CardDescription>
                    You&apos;re about to begin a structured conversation with our AI interviewer about your company&apos;s go-to-market strategy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">What to expect:</h4>
                      <ul className="space-y-1 text-superswift-gray-text">
                        <li>• Natural voice conversation</li>
                        <li>• Questions based on your research data</li>
                        <li>• 30-45 minute structured discussion</li>
                        <li>• Progress tracking throughout</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tips for best results:</h4>
                      <ul className="space-y-1 text-superswift-gray-text">
                        <li>• Speak clearly and naturally</li>
                        <li>• Provide specific examples when possible</li>
                        <li>• Take your time to think through answers</li>
                        <li>• Ask for clarification if needed</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Voice Interface Sidebar - Right Side */}
        <div className="w-80 bg-superswift-gray border-l border-superswift-gray-border flex flex-col flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-superswift-gray-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  sessionStatus === 'paused' ? 'bg-yellow-500' : 
                  sessionStatus === 'saving' ? 'bg-blue-500 animate-pulse' :
                  'bg-superswift-orange animate-pulse'
                }`} />
                <span className="text-sm font-medium text-superswift-black">
                  {sessionStatus === 'paused' ? 'Interview Paused' :
                   sessionStatus === 'saving' ? 'Saving...' :
                   'Voice Interview'}
                </span>
              </div>
              <Link href={`/interview/${sessionId}`}>
                <Button size="sm" variant="outline">
                  End Interview
                </Button>
              </Link>
            </div>
            
            {/* Session Controls */}
            <div className="flex items-center gap-2">
              {!isPaused ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePauseInterview}
                    disabled={sessionStatus === 'saving'}
                    className="flex items-center gap-1"
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveProgress}
                    disabled={sessionStatus === 'saving'}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    {sessionStatus === 'saving' ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={handleResumeInterview}
                  disabled={sessionStatus === 'saving'}
                  className="flex items-center gap-1 bg-superswift-orange hover:bg-superswift-orange-light text-white"
                >
                  <Play className="h-3 w-3" />
                  Resume
                </Button>
              )}
            </div>
            
            {isPaused && (
              <div className="mt-2 text-xs text-superswift-gray-text bg-yellow-50 p-2 rounded">
                Interview is paused. Click Resume to continue your conversation.
              </div>
            )}
          </div>

          {/* Voice Interface Container */}
          <div className="flex-1 relative">
            {!isPaused ? (
              <elevenlabs-convai 
                agent-id="agent_3701k5bdgncmevhspegh2ja47ftc"
                onMessage={(event: any) => handleVoiceMessage(event)}
                onStateChange={(event: any) => handleStateChange(event)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center p-6">
                  <Pause className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Interview Paused</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Your conversation has been paused and your progress has been saved.
                  </p>
                  <Button
                    onClick={handleResumeInterview}
                    disabled={sessionStatus === 'saving'}
                    className="bg-superswift-orange hover:bg-superswift-orange-light text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume Interview
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ElevenLabs ConvAI Script */}
      <Script 
        src="https://unpkg.com/@elevenlabs/convai-widget-embed" 
        strategy="afterInteractive"
        onLoad={() => setWidgetLoaded(true)}
      />

      {/* Custom Styles for Integrated Widget */}
      <style jsx global>{`
        /* ElevenLabs Widget Integration for Sidebar */
        elevenlabs-convai {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Hide widget header in sidebar mode */
        elevenlabs-convai .chat-header {
          display: none !important;
        }

        /* Ensure full space usage */
        elevenlabs-convai .chat-messages {
          flex: 1;
          height: auto;
        }

        /* Remove any floating positioning */
        elevenlabs-convai > div {
          position: static !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .w-80 {
            width: 300px;
          }
        }

        @media (max-width: 768px) {
          .w-80 {
            width: 280px;
          }
        }
      `}</style>
    </div>
  )
}