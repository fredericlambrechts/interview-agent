"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Briefcase, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PrototypeLandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    companyUrl: '',
    linkedinUrl: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const isFormValid = formData.name && formData.role && formData.companyUrl

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-superswift-black mb-2">SuperSwift</h1>
          <p className="text-superswift-gray-text">Strategic Assessment Interview</p>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-superswift-black">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-superswift-gray-text" />
                  Your Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4 text-superswift-gray-text" />
                  Your Role *
                </Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="CEO / Founder / VP of Sales"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyUrl" className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-superswift-gray-text" />
                  Company Website *
                </Label>
                <Input
                  id="companyUrl"
                  name="companyUrl"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={formData.companyUrl}
                  onChange={handleInputChange}
                  className="min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2 text-sm font-medium">
                  <ExternalLink className="h-4 w-4 text-superswift-gray-text" />
                  Company LinkedIn URL (Optional)
                </Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  placeholder="https://www.linkedin.com/company/yourcompany"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="min-h-[44px]"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link href="/prototype/processing">
                <Button 
                  size="lg" 
                  className="w-full min-h-[44px] text-base bg-gradient-to-r from-superswift-orange to-superswift-orange-light hover:shadow-lg transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid}
                >
                  Begin Assessment
                </Button>
              </Link>
              {!isFormValid && (
                <p className="text-center text-sm text-superswift-gray-text mt-2">
                  Please fill in required fields to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="text-center mt-6">
          <Link href="/prototype/processing" className="text-superswift-orange hover:underline text-sm mx-2">
            Processing →
          </Link>
          <Link href="/prototype/interview" className="text-superswift-orange hover:underline text-sm mx-2">
            Interview →
          </Link>
        </div>
      </div>
    </div>
  )
}