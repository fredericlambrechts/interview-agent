# **Project Brief: SuperSwift Assessment Interview Agent**

**Version:** 2.0  
**Last Updated:** 2025-09-20  
**Status:** Updated with 3-Tier Architecture & 23-Artifact Assessment System

## **Executive Summary**

SuperSwift is an AI-first strategic business consulting platform that automates comprehensive go-to-market (GTM) intelligence through a sophisticated 3-agent collaboration system. This advanced implementation features a 23-artifact assessment framework organized across 9 structured interview steps, supported by a 3-tier data architecture that seamlessly integrates research automation, voice-first interviews, and persistent business intelligence for medtech companies.

## **Problem Statement**

Traditional business assessment processes often rely on forms and static questionnaires, which fail to capture conversational nuance and inhibit the development of trust. This leads to incomplete context, which makes generating accurate, actionable strategic assets and growth plans difficult and time-consuming.

## **Proposed Solution**

The SuperSwift Assessment Interview Agent is a comprehensive voice-first business intelligence system featuring:

### **3-Agent Collaboration Architecture**
- **Voice Agent:** Pure ElevenLabs I/O interface for speech processing
- **Interview Orchestrator:** Intelligent routing and dynamic question generation
- **Data Validation Agent:** Real-time artifact validation and completion tracking

### **23-Artifact Assessment Framework**
- **Strategic Foundation:** 8 artifacts across core identity and market intelligence
- **Strategy & Positioning:** 9 artifacts covering competitive landscape and go-to-market approach
- **Execution & Operations:** 6 artifacts for performance measurement and risk mitigation

### **3-Tier Data Architecture**
- **Tier 1:** Automated research data from n8n workflows (90-day retention)
- **Tier 2:** Assessment interview working data with step-by-step validation (60-day retention)
- **Tier 3:** Persistent business intelligence with team collaboration and MCP access

This system transforms traditional business discovery from static forms to dynamic, AI-orchestrated conversations that generate comprehensive strategic intelligence.

## **Target Users**

### **Primary User Segment: Medtech Companies**

* **Profile:** Medical device manufacturers, digital health startups, and diagnostic companies.  
* **Needs & Pain Points:** These companies operate in a highly regulated and complex market with intricate buying cycles. They require specialized GTM expertise to navigate this landscape, a service often provided by expensive senior consultants.  
* **Goals:** They want efficient, scalable, and specialized GTM intelligence to accelerate their market entry and growth.

### **Secondary User Segment: Future Expansion**

* **Profile:** Broader B2B tech sectors.  
* **Needs & Pain Points:** B2B tech companies also have complex sales cycles and require specialized expertise to develop and execute GTM strategies.  
* **Goals:** Validate the Medtech playbook before expanding the platform's capabilities to serve these broader sectors.

## **Goals & Success Metrics**

### **Business Objectives**

* **Validate Conversational AI:** Prove that a voice-first approach can successfully capture essential business context.  
* **Accelerate Time-to-Value:** Reduce the time it takes to go from initial assessment to actionable insights from days to minutes.  
* **Scale Expertise:** Replicate the discovery sessions of senior consultants to scale specialized GTM expertise.  
* **Build Trust:** Establish trust with users through natural voice interaction.

### **MVP Success Criteria**

* **3-Agent Collaboration:** Voice Agent, Interview Orchestrator, and Data Validation Agent work seamlessly together
* **23-Artifact Assessment:** Complete capture and validation of all strategic business intelligence artifacts
* **Research Integration:** Automated n8n workflow integration with assessment session creation
* **Voice-First Experience:** Natural conversation flow with artifact-based UI and step navigation
* **Business Intelligence Output:** Template-based assessment reports with validated data

## **MVP Scope**

### **Core Features (Must Have)**

* **Automated Research Pipeline:** n8n workflows process company data and auto-create assessment sessions
* **9-Step Assessment Interview:** Structured progression through Strategic Foundation, Strategy & Positioning, and Execution & Operations
* **Artifact-Based UI:** Visual separators and completion tracking for all 23 business artifacts
* **Voice-First Interaction:** ElevenLabs integration with step-scoped memory and dynamic question generation
* **3-Tier Data Flow:** Research data → Interview validation → Business intelligence with team collaboration
* **Processing & Report Generation:** Data synthesis with template-based go-to-market strategy assessment

### **Advanced Features Included**

* **Smart Context Loading:** Hybrid loading (current step + related data, lazy load full context)
* **Dynamic Question Generation:** Based on research gaps and artifact completion markers
* **Team Collaboration:** Multi-user access control and change history for business intelligence
* **MCP Integration:** 23 artifact-based routes for external tool access
* **Data Retention Policies:** Automated cleanup with 90/60-day retention for cost optimization

### **Out of Scope for MVP**

* Live competitor monitoring beyond initial research
* Advanced analytics dashboard
* Multi-company comparison features
* Enterprise SSO integration

## **Technical Architecture**

### **Core Platform Stack**
* **Frontend Framework:** Next.js with shadcn/ui component library
* **Database:** Supabase PostgreSQL with 3-tier architecture (research_data, assessment_sessions, company_business_intel)
* **Backend Runtime:** Deno Edge Functions for serverless business logic
* **Voice Integration:** ElevenLabs API for speech-to-text and text-to-speech
* **Workflow Engine:** N8N for automated research pipeline (hosted at https://n8n.srv758490.hstgr.cloud)

### **Agent Architecture Implementation**
* **Voice Agent:** Pure presentation layer handling ElevenLabs I/O
* **Interview Orchestrator:** Business logic layer with smart context loading and dynamic questioning
* **Data Validation Agent:** Data management layer for artifact validation and completion tracking
* **Data Synthesis Agent:** Post-interview processing for Tier 2 → Tier 3 business intelligence synthesis

### **Data Flow Architecture**
```
User Form → n8n Research → Tier 1 (research_data)
Research Complete → Auto-create Assessment → Tier 2 (assessment_sessions)  
Interview Process → Artifact Validation → Step-by-step completion
Interview Complete → Data Synthesis → Tier 3 (company_business_intel)
Final Report → Template-based Assessment → MCP-accessible Business Intelligence
```

### **Integration & Tool Support**
* **MCP Protocol:** 23 artifact-based business intelligence routes
* **Row Level Security:** User isolation and team-based access control
* **Data Retention:** Automated cleanup functions (90-day research, 60-day interview data)
* **Type Safety:** Generated TypeScript types from database schema
* **Real-time Updates:** Supabase real-time subscriptions for interview progress

## **Constraints & Assumptions**

### **Development Constraints**
* **Architecture Complexity:** 3-tier database with 23 artifacts requires careful data modeling and validation
* **Agent Coordination:** 3-agent collaboration system needs precise interface contracts and error handling
* **Voice Integration:** ElevenLabs API integration must maintain sub-2-second response times for natural conversation
* **Research Quality:** n8n workflow reliability directly impacts assessment data quality

### **Technical Assumptions**
* **Supabase Scalability:** PostgreSQL with JSONB can handle complex artifact structures at scale
* **MCP Performance:** 23 artifact routes will maintain <200ms response times for business intelligence access
* **Voice API Reliability:** ElevenLabs provides consistent transcription and synthesis quality
* **Data Retention:** 90/60-day retention policies will optimize storage costs while maintaining audit compliance

### **Business Assumptions**
* **User Acceptance:** C-suite executives will engage with 30-60 minute voice-first assessment interviews
* **Artifact Completeness:** 23-artifact framework captures sufficient business intelligence for strategic consulting
* **Research Automation:** n8n workflows can gather adequate company data for meaningful interview context

## **Next Steps**

This Project Brief provides the full context for the SuperSwift Assessment Interview Agent prototype. Please review the brief thoroughly. We will be using this document to define the detailed epic and story structure to move forward with development.