/**
 * BLOCK AF — GLOBAL MEDIA INTELLIGENCE
 * Configuration for news sources and processing pipeline
 */

export interface MediaSourceConfig {
  code: string;
  name: string;
  sourceType: 'news_agency' | 'national_media' | 'press_release' | 'government' | 'regional' | 'rss' | 'api';
  country?: string;
  language: string;
  baseUrl?: string;
  rssFeedUrl?: string;
  apiEndpoint?: string;
  reliability: number;
  updateFrequency: 'realtime' | 'hourly' | 'daily';
  category: 'international' | 'national' | 'regional' | 'specialized';
}

// AF1: Maximum Coverage Sources
export const MEDIA_SOURCES: MediaSourceConfig[] = [
  // === INTERNATIONAL NEWS AGENCIES ===
  { code: 'REUTERS', name: 'Reuters', sourceType: 'news_agency', language: 'en', reliability: 0.95, updateFrequency: 'realtime', category: 'international' },
  { code: 'AP', name: 'Associated Press', sourceType: 'news_agency', language: 'en', reliability: 0.95, updateFrequency: 'realtime', category: 'international' },
  { code: 'AFP', name: 'Agence France-Presse', sourceType: 'news_agency', language: 'fr', reliability: 0.95, updateFrequency: 'realtime', category: 'international' },
  { code: 'DPA', name: 'Deutsche Presse-Agentur', sourceType: 'news_agency', language: 'de', reliability: 0.93, updateFrequency: 'realtime', category: 'international' },
  { code: 'EFE', name: 'EFE', sourceType: 'news_agency', language: 'es', reliability: 0.90, updateFrequency: 'realtime', category: 'international' },
  { code: 'XINHUA', name: 'Xinhua', sourceType: 'news_agency', language: 'zh', reliability: 0.70, updateFrequency: 'realtime', category: 'international' },
  { code: 'TASS', name: 'TASS', sourceType: 'news_agency', language: 'ru', reliability: 0.60, updateFrequency: 'realtime', category: 'international' },
  
  // === SWEDEN ===
  { code: 'TT', name: 'TT Nyhetsbyrån', sourceType: 'news_agency', country: 'SE', language: 'sv', reliability: 0.95, updateFrequency: 'realtime', category: 'national' },
  { code: 'SVT', name: 'Sveriges Television', sourceType: 'national_media', country: 'SE', language: 'sv', reliability: 0.92, updateFrequency: 'hourly', category: 'national' },
  { code: 'SR', name: 'Sveriges Radio', sourceType: 'national_media', country: 'SE', language: 'sv', reliability: 0.92, updateFrequency: 'hourly', category: 'national' },
  { code: 'DN', name: 'Dagens Nyheter', sourceType: 'national_media', country: 'SE', language: 'sv', reliability: 0.88, updateFrequency: 'hourly', category: 'national' },
  { code: 'SVD', name: 'Svenska Dagbladet', sourceType: 'national_media', country: 'SE', language: 'sv', reliability: 0.88, updateFrequency: 'hourly', category: 'national' },
  { code: 'GP', name: 'Göteborgs-Posten', sourceType: 'regional', country: 'SE', language: 'sv', reliability: 0.85, updateFrequency: 'hourly', category: 'regional' },
  { code: 'SYD', name: 'Sydsvenskan', sourceType: 'regional', country: 'SE', language: 'sv', reliability: 0.85, updateFrequency: 'hourly', category: 'regional' },
  { code: 'REGERINGEN', name: 'Regeringskansliet', sourceType: 'government', country: 'SE', language: 'sv', reliability: 0.98, updateFrequency: 'daily', category: 'national' },
  { code: 'RIKSDAGEN', name: 'Riksdagen', sourceType: 'government', country: 'SE', language: 'sv', reliability: 0.98, updateFrequency: 'daily', category: 'national' },
  
  // === EU ===
  { code: 'EU_PRESS', name: 'EU Press Releases', sourceType: 'press_release', language: 'en', reliability: 0.98, updateFrequency: 'daily', category: 'international' },
  { code: 'ECB_NEWS', name: 'ECB News', sourceType: 'press_release', language: 'en', reliability: 0.98, updateFrequency: 'daily', category: 'specialized' },
  { code: 'EUROSTAT', name: 'Eurostat News', sourceType: 'government', language: 'en', reliability: 0.98, updateFrequency: 'daily', category: 'specialized' },
  
  // === OTHER MAJOR COUNTRIES ===
  { code: 'BBC', name: 'BBC', sourceType: 'national_media', country: 'GB', language: 'en', reliability: 0.90, updateFrequency: 'hourly', category: 'national' },
  { code: 'GUARDIAN', name: 'The Guardian', sourceType: 'national_media', country: 'GB', language: 'en', reliability: 0.85, updateFrequency: 'hourly', category: 'national' },
  { code: 'SPIEGEL', name: 'Der Spiegel', sourceType: 'national_media', country: 'DE', language: 'de', reliability: 0.88, updateFrequency: 'hourly', category: 'national' },
  { code: 'FAZ', name: 'FAZ', sourceType: 'national_media', country: 'DE', language: 'de', reliability: 0.88, updateFrequency: 'hourly', category: 'national' },
  { code: 'LEMONDE', name: 'Le Monde', sourceType: 'national_media', country: 'FR', language: 'fr', reliability: 0.88, updateFrequency: 'hourly', category: 'national' },
  { code: 'NYT', name: 'New York Times', sourceType: 'national_media', country: 'US', language: 'en', reliability: 0.88, updateFrequency: 'hourly', category: 'national' },
  { code: 'WSJ', name: 'Wall Street Journal', sourceType: 'national_media', country: 'US', language: 'en', reliability: 0.88, updateFrequency: 'hourly', category: 'specialized' },
];

// AF2: Standard Media Pipeline
export interface MediaPipelineStep {
  name: string;
  function: string;
  description: string;
  required: boolean;
  outputField?: string;
}

export const MEDIA_PIPELINE: MediaPipelineStep[] = [
  { name: 'Fetch', function: 'fetch()', description: 'Retrieve raw content from source', required: true },
  { name: 'Language Detection', function: 'language_detect()', description: 'Identify source language', required: true, outputField: 'detected_language' },
  { name: 'Deduplicate', function: 'deduplicate()', description: 'Check for duplicate content', required: true, outputField: 'deduplication_hash' },
  { name: 'Clean Text', function: 'clean_text()', description: 'Remove HTML, normalize whitespace', required: true, outputField: 'clean_text' },
  { name: 'Topic Classification', function: 'topic_classification()', description: 'Classify into topic categories', required: true, outputField: 'topic_classification' },
  { name: 'Entity Extraction', function: 'entity_extraction()', description: 'Extract people, orgs, places', required: true, outputField: 'entities_extracted' },
  { name: 'Event Detection', function: 'event_detection()', description: 'Link to event taxonomy', required: true, outputField: 'event_types_detected' },
  { name: 'Geo Resolution', function: 'geo_resolution()', description: 'Resolve geographic references', required: true, outputField: 'geo_resolution' },
  { name: 'Time Resolution', function: 'time_resolution()', description: 'Extract temporal information', required: true, outputField: 'time_resolution' },
  { name: 'Sentiment Intensity', function: 'sentiment_intensity()', description: 'Measure sentiment (NEUTRAL, no opinion)', required: true, outputField: 'sentiment_intensity' },
  { name: 'Confidence Score', function: 'confidence_score()', description: 'Calculate overall confidence', required: true, outputField: 'confidence_score' },
  { name: 'Emit Event', function: 'emit_media_event()', description: 'Emit processed media event', required: true }
];

// AF3: Media → Data Correlation Types
export interface MediaCorrelationType {
  code: string;
  name: string;
  description: string;
  primaryMeasure: 'volume' | 'intensity' | 'frequency' | 'sentiment';
  secondaryMeasures: string[];
}

export const MEDIA_CORRELATION_TYPES: MediaCorrelationType[] = [
  {
    code: 'VOLUME_KPI',
    name: 'News Volume ↔ KPI',
    description: 'Correlation between news coverage volume and KPI changes',
    primaryMeasure: 'volume',
    secondaryMeasures: ['lag_days', 'topic_filter', 'source_filter']
  },
  {
    code: 'VOLUME_EVENT',
    name: 'News Volume ↔ Event',
    description: 'Correlation between news coverage and event occurrence',
    primaryMeasure: 'volume',
    secondaryMeasures: ['event_type', 'intensity_threshold']
  },
  {
    code: 'VOLUME_REGION',
    name: 'News Volume ↔ Region',
    description: 'Geographic distribution of news coverage',
    primaryMeasure: 'volume',
    secondaryMeasures: ['geo_level', 'topic_filter']
  },
  {
    code: 'VOLUME_INDEX',
    name: 'News Volume ↔ Index',
    description: 'Correlation between news coverage and composite indices',
    primaryMeasure: 'volume',
    secondaryMeasures: ['index_type', 'lag_days']
  },
  {
    code: 'INTENSITY_KPI',
    name: 'Coverage Intensity ↔ KPI',
    description: 'Correlation between coverage intensity and KPI sensitivity',
    primaryMeasure: 'intensity',
    secondaryMeasures: ['topic_filter', 'source_count']
  },
  {
    code: 'FREQUENCY_TREND',
    name: 'Publication Frequency ↔ Trend',
    description: 'How publication frequency relates to trends',
    primaryMeasure: 'frequency',
    secondaryMeasures: ['time_window', 'topic_filter']
  }
];

// Topic categories for classification
export const TOPIC_CATEGORIES = [
  'politics', 'economy', 'finance', 'business', 'labor', 'education',
  'health', 'environment', 'energy', 'infrastructure', 'housing',
  'crime', 'security', 'defense', 'migration', 'social_welfare',
  'technology', 'science', 'culture', 'sports', 'international'
] as const;

export type TopicCategory = typeof TOPIC_CATEGORIES[number];

// Helper to calculate media intensity score
export function calculateIntensityScore(
  articleCount: number,
  uniqueSources: number,
  avgSentiment: number | null
): number {
  const volumeScore = Math.min(articleCount / 100, 1) * 0.5;
  const diversityScore = Math.min(uniqueSources / 20, 1) * 0.3;
  const sentimentScore = avgSentiment !== null ? Math.abs(avgSentiment) * 0.2 : 0;
  return volumeScore + diversityScore + sentimentScore;
}
