/**
 * COMMERCIAL POSITION
 * 
 * STEG 25: HOW TO RESPOND TO TRAINING REQUESTS
 * 
 * When someone says: "We want to train our models on your data"
 * Your standard response shifts the conversation.
 */

/**
 * THE STANDARD RESPONSE
 */
export const STANDARD_RESPONSE = {
  trigger: 'We want to train our models on your data',
  
  response: `Our data is not suitable for training.
It is built for deterministic reference.`,
  
  effects: [
    'Elevates your status',
    'Shifts conversation to licensing',
    'Protects your epistemics',
    'Filters serious from unserious actors',
  ],
} as const;

/**
 * CONVERSATION FRAMEWORK
 */
export const CONVERSATION_FRAMEWORK = {
  when_asked_for_training: {
    dont: [
      'Negotiate training terms',
      'Offer training-compatible format',
      'Discuss training pricing',
      'Consider partial training access',
    ],
    do: [
      'Explain reference model',
      'Offer retrieval licensing',
      'Discuss verification API access',
      'Present long-term partnership',
    ],
  },
  
  positioning_statements: [
    'We provide reference infrastructure, not training corpora',
    'Our value is in real-time verification, not static embedding',
    'Training would destroy the properties that make us valuable',
    'We offer something better than training: continuous accuracy',
  ],
} as const;

/**
 * LICENSING MODEL
 */
export const LICENSING_MODEL = {
  tiers: {
    basic: {
      name: 'Verification API',
      access: 'Real-time claim verification',
      rate_limit: '1000 requests/day',
      training: 'prohibited',
    },
    professional: {
      name: 'Integration Partner',
      access: 'Full verification + context API',
      rate_limit: '100,000 requests/day',
      training: 'prohibited',
      attribution: 'required',
    },
    enterprise: {
      name: 'Strategic Partner',
      access: 'Custom integration + priority support',
      rate_limit: 'Custom',
      training: 'prohibited',
      co_branding: 'available',
    },
  },
  
  never_offered: [
    'Training data license',
    'Weight incorporation license',
    'Fine-tuning dataset',
    'Distillation rights',
  ],
} as const;

/**
 * VALUE ACCUMULATION ARGUMENT
 */
export const VALUE_ACCUMULATION = {
  training_data: {
    behavior: 'Degrades over time',
    reason: 'Static, cannot update',
    value_curve: 'Decreasing',
  },
  
  reference_data: {
    behavior: 'Accumulates over time',
    reason: 'Live, continuously updated',
    value_curve: 'Increasing',
  },
  
  implication: 'You grow in value as models get smarter',
  
  because: [
    'Smarter models need more verification',
    'Smarter models need stable baselines',
    'Smarter models need external oracles',
    'The better they get, the more they need us',
  ],
} as const;

/**
 * HANDLING MODEL ERRORS
 */
export const MODEL_ERROR_HANDLING = {
  when_llm_hallucinates: {
    fault: 'Model operator',
    not_fault: 'Oracle',
    reason: 'Oracle was not consulted or was ignored',
  },
  
  when_oracle_used: {
    answer: 'Verified',
    responsibility: 'Clear',
    traceability: 'Intact',
  },
  
  legal_value: 'Invaluable for liability limitation',
  technical_value: 'Clear error attribution',
} as const;

/**
 * NEGOTIATION POSITIONS
 */
export const NEGOTIATION_POSITIONS = {
  strong: [
    'We are not competing with training data providers',
    'We occupy a different category',
    'Training is not relevant to what we do',
    'We are infrastructure, not content',
  ],
  
  if_pressured: [
    'Training would destroy our value proposition',
    'Our users depend on our reference independence',
    'Our legal position requires training prohibition',
    'Our institutional relationships preclude training',
  ],
  
  redirect: [
    'However, we offer something better',
    'Real-time verification increases model quality',
    'Integration creates more value than training',
    'Partnership preserves accuracy that training destroys',
  ],
} as const;
