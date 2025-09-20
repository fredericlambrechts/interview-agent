"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  History,
  MessageSquare
} from 'lucide-react'

// Artifact data structure
interface Artifact {
  id: number
  title: string
  icon: React.ReactNode
  confidence: number
  version: string
  lastUpdated: string
  outstandingQuestions: number
  status: 'draft' | 'validated' | 'published'
  content: React.ReactNode
}

// Sample artifacts data with realistic MedTech content
const artifacts: Artifact[] = [
  // PART 1: Strategic Foundation
  {
    id: 1,
    title: "Company Mission & Vision",
    icon: <Target className="w-4 h-4" />,
    confidence: 95,
    version: "1.0",
    lastUpdated: "2 hours ago",
    outstandingQuestions: 0,
    status: 'validated',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Mission Statement</h3>
          <p className="text-gray-700 leading-relaxed">
            To democratize brain health by providing AI-powered neuroimaging analysis that enables 
            early detection, precise diagnosis, and personalized treatment of neurological conditions, 
            ultimately improving patient outcomes and reducing healthcare costs globally.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Vision Statement</h3>
          <p className="text-gray-700 leading-relaxed">
            To become the global standard for AI-driven brain health analytics, empowering healthcare 
            providers worldwide with the tools to transform neurological care from reactive treatment 
            to proactive prevention and precision medicine.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Core Values</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Scientific Rigor:</strong> Evidence-based AI development with clinical validation</li>
            <li>• <strong>Patient First:</strong> Every innovation focused on improving patient outcomes</li>
            <li>• <strong>Global Impact:</strong> Accessible brain health solutions for all healthcare systems</li>
            <li>• <strong>Collaborative Innovation:</strong> Partnership-driven approach with clinicians</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Core Offering Definition",
    icon: <FileText className="w-4 h-4" />,
    confidence: 92,
    version: "2.1",
    lastUpdated: "1 day ago",
    outstandingQuestions: 1,
    status: 'validated',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Primary Offering</h3>
          <p className="text-gray-700 leading-relaxed">
            <strong>icobrain</strong> - AI-powered neuroimaging analysis platform that provides automated, 
            quantitative assessment of brain MRI scans for multiple sclerosis, dementia, and other 
            neurological conditions. Delivers clinically validated biomarkers and progression tracking 
            in minutes instead of hours.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Key Product Features</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Automated Lesion Detection:</strong> MS lesion segmentation with 95%+ accuracy</li>
            <li>• <strong>Brain Volume Analysis:</strong> Longitudinal atrophy measurements</li>
            <li>• <strong>Multi-Disease Support:</strong> MS, Alzheimer's, Parkinson's assessment</li>
            <li>• <strong>Clinical Integration:</strong> PACS/RIS integration with standard workflows</li>
            <li>• <strong>Regulatory Compliance:</strong> CE marked, FDA cleared for clinical use</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Target Use Cases</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Clinical Diagnosis</h4>
              <p className="text-blue-700 text-sm mt-1">Support differential diagnosis with quantitative biomarkers</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Treatment Monitoring</h4>
              <p className="text-green-700 text-sm mt-1">Track disease progression and treatment response</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Clinical Trials</h4>
              <p className="text-purple-700 text-sm mt-1">Standardized endpoints for drug development</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">Population Health</h4>
              <p className="text-orange-700 text-sm mt-1">Large-scale brain health screening programs</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Outstanding Questions (1)
          </h4>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>1. Should we emphasize the research capabilities more for academic medical centers?</li>
          </ul>
          <div className="mt-3 space-x-2">
            <Button size="sm" variant="outline">Add Question</Button>
            <Button size="sm" variant="outline">Resolve Question</Button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Ideal Customer Profile",
    icon: <Users className="w-4 h-4" />,
    confidence: 88,
    version: "1.3",
    lastUpdated: "3 hours ago",
    outstandingQuestions: 2,
    status: 'draft',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Primary Customer Segments</h3>
          
          <div className="grid gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Academic Medical Centers</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Organization Size:</strong> 500+ beds<br/>
                  <strong>Department:</strong> Neurology/Radiology<br/>
                  <strong>Geography:</strong> North America, Europe
                </div>
                <div>
                  <strong>Annual Revenue:</strong> $1B+<br/>
                  <strong>IT Budget:</strong> $50M+<br/>
                  <strong>Research Focus:</strong> High
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Large Health Systems</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Organization Size:</strong> 200-500 beds<br/>
                  <strong>Network:</strong> Multi-site systems<br/>
                  <strong>Geography:</strong> US, Western Europe
                </div>
                <div>
                  <strong>Annual Revenue:</strong> $500M-2B<br/>
                  <strong>Patient Volume:</strong> High MS/dementia<br/>
                  <strong>Tech Adoption:</strong> Early majority
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Key Decision Makers</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">CN</div>
              <div>
                <div className="font-medium">Chief of Neurology</div>
                <div className="text-sm text-gray-600">Clinical champion, workflow integration advocate</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">CR</div>
              <div>
                <div className="font-medium">Chief of Radiology</div>
                <div className="text-sm text-gray-600">Technical evaluator, PACS integration requirements</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">CIO</div>
              <div>
                <div className="font-medium">Chief Information Officer</div>
                <div className="text-sm text-gray-600">IT security, compliance, technical implementation</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Pain Points & Motivations</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-red-700 mb-2">Current Challenges</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Manual image analysis taking 2-4 hours per case</li>
                <li>• Inconsistent measurements between radiologists</li>
                <li>• Limited quantitative data for treatment decisions</li>
                <li>• Difficulty tracking disease progression over time</li>
                <li>• Lack of standardized reporting for clinical trials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-700 mb-2">Success Drivers</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Reduce report turnaround time by 80%</li>
                <li>• Improve diagnostic confidence with quantitative data</li>
                <li>• Enhance patient outcomes through precision medicine</li>
                <li>• Increase clinical trial participation and revenue</li>
                <li>• Differentiate as a center of excellence</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Outstanding Questions (2)
          </h4>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>1. Should we prioritize private practice neurologists as a secondary segment?</li>
            <li>2. What's the optimal organization size threshold for our enterprise offering?</li>
          </ul>
          <div className="mt-3 space-x-2">
            <Button size="sm" variant="outline">Add Question</Button>
            <Button size="sm" variant="outline">Resolve Question</Button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 21,
    title: "Core GTM KPIs",
    icon: <TrendingUp className="w-4 h-4" />,
    confidence: 85,
    version: "1.1",
    lastUpdated: "1 week ago",
    outstandingQuestions: 3,
    status: 'draft',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Sales & Revenue Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$2.5M</div>
              <div className="text-sm text-gray-600">Annual Recurring Revenue Target</div>
              <div className="text-xs text-green-600 mt-1">↗ 150% YoY growth</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-600">New Customer Acquisitions</div>
              <div className="text-xs text-gray-500 mt-1">Target per quarter</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$167K</div>
              <div className="text-sm text-gray-600">Average Contract Value</div>
              <div className="text-xs text-gray-500 mt-1">Enterprise segment</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">18mo</div>
              <div className="text-sm text-gray-600">Average Sales Cycle</div>
              <div className="text-xs text-red-600 mt-1">Target: 12 months</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Success & Retention</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Customer Retention Rate</span>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">94%</div>
                <div className="text-xs text-gray-500">Annual retention</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Net Revenue Retention</span>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">115%</div>
                <div className="text-xs text-gray-500">Including expansion</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Time to First Value</span>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">45 days</div>
                <div className="text-xs text-gray-500">From contract signing</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Marketing & Pipeline Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded">
              <div className="text-xl font-bold">250</div>
              <div className="text-sm text-gray-600">Marketing Qualified Leads</div>
              <div className="text-xs text-gray-500">Per quarter</div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xl font-bold">15%</div>
              <div className="text-sm text-gray-600">MQL to SQL Conversion</div>
              <div className="text-xs text-green-600">Above target</div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xl font-bold">$3.2M</div>
              <div className="text-sm text-gray-600">Sales Pipeline Value</div>
              <div className="text-xs text-gray-500">Qualified opportunities</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Outstanding Questions (3)
          </h4>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>1. Should we track clinical outcome metrics as part of customer success?</li>
            <li>2. What's the optimal CAC:LTV ratio target for our market segment?</li>
            <li>3. How do we measure partner channel contribution to pipeline?</li>
          </ul>
        </div>
      </div>
    )
  }
]

// Define artifact parts structure
const artifactParts = [
  {
    id: 1,
    title: "Strategic Foundation",
    artifacts: [1, 2, 3, 4, 5, 6, 7, 8],
    description: "8 artifacts"
  },
  {
    id: 2,
    title: "Strategy & Positioning", 
    artifacts: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    description: "9 artifacts"
  },
  {
    id: 3,
    title: "Execution & Operations",
    artifacts: [18, 19, 20, 21, 22, 23],
    description: "6 artifacts"
  }
]

// All 23 artifact titles for navigation
const allArtifacts = [
  { id: 1, title: "Company Mission & Vision", icon: <Target className="w-4 h-4" /> },
  { id: 2, title: "Core Offering Definition", icon: <FileText className="w-4 h-4" /> },
  { id: 3, title: "Regulatory Pathway", icon: <Shield className="w-4 h-4" /> },
  { id: 4, title: "Revenue Streams & Pricing", icon: <DollarSign className="w-4 h-4" /> },
  { id: 5, title: "Market Sizing", icon: <TrendingUp className="w-4 h-4" /> },
  { id: 6, title: "Clinical Evidence", icon: <FileText className="w-4 h-4" /> },
  { id: 7, title: "Ideal Customer Profile", icon: <Users className="w-4 h-4" /> },
  { id: 8, title: "Customer Pains & Gains", icon: <Target className="w-4 h-4" /> },
  { id: 9, title: "Direct & Indirect Competitors", icon: <Users className="w-4 h-4" /> },
  { id: 10, title: "Competitive Positioning", icon: <Target className="w-4 h-4" /> },
  { id: 11, title: "Channel Strategy", icon: <TrendingUp className="w-4 h-4" /> },
  { id: 12, title: "Sales Process & Methodology", icon: <FileText className="w-4 h-4" /> },
  { id: 13, title: "GTM Team Structure", icon: <Users className="w-4 h-4" /> },
  { id: 14, title: "Strategic Partnership Framework", icon: <Users className="w-4 h-4" /> },
  { id: 15, title: "Partner Enablement", icon: <TrendingUp className="w-4 h-4" /> },
  { id: 16, title: "Brand Positioning Statement", icon: <Target className="w-4 h-4" /> },
  { id: 17, title: "Core Messaging Pillars", icon: <MessageSquare className="w-4 h-4" /> },
  { id: 18, title: "Quality Management System", icon: <Shield className="w-4 h-4" /> },
  { id: 19, title: "Implementation Roadmap", icon: <Clock className="w-4 h-4" /> },
  { id: 20, title: "GTM Process & Tech Stack", icon: <FileText className="w-4 h-4" /> },
  { id: 21, title: "Core GTM KPIs", icon: <TrendingUp className="w-4 h-4" /> },
  { id: 22, title: "Strategic GTM Goals", icon: <Target className="w-4 h-4" /> },
  { id: 23, title: "GTM Risk Assessment", icon: <AlertCircle className="w-4 h-4" /> }
]

function ConfidenceMeter({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }
  
  const dots = Array.from({ length: 5 }, (_, i) => (
    <div
      key={i}
      className={`w-2 h-2 rounded-full ${
        i < Math.floor(score / 20) ? getColor(score).replace('text-', 'bg-') : 'bg-gray-300'
      }`}
    />
  ))
  
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">{dots}</div>
      <span className={`text-sm font-medium ml-2 ${getColor(score)}`}>{score}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: 'draft' | 'validated' | 'published' }) {
  const variants = {
    draft: { variant: "secondary" as const, icon: <Clock className="w-3 h-3" /> },
    validated: { variant: "default" as const, icon: <CheckCircle className="w-3 h-3" /> },
    published: { variant: "default" as const, icon: <Eye className="w-3 h-3" /> }
  }
  
  return (
    <Badge variant={variants[status].variant} className="text-xs">
      {variants[status].icon}
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  )
}

export default function AssessmentReportPrototype() {
  const [activeArtifact, setActiveArtifact] = useState(7) // Start with ICP
  const [expandedParts, setExpandedParts] = useState([1, 2, 3]) // All parts expanded by default
  
  const currentArtifact = artifacts.find(a => a.id === activeArtifact) || artifacts[2] // Default to ICP
  const currentArtifactInfo = allArtifacts.find(a => a.id === activeArtifact)
  
  const togglePart = (partId: number) => {
    setExpandedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Report</h1>
            <p className="text-gray-600">icometrix - Go-to-Market Strategy Analysis</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" size="sm">Print Report</Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Report Progress</div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">18 of 23 artifacts completed</div>
              </div>
              
              <div className="space-y-4">
                {artifactParts.map((part) => (
                  <div key={part.id}>
                    <button
                      onClick={() => togglePart(part.id)}
                      className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded"
                    >
                      <div>
                        <div className="font-medium text-gray-900">PART {part.id}: {part.title}</div>
                        <div className="text-xs text-gray-500">{part.description}</div>
                      </div>
                      <div className="text-gray-400">
                        {expandedParts.includes(part.id) ? '−' : '+'}
                      </div>
                    </button>
                    
                    {expandedParts.includes(part.id) && (
                      <div className="ml-4 mt-2 space-y-1">
                        {part.artifacts.map((artifactId) => {
                          const artifactData = allArtifacts.find(a => a.id === artifactId)
                          const hasContent = artifacts.find(a => a.id === artifactId)
                          const isActive = activeArtifact === artifactId
                          
                          return (
                            <button
                              key={artifactId}
                              onClick={() => setActiveArtifact(artifactId)}
                              className={`w-full text-left p-2 rounded text-sm flex items-center space-x-2 ${
                                isActive 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="text-xs font-mono text-gray-400 w-6">{artifactId}.</span>
                              {artifactData?.icon}
                              <span className="flex-1">{artifactData?.title}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                hasContent ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-mono text-gray-500">#{currentArtifact.id}</div>
                  {currentArtifactInfo?.icon}
                  <div>
                    <CardTitle className="text-xl">{currentArtifact.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Version {currentArtifact.version} • Last updated {currentArtifact.lastUpdated}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status={currentArtifact.status} />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <ConfidenceMeter score={currentArtifact.confidence} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                  
                  {currentArtifact.outstandingQuestions > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {currentArtifact.outstandingQuestions} Questions
                    </Badge>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {currentArtifact.content}
              
              {/* Placeholder content for artifacts without detailed content */}
              {!artifacts.find(a => a.id === activeArtifact) && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">{currentArtifactInfo?.title}</h3>
                  <p>This artifact is currently being processed.</p>
                  <p className="text-sm mt-1">Content will be available shortly.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}