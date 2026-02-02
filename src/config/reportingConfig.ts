/**
 * 🧾 MASTER EXECUTION BLOCK 31
 * REPORTING, CHAT & PDF — "FÖRSTÅ → PROVA → BETALA"
 * 
 * GRUNDPRINCIP:
 * - Inga PDF-rapporter gratis
 * - Ingen export av full analys utan betalning
 * - Textbaserad djupanalys = värdet
 * - PDF = förpackning av redan genererad analys
 * - Demo-rapport = exakt 1, begränsad
 * 
 * PDF är inte datan.
 * PDF är konserverad förståelse.
 * Det är därför den kostar.
 */

// ============================================================
// CHAT ENGINE
// ============================================================

export interface ChatResponseLayer {
  readonly layer: number;
  readonly name: string;
  readonly description: string;
}

export const CHAT_RESPONSE_LAYERS: readonly ChatResponseLayer[] = [
  { layer: 1, name: 'summary', description: 'Kort sammanfattning' },
  { layer: 2, name: 'explanation', description: 'Förklaring av samband (icke-kausalt)' },
  { layer: 3, name: 'effect_ranking', description: 'Vad datan indikerar kan ha störst effekt (rangordnat)' },
] as const;

export const CHAT_ENGINE_CONFIG = {
  identity: {
    is: 'Ett analysgränssnitt',
    is_not: ['AI-chat', 'Åsiktsmaskin', 'Rådgivare'],
  },
  
  example_prompts: [
    'Varför korrelerar X med Y här?',
    'Vilka faktorer har störst påverkan på detta utfallet?',
    'Vad förändrades runt år 2015?',
    'Vilka åtgärder har historiskt haft störst effekt på detta mått?',
  ],
  
  response_rules: {
    always_include: CHAT_RESPONSE_LAYERS,
    never_include: [
      'recommendations',
      'imperatives',
      'value_judgments',
      'predictions',
      'advice',
    ],
    principle: 'Bara "detta visar datan"',
  },
  
  forbidden_phrases: [
    'du bör',
    'ni bör',
    'rekommenderar',
    'föreslår',
    'bästa sättet',
    'you should',
    'we recommend',
    'best practice',
  ],
} as const;

// ============================================================
// DEEP ANALYSIS STRUCTURE
// ============================================================

export interface DeepAnalysisSection {
  readonly id: string;
  readonly title_sv: string;
  readonly title_en: string;
  readonly description: string;
  readonly required: boolean;
}

export const DEEP_ANALYSIS_SECTIONS: readonly DeepAnalysisSection[] = [
  {
    id: 'observations',
    title_sv: 'Vad som observeras',
    title_en: 'What is observed',
    description: 'Faktisk data och mönster',
    required: true,
  },
  {
    id: 'correlation_strength',
    title_sv: 'Korrelationsstyrka',
    title_en: 'Correlation strength',
    description: 'Hur stark korrelationen är',
    required: true,
  },
  {
    id: 'time_period',
    title_sv: 'Tidsperiod',
    title_en: 'Time period',
    description: 'Under vilken period',
    required: true,
  },
  {
    id: 'covarying_factors',
    title_sv: 'Samvarierande faktorer',
    title_en: 'Covarying factors',
    description: 'Vilka faktorer som samvarierar mest',
    required: true,
  },
  {
    id: 'historical_changes',
    title_sv: 'Historiska förändringar',
    title_en: 'Historical changes',
    description: 'Förändringar som sammanfallit med förbättring/försämring',
    required: true,
  },
  {
    id: 'limitations',
    title_sv: 'Vad som inte kan sägas',
    title_en: 'What cannot be said',
    description: 'Begränsningar och osäkerheter',
    required: true,
  },
] as const;

export const DEEP_ANALYSIS_MANDATORY_METADATA = [
  'sources',
  'method',
  'uncertainty',
  'does_not_mean',
] as const;

// ============================================================
// DEMO REPORT
// ============================================================

export const DEMO_REPORT_CONFIG = {
  limit_per_user: 1,
  
  characteristics: {
    complete_in_structure: true,
    limited_in_depth: true,
    clearly_marked: true,
    watermark_text: 'DEMO',
  },
  
  restrictions: [
    'Ingen exporthistorik',
    'Ingen API',
    'Ingen anpassning efteråt',
  ],
  
  modal: {
    trigger: 'click_generate_report',
    title_sv: 'Demo-rapport',
    title_en: 'Demo report',
    message_sv: 'Du kan generera en demo-rapport för att se hur en full analys ser ut.',
    message_en: 'You can generate a demo report to see what a full analysis looks like.',
    primary_cta_sv: 'Generera demo-rapport',
    primary_cta_en: 'Generate demo report',
    secondary_cta_sv: 'Avbryt',
    secondary_cta_en: 'Cancel',
  },
} as const;

// ============================================================
// PAYMENT GATE (AFTER DEMO)
// ============================================================

export const PAYMENT_GATE_CONFIG = {
  trigger: 'demo_used',
  
  behavior: {
    button_visible: true,
    button_functional: false,
    shows_upgrade_modal: true,
  },
  
  modal: {
    title_sv: 'Full rapport kräver PRO / ORG',
    title_en: 'Full report requires PRO / ORG',
    message_sv: 'Rapporten innehåller komplett analys, kontext och verifiering.',
    message_en: 'The report contains complete analysis, context and verification.',
    primary_cta_sv: 'Uppgradera',
    primary_cta_en: 'Upgrade',
    secondary_cta_sv: 'Tillbaka till analys',
    secondary_cta_en: 'Back to analysis',
  },
  
  principle: 'Ingen soft väg runt detta.',
} as const;

// ============================================================
// FULL REPORT STRUCTURE
// ============================================================

export interface ReportSection {
  readonly id: string;
  readonly order: number;
  readonly title_sv: string;
  readonly title_en: string;
  readonly description: string;
  readonly required: boolean;
  readonly max_pages?: number;
}

export const FULL_REPORT_SECTIONS: readonly ReportSection[] = [
  {
    id: 'title',
    order: 1,
    title_sv: 'Titel',
    title_en: 'Title',
    description: 'Neutral, faktabaserad, ingen värdering',
    required: true,
  },
  {
    id: 'executive_summary',
    order: 2,
    title_sv: 'Sammanfattning',
    title_en: 'Executive Summary',
    description: 'Vad visar datan, varför relevant, största effektområden',
    required: true,
    max_pages: 0.5,
  },
  {
    id: 'data_foundation',
    order: 3,
    title_sv: 'Datagrund',
    title_en: 'Data Foundation',
    description: 'Indikatorer, period, geografi, källor',
    required: true,
  },
  {
    id: 'analysis',
    order: 4,
    title_sv: 'Analys',
    title_en: 'Analysis',
    description: 'Korrelationer, tidsförskjutningar, samvariationer, brytpunkter',
    required: true,
  },
  {
    id: 'effect_analysis',
    order: 5,
    title_sv: 'Effektanalys',
    title_en: 'Effect Analysis',
    description: 'Rangordning av faktorer, historiska exempel, osäkerhetsintervall',
    required: true,
  },
  {
    id: 'limitations',
    order: 6,
    title_sv: 'Begränsningar',
    title_en: 'Limitations',
    description: 'Vad som inte kan sägas, vad som kräver mer data',
    required: true,
  },
  {
    id: 'verification',
    order: 7,
    title_sv: 'Verifiering',
    title_en: 'Verification',
    description: 'statement_id, QR-kod, verify-URL, metodversion',
    required: true,
  },
] as const;

// ============================================================
// PDF DESIGN
// ============================================================

export const PDF_DESIGN_CONFIG = {
  style: {
    background: 'white',
    accent_color: 'myndighetsblå', // #0B3D91 or similar
    typography: 'luftig',
    graphics_rule: 'Ingen grafik som inte tillför information',
  },
  
  footer: {
    position: 'bottom',
    size: 'small',
    content: [
      'datum',
      'statement_id',
      'verify_url',
      'qr_code',
      'Verifierad analys',
    ],
  },
  
  quality_standard: 'Detta kan ligga på ett regeringsbord.',
  
  rules: {
    no_editing: true,
    no_fill_in_blanks: true,
    all_text_generated: true,
    all_data_traceable: true,
  },
  
  principle: 'PDF är ett slutdokument, inte arbetsyta.',
} as const;

// ============================================================
// REPORT PRICING
// ============================================================

export interface ReportPricingTier {
  readonly tier: 'PRO' | 'ORG' | 'ENTERPRISE';
  readonly reports_per_month: number | 'unlimited';
  readonly extra_report_sek: number | null;
  readonly extra_report_eur: number | null;
  readonly features: readonly string[];
}

export const REPORT_PRICING: readonly ReportPricingTier[] = [
  {
    tier: 'PRO',
    reports_per_month: 5,
    extra_report_sek: 99,
    extra_report_eur: 9,
    features: [
      'Full rapport med alla sektioner',
      'PDF-export',
      'QR-verifiering',
      'Versionshistorik',
    ],
  },
  {
    tier: 'ORG',
    reports_per_month: 'unlimited',
    extra_report_sek: null,
    extra_report_eur: null,
    features: [
      'Obegränsat antal rapporter',
      'Delning internt',
      'API-länkning till rapporter',
      'White-label alternativ',
      'Bulk-generering',
    ],
  },
  {
    tier: 'ENTERPRISE',
    reports_per_month: 'unlimited',
    extra_report_sek: null,
    extra_report_eur: null,
    features: [
      'Allt i ORG',
      'Anpassad rapportmall',
      'Egen branding',
      'Dedikerad support',
    ],
  },
] as const;

// ============================================================
// DEFINITION OF DONE
// ============================================================

export const REPORTING_DEFINITION_OF_DONE = {
  requirements: [
    'Chat ger alltid förståelse',
    'Demo visar exakt hur bra det kan bli',
    'Full rapport kräver betalning',
    'PDF är vacker, korrekt, verifierbar',
    'Inget går att missförstå utan varning',
  ],
  
  validation_checks: {
    chat_provides_understanding: true,
    demo_shows_quality: true,
    full_report_requires_payment: true,
    pdf_is_beautiful_correct_verifiable: true,
    nothing_misunderstandable_without_warning: true,
  },
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function canGenerateReport(
  userTier: 'FREE' | 'PRO' | 'ORG' | 'ENTERPRISE',
  demoUsed: boolean,
  reportsThisMonth: number
): { allowed: boolean; reason?: string; showUpgrade?: boolean } {
  // FREE users can only generate demo
  if (userTier === 'FREE') {
    if (!demoUsed) {
      return { allowed: true }; // Demo available
    }
    return { 
      allowed: false, 
      reason: 'Demo redan använd',
      showUpgrade: true,
    };
  }
  
  // PRO users have monthly limit
  if (userTier === 'PRO') {
    const limit = REPORT_PRICING.find(p => p.tier === 'PRO')?.reports_per_month;
    if (typeof limit === 'number' && reportsThisMonth >= limit) {
      return {
        allowed: false,
        reason: `Månadsgräns nådd (${limit} rapporter)`,
        showUpgrade: true,
      };
    }
    return { allowed: true };
  }
  
  // ORG and ENTERPRISE have unlimited
  return { allowed: true };
}

export function getReportPricing(tier: 'PRO' | 'ORG' | 'ENTERPRISE'): ReportPricingTier | undefined {
  return REPORT_PRICING.find(p => p.tier === tier);
}

export function validateChatResponse(response: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerResponse = response.toLowerCase();
  
  for (const phrase of CHAT_ENGINE_CONFIG.forbidden_phrases) {
    if (lowerResponse.includes(phrase.toLowerCase())) {
      violations.push(`Forbidden phrase: "${phrase}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

export function getReportSectionById(id: string): ReportSection | undefined {
  return FULL_REPORT_SECTIONS.find(s => s.id === id);
}

// ============================================================
// COMPLETE EXPORT
// ============================================================

export const REPORTING_CONFIG_COMPLETE = {
  chatEngine: CHAT_ENGINE_CONFIG,
  deepAnalysis: {
    sections: DEEP_ANALYSIS_SECTIONS,
    mandatoryMetadata: DEEP_ANALYSIS_MANDATORY_METADATA,
  },
  demoReport: DEMO_REPORT_CONFIG,
  paymentGate: PAYMENT_GATE_CONFIG,
  fullReport: {
    sections: FULL_REPORT_SECTIONS,
  },
  pdfDesign: PDF_DESIGN_CONFIG,
  pricing: REPORT_PRICING,
  definitionOfDone: REPORTING_DEFINITION_OF_DONE,
} as const;
