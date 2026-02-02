/**
 * WAVE 8 BLOCK BR: AI as Contextual Lens
 * 
 * AI = förstoringsglas, inte kompass.
 * 
 * AI FÅR:
 * - sammanfatta relationer
 * - peka på samtidiga rörelser
 * - förklara grafer
 * 
 * AI FÅR INTE:
 * - ge investeringsråd
 * - dra normativa slutsatser
 * - säga "borde"
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  AlertTriangle,
  Info,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContextualAILensProps {
  indicatorName: string;
  indicatorValue: number;
  change: number;
  relatedIndicators: Array<{
    name: string;
    domain: string;
    change: number;
  }>;
  period: string;
  lang?: 'sv' | 'en';
}

/**
 * Förbjudna ord som AI inte får använda
 */
const FORBIDDEN_WORDS = [
  'borde', 'bör', 'ska', 'måste', 'rekommenderar',
  'bättre', 'sämre', 'lyckades', 'misslyckades',
  'investera', 'köp', 'sälj', 'undvik',
  'should', 'must', 'recommend', 'better', 'worse',
  'succeeded', 'failed', 'invest', 'buy', 'sell', 'avoid',
];

/**
 * Tillåtna neutrala ord
 */
const ALLOWED_WORDS = [
  'ökade', 'minskade', 'förändrades', 'sammanfaller med', 'avviker från',
  'observeras', 'noteras', 'uppvisar', 'korrelerar med',
  'increased', 'decreased', 'changed', 'coincides with', 'deviates from',
  'observed', 'noted', 'exhibits', 'correlates with',
];

export function ContextualAILens({
  indicatorName,
  indicatorValue,
  change,
  relatedIndicators,
  period,
  lang = 'sv',
}: ContextualAILensProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);

  const validateAIResponse = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    const hasForbidden = FORBIDDEN_WORDS.some(word => 
      lowerText.includes(word.toLowerCase())
    );
    return !hasForbidden;
  };

  const generateSummary = async () => {
    setIsLoading(true);
    setAiSummary(null);
    setValidationPassed(null);

    try {
      const contextData = {
        indicator: indicatorName,
        value: indicatorValue,
        change: change,
        period: period,
        relatedChanges: relatedIndicators,
      };

      const { data, error } = await supabase.functions.invoke('ai-explain', {
        body: {
          type: 'contextual_summary',
          data: contextData,
          lang: lang,
        },
      });

      if (error) throw error;

      const summary = data?.summary || data?.message || '';
      
      // Validera att AI följer reglerna
      const isValid = validateAIResponse(summary);
      setValidationPassed(isValid);
      
      if (isValid) {
        setAiSummary(summary);
      } else {
        setAiSummary(lang === 'sv' 
          ? 'AI-sammanfattningen kunde inte valideras enligt systemets neutralitetsregler.'
          : 'AI summary could not be validated according to system neutrality rules.');
      }
    } catch (error) {
      console.error('AI summary error:', error);
      toast.error(lang === 'sv' ? 'Kunde inte generera sammanfattning' : 'Could not generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {lang === 'sv' ? 'AI-sammanfattning' : 'AI Summary'}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {lang === 'sv' 
            ? 'Neutral sammanfattning av observerade samband' 
            : 'Neutral summary of observed associations'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Regler - alltid synliga */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {lang === 'sv' ? 'AI får:' : 'AI may:'}
            </p>
            <ul className="text-[10px] text-emerald-700 dark:text-emerald-300 space-y-1">
              <li>• {lang === 'sv' ? 'Sammanfatta relationer' : 'Summarize relations'}</li>
              <li>• {lang === 'sv' ? 'Peka på samtida rörelser' : 'Point to concurrent movements'}</li>
              <li>• {lang === 'sv' ? 'Förklara grafer' : 'Explain graphs'}</li>
            </ul>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded border border-rose-200 dark:border-rose-800">
            <p className="text-xs font-medium text-rose-800 dark:text-rose-200 mb-2 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {lang === 'sv' ? 'AI får INTE:' : 'AI may NOT:'}
            </p>
            <ul className="text-[10px] text-rose-700 dark:text-rose-300 space-y-1">
              <li>• {lang === 'sv' ? 'Ge investeringsråd' : 'Give investment advice'}</li>
              <li>• {lang === 'sv' ? 'Dra normativa slutsatser' : 'Draw normative conclusions'}</li>
              <li>• {lang === 'sv' ? 'Säga "borde"' : 'Say "should"'}</li>
            </ul>
          </div>
        </div>

        {!aiSummary && !isLoading && (
          <Button 
            onClick={generateSummary} 
            className="w-full"
            variant="outline"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {lang === 'sv' ? 'Generera AI-sammanfattning' : 'Generate AI Summary'}
          </Button>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              {lang === 'sv' ? 'Analyserar kontext...' : 'Analyzing context...'}
            </span>
          </div>
        )}

        {aiSummary && (
          <div className="space-y-3">
            {/* Valideringsstatus */}
            <div className={`flex items-center gap-2 p-2 rounded text-xs ${
              validationPassed 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300'
            }`}>
              {validationPassed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {lang === 'sv' ? 'Validerad: Följer neutralitetsregler' : 'Validated: Follows neutrality rules'}
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  {lang === 'sv' ? 'Varning: Kunde inte verifiera neutralitet' : 'Warning: Could not verify neutrality'}
                </>
              )}
            </div>

            {/* AI-svar */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm leading-relaxed">{aiSummary}</p>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-[10px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                {lang === 'sv' 
                  ? 'AI-genererad text baserad på observerade data. Är inte finansiell rådgivning. Tolkning är användarens ansvar.'
                  : 'AI-generated text based on observed data. Not financial advice. Interpretation is user\'s responsibility.'}
              </p>
            </div>

            <Button 
              onClick={generateSummary} 
              variant="ghost"
              size="sm"
              className="w-full"
            >
              {lang === 'sv' ? 'Generera ny sammanfattning' : 'Generate new summary'}
            </Button>
          </div>
        )}

        {/* Tillåtna ord-referens */}
        <Separator />
        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2">
            {lang === 'sv' ? 'Tillåtna formuleringsar:' : 'Allowed phrasings:'}
          </p>
          <div className="flex flex-wrap gap-1">
            {ALLOWED_WORDS.filter((_, i) => lang === 'sv' ? i < 5 : i >= 5).map((word, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
