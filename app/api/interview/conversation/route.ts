import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const conversationEntrySchema = z.object({
  sessionId: z.string(),
  type: z.enum(['user', 'agent', 'system']),
  content: z.string(),
  timestamp: z.string().optional(),
  step: z.string().optional(),
  artifact: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

// Schema for GET request validation (unused for now)
// const getConversationDataSchema = z.object({
//   sessionId: z.string()
// })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const entry = conversationEntrySchema.parse(body)

    // Update assessment session with new conversation data
    const { data: session } = await supabase
      .from('assessment_sessions')
      .select('conversation_data')
      .eq('session_id', entry.sessionId)
      .single()

    const conversationData = session?.conversation_data || []
    
    // Add new entry
    const newEntry = {
      ...entry,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      timestamp: entry.timestamp || new Date().toISOString()
    }
    
    conversationData.push(newEntry)

    // Update assessment session (or create if doesn't exist)
    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .upsert({
        session_id: entry.sessionId,
        company_url: 'https://placeholder.com', // Default for conversation-only sessions
        conversation_data: conversationData
      }, {
        onConflict: 'session_id'
      })

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error('Failed to update conversation data')
    }

    console.log(`Interview conversation logged for session ${entry.sessionId}: ${entry.type} - ${entry.content.substring(0, 100)}...`)

    return NextResponse.json({
      success: true,
      message: 'Conversation entry logged',
      entryId: newEntry.id
    })

  } catch (error) {
    console.error('Conversation logging error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid conversation data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to log conversation entry" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      )
    }

    const { data: session, error } = await supabase
      .from('assessment_sessions')
      .select('conversation_data')
      .eq('session_id', sessionId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Database fetch error:', error)
      throw new Error('Failed to fetch conversation data')
    }

    const conversation = session?.conversation_data || []

    return NextResponse.json({
      success: true,
      sessionId,
      conversation,
      totalEntries: conversation.length
    })

  } catch (error) {
    console.error('Conversation retrieval error:', error)
    return NextResponse.json(
      { success: false, error: "Failed to retrieve conversation data" },
      { status: 500 }
    )
  }
}

// Update interview step/artifact completion
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, step, artifact, status, confidence } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      )
    }

    // Log step/artifact completion
    const completionEntry = {
      sessionId,
      type: 'system' as const,
      content: `Step completed: ${step}${artifact ? ` (Artifact: ${artifact})` : ''}`,
      timestamp: new Date().toISOString(),
      step,
      artifact,
      metadata: {
        status,
        confidence,
        completedAt: new Date().toISOString()
      }
    }

    // Update database with completion entry
    const { data: session } = await supabase
      .from('assessment_sessions')
      .select('conversation_data')
      .eq('session_id', sessionId)
      .single()

    const conversationData = session?.conversation_data || []
    
    conversationData.push({
      ...completionEntry,
      id: `completion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    })

    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .upsert({
        session_id: sessionId,
        company_url: 'https://placeholder.com', // Default for conversation-only sessions
        conversation_data: conversationData
      }, {
        onConflict: 'session_id'
      })

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error('Failed to update conversation data')
    }

    console.log(`Interview step completed for session ${sessionId}: ${step}`)

    return NextResponse.json({
      success: true,
      message: 'Step completion logged'
    })

  } catch (error) {
    console.error('Step completion logging error:', error)
    return NextResponse.json(
      { success: false, error: "Failed to log step completion" },
      { status: 500 }
    )
  }
}