/**
 * 🧠 BLOCK 52 — TEXT QUALITY ANALYZER
 * 
 * Checks text for quality issues:
 * - Academic phrases that should be clinical
 * - Passive voice overuse
 * - Sentence length
 * - Paragraph length
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { analyzeTextQuality, TEXT_REPLACEMENTS } from '@/config/qualityReviewConfig';

interface TextQualityAnalyzerProps {
  text: string;
  className?: string;
  showSuggestions?: boolean;
}

/**
 * Text Quality Analyzer
 * 
 * Analyzes text and shows quality issues with suggestions.
 */
export function TextQualityAnalyzer({ 
  text, 
  className,
  showSuggestions = true 
}: TextQualityAnalyzerProps) {
  const analysis = useMemo(() => analyzeTextQuality(text), [text]);

  const scoreColor = 
    analysis.score >= 90 ? 'text-status-positive' :
    analysis.score >= 70 ? 'text-status-warning' :
    'text-status-critical';

  return (
    <div className={cn('space-y-4', className)}>
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Text Quality
          </span>
        </div>
        <div className={cn('text-lg font-mono font-semibold', scoreColor)}>
          {analysis.score}/100
        </div>
      </div>

      {/* Issues */}
      {analysis.issues.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Issues Found
          </div>
          <ul className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-status-warning mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm text-foreground">{issue}</span>
                  {showSuggestions && analysis.suggestions[index] && (
                    <p className="text-xs text-muted-foreground mt-1">
                      → {analysis.suggestions[index]}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-status-positive">
          <Check className="h-4 w-4" />
          <span className="text-sm">No quality issues detected</span>
        </div>
      )}
    </div>
  );
}

/**
 * Quick text cleanup function
 */
export function cleanupText(text: string): string {
  let result = text;
  
  for (const [phrase, replacement] of Object.entries(TEXT_REPLACEMENTS)) {
    if (replacement.startsWith('[remove')) {
      // Remove the phrase entirely
      const regex = new RegExp(`\\b${phrase}\\b[,.]?\\s*`, 'gi');
      result = result.replace(regex, '');
    } else {
      // Replace with suggested alternative
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }
  }

  // Clean up extra whitespace
  result = result.replace(/\s+/g, ' ').trim();
  
  return result;
}

/**
 * Inline text quality indicator
 */
export function TextQualityBadge({ 
  text,
  className 
}: { 
  text: string;
  className?: string;
}) {
  const { score } = useMemo(() => analyzeTextQuality(text), [text]);
  
  const color = 
    score >= 90 ? 'bg-status-positive/20 text-status-positive' :
    score >= 70 ? 'bg-status-warning/20 text-status-warning' :
    'bg-status-critical/20 text-status-critical';

  return (
    <span className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono',
      color,
      className
    )}>
      TQ:{score}
    </span>
  );
}

export default TextQualityAnalyzer;
