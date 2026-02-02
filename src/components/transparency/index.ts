/**
 * DEL XIV — AGGREGERINGS- & ANSVARSMODELL
 * DEL XXIV — KÄNSLIGA VYER & SPRÅKREGLER
 * 
 * Transparenskomponenter för "Vi visar – vi påstår inte"
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
