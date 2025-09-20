import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2, 
  Download, 
  Mail, 
  Calendar,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Shield,
  Clock,
  ExternalLink,
  Star,
  Copy
} from "lucide-react"

export default function SummaryScreen() {
  const insights = [
    {
      category: "Business Model",
      score: 85,
      status: "Strong Foundation",
      description: "Clear B2B SaaS model with recurring revenue streams",
      color: "green"
    },
    {
      category: "Market Position", 
      score: 72,
      status: "Competitive Advantage",
      description: "Well-differentiated in regulated healthcare market",
      color: "blue"
    },
    {
      category: "Growth Strategy",
      score: 68,
      status: "Scaling Opportunities",
      description: "Multiple expansion paths identified",
      color: "yellow"
    },
    {
      category: "Risk Mitigation",
      score: 91,
      status: "Comprehensive Approach",
      description: "Strong regulatory compliance and security practices",
      color: "green"
    }
  ]

  const keyFindings = [
    {
      icon: DollarSign,
      title: "Revenue Model",
      value: "$2.3M ARR",
      detail: "Subscription-based with 89% retention rate"
    },
    {
      icon: Users,
      title: "Target Market",
      value: "MedTech Startups",
      detail: "Series A-B companies, 10-100 employees"
    },
    {
      icon: Target,
      title: "Competitive Edge",
      value: "Regulatory Expertise",
      detail: "Specialized FDA pathway knowledge"
    },
    {
      icon: TrendingUp,
      title: "Growth Trajectory",
      value: "127% YoY",
      detail: "Consistent quarter-over-quarter growth"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Avatar className="h-16 w-16 border-4 border-green-200">
              <AvatarImage src="/api/placeholder/64/64" alt="Dr. Sarah Mitchell" />
              <AvatarFallback className="bg-green-600 text-white text-lg">SM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Assessment Complete</h1>
              <p className="text-slate-600">Strategic insights and recommendations ready</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-green-700">Interview Successfully Completed</span>
          </div>
        </div>

        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              Session Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">18:42</div>
                <div className="text-sm text-slate-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">4/4</div>
                <div className="text-sm text-slate-600">Topics Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-600">Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">2,847</div>
                <div className="text-sm text-slate-600">Words Captured</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Findings */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Assessment Results</CardTitle>
            <CardDescription>Key insights from your business discussion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyFindings.map((finding, index) => {
                const Icon = finding.icon
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="font-medium text-slate-900">{finding.title}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{finding.value}</div>
                      <div className="text-sm text-slate-600">{finding.detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Assessment Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Business Readiness Assessment</CardTitle>
            <CardDescription>Comprehensive evaluation across key strategic areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights.map((insight, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{insight.category}</h3>
                    <p className="text-sm text-slate-600">{insight.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{insight.score}/100</div>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        insight.color === 'green' ? 'bg-green-100 text-green-700' :
                        insight.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {insight.status}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={insight.score} 
                  className={`h-2 ${
                    insight.color === 'green' ? '[&>div]:bg-green-500' :
                    insight.color === 'blue' ? '[&>div]:bg-blue-500' :
                    '[&>div]:bg-yellow-500'
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div>
                <div className="text-6xl font-bold text-blue-600 mb-2">79</div>
                <div className="text-xl font-semibold text-slate-900">Overall Strategic Readiness</div>
                <div className="text-slate-600">Strong foundation with clear growth opportunities</div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                {[1,2,3,4].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-blue-600 text-blue-600" />
                ))}
                <Star className="h-6 w-6 text-slate-300" />
                <span className="ml-2 text-slate-600">4.2/5 Strategic Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="h-14 bg-blue-600 hover:bg-blue-700">
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="h-14">
            <Mail className="h-5 w-5 mr-2" />
            Email Summary
          </Button>
          <Button variant="outline" className="h-14">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Follow-up
          </Button>
          <Button variant="outline" className="h-14">
            <Copy className="h-5 w-5 mr-2" />
            Share Results
          </Button>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
            <CardDescription>Immediate actions to enhance your strategic position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Competitive Positioning Analysis</h3>
                  <p className="text-slate-600 text-sm">Deep dive into competitive differentiation opportunities in the regulated healthcare market</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border border-green-200 rounded-lg bg-green-50/30">
                <div className="h-8 w-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Growth Strategy Development</h3>
                  <p className="text-slate-600 text-sm">Develop detailed expansion plans for identified market opportunities</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border border-purple-200 rounded-lg bg-purple-50/30">
                <div className="h-8 w-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900">Operational Excellence Review</h3>
                  <p className="text-slate-600 text-sm">Optimize processes and technology stack for accelerated scaling</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>Session ID: #SW-2024-001</span>
            <span>•</span>
            <span>Completed: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>Confidential & Secure</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-slate-600">All data encrypted and HIPAA compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}