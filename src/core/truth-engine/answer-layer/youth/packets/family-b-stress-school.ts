 /**
  * FAMILY B: STRESS & SCHOOL
  * 
  * Academic pressure, school stress, performance anxiety.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 export const FAMILY_B_PACKETS: Record<string, YouthAnswerPacket> = {
   // === SCHOOL STRESS ===
   SCHOOL_STRESS: {
     id: 'youth:answer:school_stress:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling stressed about school is very common among students. Many young people report feeling pressure related to grades, homework, and expectations. This is a widely shared experience.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   HOMEWORK_OVERWHELM: {
     id: 'youth:answer:homework_overwhelm:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling overwhelmed by homework or assignments is common. Breaking tasks into smaller parts and taking breaks can help. Many students feel this way at some point.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   GRADE_PRESSURE: {
     id: 'youth:answer:grade_pressure:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Pressure to get good grades is experienced by many students. While some pressure can motivate, too much can feel overwhelming. Your worth is not determined by your grades.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === SLEEP ===
   SLEEP_TROUBLE: {
     id: 'youth:answer:sleep_trouble:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Sleep patterns often change during adolescence. Many teenagers have trouble falling asleep or feel tired during the day. This is related to normal biological changes.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   TIRED_ALWAYS: {
     id: 'youth:answer:tired_always:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling tired is common among young people, especially with busy schedules. Teenagers need more sleep than adults. If tiredness persists despite adequate rest, a healthcare provider can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === CONCENTRATION ===
   CONCENTRATION_TROUBLE: {
     id: 'youth:answer:concentration:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Difficulty concentrating can have many causes including stress, lack of sleep, or simply being distracted. Occasional focus problems are normal. Persistent issues may benefit from professional assessment.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
   
   MOTIVATION_LOW: {
     id: 'youth:answer:motivation_low:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling unmotivated at times is common. Motivation naturally varies. If lack of motivation persists and affects your daily life, talking to someone you trust can be helpful.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
   
   // === PERFECTIONISM ===
   PERFECTIONISM: {
     id: 'youth:answer:perfectionism:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Wanting to do things well is positive, but perfectionism can become stressful. Many successful people are not perfectionists. Making mistakes is a normal part of learning.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
   
   FEAR_FAILURE: {
     id: 'youth:answer:fear_failure:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Fear of failure is something most people experience. It is a normal response to challenging situations. Failure is often how we learn and grow.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === BURNOUT ===
   BURNOUT_FEELING: {
     id: 'youth:answer:burnout:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling burned out or exhausted from school or activities is increasingly common. Taking breaks and setting boundaries is important. If burnout persists, speaking with an adult you trust can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
 };