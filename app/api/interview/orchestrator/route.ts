import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Artifact structure interfaces
interface ArtifactInfo {
  id: string
  name: string
  key: string
}

interface StepInfo {
  id: string
  name: string
  artifacts: ArtifactInfo[]
}

interface PartInfo {
  name: string
  steps: StepInfo[]
}

// Schema for orchestrator requests
const orchestratorSchema = z.object({
  sessionId: z.string(),
  currentStep: z.string().optional(),
  currentArtifact: z.string().optional(),
  conversationContext: z.string().optional()
})

// Define the 23-artifact structure
const ARTIFACT_STRUCTURE = {
  part1: {
    name: 'Strategic Foundation',
    steps: [
      {
        id: 'identity',
        name: 'Core Identity & Business Model',
        artifacts: [
          { id: 'artifact_1', name: 'Company Mission & Vision', key: 'mission_vision' },
          { id: 'artifact_2', name: 'Core Offering Definition', key: 'core_offering' },
          { id: 'artifact_3', name: 'Regulatory Pathway & Classification', key: 'regulatory_pathway' },
          { id: 'artifact_4', name: 'Revenue Streams & Pricing Model', key: 'revenue_streams' }
        ]
      },
      {
        id: 'market',
        name: 'Customer & Market Intelligence',
        artifacts: [
          { id: 'artifact_5', name: 'Market Sizing (TAM, SAM, SOM)', key: 'market_sizing' },
          { id: 'artifact_6', name: 'Clinical Evidence & KOL Strategy', key: 'clinical_evidence' },
          { id: 'artifact_7', name: 'Ideal Customer Profile & Buyer Personas', key: 'icp_personas' },
          { id: 'artifact_8', name: 'Customer Pains & Gains', key: 'customer_pains_gains' }
        ]
      }
    ]
  },
  part2: {
    name: 'Strategy & Positioning',
    steps: [
      {
        id: 'competitive',
        name: 'Competitive Landscape',
        artifacts: [
          { id: 'artifact_9', name: 'Direct & Indirect Competitors', key: 'competitors' },
          { id: 'artifact_10', name: 'Competitive Positioning & Differentiation', key: 'positioning' }
        ]
      },
      {
        id: 'gtm',
        name: 'Channel & Go-to-Market',
        artifacts: [
          { id: 'artifact_11', name: 'Channel Strategy Overview', key: 'channel_strategy' },
          { id: 'artifact_12', name: 'Sales Process & Methodology', key: 'sales_process' },
          { id: 'artifact_13', name: 'GTM Team Structure & Roles', key: 'team_structure' }
        ]
      },
      {
        id: 'partnerships',
        name: 'Partnership & Alliance Strategy',
        artifacts: [
          { id: 'artifact_14', name: 'Strategic Partnership Framework', key: 'partnership_framework' },
          { id: 'artifact_15', name: 'Partner Enablement & Incentive Models', key: 'partner_enablement' }
        ]
      },
      {
        id: 'messaging',
        name: 'Brand & Messaging',
        artifacts: [
          { id: 'artifact_16', name: 'Brand Positioning Statement', key: 'brand_positioning' },
          { id: 'artifact_17', name: 'Core Messaging Pillars', key: 'messaging_pillars' }
        ]
      }
    ]
  },
  part3: {
    name: 'Execution & Operations',
    steps: [
      {
        id: 'operations',
        name: 'GTM Operations & Execution',
        artifacts: [
          { id: 'artifact_18', name: 'Quality Management System Overview', key: 'qms_overview' },
          { id: 'artifact_19', name: 'Implementation Roadmap & Timeline', key: 'implementation_roadmap' },
          { id: 'artifact_20', name: 'GTM Process & Tech Stack', key: 'process_tech_stack' }
        ]
      },
      {
        id: 'measurement',
        name: 'Performance Measurement & KPIs',
        artifacts: [
          { id: 'artifact_21', name: 'Core GTM KPIs', key: 'core_kpis' },
          { id: 'artifact_22', name: 'Strategic GTM Goals', key: 'strategic_goals' }
        ]
      },
      {
        id: 'risk',
        name: 'Risk & Mitigation',
        artifacts: [
          { id: 'artifact_23', name: 'Comprehensive GTM Risk Assessment', key: 'risk_assessment' }
        ]
      }
    ]
  }
}

interface ResearchStatus {
  analysisContent?: string;
  [key: string]: unknown;
}

interface ArtifactInfo {
  part1?: Record<string, unknown>;
  part2?: Record<string, unknown>;
  part3?: Record<string, unknown>;
  [key: string]: unknown;
}

// Note: DynamicQuestion interface reserved for future use
// interface DynamicQuestion {
//   id: string;
//   type: string;
//   artifactId: string;
//   question: string;
//   followUps: string[];
// }

// Get research data from database
async function getResearchData(sessionId: string): Promise<ResearchStatus | null> {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('research_data, company_url')
      .eq('session_id', sessionId)
      .single()

    if (error || !data) {
      console.error('Failed to fetch research data:', error)
      return null
    }

    console.log('Research data fetched:', { 
      hasResearchData: !!data.research_data,
      hasAnalysisContent: !!data.research_data?.analysis_content,
      companyUrl: data.company_url 
    })

    return {
      analysisContent: data.research_data?.analysis_content || '',
      companyUrl: data.company_url || ''
    }
  } catch (error) {
    console.error('Error fetching research data:', error)
    return null
  }
}

// Parse research analysis to extract artifact data
function parseResearchAnalysis(analysisContent: string): ArtifactInfo {
  try {
    // The analysis content contains structured text with artifacts
    // Parse it to extract specific artifact information
    const artifacts: ArtifactInfo = {}
    
    // Extract different sections
    if (analysisContent.includes('PART 1: STRATEGIC FOUNDATION')) {
      artifacts.part1 = extractPartData(analysisContent, 'PART 1: STRATEGIC FOUNDATION', 'PART 2: STRATEGY & POSITIONING')
    }
    if (analysisContent.includes('PART 2: STRATEGY & POSITIONING')) {
      artifacts.part2 = extractPartData(analysisContent, 'PART 2: STRATEGY & POSITIONING', 'PART 3: EXECUTION & OPERATIONS')
    }
    if (analysisContent.includes('PART 3: EXECUTION & OPERATIONS')) {
      artifacts.part3 = extractPartData(analysisContent, 'PART 3: EXECUTION & OPERATIONS', null)
    }
    
    return artifacts
  } catch (error) {
    console.error('Error parsing research analysis:', error)
    return {}
  }
}

function extractPartData(content: string, startMarker: string, endMarker: string | null): Record<string, unknown> {
  const startIndex = content.indexOf(startMarker)
  const endIndex = endMarker ? content.indexOf(endMarker) : content.length
  
  if (startIndex === -1) return {}
  
  const partContent = content.substring(startIndex, endIndex)
  
  // Extract artifact content based on markers
  const artifactData: Record<string, unknown> = {}
  
  // Parse each artifact based on **Artifact X:** pattern
  const artifactRegex = /\*\*Artifact (\d+):(.*?)\*\*([\s\S]*?)(?=\*\*Artifact \d+:|$)/g
  let match
  
  while ((match = artifactRegex.exec(partContent)) !== null) {
    const artifactNumber = match[1]
    const artifactTitle = match[2].trim()
    const artifactContent = match[3].trim()
    
    artifactData[`artifact_${artifactNumber}`] = {
      title: artifactTitle,
      content: artifactContent
    }
  }
  
  return artifactData
}

interface QuestionData {
  questions: Array<{
    type: string;
    question: string;
    followUps: string[];
  }>;
  context: string;
  artifactInfo: ArtifactDetail | null;
}

// Generate contextual questions based on research data
function generateContextualQuestions(
  researchData: ResearchStatus | null,
  currentStep: string,
  currentArtifact: string
): QuestionData {
  const questions: Array<{
    type: string;
    question: string;
    followUps: string[];
  }> = []
  
  // Get the artifact structure
  const artifactInfo = findArtifactInfo(currentArtifact)
  if (!artifactInfo) return { questions: [], context: '' }
  
  // Extract research insights for this artifact
  const analysisContent = researchData.analysisContent || ''
  const artifactData = parseResearchAnalysis(analysisContent)
  
  // Generate questions based on artifact type and research insights
  switch (artifactInfo.key) {
    case 'mission_vision':
      questions.push({
        type: 'validation',
        question: "Let's start by discussing your company's mission. Based on our research, we understand you're focused on revolutionizing healthcare through AI. Can you tell me more about your core mission and how it drives your strategic decisions?",
        followUps: [
          "How has this mission evolved since founding?",
          "What specific patient outcomes are you targeting?"
        ]
      })
      break
      
    case 'regulatory_pathway':
      questions.push({
        type: 'exploration',
        question: "Regulatory approval is critical in medtech. Can you walk me through your current regulatory status and strategy? Are you pursuing FDA 510(k), De Novo, or another pathway?",
        followUps: [
          "What's your timeline for FDA submission?",
          "Are you pursuing CE marking in parallel?",
          "How are you handling clinical validation requirements?"
        ]
      })
      break
      
    case 'icp_personas':
      questions.push({
        type: 'refinement',
        question: "Our research identified academic medical centers and large health systems as potential targets. Who would you say is your ideal first customer, and who are the key decision makers you need to influence?",
        followUps: [
          "Is the CMO or CIO more critical for your sale?",
          "How does the payer factor into the decision?",
          "What's the typical buying committee composition?"
        ]
      })
      break
      
    case 'competitors':
      questions.push({
        type: 'strategic',
        question: "In the competitive landscape, we see players like Aidoc and Zebra Medical. How do you differentiate your offering, and what's your unique value proposition versus these competitors?",
        followUps: [
          "What's your primary competitive advantage?",
          "How do you handle competitive objections?",
          "Are there any partnership opportunities with competitors?"
        ]
      })
      break
      
    default:
      questions.push({
        type: 'general',
        question: `Let's discuss ${artifactInfo.name}. Based on our research, what would you highlight as the key considerations here?`,
        followUps: []
      })
  }
  
  // Add research context
  const context = artifactData[currentArtifact]?.content || ''
  
  return {
    questions,
    context,
    artifactInfo
  }
}

interface ArtifactDetail {
  id: string;
  name: string;
  description: string;
  part: string;
  step: string;
}

function findArtifactInfo(artifactId: string): ArtifactDetail | null {
  for (const part of Object.values(ARTIFACT_STRUCTURE) as PartInfo[]) {
    for (const step of part.steps) {
      for (const artifact of step.artifacts) {
        if (artifact.id === artifactId) {
          return {
            ...artifact,
            stepId: step.id,
            stepName: step.name,
            partName: part.name
          }
        }
      }
    }
  }
  return null
}

interface Progress {
  totalArtifacts: number;
  completedArtifacts: number;
  inProgressArtifacts: number;
  percentComplete: number;
  currentStep?: string;
  currentPart?: string;
}

// Calculate interview progress
function calculateProgress(sessionId: string): Progress {
  // Get conversation data from global storage
  const conversationData = global.conversationData?.get(sessionId) || []
  
  // Track completed artifacts
  const completedArtifacts = new Set<string>()
  const inProgressArtifacts = new Set<string>()
  
  // Analyze conversation to determine completed artifacts
  conversationData.forEach((entry: unknown) => {
    const e = entry as Record<string, unknown>;
    if (e.artifact) {
      const metadata = e.metadata as Record<string, unknown>;
      if (metadata?.status === 'completed') {
        completedArtifacts.add(e.artifact as string)
      } else if (metadata?.status === 'in_progress') {
        inProgressArtifacts.add(e.artifact as string)
      }
    }
  })
  
  // Calculate overall progress
  const totalArtifacts = 23
  const completed = completedArtifacts.size
  const inProgress = inProgressArtifacts.size
  const progressPercentage = Math.round(((completed + inProgress * 0.5) / totalArtifacts) * 100)
  
  // Determine current phase
  let currentPhase = 'part1'
  if (completed > 8) currentPhase = 'part2'
  if (completed > 17) currentPhase = 'part3'
  
  return {
    completedArtifacts: Array.from(completedArtifacts),
    inProgressArtifacts: Array.from(inProgressArtifacts),
    totalArtifacts,
    progressPercentage,
    currentPhase,
    artifactsRemaining: totalArtifacts - completed
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, currentStep, currentArtifact } = orchestratorSchema.parse(body)
    
    // Get research data for this session
    const researchData = await getResearchData(sessionId)
    if (!researchData) {
      return NextResponse.json(
        { success: false, error: 'Research data not found for session' },
        { status: 404 }
      )
    }
    
    // Generate contextual questions and guidance
    const questionData = generateContextualQuestions(
      researchData,
      currentStep || 'identity',
      currentArtifact || 'artifact_1'
    )
    
    // Calculate current progress
    const progress = calculateProgress(sessionId)
    
    // Determine next artifact to discuss
    const nextArtifact = determineNextArtifact(progress.completedArtifacts, currentArtifact)
    
    return NextResponse.json({
      success: true,
      sessionId,
      currentArtifact: currentArtifact || 'artifact_1',
      nextArtifact,
      questions: questionData.questions,
      context: questionData.context,
      artifactInfo: questionData.artifactInfo,
      progress,
      researchInsights: {
        companyUrl: researchData.companyUrl,
        hasAnalysis: !!researchData.analysisContent
      }
    })
    
  } catch (error) {
    console.error('Orchestrator error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to orchestrate interview' },
      { status: 500 }
    )
  }
}

function determineNextArtifact(completedArtifacts: string[]): string {
  // Get all artifacts in order
  const allArtifacts: string[] = []
  for (const part of Object.values(ARTIFACT_STRUCTURE) as PartInfo[]) {
    for (const step of part.steps) {
      for (const artifact of step.artifacts) {
        allArtifacts.push(artifact.id)
      }
    }
  }
  
  // Find the next uncompleted artifact
  for (const artifactId of allArtifacts) {
    if (!completedArtifacts.includes(artifactId)) {
      return artifactId
    }
  }
  
  // All artifacts completed
  return 'completed'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Session ID required' },
      { status: 400 }
    )
  }
  
  // Get current progress
  const progress = calculateProgress(sessionId)
  
  // Get research data
  const researchData = await getResearchData(sessionId)
  
  return NextResponse.json({
    success: true,
    sessionId,
    progress,
    artifactStructure: ARTIFACT_STRUCTURE,
    hasResearchData: !!researchData
  })
}