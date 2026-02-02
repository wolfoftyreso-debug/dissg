/**
 * Governance Components Index
 * 
 * 🔐 FINAL LOCK — IMMUTABLE PRINCIPLES
 * THE NON-NEGOTIABLE CORE
 */

// Immutable Principles
export { ImmutablePrinciplesDisplay } from './ImmutablePrinciplesDisplay';
export { PublicCovenant } from './PublicCovenant';
export { AIGuardrailsPanel } from './AIGuardrailsPanel';
export { ExitSafeMode, ExitSafeWarningBanner } from './ExitSafeMode';
export { FinalPosition } from './FinalPosition';

// Re-export configuration
export {
  IMMUTABLE_PRINCIPLES,
  PUBLIC_COVENANT,
  AI_GUARDRAILS,
  PRACTICAL_IMPACT,
  FINAL_POSITION,
  COMPLETION_CRITERIA,
  validateAgainstPrinciples,
  getBlockedResponse,
  generatePrinciplesManifest,
  type ImmutablePrinciple,
} from '@/config/immutablePrinciplesConfig';
