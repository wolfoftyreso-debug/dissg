/**
 * OEM-Class Diagnostic View
 * 
 * VIDA/ODIS-equivalent main diagnostic interface.
 * UI layer only — all logic delegated to DiagnosticEngine.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  SEVERITY_CONFIG,
  type FaultSeverity 
} from '@/lib/fault-codes';
import { DiagnosticScopeSelector } from './DiagnosticScopeSelector';
import {
  createDiagnosticEngine,
  type DiagnosticSession,
  type DiagnosticResult,
  type MeasureBlock,
} from '@/core/diagnostic-engine';
import type { DiagnosticScope } from '@/core/diagnostic-engine';

// =============================================================================
// STEP META
// =============================================================================

const STEP_META: Record<string, { label: string; icon: string }> = {
  review_history: { label: 'HISTORISK GRANSKNING', icon: '📊' },
  peer_compare: { label: 'PEER-JÄMFÖRELSE', icon: '⚖️' },
  correlation: { label: 'KORRELATIONSANALYS', icon: '🔗' },
  timelag: { label: 'TIDSFÖRSKJUTNING', icon: '⏱️' },
  data_quality: { label: 'DATAKVALITET', icon: '✅' },
};

// =============================================================================
// MAIN DIAGNOSTIC VIEW
// =============================================================================

export function DiagnosticView() {
  const engine = useMemo(() => createDiagnosticEngine(), []);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [session, setSession] = useState<DiagnosticSession | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<MeasureBlock | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedCause, setExpandedCause] = useState<number | null>(null);

  const handleSelectScope = useCallback((scope: DiagnosticScope) => {
    const diagResult = engine.createSession(scope);
    setResult(diagResult);
    setSession(diagResult.session);
  }, [engine]);

  const handleSelectFaultCode = useCallback((code: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, selectedFaultCode: prev.selectedFaultCode === code ? null : code };
    });
  }, []);

  if (!session || !result) {
    return <DiagnosticScopeSelector onSelectScope={handleSelectScope} />;
  }

  const selectedFault = session.activeFaultCodes.find(fc => fc.code === session.selectedFaultCode);
  const lambdaColor = session.system.lambdaStatus === 'within_tolerance' 
    ? 'text-green-600' 
    : session.system.lambdaStatus === 'warning' 
      ? 'text-orange-500' 
      : 'text-red-500';

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═══════════════════ HEADER ═══════════════════ */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSession(null); setResult(null); }}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            ← ÄNDRA OMFATTNING
          </Button>
          <span className="font-mono text-[10px] text-muted-foreground">{session.id}</span>
        </div>

        {/* ═══════════════════ SYSTEM STATUS BAR ═══════════════════ */}
        <div className="border border-border rounded-lg bg-card p-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">SYSTEM</div>
              <div className="font-semibold text-sm">{session.system.name}</div>
              <div className="font-mono text-xs text-muted-foreground">{session.system.level.toUpperCase()}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">PERIOD</div>
              <div className="font-mono text-sm">{session.system.periodStart}–{session.system.periodEnd}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">DATATÄCKNING</div>
              <div className="flex items-center gap-3">
                <Progress value={session.system.dataCoverage} className="w-20 h-2" />
                <span className="font-mono text-sm font-medium">{session.system.dataCoverage}%</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">LAMBDA (λ)</div>
              <div className={`font-mono text-2xl font-bold ${lambdaColor}`}>
                {session.system.lambda.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">STATUS</div>
              <Badge 
                variant={session.system.lambdaStatus === 'within_tolerance' ? 'secondary' : 'destructive'}
                className="font-mono text-xs"
              >
                {session.system.lambdaStatus === 'within_tolerance' ? 'INOM TOLERANS' : 'UTANFÖR TOLERANS'}
              </Badge>
            </div>
          </div>
        </div>

        {/* ═══════════════════ SECTION 1: FELKODER ═══════════════════ */}
        <div className="border border-border rounded-lg bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
              SEKTION 1 — AKTIVA FELKODER ({session.activeFaultCodes.length})
            </h2>
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            {session.activeFaultCodes
              .sort((a, b) => {
                const order: Record<FaultSeverity, number> = { critical: 0, systemic: 1, warning: 2, informational: 3, unknown: 4 };
                return order[a.severity] - order[b.severity];
              })
              .map((fc) => {
                const config = SEVERITY_CONFIG[fc.severity];
                const isSelected = session.selectedFaultCode === fc.code;
                return (
                  <button
                    key={fc.code}
                    onClick={() => handleSelectFaultCode(fc.code)}
                    className={`
                      px-4 py-2 rounded-md border font-mono text-xs transition-all
                      ${isSelected ? 'ring-2 ring-primary shadow-sm' : 'hover:bg-muted/50'}
                    `}
                    style={{ borderColor: config.color, color: config.color }}
                  >
                    <span className="mr-2">■</span>
                    {fc.code}
                    <span className="ml-2 opacity-60 text-[10px]">({config.label})</span>
                  </button>
                );
              })}
          </div>

          {selectedFault && (() => {
            const config = SEVERITY_CONFIG[selectedFault.severity];
            return (
              <div className="mx-4 mb-4 p-4 rounded-md border-l-4 bg-muted/20" style={{ borderLeftColor: config.color }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-bold" style={{ color: config.color }}>
                    {selectedFault.code}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="font-semibold text-sm">{selectedFault.description}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {selectedFault.explanation}
                </p>
                <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
                  <span>Triggad: {selectedFault.triggeredAt}</span>
                  <span>Allvarlighet: {config.label.toUpperCase()}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ═══════════════════ SECTION 2: MÄTBLOCK ═══════════════════ */}
        <div className="border border-border rounded-lg bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
              SEKTION 2 — MÄTBLOCK ({session.measureBlocks.length} SENSORER)
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {session.measureBlocks.map((block) => {
                const statusStyles = {
                  within_tolerance: 'border-green-500/40 bg-green-500/5',
                  warning: 'border-orange-500/40 bg-orange-500/5',
                  critical: 'border-red-500/40 bg-red-500/5',
                  no_data: 'border-muted bg-muted/10 opacity-50',
                };
                const trendArrow = { up: '↑', down: '↓', stable: '→', unknown: '?' }[block.trend];
                const setpoint = block.setpointMin !== null && block.setpointMax !== null
                  ? `${block.setpointMin}–${block.setpointMax}`
                  : block.setpointMin !== null ? `≥${block.setpointMin}` : block.setpointMax !== null ? `≤${block.setpointMax}` : '—';

                return (
                  <button
                    key={block.code}
                    onClick={() => setSelectedBlock(block)}
                    className={`text-left p-3 rounded-md border transition-all hover:ring-1 hover:ring-primary/50 ${statusStyles[block.status]}`}
                  >
                    <div className="font-mono text-[10px] text-muted-foreground mb-0.5">{block.code}</div>
                    <div className="font-medium text-sm mb-2 leading-tight">{block.name}</div>
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <div>
                        <span className="text-muted-foreground">Nu: </span>
                        <span className="font-mono font-bold">
                          {block.currentValue !== null ? `${block.currentValue} ${block.unit}` : '—'}
                        </span>
                      </div>
                      <div className="font-mono text-muted-foreground text-[10px]">
                        Börvärde: {setpoint}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <Badge 
                        variant={block.status === 'within_tolerance' ? 'secondary' : 'destructive'}
                        className="font-mono text-[9px] px-1.5 py-0"
                      >
                        {block.status === 'within_tolerance' ? 'OK' : block.status === 'no_data' ? 'SAKNAS' : 'AVVIKELSE'}
                      </Badge>
                      <span className="text-muted-foreground font-mono">{trendArrow} {block.trendPeriod}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════════ SECTION 3: GUIDAD ANALYS ═══════════════════ */}
        {session.selectedFaultCode && (
          <div className="border border-border rounded-lg bg-card">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
                SEKTION 3 — GUIDAD ANALYS
              </h2>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-green-600">{session.completedSteps}/{session.totalSteps} SLUTFÖRDA</span>
                <Progress value={100} className="w-24 h-1.5" />
              </div>
            </div>

            <div className="divide-y divide-border">
              {session.guidedSteps.map((step) => {
                const meta = STEP_META[step.type] || { label: step.type, icon: '📌' };
                const analysis = engine.getDeepAnalysis(step.type);
                const isExpanded = expandedStep === step.id;

                return (
                  <div key={step.id}>
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="w-full text-left p-4 hover:bg-muted/30 transition-colors flex gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{meta.icon}</span>
                          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{meta.label}</span>
                        </div>
                        <div className="font-medium text-sm mb-1">{step.title}</div>
                        <div className="text-sm text-foreground/60 leading-relaxed">{analysis.finding}</div>
                      </div>
                      <div className="text-muted-foreground shrink-0 text-xs mt-1">
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-5 pt-0 ml-10 space-y-5">
                        <div className="bg-muted/30 rounded-md p-4">
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">METODIK</div>
                          <div className="text-sm text-foreground/80 leading-relaxed">{analysis.methodology}</div>
                        </div>

                        <div>
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">OBSERVERADE DATAPUNKTER</div>
                          <div className="space-y-1.5 pl-1">
                            {analysis.dataPoints.map((dp, i) => (
                              <div key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                                <span className="text-muted-foreground shrink-0 mt-0.5">•</span>
                                <span className="font-mono">{dp}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {analysis.peerComparison && (
                          <div className="bg-muted/20 rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">PEER-POSITION</div>
                            <div className="space-y-2">
                              {analysis.peerComparison.peers.map((peer) => {
                                const isCurrent = peer.name === 'Aktuellt';
                                const barW = Math.min((peer.value / 0.45) * 100, 100);
                                return (
                                  <div key={peer.name} className="flex items-center gap-3 text-xs">
                                    <span className={`w-24 text-right font-mono ${isCurrent ? 'font-bold text-orange-500' : 'text-muted-foreground'}`}>
                                      {peer.name}
                                    </span>
                                    <div className="flex-1 bg-muted/40 rounded-full h-3.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${isCurrent ? 'bg-orange-500' : peer.value <= 0.30 ? 'bg-green-500/60' : 'bg-primary/40'}`}
                                        style={{ width: `${barW}%` }}
                                      />
                                    </div>
                                    <span className={`font-mono w-12 text-right ${isCurrent ? 'font-bold text-orange-500' : 'text-muted-foreground'}`}>
                                      {peer.value.toFixed(2)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-2 font-mono">{analysis.peerComparison.position}</div>
                          </div>
                        )}

                        {analysis.correlation && (
                          <div className="border border-border rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">SAMVARIATION</div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-sm">{analysis.correlation.label}</span>
                              <Badge variant="secondary" className="font-mono text-xs">r = {analysis.correlation.value.toFixed(2)}</Badge>
                            </div>
                            <div className="text-sm text-foreground/70 leading-relaxed">{analysis.correlation.interpretation}</div>
                          </div>
                        )}

                        {analysis.timeLag && (
                          <div className="border border-border rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">TIDSFÖRSKJUTNING</div>
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-3xl font-bold font-mono text-primary">{analysis.timeLag.delayYears}</span>
                              <span className="text-sm text-muted-foreground">års genomsnittlig fördröjning</span>
                            </div>
                            <div className="text-sm text-foreground/70 leading-relaxed">{analysis.timeLag.explanation}</div>
                          </div>
                        )}

                        {analysis.dataQuality && (
                          <div className="border border-border rounded-md p-4">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">KVALITETSBEDÖMNING</div>
                            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <div className="text-muted-foreground text-xs mb-0.5">Täckning</div>
                                <div className="font-mono font-bold text-lg">{analysis.dataQuality.coverage}%</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground text-xs mb-0.5">Tillförlitlighet</div>
                                <div className="font-mono font-bold text-lg text-green-600">{analysis.dataQuality.reliability}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground text-xs mb-0.5">Dataluckor</div>
                                <div className="font-mono font-bold text-lg">{analysis.dataQuality.gaps.length} st</div>
                              </div>
                            </div>
                            {analysis.dataQuality.gaps.length > 0 && (
                              <div className="text-xs text-muted-foreground font-mono">
                                Luckor: {analysis.dataQuality.gaps.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════ SECTION 4: ORSAKSANALYS ═══════════════════ */}
        {session.selectedFaultCode && (
          <div className="border border-border rounded-lg bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="font-mono text-xs tracking-widest text-muted-foreground">
                SEKTION 4 — ORSAKSANALYS (DATA-BASERAT)
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {session.probableCauses.map((cause) => {
                const isExpanded = expandedCause === cause.rank;
                const details = engine.getCauseDetails(cause.rank);

                return (
                  <div key={cause.rank} className="border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => setExpandedCause(isExpanded ? null : cause.rank)}
                      className="w-full text-left p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xl font-bold text-muted-foreground/50">{cause.rank}.</span>
                          <div>
                            <span className="font-medium text-sm">{cause.description}</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {cause.evidence} · {cause.relatedCountries} länder · {cause.yearsOfData} år
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-mono text-lg font-bold">{cause.probability}%</div>
                            <div className="text-[10px] text-muted-foreground font-mono">SANNOLIKHET</div>
                          </div>
                          <span className="text-xs text-muted-foreground">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      <div className="mt-2 ml-8 mr-16">
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div 
                            className="h-full rounded-full bg-primary/60 transition-all" 
                            style={{ width: `${cause.probability}%` }} 
                          />
                        </div>
                      </div>
                    </button>

                    {isExpanded && details && (
                      <div className="border-t border-border p-5 space-y-5 bg-muted/5 ml-8">
                        <div>
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">VERKNINGSMEKANISM</div>
                          <div className="text-sm text-foreground/80 leading-relaxed">{details.mechanism}</div>
                        </div>

                        <div>
                          <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">EVIDENSKEDJA</div>
                          <div className="space-y-2">
                            {details.evidenceChain.map((ev, i) => (
                              <div key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                                <span className="text-muted-foreground shrink-0">📄</span>
                                <span>{ev}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-l-2 border-orange-400/50 pl-4">
                          <div className="font-mono text-[10px] tracking-widest text-orange-500 mb-2">⚠ BEGRÄNSNINGAR</div>
                          <div className="space-y-1.5">
                            {details.limitations.map((lim, i) => (
                              <div key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                                <span className="shrink-0 text-muted-foreground">•</span>
                                <span>{lim}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-4 border border-dashed border-border rounded-md bg-muted/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Oförklarad osäkerhet</span>
                  <span className="font-mono text-lg font-bold text-muted-foreground">{result.uncertainty}%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Andel som ej kan tillskrivas identifierade orsaker med nuvarande dataunderlag.
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center font-mono">
                Inga rekommendationer. Inga värdeord. Endast sannolikheter baserade på observerade mönster.
              </div>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>

      {/* Source Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="font-mono text-sm font-semibold">{selectedBlock.code}</div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedBlock(null)}>×</Button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">PARAMETER</div>
                <div className="font-medium">{selectedBlock.name}</div>
              </div>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">DATAKÄLLA</div>
                <div className="text-sm">{selectedBlock.source}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">NUVARANDE VÄRDE</div>
                <div className="text-sm font-mono font-bold">
                  {selectedBlock.currentValue !== null ? `${selectedBlock.currentValue} ${selectedBlock.unit}` : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">OSÄKERHET</div>
                <div className="text-sm font-mono">±0.02</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">SENAST UPPDATERAD</div>
                <div className="text-sm font-mono">{selectedBlock.lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  );
}

export default DiagnosticView;
