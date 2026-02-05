/**
 * ASSUMPTIONS PANEL COMPONENT
 * 
 * Displays required assumptions for a decision graph.
 * Shows missing data and what would reduce uncertainty.
 * 
 * This component exposes what is UNKNOWN, never hides it.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, HelpCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assumption {
  assumption_id: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  options?: string[];
  selected_option?: string;
  required: boolean;
}

interface DataGap {
  node_id: string;
  question: string;
  gap_type: 'no_data' | 'low_confidence' | 'outdated' | 'definition_mismatch';
  severity: 'critical' | 'important' | 'minor';
  what_it_means: string;
  possible_alternatives: string[];
}

interface AssumptionsPanelProps {
  assumptions: Assumption[];
  dataGaps: DataGap[];
  onAssumptionChange?: (assumptionId: string, value: string) => void;
}

export function AssumptionsPanel({
  assumptions,
  dataGaps,
  onAssumptionChange,
}: AssumptionsPanelProps) {
  const criticalGaps = dataGaps.filter(g => g.severity === 'critical');
  const importantGaps = dataGaps.filter(g => g.severity === 'important');
  const requiredAssumptions = assumptions.filter(a => a.required && !a.selected_option);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Assumptions & Data Gaps
        </CardTitle>
        <CardDescription>
          Required inputs and missing information for this analysis
        </CardDescription>
        
        {/* Summary badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {requiredAssumptions.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {requiredAssumptions.length} assumptions needed
            </Badge>
          )}
          {criticalGaps.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              {criticalGaps.length} critical gaps
            </Badge>
          )}
          {importantGaps.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Info className="h-3 w-3" />
              {importantGaps.length} important gaps
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Assumptions Section */}
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            Assumptions Required
          </h3>
          <Accordion type="multiple" className="w-full">
            {assumptions.map((assumption) => (
              <AccordionItem key={assumption.assumption_id} value={assumption.assumption_id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-left">
                    <ImpactBadge level={assumption.impact_level} />
                    <span className={cn(
                      assumption.required && !assumption.selected_option && "font-semibold text-destructive"
                    )}>
                      {assumption.description}
                    </span>
                    {assumption.required && (
                      <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {assumption.options && assumption.options.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {assumption.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => onAssumptionChange?.(assumption.assumption_id, option)}
                            className={cn(
                              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                              assumption.selected_option === option
                                ? "border-primary bg-primary text-primary-foreground"
                                : "hover:border-primary/50 hover:bg-muted"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        This assumption must be accepted to proceed with analysis.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Impact: {assumption.impact_level.toUpperCase()} — 
                      {assumption.impact_level === 'high' && ' Changing this significantly affects results'}
                      {assumption.impact_level === 'medium' && ' Moderate effect on results'}
                      {assumption.impact_level === 'low' && ' Minor effect on results'}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        
        {/* Data Gaps Section */}
        {dataGaps.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
              Data Gaps
            </h3>
            <div className="space-y-3">
              {dataGaps.map((gap) => (
                <GapCard key={gap.node_id} gap={gap} />
              ))}
            </div>
          </section>
        )}
        
        {/* What would reduce uncertainty */}
        <section className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-2 text-sm font-semibold">What would reduce uncertainty?</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {requiredAssumptions.length > 0 && (
              <li>• Select values for {requiredAssumptions.length} required assumption(s)</li>
            )}
            {criticalGaps.length > 0 && (
              <li>• Obtain data for {criticalGaps.length} critical question(s)</li>
            )}
            <li>• Consider proxy measures for unavailable data</li>
            <li>• Review if scope can be narrowed to available data</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

function ImpactBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const styles = {
    low: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-700 border-red-500/20',
  };
  
  return (
    <span className={cn("rounded border px-1.5 py-0.5 text-xs font-medium", styles[level])}>
      {level.toUpperCase()}
    </span>
  );
}

function GapCard({ gap }: { gap: DataGap }) {
  const severityStyles = {
    critical: 'border-red-500/30 bg-red-500/5',
    important: 'border-yellow-500/30 bg-yellow-500/5',
    minor: 'border-blue-500/30 bg-blue-500/5',
  };
  
  const severityIcons = {
    critical: XCircle,
    important: AlertTriangle,
    minor: Info,
  };
  
  const Icon = severityIcons[gap.severity];
  
  return (
    <div className={cn("rounded-lg border p-3", severityStyles[gap.severity])}>
      <div className="flex items-start gap-2">
        <Icon className={cn(
          "h-4 w-4 mt-0.5 shrink-0",
          gap.severity === 'critical' && "text-red-600",
          gap.severity === 'important' && "text-yellow-600",
          gap.severity === 'minor' && "text-blue-600",
        )} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{gap.question}</div>
          <div className="mt-1 text-xs text-muted-foreground">{gap.what_it_means}</div>
          {gap.possible_alternatives.length > 0 && (
            <div className="mt-2 text-xs">
              <span className="font-medium">Alternatives: </span>
              {gap.possible_alternatives.join(', ')}
            </div>
          )}
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          {gap.gap_type.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}

export default AssumptionsPanel;
