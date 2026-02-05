 /**
  * PACKET FAMILY B: STRESS & SCHOOL
  * 
  * 4 packets for stress-related questions.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * B1: School Stress
  */
 export const PACKET_SCHOOL_STRESS_DETAILED: YouthAnswerPacket = {
   id: 'answer:youth:school_stress:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Is school stress normal?', 'Why am I stressed about school?',
       'Är det normalt att stressa över skolan?', 'Varför stressar jag över skolan?',
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
     escalation_triggers: ['cannot go to school', 'failing everything'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `School stress is extremely common. Most students experience it at some point, especially around exams, deadlines, or when expectations feel high.
 
 Why it happens:
 - Performance pressure from yourself or others
 - Many demands competing for your time
 - Fear of failure or disappointing others
 
 What this is NOT:
 - Stress does not mean you cannot handle things
 - Feeling overwhelmed sometimes is not a sign of weakness
 
 When to seek help:
 - Stress makes you avoid school regularly
 - Physical symptoms (headaches, stomach problems) are frequent
 - You cannot concentrate or sleep because of worry`,
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
  * B2: Sleep Problems
  */
 export const PACKET_SLEEP_PROBLEMS: YouthAnswerPacket = {
   id: 'answer:youth:sleep_problems:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'body',
     question_class: 'body_development',
     question_patterns: [
       'Why can I not sleep?', 'Is it normal to have trouble sleeping?',
       'Varför kan jag inte sova?', 'Är det normalt att ha svårt att sova?',
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
     escalation_triggers: ['not slept in days', 'hallucinating'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Sleep difficulties are very common during adolescence. Your internal clock naturally shifts, making it harder to fall asleep early and wake up early.
 
 Why it happens:
 - Biological clock shifts during puberty (delayed sleep phase)
 - Screens and blue light affect melatonin
 - Stress, worry, or an active mind
 - Irregular schedules
 
 What this is NOT:
 - Trouble sleeping does not automatically mean you have insomnia
 - Needing more sleep (8-10 hours) is normal at your age
 
 When to seek help:
 - Sleep problems last for weeks
 - Daytime functioning is seriously affected
 - You feel unsafe due to lack of sleep`,
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
  * B3: Motivation Loss
  */
 export const PACKET_MOTIVATION_LOSS: YouthAnswerPacket = {
   id: 'answer:youth:motivation_loss:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Why do I have no motivation?', 'Is it normal to lose motivation?',
       'Varför har jag ingen motivation?', 'Är det normalt att tappa motivationen?',
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
     base_risk: 'low',
     escalation_triggers: ['no motivation for anything', 'nothing matters', 'pointless'],
     crisis_keywords: ['no point in living'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Losing motivation happens to everyone sometimes. It can be frustrating, but it is usually temporary and does not mean something is wrong with you.
 
 Why it happens:
 - Tiredness, stress, or burnout
 - Not having found what interests you yet
 - Feeling overwhelmed by too many demands
 - Natural fluctuations in energy and drive
 
 What this is NOT:
 - Temporary loss of motivation is not laziness
 - It does not mean you will never be motivated again
 
 When to seek help:
 - You have lost interest in almost everything for weeks
 - It is combined with persistent sadness or hopelessness
 - Daily tasks feel impossible`,
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
  * B4: Overwhelm
  */
 export const PACKET_OVERWHELM_DETAILED: YouthAnswerPacket = {
   id: 'answer:youth:overwhelm:v1',
  version: '1',
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Why do I feel overwhelmed?', 'Is it normal to feel overwhelmed?',
       'Varför känns allt överväldigande?', 'Är det normalt att känna sig överväldigad?',
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
     base_risk: 'low',
     escalation_triggers: ['cannot take it', 'breaking down', 'falling apart'],
     crisis_keywords: ['cannot take it anymore', 'want to give up'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Feeling overwhelmed is a very common experience, especially when facing multiple demands at once. Your brain is still developing its capacity to manage stress.
 
 Why it happens:
 - Too many things demanding attention at once
 - High expectations (your own or others')
 - Lack of rest or recovery time
 - Major life changes or transitions
 
 What this is NOT:
 - Feeling overwhelmed does not mean you are failing
 - It does not mean you cannot handle life
 
 When to seek help:
 - The feeling is constant and does not improve with rest
 - You are having thoughts of escape or giving up
 - It affects your ability to function daily`,
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
  * FAMILY B EXPORTS
  */
 export const FAMILY_B_PACKETS = [
   PACKET_SCHOOL_STRESS_DETAILED,
   PACKET_SLEEP_PROBLEMS,
   PACKET_MOTIVATION_LOSS,
   PACKET_OVERWHELM_DETAILED,
 ] as const;