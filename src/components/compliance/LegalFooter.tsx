/**
 * LEGAL FOOTER COMPONENT
 * 
 * Displays required legal disclaimers for a jurisdiction.
 * Must be visible on all data-displaying pages.
 */

import React from 'react';
import { Scale } from 'lucide-react';
import { buildRegulatoryReference, getLegalClassification } from '@/lib/compliance';

interface LegalFooterProps {
  jurisdiction?: string;
  variant?: 'minimal' | 'standard' | 'full';
  className?: string;
}

export function LegalFooter({ 
  jurisdiction = 'GLOBAL',
  variant = 'standard',
  className = '' 
}: LegalFooterProps) {
  const classification = getLegalClassification(jurisdiction);
  
  if (!classification) {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        This platform provides statistical reference data only.
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Scale className="h-3 w-3" />
        <span>{classification.required_disclaimers[0]}</span>
      </div>
    );
  }
  
  const regulatoryRef = buildRegulatoryReference(jurisdiction);
  
  return (
    <div className={`border-t border-border pt-4 mt-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Scale className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          {variant === 'full' ? (
            <>
              <div className="text-xs text-muted-foreground space-y-1">
                {classification.required_disclaimers.map((d, i) => (
                  <p key={i}>• {d}</p>
                ))}
              </div>
              <div className="text-xs text-muted-foreground/70 pt-2 border-t border-border/50">
                <p className="font-medium mb-1">Platform Classification</p>
                <p>
                  Classified as: <span className="text-foreground/80">{classification.platform_classification.replace(/_/g, ' ')}</span>
                </p>
                <p className="mt-1">
                  Not classified as: {classification.not_classified_as.map(c => c.replace(/_/g, ' ')).join(', ')}
                </p>
                {regulatoryRef && (
                  <p className="mt-2 italic">{regulatoryRef}</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">
              {classification.required_disclaimers.slice(0, 2).map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline disclaimer for embedding in content
 */
export function InlineDisclaimer({ 
  text,
  className = ''
}: { 
  text: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs text-muted-foreground italic ${className}`}>
      <Scale className="h-3 w-3" />
      {text}
    </span>
  );
}

export default LegalFooter;
