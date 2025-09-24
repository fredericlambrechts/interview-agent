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

// Step 1: Core Identity & Business Model Assessment Templates
export const STEP_1_ASSESSMENTS: Record<string, ArtifactAssessment> = {
  'artifact_1': {
    id: 'artifact_1',
    name: 'Company Mission & Vision',
    description: 'Core purpose and strategic direction',
    keyQuestions: [
      'Can you tell me about your company\'s mission and what drives your strategic decisions?',
      'What specific patient outcomes or healthcare problems are you targeting?',
      'How has your mission evolved since founding?',
      'What makes your vision unique in the healthcare space?'
    ],
    followUpQuestions: [
      'How do you measure success against your mission?',
      'What challenges have you faced in staying true to your mission?',
      'How does your mission differentiate you from competitors?',
      'What specific impact metrics do you track?'
    ],
    validationCriteria: [
      'Mission statement is clearly articulated',
      'Vision aligns with healthcare market needs',
      'Strategic direction is specific and measurable',
      'Purpose demonstrates clear value proposition'
    ],
    completionIndicators: [
      'User has articulated core mission',
      'Strategic direction is defined',
      'Patient impact is quantified',
      'Competitive differentiation is clear'
    ]
  },

  'artifact_2': {
    id: 'artifact_2',
    name: 'Core Offering Definition',
    description: 'Primary product/service value proposition',
    keyQuestions: [
      'Can you describe your core product or service offering?',
      'What specific problem does your solution solve for healthcare providers?',
      'How does your offering integrate into existing healthcare workflows?',
      'What are the key features that deliver the most value?'
    ],
    followUpQuestions: [
      'What clinical evidence supports your value proposition?',
      'How do you measure the impact of your solution?',
      'What feedback have you received from early users?',
      'How scalable is your current offering?'
    ],
    validationCriteria: [
      'Product/service is clearly defined',
      'Value proposition is quantified',
      'Integration approach is specified',
      'Clinical impact is measurable'
    ],
    completionIndicators: [
      'Core offering is well-defined',
      'Value proposition is quantified',
      'Market fit is demonstrated',
      'Scalability is addressed'
    ]
  },

  'artifact_3': {
    id: 'artifact_3',
    name: 'Regulatory Pathway & Classification',
    description: 'FDA/CE approval strategy and timeline',
    keyQuestions: [
      'What\'s your regulatory classification and approval pathway?',
      'Are you pursuing FDA 510(k), De Novo, or another route?',
      'What\'s your timeline for regulatory submission?',
      'How are you handling clinical validation requirements?'
    ],
    followUpQuestions: [
      'What regulatory precedents are you following?',
      'Do you have regulatory consulting support?',
      'Are you pursuing international approvals like CE marking?',
      'What clinical studies are required for approval?'
    ],
    validationCriteria: [
      'Regulatory pathway is clearly defined',
      'Timeline is realistic and detailed',
      'Clinical requirements are understood',
      'Regulatory strategy is comprehensive'
    ],
    completionIndicators: [
      'Regulatory classification confirmed',
      'Approval pathway defined',
      'Timeline established',
      'Clinical strategy outlined'
    ]
  },

  'artifact_4': {
    id: 'artifact_4',
    name: 'Revenue Streams & Pricing Model',
    description: 'Business model and monetization strategy',
    keyQuestions: [
      'How do you monetize your solution?',
      'What are your primary revenue streams?',
      'How do you price your offering?',
      'Who pays for your solution - providers, payers, or patients?'
    ],
    followUpQuestions: [
      'How does your pricing compare to alternatives?',
      'What\'s your customer acquisition cost?',
      'How do you handle reimbursement challenges?',
      'What\'s your projected revenue timeline?'
    ],
    validationCriteria: [
      'Revenue model is clearly defined',
      'Pricing strategy is competitive',
      'Payment mechanism is established',
      'Financial projections are realistic'
    ],
    completionIndicators: [
      'Revenue streams identified',
      'Pricing model defined',
      'Payment structure clear',
      'Financial viability demonstrated'
    ]
  }
}

export const ASSESSMENT_TEMPLATES: Record<string, AssessmentTemplate> = {
  'artifact_1': {
    openingQuestion: 'Let\'s start by discussing your company\'s mission. Based on our research, we understand you\'re focused on revolutionizing healthcare through AI. Can you tell me more about your core mission and how it drives your strategic decisions?',
    probingQuestions: [
      'How has this mission evolved since founding?',
      'What specific patient outcomes are you targeting?',
      'What challenges have you faced in staying true to your mission?',
      'How do you measure success against your mission?'
    ],
    clarificationQuestions: [
      'When you say [specific term], can you elaborate on what that means in practice?',
      'How does that relate to your day-to-day operations?',
      'Can you give me a specific example of that?',
      'What would success look like in measurable terms?'
    ],
    completionQuestions: [
      'Is there anything else about your mission and vision that\'s important for me to understand?',
      'How confident are you that this mission will guide you through the next 3-5 years?',
      'Are there any aspects of your strategic direction we haven\'t covered?'
    ],
    validationPrompts: [
      'Just to confirm, your primary mission is...',
      'So your strategic focus for the next year is...',
      'Let me make sure I understand your vision correctly...'
    ]
  },

  'artifact_2': {
    openingQuestion: 'Now let\'s dive into your core offering. Can you walk me through your primary product or service and how it solves specific problems for healthcare providers?',
    probingQuestions: [
      'What clinical evidence supports your value proposition?',
      'How does your solution integrate into existing workflows?',
      'What feedback have you received from early users?',
      'How do you measure the impact of your solution?'
    ],
    clarificationQuestions: [
      'When you mention [feature], how does that work in practice?',
      'What makes this approach different from existing solutions?',
      'Can you quantify that benefit for me?',
      'How long does implementation typically take?'
    ],
    completionQuestions: [
      'Are there other key features or capabilities we should discuss?',
      'What\'s your roadmap for enhancing the core offering?',
      'Is there anything else about your product that sets you apart?'
    ],
    validationPrompts: [
      'So your core value proposition is...',
      'Your primary differentiator seems to be...',
      'Let me confirm the key benefits you\'ve described...'
    ]
  },

  'artifact_3': {
    openingQuestion: 'Regulatory approval is critical in medtech. Can you walk me through your current regulatory status and strategy? Are you pursuing FDA 510(k), De Novo, or another pathway?',
    probingQuestions: [
      'What\'s your timeline for FDA submission?',
      'Are you pursuing CE marking in parallel?',
      'How are you handling clinical validation requirements?',
      'What regulatory precedents are you following?'
    ],
    clarificationQuestions: [
      'What specific predicate devices are you referencing?',
      'How complex is your clinical study design?',
      'What regulatory consulting support do you have?',
      'What are the key regulatory risks you\'re managing?'
    ],
    completionQuestions: [
      'Are there other regulatory considerations we haven\'t discussed?',
      'How confident are you in your regulatory timeline?',
      'What could potentially delay your regulatory approval?'
    ],
    validationPrompts: [
      'So your regulatory pathway is...',
      'Your target submission date is...',
      'The key regulatory requirements include...'
    ]
  },

  'artifact_4': {
    openingQuestion: 'Let\'s discuss your business model and revenue strategy. How do you monetize your solution, and who are the key stakeholders in the payment process?',
    probingQuestions: [
      'How does your pricing compare to alternatives?',
      'What\'s your customer acquisition cost?',
      'How do you handle reimbursement challenges?',
      'What\'s your projected revenue timeline?'
    ],
    clarificationQuestions: [
      'When you mention [pricing model], how does that work exactly?',
      'What\'s the typical sales cycle length?',
      'How do payers view your solution?',
      'What ROI do customers typically see?'
    ],
    completionQuestions: [
      'Are there additional revenue streams you\'re considering?',
      'How sustainable is this pricing model long-term?',
      'What could impact your revenue projections?'
    ],
    validationPrompts: [
      'Your primary revenue model is...',
      'The key stakeholders in purchasing decisions are...',
      'Your pricing strategy is based on...'
    ]
  }
}

export class Step1AssessmentEngine {
  
  static getArtifactAssessment(artifactId: string): ArtifactAssessment | null {
    return STEP_1_ASSESSMENTS[artifactId] || null
  }

  static getAssessmentTemplate(artifactId: string): AssessmentTemplate | null {
    return ASSESSMENT_TEMPLATES[artifactId] || null
  }

  static generateContextualQuestion(
    artifactId: string, 
    researchContext: string, 
    conversationHistory: any[], 
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
    userResponses: any[]
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
      case 'artifact_1': // Mission & Vision
        if (criteria.includes('Mission statement')) {
          return response.includes('mission') || response.includes('purpose') || response.includes('goal')
        }
        if (criteria.includes('Vision aligns')) {
          return response.includes('vision') || response.includes('future') || response.includes('impact')
        }
        break
        
      case 'artifact_2': // Core Offering
        if (criteria.includes('Product/service')) {
          return response.includes('product') || response.includes('service') || response.includes('solution')
        }
        if (criteria.includes('Value proposition')) {
          return response.includes('value') || response.includes('benefit') || response.includes('outcome')
        }
        break
        
      case 'artifact_3': // Regulatory
        if (criteria.includes('Regulatory pathway')) {
          return response.includes('fda') || response.includes('510k') || response.includes('regulatory')
        }
        if (criteria.includes('Timeline')) {
          return response.includes('timeline') || response.includes('month') || response.includes('year')
        }
        break
        
      case 'artifact_4': // Revenue
        if (criteria.includes('Revenue model')) {
          return response.includes('revenue') || response.includes('pricing') || response.includes('payment')
        }
        if (criteria.includes('Pricing strategy')) {
          return response.includes('price') || response.includes('cost') || response.includes('dollar')
        }
        break
    }
    
    // Default keyword matching
    const criteriaKeywords = criteria.toLowerCase().split(' ')
    return criteriaKeywords.some(keyword => response.includes(keyword))
  }

  static getNextArtifactInStep(currentArtifact: string): string | null {
    const step1Artifacts = ['artifact_1', 'artifact_2', 'artifact_3', 'artifact_4']
    const currentIndex = step1Artifacts.indexOf(currentArtifact)
    
    if (currentIndex >= 0 && currentIndex < step1Artifacts.length - 1) {
      return step1Artifacts[currentIndex + 1]
    }
    
    return null // Step 1 complete
  }
}