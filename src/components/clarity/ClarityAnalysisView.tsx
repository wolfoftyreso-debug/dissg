/**
 * Clarity Analysis View Component
 * 
 * 🔬 ENGINEERING-GRADE DATA PRESENTATION
 * 
 * Mandatory structure:
 * A. What was observed
 * B. What moved together
 * C. What cannot be concluded
 * D. Misinterpretation risks
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ClarityAnalysis, 
  ObservationBlock, 
  CoMovementBlock, 
  LimitationsBlock,
  MisinterpretationRiskBlock,
  STANDARD_DISCLAIMERS,
  validateAnalysisCompleteness,
} from '@/config/absoluteClarityConfig';

// ============================================
// MAIN COMPONENT
// ============================================

interface ClarityAnalysisViewProps {
  analysis: ClarityAnalysis;
  language?: 'en' | 'sv';
}

export function ClarityAnalysisView({ 
  analysis, 
  language = 'en' 
}: ClarityAnalysisViewProps) {
  // Validate completeness - block render if incomplete
  const validation = validateAnalysisCompleteness(analysis);
  
  if (!validation.isValid) {
    return (
      <IncompleteAnalysisBlock 
        missingBlocks={validation.missingBlocks} 
        language={language}
      />
    );
  }

  return (
    <div className="space-y-6 font-mono text-sm">
      {/* Header */}
      <AnalysisHeader topic={analysis.topic} generatedAt={analysis.generatedAt} />
      
      {/* A. What Was Observed */}
      <ObservationSection data={analysis.observation} language={language} />
      
      {/* B. What Moved Together */}
      <CoMovementSection data={analysis.coMovement} language={language} />
      
      {/* C. What Cannot Be Concluded (MANDATORY) */}
      <LimitationsSection data={analysis.limitations} language={language} />
      
      {/* D. Misinterpretation Risk (MANDATORY) */}
      <MisinterpretationSection data={analysis.misinterpretationRisk} language={language} />
      
      {/* Footer Disclaimer */}
      <DisclaimerFooter language={language} />
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function AnalysisHeader({ topic, generatedAt }: { topic: string; generatedAt: string }) {
  return (
    <div className="border-b border-border pb-4">
      <h1 className="text-lg font-medium text-foreground tracking-tight">
        {topic}
      </h1>
      <p className="text-xs text-muted-foreground mt-1 font-mono">
        Generated: {new Date(generatedAt).toISOString()}
      </p>
    </div>
  );
}

// ============================================
// A. OBSERVATION SECTION
// ============================================

function ObservationSection({ 
  data, 
  language 
}: { 
  data: ObservationBlock; 
  language: 'en' | 'sv';
}) {
  const title = language === 'sv' ? 'A. Vad observerades' : 'A. What was observed';
  
  return (
    <Card className="border-border bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Period */}
        <div>
          <span className="text-xs text-muted-foreground uppercase">
            {language === 'sv' ? 'Tidsperiod' : 'Time Period'}
          </span>
          <p className="font-mono text-foreground">
            {data.timePeriod.start} → {data.timePeriod.end}
          </p>
        </div>

        {/* Key Indicators Table */}
        <div>
          <span className="text-xs text-muted-foreground uppercase">
            {language === 'sv' ? 'Nyckelindikatorer' : 'Key Indicators'}
          </span>
          <table className="w-full mt-2 text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">
                  {language === 'sv' ? 'Indikator' : 'Indicator'}
                </th>
                <th className="text-right py-2 font-medium text-muted-foreground">
                  {language === 'sv' ? 'Värde' : 'Value'}
                </th>
                <th className="text-right py-2 font-medium text-muted-foreground">
                  {language === 'sv' ? 'Källa' : 'Source'}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.keyIndicators.map((ind, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 text-foreground">{ind.name}</td>
                  <td className="py-2 text-right font-mono text-foreground">
                    {ind.value} {ind.unit}
                  </td>
                  <td className="py-2 text-right text-muted-foreground">
                    <a 
                      href="#" 
                      className="underline hover:text-foreground"
                      title={ind.methodology}
                    >
                      {ind.source}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Historical Deviation */}
        <div>
          <span className="text-xs text-muted-foreground uppercase">
            {language === 'sv' ? 'Avvikelse från historiskt snitt' : 'Deviation from historical average'}
          </span>
          <p className="font-mono text-foreground">
            Baseline: {data.historicalDeviation.baselinePeriod}
            <br />
            Deviation: {data.historicalDeviation.deviationPercent > 0 ? '+' : ''}
            {data.historicalDeviation.deviationPercent.toFixed(1)}% 
            ({data.historicalDeviation.deviationAbsolute > 0 ? '+' : ''}
            {data.historicalDeviation.deviationAbsolute.toFixed(2)})
          </p>
        </div>

        {/* Peer Comparison */}
        {data.peerComparison.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground uppercase">
              {language === 'sv' ? 'Jämförelse med liknande länder' : 'Peer comparison'}
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.peerComparison.map((peer, i) => (
                <span 
                  key={i}
                  className="px-2 py-1 bg-muted text-foreground text-xs font-mono"
                >
                  {peer.country}: {peer.value}
                  {peer.rank && ` (#${peer.rank})`}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// B. CO-MOVEMENT SECTION
// ============================================

function CoMovementSection({ 
  data, 
  language 
}: { 
  data: CoMovementBlock; 
  language: 'en' | 'sv';
}) {
  const title = language === 'sv' ? 'B. Vad rörde sig tillsammans' : 'B. What moved together';
  
  return (
    <Card className="border-border bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Correlations */}
        <div>
          <span className="text-xs text-muted-foreground uppercase">
            {language === 'sv' ? 'Samvariationer' : 'Correlations'}
          </span>
          <table className="w-full mt-2 text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">
                  {language === 'sv' ? 'Par' : 'Pair'}
                </th>
                <th className="text-right py-2 font-medium text-muted-foreground">r</th>
                <th className="text-right py-2 font-medium text-muted-foreground">
                  {language === 'sv' ? 'Stabilitet' : 'Stability'}
                </th>
                <th className="text-right py-2 font-medium text-muted-foreground">
                  {language === 'sv' ? 'Fördröjning' : 'Lag'}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.correlations.map((corr, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 text-foreground">
                    {corr.indicatorA} ↔ {corr.indicatorB}
                  </td>
                  <td className="py-2 text-right font-mono text-foreground">
                    {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-mono text-muted-foreground">
                    {corr.stabilityScore}/100
                  </td>
                  <td className="py-2 text-right font-mono text-muted-foreground">
                    {corr.timeLag ? `${corr.timeLag}m` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* What moved / didn't move */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase">
              {language === 'sv' ? 'Vad rörde sig' : 'What moved'}
            </span>
            <ul className="mt-1 space-y-1">
              {data.whatMoved.map((item, i) => (
                <li key={i} className="text-xs text-foreground font-mono">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase">
              {language === 'sv' ? 'Vad rörde sig inte' : 'What did not move'}
            </span>
            <ul className="mt-1 space-y-1">
              {data.whatDidNotMove.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground font-mono">• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mandatory correlation warning */}
        <div className="bg-muted/50 p-3 text-xs text-muted-foreground font-mono">
          {STANDARD_DISCLAIMERS.correlationWarning[language]}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// C. LIMITATIONS SECTION (MANDATORY)
// ============================================

function LimitationsSection({ 
  data, 
  language 
}: { 
  data: LimitationsBlock; 
  language: 'en' | 'sv';
}) {
  const title = language === 'sv' ? 'C. Vad som inte kan fastställas' : 'C. What cannot be concluded';
  
  return (
    <Card className="border-border bg-background border-l-4 border-l-muted-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {language === 'sv' ? '(Obligatorisk sektion)' : '(Mandatory section)'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Gaps */}
        <LimitationList 
          title={language === 'sv' ? 'Datagap' : 'Data gaps'}
          items={data.dataGaps}
        />
        
        {/* Uncertainties */}
        <LimitationList 
          title={language === 'sv' ? 'Osäkerheter' : 'Uncertainties'}
          items={data.uncertainties}
        />
        
        {/* Alternative Explanations */}
        <LimitationList 
          title={language === 'sv' ? 'Alternativa förklaringar' : 'Alternative explanations'}
          items={data.alternativeExplanations}
        />
        
        {/* Known Biases */}
        <LimitationList 
          title={language === 'sv' ? 'Kända bias i källor' : 'Known biases in sources'}
          items={data.knownBiases}
        />

        {/* Methodology Changes */}
        {data.methodologyChanges.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground uppercase">
              {language === 'sv' ? 'Metodändringar' : 'Methodology changes'}
            </span>
            <div className="mt-1 space-y-1">
              {data.methodologyChanges.map((change, i) => (
                <div key={i} className="text-xs font-mono">
                  <span className="text-muted-foreground">{change.date}:</span>{' '}
                  <span className="text-foreground">{change.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// D. MISINTERPRETATION RISK (MANDATORY)
// ============================================

function MisinterpretationSection({ 
  data, 
  language 
}: { 
  data: MisinterpretationRiskBlock; 
  language: 'en' | 'sv';
}) {
  const title = language === 'sv' ? 'D. Feltolkningsrisker' : 'D. Misinterpretation risks';
  
  return (
    <Card className="border-border bg-muted/30 border-l-4 border-l-muted-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {language === 'sv' 
            ? 'Skydd mot propaganda – åt alla håll' 
            : 'Protection against propaganda – in all directions'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Misbeliefs */}
        <LimitationList 
          title={language === 'sv' ? 'Vad folk ofta tror' : 'What people often believe'}
          items={data.commonMisbeliefs}
        />
        
        {/* What Data Does Not Say */}
        <LimitationList 
          title={language === 'sv' ? 'Vad datan INTE säger' : 'What the data does NOT say'}
          items={data.whatDataDoesNotSay}
        />
        
        {/* Requires Further Study */}
        <LimitationList 
          title={language === 'sv' ? 'Kräver mer forskning' : 'Requires further study'}
          items={data.requiresFurtherStudy}
        />
      </CardContent>
    </Card>
  );
}

// ============================================
// HELPER: Limitation List
// ============================================

function LimitationList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  
  return (
    <div>
      <span className="text-xs text-muted-foreground uppercase">{title}</span>
      <ul className="mt-1 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-foreground font-mono pl-2 border-l border-muted-foreground/30">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// FOOTER DISCLAIMER
// ============================================

function DisclaimerFooter({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-t border-border pt-4 space-y-2">
      <p className="text-xs text-muted-foreground font-mono">
        {STANDARD_DISCLAIMERS.platformStatement[language]}
      </p>
      <p className="text-xs text-muted-foreground font-mono">
        {STANDARD_DISCLAIMERS.noCausalClaim[language]}
      </p>
      <Separator className="my-2" />
      <p className="text-xs text-muted-foreground font-mono">
        {STANDARD_DISCLAIMERS.dataLimitation[language]}
      </p>
    </div>
  );
}

// ============================================
// INCOMPLETE ANALYSIS BLOCK
// ============================================

function IncompleteAnalysisBlock({ 
  missingBlocks, 
  language 
}: { 
  missingBlocks: string[]; 
  language: 'en' | 'sv';
}) {
  const title = language === 'sv' 
    ? 'Analys kan inte visas' 
    : 'Analysis cannot be displayed';
  
  const reason = language === 'sv'
    ? 'Obligatoriska sektioner saknas. Analys utan begränsningar visas aldrig.'
    : 'Mandatory sections are missing. Analysis without limitations is never shown.';
  
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-6">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{reason}</p>
        <div className="mt-4">
          <span className="text-xs text-muted-foreground uppercase">
            {language === 'sv' ? 'Saknade block' : 'Missing blocks'}
          </span>
          <ul className="mt-1">
            {missingBlocks.map((block, i) => (
              <li key={i} className="text-xs text-destructive font-mono">• {block}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClarityAnalysisView;
