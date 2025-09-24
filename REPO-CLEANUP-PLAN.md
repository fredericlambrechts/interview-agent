# Repository Cleanup Plan: n8n + ElevenLabs Architecture

## Cleanup Strategy

### Phase 1: Archive (Don't Delete) Obsolete Code
Move old architecture files to `/archive/` folder for reference.

### Phase 2: Remove Redundant Documentation
Clean up documentation conflicts.

### Phase 3: Update Structure for n8n Architecture
Prepare repository for visual workflow development.

## Files to Archive (Move to `/archive/`)

### Obsolete Agent Code
```
/lib/interview/VoiceAgent.ts → /archive/old-architecture/
/lib/interview/InterviewOrchestrator.ts → /archive/old-architecture/
/lib/data-validation/DataValidationAgent.ts → /archive/old-architecture/
```

**Reason:** These are replaced by n8n workflows

### Keep But May Need Updates
```
/lib/interview/Step1Assessment.ts ✅ (Reuse in n8n)
/lib/interview/Step2Assessment.ts ✅ (Reuse in n8n)
```

**Reason:** Business logic can be ported to n8n workflows

## Documentation Cleanup

### Files to Keep
```
✅ /docs/architecture.md - Updated for n8n
✅ /docs/ARCHITECTURE-FINAL.md - Clean reference
✅ /docs/N8N-IMPLEMENTATION-ROADMAP.md - Implementation guide
✅ /docs/architecture/n8n-elevenlabs-integration-analysis.md - Technical details
✅ /docs/stories/3.*.md - New n8n implementation stories
✅ /docs/PRD.md - Product requirements (unchanged)
```

### Files to Update Status
```
📝 /docs/stories/2.1.interview-orchestrator-foundation.md - Already ARCHIVED
📝 /docs/stories/2.2.customer-market-intelligence-assessment.md - Already ARCHIVED
```

### Files for Review/Cleanup
```
🔍 /docs/tool-integration-architecture.md - May be obsolete
🔍 /docs/architecture/tech-stack.md - Already updated but verify
```

## New Directory Structure

```
/docs/
├── architecture.md (updated)
├── ARCHITECTURE-FINAL.md (new)
├── N8N-IMPLEMENTATION-ROADMAP.md (new)
├── PRD.md (unchanged)
├── stories/
│   ├── 1.*.md (completed stories)
│   ├── 2.*.md (archived stories)  
│   └── 3.*.md (new n8n stories) ✅
├── architecture/ (updated)
└── n8n/ (new)
    ├── workflows/
    ├── documentation/
    └── examples/

/lib/
├── assessment/ (keep - reuse in n8n)
├── database/ (keep - unchanged)
└── types/ (keep - reused)

/archive/ (new)
├── old-architecture/
│   ├── VoiceAgent.ts
│   ├── InterviewOrchestrator.ts
│   └── DataValidationAgent.ts
└── deprecated-docs/
```

## Immediate Actions Required

### 1. Create Archive Directory
```bash
mkdir -p /archive/old-architecture
mkdir -p /archive/deprecated-docs
```

### 2. Move Obsolete Code
```bash
mv /lib/interview/VoiceAgent.ts /archive/old-architecture/
mv /lib/interview/InterviewOrchestrator.ts /archive/old-architecture/  
mv /lib/data-validation/DataValidationAgent.ts /archive/old-architecture/
```

### 3. Create n8n Directory Structure
```bash
mkdir -p /n8n/workflows
mkdir -p /n8n/documentation  
mkdir -p /n8n/examples
```

### 4. Update Documentation Index
Create `/docs/README.md` with current architecture pointers.

## What NOT to Delete

### Keep All Assessment Logic
```
✅ /lib/interview/Step1Assessment.ts
✅ /lib/interview/Step2Assessment.ts
✅ /lib/interview/QuestionGenerationEngine.ts
```
**Reason:** Business logic will be ported to n8n workflows

### Keep All Database Code
```
✅ /lib/database/* (all files)
✅ /types/* (all type definitions)
```
**Reason:** Database operations unchanged, just called from n8n

### Keep All UI Code
```  
✅ /components/* (all components)
✅ /app/* (all pages and API routes)
```
**Reason:** UI will be simplified but not replaced

## Repository Health Check

After cleanup, repository should have:

### Clear Architecture
- One source of truth: `/docs/ARCHITECTURE-FINAL.md`
- Implementation roadmap: `/docs/N8N-IMPLEMENTATION-ROADMAP.md`
- Technical analysis: `/docs/architecture/n8n-elevenlabs-integration-analysis.md`

### Clean Code Structure
- No obsolete agent code in active directories
- Assessment logic preserved for n8n porting
- Database and UI code ready for integration

### Working Stories
- Epic 3 (n8n implementation) ready for development
- Epic 1-2 stories properly archived
- Clear progression path

## Success Criteria

### Repository is Clean When:
- [ ] No obsolete agent code in `/lib/`
- [ ] All assessment logic preserved
- [ ] n8n directory structure ready
- [ ] Documentation points to current architecture
- [ ] Stories clearly organized by epic
- [ ] Archive preserves old code for reference

### Development is Ready When:
- [ ] Team can start Story 3.1 immediately  
- [ ] No confusion about which architecture to follow
- [ ] Clear pointers to implementation guides
- [ ] Assessment logic ready for n8n porting

## Timeline

### Today (30 minutes)
- Create directory structure
- Move obsolete agent code to archive
- Update documentation pointers

### Tomorrow (Start Epic 3)
- Team begins Story 3.1: n8n Foundation Setup
- No delays due to repository confusion
- Clean slate for visual development

This cleanup ensures the repository reflects our final architecture decision and enables efficient development of the n8n + ElevenLabs system.