/**
 * NUMBER WITH CONTEXT
 * 
 * Every number must answer three questions:
 * 1. Compared to what?
 * 2. Over what time period?
 * 3. Why does this matter?
 * 
 * If a number cannot answer all three → it is not displayed.
 */

import { ArrowUp, ArrowDown, Minus, Clock, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { NumberContext } from '@/lib/lambda/explanation-engine';

interface NumberWithContextProps {
  context: NumberContext;
  language?: 'sv' | 'en';
  size?: 'sm' | 'md' | 'lg';
  showCard?: boolean;
  className?: string;
}

export function NumberWithContext({
  context,
  language = 'sv',
  size = 'md',
  showCard = true,
  className,
}: NumberWithContextProps) {
  // Calculate change
  const change = context.value - context.compared_to.reference_value;
  const changePercent = (change / context.compared_to.reference_value) * 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
  
  const labels = {
    comparedTo: { sv: 'Jämfört med', en: 'Compared to' },
    period: { sv: 'Period', en: 'Period' },
    significance: { sv: 'Varför det spelar roll', en: 'Why it matters' },
    change: { sv: 'Förändring', en: 'Change' },
  };
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };
  
  const content = (
    <div className={cn('space-y-3', className)}>
      {/* Main value */}
      <div className="flex items-baseline gap-2">
        <span className={cn('font-bold font-mono', sizeClasses[size])}>
          {formatValue(context.value)}
        </span>
        <span className="text-muted-foreground text-sm">
          {context.unit}
        </span>
        
        {/* Change indicator */}
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium ml-2',
          direction === 'up' && 'text-primary',
          direction === 'down' && 'text-destructive',
          direction === 'stable' && 'text-muted-foreground',
        )}>
          {direction === 'up' && <ArrowUp className="h-4 w-4" />}
          {direction === 'down' && <ArrowDown className="h-4 w-4" />}
          {direction === 'stable' && <Minus className="h-4 w-4" />}
          <span>{changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Three required context questions */}
      <div className="grid gap-2 text-sm">
        {/* 1. Compared to what? */}
        <ContextRow
          icon={Target}
          label={labels.comparedTo[language]}
          value={`${formatValue(context.compared_to.reference_value)} ${context.unit} (${context.compared_to.reference_label[language]})`}
        />
        
        {/* 2. Over what time period? */}
        <ContextRow
          icon={Clock}
          label={labels.period[language]}
          value={formatPeriod(context.time_period.start, context.time_period.end, language)}
        />
        
        {/* 3. Why does this matter? */}
        <ContextRow
          icon={Lightbulb}
          label={labels.significance[language]}
          value={context.significance[language]}
          emphasize
        />
      </div>
    </div>
  );
  
  if (showCard) {
    return (
      <Card>
        <CardContent className="pt-4">
          {content}
        </CardContent>
      </Card>
    );
  }
  
  return content;
}

// =============================================================================
// CONTEXT ROW
// =============================================================================

interface ContextRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  emphasize?: boolean;
}

function ContextRow({ icon: Icon, label, value, emphasize }: ContextRowProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-muted-foreground">{label}: </span>
        <span className={cn(emphasize && 'font-medium')}>{value}</span>
      </div>
    </div>
  );
}

// =============================================================================
// COMPACT NUMBER (for inline use)
// =============================================================================

interface CompactNumberProps {
  context: NumberContext;
  language?: 'sv' | 'en';
  className?: string;
}

export function CompactNumber({ context, language = 'sv', className }: CompactNumberProps) {
  const change = context.value - context.compared_to.reference_value;
  const changePercent = (change / context.compared_to.reference_value) * 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex items-baseline gap-1 cursor-help', className)}>
            <span className="font-bold font-mono">{formatValue(context.value)}</span>
            <span className="text-muted-foreground text-xs">{context.unit}</span>
            <span className={cn(
              'text-xs',
              direction === 'up' && 'text-primary',
              direction === 'down' && 'text-destructive',
            )}>
              ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2 text-xs">
            <p>
              <strong>{language === 'sv' ? 'Jämfört med' : 'Compared to'}:</strong>{' '}
              {formatValue(context.compared_to.reference_value)} {context.unit} ({context.compared_to.reference_label[language]})
            </p>
            <p>
              <strong>{language === 'sv' ? 'Period' : 'Period'}:</strong>{' '}
              {formatPeriod(context.time_period.start, context.time_period.end, language)}
            </p>
            <p>
              <strong>{language === 'sv' ? 'Betydelse' : 'Significance'}:</strong>{' '}
              {context.significance[language]}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function formatValue(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + 'B';
  }
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(1) + 'k';
  }
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(2);
}

function formatPeriod(start: string, end: string, language: 'sv' | 'en'): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  if (startYear === endYear) {
    return startYear.toString();
  }
  
  return `${startYear}–${endYear}`;
}

export default NumberWithContext;
