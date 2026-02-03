/**
 * System Audit Dashboard
 * 
 * OEM-class self-diagnosis panel.
 * Shows system health, findings, and Lambda eligibility.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { 
  SystemHealthReport, 
  AuditFinding, 
  LambdaEligibilityReport 
} from '@/lib/diagnostic-system';

// =============================================================================
// MOCK DATA - Replace with real audit results
// =============================================================================

const MOCK_HEALTH_REPORT: SystemHealthReport = {
  overallHealth: 'degraded',
  healthScore: 67,
  totalFindings: 42,
  criticalFindings: 8,
  warningFindings: 22,
  infoFindings: 12,
  findingsByCategory: {
    missing_tolerance: 12,
    missing_source: 4,
    missing_methodology: 8,
    speculative_content: 3,
    orphaned_parameter: 2,
    high_abstraction_index: 1,
    weak_source: 5,
    outdated_data: 3,
    missing_uncertainty: 15,
    ui_not_clickable: 7,
    no_historical_data: 4,
    no_peer_comparison: 9,
  },
  diagnosticReadyPercent: 34,
  lambdaEligiblePercent: 18,
  topIssues: [
    {
      id: 'AUD-TOL-001-1',
      code: 'AUD-TOL-001',
      severity: 'critical',
      category: 'missing_tolerance',
      title: 'Toleransintervall saknas',
      description: 'Toleransintervall saknas för: BNP per capita',
      affectedItems: ['Globalt → Ekonomi → Produktion → BNP per capita'],
      recommendation: 'Definiera toleransintervall baserat på historisk normalzon.',
      autoFixable: false,
      foundAt: new Date().toISOString(),
    },
    {
      id: 'AUD-SPE-001-1',
      code: 'AUD-SPE-001',
      severity: 'critical',
      category: 'speculative_content',
      title: 'Spekulativt innehåll',
      description: 'Spekulativt innehåll: Analys av klimatpolitik',
      affectedItems: ['/analysis/climate-policy'],
      recommendation: 'Ta bort värdeord och tolkningar.',
      autoFixable: false,
      foundAt: new Date().toISOString(),
    },
  ],
  systemSelfDiagnosis: [
    {
      code: 'SYS-CAL-001',
      severity: 'critical',
      description: 'Parametrar saknar toleransdefinition',
      count: 12,
    },
    {
      code: 'SYS-UNC-001',
      severity: 'warning',
      description: 'Osäkerhetsmarginaler saknas',
      count: 15,
    },
  ],
  generatedAt: new Date().toISOString(),
};

const MOCK_LAMBDA_REPORT: LambdaEligibilityReport = {
  canCalculateLambda: false,
  blockingIssues: ['Täckning 18% är under minimum 70%'],
  eligibleParameters: ['Förväntad livslängd', 'Arbetslöshet', 'CO2-utsläpp per capita'],
  ineligibleParameters: [
    { name: 'BNP per capita', reason: 'Tolerans saknas' },
    { name: 'Gini-koefficient', reason: 'Historik saknas' },
    { name: 'Energiintensitet', reason: 'Börvärde saknas' },
  ],
  coveragePercent: 18,
  minimumCoverageRequired: 70,
  generatedAt: new Date().toISOString(),
};

// =============================================================================
// COMPONENTS
// =============================================================================

function HealthStatusBadge({ health }: { health: 'healthy' | 'degraded' | 'critical' }) {
  const config = {
    healthy: { label: 'OPERATIVT', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    degraded: { label: 'DEGRADERAT', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    critical: { label: 'KRITISKT', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };
  
  return (
    <Badge variant="outline" className={`font-mono text-xs ${config[health].className}`}>
      {config[health].label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  const config = {
    critical: { label: 'KRITISK', className: 'bg-red-500/10 text-red-500' },
    warning: { label: 'VARNING', className: 'bg-yellow-500/10 text-yellow-500' },
    info: { label: 'INFO', className: 'bg-blue-500/10 text-blue-500' },
  };
  
  return (
    <Badge variant="secondary" className={`font-mono text-[10px] ${config[severity].className}`}>
      {config[severity].label}
    </Badge>
  );
}

function SystemHealthCard({ report }: { report: SystemHealthReport }) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono">SYSTEMHÄLSA</CardTitle>
          <HealthStatusBadge health={report.overallHealth} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="text-center py-4">
          <div className="text-5xl font-mono font-bold">
            {report.healthScore}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Systemhälsopoäng (0-100)
          </div>
        </div>

        <Separator />

        {/* Findings Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-mono text-red-500">{report.criticalFindings}</div>
            <div className="text-[10px] text-muted-foreground">KRITISKA</div>
          </div>
          <div>
            <div className="text-2xl font-mono text-yellow-500">{report.warningFindings}</div>
            <div className="text-[10px] text-muted-foreground">VARNINGAR</div>
          </div>
          <div>
            <div className="text-2xl font-mono text-blue-500">{report.infoFindings}</div>
            <div className="text-[10px] text-muted-foreground">INFO</div>
          </div>
        </div>

        <Separator />

        {/* Diagnostic Readiness */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Diagnostiskt färdiga</span>
            <span className="font-mono text-sm">{report.diagnosticReadyPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500/50" 
              style={{ width: `${report.diagnosticReadyPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Lambda-kvalificerade</span>
            <span className="font-mono text-sm">{report.lambdaEligiblePercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/50" 
              style={{ width: `${report.lambdaEligiblePercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SystemSelfDiagnosisCard({ codes }: { codes: SystemHealthReport['systemSelfDiagnosis'] }) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono">SYSTEMETS SJÄLVDIAGNOS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {codes.map((code) => (
            <div key={code.code} className="flex items-start gap-3 p-2 bg-muted/30 rounded">
              <SeverityBadge severity={code.severity} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs">{code.code}</div>
                <div className="text-xs text-muted-foreground">{code.description}</div>
              </div>
              <div className="font-mono text-sm text-muted-foreground">
                {code.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopIssuesCard({ issues }: { issues: AuditFinding[] }) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono">TOPPROBLEM</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="p-3 bg-muted/30 rounded space-y-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <span className="font-mono text-xs text-muted-foreground">{issue.code}</span>
                </div>
                <div className="text-sm">{issue.title}</div>
                <div className="text-xs text-muted-foreground">{issue.description}</div>
                <div className="text-xs text-primary">{issue.recommendation}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function LambdaEligibilityCard({ report }: { report: LambdaEligibilityReport }) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono">LAMBDA-KVALIFICERING</CardTitle>
          <Badge 
            variant="outline" 
            className={`font-mono text-xs ${
              report.canCalculateLambda 
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {report.canCalculateLambda ? 'KAN BERÄKNAS' : 'BLOCKERAD'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coverage */}
        <div className="text-center py-3">
          <div className="text-4xl font-mono font-bold">
            {report.coveragePercent}%
          </div>
          <div className="text-xs text-muted-foreground">
            Täckning (minimum: {report.minimumCoverageRequired}%)
          </div>
        </div>

        {/* Blocking Issues */}
        {report.blockingIssues.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="text-xs font-mono text-red-500 mb-2">BLOCKERANDE</div>
              {report.blockingIssues.map((issue, i) => (
                <div key={i} className="text-xs text-muted-foreground">
                  {issue}
                </div>
              ))}
            </div>
          </>
        )}

        <Separator />

        {/* Eligible vs Ineligible */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-mono text-green-500 mb-2">
              KVALIFICERADE ({report.eligibleParameters.length})
            </div>
            {report.eligibleParameters.slice(0, 5).map((param, i) => (
              <div key={i} className="text-xs text-muted-foreground truncate">
                {param}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-mono text-red-500 mb-2">
              EJ KVALIFICERADE ({report.ineligibleParameters.length})
            </div>
            {report.ineligibleParameters.slice(0, 5).map((param, i) => (
              <div key={i} className="text-xs text-muted-foreground truncate">
                {param.name}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SystemAuditDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-semibold">SYSTEMAUDIT</h1>
          <p className="text-sm text-muted-foreground">
            OEM-klass självdiagnos och valideringsrapport
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          Genererad: {new Date().toLocaleString('sv-SE')}
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthCard report={MOCK_HEALTH_REPORT} />
        <LambdaEligibilityCard report={MOCK_LAMBDA_REPORT} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemSelfDiagnosisCard codes={MOCK_HEALTH_REPORT.systemSelfDiagnosis} />
        <TopIssuesCard issues={MOCK_HEALTH_REPORT.topIssues} />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground font-mono pt-6 border-t border-border/50">
        VIDA/ODIS-KLASS DIAGNOSTIK | INGEN DATA UTAN VERIFIERING
      </div>
    </div>
  );
}

export default SystemAuditDashboard;
