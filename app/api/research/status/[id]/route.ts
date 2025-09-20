import { NextRequest, NextResponse } from 'next/server'

// Access the same in-memory storage from submit route
declare global {
  var researchStatusMap: Map<string, any>
}

if (!global.researchStatusMap) {
  global.researchStatusMap = new Map()
}

function getResearchStatus(researchId: string) {
  return global.researchStatusMap.get(researchId)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const researchId = id

    // Get real research status from in-memory storage
    const realStatus = getResearchStatus(researchId)
    
    if (realStatus) {
      return NextResponse.json({
        success: true,
        researchId,
        ...realStatus
      })
    }

    // If no real status found, return not found
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

// Simulate sophisticated consulting research progress
function getSimulatedStatus(researchId: string) {
  const startTime = parseInt(researchId.split('_')[1])
  const elapsed = Date.now() - startTime
  const totalDuration = 300000 // 5 minutes for comprehensive analysis
  
  if (elapsed < 60000) {
    // PART 1: STRATEGIC FOUNDATION - Steps 1-2 (Artifacts 1-8)
    const currentArtifact = Math.min(8, Math.ceil((elapsed / 60000) * 8))
    return {
      status: 'strategic_foundation',
      progress: Math.min(35, (elapsed / 60000) * 35),
      message: `Analyzing strategic foundation (Artifact ${currentArtifact}/8): Core identity, business model, and market intelligence...`,
      currentPhase: 'STRATEGIC FOUNDATION',
      currentStep: elapsed < 30000 ? 'Step 1: Core Identity & Business Model' : 'Step 2: Customer & Market Intelligence',
      artifactsCompleted: currentArtifact - 1,
      totalArtifacts: 23,
      estimatedTimeRemaining: Math.max(0, Math.ceil((totalDuration - elapsed) / 1000))
    }
  } else if (elapsed < 180000) {
    // PART 2: STRATEGY & POSITIONING - Steps 3-6 (Artifacts 9-17)
    const currentArtifact = Math.min(17, 8 + Math.ceil(((elapsed - 60000) / 120000) * 9))
    const step = elapsed < 90000 ? 'Step 3: Competitive Landscape' :
                 elapsed < 120000 ? 'Step 4: Channel & Go-to-Market' :
                 elapsed < 150000 ? 'Step 5: Partnership & Alliance Strategy' :
                 'Step 6: Brand & Messaging'
    return {
      status: 'strategy_positioning',
      progress: Math.min(75, 35 + ((elapsed - 60000) / 120000) * 40),
      message: `Developing strategy & positioning (Artifact ${currentArtifact}/23): ${step.split(': ')[1]}...`,
      currentPhase: 'STRATEGY & POSITIONING',
      currentStep: step,
      artifactsCompleted: currentArtifact - 1,
      totalArtifacts: 23,
      estimatedTimeRemaining: Math.max(0, Math.ceil((totalDuration - elapsed) / 1000))
    }
  } else if (elapsed < 280000) {
    // PART 3: EXECUTION & OPERATIONS - Steps 7-9 (Artifacts 18-23)
    const currentArtifact = Math.min(23, 17 + Math.ceil(((elapsed - 180000) / 100000) * 6))
    const step = elapsed < 220000 ? 'Step 7: GTM Operations & Execution Plan' :
                 elapsed < 250000 ? 'Step 8: Performance Measurement & KPIs' :
                 'Step 9: Risk & Mitigation'
    return {
      status: 'execution_operations',
      progress: Math.min(95, 75 + ((elapsed - 180000) / 100000) * 20),
      message: `Finalizing execution & operations (Artifact ${currentArtifact}/23): ${step.split(': ')[1]}...`,
      currentPhase: 'EXECUTION & OPERATIONS',
      currentStep: step,
      artifactsCompleted: currentArtifact - 1,
      totalArtifacts: 23,
      estimatedTimeRemaining: Math.max(0, Math.ceil((totalDuration - elapsed) / 1000))
    }
  } else if (elapsed < 300000) {
    return {
      status: 'finalizing_report',
      progress: Math.min(99, 95 + ((elapsed - 280000) / 20000) * 4),
      message: 'Finalizing comprehensive GTM assessment report...',
      currentPhase: 'FINALIZING',
      currentStep: 'Compiling 23 strategic artifacts',
      artifactsCompleted: 23,
      totalArtifacts: 23,
      estimatedTimeRemaining: Math.max(0, Math.ceil((totalDuration - elapsed) / 1000))
    }
  } else {
    return {
      status: 'completed',
      progress: 100,
      message: 'SuperSwift GTM assessment completed! 23 strategic artifacts generated.',
      currentPhase: 'COMPLETED',
      currentStep: 'Ready for strategic assessment interview',
      artifactsCompleted: 23,
      totalArtifacts: 23,
      estimatedTimeRemaining: 0,
      assessmentSessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }
}