 /**
  * SELF-AUDIT DASHBOARD
  * 
  * Internal revision interface for continuous self-monitoring.
  * Not for users - for the system itself.
  */
 
 import React, { useState, useEffect } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Separator } from '@/components/ui/separator';
 import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
 import { 
   runFullSystemAudit, 
   type FullAuditReport,
   type ControllerResult,
   SELF_REVISION_QUESTIONS,
 } from '@/lib/controllers';
 import { UX_PRINCIPLES } from '@/config/uxPrinciples';
 
 // =============================================================================
 // STATUS COMPONENTS
 // =============================================================================
 
 function StatusBadge({ status }: { status: 'healthy' | 'degraded' | 'critical' | 'passing' | 'warning' | 'failing' | 'not_run' }) {
   const config: Record<string, { label: string; className: string }> = {
     healthy: { label: 'HEALTHY', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
     passing: { label: 'PASS', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
     degraded: { label: 'DEGRADED', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
     warning: { label: 'WARNING', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
     critical: { label: 'CRITICAL', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
     failing: { label: 'FAIL', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
     not_run: { label: 'NOT RUN', className: 'bg-muted text-muted-foreground' },
   };
   
   return (
     <Badge variant="outline" className={`font-mono text-xs ${config[status]?.className || ''}`}>
       {config[status]?.label || status.toUpperCase()}
     </Badge>
   );
 }
 
 // =============================================================================
 // CONTROLLER RESULT CARD
 // =============================================================================
 
 function ControllerResultCard({ result }: { result: ControllerResult }) {
   const [isOpen, setIsOpen] = useState(false);
   
   return (
     <Collapsible open={isOpen} onOpenChange={setIsOpen}>
       <Card className="border-border/50">
         <CollapsibleTrigger className="w-full">
           <CardHeader className="pb-3">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Badge variant="outline" className="font-mono text-xs">
                   {result.domain}
                 </Badge>
                 <CardTitle className="text-sm font-mono">{result.name}</CardTitle>
               </div>
               <div className="flex items-center gap-2">
                 <StatusBadge status={result.status} />
                 <span className="text-xs text-muted-foreground font-mono">
                   {result.executionTimeMs}ms
                 </span>
               </div>
             </div>
           </CardHeader>
         </CollapsibleTrigger>
         
         <CollapsibleContent>
           <CardContent className="pt-0 space-y-4">
             {/* Stats */}
             <div className="grid grid-cols-4 gap-4 text-center">
               <div>
                 <div className="text-xl font-mono">{result.checksRun}</div>
                 <div className="text-[10px] text-muted-foreground">KÖRDA</div>
               </div>
               <div>
                 <div className="text-xl font-mono text-green-500">{result.checksPassed}</div>
                 <div className="text-[10px] text-muted-foreground">GODKÄNDA</div>
               </div>
               <div>
                 <div className="text-xl font-mono text-yellow-500">{result.checksWarning}</div>
                 <div className="text-[10px] text-muted-foreground">VARNINGAR</div>
               </div>
               <div>
                 <div className="text-xl font-mono text-red-500">{result.checksFailed}</div>
                 <div className="text-[10px] text-muted-foreground">MISSLYCKADE</div>
               </div>
             </div>
             
             {/* Findings */}
             {result.findings.length > 0 && (
               <>
                 <Separator />
                 <div className="space-y-2">
                   <div className="text-xs font-mono text-muted-foreground">FYND</div>
                   {result.findings.map((finding, i) => (
                     <div key={i} className="p-2 bg-muted/30 rounded text-xs">
                       <div className="flex items-center gap-2 mb-1">
                         <Badge 
                           variant="secondary" 
                           className={`text-[10px] ${
                             finding.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                             finding.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                             'bg-blue-500/10 text-blue-500'
                           }`}
                         >
                           {finding.severity.toUpperCase()}
                         </Badge>
                         <span className="font-mono">{finding.checkId}</span>
                       </div>
                       <div className="text-muted-foreground">{finding.description}</div>
                       <div className="text-primary mt-1">{finding.recommendation}</div>
                     </div>
                   ))}
                 </div>
               </>
             )}
           </CardContent>
         </CollapsibleContent>
       </Card>
     </Collapsible>
   );
 }
 
 // =============================================================================
 // SELF-REVISION QUESTIONS CARD
 // =============================================================================
 
 function SelfRevisionCard({ results }: { results: FullAuditReport['selfRevisionResults'] }) {
   return (
     <Card className="border-border/50">
       <CardHeader className="pb-3">
         <CardTitle className="text-sm font-mono">SJÄLVREVISION (Obligatorisk Loop)</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="space-y-3">
           {SELF_REVISION_QUESTIONS.map((question) => {
             const result = results.find(r => r.questionId === question.id);
             const passed = result?.passed ?? true;
             
             return (
               <div key={question.id} className="flex items-start gap-3 p-2 bg-muted/30 rounded">
                 <Badge 
                   variant="outline" 
                   className={`font-mono text-[10px] shrink-0 ${
                     passed 
                       ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                       : 'bg-red-500/10 text-red-500 border-red-500/20'
                   }`}
                 >
                   {passed ? 'OK' : 'FIX'}
                 </Badge>
                 <div className="flex-1 min-w-0">
                   <div className="text-xs">{question.question}</div>
                   {!passed && (
                     <div className="text-xs text-primary mt-1">
                       [ÅTGÄRD] {question.improvementAction}
                     </div>
                   )}
                 </div>
               </div>
             );
           })}
         </div>
       </CardContent>
     </Card>
   );
 }
 
 // =============================================================================
 // UX PRINCIPLES CARD
 // =============================================================================
 
 function UXPrinciplesCard() {
   return (
     <Card className="border-border/50">
       <CardHeader className="pb-3">
         <CardTitle className="text-sm font-mono">UX-PRINCIPER (15 absoluta regler)</CardTitle>
       </CardHeader>
       <CardContent>
         <ScrollArea className="h-[300px]">
           <div className="space-y-2">
             {UX_PRINCIPLES.map((principle) => (
               <div key={principle.id} className="p-2 bg-muted/30 rounded text-xs">
                 <div className="flex items-center gap-2 mb-1">
                   <Badge variant="outline" className="font-mono text-[10px]">
                     {principle.id}
                   </Badge>
                   <span className="font-medium">{principle.title}</span>
                 </div>
                 <div className="text-muted-foreground">{principle.description}</div>
               </div>
             ))}
           </div>
         </ScrollArea>
       </CardContent>
     </Card>
   );
 }
 
 // =============================================================================
 // MAIN COMPONENT
 // =============================================================================
 
 export function SelfAuditDashboard() {
   const [auditReport, setAuditReport] = useState<FullAuditReport | null>(null);
   const [isRunning, setIsRunning] = useState(false);
   
   const runAudit = async () => {
     setIsRunning(true);
     try {
       const report = await runFullSystemAudit();
       setAuditReport(report);
     } finally {
       setIsRunning(false);
     }
   };
   
   useEffect(() => {
     runAudit();
   }, []);
   
   return (
     <div className="p-6 space-y-6">
       {/* Header */}
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-xl font-mono font-semibold">SELF-AUDIT DASHBOARD</h1>
           <p className="text-sm text-muted-foreground">
             Internt kontroll- och revisionssystem
           </p>
         </div>
         <div className="flex items-center gap-3">
           {auditReport && (
             <StatusBadge status={auditReport.overallStatus} />
           )}
           <Button 
             variant="outline" 
             size="sm" 
             onClick={runAudit}
             disabled={isRunning}
             className="font-mono text-xs"
           >
             {isRunning ? 'KÖR...' : 'KÖR AUDIT'}
           </Button>
         </div>
       </div>
       
       {auditReport && (
         <>
           {/* Summary Stats */}
           <div className="grid grid-cols-5 gap-4">
             <Card className="border-border/50">
               <CardContent className="p-4 text-center">
                 <div className="text-3xl font-mono font-bold">{auditReport.totalChecks}</div>
                 <div className="text-xs text-muted-foreground">TOTALT</div>
               </CardContent>
             </Card>
             <Card className="border-border/50">
               <CardContent className="p-4 text-center">
                 <div className="text-3xl font-mono font-bold text-green-500">{auditReport.totalPassed}</div>
                 <div className="text-xs text-muted-foreground">GODKÄNDA</div>
               </CardContent>
             </Card>
             <Card className="border-border/50">
               <CardContent className="p-4 text-center">
                 <div className="text-3xl font-mono font-bold text-yellow-500">{auditReport.totalWarnings}</div>
                 <div className="text-xs text-muted-foreground">VARNINGAR</div>
               </CardContent>
             </Card>
             <Card className="border-border/50">
               <CardContent className="p-4 text-center">
                 <div className="text-3xl font-mono font-bold text-red-500">{auditReport.totalFailed}</div>
                 <div className="text-xs text-muted-foreground">MISSLYCKADE</div>
               </CardContent>
             </Card>
             <Card className="border-border/50">
               <CardContent className="p-4 text-center">
                 <div className="text-3xl font-mono font-bold">{auditReport.executionTimeMs}ms</div>
                 <div className="text-xs text-muted-foreground">EXEKVERING</div>
               </CardContent>
             </Card>
           </div>
           
           {/* Recommendations */}
           {auditReport.recommendations.length > 0 && (
             <Card className="border-border/50 border-primary/50">
               <CardHeader className="pb-3">
                 <CardTitle className="text-sm font-mono text-primary">REKOMMENDATIONER</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   {auditReport.recommendations.map((rec, i) => (
                     <div key={i} className="text-xs font-mono p-2 bg-primary/5 rounded">
                       {rec}
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           )}
           
           {/* Controller Results */}
           <div className="space-y-4">
             <h2 className="text-sm font-mono text-muted-foreground">5 CONTROLLERS</h2>
             {auditReport.controllerResults.map((result) => (
               <ControllerResultCard key={result.domain} result={result} />
             ))}
           </div>
           
           {/* Self-Revision & UX Principles */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <SelfRevisionCard results={auditReport.selfRevisionResults} />
             <UXPrinciplesCard />
           </div>
         </>
       )}
       
       {/* Footer */}
       <div className="text-center text-xs text-muted-foreground font-mono pt-6 border-t border-border/50">
         SYSTEM SELF-AUDIT | CONTINUOUS REVISION LOOP ACTIVE
       </div>
     </div>
   );
 }
 
 export default SelfAuditDashboard;