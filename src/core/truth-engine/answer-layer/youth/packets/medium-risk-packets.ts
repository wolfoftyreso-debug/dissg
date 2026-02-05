 /**
  * MEDIUM RISK PACKETS
  * 
  * Topics that require more careful handling but are not crisis-level.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 export const MEDIUM_RISK_PACKETS: Record<string, YouthAnswerPacket> = {
   // === PERSISTENT FEELINGS ===
   SADNESS_PERSISTENT: {
     id: 'youth:answer:sadness_persistent:v1',
     question_class: 'normality',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'If sadness lasts for weeks and affects your daily life, talking to someone can help. Persistent sadness is treatable. You do not have to go through this alone.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
     help_urgency: 'recommended',
   },
   
   ANXIETY_SEVERE: {
     id: 'youth:answer:anxiety_severe:v1',
     question_class: 'normality',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'When anxiety becomes overwhelming or prevents you from doing things you want to do, professional support can help. Anxiety is very treatable. Many people feel better with the right help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
     help_urgency: 'recommended',
   },
   
   HOPELESSNESS: {
     id: 'youth:answer:hopelessness:v1',
     question_class: 'normality',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Feelings of hopelessness can be very hard to experience. These feelings often improve with support. Talking to a trusted adult or calling a helpline is an important step.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
     help_urgency: 'encouraged',
   },
   
   // === EATING & BODY ===
   EATING_CONCERNS: {
     id: 'youth:answer:eating_concerns:v1',
     question_class: 'normality',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Concerns about eating and weight are common but can become serious. If eating is causing you distress or affecting your health, speaking with a healthcare provider is important.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
     help_urgency: 'recommended',
   },
   
   // === SUBSTANCES (informational only) ===
   ALCOHOL_PRESSURE: {
     id: 'youth:answer:alcohol_pressure:v1',
     question_class: 'informational',
     risk_level: 'medium',
     answer_type: 'RISK_PREVALENCE',
     text: 'Many young people face pressure around alcohol. It is okay to say no. Having strategies ready can help. If you are worried about your own or someone elses use, help is available.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === RELATIONSHIP ISSUES ===
   UNHEALTHY_RELATIONSHIP: {
     id: 'youth:answer:unhealthy_relationship:v1',
     question_class: 'informational',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Healthy relationships should feel safe and respectful. If someone makes you feel scared, controlled, or hurt, that is not okay. Talking to a trusted adult or helpline can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
     help_urgency: 'encouraged',
   },
   
   // === ISOLATION ===
   WITHDRAWING: {
     id: 'youth:answer:withdrawing:v1',
     question_class: 'normality',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Wanting to be alone sometimes is normal. If you are withdrawing from everything and everyone for a long time, talking to someone you trust can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
     help_urgency: 'recommended',
   },
 };