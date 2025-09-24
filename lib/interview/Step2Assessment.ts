export interface ArtifactAssessment {
  id: string
  name: string
  description: string
  keyQuestions: string[]
  followUpQuestions: string[]
  validationCriteria: string[]
  completionIndicators: string[]
}

export interface AssessmentTemplate {
  openingQuestion: string
  probingQuestions: string[]
  clarificationQuestions: string[]
  completionQuestions: string[]
  validationPrompts: string[]
}

// Step 2: Customer & Market Intelligence Assessment Templates
export const STEP_2_ASSESSMENTS: Record<string, ArtifactAssessment> = {
  'artifact_5': {
    id: 'artifact_5',
    name: 'Market Sizing (TAM, SAM, SOM)',
    description: 'Total addressable and serviceable market analysis',
    keyQuestions: [
      'What\'s your total addressable market (TAM) for your solution?',
      'How do you define your serviceable addressable market (SAM)?',
      'What\'s your realistic serviceable obtainable market (SOM) in the next 3-5 years?',
      'How did you calculate these market size estimates?'
    ],
    followUpQuestions: [
      'What market research sources did you use for these estimates?',
      'How does your market size compare to competitive solutions?',
      'Are you targeting global markets or focusing regionally first?',
      'What factors could expand or contract your addressable market?'
    ],
    validationCriteria: [
      'TAM is clearly defined and quantified',
      'SAM is realistic and accessible',
      'SOM projections are achievable',
      'Market sizing methodology is sound'
    ],
    completionIndicators: [
      'Market size estimates provided (TAM/SAM/SOM)',
      'Methodology for calculations explained',
      'Geographic scope defined',
      'Market dynamics understood'
    ]
  },

  'artifact_6': {
    id: 'artifact_6',
    name: 'Clinical Evidence & KOL Strategy',
    description: 'Key opinion leader engagement and evidence requirements',
    keyQuestions: [
      'What clinical evidence do you need to validate your solution?',
      'Who are the key opinion leaders (KOLs) in your space?',
      'How are you engaging with KOLs to build credibility?',
      'What clinical studies or trials are you conducting or planning?'
    ],
    followUpQuestions: [
      'Which medical institutions are you partnering with?',
      'How do KOLs influence purchasing decisions in your market?',
      'What publications or conferences are most important for your field?',
      'How do you measure the impact of your clinical evidence?'
    ],
    validationCriteria: [
      'Clinical evidence requirements are identified',
      'KOL engagement strategy is defined',
      'Evidence generation plan is comprehensive',
      'Clinical validation approach is appropriate'
    ],
    completionIndicators: [
      'Key clinical evidence needs defined',
      'KOL relationships established or planned',
      'Clinical study strategy outlined',
      'Evidence validation timeline set'
    ]
  },

  'artifact_7': {
    id: 'artifact_7',
    name: 'Ideal Customer Profile',
    description: 'Target customer segmentation and characteristics',
    keyQuestions: [
      'Who is your ideal customer? Can you describe them in detail?',
      'What are the key characteristics that define your target customer segments?',
      'How do you prioritize different customer segments?',
      'What\'s the typical profile of your early adopters versus mainstream customers?'
    ],
    followUpQuestions: [
      'What size organizations do you target (beds, revenue, patient volume)?',
      'Are you focusing on academic medical centers, community hospitals, or outpatient clinics?',
      'What geographic markets are you prioritizing?',
      'How do customer needs vary across different segments?'
    ],
    validationCriteria: [
      'Customer segments are clearly defined',
      'Ideal customer profile is detailed',
      'Segmentation criteria are specific',
      'Target prioritization is strategic'
    ],
    completionIndicators: [
      'Primary customer segments identified',
      'Ideal customer profile detailed',
      'Geographic and demographic targeting defined',
      'Customer prioritization strategy established'
    ]
  },

  'artifact_8': {
    id: 'artifact_8',
    name: 'Customer Pains & Gains',
    description: 'Pain points addressed and value delivered',
    keyQuestions: [
      'What are the biggest pain points your customers face today?',
      'How does your solution specifically address these pain points?',
      'What gains or benefits do customers experience with your solution?',
      'How do you quantify the value delivered to customers?'
    ],
    followUpQuestions: [
      'What\'s the cost of not solving these pain points?',
      'How do customers currently address these challenges?',
      'What ROI or value metrics do customers track?',
      'How do pain points vary across different customer segments?'
    ],
    validationCriteria: [
      'Customer pain points are clearly identified',
      'Value proposition addresses specific pains',
      'Benefits are quantified and measurable',
      'Customer value is compelling'
    ],
    completionIndicators: [
      'Key customer pain points documented',
      'Value proposition clearly articulated',
      'Benefits quantified with metrics',
      'Customer success measures defined'
    ]
  }
}

export const ASSESSMENT_TEMPLATES: Record<string, AssessmentTemplate> = {
  'artifact_5': {
    openingQuestion: 'Now let\'s explore your market opportunity. Based on our research, you\'re operating in a significant healthcare AI market. Can you walk me through how you\'ve sized your total addressable market (TAM) and what your serviceable markets look like?',
    probingQuestions: [
      'How did you calculate your TAM - what methodology did you use?',
      'What\'s your serviceable addressable market (SAM) within that larger TAM?',
      'What\'s a realistic serviceable obtainable market (SOM) for you in the next 3-5 years?',
      'Are you targeting global markets or focusing on specific regions first?'
    ],
    clarificationQuestions: [
      'When you mention [market size], is that based on device sales, software licenses, or service revenue?',
      'How does that compare to what analysts are saying about your market?',
      'What factors could significantly expand or contract your addressable market?',
      'Are there emerging market segments you\'re considering?'
    ],
    completionQuestions: [
      'Are there other market dynamics or sizing considerations we should discuss?',
      'How confident are you in these market size estimates?',
      'What could change your market opportunity significantly?'
    ],
    validationPrompts: [
      'So your TAM is approximately...',
      'Your target SAM for the next few years is...',
      'Your realistic SOM projection is...'
    ]
  },

  'artifact_6': {
    openingQuestion: 'Clinical evidence and key opinion leader relationships are crucial in healthcare. Can you tell me about your clinical validation strategy and how you\'re building relationships with influential clinicians in your field?',
    probingQuestions: [
      'What specific clinical evidence do you need to validate your solution?',
      'Who are the key opinion leaders (KOLs) that influence adoption in your space?',
      'Are you conducting clinical studies or trials to generate evidence?',
      'How do you engage with KOLs to build credibility and awareness?'
    ],
    clarificationQuestions: [
      'What medical institutions are you partnering with for validation?',
      'How do these KOLs typically influence purchasing decisions?',
      'What conferences or publications are most important for reaching your audience?',
      'How do you measure the clinical impact of your solution?'
    ],
    completionQuestions: [
      'Are there other clinical validation or KOL strategies we haven\'t discussed?',
      'What\'s your timeline for generating the clinical evidence you need?',
      'How will you know when you have sufficient clinical validation?'
    ],
    validationPrompts: [
      'Your clinical evidence strategy focuses on...',
      'The key KOLs you\'re targeting include...',
      'Your clinical validation timeline is...'
    ]
  },

  'artifact_7': {
    openingQuestion: 'Understanding your ideal customer is critical for go-to-market success. Can you describe your target customer segments and what makes an organization an ideal fit for your solution?',
    probingQuestions: [
      'What are the key characteristics that define your ideal customer?',
      'How do you segment your target market - by size, specialty, geography?',
      'Are you focusing on academic medical centers, community hospitals, or outpatient settings?',
      'What\'s the difference between your early adopter customers and mainstream market?'
    ],
    clarificationQuestions: [
      'When you say [customer type], what size organizations are you typically targeting?',
      'What geographic markets are you prioritizing and why?',
      'How do customer needs vary across different segments?',
      'What\'s the typical decision-making process for your customer type?'
    ],
    completionQuestions: [
      'Are there other customer segments or characteristics we should discuss?',
      'How do you plan to evolve your customer targeting over time?',
      'What would make a customer absolutely perfect for your solution?'
    ],
    validationPrompts: [
      'Your primary customer segment is...',
      'The ideal customer characteristics include...',
      'Your customer prioritization strategy focuses on...'
    ]
  },

  'artifact_8': {
    openingQuestion: 'Let\'s dive into the specific value you deliver. What are the biggest pain points your customers face, and how does your solution address these challenges while delivering measurable benefits?',
    probingQuestions: [
      'What are the most significant pain points your target customers face today?',
      'How does your solution specifically address each of these pain points?',
      'What gains or benefits do customers experience when using your solution?',
      'How do you quantify the ROI or value delivered to customers?'
    ],
    clarificationQuestions: [
      'What\'s the cost to customers of not solving these pain points?',
      'How are customers currently addressing these challenges?',
      'What metrics do customers use to measure success with your solution?',
      'How do these pain points vary across different customer segments?'
    ],
    completionQuestions: [
      'Are there other significant pain points or value propositions we should discuss?',
      'How do you validate that customers are actually experiencing these benefits?',
      'What additional value could your solution deliver in the future?'
    ],
    validationPrompts: [
      'The primary pain points you address are...',
      'Your value proposition centers on...',
      'The measurable benefits customers see include...'
    ]
  }
}

export class Step2AssessmentEngine {
  
  static getArtifactAssessment(artifactId: string): ArtifactAssessment | null {
    return STEP_2_ASSESSMENTS[artifactId] || null
  }

  static getAssessmentTemplate(artifactId: string): AssessmentTemplate | null {
    return ASSESSMENT_TEMPLATES[artifactId] || null
  }

  static generateContextualQuestion(
    artifactId: string, 
    researchContext: string, 
    conversationHistory: ConversationMessage[], 
    completionStatus: string
  ): string {
    const template = this.getAssessmentTemplate(artifactId)
    if (!template) return 'Can you tell me more about this topic?'

    // Determine question type based on conversation progress
    const messageCount = conversationHistory.filter(msg => msg.artifact === artifactId).length

    if (messageCount === 0) {
      // Opening question
      return template.openingQuestion
    } else if (messageCount < 3) {
      // Probing questions
      const availableQuestions = template.probingQuestions.filter(q => 
        !conversationHistory.some(msg => msg.content.includes(q.substring(0, 20)))
      )
      return availableQuestions[0] || template.clarificationQuestions[0]
    } else if (completionStatus === 'in_progress') {
      // Clarification questions
      return template.clarificationQuestions[Math.floor(Math.random() * template.clarificationQuestions.length)]
    } else {
      // Completion questions
      return template.completionQuestions[0]
    }
  }

  static assessCompletionCriteria(
    artifactId: string, 
    userResponses: UserResponse[]
  ): { 
    isComplete: boolean
    completedCriteria: string[]
    missingCriteria: string[]
    confidence: number 
  } {
    const assessment = this.getArtifactAssessment(artifactId)
    if (!assessment) {
      return { isComplete: false, completedCriteria: [], missingCriteria: [], confidence: 0 }
    }

    const completedCriteria: string[] = []
    const missingCriteria: string[] = []

    // Analyze user responses against validation criteria
    assessment.validationCriteria.forEach(criteria => {
      const isAddressed = userResponses.some(response => 
        this.responseAddressesCriteria(response.content, criteria, artifactId)
      )
      
      if (isAddressed) {
        completedCriteria.push(criteria)
      } else {
        missingCriteria.push(criteria)
      }
    })

    const completionPercentage = completedCriteria.length / assessment.validationCriteria.length
    const confidence = Math.round(completionPercentage * 100)
    const isComplete = completionPercentage >= 0.75 // 75% threshold

    return {
      isComplete,
      completedCriteria,
      missingCriteria,
      confidence
    }
  }

  private static responseAddressesCriteria(
    responseContent: string, 
    criteria: string, 
    artifactId: string
  ): boolean {
    const response = responseContent.toLowerCase()
    
    // Artifact-specific keyword matching
    switch (artifactId) {
      case 'artifact_5': // Market Sizing
        if (criteria.includes('TAM')) {
          return response.includes('tam') || response.includes('total addressable') || response.includes('market size')
        }
        if (criteria.includes('SAM')) {
          return response.includes('sam') || response.includes('serviceable addressable') || response.includes('accessible market')
        }
        if (criteria.includes('SOM')) {
          return response.includes('som') || response.includes('serviceable obtainable') || response.includes('obtainable market')
        }
        if (criteria.includes('methodology')) {
          return response.includes('calculated') || response.includes('research') || response.includes('analysis')
        }
        break
        
      case 'artifact_6': // Clinical Evidence
        if (criteria.includes('Clinical evidence')) {
          return response.includes('clinical') || response.includes('study') || response.includes('trial') || response.includes('evidence')
        }
        if (criteria.includes('KOL')) {
          return response.includes('kol') || response.includes('opinion leader') || response.includes('clinician') || response.includes('doctor')
        }
        if (criteria.includes('Evidence generation')) {
          return response.includes('validation') || response.includes('publication') || response.includes('research')
        }
        break
        
      case 'artifact_7': // Customer Profile
        if (criteria.includes('Customer segments')) {
          return response.includes('segment') || response.includes('customer') || response.includes('target') || response.includes('profile')
        }
        if (criteria.includes('characteristics')) {
          return response.includes('size') || response.includes('type') || response.includes('characteristic') || response.includes('hospital')
        }
        if (criteria.includes('prioritization')) {
          return response.includes('priority') || response.includes('focus') || response.includes('first') || response.includes('target')
        }
        break
        
      case 'artifact_8': // Pains & Gains
        if (criteria.includes('pain points')) {
          return response.includes('pain') || response.includes('problem') || response.includes('challenge') || response.includes('issue')
        }
        if (criteria.includes('Value proposition')) {
          return response.includes('value') || response.includes('benefit') || response.includes('roi') || response.includes('gain')
        }
        if (criteria.includes('quantified')) {
          return response.includes('measure') || response.includes('metric') || response.includes('percent') || response.includes('dollar') || response.includes('time')
        }
        break
    }
    
    // Default keyword matching
    const criteriaKeywords = criteria.toLowerCase().split(' ')
    return criteriaKeywords.some(keyword => response.includes(keyword))
  }

  static getNextArtifactInStep(currentArtifact: string): string | null {
    const step2Artifacts = ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8']
    const currentIndex = step2Artifacts.indexOf(currentArtifact)
    
    if (currentIndex >= 0 && currentIndex < step2Artifacts.length - 1) {
      return step2Artifacts[currentIndex + 1]
    }
    
    return null // Step 2 complete
  }

  static getFirstArtifactInStep(): string {
    return 'artifact_5'
  }

  static getAllArtifactsInStep(): string[] {
    return ['artifact_5', 'artifact_6', 'artifact_7', 'artifact_8']
  }
}

// Type definitions for better type safety
interface ConversationMessage {
  content: string
  artifact?: string
  timestamp: Date
  speaker: 'user' | 'interviewer'
}

interface UserResponse {
  content: string
  timestamp: Date
  artifact: string
  metadata?: Record<string, unknown>
}