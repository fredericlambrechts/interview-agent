"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Briefcase, Globe, ExternalLink } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"), 
  companyUrl: z
    .string()
    .min(1, "Company domain is required")
    .refine((domain) => {
      // Validate domain format (without protocol)
      const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
      return domainPattern.test(domain);
    }, "Please enter a valid domain (e.g., company.com)"),
  linkedinUrl: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

interface CompanyUrlFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export default function CompanyUrlForm({ onSubmit, isLoading = false }: CompanyUrlFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      companyUrl: "",
      linkedinUrl: ""
    }
  })

  const handleSubmit = async (data: FormData) => {
    // Construct full URL from domain input
    const domain = data.companyUrl.trim()
    const fullUrl = `https://www.${domain}`
    
    // Normalize LinkedIn URL if provided
    let normalizedLinkedinUrl = data.linkedinUrl?.trim() || ''
    if (normalizedLinkedinUrl && !normalizedLinkedinUrl.startsWith('http://') && !normalizedLinkedinUrl.startsWith('https://')) {
      normalizedLinkedinUrl = `https://${normalizedLinkedinUrl}`
    }
    
    await onSubmit({ 
      name: data.name.trim(),
      role: data.role.trim(),
      companyUrl: fullUrl,
      linkedinUrl: normalizedLinkedinUrl
    })
  }

  const name = form.watch('name')
  const role = form.watch('role') 
  const companyUrl = form.watch('companyUrl')
  const isFormValid = name && role && companyUrl

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-superswift-gray-text" />
                        Your Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Smith"
                          className="min-h-[44px]"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Briefcase className="h-4 w-4 text-superswift-gray-text" />
                        Your Role *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="CEO / Founder / VP of Sales"
                          className="min-h-[44px]"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4 text-superswift-gray-text" />
                        Company Website *
                      </FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                            https://www.
                          </span>
                          <Input
                            {...field}
                            placeholder="yourcompany.com"
                            className="min-h-[44px] rounded-l-none"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <ExternalLink className="h-4 w-4 text-superswift-gray-text" />
                        Company LinkedIn URL (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://www.linkedin.com/company/yourcompany"
                          className="min-h-[44px]"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CTA */}
                <div className="pt-2">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full min-h-[44px] text-base"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Starting Assessment...
                      </>
                    ) : (
                      'Begin Assessment'
                    )}
                  </Button>
                  {!isFormValid && (
                    <p className="text-center text-sm text-superswift-gray-text mt-2">
                      Please fill in required fields to continue
                    </p>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}