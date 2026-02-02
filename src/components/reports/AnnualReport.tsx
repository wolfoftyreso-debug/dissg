/**
 * Annual Report Component ("Country Wrapped")
 * 
 * This is not marketing. This is the year's factual account.
 * 
 * Fixed structure for ALL countries and cities:
 * 1. Opening - "This is how it went"
 * 2. Timeline - Year's curve
 * 3. Comparison - vs previous year, regional avg, similar entities
 * 4. Changes - Top 3 improvements, Top 3 declines
 * 5. Stable - What stayed the same
 * 6. Limitations - What the data does not say
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, TrendingDown, Minus, ChevronRight, 
  Calendar, Globe
} from 'lucide-react';
import { ANNUAL_REPORT_SECTIONS } from '@/config/extremeClarityVisuals';

// ============================================
// TYPES
// ============================================

interface KeyObservation {
  id: string;
  text: string;
  indicator: string;
  change: number;
  direction: 'up' | 'down' | 'stable';
  isPositive?: boolean; // Only if objectively measurable
}

interface TimelineEvent {
  period: string;
  label: string;
  value?: number;
  type: 'data' | 'event' | 'methodChange';
}

interface RankingItem {
  indicator: string;
  rank: number;
  totalEntities: number;
  value: number;
  unit: string;
}

interface ChangeItem {
  indicator: string;
  indicatorSv: string;
  changePercent: number;
  fromValue: number;
  toValue: number;
  unit: string;
  url: string;
}

interface AnnualReportData {
  entityType: 'country' | 'city';
  entityCode: string;
  entityName: string;
  entityNameSv: string;
  year: number;
  
  openingObservations: KeyObservation[];
  timeline: TimelineEvent[];
  
  comparisons: {
    vsPreviousYear: RankingItem[];
    vsRegionalAvg: RankingItem[];
    vsSimilarEntities: RankingItem[];
  };
  
  topImprovements: ChangeItem[];
  topDeclines: ChangeItem[];
  stableIndicators: string[];
  
  limitations: string[];
}

interface AnnualReportProps {
  data: AnnualReportData;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AnnualReport({ data, className }: AnnualReportProps) {
  const [activeSection, setActiveSection] = useState<string>('opening');

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{data.year}</span>
          <span>•</span>
          <Globe className="h-4 w-4" />
          <span>{data.entityNameSv}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Årsrapport {data.year}
        </h1>
        <p className="text-muted-foreground">
          {data.entityType === 'country' ? 'Nationell' : 'Kommunal'} sammanfattning
        </p>
      </header>

      {/* Section navigation */}
      <nav className="flex flex-wrap gap-2 border-b pb-4">
        {ANNUAL_REPORT_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {section.titleSv}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <div className="space-y-12">
        {/* 1. Opening */}
        {activeSection === 'opening' && (
          <OpeningSection observations={data.openingObservations} />
        )}

        {/* 2. Timeline */}
        {activeSection === 'timeline' && (
          <TimelineSection events={data.timeline} year={data.year} />
        )}

        {/* 3. Comparison */}
        {activeSection === 'comparison' && (
          <ComparisonSection comparisons={data.comparisons} />
        )}

        {/* 4. Changes */}
        {activeSection === 'most-changed' && (
          <ChangesSection 
            improvements={data.topImprovements}
            declines={data.topDeclines}
          />
        )}

        {/* 5. Stable */}
        {activeSection === 'stable' && (
          <StableSection indicators={data.stableIndicators} />
        )}

        {/* 6. Limitations */}
        {activeSection === 'limitations' && (
          <LimitationsSection limitations={data.limitations} />
        )}
      </div>
    </div>
  );
}

// ============================================
// SECTION COMPONENTS
// ============================================

function OpeningSection({ observations }: { observations: KeyObservation[] }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Så gick det</h2>
      <p className="text-muted-foreground text-sm">
        3–5 nyckelobservationer. Endast mätbara förändringar.
      </p>
      
      <div className="grid gap-4">
        {observations.map((obs) => (
          <div 
            key={obs.id}
            className="flex items-start gap-4 p-4 border rounded-lg"
          >
            <div className="shrink-0 mt-1">
              {obs.direction === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
              {obs.direction === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
              {obs.direction === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{obs.text}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {obs.indicator} • {obs.change > 0 ? '+' : ''}{obs.change.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineSection({ events, year }: { events: TimelineEvent[]; year: number }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Årets kurva</h2>
      <p className="text-muted-foreground text-sm">
        Januari → December. Viktiga datapunkter markerade. Inga tolkningar.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
        
        {/* Events */}
        <div className="space-y-6 pl-12">
          {events.map((event, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <div 
                className={cn(
                  'absolute -left-8 w-3 h-3 rounded-full border-2',
                  event.type === 'data' ? 'bg-primary border-primary' :
                  event.type === 'event' ? 'bg-accent border-accent' :
                  'bg-muted border-muted-foreground'
                )}
              />
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-mono">{event.period}</p>
                <p className="text-sm font-medium">{event.label}</p>
                {event.value !== undefined && (
                  <p className="text-lg font-mono">{event.value.toFixed(1)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({ comparisons }: { comparisons: AnnualReportData['comparisons'] }) {
  const [activeTab, setActiveTab] = useState<'previous' | 'regional' | 'similar'>('previous');

  const tabData = {
    previous: { label: 'Föregående år', data: comparisons.vsPreviousYear },
    regional: { label: 'Regionalt snitt', data: comparisons.vsRegionalAvg },
    similar: { label: 'Liknande länder', data: comparisons.vsSimilarEntities },
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Jämförelse</h2>
      
      {/* Tabs */}
      <div className="flex gap-2">
        {(Object.keys(tabData) as Array<keyof typeof tabData>).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1 text-sm rounded',
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tabData[tab].label}
          </button>
        ))}
      </div>

      {/* Rankings */}
      <div className="space-y-3">
        {tabData[activeTab].data.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border rounded">
            <div className="w-12 h-12 flex items-center justify-center bg-muted rounded font-bold text-lg">
              {item.rank}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.indicator}</p>
              <p className="text-sm text-muted-foreground">
                av {item.totalEntities} • {item.value.toFixed(1)} {item.unit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChangesSection({ 
  improvements, 
  declines 
}: { 
  improvements: ChangeItem[];
  declines: ChangeItem[];
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-xl font-semibold">Vad förändrades mest</h2>

      {/* Improvements */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Topp 3 förbättringar
        </h3>
        <div className="grid gap-3">
          {improvements.map((item, i) => (
            <ChangeCard key={i} item={item} isImprovement />
          ))}
        </div>
      </div>

      {/* Declines */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          Topp 3 försämringar
        </h3>
        <div className="grid gap-3">
          {declines.map((item, i) => (
            <ChangeCard key={i} item={item} isImprovement={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChangeCard({ item, isImprovement }: { item: ChangeItem; isImprovement: boolean }) {
  return (
    <a
      href={item.url}
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className={cn(
        'shrink-0 w-16 text-center font-mono text-lg font-bold',
        isImprovement ? 'text-green-500' : 'text-red-500'
      )}>
        {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
      </div>
      <div className="flex-1">
        <p className="font-medium">{item.indicatorSv}</p>
        <p className="text-sm text-muted-foreground">
          {item.fromValue.toFixed(1)} → {item.toValue.toFixed(1)} {item.unit}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}

function StableSection({ indicators }: { indicators: string[] }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Vad låg still</h2>
      <p className="text-muted-foreground text-sm">
        Viktigt för att motverka falsk dramatik. Inte allt förändras varje år.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {indicators.map((indicator, i) => (
          <div 
            key={i}
            className="flex items-center gap-2 p-3 border rounded bg-muted/20"
          >
            <Minus className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm">{indicator}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LimitationsSection({ limitations }: { limitations: string[] }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Vad datan inte säger</h2>
      <p className="text-muted-foreground text-sm">
        Samma mall överallt. Tydlig sektion för varje rapport.
      </p>

      <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
        {limitations.map((lim, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-muted-foreground">•</span>
            <p className="text-sm">{lim}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// DEMO
// ============================================

export function AnnualReportDemo() {
  const demoData: AnnualReportData = {
    entityType: 'country',
    entityCode: 'SE',
    entityName: 'Sweden',
    entityNameSv: 'Sverige',
    year: 2024,
    
    openingObservations: [
      { id: '1', text: 'Arbetslösheten minskade snabbare än EU-snittet', indicator: 'Arbetslöshet', change: -8.5, direction: 'down' },
      { id: '2', text: 'Livslängden ökade för tredje året i rad', indicator: 'Livslängd', change: 0.3, direction: 'up' },
      { id: '3', text: 'Energiförbrukningen per capita låg stabilt', indicator: 'Energi/capita', change: 0.2, direction: 'stable' },
    ],
    
    timeline: [
      { period: 'Jan 2024', label: 'Ny arbetskraftsundersökning publicerad', type: 'data' },
      { period: 'Mar 2024', label: 'Kvartalsdata Q1', value: 7.8, type: 'data' },
      { period: 'Jun 2024', label: 'Kvartalsdata Q2', value: 7.5, type: 'data' },
      { period: 'Sep 2024', label: 'Kvartalsdata Q3', value: 7.2, type: 'data' },
      { period: 'Dec 2024', label: 'Kvartalsdata Q4', value: 7.0, type: 'data' },
    ],
    
    comparisons: {
      vsPreviousYear: [
        { indicator: 'Arbetslöshet', rank: 8, totalEntities: 27, value: 7.0, unit: '%' },
        { indicator: 'BNP-tillväxt', rank: 12, totalEntities: 27, value: 1.8, unit: '%' },
      ],
      vsRegionalAvg: [
        { indicator: 'Arbetslöshet', rank: 3, totalEntities: 5, value: 7.0, unit: '%' },
      ],
      vsSimilarEntities: [
        { indicator: 'Arbetslöshet', rank: 2, totalEntities: 4, value: 7.0, unit: '%' },
      ],
    },
    
    topImprovements: [
      { indicator: 'Youth employment', indicatorSv: 'Ungdomssysselsättning', changePercent: 4.2, fromValue: 71.5, toValue: 74.5, unit: '%', url: '/indicators/youth-employment' },
      { indicator: 'Renewable energy', indicatorSv: 'Förnybar energi', changePercent: 3.1, fromValue: 62.0, toValue: 63.9, unit: '%', url: '/indicators/renewable' },
      { indicator: 'Digital skills', indicatorSv: 'Digital kompetens', changePercent: 2.8, fromValue: 78.0, toValue: 80.2, unit: '%', url: '/indicators/digital' },
    ],
    
    topDeclines: [
      { indicator: 'Housing starts', indicatorSv: 'Bostadsbyggande', changePercent: -15.2, fromValue: 52000, toValue: 44096, unit: 'enheter', url: '/indicators/housing' },
      { indicator: 'Birth rate', indicatorSv: 'Födelsetal', changePercent: -3.1, fromValue: 1.68, toValue: 1.63, unit: 'per kvinna', url: '/indicators/births' },
      { indicator: 'Trust in media', indicatorSv: 'Förtroende för media', changePercent: -2.5, fromValue: 45.0, toValue: 43.9, unit: '%', url: '/indicators/trust-media' },
    ],
    
    stableIndicators: [
      'Livslängd',
      'Utbildningsnivå',
      'Energiförbrukning',
      'Infrastruktur',
      'Demokratiindex',
      'Rättssäkerhet',
    ],
    
    limitations: [
      'Data för Q4 2024 är preliminär och kan revideras.',
      'Jämförelser med andra EU-länder kan påverkas av olika definitioner.',
      'Regionala variationer visas inte i denna nationella sammanfattning.',
      'Kvalitativa aspekter (t.ex. anställningskvalitet) fångas inte.',
      'Tidsfördröjning på 2-3 månader för vissa indikatorer.',
    ],
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <AnnualReport data={demoData} />
    </div>
  );
}
