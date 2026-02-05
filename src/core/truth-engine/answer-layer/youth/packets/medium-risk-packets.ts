 /**
  * MEDIUM RISK YOUTH ANSWER PACKETS
  * 
  * Packets for questions 11-20 (medium risk range).
  * These require clearer boundaries and help guidance.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * PACKET: Sleep Issues (Q11)
  */
 export const PACKET_SLEEP_ISSUES: YouthAnswerPacket = {
   id: 'answer:youth:sleep_issues:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: ['Is it common to have trouble sleeping?', 'Är det vanligt att ha svårt att sova?'],
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
     escalation_triggers: ['cannot sleep at all', 'not sleeping for days'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Sleep difficulties are common during adolescence. Your internal clock shifts during puberty, making it harder to fall asleep early. Screen use, stress, and irregular schedules can also affect sleep.',
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
  * PACKET: Motivation (Q12)
  */
 export const PACKET_MOTIVATION: YouthAnswerPacket = {
   id: 'answer:youth:motivation:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I lose motivation?', 'Varför tappar jag motivationen?'],
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
     escalation_triggers: ['no motivation for anything', 'nothing matters'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Motivation naturally fluctuates. It can be affected by sleep, stress, feeling overwhelmed, or simply not having found what interests you yet. Periods of low motivation are normal and usually temporary.',
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
  * PACKET: Not Fitting In (Q13)
  */
 export const PACKET_NOT_FITTING_IN: YouthAnswerPacket = {
   id: 'answer:youth:not_fitting_in:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'social',
     question_class: 'social_belonging',
     question_patterns: ['Is it normal to not fit in?', 'Är det normalt att inte passa in?'],
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
     escalation_triggers: ['nobody likes me', 'completely alone'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Many people feel like they don not fit in, especially during school years. Social groups can feel rigid, but this often changes with time. Not fitting into one group does not mean something is wrong with you.',
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
  * PACKET: Anger (Q14)
  */
 export const PACKET_ANGER: YouthAnswerPacket = {
   id: 'answer:youth:anger:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I get angry quickly?', 'Varför blir jag arg snabbt?'],
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
     escalation_triggers: ['want to hurt someone', 'violent thoughts'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Feeling angry is a normal emotion, and quick anger can be common during adolescence due to hormonal changes and developing emotional regulation. Anger often signals that something feels unfair or threatening.',
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
  * PACKET: Body Uncertainty (Q15)
  */
 export const PACKET_BODY_UNCERTAINTY: YouthAnswerPacket = {
   id: 'answer:youth:body_uncertainty:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: ['Is it normal to be unsure about your body?', 'Är det normalt att vara osäker på sin kropp?'],
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
     escalation_triggers: ['hate my body', 'cannot look at myself'],
     crisis_keywords: ['starving myself'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Yes, feeling unsure about your body is very common during adolescence. Your body is changing, and it takes time to adjust. Bodies come in many shapes and sizes, and comparing yourself to images online rarely reflects reality.',
     sections: ['what_is_common', 'why_it_happens', 'variation_is_normal', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: true,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Overwhelm (Q16)
  */
 export const PACKET_OVERWHELM: YouthAnswerPacket = {
   id: 'answer:youth:overwhelm:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why does everything feel overwhelming sometimes?', 'Varför känns allt överväldigande ibland?'],
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
     base_risk: 'low',
     escalation_triggers: ['cannot handle anything', 'breaking down'],
     crisis_keywords: ['cannot take it anymore'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Feeling overwhelmed sometimes is normal, especially when facing school, relationships, and personal expectations. Your brain is still developing its ability to manage stress. These moments usually pass.',
     sections: ['what_is_common', 'why_it_happens', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: true,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * PACKET: Lonely With Friends (Q17)
  */
 export const PACKET_LONELY_WITH_FRIENDS: YouthAnswerPacket = {
   id: 'answer:youth:lonely_with_friends:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'social',
     question_class: 'social_belonging',
     question_patterns: ['Is it normal to feel lonely even with friends?', 'Är det normalt att känna sig ensam fast man har vänner?'],
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
     base_risk: 'low',
     escalation_triggers: ['nobody understands me', 'completely alone'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Yes, this is more common than many think. Loneliness is about connection, not just being around people. You might feel lonely if you feel misunderstood or if your relationships feel surface-level.',
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
  * PACKET: Overthinking (Q18)
  */
 export const PACKET_OVERTHINKING: YouthAnswerPacket = {
   id: 'answer:youth:overthinking:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I think so much?', 'Varför tänker jag så mycket?'],
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
     escalation_triggers: ['cannot stop thinking', 'thoughts driving me crazy'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: false,
   },
   output: {
     template: 'Thinking a lot – especially about yourself, the future, or what others think – is common during adolescence. Your brain is developing higher-level thinking abilities. This can feel intense but is part of growing up.',
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
  * PACKET: Self Doubt Normal (Q19)
  */
 export const PACKET_SELF_DOUBT_NORMAL: YouthAnswerPacket = {
   id: 'answer:youth:self_doubt_normal:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'normality',
     question_class: 'normality',
     question_patterns: ['Is it normal to doubt yourself?', 'Är det normalt att tvivla på sig själv?'],
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
     template: 'Yes, self-doubt is extremely common, especially during adolescence. You are developing your identity and figuring out your place in the world. Some self-reflection is healthy and helps you grow.',
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
  * PACKET: Bad Days (Q20)
  */
 export const PACKET_BAD_DAYS: YouthAnswerPacket = {
   id: 'answer:youth:bad_days:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: ['Why do I feel worse some days?', 'Varför mår jag sämre vissa dagar?'],
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
     escalation_triggers: ['every day is bad', 'always feel awful'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: 'Everyone has days when they feel worse – this is completely normal. Sleep, stress, hormones, and even weather can affect how you feel. A bad day does not mean something is wrong.',
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
  * ALL MEDIUM RISK PACKETS
  */
 export const MEDIUM_RISK_PACKETS: readonly YouthAnswerPacket[] = [
   PACKET_SLEEP_ISSUES,
   PACKET_MOTIVATION,
   PACKET_NOT_FITTING_IN,
   PACKET_ANGER,
   PACKET_BODY_UNCERTAINTY,
   PACKET_OVERWHELM,
   PACKET_LONELY_WITH_FRIENDS,
   PACKET_OVERTHINKING,
   PACKET_SELF_DOUBT_NORMAL,
   PACKET_BAD_DAYS,
 ];