/**
 * STATISTICAL INTEGRITY PANEL
 * Makes correlations mathematically unassailable
 * 
 * Shows stability scoring, placebo tests, and "what breaks this?"
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Shuffle,
  GitBranch,
  HelpCircle
} from 'lucide-react';
import type { StabilityAssessment, BreakAnalysis, AlternativeCorrelation } from '@/lib/correlation/statistical-integrity';

// Mock data for demonstration
const MOCK_STABILITY: StabilityAssessment = {
  level: 'medium',
  score: 0.62,
  temporalStability: 0.55,
  geographicStability: 0.72,
  demographicStability: 0.58,
  sourceStability: 0.75,
  breakpoints: [
    {
      dimension: 'period',
      description: 'Q1-Q2 2020 vs Q3-Q4 2020',
      originalCorrelation: 0.72,
      modifiedCorrelation: 0.31,
      changePercent: 57,
      breaks: false,
    },
    {
      dimension: 'age',
      description: 'Under 65 vs over 65',
      originalCorrelation: 0.72,
      modifiedCorrelation: 0.15,
      changePercent: 79,
      breaks: true,
    },
  ],
  permutationPValue: 0.023,
  placeboComparison: {
    randomCorrelations: [0.12, -0.08, 0.15, -0.11, 0.09, -0.14, 0.07, -0.06, 0.11, -0.09],
    controlCorrelations: [0.18, -0.15, 0.22, -0.19, 0.14],
    isSpecific: true,
    specificityScore: 0.78,
  },
};

const MOCK_ALTERNATIVES: AlternativeCorrelation[] = [
  { variableName: 'Inflation', variableCode: 'cpi', correlation: 0.81, stabilityLevel: 'high', comparedToTarget: 'stronger', disappearsWithLag: false },
  { variableName: 'Interest Rate', variableCode: 'ir', correlation: 0.68, stabilityLevel: 'medium', comparedToTarget: 'similar', disappearsWithLag: true },
  { variableName: 'Export Volume', variableCode: 'exp', correlation: -0.54, stabilityLevel: 'low', comparedToTarget: 'weaker', disappearsWithLag: false },
  { variableName: 'Consumer Confidence', variableCode: 'cci', correlation: 0.45, stabilityLevel: 'medium', comparedToTarget: 'weaker', disappearsWithLag: true },
  { variableName: 'Industrial Production', variableCode: 'ip', correlation: 0.38, stabilityLevel: 'high', comparedToTarget: 'weaker', disappearsWithLag: false },
];

const MOCK_BREAKS: BreakAnalysis[] = [
  {
    dimension: 'Time period',
    dimensionSv: 'Tidsperiod',
    originalValue: '2020-2022',
    modifiedValue: '2020 only',
    effect: 'weakens',
    newCorrelation: 0.41,
    explanation: 'Correlation weakens significantly when limited to 2020',
    explanationSv: 'Korrelationen försvagas betydligt om begränsad till 2020',
  },
  {
    dimension: 'Age group',
    dimensionSv: 'Åldersgrupp',
    originalValue: 'All ages',
    modifiedValue: 'Under 40',
    effect: 'breaks',
    newCorrelation: 0.12,
    explanation: 'Correlation essentially disappears for younger age groups',
    explanationSv: 'Korrelationen försvinner i princip för yngre åldersgrupper',
  },
  {
    dimension: 'Country',
    dimensionSv: 'Land',
    originalValue: 'Sweden',
    modifiedValue: 'Norway',
    effect: 'unchanged',
    newCorrelation: 0.69,
    explanation: 'Correlation holds in neighboring country',
    explanationSv: 'Korrelationen håller i grannland',
  },
];

function getStabilityBadgeVariant(level: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (level) {
    case 'high': return 'default';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    case 'unstable': return 'destructive';
    default: return 'outline';
  }
}

export function StatisticalIntegrityPanel() {

  return (
    <div className="space-y-6">
      {/* Mandatory warning */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">
                Statistical Integrity Check Active
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This correlation has been tested against {MOCK_STABILITY.placeboComparison.randomCorrelations.length} random variables,
                {' '}{MOCK_STABILITY.breakpoints.length} breakpoint analyses, and permutation testing (p={MOCK_STABILITY.permutationPValue.toFixed(3)}).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stability" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stability">Stabilitet</TabsTrigger>
          <TabsTrigger value="alternatives">Alternativ</TabsTrigger>
          <TabsTrigger value="placebo">Placebo</TabsTrigger>
          <TabsTrigger value="breaks">Vad bryter?</TabsTrigger>
        </TabsList>

        {/* STABILITY TAB */}
        <TabsContent value="stability">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Stability Score</span>
                <Badge variant={getStabilityBadgeVariant(MOCK_STABILITY.level)} className="text-lg px-4 py-1">
                  {MOCK_STABILITY.level.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall score */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Stability</span>
                  <span className="text-sm">{(MOCK_STABILITY.score * 100).toFixed(0)}%</span>
                </div>
                <Progress value={MOCK_STABILITY.score * 100} className="h-3" />
              </div>

              {/* Breakdown */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Temporal (across periods)</span>
                      <span>{(MOCK_STABILITY.temporalStability * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={MOCK_STABILITY.temporalStability * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Geographic (across regions)</span>
                      <span>{(MOCK_STABILITY.geographicStability * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={MOCK_STABILITY.geographicStability * 100} className="h-2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Demographic (across ages)</span>
                      <span>{(MOCK_STABILITY.demographicStability * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={MOCK_STABILITY.demographicStability * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Source (across data sources)</span>
                      <span>{(MOCK_STABILITY.sourceStability * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={MOCK_STABILITY.sourceStability * 100} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">What this means:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>High:</strong> Consistent across periods, regions, groups, sources</li>
                  <li><strong>Medium:</strong> Generally consistent but with some variation</li>
                  <li><strong>Low:</strong> Sensitive to how data is selected</li>
                  <li><strong>Unstable:</strong> Disappears or reverses with small changes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALTERNATIVES TAB */}
        <TabsContent value="alternatives">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                What Else Correlates?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-warning/10 rounded-lg text-sm">
                <p className="text-warning font-medium">Anti-cherry-picking check</p>
                <p className="text-muted-foreground mt-1">
                  Multiple variables show similar or stronger co-movement during this period.
                </p>
              </div>

              <div className="space-y-2">
                {MOCK_ALTERNATIVES.map((alt, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{alt.variableName}</span>
                      <Badge variant="outline" className="text-xs">{alt.variableCode}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">
                        r = {alt.correlation > 0 ? '+' : ''}{alt.correlation.toFixed(2)}
                      </span>
                      <Badge variant={getStabilityBadgeVariant(alt.stabilityLevel)}>
                        {alt.stabilityLevel}
                      </Badge>
                      {alt.comparedToTarget === 'stronger' && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Stronger
                        </Badge>
                      )}
                      {alt.disappearsWithLag && (
                        <Badge variant="outline" className="text-xs">
                          Lag-sensitive
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Showing top 5 alternative correlations. {MOCK_ALTERNATIVES.filter(a => a.comparedToTarget === 'stronger').length} are stronger than the target.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLACEBO TAB */}
        <TabsContent value="placebo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Placebo & Random Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Specificity result */}
              <div className={`p-4 rounded-lg ${MOCK_STABILITY.placeboComparison.isSpecific ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                <div className="flex items-center gap-2">
                  {MOCK_STABILITY.placeboComparison.isSpecific ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium">
                    {MOCK_STABILITY.placeboComparison.isSpecific 
                      ? 'Correlation is SPECIFIC' 
                      : 'Correlation is NON-SPECIFIC'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {MOCK_STABILITY.placeboComparison.isSpecific
                    ? 'Target correlation is notably stronger than random variables.'
                    : 'Random variables show similar correlation strength – this may be spurious.'}
                </p>
              </div>

              {/* Random correlations */}
              <div>
                <h4 className="font-medium mb-2">Random Variable Correlations:</h4>
                <div className="flex flex-wrap gap-2">
                  {MOCK_STABILITY.placeboComparison.randomCorrelations.map((r, i) => (
                    <div 
                      key={i}
                      className="px-3 py-1 bg-muted rounded font-mono text-sm"
                    >
                      {r > 0 ? '+' : ''}{r.toFixed(2)}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Max random: ±{Math.max(...MOCK_STABILITY.placeboComparison.randomCorrelations.map(Math.abs)).toFixed(2)}
                </p>
              </div>

              {/* Permutation test */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Permutation Test</h4>
                <p className="text-sm">
                  p-value: <span className="font-mono">{MOCK_STABILITY.permutationPValue.toFixed(4)}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Probability of observing this correlation by chance alone.
                  {MOCK_STABILITY.permutationPValue < 0.05 
                    ? ' Statistically significant (p < 0.05).'
                    : ' Not statistically significant.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WHAT BREAKS TAB */}
        <TabsContent value="breaks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                What Breaks This Correlation?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click each dimension to see how the correlation changes when assumptions are modified.
              </p>

              <div className="space-y-3">
                {MOCK_BREAKS.map((breakItem, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-lg border ${
                      breakItem.effect === 'breaks' ? 'border-destructive bg-destructive/5' :
                      breakItem.effect === 'weakens' ? 'border-warning bg-warning/5' :
                      breakItem.effect === 'unchanged' ? 'border-primary bg-primary/5' :
                      'border-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{breakItem.dimension}</span>
                        <span className="text-sm text-muted-foreground">({breakItem.dimensionSv})</span>
                      </div>
                      <Badge 
                        variant={
                          breakItem.effect === 'breaks' ? 'destructive' :
                          breakItem.effect === 'weakens' ? 'secondary' :
                          'default'
                        }
                      >
                        {breakItem.effect === 'breaks' && <XCircle className="h-3 w-3 mr-1" />}
                        {breakItem.effect === 'weakens' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {breakItem.effect === 'unchanged' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {breakItem.effect.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">{breakItem.originalValue}</span>
                      <span className="mx-2">→</span>
                      <span>{breakItem.modifiedValue}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm">
                        New r: <span className="font-mono">{breakItem.newCorrelation > 0 ? '+' : ''}{breakItem.newCorrelation.toFixed(2)}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      {breakItem.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Summary:</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    <span className="text-destructive font-medium">
                      {MOCK_BREAKS.filter(b => b.effect === 'breaks').length}
                    </span> dimensions break this correlation
                  </li>
                  <li>
                    <span className="text-warning font-medium">
                      {MOCK_BREAKS.filter(b => b.effect === 'weakens').length}
                    </span> dimensions weaken it
                  </li>
                  <li>
                    <span className="text-primary font-medium">
                      {MOCK_BREAKS.filter(b => b.effect === 'unchanged').length}
                    </span> dimensions leave it unchanged
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
