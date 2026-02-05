/**
 * ADOPTION METRICS
 * 
 * We don't measure:
 * - Users
 * - Clicks
 * - Sessions
 * 
 * We measure:
 * - Number of GDG-validated decisions
 * - Number of external validator calls
 * - Number of referenced Answer IDs
 * - Number of blocked (non-compliant) attempts
 * 
 * The more blocked → the stronger the standard.
 */

/**
 * METRIC TYPES
 */
export interface AdoptionMetric {
  metric_id: string;
  metric_name: string;
  description: string;
  type: 'count' | 'rate' | 'ratio';
  direction: 'higher_better' | 'lower_better' | 'neutral';
}

export const ADOPTION_METRICS: AdoptionMetric[] = [
  {
    metric_id: 'gdg_validated_decisions',
    metric_name: 'GDG-Validated Decisions',
    description: 'Total number of decisions that passed GDG validation',
    type: 'count',
    direction: 'higher_better',
  },
  {
    metric_id: 'external_validator_calls',
    metric_name: 'External Validator Calls',
    description: 'Number of validation requests from external systems',
    type: 'count',
    direction: 'higher_better',
  },
  {
    metric_id: 'answer_id_references',
    metric_name: 'Answer ID References',
    description: 'Number of times canonical Answer Packets were referenced',
    type: 'count',
    direction: 'higher_better',
  },
  {
    metric_id: 'blocked_attempts',
    metric_name: 'Blocked Attempts',
    description: 'Non-compliant attempts blocked by validator',
    type: 'count',
    direction: 'higher_better', // More blocked = stronger standard
  },
  {
    metric_id: 'compliance_rate',
    metric_name: 'Compliance Rate',
    description: 'Percentage of submissions that pass validation',
    type: 'rate',
    direction: 'neutral', // Neither good nor bad inherently
  },
  {
    metric_id: 'partner_integrations',
    metric_name: 'Partner Integrations',
    description: 'Number of systems using Partner SDK',
    type: 'count',
    direction: 'higher_better',
  },
  {
    metric_id: 'badge_issuances',
    metric_name: 'Badge Issuances',
    description: 'Total GDG-Compliant badges issued',
    type: 'count',
    direction: 'higher_better',
  },
  {
    metric_id: 'unique_domains',
    metric_name: 'Unique Domains',
    description: 'Number of distinct domains using GDG',
    type: 'count',
    direction: 'higher_better',
  },
];

/**
 * METRIC SNAPSHOT
 */
export interface MetricSnapshot {
  timestamp: string;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: Record<string, number>;
}

/**
 * ADOPTION TRACKER (in-memory for demo)
 */
export class AdoptionTracker {
  private metrics: Map<string, number> = new Map();
  private history: MetricSnapshot[] = [];

  constructor() {
    // Initialize all metrics to 0
    for (const metric of ADOPTION_METRICS) {
      this.metrics.set(metric.metric_id, 0);
    }
  }

  /**
   * INCREMENT A METRIC
   */
  increment(metric_id: string, amount: number = 1): void {
    const current = this.metrics.get(metric_id) || 0;
    this.metrics.set(metric_id, current + amount);
  }

  /**
   * GET CURRENT VALUE
   */
  get(metric_id: string): number {
    return this.metrics.get(metric_id) || 0;
  }

  /**
   * GET ALL CURRENT METRICS
   */
  getAll(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of this.metrics) {
      result[key] = value;
    }
    return result;
  }

  /**
   * RECORD VALIDATION EVENT
   */
  recordValidation(passed: boolean, external: boolean = false): void {
    if (external) {
      this.increment('external_validator_calls');
    }
    
    if (passed) {
      this.increment('gdg_validated_decisions');
    } else {
      this.increment('blocked_attempts');
    }
  }

  /**
   * RECORD ANSWER PACKET REFERENCE
   */
  recordAnswerReference(packet_id: string): void {
    this.increment('answer_id_references');
  }

  /**
   * RECORD BADGE ISSUANCE
   */
  recordBadgeIssuance(level: string): void {
    if (level === 'compliant') {
      this.increment('badge_issuances');
    }
  }

  /**
   * TAKE SNAPSHOT
   */
  takeSnapshot(period: MetricSnapshot['period']): MetricSnapshot {
    const snapshot: MetricSnapshot = {
      timestamp: new Date().toISOString(),
      period,
      metrics: this.getAll(),
    };
    this.history.push(snapshot);
    return snapshot;
  }

  /**
   * GET HISTORY
   */
  getHistory(): MetricSnapshot[] {
    return [...this.history];
  }

  /**
   * CALCULATE COMPLIANCE RATE
   */
  getComplianceRate(): number {
    const passed = this.get('gdg_validated_decisions');
    const blocked = this.get('blocked_attempts');
    const total = passed + blocked;
    
    if (total === 0) return 0;
    return Math.round((passed / total) * 100);
  }
}

/**
 * GLOBAL TRACKER INSTANCE
 */
export const adoptionTracker = new AdoptionTracker();

/**
 * WHY WE MEASURE BLOCKS
 */
export const BLOCK_METRIC_RATIONALE = {
  principle: 'The more blocked → the stronger the standard',
  explanation: [
    'Blocks indicate the standard is being enforced',
    'High block rate shows the standard has teeth',
    'Decreasing block rate over time shows adoption improving',
    'Zero blocks could mean standard is too loose or not used',
  ],
  healthy_pattern: 'Initially high blocks, decreasing over time as ecosystem learns',
};
