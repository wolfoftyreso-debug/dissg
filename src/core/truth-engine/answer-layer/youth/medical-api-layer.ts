 /**
  * MEDICAL API LAYER
  * 
  * Abstraction layer for medical APIs.
  * Handles tiering, normalization, and safety constraints.
  * 
  * Architecture:
  * [ External Medical APIs ] → [ API Bank ] → [ Normalization ] → [ Knowledge Layer ] → [ Answer Packets ]
  */
 
 import { MEDICAL_SOURCE_TIERS, type MedicalSourceTier } from './types';
 
 /**
  * MEDICAL API REGISTRATION
  */
 export interface MedicalApiConfig {
   readonly id: string;
   readonly name: string;
   readonly version: string;
   readonly tier: MedicalSourceTier;
   readonly base_url: string;
   readonly rate_limit: number;  // requests per minute
   readonly reliability_score: number;  // 0-1
   readonly last_validated: string;
   readonly usage_restrictions: readonly string[];
   readonly enabled: boolean;
 }
 
 /**
  * NORMALIZED MEDICAL KNOWLEDGE
  */
 export interface NormalizedMedicalKnowledge {
   readonly id: string;
   readonly topic: string;
   readonly source_api: string;
   readonly source_tier: MedicalSourceTier;
   readonly content: {
     readonly prevalence: string | null;  // "X% of population"
     readonly age_relevance: string | null;  // "common in ages 13-18"
     readonly description: string;
     readonly variations: readonly string[];
     readonly red_flags: readonly string[];
     readonly when_to_seek_help: readonly string[];
   };
   readonly citations: readonly string[];
   readonly last_updated: string;
   readonly approved_for_youth: boolean;
 }
 
 /**
  * API BANK (In-memory registry)
  */
 const registeredApis: Map<string, MedicalApiConfig> = new Map();
 const knowledgeCache: Map<string, NormalizedMedicalKnowledge> = new Map();
 
 /**
  * REGISTER MEDICAL API
  */
 export function registerMedicalApi(config: MedicalApiConfig): void {
   // Validate tier
   if (!MEDICAL_SOURCE_TIERS[config.tier]) {
     throw new Error(`MED-API-ERR-01: Invalid tier ${config.tier}`);
   }
   
   registeredApis.set(config.id, config);
 }
 
 /**
  * GET APIS BY TIER
  */
 export function getApisByTier(tier: MedicalSourceTier): MedicalApiConfig[] {
   return Array.from(registeredApis.values()).filter(
     api => api.tier === tier && api.enabled
   );
 }
 
 /**
  * GET YOUTH-APPROVED APIS
  */
 export function getYouthApprovedApis(): MedicalApiConfig[] {
   return Array.from(registeredApis.values()).filter(
     api => {
       const tierConfig = MEDICAL_SOURCE_TIERS[api.tier];
       return tierConfig.youth_allowed && api.enabled;
     }
   );
 }
 
 /**
  * NORMALIZE API RESPONSE
  * Transforms raw API data into standardized knowledge format.
  */
 export function normalizeApiResponse(
   apiId: string,
   rawResponse: Record<string, unknown>,
   topic: string
 ): NormalizedMedicalKnowledge {
   const api = registeredApis.get(apiId);
   if (!api) {
     throw new Error(`MED-API-ERR-02: Unknown API ${apiId}`);
   }
   
   const tierConfig = MEDICAL_SOURCE_TIERS[api.tier];
   
   // Extract and normalize (this would be API-specific in production)
   const normalized: NormalizedMedicalKnowledge = {
     id: `knowledge:${topic}:${apiId}:${Date.now()}`,
     topic,
     source_api: apiId,
     source_tier: api.tier,
     content: {
       prevalence: extractPrevalence(rawResponse),
       age_relevance: extractAgeRelevance(rawResponse),
       description: extractDescription(rawResponse),
       variations: extractVariations(rawResponse),
       red_flags: extractRedFlags(rawResponse),
       when_to_seek_help: extractHelpGuidance(rawResponse),
     },
     citations: extractCitations(rawResponse, api.name),
     last_updated: new Date().toISOString(),
     approved_for_youth: tierConfig.youth_allowed,
   };
   
   // Cache it
   knowledgeCache.set(normalized.id, normalized);
   
   return normalized;
 }
 
 /**
  * GET KNOWLEDGE FOR TOPIC
  * Returns only youth-approved knowledge if for_youth is true.
  */
 export function getKnowledgeForTopic(
   topic: string,
   forYouth: boolean = true
 ): NormalizedMedicalKnowledge[] {
   const results: NormalizedMedicalKnowledge[] = [];
   
   for (const knowledge of knowledgeCache.values()) {
     if (knowledge.topic === topic) {
       if (!forYouth || knowledge.approved_for_youth) {
         results.push(knowledge);
       }
     }
   }
   
   // Sort by tier (lower tier = more authoritative)
   return results.sort((a, b) => {
     const tierA = MEDICAL_SOURCE_TIERS[a.source_tier].level;
     const tierB = MEDICAL_SOURCE_TIERS[b.source_tier].level;
     return tierA - tierB;
   });
 }
 
 /**
  * EXTRACTION HELPERS (Would be API-specific in production)
  */
 function extractPrevalence(data: Record<string, unknown>): string | null {
   return (data.prevalence as string) || null;
 }
 
 function extractAgeRelevance(data: Record<string, unknown>): string | null {
   return (data.age_relevance as string) || null;
 }
 
 function extractDescription(data: Record<string, unknown>): string {
   return (data.description as string) || 'No description available.';
 }
 
 function extractVariations(data: Record<string, unknown>): string[] {
   return (data.variations as string[]) || [];
 }
 
 function extractRedFlags(data: Record<string, unknown>): string[] {
   return (data.red_flags as string[]) || [];
 }
 
 function extractHelpGuidance(data: Record<string, unknown>): string[] {
   return (data.when_to_seek_help as string[]) || [
     'If symptoms persist or worsen',
     'If it significantly affects daily life',
     'If you feel unsafe',
   ];
 }
 
 function extractCitations(data: Record<string, unknown>, apiName: string): string[] {
   const citations = (data.citations as string[]) || [];
   if (citations.length === 0) {
     citations.push(`Source: ${apiName}`);
   }
   return citations;
 }
 
 /**
  * VALIDATE KNOWLEDGE FOR YOUTH USE
  */
 export function validateForYouthUse(knowledge: NormalizedMedicalKnowledge): {
   valid: boolean;
   issues: string[];
 } {
   const issues: string[] = [];
   
   // Check tier
   if (!knowledge.approved_for_youth) {
     issues.push('Source tier not approved for youth content');
   }
   
   // Check for diagnostic language
   const diagnosticTerms = ['diagnosis', 'diagnosed', 'you have', 'you suffer from'];
   for (const term of diagnosticTerms) {
     if (knowledge.content.description.toLowerCase().includes(term)) {
       issues.push(`Contains diagnostic language: "${term}"`);
     }
   }
   
   // Check for treatment recommendations
   const treatmentTerms = ['take medication', 'prescribe', 'treatment is'];
   for (const term of treatmentTerms) {
     if (knowledge.content.description.toLowerCase().includes(term)) {
       issues.push(`Contains treatment recommendation: "${term}"`);
     }
   }
   
   return {
     valid: issues.length === 0,
     issues,
   };
 }
 
 /**
  * API HEALTH CHECK
  */
 export function getApiHealth(): {
   total: number;
   enabled: number;
   by_tier: Record<MedicalSourceTier, number>;
   youth_approved: number;
 } {
   const apis = Array.from(registeredApis.values());
   const byTier: Record<string, number> = {};
   
   for (const tier of Object.keys(MEDICAL_SOURCE_TIERS)) {
     byTier[tier] = apis.filter(a => a.tier === tier).length;
   }
   
   return {
     total: apis.length,
     enabled: apis.filter(a => a.enabled).length,
     by_tier: byTier as Record<MedicalSourceTier, number>,
     youth_approved: getYouthApprovedApis().length,
   };
 }