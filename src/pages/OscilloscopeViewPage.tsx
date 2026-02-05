/**
 * SIGNALÖVERSIKT - Pedagogisk Dashboard
 * 
 * Designad för att en 15-åring ska förstå.
 * Tydliga förklaringar, visuell klarhet, ingen jargong.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ============================================
// SPARKLINE COMPONENT
// ============================================

const Sparkline: React.FC<{ data: number[]; color: string; className?: string }> = ({ 
  data, 
  color,
  className 
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((val - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="60" height="24" className={cn("inline-block", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Helper to generate mock sparkline
const generateSparkline = (base: number, trend: 'up' | 'down' | 'stable' = 'stable'): number[] => {
  const points: number[] = [];
  let current = base;
  for (let i = 0; i < 12; i++) {
    const trendFactor = trend === 'up' ? 0.3 : trend === 'down' ? -0.3 : 0;
    current += (Math.random() - 0.5 + trendFactor) * 3;
    points.push(Math.max(0, Math.min(100, current)));
  }
  return points;
};

// ============================================
// HELP TOOLTIP COMPONENT
// ============================================

const HelpBubble: React.FC<{ text: string }> = ({ text }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 text-sky-600 text-xs font-bold hover:bg-sky-200 transition-colors">
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-slate-900 text-white p-3 text-sm leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// ============================================
// MAIN SCORE CARD
// ============================================

interface MainScoreCardProps {
  title: string;
  helpText: string;
  value: number;
  maxValue?: number;
  unit?: string;
  change: number;
  changePeriod: string;
  interpretation: string;
  sparklineData: number[];
  color: 'green' | 'yellow' | 'red';
}

const MainScoreCard: React.FC<MainScoreCardProps> = ({
  title,
  helpText,
  value,
  maxValue = 100,
  unit,
  change,
  changePeriod,
  interpretation,
  sparklineData,
  color,
}) => {
  const colorClasses = {
    green: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    yellow: 'text-amber-600 bg-amber-50 border-amber-200',
    red: 'text-red-600 bg-red-50 border-red-200',
  };
  
  const sparklineColor = {
    green: 'hsl(160, 84%, 39%)',
    yellow: 'hsl(38, 92%, 50%)',
    red: 'hsl(0, 84%, 60%)',
  };

  return (
    <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800 flex items-center">
              {title}
              <HelpBubble text={helpText} />
            </h3>
          </div>
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            colorClasses[color]
          )}>
            {color === 'green' ? '👍 Bra' : color === 'yellow' ? '⚠️ Varning' : '🔴 Problem'}
          </div>
        </div>
        
        {/* Big Number */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-slate-900">
            {value.toFixed(1)}
          </span>
          {maxValue && (
            <span className="text-lg text-slate-400">
              / {maxValue} {unit}
            </span>
          )}
        </div>
        
        {/* Sparkline & Change */}
        <div className="flex items-center justify-between mb-4">
          <Sparkline data={sparklineData} color={sparklineColor[color]} />
          <div className="text-right">
            <span className={cn(
              "text-sm font-semibold",
              change >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </span>
            <p className="text-xs text-slate-400">{changePeriod}</p>
          </div>
        </div>
        
        {/* Plain language interpretation */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-medium text-slate-700">Vad betyder det? </span>
            {interpretation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// DOMAIN CARD (Smaller)
// ============================================

interface DomainCardProps {
  icon: string;
  name: string;
  description: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  indicatorCount: number;
}

const DomainCard: React.FC<DomainCardProps> = ({
  icon,
  name,
  description,
  value,
  change,
  trend,
  indicatorCount,
}) => {
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';
  const sparklineColor = trend === 'up' ? 'hsl(160, 84%, 39%)' : trend === 'down' ? 'hsl(0, 84%, 60%)' : 'hsl(215, 16%, 47%)';
  
  return (
    <Card className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-2xl">{icon}</div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 text-sm">{name}</h4>
            <p className="text-xs text-slate-500 mb-2">{description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkline 
                  data={generateSparkline(value, trend)} 
                  color={sparklineColor}
                />
                <span className={cn("text-sm font-medium", trendColor)}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {indicatorCount} mätpunkter
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// INDICATOR ROW
// ============================================

interface IndicatorRowProps {
  status: 'good' | 'warning' | 'bad';
  name: string;
  value: string;
  change: number;
  explanation: string;
}

const IndicatorRow: React.FC<IndicatorRowProps> = ({
  status,
  name,
  value,
  change,
  explanation,
}) => {
  const statusEmoji = status === 'good' ? '🟢' : status === 'warning' ? '🟡' : '🔴';
  
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer px-2 -mx-2 rounded">
      <span className="text-sm">{statusEmoji}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-800">{name}</span>
        <p className="text-xs text-slate-500 truncate">{explanation}</p>
      </div>
      <span className="text-sm font-mono text-slate-700">{value}</span>
      <span className={cn(
        "text-sm font-medium min-w-[60px] text-right",
        change >= 0 ? "text-emerald-600" : "text-red-600"
      )}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  );
};

// ============================================
// LEGEND COMPONENT
// ============================================

const Legend: React.FC = () => (
  <div className="flex flex-wrap items-center gap-4 text-sm">
    <div className="flex items-center gap-1.5">
      <span className="text-sm">🟢</span>
      <span className="text-slate-600">Går bra (förbättring)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="text-sm">🟡</span>
      <span className="text-slate-600">Varning (liten förändring)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="text-sm">🔴</span>
      <span className="text-slate-600">Problem (försämring)</span>
    </div>
    <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200">
      <Sparkline data={[40, 45, 50, 55, 60]} color="hsl(160, 84%, 39%)" />
      <span className="text-slate-600">= trend över tid</span>
    </div>
  </div>
);

// ============================================
// MAIN PAGE
// ============================================

export default function OscilloscopeViewPage() {
  const [selectedCountry, setSelectedCountry] = useState('SE');
  const [timeSpan, setTimeSpan] = useState('12m');
  
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            {/* Title & Introduction */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                📊 Hur mår samhället just nu?
              </h1>
              <p className="text-slate-600">
                En översikt av hur Sverige utvecklas inom olika områden. 
                <span className="text-sky-600 font-medium"> Klicka på ?-knapparna för att förstå mer.</span>
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Välj land:</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[160px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="SE">🇸🇪 Sverige</SelectItem>
                    <SelectItem value="NO">🇳🇴 Norge</SelectItem>
                    <SelectItem value="DK">🇩🇰 Danmark</SelectItem>
                    <SelectItem value="FI">🇫🇮 Finland</SelectItem>
                    <SelectItem value="DE">🇩🇪 Tyskland</SelectItem>
                    <SelectItem value="GLOBAL">🌍 Hela världen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Tidsperiod:</label>
                <Select value={timeSpan} onValueChange={setTimeSpan}>
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1m">Senaste månaden</SelectItem>
                    <SelectItem value="3m">Senaste 3 månader</SelectItem>
                    <SelectItem value="12m">Senaste året</SelectItem>
                    <SelectItem value="5y">Senaste 5 åren</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm" className="ml-auto">
                + Jämför med annat land
              </Button>
            </div>
          </div>
        </header>
        
        {/* LEGEND */}
        <div className="bg-slate-50 border-b border-slate-200 py-3">
          <div className="container max-w-6xl mx-auto px-4">
            <Legend />
          </div>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* MAIN SCORES */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🎯 Övergripande betyg
              <HelpBubble text="Dessa två tal sammanfattar hela samhällets tillstånd i ett enda mått. Det första visar balansen mellan olika områden, det andra visar den totala poängen." />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MainScoreCard
                title="Samhällsbalans"
                helpText="Mäter om samhället är i balans. Värdet 1.0 är perfekt balans. Under 1.0 betyder att vissa områden halkar efter. Det är som en våg - alla delar ska väga lika mycket."
                value={0.94}
                maxValue={1.0}
                unit=""
                change={-2.1}
                changePeriod="senaste året"
                interpretation="Samhället är lite obalanserat just nu. Hälsa och trygghet har försämrats mer än ekonomi och jobb."
                sparklineData={generateSparkline(94, 'down')}
                color="yellow"
              />
              
              <MainScoreCard
                title="Systemhälsa"
                helpText="Ett totalbetyg för hur bra samhället fungerar, från 0 till 100. Ju högre siffra, desto bättre. Det räknas ut från 56 olika mätningar inom hälsa, ekonomi, utbildning och mer."
                value={76.3}
                maxValue={100}
                unit="poäng"
                change={1.3}
                changePeriod="senaste året"
                interpretation="Ganska bra! Sverige ligger på plats 6 i världen. Ekonomin går bra men trygghet och integration behöver förbättras."
                sparklineData={generateSparkline(76, 'up')}
                color="green"
              />
            </div>
          </section>
          
          {/* DOMAINS */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🏛️ Olika områden i samhället
              <HelpBubble text="Samhället delas in i sex huvudområden. Varje område har flera mätpunkter som kombineras till en totalsiffra. Klicka på ett område för att se detaljerna." />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DomainCard
                icon="🏥"
                name="Hälsa & Vård"
                description="Hur friska vi är och hur vården fungerar"
                value={72}
                change={0.8}
                trend="up"
                indicatorCount={8}
              />
              <DomainCard
                icon="💰"
                name="Ekonomi"
                description="Jobb, löner och hur pengarna fördelas"
                value={68}
                change={-1.2}
                trend="down"
                indicatorCount={9}
              />
              <DomainCard
                icon="🛡️"
                name="Trygghet"
                description="Säkerhet, brott och känslan av trygghet"
                value={54}
                change={-2.1}
                trend="down"
                indicatorCount={10}
              />
              <DomainCard
                icon="📚"
                name="Utbildning"
                description="Skolor, kunskap och lärande"
                value={74}
                change={0.3}
                trend="stable"
                indicatorCount={7}
              />
              <DomainCard
                icon="🏠"
                name="Boende & Integration"
                description="Bostäder och hur väl vi lever tillsammans"
                value={58}
                change={-0.5}
                trend="down"
                indicatorCount={6}
              />
              <DomainCard
                icon="🌱"
                name="Miljö & Klimat"
                description="Naturens tillstånd och hållbarhet"
                value={71}
                change={1.2}
                trend="up"
                indicatorCount={8}
              />
            </div>
          </section>
          
          {/* TOP CHANGES */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best improvements */}
            <Card className="bg-emerald-50/50 border-emerald-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  📈 Går bäst just nu
                  <span className="text-xs font-normal text-emerald-600">(senaste 12 månaderna)</span>
                </h3>
                
                <div className="space-y-1">
                  <IndicatorRow
                    status="good"
                    name="Sysselsättningsgrad"
                    value="78.2%"
                    change={2.3}
                    explanation="Hur många som har jobb"
                  />
                  <IndicatorRow
                    status="good"
                    name="Medellivslängd"
                    value="83.1 år"
                    change={0.4}
                    explanation="Hur länge vi lever i snitt"
                  />
                  <IndicatorRow
                    status="good"
                    name="Förnybar energi"
                    value="67%"
                    change={3.8}
                    explanation="Andel el från sol, vind och vatten"
                  />
                  <IndicatorRow
                    status="good"
                    name="Gymnasiebehörighet"
                    value="85.3%"
                    change={1.2}
                    explanation="Elever som klarar gymnasiet"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Worst developments */}
            <Card className="bg-red-50/50 border-red-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  📉 Behöver förbättras
                  <span className="text-xs font-normal text-red-600">(senaste 12 månaderna)</span>
                </h3>
                
                <div className="space-y-1">
                  <IndicatorRow
                    status="bad"
                    name="Vårdköer"
                    value="127 dagar"
                    change={15.2}
                    explanation="Väntetid för att få vård"
                  />
                  <IndicatorRow
                    status="bad"
                    name="Skjutningar"
                    value="4.2/100k"
                    change={8.7}
                    explanation="Skjutningar per 100 000 invånare"
                  />
                  <IndicatorRow
                    status="warning"
                    name="Boendesegregation"
                    value="42 index"
                    change={2.1}
                    explanation="Hur uppdelat boendet är"
                  />
                  <IndicatorRow
                    status="warning"
                    name="Lärarbrist"
                    value="18.3%"
                    change={4.6}
                    explanation="Skolor som saknar behöriga lärare"
                  />
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* FOOTER EXPLANATION */}
          <footer className="bg-sky-50 rounded-xl p-5 border border-sky-100">
            <h3 className="font-semibold text-sky-900 mb-2 flex items-center gap-2">
              💡 Hur läser jag den här sidan?
            </h3>
            <div className="text-sm text-sky-800 space-y-2">
              <p>
                <strong>Siffrorna</strong> visar mätningar från officiella källor som SCB, Eurostat och WHO. 
                De uppdateras automatiskt när ny data kommer.
              </p>
              <p>
                <strong>Procenten (+/−)</strong> visar hur mycket något har förändrats under den valda tidsperioden. 
                Grönt = förbättring. Rött = försämring.
              </p>
              <p>
                <strong>Kurvorna</strong> (sparklines) visar trenden över tid. 
                Uppåtgående kurva = det blir bättre.
              </p>
              <p className="pt-2 border-t border-sky-200 text-sky-600">
                <strong>Viktigt:</strong> Korrelation är inte orsak. Att två saker förändras samtidigt betyder inte att det ena orsakade det andra.
                <Button variant="link" className="text-sky-700 underline h-auto p-0 ml-1">
                  Läs mer om hur vi räknar →
                </Button>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </TooltipProvider>
  );
}
