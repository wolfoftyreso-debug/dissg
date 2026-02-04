/**
 * FEATURES SECTION
 * 
 * "Så kommer du igång" - Tre funktioner i cards.
 * Inspirerat av Avanzas onboarding-sektion.
 */

import React from 'react';
import { Database, TrendingUp, LineChart } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: 'data',
    title: 'Utforska data',
    description: 'DISSG samlar 184 officiella indikatorer från SCB, Eurostat och WHO. Alla datakällor är verifierade och spårbara.',
    link: '/data',
    linkText: 'Öppna data →',
    icon: <Database className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    id: 'trends',
    title: 'Analysera trender',
    description: 'Enkelt, smart och transparent. Identifiera mönster själv eller få hjälp av våra statistiska verktyg.',
    link: '/diagnostics',
    linkText: 'Se trender →',
    icon: <TrendingUp className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    id: 'compare',
    title: 'Jämför regioner',
    description: 'Hitta likheter och skillnader mellan kommuner, regioner och länder. Med objektiva mått och öppen metodik.',
    link: '/gdm',
    linkText: 'Starta jämförelse →',
    icon: <LineChart className="w-12 h-12 stroke-[1.5]" />,
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-card border-y">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">
            Så kommer du igång
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Alla har olika förutsättningar och mål med sin analys, men en sak har vi 
            gemensamt – möjligheten att komma igång redan idag!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-background border rounded-sm p-8 text-center hover:border-primary/30 transition-colors group"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6 text-primary">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {/* Link */}
              <a 
                href={feature.link}
                className="text-sm text-primary hover:underline"
              >
                {feature.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
