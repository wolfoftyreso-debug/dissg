/**
 * EXPLAIN THIS LIKE I'M HUMAN (ETLIH)
 * 
 * Kontextmedveten förklaringsmotor med 3 nivåer
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageCircle,
  Info,
  AlertTriangle,
  HelpCircle,
  Clock,
  Users,
  Sparkles,
  XCircle,
  ChevronRight
} from 'lucide-react';
import {
  ETLIH_CORE_PRINCIPLE,
  ETLIH_NEVER_DOES,
  EXPLANATION_LEVELS,
  DOES_NOT_MEAN,
  LANGUAGE_PRINCIPLES,
  READABILITY_TARGET,
  LINKED_RESOURCES,
  getApplicableWarnings,
  getLevelConfig,
  type ExplanationLevel,
  type DataContext
} from '@/config/explainEngineConfig';

// Streaming chat hook
const useExplainStream = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const explain = useCallback(async (
    context: DataContext,
    level: ExplanationLevel,
    language: 'sv' | 'en' = 'sv',
    question?: string
  ) => {
    setIsLoading(true);
    setExplanation('');
    setError(null);

    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-explain`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ context, level, language, question }),
      });

      if (resp.status === 429) {
        setError('Gränsen för förfrågningar har överskridits. Försök igen senare.');
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        setError('Betalning krävs. Lägg till krediter i ditt konto.');
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullText += content;
              setExplanation(fullText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Explain error:", e);
      setError('Kunde inte generera förklaring. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { explain, explanation, isLoading, error };
};

// Level selector
const LevelSelector: React.FC<{
  selected: ExplanationLevel;
  onSelect: (level: ExplanationLevel) => void;
}> = ({ selected, onSelect }) => (
  <div className="grid grid-cols-3 gap-2">
    {EXPLANATION_LEVELS.map(level => (
      <button
        key={level.id}
        onClick={() => onSelect(level.id)}
        className={`p-3 rounded-lg border-2 text-left transition-all ${
          selected === level.id 
            ? 'border-primary bg-primary/5' 
            : 'border-transparent bg-muted/30 hover:bg-muted/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: level.color }}
          />
          <span className="font-medium text-sm">{level.labelSv}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{level.durationSv}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Users className="h-3 w-3" />
          <span className="truncate">{level.audienceSv}</span>
        </div>
      </button>
    ))}
  </div>
);

// Misinterpretation warnings
const WarningsPanel: React.FC<{ context: DataContext }> = ({ context }) => {
  const warnings = getApplicableWarnings(context);
  
  if (warnings.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {warnings.map((warning, i) => (
        <Alert key={i} className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">{warning.messageSv}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

// "What this does not mean" section
const DoesNotMeanPanel: React.FC<{ type?: 'default' | 'correlation' | 'sensitive' }> = ({ type = 'default' }) => {
  const items = DOES_NOT_MEAN[type];
  
  return (
    <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-500" />
          <CardTitle className="text-sm">Detta betyder INTE:</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-red-400 mt-0.5">—</span>
              <span>{item.sv}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// "Why am I seeing this" button
const WhyAmISeeingThis: React.FC<{ reasons: string[] }> = ({ reasons }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-muted-foreground"
      >
        <HelpCircle className="h-3 w-3 mr-1" />
        Varför visas detta?
      </Button>
      
      {isOpen && (
        <Card className="mt-2 bg-muted/30">
          <CardContent className="pt-3">
            <p className="text-sm mb-2">Denna indikator visas eftersom:</p>
            <ul className="space-y-1">
              {reasons.map((reason, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  {reason}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Linked resources
const LinkedResourcesPanel: React.FC = () => (
  <div className="flex flex-wrap gap-2">
    {LINKED_RESOURCES.map(resource => (
      <Button key={resource.type} variant="outline" size="sm" className="text-xs">
        <span className="mr-1">{resource.icon}</span>
        {resource.labelSv}
      </Button>
    ))}
  </div>
);

// Main explainer component
interface ExplainEngineProps {
  context: DataContext;
  visibilityReasons?: string[];
  onClose?: () => void;
}

export const ExplainEngine: React.FC<ExplainEngineProps> = ({
  context,
  visibilityReasons = ['Stor påverkan på systemet', 'Betydande nylig förändring'],
  onClose
}) => {
  const [level, setLevel] = useState<ExplanationLevel>('quick');
  const { explain, explanation, isLoading, error } = useExplainStream();
  const levelConfig = getLevelConfig(level);

  const handleExplain = () => {
    explain(context, level, 'sv');
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Förklara för mig</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          {ETLIH_CORE_PRINCIPLE.sv}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Context summary */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary">{context.indicatorLabel}</Badge>
            <Badge variant="outline">{context.geographyLabel}</Badge>
            <Badge variant="outline">{context.timePeriod}</Badge>
            {context.sensitivity === 'high' && (
              <Badge variant="destructive" className="text-xs">Känslig data</Badge>
            )}
          </div>
        </div>

        {/* Level selector */}
        <div>
          <p className="text-sm font-medium mb-2">Välj förklaringsnivå:</p>
          <LevelSelector selected={level} onSelect={setLevel} />
        </div>

        {/* Warnings */}
        <WarningsPanel context={context} />

        {/* Generate button */}
        <Button 
          onClick={handleExplain} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>Genererar förklaring...</>
          ) : (
            <>
              <MessageCircle className="h-4 w-4 mr-2" />
              Förklara på {levelConfig.labelSv.toLowerCase()}
            </>
          )}
        </Button>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Explanation */}
        {(isLoading || explanation) && (
          <Card 
            className="border-2"
            style={{ borderColor: levelConfig.color }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: levelConfig.color }}
                />
                <CardTitle className="text-sm">{levelConfig.labelSv}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && !explanation ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Does not mean */}
        {explanation && (
          <DoesNotMeanPanel type={context.sensitivity === 'high' ? 'sensitive' : 'default'} />
        )}

        <Separator />

        {/* Why am I seeing this */}
        <WhyAmISeeingThis reasons={visibilityReasons} />

        {/* Linked resources */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Fördjupa dig:</p>
          <LinkedResourcesPanel />
        </div>

        {/* Never does */}
        <div className="flex flex-wrap gap-2 pt-2">
          {ETLIH_NEVER_DOES.map((item, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              ❌ {item.sv}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Standalone demo with mock context
export const ExplainEngineDemo: React.FC = () => {
  const mockContext: DataContext = {
    indicator: 'gdp_per_capita',
    indicatorLabel: 'BNP per capita',
    geography: 'national',
    geographyLabel: 'Sverige',
    timePeriod: '2014-2024',
    timeSpan: 'long',
    zoomLevel: 'overview',
    sensitivity: 'low',
    dataQuality: 85,
    uncertainty: 12,
    currentValue: 55000,
    trend: 'up',
    changePercent: 15
  };

  const sensitiveContext: DataContext = {
    indicator: 'lgbtq_openness',
    indicatorLabel: 'Rapporterad öppenhet för samkönad läggning',
    geography: 'national',
    geographyLabel: 'Japan',
    timePeriod: '2018-2023',
    timeSpan: 'medium',
    zoomLevel: 'detailed',
    sensitivity: 'high',
    dataQuality: 65,
    uncertainty: 28,
    currentValue: 32,
    trend: 'up',
    changePercent: 8
  };

  const [selectedContext, setSelectedContext] = useState<'economic' | 'sensitive'>('economic');

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Explain This Like I'm Human</h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Förklara exakt det jag tittar på – på rätt nivå, utan att förenkla bort sanningen.
        </p>
      </div>

      {/* Core principle */}
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Kärnprincip:</strong> {ETLIH_CORE_PRINCIPLE.sv}
        </AlertDescription>
      </Alert>

      {/* Context selector */}
      <div className="flex gap-2">
        <Button
          variant={selectedContext === 'economic' ? 'default' : 'outline'}
          onClick={() => setSelectedContext('economic')}
        >
          💰 Ekonomisk indikator
        </Button>
        <Button
          variant={selectedContext === 'sensitive' ? 'default' : 'outline'}
          onClick={() => setSelectedContext('sensitive')}
        >
          🏳️‍🌈 Känslig indikator
        </Button>
      </div>

      {/* Explainer */}
      <ExplainEngine
        context={selectedContext === 'economic' ? mockContext : sensitiveContext}
        visibilityReasons={
          selectedContext === 'economic'
            ? ['Stor påverkan på systemet', 'Stabil uppåtgående trend senaste 10 åren']
            : ['Du har valt att visa denna kategori', 'Betydande förändring senaste 5 åren']
        }
      />

      {/* Language principles */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium mb-2">Språkprinciper för global läsbarhet:</h4>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_PRINCIPLES.map((p, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                ✓ {p.sv}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            {READABILITY_TARGET.sv}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplainEngine;
