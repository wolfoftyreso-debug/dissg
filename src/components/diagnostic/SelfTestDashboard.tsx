 /**
  * Self-Test Dashboard
  * 
  * Internal VIDA-view for the system itself.
  * Shows active system faults, test results, and certification status.
  */
 
 import React, { useState, useEffect, useCallback } from 'react';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Separator } from '@/components/ui/separator';
 import { Progress } from '@/components/ui/progress';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import {
   SYSTEM_DOMAIN_LABELS,
   SYSTEM_FAULT_CODES,
   getActiveSystemFaults,
   getTestResults,
   evaluateSystemHealth,
   runTestSuite,
   ALL_TEST_SUITES,
   runBatchCertification,
   type SystemHealthState,
   type TestResult,
   type CertificationResult,
   type SystemDomain,
 } from '@/lib/self-test';
 
 // =============================================================================
 // SYSTEM HEALTH OVERVIEW
 // =============================================================================
 
 function SystemHealthOverview({ health }: { health: SystemHealthState }) {
   const getStatus = () => {
     if (health.criticalFaults > 0) return 'critical';
     if (health.errorFaults > 0) return 'degraded';
     return 'healthy';
   };
 
   const status = getStatus();
 
   const statusColors = {
     healthy: 'bg-green-500',
     degraded: 'bg-yellow-500',
     critical: 'bg-orange-500',
   };
 
   const statusLabels = {
     healthy: 'OPERATIV',
     degraded: 'FÖRSÄMRAD',
     critical: 'KRITISK',
   };
 
   const totalFaults = health.criticalFaults + health.errorFaults + health.warningFaults;
 
   return (
     <div className={`p-4 rounded border ${
       status === 'healthy' 
         ? 'bg-green-500/10 border-green-500/50' 
         : status === 'critical'
           ? 'bg-red-500/10 border-red-500'
           : 'bg-orange-500/10 border-orange-500/50'
     }`}>
       <div className="flex justify-between items-center mb-4">
         <div>
           <div className="font-mono text-sm font-semibold">SYSTEMHÄLSA</div>
           <div className="text-xs text-muted-foreground">
             Senaste test: {new Date(health.lastChecked).toLocaleString('sv-SE')}
           </div>
         </div>
         <Badge className={`${statusColors[status]} text-white font-mono`}>
           {statusLabels[status]}
         </Badge>
       </div>
 
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
         <div>
           <div className="text-muted-foreground">Aktiva fel</div>
           <div className="font-mono text-2xl">{totalFaults}</div>
         </div>
         <div>
           <div className="text-muted-foreground">Kritiska</div>
           <div className="font-mono text-2xl text-orange-500">{health.criticalFaults}</div>
         </div>
         <div>
           <div className="text-muted-foreground">Varningar</div>
           <div className="font-mono text-2xl text-yellow-500">{health.warningFaults}</div>
         </div>
         <div>
           <div className="text-muted-foreground">Kan operera</div>
           <Badge variant={health.canOperate ? 'secondary' : 'destructive'} className="font-mono">
             {health.canOperate ? 'JA' : 'NEJ'}
           </Badge>
         </div>
       </div>
 
       <Separator className="my-4" />
 
       <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
         {(Object.keys(SYSTEM_DOMAIN_LABELS) as SystemDomain[]).map((domain) => {
           return (
             <div key={domain} className="p-2 rounded border text-center bg-muted/20 border-muted">
               <div className="font-mono text-xs font-semibold">{domain}</div>
               <div className="text-[10px] text-muted-foreground">
                 {SYSTEM_DOMAIN_LABELS[domain]}
               </div>
             </div>
           );
         })}
       </div>
     </div>
   );
 }
 
 // =============================================================================
 // ACTIVE FAULTS LIST
 // =============================================================================
 
 function ActiveFaultsList() {
   const faults = getActiveSystemFaults();
 
   if (faults.length === 0) {
     return (
       <div className="text-center py-8 text-muted-foreground text-sm">
         Inga aktiva systemfel
       </div>
     );
   }
 
   return (
     <div className="space-y-2">
       {faults.map((faultEntry, index) => {
         const faultDef = SYSTEM_FAULT_CODES[faultEntry.faultCode];
         if (!faultDef) return null;
 
         const severityColor = faultDef.severity === 'CRITICAL'
           ? 'border-red-500 bg-red-500/10'
           : faultDef.severity === 'WARNING'
             ? 'border-yellow-500 bg-yellow-500/10'
             : 'border-muted';
 
         return (
           <div key={`${faultEntry.faultCode}-${index}`} className={`p-3 rounded border ${severityColor}`}>
             <div className="flex justify-between items-start">
               <div>
                 <div className="font-mono font-semibold">{faultEntry.faultCode}</div>
                 <div className="text-sm">{faultDef.title}</div>
               </div>
               <Badge variant={faultDef.severity === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-[10px]">
                 {faultDef.severity}
               </Badge>
             </div>
             <div className="text-xs text-muted-foreground mt-1">
               {faultDef.description}
             </div>
             <div className="text-xs text-muted-foreground mt-1">
               Triggad: {new Date(faultEntry.detectedAt).toLocaleString('sv-SE')}
             </div>
             <div className="text-xs mt-2">
               <span className="text-muted-foreground">Auto-block: </span>
               {faultDef.autoBlock ? 'Ja' : 'Nej'}
             </div>
           </div>
         );
       })}
     </div>
   );
 }
 
 // =============================================================================
 // TEST RESULTS LIST
 // =============================================================================
 
 function TestResultsList() {
   const results = getTestResults();
 
   if (results.length === 0) {
     return (
       <div className="text-center py-8 text-muted-foreground text-sm">
         Inga testresultat tillgängliga. Kör ett test.
       </div>
     );
   }
 
   return (
     <div className="space-y-2">
       {results.slice().reverse().map((result, index) => {
         const statusColor = result.status === 'pass'
           ? 'border-green-500/50 bg-green-500/5'
           : result.status === 'fail'
             ? 'border-red-500/50 bg-red-500/5'
             : 'border-muted';
 
         return (
           <div key={`${result.testId}-${index}`} className={`p-3 rounded border ${statusColor}`}>
             <div className="flex justify-between items-start">
               <div>
                 <div className="font-mono text-xs text-muted-foreground">{result.testId}</div>
               </div>
               <Badge 
                 variant={result.status === 'pass' ? 'secondary' : 'destructive'} 
                 className="text-[10px] font-mono"
               >
                 {result.status === 'pass' ? '✓ PASS' : '✗ FAIL'}
               </Badge>
             </div>
             
             <div className="mt-2 text-xs text-muted-foreground">
               Tid: {result.durationMs.toFixed(2)}ms
             </div>
             
             <div className="flex justify-between text-xs text-muted-foreground mt-2">
               <span>{result.testType}</span>
               <span>{new Date(result.executedAt).toLocaleTimeString('sv-SE')}</span>
             </div>
           </div>
         );
       })}
     </div>
   );
 }
 
 // =============================================================================
 // CERTIFICATION VIEW
 // =============================================================================
 
 function CertificationView({ certification }: { certification: CertificationResult | null }) {
   if (!certification) {
     return (
       <div className="text-center py-8 text-muted-foreground text-sm">
         Ingen certifiering genomförd. Kör batch-certifiering.
       </div>
     );
   }
 
   return (
     <div className="space-y-4">
       <div className={`p-4 rounded border ${
         certification.certified 
           ? 'bg-green-500/10 border-green-500' 
           : 'bg-red-500/10 border-red-500'
       }`}>
         <div className="flex justify-between items-center">
           <div>
             <div className="font-mono text-sm font-semibold">
               {certification.certified ? 'CERTIFIERING GODKÄND' : 'CERTIFIERING UNDERKÄND'}
             </div>
             <div className="text-xs text-muted-foreground">
               {new Date(certification.timestamp).toLocaleString('sv-SE')}
             </div>
           </div>
         </div>
 
         <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
           <div>
             <div className="text-muted-foreground">Totalt</div>
             <div className="font-mono text-xl">{certification.totalTests}</div>
           </div>
           <div>
             <div className="text-muted-foreground">Godkända</div>
             <div className="font-mono text-xl text-green-500">{certification.passedTests}</div>
           </div>
           <div>
             <div className="text-muted-foreground">Underkända</div>
             <div className="font-mono text-xl text-red-500">{certification.failedTests}</div>
           </div>
         </div>
 
         {certification.criticalFailures.length > 0 && (
           <div className="mt-4">
             <div className="text-xs text-red-500 font-semibold mb-1">Kritiska fel:</div>
             <ul className="text-xs text-red-500 list-disc list-inside">
               {certification.criticalFailures.map((failure, i) => (
                 <li key={i}>{failure}</li>
               ))}
             </ul>
           </div>
         )}
       </div>
 
       <div className="space-y-2">
         {certification.suiteResults.map((suite) => {
           const passedCount = suite.testResults.filter(r => r.status === 'pass' || r.status === 'warning').length;
           const totalCount = suite.testResults.length;
           
           return (
             <div key={suite.suiteId} className="flex justify-between items-center p-2 rounded border">
               <div>
                 <div className="font-semibold text-sm">{suite.suiteName}</div>
                 <div className="text-xs text-muted-foreground">
                   {passedCount}/{totalCount} tester
                 </div>
               </div>
               <Badge variant={suite.passed ? 'secondary' : 'destructive'} className="font-mono text-[10px]">
                 {suite.passed ? 'OK' : 'FEL'}
               </Badge>
             </div>
           );
         })}
       </div>
     </div>
   );
 }
 
 // =============================================================================
 // MAIN COMPONENT
 // =============================================================================
 
 export function SelfTestDashboard() {
   const [health, setHealth] = useState<SystemHealthState>(evaluateSystemHealth());
   const [certification, setCertification] = useState<CertificationResult | null>(null);
   const [isRunning, setIsRunning] = useState(false);
   const [progress, setProgress] = useState(0);
 
   const refreshHealth = useCallback(() => {
     setHealth(evaluateSystemHealth());
   }, []);
 
   const runAllTests = useCallback(async () => {
     setIsRunning(true);
     setProgress(0);
 
     const totalSuites = ALL_TEST_SUITES.length;
     
     for (let i = 0; i < totalSuites; i++) {
       await runTestSuite(ALL_TEST_SUITES[i]);
       setProgress(((i + 1) / totalSuites) * 100);
     }
 
     refreshHealth();
     setIsRunning(false);
   }, [refreshHealth]);
 
   const runCertification = useCallback(async () => {
     setIsRunning(true);
     setProgress(0);
     
     // Simulate progress
     const interval = setInterval(() => {
       setProgress(p => Math.min(p + 10, 90));
     }, 200);
 
     const result = await runBatchCertification();
     
     clearInterval(interval);
     setProgress(100);
     setCertification(result);
     refreshHealth();
     setIsRunning(false);
   }, [refreshHealth]);
 
   useEffect(() => {
     refreshHealth();
   }, [refreshHealth]);
 
   return (
     <div className="h-full flex flex-col">
       {/* Header */}
       <div className="p-4 border-b">
         <div className="flex justify-between items-center">
           <div>
             <h1 className="font-mono text-lg font-semibold">SJÄLVTEST-MOTOR</h1>
             <p className="text-xs text-muted-foreground">
               OBD för OBD-systemet
             </p>
           </div>
           <div className="flex gap-2">
             <Button 
               variant="outline" 
               size="sm" 
               onClick={runAllTests}
               disabled={isRunning}
             >
               Kör alla tester
             </Button>
             <Button 
               variant="default" 
               size="sm" 
               onClick={runCertification}
               disabled={isRunning}
             >
               Batch-certifiering
             </Button>
           </div>
         </div>
         
         {isRunning && (
           <div className="mt-4">
             <Progress value={progress} className="h-2" />
             <div className="text-xs text-muted-foreground mt-1">
               Kör tester... {Math.round(progress)}%
             </div>
           </div>
         )}
       </div>
 
       {/* Health Overview */}
       <div className="p-4 border-b">
         <SystemHealthOverview health={health} />
       </div>
 
       {/* Tabs */}
       <Tabs defaultValue="faults" className="flex-1 flex flex-col overflow-hidden">
         <TabsList className="mx-4 mt-4">
           <TabsTrigger value="faults" className="text-xs">
             Aktiva fel ({getActiveSystemFaults().length})
           </TabsTrigger>
           <TabsTrigger value="results" className="text-xs">
             Testresultat
           </TabsTrigger>
           <TabsTrigger value="certification" className="text-xs">
             Certifiering
           </TabsTrigger>
         </TabsList>
 
         <div className="flex-1 overflow-hidden">
           <ScrollArea className="h-full">
             <div className="p-4">
               <TabsContent value="faults" className="m-0">
                 <ActiveFaultsList />
               </TabsContent>
 
               <TabsContent value="results" className="m-0">
                 <TestResultsList />
               </TabsContent>
 
               <TabsContent value="certification" className="m-0">
                 <CertificationView certification={certification} />
               </TabsContent>
             </div>
           </ScrollArea>
         </div>
       </Tabs>
     </div>
   );
 }
 
 export default SelfTestDashboard;
