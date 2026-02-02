/**
 * Extreme Clarity System Demo Page
 * 
 * Demonstrates all components of the clarity system
 */

import React from 'react';
import { ClarityMapDemo } from '@/components/clarity/ClarityMap';
import { QuestionNavigationDemo } from '@/components/clarity/QuestionNavigation';
import { KnowledgeWrapper, ClickableNumber } from '@/components/clarity/KnowledgeWrapper';
import { SystemBreadcrumbs, DepthIndicator, SystemHierarchyPath } from '@/components/navigation/SystemBreadcrumbs';
import { type KnowledgeObject } from '@/config/extremeClaritySystem';

const ClarityDemo: React.FC = () => {
  // Demo knowledge object for clickable number
  const demoKnowledge: Partial<KnowledgeObject> = {
    id: 'demo-employment',
    question: 'Vad innebär detta tal?',
    explains: 'Sysselsättningsgrad i Sverige',
    measures: 'Andel av befolkningen 15-74 år i arbete',
    source: ['SCB Arbetskraftsundersökningen'],
    limitations: ['Inkluderar ej informellt arbete', 'Definitionen kan skilja mellan länder'],
    deeper_levels: [
      { level: 1, name: 'observation', content: 'Sysselsättningsgraden är 78.2% i Sverige 2023.', sources: ['SCB'], url: '/explain/employment/observation' },
      { level: 2, name: 'definition', content: 'Sysselsatt = arbetat minst 1 timme under referensveckan eller har anställning att återgå till.', sources: ['SCB Metodrapport'], url: '/explain/employment/definition' },
      { level: 3, name: 'method', content: 'Beräknas från Arbetskraftsundersökningen med ca 29 500 svarande per månad.', sources: ['SCB AKU'], url: '/explain/employment/method' },
      { level: 4, name: 'limitation', content: 'Fångar ej informell sektor, kvalitet på anställning, eller odeklarerat arbete.', sources: [], url: '/explain/employment/limitation' },
      { level: 5, name: 'data', content: 'API: api.scb.se/AM0401. Tidserie: 1963-nutid.', sources: ['SCB API'], url: '/explain/employment/data' },
    ],
    url: '/explain/employment',
  };

  const breadcrumbItems = [
    { label: 'World', labelSv: 'Världen', href: '/', level: 'world' as const },
    { label: 'Europe', labelSv: 'Europa', href: '/europe', level: 'region' as const },
    { label: 'Sweden', labelSv: 'Sverige', href: '/sweden', level: 'country' as const },
    { label: 'Employment', labelSv: 'Sysselsättning', href: '/sweden/employment', level: 'indicator' as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Extreme Clarity System</h1>
          <p className="text-muted-foreground">
            Kartor · Djup · Klickbar förståelse · Zero ambiguity
          </p>
        </div>

        {/* Breadcrumbs Demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Navigation & Breadcrumbs</h2>
          <div className="space-y-4 p-4 border rounded-lg">
            <SystemBreadcrumbs items={breadcrumbItems} />
            <SystemHierarchyPath 
              region="Europa" 
              country="Sverige" 
              indicator="Sysselsättning" 
            />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Djupnivå:</p>
              <DepthIndicator currentLevel={2} />
            </div>
          </div>
        </section>

        {/* Clickable Numbers */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Klickbara tal</h2>
          <p className="text-muted-foreground text-sm">
            Klicka på talet för att se alla 5 djupnivåer
          </p>
          <div className="p-6 border rounded-lg bg-muted/20">
            <p className="text-lg">
              Sysselsättningsgraden i Sverige är{' '}
              <ClickableNumber 
                value="78.2" 
                unit="%" 
                knowledge={demoKnowledge}
              />
              {' '}(2023).
            </p>
          </div>
        </section>

        {/* Knowledge Wrapper Block */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Knowledge Wrapper (Block)</h2>
          <KnowledgeWrapper knowledge={demoKnowledge} variant="block">
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-2xl font-bold">78.2%</p>
              <p className="text-muted-foreground">Sysselsättningsgrad, Sverige 2023</p>
            </div>
          </KnowledgeWrapper>
        </section>

        {/* Map Demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Clarity Map</h2>
          <p className="text-muted-foreground text-sm">
            Klicka på en region för att se 4-nivås djup
          </p>
          <div className="border rounded-lg p-4">
            <ClarityMapDemo />
          </div>
        </section>

        {/* Question Navigation */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Frågebaserad navigation</h2>
          <p className="text-muted-foreground text-sm">
            Domäner är metadata – frågor är gränssnittet
          </p>
          <div className="border rounded-lg p-4">
            <QuestionNavigationDemo />
          </div>
        </section>

        {/* Core Principle */}
        <section className="space-y-4 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-xl font-semibold">Kärnprincip</h2>
          <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4">
            Ni bygger inte en tjänst. Ni bygger ett mentalt skelett för verkligheten.
            <br /><br />
            Allt som inte förklarar, kan klickas, kan fördjupas, eller kan verifieras
            har ingen rätt att finnas.
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default ClarityDemo;
