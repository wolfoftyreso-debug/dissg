/**
 * LICENSE TIER CARD
 * 
 * Displays a single license tier with features and limitations.
 */

import React from 'react';
import { type LicenseTierDefinition } from '@/config/businessModelConfig';

interface LicenseTierCardProps {
  tier: LicenseTierDefinition;
  language?: 'en' | 'sv';
  highlighted?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function LicenseTierCard({
  tier,
  language = 'en',
  highlighted = false,
  onSelect,
  className = '',
}: LicenseTierCardProps) {
  const labels = {
    en: { features: 'Features', limitations: 'Limitations', select: 'Select', contact: 'Contact us' },
    sv: { features: 'Funktioner', limitations: 'Begränsningar', select: 'Välj', contact: 'Kontakta oss' },
  }[language];

  return (
    <div
      className={`border-2 p-6 flex flex-col ${tier.color} ${highlighted ? 'ring-2 ring-primary ring-offset-2' : ''} ${className}`}
    >
      <div className="text-center mb-6">
        <span className="text-4xl">{tier.icon}</span>
        <h3 className="text-xl font-bold mt-2">{tier.name[language]}</h3>
        <p className="text-sm text-muted-foreground">{tier.tagline[language]}</p>
        <p className="text-xs mt-1">{tier.audience[language]}</p>
      </div>

      <div className="text-center py-4 border-y border-border">
        <span className="text-3xl font-bold">{tier.price.display[language]}</span>
      </div>

      <div className="flex-1 mt-4">
        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{labels.features}</h4>
        <ul className="space-y-1">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">✓</span>
              <span>{feature[language]}</span>
            </li>
          ))}
        </ul>
      </div>

      {tier.limitations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{labels.limitations}</h4>
          <ul className="space-y-1">
            {tier.limitations.map((limitation, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5">—</span>
                <span>{limitation[language]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onSelect && (
        <button
          onClick={onSelect}
          className={`mt-6 w-full py-3 font-medium transition-colors ${
            highlighted ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border hover:bg-muted'
          }`}
        >
          {tier.price.value === null ? labels.contact : labels.select}
        </button>
      )}
    </div>
  );
}

export function LicenseTierGrid({
  tiers,
  language = 'en',
  highlightedTier,
  onSelectTier,
  className = '',
}: {
  tiers: LicenseTierDefinition[];
  language?: 'en' | 'sv';
  highlightedTier?: string;
  onSelectTier?: (tierId: string) => void;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {tiers.map((tier) => (
        <LicenseTierCard
          key={tier.id}
          tier={tier}
          language={language}
          highlighted={tier.id === highlightedTier}
          onSelect={onSelectTier ? () => onSelectTier(tier.id) : undefined}
        />
      ))}
    </div>
  );
}
