 /**
  * MACHINE CONSUMPTION INTERFACE
  * 
  * Defines exactly how external systems (AI, search engines, APIs)
  * consume and interact with the system.
  */
 
 // =============================================================================
 // CONSUMER TYPES
 // =============================================================================
 
 export type ConsumerType = 
   | 'AI_MODEL'           // LLMs, embeddings, reasoning systems
   | 'SEARCH_ENGINE'      // Google, Bing, etc.
   | 'API_CLIENT'         // Programmatic access
   | 'AGGREGATOR'         // Other data platforms
   | 'RESEARCH_SYSTEM';   // Academic tools
 
 export interface ConsumerProfile {
   type: ConsumerType;
   description: string;
   primaryFormat: string[];
   accessPattern: 'STREAMING' | 'BATCH' | 'QUERY';
   cachingStrategy: 'AGGRESSIVE' | 'MODERATE' | 'NONE';
   rateLimitTier: 'UNLIMITED' | 'HIGH' | 'STANDARD' | 'LIMITED';
 }
 
 export const CONSUMER_PROFILES: Record<ConsumerType, ConsumerProfile> = {
   AI_MODEL: {
     type: 'AI_MODEL',
     description: 'LLMs och AI-system som använder datan för reasoning och grounding',
     primaryFormat: ['JSON-LD', 'STRUCTURED_JSON', 'PLAIN_TEXT'],
     accessPattern: 'QUERY',
     cachingStrategy: 'MODERATE',
     rateLimitTier: 'HIGH',
   },
   SEARCH_ENGINE: {
     type: 'SEARCH_ENGINE',
     description: 'Sökmotorer som indexerar och rankar innehåll',
     primaryFormat: ['HTML_SEMANTIC', 'JSON-LD', 'SITEMAP'],
     accessPattern: 'BATCH',
     cachingStrategy: 'AGGRESSIVE',
     rateLimitTier: 'UNLIMITED',
   },
   API_CLIENT: {
     type: 'API_CLIENT',
     description: 'Utvecklare och system som integrerar via API',
     primaryFormat: ['REST_JSON', 'GRAPHQL', 'SDMX'],
     accessPattern: 'QUERY',
     cachingStrategy: 'MODERATE',
     rateLimitTier: 'STANDARD',
   },
   AGGREGATOR: {
     type: 'AGGREGATOR',
     description: 'Andra dataplattformar som aggregerar från flera källor',
     primaryFormat: ['SDMX', 'CSV', 'JSON-STAT'],
     accessPattern: 'BATCH',
     cachingStrategy: 'AGGRESSIVE',
     rateLimitTier: 'HIGH',
   },
   RESEARCH_SYSTEM: {
     type: 'RESEARCH_SYSTEM',
     description: 'Akademiska verktyg och forskningsplattformar',
     primaryFormat: ['SDMX', 'CSV', 'JSON-LD'],
     accessPattern: 'BATCH',
     cachingStrategy: 'AGGRESSIVE',
     rateLimitTier: 'HIGH',
   },
 };
 
 // =============================================================================
 // MACHINE-READABLE ENDPOINTS
 // =============================================================================
 
 export interface MachineEndpoint {
   path: string;
   description: string;
   format: string;
   authRequired: boolean;
   cacheMaxAge: number;      // seconds
   example: string;
 }
 
 export const MACHINE_ENDPOINTS: MachineEndpoint[] = [
   // Entity Access
   {
     path: '/api/v1/entity/{type}/{code}',
     description: 'Kanonisk entitetsåtkomst med full metadata',
     format: 'JSON-LD',
     authRequired: false,
     cacheMaxAge: 3600,
     example: '/api/v1/entity/country/SE',
   },
   {
     path: '/api/v1/entity/{type}/{code}/schema',
     description: 'Schema-definition för entitetstyp',
     format: 'JSON-SCHEMA',
     authRequired: false,
     cacheMaxAge: 86400,
     example: '/api/v1/entity/country/SE/schema',
   },
   
   // Citation & Verification
   {
     path: '/cite/{type}/{code}',
     description: 'Oföränderlig källhänvisning med SHA-256 checksum',
     format: 'JSON-LD',
     authRequired: false,
     cacheMaxAge: 31536000,  // 1 year - immutable
     example: '/cite/indicator/GINI_SE_2023',
   },
   {
     path: '/verify/{checksum}',
     description: 'Verifiera dataintegritet via checksum',
     format: 'JSON',
     authRequired: false,
     cacheMaxAge: 86400,
     example: '/verify/sha256:abc123...',
   },
   
   // Data Access
   {
     path: '/api/v1/data/{indicator}',
     description: 'Indikatordata med full provenance',
     format: 'JSON-STAT',
     authRequired: false,
     cacheMaxAge: 3600,
     example: '/api/v1/data/GDP_PER_CAPITA?geo=SE&time=2020-2023',
   },
   {
     path: '/api/v1/data/{indicator}/sdmx',
     description: 'SDMX-kompatibel dataström',
     format: 'SDMX-JSON',
     authRequired: false,
     cacheMaxAge: 3600,
     example: '/api/v1/data/UNEMPLOYMENT/sdmx',
   },
   
   // Discovery
   {
     path: '/api/v1/catalog',
     description: 'Fullständig datakatalog med alla tillgängliga indikatorer',
     format: 'DCAT',
     authRequired: false,
     cacheMaxAge: 86400,
     example: '/api/v1/catalog',
   },
   {
     path: '/api/v1/ontology',
     description: 'Systemets ontologi och begreppsmodell',
     format: 'OWL/RDF',
     authRequired: false,
     cacheMaxAge: 86400,
     example: '/api/v1/ontology',
   },
   
   // AI Grounding
   {
     path: '/api/v1/ground/{query}',
     description: 'AI grounding endpoint - fakta med konfidens',
     format: 'JSON',
     authRequired: false,
     cacheMaxAge: 1800,
     example: '/api/v1/ground?q=sweden+unemployment+2023',
   },
   {
     path: '/api/v1/context/{topic}',
     description: 'Kontextuell information för AI-system',
     format: 'JSON-LD',
     authRequired: false,
     cacheMaxAge: 3600,
     example: '/api/v1/context/economic-indicators',
   },
 ];
 
 // =============================================================================
 // SCHEMA.ORG MAPPINGS
 // =============================================================================
 
 export const SCHEMA_ORG_MAPPINGS = {
   Country: 'https://schema.org/Country',
   Region: 'https://schema.org/AdministrativeArea',
   Indicator: 'https://schema.org/StatisticalPopulation',
   DataPoint: 'https://schema.org/Observation',
   TimeSeries: 'https://schema.org/Dataset',
   Source: 'https://schema.org/Organization',
   Methodology: 'https://schema.org/DefinedTerm',
 } as const;
 
 // =============================================================================
 // ZERO-FRICTION ACCESS PRINCIPLES
 // =============================================================================
 
 export const ZERO_FRICTION_PRINCIPLES = {
   /**
    * Läsning kräver ALDRIG autentisering
    */
   readAuth: 'NEVER',
   
   /**
    * Ingen registrering för grundläggande åtkomst
    */
   registrationRequired: false,
   
   /**
    * Rate limits är generösa för läsning
    */
   defaultReadRateLimit: 1000,  // requests per minute
   
   /**
    * CORS är öppet för alla origins
    */
   corsPolicy: '*',
   
   /**
    * Cache headers maximerar CDN-effektivitet
    */
   cacheHeaders: 'public, max-age=3600, stale-while-revalidate=86400',
   
   /**
    * Alla endpoints har OpenAPI-dokumentation
    */
   documentationRequired: true,
   
   /**
    * Alla svar inkluderar provenance
    */
   provenanceRequired: true,
 };
 
 // =============================================================================
 // AI GROUNDING SPECIFICATION
 // =============================================================================
 
 export interface AIGroundingResponse {
   query: string;
   facts: GroundedFact[];
   confidence: number;
   sources: SourceReference[];
   limitations: string[];
   timestamp: string;
   cacheKey: string;
 }
 
 export interface GroundedFact {
   statement: string;
   value: number | string | null;
   unit: string | null;
   geography: string;
   timeReference: string;
   confidence: number;
   sourceId: string;
   verificationUrl: string;
 }
 
 export interface SourceReference {
   id: string;
   name: string;
   authority: string;
   lastUpdated: string;
   methodology: string;
   url: string;
 }
 
 // =============================================================================
 // EXPORT FORMATS
 // =============================================================================
 
 export const SUPPORTED_FORMATS = [
   { code: 'JSON', mimeType: 'application/json', description: 'Standard JSON' },
   { code: 'JSON-LD', mimeType: 'application/ld+json', description: 'Linked Data JSON' },
   { code: 'JSON-STAT', mimeType: 'application/json', description: 'Statistical JSON' },
   { code: 'SDMX-JSON', mimeType: 'application/vnd.sdmx.json', description: 'SDMX JSON' },
   { code: 'CSV', mimeType: 'text/csv', description: 'Comma-separated values' },
   { code: 'XML', mimeType: 'application/xml', description: 'Extensible Markup Language' },
   { code: 'RDF', mimeType: 'application/rdf+xml', description: 'Resource Description Framework' },
 ] as const;