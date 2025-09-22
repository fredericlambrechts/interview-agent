"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Target } from "lucide-react"

export default function InterviewIndexPage() {
  const router = useRouter()

  const handleStartResearch = () => {
    router.push('/research')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-200">
              <img src="/logos/superswift-icon-black.svg" alt="SuperSwift" className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-superswift-black">Strategic Assessment</h1>
              <p className="text-superswift-gray-text text-lg">AI-Powered Interview Platform</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-superswift-orange-light bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-superswift-black flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-superswift-orange" />
              Start Your Strategic Assessment
            </CardTitle>
            <CardDescription className="text-base">
              To begin an interview, you need to complete company research first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Process Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-superswift-black">How it works:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-superswift-orange-bg rounded-lg">
                  <div className="h-8 w-8 bg-superswift-orange text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-superswift-black">Company Research</div>
                    <div className="text-sm text-superswift-gray-text">AI analyzes your company&apos;s website and business model</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-superswift-black">Strategic Interview</div>
                    <div className="text-sm text-superswift-gray-text">Voice conversation with AI to gather strategic insights</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-superswift-black">Assessment Report</div>
                    <div className="text-sm text-superswift-gray-text">Receive personalized go-to-market strategy recommendations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="border-t border-superswift-gray-border pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-superswift-gray-text">
                  Ready to get started? Begin with company research to unlock your strategic assessment.
                </p>
                <Button 
                  onClick={handleStartResearch}
                  size="lg" 
                  className="w-full md:w-auto px-8 py-3 text-lg font-medium bg-superswift-orange hover:bg-superswift-orange-light text-white"
                >
                  Start Company Research
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
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