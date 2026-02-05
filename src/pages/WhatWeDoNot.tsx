/**
 * PUBLIC TRANSPARENCY: WHAT WE DO NOT DO
 * 
 * No advice.
 * No recommendations.
 * No individual conclusions.
 * 
 * This kills 90% of criticism before it's born.
 */

import { SIGNAL_GUARDRAILS } from '@/core/signals';
import { EXTENSION_POINTS } from '@/core/governance';

export default function WhatWeDoNot() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-border pb-8">
          <h1 className="text-2xl font-mono font-bold">What We Do Not Do</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Clear boundaries. No exceptions.
          </p>
        </header>

        {/* Primary Restrictions */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-destructive">
            We Never Provide
          </h2>
          <div className="grid gap-3">
            {[
              {
                title: 'Advice',
                description: 'We do not tell you what to do. We show patterns.',
              },
              {
                title: 'Recommendations',
                description: 'We do not suggest actions. We present options.',
              },
              {
                title: 'Individual Conclusions',
                description: 'We do not make decisions for you. We provide context.',
              },
              {
                title: 'Predictions',
                description: 'We do not forecast. We show historical patterns.',
              },
              {
                title: 'Value Judgments',
                description: 'We do not say "good" or "bad". We say "higher" or "lower".',
              },
              {
                title: 'Causal Claims',
                description: 'We do not say "caused by". We say "correlated with".',
              },
            ].map(item => (
              <div 
                key={item.title}
                className="bg-destructive/10 border border-destructive/20 p-4 rounded font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-destructive">✗</span>
                  <span className="font-semibold">{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Signal Restrictions */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Signals Are Not</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SIGNAL_GUARDRAILS.signal_is_not.map(item => (
              <div 
                key={item}
                className="bg-muted/30 p-3 rounded border border-border font-mono text-sm text-center"
              >
                <span className="text-destructive mr-2">≠</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Signals Cannot */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Signals Cannot</h2>
          <div className="space-y-2">
            {SIGNAL_GUARDRAILS.signal_cannot.map(item => (
              <div 
                key={item}
                className="bg-muted/30 p-3 rounded border border-border font-mono text-sm flex items-center gap-2"
              >
                <span className="text-destructive">✗</span>
                <span>{item.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Forbidden Extensions */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">System Cannot Be Extended To</h2>
          <div className="space-y-2">
            {EXTENSION_POINTS.forbidden_extensions.map(item => (
              <div 
                key={item}
                className="bg-destructive/5 border border-destructive/20 p-3 rounded font-mono text-sm flex items-center gap-2"
              >
                <span className="text-destructive">🔒</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do Instead */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-primary">
            What We Do Instead
          </h2>
          <div className="grid gap-3">
            {[
              {
                instead: 'Show patterns',
                not: 'Give advice',
              },
              {
                instead: 'Present options',
                not: 'Recommend actions',
              },
              {
                instead: 'Provide context',
                not: 'Draw conclusions',
              },
              {
                instead: 'Display uncertainty',
                not: 'Project confidence',
              },
              {
                instead: 'Document methodology',
                not: 'Hide complexity',
              },
              {
                instead: 'Enable verification',
                not: 'Demand trust',
              },
            ].map(item => (
              <div 
                key={item.instead}
                className="bg-muted/30 p-4 rounded border border-border font-mono flex items-center gap-4"
              >
                <span className="text-muted-foreground line-through text-sm">
                  {item.not}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium text-primary">{item.instead}</span>
              </div>
            ))}
          </div>
        </section>

        {/* User Responsibility */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold">Your Responsibility</h2>
          <div className="bg-muted/30 p-6 rounded border border-border font-mono text-sm space-y-3">
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Interpreting the data in your context</li>
              <li>Making decisions based on multiple sources</li>
              <li>Understanding the limitations shown</li>
              <li>Verifying critical information independently</li>
              <li>Applying appropriate professional judgment</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            These boundaries are permanent and machine-enforced.
          </p>
        </footer>
      </div>
    </div>
  );
}
