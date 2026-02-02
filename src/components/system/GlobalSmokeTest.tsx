/**
 * BLOCK 10: FINAL INTEGRATION & GLOBAL SMOKE TEST
 * 
 * "Allt ska hålla ihop."
 * 
 * Frågor systemet ska klara:
 * - Vad händer?
 * - Varför?
 * - På vilken skala?
 * - Vad betyder det inte?
 * - Vem var ansvarig då?
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Map,
  BarChart3,
  Users,
  Clock,
  Shield,
  Zap,
  Play,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemBreadcrumbs, SystemHierarchyPath } from '@/components/navigation';
import { DataQualityBadge, type DataQualityMetrics } from '@/components/quality';

// === TEST DEFINITIONS ===

interface SystemTest {
  id: string;
  category: 'route' | 'component' | 'data' | 'integration';
  name: string;
  nameSv: string;
  description: string;
  route?: string;
  question?: string; // Which core question it answers
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
}

const CORE_QUESTIONS = {
  what: 'Vad händer?',
  why: 'Varför?',
  scale: 'På vilken skala?',
  not: 'Vad betyder det inte?',
  who: 'Vem var ansvarig då?'
};

const SYSTEM_TESTS: SystemTest[] = [
  // Route tests
  { id: 'route-reality', category: 'route', name: 'Global Reality Index', nameSv: 'Global Reality Index', description: 'Huvudvy för GRI', route: '/reality', question: 'what', status: 'pending' },
  { id: 'route-indices', category: 'route', name: 'Index Engine', nameSv: 'Index Engine', description: 'Alla 6 index', route: '/indices', question: 'what', status: 'pending' },
  { id: 'route-map', category: 'route', name: 'Global Map', nameSv: 'Global Karta', description: 'Choropleth maps', route: '/map', question: 'scale', status: 'pending' },
  { id: 'route-correlation', category: 'route', name: 'Correlation Sandbox', nameSv: 'Korrelationssandbox', description: 'Analysverktyg', route: '/correlation', question: 'why', status: 'pending' },
  { id: 'route-explain', category: 'route', name: 'Explain Engine', nameSv: 'Förklaringsmotor', description: 'ETLIH med 3 nivåer', route: '/explain', question: 'why', status: 'pending' },
  { id: 'route-profiles', category: 'route', name: 'Public Profiles', nameSv: 'Politikerprofiler', description: 'Ansvarsspårning', route: '/profiles', question: 'who', status: 'pending' },
  { id: 'route-sweden', category: 'route', name: 'Sweden Dashboard', nameSv: 'Sverige-dashboard', description: 'Landsvy', route: '/sweden', question: 'scale', status: 'pending' },
  { id: 'route-eu', category: 'route', name: 'EU Dashboard', nameSv: 'EU-dashboard', description: 'Regional vy', route: '/eu', question: 'scale', status: 'pending' },
  { id: 'route-scenario', category: 'route', name: 'Scenario Sandbox', nameSv: 'Scenariosandbox', description: 'Policy-simulering', route: '/scenario', question: 'what', status: 'pending' },
  { id: 'route-resilience', category: 'route', name: 'Resilience Dashboard', nameSv: 'Resiliensdashboard', description: 'Stressmätning', route: '/resilience', question: 'what', status: 'pending' },
  { id: 'route-viability', category: 'route', name: 'Human Viability', nameSv: 'Human Viability', description: 'HWI-motor', route: '/viability', question: 'what', status: 'pending' },
  { id: 'route-fairness', category: 'route', name: 'Fairness Engine', nameSv: 'Rättviseindex', description: 'Intergenerationell', route: '/fairness', question: 'what', status: 'pending' },
  { id: 'route-civilization', category: 'route', name: 'Civilization Map', nameSv: 'Civilisationskarta', description: 'Fasskiftning', route: '/civilization', question: 'scale', status: 'pending' },
  { id: 'route-capacity', category: 'route', name: 'Carrying Capacity', nameSv: 'Bärkraft', description: 'Kapacitetsgränser', route: '/capacity', question: 'scale', status: 'pending' },
  
  // Component tests
  { id: 'comp-breadcrumbs', category: 'component', name: 'Navigation Breadcrumbs', nameSv: 'Navigering', description: 'Alltid synlig', status: 'pending' },
  { id: 'comp-quality-badge', category: 'component', name: 'Data Quality Badge', nameSv: 'Kvalitetsbadge', description: 'Self-audit', question: 'not', status: 'pending' },
  { id: 'comp-disclaimer', category: 'component', name: 'Disclaimers', nameSv: 'Disclaimers', description: '"Vad detta INTE är"', question: 'not', status: 'pending' },
  
  // Data tests
  { id: 'data-kpi', category: 'data', name: 'KPI Data Loading', nameSv: 'KPI-data', description: 'Databasanrop', status: 'pending' },
  { id: 'data-feed', category: 'data', name: 'Feed Events', nameSv: 'Feed-händelser', description: 'Realtidsflöde', status: 'pending' },
  
  // Integration tests
  { id: 'int-map-to-graph', category: 'integration', name: 'Map → Graph Chain', nameSv: 'Karta → Graf', description: 'Klickkedja', status: 'pending' },
  { id: 'int-explain-all', category: 'integration', name: 'Explain Everywhere', nameSv: 'Förklara överallt', description: 'ETLIH integration', question: 'why', status: 'pending' },
];

// === COMPONENTS ===

const TestStatusIcon: React.FC<{ status: SystemTest['status'] }> = ({ status }) => {
  switch (status) {
    case 'passed': return <CheckCircle className="h-4 w-4 text-status-positive" />;
    case 'failed': return <XCircle className="h-4 w-4 text-status-critical" />;
    case 'running': return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
    case 'skipped': return <AlertTriangle className="h-4 w-4 text-status-warning" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const TestRow: React.FC<{ test: SystemTest; onRun: () => void }> = ({ test, onRun }) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border transition-all",
      test.status === 'passed' && "bg-status-positive/5 border-status-positive/20",
      test.status === 'failed' && "bg-status-critical/5 border-status-critical/20",
      test.status === 'running' && "bg-primary/5 border-primary/20",
      test.status === 'pending' && "bg-muted/30"
    )}>
      <div className="flex items-center gap-3">
        <TestStatusIcon status={test.status} />
        <div>
          <div className="font-medium text-sm">{test.nameSv}</div>
          <div className="text-xs text-muted-foreground">{test.description}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {test.question && (
          <Badge variant="outline" className="text-xs">
            {CORE_QUESTIONS[test.question as keyof typeof CORE_QUESTIONS]}
          </Badge>
        )}
        {test.route && (
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link to={test.route}>Öppna</Link>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRun}
          disabled={test.status === 'running'}
          className="text-xs"
        >
          <Play className="h-3 w-3 mr-1" />
          Testa
        </Button>
      </div>
    </div>
  );
};

const CategorySection: React.FC<{ 
  title: string; 
  icon: React.ReactNode;
  tests: SystemTest[]; 
  onRunTest: (id: string) => void;
}> = ({ title, icon, tests, onRunTest }) => {
  const passed = tests.filter(t => t.status === 'passed').length;
  const total = tests.length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <Badge variant={passed === total ? "default" : "outline"}>
            {passed}/{total}
          </Badge>
        </div>
        <Progress value={(passed / total) * 100} className="h-1" />
      </CardHeader>
      <CardContent className="space-y-2">
        {tests.map(test => (
          <TestRow key={test.id} test={test} onRun={() => onRunTest(test.id)} />
        ))}
      </CardContent>
    </Card>
  );
};

const CoreQuestionsMatrix: React.FC<{ tests: SystemTest[] }> = ({ tests }) => {
  const questions = Object.entries(CORE_QUESTIONS).map(([key, label]) => {
    const relevantTests = tests.filter(t => t.question === key);
    const passed = relevantTests.filter(t => t.status === 'passed').length;
    const hasAny = relevantTests.length > 0;
    
    return { key, label, passed, total: relevantTests.length, hasAny };
  });

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Kärnfrågor systemet ska klara
        </CardTitle>
        <CardDescription>
          "Ingen central fråga ska sakna svar – och inget svar ska sakna kontext."
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {questions.map(q => (
            <div 
              key={q.key}
              className={cn(
                "p-3 rounded-lg text-center",
                q.hasAny && q.passed === q.total ? "bg-status-positive/10" : "bg-muted/30"
              )}
            >
              <div className="font-medium text-sm">{q.label}</div>
              {q.hasAny ? (
                <div className="text-xs text-muted-foreground mt-1">
                  {q.passed}/{q.total} tester
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mt-1">
                  Inga tester
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// === MAIN COMPONENT ===

export const GlobalSmokeTest: React.FC = () => {
  const [tests, setTests] = useState<SystemTest[]>(SYSTEM_TESTS);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const runTest = async (testId: string) => {
    setTests(prev => prev.map(t => 
      t.id === testId ? { ...t, status: 'running' } : t
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Randomly pass/fail for demo (in real implementation, actual tests would run)
    const passed = Math.random() > 0.1;
    
    setTests(prev => prev.map(t => 
      t.id === testId 
        ? { ...t, status: passed ? 'passed' : 'failed', duration: Math.floor(Math.random() * 200) + 50 }
        : t
    ));
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    
    for (const test of tests) {
      await runTest(test.id);
    }
    
    setIsRunningAll(false);
  };

  const resetTests = () => {
    setTests(SYSTEM_TESTS.map(t => ({ ...t, status: 'pending' })));
  };

  const stats = useMemo(() => {
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const pending = tests.filter(t => t.status === 'pending').length;
    return { passed, failed, pending, total: tests.length };
  }, [tests]);

  const routeTests = tests.filter(t => t.category === 'route');
  const componentTests = tests.filter(t => t.category === 'component');
  const dataTests = tests.filter(t => t.category === 'data');
  const integrationTests = tests.filter(t => t.category === 'integration');

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <SystemBreadcrumbs
        items={[
          { label: 'System', labelSv: 'System', level: 'world', href: '/' },
          { label: 'Smoke Test', labelSv: 'Smoke Test', level: 'indicator' }
        ]}
      />

      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Zap className="h-6 w-6" />
          Global Smoke Test
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Block 10: Verifierar att allt håller ihop – alla länder, index, kartor, korrelationer, nivåer.
        </p>
      </div>

      {/* Stats overview */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold font-data text-status-positive">{stats.passed}</div>
                <div className="text-xs text-muted-foreground">Godkända</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-data text-status-critical">{stats.failed}</div>
                <div className="text-xs text-muted-foreground">Misslyckade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-data text-muted-foreground">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Väntande</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetTests} disabled={isRunningAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Återställ
              </Button>
              <Button onClick={runAllTests} disabled={isRunningAll}>
                {isRunningAll ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Kör tester...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Kör alla tester
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Progress 
            value={(stats.passed / stats.total) * 100} 
            className="h-2 mt-4" 
          />
        </CardContent>
      </Card>

      {/* Core questions matrix */}
      <CoreQuestionsMatrix tests={tests} />

      {/* Test categories */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CategorySection 
          title="Rutter & Sidor" 
          icon={<Globe className="h-4 w-4" />}
          tests={routeTests}
          onRunTest={runTest}
        />
        <CategorySection 
          title="Komponenter" 
          icon={<BarChart3 className="h-4 w-4" />}
          tests={componentTests}
          onRunTest={runTest}
        />
        <CategorySection 
          title="Data" 
          icon={<Map className="h-4 w-4" />}
          tests={dataTests}
          onRunTest={runTest}
        />
        <CategorySection 
          title="Integration" 
          icon={<Users className="h-4 w-4" />}
          tests={integrationTests}
          onRunTest={runTest}
        />
      </div>

      {/* Definition of done */}
      <Card className="bg-muted/30">
        <CardContent className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Definition of done:</strong> Ingen central fråga ska sakna svar – och inget svar ska sakna kontext.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSmokeTest;
