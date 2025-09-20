"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CompanyUrlForm from '@/components/research/CompanyUrlForm'
import { toast } from 'sonner'

interface FormData {
  name: string
  role: string
  companyUrl: string
  linkedinUrl?: string
}

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/research/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        // Store research ID and user info for status tracking
        sessionStorage.setItem('researchId', result.researchId)
        sessionStorage.setItem('userName', data.name)
        sessionStorage.setItem('userRole', data.role)
        if (data.linkedinUrl) {
          sessionStorage.setItem('userLinkedinUrl', data.linkedinUrl)
        }
        
        // Show success message
        toast.success(result.message)
        
        // Navigate to progress page
        router.push(`/progress/${result.researchId}`)
      } else {
        toast.error(result.error || 'Failed to start research')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return <CompanyUrlForm onSubmit={handleSubmit} isLoading={isLoading} />
}