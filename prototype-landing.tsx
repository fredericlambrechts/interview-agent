import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mic, Shield, Clock, ArrowRight } from "lucide-react"

export default function LandingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">SuperSwift</h1>
              <p className="text-sm text-slate-600">Strategic Assessment</p>
            </div>
          </div>
        </div>

        {/* AI Agent Introduction */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20 border-4 border-blue-100">
                <AvatarImage src="/api/placeholder/80/80" alt="Dr. Sarah Mitchell" />
                <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">SM</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-slate-900">Meet Dr. Sarah Mitchell</CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Strategic Business Analyst & Your Interview Guide
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Introduction Message */}
            <div className="bg-slate-50 p-6 rounded-xl">
              <p className="text-slate-700 leading-relaxed">
                "I'll be conducting your strategic assessment today. This conversation will help us understand your business model, market position, and growth opportunities through a natural, voice-first discussion."
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Voice-First</h3>
                <p className="text-sm text-slate-600">Natural conversation, no forms to fill</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">15 Minutes</h3>
                <p className="text-sm text-slate-600">Quick yet comprehensive assessment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Confidential</h3>
                <p className="text-sm text-slate-600">Enterprise-grade security</p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                ✓ HIPAA Compliant
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                ✓ SOC 2 Certified
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                ✓ End-to-End Encrypted
              </Badge>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Begin Strategic Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-sm text-slate-500 mt-3">
                Click to start • Microphone access required
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          Powered by SuperSwift AI • Your conversation is private and secure
        </div>
      </div>
    </div>
  )
}