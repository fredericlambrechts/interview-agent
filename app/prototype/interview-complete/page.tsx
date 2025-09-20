"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  Target,
  DollarSign,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Download,
  Calendar,
  Award
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function InterviewCompletePage() {
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const [assessmentComplete, setAssessmentComplete] = useState(false)

  // Assessment structure with traffic light status
  const assessmentStructure = {
    'part1': {
      name: 'Strategic Foundation',
      steps: [
        { id: 'identity', name: 'Core Identity & Business Model', status: 'completed', active: false },
        { id: 'market', name: 'Customer & Market Intelligence', status: 'completed', active: false }
      ]
    },
    'part2': {
      name: 'Strategy & Positioning', 
      steps: [
        { id: 'competitive', name: 'Competitive Landscape', status: 'completed', active: false },
        { id: 'gtm', name: 'Channel & Go-to-Market', status: 'completed', active: false },
        { id: 'partnerships', name: 'Partnership & Alliance Strategy', status: 'completed', active: false },
        { id: 'messaging', name: 'Brand & Messaging', status: 'completed', active: false }
      ]
    },
    'part3': {
      name: 'Execution & Operations',
      steps: [
        { id: 'operations', name: 'GTM Operations & Execution', status: 'completed', active: false },
        { id: 'measurement', name: 'Performance Measurement & KPIs', status: 'completed', active: false },
        { id: 'risk', name: 'Risk & Mitigation', status: 'in-progress', active: true }
      ]
    }
  }

  // Calculate overall progress
  const allSteps = Object.values(assessmentStructure).flatMap(part => part.steps)
  const completedSteps = allSteps.filter(step => step.status === 'completed').length
  const inProgressSteps = allSteps.filter(step => step.status === 'in-progress').length
  const totalSteps = allSteps.length
  const progressPercentage = Math.round(((completedSteps + inProgressSteps * 0.5) / totalSteps) * 100)

  const currentPart = 'part3'
  const currentStep = 'risk'

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

  const handleCompleteAssessment = () => {
    setAssessmentComplete(true)
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
              <div className="text-sm font-medium text-superswift-black">
                Current: Risk & Mitigation
              </div>
              <div className="text-xs text-superswift-gray-text mt-1">
                Step 9 of 9 • Part 3: Execution & Operations
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Center */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
            
            {!assessmentComplete ? (
              <>
                {/* Current Step Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-superswift-orange-bg rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-superswift-orange" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-superswift-black">
                        Risk Assessment & Mitigation Strategies
                      </h2>
                      <p className="text-sm text-superswift-gray-text">Final step: Identifying and planning for potential challenges</p>
                    </div>
                  </div>
                </div>

                {/* Risk Framework Preview */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-superswift-black">Risk Assessment Framework</CardTitle>
                    <CardDescription>
                      Comprehensive evaluation across multiple risk dimensions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-superswift-black">Market Risks</h4>
                        <ul className="text-sm text-superswift-gray-text space-y-1">
                          <li>• Competitive response</li>
                          <li>• Market timing</li>
                          <li>• Regulatory changes</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-superswift-black">Execution Risks</h4>
                        <ul className="text-sm text-superswift-gray-text space-y-1">
                          <li>• Resource constraints</li>
                          <li>• Team scaling</li>
                          <li>• Technology dependencies</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-superswift-black">Financial Risks</h4>
                        <ul className="text-sm text-superswift-gray-text space-y-1">
                          <li>• Cash flow management</li>
                          <li>• Customer acquisition costs</li>
                          <li>• Revenue concentration</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-superswift-black">Strategic Risks</h4>
                        <ul className="text-sm text-superswift-gray-text space-y-1">
                          <li>• Partnership dependencies</li>
                          <li>• Channel conflicts</li>
                          <li>• Brand reputation</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Complete Assessment CTA */}
                <Card className="bg-superswift-orange-bg border-superswift-orange-light">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-superswift-black mb-2">
                        Ready to Complete Your Assessment?
                      </h3>
                      <p className="text-superswift-gray-text mb-4">
                        Once we finish discussing risk mitigation strategies, click below to finalize your strategic assessment and generate your comprehensive report.
                      </p>
                      <Button 
                        onClick={handleCompleteAssessment}
                        className="bg-superswift-orange hover:bg-superswift-orange-light text-white"
                      >
                        Complete Strategic Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Completion Celebration */}
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-superswift-black mb-2">
                    Assessment Complete!
                  </h1>
                  <p className="text-lg text-superswift-gray-text">
                    Your comprehensive strategic assessment has been successfully generated
                  </p>
                </div>

                {/* Completion Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-superswift-orange">23</div>
                      <div className="text-sm text-superswift-gray-text">Strategic Artifacts</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-superswift-orange">9</div>
                      <div className="text-sm text-superswift-gray-text">Steps Completed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-superswift-orange">42</div>
                      <div className="text-sm text-superswift-gray-text">Minutes Duration</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Next Steps */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-superswift-black">Your Strategic Report is Ready</CardTitle>
                    <CardDescription>
                      Access your comprehensive go-to-market strategy and implementation roadmap
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-superswift-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-superswift-orange" />
                        <div>
                          <div className="font-medium text-superswift-black">Strategic Assessment Report</div>
                          <div className="text-sm text-superswift-gray-text">Comprehensive analysis with 23 strategic artifacts</div>
                        </div>
                      </div>
                      <Link href="/prototype/summary">
                        <Button className="bg-superswift-orange hover:bg-superswift-orange-light text-white">
                          View Report
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-900">Schedule Follow-up Session</div>
                          <div className="text-sm text-blue-700">Discuss implementation priorities with our team</div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Schedule Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            </div>
          </div>
        </div>

        {/* Voice Interface Sidebar - Right Side */}
        <div className="w-80 bg-superswift-gray border-l border-superswift-gray-border flex flex-col flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-superswift-gray-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!assessmentComplete ? (
                  <>
                    <div className="h-2 w-2 bg-superswift-orange rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-superswift-black">Voice Interview</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Interview Complete</span>
                  </>
                )}
              </div>
              <Link href="/prototype/summary">
                <Button size="sm" variant="outline">
                  View Report
                </Button>
              </Link>
            </div>
            <div className="mt-2 text-xs text-superswift-gray-text">
              {!assessmentComplete ? 'Step 9: Risk & Mitigation' : 'Assessment Completed Successfully'}
            </div>
          </div>

          {/* Voice Interface Container */}
          <div className="flex-1 relative">
            {!assessmentComplete ? (
              <elevenlabs-convai 
                agent-id="agent_3701k5bdgncmevhspegh2ja47ftc"
              />
            ) : (
              <div className="p-4 h-full flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <div className="text-sm font-medium text-superswift-black mb-1">
                    Interview Complete
                  </div>
                  <div className="text-xs text-superswift-gray-text">
                    Your strategic report is ready for review
                  </div>
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