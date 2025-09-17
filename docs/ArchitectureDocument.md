# **SuperSwift Fullstack Architecture Document**

## **Introduction**

### **Introduction Content**

This document outlines the complete full-stack architecture for the SuperSwift Assessment Interview Agent. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for this modern full-stack application.

### **Starter Template or Existing Project**

The project will be based on the **Next.js starter kit**. This is a great choice as it provides a solid foundation for both the frontend UI and the backend API routes. I will ensure all of our architectural decisions align with the patterns and conventions established by this starter kit to accelerate our development.

### **Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-09-17 | 1.0 | Initial architecture draft. | Winston 🏗️ |

## **High Level Architecture**

### **Technical Summary**

The SuperSwift prototype will use a modern, serverless-first architecture designed for rapid development and scalability. The system will consist of a **Next.js frontend hosted on Vercel**, which acts as a client, and a serverless backend powered by **Vercel Functions**. This design enables seamless integration with external APIs like ElevenLabs and provides a powerful, cost-effective platform to build and test the core conversational and data collection features of the prototype.

### **High Level Overview**

This project will use a **monorepo** structure that contains a Next.js application, which handles both the frontend UI and the serverless backend logic via Vercel Functions. The core architectural style is **serverless**, leveraging the **Vercel platform** for its hosting and functions, and Supabase for its database and authentication. The main data flow begins with a user on the frontend, moves through the Vercel Functions API, interacts with the ElevenLabs API, and stores data in the Supabase database.

### **High Level Project Diagram**

graph TD  
    User(User) \--\> VercelHosting\[Vercel Hosting\]  
    VercelHosting \--\> Frontend\[Next.js Frontend\]  
    Frontend \--\> |API Calls| VercelFunctions\[Vercel Functions (Backend)\]  
    VercelFunctions \--\> SupabaseDB\[Supabase Database\]  
    VercelFunctions \--\> ElevenLabs\[ElevenLabs API\]  
    Frontend \--\> N8N\[N8N Workflows\]  
    VercelFunctions \--\> N8N  
    Frontend \--\> SupabaseAuth\[Supabase Auth\]

### **Architectural and Design Patterns**

* **Serverless Architecture:** We will use **Vercel Functions** to deploy our backend logic. This approach is highly scalable, cost-effective, and aligns with the Next.js framework.  
* **Component-Based UI:** The frontend will be built using a component-based architecture with Next.js and shadcn/ui. This approach promotes reusability, simplifies development, and ensures a consistent user experience.  
* **Repository Pattern:** We will abstract our data access logic from the business logic. This pattern will make our code easier to test and will allow for future database migration with minimal impact on our application.  
* **API Gateway Pattern:** The Vercel Functions will act as a centralized API gateway for all of our backend logic. This will simplify our client-side code and provide a single entry point for all API calls.

## **Tech Stack**

### **Technology Stack Table**

| Category | Technology | Version | Purpose | Rationale |
| :---- | :---- | :---- | :---- | :---- |
| **Version Control** | GitHub | N/A | Centralized code repository | Standard for modern development; provides collaboration and versioning. |
| **Frontend Framework** | Next.js | Latest | Primary frontend framework | Vercel's native framework, powerful features, and great ecosystem. |
| **Cloud Hosting** | Vercel | Latest | Hosting of frontend and serverless backend | Seamless integration with Next.js for a streamlined development and deployment workflow. |
| **Backend Functions** | Vercel Functions | Node.js (Latest) | Serverless backend logic | Extends the Next.js framework for a unified development environment. |
| **UI Component Library** | shadcn/ui | Latest | High-quality UI components | Provides a clean, professional base style that can be easily customized with our brand colors. |
| **Styling Framework** | Tailwind CSS | Latest | Utility-first CSS framework | The recommended styling approach for shadcn/ui and Vercel. |
| **Testing Framework** | Playwright | N/A | Automated end-to-end testing | A modern E2E framework that supports AI-driven workflows via MCP. |
| **Context Management** | Context7 | N/A | Up-to-date documentation for AI agents | Injects real-time, version-specific documentation into prompts to prevent hallucinations. |
| **Database** | Supabase | N/A | Primary database and authentication | A powerful, hosted Postgres solution that simplifies our data and auth needs. |
| **External AI/Voice** | ElevenLabs | N/A | Core conversational AI and voice service | The platform for the interview agent's voice and intelligence. |
| **Workflow Automation** | n8n | N/A | Research and data orchestration | A low-code platform for building complex data collection and integration workflows. |

## **Data Models**

### **Company Profile (Final)**

* **Purpose:** To store all pre-researched information and the refined data from the assessment interview.  
* **Key Attributes:**  
  * company\_url: (string)  
  * strategic\_foundation: (json)  
    * core\_identity\_business\_model: (json)  
      * company\_mission\_vision: (json)  
        * data: (json)  
        * status: (string) \- researched, confirmed, corrected  
      * core\_offering\_definition: (json)  
        * data: (json)  
        * status: (string)  
      * regulatory\_pathway: (json)  
        * data: (json)  
        * status: (string)  
      * revenue\_streams\_pricing: (json)  
        * data: (json)  
        * status: (string)  
    * customer\_market\_intelligence: (json)  
      * market\_sizing: (json)  
        * data: (json)  
        * status: (string)  
      * clinical\_evidence: (json)  
        * data: (json)  
        * status: (string)  
      * ideal\_customer\_profile: (json)  
        * data: (json)  
        * status: (string)  
      * customer\_pains\_gains: (json)  
        * data: (json)  
        * status: (string)  
  * strategy\_positioning: (json)  
    * competitive\_landscape: (json)  
      * direct\_indirect\_competitors: (json)  
        * data: (json)  
        * status: (string)  
      * competitive\_positioning\_differentiation: (json)  
        * data: (json)  
        * status: (string)  
    * channel\_go\_to\_market: (json)  
      * channel\_strategy: (json)  
        * data: (json)  
        * status: (string)  
      * sales\_process\_methodology: (json)  
        * data: (json)  
        * status: (string)  
      * gtm\_team\_structure: (json)  
        * data: (json)  
        * status: (string)  
      * partnership\_alliance: (json)  
        * strategic\_partnership\_framework: (json)  
        * data: (json)  
        * status: (string)  
      * partner\_enablement: (json)  
        * data: (json)  
        * status: (string)  
    * brand\_messaging: (json)  
      * brand\_positioning\_statement: (json)  
        * data: (json)  
        * status: (string)  
      * core\_messaging\_pillars: (json)  
        * data: (json)  
        * status: (string)  
  * execution\_operations: (json)  
    * gtm\_operations: (json)  
      * quality\_management\_system: (json)  
        * data: (json)  
        * status: (string)  
      * high\_level\_roadmap: (json)  
        * data: (json)  
        * status: (string)  
      * gtm\_process\_tech\_stack: (json)  
        * data: (json)  
        * status: (string)  
    * performance\_measurement\_kpis: (json)  
      * core\_gtm\_kpis: (json)  
        * data: (json)  
        * status: (string)  
      * strategic\_gtm\_goals: (json)  
        * data: (json)  
        * status: (string)  
    * risk\_mitigation: (json)  
      * comprehensive\_gtm\_risk: (json)  
        * data: (json)  
        * status: (string)

### **Interview Session**

* **Purpose:** To log the progress and content of each interview conversation.  
* **Key Attributes:**  
  * user\_id: (string)  
  * company\_profile\_id: (string)  
  * conversation\_log: (json)  
  * current\_step: (string)  
  * status: (string)

## **Database Schema**

\-- Table: public.company\_profiles  
CREATE TABLE public.company\_profiles (  
    id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
    user\_id UUID REFERENCES public.users(id),  
    company\_url TEXT NOT NULL,  
    created\_at TIMESTAMPTZ DEFAULT now(),  
    updated\_at TIMESTAMPTZ DEFAULT now(),  
    strategic\_foundation JSONB DEFAULT '{}'::JSONB,  
    strategy\_positioning JSONB DEFAULT '{}'::JSONB,  
    execution\_operations JSONB DEFAULT '{}'::JSONB  
);

\-- Table: public.interview\_sessions  
CREATE TABLE public.interview\_sessions (  
    id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
    user\_id UUID REFERENCES public.users(id),  
    company\_profile\_id UUID REFERENCES public.company\_profiles(id),  
    conversation\_log JSONB DEFAULT '\[\]'::JSONB,  
    current\_step TEXT,  
    status TEXT NOT NULL,  
    created\_at TIMESTAMPTZ DEFAULT now(),  
    updated\_at TIMESTAMPTZ DEFAULT now()  
);

## **Source Tree**

super-swift/  
├── apps/  
│   └── web/  
│       ├── app/  
│       │   ├── api/  
│       │   │   ├── research/  
│       │   │   └── interview/  
│       │   └── (routes)/  
│       ├── components/  
│       ├── lib/  
│       └── ...  
├── packages/  
│   └── types/  
├── claude-code/  
├── supabase/  
│   └── functions/  
├── .env.local  
├── .mcp.json  
├── package.json  
└── README.md

## **Infrastructure and Deployment**

### **Deployment Strategy**

* **Platform:** Vercel will handle the hosting of our Next.js application and its serverless functions.  
* **CI/CD:** Vercel’s built-in Git integration will automatically deploy our project on every push to the main branch.  
* **Environments:** Vercel will provide automatic preview environments for every pull request, allowing for easy testing before merging.  
* **Rollback:** Vercel allows for instant rollbacks to a previous deployment with a single click.