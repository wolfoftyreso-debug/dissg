/**
 * INGEST PIPELINE FACTORY — MASS PRODUCTION
 * Block O: Platform Lead
 * 
 * Generator system for automated data pipelines.
 * One config file + generate_pipeline() = complete ingest infrastructure.
 */

export type AccessMethod = 'rest_api' | 'graphql' | 'bulk_download' | 'sdmx' | 'odata' | 'sparql' | 'ftp' | 'web_scrape';

export interface DataSourceEntry {
  source_id: string;
  organization: string;
  url: string;
  access_method: AccessMethod;
  license: string;
  update_frequency: string;
  kpis_available: string[];
  historical_depth: string;
}

// ============================================================================
// PIPELINE CONFIGURATION TYPES
// ============================================================================

export interface PipelineConfig {
  source_id: string;
  source_name: string;
  enabled: boolean;
  
  // Connector configuration
  connector: ConnectorConfig;
  
  // Schedule configuration
  schedule: ScheduleConfig;
  
  // Schema handling
  schema: SchemaConfig;
  
  // Storage configuration
  storage: StorageConfig;
  
  // Event emission
  events: EventConfig;
  
  // Error handling
  errorHandling: ErrorConfig;
}

export interface ConnectorConfig {
  type: 'rest_api' | 'graphql' | 'soap' | 'ftp' | 'sftp' | 's3' | 'database' | 'websocket' | 'file_download';
  base_url: string;
  auth: AuthConfig;
  endpoints: EndpointConfig[];
  rate_limit: RateLimitConfig;
  retry: RetryConfig;
  timeout_ms: number;
  headers?: Record<string, string>;
}

export interface AuthConfig {
  type: 'none' | 'api_key' | 'oauth2' | 'basic' | 'bearer' | 'certificate';
  credentials_secret?: string;  // Reference to secret store
  oauth2_config?: OAuth2Config;
  api_key_header?: string;
  api_key_query_param?: string;
}

export interface OAuth2Config {
  token_url: string;
  client_id_secret: string;
  client_secret_secret: string;
  scopes: string[];
  grant_type: 'client_credentials' | 'authorization_code' | 'refresh_token';
}

export interface EndpointConfig {
  name: string;
  path: string;
  method: 'GET' | 'POST';
  params?: Record<string, string>;
  pagination?: PaginationConfig;
  response_path?: string;  // JSONPath to data array
  kpi_mapping: KpiMappingConfig[];
}

export interface PaginationConfig {
  type: 'offset' | 'cursor' | 'page' | 'link';
  page_size: number;
  max_pages?: number;
  offset_param?: string;
  cursor_param?: string;
  cursor_path?: string;
  next_link_path?: string;
}

export interface KpiMappingConfig {
  source_field: string;
  target_kpi_id: string;
  geo_field?: string;
  time_field?: string;
  demographic_fields?: Record<string, string>;
  transform?: TransformConfig;
}

export interface TransformConfig {
  type: 'none' | 'multiply' | 'divide' | 'round' | 'date_parse' | 'unit_convert' | 'custom';
  params?: Record<string, any>;
  custom_function?: string;
}

export interface RateLimitConfig {
  requests_per_second: number;
  requests_per_minute?: number;
  requests_per_hour?: number;
  concurrent_requests: number;
  backoff_multiplier: number;
}

export interface RetryConfig {
  max_retries: number;
  initial_delay_ms: number;
  max_delay_ms: number;
  retry_on_status: number[];
}

export interface ScheduleConfig {
  type: 'cron' | 'interval' | 'manual' | 'webhook';
  cron_expression?: string;  // e.g., "0 6 * * *" (daily at 6 AM)
  interval_minutes?: number;
  timezone: string;
  enabled: boolean;
  backfill_on_start: boolean;
}

export interface SchemaConfig {
  version: string;
  validation: ValidationConfig;
  change_detection: ChangeDetectionConfig;
  evolution: SchemaEvolutionConfig;
}

export interface ValidationConfig {
  strict: boolean;
  required_fields: string[];
  field_types: Record<string, 'string' | 'number' | 'boolean' | 'date' | 'array'>;
  custom_validators?: string[];
}

export interface ChangeDetectionConfig {
  enabled: boolean;
  checksum_fields: string[];
  notification_on_change: boolean;
  auto_migrate: boolean;
}

export interface SchemaEvolutionConfig {
  allow_new_fields: boolean;
  allow_type_changes: boolean;
  require_approval: boolean;
}

export interface StorageConfig {
  raw_table: string;
  processed_table: string;
  archive_after_days: number;
  partition_by: 'day' | 'week' | 'month' | 'year';
  compression: 'none' | 'gzip' | 'lz4';
}

export interface EventConfig {
  enabled: boolean;
  topic_prefix: string;
  events: {
    on_ingest: boolean;
    on_validation_error: boolean;
    on_schema_change: boolean;
    on_backfill_complete: boolean;
  };
}

export interface ErrorConfig {
  dead_letter_queue: boolean;
  max_error_rate_percent: number;
  alert_on_failure: boolean;
  alert_channels: ('email' | 'slack' | 'webhook')[];
}

// ============================================================================
// PIPELINE GENERATOR
// ============================================================================

export class PipelineGenerator {
  /**
   * Generate complete pipeline configuration from data source entry
   */
  static generatePipeline(source: DataSourceEntry): PipelineConfig {
    return {
      source_id: source.source_id,
      source_name: source.organization,
      enabled: true,
      
      connector: this.generateConnector(source),
      schedule: this.generateSchedule(source),
      schema: this.generateSchema(source),
      storage: this.generateStorage(source),
      events: this.generateEvents(source),
      errorHandling: this.generateErrorHandling(source),
    };
  }
  
  private static generateConnector(source: DataSourceEntry): ConnectorConfig {
    return {
      type: this.mapAccessMethod(source.access_method),
      base_url: source.url,
      auth: this.inferAuth(source),
      endpoints: this.generateEndpoints(source),
      rate_limit: {
        requests_per_second: source.access_method === 'bulk_download' ? 1 : 10,
        concurrent_requests: 3,
        backoff_multiplier: 2,
      },
      retry: {
        max_retries: 3,
        initial_delay_ms: 1000,
        max_delay_ms: 30000,
        retry_on_status: [429, 500, 502, 503, 504],
      },
      timeout_ms: 30000,
    };
  }
  
  private static mapAccessMethod(method: AccessMethod): ConnectorConfig['type'] {
    const mapping: Record<AccessMethod, ConnectorConfig['type']> = {
      'rest_api': 'rest_api',
      'graphql': 'graphql',
      'bulk_download': 'file_download',
      'sdmx': 'rest_api',
      'odata': 'rest_api',
      'sparql': 'graphql',
      'ftp': 'ftp',
      'web_scrape': 'rest_api',
    };
    return mapping[method] || 'rest_api';
  }
  
  private static inferAuth(source: DataSourceEntry): AuthConfig {
    // Most official statistical sources are open
    if (source.license === 'open' || source.license === 'cc_by') {
      return { type: 'none' };
    }
    
    // Some require API keys
    return {
      type: 'api_key',
      credentials_secret: `${source.source_id.toUpperCase()}_API_KEY`,
      api_key_header: 'X-API-Key',
    };
  }
  
  private static generateEndpoints(source: DataSourceEntry): EndpointConfig[] {
    // Generate endpoint for each KPI the source provides
    return source.kpis_available.map(kpiId => ({
      name: `fetch_${kpiId.toLowerCase()}`,
      path: `/data/${kpiId}`,  // Placeholder - would be customized per source
      method: 'GET' as const,
      pagination: {
        type: 'offset' as const,
        page_size: 1000,
        max_pages: 100,
        offset_param: 'offset',
      },
      kpi_mapping: [{
        source_field: 'value',
        target_kpi_id: kpiId,
        geo_field: 'geo_code',
        time_field: 'period',
      }],
    }));
  }
  
  private static generateSchedule(source: DataSourceEntry): ScheduleConfig {
    const cronExpressions: Record<string, string> = {
      'realtime': '*/5 * * * *',      // Every 5 minutes
      'daily': '0 6 * * *',           // Daily at 6 AM
      'weekly': '0 6 * * 1',          // Monday at 6 AM
      'monthly': '0 6 1 * *',         // 1st of month at 6 AM
      'quarterly': '0 6 1 1,4,7,10 *', // Quarterly
      'annual': '0 6 15 1 *',         // Jan 15 at 6 AM
      'irregular': '0 6 * * 1',       // Weekly check
    };
    
    return {
      type: 'cron',
      cron_expression: cronExpressions[source.update_frequency] || cronExpressions['daily'],
      timezone: 'UTC',
      enabled: true,
      backfill_on_start: true,
    };
  }
  
  private static generateSchema(source: DataSourceEntry): SchemaConfig {
    return {
      version: '1.0.0',
      validation: {
        strict: true,
        required_fields: ['value', 'geo_code', 'period'],
        field_types: {
          value: 'number',
          geo_code: 'string',
          period: 'date',
        },
      },
      change_detection: {
        enabled: true,
        checksum_fields: ['value', 'geo_code', 'period'],
        notification_on_change: true,
        auto_migrate: false,
      },
      evolution: {
        allow_new_fields: true,
        allow_type_changes: false,
        require_approval: true,
      },
    };
  }
  
  private static generateStorage(source: DataSourceEntry): StorageConfig {
    return {
      raw_table: `raw_${source.source_id.toLowerCase()}`,
      processed_table: `processed_${source.source_id.toLowerCase()}`,
      archive_after_days: 365 * 10,  // 10 years
      partition_by: 'month',
      compression: 'lz4',
    };
  }
  
  private static generateEvents(source: DataSourceEntry): EventConfig {
    return {
      enabled: true,
      topic_prefix: `ingest.${source.source_id.toLowerCase()}`,
      events: {
        on_ingest: true,
        on_validation_error: true,
        on_schema_change: true,
        on_backfill_complete: true,
      },
    };
  }
  
  private static generateErrorHandling(source: DataSourceEntry): ErrorConfig {
    return {
      dead_letter_queue: true,
      max_error_rate_percent: 5,
      alert_on_failure: true,
      alert_channels: ['slack', 'email'],
    };
  }
}

// ============================================================================
// BACKFILL ENGINE
// ============================================================================

export interface BackfillConfig {
  source_id: string;
  start_date: string;  // ISO date
  end_date: string;
  chunk_size_days: number;
  max_concurrent_chunks: number;
  retry_failed_chunks: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface BackfillState {
  id: string;
  source_id: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  total_chunks: number;
  completed_chunks: number;
  failed_chunks: number;
  current_chunk?: string;
  started_at?: string;
  completed_at?: string;
  error_log: BackfillError[];
}

export interface BackfillError {
  chunk_id: string;
  error_message: string;
  retry_count: number;
  last_attempt: string;
}

export class BackfillEngine {
  /**
   * Create backfill job for historical data
   */
  static createBackfillJob(
    source: DataSourceEntry,
    startDate: string,
    endDate: string
  ): BackfillConfig {
    const historicalDepth = this.parseHistoricalDepth(source.historical_depth);
    
    return {
      source_id: source.source_id,
      start_date: startDate || historicalDepth.earliest,
      end_date: endDate || new Date().toISOString().split('T')[0],
      chunk_size_days: this.calculateOptimalChunkSize(source),
      max_concurrent_chunks: 3,
      retry_failed_chunks: true,
      priority: 'medium',
    };
  }
  
  private static parseHistoricalDepth(depth: string): { earliest: string; years: number } {
    const match = depth.match(/(\d+)/);
    const years = match ? parseInt(match[1]) : 10;
    const earliest = new Date();
    earliest.setFullYear(earliest.getFullYear() - years);
    return {
      years,
      earliest: earliest.toISOString().split('T')[0],
    };
  }
  
  private static calculateOptimalChunkSize(source: DataSourceEntry): number {
    // Adjust chunk size based on update frequency and expected data volume
    const chunkSizes: Record<string, number> = {
      'realtime': 1,
      'daily': 7,
      'weekly': 30,
      'monthly': 90,
      'quarterly': 180,
      'annual': 365,
      'irregular': 30,
    };
    return chunkSizes[source.update_frequency] || 30;
  }
  
  /**
   * Generate chunks for backfill processing
   */
  static generateChunks(config: BackfillConfig): { start: string; end: string; id: string }[] {
    const chunks: { start: string; end: string; id: string }[] = [];
    const startDate = new Date(config.start_date);
    const endDate = new Date(config.end_date);
    
    let chunkStart = new Date(startDate);
    let chunkIndex = 0;
    
    while (chunkStart < endDate) {
      const chunkEnd = new Date(chunkStart);
      chunkEnd.setDate(chunkEnd.getDate() + config.chunk_size_days);
      
      if (chunkEnd > endDate) {
        chunkEnd.setTime(endDate.getTime());
      }
      
      chunks.push({
        id: `${config.source_id}_chunk_${chunkIndex}`,
        start: chunkStart.toISOString().split('T')[0],
        end: chunkEnd.toISOString().split('T')[0],
      });
      
      chunkStart = new Date(chunkEnd);
      chunkStart.setDate(chunkStart.getDate() + 1);
      chunkIndex++;
    }
    
    return chunks;
  }
}

// ============================================================================
// PIPELINE REGISTRY
// ============================================================================

export class PipelineRegistry {
  private static pipelines: Map<string, PipelineConfig> = new Map();
  
  static register(config: PipelineConfig): void {
    this.pipelines.set(config.source_id, config);
  }
  
  static get(sourceId: string): PipelineConfig | undefined {
    return this.pipelines.get(sourceId);
  }
  
  static getAll(): PipelineConfig[] {
    return Array.from(this.pipelines.values());
  }
  
  static getEnabled(): PipelineConfig[] {
    return this.getAll().filter(p => p.enabled);
  }
  
  static disable(sourceId: string): void {
    const config = this.pipelines.get(sourceId);
    if (config) {
      config.enabled = false;
    }
  }
  
  static enable(sourceId: string): void {
    const config = this.pipelines.get(sourceId);
    if (config) {
      config.enabled = true;
    }
  }
}

console.log('[Pipeline Generator] Factory initialized');
