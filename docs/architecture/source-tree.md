# Project Structure Reference

> **Note:** This file references the main architecture document to avoid duplication.

For the complete project structure, see [docs/architecture.md](../architecture.md#project-structure-monorepo---target-state).

## Current Structure (Next.js Foundation)

```
interview-agent/
├── app/                     # Next.js App Router
│   ├── api/                # API endpoints
│   │   ├── research/       # Research workflow integration
│   │   ├── interview/      # Interview orchestration
│   │   └── voice/          # ElevenLabs integration
│   ├── prototype/          # Prototype pages
│   └── test-voice/         # Voice testing interface
├── components/             # UI components
│   ├── ui/                # shadcn/ui components
│   └── voice/             # Voice interface components
├── docs/                  # Project documentation
│   ├── architecture.md
│   ├── PRD.md
│   └── stories/
├── lib/                   # Shared utilities
├── types/                 # TypeScript definitions
└── .bmad-core/           # BMAD agent configuration
```

## Target Structure (Monorepo)

See [Project Structure (Monorepo - Target State)](../architecture.md#project-structure-monorepo---target-state) for the planned monorepo architecture with apps/packages structure.