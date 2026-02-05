/**
 * QUESTION SHAPER UI
 * 
 * Complete question shaping interface.
 * Translates sloppy questions into decision-capable questions.
 * Without shame — with enlightenment.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GravityIndicator } from './GravityIndicator';
import { shapeQuestion } from '@/core/query-dominance/shaping';
import type { 
  QuestionTranslation, 
  DecisionGravity,
  QualityFeedback,
  ClarificationItem,
} from '@/core/query-dominance/shaping/types';

interface QuestionShaperProps {
  query: string;
  onProceed: (translatedQuery: string) => void;
  onClarify?: (clarifications: Record<string, string>) => void;
}

export function QuestionShaper({
  query,
  onProceed,
  onClarify,
}: QuestionShaperProps) {
  const [shaped, setShaped] = useState<{
    translation: QuestionTranslation;
    gravity: DecisionGravity;
    feedback: QualityFeedback;
  } | null>(null);
  
  const [clarifications, setClarifications] = useState<Record<string, string>>({});
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showTransformations, setShowTransformations] = useState(false);

  useEffect(() => {
    const result = shapeQuestion(query);
    setShaped(result);
    
    // Start timer for minimum time requirement
    const timer = setInterval(() => {
      setTimeSpent(t => t + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [query]);

  if (!shaped) return null;

  const { translation, gravity, feedback } = shaped;
  const minTime = gravity.ux_behavior.minimum_time_on_page;
  const canProceed = 
    timeSpent >= minTime &&
    gravity.ux_behavior.required_acknowledgments.every(ack => acknowledged.includes(ack));

  const handleClarificationChange = (dimension: string, value: string) => {
    const updated = { ...clarifications, [dimension]: value };
    setClarifications(updated);
    onClarify?.(updated);
  };

  const handleAcknowledge = (ack: string) => {
    if (acknowledged.includes(ack)) {
      setAcknowledged(acknowledged.filter(a => a !== ack));
    } else {
      setAcknowledged([...acknowledged, ack]);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{feedback.header}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {feedback.why_this_helps}
          </p>
        </CardContent>
      </Card>

      {/* Question Translation */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Original */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">You asked:</p>
            <p className="text-sm bg-muted p-3 rounded-md italic">
              "{translation.original}"
            </p>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {/* Translated */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Structured as a decision:
            </p>
            <p className="text-sm bg-primary/10 p-3 rounded-md border border-primary/20">
              {translation.translated}
            </p>
          </div>

          {/* Transformations */}
          {translation.transformations.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowTransformations(!showTransformations)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showTransformations ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                What changed?
              </button>
              
              {showTransformations && (
                <ul className="mt-2 space-y-2">
                  {translation.transformations.map((t, i) => (
                    <li key={i} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <span className="font-medium">{t.type.replace('_', ' ')}:</span> {t.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clarifications Needed */}
      {feedback.clarifications_needed.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Clarifications That Would Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.clarifications_needed.map((item) => (
              <ClarificationRow
                key={item.dimension}
                item={item}
                value={clarifications[item.dimension]}
                onChange={(value) => handleClarificationChange(item.dimension, value)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Revealed Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            What This Reveals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Assumptions being made:</p>
            <div className="flex flex-wrap gap-1">
              {translation.revealed_assumptions.map((a, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{a}</Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Alternatives to consider:</p>
            <div className="flex flex-wrap gap-1">
              {translation.revealed_alternatives.map((a, i) => (
                <Badge key={i} variant="outline" className="text-xs">{a}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision Gravity */}
      <GravityIndicator gravity={gravity} showComponents />

      {/* Acknowledgments (if required) */}
      {gravity.ux_behavior.required_acknowledgments.length > 0 && (
        <Card className="border-destructive/30">
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm font-medium">
              Before proceeding, please acknowledge:
            </p>
            {gravity.ux_behavior.required_acknowledgments.map((ack, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={acknowledged.includes(ack)}
                  onCheckedChange={() => handleAcknowledge(ack)}
                />
                <span className="text-sm">{ack}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Minimum Time Progress */}
      {minTime > 0 && timeSpent < minTime && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              High-stakes decision — review time: {timeSpent}s / {minTime}s minimum
            </span>
          </div>
          <Progress value={(timeSpent / minTime) * 100} className="h-1" />
        </div>
      )}

      {/* Proceed Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => onProceed(translation.translated)}
          disabled={!canProceed}
          className="gap-2"
        >
          {canProceed ? (
            <>
              Proceed to Analysis
              <ArrowRight className="h-4 w-4" />
            </>
          ) : minTime > 0 && timeSpent < minTime ? (
            <>
              <Clock className="h-4 w-4" />
              Review required ({minTime - timeSpent}s)
            </>
          ) : (
            'Complete acknowledgments to proceed'
          )}
        </Button>
      </div>
    </div>
  );
}

function ClarificationRow({
  item,
  value,
  onChange,
}: {
  item: ClarificationItem;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm">{item.question_to_user}</p>
      {item.options && (
        <div className="flex flex-wrap gap-2">
          {item.options.map((option) => (
            <Badge
              key={option}
              variant={value === option ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onChange(option)}
            >
              {option}
            </Badge>
          ))}
        </div>
      )}
      {item.default_if_skipped && (
        <p className="text-xs text-muted-foreground">
          Default if skipped: {item.default_if_skipped}
        </p>
      )}
    </div>
  );
}
