/**
 * ASSUMPTION EXPOSER
 * 
 * No hidden assumptions - EVER.
 * All assumptions are: visible, clickable, removable.
 * User can remove them and see how results change.
 * 
 * "When all assumptions are visible, conspiracies disappear."
 */

import { useState } from 'react';
import { Eye, EyeOff, ToggleLeft, ToggleRight, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Assumption } from '@/lib/lambda/explanation-engine';

interface AssumptionExposerProps {
  assumptions: Assumption[];
  onAssumptionToggle: (assumptionId: string, isActive: boolean) => void;
  onResetAll: () => void;
  language?: 'sv' | 'en';
  className?: string;
}

export function AssumptionExposer({
  assumptions,
  onAssumptionToggle,
  onResetAll,
  language = 'sv',
  className,
}: AssumptionExposerProps) {
  const labels = {
    title: { sv: 'Antaganden', en: 'Assumptions' },
    subtitle: { 
      sv: 'Alla antaganden är synliga. Du kan ändra dem och se hur resultatet påverkas.', 
      en: 'All assumptions are visible. You can change them and see how results are affected.' 
    },
    active: { sv: 'Aktiv', en: 'Active' },
    inactive: { sv: 'Inaktiv', en: 'Inactive' },
    locked: { sv: 'Låst', en: 'Locked' },
    resetAll: { sv: 'Återställ alla', en: 'Reset all' },
    noAssumptions: { sv: 'Inga antaganden för denna vy', en: 'No assumptions for this view' },
    impactIfChanged: { sv: 'Om detta ändras', en: 'If this changes' },
    whatThisMeans: { sv: 'Vad detta betyder', en: 'What this means' },
    modifiedCount: { sv: 'antaganden ändrade', en: 'assumptions modified' },
    disclaimer: {
      sv: 'Resultatet bygger på dessa antaganden. Ändra dem för att testa andra scenarion.',
      en: 'Results are based on these assumptions. Change them to test other scenarios.',
    },
  };
  
  const modifiedCount = assumptions.filter(a => !a.is_active).length;
  const hasModifications = modifiedCount > 0;
  
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {labels.title[language]}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {labels.subtitle[language]}
            </p>
          </div>
          
          {hasModifications && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {modifiedCount} {labels.modifiedCount[language]}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetAll}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {labels.resetAll[language]}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {assumptions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {labels.noAssumptions[language]}
          </p>
        ) : (
          <>
            {assumptions.map((assumption) => (
              <AssumptionRow
                key={assumption.id}
                assumption={assumption}
                onToggle={onAssumptionToggle}
                language={language}
                labels={labels}
              />
            ))}
            
            {/* Disclaimer */}
            <div className="pt-3 border-t mt-4">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-3 w-3 mt-0.5 shrink-0" />
                {labels.disclaimer[language]}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// ASSUMPTION ROW
// =============================================================================

interface AssumptionRowProps {
  assumption: Assumption;
  onToggle: (id: string, isActive: boolean) => void;
  language: 'sv' | 'en';
  labels: Record<string, Record<'sv' | 'en', string>>;
}

function AssumptionRow({ assumption, onToggle, language, labels }: AssumptionRowProps) {
  const [showImpact, setShowImpact] = useState(false);
  
  return (
    <div 
      className={cn(
        'rounded-lg border p-3 transition-colors',
        assumption.is_active ? 'bg-card' : 'bg-muted/50 border-dashed'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {assumption.label[language]}
            </span>
            
            {!assumption.is_removable && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {labels.locked[language]}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {language === 'sv' 
                        ? 'Detta antagande är grundläggande för beräkningen' 
                        : 'This assumption is fundamental to the calculation'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">
            {assumption.description[language]}
          </p>
          
          {/* Impact section */}
          {showImpact && (
            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
              <p className="font-medium text-muted-foreground mb-1">
                {labels.impactIfChanged[language]}:
              </p>
              <p>{assumption.impact_if_changed[language]}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Show impact button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowImpact(!showImpact)}
          >
            <Info className="h-3.5 w-3.5" />
          </Button>
          
          {/* Toggle */}
          {assumption.is_removable ? (
            <Switch
              checked={assumption.is_active}
              onCheckedChange={(checked) => onToggle(assumption.id, checked)}
            />
          ) : (
            <div className="w-9 flex items-center justify-center">
              <div className="h-5 w-9 rounded-full bg-primary/20 flex items-center justify-end px-0.5">
                <div className="h-4 w-4 rounded-full bg-primary/50" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      {!assumption.is_active && (
        <div className="mt-2 flex items-center gap-2 text-xs text-warning">
          <AlertCircle className="h-3 w-3" />
          <span>
            {language === 'sv' 
              ? 'Antagandet är inaktiverat - resultatet ändras' 
              : 'Assumption disabled - results will change'}
          </span>
        </div>
      )}
    </div>
  );
}

export default AssumptionExposer;
