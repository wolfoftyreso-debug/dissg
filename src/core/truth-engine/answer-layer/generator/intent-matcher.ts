 /**
  * INTENT MATCHER
  * 
  * Maps natural language questions to Answer Packets.
  * LLM uses this to find the correct packet.
  */
 
 import type { AnswerPacketV2, IntentMatch } from '../types';
 
 /**
  * Entity extraction patterns
  */
 const ENTITY_PATTERNS = {
   country: /\b(sweden|germany|france|usa|united states|uk|japan|china|india|brazil|norway|denmark|finland|iceland)\b/i,
   country_code: /\b([A-Z]{2,3})\b/,
   year: /\b(19\d{2}|20\d{2})\b/,
   year_range: /\b(19\d{2}|20\d{2})\s*[-–]\s*(19\d{2}|20\d{2})\b/,
 };
 
 /**
  * Normalize question for matching
  */
 function normalizeQuestion(question: string): string {
   return question
     .toLowerCase()
     .replace(/[?!.,]/g, '')
     .replace(/\s+/g, ' ')
     .trim();
 }
 
 /**
  * Extract entities from question
  */
 function extractEntities(question: string): Record<string, string> {
   const entities: Record<string, string> = {};
   
   const countryMatch = question.match(ENTITY_PATTERNS.country);
   if (countryMatch) {
     entities['entity.country'] = countryMatch[1].toLowerCase();
   }
   
   const yearMatch = question.match(ENTITY_PATTERNS.year);
   if (yearMatch) {
     entities['time.point'] = yearMatch[1];
   }
   
   const rangeMatch = question.match(ENTITY_PATTERNS.year_range);
   if (rangeMatch) {
     entities['time.range.start'] = rangeMatch[1];
     entities['time.range.end'] = rangeMatch[2];
   }
   
   return entities;
 }
 
 /**
  * Check if question matches a pattern
  */
 function matchesPattern(question: string, pattern: string): boolean {
   // Convert pattern to regex
   const regexPattern = pattern
     .toLowerCase()
     .replace(/\{[^}]+\}/g, '.+')  // Replace placeholders
     .replace(/\s+/g, '\\s+');
   
   const regex = new RegExp(regexPattern, 'i');
   return regex.test(question);
 }
 
 /**
  * Check if question matches blocked patterns
  */
 function isBlocked(question: string, blockedPatterns: readonly string[]): boolean {
   const normalized = normalizeQuestion(question);
   return blockedPatterns.some(pattern => 
     normalized.includes(pattern.toLowerCase())
   );
 }
 
 /**
  * Calculate match confidence
  */
 function calculateConfidence(
   question: string,
   packet: AnswerPacketV2,
   extractedParams: Record<string, string>
 ): number {
   let confidence = 0;
   
   // Pattern match strength
   const patternMatches = packet.intent.question_patterns.filter(p => 
     matchesPattern(question, p)
   );
   confidence += patternMatches.length > 0 ? 0.5 : 0;
   
   // Required inputs present
   const requiredPresent = packet.inputs.required.every(req =>
     Object.keys(extractedParams).some(k => k.startsWith(req.split('.')[0]))
   );
   confidence += requiredPresent ? 0.3 : 0;
   
   // Domain keywords
   const domainKeywords: Record<string, string[]> = {
     population: ['population', 'people', 'inhabitants', 'live'],
     economy: ['gdp', 'income', 'rich', 'poor', 'economy'],
     health: ['life expectancy', 'lifespan', 'health', 'mortality'],
   };
   
   const keywords = domainKeywords[packet.intent.domain] || [];
   const hasKeyword = keywords.some(k => question.toLowerCase().includes(k));
   confidence += hasKeyword ? 0.2 : 0;
   
   return Math.min(confidence, 1);
 }
 
 /**
  * Match question to packet
  */
 export function matchIntent(
   question: string,
   packets: readonly AnswerPacketV2[]
 ): IntentMatch | null {
   const normalized = normalizeQuestion(question);
   const extractedParams = extractEntities(question);
   
   let bestMatch: IntentMatch | null = null;
   let bestConfidence = 0;
   
   for (const packet of packets) {
     // Check blocked patterns first
     if (isBlocked(normalized, packet.intent.blocked_patterns)) {
       continue;
     }
     
     // Check for pattern matches
     for (const pattern of packet.intent.question_patterns) {
       if (matchesPattern(normalized, pattern)) {
         const confidence = calculateConfidence(normalized, packet, extractedParams);
         
         if (confidence > bestConfidence) {
           bestConfidence = confidence;
           bestMatch = {
             packet_id: packet.id,
             confidence,
             extracted_params: extractedParams,
             matched_pattern: pattern,
           };
         }
       }
     }
   }
   
   // Minimum confidence threshold
   if (bestMatch && bestMatch.confidence < 0.3) {
     return null;
   }
   
   return bestMatch;
 }
 
 /**
  * Validate that all required inputs are present
  */
 export function validateInputs(
   packet: AnswerPacketV2,
   params: Record<string, string>
 ): { valid: boolean; missing: string[] } {
   const missing: string[] = [];
   
   for (const required of packet.inputs.required) {
     const prefix = required.split('.')[0];
     const hasParam = Object.keys(params).some(k => k.startsWith(prefix));
     if (!hasParam) {
       missing.push(required);
     }
   }
   
   return {
     valid: missing.length === 0,
     missing,
   };
 }