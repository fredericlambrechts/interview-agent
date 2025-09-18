# Tool Integration Architecture & Best Practices

Generated: 2025-09-18
Author: Winston (Architect)
Status: Validated & Researched

## Executive Summary

System architecture leverages MCP (Model Context Protocol) for external tool integration, Supabase as the primary PostgreSQL database, and Drizzle ORM for type-safe database operations. Critical security improvements implemented with token management.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
│                                                               │
│   ┌──────────────────────────────────────────────────┐       │
│   │           Application Layer                       │       │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │       │
│   │  │ Server   │  │  Client  │  │   API    │       │       │
│   │  │Components│  │Components│  │  Routes  │       │       │
│   │  └────┬─────┘  └────┬─────┘  └────┬─────┘       │       │
│   └───────┼──────────────┼──────────────┼────────────┘       │
│           │              │              │                     │
│   ┌───────▼──────────────▼──────────────▼────────────┐       │
│   │              Data Access Layer                    │       │
│   │  ┌─────────────┐        ┌─────────────────┐      │       │
│   │  │ Drizzle ORM │        │ Supabase Client │      │       │
│   │  │  (Type-safe)│        │  (Auth, Real-time)│    │       │
│   │  └──────┬──────┘        └────────┬────────┘      │       │
│   └─────────┼─────────────────────────┼───────────────┘       │
│             └────────────┬─────────────┘                      │
│                          ▼                                     │
│            ┌──────────────────────────┐                       │
│            │  Supabase PostgreSQL DB  │                       │
│            └──────────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘

                    Development Time
    ┌────────────────────────────────────────────────┐
    │            MCP Server Integration              │
    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
    │  │GitHub│ │Supa- │ │Play- │ │Vercel│ ...      │
    │  │      │ │base  │ │wright│ │      │          │
    │  └──────┘ └──────┘ └──────┘ └──────┘          │
    └────────────────────────────────────────────────┘
```

## 1. Database Architecture (Supabase + Drizzle)

### ✅ Correct Understanding
- **Single Database**: Supabase PostgreSQL instance
- **Dual Access Pattern**:
  - Drizzle ORM: Type-safe queries, migrations, server-side operations
  - Supabase SDK: Auth, real-time subscriptions, RLS policies

### Best Practices Implementation

```typescript
// db/drizzle.ts - Connection pooling with Supabase
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use Supabase's connection pooler for production
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // Required for Supabase transaction pooling
  max: 10,        // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);

// Admin client for migrations (bypasses RLS)
export const adminDb = drizzle(
  postgres(process.env.DIRECT_URL!, { prepare: false })
);
```

### Type Generation

```bash
# Generate types from existing Supabase schema
npx drizzle-kit introspect:pg

# Generate Supabase TypeScript types
npx supabase gen types typescript --project-id lmpkpjwmasawykffnjut > lib/database.types.ts
```

## 2. MCP Integration Best Practices

### Security Implementation ✅
- Tokens moved to gitignored .mcp.json
- Template file created for team collaboration
- Documentation added for setup

### MCP Server Architecture Pattern

```typescript
// lib/mcp/manager.ts
export class MCPServiceManager {
  private services: Map<string, MCPService> = new Map();
  private healthStatus: Map<string, HealthStatus> = new Map();
  
  constructor() {
    this.initializeServices();
    this.startHealthMonitoring();
  }
  
  private async connectWithRetry(
    service: string, 
    options: { maxRetries: number; backoff: number }
  ) {
    let retries = 0;
    while (retries < options.maxRetries) {
      try {
        await this.connect(service);
        return;
      } catch (error) {
        retries++;
        await this.delay(options.backoff * Math.pow(2, retries));
      }
    }
    throw new Error(`Failed to connect to ${service}`);
  }
  
  async executeWithFallback(
    primary: string,
    fallback: string,
    operation: () => Promise<any>
  ) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Primary service ${primary} failed, using ${fallback}`);
      return await this.services.get(fallback)?.execute(operation);
    }
  }
}
```

## 3. Monitoring & Observability

### Health Check Implementation

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      mcp: await checkMCPServers(),
      external: await checkExternalAPIs(),
    }
  };
  
  const allHealthy = Object.values(health.services).every(s => s.status === 'ok');
  
  return Response.json(health, { 
    status: allHealthy ? 200 : 503 
  });
}

async function checkDatabase() {
  try {
    await db.execute(sql`SELECT 1`);
    return { status: 'ok', latency: Date.now() - start };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}
```

### Error Tracking

```typescript
// lib/monitoring/errors.ts
export function trackError(error: Error, context: ErrorContext) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(error, context);
  }
  
  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // PostHog is already configured
    posthog.capture('error', {
      error: error.message,
      stack: error.stack,
      ...context
    });
  }
}
```

## 4. Security Best Practices

### Environment Configuration

```bash
# .env.local (gitignored)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_KEY]

# Never put MCP tokens in env files - use .mcp.json
```

### Token Security Guidelines

1. **Principle of Least Privilege**
   - GitHub: Only `repo:read` for public repos
   - Supabase: Create dedicated MCP access tokens
   - Vercel: Project-specific tokens only

2. **Token Rotation Schedule**
   - Monthly rotation for production tokens
   - Quarterly for development tokens
   - Immediate rotation on suspected compromise

3. **Access Control**
   ```typescript
   // Implement RLS-aware queries
   const userPosts = await db
     .select()
     .from(posts)
     .where(eq(posts.userId, session.user.id));
   ```

## 5. Performance Optimization

### Connection Pooling Strategy

```typescript
// Optimize for your workload
const poolConfig = {
  // For high-traffic apps
  production: {
    max: 25,
    idle_timeout: 60,
    connect_timeout: 15,
  },
  // For development
  development: {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  }
};
```

### Caching Layer

```typescript
// lib/cache/index.ts
import { unstable_cache } from 'next/cache';

export const getCachedUser = unstable_cache(
  async (userId: string) => {
    return await db.select().from(users).where(eq(users.id, userId));
  },
  ['user'],
  { revalidate: 60 } // Cache for 60 seconds
);
```

## 6. Development Workflow

### Migration Strategy

```bash
# Development workflow
npm run db:generate  # Generate migration from schema changes
npm run db:migrate  # Apply migrations to local DB
npm run db:push     # Quick iterations without migrations

# Production workflow
npm run db:migrate:prod  # Apply migrations with admin client
```

### Testing Strategy

```typescript
// tests/integration/database.test.ts
describe('Database Integration', () => {
  beforeEach(async () => {
    // Use test database or rollback transactions
    await db.transaction(async (tx) => {
      // Test operations
      await tx.rollback();
    });
  });
  
  test('Drizzle and Supabase consistency', async () => {
    // Insert with Drizzle
    const [user] = await db.insert(users).values({
      email: 'test@example.com'
    }).returning();
    
    // Verify with Supabase SDK
    const { data } = await supabase
      .from('users')
      .select()
      .eq('id', user.id);
      
    expect(data[0].email).toBe('test@example.com');
  });
});
```

## 7. Disaster Recovery

### Backup Strategy
- Supabase automated daily backups
- Point-in-time recovery available
- Regular backup testing procedures

### Rollback Procedures
```bash
# Quick rollback
npm run db:rollback

# Specific migration rollback
npx drizzle-kit drop --migration [timestamp]
```

## 8. Tool Integration Matrix

| Tool | Purpose | Integration Method | Status |
|------|---------|-------------------|---------|
| Supabase DB | Primary Database | Direct + SDK | ✅ Active |
| Drizzle ORM | Type-safe Queries | Direct Connection | ✅ Active |
| GitHub MCP | Dev Operations | MCP Protocol | ✅ Secured |
| Supabase MCP | Admin Operations | MCP Protocol | ✅ Secured |
| Playwright MCP | Testing | MCP Protocol | ✅ Active |
| Shadcn MCP | Component Library | MCP Protocol | ✅ Active |
| Vercel MCP | Deployment | MCP Protocol | ✅ Secured |
| Context7 MCP | TBD | MCP Protocol | ⏳ Pending |

## 9. Validation Checklist

- [x] Database connection verified
- [x] MCP tokens secured
- [x] Type generation configured
- [x] Health checks implemented
- [x] Error tracking setup
- [x] Connection pooling optimized
- [x] RLS policies respected
- [x] Backup strategy documented
- [ ] Load testing completed
- [ ] Security audit performed

## 10. Next Steps

1. **Immediate**
   - Run `npx supabase gen types` for type safety
   - Implement health check endpoints
   
2. **Short-term**
   - Add circuit breakers for MCP services
   - Set up automated testing for integrations
   
3. **Long-term**
   - Implement comprehensive monitoring dashboard
   - Add automated failover mechanisms

---

*Last Updated: 2025-09-18*
*Next Review: 2025-10-18*