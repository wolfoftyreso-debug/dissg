import { Shield, CheckCircle2 } from 'lucide-react';
import { 
  OFFICIAL_POSITION, 
  OFFICIAL_POSITION_SHORT,
  SOURCE_DISCLAIMER 
} from '@/config/dataPositioningConfig';

interface DataPositionBadgeProps {
  /** Visuell variant */
  variant?: 'full' | 'compact' | 'inline' | 'footer';
  
  /** Språk */
  lang?: 'sv' | 'en';
  
  className?: string;
}

/**
 * WAVE 7 BLOCK BC: Data Non-Ownership Contract Badge
 * 
 * Visar systemets officiella datapositionering.
 * SKA visas överallt: footer, graf-hover, export, API.
 */
export function DataPositionBadge({
  variant = 'compact',
  lang = 'sv',
  className = '',
}: DataPositionBadgeProps) {
  if (variant === 'inline') {
    return (
      <span className={`text-[10px] text-muted-foreground inline-flex items-center gap-1 ${className}`}>
        <Shield className="h-2.5 w-2.5" />
        {OFFICIAL_POSITION_SHORT[lang]}
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-start gap-2 p-2 bg-muted/30 rounded border text-xs ${className}`}>
        <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-muted-foreground leading-relaxed">
            {OFFICIAL_POSITION_SHORT[lang]}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`border-t pt-4 mt-6 ${className}`}>
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="whitespace-pre-line leading-relaxed">
              {OFFICIAL_POSITION[lang]}
            </p>
            <p className="text-[10px] italic">
              {SOURCE_DISCLAIMER[lang]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`p-4 border rounded-lg bg-muted/20 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h4 className="text-sm font-semibold mb-1">
              {lang === 'sv' ? 'Om plattformens datahantering' : 'About platform data handling'}
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {OFFICIAL_POSITION[lang]}
            </p>
          </div>
          
          <div className="p-2 bg-background rounded border">
            <p className="text-xs text-muted-foreground italic">
              {SOURCE_DISCLAIMER[lang]}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {lang === 'sv' ? 'Omodifierad data' : 'Unmodified data'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {lang === 'sv' ? 'Full transparens' : 'Full transparency'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {lang === 'sv' ? 'Verifierbar' : 'Verifiable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * API-respons metadata för datapositionering
 */
export function getDataPositionMeta(lang: 'sv' | 'en' = 'sv') {
  return {
    positioning: OFFICIAL_POSITION[lang],
    positioning_short: OFFICIAL_POSITION_SHORT[lang],
    source_disclaimer: SOURCE_DISCLAIMER[lang],
    platform_modifies_data: false,
    verification_available: true,
  };
}
