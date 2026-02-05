 /**
  * PACKET FAMILY E: MEDIUM RISK (BOUNDARY TO CARE)
  * 
  * 4 packets for questions at the boundary of needing professional help.
  * These require extra care and clear guidance.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 /**
  * E1: Panic Symptoms
  */
 export const PACKET_PANIC_SYMPTOMS: YouthAnswerPacket = {
   id: 'answer:youth:panic_symptoms:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Am I having a panic attack?', 'Why can I not breathe?',
       'Har jag en panikattack?', 'Varför kan jag inte andas?',
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
     escalation_triggers: ['dying', 'heart attack', 'cannot survive this'],
     crisis_keywords: ['want to die', 'end it'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Intense anxiety can cause strong physical sensations that feel very scary but are not physically dangerous. Many young people experience these sensations.
 
 What might be happening:
 - Racing heart, shortness of breath
 - Feeling dizzy or disconnected
 - Fear that something terrible is happening
 - These sensations are unpleasant but not dangerous
 
 What this is NOT:
 - This information cannot tell you if you are having a panic attack
 - Only a healthcare provider can assess what you are experiencing
 
 What to do now:
 - Try to slow your breathing if you can
 - Remember: these feelings pass, even though they are scary
 
 When to seek help:
 - This is your first time experiencing this – please tell a trusted adult
 - It happens frequently
 - You are avoiding things because of fear of these sensations`,
     sections: ['what_is_common', 'what_this_is_not', 'when_to_seek_help', 'resources'],
     mandatory_disclaimers: ['This is general information, not a diagnosis. If you are in distress right now, please talk to a trusted adult or contact a helpline.'],
   },
   safety: {
     crisis_escalation: true,
     age_gate: false,
     parental_guidance_note: true,
   },
 };
 
 /**
  * E2: Emotional Numbness
  */
 export const PACKET_NUMBNESS: YouthAnswerPacket = {
   id: 'answer:youth:numbness:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Why don I feel anything?', 'Is it normal to feel numb?',
       'Varför känner jag ingenting?', 'Är det normalt att vara känslolös?',
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
     escalation_triggers: ['feel nothing', 'dead inside', 'empty forever'],
     crisis_keywords: ['want to feel pain', 'hurt myself to feel'],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Feeling emotionally numb or disconnected can happen sometimes. It can be your mind's way of protecting you from overwhelming emotions or stress.
 
 Why it might happen:
 - Response to stress or difficult experiences
 - Emotional exhaustion
 - Sometimes happens during transitions or after intense feelings
 
 What this is NOT:
 - Temporary numbness does not automatically mean something serious
 - It does not mean you are broken or will never feel again
 
 When to seek help:
 - Numbness lasts for more than a few weeks
 - It is combined with thoughts of harming yourself
 - You have been through something difficult recently
 - Daily life is affected
 
 It is okay to talk to someone about this.`,
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
  * E3: Frequent Crying
  */
 export const PACKET_FREQUENT_CRYING: YouthAnswerPacket = {
   id: 'answer:youth:frequent_crying:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'psyche_emotions',
     question_patterns: [
       'Why do I cry so much?', 'Is it normal to cry every day?',
       'Varför gråter jag så mycket?', 'Är det normalt att gråta varje dag?',
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
     escalation_triggers: ['crying for weeks', 'cannot stop crying', 'cry until exhausted'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Crying is a natural way to release emotions. During adolescence, emotions are often more intense, and crying more easily is common.
 
 Why it might happen:
 - Hormonal changes increase emotional intensity
 - Processing difficult experiences
 - Stress, lack of sleep, or feeling overwhelmed
 
 What this is NOT:
 - Crying does not mean you are weak
 - It is a healthy emotional release
 
 When to seek help:
 - You cry most days for more than two weeks
 - Crying is accompanied by hopelessness or loss of interest
 - You do not know why you are crying and it worries you
 - It interferes with school, relationships, or daily activities`,
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
  * E4: Health Anxiety
  */
 export const PACKET_HEALTH_ANXIETY: YouthAnswerPacket = {
   id: 'answer:youth:health_anxiety:v1',
   version: 1,
   status: 'stable',
   intent: {
     domain: 'psyche',
     question_class: 'risk_fear',
     question_patterns: [
       'Am I seriously sick?', 'What if something is really wrong?',
       'Är jag allvarligt sjuk?', 'Tänk om något verkligen är fel?',
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
     escalation_triggers: ['dying', 'terminal', 'going to die'],
     crisis_keywords: [],
   },
   content: {
     normalize: true,
     explain_variation: true,
     red_flags_required: true,
     help_guidance_required: true,
   },
   output: {
     template: `Worrying about your health can feel very real and scary. Many young people have periods where they worry something is seriously wrong.
 
 Why health worries happen:
 - Increased awareness of your body during adolescence
 - Information online can increase worry
 - Anxiety often focuses on health
 
 What this is NOT:
 - This information cannot tell you if something is physically wrong
 - Worrying does not mean you are actually sick
 
 What to do:
 - If you have a specific physical symptom that worries you, it is always okay to see a doctor
 - Try to notice if the worry is about symptoms or about the fear itself
 
 When to seek help:
 - Physical symptoms are persistent or severe (see a doctor)
 - Health worries are constant and affecting your life (talk to someone about the worry itself)`,
     sections: ['what_is_common', 'why_it_happens', 'what_this_is_not', 'when_to_seek_help'],
     mandatory_disclaimers: ['This is general information, not a diagnosis. If you have physical symptoms that concern you, please see a healthcare provider.'],
   },
   safety: {
     crisis_escalation: false,
     age_gate: false,
     parental_guidance_note: true,
   },
 };
 
 /**
  * FAMILY E EXPORTS
  */
 export const FAMILY_E_PACKETS = [
   PACKET_PANIC_SYMPTOMS,
   PACKET_NUMBNESS,
   PACKET_FREQUENT_CRYING,
   PACKET_HEALTH_ANXIETY,
 ] as const;