import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Download, 
  Mail, 
  Calendar,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Building,
  Globe,
  Star
} from "lucide-react"
import Link from "next/link"

export default function PrototypeSummaryPage() {

  const sections = [
    {
      id: "audience",
      title: "Who you serve",
      icon: Users,
      content: {
        primaryAudience: {
          title: "your primary ideal audience",
          description: "Smart, ambitious young people struggling with the shift into the AI age - specifically those who want to live a free, happy, fulfilled life through online entrepreneurship but don't know where and how to get started. My younger self, essentially.",
          painPoints: [
            "Struggling to keep up with rapid technological changes",
            "Finding the right path in a reshuffled system", 
            "Gaining clarity and confidence in their direction",
            "Finding belonging and connecting with like-minded people",
            "Overcoming the paralysis of too many options in the AI era"
          ]
        },
        secondaryAudience: {
          title: "describe your secondary audience (optional)",
          description: "Venture-backed B2B tech founders with no strong personal brand yet who need to build distribution",
          painPoints: [
            "High costs and time requirements for building a personal brand",
            "Lack of knowledge on how to leverage LinkedIn effectively", 
            "Struggling to create consistent content while running their business",
            "Missing out on deals and opportunities"
          ]
        }
      }
    },
    {
      id: "value", 
      title: "Value Proposition",
      icon: Target,
      content: {
        coreValue: "Empowering entrepreneurs to build authentic personal brands and sustainable online businesses through strategic guidance, proven frameworks, and AI-powered tools.",
        differentiators: [
          "Personal experience of building from zero to successful entrepreneur",
          "Deep understanding of both traditional business and AI-age opportunities", 
          "Focus on authentic personal brand building vs. generic marketing",
          "Proven track record with measurable results"
        ]
      }
    },
    {
      id: "story",
      title: "Brand Story", 
      icon: Globe,
      content: {
        origin: "Started as a struggling entrepreneur trying to navigate the complexity of online business building",
        mission: "To help ambitious entrepreneurs cut through the noise and build meaningful businesses aligned with their values",
        vision: "A world where entrepreneurship is accessible to anyone with the drive to create value",
        values: ["Authenticity", "Growth mindset", "Community over competition", "Practical wisdom"]
      }
    },
    {
      id: "goals",
      title: "Strategic Goals",
      icon: TrendingUp,
      content: {
        shortTerm: [
          "Build engaged community of 10K+ entrepreneurs",
          "Launch signature online course program",
          "Establish thought leadership in AI + entrepreneurship space"
        ],
        longTerm: [
          "Scale to 7-figure business helping entrepreneurs globally",
          "Create comprehensive ecosystem of tools and resources", 
          "Build lasting impact on entrepreneurship education"
        ]
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white font-inter">
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold text-superswift-black">Assessment Complete</h1>
              </div>
              <p className="text-superswift-gray-text">Strategic insights and brand positioning analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-8 py-4">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    index === 0 ? 'bg-superswift-orange-bg text-superswift-orange' : 'text-superswift-gray-text hover:text-superswift-black'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{section.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Current Section - Who you serve */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-superswift-orange-bg rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-superswift-orange" />
            </div>
            <h2 className="text-2xl font-bold text-superswift-black">1. Who you serve</h2>
          </div>
          
          <p className="text-superswift-gray-text leading-relaxed">
            Who are you targeting with your personal brand? Your personal brand is not about you - it's about the people you want to 
            serve with the skills, knowledge, and value you can provide.
          </p>

          {/* Primary Audience */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-superswift-gray-text" />
                <h3 className="font-semibold text-superswift-black">your primary ideal audience</h3>
                <Badge variant="secondary" className="ml-auto">Primary</Badge>
              </div>
              
              <p className="text-superswift-gray-text leading-relaxed">
                Who do you want to reach and why? be specific about their role, situation, and goals. In most cases this is your ICP.
              </p>

              <div className="bg-superswift-gray rounded-lg p-6">
                <p className="text-superswift-black leading-relaxed italic">
                  "Smart, ambitious young people struggling with the shift into the AI age - specifically those who want to live a free, 
                  happy, fulfilled life through online entrepreneurship but don't know where and how to get started. My younger self, essentially."
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-superswift-black">what are their biggest pain points?</h4>
                <p className="text-sm text-superswift-gray-text">the main challenges they face</p>
                
                <div className="space-y-2">
                  {sections[0].content.primaryAudience.painPoints.map((point, index) => (
                    <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-superswift-black text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Audience */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-superswift-gray-text" />
                <h3 className="font-semibold text-superswift-black">describe your secondary audience</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              
              <p className="text-superswift-gray-text leading-relaxed">
                what other group you want to influence (investors, partners, talent, etc.) who do you want to reach and why? be specific about their role, situation, 
                and goals.
              </p>

              <div className="bg-superswift-gray rounded-lg p-6">
                <p className="text-superswift-black leading-relaxed">
                  Venture-backed B2B tech founders with no strong personal brand yet who need to build distribution
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-superswift-black">what are their biggest pain points?</h4>
                <p className="text-sm text-superswift-gray-text">the main challenges they face</p>
                
                <div className="space-y-2">
                  {sections[0].content.secondaryAudience.painPoints.map((point, index) => (
                    <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-superswift-black text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Navigation */}
        <div className="flex items-center justify-between py-8 border-t">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-superswift-orange rounded-full" />
            <div className="h-2 w-8 bg-superswift-gray-border rounded-full" />
            <div className="h-2 w-8 bg-superswift-gray-border rounded-full" />
            <div className="h-2 w-8 bg-superswift-gray-border rounded-full" />
            <span className="text-sm text-superswift-gray-text ml-3">1 of 4</span>
          </div>
          <Button>
            Next: Value Proposition
          </Button>
        </div>

        {/* Overall Score Card */}
        <Card className="border-2 border-superswift-orange-light bg-superswift-orange-bg/30">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 fill-superswift-orange text-superswift-orange" />
              <Star className="h-6 w-6 fill-superswift-orange text-superswift-orange" />
              <Star className="h-6 w-6 fill-superswift-orange text-superswift-orange" />
              <Star className="h-6 w-6 fill-superswift-orange text-superswift-orange" />
              <Star className="h-6 w-6 text-superswift-gray-text" />
            </div>
            <div className="text-4xl font-bold text-superswift-orange mb-2">87</div>
            <div className="text-xl font-semibold text-superswift-black">Brand Strategy Score</div>
            <div className="text-superswift-gray-text">Strong foundation with clear growth opportunities</div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center pt-4">
          <Link href="/prototype/landing" className="text-superswift-orange hover:underline mx-2">
            ← Landing
          </Link>
          <Link href="/prototype/interview" className="text-superswift-orange hover:underline mx-2">
            ← Interview
          </Link>
        </div>
      </div>
    </div>
  )
}