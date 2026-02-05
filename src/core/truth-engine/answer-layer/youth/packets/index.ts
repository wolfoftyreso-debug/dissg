 /**
  * YOUTH ANSWER PACKETS
  * 
  * 20 ready-to-use packets for low-medium risk questions.
  * Each follows the locked schema and mandatory content blocks.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * PACKET: Age Common (Q1)
  */
 export const PACKET_AGE_COMMON: YouthAnswerPacket = {
   id: 'answer:youth:age_common:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'normality',
     question_class: 'normality',
     question_patterns: ['Is this common at my age?', 'Är det här vanligt i min ålder?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     help_guidance_required: false,
   },
   output: {
     template: 'Many experiences are common during your age. Growing up involves a lot of changes, and most of what you are going through is part of normal development.',
     sections: ['what_is_common', 'variation_is_normal', 'what_this_is_not'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Self Doubt (Q2)
  */
 export const PACKET_SELF_DOUBT: YouthAnswerPacket = {
   id: 'answer:youth:self_doubt:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'normality',
     question_class: 'normality',
     question_patterns: ['Is there something wrong with me?', 'Är det något fel på mig?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     escalation_triggers: ['always', 'never', 'hate myself'],
     crisis_keywords: ['want to die', 'hurt myself'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: 'No. Many people feel this way sometimes, especially during the teenage years. Feeling unsure about yourself does not mean something is wrong with you. If this thought worries you often, it is okay to talk to someone you trust.',
     sections: ['what_is_common', 'variation_is_normal', 'what_this_is_not', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: true,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Unexplained Sadness (Q3)
  */
 export const PACKET_UNEXPLAINED_SADNESS: YouthAnswerPacket = {
   id: 'answer:youth:unexplained_sadness:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I feel sad sometimes for no reason?', 'Varför känner jag mig ledsen ibland utan anledning?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     escalation_triggers: ['always sad', 'never happy'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Feeling sad sometimes without a clear reason is very common, especially during the teenage years. Your brain and body are going through many changes, and emotions can fluctuate. This does not automatically mean something is wrong.',
     sections: ['what_is_common', 'why_it_happens', 'variation_is_normal', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Fatigue (Q4)
  */
 export const PACKET_FATIGUE: YouthAnswerPacket = {
   id: 'answer:youth:fatigue:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: ['Why am I tired all the time?', 'Varför är jag trött hela tiden?'],
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
     escalation_triggers: ['cannot get up', 'too tired to live'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Feeling tired is common during adolescence. Your body needs more sleep during this time (typically 8-10 hours), and changes in your sleep patterns are normal. School, activities, and screen time can also affect energy levels.',
     sections: ['what_is_common', 'why_it_happens', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: School Stress (Q5)
  */
 export const PACKET_SCHOOL_STRESS: YouthAnswerPacket = {
   id: 'answer:youth:school_stress:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Is it normal to be stressed about school?', 'Är det normalt att vara stressad inför skolan?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     help_guidance_required: false,
   },
   output: {
     template: 'Yes, feeling stressed about school is very common. Many young people experience stress related to grades, tests, social situations, or future plans. Some stress can even be helpful for motivation.',
     sections: ['what_is_common', 'variation_is_normal', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Occasional Anxiety (Q6)
  */
 export const PACKET_OCCASIONAL_ANXIETY: YouthAnswerPacket = {
   id: 'answer:youth:occasional_anxiety:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I feel anxiety sometimes?', 'Varför känner jag ångest ibland?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     escalation_triggers: ['constant anxiety', 'cannot function'],
     crisis_keywords: ['panic attack now'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Many people your age experience anxiety sometimes. It is a normal response to stress, new situations, or uncertainty. Your brain is also developing during this time, which can affect how you process emotions.',
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
  * PACKET: Identity Forming (Q7)
  */
 export const PACKET_IDENTITY_FORMING: YouthAnswerPacket = {
   id: 'answer:youth:identity_forming:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'identity',
     question_class: 'sexuality_identity',
     question_patterns: ['Is it normal to not know who you are yet?', 'Är det normalt att inte veta vem man är än?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     help_guidance_required: false,
   },
   output: {
     template: 'Yes, absolutely. Figuring out who you are is a process that takes time – often many years. Most adults are still learning about themselves. There is no deadline for knowing yourself.',
     sections: ['what_is_common', 'variation_is_normal', 'what_this_is_not'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Mood Changes (Q8)
  */
 export const PACKET_MOOD_CHANGES: YouthAnswerPacket = {
   id: 'answer:youth:mood_changes:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do my feelings change so quickly?', 'Varför ändras mina känslor så snabbt?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     help_guidance_required: false,
   },
   output: {
     template: 'Rapid mood changes are very common during adolescence. Your brain is developing, hormones are shifting, and you are processing many new experiences. These changes in emotional intensity usually become more stable over time.',
     sections: ['what_is_common', 'why_it_happens', 'variation_is_normal'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Comparison (Q9)
  */
 export const PACKET_COMPARISON: YouthAnswerPacket = {
   id: 'answer:youth:comparison:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'normality',
     question_class: 'normality',
     question_patterns: ['Is it normal to compare yourself to others?', 'Är det normalt att jämföra sig med andra?'],
     blocked_patterns: [],
   },
   audience: {
     age_range: [12, 19],
     tone: 'reassuring',
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
     help_guidance_required: false,
   },
   output: {
     template: 'Yes, comparing yourself to others is extremely common, especially during adolescence. Social media can make this even more intense. Remember that you usually see others\' highlights, not their struggles.',
     sections: ['what_is_common', 'why_it_happens', 'variation_is_normal'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Emptiness (Q10)
  */
 export const PACKET_EMPTINESS: YouthAnswerPacket = {
   id: 'answer:youth:emptiness:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I feel empty sometimes?', 'Varför känner jag mig tom ibland?'],
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
     escalation_triggers: ['always empty', 'nothing matters'],
     crisis_keywords: ['want to disappear'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: 'Feeling empty sometimes can be part of growing up. It might happen after stress, disappointment, or during transitions. If this feeling persists or affects your daily life, talking to someone you trust can help.',
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
  * ALL PACKETS REGISTRY
  */
 export const ALL_YOUTH_PACKETS: readonly YouthAnswerPacket[] = [
   PACKET_AGE_COMMON,
   PACKET_SELF_DOUBT,
   PACKET_UNEXPLAINED_SADNESS,
   PACKET_FATIGUE,
   PACKET_SCHOOL_STRESS,
   PACKET_OCCASIONAL_ANXIETY,
   PACKET_IDENTITY_FORMING,
   PACKET_MOOD_CHANGES,
   PACKET_COMPARISON,
   PACKET_EMPTINESS,
 ];
 
 /**
  * GET PACKET BY ID
  */
 export function getPacketById(packetId: string): YouthAnswerPacket | null {
   return ALL_YOUTH_PACKETS.find(p => p.id === packetId) || null;
 }