/**
 * ATTRIBUTION CONFIDENCE BADGE
 * 
 * Visual representation of how confident we are about
 * cause-effect relationships in environmental data.
 */

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ATTRIBUTION_LEVELS, 
  EVIDENCE_TYPES, 
  AGREEMENT_LEVELS,
  generateAttributionStatement 
} from '@/lib/environment';
import type { AttributionConfidence } from '@/lib/environment';
import { Info, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttributionBadgeProps {
  confidence: AttributionConfidence;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  language?: 'en' | 'sv';
}

export function AttributionBadge({
  confidence,
  showDetails = false,
  size = 'md',
  language = 'sv'
}: AttributionBadgeProps) {
  const level = ATTRIBUTION_LEVELS[confidence.level];
  const evidence = EVIDENCE_TYPES[confidence.evidenceType];
  const agreement = AGREEMENT_LEVELS[confidence.agreementLevel];
  
  const getIcon = () => {
    switch (confidence.level) {
      case 'very_high':
      case 'high':
        return <CheckCircle className={cn(
          "shrink-0",
          size === 'sm' ? "w-3 h-3" : size === 'md' ? "w-4 h-4" : "w-5 h-5"
        )} />;
      case 'medium':
        return <AlertCircle className={cn(
          "shrink-0",
          size === 'sm' ? "w-3 h-3" : size === 'md' ? "w-4 h-4" : "w-5 h-5"
        )} />;
      default:
        return <HelpCircle className={cn(
          "shrink-0",
          size === 'sm' ? "w-3 h-3" : size === 'md' ? "w-4 h-4" : "w-5 h-5"
        )} />;
    }
  };
  
  const getBadgeClass = () => {
    const baseClass = size === 'sm' ? 'text-xs py-0.5 px-2' : 
                      size === 'md' ? 'text-sm py-1 px-3' : 
                      'text-base py-1.5 px-4';
    
    switch (confidence.level) {
      case 'very_high':
        return cn(baseClass, 'border-chart-2 text-chart-2 bg-chart-2/10');
      case 'high':
        return cn(baseClass, 'border-chart-2/70 text-chart-2/90 bg-chart-2/5');
      case 'medium':
        return cn(baseClass, 'border-warning text-warning bg-warning/10');
      case 'low':
        return cn(baseClass, 'border-destructive/70 text-destructive/80 bg-destructive/5');
      case 'very_low':
        return cn(baseClass, 'border-destructive text-destructive bg-destructive/10');
    }
  };

  const badge = (
    <Badge variant="outline" className={cn("gap-1.5", getBadgeClass())}>
      {getIcon()}
      <span>{level.label[language]}</span>
    </Badge>
  );

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="min-h-[44px] min-w-[44px] flex items-center justify-center">
              {badge}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[350px]">
            <p className="text-sm">{level.description[language]}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {generateAttributionStatement(confidence, language)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-3">
      {badge}
      
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground">{level.description[language]}</p>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {language === 'sv' ? 'Evidenstyp' : 'Evidence Type'}
            </p>
            <p className="text-sm">{evidence.label[language]}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {language === 'sv' ? 'Samstämmighet' : 'Agreement'}
            </p>
            <p className="text-sm">{agreement.label[language]}</p>
          </div>
        </div>
        
        {confidence.alternativeExplanations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-destructive">
              {language === 'sv' ? 'Alternativa förklaringar:' : 'Alternative Explanations:'}
            </p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
              {confidence.alternativeExplanations.map((alt, i) => (
                <li key={i}>• {alt}</li>
              ))}
            </ul>
          </div>
        )}
        
        {confidence.keyUncertainties.length > 0 && (
          <div>
            <p className="text-xs font-medium text-warning">
              {language === 'sv' ? 'Huvudsakliga osäkerheter:' : 'Key Uncertainties:'}
            </p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
              {confidence.keyUncertainties.map((unc, i) => (
                <li key={i}>• {unc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
