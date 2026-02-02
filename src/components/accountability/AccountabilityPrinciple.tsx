/**
 * THE ACCOUNTABILITY PRINCIPLE
 * 
 * "Making decisions without a shared, open, and verifiable factual basis
 *  is not neutral — it is irresponsible."
 */

import React from 'react';
import { ACCOUNTABILITY_PRINCIPLE } from '@/config/accountabilityPrincipleConfig';

interface AccountabilityPrincipleProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'compact' | 'statement';
  className?: string;
}

export function AccountabilityPrinciple({
  language = 'en',
  variant = 'full',
  className = '',
}: AccountabilityPrincipleProps) {
  if (variant === 'statement') {
    return (
      <p className={`text-lg font-medium ${className}`}>
        {ACCOUNTABILITY_PRINCIPLE.statement[language]}
      </p>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`border-l-4 border-primary pl-4 py-2 ${className}`}>
        <p className="font-medium">{ACCOUNTABILITY_PRINCIPLE.statement[language]}</p>
        <p className="text-sm text-muted-foreground mt-1 italic">
          {ACCOUNTABILITY_PRINCIPLE.clarification[language]}
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`border-4 border-border bg-card p-8 lg:p-12 text-center space-y-6 ${className}`}>
      <div className="w-16 h-16 mx-auto border-4 border-primary flex items-center justify-center text-3xl">
        ⚖️
      </div>
      
      <h1 className="text-2xl lg:text-3xl font-bold leading-relaxed max-w-3xl mx-auto">
        {ACCOUNTABILITY_PRINCIPLE.statement[language]}
      </h1>
      
      <p className="text-lg text-primary font-semibold">
        {ACCOUNTABILITY_PRINCIPLE.clarification[language]}
      </p>
    </div>
  );
}
