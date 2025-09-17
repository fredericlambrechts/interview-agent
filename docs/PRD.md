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
| 2025-09-17 | 1.0 | Initial PRD draft. | John |

## **Requirements**

### **Functional**

1. **FR1:** The system must provide a voice-first interface for structured business discovery.  
2. **FR2:** The system must manage a conversational flow for the interview process.  
3. **FR3:** The system must collect and store essential business context from the interview.  
4. **FR4:** The system must be built as a full-stack web application.

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

* **Interview Landing Page:** A simple page that introduces the user to the agent and initiates the interview.  
* **Interview Interface:** The core screen where the voice-based conversation takes place. It should provide subtle visual feedback on the conversation.  
* **Completion Screen:** A page that confirms the interview is complete and sets expectations for the next steps.

### **Accessibility: None**

### **Branding: The design should be clean, modern, and professional, aligned with a B2B tech platform.**

### **Target Device and Platforms: Web Responsive**

## **Technical Assumptions**

### **Repository Structure: Monorepo**

### **Service Architecture: Monolith**

### **Testing Requirements: Unit \+ Integration**

### **Additional Technical Assumptions and Requests**

* **Voice Integration:** The system will use the ElevenLabs API for text-to-speech and speech-to-text.  
* **Backend Hosting:** N8N workflows will be used for specific integrations or data flows.  
* **Database:** Supabase will be used as the primary database, with Deno Edge Functions for server-side code.  
* **Development:** The nextjs-starter-kit will be used as the project's foundation.  
* **Local Setup:** The Supabase CLI is a prerequisite for local development.

## **Epic List**

* **Epic 1: Foundational Setup & Voice Interface:** Establish the project foundation, integrate the core voice technology, and build the initial user interface to conduct a basic voice-first interview.  
* **Epic 2: Data Collection & Persistence:** Implement the data collection and storage pipeline, ensuring all interview context is securely captured and saved to the database.

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