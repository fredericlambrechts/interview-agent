"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users,
  Target,
  DollarSign,
  TrendingUp,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export default function PrototypeInterviewPage() {
  const [activeTab, setActiveTab] = useState('icp')
  const [widgetLoaded, setWidgetLoaded] = useState(false)

  // Assessment structure with traffic light status
  const assessmentStructure = {
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
  }

  // Calculate overall progress
  const allSteps = Object.values(assessmentStructure).flatMap(part => part.steps)
  const completedSteps = allSteps.filter(step => step.status === 'completed').length
  const inProgressSteps = allSteps.filter(step => step.status === 'in-progress').length
  const totalSteps = allSteps.length
  const progressPercentage = Math.round(((completedSteps + inProgressSteps * 0.5) / totalSteps) * 100)

  const currentPart = 'part1'
  const currentStep = 'market'

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

  // Sample research data
  const icpData = [
    {
      segment: "Academic Medical Centers",
      example: "Mayo, UCSF",
      persona: "Chief of Neuroradiology",
      painPoints: ["High scan volumes", "Need for research-grade data"],
      gains: ["Publication opportunities", "Grant funding"]
    },
    {
      segment: "Community Hospitals", 
      example: "HCA, Tenet",
      persona: "Radiology Director",
      painPoints: ["Budget constraints", "Skepticism about AI"],
      gains: ["Workflow efficiency", "Competitive differentiation"]
    },
    {
      segment: "MS Centers of Excellence",
      example: "Cleveland Clinic",
      persona: "MS Neurologist", 
      painPoints: ["Lesion monitoring is time-consuming", "Need for objective progression metrics"],
      gains: ["Better patient stratification", "Clinical trial recruitment"]
    },
    {
      segment: "Pharma (Alzheimer's)",
      example: "Big Pharma",
      persona: "Clinical Trial Imaging Lead",
      painPoints: ["High screen-fail rates", "Site variability in scans"],
      gains: ["Faster enrollment", "Regulatory acceptance"]
    }
  ]

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
                Current: Customer & Market Intelligence
              </div>
              <div className="text-xs text-superswift-gray-text mt-1">
                Step 2 of 9 • Part 1: Strategic Foundation
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Center */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-superswift-orange-bg rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-superswift-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-superswift-black">
                  Ideal Customer Profile (ICP) & Buyer Personas
                </h2>
                <p className="text-sm text-superswift-gray-text">Research findings from your company website and market analysis</p>
              </div>
            </div>
          </div>

          {/* ICP Data Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-superswift-gray border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-superswift-black">ICP Segment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-superswift-black">Buyer Persona</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-superswift-black">Pain Points</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-superswift-black">Gains</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {icpData.map((row, index) => (
                    <tr key={index} className="hover:bg-superswift-gray transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-superswift-black">{row.segment}</div>
                          <div className="text-sm text-superswift-gray-text">(e.g., {row.example})</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-superswift-black">{row.persona}</div>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="text-sm text-superswift-gray-text space-y-1">
                          {row.painPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="text-sm text-superswift-gray-text space-y-1">
                          {row.gains.map((gain, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{gain}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Research Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-superswift-orange" />
                  <CardTitle className="text-base">Market Size</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-superswift-black">$4.2B</div>
                <p className="text-sm text-superswift-gray-text">TAM for medical imaging AI</p>
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  23% CAGR through 2028
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-superswift-orange" />
                  <CardTitle className="text-base">Revenue Model</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-superswift-black">SaaS</div>
                <p className="text-sm text-superswift-gray-text">Annual enterprise licenses</p>
                <div className="mt-2 text-sm text-superswift-gray-text">
                  $50-250K ACV typical
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-superswift-orange" />
                  <CardTitle className="text-base">Competition</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-superswift-black">Fragmented</div>
                <p className="text-sm text-superswift-gray-text">No dominant player yet</p>
                <div className="mt-2 text-sm text-superswift-gray-text">
                  5-7 key competitors
                </div>
              </CardContent>
            </Card>
          </div>

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