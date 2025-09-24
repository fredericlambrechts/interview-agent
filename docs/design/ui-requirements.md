# UI Requirements: n8n + ElevenLabs Architecture

## Minimal UI Approach

Since ElevenLabs Conversational AI handles all voice interaction and conversation management, our web UI is dramatically simplified compared to traditional chat interfaces.

### Core Principle: Display, Don't Interact

**ElevenLabs handles:**
- Voice conversation
- Turn-taking
- Interruption handling
- Context management

**Our UI handles:**
- Progress monitoring
- Report viewing  
- Administrative controls
- System status

## Required UI Components

### 1. Interview Progress Dashboard
```yaml
Purpose: Real-time monitoring of active interviews
Components:
  - Current artifact being discussed
  - Progress bar (X of 23 artifacts complete)
  - Conversation status (listening, processing, responding)
  - Session duration timer
  - Audio level indicators (optional)
```

### 2. Assessment Reports Viewer
```yaml
Purpose: View completed assessments
Components:
  - Company summary card
  - Artifact completion matrix (3x3 grid of steps)
  - Confidence scores by artifact
  - Export/share functionality
  - Search and filter capabilities
```

### 3. Administrative Interface
```yaml
Purpose: System management and configuration
Components:
  - Active sessions list
  - n8n workflow status indicators
  - ElevenLabs connection health
  - Database performance metrics
  - User management (if multi-tenant)
```

### 4. Landing/Start Interface
```yaml
Purpose: Initiate new assessments
Components:
  - Company URL input
  - Research status indicator
  - "Start Interview" button
  - Recent assessments list
  - Quick start guide
```

## Design Principles

### 1. Real-Time Updates
- WebSocket or polling connections to show live progress
- Instant updates when n8n workflows complete
- Visual feedback for user actions

### 2. Minimal Cognitive Load
- Clean, uncluttered layouts
- Clear visual hierarchy
- Progressive disclosure of information

### 3. Professional Aesthetics
- B2B-appropriate styling
- Consistent with business consulting theme
- Accessible and responsive design

### 4. Error States & Loading
- Clear error messages when systems are unavailable
- Loading states for all async operations
- Graceful degradation if voice interface fails

## Technical Requirements

### Data Flow
```
n8n Workflows → Database Updates → UI Real-time Updates
ElevenLabs Status → UI Status Indicators
```

### Performance
- <100ms UI response time
- Real-time updates within 500ms of data changes
- Mobile-responsive for monitoring on devices

### Integration Points
- Read-only access to assessment_sessions table
- WebSocket or polling for real-time updates
- REST API for administrative functions

## What We DON'T Need

### Removed from Traditional Chat UI:
- ❌ Message input fields
- ❌ Chat history display  
- ❌ Typing indicators
- ❌ Message bubbles
- ❌ Conversation controls
- ❌ Voice recording buttons
- ❌ Audio controls

### Simplified from Complex UIs:
- ❌ Multi-step wizards (handled by voice)
- ❌ Complex form validation
- ❌ Interactive conversation flows
- ❌ Rich text editing
- ❌ File upload interfaces

## Implementation Priority

### Phase 1 (MVP)
1. Basic progress dashboard
2. Simple assessment viewer
3. Start interview interface

### Phase 2 (Enhanced)  
1. Real-time updates
2. Administrative interface
3. Advanced reporting features

### Phase 3 (Polish)
1. Advanced analytics
2. Multi-user features
3. Integration with external tools

## Component Library Approach

Use existing shadcn/ui components where possible:
- Card components for displays
- Progress bars for completion tracking
- Buttons for actions
- Loading spinners for async operations
- Alert components for status messages

## Responsive Design

### Desktop (Primary)
- Full dashboard with all information visible
- Multi-column layouts
- Detailed progress tracking

### Tablet
- Simplified dashboard
- Key metrics prominently displayed
- Touch-friendly controls

### Mobile
- Essential information only
- Single-column layout
- Quick status checking

This minimal UI approach aligns perfectly with our n8n + ElevenLabs architecture, where complex interaction is handled by voice and visual interfaces focus on monitoring and administration.