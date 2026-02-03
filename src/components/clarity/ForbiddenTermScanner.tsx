/**
 * Forbidden Term Scanner
 * 
 * 🔬 LINGUISTIC INTEGRITY ENFORCEMENT
 * 
 * Scans text for forbidden terms and suggests neutral replacements.
 * Used in content creation and validation pipelines.
 */

import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FORBIDDEN_TERMS, 
  NEUTRAL_REPLACEMENTS,
  scanForForbiddenTerms,
  getNeutralReplacement,
} from '@/config/absoluteClarityConfig';

interface TermScanResult {
  hasForbidden: boolean;
  found: string[];
  category: string[];
}

interface ForbiddenTermScannerProps {
  text: string;
  showDetails?: boolean;
  onValidation?: (result: TermScanResult) => void;
}

export function ForbiddenTermScanner({ 
  text, 
  showDetails = true,
  onValidation,
}: ForbiddenTermScannerProps) {
  const result = React.useMemo(() => scanForForbiddenTerms(text), [text]);
  
  React.useEffect(() => {
    onValidation?.(result);
  }, [result, onValidation]);

  if (!text) {
    return null;
  }

  if (!result.hasForbidden) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="h-3 w-3" />
        <span>No forbidden terms detected</span>
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="bg-destructive/5 border-destructive/30">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-sm font-medium">
        Forbidden terms detected
      </AlertTitle>
      <AlertDescription>
        <p className="text-xs text-muted-foreground mb-2">
          The following terms violate the Absolute Clarity Standard:
        </p>
        
        {showDetails && (
          <div className="space-y-2">
            {result.found.map((term, i) => {
              const replacement = getNeutralReplacement(term);
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <Badge variant="destructive" className="font-mono">
                    {term}
                  </Badge>
                  {replacement && (
                    <>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline" className="font-mono">
                        {replacement}
                      </Badge>
                    </>
                  )}
                  <span className="text-muted-foreground text-[10px]">
                    ({result.category[i]})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// TEXT VALIDATOR HOOK
// ============================================

export function useTextValidation(text: string): {
  isValid: boolean;
  forbiddenTerms: string[];
  suggestions: Array<{ term: string; replacement: string | null }>;
} {
  return React.useMemo(() => {
    const result = scanForForbiddenTerms(text);
    
    return {
      isValid: !result.hasForbidden,
      forbiddenTerms: result.found,
      suggestions: result.found.map(term => ({
        term,
        replacement: getNeutralReplacement(term),
      })),
    };
  }, [text]);
}

// ============================================
// INLINE TERM HIGHLIGHTER
// ============================================

interface HighlightedTextProps {
  text: string;
  className?: string;
}

export function HighlightedText({ text, className = '' }: HighlightedTextProps) {
  const allForbidden = [
    ...FORBIDDEN_TERMS.causal,
    ...FORBIDDEN_TERMS.normative,
    ...FORBIDDEN_TERMS.speculative,
    ...FORBIDDEN_TERMS.emotive,
  ];
  
  // Create regex pattern
  const pattern = new RegExp(
    `\\b(${allForbidden.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );
  
  const parts = text.split(pattern);
  
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isForbidden = allForbidden.some(
          term => term.toLowerCase() === part.toLowerCase()
        );
        
        if (isForbidden) {
          return (
            <span 
              key={i} 
              className="bg-destructive/20 text-destructive px-0.5 rounded"
              title={`Forbidden term. Suggestion: ${getNeutralReplacement(part) || 'Remove or rephrase'}`}
            >
              {part}
            </span>
          );
        }
        
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ============================================
// TERM REFERENCE PANEL
// ============================================

export function ForbiddenTermsReference() {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div>
        <h4 className="font-medium text-foreground mb-2 uppercase tracking-wider">
          Forbidden: Causal
        </h4>
        <div className="flex flex-wrap gap-1">
          {FORBIDDEN_TERMS.causal.map((term, i) => (
            <Badge key={i} variant="outline" className="font-mono text-[10px]">
              {term}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-foreground mb-2 uppercase tracking-wider">
          Forbidden: Normative
        </h4>
        <div className="flex flex-wrap gap-1">
          {FORBIDDEN_TERMS.normative.map((term, i) => (
            <Badge key={i} variant="outline" className="font-mono text-[10px]">
              {term}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-foreground mb-2 uppercase tracking-wider">
          Forbidden: Speculative
        </h4>
        <div className="flex flex-wrap gap-1">
          {FORBIDDEN_TERMS.speculative.map((term, i) => (
            <Badge key={i} variant="outline" className="font-mono text-[10px]">
              {term}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-foreground mb-2 uppercase tracking-wider">
          Forbidden: Emotive
        </h4>
        <div className="flex flex-wrap gap-1">
          {FORBIDDEN_TERMS.emotive.map((term, i) => (
            <Badge key={i} variant="outline" className="font-mono text-[10px]">
              {term}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForbiddenTermScanner;
