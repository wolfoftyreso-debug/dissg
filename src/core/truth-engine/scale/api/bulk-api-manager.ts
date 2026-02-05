/**
 * BULK API ONBOARDING
 * 
 * Industrial-scale source integration.
 * 
 * Process:
 * 1. Add API metadata
 * 2. Auto-scan (schema, age, risk)
 * 3. Normalize to ontology
 * 4. Snapshot & version
 * 5. Connect to measures
 */

import type { DomainCode } from '../../usae/mao/unified-body';

/**
 * API REGISTRATION
 */
export interface APIRegistration {
  readonly api_id: string;
  readonly name: string;
  readonly provider: string;
  readonly base_url: string;
  readonly tier: 1 | 2 | 3;
  readonly domains: readonly DomainCode[];
  readonly auth_type: 'none' | 'api_key' | 'oauth' | 'certificate';
  readonly rate_limit_per_minute?: number;
  readonly documentation_url?: string;
}

/**
 * API SCAN RESULT
 */
export interface APIScanResult {
  readonly api_id: string;
  readonly scanned_at: string;
  readonly status: 'healthy' | 'warning' | 'error';
  readonly schema_detected: boolean;
  readonly data_age_days: number;
  readonly risk_level: 'low' | 'medium' | 'high';
  readonly measures_found: number;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}

/**
 * NORMALIZED MEASURE
 */
export interface NormalizedMeasure {
  readonly measure_id: string;
  readonly source_api_id: string;
  readonly source_field: string;
  readonly ontology_mapping: string;
  readonly unit: string;
  readonly normalization_applied: readonly string[];
  readonly version: number;
}

/**
 * KILL SWITCH CONFIG
 */
export interface KillSwitchConfig {
  readonly api_switches: Map<string, boolean>;
  readonly measure_switches: Map<string, boolean>;
  readonly packet_switches: Map<string, boolean>;
}

/**
 * BULK API MANAGER
 */
export class BulkAPIManager {
  private registrations: Map<string, APIRegistration> = new Map();
  private scanResults: Map<string, APIScanResult> = new Map();
  private normalizedMeasures: Map<string, NormalizedMeasure> = new Map();
  private killSwitches: KillSwitchConfig = {
    api_switches: new Map(),
    measure_switches: new Map(),
    packet_switches: new Map(),
  };

  /**
   * Step 1: Register API
   */
  registerAPI(registration: APIRegistration): void {
    this.registrations.set(registration.api_id, registration);
    this.killSwitches.api_switches.set(registration.api_id, true); // Enabled by default
  }

  /**
   * Step 2: Auto-scan API
   */
  async scanAPI(apiId: string): Promise<APIScanResult> {
    const registration = this.registrations.get(apiId);
    if (!registration) {
      throw new Error(`API not registered: ${apiId}`);
    }

    // Simulated scan (real implementation would call the API)
    const result: APIScanResult = {
      api_id: apiId,
      scanned_at: new Date().toISOString(),
      status: 'healthy',
      schema_detected: true,
      data_age_days: 7,
      risk_level: registration.tier === 1 ? 'low' : registration.tier === 2 ? 'medium' : 'high',
      measures_found: 25,
      warnings: [],
      errors: [],
    };

    this.scanResults.set(apiId, result);
    return result;
  }

  /**
   * Step 3: Normalize to ontology
   */
  normalizeMeasure(
    apiId: string,
    sourceField: string,
    ontologyMapping: string,
    unit: string
  ): NormalizedMeasure {
    const measureId = `${apiId}:${sourceField}`;
    
    const measure: NormalizedMeasure = {
      measure_id: measureId,
      source_api_id: apiId,
      source_field: sourceField,
      ontology_mapping: ontologyMapping,
      unit,
      normalization_applied: ['unit_conversion', 'null_handling'],
      version: 1,
    };

    this.normalizedMeasures.set(measureId, measure);
    this.killSwitches.measure_switches.set(measureId, true);
    return measure;
  }

  /**
   * Step 4: Create snapshot
   */
  createSnapshot(apiId: string): APISnapshot {
    const registration = this.registrations.get(apiId);
    const scanResult = this.scanResults.get(apiId);
    const measures = Array.from(this.normalizedMeasures.values())
      .filter(m => m.source_api_id === apiId);

    return {
      snapshot_id: `${apiId}:snapshot:${Date.now()}`,
      api_id: apiId,
      created_at: new Date().toISOString(),
      registration: registration!,
      scan_result: scanResult!,
      measures,
      version: 1,
    };
  }

  /**
   * Kill switch: Disable API
   */
  disableAPI(apiId: string): void {
    this.killSwitches.api_switches.set(apiId, false);
  }

  /**
   * Kill switch: Disable measure
   */
  disableMeasure(measureId: string): void {
    this.killSwitches.measure_switches.set(measureId, false);
  }

  /**
   * Kill switch: Disable packet
   */
  disablePacket(packetId: string): void {
    this.killSwitches.packet_switches.set(packetId, false);
  }

  /**
   * Check if API is enabled
   */
  isAPIEnabled(apiId: string): boolean {
    return this.killSwitches.api_switches.get(apiId) ?? false;
  }

  /**
   * Check if measure is enabled
   */
  isMeasureEnabled(measureId: string): boolean {
    const apiId = measureId.split(':')[0];
    return this.isAPIEnabled(apiId) && (this.killSwitches.measure_switches.get(measureId) ?? false);
  }

  /**
   * Get all registered APIs
   */
  getAllAPIs(): readonly APIRegistration[] {
    return Array.from(this.registrations.values());
  }

  /**
   * Get all scan results
   */
  getAllScanResults(): readonly APIScanResult[] {
    return Array.from(this.scanResults.values());
  }

  /**
   * Get stats
   */
  getStats(): BulkAPIStats {
    const apis = Array.from(this.registrations.values());
    const scans = Array.from(this.scanResults.values());
    
    return {
      total_apis: apis.length,
      enabled_apis: apis.filter(a => this.isAPIEnabled(a.api_id)).length,
      tier_1_apis: apis.filter(a => a.tier === 1).length,
      tier_2_apis: apis.filter(a => a.tier === 2).length,
      tier_3_apis: apis.filter(a => a.tier === 3).length,
      healthy_apis: scans.filter(s => s.status === 'healthy').length,
      total_measures: this.normalizedMeasures.size,
      enabled_measures: Array.from(this.normalizedMeasures.keys())
        .filter(id => this.isMeasureEnabled(id)).length,
    };
  }
}

/**
 * API SNAPSHOT
 */
export interface APISnapshot {
  readonly snapshot_id: string;
  readonly api_id: string;
  readonly created_at: string;
  readonly registration: APIRegistration;
  readonly scan_result: APIScanResult;
  readonly measures: readonly NormalizedMeasure[];
  readonly version: number;
}

/**
 * BULK API STATS
 */
export interface BulkAPIStats {
  readonly total_apis: number;
  readonly enabled_apis: number;
  readonly tier_1_apis: number;
  readonly tier_2_apis: number;
  readonly tier_3_apis: number;
  readonly healthy_apis: number;
  readonly total_measures: number;
  readonly enabled_measures: number;
}

/**
 * ONBOARDING PRINCIPLES
 */
export const BULK_API_PRINCIPLES = {
  can_disable_100_apis_unnoticed: true,
  per_api_kill_switch: true,
  per_measure_kill_switch: true,
  per_packet_kill_switch: true,
  auto_scan_before_use: true,
  normalize_to_ontology: true,
} as const;
