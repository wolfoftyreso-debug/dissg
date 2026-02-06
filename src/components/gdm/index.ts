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

// Legacy components (kept for compatibility)
export { GlobalStatusBar } from './GlobalStatusBar';
export { LayerPanel } from './LayerPanel';
export { DiagnosticPanel } from './DiagnosticPanel';
export { TimeSlider } from './TimeSlider';
export { AISignalOverlay } from './AISignalOverlay';

// Types
export * from './types';
