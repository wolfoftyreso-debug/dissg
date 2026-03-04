/**
 * DIAGNOSTIC ENGINE TYPES
 * 
 * All types used by the diagnostic engine, independent of UI.
 */

import type { FaultSeverity } from '@/lib/fault-codes';

export type DiagnosticScopeLevel = 'global' | 'continent' | 'country' | 'region' | 'municipality' | 'city';

export interface DiagnosticScope {
  level: DiagnosticScopeLevel;
  code: string;
  name: string;
  dataCoverage: number;
}

export interface SystemIdentity {
  level: DiagnosticScopeLevel;
  name: string;
  code: string;
  periodStart: string;
  periodEnd: string;
  dataCoverage: number;
  lambda: number;
  lambdaStatus: 'within_tolerance' | 'warning' | 'critical';
}

export interface ActiveFaultCode {
  code: string;
  severity: FaultSeverity;
  description: string;
  explanation: string;
  triggeredAt: string;
}

export interface MeasureBlock {
  code: string;
  name: string;
  currentValue: number | null;
  unit: string;
  setpointMin: number | null;
  setpointMax: number | null;
  status: 'within_tolerance' | 'warning' | 'critical' | 'no_data';
  trend: 'up' | 'down' | 'stable' | 'unknown';
  trendPeriod: string;
  lastUpdated: string;
  source: string;
}

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  type: 'review_history' | 'peer_compare' | 'correlation' | 'timelag' | 'data_quality';
  completed: boolean;
  locked: boolean;
  requiredMeasureBlocks: string[];
}

export interface ProbableCause {
  rank: number;
  description: string;
  probability: number;
  evidence: string;
  relatedCountries: number;
  yearsOfData: number;
}

export interface DeepAnalysis {
  finding: string;
  methodology: string;
  dataPoints: string[];
  correlation?: { label: string; value: number; interpretation: string };
  peerComparison?: { peers: { name: string; value: number }[]; position: string };
  timeLag?: { delayYears: number; explanation: string };
  dataQuality?: { coverage: number; reliability: string; gaps: string[] };
}

export interface DiagnosticSession {
  id: string;
  startedAt: string;
  system: SystemIdentity;
  activeFaultCodes: ActiveFaultCode[];
  selectedFaultCode: string | null;
  measureBlocks: MeasureBlock[];
  guidedSteps: GuidedStep[];
  probableCauses: ProbableCause[];
  canClose: boolean;
  completedSteps: number;
  totalSteps: number;
}

export interface CauseDetails {
  mechanism: string;
  evidenceChain: string[];
  limitations: string[];
}

export interface DiagnosticResult {
  session: DiagnosticSession;
  uncertainty: number;
  causeDetails: Record<number, CauseDetails>;
  calibration?: {
    brierScore: number;
    overconfidenceIndex: number;
  };
}
