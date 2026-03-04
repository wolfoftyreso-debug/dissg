/**
 * ACCOUNTABILITY & SMART-GOALS DASHBOARD
 * 
 * Visualizes accountability assignments, SMART-goals, and progress.
 * Public read access, authenticated write.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// =============================================================================
// TYPES
// =============================================================================

interface AccountabilityAssignment {
  id: string;
  faultCode: string;
  department: string;
  responsibleEntity: string;
  status: 'assigned' | 'acknowledged' | 'in_progress' | 'completed' | 'escalated';
  assignedAt: string;
  deadline?: string;
  escalationLevel: number;
  goals: SmartGoal[];
}

interface SmartGoal {
  id: string;
  code: string;
  title: string;
  specific: string;
  measurableTarget: number;
  measurableUnit: string;
  baselineValue: number;
  currentValue: number;
  progressPercent: number;
  timeStart: string;
  timeEnd: string;
  status: 'active' | 'achieved' | 'at_risk' | 'failed' | 'paused';
}

// =============================================================================
// DEMO DATA
// =============================================================================

const DEMO_ASSIGNMENTS: AccountabilityAssignment[] = [
  {
    id: '1',
    faultCode: 'ECO-INE-TRE-145',
    department: 'Finansdepartementet',
    responsibleEntity: 'Statssekreterare, ekonomisk politik',
    status: 'in_progress',
    assignedAt: '2024-06-15',
    deadline: '2026-12-31',
    escalationLevel: 0,
    goals: [
      {
        id: 'g1',
        code: 'SMART-INE-001',
        title: 'Minska Gini-koefficienten',
        specific: 'Reducera inkomstojämlikhet mätt som Gini-koefficient genom strukturella skatteförändringar',
        measurableTarget: 0.30,
        measurableUnit: 'Gini',
        baselineValue: 0.34,
        currentValue: 0.33,
        progressPercent: 25,
        timeStart: '2024-06-15',
        timeEnd: '2026-12-31',
        status: 'active',
      },
      {
        id: 'g2',
        code: 'SMART-INE-002',
        title: 'Höj kapitalskatt till OECD-median',
        specific: 'Justera effektiv kapitalinkomstbeskattning till OECD-mediannivå',
        measurableTarget: 28,
        measurableUnit: '%',
        baselineValue: 22,
        currentValue: 24,
        progressPercent: 33,
        timeStart: '2024-06-15',
        timeEnd: '2025-12-31',
        status: 'active',
      },
    ],
  },
  {
    id: '2',
    faultCode: 'HEA-SUB-SYS-402',
    department: 'Socialdepartementet',
    responsibleEntity: 'Folkhälsominister',
    status: 'acknowledged',
    assignedAt: '2024-03-01',
    deadline: '2027-06-30',
    escalationLevel: 1,
    goals: [
      {
        id: 'g3',
        code: 'SMART-SUB-001',
        title: 'Reducera opioidrelaterade dödsfall',
        specific: 'Minska opioidrelaterade dödsfall per 100k invånare till under börvärde',
        measurableTarget: 5.0,
        measurableUnit: 'per 100k',
        baselineValue: 8.2,
        currentValue: 7.5,
        progressPercent: 22,
        timeStart: '2024-03-01',
        timeEnd: '2027-06-30',
        status: 'at_risk',
      },
    ],
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  assigned: { label: 'TILLDELAD', className: 'bg-muted text-muted-foreground' },
  acknowledged: { label: 'BEKRÄFTAD', className: 'bg-blue-500/10 text-blue-600' },
  in_progress: { label: 'PÅGÅENDE', className: 'bg-primary/10 text-primary' },
  completed: { label: 'SLUTFÖRD', className: 'bg-green-500/10 text-green-600' },
  escalated: { label: 'ESKALERAD', className: 'bg-destructive/10 text-destructive' },
};

const GOAL_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: 'AKTIV', className: 'bg-primary/10 text-primary' },
  achieved: { label: 'UPPNÅTT', className: 'bg-green-500/10 text-green-600' },
  at_risk: { label: 'RISK', className: 'bg-orange-500/10 text-orange-600' },
  failed: { label: 'EJ UPPNÅTT', className: 'bg-destructive/10 text-destructive' },
  paused: { label: 'PAUSAD', className: 'bg-muted text-muted-foreground' },
};

export function AccountabilityDashboard() {
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(DEMO_ASSIGNMENTS[0]?.id ?? null);

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-mono text-xs tracking-widest text-muted-foreground mb-1">
            ACCOUNTABILITY & SMART-GOALS
          </h1>
          <p className="text-sm text-muted-foreground">
            Ansvarskoppling från diagnosticerade avvikelser till mätbara åtgärdsmål.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="AKTIVA UPPDRAG" value={DEMO_ASSIGNMENTS.length.toString()} />
          <SummaryCard label="SMART-MÅL" value={DEMO_ASSIGNMENTS.reduce((s, a) => s + a.goals.length, 0).toString()} />
          <SummaryCard label="PÅ SPÅRET" value={DEMO_ASSIGNMENTS.flatMap(a => a.goals).filter(g => g.status === 'active').length.toString()} />
          <SummaryCard label="ESKALERINGAR" value={DEMO_ASSIGNMENTS.filter(a => a.escalationLevel > 0).length.toString()} />
        </div>

        {/* Assignments */}
        <div className="space-y-4">
          {DEMO_ASSIGNMENTS.map((assignment) => {
            const isExpanded = expandedAssignment === assignment.id;
            const statusConfig = STATUS_CONFIG[assignment.status] ?? STATUS_CONFIG.assigned;

            return (
              <div key={assignment.id} className="border border-border rounded-lg bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedAssignment(isExpanded ? null : assignment.id)}
                  className="w-full text-left p-5 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-primary">{assignment.faultCode}</span>
                        <Badge className={`font-mono text-[10px] ${statusConfig.className}`}>
                          {statusConfig.label}
                        </Badge>
                        {assignment.escalationLevel > 0 && (
                          <Badge variant="destructive" className="font-mono text-[10px]">
                            ESK. NIVÅ {assignment.escalationLevel}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium">{assignment.department}</div>
                      <div className="text-xs text-muted-foreground">{assignment.responsibleEntity}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs text-muted-foreground">
                        {assignment.goals.length} mål
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-mono text-muted-foreground">TILLDELAD</span>
                          <div className="font-mono mt-0.5">{assignment.assignedAt}</div>
                        </div>
                        <div>
                          <span className="font-mono text-muted-foreground">DEADLINE</span>
                          <div className="font-mono mt-0.5">{assignment.deadline ?? '—'}</div>
                        </div>
                        <div>
                          <span className="font-mono text-muted-foreground">MANDATREFERENS</span>
                          <div className="font-mono mt-0.5 text-muted-foreground">Regleringsbrev 2024</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">
                          SMART-MÅL
                        </div>
                        <div className="space-y-4">
                          {assignment.goals.map((goal) => {
                            const goalStatus = GOAL_STATUS_CONFIG[goal.status] ?? GOAL_STATUS_CONFIG.active;
                            return (
                              <div key={goal.id} className="border border-border rounded-md p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-mono text-xs font-bold">{goal.code}</span>
                                  <Badge className={`font-mono text-[10px] ${goalStatus.className}`}>
                                    {goalStatus.label}
                                  </Badge>
                                </div>
                                <div className="font-medium text-sm mb-1">{goal.title}</div>
                                <div className="text-xs text-muted-foreground mb-3">{goal.specific}</div>

                                {/* Progress */}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs font-mono">
                                    <span>Baslinje: {goal.baselineValue} {goal.measurableUnit}</span>
                                    <span>Mål: {goal.measurableTarget} {goal.measurableUnit}</span>
                                  </div>
                                  <Progress value={goal.progressPercent} className="h-2" />
                                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                                    <span>Nu: {goal.currentValue} {goal.measurableUnit}</span>
                                    <span>{goal.progressPercent}% framsteg</span>
                                  </div>
                                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                                    <span>Start: {goal.timeStart}</span>
                                    <span>Slut: {goal.timeEnd}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground font-mono py-4">
          Observera: Ansvar tilldelas baserat på befintligt mandat och regleringsbrev. Systemet bedömer inte lämplighet.
        </div>
      </div>
    </ScrollArea>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="font-mono text-2xl font-bold">{value}</div>
    </div>
  );
}

export default AccountabilityDashboard;
