# 🔄 INGESTION ENGINE SPECIFICATION

## "MATA" — How Data Enters the System

**Version**: 1.0  
**Status**: Canonical  
**Classification**: Core Infrastructure

---

## FOUNDATIONAL PRINCIPLE

> **We do not import data. We extract indexed claims from sources.**

Every piece of information passes through the same pipeline. No shortcuts. No special cases. This is how control is maintained at global scale.

---

# PART I: THE FOUR INGESTION CHANNELS

## 1.1 Channel Taxonomy

```
┌────────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION CHANNELS                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CHANNEL A: OFFICIAL APIs                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━                                           │
│  Sources: National statistical offices, central banks,             │
│           international organizations, official registries          │
│  Trust: HIGH (0.9-1.0)                                              │
│  Frequency: LOW (monthly/quarterly/annual)                          │
│  Structure: HIGH (standardized formats)                             │
│  Examples: SCB, Eurostat, WHO, IMF, World Bank                      │
│                                                                     │
│  CHANNEL B: SEMI-OFFICIAL APIs                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━                                         │
│  Sources: Price comparison sites, market data providers,           │
│           industry indices, private data banks                      │
│  Trust: MEDIUM (0.6-0.8)                                            │
│  Frequency: HIGH (daily/hourly/real-time)                           │
│  Structure: MEDIUM (varying formats)                                │
│  Examples: Prisjakt, Bloomberg, industry associations               │
│                                                                     │
│  CHANNEL C: DOCUMENTS                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━                                            │
│  Sources: PDFs, legislation, court decisions, reports,             │
│           whitepapers, policy documents                             │
│  Trust: HIGH (for official) / MEDIUM (for research)                 │
│  Frequency: EVENT-DRIVEN                                            │
│  Structure: LOW (unstructured text, requires extraction)            │
│  Examples: SFS, EU directives, court rulings, ministry reports      │
│                                                                     │
│  CHANNEL D: AGGREGATED EXTERNAL                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                       │
│  Sources: Third-party indices, research compilations,              │
│           merged source databases                                   │
│  Trust: NEVER PRIMARY (input only, requires verification)           │
│  Frequency: VARIES                                                  │
│  Structure: VARIES                                                  │
│  Examples: OWID, academic datasets, NGO compilations                │
│                                                                     │
│  ⚠️  CHANNEL D IS NEVER TREATED AS TRUTH                            │
│      Always trace back to primary source                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 1.2 Channel Configuration

```typescript
interface IngestionChannel {
  id: ChannelID;
  type: 'official_api' | 'semi_official_api' | 'document' | 'aggregated';
  
  // Source identity
  source: {
    code: SourceCode;
    name: string;
    organization: string;
    country: ISO3166Alpha2 | 'international';
    authority_level: AuthorityLevel;
  };
  
  // Connection
  connection: {
    type: 'rest_api' | 'graphql' | 'soap' | 'file_fetch' | 'scrape' | 'manual';
    endpoint: URL | null;
    auth: AuthConfig | null;
    rate_limit: RateLimitConfig;
  };
  
  // Scheduling
  schedule: {
    frequency: Frequency;
    timezone: Timezone;
    cron: CronExpression | null;
    trigger: 'scheduled' | 'webhook' | 'manual' | 'event';
  };
  
  // Trust parameters
  trust: {
    base_confidence: number;          // 0.0 - 1.0
    confidence_decay: DecayFunction;  // How trust degrades over time
    requires_verification: boolean;
    verification_method: VerificationMethod | null;
  };
  
  // Processing
  processing: {
    parser: ParserType;
    claim_extractor: ExtractorConfig;
    normalizer: NormalizerConfig;
  };
  
  // Metadata
  metadata: {
    description: string;
    documentation_url: URL;
    contact: string;
    license: LicenseType;
    last_successful_fetch: ISO8601 | null;
    total_objects_ingested: number;
  };
}

type AuthorityLevel = 
  | 'sovereign'           // National government, supreme court
  | 'statutory'           // Statutory agencies, regulators
  | 'official'            // Official statistics, registries
  | 'quasi_official'      // Industry bodies, standards orgs
  | 'commercial'          // Commercial data providers
  | 'research'            // Academic, research institutions
  | 'aggregator';         // Third-party compilations
```

## 1.3 Source Registry

```typescript
// Example source configurations

const SOURCES: Record<string, IngestionChannel> = {
  // ═══════════════════════════════════════════════════════════════
  // CHANNEL A: OFFICIAL APIs
  // ═══════════════════════════════════════════════════════════════
  
  'scb': {
    id: 'scb',
    type: 'official_api',
    source: {
      code: 'SCB',
      name: 'Statistics Sweden',
      organization: 'Statistiska centralbyrån',
      country: 'SE',
      authority_level: 'official',
    },
    connection: {
      type: 'rest_api',
      endpoint: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
      auth: null,  // Open API
      rate_limit: { requests_per_minute: 30, concurrent: 5 },
    },
    schedule: {
      frequency: 'daily',
      timezone: 'Europe/Stockholm',
      cron: '0 6 * * *',  // 06:00 daily
      trigger: 'scheduled',
    },
    trust: {
      base_confidence: 1.0,
      confidence_decay: 'none',
      requires_verification: false,
      verification_method: null,
    },
    processing: {
      parser: 'json_stat',
      claim_extractor: 'statistical_value',
      normalizer: 'scb_to_uio',
    },
    metadata: {
      description: 'Swedish official statistics',
      documentation_url: 'https://www.scb.se/en/services/open-data-api/',
      contact: 'opendata@scb.se',
      license: 'CC0',
      last_successful_fetch: null,
      total_objects_ingested: 0,
    },
  },
  
  'eurostat': {
    id: 'eurostat',
    type: 'official_api',
    source: {
      code: 'EUROSTAT',
      name: 'Eurostat',
      organization: 'European Commission',
      country: 'international',
      authority_level: 'official',
    },
    connection: {
      type: 'rest_api',
      endpoint: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1',
      auth: null,
      rate_limit: { requests_per_minute: 60, concurrent: 10 },
    },
    schedule: {
      frequency: 'daily',
      timezone: 'Europe/Brussels',
      cron: '0 5 * * *',
      trigger: 'scheduled',
    },
    trust: {
      base_confidence: 0.95,  // Slightly lower due to aggregation
      confidence_decay: 'linear_30d',
      requires_verification: false,
      verification_method: null,
    },
    processing: {
      parser: 'sdmx',
      claim_extractor: 'statistical_value',
      normalizer: 'eurostat_to_uio',
    },
    metadata: {
      description: 'European Union statistics',
      documentation_url: 'https://ec.europa.eu/eurostat/web/main/data/web-services',
      contact: 'estat-user-support@ec.europa.eu',
      license: 'CC_BY_4.0',
      last_successful_fetch: null,
      total_objects_ingested: 0,
    },
  },
  
  'kolada': {
    id: 'kolada',
    type: 'official_api',
    source: {
      code: 'KOLADA',
      name: 'Kolada',
      organization: 'Rådet för främjande av kommunala analyser',
      country: 'SE',
      authority_level: 'official',
    },
    connection: {
      type: 'rest_api',
      endpoint: 'https://api.kolada.se/v2',
      auth: null,
      rate_limit: { requests_per_minute: 60, concurrent: 5 },
    },
    schedule: {
      frequency: 'daily',
      timezone: 'Europe/Stockholm',
      cron: '0 7 * * *',
      trigger: 'scheduled',
    },
    trust: {
      base_confidence: 0.95,
      confidence_decay: 'none',
      requires_verification: false,
      verification_method: null,
    },
    processing: {
      parser: 'json',
      claim_extractor: 'kolada_kpi',
      normalizer: 'kolada_to_uio',
    },
    metadata: {
      description: 'Swedish municipal and regional statistics',
      documentation_url: 'https://github.com/Hypergene/kolada',
      contact: 'info@kolada.se',
      license: 'CC0',
      last_successful_fetch: null,
      total_objects_ingested: 0,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════
  // CHANNEL B: SEMI-OFFICIAL APIs
  // ═══════════════════════════════════════════════════════════════
  
  'prisjakt': {
    id: 'prisjakt',
    type: 'semi_official_api',
    source: {
      code: 'PRISJAKT',
      name: 'Prisjakt',
      organization: 'Prisjakt Sverige AB',
      country: 'SE',
      authority_level: 'commercial',
    },
    connection: {
      type: 'rest_api',
      endpoint: 'https://api.prisjakt.nu/v1',  // Hypothetical
      auth: { type: 'api_key', key_env: 'PRISJAKT_API_KEY' },
      rate_limit: { requests_per_minute: 100, concurrent: 10 },
    },
    schedule: {
      frequency: 'hourly',
      timezone: 'Europe/Stockholm',
      cron: '0 * * * *',
      trigger: 'scheduled',
    },
    trust: {
      base_confidence: 0.75,
      confidence_decay: 'rapid_24h',  // Price data decays quickly
      requires_verification: true,
      verification_method: 'cross_source',
    },
    processing: {
      parser: 'json',
      claim_extractor: 'price_point',
      normalizer: 'price_to_uio',
    },
    metadata: {
      description: 'Consumer price comparison data',
      documentation_url: 'https://www.prisjakt.nu/info/api',
      contact: 'api@prisjakt.nu',
      license: 'commercial',
      last_successful_fetch: null,
      total_objects_ingested: 0,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════
  // CHANNEL C: DOCUMENTS
  // ═══════════════════════════════════════════════════════════════
  
  'swedish_law': {
    id: 'swedish_law',
    type: 'document',
    source: {
      code: 'SFS',
      name: 'Svensk författningssamling',
      organization: 'Swedish Government',
      country: 'SE',
      authority_level: 'sovereign',
    },
    connection: {
      type: 'file_fetch',
      endpoint: 'https://www.riksdagen.se/sv/dokument-och-lagar/',
      auth: null,
      rate_limit: { requests_per_minute: 10, concurrent: 2 },
    },
    schedule: {
      frequency: 'daily',
      timezone: 'Europe/Stockholm',
      cron: '0 8 * * *',
      trigger: 'scheduled',
    },
    trust: {
      base_confidence: 1.0,
      confidence_decay: 'none',
      requires_verification: false,
      verification_method: null,
    },
    processing: {
      parser: 'legal_document',
      claim_extractor: 'legal_provision',
      normalizer: 'legal_to_uio',
    },
    metadata: {
      description: 'Swedish legislation and regulations',
      documentation_url: 'https://www.lagrummet.se/',
      contact: 'registrator@regeringen.se',
      license: 'public_domain',
      last_successful_fetch: null,
      total_objects_ingested: 0,
    },
  },
};
```

---

# PART II: THE MANDATORY PIPELINE

## 2.1 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INGESTION PIPELINE                                   │
│                                                                              │
│  ┌─────┐   ┌───────────┐   ┌───────┐   ┌──────────────┐   ┌────────────┐   │
│  │FETCH│ → │FINGERPRINT│ → │ PARSE │ → │CLAIM EXTRACT │ → │JURISDICTION│   │
│  └─────┘   └───────────┘   └───────┘   └──────────────┘   └────────────┘   │
│     │           │             │              │                   │          │
│     ▼           ▼             ▼              ▼                   ▼          │
│  Raw Data   Hash+Meta    Structured     Atomic Claims      Geo-Tagged      │
│                                                                              │
│  ┌───────────┐   ┌────────────┐   ┌──────────┐   ┌───────────┐   ┌──────┐  │
│  │NORMALIZE  │ → │CONFIDENCE  │ → │RELATIONS │ → │ VERSION   │ → │PUBLISH│  │
│  └───────────┘   └────────────┘   └──────────┘   └───────────┘   └──────┘  │
│       │               │               │               │              │      │
│       ▼               ▼               ▼               ▼              ▼      │
│    UIO Format    Trust Score     Graph Links     Immutable       Indexed   │
│                                                                              │
│  ═══════════════════════════════════════════════════════════════════════   │
│  ⚠️  EVERY STEP IS MANDATORY. NO SHORTCUTS. NO SPECIAL CASES.              │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Pipeline Stages

### Stage 1: FETCH

```typescript
interface FetchStage {
  input: IngestionChannel;
  output: RawFetchResult;
}

interface RawFetchResult {
  // Identity
  fetch_id: UUID;
  channel_id: ChannelID;
  
  // Timing
  initiated_at: ISO8601;
  completed_at: ISO8601;
  duration_ms: number;
  
  // Raw content
  content: {
    type: 'json' | 'xml' | 'csv' | 'pdf' | 'html' | 'binary';
    encoding: string;
    size_bytes: number;
    data: Buffer | string;
  };
  
  // HTTP metadata (if applicable)
  http: {
    status_code: number;
    headers: Record<string, string>;
    etag: string | null;
    last_modified: ISO8601 | null;
  } | null;
  
  // Status
  status: 'success' | 'partial' | 'failed';
  error: FetchError | null;
  retry_count: number;
}

// Fetch implementation
async function executeFetch(channel: IngestionChannel): Promise<RawFetchResult> {
  const fetch_id = generateUUID();
  const initiated_at = now();
  
  try {
    // Rate limiting
    await rateLimiter.acquire(channel.id);
    
    // Execute based on connection type
    const response = await executeConnection(channel.connection);
    
    return {
      fetch_id,
      channel_id: channel.id,
      initiated_at,
      completed_at: now(),
      duration_ms: elapsed(initiated_at),
      content: {
        type: detectContentType(response),
        encoding: detectEncoding(response),
        size_bytes: response.data.length,
        data: response.data,
      },
      http: response.http,
      status: 'success',
      error: null,
      retry_count: 0,
    };
  } catch (error) {
    return handleFetchError(fetch_id, channel, error);
  }
}
```

### Stage 2: FINGERPRINT

```typescript
interface FingerprintStage {
  input: RawFetchResult;
  output: FingerprintedContent;
}

interface FingerprintedContent extends RawFetchResult {
  fingerprint: {
    // Content hash
    content_hash: SHA256;
    
    // Deduplication
    is_duplicate: boolean;
    duplicate_of: UUID | null;
    
    // Change detection
    previous_hash: SHA256 | null;
    has_changed: boolean;
    change_type: 'new' | 'modified' | 'unchanged';
    
    // Provenance
    source_fingerprint: {
      channel_id: ChannelID;
      source_code: SourceCode;
      fetch_timestamp: ISO8601;
      source_version: string | null;
    };
  };
}

function fingerprint(raw: RawFetchResult): FingerprintedContent {
  const content_hash = computeSHA256(raw.content.data);
  
  // Check for duplicates
  const existingHash = await hashStore.lookup(content_hash);
  const previousFetch = await fetchStore.getLatest(raw.channel_id);
  
  return {
    ...raw,
    fingerprint: {
      content_hash,
      is_duplicate: existingHash !== null,
      duplicate_of: existingHash?.fetch_id ?? null,
      previous_hash: previousFetch?.fingerprint.content_hash ?? null,
      has_changed: previousFetch ? 
        content_hash !== previousFetch.fingerprint.content_hash : 
        true,
      change_type: determineChangeType(content_hash, previousFetch),
      source_fingerprint: {
        channel_id: raw.channel_id,
        source_code: getSourceCode(raw.channel_id),
        fetch_timestamp: raw.completed_at,
        source_version: extractSourceVersion(raw),
      },
    },
  };
}
```

### Stage 3: PARSE

```typescript
interface ParseStage {
  input: FingerprintedContent;
  output: ParsedContent;
}

interface ParsedContent {
  fetch_id: UUID;
  fingerprint: Fingerprint;
  
  // Parsed structure
  parsed: {
    format: ParsedFormat;
    records: ParsedRecord[];
    metadata: ParsedMetadata;
  };
  
  // Parse quality
  quality: {
    total_records: number;
    successfully_parsed: number;
    parse_errors: ParseError[];
    warnings: ParseWarning[];
  };
}

interface ParsedRecord {
  record_id: string;
  record_type: string;
  fields: Record<string, ParsedField>;
  raw_text: string | null;  // For documents
  position: RecordPosition;  // Location in source
}

// Parser registry
const PARSERS: Record<ParserType, Parser> = {
  'json': new JSONParser(),
  'json_stat': new JSONStatParser(),
  'sdmx': new SDMXParser(),
  'csv': new CSVParser(),
  'xml': new XMLParser(),
  'pdf': new PDFParser(),
  'html': new HTMLParser(),
  'legal_document': new LegalDocumentParser(),
};

async function parse(content: FingerprintedContent): Promise<ParsedContent> {
  const channel = await getChannel(content.channel_id);
  const parser = PARSERS[channel.processing.parser];
  
  if (!parser) {
    throw new Error(`Unknown parser: ${channel.processing.parser}`);
  }
  
  const result = await parser.parse(content.content.data, {
    encoding: content.content.encoding,
    source: channel.source,
  });
  
  return {
    fetch_id: content.fetch_id,
    fingerprint: content.fingerprint,
    parsed: result,
    quality: computeParseQuality(result),
  };
}
```

### Stage 4: CLAIM EXTRACTION (The Key Stage)

```typescript
/**
 * CLAIM EXTRACTION
 * 
 * This is the most critical stage. We don't import documents.
 * We extract VERIFIABLE CLAIMS from documents.
 * 
 * Each claim becomes a potential index object.
 */

interface ClaimExtractionStage {
  input: ParsedContent;
  output: ExtractedClaims;
}

interface ExtractedClaims {
  fetch_id: UUID;
  source: SourceFingerprint;
  
  claims: ExtractedClaim[];
  
  extraction_metadata: {
    extractor_version: string;
    extraction_timestamp: ISO8601;
    total_claims: number;
    claims_by_type: Record<ClaimType, number>;
  };
}

interface ExtractedClaim {
  // Temporary ID (before UIO assignment)
  extraction_id: UUID;
  
  // The claim itself
  claim: {
    type: ClaimType;
    statement: string;           // Natural language
    value: ClaimValue;           // Structured value
    unit: UnitCode | null;
    precision: number;
  };
  
  // Temporal scope
  temporal: {
    observation_date: ISO8601;
    valid_from: ISO8601;
    valid_to: ISO8601 | null;
    is_point_in_time: boolean;
    is_period: boolean;
    period_type: PeriodType | null;
  };
  
  // Source reference
  source_reference: {
    record_id: string;
    field_path: string;
    page_number: number | null;   // For documents
    section: string | null;
    quote: string | null;         // Original text
  };
  
  // Extraction confidence
  extraction_confidence: {
    score: number;                // 0.0 - 1.0
    method: 'direct' | 'inferred' | 'parsed' | 'nlp';
    ambiguity_flags: string[];
  };
}

type ClaimType =
  | 'statistical_value'      // A measured number
  | 'price_point'            // A price observation
  | 'legal_provision'        // A law or regulation
  | 'policy_statement'       // A policy declaration
  | 'event'                  // Something that happened
  | 'status'                 // A current state
  | 'classification'         // A categorization
  | 'relationship'           // A declared connection
  | 'definition'             // A term definition
  | 'threshold'              // A limit or boundary
  | 'target'                 // A goal or objective
  | 'forecast';              // A prediction

// Example: PDF claim extraction
const EXAMPLE_PDF_EXTRACTION = {
  // WRONG: Store the whole document
  wrong: {
    type: 'document',
    content: 'Full PDF text here...',
  },
  
  // RIGHT: Extract individual claims
  right: [
    {
      extraction_id: 'uuid-1',
      claim: {
        type: 'statistical_value',
        statement: 'Unemployment rate was 7.4% in March 2024',
        value: { type: 'numeric', value: 7.4 },
        unit: 'percent',
        precision: 1,
      },
      temporal: {
        observation_date: '2024-03-31',
        valid_from: '2024-03-01',
        valid_to: '2024-03-31',
        is_point_in_time: false,
        is_period: true,
        period_type: 'month',
      },
    },
    {
      extraction_id: 'uuid-2',
      claim: {
        type: 'event',
        statement: 'Policy X took effect on January 1, 2024',
        value: { type: 'boolean', value: true },
        unit: null,
        precision: 0,
      },
      temporal: {
        observation_date: '2024-01-01',
        valid_from: '2024-01-01',
        valid_to: null,
        is_point_in_time: true,
        is_period: false,
        period_type: null,
      },
    },
    {
      extraction_id: 'uuid-3',
      claim: {
        type: 'relationship',
        statement: 'This regulation supersedes previous decision SFS 2020:123',
        value: { type: 'text', value: 'SFS 2020:123' },
        unit: null,
        precision: 0,
      },
      temporal: {
        observation_date: '2024-01-01',
        valid_from: '2024-01-01',
        valid_to: null,
        is_point_in_time: true,
        is_period: false,
        period_type: null,
      },
    },
  ],
};
```

### Stage 5: JURISDICTION IDENTIFICATION

```typescript
interface JurisdictionStage {
  input: ExtractedClaims;
  output: JurisdictionTaggedClaims;
}

interface JurisdictionTaggedClaims extends ExtractedClaims {
  claims: JurisdictionTaggedClaim[];
}

interface JurisdictionTaggedClaim extends ExtractedClaim {
  jurisdiction: {
    // Detected jurisdiction
    detected: {
      scope: JurisdictionScope;
      country: ISO3166Alpha2 | null;
      region: string | null;
      municipality: string | null;
      custom_area: GeoJSON | null;
    };
    
    // Detection metadata
    detection: {
      method: 'explicit' | 'inferred' | 'inherited' | 'default';
      confidence: number;
      signals: JurisdictionSignal[];
    };
    
    // Applicability
    applicability: {
      applies_to: string[];      // Who this affects
      excludes: string[];        // Explicit exclusions
      cross_border: boolean;     // Affects multiple jurisdictions
    };
  };
}

interface JurisdictionSignal {
  type: 'country_code' | 'region_code' | 'municipality_name' | 
        'legal_reference' | 'language' | 'currency' | 'source_origin';
  value: string;
  weight: number;
}

function detectJurisdiction(claim: ExtractedClaim, source: SourceFingerprint): JurisdictionDetection {
  const signals: JurisdictionSignal[] = [];
  
  // 1. Check explicit codes in data
  const explicitCodes = extractExplicitCodes(claim);
  signals.push(...explicitCodes);
  
  // 2. Check source default jurisdiction
  const sourceDefault = getSourceDefaultJurisdiction(source.source_code);
  signals.push({
    type: 'source_origin',
    value: sourceDefault.country,
    weight: 0.3,
  });
  
  // 3. Check legal references
  const legalRefs = extractLegalReferences(claim.claim.statement);
  signals.push(...legalRefs);
  
  // 4. Check language indicators
  const langSignals = detectLanguageSignals(claim.claim.statement);
  signals.push(...langSignals);
  
  // Resolve jurisdiction from signals
  return resolveJurisdiction(signals);
}
```

### Stage 6: NORMALIZATION TO UIO

```typescript
interface NormalizationStage {
  input: JurisdictionTaggedClaims;
  output: NormalizedUIOBatch;
}

interface NormalizedUIOBatch {
  fetch_id: UUID;
  source: SourceFingerprint;
  
  objects: UniversalIndexObject[];
  
  normalization_metadata: {
    normalizer_version: string;
    timestamp: ISO8601;
    input_claims: number;
    output_objects: number;
    merged_claims: number;       // Claims combined into single object
    split_claims: number;        // Claims split into multiple objects
    rejected_claims: number;     // Claims that couldn't be normalized
    rejection_reasons: RejectionReason[];
  };
}

function normalizeToUIO(claim: JurisdictionTaggedClaim, source: SourceFingerprint): UniversalIndexObject {
  // Generate deterministic ID from content
  const content_hash = computeContentHash({
    claim: claim.claim,
    jurisdiction: claim.jurisdiction.detected,
    temporal: claim.temporal,
    source: source.source_code,
  });
  
  return {
    // Identity
    id: content_hash,
    slug: generateSlug(claim),
    type: mapClaimTypeToEntityType(claim.claim.type),
    
    // Claim
    claim: {
      statement: claim.claim.statement,
      value: claim.claim.value,
      unit: claim.claim.unit,
      precision: claim.claim.precision,
    },
    
    // Source
    source: {
      authority: {
        code: source.source_code,
        name: getSourceName(source.source_code),
        type: getSourceAuthorityLevel(source.source_code),
      },
      origin: getSourceOriginType(source.source_code),
      source_id: claim.source_reference.record_id,
      access_url: getSourceAccessURL(source),
      access_date: source.fetch_timestamp,
      license: getSourceLicense(source.source_code),
    },
    
    // Jurisdiction
    jurisdiction: {
      scope: claim.jurisdiction.detected.scope,
      country: claim.jurisdiction.detected.country,
      region: claim.jurisdiction.detected.region,
      municipality: claim.jurisdiction.detected.municipality,
      custom_area: claim.jurisdiction.detected.custom_area,
    },
    
    // Time
    time: {
      observed_at: claim.temporal.observation_date,
      valid_from: claim.temporal.valid_from,
      valid_to: claim.temporal.valid_to,
      observation_lag: computeObservationLag(claim.temporal, source),
      update_frequency: getSourceUpdateFrequency(source.source_code),
    },
    
    // Confidence (computed in next stage)
    confidence: {
      score: 0,  // Placeholder
      method: 'pending',
      uncertainty: null,
      flags: [],
    },
    
    // Relations (computed in later stage)
    relations: [],
    
    // Immutability
    immutability: {
      version: { major: 1, minor: 0, patch: 0 },
      previous_version: null,
      created_at: now(),
      checksum: content_hash,
      merkle_proof: null,
    },
    
    // Metadata
    metadata: {
      category: inferCategory(claim),
      subcategory: inferSubcategory(claim),
      tags: extractTags(claim),
      languages: detectLanguages(claim.claim.statement),
      methodology_id: getMethodologyId(source.source_code, claim.claim.type),
    },
  };
}
```

### Stage 7: CONFIDENCE SCORING

```typescript
interface ConfidenceStage {
  input: NormalizedUIOBatch;
  output: ConfidenceScoredBatch;
}

/**
 * CONFIDENCE SCORING
 * 
 * Confidence is NOT subjective. It's computed from objective factors.
 * 
 * Scale:
 * 1.0  = Official decision, law, verified statistic
 * 0.8  = Primary source but requires interpretation
 * 0.6  = Aggregated from multiple sources
 * 0.4  = External compilation, secondary source
 * 0.2  = Estimated, predicted, modeled
 * 0.0  = Unknown source, unverifiable
 */

interface ConfidenceFactors {
  // Source authority (40% weight)
  source_authority: {
    authority_level: number;     // 0.0 - 1.0
    historical_accuracy: number; // Track record
    methodology_transparency: number;
  };
  
  // Data quality (30% weight)
  data_quality: {
    completeness: number;
    consistency: number;
    timeliness: number;
    precision: number;
  };
  
  // Verification (20% weight)
  verification: {
    cross_source_verified: boolean;
    methodology_documented: boolean;
    reproducible: boolean;
  };
  
  // Stability (10% weight)
  stability: {
    revision_frequency: number;  // Lower is better
    historical_volatility: number;
  };
}

function computeConfidence(uio: UniversalIndexObject): ConfidenceScore {
  const factors = gatherConfidenceFactors(uio);
  
  // Base confidence from source authority
  let score = factors.source_authority.authority_level * 0.4;
  
  // Add data quality
  score += averageOf(factors.data_quality) * 0.3;
  
  // Add verification bonus
  if (factors.verification.cross_source_verified) score += 0.1;
  if (factors.verification.methodology_documented) score += 0.05;
  if (factors.verification.reproducible) score += 0.05;
  
  // Stability adjustment
  score *= (1 - factors.stability.revision_frequency * 0.1);
  
  // Determine method label
  const method = determineConfidenceMethod(score, factors);
  
  // Compute uncertainty band
  const uncertainty = computeUncertaintyBand(uio, factors);
  
  // Add quality flags
  const flags = computeQualityFlags(uio, factors);
  
  return {
    score: Math.min(1.0, Math.max(0.0, score)),
    method,
    uncertainty,
    flags,
  };
}

type ConfidenceMethod = 
  | 'official'      // score >= 0.9
  | 'verified'      // score >= 0.7
  | 'aggregated'    // score >= 0.5
  | 'estimated'     // score >= 0.3
  | 'uncertain';    // score < 0.3

const CONFIDENCE_EXAMPLES = {
  // Official government statistic, direct from NSO API
  'scb_gdp': {
    score: 1.0,
    method: 'official',
    factors: {
      source_authority: 1.0,  // Official NSO
      methodology: 1.0,       // Fully documented
      verification: 1.0,      // Internationally verified
    },
  },
  
  // Academic research compilation
  'research_compilation': {
    score: 0.6,
    method: 'aggregated',
    factors: {
      source_authority: 0.7,  // Academic
      methodology: 0.8,
      verification: 0.5,      // Peer reviewed but not official
    },
  },
  
  // Third-party price aggregator
  'price_aggregator': {
    score: 0.4,
    method: 'estimated',
    factors: {
      source_authority: 0.5,
      methodology: 0.4,
      verification: 0.3,
    },
  },
};
```

### Stage 8: RELATION DETECTION

```typescript
interface RelationStage {
  input: ConfidenceScoredBatch;
  output: RelationEnrichedBatch;
}

/**
 * RELATION DETECTION
 * 
 * System suggests relations. Never forces them.
 * Relations are what make the index PREDICTIVE.
 */

interface RelationDetector {
  detect(uio: UniversalIndexObject, existingGraph: GraphContext): DetectedRelation[];
}

interface DetectedRelation {
  type: RelationType;
  target_id: GlobalHash | null;      // null if target not yet indexed
  target_reference: string;          // Human reference if target unknown
  
  detection: {
    method: 'explicit' | 'inferred' | 'computed' | 'nlp';
    confidence: number;
    evidence: string[];
  };
  
  status: 'confirmed' | 'suggested' | 'rejected';
}

const RELATION_DETECTORS: RelationDetector[] = [
  // Supersession detector (finds "replaces X" patterns)
  new SupersessionDetector(),
  
  // Dependency detector (finds "based on X" patterns)
  new DependencyDetector(),
  
  // Temporal detector (finds sequences)
  new TemporalSequenceDetector(),
  
  // Correlation detector (statistical analysis)
  new CorrelationDetector(),
  
  // Legal reference detector (finds law citations)
  new LegalReferenceDetector(),
  
  // Semantic similarity detector (NLP-based)
  new SemanticSimilarityDetector(),
];

function detectRelations(uio: UniversalIndexObject, graph: GraphContext): DetectedRelation[] {
  const allRelations: DetectedRelation[] = [];
  
  for (const detector of RELATION_DETECTORS) {
    const detected = detector.detect(uio, graph);
    allRelations.push(...detected);
  }
  
  // Deduplicate and rank
  const ranked = rankRelations(allRelations);
  
  // Filter by confidence threshold
  const filtered = ranked.filter(r => r.detection.confidence >= 0.5);
  
  return filtered;
}

// Example relation detection from legal document
const LEGAL_RELATION_EXAMPLE = {
  input_claim: 'This regulation (SFS 2024:100) supersedes SFS 2020:50',
  
  detected_relations: [
    {
      type: 'supersedes',
      target_reference: 'SFS 2020:50',
      detection: {
        method: 'explicit',
        confidence: 1.0,
        evidence: ['Text contains "supersedes" + legal reference'],
      },
      status: 'confirmed',
    },
    {
      type: 'follows',
      target_reference: 'SFS 2020:50',
      detection: {
        method: 'inferred',
        confidence: 0.9,
        evidence: ['SFS 2024 > SFS 2020 implies temporal sequence'],
      },
      status: 'suggested',
    },
  ],
};
```

### Stage 9: VERSIONING

```typescript
interface VersioningStage {
  input: RelationEnrichedBatch;
  output: VersionedBatch;
}

/**
 * VERSIONING
 * 
 * Once published, data is NEVER modified.
 * Only new versions are created.
 * 
 * This provides:
 * - Total history
 * - Legal traceability
 * - Audit security
 * - Extreme trust
 */

interface VersionedUIO extends UniversalIndexObject {
  versioning: {
    // Is this a new object or update?
    is_new: boolean;
    
    // Previous version if update
    previous: {
      id: GlobalHash;
      version: SemanticVersion;
      created_at: ISO8601;
    } | null;
    
    // Change details
    change: {
      type: ChangeType;
      fields_changed: string[];
      change_summary: string;
      supersession_reason: SupersessionReason | null;
    } | null;
    
    // Chain integrity
    chain: {
      first_version_id: GlobalHash;
      chain_length: number;
      merkle_root: SHA256;
    };
  };
}

type ChangeType = 
  | 'new_object'           // First version
  | 'value_update'         // Value changed
  | 'correction'           // Error fixed
  | 'methodology_change'   // Same data, new calculation
  | 'source_revision'      // Source updated their data
  | 'enrichment';          // Added metadata/relations

async function applyVersioning(uio: UniversalIndexObject): Promise<VersionedUIO> {
  // Check if this is an update to existing object
  const existing = await findExistingObject(uio);
  
  if (!existing) {
    // New object
    return {
      ...uio,
      versioning: {
        is_new: true,
        previous: null,
        change: {
          type: 'new_object',
          fields_changed: [],
          change_summary: 'Initial version',
          supersession_reason: null,
        },
        chain: {
          first_version_id: uio.id,
          chain_length: 1,
          merkle_root: computeMerkleRoot([uio.id]),
        },
      },
      immutability: {
        ...uio.immutability,
        version: { major: 1, minor: 0, patch: 0 },
        previous_version: null,
      },
    };
  }
  
  // Update to existing object
  const changes = detectChanges(existing, uio);
  const newVersion = incrementVersion(existing.immutability.version, changes.type);
  
  // Mark existing as superseded
  await markSuperseded(existing.id, uio.id, changes.type);
  
  return {
    ...uio,
    versioning: {
      is_new: false,
      previous: {
        id: existing.id,
        version: existing.immutability.version,
        created_at: existing.immutability.created_at,
      },
      change: {
        type: changes.type,
        fields_changed: changes.fields,
        change_summary: changes.summary,
        supersession_reason: changes.reason,
      },
      chain: {
        first_version_id: existing.versioning.chain.first_version_id,
        chain_length: existing.versioning.chain.chain_length + 1,
        merkle_root: computeMerkleRoot([
          existing.versioning.chain.merkle_root,
          uio.id,
        ]),
      },
    },
    immutability: {
      ...uio.immutability,
      version: newVersion,
      previous_version: existing.id,
    },
    relations: [
      ...uio.relations,
      {
        type: 'supersedes',
        target_id: existing.id,
        strength: null,
        confidence: 1.0,
        lag: null,
        valid_from: now(),
        valid_to: null,
        source: 'computed',
        methodology: 'automatic_versioning',
      },
    ],
  };
}
```

### Stage 10: PUBLISH (Index Publication)

```typescript
interface PublishStage {
  input: VersionedBatch;
  output: PublishedBatch;
}

interface PublishedBatch {
  fetch_id: UUID;
  published_at: ISO8601;
  
  objects: PublishedUIO[];
  
  publication_metadata: {
    total_published: number;
    new_objects: number;
    updated_objects: number;
    
    indices_updated: string[];
    relations_created: number;
    
    merkle_root: SHA256;
    publication_proof: PublicationProof;
  };
}

interface PublishedUIO extends VersionedUIO {
  publication: {
    published_at: ISO8601;
    publication_id: UUID;
    
    // URLs
    canonical_url: URL;
    api_url: URL;
    
    // Search/index registration
    indices: string[];
    searchable: boolean;
    
    // Verification
    merkle_proof: MerkleProof;
    publication_signature: Ed25519Signature | null;
  };
}

async function publish(batch: VersionedBatch): Promise<PublishedBatch> {
  const publication_id = generateUUID();
  const published_at = now();
  
  // 1. Write to immutable store
  await immutableStore.writeBatch(batch.objects);
  
  // 2. Update search indices
  await searchIndex.indexBatch(batch.objects);
  
  // 3. Update graph database
  await graphDB.insertNodes(batch.objects);
  await graphDB.insertEdges(extractAllRelations(batch.objects));
  
  // 4. Update materialized views
  await updateMaterializedViews(batch.objects);
  
  // 5. Compute Merkle proofs
  const merkle = await computeBatchMerkle(batch.objects);
  
  // 6. Write to public audit log
  await auditLog.write({
    type: 'batch_published',
    publication_id,
    published_at,
    object_count: batch.objects.length,
    merkle_root: merkle.root,
  });
  
  // 7. Emit events for subscribers
  await eventBus.emit('objects.published', {
    publication_id,
    object_ids: batch.objects.map(o => o.id),
  });
  
  return {
    fetch_id: batch.fetch_id,
    published_at,
    objects: batch.objects.map((obj, i) => ({
      ...obj,
      publication: {
        published_at,
        publication_id,
        canonical_url: generateCanonicalURL(obj),
        api_url: generateAPIURL(obj),
        indices: determineIndices(obj),
        searchable: true,
        merkle_proof: merkle.proofs[i],
        publication_signature: signPublication(obj, merkle.proofs[i]),
      },
    })),
    publication_metadata: {
      total_published: batch.objects.length,
      new_objects: batch.objects.filter(o => o.versioning.is_new).length,
      updated_objects: batch.objects.filter(o => !o.versioning.is_new).length,
      indices_updated: getUniqueIndices(batch.objects),
      relations_created: countNewRelations(batch.objects),
      merkle_root: merkle.root,
      publication_proof: merkle.proof,
    },
  };
}
```

---

# PART III: CLAIM EXTRACTION DEEP DIVE

## 3.1 Extraction Principles

```
┌────────────────────────────────────────────────────────────────────┐
│                    CLAIM EXTRACTION RULES                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. EXTRACT CLAIMS, NOT DOCUMENTS                                   │
│     A document may contain 100 claims                               │
│     Each claim becomes a separate index object                      │
│                                                                     │
│  2. ONE CLAIM = ONE VERIFIABLE ASSERTION                            │
│     Must be independently true or false                             │
│     Must have clear temporal bounds                                 │
│     Must have identifiable jurisdiction                             │
│                                                                     │
│  3. PRESERVE CONTEXT, DON'T INTERPRET                               │
│     Extract what the source says                                    │
│     Never add meaning                                               │
│     Link to context via relations                                   │
│                                                                     │
│  4. EXPLICIT > INFERRED                                             │
│     Always prefer direct extraction                                 │
│     Flag anything inferred                                          │
│     Lower confidence for interpretations                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 3.2 Extractor Types

```typescript
// Statistical Value Extractor (for APIs like SCB, Eurostat)
class StatisticalValueExtractor implements ClaimExtractor {
  extract(record: ParsedRecord): ExtractedClaim[] {
    const claims: ExtractedClaim[] = [];
    
    // Each data point is a claim
    for (const dataPoint of record.fields.values) {
      claims.push({
        extraction_id: generateUUID(),
        claim: {
          type: 'statistical_value',
          statement: this.generateStatement(record, dataPoint),
          value: {
            type: 'numeric',
            value: dataPoint.value,
            lower_bound: dataPoint.confidence_interval?.lower,
            upper_bound: dataPoint.confidence_interval?.upper,
          },
          unit: dataPoint.unit,
          precision: this.detectPrecision(dataPoint.value),
        },
        temporal: {
          observation_date: dataPoint.observation_date,
          valid_from: this.computeValidFrom(dataPoint),
          valid_to: this.computeValidTo(dataPoint),
          is_point_in_time: dataPoint.period_type === 'point',
          is_period: dataPoint.period_type !== 'point',
          period_type: dataPoint.period_type,
        },
        source_reference: {
          record_id: record.record_id,
          field_path: dataPoint.field_path,
          page_number: null,
          section: null,
          quote: null,
        },
        extraction_confidence: {
          score: 1.0,  // Direct extraction from structured data
          method: 'direct',
          ambiguity_flags: [],
        },
      });
    }
    
    return claims;
  }
  
  private generateStatement(record: ParsedRecord, dataPoint: DataPoint): string {
    return `${record.indicator_name} was ${dataPoint.value} ${dataPoint.unit} ` +
           `in ${record.jurisdiction} for ${dataPoint.period}`;
  }
}

// Legal Document Extractor (for legislation, court decisions)
class LegalDocumentExtractor implements ClaimExtractor {
  extract(record: ParsedRecord): ExtractedClaim[] {
    const claims: ExtractedClaim[] = [];
    
    // Extract document metadata as claims
    claims.push(this.extractDocumentIdentity(record));
    
    // Extract effective date
    claims.push(this.extractEffectiveDate(record));
    
    // Extract supersession if any
    const supersession = this.detectSupersession(record);
    if (supersession) claims.push(supersession);
    
    // Extract individual provisions
    const provisions = this.extractProvisions(record);
    claims.push(...provisions);
    
    // Extract definitions
    const definitions = this.extractDefinitions(record);
    claims.push(...definitions);
    
    // Extract thresholds and limits
    const thresholds = this.extractThresholds(record);
    claims.push(...thresholds);
    
    return claims;
  }
  
  private extractProvisions(record: ParsedRecord): ExtractedClaim[] {
    const provisions: ExtractedClaim[] = [];
    
    // Parse document structure
    const sections = this.parseLegalStructure(record.raw_text);
    
    for (const section of sections) {
      // Each paragraph/section that makes a normative claim
      if (this.isNormativeClaim(section)) {
        provisions.push({
          extraction_id: generateUUID(),
          claim: {
            type: 'legal_provision',
            statement: section.text,
            value: {
              type: 'text',
              value: section.provision_type,  // 'shall', 'may', 'must not'
              language: 'sv',
              normalized_form: section.normalized,
            },
            unit: null,
            precision: 0,
          },
          temporal: {
            observation_date: record.publication_date,
            valid_from: record.effective_date,
            valid_to: record.expiry_date,
            is_point_in_time: false,
            is_period: true,
            period_type: 'open_ended',
          },
          source_reference: {
            record_id: record.record_id,
            field_path: section.path,  // e.g., "chapter.3.section.5"
            page_number: section.page,
            section: section.header,
            quote: section.text.substring(0, 200),
          },
          extraction_confidence: {
            score: 0.95,
            method: 'parsed',
            ambiguity_flags: section.ambiguities,
          },
        });
      }
    }
    
    return provisions;
  }
}

// Price Point Extractor (for market data)
class PricePointExtractor implements ClaimExtractor {
  extract(record: ParsedRecord): ExtractedClaim[] {
    return [{
      extraction_id: generateUUID(),
      claim: {
        type: 'price_point',
        statement: `${record.product_name} was priced at ${record.price} ${record.currency} ` +
                   `at ${record.retailer} on ${record.observation_date}`,
        value: {
          type: 'numeric',
          value: record.price,
          lower_bound: null,
          upper_bound: null,
        },
        unit: record.currency,
        precision: 2,
      },
      temporal: {
        observation_date: record.observation_date,
        valid_from: record.observation_date,
        valid_to: record.observation_date,  // Prices are point-in-time
        is_point_in_time: true,
        is_period: false,
        period_type: null,
      },
      source_reference: {
        record_id: record.record_id,
        field_path: 'price',
        page_number: null,
        section: null,
        quote: null,
      },
      extraction_confidence: {
        score: 0.8,  // Commercial source
        method: 'direct',
        ambiguity_flags: this.detectPriceAmbiguities(record),
      },
    }];
  }
}
```

---

# PART IV: CONFIDENCE COMPUTATION DETAILS

## 4.1 Confidence Matrix

```typescript
const CONFIDENCE_MATRIX = {
  // Source authority weights
  source_authority: {
    sovereign: 1.0,        // Government, supreme court
    statutory: 0.95,       // Statutory agencies
    official: 0.90,        // Official statistics
    quasi_official: 0.75,  // Industry standards bodies
    commercial: 0.60,      // Commercial providers
    research: 0.70,        // Academic research
    aggregator: 0.40,      // Third-party compilations
  },
  
  // Method weights
  extraction_method: {
    direct: 1.0,           // Direct from structured API
    parsed: 0.90,          // Parsed from semi-structured
    nlp: 0.70,             // NLP extraction
    inferred: 0.50,        // Inferred from context
  },
  
  // Verification bonuses
  verification: {
    cross_source: 0.10,    // Verified across multiple sources
    methodology_doc: 0.05, // Methodology is documented
    reproducible: 0.05,    // Can be reproduced
    audited: 0.10,         // Has been audited
  },
  
  // Decay factors
  decay: {
    price_data: 0.1,       // 10% per day
    market_data: 0.05,     // 5% per day
    statistical: 0.01,     // 1% per month
    legal: 0.0,            // No decay until superseded
  },
  
  // Penalty factors
  penalties: {
    preliminary: -0.10,    // Data is preliminary
    estimated: -0.15,      // Value is estimated
    imputed: -0.20,        // Value is imputed
    contested: -0.30,      // Claim is disputed
  },
};

function computeFinalConfidence(
  base_confidence: number,
  factors: ConfidenceFactors,
  elapsed_time: Duration,
  decay_type: keyof typeof CONFIDENCE_MATRIX.decay
): number {
  let score = base_confidence;
  
  // Apply method adjustment
  score *= CONFIDENCE_MATRIX.extraction_method[factors.extraction_method];
  
  // Apply verification bonuses
  if (factors.cross_source_verified) {
    score += CONFIDENCE_MATRIX.verification.cross_source;
  }
  if (factors.methodology_documented) {
    score += CONFIDENCE_MATRIX.verification.methodology_doc;
  }
  
  // Apply penalties
  for (const flag of factors.quality_flags) {
    if (flag in CONFIDENCE_MATRIX.penalties) {
      score += CONFIDENCE_MATRIX.penalties[flag];
    }
  }
  
  // Apply time decay
  const decay_rate = CONFIDENCE_MATRIX.decay[decay_type];
  const days_elapsed = elapsed_time.days;
  score *= Math.pow(1 - decay_rate, days_elapsed);
  
  // Clamp to valid range
  return Math.max(0, Math.min(1, score));
}
```

---

# PART V: RELATION DETECTION ALGORITHMS

## 5.1 Automatic Detection

```typescript
// Supersession Detector
class SupersessionDetector implements RelationDetector {
  private patterns = [
    /supersedes?\s+(?:SFS\s+)?(\d{4}:\d+)/gi,
    /replaces?\s+(?:SFS\s+)?(\d{4}:\d+)/gi,
    /upphäver\s+(?:SFS\s+)?(\d{4}:\d+)/gi,
    /ersätter\s+(?:SFS\s+)?(\d{4}:\d+)/gi,
  ];
  
  detect(uio: UniversalIndexObject, graph: GraphContext): DetectedRelation[] {
    const relations: DetectedRelation[] = [];
    
    for (const pattern of this.patterns) {
      const matches = uio.claim.statement.matchAll(pattern);
      for (const match of matches) {
        const reference = match[1];
        const targetId = graph.findByReference(reference);
        
        relations.push({
          type: 'supersedes',
          target_id: targetId,
          target_reference: reference,
          detection: {
            method: 'explicit',
            confidence: 1.0,
            evidence: [`Text contains "${match[0]}"`],
          },
          status: targetId ? 'confirmed' : 'suggested',
        });
      }
    }
    
    return relations;
  }
}

// Correlation Detector (statistical)
class CorrelationDetector implements RelationDetector {
  private readonly MIN_CORRELATION = 0.7;
  private readonly MIN_SAMPLES = 20;
  
  detect(uio: UniversalIndexObject, graph: GraphContext): DetectedRelation[] {
    // Only for time series data
    if (uio.claim.value.type !== 'numeric') return [];
    
    const relations: DetectedRelation[] = [];
    
    // Find potential correlates in same jurisdiction
    const candidates = graph.findSameJurisdictionIndicators(
      uio.jurisdiction,
      uio.metadata.category
    );
    
    for (const candidate of candidates) {
      const correlation = this.computeCorrelation(uio, candidate);
      
      if (Math.abs(correlation.coefficient) >= this.MIN_CORRELATION &&
          correlation.samples >= this.MIN_SAMPLES) {
        relations.push({
          type: correlation.coefficient > 0 ? 'correlates_with' : 'inversely_correlates',
          target_id: candidate.id,
          target_reference: candidate.slug,
          detection: {
            method: 'computed',
            confidence: Math.abs(correlation.coefficient),
            evidence: [
              `Pearson r = ${correlation.coefficient.toFixed(3)}`,
              `N = ${correlation.samples}`,
              `p < ${correlation.p_value.toFixed(4)}`,
            ],
          },
          status: 'suggested',  // Always suggested, never auto-confirmed
        });
      }
    }
    
    return relations;
  }
}

// Semantic Similarity Detector (NLP)
class SemanticSimilarityDetector implements RelationDetector {
  private readonly SIMILARITY_THRESHOLD = 0.85;
  
  async detect(uio: UniversalIndexObject, graph: GraphContext): Promise<DetectedRelation[]> {
    const relations: DetectedRelation[] = [];
    
    // Get embedding for this claim
    const embedding = await this.getEmbedding(uio.claim.statement);
    
    // Find similar claims
    const similar = await graph.semanticSearch(embedding, {
      threshold: this.SIMILARITY_THRESHOLD,
      limit: 10,
      exclude: [uio.id],
    });
    
    for (const match of similar) {
      relations.push({
        type: 'similar_to',
        target_id: match.id,
        target_reference: match.slug,
        detection: {
          method: 'nlp',
          confidence: match.similarity,
          evidence: [`Semantic similarity = ${match.similarity.toFixed(3)}`],
        },
        status: 'suggested',
      });
    }
    
    return relations;
  }
}
```

## 5.2 Premium Relation Features

```typescript
/**
 * PREMIUM FEATURES
 * 
 * Free users: See relations (read-only)
 * Premium users: Create, modify, build custom
 */

interface PremiumRelationFeatures {
  // Create custom relations
  createRelation(
    source_id: GlobalHash,
    target_id: GlobalHash,
    type: RelationType,
    metadata: RelationMetadata
  ): Promise<IndexRelation>;
  
  // Build private index (combination of relations)
  createPrivateIndex(
    name: string,
    components: IndexComponent[],
    weights: number[]
  ): Promise<PrivateIndex>;
  
  // Simulate consequences
  simulateConsequence(
    change: ProposedChange,
    horizon: Duration
  ): Promise<SimulationResult>;
  
  // Track relation evolution
  subscribeToRelationChanges(
    relation_ids: GlobalHash[],
    callback: (change: RelationChange) => void
  ): Subscription;
}

// Access control
const RELATION_ACCESS = {
  public: {
    read_relations: true,
    create_relations: false,
    modify_relations: false,
    create_private_index: false,
    simulate: false,
  },
  
  observer: {
    read_relations: true,
    create_relations: false,
    modify_relations: false,
    create_private_index: false,
    simulate: false,
  },
  
  analyst: {
    read_relations: true,
    create_relations: true,
    modify_relations: false,  // Own relations only
    create_private_index: true,
    simulate: false,
  },
  
  institutional: {
    read_relations: true,
    create_relations: true,
    modify_relations: true,
    create_private_index: true,
    simulate: true,
  },
};
```

---

# PART VI: IMMUTABILITY ENFORCEMENT

## 6.1 Technical Guarantees

```typescript
/**
 * IMMUTABILITY ENFORCEMENT
 * 
 * Once published:
 * - ❌ Never modified
 * - ❌ Never deleted
 * - ❌ Never overwritten
 * 
 * New data = New version
 */

class ImmutableStore {
  // Append-only storage
  private storage: AppendOnlyStorage;
  
  // Content-addressed lookup
  private hashIndex: ContentAddressedIndex;
  
  async write(uio: UniversalIndexObject): Promise<void> {
    // 1. Verify content hash
    const computedHash = computeContentHash(uio);
    if (computedHash !== uio.id) {
      throw new IntegrityError('Content hash mismatch');
    }
    
    // 2. Check for duplicate (idempotency)
    const existing = await this.hashIndex.lookup(uio.id);
    if (existing) {
      // Already exists - this is fine, just skip
      return;
    }
    
    // 3. Append to storage (never update)
    await this.storage.append(uio);
    
    // 4. Index by hash
    await this.hashIndex.index(uio.id, uio);
    
    // 5. Write to audit log
    await this.auditLog.write({
      action: 'object_created',
      object_id: uio.id,
      timestamp: now(),
      checksum: uio.immutability.checksum,
    });
  }
  
  // No update method exists
  // No delete method exists
  
  async read(id: GlobalHash): Promise<UniversalIndexObject | null> {
    return this.hashIndex.lookup(id);
  }
  
  async readVersion(slug: string, version: SemanticVersion): Promise<UniversalIndexObject | null> {
    return this.hashIndex.lookupBySlugVersion(slug, version);
  }
  
  async readLatest(slug: string): Promise<UniversalIndexObject | null> {
    return this.hashIndex.lookupLatestBySlug(slug);
  }
  
  async readHistory(slug: string): Promise<UniversalIndexObject[]> {
    return this.hashIndex.getAllVersionsBySlug(slug);
  }
}

// Verification
class IntegrityVerifier {
  async verify(id: GlobalHash): Promise<VerificationResult> {
    const object = await this.store.read(id);
    if (!object) {
      return { valid: false, error: 'Object not found' };
    }
    
    // 1. Verify content hash
    const computedHash = computeContentHash(object);
    if (computedHash !== object.id) {
      return { valid: false, error: 'Content hash mismatch' };
    }
    
    // 2. Verify checksum
    if (computedHash !== object.immutability.checksum) {
      return { valid: false, error: 'Checksum mismatch' };
    }
    
    // 3. Verify Merkle proof if present
    if (object.publication?.merkle_proof) {
      const merkleValid = verifyMerkleProof(
        object.publication.merkle_proof,
        object.id
      );
      if (!merkleValid) {
        return { valid: false, error: 'Merkle proof invalid' };
      }
    }
    
    // 4. Verify chain integrity
    if (object.immutability.previous_version) {
      const previous = await this.store.read(object.immutability.previous_version);
      if (!previous) {
        return { valid: false, error: 'Previous version missing' };
      }
      
      // Verify this supersedes previous
      const hasRelation = object.relations.some(
        r => r.type === 'supersedes' && r.target_id === previous.id
      );
      if (!hasRelation) {
        return { valid: false, error: 'Supersession relation missing' };
      }
    }
    
    return {
      valid: true,
      verified_at: now(),
      checksum: object.immutability.checksum,
      merkle_root: object.publication?.merkle_proof?.root_hash,
    };
  }
}
```

---

# PART VII: OPERATIONAL RESULT

## 7.1 What "MATA" Enables

```
┌────────────────────────────────────────────────────────────────────┐
│                    SYSTEM CAPABILITIES                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WITH COMPLETE INGESTION PIPELINE:                                  │
│                                                                     │
│  ✓ Google can point directly to us                                 │
│    → Stable URLs, structured data, verified sources                │
│                                                                     │
│  ✓ LLMs can reason over time                                       │
│    → Version history, temporal validity, relation graphs           │
│                                                                     │
│  ✓ Authorities can verify                                          │
│    → Merkle proofs, audit logs, source traceability                │
│                                                                     │
│  ✓ Companies can build on top                                      │
│    → Stable API, predictable schema, SLA guarantees                │
│                                                                     │
│  ✓ We own structure, not data                                      │
│    → Legal clean, scalable, defensible                             │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  THIS CREATES SOMETHING THAT:                                       │
│  • Cannot be shut down (distributed, verified)                      │
│  • Cannot be copied (history, relationships, trust)                 │
│  • Cannot be ignored (becomes the standard)                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## 7.2 Pipeline Metrics

```typescript
interface PipelineMetrics {
  // Throughput
  throughput: {
    fetches_per_hour: number;
    claims_per_hour: number;
    objects_per_hour: number;
  };
  
  // Quality
  quality: {
    extraction_success_rate: number;
    normalization_success_rate: number;
    duplicate_rate: number;
    rejection_rate: number;
  };
  
  // Latency
  latency: {
    fetch_to_publish_p50: Duration;
    fetch_to_publish_p95: Duration;
    fetch_to_publish_p99: Duration;
  };
  
  // Coverage
  coverage: {
    active_channels: number;
    total_sources: number;
    jurisdictions_covered: number;
    indicators_tracked: number;
  };
  
  // Integrity
  integrity: {
    verification_success_rate: number;
    chain_integrity_rate: number;
    merkle_consistency: boolean;
  };
}
```

---

**END OF INGESTION ENGINE SPECIFICATION**

*"MATA" is the lifeblood of the system. Without it, everything else is theory.*
