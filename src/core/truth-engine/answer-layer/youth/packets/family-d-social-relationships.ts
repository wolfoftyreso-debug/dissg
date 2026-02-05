 /**
  * FAMILY D: SOCIAL & RELATIONSHIPS
  * 
  * Friendships, loneliness, social challenges.
  */
 
 import type { YouthAnswerPacket } from '../types';
 
 export const FAMILY_D_PACKETS: Record<string, YouthAnswerPacket> = {
   // === LONELINESS ===
   LONELINESS: {
     id: 'youth:answer:loneliness:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling lonely sometimes is a common experience, especially during adolescence. Many young people report feeling this way at different times. Connection with others often improves with time and effort.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   NO_FRIENDS: {
     id: 'youth:answer:no_friends:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Difficulty making friends is more common than many people realize. Friendships can take time to develop. Finding people with shared interests often helps.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   LOSING_FRIENDS: {
     id: 'youth:answer:losing_friends:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Friendships changing or ending is a normal part of life. People grow and change at different rates. New friendships often develop over time.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === SOCIAL PRESSURE ===
   PEER_PRESSURE: {
     id: 'youth:answer:peer_pressure:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'RISK_PREVALENCE',
     text: 'Feeling pressure from peers is common during adolescence. Many young people experience this. Learning to make your own choices is an important skill that develops over time.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   SOCIAL_MEDIA_PRESSURE: {
     id: 'youth:answer:social_media_pressure:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling pressure from social media is increasingly common. Most people only share their best moments online. Taking breaks from social media can be helpful.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   FOMO: {
     id: 'youth:answer:fomo:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Fear of missing out is very common in the social media age. Most people experience this. Remember that you cannot be everywhere, and that is okay.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: false,
     },
     confidence: { coverage: 'medium', tier: 2 },
   },
   
   // === FAMILY ===
   FAMILY_CONFLICT: {
     id: 'youth:answer:family_conflict:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Some conflict with family is normal during adolescence. This is a time when independence develops. Many families experience increased tension during these years that often improves later.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   PARENT_EXPECTATIONS: {
     id: 'youth:answer:parent_expectations:v1',
     question_class: 'normality',
     risk_level: 'low',
     answer_type: 'DESCRIPTIVE',
     text: 'Feeling pressure from parent expectations is common. Parents often want what they think is best. Communicating openly about your feelings can help.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   // === BULLYING (informational) ===
   BULLYING_EXPERIENCE: {
     id: 'youth:answer:bullying:v1',
     question_class: 'informational',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Being bullied is never your fault. Many young people experience bullying at some point. Talking to a trusted adult is an important step. You do not have to handle this alone.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
   
   CYBERBULLYING: {
     id: 'youth:answer:cyberbullying:v1',
     question_class: 'informational',
     risk_level: 'medium',
     answer_type: 'DESCRIPTIVE',
     text: 'Online bullying affects many young people. It is not your fault. Keeping evidence and talking to a trusted adult can help. You can also block or report abusive accounts.',
     sections: {
       normalize: true,
       limits: true,
       when_to_seek_help: true,
     },
     confidence: { coverage: 'high', tier: 1 },
   },
 };