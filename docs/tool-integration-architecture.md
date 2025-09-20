# Tool Integration Architecture & Best Practices

Generated: 2025-09-20  
Author: Winston (Architect)  
Status: Updated with 3-Tier Architecture & Artifact-Based MCP Routes

## Executive Summary

System architecture leverages MCP (Model Context Protocol) for external tool integration and business intelligence data access, Supabase 3-tier PostgreSQL database (research_data, assessment_sessions, company_business_intel), and type-safe operations for 23-artifact assessment workflow. Critical security and artifact-based routing implemented.

## Architecture Overview - 3-Tier Database with MCP Integration

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
│                                                               │
│   ┌─────────────────────────────────────────────────────────┐│
│   │           3-Agent Collaboration Layer                    ││
│   │  ┌─────────┐ ┌──────────────┐ ┌─────────────────┐      ││
│   │  │ Voice   │ │ Interview    │ │ Data Validation │      ││
│   │  │ Agent   │ │ Orchestrator │ │ Agent           │      ││
│   │  └────┬────┘ └──────┬───────┘ └────────┬────────┘      ││
│   └───────┼─────────────┼──────────────────┼───────────────┘│
│           │             │                  │                 │
│   ┌───────▼─────────────▼──────────────────▼─────────────────┐│
│   │              Data Access Layer                           ││
│   │  ┌─────────────────┐        ┌─────────────────┐        ││
│   │  │ Supabase Client │        │ MCP Business    │        ││
│   │  │  (Auth, RLS)    │        │ Intelligence    │        ││
│   │  └──────┬──────────┘        │ Routes (23)     │        ││
│   └─────────┼─────────────────────┬─────────────────────────┘│
│             │                      │                         │
│             ▼                      ▼                         │
│   ┌──────────────────────────────────────────────────────────┐│
│   │           Supabase PostgreSQL - 3-Tier Architecture     ││
│   │                                                          ││
│   │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐││
│   │  │ Tier 1:         │ │ Tier 2:         │ │ Tier 3:     │││
│   │  │ research_data   │ │ assessment_     │ │ company_    │││
│   │  │ (n8n input)     │ │ sessions        │ │ business_   │││
│   │  │ 90-day retention│ │ (interview data)│ │ intel       │││
│   │  │                 │ │ 60-day retention│ │ (23 artifacts)│││
│   │  └─────────────────┘ └─────────────────┘ └─────────────┘││
│   └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

                    Development Time + Runtime
    ┌─────────────────────────────────────────────────────────┐
    │                MCP Server Integration                    │
    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────────────┐   │
    │  │GitHub│ │Supa- │ │Play- │ │shadcn│ │ Business    │   │
    │  │      │ │base  │ │wright│ │      │ │ Intel MCP   │   │
    │  │      │ │      │ │      │ │      │ │ (Artifacts) │   │
    │  └──────┘ └──────┘ └──────┘ └──────┘ └─────────────┘   │
    └─────────────────────────────────────────────────────────┘
```

## 1. Business Intelligence MCP Routes - 23 Artifact Access

### Artifact-Based MCP Route Architecture

The system provides direct MCP access to all 23 business intelligence artifacts stored in Tier 3 (company_business_intel table) for team collaboration and external tool integration.

#### **Core MCP Route Patterns**

```typescript
// Base route structure for all artifacts
GET /api/mcp/company/{company_url}/artifact/{artifact_id}
PUT /api/mcp/company/{company_url}/artifact/{artifact_id}

// Bulk operations
GET /api/mcp/company/{company_url}/full-profile
GET /api/mcp/company/{company_url}/part/{part_number}

// Team collaboration
GET /api/mcp/company/{company_url}/team-access
PUT /api/mcp/company/{company_url}/team-access
GET /api/mcp/company/{company_url}/change-history
```

#### **PART 1: STRATEGIC FOUNDATION - MCP Routes (8 Artifacts)**

```typescript
// Core Identity & Business Model (Step 1)
GET /api/mcp/company/{company_url}/artifact/1/company-mission-vision
GET /api/mcp/company/{company_url}/artifact/2/core-offering-definition
GET /api/mcp/company/{company_url}/artifact/3/regulatory-pathway
GET /api/mcp/company/{company_url}/artifact/4/revenue-streams-pricing

// Customer & Market Intelligence (Step 2)
GET /api/mcp/company/{company_url}/artifact/5/market-sizing
GET /api/mcp/company/{company_url}/artifact/6/clinical-evidence
GET /api/mcp/company/{company_url}/artifact/7/ideal-customer-profile
GET /api/mcp/company/{company_url}/artifact/8/customer-pains-gains
```

#### **PART 2: STRATEGY & POSITIONING - MCP Routes (9 Artifacts)**

```typescript
// Competitive Landscape (Step 3)
GET /api/mcp/company/{company_url}/artifact/9/direct-indirect-competitors
GET /api/mcp/company/{company_url}/artifact/10/competitive-positioning

// Channel & Go-to-Market (Step 4)
GET /api/mcp/company/{company_url}/artifact/11/channel-strategy
GET /api/mcp/company/{company_url}/artifact/12/sales-process-methodology
GET /api/mcp/company/{company_url}/artifact/13/gtm-team-structure

// Partnership & Alliance Strategy (Step 5)
GET /api/mcp/company/{company_url}/artifact/14/strategic-partnership-framework
GET /api/mcp/company/{company_url}/artifact/15/partner-enablement

// Brand & Messaging (Step 6)
GET /api/mcp/company/{company_url}/artifact/16/brand-positioning-statement
GET /api/mcp/company/{company_url}/artifact/17/core-messaging-pillars
```

#### **PART 3: EXECUTION & OPERATIONS - MCP Routes (6 Artifacts)**

```typescript
// GTM Operations & Execution Plan (Step 7)
GET /api/mcp/company/{company_url}/artifact/18/quality-management-system
GET /api/mcp/company/{company_url}/artifact/19/implementation-roadmap
GET /api/mcp/company/{company_url}/artifact/20/gtm-process-tech-stack

// Performance Measurement & KPIs (Step 8)
GET /api/mcp/company/{company_url}/artifact/21/core-gtm-kpis
GET /api/mcp/company/{company_url}/artifact/22/strategic-gtm-goals

// Risk & Mitigation (Step 9)
GET /api/mcp/company/{company_url}/artifact/23/gtm-risk-assessment
```

#### **MCP Response Format**

```typescript
interface ArtifactMCPResponse {
  artifact_id: number;
  artifact_name: string;
  company_url: string;
  data: any;                    // Business intelligence data
  status: 'draft' | 'validated' | 'published';
  confidence_score: number;     // 0-100
  sources: {
    research_derived: boolean;
    user_validated: boolean;
    user_corrected: boolean;
  };
  metadata: {
    last_updated: timestamp;
    updated_by: string;
    version_number: number;
  };
}
```

#### **Query Performance Optimization**

```sql
-- Optimized queries for MCP route access
SELECT artifact_1_company_mission_vision 
FROM company_business_intel 
WHERE company_url = $1;

-- Multi-artifact queries (Part-based)
SELECT 
  artifact_1_company_mission_vision,
  artifact_2_core_offering_definition,
  artifact_3_regulatory_pathway,
  artifact_4_revenue_streams_pricing
FROM company_business_intel 
WHERE company_url = $1;

-- Full profile query
SELECT * FROM company_business_intel 
WHERE company_url = $1;
```

## 2. Database Architecture (Supabase 3-Tier)

### ✅ 3-Tier Architecture Implementation
- **Tier 1**: research_data (90-day retention, n8n input)
- **Tier 2**: assessment_sessions (60-day retention, interview working data)
- **Tier 3**: company_business_intel (persistent, 23 artifacts, MCP target)
- **Access Patterns**:
  - Supabase Client: Auth, real-time subscriptions, RLS policies
  - MCP Routes: Direct artifact access for business intelligence

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
| **3-Tier Database** | **Assessment Data Architecture** | **Supabase + MCP** | **✅ Active** |
| Tier 1: research_data | n8n research input | Direct Connection | ✅ Active |
| Tier 2: assessment_sessions | Interview working data | Supabase Client + RLS | ✅ Active |
| Tier 3: company_business_intel | 23 artifact MCP routes | MCP Protocol | ✅ Active |
| **Development Tools** | **Development Support** | **MCP Protocol** | **Status** |
| GitHub MCP | Dev Operations | MCP Protocol | ✅ Secured |
| Supabase MCP | Admin Operations | MCP Protocol | ✅ Secured |
| Playwright MCP | Testing | MCP Protocol | ✅ Active |
| Shadcn MCP | Component Library | MCP Protocol | ✅ Active |
| Context7 MCP | Documentation Access | MCP Protocol | ✅ Active |
| **Agent Integration** | **Business Logic** | **Internal APIs** | **Status** |
| Voice Agent | ElevenLabs I/O | API Routes | ✅ Active |
| Interview Orchestrator | Business Logic | Internal Service | ⏳ Pending |
| Data Validation Agent | Tier 2 Updates | Supabase Client | ⏳ Pending |
| Data Synthesis Agent | Tier 2 → Tier 3 | Background Job | ⏳ Pending |

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