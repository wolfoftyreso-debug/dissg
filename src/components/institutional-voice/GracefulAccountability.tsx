/**
 * GRACEFUL ACCOUNTABILITY
 * 
 * How the system enables accountability without anyone losing face.
 * The system shows the gap. It does not assign blame.
 */

import React from 'react';
import { 
  CORE_PROBLEM, 
  DEMOCRACY_ENABLER, 
  FINAL_FORMULATION,
  GRACEFUL_ACCOUNTABILITY 
} from '@/config/institutionalVoiceConfig';

interface GracefulAccountabilityProps {
  language?: 'en' | 'sv';
  variant?: 'full' | 'actors' | 'problem';
  className?: string;
}

export function GracefulAccountability({
  language = 'en',
  variant = 'full',
  className = '',
}: GracefulAccountabilityProps) {
  if (variant === 'actors') {
    return (
      <div className={`space-y-4 ${className}`}>
        {GRACEFUL_ACCOUNTABILITY.enables.map((item, i) => (
          <div key={i} className="border border-border bg-card p-4">
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {item.actor[language]}
            </span>
            <p className="font-medium mt-2">"{item.canSay[language]}"</p>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'problem') {
    return <CoreProblem language={language} className={className} />;
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      <CoreProblem language={language} />
      <DemocracyEnabler language={language} />
      <ActorStatements language={language} />
      <FinalFormulation language={language} />
    </div>
  );
}

function CoreProblem({ language, className = '' }: { language: 'en' | 'sv'; className?: string }) {
  return (
    <div className={`border-2 border-border bg-card p-6 space-y-4 ${className}`}>
      <h2 className="text-xl font-bold">{CORE_PROBLEM.title[language]}</h2>
      
      <p className="font-medium">{CORE_PROBLEM.statement[language]}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {language === 'en' ? 'What is missing' : 'Vad som saknas'}
          </span>
          <ul className="mt-2 space-y-1">
            {CORE_PROBLEM.missing.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-destructive" />
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {language === 'en' ? 'Consequences' : 'Konsekvenser'}
          </span>
          <ul className="mt-2 space-y-1">
            {CORE_PROBLEM.consequences.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-destructive">→</span>
                {item[language]}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border text-center">
        <p className="font-semibold text-primary">{CORE_PROBLEM.conclusion[language]}</p>
      </div>
    </div>
  );
}

function DemocracyEnabler({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
      <h2 className="text-xl font-bold">{DEMOCRACY_ENABLER.title[language]}</h2>
      
      <p className="font-medium">{DEMOCRACY_ENABLER.statement[language]}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DEMOCRACY_ENABLER.enables.map((item, i) => (
          <div key={i} className="text-center p-3 bg-card border border-primary/20">
            <span className="text-primary text-lg">✓</span>
            <p className="text-sm mt-1">{item[language]}</p>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-primary/20">
        <span className="text-xs text-muted-foreground uppercase">
          {DEMOCRACY_ENABLER.alternative.label[language]}
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {DEMOCRACY_ENABLER.alternative.items.map((item, i) => (
            <span key={i} className="px-3 py-1 text-sm line-through text-muted-foreground bg-destructive/5">
              {item[language]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActorStatements({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-2 border-border bg-card p-6 space-y-4">
      <h2 className="text-xl font-bold">{GRACEFUL_ACCOUNTABILITY.title[language]}</h2>
      
      <p className="text-muted-foreground">{GRACEFUL_ACCOUNTABILITY.principle[language]}</p>
      
      <div className="space-y-3">
        {GRACEFUL_ACCOUNTABILITY.enables.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-3 bg-muted/50">
            <span className="text-xs font-mono text-muted-foreground uppercase min-w-[100px]">
              {item.actor[language]}
            </span>
            <p className="font-medium flex-1">"{item.canSay[language]}"</p>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <p className="text-lg font-semibold text-primary">
          {GRACEFUL_ACCOUNTABILITY.conclusion[language]}
        </p>
      </div>
    </div>
  );
}

function FinalFormulation({ language }: { language: 'en' | 'sv' }) {
  return (
    <div className="border-4 border-border bg-card p-8 text-center space-y-6">
      <p className="text-muted-foreground">{FINAL_FORMULATION.observation[language]}</p>
      <p className="text-lg font-medium">{FINAL_FORMULATION.solution[language]}</p>
      <p className="text-muted-foreground">{FINAL_FORMULATION.method[language]}</p>
      
      <div className="py-4">
        <p className="text-sm text-muted-foreground mb-3">{FINAL_FORMULATION.output[language]}</p>
        <div className="space-y-2">
          {FINAL_FORMULATION.statements.map((stmt, i) => (
            <p key={i} className="text-xl font-bold">{stmt[language]}</p>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <p className="text-2xl font-bold text-primary">
          {FINAL_FORMULATION.conclusion[language]}
        </p>
      </div>
    </div>
  );
}
