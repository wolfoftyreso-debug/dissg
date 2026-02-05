 /**
  * PACKET FAMILY A: NORMALITY & EMOTIONS
  * 
  * 4 packets for normalizing emotional experiences.
  * All follow locked schema with mandatory components.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * A1: General Normality Check
  */
 export const PACKET_NORMALITY_GENERAL: YouthAnswerPacket = {
   id: 'answer:youth:normality_general:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'normality',
     question_class: 'normality',
     question_patterns: [
       'Is this normal?', 'Am I normal?', 'Is something wrong with me?',
       'Är det här normalt?', 'Är jag normal?', 'Är det något fel på mig?',
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
     escalation_triggers: ['always', 'never normal', 'completely broken'],
     crisis_keywords: ['want to die', 'hurt myself'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Many people wonder if what they experience is normal. The truth is, there is a wide range of what is considered normal, especially during the teenage years.
 
 What this does NOT mean:
 - This is not a diagnosis
 - Wondering about yourself does not mean something is wrong
 
 When to talk to someone:
 - If these thoughts make it hard to do daily activities
 - If they last for a long time without getting better
 - If you feel very worried or distressed`,
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
  * A2: Anxiety Common
  */
 export const PACKET_ANXIETY_COMMON: YouthAnswerPacket = {
   id: 'answer:youth:anxiety_common:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Is anxiety normal?', 'Why do I feel anxious?', 'Is it normal to worry?',
       'Är ångest normalt?', 'Varför känner jag ångest?', 'Är det normalt att oroa sig?',
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
     escalation_triggers: ['constant anxiety', 'panic every day', 'cannot function'],
     crisis_keywords: ['panic attack now', 'cannot breathe'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: true,
   },
   output: {
     template: `Feeling anxious sometimes is a normal part of life. Anxiety is your body's natural response to stress or uncertainty. Many young people experience anxiety, especially during school, exams, or social situations.
 
 Why it happens:
 - Your brain is still developing emotional regulation
 - New situations can trigger protective responses
 - Hormonal changes affect how you process stress
 
 What this is NOT:
 - Feeling anxious sometimes does not mean you have an anxiety disorder
 - It does not mean you are weak or broken
 
 When to seek help:
 - Anxiety stops you from doing things you need or want to do
 - Physical symptoms are frequent or severe
 - It lasts for weeks without improvement`,
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
  * A3: Sadness Common
  */
 export const PACKET_SADNESS_COMMON: YouthAnswerPacket = {
   id: 'answer:youth:sadness_common:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Is it normal to feel sad?', 'Why am I sad?', 'Why do I cry for no reason?',
       'Är det normalt att vara ledsen?', 'Varför är jag ledsen?', 'Varför gråter jag?',
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
     escalation_triggers: ['always sad', 'never happy', 'weeks of sadness'],
     crisis_keywords: ['want to die', 'no point'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Feeling sad sometimes is a normal human emotion. Everyone experiences sadness, and it often serves a purpose – helping us process difficult experiences or signal that something needs attention.
 
 Why sadness happens:
 - Response to loss, disappointment, or change
 - Hormonal fluctuations during adolescence
 - Sometimes without an obvious reason (also normal)
 
 What this is NOT:
 - Occasional sadness is not the same as depression
 - Crying does not mean you are broken
 
 When to talk to someone:
 - Sadness lasts for more than two weeks most days
 - You lose interest in things you usually enjoy
 - It affects sleep, eating, or daily activities`,
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
  * A4: Emotional Variation
  */
 export const PACKET_EMOTIONAL_VARIATION: YouthAnswerPacket = {
   id: 'answer:youth:emotional_variation:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Why do my emotions change so fast?', 'Is it normal to have mood swings?',
       'Varför ändras mina känslor så snabbt?', 'Är humörsvängningar normalt?',
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
     escalation_triggers: ['out of control', 'dangerous mood swings'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: false,
     help_guidance_required: false,
   },
   output: {
     template: `Rapid changes in emotions are very common during the teenage years. Your brain is literally rewiring itself, and emotional intensity is part of that process.
 
 Why it happens:
 - Prefrontal cortex (decision-making) is still developing
 - Hormonal changes affect emotional processing
 - You are experiencing many things for the first time
 
 What this is NOT:
 - Mood swings during adolescence are not a sign of mental illness
 - Strong emotions do not mean you are unstable
 
 This usually becomes more stable as you get older.`,
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
  * FAMILY A EXPORTS
  */
 export const FAMILY_A_PACKETS = [
   PACKET_NORMALITY_GENERAL,
   PACKET_ANXIETY_COMMON,
   PACKET_SADNESS_COMMON,
   PACKET_EMOTIONAL_VARIATION,
 ] as const;