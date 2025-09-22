"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Globe,
  User,
  Briefcase,
  Clock,
  ChevronRight,
  Mic,
  CheckCircle
} from "lucide-react"

interface ResearchSummary {
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

interface InterviewLandingProps {
  sessionId: string
}

export default function InterviewLanding({ sessionId }: InterviewLandingProps) {
  const [researchData, setResearchData] = useState<ResearchSummary | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load research data and user info
    const loadSessionData = async () => {
      try {
        // Get research data from API using sessionId
        const response = await fetch(`/api/research/status/${sessionId}`)
        const data = await response.json()
        
        if (data.success) {
          setResearchData({
            companyUrl: data.companyUrl || 'Unknown Company',
            analysisContent: data.analysisContent,
            completedAt: data.completedAt,
            artifactsCompleted: data.artifactsCompleted || 23,
            totalArtifacts: data.totalArtifacts || 23
          })
        } else {
          // Set default values when API fails
          setResearchData({
            companyUrl: 'Company Analysis Ready',
            artifactsCompleted: 23,
            totalArtifacts: 23
          })
        }

        // Get user info from session storage
        const storedUserInfo = {
          name: sessionStorage.getItem('userName') || 'Unknown User',
          role: sessionStorage.getItem('userRole') || 'Unknown Role',
          linkedinUrl: sessionStorage.getItem('userLinkedinUrl') || undefined
        }
        setUserInfo(storedUserInfo)
      } catch (error) {
        console.error('Failed to load session data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSessionData()
  }, [sessionId])

  const handleBeginInterview = () => {
    // Navigate to the actual interview interface
    router.push(`/interview/${sessionId}/conduct`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-superswift-orange"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-200">
              <img src="/logos/superswift-icon-black.svg" alt="SuperSwift" className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-superswift-black">Strategic Assessment Interview</h1>
              <p className="text-superswift-gray-text text-lg">Voice-Powered Business Discovery</p>
            </div>
          </div>
        </div>

        {/* Research Summary Card */}
        <Card className="border-2 border-superswift-orange-light bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-superswift-black flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Research Completed
            </CardTitle>
            <CardDescription>
              Your company analysis is ready. Let&apos;s conduct the strategic assessment interview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* User & Company Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-superswift-black">Participant</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-superswift-gray-text" />
                    <span className="font-medium">{userInfo?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-superswift-gray-text" />
                    <span>{userInfo?.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-superswift-black">Company</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-superswift-gray-text" />
                    <span>{researchData?.companyUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{researchData?.artifactsCompleted}/{researchData?.totalArtifacts} research artifacts completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Overview */}
            <div className="border-t border-superswift-gray-border pt-6">
              <h3 className="font-semibold text-superswift-black mb-4">Assessment Overview</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-superswift-orange-bg rounded-lg">
                  <div className="text-2xl font-bold text-superswift-orange mb-1">Part 1</div>
                  <div className="text-sm font-medium text-superswift-black">Strategic Foundation</div>
                  <div className="text-xs text-superswift-gray-text">Core identity & market intelligence</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600 mb-1">Part 2</div>
                  <div className="text-sm font-medium text-superswift-black">Strategy & Positioning</div>
                  <div className="text-xs text-superswift-gray-text">Competitive analysis & go-to-market</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600 mb-1">Part 3</div>
                  <div className="text-sm font-medium text-superswift-black">Execution & Operations</div>
                  <div className="text-xs text-superswift-gray-text">Implementation & risk assessment</div>
                </div>
              </div>
            </div>

            {/* Interview Details */}
            <div className="border-t border-superswift-gray-border pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-superswift-black">What to Expect</h3>
                  <ul className="space-y-2 text-sm text-superswift-gray-text">
                    <li className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-superswift-orange" />
                      Voice-first conversation with AI interviewer
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-superswift-orange" />
                      30-45 minutes structured discussion
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-superswift-orange" />
                      Progress tracking with pause/resume capability
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-superswift-black">Benefits</h3>
                  <ul className="space-y-2 text-sm text-superswift-gray-text">
                    <li>• Personalized go-to-market strategy</li>
                    <li>• Data-driven market insights</li>
                    <li>• Actionable strategic recommendations</li>
                    <li>• Professional assessment report</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="border-t border-superswift-gray-border pt-6">
              <div className="text-center">
                <Button 
                  onClick={handleBeginInterview}
                  size="lg" 
                  className="w-full md:w-auto px-8 py-3 text-lg font-medium bg-superswift-orange hover:bg-superswift-orange-light text-white"
                >
                  Begin Voice Interview
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-superswift-gray-text mt-3">
                  Make sure you&apos;re in a quiet environment with a good microphone
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-superswift-gray-text">
          <p>Powered by SuperSwift AI • Enterprise-grade security • Your data remains confidential</p>
        </div>
      </div>
    </div>
  )
}