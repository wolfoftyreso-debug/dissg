import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { LEGAL_DISCLAIMERS } from '@/config/publicProfileConfig';

interface LegalDisclaimerProps {
  variant?: 'main' | 'compact' | 'footer' | 'methodology';
  className?: string;
}

export function LegalDisclaimer({ variant = 'main', className = '' }: LegalDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <p className={`text-xs text-muted-foreground italic ${className}`}>
        {LEGAL_DISCLAIMERS.compact}
      </p>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`text-xs text-muted-foreground border-t pt-4 mt-4 ${className}`}>
        <p className="whitespace-pre-line">{LEGAL_DISCLAIMERS.footer}</p>
      </div>
    );
  }

  if (variant === 'methodology') {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle>{LEGAL_DISCLAIMERS.methodology.title}</AlertTitle>
        <AlertDescription className="text-sm whitespace-pre-line">
          {LEGAL_DISCLAIMERS.methodology.text}
        </AlertDescription>
      </Alert>
    );
  }

  // Main variant
  return (
    <Alert variant="default" className={`bg-muted/50 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{LEGAL_DISCLAIMERS.main.title}</AlertTitle>
      <AlertDescription className="text-sm whitespace-pre-line">
        {LEGAL_DISCLAIMERS.main.text}
      </AlertDescription>
    </Alert>
  );
}
