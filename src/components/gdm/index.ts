/**
 * GDM Components Index
 */

export { GlobalDiagnosticMap } from './GlobalDiagnosticMap';
export { MapContainer } from './MapContainer';
export { MapModeSelector } from './MapModeSelector';
export { IndexPills } from './IndexPills';
export { SimpleTimeSlider } from './SimpleTimeSlider';
export { CountryInfoPanel } from './CountryInfoPanel';
export { CityIndicatorSelector, CITY_INDICATORS } from './CityIndicatorSelector';
export { MOCK_CITIES } from './CityMarkers';
export { CityInfoPanel } from './CityInfoPanel';
export { CountryKeyMetrics, getCountryMetrics, type KeyMetric } from './CountryKeyMetrics';
export { GeopoliticalContext, ALLIANCES, getCountryGeopolitics } from './GeopoliticalContext';
export { IQ_DATA, getIQColor, getIQCategory, IQLegend, IQMethodologyDialog } from './IQIndicator';
export { 
  CONTINENTS, 
  POLITICAL_BLOCS, 
  ECONOMIC_ZONES, 
  getRegionColor, 
  getCountryRegion, 
  RegionLegend, 
  RegionTypeSelector,
  type RegionType,
  type RegionInfo
} from './RegionIndicator';
export {
  LEGAL_TOPICS,
  CANNABIS_STATUS,
  getLegalStatus,
  getLegalColor,
  LegalLegend,
  LegalTopicSelector,
  LegalStatusDialog,
  type LegalTopic,
  type LegalStatus,
  type LegalInfo
} from './LegalStatusIndicator';
export {
  POLITICAL_DATA,
  getPoliticalColor,
  getPoliticalInfo,
  PoliticalLegend,
  PoliticalDialog,
  type PoliticalOrientation,
  type PoliticalInfo
} from './PoliticalOrientationIndicator';
export {
  ECONOMIC_DATA,
  getEconomicColor,
  getEconomicTier,
  EconomicLegend,
  EconomicDialog,
  type EconomicTier,
  type EconomicInfo
} from './EconomicIndicator';
export {
  MILITARY_DATA,
  getMilitaryColor,
  getMilitaryTier,
  MilitaryLegend,
  MilitaryDialog,
  type MilitaryTier,
  type MilitaryInfo
} from './MilitaryIndicator';

// Legacy components (kept for compatibility)
export { GlobalStatusBar } from './GlobalStatusBar';
export { LayerPanel } from './LayerPanel';
export { DiagnosticPanel } from './DiagnosticPanel';
export { TimeSlider } from './TimeSlider';
export { AISignalOverlay } from './AISignalOverlay';

// Types
export * from './types';
