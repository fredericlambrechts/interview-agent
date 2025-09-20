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
  Play,
  Clock,
  CheckCircle
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

export default function InterviewStartPage() {
  const [widgetLoaded, setWidgetLoaded] = useState(false)

  // Assessment structure with traffic light status
  const assessmentStructure = {
    'part1': {
      name: 'Strategic Foundation',
      steps: [
        { id: 'identity', name: 'Core Identity & Business Model', status: 'in-progress', active: true },
        { id: 'market', name: 'Customer & Market Intelligence', status: 'not-started', active: false }
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
  }

  // Calculate overall progress
  const allSteps = Object.values(assessmentStructure).flatMap(part => part.steps)
  const completedSteps = allSteps.filter(step => step.status === 'completed').length
  const inProgressSteps = allSteps.filter(step => step.status === 'in-progress').length
  const totalSteps = allSteps.length
  const progressPercentage = Math.round(((completedSteps + inProgressSteps * 0.5) / totalSteps) * 100)

  const currentPart = 'part1'
  const currentStep = 'identity'

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
                Current: Core Identity & Business Model
              </div>
              <div className="text-xs text-superswift-gray-text mt-1">
                Step 1 of 9 • Part 1: Strategic Foundation
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Center */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-superswift-orange-bg rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-superswift-orange" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-superswift-black">
                    Welcome to Your Strategic Assessment
                  </h1>
                  <p className="text-lg text-superswift-gray-text">
                    Let's begin building your comprehensive go-to-market strategy
                  </p>
                </div>
              </div>
            </div>

            {/* Introduction Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-superswift-black">How This Interview Works</CardTitle>
                <CardDescription>
                  Our AI-powered assessment will guide you through a comprehensive strategic evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-superswift-orange-bg rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-superswift-orange">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-superswift-black">Voice Conversation</h3>
                      <p className="text-sm text-superswift-gray-text">Engage in natural dialogue with our AI interviewer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-superswift-orange-bg rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-superswift-orange">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-superswift-black">Real-time Analysis</h3>
                      <p className="text-sm text-superswift-gray-text">Watch insights develop as we talk</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-superswift-orange-bg rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-superswift-orange">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-superswift-black">Strategic Artifacts</h3>
                      <p className="text-sm text-superswift-gray-text">Receive actionable deliverables</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We'll Cover */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-superswift-black">Your 9-Step Strategic Journey</CardTitle>
                <CardDescription>
                  We'll cover everything from core identity to risk mitigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(assessmentStructure).map(([partId, part]) => (
                    <div key={partId} className="border-l-2 border-superswift-gray-border pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-superswift-black">{part.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {part.steps.length} steps
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {part.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center gap-2 text-sm text-superswift-gray-text">
                            <CheckCircle className="h-3 w-3" />
                            {step.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Estimate */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-superswift-orange" />
                  <div>
                    <div className="font-medium text-superswift-black">Estimated Duration</div>
                    <div className="text-sm text-superswift-gray-text">
                      30-45 minutes for complete assessment
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ready to Start */}
            <Card className="bg-superswift-orange-bg border-superswift-orange-light">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-superswift-black mb-2">
                    Ready to Begin?
                  </h3>
                  <p className="text-superswift-gray-text mb-4">
                    Use the voice interface on the right to start your strategic assessment. 
                    I'll guide you through each step and help develop your go-to-market strategy.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-superswift-orange">
                    <div className="h-2 w-2 bg-superswift-orange rounded-full animate-pulse" />
                    Voice interview ready - Click the microphone to begin
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-superswift-orange rounded-full animate-pulse" />
                <span className="text-sm font-medium text-superswift-black">Voice Interview</span>
              </div>
              <Link href="/prototype/summary">
                <Button size="sm" variant="outline">
                  End Interview
                </Button>
              </Link>
            </div>
            <div className="mt-2 text-xs text-superswift-gray-text">
              Step 1: Core Identity & Business Model
            </div>
          </div>

          {/* Voice Interface Container */}
          <div className="flex-1 relative">
            <elevenlabs-convai 
              agent-id="agent_3701k5bdgncmevhspegh2ja47ftc"
            />
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