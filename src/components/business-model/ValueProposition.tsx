/**
 * VALUE PROPOSITION
 * 
 * "Sell without selling" - what we provide vs what we don't.
 */

import React from 'react';
import { VALUE_PROPOSITION, PRICING_RATIONALE } from '@/config/businessModelConfig';

interface ValuePropositionProps {
  language?: 'en' | 'sv';
  showPricingRationale?: boolean;
  className?: string;
}

export function ValueProposition({
  language = 'en',
  showPricingRationale = true,
  className = '',
}: ValuePropositionProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-destructive/30 bg-destructive/5 p-6">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <span className="text-destructive">✗</span>
            {VALUE_PROPOSITION.weDoNotSell.label[language]}
          </h3>
          <ul className="space-y-2">
            {VALUE_PROPOSITION.weDoNotSell.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground line-through">
                {item[language]}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-primary/30 bg-primary/5 p-6">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <span className="text-primary">✓</span>
            {VALUE_PROPOSITION.weSell.label[language]}
          </h3>
          <ul className="space-y-2">
            {VALUE_PROPOSITION.weSell.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">→</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center p-6 border-2 border-border bg-card">
        <p className="text-xl font-bold">"{VALUE_PROPOSITION.competitorStatement[language]}"</p>
      </div>

      {showPricingRationale && <PricingRationale language={language} />}
    </div>
  );
}

export function PricingRationale({
  language = 'en',
  className = '',
}: {
  language?: 'en' | 'sv';
  className?: string;
}) {
  return (
    <div className={`border-2 border-amber-500/30 bg-amber-500/5 p-6 space-y-6 ${className}`}>
      <h3 className="font-bold text-lg">{PRICING_RATIONALE.title[language]}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            {PRICING_RATIONALE.costDrivers.label[language]}
          </h4>
          <ul className="space-y-2">
            {PRICING_RATIONALE.costDrivers.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-amber-600">•</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            {PRICING_RATIONALE.qualityFilter.label[language]}
          </h4>
          <ul className="space-y-2">
            {PRICING_RATIONALE.qualityFilter.points.map((point, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-amber-600">✓</span>
                {point[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-amber-500/30">
        <p className="font-medium text-center italic">"{PRICING_RATIONALE.officialStatement[language]}"</p>
      </div>
    </div>
  );
}
