# Coding Standards Reference

> **Note:** This project follows established Next.js and TypeScript best practices. Standards are embedded throughout the architecture document.

## Key Standards

### Code Quality
- **TypeScript:** Strict mode enabled for type safety
- **ESLint + Prettier:** Code formatting and linting
- **Naming:** Use descriptive names, camelCase for variables, PascalCase for components

### Architecture Patterns
- **3-Agent Collaboration:** Voice Agent (I/O), Interview Orchestrator (business logic), Data Validation Agent (data management)
- **3-Tier Data Architecture:** Clean separation of research → interview → business intelligence
- **Component Patterns:** shadcn/ui for consistent UI components

### File Organization
```
- API routes: /app/api/{domain}/
- Components: /components/{domain}/
- Utilities: /lib/{domain}/
- Types: /types/ (future: packages/types/)
```

### Voice Integration Standards
- Voice Agent handles ONLY ElevenLabs I/O
- NO business logic in presentation layer
- Clean interface contracts between agents

### Database Standards
- JSONB for complex business structures
- Row Level Security (RLS) for data isolation
- 90/60-day retention policies for data tiers

### Testing Standards
- Unit tests for individual functions
- Integration tests for API endpoints
- Playwright for voice interaction testing
- Mock ElevenLabs API for testing

For detailed patterns and architectural decisions, see [docs/architecture.md](../architecture.md).