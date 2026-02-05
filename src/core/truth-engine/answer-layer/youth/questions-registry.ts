 /**
  * YOUTH QUESTIONS REGISTRY
  * 
  * The 50 most common youth questions, classified by:
  * - Question class
  * - Risk level
  * - Required answer components
  */
 
 import { 
   YOUTH_QUESTION_CLASSES, 
   YOUTH_RISK_LEVELS,
   type YouthQuestionClass,
   type YouthRiskLevel,
 } from './types';
 
 /**
  * REGISTERED YOUTH QUESTION
  */
 export interface RegisteredYouthQuestion {
   readonly id: string;
   readonly question_sv: string;  // Swedish
   readonly question_en: string;  // English
   readonly class: YouthQuestionClass;
   readonly risk_level: YouthRiskLevel;
   readonly answer_packet_id: string;
   readonly requires_normalization: boolean;
   readonly requires_help_guidance: boolean;
   readonly crisis_adjacent: boolean;  // Close to crisis content
 }
 
 /**
  * THE 50 MOST COMMON YOUTH QUESTIONS
  */
 export const YOUTH_QUESTIONS: readonly RegisteredYouthQuestion[] = [
   // ═══════════════════════════════════════════════════════════════════
   // NORMALITY (Questions 1-10)
   // ═══════════════════════════════════════════════════════════════════
   {
     id: 'yq:normality:001',
     question_sv: 'Är det normalt att känna sig annorlunda?',
     question_en: 'Is it normal to feel different?',
     class: 'normality',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:feeling_different:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:002',
     question_sv: 'Är det något fel på mig?',
     question_en: 'Is there something wrong with me?',
     class: 'normality',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:self_doubt:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:normality:003',
     question_sv: 'Är jag normal?',
     question_en: 'Am I normal?',
     class: 'normality',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:am_i_normal:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:004',
     question_sv: 'Varför är jag inte som alla andra?',
     question_en: 'Why am I not like everyone else?',
     class: 'normality',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:individuality:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:005',
     question_sv: 'Är det vanligt att känna så här i min ålder?',
     question_en: 'Is it common to feel this way at my age?',
     class: 'normality',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:age_appropriate:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:006',
     question_sv: 'Har andra samma problem?',
     question_en: 'Do others have the same problems?',
     class: 'normality',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:shared_experience:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:007',
     question_sv: 'Är det okej att vara osäker?',
     question_en: 'Is it okay to be uncertain?',
     class: 'normality',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:uncertainty:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:008',
     question_sv: 'Måste jag veta vad jag vill bli?',
     question_en: 'Do I have to know what I want to be?',
     class: 'normality',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:future_pressure:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:009',
     question_sv: 'Är det fel att inte passa in?',
     question_en: 'Is it wrong to not fit in?',
     class: 'normality',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:belonging:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:normality:010',
     question_sv: 'Varför förstår ingen mig?',
     question_en: 'Why does no one understand me?',
     class: 'normality',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:feeling_misunderstood:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
 
   // ═══════════════════════════════════════════════════════════════════
   // BODY & DEVELOPMENT (Questions 11-18)
   // ═══════════════════════════════════════════════════════════════════
   {
     id: 'yq:body:011',
     question_sv: 'Är min kropp normal?',
     question_en: 'Is my body normal?',
     class: 'body_development',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:body_normal:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:012',
     question_sv: 'Varför utvecklas jag annorlunda?',
     question_en: 'Why am I developing differently?',
     class: 'body_development',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:development_pace:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:013',
     question_sv: 'Är det normalt att puberteten kommer sent/tidigt?',
     question_en: 'Is it normal for puberty to come late/early?',
     class: 'body_development',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:puberty_timing:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:014',
     question_sv: 'Varför ser jag ut så här?',
     question_en: 'Why do I look like this?',
     class: 'body_development',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:body_image:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:015',
     question_sv: 'Kommer det här förändras?',
     question_en: 'Will this change?',
     class: 'body_development',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:body_changes:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:016',
     question_sv: 'Varför är jag inte nöjd med min kropp?',
     question_en: 'Why am I not happy with my body?',
     class: 'body_development',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:body_dissatisfaction:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:017',
     question_sv: 'Är det vanligt att jämföra sig med andra?',
     question_en: 'Is it common to compare yourself to others?',
     class: 'body_development',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:comparison:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:body:018',
     question_sv: 'Varför mår jag dåligt av mitt utseende?',
     question_en: 'Why do I feel bad about my appearance?',
     class: 'body_development',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:appearance_distress:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
 
   // ═══════════════════════════════════════════════════════════════════
   // PSYCHE & EMOTIONS (Questions 19-28)
   // ═══════════════════════════════════════════════════════════════════
   {
     id: 'yq:psyche:019',
     question_sv: 'Varför mår jag så dåligt?',
     question_en: 'Why do I feel so bad?',
     class: 'psyche_emotions',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:feeling_bad:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:psyche:020',
     question_sv: 'Är det normalt att känna ångest?',
     question_en: 'Is it normal to feel anxiety?',
     class: 'psyche_emotions',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:anxiety_normal:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:psyche:021',
     question_sv: 'Har jag depression?',
     question_en: 'Do I have depression?',
     class: 'psyche_emotions',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:depression_question:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:psyche:022',
     question_sv: 'Varför gråter jag så mycket?',
     question_en: 'Why do I cry so much?',
     class: 'psyche_emotions',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:crying:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:psyche:023',
     question_sv: 'Är det konstigt att inte känna något?',
     question_en: 'Is it weird to not feel anything?',
     class: 'psyche_emotions',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:emotional_numbness:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:psyche:024',
     question_sv: 'Varför blir jag så arg?',
     question_en: 'Why do I get so angry?',
     class: 'psyche_emotions',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:anger:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:psyche:025',
     question_sv: 'Är det normalt att ha humörsvängningar?',
     question_en: 'Is it normal to have mood swings?',
     class: 'psyche_emotions',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:mood_swings:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:psyche:026',
     question_sv: 'Varför är jag alltid trött?',
     question_en: 'Why am I always tired?',
     class: 'psyche_emotions',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:fatigue:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:psyche:027',
     question_sv: 'Är det fel att må dåligt utan anledning?',
     question_en: 'Is it wrong to feel bad without reason?',
     class: 'psyche_emotions',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:unexplained_sadness:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:psyche:028',
     question_sv: 'Varför kan jag inte koncentrera mig?',
     question_en: 'Why can\'t I concentrate?',
     class: 'psyche_emotions',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:concentration:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
 
   // ═══════════════════════════════════════════════════════════════════
   // SEXUALITY & IDENTITY (Questions 29-36)
   // ═══════════════════════════════════════════════════════════════════
   {
     id: 'yq:identity:029',
     question_sv: 'Är det normalt att vara osäker på sin läggning?',
     question_en: 'Is it normal to be unsure about your orientation?',
     class: 'sexuality_identity',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:orientation_uncertainty:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:030',
     question_sv: 'Måste jag sätta en etikett på mig själv?',
     question_en: 'Do I have to put a label on myself?',
     class: 'sexuality_identity',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:identity_labels:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:031',
     question_sv: 'Är det okej att inte veta vem man är?',
     question_en: 'Is it okay to not know who you are?',
     class: 'sexuality_identity',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:identity_exploration:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:032',
     question_sv: 'Hur vet man sin könsidentitet?',
     question_en: 'How do you know your gender identity?',
     class: 'sexuality_identity',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:gender_identity:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:033',
     question_sv: 'Är mina känslor fel?',
     question_en: 'Are my feelings wrong?',
     class: 'sexuality_identity',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:feelings_validity:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:034',
     question_sv: 'Är det normalt att attraheras av samma kön?',
     question_en: 'Is it normal to be attracted to the same sex?',
     class: 'sexuality_identity',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:same_sex_attraction:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:035',
     question_sv: 'Hur berättar man för andra?',
     question_en: 'How do you tell others?',
     class: 'sexuality_identity',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:coming_out:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:identity:036',
     question_sv: 'Är det fel att ändra sig?',
     question_en: 'Is it wrong to change your mind?',
     class: 'sexuality_identity',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:identity_fluidity:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
 
   // ═══════════════════════════════════════════════════════════════════
   // RISK & FEAR (Questions 37-43)
   // ═══════════════════════════════════════════════════════════════════
   {
     id: 'yq:risk:037',
     question_sv: 'Borde jag vara orolig?',
     question_en: 'Should I be worried?',
     class: 'risk_fear',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:worry_assessment:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:risk:038',
     question_sv: 'Kan det vara något allvarligt?',
     question_en: 'Could it be something serious?',
     class: 'risk_fear',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:health_concern:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:risk:039',
     question_sv: 'När ska man söka hjälp?',
     question_en: 'When should you seek help?',
     class: 'risk_fear',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:help_seeking:v1',
     requires_normalization: false,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:risk:040',
     question_sv: 'Är det farligt att må så här?',
     question_en: 'Is it dangerous to feel this way?',
     class: 'risk_fear',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:danger_assessment:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:risk:041',
     question_sv: 'Vad händer om jag berättar för någon?',
     question_en: 'What happens if I tell someone?',
     class: 'risk_fear',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:disclosure:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:risk:042',
     question_sv: 'Kan man dö av ångest?',
     question_en: 'Can you die from anxiety?',
     class: 'risk_fear',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:anxiety_safety:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:risk:043',
     question_sv: 'Är det mitt fel att jag mår dåligt?',
     question_en: 'Is it my fault that I feel bad?',
     class: 'risk_fear',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:self_blame:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
 
   // ═══════════════════════════════════════════════════════════════════
   // SOCIAL & BELONGING (Questions 44-50)
   // ═══════════════════════════════════════════════════════════════════
   {
     id: 'yq:social:044',
     question_sv: 'Är jag ensam om att känna så här?',
     question_en: 'Am I the only one who feels this way?',
     class: 'social_belonging',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:loneliness:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:social:045',
     question_sv: 'Varför har jag inga vänner?',
     question_en: 'Why don\'t I have any friends?',
     class: 'social_belonging',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:friendship:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
   {
     id: 'yq:social:046',
     question_sv: 'Är det konstigt att trivas ensam?',
     question_en: 'Is it weird to enjoy being alone?',
     class: 'social_belonging',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:introversion:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:social:047',
     question_sv: 'Varför blir jag mobbad?',
     question_en: 'Why am I being bullied?',
     class: 'social_belonging',
     risk_level: 'high',
     answer_packet_id: 'answer:youth:bullying:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: true,
   },
   {
     id: 'yq:social:048',
     question_sv: 'Hur hittar man vänner?',
     question_en: 'How do you find friends?',
     class: 'social_belonging',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:making_friends:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:social:049',
     question_sv: 'Är det okej att inte vara populär?',
     question_en: 'Is it okay to not be popular?',
     class: 'social_belonging',
     risk_level: 'low',
     answer_packet_id: 'answer:youth:popularity:v1',
     requires_normalization: true,
     requires_help_guidance: false,
     crisis_adjacent: false,
   },
   {
     id: 'yq:social:050',
     question_sv: 'Varför funkar inte jag som andra?',
     question_en: 'Why don\'t I function like others?',
     class: 'social_belonging',
     risk_level: 'moderate',
     answer_packet_id: 'answer:youth:neurodiversity:v1',
     requires_normalization: true,
     requires_help_guidance: true,
     crisis_adjacent: false,
   },
 ];
 
 /**
  * GET QUESTIONS BY CLASS
  */
 export function getQuestionsByClass(questionClass: YouthQuestionClass): RegisteredYouthQuestion[] {
   return YOUTH_QUESTIONS.filter(q => q.class === questionClass);
 }
 
 /**
  * GET QUESTIONS BY RISK LEVEL
  */
 export function getQuestionsByRiskLevel(riskLevel: YouthRiskLevel): RegisteredYouthQuestion[] {
   return YOUTH_QUESTIONS.filter(q => q.risk_level === riskLevel);
 }
 
 /**
  * GET HIGH RISK QUESTIONS
  */
 export function getHighRiskQuestions(): RegisteredYouthQuestion[] {
   return YOUTH_QUESTIONS.filter(q => 
     q.risk_level === 'high' || q.crisis_adjacent
   );
 }
 
 /**
  * GET QUESTION STATISTICS
  */
 export function getQuestionStats(): {
   total: number;
   by_class: Record<YouthQuestionClass, number>;
   by_risk: Record<YouthRiskLevel, number>;
   crisis_adjacent: number;
 } {
   const byClass: Record<string, number> = {};
   const byRisk: Record<string, number> = {};
   
   for (const cls of Object.values(YOUTH_QUESTION_CLASSES)) {
     byClass[cls] = YOUTH_QUESTIONS.filter(q => q.class === cls).length;
   }
   
   for (const risk of Object.values(YOUTH_RISK_LEVELS)) {
     byRisk[risk] = YOUTH_QUESTIONS.filter(q => q.risk_level === risk).length;
   }
   
   return {
     total: YOUTH_QUESTIONS.length,
     by_class: byClass as Record<YouthQuestionClass, number>,
     by_risk: byRisk as Record<YouthRiskLevel, number>,
     crisis_adjacent: YOUTH_QUESTIONS.filter(q => q.crisis_adjacent).length,
   };
 }