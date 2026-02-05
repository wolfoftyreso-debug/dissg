 /**
  * FAMILY C: BODY & IDENTITY
  * 
  * Body image, physical changes, identity questions.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 export const FAMILY_C_PACKETS: Record<string, YouthAnswerPacket> = {
   // === BODY IMAGE ===
   BODY_IMAGE: {
     id: 'youth:answer:body_image:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling self-conscious about your body is very common, especially during adolescence. Most young people experience concerns about their appearance at some point. Bodies come in all shapes and sizes.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   BODY_CHANGES: {
     id: 'youth:answer:body_changes:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Physical changes during puberty happen at different times and rates for everyone. There is no "normal" timeline. If you have concerns about development, a healthcare provider can offer guidance.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   COMPARING_OTHERS: {
     id: 'youth:answer:comparing_others:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Comparing yourself to others is a common human tendency. Social media can make this worse. Remember that you usually see only the best parts of others lives.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === IDENTITY ===
   IDENTITY_QUESTIONS: {
     id: 'youth:answer:identity_questions:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Questioning who you are and what you want is a normal part of growing up. Identity develops over time. There is no rush to have everything figured out.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   FEELING_DIFFERENT: {
     id: 'youth:answer:feeling_different:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling different from others is common during adolescence. Many people feel this way. Differences often become strengths as you get older.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   NOT_FITTING_IN: {
     id: 'youth:answer:not_fitting_in:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling like you do not fit in is experienced by many young people. Finding your own group or community often takes time. You are not alone in feeling this way.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === SELF-ESTEEM ===
   LOW_SELF_ESTEEM: {
     id: 'youth:answer:low_self_esteem:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling unsure about yourself is common, especially during teenage years. Self-esteem often improves with age and experience. Speaking with someone you trust can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   SELF_DOUBT: {
     id: 'youth:answer:self_doubt:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Self-doubt is something most people experience. It often shows you care about doing well. Even confident-seeming people have doubts.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === PUBERTY ===
   PUBERTY_TIMING: {
     id: 'youth:answer:puberty_timing:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Puberty can start anywhere between ages 8 and 14 for different people. There is a wide range of normal. If you have concerns, a healthcare provider can answer specific questions.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   VOICE_CHANGES: {
     id: 'youth:answer:voice_changes:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Voice changes during puberty are completely normal. The timing and degree of change varies for everyone. This is a natural part of growing up.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
 };