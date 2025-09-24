import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SessionData {
  sessionId: string;
  status: string;
  state?: SessionState;
  pausedAt?: string;
  resumedAt?: string;
  savedAt?: string;
}

interface SessionState {
  currentArtifact?: string;
  progress?: Record<string, unknown>;
  conversationData?: unknown[];
  timestamp?: string;
  pausedAt?: string;
  resumedAt?: string;
}

// In-memory storage for interview sessions (replace with database later)
declare global {
  let interviewSessions: Map<string, SessionData>
}

if (!global.interviewSessions) {
  global.interviewSessions = new Map()
}

const sessionSchema = z.object({
  sessionId: z.string(),
  action: z.enum(['pause', 'resume', 'save', 'load']),
  state: z.object({
    currentArtifact: z.string().optional(),
    progress: z.any().optional(),
    conversationData: z.array(z.any()).optional(),
    timestamp: z.string().optional(),
    pausedAt: z.string().optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, action, state } = sessionSchema.parse(body)

    switch (action) {
      case 'pause':
        return handlePause(sessionId, state)
      case 'resume':
        return handleResume(sessionId)
      case 'save':
        return handleSave(sessionId, state)
      case 'load':
        return handleLoad(sessionId)
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Session management error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to manage interview session' },
      { status: 500 }
    )
  }
}

async function handlePause(sessionId: string, state: SessionState) {
  try {
    const sessionData = {
      sessionId,
      status: 'paused',
      pausedAt: new Date().toISOString(),
      state: {
        ...state,
        pausedAt: new Date().toISOString()
      }
    }

    global.interviewSessions.set(sessionId, sessionData)

    // Also update conversation data to mark as paused
    if (global.conversationData) {
      const conversationHistory = global.conversationData.get(sessionId) || []
      conversationHistory.push({
        type: 'system',
        content: 'Interview session paused',
        timestamp: new Date().toISOString(),
        metadata: {
          action: 'pause',
          artifact: state?.currentArtifact
        }
      })
      global.conversationData.set(sessionId, conversationHistory)
    }

    return NextResponse.json({
      success: true,
      message: 'Interview paused successfully',
      sessionId,
      pausedAt: sessionData.pausedAt
    })
  } catch (error) {
    console.error('Pause error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to pause interview' },
      { status: 500 }
    )
  }
}

async function handleResume(sessionId: string) {
  try {
    const sessionData = global.interviewSessions.get(sessionId)
    
    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    if (sessionData.status !== 'paused') {
      return NextResponse.json(
        { success: false, error: 'Session is not paused' },
        { status: 400 }
      )
    }

    // Update session status
    sessionData.status = 'active'
    sessionData.resumedAt = new Date().toISOString()
    global.interviewSessions.set(sessionId, sessionData)

    // Log resume in conversation data
    if (global.conversationData) {
      const conversationHistory = global.conversationData.get(sessionId) || []
      conversationHistory.push({
        type: 'system',
        content: 'Interview session resumed',
        timestamp: new Date().toISOString(),
        metadata: {
          action: 'resume',
          pauseDuration: calculatePauseDuration(sessionData.pausedAt, sessionData.resumedAt)
        }
      })
      global.conversationData.set(sessionId, conversationHistory)
    }

    return NextResponse.json({
      success: true,
      message: 'Interview resumed successfully',
      sessionId,
      resumedAt: sessionData.resumedAt,
      state: sessionData.state
    })
  } catch (error) {
    console.error('Resume error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to resume interview' },
      { status: 500 }
    )
  }
}

async function handleSave(sessionId: string, state: SessionState) {
  try {
    const sessionData = {
      sessionId,
      status: 'saved',
      savedAt: new Date().toISOString(),
      state
    }

    global.interviewSessions.set(sessionId, sessionData)

    return NextResponse.json({
      success: true,
      message: 'Session state saved successfully',
      sessionId,
      savedAt: sessionData.savedAt
    })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save session state' },
      { status: 500 }
    )
  }
}

async function handleLoad(sessionId: string) {
  try {
    const sessionData = global.interviewSessions.get(sessionId)
    
    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      sessionId,
      status: sessionData.status,
      state: sessionData.state,
      savedAt: sessionData.savedAt,
      pausedAt: sessionData.pausedAt,
      resumedAt: sessionData.resumedAt
    })
  } catch (error) {
    console.error('Load error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load session state' },
      { status: 500 }
    )
  }
}

function calculatePauseDuration(pausedAt: string, resumedAt: string): string {
  const pauseTime = new Date(pausedAt).getTime()
  const resumeTime = new Date(resumedAt).getTime()
  const durationMs = resumeTime - pauseTime
  const durationMinutes = Math.floor(durationMs / (1000 * 60))
  const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000)
  
  if (durationMinutes > 0) {
    return `${durationMinutes}m ${durationSeconds}s`
  }
  return `${durationSeconds}s`
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

  try {
    // First check in-memory storage for session state
    const memorySession = global.interviewSessions?.get(sessionId)
    
    // Fetch from database
    const { data: session, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (error || !session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      sessionId,
      session,
      // Include memory session state if available
      state: memorySession?.state,
      status: memorySession?.status || session.status,
      savedAt: memorySession?.savedAt,
      pausedAt: memorySession?.pausedAt,
      resumedAt: memorySession?.resumedAt
    })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}