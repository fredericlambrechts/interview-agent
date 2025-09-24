# **SuperSwift Product Requirements Document (PRD)**

## **Goals and Background Context**

### **Goals**

* Build a minimal viable prototype of SuperSwift's Assessment Interview Agent.  
* Demonstrate the ability to conduct structured business discovery through natural voice interaction.  
* Validate the conversational AI approach for business assessment.  
* Establish the technical foundation for voice-first interactions.  
* Create the data collection pipeline that feeds strategic asset generation.  
* Test user acceptance of AI-conducted business interviews.

### **Background Context**

The assessment interview is the foundation of all strategic consulting engagements. By automating this critical first step, SuperSwift aims to capture context that traditional forms miss, build trust through natural voice interaction, scale expertise, and accelerate time-to-value from days to minutes for medtech companies.

### **Change Log**

| Date | Version | Description | Author |  
| 2025-09-20 | 2.0 | Updated with 3-tier data architecture and agent collaboration system | Winston 🏗️ |
| 2025-09-17 | 1.0 | Initial PRD draft. | John |

## **Requirements**

### **Functional**

1. **FR1:** The system must provide a voice-first interface for structured business discovery using ElevenLabs API through a 3-agent collaboration system (Voice Agent, Interview Orchestrator, Data Validation Agent).
2. **FR2:** The system must manage a conversational flow for the interview process with step-scoped memory, dynamic question generation based on research gaps, and guided progression with skip-ahead warnings.
3. **FR3:** The system must implement a 3-tier data architecture for business context collection:
   - **Tier 1:** Research data from n8n workflows (input layer, 90-day retention)
   - **Tier 2:** Assessment interview data with step-by-step validation (working layer, 60-day retention)  
   - **Tier 3:** Final business intelligence with team collaboration (persistent MCP target layer)
4. **FR4:** The system must be built as a full-stack web application with auto-creation of assessment sessions from research completion and template-based report generation.
5. **FR5:** The system must provide a processing UI during data synthesis and support team-based access control for business intelligence data.

### **Non Functional**

1. **NFR1:** The system must be scalable to handle concurrent voice interviews.  
2. **NFR2:** The system must ensure data security for all collected business context.  
3. **NFR3:** The system must be reliable to prevent interview interruption or data loss.

## **User Interface Design Goals**

### **Overall UX Vision**

The UX vision is to create a seamless, natural, and trustworthy conversational experience that feels more like an engaging discussion than a rigid Q\&A session.

### **Key Interaction Paradigms**

The primary interaction paradigm will be a voice-first, conversational interface. Secondary interactions will be visual indicators of conversational progress, context summaries, and a final call-to-action.

### **Core Screens and Views**

* **Company URL Form:** Initial form for company URL submission that triggers n8n research workflow.
* **Research Progress Page:** Visual indicator showing research workflow progress until completion.
* **Interview Landing Page:** Introduction page with assessment session auto-created from completed research.
* **Interview Interface:** Core voice interaction screen with step navigation, progress indicators, and completion markers.
* **Processing Screen:** Data synthesis progress UI with estimated completion time.
* **Assessment Report:** Final template-based go-to-market strategy assessment report.

### **Accessibility: None**

### **Branding: The design should be clean, modern, and professional, aligned with a B2B tech platform.**

### **Target Device and Platforms: Web Responsive**

## **Technical Assumptions**

### **Repository Structure: Monorepo**

### **Service Architecture: Monolith**

### **Testing Requirements: Unit \+ Integration**

### **Additional Technical Assumptions and Requests**

* **Voice Integration:** ElevenLabs API integrated through dedicated Voice Agent for speech-to-text and text-to-speech processing.
* **Agent Architecture:** 3-agent collaboration system (Voice Agent, Interview Orchestrator, Data Validation Agent) plus post-interview Data Synthesis Agent.
* **Backend Hosting:** N8N workflows for company research automation, feeding Tier 1 research data via webhook.
* **Database:** Supabase with 3-tier architecture (research_data, assessment_sessions, company_business_intel) using JSONB for complex business entities.
* **Data Flow:** Form submission → n8n research → auto-create assessment → interview → data synthesis → business intelligence.
* **Development:** Next.js starter kit foundation with Deno Edge Functions for server-side logic.
* **Local Setup:** Supabase CLI with 3-tier schema migration and Row Level Security policies.

## **Assessment Workflow Documentation**

### **Complete User Journey**

```
1. User submits company URL form
2. n8n research workflow processes company data → Tier 1 (research_data)
3. Research completion webhook auto-creates assessment session → Tier 2 (assessment_sessions)
4. User enters interview with smart context loading (current step + related data)
5. Interview Orchestrator asks dynamic questions based on research gaps and completion markers
6. Data Validation Agent updates step_data with user confirmations, corrections, additions
7. User navigates between steps (guided progression with skip-ahead warnings)
8. User completes final step → triggers processing UI (30-60 second synthesis)
9. Data Synthesis Agent processes Tier 2 → Tier 3 (company_business_intel) asynchronously
10. User receives template-based go-to-market strategy assessment report
```

### **Agent Collaboration Workflow**

**During Interview Steps:**
```
User Voice Input → Voice Agent (transcription) → Interview Orchestrator (analysis & routing) → Data Validation Agent (step_data updates) → Voice Agent (response synthesis)
```

**Post-Interview Processing:**
```
Completed Assessment → Data Synthesis Agent → Combine (research + confirmations + corrections + additions) → Generate Business Intelligence → Template Report
```

### **Data Tier Integration**

- **Tier 1 Integration:** Interview Orchestrator reads research data for contextual questions
- **Tier 2 Integration:** Data Validation Agent manages step_data with completion tracking
- **Tier 3 Integration:** Data Synthesis Agent creates final business intelligence with team access control

### **Step Completion Logic**

- **In-Progress Steps:** Interview agent actively asks questions, processes responses
- **Completed Steps:** Interview agent responsive to questions but not proactive
- **Dynamic Questions:** Based on completion_markers and open_questions tracking
- **Navigation:** Users can skip ahead with warnings, return to incomplete steps

## **Official Assessment Structure: 23 Artifacts Across 9 Steps**

### **PART 1: Strategic Foundation (Steps 1-2, 8 artifacts)**

#### **Step 1: Core Identity & Business Model (4 artifacts)**
1. **Company Mission & Vision** - Core purpose and strategic direction
2. **Core Offering Definition** - Primary product/service value proposition  
3. **Regulatory Pathway (MedTech)** - FDA/CE approval strategy and timeline
4. **Revenue Streams & Pricing** - Business model and monetization strategy

#### **Step 2: Customer & Market Intelligence (4 artifacts)**
5. **Market Sizing (TAM, SAM, SOM)** - Total addressable and serviceable market analysis
6. **Clinical Evidence & KOL Strategy** - Key opinion leader engagement and evidence requirements
7. **Ideal Customer Profile** - Target customer segmentation and characteristics
8. **Customer Pains & Gains** - Pain points addressed and value delivered

### **PART 2: Strategy & Positioning (Steps 3-6, 9 artifacts)**

#### **Step 3: Competitive Analysis (2 artifacts)**
9. **Direct & Indirect Competitors** - Competitive landscape mapping
10. **Competitive Positioning & Differentiation** - Unique value proposition and market positioning

#### **Step 4: Channel Strategy (3 artifacts)**
11. **Channel Strategy Overview** - Go-to-market channel approach
12. **Sales Process & Methodology** - Sales funnel and methodology framework
13. **GTM Team Structure & Roles** - Team organization and responsibilities

#### **Step 5: Partnership Strategy (2 artifacts)**
14. **Strategic Partnership Framework** - Partner ecosystem strategy
15. **Partner Enablement & Incentive Models** - Partner onboarding and motivation systems

#### **Step 6: Brand & Messaging (2 artifacts)**
16. **Brand Positioning Statement** - Core brand positioning and market perception
17. **Core Messaging Pillars** - Key messages and communication framework

### **PART 3: Execution & Operations (Steps 7-9, 6 artifacts)**

#### **Step 7: GTM Operations (3 artifacts)**
18. **Quality Management System (MedTech)** - ISO 13485 and regulatory compliance systems
19. **Implementation Roadmap & Timeline** - Execution plan and milestone tracking
20. **GTM Process & Tech Stack** - Systems, tools, and process optimization

#### **Step 8: Performance Measurement (2 artifacts)**
21. **Core GTM KPIs** - Key performance indicators and success metrics
22. **Strategic GTM Goals** - Quantified strategic objectives and targets

#### **Step 9: Risk Management (1 artifact)**
23. **Comprehensive GTM Risk Assessment** - Risk identification, mitigation, and contingency planning

### **Research Data Reference**

The assessment process integrates with automated research data stored in `docs/icometrix_gtm_assessment.html` (sample research output file). This research data provides the foundational context for interview questions and should include:

- **Company background and market context**
- **Competitive intelligence and market positioning**
- **Financial and business model insights** 
- **Regulatory and compliance requirements**
- **Source links and reference documentation** (Note: source links are not currently in the sample file but should be included in the research data for validation and follow-up)

## **Epic List**

* **Epic 1: 3-Tier Database Foundation & Agent Architecture:** Establish Supabase 3-tier schema, implement agent collaboration system, and build core data flow pipeline.
* **Epic 2: Voice Interface & Interview Experience:** Integrate ElevenLabs API, build interview UI with step navigation, and implement dynamic question generation.
* **Epic 3: Research Integration & Data Synthesis:** Connect n8n workflows, implement assessment auto-creation, and build template-based report generation.

## **Epic 1: Foundational Setup & Voice Interface**

### **Story 1.1 Foundational Project Setup**

As a **developer**, I want to **set up the project environment**, so that I can **begin building the application**.

#### **Acceptance Criteria**

1. The nextjs-starter-kit is cloned and installed successfully.  
2. All project dependencies are installed.  
3. The local development server can be started and runs without errors.  
4. The project folder structure is consistent with the provided starter kit.

### **Story 1.2 ElevenLabs Voice API Integration**

As a **developer**, I want to **integrate with the ElevenLabs API**, so that I can **generate natural voice responses and process user voice input**.

#### **Acceptance Criteria**

1. The ElevenLabs API key is securely configured in the project's environment variables.  
2. A server-side endpoint is created to handle text-to-speech requests and stream audio back to the client.  
3. The system can capture a user's voice and send it to the ElevenLabs API for transcription.  
4. The system can receive and play back a transcribed voice response.

### **Story 1.3 Core Interview UI & Logic**

As a **user**, I want to **start and complete a guided interview**, so that I can **provide business context to the SuperSwift agent**.

#### **Acceptance Criteria**

1. A landing page is built with a button to start the interview.  
2. The interview UI displays the conversational flow and provides visual cues for when the agent is "speaking" or "listening."  
3. The agent can ask a sequence of pre-defined questions.  
4. The user can respond to the agent's questions using their voice.  
5. Upon completion of the interview, a summarized output of the conversation is presented to the user.  
6. The interview concludes gracefully with a completion message.

## **Checklist Results Report**

*(To be run by the PO agent after document completion)*

## **Next Steps**

### **UX Expert Prompt**

The PRD is complete. Please review the document and create a comprehensive UI/UX specification. Focus on the user experience of the conversational interface, including key screens, user flows, and interaction patterns.

### **Architect Prompt**

The PRD is complete. Please review the document and create a comprehensive full-stack architecture document. Focus on the technical implementation of the voice interface, data pipeline, and the use of Supabase and Deno Edge Functions.