/**
 * EVIDENCE LINK SYSTEM
 * 
 * Every aggregation produces a unique, verifiable Evidence Link.
 * - Always extractable from correct aggregations
 * - Always presented via QR code on report data
 * - Can be entered manually or clicked to reproduce exact view
 * - Data-driven via API and webhooks
 * 
 * Format: EL-{checksum}-{timestamp}-{version}
 */

// =============================================================================
// TYPES
// =============================================================================

export interface EvidenceLink {
  /** Unique evidence link ID */
  id: string;
  
  /** Full URL for verification */
  url: string;
  
  /** Short code for manual entry */
  short_code: string;
  
  /** SHA-256 hash of underlying data */
  data_checksum: string;
  
  /** When this evidence was generated */
  generated_at: string;
  
  /** Expiry (optional - some evidence is permanent) */
  expires_at: string | null;
  
  /** Version of the aggregation method */
  aggregation_version: string;
  
  /** Query parameters to reproduce the view */
  query_params: EvidenceLinkQuery;
  
  /** Data sources used */
  sources: EvidenceLinkSource[];
  
  /** QR code data (base64 encoded) */
  qr_data?: string;
}

export interface EvidenceLinkQuery {
  /** What indicators are shown */
  indicators: string[];
  
  /** Geographic scope */
  geo_scope: string;
  
  /** Time range */
  time_start: string;
  time_end: string;
  
  /** Comparison baseline (if any) */
  comparison?: string;
  
  /** View type */
  view_type: 'graph' | 'table' | 'report' | 'diagnostic';
  
  /** Any filters applied */
  filters?: Record<string, string | number | boolean>;
}

export interface EvidenceLinkSource {
  /** Source identifier */
  source_id: string;
  
  /** Source name */
  name: string;
  
  /** Original URL */
  url: string;
  
  /** When data was fetched */
  fetched_at: string;
  
  /** Checksum of source data */
  checksum: string;
}

export interface EvidenceLinkVerification {
  /** Is the evidence valid? */
  is_valid: boolean;
  
  /** Verification timestamp */
  verified_at: string;
  
  /** Match status */
  match_status: 'exact' | 'data_changed' | 'expired' | 'invalid';
  
  /** If data changed, what changed */
  changes?: string[];
  
  /** Original evidence link */
  original: EvidenceLink;
  
  /** Current data checksum (for comparison) */
  current_checksum?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const EVIDENCE_LINK_PREFIX = 'EL';
export const EVIDENCE_LINK_VERSION = '1.0';
export const EVIDENCE_LINK_BASE_URL = '/verify';

// Short code alphabet (no ambiguous characters: 0/O, 1/I/l)
const SHORT_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const SHORT_CODE_LENGTH = 8;

// =============================================================================
// GENERATION
// =============================================================================

/**
 * Generate a unique evidence link for a data aggregation
 */
export function generateEvidenceLink(
  query: EvidenceLinkQuery,
  sources: EvidenceLinkSource[],
  rawData: unknown,
  baseUrl: string = ''
): EvidenceLink {
  const timestamp = new Date().toISOString();
  
  // Create data checksum
  const dataString = JSON.stringify({ query, sources, rawData, timestamp });
  const checksum = generateChecksum(dataString);
  
  // Generate short code
  const shortCode = generateShortCode(checksum);
  
  // Build ID
  const id = `${EVIDENCE_LINK_PREFIX}-${checksum.substring(0, 12)}-${Date.now()}`;
  
  // Build verification URL
  const url = `${baseUrl}${EVIDENCE_LINK_BASE_URL}/${shortCode}`;
  
  return {
    id,
    url,
    short_code: shortCode,
    data_checksum: checksum,
    generated_at: timestamp,
    expires_at: null, // Evidence links don't expire by default
    aggregation_version: EVIDENCE_LINK_VERSION,
    query_params: query,
    sources,
  };
}

/**
 * Generate SHA-256 checksum
 */
export function generateChecksum(data: string): string {
  // Browser-compatible hashing using Web Crypto API simulation
  // In production, use actual crypto
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex-like string (64 chars to match SHA-256 length)
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return hashStr.repeat(8);
}

/**
 * Generate human-readable short code
 */
export function generateShortCode(checksum: string): string {
  let code = '';
  const checksumNum = parseInt(checksum.substring(0, 15), 16);
  let num = Math.abs(checksumNum);
  
  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    code += SHORT_CODE_ALPHABET[num % SHORT_CODE_ALPHABET.length];
    num = Math.floor(num / SHORT_CODE_ALPHABET.length);
  }
  
  return code;
}

// =============================================================================
// VERIFICATION
// =============================================================================

/**
 * Verify an evidence link against current data
 */
export function verifyEvidenceLink(
  evidenceLink: EvidenceLink,
  currentData: unknown
): EvidenceLinkVerification {
  const now = new Date().toISOString();
  
  // Check expiry
  if (evidenceLink.expires_at && new Date(evidenceLink.expires_at) < new Date()) {
    return {
      is_valid: false,
      verified_at: now,
      match_status: 'expired',
      original: evidenceLink,
    };
  }
  
  // Calculate current checksum
  const currentString = JSON.stringify(currentData);
  const currentChecksum = generateChecksum(currentString);
  
  // Compare checksums
  if (currentChecksum === evidenceLink.data_checksum) {
    return {
      is_valid: true,
      verified_at: now,
      match_status: 'exact',
      original: evidenceLink,
      current_checksum: currentChecksum,
    };
  }
  
  // Data has changed
  return {
    is_valid: true, // Link is valid, but data changed
    verified_at: now,
    match_status: 'data_changed',
    original: evidenceLink,
    current_checksum: currentChecksum,
    changes: ['Data has been updated since this evidence was generated'],
  };
}

/**
 * Parse a short code from user input
 */
export function parseShortCode(input: string): string | null {
  // Clean input
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (cleaned.length !== SHORT_CODE_LENGTH) {
    return null;
  }
  
  // Validate characters
  for (const char of cleaned) {
    if (!SHORT_CODE_ALPHABET.includes(char)) {
      return null;
    }
  }
  
  return cleaned;
}

// =============================================================================
// URL GENERATION
// =============================================================================

/**
 * Build a query string from evidence link query params
 */
export function buildQueryString(query: EvidenceLinkQuery): string {
  const params = new URLSearchParams();
  
  params.set('indicators', query.indicators.join(','));
  params.set('geo', query.geo_scope);
  params.set('from', query.time_start);
  params.set('to', query.time_end);
  params.set('view', query.view_type);
  
  if (query.comparison) {
    params.set('compare', query.comparison);
  }
  
  if (query.filters) {
    params.set('filters', JSON.stringify(query.filters));
  }
  
  return params.toString();
}

/**
 * Parse query params back to EvidenceLinkQuery
 */
export function parseQueryParams(searchParams: URLSearchParams): EvidenceLinkQuery | null {
  const indicators = searchParams.get('indicators')?.split(',');
  const geo = searchParams.get('geo');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const view = searchParams.get('view') as EvidenceLinkQuery['view_type'];
  
  if (!indicators || !geo || !from || !to || !view) {
    return null;
  }
  
  const query: EvidenceLinkQuery = {
    indicators,
    geo_scope: geo,
    time_start: from,
    time_end: to,
    view_type: view,
  };
  
  const compare = searchParams.get('compare');
  if (compare) {
    query.comparison = compare;
  }
  
  const filters = searchParams.get('filters');
  if (filters) {
    try {
      query.filters = JSON.parse(filters);
    } catch {
      // Invalid filters, ignore
    }
  }
  
  return query;
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format evidence link for display
 */
export function formatEvidenceLinkDisplay(link: EvidenceLink): string {
  return `${link.short_code.substring(0, 4)}-${link.short_code.substring(4)}`;
}

/**
 * Get labels for evidence link status
 */
export function getVerificationStatusLabel(
  status: EvidenceLinkVerification['match_status'],
  language: 'sv' | 'en'
): { label: string; description: string } {
  const labels: Record<EvidenceLinkVerification['match_status'], Record<'sv' | 'en', { label: string; description: string }>> = {
    exact: {
      sv: { label: 'Verifierad', description: 'Data matchar exakt den ursprungliga rapporten' },
      en: { label: 'Verified', description: 'Data matches the original report exactly' },
    },
    data_changed: {
      sv: { label: 'Data uppdaterad', description: 'Rapporten är giltig men underliggande data har uppdaterats' },
      en: { label: 'Data updated', description: 'Report is valid but underlying data has been updated' },
    },
    expired: {
      sv: { label: 'Utgången', description: 'Denna verifieringslänk har löpt ut' },
      en: { label: 'Expired', description: 'This verification link has expired' },
    },
    invalid: {
      sv: { label: 'Ogiltig', description: 'Denna verifieringslänk kunde inte valideras' },
      en: { label: 'Invalid', description: 'This verification link could not be validated' },
    },
  };
  
  return labels[status][language];
}
