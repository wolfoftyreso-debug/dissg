/**
 * DIAGNOSTIC DASHBOARD
 * 
 * Main container for Full System Diagnostic Mode.
 * Three modes: Overview, Live Data, Diagnostik
 * 
 * Design rules:
 * - No decoration without function
 * - No "cool" animations
 * - No emojis
 * - No political colors
 * - Same structure globally
 */

import { useState } from 'react';
import { Activity, AlertTriangle, BarChart3, FileText, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusOverview } from './StatusOverview';
import { OscilloscopeView } from './OscilloscopeView';
import { DiagnosticCodeList } from './DiagnosticCodeList';
import { TriangulationPanel } from './TriangulationPanel';
import type { DiagnosticCode } from '@/lib/lambda/diagnostic-codes';
import type { OscilloscopeConfig, SignalTrace, SignalWarning, SystemStatus } from '@/lib/lambda/oscilloscope-mode';
import type { ValidationReport } from '@/lib/lambda/sensor-triangulation';

type DiagnosticMode = 'overview' | 'live' | 'diagnostik';

interface DiagnosticDashboardProps {
  // Overview data
  globalLambda: number;
  lambdaUncertainty: number;
  activeWarnings: number;
  criticalDeviations: number;
  lastSignificantChange?: {
    description: string;
    timestamp: string;
  };
  
  // Oscilloscope data
  oscilloscopeConfig: OscilloscopeConfig;
  traces: SignalTrace[];
  signalWarnings: SignalWarning[];
  systemStatus: SystemStatus;
  
  // Diagnostic codes
  activeCodes: DiagnosticCode[];
  historicalCodes: DiagnosticCode[];
  
  // Triangulation
  validationReport?: ValidationReport;
  
  // Settings
  language?: 'sv' | 'en';
  geoScope?: string;
  
  // Callbacks
  onTimeBaseChange?: (timeBase: string) => void;
  onChannelToggle?: (channelId: string) => void;
  onCodeSelect?: (code: DiagnosticCode) => void;
  
  className?: string;
}

export function DiagnosticDashboard({
  globalLambda,
  lambdaUncertainty,
  activeWarnings,
  criticalDeviations,
  lastSignificantChange,
  oscilloscopeConfig,
  traces,
  signalWarnings,
  systemStatus,
  activeCodes,
  historicalCodes,
  validationReport,
  language = 'sv',
  geoScope = 'GLOBAL',
  onTimeBaseChange,
  onChannelToggle,
  onCodeSelect,
  className,
}: DiagnosticDashboardProps) {
  const [mode, setMode] = useState<DiagnosticMode>('overview');
  
  const modeLabels = {
    overview: { sv: 'Status', en: 'Status' },
    live: { sv: 'Live Data', en: 'Live Data' },
    diagnostik: { sv: 'Diagnostik', en: 'Diagnostics' },
  };
  
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header bar - always visible */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-mono text-sm font-semibold">
                LAMBDA SYSTEM
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {geoScope}
            </span>
          </div>
          
          {/* Quick status indicators */}
          <div className="flex items-center gap-6">
            {/* Lambda value */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">λ</span>
              <span className={cn(
                'font-mono text-sm font-bold',
                globalLambda >= 0.90 && globalLambda <= 1.10 
                  ? 'text-blue-500' 
                  : globalLambda < 0.85 || globalLambda > 1.15
                    ? 'text-red-500'
                    : 'text-amber-500'
              )}>
                {globalLambda.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">
                ±{lambdaUncertainty.toFixed(2)}
              </span>
            </div>
            
            {/* Warnings */}
            {activeWarnings > 0 && (
              <div className="flex items-center gap-1.5 text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-mono text-sm">{activeWarnings}</span>
              </div>
            )}
            
            {/* Critical */}
            {criticalDeviations > 0 && (
              <div className="flex items-center gap-1.5 text-red-500">
                <Radio className="h-4 w-4 animate-pulse" />
                <span className="font-mono text-sm">{criticalDeviations}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content with tabs */}
      <main className="container py-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as DiagnosticMode)}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {modeLabels.overview[language]}
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {modeLabels.live[language]}
            </TabsTrigger>
            <TabsTrigger value="diagnostik" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {modeLabels.diagnostik[language]}
            </TabsTrigger>
          </TabsList>
          
          {/* A. OVERVIEW / STATUS */}
          <TabsContent value="overview" className="space-y-6">
            <StatusOverview
              globalLambda={globalLambda}
              lambdaUncertainty={lambdaUncertainty}
              activeWarnings={activeWarnings}
              criticalDeviations={criticalDeviations}
              lastSignificantChange={lastSignificantChange}
              systemStatus={systemStatus}
              recentCodes={activeCodes.slice(0, 5)}
              language={language}
            />
            
            {validationReport && (
              <TriangulationPanel
                report={validationReport}
                language={language}
              />
            )}
          </TabsContent>
          
          {/* B. LIVE DATA (Oscilloscope) */}
          <TabsContent value="live" className="space-y-6">
            <OscilloscopeView
              config={oscilloscopeConfig}
              traces={traces}
              warnings={signalWarnings}
              systemStatus={systemStatus}
              onTimeBaseChange={onTimeBaseChange}
              onChannelToggle={onChannelToggle}
              language={language}
            />
            
            {/* Signal explanations - three levels */}
            <div className="grid gap-4 md:grid-cols-3">
              <ExplanationCard
                level={1}
                title={language === 'sv' ? 'Sammanfattning' : 'Summary'}
                description={language === 'sv' 
                  ? 'Förklaring för en 18-åring'
                  : 'Explanation for an 18-year-old'}
                content={generateSimpleSummary(traces, language)}
              />
              <ExplanationCard
                level={2}
                title={language === 'sv' ? 'Teknisk förklaring' : 'Technical Explanation'}
                description={language === 'sv'
                  ? 'Metodbeskrivning och beräkningar'
                  : 'Methodology and calculations'}
                content={generateTechnicalExplanation(traces, language)}
              />
              <ExplanationCard
                level={3}
                title={language === 'sv' ? 'Rådata + Källa' : 'Raw Data + Source'}
                description={language === 'sv'
                  ? 'Fullständig dataspårning'
                  : 'Complete data lineage'}
                content={generateDataLineage(traces, language)}
              />
            </div>
          </TabsContent>
          
          {/* C. DIAGNOSTIK & FELKODER */}
          <TabsContent value="diagnostik" className="space-y-6">
            <DiagnosticCodeList
              activeCodes={activeCodes}
              historicalCodes={historicalCodes}
              onCodeSelect={onCodeSelect}
              language={language}
            />
          </TabsContent>
        </Tabs>
        
        {/* Footer disclaimer - always visible */}
        <footer className="mt-12 pt-6 border-t">
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">
              {language === 'sv' 
                ? 'Detta är mätdata, inte en åsikt.'
                : 'This is measurement data, not an opinion.'}
            </p>
            <p>
              {language === 'sv'
                ? 'Systemet mäter, visar och loggar. Det argumenterar inte, övertygar inte, förespråkar inte.'
                : 'The system measures, displays, and logs. It does not argue, persuade, or advocate.'}
            </p>
            <p className="font-mono text-[10px]">
              {language === 'sv' 
                ? `Genererat: ${new Date().toISOString()} | Scope: ${geoScope}`
                : `Generated: ${new Date().toISOString()} | Scope: ${geoScope}`}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// =============================================================================
// EXPLANATION CARD COMPONENT
// =============================================================================

interface ExplanationCardProps {
  level: 1 | 2 | 3;
  title: string;
  description: string;
  content: string;
}

function ExplanationCard({ level, title, description, content }: ExplanationCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-mono">
          {level}
        </span>
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}

// =============================================================================
// HELPER FUNCTIONS FOR EXPLANATIONS
// =============================================================================

function generateSimpleSummary(traces: SignalTrace[], language: 'sv' | 'en'): string {
  if (traces.length === 0) {
    return language === 'sv' 
      ? 'Ingen data tillgänglig för visning.'
      : 'No data available for display.';
  }
  
  return language === 'sv'
    ? 'Graferna visar hur olika mätpunkter förändras över tid. Blå linjer indikerar stabila värden, orange indikerar förhöjda nivåer.'
    : 'The graphs show how different measurement points change over time. Blue lines indicate stable values, orange indicates elevated levels.';
}

function generateTechnicalExplanation(traces: SignalTrace[], language: 'sv' | 'en'): string {
  return language === 'sv'
    ? 'Signaler normaliseras via Z-score mot 5-årig baseline. Brus beräknas som residualvarians efter trendavdrag. Konfidens baseras på källtäckning och triangulering.'
    : 'Signals normalized via Z-score against 5-year baseline. Noise calculated as residual variance after trend removal. Confidence based on source coverage and triangulation.';
}

function generateDataLineage(traces: SignalTrace[], language: 'sv' | 'en'): string {
  return language === 'sv'
    ? 'Klicka på valfri datapunkt för fullständig källspårning: rådata → transformation → aggregering → källa-URL.'
    : 'Click any data point for complete source tracing: raw data → transformation → aggregation → source URL.';
}

export default DiagnosticDashboard;
