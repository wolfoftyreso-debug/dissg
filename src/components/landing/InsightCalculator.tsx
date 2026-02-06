/**
 * WHAT IS DISSG SECTION
 * 
 * Pedagogisk sektion som förklarar vad systemet gör
 * på ett sätt som är begripligt för alla.
 */

import React from 'react';
import { Activity, TrendingUp, MapPin, Search } from 'lucide-react';

export const InsightCalculator: React.FC = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Vad är DISSG?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Tänk dig en hälsoapp – men för hela samhället. Istället för att mäta 
            din puls och sömn, mäter vi arbetslöshet, utbildningsnivå och trygghet.
          </p>
        </div>

        {/* Simple explanation cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Card 1: What we measure */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vi samlar in data</h3>
                <p className="text-sm text-muted-foreground">
                  Officiell statistik från myndigheter om ekonomi, hälsa, utbildning, 
                  brottslighet och miljö – allt på samma ställe.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: How we show it */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vi visar trender</h3>
                <p className="text-sm text-muted-foreground">
                  Går det uppåt eller nedåt? Hur ser Sverige ut jämfört med andra länder? 
                  Du får svar utan att behöva leta själv.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Geographic focus */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Från global till lokal</h3>
                <p className="text-sm text-muted-foreground">
                  Zooma från hela världen ner till din region. Se hur din kommun 
                  står sig jämfört med resten av landet.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: What you can find */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Search className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Du upptäcker mönster</h3>
                <p className="text-sm text-muted-foreground">
                  Vilka områden behöver uppmärksamhet? Vilka saker hänger ihop? 
                  Systemet hjälper dig se helheten.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple analogy */}
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
    </section>
  );
};

export default InsightCalculator;
