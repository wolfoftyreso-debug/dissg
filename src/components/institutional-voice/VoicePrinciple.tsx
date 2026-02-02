/**
 * VOICE PRINCIPLE
 * 
 * The system never sounds like anger. It sounds like an auditor.
 */

import React from 'react';
import { VOICE_PRINCIPLE, FORBIDDEN_EXPRESSIONS, INSTITUTIONAL_EXPRESSIONS } from '@/config/institutionalVoiceConfig';

interface VoicePrincipleProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'principle' | 'comparison';
  className?: string;
}

export function VoicePrinciple({
  language = 'en',
  variant = 'full',
  className = '',
}: VoicePrincipleProps) {
  if (variant === 'principle') {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-xl font-bold">{VOICE_PRINCIPLE.core[language]}</p>
        <p className="text-primary mt-2">{VOICE_PRINCIPLE.difference[language]}</p>
      </div>
    );
  }

  if (variant === 'comparison') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
        <ForbiddenExpressions language={language} />
        <InstitutionalExpressions language={language} variant="compact" />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Core Principle */}
      <div className="border-4 border-border bg-card p-8 text-center">
        <div className="w-16 h-16 mx-auto border-4 border-primary flex items-center justify-center text-3xl mb-4">
          🏛️
        </div>
        <p className="text-2xl font-bold">{VOICE_PRINCIPLE.core[language]}</p>
        <p className="text-lg text-primary mt-3">{VOICE_PRINCIPLE.difference[language]}</p>
      </div>
      
      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ForbiddenExpressions language={language} />
        <InstitutionalExpressions language={language} variant="compact" />
      </div>
    </div>
  );
}

function ForbiddenExpressions({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-destructive/30 bg-destructive/5 p-6 space-y-4">
      <h3 className="font-bold flex items-center gap-2">
        <span className="text-destructive">✗</span>
        {FORBIDDEN_EXPRESSIONS.title[language]}
      </h3>
      
      <div className="space-y-2">
        {FORBIDDEN_EXPRESSIONS.examples.map((ex, i) => (
          <div key={i} className="text-muted-foreground line-through italic">
            {ex[language]}
          </div>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground pt-2 border-t border-destructive/20">
        {FORBIDDEN_EXPRESSIONS.reason[language]}
      </p>
    </div>
  );
}

interface InstitutionalExpressionsProps {
  language: 'en' | 'sv';
  variant?: 'full' | 'compact';
}

export function InstitutionalExpressions({
  language,
  variant = 'full',
}: InstitutionalExpressionsProps) {
  if (variant === 'compact') {
    return (
      <div className="border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="text-primary">✓</span>
          {INSTITUTIONAL_EXPRESSIONS.title[language]}
        </h3>
        
        <div className="space-y-3">
          {INSTITUTIONAL_EXPRESSIONS.patterns.slice(0, 3).map((pattern) => (
            <div key={pattern.id} className="text-sm">
              <p className="font-medium">"{pattern.expression[language]}"</p>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-primary font-medium pt-2 border-t border-primary/20">
          {INSTITUTIONAL_EXPRESSIONS.suffix[language]}
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className="border-2 border-border bg-card p-6 space-y-6">
      <h2 className="text-xl font-bold">{INSTITUTIONAL_EXPRESSIONS.title[language]}</h2>
      
      <div className="space-y-4">
        {INSTITUTIONAL_EXPRESSIONS.patterns.map((pattern) => (
          <div key={pattern.id} className="border-l-2 border-primary pl-4 py-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {pattern.trigger[language]}
            </span>
            <p className="font-medium mt-1">"{pattern.expression[language]}"</p>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-4 border-t border-border">
        <p className="text-lg text-primary font-semibold">
          {INSTITUTIONAL_EXPRESSIONS.suffix[language]}
        </p>
      </div>
    </div>
  );
}
