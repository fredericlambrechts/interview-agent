# **SuperSwift UI/UX Specification**

## **Introduction**

This document defines the user experience goals, information architecture, user flows, and visual design specifications for SuperSwift's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

### **Overall UX Goals & Principles**

#### **Target User Personas**

* Our primary user will be a **C-suite executive or board member**. This means our design needs to be exceptionally polished, respectful of their time, and focused on delivering value without friction.

#### **Usability Goals**

* Our core goal is **Effortless Progress**. The experience must be so straightforward and intuitive that the user never feels lost. A **visual progress indicator** will provide clarity and reduce friction.

#### **Design Principles**

* **Clarity over Emojis:** Use professional icons to guide the user, never emojis.  
* **Clarity over cleverness:** Prioritize clear communication over aesthetic innovation.  
* **Progressive disclosure:** Show only what's needed, when it's needed.  
* **Consistent patterns:** Use familiar UI patterns throughout the application.  
* **Immediate feedback:** Every action should have a clear, immediate response.  
* **Accessible by default:** Design for all users from the start.

### **Information Architecture (IA)**

#### **Site Map / Screen Inventory**

The primary user journey is a simple, linear flow with three key screens.

graph TD  
    A\[Landing/Start Screen\] \--\> B\[Interview Interface\]  
    B \--\> C\[Summary View\]

#### **Navigation Structure**

* **Primary Navigation:** A simple, linear navigation where the user is guided from one screen to the next without a traditional menu system.  
* **Breadcrumb Strategy:** Not required for the MVP due to the linear nature of the flow.

### **User Flows**

#### **Assessment Interview Flow**

**User Goal:** The user wants to complete the interview to provide business context through a simple, open-ended conversation.

**Entry Points:** The "Start Assessment" button on the landing screen.

**Success Criteria:** The user successfully completes the three-question interview and is presented with a summary.

#### **Flow Diagram**

graph TD  
    A\[User clicks 'Start Assessment'\] \--\> B\[Agent asks Question 1\]  
    B \--\> C\[User responds to Question 1\]  
    C \--\> D\[Agent asks Question 2\]  
    D \--\> E\[User responds to Question 2\]  
    E \--\> F\[Agent asks Question 3\]  
    F \--\> G\[User responds to Question 3\]  
    G \--\> H\[Agent summarizes interview\]  
    H \--\> I\[User views summary\]

### **Wireframes & Mockups**

#### **Key Screen Layouts**

* **Landing/Start Screen:** A full-screen form that collects the user's **Name**, **Role**, and **Company URL**. The layout will be simple and professional, with a clear headline and a single, prominent call-to-action button.  
* **Interview Interface:** A two-pane layout, inspired by the ElevenLabs UI. The main panel will present pre-computed research, and the lower-left pane will host the voice-based conversation. The navigation will be streamlined to only indicate the **Phase Name** and **Current Step Name**.  
* **Summary View:** A polished, document-like interface organized into distinct sections using cards or panels, mirroring the provided screenshot. It will feature a professional report and a clear call to action to **create an account**.

### **Component Library / Design System**

* **Design System Approach:** We will adopt the shadcn/ui style as our base and apply our custom colors and brand voice on top of it.  
* **Core Components:** We will need a suite of core components, including but not limited to, buttons, input fields, a text area, and a card component for the summary view. We will also need a custom progress indicator and a component for the conversational agent pane.  
* **Iconography:** We will use professional icons to guide the user, not emojis. A specific icon library will be chosen later.

### **Branding & Style Guide**

#### **Visual Identity**

* **Brand Guidelines:** The visual style will be a minimal impact overlay on the base shadcn/ui styleguide, characterized by **minimal chrome and clean interfaces**.  
* **Brand Voice Tone:** The tone will be **short, crisp, bold, and board-level reassuring**, projecting **near-AGI competence**.  
* **Brand Voice Style:** Communications will be **concise and direct**, authoritative, forward-looking, and emphasize speed and efficiency in all interactions.

#### **Color Palette**

| Color Type | Hex Code | Usage |
| :---- | :---- | :---- |
| Primary | \#FF5D3B | Main actions, highlights, and primary UI elements. |
| Secondary | \#0A0A0A | Text, backgrounds, and other foundational elements. |
| Accent | Gradient | Interactive elements, special effects, and visual flair. |

#### **Typography**

* **Font Families:** A modern, clean **sans-serif** font family will be used for all text to maintain a professional and crisp appearance.  
* **Type Scale:** (To be defined in the front-end-architecture document)

### **Checklist Results**

*(To be run by the PO agent after document completion)*

### **Next Steps**

*(To be completed after final sign-off)*