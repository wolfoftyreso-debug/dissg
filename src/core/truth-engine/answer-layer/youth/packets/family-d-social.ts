 /**
  * PACKET FAMILY D: SOCIAL & IDENTITY
  * 
  * 4 packets for social and identity questions.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * D1: Loneliness
  */
 export const PACKET_LONELINESS: YouthAnswerPacket = {
   id: 'answer:youth:loneliness:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'social',
     question_class: 'social_belonging',
     question_patterns: [
       'Why do I feel lonely?', 'Is it normal to feel alone?',
       'Varför känner jag mig ensam?', 'Är det normalt att känna sig ensam?',
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
     escalation_triggers: ['completely alone', 'nobody cares', 'invisible'],
     crisis_keywords: ['nobody would miss me'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Loneliness is a very common feeling, especially during adolescence. You can even feel lonely when surrounded by people, if you do not feel truly understood or connected.
 
 Why it happens:
 - Social needs increase during adolescence
 - Feeling misunderstood or different
 - Transitions (new school, friends moving)
 - Social media can increase feelings of isolation
 
 What this is NOT:
 - Feeling lonely does not mean you are unlikable
 - It is not a permanent state
 
 When to seek help:
 - Loneliness lasts for a long time and affects your mood
 - You have no one you feel you can talk to
 - Thoughts of hopelessness accompany the loneliness`,
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
  * D2: Not Fitting In
  */
 export const PACKET_NOT_FITTING_IN_DETAILED: YouthAnswerPacket = {
   id: 'answer:youth:not_fitting_in:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'social',
     question_class: 'social_belonging',
     question_patterns: [
       'Why don I not fit in?', 'Is something wrong with me for not fitting in?',
       'Varför passar jag inte in?', 'Är det fel på mig som inte passar in?',
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
     escalation_triggers: ['will never fit in', 'nobody wants me', 'outsider forever'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Many people feel like they do not fit in, especially during school years. This feeling is extremely common and often changes over time as you find your people and places.
 
 Why it happens:
 - School environments can be rigid and cliquey
 - Interests and values develop at different rates
 - Being different is not the same as being wrong
 
 What this is NOT:
 - Not fitting into one group does not mean you are flawed
 - Many successful, happy adults felt the same way
 
 When to seek help:
 - Feeling excluded leads to significant distress
 - You are being actively bullied or isolated
 - The feeling affects your ability to go to school or function`,
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
  * D3: Identity Uncertainty
  */
 export const PACKET_IDENTITY_UNCERTAINTY: YouthAnswerPacket = {
   id: 'answer:youth:identity_uncertainty:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'identity',
     question_class: 'sexuality_identity',
     question_patterns: [
       'Is it normal to not know who I am?', 'Why don I know what I want?',
       'Är det normalt att inte veta vem jag är?', 'Varför vet jag inte vad jag vill?',
     ],
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
     escalation_triggers: ['no identity', 'do not exist'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: false,
   },
   output: {
     template: `Not knowing who you are yet is completely normal – in fact, it is one of the main tasks of adolescence. Identity develops over time through experiences, relationships, and exploration.
 
 Why this is normal:
 - Identity formation is a process, not an event
 - Trying different things and changing your mind is healthy
 - Most adults are still learning about themselves
 
 What this is NOT:
 - Not having a fixed identity does not mean something is wrong
 - You do not need to have everything figured out
 - There is no deadline for knowing yourself`,
     sections: ['what_is_common', 'why_it_happens', 'what_this_is_not'],
     mandatory_disclaimers: ['This is general information, not a diagnosis.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: false,
   },
 };
 
 /**
  * D4: Social Media Comparison
  */
 export const PACKET_COMPARISON_SOCIAL_MEDIA: YouthAnswerPacket = {
   id: 'answer:youth:comparison_social_media:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'social',
     question_class: 'social_belonging',
     question_patterns: [
       'Why do I compare myself to others online?', 'Is it normal to feel bad about social media?',
       'Varför jämför jag mig med andra online?', 'Är det normalt att må dåligt av sociala medier?',
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
     escalation_triggers: ['everyone is better than me', 'worthless compared to'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Comparing yourself to what you see online is extremely common. Social media often shows only the best moments, not reality. This can make everyone else look happier, more successful, or more attractive than they really are.
 
 Why it happens:
 - Social media shows curated highlights, not real life
 - Comparison is a natural human tendency
 - Algorithms show content that keeps you engaged (often comparison-driving content)
 
 What this is NOT:
 - Feeling affected by social media does not mean you are weak
 - Everyone is influenced by what they see, even if they do not admit it
 
 When to seek help:
 - Social media consistently makes you feel bad about yourself
 - You cannot stop comparing even though it hurts
 - It is affecting your eating, sleep, or daily mood`,
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
  * FAMILY D EXPORTS
  */
 export const FAMILY_D_PACKETS = [
   PACKET_LONELINESS,
   PACKET_NOT_FITTING_IN_DETAILED,
   PACKET_IDENTITY_UNCERTAINTY,
   PACKET_COMPARISON_SOCIAL_MEDIA,
 ] as const;