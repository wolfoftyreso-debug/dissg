 /**
  * FAMILY E: HELP-SEEKING & SUPPORT
  * 
  * Questions about getting help, talking to others.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 export const FAMILY_E_PACKETS: Record<string, YouthAnswerPacket> = {
   // === TALKING TO SOMEONE ===
   TALKING_HARD: {
     id: 'youth:answer:talking_hard:v1',
     question_class: 'help_seeking',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Finding it hard to talk about feelings is very common. Many people feel this way. You can start small, choose someone you trust, and take your time.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   WHO_TO_TALK_TO: {
     id: 'youth:answer:who_to_talk:v1',
     question_class: 'help_seeking',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'You can talk to many different people: a parent or guardian, a teacher, a school counselor, a trusted family member, or a helpline. Choose whoever feels safest to you.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   SCARED_TO_ASK_HELP: {
     id: 'youth:answer:scared_ask_help:v1',
     question_class: 'help_seeking',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling scared to ask for help is normal. Many people feel this way. Asking for help is actually a sign of strength. Most adults want to help when asked.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === PROFESSIONAL HELP ===
   WHAT_IS_THERAPY: {
     id: 'youth:answer:what_is_therapy:v1',
     question_class: 'informational',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Therapy is talking with a trained professional about your thoughts and feelings. It is confidential and can help with many different challenges. Many people find it helpful.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   THERAPY_STIGMA: {
     id: 'youth:answer:therapy_stigma:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Seeing a therapist or counselor is common and nothing to be ashamed of. Many successful people have gotten professional support. Taking care of your mental health is just as important as physical health.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === HELPLINES ===
   HOW_HELPLINES_WORK: {
     id: 'youth:answer:helplines:v1',
     question_class: 'informational',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Helplines are confidential services where you can talk to trained listeners. You can call, text, or chat online. They are free and available 24/7 in many countries.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   ANONYMOUS_HELP: {
     id: 'youth:answer:anonymous_help:v1',
     question_class: 'informational',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'You can get help anonymously through helplines, online chat services, and some apps. You do not have to share your name or identity if you are not ready.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === SUPPORTING OTHERS ===
   HELPING_A_FRIEND: {
     id: 'youth:answer:helping_friend:v1',
     question_class: 'informational',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'If you are worried about a friend, listening without judgment is important. Encourage them to talk to a trusted adult. You do not have to solve their problems alone.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   WORRIED_ABOUT_SOMEONE: {
     id: 'youth:answer:worried_about_someone:v1',
     question_class: 'help_seeking',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Being worried about someone shows you care. If you think they might be in danger, telling a trusted adult is the right thing to do, even if they asked you not to.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
 };