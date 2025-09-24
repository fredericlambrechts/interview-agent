# Documentation Cleanup Plan

## Current Issues

### 1. Broken Organization
- `04-design/` exists without 01-03
- Mixed numbering systems (00, 01 inside 04)
- No clear hierarchy or navigation

### 2. Obsolete Content
- Design system for old architecture
- Complex UI specs (now simplified with n8n)
- Empty or near-empty files

### 3. Architecture Misalignment
- Design docs assume complex conversation UI
- Current architecture: ElevenLabs handles conversation, minimal UI needed

## Proposed New Structure

```
/docs/
├── README.md ✅ (Current - navigation hub)
├── core/
│   ├── ARCHITECTURE-FINAL.md ✅ (Move from root)
│   ├── architecture.md ✅ (Move from root)  
│   ├── PRD.md ✅ (Move from root)
│   └── N8N-IMPLEMENTATION-ROADMAP.md ✅ (Move from root)
├── architecture/ ✅ (Keep as-is)
│   ├── coding-standards.md
│   ├── n8n-elevenlabs-integration-analysis.md
│   ├── source-tree.md
│   └── tech-stack.md
├── stories/ ✅ (Keep as-is)
│   ├── 1.*.md (completed)
│   ├── 2.*.md (archived)
│   └── 3.*.md (current)
├── design/ (New - simplified)
│   └── ui-requirements.md (Minimal UI for n8n architecture)
└── archive/ (New)
    ├── old-design-system/ (Move 04-design here)
    └── obsolete-docs/ (Move orphaned files)
```

## Files to Archive

### Move to `/docs/archive/old-design-system/`
```
04-design/ (entire folder)
├── 00-design-system/
├── 01-design-sprints/  
├── 02-prototypes/
└── *.md (design audit files)
```
**Reason:** Design system for old architecture, not applicable to n8n + ElevenLabs

### Move to `/docs/archive/obsolete-docs/`
```
icometrix_gtm_assessment.html (appears empty)
UXUISpecification.md (may conflict with simplified UI)
ProjectBrief.md (potentially outdated)
MCP_SETUP.md (may be outdated for n8n architecture)
```

### Delete Empty Directories
```
epic-reviews/ (empty)
```

## Files to Keep & Reorganize

### Core Documentation (Move to `/docs/core/`)
```
✅ ARCHITECTURE-FINAL.md (definitive architecture)
✅ architecture.md (detailed technical)
✅ PRD.md (product requirements)
✅ N8N-IMPLEMENTATION-ROADMAP.md (implementation plan)
```

### Keep in Place
```
✅ README.md (navigation hub)
✅ architecture/ (technical details)
✅ stories/ (implementation stories)
```

## New Documentation Needed

### `/docs/design/ui-requirements.md`
```markdown
# UI Requirements: n8n + ElevenLabs Architecture

## Minimal UI Approach
Since ElevenLabs handles conversation, our UI is simplified:

- Progress display during interviews
- Assessment reports viewing
- Administrative controls
- Real-time status indicators

## Key Principles
- Display-only interface (no conversation management)
- Real-time progress from n8n workflows
- Clean, minimal design
- Responsive for monitoring
```

## Cleanup Actions

### Phase 1: Archive Obsolete Content
```bash
mkdir -p docs/archive/old-design-system
mkdir -p docs/archive/obsolete-docs

mv docs/04-design/ docs/archive/old-design-system/
mv docs/icometrix_gtm_assessment.html docs/archive/obsolete-docs/
mv docs/UXUISpecification.md docs/archive/obsolete-docs/
mv docs/ProjectBrief.md docs/archive/obsolete-docs/
mv docs/MCP_SETUP.md docs/archive/obsolete-docs/

rmdir docs/epic-reviews
```

### Phase 2: Reorganize Core Docs
```bash
mkdir -p docs/core

mv docs/ARCHITECTURE-FINAL.md docs/core/
mv docs/architecture.md docs/core/
mv docs/PRD.md docs/core/
mv docs/N8N-IMPLEMENTATION-ROADMAP.md docs/core/
```

### Phase 3: Create New Structure
```bash
mkdir -p docs/design
# Create ui-requirements.md (minimal UI specs)
```

### Phase 4: Update Navigation
Update `docs/README.md` with new structure and paths.

## Expected Outcomes

### Before Cleanup (Current Issues)
- Confusing numbering (04-design without 01-03)
- Obsolete design system documentation
- Mixed content levels
- 20+ files at root level

### After Cleanup (Organized)
- Clear hierarchy: core/ architecture/ stories/ design/
- Obsolete content archived (not deleted)
- Navigation flows logically
- 5-6 files at root level

### Benefits
- Faster onboarding (clear navigation)
- No confusion about which docs are current
- Architecture-aligned documentation
- Preserved history in archive

## Validation Checklist

After cleanup, verify:
- [ ] All current architecture docs easily accessible
- [ ] Implementation stories clearly organized
- [ ] Obsolete content archived (not lost)
- [ ] README.md navigation updated
- [ ] New team members can find what they need in <5 minutes
- [ ] No broken internal links

## Impact Assessment

### Low Risk Changes
- Moving files to better locations
- Archiving obsolete content
- Creating new directories

### Zero Risk
- All content preserved in archive
- No deletion of potentially useful information
- Existing file contents unchanged

### High Impact Benefits
- Clear, professional documentation structure
- Faster developer onboarding
- Reduced confusion about current architecture
- Better alignment with n8n + ElevenLabs approach
```