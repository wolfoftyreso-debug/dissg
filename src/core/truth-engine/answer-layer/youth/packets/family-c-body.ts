 /**
  * PACKET FAMILY C: BODY & DEVELOPMENT
  * 
  * 4 packets for body-related questions.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * C1: Body Image
  */
 export const PACKET_BODY_IMAGE: YouthAnswerPacket = {
   id: 'answer:youth:body_image:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: [
       'Is my body normal?', 'Why don I not like my body?',
       'Är min kropp normal?', 'Varför gillar jag inte min kropp?',
     ],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'supportive',
     language_level: 'simple',
   },
   medical_scope: {
     diagnosis: 'forbidden',
     treatment: 'forbidden',
     education: 'allowed',
     normalization: 'required',
     help_guidance: 'required',
   },
   risk_classification: {
     base_risk: 'moderate',
     escalation_triggers: ['hate my body', 'disgusting', 'need to change everything'],
     crisis_keywords: ['starving myself', 'want to hurt my body'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Bodies come in many different shapes and sizes, and all of them are normal. Feeling uncertain about your body is very common during adolescence, when your body is changing rapidly.
 
 Why this is common:
 - Your body is still developing
 - Media often shows unrealistic or edited images
 - Comparison with others is natural but can be misleading
 
 What this is NOT:
 - Feeling unsure about your body does not mean something is wrong with it
 - Most people feel this way at some point
 
 When to seek help:
 - Thoughts about your body make it hard to eat normally
 - You avoid activities because of how you look
 - These thoughts are causing significant distress daily`,
     sections: ['what_is_common', 'why_it_happens', 'what_this_is_not', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: true,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * C2: Puberty Changes
  */
 export const PACKET_PUBERTY_CHANGES: YouthAnswerPacket = {
   id: 'answer:youth:puberty_changes:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: [
       'Is my puberty normal?', 'Why am I developing differently?',
       'Är min pubertet normal?', 'Varför utvecklas jag annorlunda?',
     ],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'informative',
     language_level: 'simple',
   },
   medical_scope: {
     diagnosis: 'forbidden',
     treatment: 'forbidden',
     education: 'allowed',
     normalization: 'required',
     help_guidance: 'required',
   },
   risk_classification: {
     base_risk: 'low',
     escalation_triggers: [],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Puberty happens at different times and speeds for everyone. There is a very wide range of what is normal.
 
 Normal variations:
 - Starting anywhere from age 8 to 14 is typical
 - Different body parts develop at different rates
 - Some people develop quickly, others gradually
 
 What this is NOT:
 - Early or late puberty usually does not indicate a problem
 - Developing differently from friends is completely normal
 
 When to talk to a doctor:
 - No signs of puberty by age 14 (for boys) or 13 (for girls)
 - If you have specific concerns about your development`,
     sections: ['what_is_common', 'variation_is_normal', 'what_this_is_not', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: true,
   },
 };
 
 /**
  * C3: Fatigue Common
  */
 export const PACKET_FATIGUE_COMMON: YouthAnswerPacket = {
   id: 'answer:youth:fatigue_common:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: [
       'Why am I so tired?', 'Is it normal to be tired all the time?',
       'Varför är jag så trött?', 'Är det normalt att vara trött hela tiden?',
     ],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'informative',
     language_level: 'simple',
   },
   medical_scope: {
     diagnosis: 'forbidden',
     treatment: 'forbidden',
     education: 'allowed',
     normalization: 'required',
     help_guidance: 'required',
   },
   risk_classification: {
     base_risk: 'low',
     escalation_triggers: ['too tired to live', 'cannot get up at all'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Feeling tired is very common during adolescence. Your body needs more sleep during this time (8-10 hours) and your sleep cycle naturally shifts later.
 
 Why it happens:
 - Growing bodies need more rest
 - Sleep cycle shifts (hard to sleep early, hard to wake early)
 - School schedules often conflict with natural sleep patterns
 - Screens and activities can reduce sleep quality
 
 What this is NOT:
 - Being tired does not mean you are lazy
 - Needing more sleep than adults is normal
 
 When to seek help:
 - Fatigue does not improve with rest
 - It affects your ability to concentrate or function
 - Combined with other symptoms like weight changes or persistent sadness`,
     sections: ['what_is_common', 'why_it_happens', 'what_this_is_not', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * C4: Physical Symptoms from Stress
  */
 export const PACKET_PHYSICAL_SYMPTOMS_STRESS: YouthAnswerPacket = {
   id: 'answer:youth:physical_symptoms_stress:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: [
       'Why does my stomach hurt when stressed?', 'Can stress cause physical symptoms?',
       'Varför får jag ont i magen av stress?', 'Kan stress ge fysiska symptom?',
     ],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'informative',
     language_level: 'simple',
   },
   medical_scope: {
     diagnosis: 'forbidden',
     treatment: 'forbidden',
     education: 'allowed',
     normalization: 'required',
     help_guidance: 'required',
   },
   risk_classification: {
     base_risk: 'low',
     escalation_triggers: ['severe pain', 'cannot eat at all'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Yes, stress can cause real physical symptoms. Your mind and body are closely connected, and emotional stress often shows up in physical ways.
 
 Common physical stress symptoms:
 - Stomach aches or nausea
 - Headaches
 - Muscle tension
 - Racing heart
 - Feeling shaky
 
 What this is NOT:
 - Physical symptoms from stress are real, not imagined
 - Having them does not mean you are weak
 
 When to seek help:
 - Symptoms are severe or persistent
 - They significantly interfere with daily life
 - You are unsure if symptoms are stress-related (always okay to check with a doctor)`,
     sections: ['what_is_common', 'why_it_happens', 'what_this_is_not', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis. Persistent physical symptoms should be evaluated by a healthcare provider.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * FAMILY C EXPORTS
  */
 export const FAMILY_C_PACKETS = [
   PACKET_BODY_IMAGE,
   PACKET_PUBERTY_CHANGES,
   PACKET_FATIGUE_COMMON,
   PACKET_PHYSICAL_SYMPTOMS_STRESS,
 ] as const;