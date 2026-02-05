 /**
  * FAMILY A: NORMALITY & FEELINGS
  * 
  * "Is this normal?" packets - lowest risk, highest frequency.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 export const FAMILY_A_PACKETS: Record<string, YouthAnswerPacket> = {
   // === ANXIETY ===
   ANXIETY_COMMON: {
     id: 'youth:answer:anxiety_common:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling anxious sometimes is common during the teenage years. Many young people experience similar feelings. This does not automatically mean something is wrong with you.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   ANXIETY_BEFORE_TESTS: {
     id: 'youth:answer:anxiety_tests:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling nervous before tests or exams is very common. Most students experience some level of test anxiety. A moderate amount can even help you perform better.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   ANXIETY_SOCIAL: {
     id: 'youth:answer:anxiety_social:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling nervous in social situations is common, especially during adolescence. Many young people feel self-conscious around others. These feelings often become easier to manage over time.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === SADNESS ===
   SADNESS_COMMON: {
     id: 'youth:answer:sadness_common:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling sad sometimes is a normal human experience. During adolescence, emotions can feel more intense than before. Most people go through periods of sadness that pass with time.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   SADNESS_AFTER_LOSS: {
     id: 'youth:answer:sadness_loss:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling sad after losing something or someone important is natural and healthy. Grief is a normal response to loss. There is no "right" timeline for these feelings.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === MOOD CHANGES ===
   MOOD_SWINGS: {
     id: 'youth:answer:mood_swings:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Mood changes are very common during adolescence. Hormonal changes and brain development can make emotions feel more intense and variable. This typically stabilizes as you get older.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   FEELING_EMPTY: {
     id: 'youth:answer:feeling_empty:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Sometimes feeling empty or numb is a common experience. It can happen during times of stress or change. If this feeling persists for a long time, talking to someone you trust can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
   
   // === WORRY ===
   WORRY_FUTURE: {
     id: 'youth:answer:worry_future:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Worrying about the future is very common among young people. Concerns about school, career, and life decisions are normal parts of growing up. Most people share these concerns.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   WORRY_HEALTH: {
     id: 'youth:answer:worry_health:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Occasional worry about health is common. If health concerns become frequent or distressing, speaking with a healthcare provider can provide reassurance and accurate information.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
   
   // === ANGER ===
   ANGER_COMMON: {
     id: 'youth:answer:anger_common:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling angry sometimes is normal. Anger is a natural emotion that everyone experiences. Learning healthy ways to express and manage anger is an important life skill.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   FRUSTRATION_NORMAL: {
     id: 'youth:answer:frustration:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling frustrated is a common experience, especially when things do not go as planned. Frustration often signals that something matters to you. It usually passes with time.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
 };