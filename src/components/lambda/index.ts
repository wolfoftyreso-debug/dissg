/**
 * Lambda Component Exports
 * 
 * Diagnostic system components for civilization monitoring.
 * ECU/OBD-style interface - no decoration, function only.
 */

// Core components
export { LambdaGauge } from './LambdaGauge';
export { IndexCard } from './IndexCard';
export { CorrelationMatrix } from './CorrelationMatrix';
export { PerformanceQuadrant } from './PerformanceQuadrant';
export { DisclaimerBlock } from './DisclaimerBlock';

// Diagnostic system
export { OscilloscopeView } from './OscilloscopeView';
export { DiagnosticDashboard } from './DiagnosticDashboard';
export { StatusOverview } from './StatusOverview';
export { DiagnosticCodeList } from './DiagnosticCodeList';
export { TriangulationPanel } from './TriangulationPanel';

// Transparency & verification
export { EvidenceLinkBadge } from './EvidenceLinkBadge';
export { ExplanationCard } from './ExplanationCard';
export { AssumptionExposer } from './AssumptionExposer';
export { NumberWithContext, CompactNumber } from './NumberWithContext';

// Re-export diagnostic types and functions
export type { DiagnosticCode, DTCDomain, DTCSeverity, DTCStatus } from '@/lib/lambda/diagnostic-codes';
export { generateDTC, getSeverityColor, getSeverityLabel, getDomainLabel, formatDTCCode } from '@/lib/lambda/diagnostic-codes';

// Re-export probable cause engine
export type { ProbableCause, CauseAnalysis, ExaminationItem } from '@/lib/lambda/probable-cause-engine';
export { analyzeProbableCauses, formatProbability, getConfidenceLabel, getDisclaimer } from '@/lib/lambda/probable-cause-engine';

// Re-export setpoint/tolerance system
export type { SetpointDefinition, ZoneStatus, ZoneAssessment } from '@/lib/lambda/setpoint-tolerance';
export { assessZone, getZoneColor, getZoneLabel, getSetpointDefinition, listSetpoints } from '@/lib/lambda/setpoint-tolerance';

// Lambda System Dashboard
export { LambdaSystemDashboard } from './LambdaSystemDashboard';

// Lambda 1.0 Dashboard
export { Lambda1Dashboard } from './Lambda1Dashboard';
