/**
 * DEL XV-XIX, XXIV — OÄNDLIGT DJUP, RÄTT GJORT
 * 
 * Komponenter för rekursiv analys med integritetsskydd:
 * - DEL XV: Grundläggande djupanalys
 * - DEL XVI: Kart- & Zoom-UX + Klusterlogik
 * - DEL XVII: Simulering & "Lek med talen"
 * - DEL XVIII: Privacy-by-Design spärrar
 * - DEL XIX: Oändligt djup (rekursiv utforskning)
 * - DEL XXIV: Djupdata (kön, migration, ursprung)
 */

// DEL XV - Grundläggande
export { DepthNavigator } from './DepthNavigator';
export { SimulationPanel } from './SimulationPanel';
export { CausalChainViewer } from './CausalChainViewer';
export { PrivacyGuard, PrivacyIndicator, PrivacyInfoCard } from './PrivacyGuard';

// DEL XVI - Kart-UX & Klusterlogik
export { MapExplorer } from './MapExplorer';
export { ClusterExplainerDetailed } from './ClusterExplainerDetailed';

// DEL XVII - Avancerad simulering
export { AdvancedSimulation } from './AdvancedSimulation';

// DEL XVIII - Privacy-spärrar
export { PrivacySpärrar, DatapointDisclaimer } from './PrivacySpärrar';

// DEL XIX - Oändligt djup (rekursiv utforskning)
export { InfiniteDepthEngine } from './InfiniteDepthEngine';

// DEL XXIV - Djupdata med N-spärrar
export { 
  DemographicDataGuard,
  ForbiddenCrossingWarning 
} from './DemographicDataGuard';

// WAVE 9 - Global Reality Graph
export { GlobalRealityGraph } from './GlobalRealityGraph';

// System Memory Archive (SMA)
export { SystemMemoryArchive } from './SystemMemoryArchive';
