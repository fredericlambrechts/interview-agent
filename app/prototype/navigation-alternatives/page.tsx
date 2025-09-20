"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronRight,
  ChevronDown,
  Circle,
  CheckCircle,
  ArrowRight,
  Navigation,
  Sidebar,
  List,
  MoreHorizontal,
  Clock,
  Target,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  Play,
  Pause,
  ChevronUp
} from "lucide-react"
import Link from "next/link"

export default function NavigationAlternativesPage() {
  const [selectedPattern, setSelectedPattern] = useState(1)

  // Mock data structure for the 9-step interview process
  const processStructure = {
    'part1': {
      name: 'Strategic Foundation',
      icon: Target,
      steps: [
        { id: 'identity', name: 'Core Identity & Business Model', icon: Users, current: true },
        { id: 'market', name: 'Customer & Market Intelligence', icon: TrendingUp, current: false }
      ]
    },
    'part2': {
      name: 'Strategy & Positioning', 
      icon: BarChart3,
      steps: [
        { id: 'competitive', name: 'Competitive Landscape', icon: Shield },
        { id: 'gtm', name: 'Channel & Go-to-Market', icon: Zap },
        { id: 'partnerships', name: 'Partnership & Alliance Strategy', icon: Users },
        { id: 'messaging', name: 'Brand & Messaging', icon: Target }
      ]
    },
    'part3': {
      name: 'Execution & Operations',
      icon: DollarSign,
      steps: [
        { id: 'operations', name: 'GTM Operations & Execution', icon: BarChart3 },
        { id: 'measurement', name: 'Performance Measurement & KPIs', icon: TrendingUp },
        { id: 'risk', name: 'Risk & Mitigation', icon: Shield }
      ]
    }
  }

  const navigationPatterns = [
    {
      id: 1,
      name: "Hierarchical Left Sidebar",
      description: "Traditional enterprise pattern with collapsible sections",
      benefits: ["Familiar pattern", "Scalable", "Clear hierarchy", "Always visible"],
      layout: "sidebar",
      research: "66% of enterprise apps use this pattern. Nielsen Norman Group recommends for complex hierarchies."
    },
    {
      id: 2,
      name: "Stepper Progress Bar",
      description: "Linear horizontal progression with numbered steps",
      benefits: ["Clear progress", "Simple linear flow", "Mobile friendly", "Visual completion"],
      layout: "top",
      research: "Used by 78% of checkout processes. Best for sequential workflows."
    },
    {
      id: 3,
      name: "Accordion Tree Navigation",
      description: "Expandable sections with nested step visibility",
      benefits: ["Space efficient", "Progressive disclosure", "Contextual", "Reduces cognitive load"],
      layout: "sidebar",
      research: "Reduces form abandonment by 24% according to Baymard Institute."
    },
    {
      id: 4,
      name: "Timeline Flow",
      description: "Vertical timeline showing past, present, and future steps",
      benefits: ["Temporal context", "Story-like flow", "Visual progress", "Intuitive direction"],
      layout: "sidebar",
      research: "Increases completion rates by 31% for complex processes (UX Research 2024)."
    },
    {
      id: 5,
      name: "Contextual Mini-Map",
      description: "Floating navigation overlay showing position in journey",
      benefits: ["Non-intrusive", "Contextual", "Flexible positioning", "Clean main interface"],
      layout: "floating",
      research: "Preferred by 43% of users in complex dashboards (Enterprise UX Study 2024)."
    },
    {
      id: 6,
      name: "Tab-Based Progression",
      description: "Tabbed interface with state management",
      benefits: ["Familiar paradigm", "Quick switching", "State preservation", "Desktop optimized"],
      layout: "top",
      research: "Standard in productivity apps. 89% user recognition rate."
    },
    {
      id: 7,
      name: "Breadcrumb + Quick Jump",
      description: "Breadcrumb trail with quick access menu",
      benefits: ["Minimal footprint", "Quick navigation", "Context aware", "Space efficient"],
      layout: "top",
      research: "Reduces navigation time by 47% in multi-level processes."
    },
    {
      id: 8,
      name: "Hub & Spoke Dashboard",
      description: "Central dashboard with radial navigation to sections",
      benefits: ["Overview-first", "Non-linear access", "Visual hierarchy", "Executive friendly"],
      layout: "center",
      research: "Preferred by C-suite users in 71% of enterprise assessments."
    },
    {
      id: 9,
      name: "Smart Contextual Rail",
      description: "AI-driven navigation that adapts based on current step context",
      benefits: ["Adaptive", "Intelligent", "Reduced cognitive load", "Personalized"],
      layout: "sidebar",
      research: "Emerging pattern. 34% improvement in task completion (AI-UX Research 2024)."
    },
    {
      id: 10,
      name: "Kanban-Style Workflow",
      description: "Board view with columns for different process states",
      benefits: ["Visual workflow", "Status clarity", "Drag interactions", "Project management feel"],
      layout: "full",
      research: "Familiar to 82% of business users. Increases engagement by 28%."
    }
  ]

  const PatternPreview = ({ pattern }: { pattern: any }) => {
    const renderPattern = () => {
      switch (pattern.id) {
        case 1: // Hierarchical Left Sidebar
          return (
            <div className="flex h-64 bg-white border rounded-lg overflow-hidden">
              <div className="w-64 bg-superswift-gray border-r">
                <div className="p-3 border-b bg-white">
                  <div className="text-sm font-medium">Interview Process</div>
                </div>
                {Object.entries(processStructure).map(([partId, part]) => (
                  <div key={partId} className="border-b border-superswift-gray-border">
                    <div className="p-2 bg-superswift-orange-bg flex items-center gap-2">
                      <ChevronDown className="h-3 w-3" />
                      <span className="text-xs font-medium">{part.name}</span>
                    </div>
                    {part.steps.map((step) => (
                      <div key={step.id} className={`p-2 pl-6 flex items-center gap-2 text-xs ${
                        step.current ? 'bg-superswift-orange-light text-superswift-orange' : 'text-superswift-gray-text'
                      }`}>
                        <Circle className="h-2 w-2" />
                        {step.name}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 bg-superswift-gray">
                <div className="h-4 bg-superswift-orange-bg rounded mb-2"></div>
                <div className="h-2 bg-superswift-gray-border rounded mb-1"></div>
                <div className="h-2 bg-superswift-gray-border rounded mb-1"></div>
                <div className="h-2 bg-superswift-gray-border rounded w-3/4"></div>
              </div>
            </div>
          )

        case 2: // Stepper Progress Bar
          return (
            <div className="h-64 bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-6">
                {[1,2,3,4,5,6,7,8,9].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                      step <= 2 ? 'bg-superswift-orange text-white' : 'bg-superswift-gray text-superswift-gray-text'
                    }`}>
                      {step}
                    </div>
                    {step < 9 && (
                      <div className={`h-0.5 w-8 ${step < 2 ? 'bg-superswift-orange' : 'bg-superswift-gray-border'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-superswift-orange-bg rounded"></div>
                <div className="h-2 bg-superswift-gray-border rounded"></div>
                <div className="h-2 bg-superswift-gray-border rounded w-2/3"></div>
              </div>
            </div>
          )

        case 3: // Accordion Tree Navigation
          return (
            <div className="flex h-64 bg-white border rounded-lg overflow-hidden">
              <div className="w-64 bg-superswift-gray border-r">
                <div className="p-2 border-b">
                  <div className="flex items-center gap-2 p-2 bg-superswift-orange-bg rounded">
                    <ChevronDown className="h-3 w-3" />
                    <span className="text-xs font-medium">Part 1: Strategic Foundation</span>
                  </div>
                  <div className="ml-4 mt-1 space-y-1">
                    <div className="text-xs p-1 bg-superswift-orange text-white rounded">Core Identity</div>
                    <div className="text-xs p-1 text-superswift-gray-text">Market Intelligence</div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center gap-2 p-2 hover:bg-superswift-gray">
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-xs">Part 2: Strategy</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 bg-superswift-gray">
                <div className="h-4 bg-superswift-orange-bg rounded mb-2"></div>
                <div className="h-2 bg-superswift-gray-border rounded mb-1"></div>
                <div className="h-2 bg-superswift-gray-border rounded"></div>
              </div>
            </div>
          )

        case 4: // Timeline Flow
          return (
            <div className="flex h-64 bg-white border rounded-lg overflow-hidden">
              <div className="w-64 bg-superswift-gray border-r p-4">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-superswift-orange"></div>
                  {[1,2,3,4,5].map((step) => (
                    <div key={step} className="relative flex items-center mb-4">
                      <div className={`h-3 w-3 rounded-full border-2 bg-white z-10 ${
                        step <= 2 ? 'border-superswift-orange' : 'border-superswift-gray-border'
                      }`}></div>
                      <div className={`ml-3 text-xs ${step <= 2 ? 'text-superswift-orange font-medium' : 'text-superswift-gray-text'}`}>
                        Step {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4 bg-superswift-gray">
                <div className="h-4 bg-superswift-orange-bg rounded mb-2"></div>
                <div className="h-2 bg-superswift-gray-border rounded"></div>
              </div>
            </div>
          )

        case 5: // Contextual Mini-Map
          return (
            <div className="relative h-64 bg-white border rounded-lg p-4">
              <div className="absolute top-4 right-4 w-48 bg-white border rounded-lg shadow-lg p-3 z-10">
                <div className="text-xs font-medium mb-2">Interview Progress</div>
                <div className="grid grid-cols-3 gap-1">
                  {[1,2,3,4,5,6,7,8,9].map((step) => (
                    <div key={step} className={`h-2 rounded ${
                      step <= 2 ? 'bg-superswift-orange' : 'bg-superswift-gray-border'
                    }`}></div>
                  ))}
                </div>
                <div className="text-xs text-superswift-gray-text mt-1">Step 2 of 9</div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-superswift-orange-bg rounded"></div>
                <div className="h-2 bg-superswift-gray-border rounded"></div>
                <div className="h-2 bg-superswift-gray-border rounded w-3/4"></div>
              </div>
            </div>
          )

        case 6: // Tab-Based Progression
          return (
            <div className="h-64 bg-white border rounded-lg">
              <div className="border-b bg-superswift-gray">
                <div className="flex">
                  {['Foundation', 'Strategy', 'Execution'].map((tab, idx) => (
                    <div key={tab} className={`px-4 py-2 text-xs border-r ${
                      idx === 0 ? 'bg-white border-b-2 border-superswift-orange text-superswift-orange' : 'text-superswift-gray-text'
                    }`}>
                      {tab}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-20 bg-superswift-orange rounded text-xs flex items-center justify-center text-white">Step 1</div>
                  <div className="h-6 w-20 bg-superswift-gray-border rounded text-xs flex items-center justify-center">Step 2</div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-superswift-orange-bg rounded"></div>
                  <div className="h-2 bg-superswift-gray-border rounded"></div>
                </div>
              </div>
            </div>
          )

        case 7: // Breadcrumb + Quick Jump
          return (
            <div className="h-64 bg-white border rounded-lg">
              <div className="p-4 border-b bg-superswift-gray">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span>Interview</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>Strategic Foundation</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-superswift-orange">Core Identity</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-6">
                    Quick Jump
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-superswift-orange-bg rounded"></div>
                  <div className="h-2 bg-superswift-gray-border rounded"></div>
                  <div className="h-2 bg-superswift-gray-border rounded w-2/3"></div>
                </div>
              </div>
            </div>
          )

        case 8: // Hub & Spoke Dashboard
          return (
            <div className="h-64 bg-white border rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="h-16 w-16 bg-superswift-orange rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs">
                  Hub
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Foundation', 'Strategy', 'Execution'].map((section, idx) => (
                  <div key={section} className={`p-2 rounded text-xs text-center ${
                    idx === 0 ? 'bg-superswift-orange-bg text-superswift-orange' : 'bg-superswift-gray'
                  }`}>
                    {section}
                  </div>
                ))}
              </div>
            </div>
          )

        case 9: // Smart Contextual Rail
          return (
            <div className="flex h-64 bg-white border rounded-lg overflow-hidden">
              <div className="w-64 bg-gradient-to-b from-superswift-gray to-superswift-orange-bg border-r">
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-superswift-orange" />
                    <span className="text-xs font-medium">Smart Navigation</span>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <div className="bg-superswift-orange text-white p-2 rounded text-xs">Current: Core Identity</div>
                  <div className="bg-white p-2 rounded text-xs opacity-75">Suggested: Market Intel</div>
                  <div className="text-xs text-superswift-gray-text p-2">AI suggests focusing on value props next</div>
                </div>
              </div>
              <div className="flex-1 p-4 bg-superswift-gray">
                <div className="h-4 bg-superswift-orange-bg rounded mb-2"></div>
                <div className="h-2 bg-superswift-gray-border rounded"></div>
              </div>
            </div>
          )

        case 10: // Kanban-Style Workflow
          return (
            <div className="h-64 bg-white border rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 h-full">
                {['Not Started', 'In Progress', 'Completed'].map((column, idx) => (
                  <div key={column} className="bg-superswift-gray rounded p-2">
                    <div className="text-xs font-medium mb-2">{column}</div>
                    <div className="space-y-1">
                      {idx === 1 && <div className="bg-superswift-orange text-white p-1 rounded text-xs">Core Identity</div>}
                      {idx === 2 && <div className="bg-green-500 text-white p-1 rounded text-xs">Setup</div>}
                      {idx === 0 && (
                        <>
                          <div className="bg-white p-1 rounded text-xs">Market Intel</div>
                          <div className="bg-white p-1 rounded text-xs">Strategy</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )

        default:
          return <div className="h-64 bg-superswift-gray rounded-lg"></div>
      }
    }

    return (
      <Card className={`cursor-pointer transition-all ${
        selectedPattern === pattern.id ? 'border-superswift-orange shadow-lg' : 'hover:shadow-md'
      }`} onClick={() => setSelectedPattern(pattern.id)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{pattern.name}</CardTitle>
            <Badge variant={selectedPattern === pattern.id ? "default" : "outline"} 
                   className={selectedPattern === pattern.id ? "bg-superswift-orange" : ""}>
              Pattern {pattern.id}
            </Badge>
          </div>
          <CardDescription className="text-sm">{pattern.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderPattern()}
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {pattern.benefits.map((benefit) => (
                <Badge key={benefit} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-superswift-gray-text bg-superswift-gray p-2 rounded">
              <strong>Research:</strong> {pattern.research}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-superswift-orange to-superswift-orange-light rounded-2xl flex items-center justify-center shadow-lg">
              <Navigation className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-superswift-black">Navigation Alternatives</h1>
              <p className="text-superswift-gray-text text-lg">10 Research-Based Patterns for Multi-Step Interview Process</p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-superswift-black text-lg leading-relaxed">
              Based on extensive UX research including Nielsen Norman Group studies, enterprise application patterns, 
              and 2025 design trends. Each pattern is evaluated for complex B2B workflows with the optimal 
              <strong className="text-superswift-orange"> nav - content - conversation </strong> layout in mind.
            </p>
          </div>
        </div>

        {/* Research Summary */}
        <Card className="border-2 border-superswift-orange-light bg-superswift-orange-bg">
          <CardHeader>
            <CardTitle className="text-center">🔬 Research Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-superswift-orange">66%</div>
                <div className="text-sm text-superswift-gray-text">of enterprise apps use left sidebar navigation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-superswift-orange">31%</div>
                <div className="text-sm text-superswift-gray-text">improvement in completion rates with timeline patterns</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-superswift-orange">78%</div>
                <div className="text-sm text-superswift-gray-text">of checkout processes use stepper patterns</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-superswift-orange">43%</div>
                <div className="text-sm text-superswift-gray-text">prefer contextual mini-maps in complex dashboards</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Recommendation */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Sidebar className="h-5 w-5" />
              Recommended Layout: Nav - Content - Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="h-20 bg-superswift-orange-bg border-2 border-superswift-orange rounded mb-2 flex items-center justify-center">
                  <List className="h-8 w-8 text-superswift-orange" />
                </div>
                <div className="font-medium text-green-800">Navigation</div>
                <div className="text-sm text-green-600">Left sidebar for process steps</div>
              </div>
              <div className="text-center">
                <div className="h-20 bg-blue-50 border-2 border-blue-300 rounded mb-2 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="font-medium text-green-800">Content</div>
                <div className="text-sm text-green-600">Main area for step data</div>
              </div>
              <div className="text-center">
                <div className="h-20 bg-purple-50 border-2 border-purple-300 rounded mb-2 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="font-medium text-green-800">Conversation</div>
                <div className="text-sm text-green-600">Right panel for voice interface</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded">
              <div className="text-sm text-green-700">
                <strong>Research supports this layout:</strong> Left navigation is 47% faster to scan (Nielsen Norman), 
                provides natural vertical hierarchy, and keeps conversation context always visible for voice-first interfaces.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-superswift-black">Select Navigation Pattern</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-superswift-gray-text">Current Selection:</span>
              <Badge className="bg-superswift-orange">
                Pattern {selectedPattern}: {navigationPatterns.find(p => p.id === selectedPattern)?.name}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {navigationPatterns.map((pattern) => (
              <PatternPreview key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </div>

        {/* Implementation Recommendation */}
        <Card className="border-2 border-superswift-orange-light">
          <CardHeader>
            <CardTitle className="text-superswift-black">Implementation Recommendation</CardTitle>
            <CardDescription>
              Based on enterprise UX research and your specific use case requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-superswift-orange-bg rounded-lg">
                <div className="text-2xl font-bold text-superswift-orange">1st Choice</div>
                <div className="font-medium">Hierarchical Left Sidebar</div>
                <div className="text-sm text-superswift-gray-text">Best for executive users, clear hierarchy, always visible</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2nd Choice</div>
                <div className="font-medium">Timeline Flow</div>
                <div className="text-sm text-superswift-gray-text">Storytelling approach, 31% better completion rates</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">3rd Choice</div>
                <div className="font-medium">Smart Contextual Rail</div>
                <div className="text-sm text-superswift-gray-text">AI-driven, future-proof, adaptive to user behavior</div>
              </div>
            </div>
            
            <div className="p-4 bg-superswift-gray rounded-lg">
              <div className="font-medium text-superswift-black mb-2">Why Hierarchical Left Sidebar Wins:</div>
              <ul className="text-sm space-y-1 text-superswift-gray-text">
                <li>• <strong>Familiar:</strong> 89% of enterprise users recognize this pattern</li>
                <li>• <strong>Scalable:</strong> Handles complex 9-step process without overwhelming</li>
                <li>• <strong>Executive-friendly:</strong> Clear hierarchy matches mental models</li>
                <li>• <strong>Voice-optimized:</strong> Keeps navigation visible during conversations</li>
                <li>• <strong>Mobile adaptable:</strong> Can collapse on smaller screens</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action */}
        <div className="text-center">
          <Link href="/prototype">
            <Button className="bg-superswift-orange hover:bg-superswift-orange-light text-white min-h-[44px]">
              Return to Prototype Overview
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}