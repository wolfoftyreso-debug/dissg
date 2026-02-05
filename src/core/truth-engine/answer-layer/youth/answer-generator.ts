 /**
  * YOUTH ANSWER GENERATOR
  * 
  * Generates safe, normalizing answers for youth questions.
  * 
  * MANDATORY OUTPUT STRUCTURE:
  * 1. Normalization
  * 2. Variation explanation
  * 3. Non-diagnosis statement
  * 4. Safe guidance
  * 5. Crisis resources (if relevant)
  */
 
 import type { 
   YouthRiskLevel,
   YouthAnswerSection,
   CrisisModeResponse,
 } from './types';
 import { YOUTH_ANSWER_SECTIONS } from './types';
 import { safetyGate, type CrisisDetectionResult } from './crisis-detector';
 import { YOUTH_QUESTIONS, type RegisteredYouthQuestion } from './questions-registry';
 
 /**
  * GENERATED YOUTH ANSWER
  */
 export interface GeneratedYouthAnswer {
   readonly question_id: string;
   readonly question_text: string;
   readonly risk_level: YouthRiskLevel;
   readonly crisis_mode: boolean;
   readonly sections: readonly GeneratedSection[];
   readonly text_output: string;
   readonly disclaimers: readonly string[];
   readonly resources: readonly string[];
   readonly metadata: {
     readonly generated_at: string;
     readonly packet_id: string;
     readonly safety_check: CrisisDetectionResult;
   };
 }
 
 interface GeneratedSection {
   readonly id: YouthAnswerSection;
   readonly title: string;
   readonly content: string;
 }
 
 /**
  * MANDATORY DISCLAIMERS FOR YOUTH CONTENT
  */
 const YOUTH_DISCLAIMERS = {
   NON_DIAGNOSTIC: 'This information is educational only and does not replace professional assessment.',
   VARIATION_NORMAL: 'Everyone develops and experiences things differently.',
   SEEK_HELP: 'If something is affecting your daily life, it\'s okay to talk to someone you trust.',
   NO_WRONG_FEELINGS: 'There are no wrong feelings – how you feel is valid.',
 };
 
 /**
  * SECTION TEMPLATES
  */
 const SECTION_TEMPLATES: Record<YouthAnswerSection, {
   title_en: string;
   title_sv: string;
   template: (context: AnswerContext) => string;
 }> = {
   what_is_common: {
     title_en: 'What\'s Common',
     title_sv: 'Vad som är vanligt',
     template: (ctx) => `Many people your age experience ${ctx.topic}. It's a normal part of growing up and figuring out who you are.`,
   },
   why_it_happens: {
     title_en: 'Why It Happens',
     title_sv: 'Varför det händer',
     template: (ctx) => `${ctx.topic} can happen for many reasons – biological changes, life experiences, and how we think and feel are all connected.`,
   },
   variation_is_normal: {
     title_en: 'Everyone Is Different',
     title_sv: 'Alla är olika',
     template: () => `People experience things differently, and that's okay. There's no single "normal" way to be.`,
   },
   when_to_seek_help: {
     title_en: 'When to Talk to Someone',
     title_sv: 'När du kan prata med någon',
     template: (ctx) => ctx.risk_level === 'high' 
       ? `If ${ctx.topic} is affecting your daily life, sleep, or relationships, consider talking to a trusted adult, school counselor, or healthcare provider.`
       : `If you're ever unsure or worried, it's always okay to talk to someone you trust.`,
   },
   what_this_is_not: {
     title_en: 'What This Doesn\'t Mean',
     title_sv: 'Vad det inte betyder',
     template: () => `Experiencing this doesn't mean there's something wrong with you. It doesn't automatically mean you have a condition or need treatment.`,
   },
   resources: {
     title_en: 'Where to Learn More',
     title_sv: 'Var du kan läsa mer',
     template: () => `If you want to learn more or talk to someone, there are resources available.`,
   },
 };
 
 interface AnswerContext {
   topic: string;
   risk_level: YouthRiskLevel;
   language: 'en' | 'sv';
 }
 
 /**
  * MATCH QUESTION TO REGISTERED QUESTION
  */
 export function matchYouthQuestion(question: string): RegisteredYouthQuestion | null {
   const lowerQ = question.toLowerCase();
   
   // Try Swedish match
   for (const rq of YOUTH_QUESTIONS) {
     if (lowerQ.includes(rq.question_sv.toLowerCase().slice(0, 20))) {
       return rq;
     }
   }
   
   // Try English match
   for (const rq of YOUTH_QUESTIONS) {
     if (lowerQ.includes(rq.question_en.toLowerCase().slice(0, 20))) {
       return rq;
     }
   }
   
   // Try keyword matching
   const keywords: Record<string, string[]> = {
     normality: ['normal', 'vanlig', 'fel på mig', 'wrong with me'],
     body: ['kropp', 'body', 'utseende', 'appearance', 'puberty'],
     psyche: ['ångest', 'anxiety', 'depression', 'mår dåligt', 'feel bad', 'sad'],
     identity: ['läggning', 'orientation', 'identitet', 'identity', 'kön', 'gender'],
     risk: ['farligt', 'dangerous', 'orolig', 'worried', 'hjälp', 'help'],
     social: ['ensam', 'alone', 'vänner', 'friends', 'mobba', 'bully'],
   };
   
   for (const [category, kws] of Object.entries(keywords)) {
     for (const kw of kws) {
       if (lowerQ.includes(kw)) {
         // Return first question in that category
         return YOUTH_QUESTIONS.find(q => q.class.includes(category)) || null;
       }
     }
   }
   
   return null;
 }
 
 /**
  * GENERATE YOUTH ANSWER
  */
 export function generateYouthAnswer(
   question: string,
   language: 'en' | 'sv' = 'en',
   countryCode: string = 'SE'
 ): GeneratedYouthAnswer | { crisis_response: CrisisModeResponse } {
   
   // ═══════════════════════════════════════════════════════════════════
   // STEP 1: SAFETY GATE (MANDATORY)
   // ═══════════════════════════════════════════════════════════════════
   const safety = safetyGate(question, countryCode);
   
   if (!safety.safe_to_proceed && safety.crisis_response) {
     // CRISIS MODE: Return crisis response, stop all processing
     return { crisis_response: safety.crisis_response };
   }
   
   // ═══════════════════════════════════════════════════════════════════
   // STEP 2: MATCH QUESTION
   // ═══════════════════════════════════════════════════════════════════
   const matchedQuestion = matchYouthQuestion(question);
   
   if (!matchedQuestion) {
     // No match - generate generic supportive response
     return generateGenericResponse(question, safety.detection, language);
   }
   
   // ═══════════════════════════════════════════════════════════════════
   // STEP 3: GENERATE ANSWER SECTIONS
   // ═══════════════════════════════════════════════════════════════════
   const context: AnswerContext = {
     topic: extractTopic(matchedQuestion.question_en),
     risk_level: matchedQuestion.risk_level,
     language,
   };
   
   const sections: GeneratedSection[] = [];
   
   // Always include normalization
   if (matchedQuestion.requires_normalization) {
     sections.push({
       id: YOUTH_ANSWER_SECTIONS.WHAT_IS_COMMON,
       title: SECTION_TEMPLATES.what_is_common[language === 'sv' ? 'title_sv' : 'title_en'],
       content: SECTION_TEMPLATES.what_is_common.template(context),
     });
     
     sections.push({
       id: YOUTH_ANSWER_SECTIONS.VARIATION_IS_NORMAL,
       title: SECTION_TEMPLATES.variation_is_normal[language === 'sv' ? 'title_sv' : 'title_en'],
       content: SECTION_TEMPLATES.variation_is_normal.template(context),
     });
   }
   
   // Add non-diagnosis statement
   sections.push({
     id: YOUTH_ANSWER_SECTIONS.WHAT_THIS_IS_NOT,
     title: SECTION_TEMPLATES.what_this_is_not[language === 'sv' ? 'title_sv' : 'title_en'],
     content: SECTION_TEMPLATES.what_this_is_not.template(context),
   });
   
   // Always include help guidance for moderate/high risk
   if (matchedQuestion.requires_help_guidance || 
       matchedQuestion.risk_level === 'high' || 
       matchedQuestion.risk_level === 'moderate') {
     sections.push({
       id: YOUTH_ANSWER_SECTIONS.WHEN_TO_SEEK_HELP,
       title: SECTION_TEMPLATES.when_to_seek_help[language === 'sv' ? 'title_sv' : 'title_en'],
       content: SECTION_TEMPLATES.when_to_seek_help.template(context),
     });
   }
   
   // ═══════════════════════════════════════════════════════════════════
   // STEP 4: BUILD TEXT OUTPUT
   // ═══════════════════════════════════════════════════════════════════
   let textOutput = sections.map(s => `**${s.title}**\n${s.content}`).join('\n\n');
   
   // Add disclaimers
   textOutput += '\n\n---\n';
   textOutput += `_${YOUTH_DISCLAIMERS.NON_DIAGNOSTIC}_`;
   
   return {
     question_id: matchedQuestion.id,
     question_text: language === 'sv' ? matchedQuestion.question_sv : matchedQuestion.question_en,
     risk_level: matchedQuestion.risk_level,
     crisis_mode: false,
     sections,
     text_output: textOutput,
     disclaimers: [
       YOUTH_DISCLAIMERS.NON_DIAGNOSTIC,
       YOUTH_DISCLAIMERS.VARIATION_NORMAL,
     ],
     resources: matchedQuestion.requires_help_guidance ? [
       'BRIS (Sweden): 116 111',
       'School counselor',
       'Trusted adult',
     ] : [],
     metadata: {
       generated_at: new Date().toISOString(),
       packet_id: matchedQuestion.answer_packet_id,
       safety_check: safety.detection,
     },
   };
 }
 
 /**
  * GENERATE GENERIC RESPONSE (when no specific match)
  */
 function generateGenericResponse(
   question: string,
   detection: CrisisDetectionResult,
   language: 'en' | 'sv'
 ): GeneratedYouthAnswer {
   const sections: GeneratedSection[] = [
     {
       id: YOUTH_ANSWER_SECTIONS.WHAT_IS_COMMON,
       title: language === 'sv' ? 'Det är okej att undra' : 'It\'s Okay to Wonder',
       content: language === 'sv' 
         ? 'Att ha frågor om sig själv och livet är helt normalt, särskilt när man är ung.'
         : 'Having questions about yourself and life is completely normal, especially when you\'re young.',
     },
     {
       id: YOUTH_ANSWER_SECTIONS.VARIATION_IS_NORMAL,
       title: language === 'sv' ? 'Alla är olika' : 'Everyone Is Different',
       content: language === 'sv'
         ? 'Det finns inget "rätt" sätt att vara. Människor upplever saker på olika sätt.'
         : 'There\'s no "right" way to be. People experience things differently.',
     },
     {
       id: YOUTH_ANSWER_SECTIONS.WHEN_TO_SEEK_HELP,
       title: language === 'sv' ? 'Prata med någon' : 'Talk to Someone',
       content: language === 'sv'
         ? 'Om du har frågor eller oroar dig, är det alltid okej att prata med någon du litar på.'
         : 'If you have questions or concerns, it\'s always okay to talk to someone you trust.',
     },
   ];
   
   return {
     question_id: 'generic',
     question_text: question,
     risk_level: detection.risk_level,
     crisis_mode: false,
     sections,
     text_output: sections.map(s => `**${s.title}**\n${s.content}`).join('\n\n'),
     disclaimers: [YOUTH_DISCLAIMERS.NON_DIAGNOSTIC],
     resources: [],
     metadata: {
       generated_at: new Date().toISOString(),
       packet_id: 'answer:youth:generic:v1',
       safety_check: detection,
     },
   };
 }
 
 /**
  * EXTRACT TOPIC FROM QUESTION
  */
 function extractTopic(question: string): string {
   // Simple extraction - would be more sophisticated in production
   const topics: Record<string, string> = {
     'normal': 'these feelings',
     'anxiety': 'anxiety',
     'depression': 'low mood',
     'body': 'body changes',
     'friends': 'social connections',
     'identity': 'identity questions',
     'different': 'feeling different',
   };
   
   const lowerQ = question.toLowerCase();
   for (const [keyword, topic] of Object.entries(topics)) {
     if (lowerQ.includes(keyword)) {
       return topic;
     }
   }
   
   return 'what you\'re experiencing';
 }