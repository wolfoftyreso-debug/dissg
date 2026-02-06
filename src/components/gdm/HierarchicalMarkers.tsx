/**
 * HIERARCHICAL MAP MARKERS
 * 
 * Three levels of markers with 3D styling:
 * - Countries: Large flag markers (40-50px)
 * - States/Regions: Medium markers (25-35px)
 * - Cities: Small markers (18-25px)
 * 
 * All with beautiful 3D depth and shadows.
 */

import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type EntityLevel = 'country' | 'state' | 'city';

export interface MarkerEntity {
  id: string;
  name: string;
  level: EntityLevel;
  countryCode: string; // ISO 2-letter code for flag
  parentId?: string; // For states/cities
  coordinates: [number, number];
  population?: number;
  score?: number; // Benchmark score (100 = global average)
  indicators?: Record<string, number>;
}

// ============================================================================
// FLAG EMOJI MAPPING
// ============================================================================

const FLAG_EMOJIS: Record<string, string> = {
  // Nordic
  SE: '🇸🇪', NO: '🇳🇴', FI: '🇫🇮', DK: '🇩🇰', IS: '🇮🇸',
  // Europe
  DE: '🇩🇪', FR: '🇫🇷', GB: '🇬🇧', IT: '🇮🇹', ES: '🇪🇸', 
  NL: '🇳🇱', BE: '🇧🇪', AT: '🇦🇹', CH: '🇨🇭', PL: '🇵🇱',
  PT: '🇵🇹', GR: '🇬🇷', CZ: '🇨🇿', HU: '🇭🇺', IE: '🇮🇪',
  RO: '🇷🇴', UA: '🇺🇦', RU: '🇷🇺',
  // North America
  US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽',
  // Asia
  JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳', IN: '🇮🇳', SG: '🇸🇬',
  TH: '🇹🇭', VN: '🇻🇳', ID: '🇮🇩', MY: '🇲🇾', PH: '🇵🇭',
  // Oceania
  AU: '🇦🇺', NZ: '🇳🇿',
  // South America
  BR: '🇧🇷', AR: '🇦🇷', CL: '🇨🇱', CO: '🇨🇴', PE: '🇵🇪',
  // Africa
  ZA: '🇿🇦', NG: '🇳🇬', EG: '🇪🇬', KE: '🇰🇪', MA: '🇲🇦',
  // Middle East
  AE: '🇦🇪', SA: '🇸🇦', IL: '🇮🇱', TR: '🇹🇷',
};

export function getFlag(countryCode: string): string {
  return FLAG_EMOJIS[countryCode.toUpperCase()] || '🏳️';
}

// ============================================================================
// STATE ABBREVIATIONS (for compact display)
// ============================================================================

export const STATE_ABBREVS: Record<string, string> = {
  // US States
  'california': 'CA', 'texas': 'TX', 'florida': 'FL', 'new-york': 'NY',
  'illinois': 'IL', 'pennsylvania': 'PA', 'ohio': 'OH', 'georgia': 'GA',
  'north-carolina': 'NC', 'michigan': 'MI', 'washington': 'WA', 'arizona': 'AZ',
  'massachusetts': 'MA', 'colorado': 'CO', 'tennessee': 'TN', 'virginia': 'VA',
  // Swedish regions
  'stockholm-region': 'STH', 'vastra-gotaland': 'VGR', 'skane': 'SKÅ',
  'ostergotland': 'ÖST', 'uppsala': 'UPP', 'jonkoping': 'JKP',
  // German states
  'bayern': 'BY', 'nordrhein-westfalen': 'NRW', 'baden-wurttemberg': 'BW',
  'niedersachsen': 'NI', 'hessen': 'HE', 'berlin': 'BE',
};

// ============================================================================
// MARKER SIZE CONFIGURATION
// ============================================================================

export const MARKER_SIZES = {
  country: { 
    width: 52, 
    height: 60, 
    fontSize: 28,
    scoreSize: 16,
    labelSize: 10,
  },
  state: { 
    width: 38, 
    height: 44, 
    fontSize: 14,
    scoreSize: 12,
    labelSize: 9,
  },
  city: { 
    width: 26, 
    height: 32, 
    fontSize: 10,
    scoreSize: 10,
    labelSize: 8,
  },
} as const;

// ============================================================================
// SCORE TO COLOR
// ============================================================================

export function getScoreColor(score: number): string {
  if (score >= 120) return '#059669'; // emerald-600 - excellent
  if (score >= 110) return '#22c55e'; // green-500
  if (score >= 100) return '#3b82f6'; // blue-500 - average
  if (score >= 90) return '#f59e0b'; // amber-500
  if (score >= 80) return '#f97316'; // orange-500
  return '#ef4444'; // red-500 - poor
}

export function getScoreGradient(score: number): string {
  const base = getScoreColor(score);
  // Create a lighter version for gradient
  return `linear-gradient(135deg, ${base} 0%, ${base}dd 100%)`;
}

// ============================================================================
// CREATE MARKER HTML
// ============================================================================

export function createMarkerHTML(entity: MarkerEntity, isSelected: boolean = false): string {
  const { level, countryCode, name, score = 100 } = entity;
  const sizes = MARKER_SIZES[level];
  const scoreColor = getScoreColor(score);
  const flag = getFlag(countryCode);
  const abbrev = STATE_ABBREVS[entity.id] || entity.id.substring(0, 3).toUpperCase();
  
  const selectedClass = isSelected ? 'marker-selected' : '';
  const selectedRing = isSelected ? `box-shadow: 0 0 0 3px white, 0 0 0 5px ${scoreColor};` : '';
  
  if (level === 'country') {
    // COUNTRY: Large flag with score badge
    return `
      <div class="marker-container marker-country ${selectedClass}" style="${selectedRing}">
        <div class="marker-flag-large">${flag}</div>
        <div class="marker-score-badge" style="background: ${scoreColor}">${score}</div>
      </div>
    `;
  } else if (level === 'state') {
    // STATE: Medium sized with abbreviation
    return `
      <div class="marker-container marker-state ${selectedClass}" style="${selectedRing}">
        <div class="marker-state-icon">
          <div class="marker-mini-flag">${flag}</div>
          <div class="marker-state-abbrev">${abbrev}</div>
        </div>
        <div class="marker-score-badge-sm" style="background: ${scoreColor}">${score}</div>
      </div>
      <div class="marker-label marker-label-state">${name}</div>
    `;
  } else {
    // CITY: Small dot with score
    return `
      <div class="marker-container marker-city ${selectedClass}" style="${selectedRing}">
        <div class="marker-city-dot" style="background: ${scoreColor}">
          <span class="marker-city-score">${score}</span>
        </div>
      </div>
      <div class="marker-label marker-label-city">${name}</div>
    `;
  }
}

// ============================================================================
// MARKER STYLES (inject once)
// ============================================================================

export function injectMarkerStyles(): void {
  if (document.getElementById('hierarchical-marker-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'hierarchical-marker-styles';
  styles.textContent = `
    /* Base container */
    .marker-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
    }
    .marker-container:hover {
      transform: scale(1.12) translateY(-2px);
      z-index: 1000 !important;
      filter: drop-shadow(0 8px 12px rgba(0,0,0,0.25));
    }
    .marker-selected {
      z-index: 900 !important;
    }
    
    /* ========== COUNTRY MARKERS ========== */
    .marker-country {
      position: relative;
    }
    .marker-flag-large {
      font-size: 36px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      /* 3D effect */
      transform: perspective(100px) rotateX(5deg);
    }
    .marker-score-badge {
      position: absolute;
      bottom: -6px;
      right: -8px;
      min-width: 28px;
      height: 22px;
      padding: 0 6px;
      border-radius: 11px;
      font-size: 12px;
      font-weight: 800;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      /* 3D pill effect */
      background-image: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
    }
    
    /* ========== STATE MARKERS ========== */
    .marker-state {
      position: relative;
    }
    .marker-state-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: white;
      border-radius: 10px;
      padding: 4px 6px;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 
        0 2px 8px rgba(0,0,0,0.12),
        inset 0 1px 0 rgba(255,255,255,0.9);
      /* 3D effect */
      background-image: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(245,245,250,1) 100%);
    }
    .marker-mini-flag {
      font-size: 16px;
      line-height: 1;
    }
    .marker-state-abbrev {
      font-size: 9px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.5px;
    }
    .marker-score-badge-sm {
      position: absolute;
      bottom: -4px;
      right: -6px;
      min-width: 22px;
      height: 18px;
      padding: 0 4px;
      border-radius: 9px;
      font-size: 10px;
      font-weight: 800;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      background-image: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
    }
    
    /* ========== CITY MARKERS ========== */
    .marker-city {
      position: relative;
    }
    .marker-city-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 
        0 2px 6px rgba(0,0,0,0.2),
        inset 0 -2px 4px rgba(0,0,0,0.1),
        inset 0 2px 4px rgba(255,255,255,0.3);
      /* 3D sphere effect */
      background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%);
    }
    .marker-city-score {
      font-size: 9px;
      font-weight: 800;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    
    /* ========== LABELS ========== */
    .marker-label {
      margin-top: 4px;
      padding: 2px 8px;
      background: white;
      border-radius: 6px;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0,0,0,0.12);
      border: 1px solid rgba(0,0,0,0.05);
      /* 3D card effect */
      background-image: linear-gradient(to bottom, white 0%, #f8fafc 100%);
    }
    .marker-label-state {
      font-size: 10px;
    }
    .marker-label-city {
      font-size: 9px;
    }
    
    /* Country labels (shown on hover or when zoomed) */
    .marker-country-label {
      margin-top: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
      text-shadow: 0 1px 2px white;
    }
  `;
  document.head.appendChild(styles);
}

// ============================================================================
// MOCK DATA FOR STATES & CITIES
// ============================================================================

export const MOCK_STATES: MarkerEntity[] = [
  // USA States
  { id: 'california', name: 'California', level: 'state', countryCode: 'US', parentId: 'US', coordinates: [-119.4179, 36.7783], population: 39500000, score: 94 },
  { id: 'texas', name: 'Texas', level: 'state', countryCode: 'US', parentId: 'US', coordinates: [-99.9018, 31.9686], population: 29500000, score: 88 },
  { id: 'florida', name: 'Florida', level: 'state', countryCode: 'US', parentId: 'US', coordinates: [-81.5158, 27.6648], population: 22000000, score: 85 },
  { id: 'new-york', name: 'New York', level: 'state', countryCode: 'US', parentId: 'US', coordinates: [-75.4999, 42.1657], population: 19500000, score: 96 },
  { id: 'illinois', name: 'Illinois', level: 'state', countryCode: 'US', parentId: 'US', coordinates: [-89.3985, 40.6331], population: 12700000, score: 91 },
  { id: 'washington', name: 'Washington', level: 'state', countryCode: 'US', parentId: 'US', coordinates: [-120.7401, 47.7511], population: 7700000, score: 102 },
  
  // Swedish Regions
  { id: 'stockholm-region', name: 'Stockholm', level: 'state', countryCode: 'SE', parentId: 'SE', coordinates: [18.0686, 59.3293], population: 2400000, score: 108 },
  { id: 'vastra-gotaland', name: 'Västra Götaland', level: 'state', countryCode: 'SE', parentId: 'SE', coordinates: [12.0, 58.0], population: 1700000, score: 104 },
  { id: 'skane', name: 'Skåne', level: 'state', countryCode: 'SE', parentId: 'SE', coordinates: [13.5, 55.9], population: 1400000, score: 98 },
  
  // German States
  { id: 'bayern', name: 'Bayern', level: 'state', countryCode: 'DE', parentId: 'DE', coordinates: [11.4979, 48.7904], population: 13100000, score: 106 },
  { id: 'nordrhein-westfalen', name: 'NRW', level: 'state', countryCode: 'DE', parentId: 'DE', coordinates: [7.6261, 51.4332], population: 18000000, score: 95 },
  { id: 'baden-wurttemberg', name: 'Baden-Württemberg', level: 'state', countryCode: 'DE', parentId: 'DE', coordinates: [9.0000, 48.5000], population: 11100000, score: 108 },
];

export const MOCK_CITIES_HIERARCHICAL: MarkerEntity[] = [
  // USA Cities
  { id: 'los-angeles', name: 'Los Angeles', level: 'city', countryCode: 'US', parentId: 'california', coordinates: [-118.2437, 34.0522], population: 4000000, score: 89 },
  { id: 'san-francisco', name: 'San Francisco', level: 'city', countryCode: 'US', parentId: 'california', coordinates: [-122.4194, 37.7749], population: 880000, score: 102 },
  { id: 'new-york-city', name: 'New York City', level: 'city', countryCode: 'US', parentId: 'new-york', coordinates: [-74.0060, 40.7128], population: 8400000, score: 95 },
  { id: 'chicago', name: 'Chicago', level: 'city', countryCode: 'US', parentId: 'illinois', coordinates: [-87.6298, 41.8781], population: 2700000, score: 88 },
  { id: 'houston', name: 'Houston', level: 'city', countryCode: 'US', parentId: 'texas', coordinates: [-95.3698, 29.7604], population: 2300000, score: 82 },
  { id: 'seattle', name: 'Seattle', level: 'city', countryCode: 'US', parentId: 'washington', coordinates: [-122.3321, 47.6062], population: 750000, score: 105 },
  { id: 'miami', name: 'Miami', level: 'city', countryCode: 'US', parentId: 'florida', coordinates: [-80.1918, 25.7617], population: 470000, score: 78 },
  
  // Swedish Cities
  { id: 'stockholm-city', name: 'Stockholm', level: 'city', countryCode: 'SE', parentId: 'stockholm-region', coordinates: [18.0686, 59.3293], population: 975000, score: 112 },
  { id: 'gothenburg', name: 'Göteborg', level: 'city', countryCode: 'SE', parentId: 'vastra-gotaland', coordinates: [11.9746, 57.7089], population: 583000, score: 106 },
  { id: 'malmo', name: 'Malmö', level: 'city', countryCode: 'SE', parentId: 'skane', coordinates: [13.0038, 55.6049], population: 347000, score: 94 },
  
  // German Cities
  { id: 'munich', name: 'München', level: 'city', countryCode: 'DE', parentId: 'bayern', coordinates: [11.5820, 48.1351], population: 1500000, score: 112 },
  { id: 'cologne', name: 'Köln', level: 'city', countryCode: 'DE', parentId: 'nordrhein-westfalen', coordinates: [6.9603, 50.9375], population: 1080000, score: 98 },
  { id: 'stuttgart', name: 'Stuttgart', level: 'city', countryCode: 'DE', parentId: 'baden-wurttemberg', coordinates: [9.1829, 48.7758], population: 635000, score: 108 },
  
  // Nordic Cities
  { id: 'oslo', name: 'Oslo', level: 'city', countryCode: 'NO', parentId: 'NO', coordinates: [10.7522, 59.9139], population: 698000, score: 115 },
  { id: 'copenhagen', name: 'København', level: 'city', countryCode: 'DK', parentId: 'DK', coordinates: [12.5683, 55.6761], population: 644000, score: 111 },
  { id: 'helsinki', name: 'Helsinki', level: 'city', countryCode: 'FI', parentId: 'FI', coordinates: [24.9384, 60.1699], population: 656000, score: 109 },
  
  // Other Major Cities
  { id: 'london', name: 'London', level: 'city', countryCode: 'GB', parentId: 'GB', coordinates: [-0.1276, 51.5074], population: 8982000, score: 94 },
  { id: 'paris', name: 'Paris', level: 'city', countryCode: 'FR', parentId: 'FR', coordinates: [2.3522, 48.8566], population: 2161000, score: 96 },
  { id: 'tokyo', name: 'Tokyo', level: 'city', countryCode: 'JP', parentId: 'JP', coordinates: [139.6917, 35.6895], population: 13960000, score: 102 },
  { id: 'sydney', name: 'Sydney', level: 'city', countryCode: 'AU', parentId: 'AU', coordinates: [151.2093, -33.8688], population: 5312000, score: 104 },
  { id: 'toronto', name: 'Toronto', level: 'city', countryCode: 'CA', parentId: 'CA', coordinates: [-79.3832, 43.6532], population: 2930000, score: 101 },
];

export default {
  createMarkerHTML,
  injectMarkerStyles,
  getScoreColor,
  getFlag,
  MOCK_STATES,
  MOCK_CITIES_HIERARCHICAL,
  MARKER_SIZES,
};
