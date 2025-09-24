# MCP (Model Context Protocol) Setup Guide

**Version:** 2.0  
**Updated:** 2025-09-20  
**Status:** Includes Business Intelligence Artifact Routes

## Overview

This guide covers MCP setup for SuperSwift's Assessment Interview Agent, including access to the 23-artifact business intelligence system through the 3-tier data architecture.

## Initial Setup

1. **Copy the example configuration:**
   ```bash
   cp .mcp.json.example .mcp.json
   ```

2. **Update .mcp.json with your actual tokens:**
   - `YOUR_SUPABASE_PROJECT_REF`: Get from Supabase dashboard → Settings → General
   - `SUPABASE_ACCESS_TOKEN`: Get from Supabase dashboard → Account → Access Tokens
   - `GITHUB_PERSONAL_ACCESS_TOKEN`: Create at github.com → Settings → Developer settings → Personal access tokens
   - `VERCEL_TOKEN`: Get from vercel.com → Account Settings → Tokens
   - `CONTEXT7_API_KEY`: Get from your Context7 account (if using)

## Security Notes

- ⚠️ **NEVER commit .mcp.json to version control** - it's gitignored for safety
- ✅ Use .mcp.json.example as a template for team members
- ✅ Create tokens with minimal required permissions
- ✅ Rotate tokens regularly

## Token Permission Guidelines

### GitHub Token
Minimum permissions needed:
- `repo` (for private repos) or `public_repo` (for public)
- `read:user`
- `read:org` (if working with org repos)

### Supabase Access Token
- Create a dedicated access token for MCP
- Don't use your main account token

### Vercel Token
- Scope to specific projects if possible
- Use read-only permissions where applicable

## Troubleshooting

If MCP servers fail to connect:
1. Check token validity
2. Ensure all required npm packages are installed
3. Try running individual MCP servers in debug mode
4. Check Claude's MCP logs for specific errors

## Team Collaboration

When sharing with team:
1. Share tokens via secure password manager
2. Each developer maintains their own .mcp.json
3. Never share tokens via chat/email/commits

## Business Intelligence MCP Routes

### Artifact-Based Access Patterns

The SuperSwift system provides MCP access to all 23 business intelligence artifacts through standardized routes.

#### **Core Route Structure**

```typescript
// Individual artifact access
GET /api/mcp/company/{company_url}/artifact/{artifact_id}

// Part-based bulk access
GET /api/mcp/company/{company_url}/part/1  // Strategic Foundation (8 artifacts)
GET /api/mcp/company/{company_url}/part/2  // Strategy & Positioning (9 artifacts)
GET /api/mcp/company/{company_url}/part/3  // Execution & Operations (6 artifacts)

// Complete business profile
GET /api/mcp/company/{company_url}/full-profile
```

### Strategic Foundation Artifacts (Part 1)

#### **Core Identity & Business Model (Step 1)**

```bash
# Company Mission & Vision
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/1/company-mission-vision"

# Core Offering Definition
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/2/core-offering-definition"

# Regulatory Pathway (MedTech)
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/3/regulatory-pathway"

# Revenue Streams & Pricing
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/4/revenue-streams-pricing"
```

#### **Customer & Market Intelligence (Step 2)**

```bash
# Market Sizing (TAM, SAM, SOM)
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/5/market-sizing"

# Clinical Evidence & KOL Strategy
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/6/clinical-evidence"

# Ideal Customer Profile
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/7/ideal-customer-profile"

# Customer Pains & Gains
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/8/customer-pains-gains"
```

### Strategy & Positioning Artifacts (Part 2)

#### **Competitive Analysis (Step 3)**

```bash
# Direct & Indirect Competitors
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/9/direct-indirect-competitors"

# Competitive Positioning & Differentiation
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/10/competitive-positioning"
```

#### **Go-to-Market Strategy (Steps 4-6)**

```bash
# Channel Strategy Overview
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/11/channel-strategy"

# Sales Process & Methodology
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/12/sales-process-methodology"

# GTM Team Structure & Roles
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/13/gtm-team-structure"

# Strategic Partnership Framework
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/14/strategic-partnership-framework"

# Partner Enablement & Incentive Models
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/15/partner-enablement"

# Brand Positioning Statement
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/16/brand-positioning-statement"

# Core Messaging Pillars
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/17/core-messaging-pillars"
```

### Execution & Operations Artifacts (Part 3)

#### **Operations & Performance (Steps 7-9)**

```bash
# Quality Management System (MedTech)
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/18/quality-management-system"

# Implementation Roadmap & Timeline
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/19/implementation-roadmap"

# GTM Process & Tech Stack
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/20/gtm-process-tech-stack"

# Core GTM KPIs
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/21/core-gtm-kpis"

# Strategic GTM Goals
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/22/strategic-gtm-goals"

# Comprehensive GTM Risk Assessment
curl "http://localhost:3000/api/mcp/company/acme-corp.com/artifact/23/gtm-risk-assessment"
```

### Bulk Operations

#### **Part-Based Access**

```bash
# Get all Strategic Foundation artifacts (1-8)
curl "http://localhost:3000/api/mcp/company/acme-corp.com/part/1"

# Get all Strategy & Positioning artifacts (9-17)
curl "http://localhost:3000/api/mcp/company/acme-corp.com/part/2"

# Get all Execution & Operations artifacts (18-23)
curl "http://localhost:3000/api/mcp/company/acme-corp.com/part/3"
```

#### **Complete Business Profile**

```bash
# Get all 23 artifacts in single request
curl "http://localhost:3000/api/mcp/company/acme-corp.com/full-profile"
```

### Response Format

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
    last_updated: string;
    updated_by: string;
    version_number: number;
  };
}
```

### Team Collaboration Routes

```bash
# Get team access list
curl "http://localhost:3000/api/mcp/company/acme-corp.com/team-access"

# Update team access (requires authentication)
curl -X PUT "http://localhost:3000/api/mcp/company/acme-corp.com/team-access" \
  -H "Content-Type: application/json" \
  -d '{"user_ids": ["user_123", "user_456"]}'

# Get change history
curl "http://localhost:3000/api/mcp/company/acme-corp.com/change-history"

# Get change history for specific artifact
curl "http://localhost:3000/api/mcp/company/acme-corp.com/change-history?artifact_id=7"
```

## Integration Examples

### Claude Code MCP Usage

```typescript
// Example Claude Code usage via MCP
const idealCustomerProfile = await mcp.get(
  '/api/mcp/company/acme-corp.com/artifact/7/ideal-customer-profile'
);

const competitiveAnalysis = await mcp.get(
  '/api/mcp/company/acme-corp.com/part/2'  // All Strategy & Positioning artifacts
);
```

### External Tool Integration

```python
# Python example for external tools
import requests

def get_company_artifacts(company_url, artifact_ids):
    results = {}
    for artifact_id in artifact_ids:
        response = requests.get(
            f"http://localhost:3000/api/mcp/company/{company_url}/artifact/{artifact_id}"
        )
        if response.status_code == 200:
            results[artifact_id] = response.json()
    return results

# Get key strategic artifacts
key_artifacts = get_company_artifacts("acme-corp.com", [1, 7, 9, 21])
```

## Authentication & Security

### Row Level Security (RLS)

All MCP routes respect Supabase RLS policies:
- Users can only access companies they have permissions for
- Team access is controlled via `team_access_list` in company_business_intel table
- Service role access is required for cross-user operations

### Rate Limiting

MCP routes include rate limiting:
- 100 requests per minute per user for individual artifacts
- 10 requests per minute for bulk operations (part/full-profile)
- 50 requests per minute for team collaboration routes

## Performance Optimization

### Caching Strategy

```typescript
// Recommended caching for high-frequency access
const cache = new Map();

async function getCachedArtifact(company_url: string, artifact_id: number) {
  const key = `${company_url}:${artifact_id}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const artifact = await fetch(`/api/mcp/company/${company_url}/artifact/${artifact_id}`);
  cache.set(key, artifact);
  
  // Cache for 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
  
  return artifact;
}
```

### Query Optimization

```sql
-- Database indexes optimize MCP route performance
-- Individual artifact access: ~50-100ms
-- Part-based access: ~100-200ms  
-- Full profile access: ~200-300ms

-- Example optimized query
SELECT artifact_7_ideal_customer_profile 
FROM company_business_intel 
WHERE company_url = 'acme-corp.com';
```