# Tech Stack Reference

> **Note:** This file references the main architecture document to avoid duplication.

For the complete tech stack information, see [docs/architecture.md](../architecture.md#tech-stack).

## Quick Reference

The SuperSwift Interview Agent uses:

- **Frontend:** Next.js + shadcn/ui + Tailwind CSS
- **Backend:** Deno Edge Functions + Supabase PostgreSQL
- **Voice:** ElevenLabs Conversational AI (webhook-based architecture)
- **Workflow:** N8N for research automation
- **Database:** 3-tier architecture (research_data, assessment_sessions, company_business_intel)
- **Authentication:** Supabase Auth
- **Testing:** Unit + Integration testing
- **Hosting:** Vercel + Supabase Global

See [Technology Stack Table](../architecture.md#technology-stack-table) for complete details.

## Architecture Update: ElevenLabs Integration

### Migration from Voice I/O to Conversational AI

**Previous Architecture (Deprecated):**
- Simple voice I/O layer using ElevenLabs API
- 3-agent system managing conversation flow internally

**New Architecture (Current):**
- ElevenLabs Conversational AI as primary orchestrator
- Webhook-based custom tools integration
- Stateless backend services with session persistence

### Webhook Endpoints
- `/api/elevenlabs/webhooks/orchestrate` - Main orchestration
- `/api/elevenlabs/webhooks/fetch-artifact` - Data retrieval
- `/api/elevenlabs/webhooks/update-assessment` - Progress tracking
- `/api/elevenlabs/webhooks/generate-question` - Dynamic questions

For implementation details, see [ElevenLabs Webhook Integration](./elevenlabs-webhook-integration.md).