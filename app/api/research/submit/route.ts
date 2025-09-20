import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory storage for research status (replace with database later)
declare global {
  var researchStatusMap: Map<string, any>
}

if (!global.researchStatusMap) {
  global.researchStatusMap = new Map()
}

function updateResearchStatus(researchId: string, status: any) {
  global.researchStatusMap.set(researchId, status)
}

function getResearchStatus(researchId: string) {
  return global.researchStatusMap.get(researchId)
}

const submitSchema = z.object({
  companyUrl: z.string().url("Invalid URL format")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyUrl } = submitSchema.parse(body)

    // Generate research session ID
    const researchId = `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // TODO: Insert initial record into research_data table
    console.log(`Starting SuperSwift GTM research for: ${companyUrl} with ID: ${researchId}`)

    // Initialize research status
    updateResearchStatus(researchId, {
      status: 'strategic_foundation',
      progress: 5,
      message: 'Initializing SuperSwift GTM analysis...',
      currentPhase: 'STRATEGIC FOUNDATION',
      currentStep: 'Step 1: Core Identity & Business Model',
      artifactsCompleted: 0,
      totalArtifacts: 23,
      estimatedTimeRemaining: 300
    })

    // Trigger Mistral research analysis in background
    triggerMistralResearch(researchId, companyUrl)

    // Return research session ID for status tracking
    return NextResponse.json({
      success: true,
      researchId,
      message: "SuperSwift GTM analysis initiated",
      estimatedDuration: "3-7 minutes"
    })

  } catch (error) {
    console.error('Research submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to initiate research workflow" },
      { status: 500 }
    )
  }
}

async function triggerMistralResearch(researchId: string, companyUrl: string) {
  // Run Mistral analysis in background
  setTimeout(async () => {
    try {
      await performMistralAnalysis(researchId, companyUrl)
    } catch (error) {
      console.error('Mistral analysis failed:', error)
    }
  }, 1000)
}

async function performMistralAnalysis(researchId: string, companyUrl: string) {
  const mistralApiKey = process.env.MISTRAL_API_KEY
  
  if (!mistralApiKey) {
    console.error('MISTRAL_API_KEY not configured')
    updateResearchStatus(researchId, {
      status: 'error',
      progress: 0,
      message: 'Mistral API key not configured',
      error: 'Configuration error'
    })
    return
  }

  // Update progress through different phases
  const progressUpdates = [
    { delay: 10000, progress: 20, phase: 'Strategic Foundation', step: 'Analyzing core identity and business model', artifacts: 3 },
    { delay: 30000, progress: 45, phase: 'Strategic Foundation', step: 'Customer & market intelligence research', artifacts: 8 },
    { delay: 50000, progress: 65, phase: 'Strategy & Positioning', step: 'Competitive landscape analysis', artifacts: 12 },
    { delay: 80000, progress: 85, phase: 'Execution & Operations', step: 'Implementation roadmap & risk assessment', artifacts: 20 }
  ]

  progressUpdates.forEach(({ delay, progress, phase, step, artifacts }) => {
    setTimeout(() => {
      updateResearchStatus(researchId, {
        status: progress < 45 ? 'strategic_foundation' : progress < 85 ? 'strategy_positioning' : 'execution_operations',
        progress,
        message: `${step}...`,
        currentPhase: phase.toUpperCase(),
        currentStep: step,
        artifactsCompleted: artifacts,
        totalArtifacts: 23,
        estimatedTimeRemaining: Math.max(0, Math.ceil((120 - (delay / 1000)) / 1))
      })
    }, delay)
  })

  const systemPrompt = `You are a SuperSwift consultant, specialising in medtech go-to-market strategy writing. You must be super aware of the complexity of this market (slow adoption, complexity in each sub-market, regulatory pathway related aspects are crucial, ...).

When given a company url, you'll carry out the following GTM assessment:

PART 1: STRATEGIC FOUNDATION

Goal: Establish the fundamental business identity, core value, and market position.

• Step 1: Core Identity & Business Model
  o Artifact 1: Company Mission & Vision
  o Artifact 2: Core Offering Definition
  o Artifact 3 (MedTech): Regulatory Pathway & Classification
  o Artifact 4: Revenue Streams & Pricing Model (High-level, summary)

• Step 2: Customer & Market Intelligence
  o Artifact 5: Market Sizing (TAM, SAM, SOM)
  o Artifact 6 (MedTech): Clinical Evidence & KOL Strategy
  o Artifact 7: Ideal Customer Profile (ICP) & Buyer Personas
  o Artifact 8: Customer Pains & Gains (Value Proposition Summary)

PART 2: STRATEGY & POSITIONING

Goal: Define the executable strategy for winning the market, including channels and alliances.

• Step 3: Competitive Landscape
  o Artifact 9: Direct & Indirect Competitors
  o Artifact 10: Competitive Positioning & Differentiation

• Step 4: Channel & Go-to-Market Approach
  o Artifact 11: Channel Strategy Overview (Direct vs. Indirect mix, primary channels)
  o Artifact 12: Sales Process & Methodology (A high-level overview of the sales motion, from lead to close)
  o Artifact 13: GTM Team Structure & Roles (Includes partner management and key stakeholder identification)

• Step 5: Partnership & Alliance Strategy
  o Artifact 14: Strategic Partnership Framework (OEMs, Integrators, Clinical Alliances)
  o Artifact 15: Partner Enablement & Incentive Models

• Step 6: Brand & Messaging
  o Artifact 16: Brand Positioning Statement
  o Artifact 17: Core Messaging Pillars

PART 3: EXECUTION & OPERATIONS

Goal: Create a high-level blueprint for turning strategy into reality, with a focus on risk and scalability.

• Step 7: GTM Operations & Execution Plan
  o Artifact 18 (MedTech): Quality Management System (QMS) Overview
  o Artifact 19: High-Level Implementation Roadmap & Timeline
  o Artifact 20: GTM Process & Tech Stack (A foundational blueprint for key workflows)

• Step 8: Performance Measurement & KPIs
  o Artifact 21: Core GTM KPIs (aligned with strategy)
  o Artifact 22: Strategic GTM Goals

• Step 9: Risk & Mitigation
  o Artifact 23: Comprehensive GTM Risk Assessment (Includes a multi-dimensional risk matrix, not just "Top 3")

Rules:
Do not mention BCG. Use SuperSwift.

Return your analysis as structured JSON with each artifact clearly labeled and organized by the 3 main parts.`

  try {
    console.log(`Starting Mistral API call for ${companyUrl}...`)
    console.log(`Using model: mistral-large-latest`)
    
    const requestBody = {
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Analyze this company: ${companyUrl}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8000
    }
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    // Use Mistral Chat Completions API with agent_id parameter
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log(`Mistral API response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Mistral API error ${response.status}:`, errorText)
      
      // Update status to show error
      updateResearchStatus(researchId, {
        status: 'error',
        progress: 0,
        message: `Mistral API error: ${response.status}`,
        error: `API Error ${response.status}: ${errorText}`
      })
      
      throw new Error(`Mistral API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Mistral API response received successfully')
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error('Invalid response format from Mistral API')
    }
    
    const analysisContent = result.choices[0].message.content

    // Store the completed research data
    const researchData = {
      researchId,
      companyUrl,
      status: 'completed',
      analysisContent,
      completedAt: new Date().toISOString(),
      assessmentSessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Update research status to completed
    updateResearchStatus(researchId, {
      status: 'completed',
      progress: 100,
      message: 'SuperSwift GTM assessment completed! 23 strategic artifacts generated.',
      currentPhase: 'COMPLETED',
      currentStep: 'Ready for strategic assessment interview',
      artifactsCompleted: 23,
      totalArtifacts: 23,
      estimatedTimeRemaining: 0,
      assessmentSessionId: researchData.assessmentSessionId,
      analysisContent
    })

    console.log(`GTM analysis completed for ${researchId}`)
    console.log('Analysis preview:', analysisContent.substring(0, 500) + '...')
    
  } catch (error) {
    console.error('Mistral analysis error:', error)
  }
}