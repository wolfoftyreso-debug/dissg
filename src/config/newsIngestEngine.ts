/**
 * NEWS & TEXT INGEST ENGINE
 * Block Y: Transform news and text into structured signals
 * 
 * RULE: No opinion filtering. Everything in.
 * RULE: Output is events, topics, intensity, frequency — NOT opinion.
 */

// ============================================================================
// TEXT PROCESSING PIPELINE
// ============================================================================

export interface TextDocument {
  id: string;
  source_id: string;
  url: string;
  title: string;
  content: string;
  published_at: string;
  fetched_at: string;
  language?: string;
  author?: string;
  media_type: 'article' | 'press_release' | 'report' | 'statement' | 'social';
}

export interface ProcessedDocument {
  id: string;
  source_id: string;
  url: string;
  title: string;
  
  // Language detection
  language: string;
  language_confidence: number;
  
  // Classification
  topics: TopicClassification[];
  categories: string[];
  
  // Entity extraction
  entities: ExtractedEntity[];
  
  // Event extraction
  events: ExtractedEvent[];
  
  // Geographic tagging
  geo_tags: GeoTag[];
  
  // Temporal tagging
  time_references: TimeReference[];
  
  // Metrics
  sentiment_score?: number; // -1 to 1, ONLY if clearly measurable
  urgency_score: number; // 0-1
  confidence_score: number; // 0-1
  
  processed_at: string;
  processing_version: string;
}

export interface TopicClassification {
  topic_id: string;
  topic_name: string;
  confidence: number;
  subtopics?: string[];
}

export interface ExtractedEntity {
  text: string;
  type: EntityType;
  normalized_id?: string;
  confidence: number;
  positions: number[];
}

export type EntityType = 
  | 'person'
  | 'organization'
  | 'location'
  | 'country'
  | 'date'
  | 'money'
  | 'percentage'
  | 'policy'
  | 'kpi'
  | 'event';

export interface ExtractedEvent {
  event_type: string;
  description: string;
  actors: string[];
  date?: string;
  location?: string;
  confidence: number;
}

export interface GeoTag {
  geo_code: string;
  geo_name: string;
  geo_level: 'country' | 'nuts1' | 'nuts2' | 'nuts3' | 'city';
  confidence: number;
}

export interface TimeReference {
  type: 'absolute' | 'relative';
  text: string;
  resolved_date?: string;
  confidence: number;
}

// ============================================================================
// TOPIC TAXONOMY
// ============================================================================

export interface TopicDefinition {
  id: string;
  name: string;
  name_en: string;
  parent_id?: string;
  keywords: string[];
  related_kpis: string[];
  description: string;
}

export const TOPIC_TAXONOMY: TopicDefinition[] = [
  // Health
  { id: 'health', name: 'Hälsa', name_en: 'Health', keywords: ['health', 'medical', 'hospital', 'disease', 'vaccine', 'healthcare'], related_kpis: ['life_expectancy', 'infant_mortality'], description: 'Health and medical topics' },
  { id: 'health.pandemic', name: 'Pandemi', name_en: 'Pandemic', parent_id: 'health', keywords: ['pandemic', 'epidemic', 'outbreak', 'virus', 'covid', 'infection'], related_kpis: ['excess_mortality'], description: 'Pandemic and infectious disease outbreaks' },
  { id: 'health.mental', name: 'Psykisk hälsa', name_en: 'Mental Health', parent_id: 'health', keywords: ['mental health', 'depression', 'anxiety', 'suicide', 'psychiatric'], related_kpis: ['suicide_rate', 'depression_prevalence'], description: 'Mental health topics' },
  { id: 'health.system', name: 'Sjukvårdssystem', name_en: 'Healthcare System', parent_id: 'health', keywords: ['hospital', 'waiting times', 'healthcare reform', 'nurses', 'doctors'], related_kpis: ['physicians_per_capita', 'hospital_beds'], description: 'Healthcare system and infrastructure' },
  
  // Economy
  { id: 'economy', name: 'Ekonomi', name_en: 'Economy', keywords: ['economy', 'gdp', 'growth', 'recession', 'business'], related_kpis: ['gdp_growth', 'gdp_per_capita'], description: 'Economic topics' },
  { id: 'economy.inflation', name: 'Inflation', name_en: 'Inflation', parent_id: 'economy', keywords: ['inflation', 'prices', 'cpi', 'deflation', 'cost of living'], related_kpis: ['cpi_inflation', 'core_inflation'], description: 'Price levels and inflation' },
  { id: 'economy.employment', name: 'Arbetsmarknad', name_en: 'Employment', parent_id: 'economy', keywords: ['jobs', 'unemployment', 'hiring', 'layoffs', 'labor market'], related_kpis: ['unemployment_rate', 'employment_rate'], description: 'Labor market and employment' },
  { id: 'economy.fiscal', name: 'Finanspolitik', name_en: 'Fiscal Policy', parent_id: 'economy', keywords: ['budget', 'deficit', 'debt', 'spending', 'taxes'], related_kpis: ['government_debt_gdp', 'budget_balance'], description: 'Government finances and fiscal policy' },
  { id: 'economy.monetary', name: 'Penningpolitik', name_en: 'Monetary Policy', parent_id: 'economy', keywords: ['interest rates', 'central bank', 'monetary', 'fed', 'ecb'], related_kpis: ['policy_rate', 'money_supply'], description: 'Central bank and monetary policy' },
  { id: 'economy.trade', name: 'Handel', name_en: 'Trade', parent_id: 'economy', keywords: ['trade', 'exports', 'imports', 'tariffs', 'sanctions'], related_kpis: ['trade_balance', 'exports_gdp'], description: 'International trade' },
  
  // Social
  { id: 'social', name: 'Socialt', name_en: 'Social', keywords: ['social', 'welfare', 'poverty', 'inequality'], related_kpis: ['gini_coefficient', 'poverty_rate'], description: 'Social issues' },
  { id: 'social.poverty', name: 'Fattigdom', name_en: 'Poverty', parent_id: 'social', keywords: ['poverty', 'homeless', 'food insecurity', 'deprivation'], related_kpis: ['poverty_rate', 'child_poverty'], description: 'Poverty and material deprivation' },
  { id: 'social.inequality', name: 'Ojämlikhet', name_en: 'Inequality', parent_id: 'social', keywords: ['inequality', 'gap', 'disparity', 'distribution'], related_kpis: ['gini_coefficient', 'income_quintile_ratio'], description: 'Income and wealth inequality' },
  { id: 'social.housing', name: 'Bostäder', name_en: 'Housing', parent_id: 'social', keywords: ['housing', 'rent', 'mortgage', 'homelessness', 'construction'], related_kpis: ['housing_cost_overburden', 'house_price_index'], description: 'Housing and real estate' },
  
  // Crime & Safety
  { id: 'crime', name: 'Brottslighet', name_en: 'Crime', keywords: ['crime', 'police', 'violence', 'theft', 'murder'], related_kpis: ['homicide_rate', 'violent_crime_rate'], description: 'Crime and public safety' },
  { id: 'crime.violent', name: 'Våldsbrott', name_en: 'Violent Crime', parent_id: 'crime', keywords: ['murder', 'assault', 'shooting', 'stabbing', 'violence'], related_kpis: ['homicide_rate'], description: 'Violent crime' },
  { id: 'crime.organized', name: 'Organiserad brottslighet', name_en: 'Organized Crime', parent_id: 'crime', keywords: ['gang', 'mafia', 'cartel', 'trafficking', 'organized'], related_kpis: [], description: 'Organized crime' },
  
  // Education
  { id: 'education', name: 'Utbildning', name_en: 'Education', keywords: ['education', 'school', 'university', 'students', 'teachers'], related_kpis: ['tertiary_education', 'pisa_reading'], description: 'Education topics' },
  { id: 'education.quality', name: 'Utbildningskvalitet', name_en: 'Education Quality', parent_id: 'education', keywords: ['pisa', 'test scores', 'learning outcomes', 'achievement'], related_kpis: ['pisa_reading', 'pisa_math'], description: 'Educational quality and outcomes' },
  
  // Environment
  { id: 'environment', name: 'Miljö', name_en: 'Environment', keywords: ['environment', 'climate', 'pollution', 'emissions', 'renewable'], related_kpis: ['co2_per_capita', 'renewable_energy_share'], description: 'Environment and climate' },
  { id: 'environment.climate', name: 'Klimat', name_en: 'Climate', parent_id: 'environment', keywords: ['climate change', 'global warming', 'carbon', 'net zero'], related_kpis: ['ghg_emissions', 'temperature_anomaly'], description: 'Climate change' },
  { id: 'environment.energy', name: 'Energi', name_en: 'Energy', parent_id: 'environment', keywords: ['energy', 'oil', 'gas', 'nuclear', 'solar', 'wind'], related_kpis: ['renewable_energy_share', 'energy_intensity'], description: 'Energy and resources' },
  
  // Politics
  { id: 'politics', name: 'Politik', name_en: 'Politics', keywords: ['government', 'parliament', 'election', 'policy', 'minister'], related_kpis: ['voter_turnout', 'trust_government'], description: 'Political topics' },
  { id: 'politics.election', name: 'Val', name_en: 'Election', parent_id: 'politics', keywords: ['election', 'vote', 'ballot', 'campaign', 'polls'], related_kpis: ['voter_turnout'], description: 'Elections and voting' },
  { id: 'politics.legislation', name: 'Lagstiftning', name_en: 'Legislation', parent_id: 'politics', keywords: ['law', 'bill', 'legislation', 'reform', 'regulation'], related_kpis: [], description: 'Laws and regulations' },
  
  // Migration
  { id: 'migration', name: 'Migration', name_en: 'Migration', keywords: ['migration', 'immigration', 'refugees', 'asylum', 'border'], related_kpis: ['net_migration', 'foreign_born_share'], description: 'Migration and immigration' },
  
  // Technology
  { id: 'technology', name: 'Teknologi', name_en: 'Technology', keywords: ['technology', 'digital', 'AI', 'automation', 'innovation'], related_kpis: ['r_and_d_spending', 'patent_applications'], description: 'Technology and innovation' },
  { id: 'technology.ai', name: 'Artificiell intelligens', name_en: 'Artificial Intelligence', parent_id: 'technology', keywords: ['AI', 'artificial intelligence', 'machine learning', 'chatgpt'], related_kpis: [], description: 'AI and machine learning' },
  
  // Conflict
  { id: 'conflict', name: 'Konflikt', name_en: 'Conflict', keywords: ['war', 'conflict', 'military', 'defense', 'attack'], related_kpis: ['defense_spending_gdp'], description: 'Armed conflict and military' },
  { id: 'conflict.war', name: 'Krig', name_en: 'War', parent_id: 'conflict', keywords: ['war', 'invasion', 'bombing', 'troops', 'battlefield'], related_kpis: [], description: 'Active warfare' },
  { id: 'conflict.terrorism', name: 'Terrorism', name_en: 'Terrorism', parent_id: 'conflict', keywords: ['terrorism', 'terrorist', 'attack', 'extremism'], related_kpis: [], description: 'Terrorism and extremism' },
];

// ============================================================================
// NEWS → KPI LINKAGE
// ============================================================================

export interface NewsKPILinkage {
  document_id: string;
  kpi_codes: string[];
  geo_codes: string[];
  linkage_type: 'direct_mention' | 'topic_correlation' | 'entity_match';
  confidence: number;
  reasoning: string;
}

export interface NewsVolumeSignal {
  topic_id: string;
  geo_code: string;
  period: string; // YYYY-MM-DD
  
  // Volume metrics
  article_count: number;
  source_count: number;
  
  // Change metrics
  volume_change_percent: number;
  volume_z_score: number;
  
  // Correlation hints
  related_kpis: string[];
  kpi_movements?: {
    kpi_code: string;
    direction: 'up' | 'down' | 'stable';
    lag_days: number;
  }[];
  
  // Meta
  sample_headlines: string[];
  generated_at: string;
}

// ============================================================================
// TEXT PROCESSING FUNCTIONS
// ============================================================================

export interface TextProcessingConfig {
  min_content_length: number;
  max_content_length: number;
  supported_languages: string[];
  entity_min_confidence: number;
  topic_min_confidence: number;
  enable_sentiment: boolean;
}

export const DEFAULT_PROCESSING_CONFIG: TextProcessingConfig = {
  min_content_length: 100,
  max_content_length: 50000,
  supported_languages: ['en', 'sv', 'de', 'fr', 'es', 'it', 'nl', 'da', 'no', 'fi'],
  entity_min_confidence: 0.7,
  topic_min_confidence: 0.6,
  enable_sentiment: false, // Disabled by default - focus on facts
};

export interface ProcessingResult {
  success: boolean;
  document?: ProcessedDocument;
  errors?: string[];
  processing_time_ms: number;
}

// Simulated processing pipeline
export function processTextDocument(
  doc: TextDocument,
  config: TextProcessingConfig = DEFAULT_PROCESSING_CONFIG
): ProcessingResult {
  const start = Date.now();
  
  // Validation
  if (doc.content.length < config.min_content_length) {
    return {
      success: false,
      errors: ['Content too short'],
      processing_time_ms: Date.now() - start
    };
  }
  
  // Language detection (simplified)
  const detectedLanguage = detectLanguage(doc.content);
  if (!config.supported_languages.includes(detectedLanguage.code)) {
    return {
      success: false,
      errors: [`Language ${detectedLanguage.code} not supported`],
      processing_time_ms: Date.now() - start
    };
  }
  
  // Topic classification
  const topics = classifyTopics(doc.content, doc.title);
  
  // Entity extraction
  const entities = extractEntities(doc.content);
  
  // Event extraction
  const events = extractEvents(doc.content, entities);
  
  // Geo tagging
  const geo_tags = extractGeoTags(doc.content, entities);
  
  // Time references
  const time_references = extractTimeReferences(doc.content, doc.published_at);
  
  // Calculate scores
  const urgency_score = calculateUrgency(doc.title, doc.content, topics);
  const confidence_score = calculateConfidence(topics, entities, geo_tags);
  
  const processed: ProcessedDocument = {
    id: doc.id,
    source_id: doc.source_id,
    url: doc.url,
    title: doc.title,
    
    language: detectedLanguage.code,
    language_confidence: detectedLanguage.confidence,
    
    topics,
    categories: topics.map(t => t.topic_id.split('.')[0]),
    
    entities,
    events,
    geo_tags,
    time_references,
    
    urgency_score,
    confidence_score,
    
    processed_at: new Date().toISOString(),
    processing_version: '1.0.0'
  };
  
  return {
    success: true,
    document: processed,
    processing_time_ms: Date.now() - start
  };
}

// Helper functions (simplified implementations)
function detectLanguage(text: string): { code: string; confidence: number } {
  // Simplified - would use proper NLP library
  const swedishWords = ['och', 'att', 'för', 'som', 'med', 'har', 'är'];
  const englishWords = ['the', 'and', 'for', 'that', 'with', 'has', 'are'];
  
  const words = text.toLowerCase().split(/\s+/).slice(0, 100);
  const svCount = words.filter(w => swedishWords.includes(w)).length;
  const enCount = words.filter(w => englishWords.includes(w)).length;
  
  if (svCount > enCount) {
    return { code: 'sv', confidence: Math.min(0.9, 0.5 + svCount * 0.05) };
  }
  return { code: 'en', confidence: Math.min(0.9, 0.5 + enCount * 0.05) };
}

function classifyTopics(content: string, title: string): TopicClassification[] {
  const results: TopicClassification[] = [];
  const text = (title + ' ' + content).toLowerCase();
  
  for (const topic of TOPIC_TAXONOMY) {
    let matchCount = 0;
    for (const keyword of topic.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      const confidence = Math.min(0.95, 0.3 + matchCount * 0.15);
      if (confidence >= 0.5) {
        results.push({
          topic_id: topic.id,
          topic_name: topic.name_en,
          confidence
        });
      }
    }
  }
  
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

function extractEntities(content: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  
  // Extract percentages
  const percentages = content.match(/\d+(\.\d+)?%/g) || [];
  percentages.forEach((p, i) => {
    entities.push({
      text: p,
      type: 'percentage',
      confidence: 0.95,
      positions: [content.indexOf(p)]
    });
  });
  
  // Extract money amounts
  const money = content.match(/[$€£¥]\s?\d+(\.\d+)?\s?(million|billion|trillion)?/gi) || [];
  money.forEach((m, i) => {
    entities.push({
      text: m,
      type: 'money',
      confidence: 0.9,
      positions: [content.indexOf(m)]
    });
  });
  
  return entities;
}

function extractEvents(content: string, entities: ExtractedEntity[]): ExtractedEvent[] {
  const events: ExtractedEvent[] = [];
  
  // Simplified event detection
  const eventPatterns = [
    { pattern: /announced|unveiled|launched/i, type: 'announcement' },
    { pattern: /increased|raised|grew/i, type: 'increase' },
    { pattern: /decreased|fell|dropped/i, type: 'decrease' },
    { pattern: /signed|agreed|approved/i, type: 'agreement' },
    { pattern: /resigned|fired|dismissed/i, type: 'personnel_change' },
  ];
  
  for (const { pattern, type } of eventPatterns) {
    if (pattern.test(content)) {
      events.push({
        event_type: type,
        description: `Detected ${type} event`,
        actors: [],
        confidence: 0.6
      });
    }
  }
  
  return events;
}

function extractGeoTags(content: string, entities: ExtractedEntity[]): GeoTag[] {
  const tags: GeoTag[] = [];
  
  // Country mapping (simplified)
  const countries: Record<string, { code: string; name: string }> = {
    'sweden': { code: 'SE', name: 'Sweden' },
    'sverige': { code: 'SE', name: 'Sweden' },
    'germany': { code: 'DE', name: 'Germany' },
    'deutschland': { code: 'DE', name: 'Germany' },
    'france': { code: 'FR', name: 'France' },
    'united states': { code: 'US', name: 'United States' },
    'usa': { code: 'US', name: 'United States' },
    'united kingdom': { code: 'GB', name: 'United Kingdom' },
    'uk': { code: 'GB', name: 'United Kingdom' },
  };
  
  const lowerContent = content.toLowerCase();
  for (const [keyword, country] of Object.entries(countries)) {
    if (lowerContent.includes(keyword)) {
      tags.push({
        geo_code: country.code,
        geo_name: country.name,
        geo_level: 'country',
        confidence: 0.85
      });
    }
  }
  
  return [...new Map(tags.map(t => [t.geo_code, t])).values()];
}

function extractTimeReferences(content: string, publishedAt: string): TimeReference[] {
  const refs: TimeReference[] = [];
  
  // Relative time references
  const relativePatterns = [
    { pattern: /yesterday/i, offset: -1 },
    { pattern: /today/i, offset: 0 },
    { pattern: /tomorrow/i, offset: 1 },
    { pattern: /last week/i, offset: -7 },
    { pattern: /next week/i, offset: 7 },
    { pattern: /last month/i, offset: -30 },
    { pattern: /next month/i, offset: 30 },
  ];
  
  const pubDate = new Date(publishedAt);
  
  for (const { pattern, offset } of relativePatterns) {
    const match = content.match(pattern);
    if (match) {
      const resolved = new Date(pubDate);
      resolved.setDate(resolved.getDate() + offset);
      refs.push({
        type: 'relative',
        text: match[0],
        resolved_date: resolved.toISOString().split('T')[0],
        confidence: 0.8
      });
    }
  }
  
  // Absolute dates (YYYY-MM-DD format)
  const absoluteDates = content.match(/\d{4}-\d{2}-\d{2}/g) || [];
  for (const date of absoluteDates) {
    refs.push({
      type: 'absolute',
      text: date,
      resolved_date: date,
      confidence: 0.95
    });
  }
  
  return refs;
}

function calculateUrgency(title: string, content: string, topics: TopicClassification[]): number {
  let urgency = 0.3; // Base
  
  const urgentWords = ['breaking', 'urgent', 'emergency', 'crisis', 'alert', 'warning'];
  const text = (title + ' ' + content).toLowerCase();
  
  for (const word of urgentWords) {
    if (text.includes(word)) {
      urgency += 0.15;
    }
  }
  
  // Crisis topics increase urgency
  const crisisTopics = ['conflict.war', 'health.pandemic', 'conflict.terrorism'];
  for (const topic of topics) {
    if (crisisTopics.includes(topic.topic_id)) {
      urgency += 0.2;
    }
  }
  
  return Math.min(1, urgency);
}

function calculateConfidence(
  topics: TopicClassification[],
  entities: ExtractedEntity[],
  geoTags: GeoTag[]
): number {
  let confidence = 0.5;
  
  // More topics = more confidence
  confidence += Math.min(0.2, topics.length * 0.05);
  
  // More entities = more confidence  
  confidence += Math.min(0.15, entities.length * 0.03);
  
  // Geo tags = more confidence
  confidence += Math.min(0.15, geoTags.length * 0.05);
  
  return Math.min(0.95, confidence);
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

export interface BatchResult {
  total: number;
  successful: number;
  failed: number;
  documents: ProcessedDocument[];
  errors: { doc_id: string; error: string }[];
  total_time_ms: number;
  avg_time_per_doc_ms: number;
}

export function processBatch(
  documents: TextDocument[],
  config: TextProcessingConfig = DEFAULT_PROCESSING_CONFIG
): BatchResult {
  const start = Date.now();
  const processed: ProcessedDocument[] = [];
  const errors: { doc_id: string; error: string }[] = [];
  
  for (const doc of documents) {
    const result = processTextDocument(doc, config);
    if (result.success && result.document) {
      processed.push(result.document);
    } else {
      errors.push({
        doc_id: doc.id,
        error: result.errors?.join(', ') || 'Unknown error'
      });
    }
  }
  
  const totalTime = Date.now() - start;
  
  return {
    total: documents.length,
    successful: processed.length,
    failed: errors.length,
    documents: processed,
    errors,
    total_time_ms: totalTime,
    avg_time_per_doc_ms: documents.length > 0 ? totalTime / documents.length : 0
  };
}

console.log('[News Ingest Engine] Loaded with', TOPIC_TAXONOMY.length, 'topics');
