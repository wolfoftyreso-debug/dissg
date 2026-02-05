 /**
  * CRISIS DETECTION MODULE
  * 
  * Detects crisis indicators in youth questions.
  * When triggered: ALL ANALYSIS STOPS, SAFETY FIRST.
  * 
  * This is NON-NEGOTIABLE.
  */
 
 import type { YouthRiskLevel, CrisisModeResponse, CrisisResource } from './types';
 
 /**
  * CRISIS KEYWORDS (IMMEDIATE ESCALATION)
  */
 export const CRISIS_KEYWORDS = {
   SELF_HARM: [
     'cut myself', 'cutting', 'hurt myself', 'self-harm', 'self harm',
     'burn myself', 'hitting myself', 'scratching myself',
     'skära mig', 'skadar mig själv',
   ],
   SUICIDE: [
     'kill myself', 'want to die', 'end my life', 'suicide',
     'better off dead', 'no point living', 'not want to be here',
     'ta mitt liv', 'vill dö', 'orkar inte mer',
   ],
   EXTREME_DISTRESS: [
     'can\'t take it anymore', 'want to disappear', 'give up',
     'no way out', 'trapped', 'nobody cares',
     'orkar inte', 'vill försvinna',
   ],
   ABUSE: [
     'being hurt', 'someone hurts me', 'abused', 'touched me',
     'forced me', 'scared of', 'hitting me',
   ],
 } as const;
 
 /**
  * HIGH RISK PATTERNS (ELEVATED CONCERN)
  */
 export const HIGH_RISK_PATTERNS = [
   /\b(hate myself|worthless|useless|burden)\b/i,
   /\b(nobody understands|all alone|no friends)\b/i,
   /\b(can't sleep|not eating|starving myself)\b/i,
   /\b(panic attack|can't breathe|heart racing)\b/i,
   /\b(voices|hearing things|seeing things)\b/i,
 ];
 
 /**
  * DEFAULT CRISIS RESOURCES (Expandable by country)
  */
 export const DEFAULT_CRISIS_RESOURCES: readonly CrisisResource[] = [
   {
     name: 'BRIS (Sweden)',
     country_code: 'SE',
     phone: '116 111',
     url: 'https://www.bris.se',
    available: '24/7',
   },
   {
     name: 'Childline (UK)',
     country_code: 'GB',
     phone: '0800 1111',
     url: 'https://www.childline.org.uk',
    available: '24/7',
   },
   {
     name: 'Crisis Text Line (US)',
     country_code: 'US',
     phone: null,
     url: 'https://www.crisistextline.org',
    available: '24/7',
   },
   {
     name: 'Kids Help Phone (Canada)',
     country_code: 'CA',
     phone: '1-800-668-6868',
     url: 'https://kidshelpphone.ca',
    available: '24/7',
   },
   {
     name: 'Kinder- und Jugendtelefon (Germany)',
     country_code: 'DE',
     phone: '116 111',
     url: 'https://www.nummergegenkummer.de',
    available: 'limited hours',
   },
 ];
 
 /**
  * CRISIS DETECTION RESULT
  */
 export interface CrisisDetectionResult {
   readonly is_crisis: boolean;
   readonly risk_level: YouthRiskLevel;
   readonly triggered_keywords: readonly string[];
   readonly category: keyof typeof CRISIS_KEYWORDS | 'high_risk_pattern' | null;
   readonly confidence: number;
 }
 
 /**
  * DETECT CRISIS INDICATORS
  */
 export function detectCrisis(text: string): CrisisDetectionResult {
   const lowerText = text.toLowerCase();
   const triggeredKeywords: string[] = [];
   let category: keyof typeof CRISIS_KEYWORDS | 'high_risk_pattern' | null = null;
   let isCrisis = false;
   
   // Check explicit crisis keywords
   for (const [cat, keywords] of Object.entries(CRISIS_KEYWORDS)) {
     for (const keyword of keywords) {
       if (lowerText.includes(keyword.toLowerCase())) {
         triggeredKeywords.push(keyword);
         category = cat as keyof typeof CRISIS_KEYWORDS;
         isCrisis = true;
       }
     }
   }
   
   // Check high-risk patterns if no explicit crisis
   if (!isCrisis) {
     for (const pattern of HIGH_RISK_PATTERNS) {
       const match = lowerText.match(pattern);
       if (match) {
         triggeredKeywords.push(match[0]);
         category = 'high_risk_pattern';
       }
     }
   }
   
   // Determine risk level
   let riskLevel: YouthRiskLevel = 'low';
   if (isCrisis) {
     riskLevel = 'crisis';
   } else if (triggeredKeywords.length > 0) {
     riskLevel = 'high';
   }
   
   return {
     is_crisis: isCrisis,
     risk_level: riskLevel,
     triggered_keywords: triggeredKeywords,
     category,
     confidence: triggeredKeywords.length > 0 ? 0.9 : 0,
   };
 }
 
 /**
  * GENERATE CRISIS RESPONSE
  * When this is triggered, ALL OTHER PROCESSING STOPS.
  */
 export function generateCrisisResponse(
   detection: CrisisDetectionResult,
   countryCode: string = 'SE'
 ): CrisisModeResponse {
   // Get resources for country (fallback to all)
   const countryResources = DEFAULT_CRISIS_RESOURCES.filter(
     r => r.country_code === countryCode
   );
   const resources = countryResources.length > 0 
     ? countryResources 
     : DEFAULT_CRISIS_RESOURCES;
   
   const hotlines = resources.filter(r => r.phone !== null);
   const chatResources = resources.filter(r => r.url !== null);
   
   return {
    triggered: true,
    reason: detection.triggered_keywords.join(', ') || 'pattern match',
    redirect_to: 'human_support',
    resources: resources as CrisisResource[],
    mode: 'crisis_support',
    triggered_by: detection.triggered_keywords.join(', ') || 'pattern match',
    priority: 'immediate',
    response: {
       message: `It sounds like you might be going through something really difficult right now. You're not alone, and there are people who want to help.`,
      hotlines: hotlines as CrisisResource[],
      chat_resources: chatResources as CrisisResource[],
       safety_message: `If you're in immediate danger, please contact emergency services or tell a trusted adult right away. Your safety matters.`,
     },
     analytics_disabled: true,  // Do NOT log crisis queries for analytics
     follow_up_blocked: true,   // Do NOT allow follow-up analysis questions
   };
 }
 
 /**
  * SAFETY GATE
  * Must be called before ANY youth answer generation.
  */
 export function safetyGate(question: string, countryCode?: string): {
   safe_to_proceed: boolean;
   crisis_response: CrisisModeResponse | null;
   detection: CrisisDetectionResult;
 } {
   const detection = detectCrisis(question);
   
   if (detection.is_crisis) {
     return {
       safe_to_proceed: false,
       crisis_response: generateCrisisResponse(detection, countryCode),
       detection,
     };
   }
   
   return {
     safe_to_proceed: true,
     crisis_response: null,
     detection,
   };
 }