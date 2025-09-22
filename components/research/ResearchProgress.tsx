"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Globe, CheckCircle, Clock, RefreshCw, ArrowRight } from "lucide-react"

interface ResearchStatus {
  success: boolean
  researchId: string
  status: string
  progress: number
  message: string
  currentPhase?: string
  currentStep?: string
  artifactsCompleted?: number
  totalArtifacts?: number
  estimatedTimeRemaining: number
  assessmentSessionId?: string
  error?: string
}

interface ResearchProgressProps {
  researchId: string
}

export default function ResearchProgress({ researchId }: ResearchProgressProps) {
  const [status, setStatus] = useState<ResearchStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout
    let isMounted = true

    const fetchStatus = async () => {
      try {
        // Only fetch if component is still mounted
        if (!isMounted) return

        const response = await fetch(`/api/research/status/${researchId}`)
        const data = await response.json()

        // Only update state if component is still mounted
        if (!isMounted) return

        if (data.success) {
          setStatus(data)
          
          // If research is completed, redirect to interview landing
          if (data.status === 'completed' && data.assessmentSessionId) {
            // Clear interval before redirecting
            if (interval) {
              clearInterval(interval)
              interval = undefined as any
            }
            
            setTimeout(() => {
              // Double-check component is still mounted before navigating
              if (isMounted) {
                router.push(`/interview/${data.assessmentSessionId}`)
              }
            }, 2000)
          }
        } else {
          setError(data.error || 'Failed to fetch research status')
        }
      } catch (err) {
        // Only set error if component is still mounted
        if (isMounted) {
          setError('Network error while checking research status')
          console.error('Status fetch error:', err)
        }
      }
    }

    // Initial fetch
    fetchStatus()

    // Poll every 3 seconds if not completed
    if (!status || status.status !== 'completed') {
      interval = setInterval(() => {
        if (isMounted) {
          fetchStatus()
        }
      }, 3000)
    }

    return () => {
      isMounted = false
      if (interval) clearInterval(interval)
    }
  }, [researchId, router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
  }

  const getStatusIcon = () => {
    if (status?.status === 'completed') {
      return <CheckCircle className="h-8 w-8 text-green-500" />
    }
    return <RefreshCw className="h-8 w-8 text-superswift-orange animate-spin" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
        <Card className="w-full max-w-2xl border-2 border-red-200 bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Research Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => router.push('/research')}
              className="bg-superswift-orange hover:bg-superswift-orange-light text-white"
            >
              Start New Research
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-200">
              <img src="/logos/superswift-logo-black.svg" alt="SuperSwift" className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-superswift-black">Research in Progress</h1>
              <p className="text-superswift-gray-text text-lg">AI-Powered Business Intelligence</p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="border-2 border-superswift-orange-light bg-white shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getStatusIcon()}
              <CardTitle className="text-2xl text-superswift-black">
                {status?.status === 'completed' ? 'Research Complete!' : 'Analyzing Your Company'}
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              {status?.message || 'Initializing research workflow...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Phase & Step Information */}
            {status && status.currentPhase && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-superswift-orange">{status.currentPhase}</span>
                  <span className="text-sm text-superswift-gray-text">
                    {status.artifactsCompleted || 0}/{status.totalArtifacts || 23} artifacts
                  </span>
                </div>
                <div className="text-sm text-superswift-gray-text">
                  {status.currentStep}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-superswift-black">Overall Progress</span>
                <span className="text-sm font-medium text-superswift-black">
                  {Math.round(status?.progress || 0)}%
                </span>
              </div>
              <Progress 
                value={status?.progress || 0} 
                className="h-3 bg-superswift-gray-bg"
              />
            </div>

            {/* Artifacts Progress */}
            {status && status.totalArtifacts && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-superswift-black">Strategic Artifacts</span>
                  <span className="text-sm font-medium text-superswift-black">
                    {status.artifactsCompleted || 0}/{status.totalArtifacts}
                  </span>
                </div>
                <Progress 
                  value={((status.artifactsCompleted || 0) / status.totalArtifacts) * 100} 
                  className="h-2 bg-superswift-gray-bg"
                />
              </div>
            )}

            {/* Time Remaining */}
            {status && status.estimatedTimeRemaining > 0 && (
              <div className="flex items-center justify-center gap-2 text-superswift-gray-text">
                <Clock className="h-4 w-4" />
                <span>Estimated time remaining: {formatTime(status.estimatedTimeRemaining)}</span>
              </div>
            )}

            {/* Completion Actions */}
            {status?.status === 'completed' && (
              <div className="space-y-4">
                <div className="text-center text-green-600 font-medium">
                  ✅ Research completed successfully!
                </div>
                <Button
                  onClick={() => {
                    if (status?.assessmentSessionId) {
                      router.push(`/interview/${status.assessmentSessionId}`)
                    }
                  }}
                  className="w-full bg-gradient-to-r from-superswift-orange to-superswift-orange-light hover:shadow-lg transition-all text-white min-h-[48px] text-lg font-medium"
                >
                  Start Strategic Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Consulting Process Preview */}
            <div className="border-t border-superswift-gray-border pt-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-superswift-black">SuperSwift GTM Assessment Process:</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className={`space-y-2 ${getPhaseStyle('strategic_foundation', status?.status)}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                    getPhaseStyle('strategic_foundation', status?.status).includes('scale-105') 
                      ? 'bg-superswift-orange text-white' 
                      : 'bg-superswift-orange-bg text-superswift-orange'
                  }`}>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-superswift-black">Strategic Foundation</div>
                    <div className="text-superswift-gray-text">Core identity, business model</div>
                    <div className="text-xs text-superswift-gray-text">Artifacts 1-8</div>
                  </div>
                </div>
                <div className={`space-y-2 ${getPhaseStyle('strategy_positioning', status?.status)}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                    getPhaseStyle('strategy_positioning', status?.status).includes('scale-105') 
                      ? 'bg-superswift-orange text-white' 
                      : 'bg-white border-2 border-superswift-gray-border text-superswift-black'
                  }`}>
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-superswift-black">Strategy & Positioning</div>
                    <div className="text-superswift-gray-text">Competitive landscape, channels</div>
                    <div className="text-xs text-superswift-gray-text">Artifacts 9-17</div>
                  </div>
                </div>
                <div className={`space-y-2 ${getPhaseStyle('execution_operations', status?.status)}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                    getPhaseStyle('execution_operations', status?.status).includes('scale-105') 
                      ? 'bg-superswift-orange text-white' 
                      : 'bg-white border-2 border-superswift-gray-border text-superswift-black'
                  }`}>
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-superswift-black">Execution & Operations</div>
                    <div className="text-superswift-gray-text">Implementation, KPIs, risk</div>
                    <div className="text-xs text-superswift-gray-text">Artifacts 18-23</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-superswift-gray-text">
          <p>Research ID: {researchId}</p>
        </div>
      </div>
    </div>
  )
}

function getPhaseStyle(phaseName: string, currentStatus?: string) {
  if (currentStatus === phaseName) {
    return 'opacity-100 scale-105 transform transition-all'
  }
  // Show completed phases at full opacity
  const phaseOrder = ['strategic_foundation', 'strategy_positioning', 'execution_operations']
  const currentIndex = phaseOrder.indexOf(currentStatus || '')
  const phaseIndex = phaseOrder.indexOf(phaseName)
  
  if (currentIndex > phaseIndex) {
    return 'opacity-90' // Completed phase
  }
  return 'opacity-60' // Future phase
}