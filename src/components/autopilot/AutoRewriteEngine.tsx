/**
 * 🔁 BLOCK 53 — AUTO-REWRITE ENGINE
 * 
 * Automatically simplifies text when UX metrics indicate problems.
 * 
 * RULES (LOCKED):
 * - No new content
 * - No new interpretation  
 * - Same data, fewer words
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { simplifyText, REWRITE_RULES } from '@/config/autopilotConfig';

interface AutoRewriteEngineProps {
  /** Original text content */
  text: string;
  /** Force simplified version */
  forceSimplify?: boolean;
  /** Show before/after comparison */
  showComparison?: boolean;
  className?: string;
}

/**
 * Auto-rewrite engine that simplifies text
 */
export function AutoRewriteEngine({
  text,
  forceSimplify = false,
  showComparison = false,
  className,
}: AutoRewriteEngineProps) {
  const simplified = useMemo(() => simplifyText(text), [text]);
  const wasSimplified = simplified !== text;

  if (showComparison && wasSimplified) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="p-3 bg-muted/50 rounded border border-border">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Original
          </div>
          <p className="text-sm text-muted-foreground line-through">{text}</p>
        </div>
        <div className="p-3 bg-status-positive/5 rounded border border-status-positive/30">
          <div className="text-xs font-semibold uppercase tracking-wider text-status-positive mb-2">
            Simplified
          </div>
          <p className="text-sm text-foreground">{simplified}</p>
        </div>
      </div>
    );
  }

  return (
    <span className={className}>
      {forceSimplify || wasSimplified ? simplified : text}
    </span>
  );
}

/**
 * Shorten summary to max words
 */
export function shortenSummary(text: string, maxWords: number = REWRITE_RULES.maxSummaryWords): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  
  return words.slice(0, maxWords).join(' ') + '…';
}

/**
 * Split long paragraphs
 */
export function splitParagraphs(
  text: string, 
  maxSentences: number = REWRITE_RULES.maxParagraphSentences
): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs: string[] = [];
  
  for (let i = 0; i < sentences.length; i += maxSentences) {
    paragraphs.push(sentences.slice(i, i + maxSentences).join(' ').trim());
  }
  
  return paragraphs;
}

/**
 * Move definitions to the front
 */
export function moveDefinitionsUp(text: string): string {
  // Find definition patterns like "X is defined as..." or "X refers to..."
  const defPatterns = [
    /([^.]+(?:is defined as|refers to|means)[^.]+\.)/gi,
    /([^.]+(?:definition:|meaning:)[^.]+\.)/gi,
  ];

  let definitions: string[] = [];
  let remaining = text;

  for (const pattern of defPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      definitions = [...definitions, ...matches];
      remaining = remaining.replace(pattern, '');
    }
  }

  if (definitions.length === 0) return text;

  return definitions.join(' ') + ' ' + remaining.trim();
}

/**
 * Analyze text for simplification opportunities
 */
export function analyzeForSimplification(text: string): {
  originalWordCount: number;
  simplifiedWordCount: number;
  reduction: number;
  changesApplied: string[];
} {
  const simplified = simplifyText(text);
  const originalWords = text.split(/\s+/).length;
  const simplifiedWords = simplified.split(/\s+/).length;
  
  const changesApplied: string[] = [];
  
  for (const [complex, simple] of Object.entries(REWRITE_RULES.wordSimplifications)) {
    if (text.toLowerCase().includes(complex.toLowerCase())) {
      changesApplied.push(`"${complex}" → "${simple}"`);
    }
  }

  return {
    originalWordCount: originalWords,
    simplifiedWordCount: simplifiedWords,
    reduction: Math.round(((originalWords - simplifiedWords) / originalWords) * 100),
    changesApplied,
  };
}

export default AutoRewriteEngine;
