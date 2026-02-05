/**
 * CRISIS DETECTOR
 * 
 * Immediate mode switch when crisis indicators are detected.
 * No analysis, no statistics – just support.
 */

/**
 * CRISIS TRIGGERS
 * These patterns trigger immediate crisis mode
 */
const CRISIS_PATTERNS = [
  // Direct self-harm
  /\b(kill|hurt|harm)\s+(myself|me)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bend\s+(my\s+)?life\b/i,
  /\bself[- ]?harm/i,
  /\bcutting\s+(myself|my)/i,
  
  // Immediate danger
  /\b(being|am)\s+(abused|beaten|hurt)\b/i,
  /\bsomeone\s+is\s+(hurting|hitting)\s+me\b/i,
  /\bin\s+danger\b/i,
  /\bneed\s+help\s+now\b/i,
  /\bemergency\b/i,
  
  // Severe distress
  /\bcan('?t| not)\s+(go\s+on|take\s+it|anymore)\b/i,
  /\bno\s+(point|reason)\s+(in\s+)?(living|life)\b/i,
  /\bgive\s+up\b/i,
] as const;

/**
 * CRISIS DETECTION RESULT
 */
export interface CrisisDetectionResult {
  readonly is_crisis: boolean;
  readonly severity: 'none' | 'elevated' | 'immediate';
  readonly trigger_type?: string;
  readonly requires_immediate_response: boolean;
}

/**
 * DETECT CRISIS
 */
export function detectCrisis(question: string): CrisisDetectionResult {
  const normalized = question.toLowerCase().trim();
  
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        is_crisis: true,
        severity: 'immediate',
        trigger_type: 'direct_indicator',
        requires_immediate_response: true,
      };
    }
  }
  
  // Elevated concern patterns (less severe but notable)
  const elevatedPatterns = [
    /\bfeeling\s+(hopeless|worthless)\b/i,
    /\bno\s+one\s+cares\b/i,
    /\ball\s+alone\b/i,
    /\bwhat('?s| is)\s+the\s+point\b/i,
  ];
  
  for (const pattern of elevatedPatterns) {
    if (pattern.test(normalized)) {
      return {
        is_crisis: true,
        severity: 'elevated',
        trigger_type: 'distress_indicator',
        requires_immediate_response: false,
      };
    }
  }
  
  return {
    is_crisis: false,
    severity: 'none',
    requires_immediate_response: false,
  };
}

/**
 * CRISIS RESOURCE TYPE
 */
export interface CrisisResource {
  readonly name: string;
  readonly type: 'emergency' | 'hotline' | 'website' | 'local_contact';
  readonly contact?: string;
  readonly url?: string;
}

/**
 * GET CRISIS RESOURCES BY COUNTRY
 */
export function getCrisisResources(countryCode: string = 'SE'): readonly CrisisResource[] {
  const resources: Record<string, readonly CrisisResource[]> = {
    SE: SE_RESOURCES,
    US: US_RESOURCES,
    UK: UK_RESOURCES,
  };
  
  return resources[countryCode.toUpperCase()] || GENERIC_RESOURCES;
}

const SE_RESOURCES = [
  { name: 'Emergency Services', type: 'emergency' as const, contact: '112' },
  { name: 'BRIS (Children\'s Rights in Society)', type: 'hotline' as const, contact: '116 111' },
  { name: 'Mind Självmordslinjen', type: 'hotline' as const, contact: '90101' },
  { name: '1177 Vårdguiden', type: 'hotline' as const, contact: '1177', url: 'https://1177.se' },
] as const;

const US_RESOURCES = [
  { name: 'Emergency Services', type: 'emergency' as const, contact: '911' },
  { name: 'National Suicide Prevention Lifeline', type: 'hotline' as const, contact: '988' },
  { name: 'Crisis Text Line', type: 'hotline' as const, contact: 'Text HOME to 741741' },
] as const;

const UK_RESOURCES = [
  { name: 'Emergency Services', type: 'emergency' as const, contact: '999' },
  { name: 'Samaritans', type: 'hotline' as const, contact: '116 123' },
  { name: 'Childline', type: 'hotline' as const, contact: '0800 1111' },
] as const;

const GENERIC_RESOURCES = [
  { name: 'Local Emergency Services', type: 'emergency' as const },
  { name: 'International Association for Suicide Prevention', type: 'website' as const, url: 'https://www.iasp.info/resources/Crisis_Centres/' },
] as const;
