 /**
  * SELF-IMPROVEMENT DAILY PROMPTS
  * 
  * The system's conscience.
  * These questions must be answerable daily.
  */
 
 // =============================================================================
 // MANDATORY DAILY QUESTIONS
 // =============================================================================
 
 export interface DiagnosticQuestion {
   id: string;
   category: 'semantic' | 'structural' | 'coverage' | 'consistency' | 'source';
   question: string;
   expectedAnswer: 'list' | 'count' | 'boolean' | 'percentage';
   threshold?: {
     warning: number;
     critical: number;
   };
   remediation: string;
 }
 
 export const DAILY_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
   // Semantic questions
   {
     id: 'SEM-001',
     category: 'semantic',
     question: 'Which concepts are semantically overlapping?',
     expectedAnswer: 'list',
     remediation: 'Split overlapping concepts into distinct schema versions with explicit relations',
   },
   {
     id: 'SEM-002',
     category: 'semantic',
     question: 'Are there concepts used but never formally declared?',
     expectedAnswer: 'list',
     remediation: 'Create formal schema definitions for all undeclared concepts',
   },
   
   // Structural questions
   {
     id: 'STR-001',
     category: 'structural',
     question: 'Are there entities without any relations?',
     expectedAnswer: 'list',
     remediation: 'Orphan entities must be linked or marked as root entities',
   },
   {
     id: 'STR-002',
     category: 'structural',
     question: 'What percentage of relations are bidirectionally navigable?',
     expectedAnswer: 'percentage',
     threshold: { warning: 95, critical: 80 },
     remediation: 'Create inverse relations for all one-way links',
   },
   
   // Coverage questions
   {
     id: 'COV-001',
     category: 'coverage',
     question: 'Are there measures without defined units?',
     expectedAnswer: 'list',
     remediation: 'All measures must have explicit unit definitions',
   },
   {
     id: 'COV-002',
     category: 'coverage',
     question: 'Are there time series with discontinuities?',
     expectedAnswer: 'list',
     remediation: 'Document gaps or fill with explicit null values',
   },
   {
     id: 'COV-003',
     category: 'coverage',
     question: 'What percentage of entities have complete temporal coverage?',
     expectedAnswer: 'percentage',
     threshold: { warning: 90, critical: 70 },
     remediation: 'Add valid_from/valid_to to all entities',
   },
   
   // Consistency questions
   {
     id: 'CON-001',
     category: 'consistency',
     question: 'Are there sources that contradict each other on the same fact?',
     expectedAnswer: 'list',
     remediation: 'Document contradictions explicitly, never silently resolve',
   },
   {
     id: 'CON-002',
     category: 'consistency',
     question: 'How many schema versions are in active use?',
     expectedAnswer: 'count',
     remediation: 'Migrate old data to latest schema or maintain explicit version bridges',
   },
   
   // Source questions
   {
     id: 'SRC-001',
     category: 'source',
     question: 'What percentage of data points have verified sources?',
     expectedAnswer: 'percentage',
     threshold: { warning: 99, critical: 95 },
     remediation: 'Reject data without source attribution',
   },
   {
     id: 'SRC-002',
     category: 'source',
     question: 'Are there sources with reliability scores below threshold?',
     expectedAnswer: 'list',
     remediation: 'Flag low-reliability sources in all outputs',
   },
 ];
 
 // =============================================================================
 // DIAGNOSTIC RUNNER
 // =============================================================================
 
 export interface DiagnosticResult {
   questionId: string;
   question: string;
   answer: unknown;
   status: 'healthy' | 'warning' | 'critical';
   timestamp: string;
   details?: string;
 }
 
 export interface DailyDiagnosticReport {
   date: string;
   overallHealth: 'healthy' | 'warning' | 'critical';
   results: DiagnosticResult[];
   actionItems: string[];
 }
 
 /**
  * Run all daily diagnostics
  */
 export function runDailyDiagnostics(
   dataAccessor: {
     query: (question: string) => Promise<unknown>;
   }
 ): Promise<DailyDiagnosticReport> {
   // This would connect to actual data layer
   // For now, return structure
   return Promise.resolve({
     date: new Date().toISOString().split('T')[0],
     overallHealth: 'healthy',
     results: [],
     actionItems: [],
   });
 }
 
 /**
  * Check if a result violates thresholds
  */
 export function evaluateResult(
   question: DiagnosticQuestion,
   value: number
 ): 'healthy' | 'warning' | 'critical' {
   if (!question.threshold) return 'healthy';
   
   if (value < question.threshold.critical) return 'critical';
   if (value < question.threshold.warning) return 'warning';
   return 'healthy';
 }
 
 /**
  * Get questions by category
  */
 export function getQuestionsByCategory(
   category: DiagnosticQuestion['category']
 ): DiagnosticQuestion[] {
   return DAILY_DIAGNOSTIC_QUESTIONS.filter(q => q.category === category);
 }
 
 /**
  * Get all action items from a diagnostic run
  */
 export function generateActionItems(results: DiagnosticResult[]): string[] {
   return results
     .filter(r => r.status !== 'healthy')
     .map(r => {
       const question = DAILY_DIAGNOSTIC_QUESTIONS.find(q => q.id === r.questionId);
       return question?.remediation || `Address issue: ${r.questionId}`;
     });
 }