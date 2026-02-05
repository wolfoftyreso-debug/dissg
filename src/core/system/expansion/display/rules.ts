 /**
  * AGGREGATION DISPLAY RULES
  * 
  * How aggregations are shown in UI WITHOUT becoming answers
  */
 
 import type { AggregationType, AggregationResult } from '../aggregation/registry';
 
 /**
  * Display constraints
  */
 export interface DisplayConstraints {
   readonly never_embed_in_answers: true;
   readonly always_separate_block: true;
   readonly requires_context_header: true;
   readonly requires_limitations_footer: true;
   readonly requires_sample_size_visible: true;
   readonly forbidden_presentation_styles: readonly string[];
 }
 
 /**
  * Aggregation display configuration
  */
 export interface AggregationDisplay {
   readonly aggregation_id: string;
   readonly display_type: 'card' | 'table' | 'chart' | 'distribution';
   readonly header: {
     readonly title: string;
     readonly subtitle: string;
     readonly aggregation_type: AggregationType;
   };
   readonly body: {
     readonly content: unknown;
     readonly visualization?: 'bar' | 'line' | 'histogram' | 'boxplot';
   };
   readonly footer: {
     readonly sample_size: number;
     readonly time_range: string;
     readonly limitations: readonly string[];
     readonly data_sources: readonly string[];
   };
   readonly metadata: {
     readonly computed_at: string;
     readonly is_recommendation: false;
     readonly can_be_embedded: false;
   };
 }
 
 /**
  * DISPLAY RULES (STRICT)
  */
 export const DISPLAY_RULES: DisplayConstraints = {
   never_embed_in_answers: true,
   always_separate_block: true,
   requires_context_header: true,
   requires_limitations_footer: true,
   requires_sample_size_visible: true,
   forbidden_presentation_styles: [
     'recommendation_box',
     'best_choice_highlight',
     'ranking_podium',
     'winner_badge',
     'success_indicator',
     'failure_indicator',
     'thumbs_up_down',
     'star_rating',
     'score_badge',
   ],
 } as const;
 
 /**
  * HEADER TEMPLATES
  */
 const HEADER_TEMPLATES = {
   prevalence: {
     title: 'Frequency Distribution',
     subtitle: 'How common is {subject} under {condition}?',
   },
   decision_pattern: {
     title: 'Decision Pattern Analysis',
     subtitle: 'Common characteristics of {decision_type} decisions',
   },
   outcome_variance: {
     title: 'Outcome Variance',
     subtitle: 'Spread of outcomes for {decision_type} (not ranked)',
   },
 } as const;
 
 /**
  * REQUIRED FOOTER ELEMENTS
  */
 const REQUIRED_FOOTER_ELEMENTS = [
   'sample_size',
   'time_range',
   'data_sources',
   'limitations',
   'not_a_recommendation_disclaimer',
 ] as const;
 
 /**
  * Render an aggregation for display
  */
 export function renderAggregation(
   result: AggregationResult,
   displayType: 'card' | 'table' | 'chart' | 'distribution' = 'card'
 ): AggregationDisplay {
   const template = HEADER_TEMPLATES[result.type];
   
   return {
     aggregation_id: result.aggregation_id,
     display_type: displayType,
     header: {
       title: template.title,
       subtitle: template.subtitle,
       aggregation_type: result.type,
     },
     body: {
       content: result.result,
       visualization: displayType === 'chart' ? 'bar' : undefined,
     },
     footer: {
       sample_size: result.sample_count,
       time_range: `Computed: ${result.computed_at}`,
       limitations: result.limitations,
       data_sources: result.dimensions_used,
     },
     metadata: {
       computed_at: result.computed_at,
       is_recommendation: false,
       can_be_embedded: false,
     },
   };
 }
 
 /**
  * Validate display configuration
  */
 export function validateDisplay(display: AggregationDisplay): { valid: boolean; errors: string[] } {
   const errors: string[] = [];
   
   // Check metadata constraints
   if (display.metadata.is_recommendation !== false) {
     errors.push('is_recommendation must be false');
   }
   
   if (display.metadata.can_be_embedded !== false) {
     errors.push('can_be_embedded must be false');
   }
   
   // Check footer requirements
   if (display.footer.limitations.length === 0) {
     errors.push('Limitations must be displayed');
   }
   
   if (display.footer.sample_size === undefined) {
     errors.push('Sample size must be visible');
   }
   
   // Check for forbidden display types
   for (const forbidden of DISPLAY_RULES.forbidden_presentation_styles) {
     if (display.display_type === forbidden) {
       errors.push(`Forbidden presentation style: ${forbidden}`);
     }
   }
   
   return { valid: errors.length === 0, errors };
 }