/**
 * WAVE 10: BLOCK CH — EXTERNAL EMBED & DISTRIBUTION
 * 
 * Data överallt.
 * Viralt utan manipulation.
 * 
 * Alltid med: källa, metod, länk tillbaka.
 */

// ============================================================
// CH1: EMBED TYPES
// ============================================================

export type EmbedType = 
  | 'chart'           // Grafer
  | 'dashboard'       // Dashboards
  | 'index_card'      // Indexkort
  | 'change_feed'     // Förändringsfeeds
  | 'comparison'      // Jämförelser
  | 'data_point';     // Enskild datapunkt

export interface EmbedConfig {
  type: EmbedType;
  id: string;
  
  // Display options
  width?: number | string;
  height?: number | string;
  theme?: 'light' | 'dark' | 'auto';
  language?: 'sv' | 'en';
  
  // Data options
  data_source?: string;
  kpi_ids?: string[];
  country_codes?: string[];
  period?: {
    start: string;
    end: string;
  };
  
  // MANDATORY: Always shown
  show_source: true;
  show_method: true;
  show_backlink: true;
  
  // Optional features
  interactive?: boolean;
  allow_export?: boolean;
  auto_update?: boolean;
  update_interval?: number; // seconds
}

// ============================================================
// EMBED CODE GENERATION
// ============================================================

export interface GeneratedEmbed {
  html: string;
  javascript?: string;
  iframe?: string;
  attribution: EmbedAttribution;
}

export interface EmbedAttribution {
  source_name: string;
  source_url: string;
  method_name: string;
  method_url: string;
  platform_url: string;
  license: string;
  generated_at: string;
}

export function generateEmbedCode(config: EmbedConfig): GeneratedEmbed {
  const embedId = `gdsp_embed_${config.id}_${Date.now()}`;
  const baseUrl = 'https://example.org/embed';
  
  const params = new URLSearchParams({
    type: config.type,
    id: config.id,
    theme: config.theme || 'auto',
    lang: config.language || 'sv'
  });
  
  if (config.kpi_ids) params.set('kpis', config.kpi_ids.join(','));
  if (config.country_codes) params.set('countries', config.country_codes.join(','));
  
  const embedUrl = `${baseUrl}?${params.toString()}`;
  
  const attribution: EmbedAttribution = {
    source_name: 'Original data source',
    source_url: 'https://example.org/sources',
    method_name: 'Aggregation method',
    method_url: 'https://example.org/methods',
    platform_url: 'https://example.org',
    license: 'CC BY-SA 4.0',
    generated_at: new Date().toISOString()
  };
  
  // HTML widget version
  const html = `
<!-- G-DSP Embed: ${config.type} -->
<div id="${embedId}" class="gdsp-embed" data-type="${config.type}">
  <div class="gdsp-embed-content">
    <!-- Content loaded dynamically -->
  </div>
  <div class="gdsp-embed-footer">
    <span class="gdsp-source">Källa: <a href="${attribution.source_url}" target="_blank">${attribution.source_name}</a></span>
    <span class="gdsp-method">Metod: <a href="${attribution.method_url}" target="_blank">${attribution.method_name}</a></span>
    <a href="${attribution.platform_url}" target="_blank" class="gdsp-backlink">Via G-DSP</a>
  </div>
</div>
<script src="${baseUrl}/sdk.js" data-embed-id="${embedId}"></script>
<!-- License: ${attribution.license} -->
`.trim();

  // Iframe version
  const iframe = `
<iframe 
  src="${embedUrl}"
  width="${config.width || '100%'}"
  height="${config.height || 400}"
  frameborder="0"
  title="G-DSP ${config.type} embed"
  loading="lazy"
></iframe>
<!-- Source: ${attribution.source_url} | Method: ${attribution.method_url} | License: ${attribution.license} -->
`.trim();

  // JavaScript SDK version
  const javascript = `
GDSP.embed({
  container: '#${embedId}',
  type: '${config.type}',
  id: '${config.id}',
  theme: '${config.theme || 'auto'}',
  language: '${config.language || 'sv'}',
  interactive: ${config.interactive ?? true},
  showSource: true,
  showMethod: true,
  showBacklink: true
});
`.trim();

  return { html, javascript, iframe, attribution };
}

// ============================================================
// EMBED TEMPLATES
// ============================================================

export const EMBED_TEMPLATES: Record<EmbedType, {
  name: string;
  description: string;
  minWidth: number;
  minHeight: number;
  maxDataPoints?: number;
}> = {
  chart: {
    name: 'Graf',
    description: 'Interaktiv tidsserie eller jämförelsegraf',
    minWidth: 300,
    minHeight: 200
  },
  dashboard: {
    name: 'Dashboard',
    description: 'Komplett dashboard med flera komponenter',
    minWidth: 600,
    minHeight: 400
  },
  index_card: {
    name: 'Indexkort',
    description: 'Enskilt index med värde och trend',
    minWidth: 200,
    minHeight: 150
  },
  change_feed: {
    name: 'Förändringsfeed',
    description: 'Lista över senaste förändringar',
    minWidth: 300,
    minHeight: 300,
    maxDataPoints: 10
  },
  comparison: {
    name: 'Jämförelse',
    description: 'Jämförelse mellan länder/regioner',
    minWidth: 400,
    minHeight: 300
  },
  data_point: {
    name: 'Datapunkt',
    description: 'Enskilt värde med kontext',
    minWidth: 150,
    minHeight: 100
  }
};

// ============================================================
// SDK CONFIGURATION
// ============================================================

export interface SDKConfig {
  version: string;
  cdn_url: string;
  api_endpoint: string;
  default_theme: 'light' | 'dark' | 'auto';
  default_language: 'sv' | 'en';
  cache_duration: number; // seconds
  
  // Mandatory features (cannot be disabled)
  mandatory: {
    show_source: true;
    show_method: true;
    show_backlink: true;
    include_license: true;
  };
  
  // Optional features
  optional: {
    allow_download: boolean;
    allow_share: boolean;
    allow_customize: boolean;
    track_usage: boolean;
  };
}

export const SDK_CONFIG: SDKConfig = {
  version: '1.0.0',
  cdn_url: 'https://cdn.example.org/gdsp-embed',
  api_endpoint: 'https://api.example.org/embed',
  default_theme: 'auto',
  default_language: 'sv',
  cache_duration: 300, // 5 minutes
  
  mandatory: {
    show_source: true,
    show_method: true,
    show_backlink: true,
    include_license: true
  },
  
  optional: {
    allow_download: true,
    allow_share: true,
    allow_customize: false,
    track_usage: true
  }
};

// ============================================================
// USAGE TRACKING (OPTIONAL, PRIVACY-RESPECTING)
// ============================================================

export interface EmbedUsageEvent {
  embed_id: string;
  embed_type: EmbedType;
  event: 'view' | 'interact' | 'share' | 'download';
  timestamp: string;
  
  // Anonymized context
  referrer_domain?: string;
  country_code?: string;
  
  // No personal data
}

export function createUsageEvent(
  embedId: string, 
  embedType: EmbedType, 
  event: 'view' | 'interact' | 'share' | 'download'
): EmbedUsageEvent {
  return {
    embed_id: embedId,
    embed_type: embedType,
    event,
    timestamp: new Date().toISOString()
  };
}
