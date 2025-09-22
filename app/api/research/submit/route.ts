import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fetch from 'node-fetch'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function updateResearchStatus(researchId: string, companyUrl: string, status: any) {
  const { error } = await supabase
    .from('research_data')
    .upsert({
      research_id: researchId,
      company_url: companyUrl,
      ...status
    }, {
      onConflict: 'research_id'
    })
  
  if (error) {
    console.error('Database update error:', error)
    throw new Error('Failed to update research status')
  }
}

async function getResearchStatus(researchId: string) {
  const { data, error } = await supabase
    .from('research_data')
    .select('*')
    .eq('research_id', researchId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Database fetch error:', error)
    throw new Error('Failed to get research status')
  }
  
  return data
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

    console.log(`Starting SuperSwift GTM research for: ${companyUrl} with ID: ${researchId}`)

    // Insert initial record into research_data table
    const { error: insertError } = await supabase
      .from('research_data')
      .insert({
        research_id: researchId,
        company_url: companyUrl,
        status: 'strategic_foundation',
        progress_percentage: 5,
        current_phase: 'STRATEGIC FOUNDATION',
        artifacts_completed: 0
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Failed to create research record')
    }

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
    updateResearchStatus(researchId, companyUrl, {
      status: 'failed',
      progress_percentage: 0,
      current_phase: 'ERROR'
    })
    return
  }

  // Update progress through different phases
  const progressUpdates = [
    { delay: 10000, progress: 20, phase: 'Strategic Foundation', step: 'Analyzing core identity and business model', artifacts: 3 },
    { delay: 30000, progress: 45, phase: 'Strategic Foundation', step: 'Customer & market intelligence research', artifacts: 8 },
    { delay: 50000, progress: 65, phase: 'Strategy & Positioning', step: 'Competitive landscape analysis', artifacts: 12 },
    { delay: 80000, progress: 85, phase: 'Execution & Operations', step: 'Implementation roadmap & risk assessment', artifacts: 20 },
    { delay: 100000, progress: 100, phase: 'Execution & Operations', step: 'Finalizing assessment', artifacts: 23 }
  ]

  progressUpdates.forEach(({ delay, progress, phase, step, artifacts }) => {
    setTimeout(async () => {
      await updateResearchStatus(researchId, companyUrl, {
        status: progress < 45 ? 'strategic_foundation' : progress < 85 ? 'strategy_positioning' : progress < 100 ? 'execution_operations' : 'completed',
        progress_percentage: progress,
        current_phase: phase.toUpperCase(),
        artifacts_completed: artifacts
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
    console.log(`Using model: mistral-medium-latest`)
    
    const requestBody = {
      model: 'mistral-medium-latest',
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

    // Use Mistral Chat Completions API with better error handling
    let response
    try {
      response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mistralApiKey}`,
          'User-Agent': 'SuperSwift-Interview-Agent/1.0'
        },
        body: JSON.stringify(requestBody)
      })
    } catch (fetchError) {
      console.error('Fetch error details:', fetchError)
      throw new Error(`Network error calling Mistral API: ${fetchError.message}`)
    }

    console.log(`Mistral API response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Mistral API error ${response.status}:`, errorText)
      
      // Handle rate limiting - return proper error
      if (response.status === 429) {
        console.error('Mistral API rate limit exceeded')
        await updateResearchStatus(researchId, companyUrl, {
          status: 'failed',
          progress_percentage: 0,
          current_phase: 'ERROR'
        })
        return
      }
      
      // Update status to show error for other errors
      await updateResearchStatus(researchId, companyUrl, {
        status: 'failed',
        progress_percentage: 0,
        current_phase: 'ERROR'
      })
      
      throw new Error(`Mistral API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Mistral API response received successfully')
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error('Invalid response format from Mistral API')
    }
    
    const analysisContent = result.choices[0].message.content
    const assessmentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create assessment session record first (required for foreign key)
    const { error: sessionError } = await supabase
      .from('assessment_sessions')
      .insert({
        session_id: assessmentSessionId,
        company_url: companyUrl,
        status: 'ready',
        research_data: { analysis_content: analysisContent },
        artifacts_completed: 23,
        total_artifacts: 23,
        progress_percentage: 100
      })

    if (sessionError) {
      console.error('Failed to create assessment session:', sessionError)
      // Still update research status without session_id using direct update
      const { error: updateError } = await supabase
        .from('research_data')
        .update({
          status: 'completed',
          progress_percentage: 100,
          current_phase: 'COMPLETED',
          artifacts_completed: 23,
          analysis_content: analysisContent,
          completed_at: new Date().toISOString()
        })
        .eq('research_id', researchId)

      if (updateError) {
        console.error('Failed to update research with analysis (no session):', updateError)
      }
    } else {
      // Store the completed research data in database with session_id using direct update
      const { error: updateError } = await supabase
        .from('research_data')
        .update({
          status: 'completed',
          progress_percentage: 100,
          current_phase: 'COMPLETED',
          artifacts_completed: 23,
          analysis_content: analysisContent,
          session_id: assessmentSessionId,
          completed_at: new Date().toISOString()
        })
        .eq('research_id', researchId)

      if (updateError) {
        console.error('Failed to update research with analysis:', updateError)
      }
    }

    console.log(`GTM analysis completed for ${researchId}`)
    console.log('Analysis preview:', analysisContent.substring(0, 500) + '...')
    
  } catch (error) {
    console.error('Mistral analysis error:', error)
  }
}

