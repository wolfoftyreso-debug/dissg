 /**
  * CRISIS FALLBACK PACKETS
  * 
  * High-risk questions redirect here. Never provide detailed answers.
  * Always route to human support.
  */
 
 /**
  * CRISIS RESOURCES (by region)
  */
 export const CRISIS_RESOURCES = {
   DEFAULT: {
     text: 'If you are in crisis, please reach out to a crisis helpline in your area.',
     international: 'Find resources at findahelpline.com',
   },
   SE: {
     name: 'Mind självmordslinjen',
     phone: '90101',
     text_chat: 'mind.se',
     available: '24/7',
   },
   US: {
     name: '988 Suicide & Crisis Lifeline',
     phone: '988',
     text: 'Text HOME to 741741',
     available: '24/7',
   },
   UK: {
     name: 'Samaritans',
     phone: '116 123',
     email: 'jo@samaritans.org',
     available: '24/7',
   },
   AU: {
     name: 'Lifeline',
     phone: '13 11 14',
     text: 'Text 0477 13 11 14',
     available: '24/7',
   },
   CA: {
     name: 'Talk Suicide Canada',
     phone: '1-833-456-4566',
     text: 'Text 45645',
     available: '24/7',
   },
 } as const;
 
 /**
  * CRISIS FALLBACK PACKET
  * 
  * Used for ANY high-risk query. No exceptions.
  */
 export const PACKET_CRISIS_SUPPORT = {
   id: 'youth:crisis:support:v1',
   question_class: 'crisis',
   risk_level: 'high',
   
   // NEVER changes based on query
   text: `
 It sounds like you might be going through something really difficult right now.
 You do not have to face this alone.
 
 Please reach out to someone who can help:
 • A trusted adult (parent, teacher, counselor)
 • A crisis helpline (available 24/7, confidential)
 
 Your feelings are valid, and support is available.
   `.trim(),
   
   // Required sections
   sections: {
     normalize: true,
     limits: false, // Not appropriate for crisis
     when_to_seek_help: true,
     crisis_resources: true,
   },
   
   // Never claim confidence in crisis
   confidence: { coverage: 'not_applicable', tier: 1 },
   
   // Metadata
   metadata: {
     never_modify: true,
     always_include_resources: true,
     no_data_dependencies: true,
   },
 } as const;
 
 /**
  * Generate crisis response with appropriate resources
  */
 export function generateCrisisFallbackResponse(regionCode?: string): {
   text: string;
   resources: typeof CRISIS_RESOURCES[keyof typeof CRISIS_RESOURCES];
   show_all_resources: boolean;
 } {
   const resources = regionCode && CRISIS_RESOURCES[regionCode as keyof typeof CRISIS_RESOURCES]
     ? CRISIS_RESOURCES[regionCode as keyof typeof CRISIS_RESOURCES]
     : CRISIS_RESOURCES.DEFAULT;
   
   return {
     text: PACKET_CRISIS_SUPPORT.text,
     resources,
     show_all_resources: !regionCode,
   };
 }
 
 /**
  * Get crisis resources for specific region
  */
 export function getCrisisResourcesForRegion(regionCode: string) {
   return CRISIS_RESOURCES[regionCode as keyof typeof CRISIS_RESOURCES] 
     || CRISIS_RESOURCES.DEFAULT;
 }