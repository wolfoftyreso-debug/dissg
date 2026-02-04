/**
 * WAGE COMPARISON PAGE
 * 
 * Full page for cross-country, cross-occupation wage comparison
 * with political overlay and time series.
 */

import React from 'react';
import { WageComparisonEngine } from '@/components/wages';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WagesPage: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Lönenivåer</h1>
          <Badge variant="outline" className="font-mono text-xs">
            OBSERVATIONSLÄGE
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Jämför lönenivåer mellan länder och yrken över tid. 
          Se hur löner utvecklats under olika regeringar – utan att påstå kausalitet.
        </p>
      </div>
      
      {/* Navigation help */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] bg-muted px-2 py-1 rounded">[+]</span>
              <span>Lägg till fler diagram för parallella jämförelser</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] bg-muted px-2 py-1 rounded">[KLICK]</span>
              <span>Klicka på en regeringsperiod för att se vem som ledde landet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] bg-muted px-2 py-1 rounded">[ENHET]</span>
              <span>Växla mellan PPP, nominellt och relativt</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main comparison engine */}
      <WageComparisonEngine />
      
      {/* Methodology note */}
      <Card className="mt-8">
        <CardContent className="py-4">
          <h3 className="font-semibold mb-2">Om datan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-mono text-[10px] block mb-1">KÄLLOR</span>
              <p>
                ILO ILOSTAT, OECD Employment Outlook, Eurostat, 
                nationella statistikbyråer (SCB, Destatis, BLS, SSB, Statistics Denmark).
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] block mb-1">METOD</span>
              <p>
                Bruttomånadslöner för heltidsanställda. Yrken klassificerade enligt ISCO-08.
                PPP-omräkning med OECD/Eurostat PPP-index. Valutakurser enligt IMF.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] block mb-1">BEGRÄNSNINGAR</span>
              <p>
                Definitionsskillnader mellan länder. Skattesystem och sociala avgifter varierar.
                Nominella löner påverkas av växelkursfluktuationer.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] block mb-1">POLITISK OVERLAY</span>
              <p>
                Regeringsperioder visas för kontext men löneförändringar kan bero på 
                faktorer utanför politisk kontroll (konjunktur, globala trender, etc).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WagesPage;
