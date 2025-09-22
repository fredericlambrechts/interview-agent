import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getResearchStatus(researchId: string) {
  const { data, error } = await supabase
    .from('research_data')
    .select('*')
    .eq('research_id', researchId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Database fetch error:', error)
    return null
  }
  
  return data
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'strategic_foundation':
      return 'Analyzing strategic foundation and business model...'
    case 'strategy_positioning':
      return 'Developing strategy and positioning framework...'
    case 'execution_operations':
      return 'Creating execution and operations plan...'
    case 'completed':
      return 'SuperSwift GTM assessment completed! 23 strategic artifacts generated.'
    case 'failed':
      return 'API rate limit exceeded. Please wait a few minutes and try again.'
    default:
      return 'Processing research request...'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const researchId = id

    // Get research status from database
    const researchData = await getResearchStatus(researchId)
    
    if (researchData) {
      return NextResponse.json({
        success: true,
        researchId,
        status: researchData.status,
        progress: researchData.progress_percentage || 0,
        message: getStatusMessage(researchData.status, researchData.current_phase),
        currentPhase: researchData.current_phase,
        currentStep: researchData.current_phase,
        artifactsCompleted: researchData.artifacts_completed || 0,
        totalArtifacts: 23,
        estimatedTimeRemaining: 0,
        assessmentSessionId: researchData.session_id,
        companyUrl: researchData.company_url,
        analysisContent: researchData.analysis_content,
        completedAt: researchData.completed_at,
        error: researchData.error_message
      })
    }

    // If no research found, return not found
    return NextResponse.json(
      { success: false, error: "Research session not found" },
      { status: 404 }
    )

  } catch (error) {
    console.error('Research status error:', error)
    
    return NextResponse.json(
      { success: false, error: "Failed to get research status" },
      { status: 500 }
    )
  }
}

