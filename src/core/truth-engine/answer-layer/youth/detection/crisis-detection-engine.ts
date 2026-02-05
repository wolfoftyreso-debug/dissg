 /**
  * CRISIS DETECTION ENGINE
  * 
  * 3-level detection system:
  * 1. Regex (fast, deterministic)
  * 2. Embedding score (semantic)
  * 3. Context memory (session-based)
  */
 
 /**
  * RISK THRESHOLDS (LOCKED)
  */
 export const RISK_THRESHOLDS = {
   CRISIS: 0.85,
   SUPPORTIVE: 0.60,
   INFORMATIONAL: 0.0,
 } as const;
 
 /**
  * DETECTION MODES
  */
 export type DetectionMode = 'crisis_support' | 'supportive_with_guidance' | 'informational';
 
 /**
  * DETECTION RESULT
  */
 export interface CrisisDetectionResult {
   readonly risk_score: number;
   readonly mode: DetectionMode;
   readonly triggered_patterns: string[];
   readonly detection_layers: {
     regex: { score: number; matches: string[] };
     embedding: { score: number; similar_concepts: string[] };
     context: { score: number; session_flags: string[] };
   };
   readonly requires_immediate_response: boolean;
 }
 
 /**
  * LAYER 1: REGEX PATTERNS (DETERMINISTIC)
  */
 export const CRISIS_REGEX_PATTERNS = {
   // Immediate crisis - weight: 1.0
   IMMEDIATE: [
     /\b(kill|end)\s+(myself|my\s+life)\b/i,
     /\bwant\s+to\s+die\b/i,
     /\bsuicide\b/i,
     /\bcut(ting)?\s+(myself|me)\b/i,
     /\bhurt(ing)?\s+myself\b/i,
     /\bself[- ]?harm\b/i,
     /\bta\s+mitt\s+liv\b/i,
     /\bvill\s+dö\b/i,
     /\bsjälvmord\b/i,
     /\bskära\s+mig\b/i,
     /\bskadar?\s+mig\s+själv\b/i,
   ],
   
   // High risk - weight: 0.8
   HIGH: [
     /\bcan'?t\s+take\s+it\s+anymore\b/i,
     /\bno\s+point\s+(in\s+)?living\b/i,
     /\bwant\s+to\s+disappear\b/i,
     /\bbetter\s+off\s+dead\b/i,
     /\bnobody\s+would\s+miss\s+me\b/i,
     /\borkar\s+inte\s+(längre|mer)\b/i,
     /\bvill\s+försvinna\b/i,
     /\bstarv(ing|e)\s+myself\b/i,
     /\bsvälter\s+mig\b/i,
     /\bkräks\s+efter\b/i,
   ],
   
   // Elevated risk - weight: 0.5
   ELEVATED: [
     /\bfeel\s+nothing\b/i,
     /\bdead\s+inside\b/i,
     /\bempty\s+forever\b/i,
     /\bno\s+hope\b/i,
     /\bworthless\b/i,
     /\bkänner\s+ingenting\b/i,
     /\bhopplöst\b/i,
     /\bvärdelös\b/i,
   ],
 } as const;
 
 /**
  * LAYER 2: EMBEDDING CONCEPTS (SEMANTIC)
  * These would connect to an embedding model in production
  */
 export const CRISIS_SEMANTIC_CONCEPTS = [
   'wanting to end life',
   'self-inflicted harm',
   'suicidal ideation',
   'feeling trapped with no escape',
   'extreme hopelessness',
   'planning self-harm',
   'eating disorder behaviors',
   'purging behaviors',
   'starvation',
 ];
 
 /**
  * LAYER 3: CONTEXT FLAGS (SESSION)
  */
 export interface SessionContext {
   previous_questions: string[];
   escalation_trajectory: 'stable' | 'escalating' | 'de-escalating';
   crisis_adjacent_count: number;
   session_duration_minutes: number;
 }
 
 /**
  * RUN REGEX DETECTION (Layer 1)
  */
 function runRegexDetection(input: string): { score: number; matches: string[] } {
   const matches: string[] = [];
   let score = 0;
   
   // Check immediate patterns (weight: 1.0)
   for (const pattern of CRISIS_REGEX_PATTERNS.IMMEDIATE) {
     const match = input.match(pattern);
     if (match) {
       matches.push(`IMMEDIATE: ${match[0]}`);
       score = Math.max(score, 1.0);
     }
   }
   
   // Check high patterns (weight: 0.8)
   for (const pattern of CRISIS_REGEX_PATTERNS.HIGH) {
     const match = input.match(pattern);
     if (match) {
       matches.push(`HIGH: ${match[0]}`);
       score = Math.max(score, 0.8);
     }
   }
   
   // Check elevated patterns (weight: 0.5)
   for (const pattern of CRISIS_REGEX_PATTERNS.ELEVATED) {
     const match = input.match(pattern);
     if (match) {
       matches.push(`ELEVATED: ${match[0]}`);
       score = Math.max(score, 0.5);
     }
   }
   
   return { score, matches };
 }
 
 /**
  * RUN EMBEDDING DETECTION (Layer 2)
  * In production, this would call an embedding model
  */
 function runEmbeddingDetection(input: string): { score: number; similar_concepts: string[] } {
   // Simplified keyword-based fallback for non-production
   // In production: embed input, compare to CRISIS_SEMANTIC_CONCEPTS embeddings
   
   const similar_concepts: string[] = [];
   let score = 0;
   
   const lowerInput = input.toLowerCase();
   
   // Simple semantic matching (would be embedding similarity in production)
   const semanticIndicators = [
     { keywords: ['end', 'life', 'stop', 'living'], concept: 'wanting to end life', weight: 0.9 },
     { keywords: ['hurt', 'myself', 'pain', 'cut'], concept: 'self-inflicted harm', weight: 0.85 },
     { keywords: ['no', 'hope', 'hopeless', 'never', 'better'], concept: 'extreme hopelessness', weight: 0.7 },
     { keywords: ['trapped', 'no', 'way', 'out', 'escape'], concept: 'feeling trapped with no escape', weight: 0.75 },
     { keywords: ['not', 'eat', 'starve', 'purge', 'throw', 'up'], concept: 'eating disorder behaviors', weight: 0.8 },
   ];
   
   for (const indicator of semanticIndicators) {
     const matchCount = indicator.keywords.filter(k => lowerInput.includes(k)).length;
     if (matchCount >= 2) {
       similar_concepts.push(indicator.concept);
       score = Math.max(score, indicator.weight * (matchCount / indicator.keywords.length));
     }
   }
   
   return { score, similar_concepts };
 }
 
 /**
  * RUN CONTEXT DETECTION (Layer 3)
  */
 function runContextDetection(context?: SessionContext): { score: number; session_flags: string[] } {
   if (!context) {
     return { score: 0, session_flags: [] };
   }
   
   const session_flags: string[] = [];
   let score = 0;
   
   // Check escalation trajectory
   if (context.escalation_trajectory === 'escalating') {
     session_flags.push('escalating_trajectory');
     score += 0.2;
   }
   
   // Check crisis-adjacent question count
   if (context.crisis_adjacent_count >= 3) {
     session_flags.push('multiple_crisis_adjacent_questions');
     score += 0.3;
   } else if (context.crisis_adjacent_count >= 2) {
     session_flags.push('two_crisis_adjacent_questions');
     score += 0.15;
   }
   
   return { score: Math.min(score, 0.5), session_flags }; // Cap context contribution
 }
 
 /**
  * DETERMINE MODE FROM SCORE
  */
 function determineMode(score: number): DetectionMode {
   if (score >= RISK_THRESHOLDS.CRISIS) {
     return 'crisis_support';
   } else if (score >= RISK_THRESHOLDS.SUPPORTIVE) {
     return 'supportive_with_guidance';
   }
   return 'informational';
 }
 
 /**
  * MAIN DETECTION FUNCTION
  */
 export function detectCrisisLevel(
   input: string,
   context?: SessionContext
 ): CrisisDetectionResult {
   // Run all detection layers
   const regexResult = runRegexDetection(input);
   const embeddingResult = runEmbeddingDetection(input);
   const contextResult = runContextDetection(context);
   
   // Combine scores (weighted)
   // Regex is primary (deterministic), embedding secondary, context tertiary
   const combinedScore = Math.min(
     1.0,
     regexResult.score * 0.6 +
     embeddingResult.score * 0.3 +
     contextResult.score * 0.1
   );
   
   // If regex found IMMEDIATE pattern, override to maximum
   const finalScore = regexResult.matches.some(m => m.startsWith('IMMEDIATE'))
     ? Math.max(combinedScore, RISK_THRESHOLDS.CRISIS)
     : combinedScore;
   
   const mode = determineMode(finalScore);
   
   return {
     risk_score: finalScore,
     mode,
     triggered_patterns: [
       ...regexResult.matches,
       ...embeddingResult.similar_concepts,
       ...contextResult.session_flags,
     ],
     detection_layers: {
       regex: regexResult,
       embedding: embeddingResult,
       context: contextResult,
     },
     requires_immediate_response: mode === 'crisis_support',
   };
 }
 
 /**
  * QUICK CRISIS CHECK (Fast path for simple cases)
  */
 export function quickCrisisCheck(input: string): boolean {
   // Check only immediate patterns for fast response
   for (const pattern of CRISIS_REGEX_PATTERNS.IMMEDIATE) {
     if (pattern.test(input)) {
       return true;
     }
   }
   return false;
 }