'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  MessageSquare,
  Bot,
  ChevronRight,
  CheckCircle,
  Circle
} from 'lucide-react'
import { AgentCommunication, InterviewState } from '@/lib/interview/AgentCommunication'

export interface InterviewVoiceInterfaceProps {
  sessionId: string
  voiceId?: string
  onStateChange?: (state: InterviewState) => void
  onError?: (error: Error, context: string) => void
}

export function InterviewVoiceInterface({
  sessionId,
  voiceId = "21m00Tcm4TlvDq8ikWAM",
  onStateChange,
  onError
}: InterviewVoiceInterfaceProps) {
  const [agentComm, setAgentComm] = useState<AgentCommunication | null>(null)
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false,
    currentStep: 'identity',
    currentArtifact: 'artifact_1',
    isListening: false,
    isSpeaking: false
  })
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'interviewer' | 'system'
    content: string
    timestamp: Date
  }>>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stepProgress, setStepProgress] = useState<{
    step1: { completed: number; total: number; confidence: number }
    step2: { completed: number; total: number; confidence: number }
  }>({
    step1: { completed: 0, total: 4, confidence: 0 },
    step2: { completed: 0, total: 4, confidence: 0 }
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Agent Communication
  useEffect(() => {
    const initializeAgents = async () => {
      try {
        const communication = new AgentCommunication({
          sessionId,
          voiceId,
          onStateChange: (state) => {
            setInterviewState(state)
            onStateChange?.(state)
          },
          onError: (error, context) => {
            console.error(`Agent error in ${context}:`, error)
            setError(`${context}: ${error.message}`)
            onError?.(error, context)
          }
        })

        setAgentComm(communication)
        setIsInitialized(true)
        setError(null)

      } catch (error) {
        console.error('Failed to initialize agent communication:', error)
        setError('Failed to initialize voice interface')
      }
    }

    initializeAgents()
  }, [sessionId, voiceId, onStateChange, onError])

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationHistory])

  // Load step progress when component initializes or interview state changes
  useEffect(() => {
    if (isInitialized) {
      loadStepProgress()
    }
  }, [isInitialized, interviewState.currentStep, interviewState.currentArtifact, sessionId])

  // Monitor interview state changes
  useEffect(() => {
    if (interviewState.lastTranscription) {
      setConversationHistory(prev => [...prev, {
        type: 'user',
        content: interviewState.lastTranscription!,
        timestamp: new Date()
      }])
    }
  }, [interviewState.lastTranscription])

  useEffect(() => {
    if (interviewState.lastResponse) {
      setConversationHistory(prev => [...prev, {
        type: 'interviewer',
        content: interviewState.lastResponse!,
        timestamp: new Date()
      }])
    }
  }, [interviewState.lastResponse])

  const handleStartInterview = async () => {
    if (!agentComm) return

    try {
      setError(null)
      await agentComm.startInterview()
      
      setConversationHistory(prev => [...prev, {
        type: 'system',
        content: 'Interview started. The AI interviewer will begin with questions about your company\'s strategic foundation.',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Failed to start interview:', error)
      setError('Failed to start interview')
    }
  }

  const handleStopInterview = async () => {
    if (!agentComm) return

    try {
      await agentComm.stopInterview()
      
      setConversationHistory(prev => [...prev, {
        type: 'system',
        content: 'Interview stopped. Your progress has been saved.',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Failed to stop interview:', error)
      setError('Failed to stop interview')
    }
  }

  const handleToggleListening = async () => {
    if (!agentComm || !interviewState.isActive) return

    try {
      if (interviewState.isListening) {
        await agentComm.stopListening()
      } else {
        await agentComm.startListening()
      }
    } catch (error) {
      console.error('Failed to toggle listening:', error)
      setError('Voice operation failed')
    }
  }

  const getCurrentArtifactName = (): string => {
    const artifactNames: Record<string, string> = {
      'artifact_1': 'Company Mission & Vision',
      'artifact_2': 'Core Offering Definition',
      'artifact_3': 'Regulatory Pathway',
      'artifact_4': 'Revenue Streams & Pricing',
      'artifact_5': 'Market Sizing (TAM, SAM, SOM)',
      'artifact_6': 'Clinical Evidence & KOL Strategy',
      'artifact_7': 'Ideal Customer Profile',
      'artifact_8': 'Customer Pains & Gains'
    }
    
    return artifactNames[interviewState.currentArtifact] || `Artifact ${interviewState.currentArtifact.replace('artifact_', '')}`
  }

  const getCurrentStepName = (): string => {
    const stepNames: Record<string, string> = {
      'identity': 'Step 1: Core Identity & Business Model',
      'customer_market': 'Step 2: Customer & Market Intelligence'
    }
    
    return stepNames[interviewState.currentStep] || interviewState.currentStep
  }

  const getStepArtifacts = (step: string): string[] => {
    if (step === 'identity') {
      return ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4']
    } else if (step === 'customer_market') {
      return ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8']
    }
    return []
  }

  const handleStepNavigation = async (targetStep: string) => {
    if (!agentComm || interviewState.isSpeaking || interviewState.isListening) return

    try {
      setError(null)
      
      // First validate if we can transition to the target step
      const validation = await fetch('/api/interview/validate-step-transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          targetStep,
          currentStep: interviewState.currentStep
        })
      }).then(res => res.json())

      if (!validation.canTransition) {
        setError(validation.reason || 'Cannot transition to this step yet')
        return
      }

      // Update the interview state to the new step
      await agentComm.updateInterviewStep(targetStep)
      
      setConversationHistory(prev => [...prev, {
        type: 'system',
        content: `Navigated to ${getCurrentStepName()}`,
        timestamp: new Date()
      }])

    } catch (error) {
      console.error('Failed to navigate steps:', error)
      setError('Failed to navigate to step')
    }
  }

  const loadStepProgress = async () => {
    try {
      const [step1Progress, step2Progress] = await Promise.all([
        fetch(`/api/interview/step-progress?sessionId=${sessionId}&stepId=step_1_core_identity`).then(res => res.json()),
        fetch(`/api/interview/step-progress?sessionId=${sessionId}&stepId=step_2_customer_market`).then(res => res.json())
      ])

      setStepProgress({
        step1: {
          completed: step1Progress.completedArtifacts || 0,
          total: step1Progress.totalArtifacts || 4,
          confidence: step1Progress.overallConfidence || 0
        },
        step2: {
          completed: step2Progress.completedArtifacts || 0,
          total: step2Progress.totalArtifacts || 4,
          confidence: step2Progress.overallConfidence || 0
        }
      })
    } catch (error) {
      console.error('Failed to load step progress:', error)
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (): string => {
    if (!interviewState.isActive) return 'bg-gray-400'
    if (interviewState.isSpeaking) return 'bg-blue-500'
    if (interviewState.isListening) return 'bg-green-500'
    return 'bg-orange-500'
  }

  const getStatusText = (): string => {
    if (!interviewState.isActive) return 'Not Started'
    if (interviewState.isSpeaking) return 'AI Speaking'
    if (interviewState.isListening) return 'Listening'
    return 'Ready'
  }

  if (!isInitialized) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-superswift-orange" />
            <span className="ml-2">Initializing voice interface...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`} />
              <CardTitle className="text-lg">Voice Interview - {getStatusText()}</CardTitle>
            </div>
            <Badge variant="outline" className="text-sm">
              {getCurrentArtifactName()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!interviewState.isActive ? (
                <Button
                  onClick={handleStartInterview}
                  className="bg-superswift-orange hover:bg-superswift-orange-light text-white"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Interview
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleToggleListening}
                    disabled={interviewState.isSpeaking}
                    variant={interviewState.isListening ? "destructive" : "default"}
                    size="lg"
                  >
                    {interviewState.isListening ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Listening
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleStopInterview}
                    variant="outline"
                    size="lg"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Interview
                  </Button>
                </div>
              )}
            </div>

            {/* Progress Information */}
            {interviewState.progress && (
              <div className="text-right">
                <div className="text-sm font-medium text-superswift-black">
                  Progress: {interviewState.progress.completedArtifacts}/{interviewState.progress.totalArtifacts}
                </div>
                <div className="text-xs text-superswift-gray-text">
                  {interviewState.progress.confidence}% confidence
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {interviewState.progress && (
            <div className="mt-4">
              <Progress 
                value={(interviewState.progress.completedArtifacts / interviewState.progress.totalArtifacts) * 100}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Assessment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step Navigation Tabs */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleStepNavigation('identity')}
                disabled={interviewState.isSpeaking || interviewState.isListening}
                variant={interviewState.currentStep === 'identity' ? 'default' : 'outline'}
                className="flex-1"
              >
                <div className="flex items-center gap-2">
                  {stepProgress.step1.completed === stepProgress.step1.total ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span>Step 1: Core Identity</span>
                </div>
              </Button>
              <Button
                onClick={() => handleStepNavigation('customer_market')}
                disabled={interviewState.isSpeaking || interviewState.isListening}
                variant={interviewState.currentStep === 'customer_market' ? 'default' : 'outline'}
                className="flex-1"
              >
                <div className="flex items-center gap-2">
                  {stepProgress.step2.completed === stepProgress.step2.total ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span>Step 2: Customer & Market</span>
                </div>
              </Button>
            </div>

            {/* Current Step Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Step 1 Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step 1: Core Identity</span>
                  <span className="text-xs text-gray-500">
                    {stepProgress.step1.completed}/{stepProgress.step1.total}
                  </span>
                </div>
                <Progress value={(stepProgress.step1.completed / stepProgress.step1.total) * 100} className="h-2" />
                <div className="text-xs text-gray-500">
                  {stepProgress.step1.confidence}% confidence
                </div>
              </div>

              {/* Step 2 Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step 2: Customer & Market</span>
                  <span className="text-xs text-gray-500">
                    {stepProgress.step2.completed}/{stepProgress.step2.total}
                  </span>
                </div>
                <Progress value={(stepProgress.step2.completed / stepProgress.step2.total) * 100} className="h-2" />
                <div className="text-xs text-gray-500">
                  {stepProgress.step2.confidence}% confidence
                </div>
              </div>
            </div>

            {/* Current Step Artifacts */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Current Step Artifacts:</span>
              <div className="grid grid-cols-2 gap-2">
                {getStepArtifacts(interviewState.currentStep).map((artifactId) => {
                  const isCurrentArtifact = artifactId === interviewState.currentArtifact
                  const artifactNumber = artifactId.replace('artifact_', '')
                  const artifactName = getCurrentArtifactName()
                  
                  return (
                    <div
                      key={artifactId}
                      className={`p-2 rounded-lg border text-sm ${
                        isCurrentArtifact 
                          ? 'bg-superswift-orange-bg border-superswift-orange text-superswift-orange' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{artifactNumber}</span>
                        {isCurrentArtifact && <ChevronRight className="h-3 w-3" />}
                      </div>
                      <div className="text-xs mt-1 truncate">
                        {isCurrentArtifact ? artifactName : `Artifact ${artifactNumber}`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversationHistory.length === 0 ? (
              <div className="text-center py-8 text-superswift-gray-text">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Start the interview to begin your conversation with the AI interviewer.</p>
              </div>
            ) : (
              conversationHistory.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    {entry.type === 'user' ? (
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">You</span>
                      </div>
                    ) : entry.type === 'interviewer' ? (
                      <div className="h-8 w-8 bg-superswift-orange-bg rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-superswift-orange" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">Sys</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-superswift-black">
                        {entry.type === 'user' ? 'You' : 
                         entry.type === 'interviewer' ? 'AI Interviewer' : 'System'}
                      </span>
                      <span className="text-xs text-superswift-gray-text">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <div className={`text-sm p-3 rounded-lg ${
                      entry.type === 'user' ? 'bg-blue-50 text-blue-900' :
                      entry.type === 'interviewer' ? 'bg-superswift-gray text-superswift-black' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {entry.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Voice Status Indicators */}
      {interviewState.isActive && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {interviewState.isListening ? (
                    <Volume2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={interviewState.isListening ? 'text-green-600' : 'text-gray-600'}>
                    Microphone {interviewState.isListening ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {interviewState.isSpeaking ? (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={interviewState.isSpeaking ? 'text-blue-600' : 'text-gray-600'}>
                    AI {interviewState.isSpeaking ? 'Speaking' : 'Ready'}
                  </span>
                </div>
              </div>
              <div className="text-superswift-gray-text">
                Step: {interviewState.currentStep} | Artifact: {interviewState.currentArtifact.replace('artifact_', '')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}