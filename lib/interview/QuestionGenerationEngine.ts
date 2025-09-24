export interface ResearchGap {
  artifactId: string
  missingInformation: string[]
  confidence: number
  priority: 'high' | 'medium' | 'low'
}

export interface QuestionContext {
  researchData?: any
  conversationHistory: any[]
  completionStatus: string
  userResponseType: 'confirmation' | 'correction' | 'addition' | 'discussion'
}

export interface GeneratedQuestion {
  question: string
  type: 'opening' | 'probing' | 'clarification' | 'validation' | 'completion'
  priority: number
  followUps: string[]
  expectedResponse: string[]
}

export class QuestionGenerationEngine {
  
  static analyzeResearchGaps(researchData: any, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    
    if (!researchData || !researchData.analysisContent) {
      return [{
        artifactId,
        missingInformation: ['All information missing - no research data available'],
        confidence: 0.1,
        priority: 'high'
      }]
    }

    const content = researchData.analysisContent.toLowerCase()
    
    // Analyze gaps specific to each artifact
    switch (artifactId) {
      case 'artifact_1': // Mission & Vision
        gaps.push(...this.analyzeMissionVisionGaps(content, artifactId))
        break
      case 'artifact_2': // Core Offering
        gaps.push(...this.analyzeCoreOfferingGaps(content, artifactId))
        break
      case 'artifact_3': // Regulatory Pathway
        gaps.push(...this.analyzeRegulatoryGaps(content, artifactId))
        break
      case 'artifact_4': // Revenue Streams
        gaps.push(...this.analyzeRevenueGaps(content, artifactId))
        break
      case 'artifact_5': // Market Sizing
        gaps.push(...this.analyzeMarketSizingGaps(content, artifactId))
        break
      case 'artifact_6': // Clinical Evidence & KOL
        gaps.push(...this.analyzeClinicalEvidenceGaps(content, artifactId))
        break
      case 'artifact_7': // Ideal Customer Profile
        gaps.push(...this.analyzeCustomerProfileGaps(content, artifactId))
        break
      case 'artifact_8': // Customer Pains & Gains
        gaps.push(...this.analyzeCustomerPainsGainsGaps(content, artifactId))
        break
    }

    return gaps
  }

  private static analyzeMissionVisionGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('mission') && !content.includes('purpose')) {
      missing.push('Company mission statement')
    }
    if (!content.includes('vision') && !content.includes('future')) {
      missing.push('Company vision and strategic direction')
    }
    if (!content.includes('patient') && !content.includes('outcome')) {
      missing.push('Target patient outcomes')
    }
    if (!content.includes('value') && !content.includes('impact')) {
      missing.push('Measurable impact metrics')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeCoreOfferingGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('product') && !content.includes('service') && !content.includes('solution')) {
      missing.push('Core product/service description')
    }
    if (!content.includes('clinical') && !content.includes('evidence')) {
      missing.push('Clinical evidence and validation')
    }
    if (!content.includes('workflow') && !content.includes('integration')) {
      missing.push('Healthcare workflow integration')
    }
    if (!content.includes('scalability') && !content.includes('scale')) {
      missing.push('Scalability and growth strategy')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeRegulatoryGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('fda') && !content.includes('regulatory') && !content.includes('510k')) {
      missing.push('FDA regulatory pathway')
    }
    if (!content.includes('timeline') && !content.includes('approval')) {
      missing.push('Regulatory timeline and milestones')
    }
    if (!content.includes('clinical') && !content.includes('study')) {
      missing.push('Clinical study requirements')
    }
    if (!content.includes('ce mark') && !content.includes('international')) {
      missing.push('International regulatory strategy')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeRevenueGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('revenue') && !content.includes('monetization') && !content.includes('pricing')) {
      missing.push('Revenue model and pricing strategy')
    }
    if (!content.includes('customer') && !content.includes('acquisition')) {
      missing.push('Customer acquisition strategy')
    }
    if (!content.includes('reimbursement') && !content.includes('payer')) {
      missing.push('Reimbursement and payer strategy')
    }
    if (!content.includes('projection') && !content.includes('financial')) {
      missing.push('Financial projections and metrics')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeMarketSizingGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('tam') && !content.includes('total addressable market') && !content.includes('market size')) {
      missing.push('Total Addressable Market (TAM) analysis')
    }
    if (!content.includes('sam') && !content.includes('serviceable addressable market')) {
      missing.push('Serviceable Addressable Market (SAM) definition')
    }
    if (!content.includes('som') && !content.includes('serviceable obtainable market')) {
      missing.push('Serviceable Obtainable Market (SOM) projections')
    }
    if (!content.includes('market research') && !content.includes('competitive analysis')) {
      missing.push('Market research methodology and sources')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeClinicalEvidenceGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('clinical evidence') && !content.includes('clinical validation') && !content.includes('study')) {
      missing.push('Clinical evidence requirements and validation strategy')
    }
    if (!content.includes('kol') && !content.includes('key opinion leader') && !content.includes('clinician engagement')) {
      missing.push('Key Opinion Leader (KOL) engagement strategy')
    }
    if (!content.includes('clinical trial') && !content.includes('clinical study') && !content.includes('research')) {
      missing.push('Clinical studies and trials planning')
    }
    if (!content.includes('publication') && !content.includes('conference') && !content.includes('medical institution')) {
      missing.push('Medical institution partnerships and publications')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeCustomerProfileGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('customer segment') && !content.includes('target customer') && !content.includes('ideal customer')) {
      missing.push('Ideal customer profile and segmentation')
    }
    if (!content.includes('hospital') && !content.includes('academic medical center') && !content.includes('outpatient')) {
      missing.push('Healthcare setting focus (hospital type, size, specialty)')
    }
    if (!content.includes('geographic') && !content.includes('regional') && !content.includes('market prioritization')) {
      missing.push('Geographic market prioritization and targeting')
    }
    if (!content.includes('early adopter') && !content.includes('customer characteristics') && !content.includes('decision maker')) {
      missing.push('Customer characteristics and decision-making process')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  private static analyzeCustomerPainsGainsGaps(content: string, artifactId: string): ResearchGap[] {
    const gaps: ResearchGap[] = []
    const missing: string[] = []

    if (!content.includes('pain point') && !content.includes('challenge') && !content.includes('problem')) {
      missing.push('Customer pain points and challenges')
    }
    if (!content.includes('value proposition') && !content.includes('benefit') && !content.includes('gain')) {
      missing.push('Value proposition and customer benefits')
    }
    if (!content.includes('roi') && !content.includes('return on investment') && !content.includes('cost saving')) {
      missing.push('ROI and quantified value delivery')
    }
    if (!content.includes('current solution') && !content.includes('alternative') && !content.includes('competitive')) {
      missing.push('Current customer solutions and alternatives')
    }

    if (missing.length > 0) {
      gaps.push({
        artifactId,
        missingInformation: missing,
        confidence: 1 - (missing.length / 4),
        priority: missing.length > 2 ? 'high' : 'medium'
      })
    }

    return gaps
  }

  static generateTargetedQuestion(
    context: QuestionContext,
    gaps: ResearchGap[],
    artifactId: string
  ): GeneratedQuestion {
    
    // Determine question type based on completion status and user response type
    let questionType: GeneratedQuestion['type'] = 'probing'
    
    if (context.completionStatus === 'pending') {
      questionType = 'opening'
    } else if (context.userResponseType === 'confirmation') {
      questionType = 'validation'
    } else if (context.userResponseType === 'correction') {
      questionType = 'clarification'
    } else if (context.completionStatus === 'completed') {
      questionType = 'completion'
    }

    // Find highest priority gap
    const priorityGap = gaps.find(g => g.priority === 'high') || gaps[0]
    
    if (!priorityGap) {
      return this.generateFallbackQuestion(questionType, artifactId)
    }

    // Generate question based on missing information
    const missingInfo = priorityGap.missingInformation[0]
    const question = this.createQuestionForMissingInfo(missingInfo, questionType, artifactId)
    
    return {
      question,
      type: questionType,
      priority: priorityGap.priority === 'high' ? 3 : priorityGap.priority === 'medium' ? 2 : 1,
      followUps: this.generateFollowUpQuestions(missingInfo, artifactId),
      expectedResponse: this.getExpectedResponseTypes(missingInfo)
    }
  }

  private static createQuestionForMissingInfo(
    missingInfo: string, 
    questionType: GeneratedQuestion['type'], 
    artifactId: string
  ): string {
    
    const questionStarters = {
      opening: 'Let\'s start by discussing',
      probing: 'Can you tell me more about',
      clarification: 'When you mention that, can you help me understand',
      validation: 'Just to confirm, you\'re saying that',
      completion: 'Is there anything else about'
    }

    const starter = questionStarters[questionType]
    
    // Create specific questions based on missing information
    if (missingInfo.includes('mission')) {
      return `${starter} your company's mission and core purpose?`
    } else if (missingInfo.includes('product') || missingInfo.includes('service')) {
      return `${starter} your primary product or service offering?`
    } else if (missingInfo.includes('regulatory') || missingInfo.includes('FDA')) {
      return `${starter} your regulatory pathway and FDA strategy?`
    } else if (missingInfo.includes('revenue') || missingInfo.includes('pricing')) {
      return `${starter} your revenue model and pricing approach?`
    } else if (missingInfo.includes('clinical')) {
      return `${starter} your clinical evidence and validation strategy?`
    } else if (missingInfo.includes('timeline')) {
      return `${starter} your timeline and key milestones?`
    } else if (missingInfo.includes('TAM') || missingInfo.includes('market size')) {
      return `${starter} your total addressable market (TAM) and how you've sized it?`
    } else if (missingInfo.includes('SAM') || missingInfo.includes('serviceable addressable')) {
      return `${starter} your serviceable addressable market (SAM) and target segments?`
    } else if (missingInfo.includes('SOM') || missingInfo.includes('serviceable obtainable')) {
      return `${starter} your realistic serviceable obtainable market (SOM) projections?`
    } else if (missingInfo.includes('KOL') || missingInfo.includes('key opinion leader')) {
      return `${starter} your key opinion leader engagement and relationships?`
    } else if (missingInfo.includes('customer segment') || missingInfo.includes('ideal customer')) {
      return `${starter} your ideal customer profile and key characteristics?`
    } else if (missingInfo.includes('pain point') || missingInfo.includes('challenge')) {
      return `${starter} the specific pain points your customers face?`
    } else if (missingInfo.includes('value proposition') || missingInfo.includes('benefit')) {
      return `${starter} the value and benefits you deliver to customers?`
    } else if (missingInfo.includes('ROI') || missingInfo.includes('return on investment')) {
      return `${starter} the ROI and quantified value your solution provides?`
    } else if (missingInfo.includes('geographic') || missingInfo.includes('market prioritization')) {
      return `${starter} your geographic market prioritization and targeting strategy?`
    } else {
      return `${starter} ${missingInfo.toLowerCase()}?`
    }
  }

  private static generateFollowUpQuestions(missingInfo: string, artifactId: string): string[] {
    const followUps: string[] = []
    
    if (missingInfo.includes('mission')) {
      followUps.push('How has this mission evolved since founding?')
      followUps.push('What specific outcomes are you targeting?')
    } else if (missingInfo.includes('product')) {
      followUps.push('What makes your solution unique?')
      followUps.push('How does it integrate with existing systems?')
    } else if (missingInfo.includes('regulatory')) {
      followUps.push('What\'s your target submission timeline?')
      followUps.push('What clinical studies are required?')
    } else if (missingInfo.includes('revenue')) {
      followUps.push('Who are the key stakeholders in purchasing decisions?')
      followUps.push('How does your pricing compare to alternatives?')
    } else if (missingInfo.includes('TAM') || missingInfo.includes('market size')) {
      followUps.push('What market research sources did you use for these estimates?')
      followUps.push('How does your market size compare to competitive solutions?')
    } else if (missingInfo.includes('SAM') || missingInfo.includes('SOM')) {
      followUps.push('Are you targeting global markets or focusing regionally first?')
      followUps.push('What factors could expand or contract your addressable market?')
    } else if (missingInfo.includes('KOL') || missingInfo.includes('clinical evidence')) {
      followUps.push('Which medical institutions are you partnering with?')
      followUps.push('How do KOLs influence purchasing decisions in your market?')
    } else if (missingInfo.includes('customer segment') || missingInfo.includes('ideal customer')) {
      followUps.push('What size organizations do you target (beds, revenue, patient volume)?')
      followUps.push('Are you focusing on academic medical centers or community hospitals?')
    } else if (missingInfo.includes('pain point') || missingInfo.includes('value proposition')) {
      followUps.push('What\'s the cost of not solving these pain points?')
      followUps.push('How do customers currently address these challenges?')
    } else if (missingInfo.includes('ROI') || missingInfo.includes('benefit')) {
      followUps.push('What metrics do customers use to measure success?')
      followUps.push('How do pain points vary across different customer segments?')
    }
    
    return followUps
  }

  private static getExpectedResponseTypes(missingInfo: string): string[] {
    if (missingInfo.includes('timeline') || missingInfo.includes('projection')) {
      return ['specific dates', 'timeframes', 'milestones']
    } else if (missingInfo.includes('revenue') || missingInfo.includes('pricing')) {
      return ['dollar amounts', 'pricing models', 'financial metrics']
    } else if (missingInfo.includes('clinical') || missingInfo.includes('evidence')) {
      return ['study results', 'validation data', 'clinical outcomes']
    } else if (missingInfo.includes('TAM') || missingInfo.includes('SAM') || missingInfo.includes('SOM')) {
      return ['market size numbers', 'market research data', 'sizing methodology']
    } else if (missingInfo.includes('KOL') || missingInfo.includes('key opinion leader')) {
      return ['specific KOL names', 'relationship status', 'engagement strategy']
    } else if (missingInfo.includes('customer segment') || missingInfo.includes('ideal customer')) {
      return ['customer characteristics', 'segmentation criteria', 'target profiles']
    } else if (missingInfo.includes('pain point') || missingInfo.includes('challenge')) {
      return ['specific pain points', 'problem descriptions', 'impact quantification']
    } else if (missingInfo.includes('value proposition') || missingInfo.includes('benefit')) {
      return ['benefit descriptions', 'value metrics', 'outcome measures']
    } else {
      return ['detailed explanation', 'specific examples', 'strategic approach']
    }
  }

  private static generateFallbackQuestion(
    questionType: GeneratedQuestion['type'], 
    artifactId: string
  ): GeneratedQuestion {
    return {
      question: 'Can you provide more details about this aspect of your business?',
      type: questionType,
      priority: 1,
      followUps: ['What specific challenges have you encountered?', 'How do you measure success?'],
      expectedResponse: ['detailed explanation', 'specific examples']
    }
  }

  static determineQuestionStrategy(
    completionMarkers: { completed: string[], inProgress: string[], pending: string[] },
    conversationLength: number
  ): 'responsive' | 'proactive' {
    
    // Responsive: Follow user's lead, ask clarifying questions
    // Proactive: Drive conversation toward specific objectives
    
    if (conversationLength < 3) {
      return 'proactive' // Start with structured approach
    }
    
    const completionRate = completionMarkers.completed.length / 
                          (completionMarkers.completed.length + completionMarkers.pending.length)
    
    if (completionRate < 0.5) {
      return 'proactive' // Need to drive toward completion
    } else {
      return 'responsive' // Can follow user's direction
    }
  }

  static processUserResponseType(userInput: string): 'confirmation' | 'correction' | 'addition' | 'discussion' {
    const input = userInput.toLowerCase()
    
    // Confirmation indicators
    if (input.includes('yes') || input.includes('correct') || input.includes('exactly') || 
        input.includes('right') || input.includes('that\'s accurate')) {
      return 'confirmation'
    }
    
    // Correction indicators  
    if (input.includes('actually') || input.includes('not quite') || input.includes('instead') ||
        input.includes('rather') || input.includes('correction')) {
      return 'correction'
    }
    
    // Addition indicators
    if (input.includes('also') || input.includes('additionally') || input.includes('furthermore') ||
        input.includes('plus') || input.includes('and')) {
      return 'addition'
    }
    
    // Default to discussion
    return 'discussion'
  }
}