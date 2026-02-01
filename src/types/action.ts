export interface Action {
  id: string;
  title: string;
  description: string;
  category: 'policy' | 'investment' | 'regulation' | 'organizational' | 'communication';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  effect: {
    score: number;
    description: string;
    magnitude: string;
    confidence: number;
  };
  cost: {
    score: number;
    estimate: string;
    type: 'one_time' | 'recurring' | 'mixed';
  };
  risk: {
    score: number;
    factors: string[];
    mitigation: string;
  };
  implementation: {
    complexity: 'low' | 'medium' | 'high';
    responsible_ministry: string;
    key_stakeholders: string[];
    first_steps: string[];
  };
  dependencies: string[];
  side_effects: {
    positive: string[];
    negative: string[];
  };
  priority_score: number;
  reversibility?: number;
}

export interface ActionEvaluation {
  id: string;
  action_id: string;
  effect_score: number;
  cost_score: number;
  risk_score: number;
  reversibility_score: number;
  weighted_score: number;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'monitor';
  effect_rationale: string;
  cost_rationale: string;
  risk_rationale: string;
  reversibility_rationale: string;
  summary: string;
  recommendation: string;
  potential_side_effects: string[];
  dependencies: string[];
  kpi_impact_forecast: { kpi_id: string; expected_change_percent: number; confidence: number }[] | null;
  evaluated_at: string;
}

export interface DecisionData {
  actions: Action[];
  summary: {
    recommended_action: string;
    rationale: string;
    alternative_approach: string;
    warning?: string;
  };
  quick_wins: string[];
  requires_legislation: string[];
}
