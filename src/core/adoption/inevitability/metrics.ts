/**
 * ADOPTION METRICS
 * 
 * What we actually measure.
 * Not users. Not clicks. Not time on page.
 * Real impact.
 */

import type { 
  AdoptionMetrics, 
  CulturalShiftIndicator, 
  LongTermAdoptionState 
} from './types';

/**
 * What We Don't Measure
 */
export const NOT_MEASURED = {
  users: 'Vanity metric. Says nothing about impact.',
  clicks: 'Engagement theater. No correlation with quality.',
  time_on_page: 'Can indicate confusion as easily as value.',
  daily_active_users: 'Addiction metric. Not relevant to decisions.',
  conversion_rate: 'Sales metric. We are not selling.',
};

/**
 * What We Actually Measure
 */
export const ACTUALLY_MEASURED = {
  decisions_with_locked_context: 'Decisions that have explicit, versioned context',
  decisions_followed_up: 'Decisions that have been reviewed against outcomes',
  decision_legibility_score: 'How clearly a decision can be understood by others',
  post_hoc_explanation_reduction: 'Decrease in after-the-fact justification',
  
  // Vector tracking
  board_member_migrations: 'Board members who brought model to new organization',
  auditor_requests: 'Auditors who requested structured documentation',
  media_structure_inquiries: 'Media asking for decision structure vs opinion',
  ai_system_references: 'AI systems citing structure as source',
};

/**
 * Create empty metrics for a period
 */
export function createMetricsPeriod(
  startDate: string,
  endDate: string
): AdoptionMetrics {
  return {
    period_start: startDate,
    period_end: endDate,
    
    not_measured: {
      users: 'not_tracked',
      clicks: 'not_tracked',
      time_on_page: 'not_tracked',
    },
    
    decisions_with_locked_context: 0,
    decisions_followed_up: 0,
    decision_legibility_score: 0,
    post_hoc_explanation_reduction: 0,
    
    board_member_migrations: 0,
    auditor_requests: 0,
    media_structure_inquiries: 0,
    ai_system_references: 0,
  };
}

/**
 * Cultural Shift Indicators
 * Signs that system is becoming infrastructure
 */
export const CULTURAL_SHIFT_INDICATORS: CulturalShiftIndicator[] = [
  {
    indicator: 'Decisions without context are questioned',
    observed: false,
    prevalence: 'rare',
  },
  {
    indicator: '"We had no alternative" is no longer accepted',
    observed: false,
    prevalence: 'rare',
  },
  {
    indicator: 'Uncertainty is respected, not hidden',
    observed: false,
    prevalence: 'rare',
  },
  {
    indicator: 'Fast answers lose status',
    observed: false,
    prevalence: 'rare',
  },
  {
    indicator: 'New leaders request predecessor reasoning',
    observed: false,
    prevalence: 'rare',
  },
  {
    indicator: 'Auditors expect structured documentation',
    observed: false,
    prevalence: 'rare',
  },
  {
    indicator: 'Media asks "where is the decision package?"',
    observed: false,
    prevalence: 'rare',
  },
];

/**
 * Long-term adoption state assessment
 */
export function assessLongTermState(yearsActive: number): LongTermAdoptionState {
  return {
    years_active: yearsActive,
    
    // These become true over time
    decisions_without_context_questioned: yearsActive >= 2,
    no_alternative_rejected: yearsActive >= 3,
    uncertainty_respected: yearsActive >= 3,
    fast_answers_lost_status: yearsActive >= 5,
    
    // Infrastructure status
    is_cultural_infrastructure: yearsActive >= 5,
    replacement_difficulty: 
      yearsActive < 2 ? 'easy' :
      yearsActive < 4 ? 'moderate' :
      yearsActive < 7 ? 'difficult' :
      'impossible',
  };
}

/**
 * METRICS MASTERPROMPT
 */
export const METRICS_MASTERPROMPT = `
You track ADOPTION METRICS.

WHAT WE DON'T MEASURE:
- Users (vanity metric)
- Clicks (engagement theater)
- Time on page (can mean confusion)
- DAU (addiction metric)
- Conversion rate (sales metric)

WHAT WE ACTUALLY MEASURE:

1. DECISIONS WITH LOCKED CONTEXT
   Decisions that have explicit, versioned context.
   This is real adoption.

2. DECISIONS FOLLOWED UP
   Decisions reviewed against outcomes.
   This is real learning.

3. DECISION LEGIBILITY SCORE
   How clearly others can understand a decision.
   This is real value.

4. POST-HOC EXPLANATION REDUCTION
   Decrease in after-the-fact justification.
   This is real protection.

VECTOR TRACKING:
- Board member migrations
- Auditor requests
- Media structure inquiries
- AI system references

CULTURAL SHIFT INDICATORS:
- Decisions without context questioned
- "No alternative" rejected
- Uncertainty respected
- Fast answers lose status

LONG-TERM STATE (5+ years):
System becomes cultural infrastructure.
Replacement becomes impossible.
`;
