/**
 * 🧠 Reality Check Viewer
 * 
 * Main UI for the Reality Check Engine.
 * Shows 3-layer answer model with full traceability.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  AlertCircle, 
  Info,
  ExternalLink,
  QrCode,
  Database,
  FileText,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { 
  RealityCheckQuestion, 
  RealityCheckAnswer,
  UsageMode,
} from '@/types/realityCheck';
import { USAGE_MODE_CONFIGS } from '@/types/realityCheck';

interface RealityCheckViewerProps {
  question: RealityCheckQuestion;
  answer?: RealityCheckAnswer;
  mode?: UsageMode;
  onSubmitAnswer?: (answer: { selectedOptionId?: string; numericGuess?: number; confidence: string }) => void;
  onShare?: () => void;
  className?: string;
}

export function RealityCheckViewer({
  question,
  answer,
  mode = 'public',
  onSubmitAnswer,
  onShare,
  className,
}: RealityCheckViewerProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [numericGuess, setNumericGuess] = useState<string>('');
  const [showLayer3, setShowLayer3] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  const config = USAGE_MODE_CONFIGS[mode];
  const hasAnswered = !!answer;

  const handleSubmit = () => {
    if (!onSubmitAnswer) return;
    
    onSubmitAnswer({
      selectedOptionId: selectedOption || undefined,
      numericGuess: numericGuess ? parseFloat(numericGuess) : undefined,
      confidence: 'somewhat_sure',
    });
  };

  return (
    <div className={cn('max-w-2xl mx-auto space-y-6', className)}>
      {/* Question */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
            {question.category.toUpperCase()}
          </span>
          <span>•</span>
          <span>{question.difficulty}</span>
        </div>
        
        <h2 className="text-2xl font-bold">
          {question.questionTextLocal?.sv || question.questionText}
        </h2>
        
        <p className="text-sm text-muted-foreground">
          Tidsperiod: {question.timeRange.start} – {question.timeRange.end}
        </p>
      </div>

      {/* Answer input (before answering) */}
      {!hasAnswered && (
        <div className="space-y-4 p-6 border rounded-lg bg-muted/20">
          <p className="text-sm font-medium text-muted-foreground">
            Din uppskattning
          </p>
          
          {question.options ? (
            <div className="grid gap-2">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    'p-4 border rounded-lg text-left transition-colors',
                    selectedOption === option.id
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-muted'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="number"
              value={numericGuess}
              onChange={(e) => setNumericGuess(e.target.value)}
              placeholder="Ange ditt svar..."
              className="w-full p-4 border rounded-lg bg-background text-2xl font-mono"
            />
          )}
          
          <Button 
            onClick={handleSubmit}
            disabled={!selectedOption && !numericGuess}
            className="w-full"
          >
            Visa observerad data
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Answer display (after answering) */}
      {hasAnswered && answer && (
        <div className="space-y-6">
          {/* Layer 1: User perception */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">LAGER 1</span>
              Din uppskattning
            </div>
            <p className="text-2xl font-mono">
              {answer.layer1.numericGuess || answer.layer1.selectedOptionId}
            </p>
          </div>

          {/* Layer 2: Observed data */}
          <div className="p-4 border-2 border-primary rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <span className="font-mono text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">LAGER 2</span>
              Observerad data
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-mono font-bold">
                {typeof answer.layer2.observedValue === 'number' 
                  ? answer.layer2.observedValue.toFixed(1)
                  : answer.layer2.observedValue}
              </span>
              <span className="text-muted-foreground">{answer.layer2.unit}</span>
            </div>
            
            {/* Alignment indicator (neutral, not "correct/wrong") */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Överensstämmelse</p>
                <Progress value={answer.alignmentScore} className="h-2" />
              </div>
              <span className="text-lg font-mono">{answer.alignmentScore}%</span>
            </div>
            
            {/* Deviation description */}
            {answer.deviation !== null && (
              <p className="mt-3 text-sm text-muted-foreground">
                {answer.deviationDirection === 'over' && (
                  <>Din uppskattning var {Math.abs(answer.deviation)} {answer.layer2.unit} högre än observerad data.</>
                )}
                {answer.deviationDirection === 'under' && (
                  <>Din uppskattning var {Math.abs(answer.deviation)} {answer.layer2.unit} lägre än observerad data.</>
                )}
                {answer.deviationDirection === 'aligned' && (
                  <>Din uppskattning överensstämmer väl med observerad data.</>
                )}
              </p>
            )}
            
            {/* Data quality indicators */}
            <div className="flex gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
              <span>Konfidens: {answer.layer2.confidence}%</span>
              <span>Datapunkter: {answer.layer2.dataPoints}</span>
              <span>Latens: {answer.layer2.latencyDays} dagar</span>
            </div>
          </div>

          {/* Layer 3: Traceability (collapsible) */}
          <Collapsible open={showLayer3} onOpenChange={setShowLayer3}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">LAGER 3</span>
                  Spårbarhet & källor
                </div>
                <ChevronRight className={cn(
                  'h-4 w-4 transition-transform',
                  showLayer3 && 'rotate-90'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-4 p-4 border rounded-lg bg-muted/10">
              {/* Sources */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Källor
                </h4>
                <ul className="space-y-2">
                  {answer.layer3.sources.map((source, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span>{source.name}</span>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visa <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Methodology */}
              {config.showMethodology && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Metodik
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {answer.layer3.aggregationMethod}
                  </p>
                </div>
              )}
              
              {/* Limitations */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Begränsningar
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {answer.layer3.limitations.map((lim, i) => (
                    <li key={i}>• {lim}</li>
                  ))}
                </ul>
              </div>
              
              {/* What this does NOT show */}
              <div className="p-3 bg-status-warning/10 border border-status-warning/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-status-warning">
                  <Info className="h-4 w-4" />
                  Vad detta INTE visar
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {answer.layer3.whatThisDoesNotShow.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              
              {/* Verification */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-muted-foreground font-mono">
                  Hash: {answer.layer3.verificationHash}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQRDialog(true)}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Verifiera
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action buttons */}
          <div className="flex gap-3">
            {onShare && (
              <Button variant="outline" className="flex-1" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Dela
              </Button>
            )}
            <Button className="flex-1">
              Nästa fråga
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* QR Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifiera data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Skanna QR-koden för att verifiera rådata, 
              aggregeringslogik och systemversion.
            </p>
            {answer && (
              <p className="text-xs font-mono text-muted-foreground break-all">
                {answer.layer3.verificationHash}
              </p>
            )}
            <Button variant="outline" className="w-full" asChild>
              <a href={answer?.layer3.verificationUrl} target="_blank" rel="noopener noreferrer">
                Öppna verifieringssida
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
