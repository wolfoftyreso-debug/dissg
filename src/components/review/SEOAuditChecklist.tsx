/**
 * 🧠 BLOCK 52 — SEO AUDIT CHECKLIST
 * 
 * Google-first revision checks:
 * - Single H1
 * - Correct heading hierarchy
 * - Valid schema.org
 * - Proper canonical URLs
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertTriangle } from 'lucide-react';
import { SEO_CHECKLIST, type SEOCheckItem } from '@/config/qualityReviewConfig';

interface SEOCheckResult {
  checkId: string;
  passed: boolean;
  details?: string;
}

interface SEOAuditChecklistProps {
  results: SEOCheckResult[];
  className?: string;
}

/**
 * SEO Audit Checklist
 * 
 * Shows pass/fail for Google-first requirements.
 */
export function SEOAuditChecklist({ results, className }: SEOAuditChecklistProps) {
  const getResult = (item: SEOCheckItem): SEOCheckResult | undefined => {
    return results.find(r => r.checkId === item.id);
  };

  const criticalFailed = SEO_CHECKLIST
    .filter(c => c.severity === 'critical')
    .some(c => {
      const result = getResult(c);
      return result && !result.passed;
    });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          SEO Audit
        </h3>
        <span className={cn(
          'text-xs px-2 py-1 rounded font-medium',
          criticalFailed && 'bg-status-critical/20 text-status-critical',
          !criticalFailed && passed === total && 'bg-status-positive/20 text-status-positive',
          !criticalFailed && passed < total && 'bg-status-warning/20 text-status-warning',
        )}>
          {passed}/{total}
        </span>
      </div>

      {/* Checks by severity */}
      {(['critical', 'warning', 'info'] as const).map((severity) => {
        const items = SEO_CHECKLIST.filter(c => c.severity === severity);
        if (items.length === 0) return null;

        return (
          <div key={severity}>
            <div className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-2',
              severity === 'critical' && 'text-status-critical',
              severity === 'warning' && 'text-status-warning',
              severity === 'info' && 'text-muted-foreground',
            )}>
              {severity}
            </div>
            <ul className="space-y-1">
              {items.map((item) => {
                const result = getResult(item);
                const status = result ? (result.passed ? 'pass' : 'fail') : 'pending';

                return (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    {status === 'pass' && (
                      <Check className="h-3.5 w-3.5 text-status-positive" />
                    )}
                    {status === 'fail' && (
                      <X className="h-3.5 w-3.5 text-status-critical" />
                    )}
                    {status === 'pending' && (
                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                    )}
                    <span className={cn(
                      status === 'pass' && 'text-foreground',
                      status === 'fail' && 'text-status-critical',
                      status === 'pending' && 'text-muted-foreground',
                    )}>
                      {item.check}
                    </span>
                    {result?.details && (
                      <span className="text-xs text-muted-foreground">
                        ({result.details})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Run automated SEO checks on current page
 */
export function runSEOChecks(): SEOCheckResult[] {
  const results: SEOCheckResult[] = [];

  // Check H1 count
  const h1s = document.querySelectorAll('h1');
  results.push({
    checkId: 'single-h1',
    passed: h1s.length === 1,
    details: `Found ${h1s.length} H1(s)`,
  });

  // Check heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let hierarchyValid = true;
  let lastLevel = 0;
  headings.forEach((h) => {
    const level = parseInt(h.tagName[1]);
    if (level > lastLevel + 1) {
      hierarchyValid = false;
    }
    lastLevel = level;
  });
  results.push({
    checkId: 'h2-structure',
    passed: hierarchyValid,
    details: hierarchyValid ? 'Valid' : 'Skipped levels',
  });

  // Check empty headings
  const emptyHeadings = Array.from(headings).filter(
    h => !h.textContent?.trim()
  );
  results.push({
    checkId: 'no-empty-headings',
    passed: emptyHeadings.length === 0,
    details: emptyHeadings.length > 0 ? `${emptyHeadings.length} empty` : undefined,
  });

  // Check canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  results.push({
    checkId: 'canonical',
    passed: !!canonical,
  });

  // Check title length
  const title = document.querySelector('title');
  const titleLength = title?.textContent?.length || 0;
  results.push({
    checkId: 'title-length',
    passed: titleLength > 0 && titleLength < 60,
    details: `${titleLength} chars`,
  });

  // Check meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  const descLength = metaDesc?.getAttribute('content')?.length || 0;
  results.push({
    checkId: 'meta-description',
    passed: descLength > 0 && descLength < 160,
    details: `${descLength} chars`,
  });

  return results;
}

export default SEOAuditChecklist;
