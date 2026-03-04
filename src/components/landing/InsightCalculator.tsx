/**
 * WHAT IS DISSG SECTION
 * 
 * Pedagogisk sektion som förklarar vad systemet gör.
 * Korten är klickbara och leder till fördjupning via dialog.
 */

import React, { useState } from 'react';
import { Activity, TrendingUp, MapPin, Search, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FeatureCard {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  deepDive: {
    title: string;
    sections: { heading: string; text: string }[];
    examples?: string[];
    link?: { label: string; href: string };
  };
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: <Activity className="h-5 w-5 text-primary" />,
    iconBg: 'bg-primary/10',
    title: 'Vi samlar in data',
    description: 'Officiell statistik från myndigheter om ekonomi, hälsa, utbildning, brottslighet och miljö – allt på samma ställe.',
    deepDive: {
      title: 'Datainsamling',
      sections: [
        { heading: 'Varifrån kommer datan?', text: 'DISSG samlar data från officiella statistikbyråer som SCB, Eurostat, WHO, Världsbanken och OECD. Varje datakälla klassificeras efter tillförlitlighet och uppdateringsfrekvens.' },
        { heading: 'Hur säkerställs kvalitet?', text: 'All data genomgår automatisk validering med anomalidetektion, checksummor och korsreferenser mot oberoende källor. Avvikelser flaggas och granskas innan de blir tillgängliga.' },
        { heading: 'Vad täcks?', text: 'Systemet integrerar 200+ indikatorer inom ekonomi, hälsa, utbildning, trygghet, miljö och demokrati – med data från 190+ länder.' },
      ],
      examples: ['BNP per capita', 'Medellivslängd', 'Arbetslöshet', 'CO₂-utsläpp', 'Utbildningsnivå'],
      link: { label: 'Utforska datakällor', href: '/data' },
    },
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
    iconBg: 'bg-emerald-500/10',
    title: 'Vi visar trender',
    description: 'Går det uppåt eller nedåt? Hur ser Sverige ut jämfört med andra länder? Du får svar utan att behöva leta själv.',
    deepDive: {
      title: 'Trendanalys',
      sections: [
        { heading: 'Hur beräknas trender?', text: 'Systemet analyserar tidsserier med minst 5 datapunkter och beräknar riktning, acceleration och statistisk signifikans. Varje trend visas med konfidensintervall.' },
        { heading: 'Jämförelser', text: 'Du kan jämföra länder, regioner och kommuner sida vid sida. Systemet normaliserar automatiskt för befolkningsstorlek och köpkraft där det är relevant.' },
        { heading: 'Historiska banor', text: '10-åriga sparklines ger omedelbar kontext. Du ser inte bara nuläget – utan var vi var, var vi är, och vart det ser ut att vara på väg.' },
      ],
      link: { label: 'Se global dashboard', href: '/dashboard' },
    },
  },
  {
    icon: <MapPin className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-500/10',
    title: 'Från global till lokal',
    description: 'Zooma från hela världen ner till din region. Se hur din kommun står sig jämfört med resten av landet.',
    deepDive: {
      title: 'Geografisk fördjupning',
      sections: [
        { heading: 'Hierarkisk navigation', text: 'Navigera från global nivå → kontinent → land → region → kommun. Varje nivå visar relevanta indikatorer och jämförelser med snittet på nivån ovanför.' },
        { heading: 'Kommundata', text: 'För svenska kommuner visas data i relation till länssnittet (t.ex. "+2.1 vs snitt") med specifik metadata för källhänvisning (SCB/Kolada).' },
        { heading: 'Datatäckning', text: 'Varje geografisk enhet klassificeras med Data Tier A–D, där Tier A ("Full täckning") kräver 95% indikatortäckning.' },
      ],
      link: { label: 'Öppna Geo Explorer', href: '/geo' },
    },
  },
  {
    icon: <Search className="h-5 w-5 text-amber-600" />,
    iconBg: 'bg-amber-500/10',
    title: 'Du upptäcker mönster',
    description: 'Vilka områden behöver uppmärksamhet? Vilka saker hänger ihop? Systemet hjälper dig se helheten.',
    deepDive: {
      title: 'Mönsterigenkänning',
      sections: [
        { heading: 'Kausala kedjor', text: 'Systemets Global Reality Model (GRM) kopplar samman entiteter, variabler, interventioner och utfall i ett nätverk. Det kan visa att t.ex. ekonomisk stress → sämre sömn → metabol ohälsa.' },
        { heading: 'Automatisk upptäckt', text: 'Claim Discovery-motorn hittar nya samband genom att analysera universella kunskapspåståenden och korskoppla domäner.' },
        { heading: 'Osäkerhetshantering', text: 'Varje identifierat mönster visar konfidensnivå, evidensstyrka och potentiella confounders – systemet låtsas aldrig vara säkrare än det är.' },
      ],
      link: { label: 'Utforska GRM', href: '/grm' },
    },
  },
];

export const InsightCalculator: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<FeatureCard | null>(null);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Vad är DISSG?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Tänk dig en hälsoapp – men för hela samhället. Istället för att mäta 
            din puls och sömn, mäter vi arbetslöshet, utbildningsnivå och trygghet.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {FEATURE_CARDS.map((card, i) => (
            <button
              key={i}
              onClick={() => setSelectedCard(card)}
              className="bg-card border rounded-lg p-6 text-left transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold mb-2">{card.title}</h3>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-card border rounded-full px-6 py-3">
            <span className="text-2xl">📱</span>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">Kort sagt:</strong> En röntgenbild av samhället – 
              så du kan se vad som fungerar och vad som behöver åtgärdas.
            </span>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedCard.deepDive.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                {selectedCard.deepDive.sections.map((section, i) => (
                  <div key={i}>
                    <h4 className="font-semibold text-sm mb-1">{section.heading}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
                  </div>
                ))}
                {selectedCard.deepDive.examples && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Exempel på indikatorer</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.deepDive.examples.map((ex, i) => (
                        <span key={i} className="text-xs bg-muted px-2.5 py-1 rounded-full">{ex}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCard.deepDive.link && (
                  <a
                    href={selectedCard.deepDive.link.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-2"
                  >
                    {selectedCard.deepDive.link.label}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InsightCalculator;