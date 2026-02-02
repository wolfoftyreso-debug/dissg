/**
 * Reality Check Demo Page
 * 
 * Demonstration of the Rosling-style calibration system.
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RealityCheckViewer, 
  CorrelationExplorer, 
  PerceptionHeatmap,
} from '@/components/realityCheck';
import { buildAnswer } from '@/lib/realityCheck/answerEngine';
import type { 
  RealityCheckQuestion, 
  RealityCheckAnswer,
  PerceptionGap,
  CorrelationResult,
} from '@/types/realityCheck';

// Demo question (Rosling-style)
const DEMO_QUESTION: RealityCheckQuestion = {
  id: 'demo_child_mortality',
  code: 'RC_CHILD_MORTALITY_GLOBAL',
  questionText: 'How has global child mortality (under 5) changed since 1990?',
  questionTextLocal: { 
    sv: 'Hur har global barnadödlighet (under 5) förändrats sedan 1990?' 
  },
  category: 'trend',
  difficulty: 'easy',
  indicatorIds: ['child_mortality_u5'],
  geoScope: 'global',
  timeRange: { start: '1990-01-01', end: '2024-12-31' },
  options: [
    { id: 'halved', label: 'Minskat med mer än hälften', value: 'halved' },
    { id: 'decreased', label: 'Minskat med mindre än hälften', value: 'decreased' },
    { id: 'same', label: 'Ungefär oförändrad', value: 'same' },
    { id: 'increased', label: 'Ökat', value: 'increased' },
  ],
  requiresLiveData: true,
  minimumConfidence: 80,
  sources: ['WHO', 'UNICEF', 'World Bank'],
  lastVerified: '2024-01-15T00:00:00Z',
  isActive: true,
};

// Demo indicators for correlation explorer
const DEMO_INDICATORS = [
  { id: 'gdp_per_capita', name: 'GDP per capita', nameSv: 'BNP per capita', category: 'economy' },
  { id: 'life_expectancy', name: 'Life expectancy', nameSv: 'Medellivslängd', category: 'health' },
  { id: 'education_years', name: 'Years of education', nameSv: 'Utbildningsår', category: 'education' },
  { id: 'co2_emissions', name: 'CO2 emissions', nameSv: 'CO2-utsläpp', category: 'environment' },
  { id: 'child_mortality', name: 'Child mortality', nameSv: 'Barnadödlighet', category: 'health' },
];

const DEMO_REGIONS = [
  { code: 'GLOBAL', name: 'Global', nameSv: 'Globalt' },
  { code: 'EU', name: 'European Union', nameSv: 'EU' },
  { code: 'OECD', name: 'OECD', nameSv: 'OECD' },
];

// Demo perception gaps
const DEMO_PERCEPTION_GAPS: PerceptionGap[] = [
  {
    questionId: 'child_mortality',
    questionCategory: 'trend',
    averagePerception: -25,
    actualValue: -59,
    gapPercent: 34,
    gapDirection: 'under',
    sampleSize: 15000,
    calculatedAt: new Date().toISOString(),
  },
  {
    questionId: 'extreme_poverty',
    questionCategory: 'trend',
    averagePerception: 40,
    actualValue: 9,
    gapPercent: -78,
    gapDirection: 'over',
    sampleSize: 12000,
    calculatedAt: new Date().toISOString(),
  },
  {
    questionId: 'life_expectancy',
    questionCategory: 'magnitude',
    averagePerception: 65,
    actualValue: 73,
    gapPercent: -11,
    gapDirection: 'under',
    sampleSize: 18000,
    calculatedAt: new Date().toISOString(),
  },
  {
    questionId: 'girls_school',
    questionCategory: 'distribution',
    averagePerception: 35,
    actualValue: 67,
    gapPercent: -48,
    gapDirection: 'under',
    sampleSize: 8000,
    calculatedAt: new Date().toISOString(),
  },
  {
    questionId: 'renewable_energy',
    questionCategory: 'comparison',
    averagePerception: 15,
    actualValue: 29,
    gapPercent: -48,
    gapDirection: 'under',
    sampleSize: 9500,
    calculatedAt: new Date().toISOString(),
  },
];

const RealityCheckDemo: React.FC = () => {
  const [answer, setAnswer] = useState<RealityCheckAnswer | undefined>();

  const handleSubmitAnswer = (response: { selectedOptionId?: string; numericGuess?: number; confidence: string }) => {
    // Build answer with demo observed data
    const builtAnswer = buildAnswer({
      question: DEMO_QUESTION,
      userResponse: {
        ...response,
        confidence: response.confidence as 'somewhat_sure',
      },
      observedData: {
        value: 'halved', // The correct answer
        unit: '',
        confidence: 95,
        sources: [
          { id: 'who', name: 'WHO', url: 'https://who.int', reliability: 95, lastUpdated: '2024-01-01' },
          { id: 'unicef', name: 'UNICEF', url: 'https://unicef.org', reliability: 94, lastUpdated: '2024-01-01' },
        ],
        dataAsOf: '2024-01-01',
        latencyDays: 45,
        dataPoints: 35,
      },
      aggregationMethod: 'Weighted average of country-level data, population-adjusted',
      limitations: [
        'Some countries have incomplete historical records',
        'Definition of "under 5 mortality" may vary slightly between sources',
        'Recent data may be preliminary estimates',
      ],
    });
    
    setAnswer(builtAnswer);
  };

  const handleCorrelationCalculate = async (): Promise<CorrelationResult> => {
    // Simulated correlation result
    return {
      request: {
        variableA: 'gdp_per_capita',
        variableB: 'life_expectancy',
        geoScope: ['GLOBAL'],
        timeRange: { start: '2020-01-01', end: '2024-12-31' },
      },
      coefficient: 0.78,
      strength: 'strong',
      direction: 'positive',
      pValue: 0.001,
      isSignificant: true,
      disclaimers: {
        correlationNotCausation: true,
        unmeasuredVariables: [
          'Healthcare system quality',
          'Lifestyle factors',
          'Environmental conditions',
          'Social safety nets',
        ],
        confoundingFactors: [
          'Education levels',
          'Urbanization rate',
          'Climate',
        ],
        temporalLimitations: 'This correlation is calculated over a 5-year window and may not hold over different time periods.',
      },
      sourceSignature: {
        id: 'SS-demo',
        hash: 'DEMO1234',
        includedSources: [
          { id: 'wb', name: 'World Bank', weight: 1 },
          { id: 'who', name: 'WHO', weight: 1 },
        ],
        excludedSources: [],
        exclusionImpact: null,
        qrCodeUrl: '/api/qr/demo',
        verificationUrl: '/verify/demo',
        createdAt: new Date().toISOString(),
      },
      verificationHash: 'RC-DEMO-HASH',
      generatedAt: new Date().toISOString(),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">🧠 Reality Check Engine</h1>
          <p className="text-muted-foreground">
            Rosling-style calibration – Live data · Full traceability · Zero speculation
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="check" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="check">Reality Check</TabsTrigger>
            <TabsTrigger value="correlation">Korrelationer</TabsTrigger>
            <TabsTrigger value="heatmap">Perception Gap</TabsTrigger>
          </TabsList>

          <TabsContent value="check">
            <RealityCheckViewer
              question={DEMO_QUESTION}
              answer={answer}
              mode="public"
              onSubmitAnswer={handleSubmitAnswer}
            />
          </TabsContent>

          <TabsContent value="correlation">
            <CorrelationExplorer
              indicators={DEMO_INDICATORS}
              regions={DEMO_REGIONS}
              onCalculate={handleCorrelationCalculate}
            />
          </TabsContent>

          <TabsContent value="heatmap">
            <PerceptionHeatmap
              gaps={DEMO_PERCEPTION_GAPS}
              groupBy="category"
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            "Systemet ska aldrig hjälpa användaren att ha rätt. 
            Det ska hjälpa användaren att vara korrekt."
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RealityCheckDemo;
