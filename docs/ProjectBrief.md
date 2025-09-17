# **Project Brief: SuperSwift Assessment Interview Agent**

## **Executive Summary**

SuperSwift is an AI-first strategic business consulting platform that automates go-to-market (GTM) intelligence. This prototype represents the foundation of the platform: an AI-powered interview agent that conducts natural, conversational business assessments to capture critical context. This agent will validate a voice-first approach to discovery, build user trust, and establish the data pipeline necessary to automate the generation of strategic assets and growth plans for medtech companies.

## **Problem Statement**

Traditional business assessment processes often rely on forms and static questionnaires, which fail to capture conversational nuance and inhibit the development of trust. This leads to incomplete context, which makes generating accurate, actionable strategic assets and growth plans difficult and time-consuming.

## **Proposed Solution**

The proposed solution is a minimal viable prototype of the SuperSwift Assessment Interview Agent. This agent will automate the critical first step of strategic consulting by conducting structured business discovery through natural voice interaction. The goal is to lay the groundwork for a platform that can capture rich business context, build trust with users, and accelerate time-to-value by delivering strategic assets and growth plans in minutes instead of days.

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

* **Conversational AI:** The agent must be able to conduct a structured business discovery through natural voice interaction.  
* **Data Collection:** The prototype must successfully create a data collection pipeline that feeds strategic asset generation.  
* **User Acceptance:** The prototype must test and validate user acceptance of AI-conducted business interviews.

## **MVP Scope**

### **Core Features (Must Have)**

* **Voice-First Assessment Interview:** The agent must be able to ask and receive responses to a structured set of business discovery questions using natural voice.  
* **Data Collection Pipeline:** The agent must be able to store the collected business context data.  
* **Conversation Flow Management:** The agent must be able to guide the conversation through a structured interview while allowing for conversational nuance.

### **Out of Scope for MVP**

* Strategic asset or growth plan generation.  
* Competitor monitoring or LinkedIn intelligence.  
* Full platform functionality beyond the assessment interview agent.

## **Technical Considerations**

* **Source Tree:** The project will be built using the nextjs-starter-kit from https://github.com/michaelshimeles/nextjs-starter-kit.  
* **Server-Side Code:** Serverless code will be hosted on Deno.com.  
* **Data Storage:** Data will be stored in Supabase via edge functions.  
* **Backend Hosting:** N8N workflows will be hosted at https://n8n.srv758490.hstgr.cloud.

## **Constraints & Assumptions**

* **Focus:** This project is a minimal prototype to validate core concepts, not a production-ready application.  
* **Timeline:** The timeline for this prototype is short, focusing on demonstrating core functionality as quickly as possible.  
* **Resources:** We will leverage the provided starter kit and the specified backend services to accelerate development.

## **Next Steps**

This Project Brief provides the full context for the SuperSwift Assessment Interview Agent prototype. Please review the brief thoroughly. We will be using this document to define the detailed epic and story structure to move forward with development.