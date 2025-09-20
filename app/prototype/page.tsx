import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Palette, Mic, BarChart3, Loader2, TestTube, Home, Users, CreditCard, Settings, MessageSquare, Upload, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function PrototypeIndexPage() {
  const mainScreens = [
    {
      id: 'landing',
      title: 'Landing Screen',
      description: 'Executive onboarding with AI agent introduction',
      icon: Palette,
      features: ['Trust building', 'Security badges', 'Clear value props', 'Professional design'],
      href: '/prototype/landing'
    },
    {
      id: 'interview-start', 
      title: 'Interview Start',
      description: 'Welcome and process introduction',
      icon: Users,
      features: ['9-step journey overview', 'Process explanation', 'Voice interface introduction', 'Time estimates'],
      href: '/prototype/interview-start'
    },
    {
      id: 'interview', 
      title: 'Interview Interface',
      description: 'Voice-powered strategic assessment',
      icon: Mic,
      features: ['Integrated voice sidebar', 'Enhanced navigation', 'Step tooltips', 'Real-time insights'],
      href: '/prototype/interview'
    },
    {
      id: 'interview-complete', 
      title: 'Interview Complete',
      description: 'Final step with completion flow',
      icon: CheckCircle,
      features: ['Completion celebration', 'Assessment metrics', 'Report generation', 'Next steps'],
      href: '/prototype/interview-complete'
    },
    {
      id: 'processing',
      title: 'Processing Screen',
      description: 'AI processing and analysis state',
      icon: Loader2,
      features: ['Loading animations', 'Processing indicators', 'Status updates', 'Progress feedback'],
      href: '/prototype/processing'
    },
    {
      id: 'summary',
      title: 'Summary & Results', 
      description: 'Comprehensive business assessment results',
      icon: BarChart3,
      features: ['Assessment scores', 'Key insights', 'Next steps', 'Action buttons'],
      href: '/prototype/summary'
    },
    {
      id: 'assessment-report',
      title: 'Assessment Report', 
      description: 'Artifact-centric business intelligence report',
      icon: FileText,
      features: ['23 strategic artifacts', 'Interactive navigation', 'Version tracking', 'Outstanding questions'],
      href: '/prototype/assessment-report'
    }
  ]

  const additionalScreens = [
    {
      id: 'test-voice',
      title: 'Voice Testing',
      description: 'Test ElevenLabs voice integration',
      icon: TestTube,
      features: ['Voice synthesis', 'Audio controls', 'API testing', 'Configuration'],
      href: '/test-voice',
      category: 'Testing'
    }
  ]

  const dashboardScreens = [
    {
      id: 'main-app',
      title: 'Main Application',
      description: 'Primary application landing page',
      icon: Home,
      href: '/',
      category: 'Application'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'User dashboard with analytics',
      icon: BarChart3,
      href: '/dashboard',
      category: 'Dashboard'
    },
    {
      id: 'chat',
      title: 'Chat Interface',
      description: 'AI chat conversation interface',
      icon: MessageSquare,
      href: '/dashboard/chat',
      category: 'Dashboard'
    },
    {
      id: 'upload',
      title: 'Upload',
      description: 'Document upload interface',
      icon: Upload,
      href: '/dashboard/upload',
      category: 'Dashboard'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'User settings and preferences',
      icon: Settings,
      href: '/dashboard/settings',
      category: 'Dashboard'
    },
    {
      id: 'pricing',
      title: 'Pricing',
      description: 'Subscription plans and pricing',
      icon: CreditCard,
      href: '/pricing',
      category: 'Application'
    }
  ]

  return (
    <div className="min-h-screen bg-white p-4 font-inter">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-superswift-orange to-superswift-orange-light rounded-2xl flex items-center justify-center shadow-lg">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-superswift-black">Prototype Overview</h1>
              <p className="text-superswift-gray-text text-lg">SuperSwift Interview Agent - All UI Screens</p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-superswift-black text-lg leading-relaxed">
              Comprehensive overview of all prototype screens including the voice-first interview flow,
              testing interfaces, and full application dashboard views.
            </p>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="border-2 border-superswift-orange-light bg-superswift-orange-bg">
          <CardHeader>
            <CardTitle className="text-center">📊 Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-superswift-orange">7</div>
                <div className="text-sm text-superswift-gray-text">Interview Flow Screens</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-superswift-orange">6</div>
                <div className="text-sm text-superswift-gray-text">Dashboard Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-superswift-orange">1</div>
                <div className="text-sm text-superswift-gray-text">Test Interface</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-superswift-orange">14</div>
                <div className="text-sm text-superswift-gray-text">Total Screens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interview Flow Prototypes */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-superswift-black text-center">🎯 Interview Flow Prototypes</h2>
          <p className="text-center text-superswift-gray-text -mt-2">Core user journey from onboarding to results</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainScreens.map((screen, index) => {
              const Icon = screen.icon
              return (
                <Card key={screen.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 bg-superswift-orange-bg rounded-2xl flex items-center justify-center">
                        <Icon className="h-8 w-8 text-superswift-orange" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{screen.title}</CardTitle>
                    <CardDescription className="text-base">
                      {screen.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {screen.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-superswift-orange rounded-full" />
                          <span className="text-superswift-gray-text">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-superswift-orange-bg text-superswift-orange border-superswift-orange-light">
                        Step {index + 1}
                      </Badge>
                    </div>

                    {/* CTA */}
                    <Link href={screen.href} className="block">
                      <Button className="w-full bg-gradient-to-r from-superswift-orange to-superswift-orange-light hover:shadow-lg transition-all text-white min-h-[44px]">
                        View Prototype
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Test & Development Screens */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-superswift-black text-center">🧪 Test & Development</h2>
          <p className="text-center text-superswift-gray-text -mt-2">Testing interfaces and development tools</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalScreens.map((screen) => {
              const Icon = screen.icon
              return (
                <Card key={screen.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 bg-superswift-gray rounded-2xl flex items-center justify-center">
                        <Icon className="h-8 w-8 text-superswift-black" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{screen.title}</CardTitle>
                    <CardDescription className="text-base">
                      {screen.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {screen.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-superswift-black rounded-full" />
                          <span className="text-superswift-gray-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Badge variant="outline" className="bg-superswift-gray text-superswift-black border-superswift-gray-border">
                      {screen.category}
                    </Badge>
                    <Link href={screen.href} className="block">
                      <Button className="w-full bg-superswift-black hover:bg-superswift-black/90 text-white min-h-[44px]">
                        Open {screen.category}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Application & Dashboard Screens */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-superswift-black text-center">📱 Application Screens</h2>
          <p className="text-center text-superswift-gray-text -mt-2">Full application interfaces and dashboard views</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardScreens.map((screen) => {
              const Icon = screen.icon
              return (
                <Card key={screen.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 bg-success/10 rounded-2xl flex items-center justify-center">
                        <Icon className="h-8 w-8 text-success" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{screen.title}</CardTitle>
                    <CardDescription className="text-base">
                      {screen.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      {screen.category}
                    </Badge>
                    <Link href={screen.href} className="block">
                      <Button className="w-full bg-success hover:bg-success/90 text-white min-h-[44px]">
                        View Screen
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-superswift-black">🚀 Interview Flow Navigation</CardTitle>
            <CardDescription className="text-superswift-gray-text">Follow the complete user journey from start to finish</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link href="/prototype/landing" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  1. Landing
                </Button>
              </Link>
              <Link href="/prototype/interview-start" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  2. Start Interview
                </Button>
              </Link>
              <Link href="/prototype/interview" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  3. Interview
                </Button>
              </Link>
              <Link href="/prototype/interview-complete" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  4. Complete
                </Button>
              </Link>
              <Link href="/prototype/processing" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  5. Processing
                </Button>
              </Link>
              <Link href="/prototype/summary" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  6. Summary
                </Button>
              </Link>
              <Link href="/prototype/assessment-report" className="flex-1">
                <Button variant="outline" className="w-full min-h-[44px] border-superswift-gray-border hover:bg-superswift-orange-bg hover:border-superswift-orange text-superswift-black text-xs">
                  7. Report
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Design Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-superswift-black">Design System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Components</span>
                <Badge variant="secondary" className="bg-superswift-gray text-superswift-black">shadcn/ui</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Icons</span>
                <Badge variant="secondary">Lucide React</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Colors</span>
                <Badge variant="secondary" className="bg-superswift-gray text-superswift-black">Orange + Black</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Layout</span>
                <Badge variant="secondary">CSS Grid</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-superswift-black">Key Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Voice Animations</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  ✓ Implemented
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Progress Tracking</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  ✓ Implemented
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Interactive Controls</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  ✓ Implemented
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-superswift-black">Responsive Design</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  ✓ Implemented
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-superswift-gray-text">
          <p>Design Sprint completed in YOLO mode • Ready for development integration</p>
        </div>
      </div>
    </div>
  )
}