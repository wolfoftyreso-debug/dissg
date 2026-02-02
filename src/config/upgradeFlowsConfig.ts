/**
 * 🧭 MASTER EXECUTION BLOCK 30
 * UX FLOWS — "HANDLING → INSIKT → BETALNING"
 * 
 * Mål:
 * - Användaren ska aldrig möta en betalvägg utan att först ha upplevt värde
 * - Betalning triggas endast när användaren vill behålla, dela eller automatisera
 */

// ============================================================
// FLOW TYPES
// ============================================================

export type FlowType = 
  | 'ANONYMOUS_TO_FREE'
  | 'FREE_TO_PRO'
  | 'PRO_TO_ORG'
  | 'ORG_TO_ENTERPRISE';

export type TriggerType = 
  | 'save_view'
  | 'save_dashboard'
  | 'export'
  | 'subscribe'
  | 'expose_api'
  | 'share_team'
  | 'rate_limit'
  | 'white_label'
  | 'custom_domain'
  | 'batch_access';

export type ModalStyle = 'modal' | 'inline' | 'banner';

export interface FlowStep {
  readonly step: number;
  readonly action: string;
  readonly action_sv: string;
}

export interface UpgradeModal {
  readonly style: ModalStyle;
  readonly title_sv: string;
  readonly title_en: string;
  readonly message_sv: string;
  readonly message_en: string;
  readonly primary_cta_sv: string;
  readonly primary_cta_en: string;
  readonly secondary_cta_sv: string;
  readonly secondary_cta_en: string;
}

export interface UpgradeFlow {
  readonly id: string;
  readonly flow_type: FlowType;
  readonly trigger: TriggerType;
  readonly steps: readonly FlowStep[];
  readonly modal: UpgradeModal;
}

// ============================================================
// FLOW A: ANONYMOUS → FREE
// ============================================================

export const FLOW_ANONYMOUS_TO_FREE: UpgradeFlow = {
  id: 'anon-to-free-save',
  flow_type: 'ANONYMOUS_TO_FREE',
  trigger: 'save_view',
  steps: [
    { step: 1, action: 'User opens site', action_sv: 'Användare öppnar sajten' },
    { step: 2, action: 'Explores map/index/graph', action_sv: 'Utforskar karta/index/graf' },
    { step: 3, action: 'Creates custom view (session)', action_sv: 'Skapar egen sammanställning (session)' },
    { step: 4, action: 'Clicks "Save this view"', action_sv: 'Klickar "Spara denna vy"' },
  ],
  modal: {
    style: 'modal',
    title_sv: 'Vill du spara detta?',
    title_en: 'Do you want to save this?',
    message_sv: 'Skapa ett gratis konto och behåll 1 dashboard.',
    message_en: 'Create a free account and keep 1 dashboard.',
    primary_cta_sv: 'Skapa gratis konto',
    primary_cta_en: 'Create free account',
    secondary_cta_sv: 'Fortsätt utan att spara',
    secondary_cta_en: 'Continue without saving',
  },
} as const;

// ============================================================
// FLOW B: FREE → PRO
// ============================================================

export const FLOW_FREE_TO_PRO_DASHBOARD: UpgradeFlow = {
  id: 'free-to-pro-dashboard',
  flow_type: 'FREE_TO_PRO',
  trigger: 'save_dashboard',
  steps: [
    { step: 1, action: 'User has 1 dashboard', action_sv: 'Användare har redan 1 dashboard' },
    { step: 2, action: 'Clicks "Save new dashboard"', action_sv: 'Klickar "Spara ny dashboard"' },
  ],
  modal: {
    style: 'inline',
    title_sv: 'Gratis-konton har 1 dashboard',
    title_en: 'Free accounts have 1 dashboard',
    message_sv: 'Uppgradera för obegränsat.',
    message_en: 'Upgrade for unlimited.',
    primary_cta_sv: 'Uppgradera till Pro',
    primary_cta_en: 'Upgrade to Pro',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

export const FLOW_FREE_TO_PRO_EXPORT: UpgradeFlow = {
  id: 'free-to-pro-export',
  flow_type: 'FREE_TO_PRO',
  trigger: 'export',
  steps: [
    { step: 1, action: 'User clicks "Export"', action_sv: 'Användare klickar "Exportera"' },
  ],
  modal: {
    style: 'modal',
    title_sv: 'Exportera data',
    title_en: 'Export data',
    message_sv: 'Export gör det möjligt att använda data utanför systemet. Detta ingår i Pro.',
    message_en: 'Export allows you to use data outside the system. This is included in Pro.',
    primary_cta_sv: 'Uppgradera till Pro',
    primary_cta_en: 'Upgrade to Pro',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

export const FLOW_FREE_TO_PRO_SUBSCRIBE: UpgradeFlow = {
  id: 'free-to-pro-subscribe',
  flow_type: 'FREE_TO_PRO',
  trigger: 'subscribe',
  steps: [
    { step: 1, action: 'User clicks "Subscribe to indicator"', action_sv: 'Användare klickar "Prenumerera på indikator"' },
  ],
  modal: {
    style: 'modal',
    title_sv: 'Håll dig uppdaterad',
    title_en: 'Stay updated',
    message_sv: 'Vill du få notiser när detta förändras över tid? Prenumerationer ingår i Pro.',
    message_en: 'Want notifications when this changes over time? Subscriptions are included in Pro.',
    primary_cta_sv: 'Uppgradera till Pro',
    primary_cta_en: 'Upgrade to Pro',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

// ============================================================
// FLOW C: PRO → ORG
// ============================================================

export const FLOW_PRO_TO_ORG_API: UpgradeFlow = {
  id: 'pro-to-org-api',
  flow_type: 'PRO_TO_ORG',
  trigger: 'expose_api',
  steps: [
    { step: 1, action: 'Pro user clicks "Expose as API"', action_sv: 'Pro-användare klickar "Exponera som API"' },
  ],
  modal: {
    style: 'modal',
    title_sv: 'Använd i andra system',
    title_en: 'Use in other systems',
    message_sv: 'API gör denna sammanställning tillgänglig för andra system. Detta kräver ett organisationskonto.',
    message_en: 'API makes this view available to other systems. This requires an organization account.',
    primary_cta_sv: 'Skapa ORG-konto',
    primary_cta_en: 'Create ORG account',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

export const FLOW_PRO_TO_ORG_TEAM: UpgradeFlow = {
  id: 'pro-to-org-team',
  flow_type: 'PRO_TO_ORG',
  trigger: 'share_team',
  steps: [
    { step: 1, action: 'Pro user clicks "Share with team"', action_sv: 'Pro-användare klickar "Dela med team"' },
  ],
  modal: {
    style: 'inline',
    title_sv: 'Arbeta tillsammans',
    title_en: 'Work together',
    message_sv: 'Team-delning kräver ORG-konto.',
    message_en: 'Team sharing requires an ORG account.',
    primary_cta_sv: 'Skapa ORG-konto',
    primary_cta_en: 'Create ORG account',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

// ============================================================
// FLOW D: ORG → ENTERPRISE
// ============================================================

export const FLOW_ORG_TO_ENTERPRISE_RATE: UpgradeFlow = {
  id: 'org-to-enterprise-rate',
  flow_type: 'ORG_TO_ENTERPRISE',
  trigger: 'rate_limit',
  steps: [
    { step: 1, action: 'API calls reach 80%', action_sv: 'API-anrop når 80%' },
  ],
  modal: {
    style: 'banner',
    title_sv: 'Ni närmar er er API-gräns',
    title_en: 'You are approaching your API limit',
    message_sv: 'Överväg att öka kapaciteten för oavbruten service.',
    message_en: 'Consider increasing capacity for uninterrupted service.',
    primary_cta_sv: 'Öka kapacitet',
    primary_cta_en: 'Increase capacity',
    secondary_cta_sv: 'Visa användning',
    secondary_cta_en: 'View usage',
  },
} as const;

export const FLOW_ORG_TO_ENTERPRISE_WHITELABEL: UpgradeFlow = {
  id: 'org-to-enterprise-whitelabel',
  flow_type: 'ORG_TO_ENTERPRISE',
  trigger: 'white_label',
  steps: [
    { step: 1, action: 'User clicks "Custom domain"', action_sv: 'Användare klickar "Egen domän"' },
  ],
  modal: {
    style: 'modal',
    title_sv: 'Enterprise-funktion',
    title_en: 'Enterprise feature',
    message_sv: 'Detta är en enterprise-funktion. Kontakta oss för upplägg.',
    message_en: 'This is an enterprise feature. Contact us for setup.',
    primary_cta_sv: 'Kontakta oss',
    primary_cta_en: 'Contact us',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

// ============================================================
// ALL FLOWS
// ============================================================

export const ALL_UPGRADE_FLOWS: readonly UpgradeFlow[] = [
  FLOW_ANONYMOUS_TO_FREE,
  FLOW_FREE_TO_PRO_DASHBOARD,
  FLOW_FREE_TO_PRO_EXPORT,
  FLOW_FREE_TO_PRO_SUBSCRIBE,
  FLOW_PRO_TO_ORG_API,
  FLOW_PRO_TO_ORG_TEAM,
  FLOW_ORG_TO_ENTERPRISE_RATE,
  FLOW_ORG_TO_ENTERPRISE_WHITELABEL,
] as const;

// ============================================================
// COPY RULES (UNBREAKABLE)
// ============================================================

export const COPY_RULES = {
  forbidden_words: [
    'låst',
    'locked',
    'premium',
    'exklusiv',
    'exclusive',
    'begränsad åtkomst',
    'restricted',
    'blocked',
    'paywall',
    'upgrade required',
  ],
  
  allowed_action_words: [
    'spara',
    'save',
    'automatisera',
    'automate',
    'använda externt',
    'use externally',
    'arbeta i team',
    'work in team',
    'exportera',
    'export',
    'prenumerera',
    'subscribe',
    'dela',
    'share',
  ],
  
  principle: 'Språket beskriver handling, inte status.',
} as const;

// ============================================================
// VISUAL BEHAVIOR RULES
// ============================================================

export const MODAL_VISUAL_RULES = {
  size: 'small',
  tone: 'calm',
  max_sentences: 2,
  
  forbidden_elements: [
    'red color',
    'timer',
    'countdown',
    'urgency indicators',
    'scarcity messaging',
    'FOMO triggers',
  ],
  
  required_elements: [
    'Clear cancel option',
    'Equal visual weight for both CTAs',
    'Neutral background',
    'Readable typography',
  ],
  
  principle: 'Betalning ska kännas som ett verktygsval, inte ett hinder.',
} as const;

// ============================================================
// MEASUREMENT RULES
// ============================================================

export const MEASUREMENT_RULES = {
  log_allowed: [
    'where value is created',
    'where users choose to pay',
    'where users choose to decline',
  ],
  
  log_forbidden: [
    'drop-off shame metrics',
    'aggressive funnel tracking',
    'manipulation effectiveness',
    'pressure point analysis',
  ],
  
  principle: 'Mäta för att förstå, inte för att manipulera.',
} as const;

// ============================================================
// DEFINITION OF DONE
// ============================================================

export const UX_FLOW_DEFINITION_OF_DONE = {
  requirements: [
    'Ingen paywall utan handling',
    'Ingen handling utan tydlig förklaring',
    'Ingen uppgradering utan begripligt värde',
    'Samma copy överallt',
  ],
  
  validation: (flow: UpgradeFlow): boolean => {
    // Check modal has both CTAs
    if (!flow.modal.primary_cta_sv || !flow.modal.secondary_cta_sv) return false;
    
    // Check message is short (max 2 sentences)
    const sentences = flow.modal.message_sv.split('.').filter(s => s.trim()).length;
    if (sentences > 2) return false;
    
    // Check no forbidden words
    const fullText = `${flow.modal.title_sv} ${flow.modal.message_sv}`.toLowerCase();
    for (const word of COPY_RULES.forbidden_words) {
      if (fullText.includes(word.toLowerCase())) return false;
    }
    
    return true;
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getFlowByTrigger(trigger: TriggerType): UpgradeFlow | undefined {
  return ALL_UPGRADE_FLOWS.find(f => f.trigger === trigger);
}

export function getFlowsByType(flowType: FlowType): readonly UpgradeFlow[] {
  return ALL_UPGRADE_FLOWS.filter(f => f.flow_type === flowType);
}

export function validateCopy(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const word of COPY_RULES.forbidden_words) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Forbidden word: "${word}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

export function getModalConfig(trigger: TriggerType, locale: 'sv' | 'en' = 'sv'): {
  title: string;
  message: string;
  primaryCta: string;
  secondaryCta: string;
  style: ModalStyle;
} | null {
  const flow = getFlowByTrigger(trigger);
  if (!flow) return null;
  
  return {
    title: locale === 'sv' ? flow.modal.title_sv : flow.modal.title_en,
    message: locale === 'sv' ? flow.modal.message_sv : flow.modal.message_en,
    primaryCta: locale === 'sv' ? flow.modal.primary_cta_sv : flow.modal.primary_cta_en,
    secondaryCta: locale === 'sv' ? flow.modal.secondary_cta_sv : flow.modal.secondary_cta_en,
    style: flow.modal.style,
  };
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const UX_FLOWS_COMPLETE = {
  flows: ALL_UPGRADE_FLOWS,
  copyRules: COPY_RULES,
  visualRules: MODAL_VISUAL_RULES,
  measurementRules: MEASUREMENT_RULES,
  definitionOfDone: UX_FLOW_DEFINITION_OF_DONE,
} as const;
