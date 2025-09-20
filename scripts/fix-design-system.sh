#!/bin/bash
# Script to update all prototype pages to SuperSwift design system

echo "🎨 Updating prototypes to SuperSwift Design System..."

# Processing Page
cat > app/prototype/processing/page.tsx << 'EOF'
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PrototypeProcessingPage() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    { 
      id: 'website', 
      label: 'Analyzing your website',
      detail: 'Extracting company information, product details, and value propositions...'
    },
    { 
      id: 'market', 
      label: 'Researching your market',
      detail: 'Identifying competitors, market size, and growth opportunities...'
    },
    { 
      id: 'buyers', 
      label: 'Understanding your buyers',
      detail: 'Mapping customer personas, pain points, and buying journey...'
    },
    { 
      id: 'insights', 
      label: 'Generating insights',
      detail: 'Creating strategic recommendations and growth opportunities...'
    },
    { 
      id: 'interview', 
      label: 'Preparing interview',
      detail: 'Customizing questions based on your business context...'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          clearInterval(timer)
          setIsComplete(true)
          return 100
        }
        return newProgress
      })
      
      setCurrentStep(prev => {
        const stepProgress = (progress / 100) * steps.length
        return Math.min(Math.floor(stepProgress), steps.length - 1)
      })
    }, 100)

    return () => clearInterval(timer)
  }, [progress])

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        window.location.href = '/prototype/interview'
      }, 2000)
    }
  }, [isComplete])

  const completedSteps = Math.floor((progress / 100) * steps.length)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-superswift-orange to-superswift-orange-light rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-superswift-black">Research Agent</h1>
              <p className="text-superswift-gray-text">Analyzing your business context</p>
            </div>
          </div>
        </div>

        {/* Main Progress Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-superswift-black">
                  Research Progress
                </span>
                <span className="text-lg font-bold text-superswift-orange">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-superswift-gray rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-superswift-orange to-superswift-orange-light transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-8 p-6 bg-superswift-orange-bg rounded-lg border border-superswift-orange-light">
              {!isComplete ? (
                <div className="flex items-start gap-4">
                  <Loader2 className="h-8 w-8 text-superswift-orange animate-spin" />
                  <div className="flex-1">
                    <span className="text-xl font-medium text-superswift-black">
                      {steps[currentStep]?.label}
                    </span>
                    <p className="text-superswift-gray-text italic animate-pulse">
                      {steps[currentStep]?.detail}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <FileText className="h-8 w-8 text-success" />
                  <div className="flex-1">
                    <span className="text-xl font-medium text-success">
                      Research Complete!
                    </span>
                    <p className="text-success/80 italic">
                      Redirecting to interview in 2 seconds...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {steps.map((step, index) => {
                const isCompleted = index < completedSteps
                const isCurrent = index === currentStep && !isComplete
                
                return (
                  <div 
                    key={step.id}
                    className={`
                      p-4 rounded-lg transition-all duration-300
                      ${isCompleted ? 'bg-success/10 border border-success/30' :
                        isCurrent ? 'bg-superswift-orange-bg border border-superswift-orange-light animate-pulse' :
                        'bg-superswift-gray border border-superswift-gray-border'}
                    `}
                  >
                    <div className={`
                      font-medium transition-colors
                      ${isCompleted ? 'text-success' :
                        isCurrent ? 'text-superswift-orange' :
                        'text-superswift-gray-text'}
                    `}>
                      <span className={`
                        ${isCompleted ? 'text-success' :
                          isCurrent ? 'text-superswift-black' :
                          'text-superswift-gray-text'}
                      `}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-superswift-gray-text mt-6">
              This typically takes 10-15 seconds...
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-superswift-gray-text">
            We're gathering information about your company to personalize the interview
          </p>
          <p className="text-xs text-superswift-gray-text mt-2">
            Your data is processed securely and never shared
          </p>
        </div>
        
        {/* Dev Navigation */}
        <div className="text-center mt-6">
          <Link href="/prototype/interview" className="text-superswift-orange hover:underline text-sm">
            Skip to Interview →
          </Link>
        </div>
      </div>
    </div>
  )
}
EOF

echo "✅ Processing page updated"

# Add Inter font to layout
echo "🔤 Adding Inter font to layout..."

# Create a proper layout update
cat > app/layout.tsx << 'EOF'
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import ClientSessionProvider from "@/lib/client-session-provider"
import { getSession } from "@/lib/auth-client"
import type { Metadata } from "next"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "SuperSwift Interview Agent",
  description: "AI-powered strategic assessment for MedTech companies",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} font-inter`}>
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
EOF

echo "✅ Inter font added to layout"

echo "🎉 Design system updates complete!"
echo "Please restart your dev server to see all changes"