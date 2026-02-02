/**
 * BLOCK TA — QUESTION-FIRST INTERFACE
 * "Allt börjar med en fråga i naturligt språk"
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { EXAMPLE_QUESTIONS } from '@/config/personalInsightConfig';

interface QuestionInterfaceProps {
  onQuestionApproved: (question: string, interpretation: string) => void;
}

export function QuestionInterface({ onQuestionApproved }: QuestionInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeQuestion = () => {
    if (!question.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI interpretation
    setTimeout(() => {
      const interpretations: Record<string, string> = {
        'energi': 'Undersöka sambandet mellan energipriser och hushållens ekonomiska situation över tid, med fokus på europeiska länder.',
        'inflation': 'Jämföra länder med olika inflationshantering och identifiera strukturella faktorer som kan ha påverkat utfallet.',
        'förändrats': 'Identifiera de KPI:er som visat störst förändring i Europa under det senaste decenniet.',
        'arbetslöshet': 'Analysera arbetslöshetstrenden i nordiska länder och möjliga samvarierande faktorer.',
        'utbildning': 'Undersöka korrelationen mellan utbildningsnivå och ekonomiska välståndsindikatorer.',
      };

      const matchedKey = Object.keys(interpretations).find(key => 
        question.toLowerCase().includes(key)
      );

      setInterpretation(
        matchedKey 
          ? interpretations[matchedKey]
          : `Analysera och visualisera data relaterat till: "${question}"`
      );
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleApprove = () => {
    if (interpretation) {
      onQuestionApproved(question, interpretation);
    }
  };

  const handleReject = () => {
    setInterpretation(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Ställ din fråga
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Beskriv vad du vill undersöka med egna ord
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question input */}
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="T.ex. 'Hur hänger energipriser och hushållens ekonomi ihop?'"
          className="min-h-[100px] resize-none"
          disabled={interpretation !== null}
        />

        {/* Example questions */}
        {!interpretation && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Exempel på frågor:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.slice(0, 3).map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setQuestion(q)}
                >
                  {q.length > 40 ? q.slice(0, 40) + '...' : q}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Analyze button */}
        {!interpretation && (
          <Button 
            onClick={analyzeQuestion} 
            disabled={!question.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Analyserar frågan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analysera min fråga
              </>
            )}
          </Button>
        )}

        {/* Interpretation display */}
        {interpretation && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Jag tolkar din fråga som:</p>
              <p className="text-sm text-muted-foreground italic">
                "{interpretation}"
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApprove} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Ja, fortsätt
              </Button>
              <Button variant="outline" onClick={handleReject} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Nej, omformulera
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
