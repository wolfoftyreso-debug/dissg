/**
 * CITIZEN CONCLUSION VIEW
 * 
 * Medborgar-vy för egen slutsats – ramverket för eget omdöme.
 * Visar de fundamentala frågorna som återstår när sanningslagret finns.
 */

import React, { useState } from 'react';
import { TRUTH_ORACLE_DOCTRINE } from '@/config/truthOracleDoctrineConfig';
import { PlatformDisclaimer } from './PlatformDisclaimer';

interface CitizenConclusionViewProps {
  language?: 'sv' | 'en';
  observationContext?: {
    topic: string;
    summary: string;
    dataPoints: Array<{ label: string; value: string }>;
  };
}

export function CitizenConclusionView({ 
  language = 'en',
  observationContext
}: CitizenConclusionViewProps) {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto bg-card border border-border">
      {/* Header */}
      <div className="border-b border-border p-6 text-center">
        <h1 className="text-xl font-bold text-foreground tracking-wide uppercase mb-2">
          {language === 'sv' ? 'Ditt omdöme' : 'Your Judgment'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {language === 'sv' 
            ? 'Plattformen visar data. Du drar slutsatserna.'
            : 'The platform shows data. You draw the conclusions.'}
        </p>
      </div>

      {/* Observation Context (if provided) */}
      {observationContext && (
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            {language === 'sv' ? 'Observerat' : 'Observed'}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {observationContext.summary}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {observationContext.dataPoints.map((point, index) => (
              <div key={index} className="p-2 border border-border bg-background">
                <span className="text-xs text-muted-foreground">{point.label}</span>
                <span className="block text-sm font-mono text-foreground">{point.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What the system provides */}
      <div className="p-6 border-b border-border">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {language === 'sv' ? 'Systemet ger' : 'The system provides'}
            </h3>
            <ul className="space-y-2">
              {[
                { sv: 'En totalbild', en: 'A complete picture' },
                { sv: 'Ett faktabord', en: 'A fact table' },
                { sv: 'Ett ramverk för eget omdöme', en: 'A framework for own judgment' },
              ].map((item, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-foreground">→</span>
                  {item[language]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {language === 'sv' ? 'Systemet säger inte' : 'The system does not say'}
            </h3>
            <ul className="space-y-2">
              {[
                { sv: 'Vad du ska tycka', en: 'What you should think' },
                { sv: 'Vad som är rätt', en: 'What is right' },
                { sv: 'Vad framtiden blir', en: 'What the future holds' },
              ].map((item, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-destructive">×</span>
                  {item[language]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fundamental Questions */}
      <div className="p-6 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          {language === 'sv' ? 'De frågor som återstår' : 'The questions that remain'}
        </h2>
        <div className="space-y-2">
          {TRUTH_ORACLE_DOCTRINE.fundamentalQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
              className={`w-full text-left p-4 border transition-colors ${
                activeQuestion === index 
                  ? 'border-foreground bg-foreground text-background' 
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 border border-current flex items-center justify-center text-xs font-mono">
                  {index + 1}
                </span>
                <span className="font-medium">
                  {question[language]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reflection prompt */}
      {activeQuestion !== null && (
        <div className="p-6 border-b border-border bg-muted/30">
          <p className="text-center text-muted-foreground text-sm italic">
            {language === 'sv' 
              ? 'Detta är din fråga att besvara. Plattformen kan inte svara åt dig.'
              : 'This is your question to answer. The platform cannot answer for you.'}
          </p>
        </div>
      )}

      {/* Core principle */}
      <div className="p-6 bg-muted/20">
        <p className="text-center text-sm text-foreground">
          {language === 'sv'
            ? 'Du behöver inte lyssna på politiker. Du behöver bara se datan och tänka själv.'
            : 'You do not need to listen to politicians. You only need to see the data and think for yourself.'}
        </p>
      </div>

      {/* Platform Disclaimer */}
      <PlatformDisclaimer language={language} variant="footer" />
    </div>
  );
}
