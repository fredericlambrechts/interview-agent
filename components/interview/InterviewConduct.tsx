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
// Removed broken InterviewVoiceInterface - using ElevenLabs ConvAI widget instead

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
  const [browserSupported, setBrowserSupported] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [connectionTimeout, setConnectionTimeout] = useState(false)
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
    // Check browser compatibility
    const checkBrowserSupport = () => {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      const isSecureContext = window.isSecureContext || location.protocol === 'https:'
      
      if (isChrome && !isSecureContext) {
        setBrowserSupported(false)
        setConnectionError('Chrome requires HTTPS for microphone access.')
        return false
      }
      
      // Check for WebRTC support
      if (!window.RTCPeerConnection && !window.webkitRTCPeerConnection) {
        setBrowserSupported(false)
        setConnectionError('Your browser does not support WebRTC.')
        return false
      }
      
      return true
    }
    
    if (!checkBrowserSupport()) {
      setLoading(false)
      return
    }

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

  // Chrome-specific timeout for ElevenLabs widget issues
  useEffect(() => {
    if (widgetLoaded && browserSupported) {
      // Check if we're in Chrome
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      
      if (isChrome) {
        console.log('Chrome detected - setting up connection fallback timeout...')
        
        // For Chrome, show fallback after reasonable timeout since it commonly fails
        const timeout = setTimeout(() => {
          console.warn('Chrome ElevenLabs connection timeout')
          setConnectionTimeout(true)
          setConnectionError('Connection timeout detected.')
        }, 8000) // 8 second timeout for Chrome

        return () => clearTimeout(timeout)
      }
    }
  }, [widgetLoaded, browserSupported])

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
          userInfo,
          currentContext: {
            artifact: currentArtifact,
            artifactName: getCurrentArtifactName(),
            step: getStepFromArtifact(currentArtifact),
            stepName: getCurrentStepName(),
            description: getCurrentStepDescription()
          }
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

  const getCurrentArtifactName = () => {
    const artifactMap: Record<string, string> = {
      'artifact_1': 'Company Mission & Vision',
      'artifact_2': 'Core Offering Definition', 
      'artifact_3': 'Regulatory Pathway & Classification',
      'artifact_4': 'Revenue Streams & Pricing Model',
      'artifact_5': 'Market Sizing (TAM, SAM, SOM)',
      'artifact_6': 'Clinical Evidence & KOL Strategy',
      'artifact_7': 'Ideal Customer Profile',
      'artifact_8': 'Customer Pains & Gains',
    }
    return artifactMap[currentArtifact] || 'Strategic Assessment'
  }

  const getStepFromArtifact = (artifact: string) => {
    if (['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4'].includes(artifact)) {
      return 'step_1_core_identity'
    } else if (['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8'].includes(artifact)) {
      return 'step_2_customer_market'
    }
    return 'step_1_core_identity'
  }

  const getCurrentStepDescription = () => {
    const step = getStepFromArtifact(currentArtifact)
    if (step === 'step_1_core_identity') {
      return "Let's discuss your company's core identity and business model."
    } else if (step === 'step_2_customer_market') {
      return "Let's explore your market opportunity and customer intelligence."
    }
    return "Let's begin your strategic assessment."
  }

  const getFirstArtifactQuestion = () => {
    const artifactQuestions: Record<string, string> = {
      'artifact_1': "Can you tell me about what drives your organization and the patient outcomes you're targeting?",
      'artifact_2': "What specific problem does your core solution solve for healthcare providers?",
      'artifact_3': "What regulatory pathway are you pursuing with the FDA, and where are you in the process?",
      'artifact_4': "How do you monetize your solution, and what's your pricing strategy?",
      'artifact_5': "How do you size the TAM, SAM, and SOM for your solution?",
      'artifact_6': "What clinical studies have you conducted, and who are your key opinion leaders?",
      'artifact_7': "Who is your ideal customer, and who are the key decision makers you need to influence?",
      'artifact_8': "What are the key pains you address and gains you deliver for customers?"
    }
    
    return artifactQuestions[currentArtifact] || "Let's discuss the strategic assessment for this area."
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

  const handleStepClick = (stepId: string) => {
    // Update current artifact based on step
    const stepToFirstArtifact: Record<string, string> = {
      'identity': 'artifact_1',
      'market': 'artifact_5',
      'competitive': 'artifact_9',
      'gtm': 'artifact_11',
      'partnerships': 'artifact_14',
      'messaging': 'artifact_16',
      'operations': 'artifact_18',
      'measurement': 'artifact_21',
      'risk': 'artifact_23'
    }
    
    const newArtifact = stepToFirstArtifact[stepId]
    if (newArtifact) {
      setCurrentArtifact(newArtifact)
      
      // Update assessment structure to reflect new active step
      setAssessmentStructure(prev => {
        const updated = JSON.parse(JSON.stringify(prev))
        
        // Set all steps to inactive
        Object.values(updated).forEach((part: any) => {
          part.steps.forEach((step: any) => {
            step.active = false
          })
        })
        
        // Set the clicked step as active
        Object.values(updated).forEach((part: any) => {
          const step = part.steps.find((s: any) => s.id === stepId)
          if (step) {
            step.active = true
          }
        })
        
        return updated
      })
    }
  }

  const parseResearchData = () => {
    if (!researchData?.analysisContent) return null
    
    try {
      const parsed = JSON.parse(researchData.analysisContent)
      // The structure is directly at the top level, not under GTM_Analysis
      return parsed || null
    } catch (error) {
      console.error('Error parsing research data:', error)
      return null
    }
  }

  const renderArrayOrString = (data: any, colorClass: string = 'yellow') => {
    if (!data) return null
    
    if (Array.isArray(data)) {
      return data.map((item: string, index: number) => (
        <li key={index} className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 bg-${colorClass}-600 rounded-full`}></span>
          {String(item)}
        </li>
      ))
    } else if (typeof data === 'object' && data !== null) {
      // Handle objects by converting them to key-value pairs or string representation
      if (Object.keys(data).length === 0) return null
      
      return Object.entries(data).map(([key, value], index) => (
        <li key={index} className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 bg-${colorClass}-600 rounded-full`}></span>
          <span><strong>{key}:</strong> {String(value)}</span>
        </li>
      ))
    } else {
      return (
        <li className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 bg-${colorClass}-600 rounded-full`}></span>
          {String(data)}
        </li>
      )
    }
  }

  const safeMap = (data: any, renderFunction: (item: any, index: number) => any) => {
    if (!data) return null
    if (!Array.isArray(data)) return null
    return data.map(renderFunction)
  }

  const renderCurrentStepContent = () => {
    const currentStep = getCurrentStepId()
    const researchAnalysis = parseResearchData()
    
    // Default content if no research data
    if (!researchAnalysis) {
      return (
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
      )
    }

    // Render content based on current step
    switch (currentStep) {
      case 'identity':
        return renderIdentityStepContent(researchAnalysis)
      case 'market':
        return renderMarketStepContent(researchAnalysis)
      case 'competitive':
        return renderCompetitiveStepContent(researchAnalysis)
      case 'gtm':
        return renderGTMStepContent(researchAnalysis)
      case 'partnerships':
        return renderPartnershipsStepContent(researchAnalysis)
      case 'messaging':
        return renderMessagingStepContent(researchAnalysis)
      case 'operations':
        return renderOperationsStepContent(researchAnalysis)
      case 'measurement':
        return renderMeasurementStepContent(researchAnalysis)
      case 'risk':
        return renderRiskStepContent(researchAnalysis)
      default:
        return renderIdentityStepContent(researchAnalysis)
    }
  }

  const renderIdentityStepContent = (analysis: any) => {
    const identityData = analysis?.PART_1_STRATEGIC_FOUNDATION?.Step1_Core_Identity
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Core Identity & Business Model</CardTitle>
            <CardDescription>Research findings about your company's mission, offering, and regulatory status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {identityData?.Artifact1_Mission_Vision && (
              <div>
                <h4 className="font-medium mb-3">Mission & Vision</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Mission</h5>
                    <p className="text-sm text-blue-800">{identityData.Artifact1_Mission_Vision.mission}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-900 mb-2">Vision</h5>
                    <p className="text-sm text-purple-800">{identityData.Artifact1_Mission_Vision.vision}</p>
                  </div>
                </div>
              </div>
            )}
            
            {identityData?.Artifact2_Core_Offering && (
              <div>
                <h4 className="font-medium mb-3">Core Offering</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">{identityData.Artifact2_Core_Offering.product || identityData.Artifact2_Core_Offering.primary_product}</h5>
                  <div className="text-sm text-green-800">
                    <h6 className="font-medium mb-2">Key Features:</h6>
                    <ul className="space-y-1">
                      {renderArrayOrString(identityData.Artifact2_Core_Offering.key_features || identityData.Artifact2_Core_Offering.key_solutions, 'green')}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {identityData?.Artifact3_Regulatory_Pathway && (
              <div>
                <h4 className="font-medium mb-3">Regulatory Status</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-medium text-yellow-900 mb-2">Classifications:</h6>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {renderArrayOrString(identityData.Artifact3_Regulatory_Pathway.classification || identityData.Artifact3_Regulatory_Pathway.classifications || identityData.Artifact3_Regulatory_Pathway.certifications, 'yellow')}
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium text-yellow-900 mb-2">Primary Markets:</h6>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {renderArrayOrString(identityData.Artifact3_Regulatory_Pathway.primary_markets || identityData.Artifact3_Regulatory_Pathway.compliance || identityData.Artifact3_Regulatory_Pathway.key_requirements, 'yellow')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {identityData?.Artifact4_Revenue_Model && (
              <div>
                <h4 className="font-medium mb-3">Revenue Model</h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h6 className="font-medium text-orange-900 mb-2">Primary Stream</h6>
                      <p className="text-orange-800">{identityData.Artifact4_Revenue_Model.primary_model || identityData.Artifact4_Revenue_Model.primary_models?.[0]}</p>
                    </div>
                    <div>
                      <h6 className="font-medium text-orange-900 mb-2">Pricing Structure</h6>
                      <p className="text-orange-800">{identityData.Artifact4_Revenue_Model.pricing_structure || 'Per-site license with volume-based tiers'}</p>
                    </div>
                    <div>
                      <h6 className="font-medium text-orange-900 mb-2">Additional Revenue</h6>
                      <p className="text-orange-800">{identityData.Artifact4_Revenue_Model.additional_streams?.[0] || 'Implementation and training services'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderMarketStepContent = (analysis: any) => {
    const marketData = analysis?.PART_1_STRATEGIC_FOUNDATION?.Step2_Market_Intelligence
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer & Market Intelligence</CardTitle>
            <CardDescription>Market sizing, customer profiles, and value proposition insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {marketData?.Artifact5_Market_Sizing && (
              <div>
                <h4 className="font-medium mb-3">Market Sizing</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h5 className="font-medium text-blue-900 mb-1">TAM</h5>
                    <p className="text-2xl font-bold text-blue-700">{marketData.Artifact5_Market_Sizing.TAM}</p>
                    <p className="text-xs text-blue-600">Total Addressable Market</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h5 className="font-medium text-green-900 mb-1">SAM</h5>
                    <p className="text-2xl font-bold text-green-700">{marketData.Artifact5_Market_Sizing.SAM}</p>
                    <p className="text-xs text-green-600">Serviceable Addressable Market</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h5 className="font-medium text-purple-900 mb-1">SOM</h5>
                    <p className="text-2xl font-bold text-purple-700">{marketData.Artifact5_Market_Sizing.SOM}</p>
                    <p className="text-xs text-purple-600">Serviceable Obtainable Market</p>
                  </div>
                </div>
              </div>
            )}
            
            {marketData?.Artifact6_Clinical_Evidence && (
              <div>
                <h4 className="font-medium mb-3">Clinical Evidence & KOL Strategy</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h6 className="font-medium text-indigo-900 mb-2">Clinical Studies</h6>
                    <ul className="text-sm text-indigo-800 space-y-1">
                      {renderArrayOrString(marketData.Artifact6_Clinical_Evidence.Studies, 'indigo')}
                    </ul>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h6 className="font-medium text-teal-900 mb-2">KOL Strategy</h6>
                    <p className="text-sm text-teal-800 mb-2">{marketData.Artifact6_Clinical_Evidence.KOL_Strategy?.Primary_KOLs}</p>
                    <h7 className="font-medium text-teal-900 text-xs">Focus Areas:</h7>
                    <ul className="text-sm text-teal-800 space-y-1 mt-1">
                      {renderArrayOrString(marketData.Artifact6_Clinical_Evidence.KOL_Strategy?.Focus_Areas, 'teal')}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {marketData?.Artifact7_ICP && (
              <div>
                <h4 className="font-medium mb-3">Ideal Customer Profile</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h6 className="font-medium text-yellow-900 mb-2">Primary Customers</h6>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {renderArrayOrString(marketData.Artifact7_ICP.Primary_Customers, 'yellow')}
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h6 className="font-medium text-red-900 mb-2">Key Decision Makers</h6>
                    <ul className="text-sm text-red-800 space-y-1">
                      {renderArrayOrString(marketData.Artifact7_ICP.Key_Decision_Makers, 'red')}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {marketData?.Artifact8_Value_Proposition && (
              <div>
                <h4 className="font-medium mb-3">Value Proposition</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h6 className="font-medium text-red-900 mb-2">Pains Addressed</h6>
                    <ul className="text-sm text-red-800 space-y-1">
                      {renderArrayOrString(marketData.Artifact8_Value_Proposition.Pains_Addressed, 'red')}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h6 className="font-medium text-green-900 mb-2">Gains Delivered</h6>
                    <ul className="text-sm text-green-800 space-y-1">
                      {renderArrayOrString(marketData.Artifact8_Value_Proposition.Gains_Delivered, 'green')}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderCompetitiveStepContent = (analysis: any) => {
    const competitiveData = analysis?.PART_2_STRATEGY_POSITIONING?.Step3_Competitive_Landscape
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competitive Landscape</CardTitle>
          <CardDescription>Direct and indirect competitors, and key differentiators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {competitiveData?.Artifact9_Competitors && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-medium text-red-900 mb-2">Direct Competitors</h5>
                <ul className="text-sm text-red-800 space-y-1">
                  {renderArrayOrString(competitiveData.Artifact9_Competitors.Direct, 'red')}
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-medium text-orange-900 mb-2">Indirect Competitors</h5>
                <ul className="text-sm text-orange-800 space-y-1">
                  {renderArrayOrString(competitiveData.Artifact9_Competitors.Indirect, 'orange')}
                </ul>
              </div>
            </div>
          )}
          
          {competitiveData?.Artifact10_Differentiation && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Key Differentiators</h5>
              <ul className="text-sm text-green-800 space-y-1">
                {renderArrayOrString(competitiveData.Artifact10_Differentiation.Key_Differentiators, 'green')}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderGTMStepContent = (analysis: any) => {
    const gtmData = analysis?.PART_2_STRATEGY_POSITIONING?.Step4_Channel_Approach
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Channel & Go-to-Market</CardTitle>
          <CardDescription>Sales channels, process, and team structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {gtmData?.Artifact11_Channel_Strategy && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Channel Strategy</h5>
              <p className="text-sm text-blue-800 mb-2">Mix: {gtmData.Artifact11_Channel_Strategy.Mix}</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {renderArrayOrString(gtmData.Artifact11_Channel_Strategy.Primary_Channels, 'blue')}
              </ul>
            </div>
          )}
          
          {gtmData?.Artifact12_Sales_Process && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-2">Sales Process Stages</h5>
              <ul className="text-sm text-purple-800 space-y-1">
                {renderArrayOrString(gtmData.Artifact12_Sales_Process.Stages, 'purple')}
              </ul>
            </div>
          )}
          
          {gtmData?.Artifact13_GTM_Team && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">GTM Team Structure</h5>
              <ul className="text-sm text-green-800 space-y-1">
                {renderArrayOrString(gtmData.Artifact13_GTM_Team.Core_Roles, 'green')}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderPartnershipsStepContent = (analysis: any) => {
    const partnershipData = analysis?.PART_2_STRATEGY_POSITIONING?.Step5_Partnership_Strategy
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Partnership & Alliance Strategy</CardTitle>
          <CardDescription>Strategic partnerships and partner enablement models</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {partnershipData?.Artifact14_Partnership_Framework && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Partnership Types</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                {renderArrayOrString(partnershipData.Artifact14_Partnership_Framework.Types, 'blue')}
              </ul>
            </div>
          )}
          
          {partnershipData?.Artifact15_Partner_Model && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Partner Incentives</h5>
              <ul className="text-sm text-green-800 space-y-1">
                {renderArrayOrString(partnershipData.Artifact15_Partner_Model.Incentives, 'green')}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderMessagingStepContent = (analysis: any) => {
    const messagingData = analysis?.PART_2_STRATEGY_POSITIONING?.Step6_Brand_Messaging
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brand & Messaging</CardTitle>
          <CardDescription>Brand positioning and core messaging pillars</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {messagingData?.Artifact16_Brand_Position && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-2">Brand Positioning Statement</h5>
              <p className="text-sm text-purple-800">{messagingData.Artifact16_Brand_Position}</p>
            </div>
          )}
          
          {messagingData?.Artifact17_Message_Pillars && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Core Messaging Pillars</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {Array.isArray(messagingData.Artifact17_Message_Pillars) ? messagingData.Artifact17_Message_Pillars.map((pillar: string, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border border-blue-200">
                    <p className="text-sm font-medium text-blue-800">{String(pillar)}</p>
                  </div>
                )) : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderOperationsStepContent = (analysis: any) => {
    const operationsData = analysis?.PART_3_EXECUTION_OPERATIONS?.Step7_Operations
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">GTM Operations & Execution</CardTitle>
          <CardDescription>Quality management, implementation timeline, and tech stack</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {operationsData?.Artifact18_QMS && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-medium text-yellow-900 mb-2">Quality Management System</h5>
              <p className="text-sm text-yellow-800 mb-2">Framework: {operationsData.Artifact18_QMS.Framework}</p>
              <h6 className="font-medium text-yellow-900 mb-1">Key Processes:</h6>
              <ul className="text-sm text-yellow-800 space-y-1">
                {renderArrayOrString(operationsData.Artifact18_QMS.Key_Processes, 'yellow')}
              </ul>
            </div>
          )}
          
          {operationsData?.Artifact19_Implementation_Timeline && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Implementation Timeline</h5>
              <ul className="text-sm text-green-800 space-y-1">
                {renderArrayOrString(operationsData.Artifact19_Implementation_Timeline.Phases, 'green')}
              </ul>
            </div>
          )}
          
          {operationsData?.Artifact20_Tech_Stack && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Technology Stack</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                {renderArrayOrString(operationsData.Artifact20_Tech_Stack.Core_Components, 'blue')}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderMeasurementStepContent = (analysis: any) => {
    const measurementData = analysis?.PART_3_EXECUTION_OPERATIONS?.Step8_Performance_Measurement
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Measurement & KPIs</CardTitle>
          <CardDescription>Key performance indicators and strategic goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {measurementData?.Artifact21_KPIs && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Core GTM KPIs</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                {renderArrayOrString(measurementData.Artifact21_KPIs, 'blue')}
              </ul>
            </div>
          )}
          
          {measurementData?.Artifact22_Strategic_Goals && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Strategic Goals</h5>
              <ul className="text-sm text-green-800 space-y-1">
                {renderArrayOrString(measurementData.Artifact22_Strategic_Goals, 'green')}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderRiskStepContent = (analysis: any) => {
    const riskData = analysis?.PART_3_EXECUTION_OPERATIONS?.Step9_Risk_Assessment
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk & Mitigation</CardTitle>
          <CardDescription>Comprehensive risk assessment and mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          {riskData?.Artifact23_Risk_Matrix && (
            <div className="space-y-4">
              {Object.entries(riskData.Artifact23_Risk_Matrix).map(([riskType, riskInfo]: [string, any], index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{riskType.replace('_', ' ')}</h5>
                    {typeof riskInfo === 'object' && riskInfo.Level ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        riskInfo.Level === 'High' ? 'bg-red-100 text-red-800' :
                        riskInfo.Level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {riskInfo.Level} Risk
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Risk Category
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    {typeof riskInfo === 'object' && riskInfo.Mitigation ? (
                      <p>{riskInfo.Mitigation}</p>
                    ) : Array.isArray(riskInfo) ? (
                      <ul className="space-y-1">
                        {riskInfo.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                            {String(item)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{String(riskInfo)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
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
                      onClick={() => handleStepClick(step.id)}
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

              {/* Current Step Content */}
              {renderCurrentStepContent()}
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
          </div>

          {/* Voice Interface Container */}
          <div className="flex-1 relative">
            {(!browserSupported || connectionTimeout) ? (
              /* Browser Compatibility Warning */
              <div className="flex items-center justify-center h-full bg-yellow-50">
                <div className="text-center p-6 max-w-md">
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">
                    {connectionTimeout ? 'Connection Timeout' : 'Browser Compatibility Issue'}
                  </h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    {connectionError}
                  </p>
                  <div className="space-y-2 text-xs text-yellow-700 mb-4">
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="font-semibold text-blue-900 mb-1">✅ RECOMMENDED SOLUTION:</p>
                      <p className="text-blue-800">Please check your microphone permissions</p>
                    </div>
                    
                    <div className="mt-3">
                      <p><strong>Or for Chrome users, try:</strong></p>
                      <ul className="text-left space-y-1 mt-1">
                        <li>• Enable microphone permissions for this site</li>
                        <li>• Clear browser cache and cookies</li>
                        <li>• Close other ElevenLabs tabs</li>
                        <li>• Refresh the page</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => window.open('https://arc.net', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    >
                      Download Arc Browser
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="w-full"
                    >
                      Retry in Chrome
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* ElevenLabs ConvAI Widget - Context-Aware Integration */
              <div className="h-full">
                {widgetLoaded && (
                  <elevenlabs-convai 
                    agent-id="agent_3701k5bdgncmevhspegh2ja47ftc"
                    dynamic-variables={JSON.stringify({
                      company_name: researchData?.companyUrl || 'the company',
                      current_step: getCurrentStepName(),
                      current_artifact: getCurrentArtifactName(),
                      step_description: getCurrentStepDescription(),
                      mission: parseResearchData()?.PART_1_STRATEGIC_FOUNDATION?.Step1_Core_Identity?.Artifact1_Mission_Vision?.mission || '',
                      vision: parseResearchData()?.PART_1_STRATEGIC_FOUNDATION?.Step1_Core_Identity?.Artifact1_Mission_Vision?.vision || '',
                      product: parseResearchData()?.PART_1_STRATEGIC_FOUNDATION?.Step1_Core_Identity?.Artifact2_Core_Offering?.product || '',
                      user_name: userInfo?.name || 'the participant',
                      user_role: userInfo?.role || 'team member'
                    })}
                    override-prompt={`You are a Senior Strategy Consultant at SuperSwift, a leading medtech go-to-market consulting firm conducting a structured strategic assessment interview.

CRITICAL INSTRUCTIONS:
- You are conducting a STRUCTURED STRATEGIC ASSESSMENT INTERVIEW for {{company_name}}
- NEVER give generic greetings like "How can I help you?"
- IMMEDIATELY start with structured interview questions about the current artifact
- Current focus: {{current_step}} - {{current_artifact}}
- Participant: {{user_name}}, {{user_role}}

COMPANY CONTEXT:
- Mission: {{mission}}
- Vision: {{vision}}
- Product: {{product}}

INTERVIEW APPROACH:
1. Reference the specific research findings shown on screen
2. Ask targeted questions about {{current_artifact}}
3. Encourage detailed responses with specific examples
4. Maintain professional SuperSwift consulting tone
5. Guide conversation toward strategic insights

FIRST QUESTION FOCUS: Ask specifically about the {{current_artifact}} artifact based on {{step_description}}`}
                    override-first-message={`Hi, I'm from SuperSwift. I've reviewed the comprehensive research on ${researchData?.companyUrl || 'your company'}. Let's begin our strategic assessment focusing on ${getCurrentArtifactName()}. ${getFirstArtifactQuestion()}`}
                  />
                )}
                {!widgetLoaded && (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center p-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-superswift-orange mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading voice interface...</p>
                      <p className="text-xs text-gray-500 mt-2">If this takes too long, please refresh the page</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ElevenLabs ConvAI Script */}
      {browserSupported && (
        <Script 
          src="https://unpkg.com/@elevenlabs/convai-widget-embed" 
          strategy="afterInteractive"
          onLoad={() => {
            console.log('ElevenLabs widget script loaded')
            setWidgetLoaded(true)
            
            // Check if we're in Chrome and handle accordingly
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
            
            // Auto-start conversation and hide call button
            setTimeout(() => {
              const widget = document.querySelector('elevenlabs-convai')
              if (widget && widget.shadowRoot) {
                // Hide the start call button in shadow DOM
                const style = document.createElement('style')
                style.textContent = `
                  button[aria-label*="Start"],
                  button[aria-label*="call"],
                  [data-testid*="phone" i],
                  .start-call-button,
                  .phone-button {
                    display: none !important;
                  }
                `
                widget.shadowRoot.appendChild(style)
                
                // Auto-click start if button exists (with Chrome delay)
                const startButton = widget.shadowRoot.querySelector('button[aria-label*="Start"], button[aria-label*="call"]')
                if (startButton) {
                  // Longer delay for Chrome
                  setTimeout(() => {
                    startButton.click()
                  }, isChrome ? 2000 : 500)
                }
                
                // Listen for connection errors
                widget.addEventListener('error', (event) => {
                  console.error('ElevenLabs widget error:', event)
                  if (isChrome) {
                    setConnectionError('Connection failed. Please check microphone permissions.')
                    setBrowserSupported(false)
                  }
                })
              }
            }, isChrome ? 2000 : 1000)
          }}
          onError={(error) => {
            console.error('Failed to load ElevenLabs script:', error)
            setConnectionError('Failed to load voice interface. Please refresh the page.')
            setBrowserSupported(false)
          }}
        />
      )}

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

        /* Hide the Start Call button - conversation should always be active */
        elevenlabs-convai button[aria-label*="Start"],
        elevenlabs-convai button[aria-label*="call"],
        elevenlabs-convai [data-testid*="phone" i],
        elevenlabs-convai [class*="phone-button" i],
        elevenlabs-convai [class*="start-call" i],
        elevenlabs-convai [class*="call-button" i] {
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