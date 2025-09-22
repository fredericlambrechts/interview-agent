import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory storage for assessment sessions (replace with database later)
interface AssessmentSession {
  sessionId: string;
  status: string;
  startedAt: string;
  lastUpdated: string;
  completedAt?: string;
  artifacts: Record<string, ArtifactData>;
  stepData?: Record<string, unknown>;
  conversationSummary?: unknown[];
  finalStats?: FinalStats;
}

interface ArtifactData {
  status: string;
  confidence?: number;
  responses?: unknown;
  metadata?: Record<string, unknown>;
  completedAt?: string;
}

interface FinalStats {
  totalArtifacts: number;
  completedArtifacts: number;
  averageConfidence: number;
  duration: number;
}

interface UpdateData {
  artifactId?: string;
  status?: string;
  confidence?: number;
  responses?: unknown;
  metadata?: Record<string, unknown>;
  stepId?: string;
  completionTime?: string;
  finalArtifact?: string;
  interviewMethod?: string;
}

declare global {
  var assessmentSessions: Map<string, AssessmentSession>
  var conversationData: Map<string, unknown[]>
}

if (!global.assessmentSessions) {
  global.assessmentSessions = new Map()
}

if (!global.conversationData) {
  global.conversationData = new Map()
}

const updateSchema = z.object({
  sessionId: z.string(),
  action: z.enum(['update_artifact', 'update_step', 'complete_interview']),
  data: z.object({
    artifactId: z.string().optional(),
    stepId: z.string().optional(),
    status: z.enum(['in_progress', 'completed']).optional(),
    confidence: z.number().min(0).max(1).optional(),
    responses: z.array(z.any()).optional(),
    metadata: z.any().optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, action, data } = updateSchema.parse(body)

    switch (action) {
      case 'update_artifact':
        return handleArtifactUpdate(sessionId, data)
      case 'update_step':
        return handleStepUpdate(sessionId, data)
      case 'complete_interview':
        return handleInterviewCompletion(sessionId, data)
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Assessment update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update assessment session' },
      { status: 500 }
    )
  }
}

async function handleArtifactUpdate(sessionId: string, data: UpdateData) {
  try {
    const { artifactId, status, confidence, responses, metadata } = data

    // Get or create assessment session
    let assessmentSession = global.assessmentSessions.get(sessionId)
    if (!assessmentSession) {
      assessmentSession = {
        sessionId,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        artifacts: {}
      } as AssessmentSession
    }

    // Update artifact data
    if (!assessmentSession.artifacts) {
      assessmentSession.artifacts = {}
    }

    assessmentSession.artifacts[artifactId!] = {
      status: status || 'in_progress',
      confidence,
      responses: responses || [],
      metadata: metadata || {},
      completedAt: status === 'completed' ? new Date().toISOString() : undefined
    }

    // Update overall session
    assessmentSession.lastUpdated = new Date().toISOString()
    
    // Calculate completion stats
    const artifactStats = calculateArtifactStats(assessmentSession.artifacts)
    assessmentSession.completionStats = artifactStats

    // Store updated session
    global.assessmentSessions.set(sessionId, assessmentSession)

    return NextResponse.json({
      success: true,
      sessionId,
      artifactId,
      status,
      confidence,
      completionStats: artifactStats
    })
  } catch (error) {
    console.error('Artifact update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update artifact' },
      { status: 500 }
    )
  }
}

async function handleStepUpdate(sessionId: string, data: UpdateData) {
  try {
    const { stepId, status, responses, metadata } = data

    // Get or create assessment session
    let assessmentSession = global.assessmentSessions.get(sessionId)
    if (!assessmentSession) {
      assessmentSession = {
        sessionId,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        artifacts: {}
      } as AssessmentSession
    }

    // Update step data (JSONB equivalent)
    if (!assessmentSession.stepData) {
      assessmentSession.stepData = {}
    }

    assessmentSession.stepData[stepId] = {
      stepId,
      status,
      responses: responses || [],
      metadata: metadata || {},
      updatedAt: new Date().toISOString()
    }

    // Update overall session
    assessmentSession.lastUpdated = new Date().toISOString()

    // Store updated session
    global.assessmentSessions.set(sessionId, assessmentSession)

    return NextResponse.json({
      success: true,
      sessionId,
      stepId,
      status,
      stepData: assessmentSession.stepData[stepId]
    })
  } catch (error) {
    console.error('Step update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update step' },
      { status: 500 }
    )
  }
}

async function handleInterviewCompletion(sessionId: string) {
  try {
    // Get assessment session
    const assessmentSession = global.assessmentSessions.get(sessionId)
    if (!assessmentSession) {
      return NextResponse.json(
        { success: false, error: 'Assessment session not found' },
        { status: 404 }
      )
    }

    // Mark as completed
    assessmentSession.status = 'completed'
    assessmentSession.completedAt = new Date().toISOString()
    assessmentSession.lastUpdated = new Date().toISOString()

    // Get conversation data for final analysis
    const conversationHistory = global.conversationData.get(sessionId) || []
    assessmentSession.conversationSummary = {
      totalMessages: conversationHistory.length,
      userMessages: conversationHistory.filter((msg: any) => msg.type === 'user').length,
      agentMessages: conversationHistory.filter((msg: any) => msg.type === 'agent').length,
      systemMessages: conversationHistory.filter((msg: any) => msg.type === 'system').length,
      duration: calculateInterviewDuration(conversationHistory),
      firstMessage: conversationHistory[0]?.timestamp,
      lastMessage: conversationHistory[conversationHistory.length - 1]?.timestamp
    }

    // Final completion statistics
    const artifactStats = calculateArtifactStats(assessmentSession.artifacts || {})
    assessmentSession.finalStats = {
      ...artifactStats,
      completionRate: (artifactStats.completed / 23) * 100,
      averageConfidence: artifactStats.averageConfidence
    }

    // Store completed session
    global.assessmentSessions.set(sessionId, assessmentSession)

    return NextResponse.json({
      success: true,
      sessionId,
      status: 'completed',
      completedAt: assessmentSession.completedAt,
      finalStats: assessmentSession.finalStats,
      conversationSummary: assessmentSession.conversationSummary
    })
  } catch (error) {
    console.error('Interview completion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to complete interview' },
      { status: 500 }
    )
  }
}

function calculateArtifactStats(artifacts: any) {
  const artifactValues = Object.values(artifacts)
  const completed = artifactValues.filter((artifact: any) => artifact.status === 'completed').length
  const inProgress = artifactValues.filter((artifact: any) => artifact.status === 'in_progress').length
  const total = 23 // Total artifacts in the framework

  const confidenceScores = artifactValues
    .filter((artifact: any) => artifact.confidence !== undefined)
    .map((artifact: any) => artifact.confidence)
  
  const averageConfidence = confidenceScores.length > 0 
    ? confidenceScores.reduce((sum, conf) => sum + conf, 0) / confidenceScores.length 
    : 0

  return {
    completed,
    inProgress,
    total,
    remaining: total - completed - inProgress,
    progressPercentage: Math.round(((completed + inProgress * 0.5) / total) * 100),
    averageConfidence: Math.round(averageConfidence * 100) / 100
  }
}

function calculateInterviewDuration(conversationHistory: any[]): string {
  if (conversationHistory.length < 2) return '0m'
  
  const firstTimestamp = new Date(conversationHistory[0].timestamp).getTime()
  const lastTimestamp = new Date(conversationHistory[conversationHistory.length - 1].timestamp).getTime()
  const durationMs = lastTimestamp - firstTimestamp
  
  const minutes = Math.floor(durationMs / (1000 * 60))
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
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

  const assessmentSession = global.assessmentSessions.get(sessionId)
  
  if (!assessmentSession) {
    return NextResponse.json(
      { success: false, error: 'Assessment session not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    session: assessmentSession
  })
}