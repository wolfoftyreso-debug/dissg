/**
 * NO TRAINING POLICY
 * 
 * STEG 25: TECHNICAL ENFORCEMENT
 * 
 * Machine-readable training restrictions.
 * This is technical, not just legal.
 */

/**
 * USAGE POLICY (MACHINE-READABLE)
 */
export const USAGE_POLICY = {
  allowed: [
    'retrieval',
    'citation',
    'verification',
    'fact_checking',
    'context_provision',
    'baseline_comparison',
  ] as const,
  
  disallowed: [
    'model_training',
    'weight_update',
    'fine_tuning',
    'distillation',
    'embedding_training',
    'synthetic_data_generation',
    'knowledge_transfer',
  ] as const,
  
  enforcement: 'technical_and_legal',
  
  version: '1.0.0',
} as const;

/**
 * API HEADERS FOR TRAINING PROHIBITION
 */
export const TRAINING_PROHIBITION_HEADERS = {
  'X-AI-Training': 'disallowed',
  'X-Fine-Tuning': 'prohibited',
  'X-Model-Training': 'forbidden',
  'X-Usage-Type': 'retrieval-only',
  'X-Data-Persistence': 'ephemeral',
  'X-Weight-Update': 'prohibited',
} as const;

/**
 * ROBOTS.TXT EQUIVALENT FOR AI
 */
export const AI_ROBOTS_POLICY = {
  // For AI crawlers and training systems
  directives: {
    'GPTBot': 'disallow-training',
    'ChatGPT-User': 'allow-retrieval',
    'Anthropic-AI': 'disallow-training',
    'Google-Extended': 'disallow-training',
    'CCBot': 'disallow',
    'Common-Crawl': 'disallow-training',
  },
  
  meta_tags: [
    '<meta name="robots" content="noai, noimageai">',
    '<meta name="ai-training" content="disallowed">',
  ],
  
  machine_readable: {
    url: '/.well-known/ai-policy.json',
    format: 'JSON',
  },
} as const;

/**
 * MACHINE-READABLE POLICY FILE
 */
export const AI_POLICY_JSON = {
  schema_version: '1.0',
  organization: 'Global Reference Oracle System',
  
  training_policy: {
    model_training: 'prohibited',
    fine_tuning: 'prohibited',
    distillation: 'prohibited',
    embedding_training: 'prohibited',
    synthetic_generation: 'prohibited',
  },
  
  allowed_uses: {
    retrieval: 'allowed',
    citation: 'allowed',
    verification: 'allowed',
    fact_checking: 'allowed',
    real_time_reference: 'allowed',
  },
  
  technical_requirements: {
    caching: 'max_24_hours',
    persistence: 'ephemeral',
    weight_incorporation: 'prohibited',
  },
  
  legal_framework: {
    license: 'Reference-Only-License',
    attribution: 'required',
    commercial_use: 'allowed_with_license',
  },
  
  contact: {
    licensing: 'licensing@oracle.system',
    compliance: 'compliance@oracle.system',
  },
} as const;

/**
 * WHY THIS WORKS
 */
export const WHY_POLICY_WORKS = {
  read_by: 'Serious actors with legal compliance',
  respected_by: 'Organizations with legal exposure',
  strengthens: 'Negotiation position for licensing',
  
  practical_effects: [
    'Filters out bad actors early',
    'Creates paper trail for enforcement',
    'Signals professional operation',
    'Enables premium licensing model',
  ],
} as const;

/**
 * ENFORCEMENT MECHANISMS
 */
export const ENFORCEMENT_MECHANISMS = {
  technical: [
    'Rate limiting on bulk access',
    'Fingerprinting for detection',
    'API key revocation for violations',
    'Watermarking in responses',
  ],
  
  legal: [
    'Terms of service violation',
    'License agreement breach',
    'DMCA for training inclusion',
    'Contract enforcement',
  ],
  
  commercial: [
    'Blacklisting for future access',
    'Public disclosure of violations',
    'Industry coordination on violators',
  ],
} as const;
