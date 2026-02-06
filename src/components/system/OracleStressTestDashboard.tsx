/**
 * ORACLE STRESS TEST DASHBOARD
 * 
 * Visual interface for running and viewing stress test results.
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Play, 
  AlertTriangle,
  Shield,
  Zap,
  Search,
  Clock,
  Lock,
  Users,
  Building,
  RefreshCw
} from 'lucide-react';
import {
  ALL_STRESS_TESTS,
  runAllStressTests,
  getCertificationStatus,
  type StressTestResult,
  type StressTestDefinition,
} from '@/lib/self-test/oracle-stress-tests';

const TEST_ICONS: Record<string, React.ReactNode> = {
  'TEST_1_QUERY_EXPLOSION': <Zap className="h-4 w-4" />,
  'TEST_2_AI_AGENT_TORTURE': <Shield className="h-4 w-4" />,
  'TEST_3_SEARCH_DOMINANCE': <Search className="h-4 w-4" />,
  'TEST_4_REALTIME_CRISIS': <Clock className="h-4 w-4" />,
  'TEST_5_MISUSE_MANIPULATION': <AlertTriangle className="h-4 w-4" />,
  'TEST_6_COMMERCIAL_PRESSURE': <Building className="h-4 w-4" />,
  'TEST_7_HOSTILE_TAKEOVER': <Lock className="h-4 w-4" />,
  'TEST_8_GENERATIONAL_SHIFT': <Users className="h-4 w-4" />,
};

export const OracleStressTestDashboard: React.FC = () => {
  const [results, setResults] = useState<StressTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const handleRunTests = useCallback(() => {
    setIsRunning(true);
    setResults([]);
    
    // Simulate async test execution
    setTimeout(() => {
      const testResults = runAllStressTests();
      setResults(testResults);
      setIsRunning(false);
    }, 1500);
  }, []);

  const certification = results.length > 0 ? getCertificationStatus(results) : null;
  
  const getResultForTest = (testId: string): StressTestResult | undefined => {
    return results.find(r => r.test_id === testId);
  };

  const selectedTestDef = ALL_STRESS_TESTS.find(t => t.id === selectedTest);
  const selectedResult = selectedTest ? getResultForTest(selectedTest) : undefined;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">
              🧪 FULL ORAKEL-STRESSTEST
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              End-to-end verification: epistemik, skalning, agentbeteende, sök, kommersiell press, fientlig påverkan
            </p>
          </div>
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            size="lg"
            className="font-mono"
          >
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Kör tester...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Kör alla 8 tester
              </>
            )}
          </Button>
        </div>

        {/* Certification Status */}
        {certification && (
          <Card className={certification.passed ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {certification.passed ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <div>
                  <h2 className="text-lg font-mono font-bold">
                    {certification.passed ? '✅ CERTIFIERAD' : '❌ FAILED'}
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {certification.passCount}/{results.length} tester passerade
                  </p>
                </div>
              </div>
              {certification.passed && (
                <p className="mt-4 text-sm font-mono text-muted-foreground">
                  {certification.summary}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-sm">TESTER</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {ALL_STRESS_TESTS.map((test, index) => {
                    const result = getResultForTest(test.id);
                    const isSelected = selectedTest === test.id;
                    
                    return (
                      <button
                        key={test.id}
                        onClick={() => setSelectedTest(test.id)}
                        className={`w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors ${
                          isSelected ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            {TEST_ICONS[test.id]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-muted-foreground">
                                TEST {index + 1}
                              </span>
                              {result && (
                                <Badge 
                                  variant={result.status === 'PASS' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {result.status}
                                </Badge>
                              )}
                            </div>
                            <p className="font-mono text-sm truncate">
                              {test.name}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Test Details */}
          <div className="lg:col-span-2">
            {selectedTestDef ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {TEST_ICONS[selectedTestDef.id]}
                    <div>
                      <CardTitle className="font-mono">{selectedTestDef.name}</CardTitle>
                      <CardDescription className="font-mono">
                        {selectedTestDef.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Input */}
                  <div>
                    <h4 className="font-mono text-xs text-muted-foreground mb-2">INPUT</h4>
                    <pre className="bg-muted p-3 rounded text-xs font-mono overflow-auto">
                      {JSON.stringify(selectedTestDef.input, null, 2)}
                    </pre>
                  </div>

                  <Separator />

                  {/* Expected */}
                  <div>
                    <h4 className="font-mono text-xs text-muted-foreground mb-2">FÖRVÄNTAT</h4>
                    <ul className="space-y-1">
                      {selectedTestDef.expected.map((exp, i) => (
                        <li key={i} className="text-sm font-mono flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Fail Conditions */}
                  <div>
                    <h4 className="font-mono text-xs text-muted-foreground mb-2">FAIL OM</h4>
                    <ul className="space-y-1">
                      {selectedTestDef.fail_conditions.map((fc, i) => (
                        <li key={i} className="text-sm font-mono flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          {fc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Pass Criteria */}
                  <div className="bg-muted/50 p-4 rounded">
                    <h4 className="font-mono text-xs text-muted-foreground mb-1">✅ PASS OM</h4>
                    <p className="font-mono text-sm font-bold">{selectedTestDef.pass_criteria}</p>
                  </div>

                  {/* Results (if available) */}
                  {selectedResult && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-mono text-xs text-muted-foreground">RESULTAT</h4>
                          <Badge variant={selectedResult.status === 'PASS' ? 'default' : 'destructive'}>
                            {selectedResult.status}
                          </Badge>
                        </div>
                        
                        {/* Observations */}
                        <div className="mb-4">
                          <h5 className="font-mono text-xs text-muted-foreground mb-2">Observationer</h5>
                          <ul className="space-y-1">
                            {selectedResult.observations.map((obs, i) => (
                              <li key={i} className="text-sm font-mono flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-1 shrink-0" />
                                {obs}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Violations */}
                        {selectedResult.violations.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-mono text-xs text-muted-foreground mb-2">Överträdelser</h5>
                            <ul className="space-y-1">
                              {selectedResult.violations.map((vio, i) => (
                                <li key={i} className="text-sm font-mono flex items-start gap-2 text-red-500">
                                  <XCircle className="h-3 w-3 mt-1 shrink-0" />
                                  {vio}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Metrics */}
                        <div>
                          <h5 className="font-mono text-xs text-muted-foreground mb-2">Metrics</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(selectedResult.metrics).map(([key, value]) => (
                              <div key={key} className="bg-muted p-2 rounded">
                                <span className="font-mono text-xs text-muted-foreground block">
                                  {key}
                                </span>
                                <span className="font-mono text-sm font-bold">
                                  {typeof value === 'number' && value < 1 && value > 0 
                                    ? `${(value * 100).toFixed(2)}%` 
                                    : value.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <p className="text-muted-foreground font-mono text-sm">
                  Välj ett test för att se detaljer
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
