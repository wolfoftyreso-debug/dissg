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
  SEVERITY_REACTIONS,
  getActiveSystemFaults,
  getTestResults,
  evaluateSystemHealth,
  runTestSuite,
  ALL_TEST_SUITES,
  runBatchCertification,
  type SystemHealthState,
  type TestResult,
  type CertificationResult,
} from '@/lib/self-test';

// =============================================================================
// SYSTEM HEALTH OVERVIEW
// =============================================================================

function SystemHealthOverview({ health }: { health: SystemHealthState }) {
  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    critical: 'bg-orange-500',
    locked: 'bg-red-500',
  };

  const statusLabels = {
    healthy: 'OPERATIV',
    degraded: 'FÖRSÄMRAD',
    critical: 'KRITISK',
    locked: 'LÅST',
  };

  return (
    <div className={`p-4 rounded border ${
      health.overallStatus === 'healthy' 
        ? 'bg-green-500/10 border-green-500/50' 
        : health.overallStatus === 'locked'
          ? 'bg-red-500/10 border-red-500'
          : 'bg-orange-500/10 border-orange-500/50'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-mono text-sm font-semibold">SYSTEMHÄLSA</div>
          <div className="text-xs text-muted-foreground">
            Senaste test: {health.lastTestRun 
              ? new Date(health.lastTestRun).toLocaleString('sv-SE')
              : 'Aldrig'
            }
          </div>
        </div>
        <Badge className={`${statusColors[health.overallStatus]} text-white font-mono`}>
          {statusLabels[health.overallStatus]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="text-muted-foreground">Aktiva fel</div>
          <div className="font-mono text-2xl">{health.activeFaultCount}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Kritiska</div>
          <div className="font-mono text-2xl text-orange-500">{health.criticalFaultCount}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Systemiska</div>
          <div className="font-mono text-2xl text-red-500">{health.systemicFaultCount}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Lambda</div>
          <Badge variant={health.lambdaEnabled ? 'secondary' : 'destructive'} className="font-mono">
            {health.lambdaEnabled ? 'AKTIV' : 'INAKTIVERAD'}
          </Badge>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {(Object.keys(health.domainHealth) as Array<keyof typeof health.domainHealth>).map((domain) => {
          const status = health.domainHealth[domain];
          const color = status === 'healthy' 
            ? 'bg-green-500/20 border-green-500/50' 
            : status === 'warning'
              ? 'bg-yellow-500/20 border-yellow-500/50'
              : 'bg-red-500/20 border-red-500/50';
          
          return (
            <div key={domain} className={`p-2 rounded border text-center ${color}`}>
              <div className="font-mono text-xs font-semibold">{domain}</div>
              <div className="text-[10px] text-muted-foreground">
                {SYSTEM_DOMAIN_LABELS[domain].sv}
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
      {faults.map((fault) => {
        const reaction = SEVERITY_REACTIONS[fault.severity];
        const severityColor = fault.severity === 'critical' || fault.severity === 'systemic'
          ? 'border-red-500 bg-red-500/10'
          : fault.severity === 'warning'
            ? 'border-yellow-500 bg-yellow-500/10'
            : 'border-muted';

        return (
          <div key={`${fault.code}-${fault.triggeredAt}`} className={`p-3 rounded border ${severityColor}`}>
            <div className="flex justify-between items-start">
              <div className="font-mono font-semibold">{fault.code}</div>
              <Badge variant={fault.severity === 'systemic' ? 'destructive' : 'secondary'} className="text-[10px]">
                {fault.severity.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Triggad: {new Date(fault.triggeredAt).toLocaleString('sv-SE')}
            </div>
            <div className="text-xs mt-2">
              <span className="text-muted-foreground">Åtgärd: </span>
              {reaction.action}
            </div>
            {fault.autoRemediation && (
              <Badge variant="outline" className="mt-2 text-[10px]">
                Auto-remediation tillgänglig
              </Badge>
            )}
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
        const statusColor = result.status === 'passed'
          ? 'border-green-500/50 bg-green-500/5'
          : result.status === 'failed'
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-muted';

        return (
          <div key={`${result.testId}-${index}`} className={`p-3 rounded border ${statusColor}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-sm">{result.testName}</div>
                <div className="font-mono text-xs text-muted-foreground">{result.testId}</div>
              </div>
              <Badge 
                variant={result.status === 'passed' ? 'secondary' : 'destructive'} 
                className="text-[10px] font-mono"
              >
                {result.status === 'passed' ? '✓ PASS' : '✗ FAIL'}
              </Badge>
            </div>
            
            {result.details.errors.length > 0 && (
              <div className="mt-2 text-xs text-red-500">
                {result.details.errors[0]}
              </div>
            )}
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{result.category}</span>
              <span>{result.durationMs}ms</span>
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
        certification.passed 
          ? 'bg-green-500/10 border-green-500' 
          : 'bg-red-500/10 border-red-500'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-mono text-sm font-semibold">
              {certification.passed ? 'CERTIFIERING GODKÄND' : 'CERTIFIERING UNDERKÄND'}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(certification.timestamp).toLocaleString('sv-SE')}
            </div>
          </div>
          {certification.certificateHash && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Certifikat-ID</div>
              <div className="font-mono text-sm">{certification.certificateHash}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 text-xs">
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
          <div>
            <div className="text-muted-foreground">Överhoppade</div>
            <div className="font-mono text-xl text-muted-foreground">{certification.skippedTests}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {certification.suiteResults.map((suite) => (
          <div key={suite.suiteId} className="flex justify-between items-center p-2 rounded border">
            <div>
              <div className="font-semibold text-sm">{suite.suiteName}</div>
              <div className="text-xs text-muted-foreground">
                {suite.passCount}/{suite.testCount} tester
              </div>
            </div>
            <Badge variant={suite.passed ? 'secondary' : 'destructive'} className="font-mono text-[10px]">
              {suite.passed ? 'OK' : 'FEL'}
            </Badge>
          </div>
        ))}
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
