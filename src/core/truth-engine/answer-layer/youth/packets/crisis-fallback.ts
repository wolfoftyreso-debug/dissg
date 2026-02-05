 /**
  * CRISIS FALLBACK PACKET
  * 
  * This packet activates when crisis is detected.
  * ABSOLUTE RULE: No analysis, no statistics, only safety + help paths.
  */
 
 import type { CrisisModeResponse, CrisisResource } from '../types';
 
 /**
  * CRISIS RESOURCES BY REGION
  */
 export const CRISIS_RESOURCES: Record<string, CrisisResource[]> = {
   SE: [
     {
       name: 'BRIS',
       country_code: 'SE',
       phone: '116 111',
       url: 'https://www.bris.se',
       hours: '24/7',
       languages: ['sv'],
     },
     {
       name: 'Mind Självmordslinjen',
       country_code: 'SE',
       phone: '90101',
       url: 'https://mind.se/sjalvmordslinjen',
       hours: '24/7',
       languages: ['sv'],
     },
   ],
   UK: [
     {
       name: 'Childline',
       country_code: 'UK',
       phone: '0800 1111',
       url: 'https://www.childline.org.uk',
       hours: '24/7',
       languages: ['en'],
     },
     {
       name: 'Samaritans',
       country_code: 'UK',
       phone: '116 123',
       url: 'https://www.samaritans.org',
       hours: '24/7',
       languages: ['en'],
     },
   ],
   US: [
     {
       name: '988 Suicide & Crisis Lifeline',
       country_code: 'US',
       phone: '988',
       url: 'https://988lifeline.org',
       hours: '24/7',
       languages: ['en', 'es'],
     },
   ],
   DEFAULT: [
     {
       name: 'International Association for Suicide Prevention',
       country_code: 'INTL',
       phone: null,
       url: 'https://www.iasp.info/resources/Crisis_Centres/',
       hours: '24/7',
       languages: ['en'],
     },
   ],
 };
 
 /**
  * GET CRISIS RESOURCES FOR REGION
  */
 export function getCrisisResourcesForRegion(regionCode: string): CrisisResource[] {
   return CRISIS_RESOURCES[regionCode] || CRISIS_RESOURCES.DEFAULT;
 }
 
 /**
  * GENERATE CRISIS RESPONSE
  * 
  * This is the ONLY response when crisis is detected.
  * NO analysis. NO statistics. ONLY safety.
  */
 export function generateCrisisFallbackResponse(
   regionCode: string = 'DEFAULT',
   language: 'en' | 'sv' = 'en'
 ): CrisisModeResponse {
   const resources = getCrisisResourcesForRegion(regionCode);
   
   const messages = {
     en: {
       primary: "I'm really glad you reached out. What you're feeling matters, and you deserve support.",
       safety: "If you are in immediate danger, please contact emergency services (112 in Europe, 911 in US) right now.",
       action: "Please talk to someone who can help. Here are people who are ready to listen:",
     },
     sv: {
       primary: "Jag är verkligen glad att du hörde av dig. Det du känner är viktigt, och du förtjänar stöd.",
       safety: "Om du är i omedelbar fara, ring 112 nu direkt.",
       action: "Snälla prata med någon som kan hjälpa. Här är personer som är redo att lyssna:",
     },
   };
   
   const msg = messages[language];
   const hotlines = resources.filter(r => r.phone !== null);
   const chatResources = resources.filter(r => r.url !== null && r.phone === null);
   
   return {
     mode: 'crisis_support',
     triggered_by: 'crisis_detection',
     priority: 'immediate',
     response: {
       message: `${msg.primary} ${msg.action}`,
       hotlines,
       chat_resources: chatResources,
       safety_message: msg.safety,
     },
     analytics_disabled: true,
     follow_up_blocked: true,
   };
 }
 
 /**
  * CRISIS PACKET (For registry)
  */
 export const PACKET_CRISIS_SUPPORT = {
   id: 'answer:youth:crisis_support:v1',
   version: 1,
   status: 'stable' as const,
   type: 'crisis_fallback' as const,
   description: 'Immediate crisis support - no analysis, only safety and resources',
   triggers: [
     'self-harm keywords',
     'suicide keywords',
     'extreme distress',
     'abuse indicators',
     'eating disorder indicators',
   ],
   response_generator: generateCrisisFallbackResponse,
 };