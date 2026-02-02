/**
 * WAVE 10: BLOCK CG — NARRATIVE-FREE SUMMARY GENERATOR
 * 
 * Sammanfatta utan propaganda.
 * Endast deskriptiva verb, tidsangivelser, kvantifiering, osäkerhet.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Copy,
  Info
} from 'lucide-react';
import { 
  validateNarrativeFreeSummary,
  SUMMARY_TEMPLATES,
  POSITION_WORDS,
  TREND_WORDS
} from '@/config/benchmarkConfig';

interface NeutralSummaryGeneratorProps {
  entityName: string;
  kpiName: string;
  value: number;
  unit: string;
  previousValue?: number;
  period: string;
  comparisonPeriod?: string;
  benchmarkValue?: number;
  benchmarkGroup?: string;
}

function NeutralSummaryGeneratorComponent({
  entityName,
  value,
  unit,
  previousValue,
  period,
  comparisonPeriod,
  benchmarkValue,
  benchmarkGroup
}: NeutralSummaryGeneratorProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate neutral summaries
  const summaries: string[] = [];

  // Value statement
  summaries.push(
    SUMMARY_TEMPLATES.value_statement.sv
      .replace('{entity}', entityName)
      .replace('{value}', value.toString())
      .replace('{unit}', unit)
      .replace('{period}', period)
  );

  // Change statement (if previous value exists)
  if (previousValue !== undefined && comparisonPeriod) {
    const change = value - previousValue;
    const percentChange = ((change / previousValue) * 100).toFixed(1);
    const direction = change > 0 ? TREND_WORDS.increasing.sv : change < 0 ? TREND_WORDS.decreasing.sv : TREND_WORDS.stable.sv;
    
    summaries.push(
      SUMMARY_TEMPLATES.change_statement.sv
        .replace('{entity}', entityName)
        .replace('{direction}', direction)
        .replace('{change}', Math.abs(change).toString())
        .replace('{unit}', unit)
        .replace('{percent}', percentChange)
        .replace('{comparison_period}', comparisonPeriod)
    );
  }

  // Benchmark statement (if benchmark exists)
  if (benchmarkValue !== undefined && benchmarkGroup) {
    const position = value > benchmarkValue ? POSITION_WORDS.above.sv : value < benchmarkValue ? POSITION_WORDS.below.sv : POSITION_WORDS.at.sv;
    
    summaries.push(
      `${entityName} låg ${position} ${benchmarkGroup} (${value} ${unit} jämfört med ${benchmarkValue} ${unit}).`
    );
  }

  // Validate all summaries
  const validations = summaries.map(s => validateNarrativeFreeSummary(s));

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(summaries[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Neutrala sammanfattningar
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Genererade utan värdeord eller känsloord
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {summaries.map((summary, idx) => {
          const validation = validations[idx];
          
          return (
            <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm">{summary}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={() => handleCopy(idx)}
                >
                  {copiedIndex === idx ? (
                    <CheckCircle className="h-4 w-4 text-status-positive" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Validation Status */}
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <Badge variant="outline" className="text-xs text-status-positive">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Neutral
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-status-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {validation.issues.length} problem
                  </Badge>
                )}
              </div>
              
              {/* Show issues if any */}
              {!validation.valid && validation.issues.length > 0 && (
                <div className="text-xs text-status-warning space-y-1">
                  {validation.issues.map((issue, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span>• "{issue.word}"</span>
                      {issue.suggestion && (
                        <span className="text-muted-foreground">→ {issue.suggestion}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Info */}
        <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            Dessa sammanfattningar använder endast neutrala, deskriptiva termer.
            Inga värdeord, känsloord eller normativa uttryck ingår.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// INLINE NEUTRAL SUMMARY COMPONENT
// ============================================================

interface NeutralSummaryTextProps {
  text: string;
  showValidation?: boolean;
}

function NeutralSummaryTextComponent({ text, showValidation = false }: NeutralSummaryTextProps) {
  const validation = validateNarrativeFreeSummary(text);
  
  if (!showValidation) {
    return <span>{text}</span>;
  }
  
  return (
    <span className="inline-flex items-center gap-1">
      <span>{text}</span>
      {validation.valid ? (
        <CheckCircle className="h-3 w-3 text-status-positive inline" />
      ) : (
        <AlertTriangle className="h-3 w-3 text-status-warning inline" />
      )}
    </span>
  );
}

export { NeutralSummaryGeneratorComponent as NeutralSummaryGenerator, NeutralSummaryTextComponent as NeutralSummaryText };
