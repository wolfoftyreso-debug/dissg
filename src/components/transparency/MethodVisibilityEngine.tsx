import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  Copy, 
  CheckCircle2,
  Filter,
  Scale,
  Clock,
  FileJson,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { EXPORT_INCLUDES } from '@/config/dataPositioningConfig';

export interface MethodDetails {
  /** Formelnamn */
  name: string;
  
  /** Matematisk formel (LaTeX-liknande) */
  formula: string;
  
  /** Förklaring i klartext */
  explanation: string;
  
  /** Urvalskriterier */
  selection: {
    description: string;
    includedCount: number;
    excludedCount: number;
    criteria: string[];
  };
  
  /** Viktning */
  weighting?: {
    description: string;
    weights: { name: string; weight: number }[];
  };
  
  /** Tidsfönster */
  timeWindow: {
    start: string;
    end: string;
    granularity: string;
  };
  
  /** Datakällor */
  sources: {
    name: string;
    url: string;
    license: string;
  }[];
  
  /** Konfidensgrad */
  confidence: number;
}

interface MethodVisibilityDisplayProps {
  /** Metoddetaljer */
  method: MethodDetails;
  
  /** Visa som dialog eller inline */
  variant?: 'dialog' | 'inline' | 'compact';
  
  /** Trigger-text för dialog */
  triggerText?: string;
  
  className?: string;
}

/**
 * WAVE 7 BLOCK BH: Method Visibility Engine
 * 
 * Visar full metodtransparens:
 * - Exakt formel
 * - Exakt urval
 * - Exakt viktning
 * - Exakt tidsfönster
 * 
 * Ingen formel får vara dold.
 */
export function MethodVisibilityDisplay({
  method,
  variant = 'dialog',
  triggerText = 'Visa metod',
  className = '',
}: MethodVisibilityDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} kopierad`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportMethod = () => {
    const exportData = {
      method: {
        name: method.name,
        formula: method.formula,
        explanation: method.explanation,
      },
      selection: method.selection,
      weighting: method.weighting,
      timeWindow: method.timeWindow,
      sources: method.sources,
      confidence: method.confidence,
      exportedAt: new Date().toISOString(),
      includes: EXPORT_INCLUDES,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `method-${method.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Metodbeskrivning exporterad');
  };

  const content = (
    <div className="space-y-4">
      {/* Formel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Exakt formel
          </h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => handleCopy(method.formula, 'Formel')}
          >
            {copied === 'Formel' ? (
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg border font-mono text-sm">
          {method.formula}
        </div>
        <p className="text-xs text-muted-foreground">
          {method.explanation}
        </p>
      </div>

      <Separator />

      {/* Urval */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Exakt urval
        </h4>
        <p className="text-xs text-muted-foreground">
          {method.selection.description}
        </p>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            {method.selection.includedCount} inkluderade
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            {method.selection.excludedCount} exkluderade
          </span>
        </div>
        {method.selection.criteria.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {method.selection.criteria.map((c, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {c}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Viktning */}
      {method.weighting && (
        <>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Exakt viktning
            </h4>
            <p className="text-xs text-muted-foreground">
              {method.weighting.description}
            </p>
            <div className="space-y-1">
              {method.weighting.weights.map((w, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span>{w.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${w.weight * 100}%` }}
                      />
                    </div>
                    <span className="font-mono w-12 text-right">
                      {(w.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Tidsfönster */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Exakt tidsfönster
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="text-muted-foreground">Från</p>
            <p className="font-medium">{method.timeWindow.start}</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="text-muted-foreground">Till</p>
            <p className="font-medium">{method.timeWindow.end}</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="text-muted-foreground">Granularitet</p>
            <p className="font-medium">{method.timeWindow.granularity}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Konfidens */}
      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
        <span className="text-xs font-medium">Konfidensgrad</span>
        <Badge variant={method.confidence > 0.8 ? 'default' : method.confidence > 0.5 ? 'secondary' : 'destructive'}>
          {(method.confidence * 100).toFixed(0)}%
        </Badge>
      </div>

      {/* Export */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleExportMethod}
      >
        <Download className="h-3.5 w-3.5 mr-2" />
        Exportera metodbeskrivning (JSON)
      </Button>
    </div>
  );

  if (variant === 'inline') {
    return <div className={className}>{content}</div>;
  }

  if (variant === 'compact') {
    return (
      <div className={`p-3 border rounded-lg bg-muted/20 text-xs ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{method.name}</span>
          <Badge variant="outline" className="text-[10px]">
            {(method.confidence * 100).toFixed(0)}% konfidens
          </Badge>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground mb-2 truncate">
          {method.formula}
        </p>
        <MethodVisibilityDisplay
          method={method}
          variant="dialog"
          triggerText="Visa fullständig metod"
        />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <FileJson className="h-3.5 w-3.5 mr-1.5" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {method.name}
          </DialogTitle>
          <DialogDescription>
            Full metodtransparens — ingen formel är dold
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="pr-4">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Kompakt formelvisning för grafer och tabeller
 */
export function FormulaTooltip({ 
  formula,
  className = '' 
}: { 
  formula: string; 
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1 text-[10px] text-muted-foreground ${className}`}>
      <Calculator className="h-2.5 w-2.5" />
      <span className="font-mono truncate max-w-32" title={formula}>
        {formula}
      </span>
    </div>
  );
}

/**
 * Verifiera att alla metodkrav är uppfyllda
 */
export function validateMethodVisibility(method: Partial<MethodDetails>): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!method.formula) missing.push('exact_formula');
  if (!method.selection) missing.push('exact_selection');
  if (!method.timeWindow) missing.push('exact_time_window');
  // Viktning är valfri men ska visas om den finns
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
