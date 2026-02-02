/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPOTLESS DASHBOARD - Global QA Dashboard (Spotless Protocol §8-9)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * System-wide checklist that must pass:
 * - All elements clickable
 * - All numbers have sources
 * - All sources clickable
 * - All summaries have limitation blocks
 * - All comparisons methodologically valid
 * - No empty navigation
 * - No hidden uncertainty
 * - No implicit interpretation
 * 
 * If one box fails → page rejected.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Eye,
  MousePointer,
  Database,
  FileText,
  Link2,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpotless, type SpotlessViolation, type PageCompliance } from '@/context/SpotlessContext';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export function SpotlessDashboard() {
  const { 
    globalScore, 
    pagesAudited, 
    globalViolations,
    isAuditMode,
    enableAuditMode,
    disableAuditMode 
  } = useSpotless();

  const totalPages = Object.keys(pagesAudited).length;
  const spotlessPages = Object.values(pagesAudited).filter(p => p.isSpotless).length;
  const criticalViolations = globalViolations.filter(v => v.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Spotless Protocol Dashboard
          </h1>
          <p className="text-muted-foreground">
            Epistemisk kvalitetsrevision — Systemomfattande compliance
          </p>
        </div>
        <Button 
          variant={isAuditMode ? "destructive" : "default"}
          onClick={isAuditMode ? disableAuditMode : enableAuditMode}
        >
          <Eye className="h-4 w-4 mr-2" />
          {isAuditMode ? 'Avsluta audit' : 'Starta audit'}
        </Button>
      </div>

      {/* Global Score */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlobalScoreCard score={globalScore} />
        <MetricCard 
          title="Sidor granskade"
          value={totalPages}
          subtitle={`${spotlessPages} spotless`}
          icon={FileText}
          trend={spotlessPages / Math.max(totalPages, 1) > 0.8 ? 'up' : 'down'}
        />
        <MetricCard 
          title="Kritiska fel"
          value={criticalViolations}
          subtitle="Måste åtgärdas"
          icon={XCircle}
          variant={criticalViolations > 0 ? 'critical' : 'positive'}
        />
        <MetricCard 
          title="Totala överträdelser"
          value={globalViolations.length}
          subtitle="Alla kategorier"
          icon={AlertTriangle}
          variant={globalViolations.length > 10 ? 'warning' : 'neutral'}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist">Checklista</TabsTrigger>
          <TabsTrigger value="violations">Överträdelser ({globalViolations.length})</TabsTrigger>
          <TabsTrigger value="pages">Sidor ({totalPages})</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <SpotlessChecklist />
        </TabsContent>

        <TabsContent value="violations" className="mt-4">
          <ViolationsList violations={globalViolations} />
        </TabsContent>

        <TabsContent value="pages" className="mt-4">
          <PagesList pages={Object.values(pagesAudited)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL SCORE CARD
// ═══════════════════════════════════════════════════════════════════════════

function GlobalScoreCard({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 95) return 'text-status-positive';
    if (s >= 80) return 'text-status-warning';
    return 'text-status-critical';
  };

  const getScoreLabel = (s: number) => {
    if (s === 100) return 'SPOTLESS';
    if (s >= 95) return 'Nästan spotless';
    if (s >= 80) return 'Behöver arbete';
    return 'Kritiskt';
  };

  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6 text-center">
        <div className={cn('text-5xl font-bold tabular-nums', getScoreColor(score))}>
          {score}
        </div>
        <p className="text-sm text-muted-foreground mt-1">av 100</p>
        <Badge 
          className={cn(
            'mt-3',
            score === 100 && 'bg-status-positive text-white',
            score >= 95 && score < 100 && 'bg-status-positive/20 text-status-positive',
            score >= 80 && score < 95 && 'bg-status-warning/20 text-status-warning',
            score < 80 && 'bg-status-critical/20 text-status-critical'
          )}
        >
          {getScoreLabel(score)}
        </Badge>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARD
// ═══════════════════════════════════════════════════════════════════════════

interface MetricCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: typeof CheckCircle;
  variant?: 'positive' | 'warning' | 'critical' | 'neutral';
  trend?: 'up' | 'down';
}

function MetricCard({ title, value, subtitle, icon: Icon, variant = 'neutral', trend }: MetricCardProps) {
  const variantStyles = {
    positive: 'text-status-positive',
    warning: 'text-status-warning',
    critical: 'text-status-critical',
    neutral: 'text-foreground',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn('text-3xl font-bold tabular-nums', variantStyles[variant])}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Icon className={cn('h-5 w-5', variantStyles[variant])} />
            {trend && (
              trend === 'up' 
                ? <TrendingUp className="h-4 w-4 text-status-positive" />
                : <TrendingDown className="h-4 w-4 text-status-critical" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPOTLESS CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════

const CHECKLIST_ITEMS = [
  { 
    id: 'clickable', 
    label: 'Alla element klickbara', 
    icon: MousePointer,
    description: 'Inga visuella element utan fördjupningsmöjlighet'
  },
  { 
    id: 'sourced', 
    label: 'Alla siffror har källa', 
    icon: Database,
    description: '5 obligatoriska fält per datapunkt'
  },
  { 
    id: 'source_clickable', 
    label: 'Alla källor klickbara', 
    icon: Link2,
    description: 'Källor är noder, inte fotnoter'
  },
  { 
    id: 'limitations', 
    label: 'Alla sammanfattningar har begränsningsblock', 
    icon: Eye,
    description: 'Visar/Visar inte obligatoriskt'
  },
  { 
    id: 'valid_comparisons', 
    label: 'Alla jämförelser metodiskt giltiga', 
    icon: CheckCircle,
    description: 'Blockering av ogiltiga jämförelser'
  },
  { 
    id: 'no_dead_ends', 
    label: 'Ingen tom navigering', 
    icon: ChevronRight,
    description: 'Inga återvändsgränder'
  },
  { 
    id: 'no_hidden_uncertainty', 
    label: 'Ingen dold osäkerhet', 
    icon: AlertTriangle,
    description: 'All osäkerhet synlig'
  },
  { 
    id: 'no_implicit', 
    label: 'Ingen implicit tolkning', 
    icon: FileText,
    description: 'Inga värdeord eller kausalitetspåståenden'
  },
];

function SpotlessChecklist() {
  const { globalViolations } = useSpotless();

  // Determine which checks pass based on violations
  const getCheckStatus = (checkId: string): 'pass' | 'fail' | 'unknown' => {
    const violationTypeMap: Record<string, string[]> = {
      clickable: ['non_clickable'],
      sourced: ['missing_source'],
      source_clickable: ['hover_only_source'],
      limitations: ['missing_limitation_block'],
      valid_comparisons: ['invalid_comparison'],
      no_dead_ends: ['dead_end'],
      no_hidden_uncertainty: ['hidden_uncertainty'],
      no_implicit: ['loose_language'],
    };

    const relevantTypes = violationTypeMap[checkId] || [];
    const hasViolation = globalViolations.some(v => relevantTypes.includes(v.type));
    
    if (globalViolations.length === 0) return 'unknown';
    return hasViolation ? 'fail' : 'pass';
  };

  const passCount = CHECKLIST_ITEMS.filter(item => getCheckStatus(item.id) === 'pass').length;
  const progress = (passCount / CHECKLIST_ITEMS.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Systemomfattande checklista</span>
          <Badge variant={progress === 100 ? 'default' : 'outline'}>
            {passCount}/{CHECKLIST_ITEMS.length} godkända
          </Badge>
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map(item => {
            const status = getCheckStatus(item.id);
            const Icon = item.icon;
            
            return (
              <div 
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-md border',
                  status === 'pass' && 'bg-status-positive/5 border-status-positive/30',
                  status === 'fail' && 'bg-status-critical/5 border-status-critical/30',
                  status === 'unknown' && 'bg-muted/50'
                )}
              >
                {status === 'pass' && <CheckCircle className="h-5 w-5 text-status-positive shrink-0" />}
                {status === 'fail' && <XCircle className="h-5 w-5 text-status-critical shrink-0" />}
                {status === 'unknown' && <Icon className="h-5 w-5 text-muted-foreground shrink-0" />}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>

                {status === 'fail' && (
                  <Badge variant="outline" className="text-status-critical border-status-critical/40">
                    UNDERKÄND
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIOLATIONS LIST
// ═══════════════════════════════════════════════════════════════════════════

function ViolationsList({ violations }: { violations: SpotlessViolation[] }) {
  const criticalViolations = violations.filter(v => v.severity === 'critical');
  const warningViolations = violations.filter(v => v.severity === 'warning');
  const infoViolations = violations.filter(v => v.severity === 'info');

  if (violations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-status-positive mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Inga överträdelser</h3>
          <p className="text-muted-foreground">Systemet är spotless!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {criticalViolations.length > 0 && (
        <ViolationSection 
          title="Kritiska" 
          violations={criticalViolations} 
          severity="critical" 
        />
      )}
      {warningViolations.length > 0 && (
        <ViolationSection 
          title="Varningar" 
          violations={warningViolations} 
          severity="warning" 
        />
      )}
      {infoViolations.length > 0 && (
        <ViolationSection 
          title="Information" 
          violations={infoViolations} 
          severity="info" 
        />
      )}
    </div>
  );
}

function ViolationSection({ 
  title, 
  violations, 
  severity 
}: { 
  title: string; 
  violations: SpotlessViolation[]; 
  severity: 'critical' | 'warning' | 'info';
}) {
  const colors = {
    critical: 'border-status-critical/40 bg-status-critical/5',
    warning: 'border-status-warning/40 bg-status-warning/5',
    info: 'border-primary/40 bg-primary/5',
  };

  return (
    <Card className={colors[severity]}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {severity === 'critical' && <XCircle className="h-4 w-4 text-status-critical" />}
          {severity === 'warning' && <AlertTriangle className="h-4 w-4 text-status-warning" />}
          {severity === 'info' && <AlertTriangle className="h-4 w-4 text-primary" />}
          {title} ({violations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {violations.map(v => (
            <div key={v.id} className="flex items-start gap-3 p-2 bg-background/50 rounded">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{v.element}</p>
                <p className="text-xs text-muted-foreground">{v.description}</p>
                <p className="text-xs text-muted-foreground mt-1">📍 {v.location}</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {v.type.replace(/_/g, ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGES LIST
// ═══════════════════════════════════════════════════════════════════════════

function PagesList({ pages }: { pages: PageCompliance[] }) {
  if (pages.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Inga sidor granskade</h3>
          <p className="text-muted-foreground">Aktivera audit-läge för att börja granska.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {pages.map(page => (
            <div 
              key={page.pageId}
              className={cn(
                'flex items-center gap-3 p-3 rounded-md border',
                page.isSpotless 
                  ? 'bg-status-positive/5 border-status-positive/30'
                  : 'bg-muted/50'
              )}
            >
              {page.isSpotless ? (
                <CheckCircle className="h-5 w-5 text-status-positive shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-status-warning shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{page.pagePath}</p>
                <p className="text-xs text-muted-foreground">
                  {page.clickableElements}/{page.totalElements} klickbara • 
                  {page.sourcedElements}/{page.totalElements} med källa • 
                  {page.violations.length} överträdelser
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className={cn(
                  'text-lg font-bold tabular-nums',
                  page.score >= 95 && 'text-status-positive',
                  page.score >= 80 && page.score < 95 && 'text-status-warning',
                  page.score < 80 && 'text-status-critical'
                )}>
                  {page.score}
                </p>
                <p className="text-xs text-muted-foreground">poäng</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SpotlessDashboard;
