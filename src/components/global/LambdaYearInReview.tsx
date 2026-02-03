/**
 * LAMBDA YEAR IN REVIEW
 * 
 * "What actually happened – and why"
 * 
 * The public interface that makes the system:
 * - Understandable
 * - Memorable
 * - Impossible to ignore
 * 
 * WITHOUT becoming simplistic.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  EyeOff,
  Share2,
  QrCode,
  ChevronRight,
  BarChart3,
  GitCompare,
  FileText,
  Shield,
} from 'lucide-react';
import {
  type HeadlineLambda,
  type LambdaDriver,
  type LambdaTimeline,
  type LambdaComparison,
  type MovementsSummary,
  type UncertaintyReport,
  type ThreeSentenceSummary,
  type EntityLevel,
  type YearInReviewMetadata,
  DIRECTION_SYMBOLS,
  ENTITY_LEVEL_LABELS,
  SECTION_LABELS,
  YEAR_IN_REVIEW_DOCTRINE,
  DRIVER_DISPLAY_LIMIT,
} from '@/config/lambdaYearInReview';

// =============================================================================
// MOCK DATA FOR DEMONSTRATION
// =============================================================================

const mockHeadline: HeadlineLambda = {
  year: 2024,
  value: 0.94,
  uncertainty: 0.02,
  direction: 'down',
  changeFromPreviousYear: -0.03,
  dataCoveragePercent: 87,
};

const mockDrivers: LambdaDriver[] = [
  { indicatorId: '1', indicatorName: 'Bostadsstress', contribution: -0.012, direction: 'negative', confidence: 'high', statisticalSupport: true },
  { indicatorId: '2', indicatorName: 'Reallöner', contribution: -0.008, direction: 'negative', confidence: 'high', statisticalSupport: true },
  { indicatorId: '3', indicatorName: 'Energikostnader', contribution: -0.006, direction: 'negative', confidence: 'medium', statisticalSupport: true },
  { indicatorId: '4', indicatorName: 'Sysselsättning', contribution: 0.004, direction: 'positive', confidence: 'high', statisticalSupport: true },
  { indicatorId: '5', indicatorName: 'Hälsoutfall', contribution: -0.003, direction: 'negative', confidence: 'medium', statisticalSupport: true },
];

const mockTimeline: LambdaTimeline = {
  year: 2024,
  monthlyData: Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    lambdaValue: 0.97 - (i * 0.003) + (Math.random() * 0.01 - 0.005),
    uncertainty: 0.02,
  })),
  events: [
    { date: '2024-03-15', type: 'decision', title: 'Ränteökning +0.25%', institutionLevel: 'Riksbank' },
    { date: '2024-06-01', type: 'decision', title: 'Budgetproposition 2024', institutionLevel: 'Riksdag' },
    { date: '2024-09-20', type: 'external_shock', title: 'Energiprischock (global)', institutionLevel: 'Externt' },
  ],
};

const mockComparisons: LambdaComparison[] = [
  { type: 'previous_year', currentValue: 0.94, comparisonValue: 0.97, difference: -0.03, differencePercent: -3.1, isComparable: true },
  { type: 'five_year_median', currentValue: 0.94, comparisonValue: 0.96, difference: -0.02, differencePercent: -2.1, isComparable: true },
  { type: 'peer_group', currentValue: 0.94, comparisonValue: 0.95, difference: -0.01, differencePercent: -1.0, isComparable: true, limitations: ['Olika datatäckning för 2/7 länder'] },
];

const mockMovements: MovementsSummary = {
  improvements: [
    { indicatorId: '1', indicatorName: 'Sysselsättningsgrad', change: 0.8, changePercent: 1.1, direction: 'improved' },
    { indicatorId: '2', indicatorName: 'Utbildningsnivå', change: 0.3, changePercent: 0.5, direction: 'improved' },
  ],
  deteriorations: [
    { indicatorId: '3', indicatorName: 'Bostadskostnader/inkomst', change: 2.1, changePercent: 5.2, direction: 'deteriorated' },
    { indicatorId: '4', indicatorName: 'Reallöneutveckling', change: -1.2, changePercent: -2.4, direction: 'deteriorated' },
    { indicatorId: '5', indicatorName: 'Energikostnader', change: 15, changePercent: 12.3, direction: 'deteriorated' },
  ],
};

const mockUncertainties: UncertaintyReport = {
  lowCoverageIndicators: [
    { id: '1', name: 'Mental hälsa (ungdom)', coveragePercent: 45 },
    { id: '2', name: 'Informell ekonomi', coveragePercent: 32 },
  ],
  estimatesUsed: [
    { id: '1', name: 'Regional BNP Q4', estimateType: 'Nowcast-modell' },
  ],
  cannotBeSaid: [
    'Kausal effekt av enskilda politiska beslut',
    'Framtida utveckling av Lambda',
    'Optimal nivå för Lambda',
  ],
};

const mockSummary: ThreeSentenceSummary = {
  overallMovement: 'Systemet rörde sig bort från stabilitet under 2024, med Lambda som föll från 0.97 till 0.94.',
  mainDrivers: 'De primära drivkrafterna var ökad bostadsstress, fallande reallöner och stigande energikostnader.',
  riskRobustness: 'Datakvaliteten tillåter inte prognoser, men den observerade trenden visar ackumulerad stress inom bostads- och energisektorerna.',
  generatedAt: '2025-01-15T10:00:00Z',
  methodVersion: 'LAMBDA-2024.1',
};

const mockMetadata: YearInReviewMetadata = {
  permanentUrl: 'https://lambda.system/review/2024/SE',
  versionId: 'YIR-2024-SE-001',
  methodId: 'LAMBDA-2024.1',
  contentHash: 'sha256:a3f2b8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  qrCodeData: 'lambda://verify/YIR-2024-SE-001',
  generatedAt: '2025-01-15T10:00:00Z',
  validUntil: '2026-01-15T10:00:00Z',
};

// =============================================================================
// COMPONENT
// =============================================================================

interface LambdaYearInReviewProps {
  year?: number;
  entityLevel?: EntityLevel;
  entityName?: string;
  language?: 'sv' | 'en';
}

export const LambdaYearInReview: React.FC<LambdaYearInReviewProps> = ({
  year = 2024,
  entityLevel = 'country',
  entityName = 'Sverige',
  language = 'sv',
}) => {
  const headline = mockHeadline;
  const drivers = mockDrivers;
  const timeline = mockTimeline;
  const comparisons = mockComparisons;
  const movements = mockMovements;
  const uncertainties = mockUncertainties;
  const summary = mockSummary;

  const entityInfo = ENTITY_LEVEL_LABELS[entityLevel];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <span>{entityInfo.icon}</span>
          <span>{entityName}</span>
          <span>•</span>
          <span>{entityInfo[language]}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Lambda Year in Review
        </h1>
        <p className="text-xl text-muted-foreground">{year}</p>
      </div>

      {/* Section A: Headline Lambda */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold tracking-tight">
              λ = {headline.value.toFixed(2)}
              <span className="text-2xl text-muted-foreground ml-2">
                ± {headline.uncertainty.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant={headline.direction === 'down' ? 'destructive' : headline.direction === 'up' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                {DIRECTION_SYMBOLS[headline.direction]} {headline.changeFromPreviousYear > 0 ? '+' : ''}{headline.changeFromPreviousYear.toFixed(2)} {language === 'sv' ? 'från föregående år' : 'from previous year'}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>{language === 'sv' ? 'Datatäckning' : 'Data coverage'}: {headline.dataCoveragePercent}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section B: Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            {SECTION_LABELS.drivers[language]}
          </CardTitle>
          <CardDescription>
            {language === 'sv' 
              ? 'Automatiskt rankad baserat på statistiskt stöd'
              : 'Automatically ranked based on statistical support'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers.slice(0, DRIVER_DISPLAY_LIMIT).map((driver, index) => (
              <button
                key={driver.indicatorId}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                  <div>
                    <div className="font-medium">{driver.indicatorName}</div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'sv' ? 'Konfidens' : 'Confidence'}: {driver.confidence}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={driver.direction === 'negative' ? 'destructive' : 'default'}>
                    {driver.contribution > 0 ? '+' : ''}{driver.contribution.toFixed(3)}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section C: Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {SECTION_LABELS.timeline[language]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simplified timeline visualization */}
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded-lg flex items-end justify-between px-2 pb-2">
              {timeline.monthlyData.map((month) => (
                <div 
                  key={month.month}
                  className="flex flex-col items-center gap-1"
                >
                  <div 
                    className="w-4 bg-primary rounded-t"
                    style={{ height: `${(month.lambdaValue - 0.85) * 400}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {month.month}
                  </span>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{language === 'sv' ? 'Händelser' : 'Events'}</h4>
              {timeline.events.map((event, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Badge variant={event.type === 'decision' ? 'outline' : 'secondary'} className="shrink-0">
                    {new Date(event.date).toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                  <span>{event.title}</span>
                  {event.institutionLevel && (
                    <span className="text-muted-foreground">({event.institutionLevel})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section D: Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            {SECTION_LABELS.comparisons[language]}
          </CardTitle>
          <CardDescription>
            {language === 'sv' ? 'Samma metod, samma år' : 'Same method, same year'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {comparisons.map((comp) => (
              <div key={comp.type} className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="text-sm text-muted-foreground">
                  {comp.type === 'previous_year' && (language === 'sv' ? 'Föregående år' : 'Previous Year')}
                  {comp.type === 'five_year_median' && (language === 'sv' ? '5-årsmedian' : '5-Year Median')}
                  {comp.type === 'peer_group' && (language === 'sv' ? 'Peer-grupp' : 'Peer Group')}
                </div>
                <div className="text-2xl font-mono font-bold">
                  {comp.difference > 0 ? '+' : ''}{comp.difference.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {comp.differencePercent > 0 ? '+' : ''}{comp.differencePercent.toFixed(1)}%
                </div>
                {comp.limitations && comp.limitations.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <AlertTriangle className="h-3 w-3" />
                    {comp.limitations[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section E: Movements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {SECTION_LABELS.movements[language]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {language === 'sv' ? 'Förbättringar' : 'Improvements'}
              </h4>
              {movements.improvements.map((m) => (
                <div key={m.indicatorId} className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <span className="text-sm">{m.indicatorName}</span>
                  <Badge variant="outline">+{m.changePercent.toFixed(1)}%</Badge>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                {language === 'sv' ? 'Försämringar' : 'Deteriorations'}
              </h4>
              {movements.deteriorations.map((m) => (
                <div key={m.indicatorId} className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <span className="text-sm">{m.indicatorName}</span>
                  <Badge variant="destructive">{m.changePercent > 0 ? '+' : ''}{m.changePercent.toFixed(1)}%</Badge>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {language === 'sv' 
              ? 'Endast rörelse visas. Ingen summering till "bra/dåligt".'
              : 'Only movement is shown. No summarizing to "good/bad".'}
          </p>
        </CardContent>
      </Card>

      {/* Section F: Uncertainties */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5" />
            {SECTION_LABELS.uncertainties[language]}
          </CardTitle>
          <CardDescription>
            {language === 'sv' 
              ? 'Detta ökar förtroendet mest'
              : 'This increases trust the most'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">
              {language === 'sv' ? 'Låg datatäckning' : 'Low Data Coverage'}
            </h4>
            <div className="space-y-2">
              {uncertainties.lowCoverageIndicators.map((ind) => (
                <div key={ind.id} className="flex items-center justify-between">
                  <span className="text-sm">{ind.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={ind.coveragePercent} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">{ind.coveragePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">
              {language === 'sv' ? 'Estimat använda' : 'Estimates Used'}
            </h4>
            {uncertainties.estimatesUsed.map((est) => (
              <div key={est.id} className="text-sm flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{est.estimateType}</Badge>
                <span>{est.name}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">
              {language === 'sv' ? 'Vad som inte kan sägas' : 'What Cannot Be Said'}
            </h4>
            <ul className="space-y-1">
              {uncertainties.cannotBeSaid.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Minus className="h-4 w-4 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Section G: Summary */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {SECTION_LABELS.summary[language]}
          </CardTitle>
          <CardDescription>
            {language === 'sv' ? '3 meningar, maskingenererad' : '3 sentences, machine-generated'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-sm">{summary.overallMovement}</li>
            <li className="text-sm">{summary.mainDrivers}</li>
            <li className="text-sm">{summary.riskRobustness}</li>
          </ol>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span>{language === 'sv' ? 'Genererad' : 'Generated'}: {new Date(summary.generatedAt).toLocaleDateString()}</span>
            <span>{language === 'sv' ? 'Metod' : 'Method'}: {summary.methodVersion}</span>
          </div>
        </CardContent>
      </Card>

      {/* Footer: Verification & Sharing */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>{language === 'sv' ? 'Version' : 'Version'}: {mockMetadata.versionId}</span>
              <span>•</span>
              <span>{language === 'sv' ? 'Metod' : 'Method'}: {mockMetadata.methodId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                {language === 'sv' ? 'Dela' : 'Share'}
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                {language === 'sv' ? 'Verifiera' : 'Verify'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctrine footer */}
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground italic">
          "{YEAR_IN_REVIEW_DOCTRINE[language]}"
        </p>
      </div>
    </div>
  );
};

export default LambdaYearInReview;
