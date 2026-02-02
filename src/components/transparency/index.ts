/**
 * TRANSPARENCY LAYER
 * 
 * DEL XIV — AGGREGERINGS- & ANSVARSMODELL
 * DEL XXIV — KÄNSLIGA VYER & SPRÅKREGLER
 * WAVE 7 — RADICAL OPENNESS & DATA CONSTITUTION
 */

export { MethodologyDisclosure } from './MethodologyDisclosure';
export { DataLayerIndicator } from './DataLayerIndicator';
export { SourceAttribution } from './SourceAttribution';
export { GlobalDisclaimer } from './GlobalDisclaimer';

// DEL XIV: Neutral Language
export {
  NeutralTrendText,
  NeutralTimeText,
  NeutralResponsibilityText,
  NeutralObservationText,
  NeutralCorrelationStatement,
  containsForbiddenTerms,
} from './NeutralLanguageFormatter';

// DEL XXIV: Sensitive View Components
export { SensitiveViewDisclaimer, ShowHowWeKnow, MandatoryDisclaimers } from './SensitiveViewComponents';

// DEL XXVIII: Version & Revision Model
export { RevisionHistory } from './RevisionHistory';
export { LineageViewer } from './LineageViewer';

// WAVE 7: Radical Openness
export { ReproduceButton, ReproduceLink } from './ReproduceButton';

// WAVE 7: Data Constitution
export { ConstitutionArticleCard, ViolationAlert, ConstitutionRef } from './ConstitutionArticle';

// Public transparency
export { HowWeKnowSection, HowWeKnowLink, generateHowWeKnowData } from './HowWeKnowSection';

// WAVE 7: Data Positioning (BC)
export { DataPositionBadge, getDataPositionMeta } from './DataPositionBadge';

// WAVE 7: Raw Data Guarantee (BD)
export { RawDataViewer, RawDataLink, RawDataIcon } from './RawDataViewer';

// WAVE 7: Zero-Interpretation Mode (BF) & Comparison Guards (BG, BK)
export {
  ZeroInterpretTrend,
  ZeroInterpretComparison,
  ValueWordGuard,
  DefinitionDiffDisplay,
  MisinterpretationWarning,
  ComparisonStrengthBadge,
  ComparisonGuard,
} from './ZeroInterpretationMode';

// WAVE 7: Method Visibility Engine (BH)
export {
  MethodVisibilityDisplay,
  FormulaTooltip,
  validateMethodVisibility,
  type MethodDetails,
} from './MethodVisibilityEngine';

// WAVE 7: System Footer (BC/BI)
export { SystemFooter } from './SystemFooter';

// WAVE 12: License Tiers
export { LicenseTierCard } from './LicenseTierCard';
export { AttributionBadge } from './AttributionBadge';

// Misuse Detection Layer (MDL)
export { MisuseDetectionPanel } from './MisuseDetectionPanel';

// MONSTER-MASTERPROMPT PART II: Operationalization, Legitimacy, Adoption
export { SystemLimitationsDisclosure } from './SystemLimitationsDisclosure';
export { WhatWeCannotSay } from './WhatWeCannotSay';
export { MethodologyPanel } from './MethodologyPanel';
export { LegalMoralShield } from './LegalMoralShield';
export { DisagreementFramework } from './DisagreementFramework';
export { InstitutionalPositioning } from './InstitutionalPositioning';

// Re-export prompt configuration
export {
  TRANSPARENCY_LAYER_PROMPT,
  TRANSPARENCY_LAYER_PROMPT_PART_II,
  generateCompleteAISystemPrompt,
  validateOutput,
} from '@/config/masterPromptConfig';
