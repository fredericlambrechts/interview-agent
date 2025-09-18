# SuperSwift Assessment Interview Agent

A voice-first AI interview agent for business discovery, built as a prototype to demonstrate conversational business assessment capabilities. This project automates strategic consulting discovery sessions through natural voice interaction.

## 🎯 Project Overview

SuperSwift is an AI-first strategic business consulting platform prototype that captures business context through conversational voice interviews. The system validates a voice-first approach to discovery, builds user trust through natural interaction, and establishes the foundation for automated strategic asset generation for medtech companies.

### Built on Next.js SaaS Starter Kit

This project is built upon the excellent [Next.js SaaS Starter Kit](https://github.com/michaelshimeles/nextjs-starter-kit), providing a solid foundation of modern web technologies. We've customized it specifically for voice-first business interviews while maintaining the robust architecture and best practices of the original starter kit.

## ✨ SuperSwift Features

### 🎙️ Voice-First Interview System
- **ElevenLabs API** integration for natural text-to-speech and speech-to-text
- Structured business discovery through conversational flow
- Real-time voice interaction with visual feedback
- Interview progress tracking and conversation logging

### 🏢 Business Context Collection
- Comprehensive data collection pipeline for strategic consulting
- Company profile generation from interview responses
- Market intelligence gathering through conversation
- Strategic foundation documentation and analysis

### 🔐 Authentication & User Management
- **Better Auth v1.2.8** - Modern authentication system
- Session management with database persistence
- User profile management for interview subjects
- Secure data handling for business-sensitive information

### 🤖 AI-Powered Conversation Management
- Intelligent interview flow management
- Context-aware question generation
- Natural conversation patterns with business focus
- Interview completion and summary generation

### 🎨 Modern UI/UX
- **Tailwind CSS v4** - Latest utility-first styling
- **shadcn/ui** components - Accessible, customizable
- **Radix UI** primitives - Unstyled, accessible components
- Dark/light theme support with smooth transitions
- Responsive design with mobile-first approach
- Loading skeletons and optimistic UI updates

### 🗄️ Database & Storage
- **Supabase PostgreSQL** - Serverless database with real-time capabilities
- **Drizzle ORM** - Type-safe database toolkit for interview data
- Database migrations with Drizzle Kit
- Secure storage of business interview data and profiles

### 📊 Analytics & Monitoring
- **PostHog** integration for product analytics
- User behavior tracking
- Custom event monitoring
- Error tracking and insights

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase PostgreSQL + Drizzle ORM
- **Authentication**: Better Auth v1.2.8
- **Voice AI**: ElevenLabs API for speech synthesis and recognition
- **Conversation AI**: OpenAI SDK for intelligent interview flow
- **Workflow Automation**: N8N for data orchestration
- **Analytics**: PostHog for interview analytics
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # Protected dashboard area
│   │   ├── _components/     # Dashboard components
│   │   ├── chat/           # AI chat interface
│   │   ├── upload/         # File upload functionality
│   │   ├── payment/        # Subscription management (from starter kit)
│   │   └── settings/       # User settings
│   ├── pricing/            # Public pricing page (from starter kit)
│   └── api/                # API routes
│       ├── interview/      # Interview API endpoints (NEW)
│       ├── research/       # Research API endpoints (NEW)
│       ├── auth/          # Authentication endpoints
│       └── subscription/  # Subscription webhooks
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── homepage/           # Landing page sections
├── lib/
│   ├── auth.ts            # Authentication config
│   ├── supabase.ts        # Supabase client config (NEW)
│   └── utils.ts           # Utility functions
├── db/
│   ├── schema.ts          # Database schema (includes interview data models)
│   └── drizzle.ts         # Database connection (updated for Supabase)
└── docs/                   # Project documentation (NEW)
    ├── stories/           # Development stories
    ├── ArchitectureDocument.md
    ├── PRD.md
    └── ProjectBrief.md
```

## 🛠️ Quick Start

### Prerequisites (PRD Requirements)
- **Node.js 18+** - JavaScript runtime
- **Supabase CLI** - Database and auth platform (PRD requirement)
- **ElevenLabs Account** - Voice API for voice-first interface (FR1)
- **OpenAI API Key** - Conversation intelligence
- **N8N Instance** - Workflow automation (PRD backend hosting requirement)
- **Deno** - Future requirement for Edge Functions

### 🚀 Environment Validation (Start Here!)

**Before setting up anything, check if you're ready to build:**

```bash
# Clone the repository
git clone https://github.com/fredericlambrechts/interview-agent.git
cd interview-agent

# Install dependencies
npm install

# 🔍 Check your environment setup
npm run validate-env
```

This will tell you exactly what's missing and provide setup links.

### 📋 Environment Setup (PRD-Compliant)

**Step 1: Copy the PRD-compliant environment template**
```bash
cp .env.prd-compliant .env.local
```

**Step 2: Configure required variables in `.env.local`**

**🔐 Critical PRD Requirements:**
```env
# Supabase (PRD Database Requirement)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ElevenLabs Voice API (FR1 - Voice-First Interface)
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=your-voice-id

# N8N Workflows (PRD Backend Hosting)
N8N_WEBHOOK_URL=https://your-n8n-instance.com
N8N_API_KEY=your-n8n-api-key

# OpenAI for Conversation AI
OPENAI_API_KEY=your-openai-api-key

# Core Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 3: Validate your setup**
```bash
npm run validate-env
```

**✅ When you see "Ready to build", you're good to go!**

4. **Database Setup**
```bash
# Generate and run migrations to Supabase
npx drizzle-kit generate
npx drizzle-kit push
```

5. **Supabase Setup**
- Create a new Supabase project
- Copy your project URL and anon key to environment variables
- Set up authentication providers if needed
- Configure Row Level Security (RLS) policies

6. **ElevenLabs Setup**
- Create an ElevenLabs account
- Generate an API key for voice synthesis
- Configure voice models for your interview agent

7. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🔄 Modifications from Starter Kit

This project builds upon the [Next.js SaaS Starter Kit](https://github.com/michaelshimeles/nextjs-starter-kit) with the following key modifications:

### Database Changes
- **Migrated from Neon to Supabase**: Updated database driver and connection handling
- **Enhanced Schema**: Added interview-specific data models for company profiles and interview sessions
- **Supabase Integration**: Added proper Supabase client configuration

### New Features Added
- **Voice API Integration**: Added ElevenLabs API setup for speech-to-text and text-to-speech
- **Interview API Endpoints**: Created dedicated API routes for interview functionality
- **Business Data Models**: Extended database schema with company profile and interview session tables
- **N8N Integration**: Added workflow automation capabilities for data processing

### Project Structure Enhancements
- **Documentation**: Added comprehensive project documentation in `/docs` folder
- **Story Management**: Implemented BMad story-driven development workflow
- **API Organization**: Restructured API routes for interview and research functionality

### Retained from Starter Kit
- **Authentication System**: Maintained Better Auth integration
- **UI Components**: Kept shadcn/ui components and Tailwind CSS styling
- **Modern Architecture**: Preserved Next.js 15 with App Router
- **Type Safety**: Maintained TypeScript and Drizzle ORM integration

## 🎯 SuperSwift Features Explained

### Voice-First Interview System
- **Natural Speech Processing**: ElevenLabs integration for realistic voice synthesis
- **Conversation Flow Management**: Structured interview progression with context awareness
- **Real-time Interaction**: Live voice feedback and visual conversation indicators
- **Interview Analytics**: Comprehensive tracking of conversation patterns and user engagement

### Business Discovery Engine
- **Strategic Framework**: Automated capture of business model, market intelligence, and strategic positioning
- **Company Profiling**: Dynamic generation of comprehensive business profiles from conversational data
- **Context Preservation**: Secure storage and retrieval of sensitive business information
- **Progress Tracking**: Visual interview completion status and conversation history

### File Upload System
- **Cloudflare R2 integration** with S3-compatible API
- **Drag & drop interface** with visual feedback
- **File validation** - Type checking and size limits
- **Progress tracking** - Real-time upload progress
- **Image gallery** - View uploaded files with metadata
- **Copy URLs** - Easy sharing and integration

### Analytics & Tracking
- PostHog event tracking
- User behavior monitoring
- Custom analytics dashboard

## 🔧 Customization

### Adding New Features
1. Create components in `components/`
2. Add API routes in `app/api/`
3. Update database schema in `db/schema.ts`
4. Run `npx drizzle-kit generate` and `npx drizzle-kit push`

### Styling
- Modify `app/globals.css` for global styles
- Use Tailwind classes for component styling
- Customize theme in `tailwind.config.ts`

### Authentication
- Configure providers in `lib/auth/auth.ts`
- Add new OAuth providers as needed
- Customize user profile fields in database schema

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Polar.sh Documentation](https://docs.polar.sh)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and modern web technologies.
