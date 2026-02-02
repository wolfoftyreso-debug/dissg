/**
 * WAVE 8 BLOCK BP: "Why Did This Move?" Engine
 * 
 * Standard fråga – inga spekulationer, bara observationer:
 * - Vad rörde sig
 * - När
 * - Vad rörde sig före
 * - Vad rörde sig samtidigt
 * - Vad rörde sig INTE
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface MovementAnalysis {
  whatMoved: {
    indicator: string;
    value: number;
    previousValue: number;
    changePercent: number;
    unit: string;
  };
  when: {
    period: string;
    exactDate: string;
    comparisonPeriod: string;
  };
  movedBefore: Array<{
    indicator: string;
    change: number;
    lagMonths: number;
    domain: string;
  }>;
  movedConcurrently: Array<{
    indicator: string;
    change: number;
    domain: string;
  }>;
  didNotMove: Array<{
    indicator: string;
    domain: string;
    expectedToMove: boolean;
    note?: string;
  }>;
  sources: string[];
}

interface WhyDidThisMoveProps {
  analysis: MovementAnalysis;
  lang?: 'sv' | 'en';
}

export function WhyDidThisMove({
  analysis,
  lang = 'sv',
}: WhyDidThisMoveProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const changeDirection = analysis.whatMoved.changePercent >= 0 ? 'up' : 'down';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          {lang === 'sv' ? 'Varför rörde sig detta?' : 'Why did this move?'}
        </CardTitle>
        <p className="text-xs text-muted-foreground italic">
          {lang === 'sv' 
            ? 'Observationer, inte spekulationer' 
            : 'Observations, not speculations'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 1. VAD RÖRDE SIG */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {lang === 'sv' ? 'Vad rörde sig' : 'What moved'}
              </p>
              <p className="font-semibold">{analysis.whatMoved.indicator}</p>
            </div>
            <div className={`flex items-center gap-1 text-lg font-mono ${
              changeDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {changeDirection === 'up' ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {analysis.whatMoved.changePercent > 0 ? '+' : ''}
              {analysis.whatMoved.changePercent.toFixed(1)}%
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{analysis.whatMoved.previousValue} {analysis.whatMoved.unit}</span>
            <ArrowRight className="h-3 w-3" />
            <span className="font-medium text-foreground">
              {analysis.whatMoved.value} {analysis.whatMoved.unit}
            </span>
          </div>
        </div>

        {/* 2. NÄR */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{lang === 'sv' ? 'Period:' : 'Period:'}</span>
            <span className="font-medium">{analysis.when.period}</span>
          </div>
          <span className="text-muted-foreground">
            {lang === 'sv' ? 'jämfört med' : 'compared to'} {analysis.when.comparisonPeriod}
          </span>
        </div>

        <Separator />

        {/* 3. VAD RÖRDE SIG FÖRE */}
        <div>
          <button 
            className="w-full flex items-center justify-between py-2"
            onClick={() => toggleSection('before')}
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              {lang === 'sv' ? 'Vad rörde sig FÖRE' : 'What moved BEFORE'}
              <Badge variant="secondary" className="text-[10px]">
                {analysis.movedBefore.length}
              </Badge>
            </span>
            {expandedSection === 'before' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSection === 'before' && (
            <div className="pl-6 space-y-2 mt-2">
              {analysis.movedBefore.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                  <div>
                    <span className="font-medium">{item.indicator}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({item.lagMonths} {lang === 'sv' ? 'mån före' : 'mo before'})
                    </span>
                  </div>
                  <span className={`font-mono ${item.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                </div>
              ))}
              {analysis.movedBefore.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  {lang === 'sv' ? 'Inga signifikanta förändringar observerade' : 'No significant changes observed'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 4. VAD RÖRDE SIG SAMTIDIGT */}
        <div>
          <button 
            className="w-full flex items-center justify-between py-2"
            onClick={() => toggleSection('concurrent')}
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {lang === 'sv' ? 'Vad rörde sig SAMTIDIGT' : 'What moved CONCURRENTLY'}
              <Badge variant="secondary" className="text-[10px]">
                {analysis.movedConcurrently.length}
              </Badge>
            </span>
            {expandedSection === 'concurrent' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSection === 'concurrent' && (
            <div className="pl-6 space-y-2 mt-2">
              {analysis.movedConcurrently.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                  <span className="font-medium">{item.indicator}</span>
                  <span className={`font-mono ${item.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                </div>
              ))}
              {analysis.movedConcurrently.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  {lang === 'sv' ? 'Inga samtida förändringar observerade' : 'No concurrent changes observed'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 5. VAD RÖRDE SIG INTE */}
        <div>
          <button 
            className="w-full flex items-center justify-between py-2"
            onClick={() => toggleSection('didnot')}
          >
            <span className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-amber-500" />
              {lang === 'sv' ? 'Vad som INTE rörde sig' : 'What did NOT move'}
              <Badge variant="secondary" className="text-[10px]">
                {analysis.didNotMove.length}
              </Badge>
            </span>
            {expandedSection === 'didnot' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSection === 'didnot' && (
            <div className="pl-6 space-y-2 mt-2">
              {analysis.didNotMove.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded">
                  <div>
                    <span className="font-medium">{item.indicator}</span>
                    {item.expectedToMove && (
                      <Badge variant="outline" className="ml-2 text-[10px]">
                        {lang === 'sv' ? 'Förväntades röra sig' : 'Expected to move'}
                      </Badge>
                    )}
                  </div>
                  {item.note && (
                    <span className="text-xs text-muted-foreground">{item.note}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Källor */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">{lang === 'sv' ? 'Källor:' : 'Sources:'}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.sources.map((source, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {source}
              </Badge>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {lang === 'sv' 
              ? 'Denna analys visar observerade samband. Systemet drar inga slutsatser om orsak och verkan. Tolkning är användarens ansvar.'
              : 'This analysis shows observed associations. The system draws no conclusions about cause and effect. Interpretation is the user\'s responsibility.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
