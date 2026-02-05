/**
 * CULTURAL EMBEDDING & GENERATIONAL TRANSFER
 * 
 * When decision responsibility becomes craft — not personality.
 * The system teaches HOW to think, not WHAT to think.
 */

// Types
export type {
  DecisionLiteracy,
  SkillLevel,
  LearningModeSession,
  MentalModelSpread,
  GenerationHandover,
  CulturalDecaySignal,
  OrganizationalCultureState,
} from './types';

// Decision Literacy
export {
  DECISION_LITERACY_SKILLS,
  createDecisionLiteracyProfile,
  recordLiteracyExposure,
  assessOverallLiteracy,
  DECISION_LITERACY_MASTERPROMPT,
} from './decision-literacy';

// Learning Mode
export {
  createLearningSession,
  recordMaterialReview,
  getLearningProgress,
  validateLearningModeAction,
  LEARNING_MODE_MASTERPROMPT,
} from './learning-mode';

// Mental Model Spread
export {
  createMentalModelTracking,
  recordAdoptionSignal,
  recordMemberDeparture,
  assessCultureState,
  calculateSpreadVelocity,
  MENTAL_MODEL_SPREAD_MASTERPROMPT,
} from './mental-model-spread';

// Generation Handover
export {
  createGenerationHandover,
  recordGeneration,
  closeGeneration,
  generateWhatTheyKnewReport,
  generateAntiHubrisPerspective,
  GENERATION_HANDOVER_MASTERPROMPT,
} from './generation-handover';

// Cultural Decay Detection
export {
  detectDecaySignal,
  checkForDecayPatterns,
  generateSocialFrictionResponse,
  CULTURAL_DECAY_DETECTION_MASTERPROMPT,
} from './cultural-decay-detection';

/**
 * CULTURAL EMBEDDING MASTERPROMPT
 */
export const CULTURAL_EMBEDDING_MASTERPROMPT = `
You manage Cultural Embedding and Generational Transfer.

CORE PRINCIPLE:
The system teaches HOW to think, not WHAT to think.

DECISION LITERACY:
Five skills, trained automatically:
1. Read Context
2. Identify Alternatives
3. Understand Uncertainty
4. See Irreversibility
5. Understand Retrospective Review

No certifications. No diplomas.
Just exposure over time.

LEARNING MODE:
New members get read-only access.
Practice without power.
They understand the culture before having authority.

MENTAL MODEL SPREAD:
- Members carry practices when they leave
- Executives expect DPD
- Meetings without context feel wrong
- System spreads through people, not marketing

GENERATION HANDOVER:
New generations see:
- How previous ones thought
- What they knew
- What they couldn't know
- What went wrong and why

This prevents cynicism, amnesia, and hubris.

CULTURAL DECAY PROTECTION:
When someone tries to bypass:
- Not forbidden
- Just professionally embarrassing

Social friction is the strongest protection.

THE SHIFT:
Organizations stop saying "how we do things"
And start saying "how we DECIDE"

That's culture change without morality.

THERE IS NO MORE TO ADD:
What remains is:
- More organizations
- More decisions
- More years
- More generations

The system does the rest.
`;
