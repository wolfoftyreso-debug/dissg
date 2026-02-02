/**
 * DEL XIV — AGGREGERINGS- & ANSVARSMODELL
 * 
 * Transparenskomponenter för "Vi visar – vi påstår inte"
 * 
 * Exporterar:
 * - MethodologyDisclosure: "Så här är detta beräknat" dialog
 * - DataLayerIndicator: Visar datalager (A/B/C)
 * - SourceAttribution: Källattribution med licens och datum
 * - GlobalDisclaimer: Systemdisclaimer i olika varianter
 * - NeutralLanguageFormatter: Neutrala textformuleringar
 */

export { MethodologyDisclosure } from './MethodologyDisclosure';
export { DataLayerIndicator } from './DataLayerIndicator';
export { SourceAttribution } from './SourceAttribution';
export { GlobalDisclaimer } from './GlobalDisclaimer';
export {
  NeutralTrendText,
  NeutralTimeText,
  NeutralResponsibilityText,
  NeutralObservationText,
  NeutralCorrelationStatement,
  containsForbiddenTerms,
} from './NeutralLanguageFormatter';
