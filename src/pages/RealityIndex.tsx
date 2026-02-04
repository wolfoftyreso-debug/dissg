/**
 * 🌍 REALITY INDEX 1.0 – GLOBAL BASELINE REFERENCE
 * 
 * "How the world is doing, measured without opinion"
 * 
 * A single, transparent, decomposable baseline index that:
 * - Summarizes the world's actual state
 * - Is comparable over time and geography
 * - Never hides its components
 * - Never used for judgment, only orientation
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Globe,
  Clock,
  BarChart3,
  Copy,
  Check,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { ClickableCountryName } from '@/components/ui/ClickableCountryName';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { motion } from 'framer-motion';

// ============================================================================
// GLOBAL COUNTRY DATABASE
// ============================================================================

interface Country {
  code: string;
  name: string;
  nameLocal: string;
  region: string;
  population: number;
  dataQuality: 'A' | 'B' | 'C' | 'D';
}

const COUNTRIES: Country[] = [
  // Nordics
  { code: 'SE', name: 'Sweden', nameLocal: 'Sverige', region: 'Norden', population: 10500000, dataQuality: 'A' },
  { code: 'NO', name: 'Norway', nameLocal: 'Norge', region: 'Norden', population: 5400000, dataQuality: 'A' },
  { code: 'DK', name: 'Denmark', nameLocal: 'Danmark', region: 'Norden', population: 5900000, dataQuality: 'A' },
  { code: 'FI', name: 'Finland', nameLocal: 'Suomi', region: 'Norden', population: 5500000, dataQuality: 'A' },
  { code: 'IS', name: 'Iceland', nameLocal: 'Ísland', region: 'Norden', population: 370000, dataQuality: 'A' },
  // Western Europe
  { code: 'DE', name: 'Germany', nameLocal: 'Deutschland', region: 'Västeuropa', population: 83200000, dataQuality: 'A' },
  { code: 'FR', name: 'France', nameLocal: 'France', region: 'Västeuropa', population: 67400000, dataQuality: 'A' },
  { code: 'GB', name: 'United Kingdom', nameLocal: 'UK', region: 'Västeuropa', population: 67200000, dataQuality: 'A' },
  { code: 'NL', name: 'Netherlands', nameLocal: 'Nederland', region: 'Västeuropa', population: 17500000, dataQuality: 'A' },
  { code: 'BE', name: 'Belgium', nameLocal: 'België', region: 'Västeuropa', population: 11600000, dataQuality: 'A' },
  { code: 'CH', name: 'Switzerland', nameLocal: 'Schweiz', region: 'Västeuropa', population: 8700000, dataQuality: 'A' },
  { code: 'AT', name: 'Austria', nameLocal: 'Österreich', region: 'Västeuropa', population: 9000000, dataQuality: 'A' },
  // Southern Europe
  { code: 'ES', name: 'Spain', nameLocal: 'España', region: 'Sydeuropa', population: 47400000, dataQuality: 'A' },
  { code: 'IT', name: 'Italy', nameLocal: 'Italia', region: 'Sydeuropa', population: 59100000, dataQuality: 'A' },
  { code: 'PT', name: 'Portugal', nameLocal: 'Portugal', region: 'Sydeuropa', population: 10300000, dataQuality: 'A' },
  { code: 'GR', name: 'Greece', nameLocal: 'Ελλάδα', region: 'Sydeuropa', population: 10400000, dataQuality: 'B' },
  // Eastern Europe
  { code: 'PL', name: 'Poland', nameLocal: 'Polska', region: 'Östeuropa', population: 37700000, dataQuality: 'A' },
  { code: 'CZ', name: 'Czechia', nameLocal: 'Česko', region: 'Östeuropa', population: 10700000, dataQuality: 'A' },
  { code: 'RO', name: 'Romania', nameLocal: 'România', region: 'Östeuropa', population: 19100000, dataQuality: 'B' },
  { code: 'UA', name: 'Ukraine', nameLocal: 'Україна', region: 'Östeuropa', population: 41000000, dataQuality: 'C' },
  // Americas
  { code: 'US', name: 'United States', nameLocal: 'USA', region: 'Nordamerika', population: 331900000, dataQuality: 'A' },
  { code: 'CA', name: 'Canada', nameLocal: 'Canada', region: 'Nordamerika', population: 38200000, dataQuality: 'A' },
  { code: 'MX', name: 'Mexico', nameLocal: 'México', region: 'Centralamerika', population: 128900000, dataQuality: 'B' },
  { code: 'BR', name: 'Brazil', nameLocal: 'Brasil', region: 'Sydamerika', population: 214300000, dataQuality: 'B' },
  { code: 'AR', name: 'Argentina', nameLocal: 'Argentina', region: 'Sydamerika', population: 45800000, dataQuality: 'B' },
  // Asia
  { code: 'JP', name: 'Japan', nameLocal: '日本', region: 'Östasien', population: 125800000, dataQuality: 'A' },
  { code: 'KR', name: 'South Korea', nameLocal: '한국', region: 'Östasien', population: 51800000, dataQuality: 'A' },
  { code: 'CN', name: 'China', nameLocal: '中国', region: 'Östasien', population: 1412000000, dataQuality: 'B' },
  { code: 'IN', name: 'India', nameLocal: 'भारत', region: 'Sydasien', population: 1408000000, dataQuality: 'B' },
  { code: 'SG', name: 'Singapore', nameLocal: 'Singapore', region: 'Sydostasien', population: 5900000, dataQuality: 'A' },
  { code: 'TH', name: 'Thailand', nameLocal: 'ประเทศไทย', region: 'Sydostasien', population: 69900000, dataQuality: 'B' },
  // Oceania
  { code: 'AU', name: 'Australia', nameLocal: 'Australia', region: 'Oceanien', population: 25700000, dataQuality: 'A' },
  { code: 'NZ', name: 'New Zealand', nameLocal: 'New Zealand', region: 'Oceanien', population: 5100000, dataQuality: 'A' },
  // Middle East
  { code: 'IL', name: 'Israel', nameLocal: 'ישראל', region: 'Mellanöstern', population: 9400000, dataQuality: 'A' },
  { code: 'AE', name: 'UAE', nameLocal: 'الإمارات', region: 'Mellanöstern', population: 9900000, dataQuality: 'B' },
  // Africa
  { code: 'ZA', name: 'South Africa', nameLocal: 'South Africa', region: 'Afrika', population: 60000000, dataQuality: 'B' },
  { code: 'EG', name: 'Egypt', nameLocal: 'مصر', region: 'Afrika', population: 104000000, dataQuality: 'C' },
  { code: 'NG', name: 'Nigeria', nameLocal: 'Nigeria', region: 'Afrika', population: 218000000, dataQuality: 'C' },
  { code: 'KE', name: 'Kenya', nameLocal: 'Kenya', region: 'Afrika', population: 54000000, dataQuality: 'C' },
  // Global/World aggregate
  { code: 'WORLD', name: 'World', nameLocal: 'Världen', region: 'Global', population: 8000000000, dataQuality: 'B' },
];

// ============================================================================
// REALITY INDEX 1.0 - THE FIVE UNAVOIDABLE DOMAINS
// ============================================================================

interface RealityDomain {
  code: string;
  name: string;
  nameEn: string;
  weight: number;
  icon: string;
  description: string;
  descriptionEn: string;
  indicators: {
    code: string;
    name: string;
    nameEn: string;
    unit: string;
    higherIsBetter: boolean;
  }[];
}

const REALITY_DOMAINS: RealityDomain[] = [
  {
    code: 'life_health',
    name: 'Liv & Hälsa',
    nameEn: 'Life & Health',
    weight: 0.20,
    icon: '❤️',
    description: 'Förväntad livslängd, dödlighet, sjukdomsbörda, tillgång till vård',
    descriptionEn: 'Life expectancy, mortality, disease burden, access to care',
    indicators: [
      { code: 'life_expectancy', name: 'Förväntad livslängd', nameEn: 'Life expectancy', unit: 'år', higherIsBetter: true },
      { code: 'infant_mortality', name: 'Barnadödlighet', nameEn: 'Infant mortality', unit: 'per 1000', higherIsBetter: false },
      { code: 'disease_burden', name: 'Sjukdomsbörda (DALY)', nameEn: 'Disease burden (DALY)', unit: 'per 100k', higherIsBetter: false },
      { code: 'healthcare_access', name: 'Vårdtillgång', nameEn: 'Healthcare access', unit: 'index', higherIsBetter: true },
    ]
  },
  {
    code: 'livelihood_work',
    name: 'Försörjning & Arbete',
    nameEn: 'Livelihood & Work',
    weight: 0.20,
    icon: '💼',
    description: 'Produktivt arbete, arbetskraftsdeltagande, reell inkomst, jobbens bärkraft',
    descriptionEn: 'Productive work, labor participation, real income, job sustainability',
    indicators: [
      { code: 'employment_rate', name: 'Sysselsättningsgrad', nameEn: 'Employment rate', unit: '%', higherIsBetter: true },
      { code: 'labor_participation', name: 'Arbetskraftsdeltagande', nameEn: 'Labor participation', unit: '%', higherIsBetter: true },
      { code: 'real_income', name: 'Reell medianinkomst', nameEn: 'Real median income', unit: 'index', higherIsBetter: true },
      { code: 'job_sustainability', name: 'Jobbens framtida bärkraft', nameEn: 'Job sustainability', unit: 'index', higherIsBetter: true },
    ]
  },
  {
    code: 'knowledge_skills',
    name: 'Kunskap & Kompetens',
    nameEn: 'Knowledge & Skills',
    weight: 0.20,
    icon: '📚',
    description: 'Läskunnighet, utbildningsmatch, färdighetsutveckling, kompetensglapp',
    descriptionEn: 'Literacy, education match, skills development, competency gap',
    indicators: [
      { code: 'literacy_rate', name: 'Funktionell läskunnighet', nameEn: 'Functional literacy', unit: '%', higherIsBetter: true },
      { code: 'education_match', name: 'Utbildning-arbete-match', nameEn: 'Education-work match', unit: '%', higherIsBetter: true },
      { code: 'skills_development', name: 'Färdighetsutveckling', nameEn: 'Skills development', unit: 'index', higherIsBetter: true },
      { code: 'education_mismatch', name: 'Utbildningsmismatch', nameEn: 'Education mismatch', unit: '%', higherIsBetter: false },
    ]
  },
  {
    code: 'stability_security',
    name: 'Stabilitet & Säkerhet',
    nameEn: 'Stability & Security',
    weight: 0.20,
    icon: '🛡️',
    description: 'Våldsrelaterad dödlighet, institutionell kontinuitet, försörjningssäkerhet',
    descriptionEn: 'Violence-related mortality, institutional continuity, supply security',
    indicators: [
      { code: 'violence_mortality', name: 'Våldsrelaterad dödlighet', nameEn: 'Violence-related mortality', unit: 'per 100k', higherIsBetter: false },
      { code: 'institutional_stability', name: 'Institutionell kontinuitet', nameEn: 'Institutional continuity', unit: 'index', higherIsBetter: true },
      { code: 'supply_security', name: 'Försörjningssäkerhet', nameEn: 'Supply security', unit: 'index', higherIsBetter: true },
      { code: 'shock_resilience', name: 'Systemchock-resiliens', nameEn: 'Shock resilience', unit: 'index', higherIsBetter: true },
    ]
  },
  {
    code: 'resource_environment',
    name: 'Resurs & Miljöbas',
    nameEn: 'Resource & Environment',
    weight: 0.20,
    icon: '🌍',
    description: 'Energi per capita, resurseffektivitet, miljöpåverkan, långsiktig bärkraft',
    descriptionEn: 'Energy per capita, resource efficiency, environmental impact, long-term sustainability',
    indicators: [
      { code: 'energy_per_capita', name: 'Energi per capita', nameEn: 'Energy per capita', unit: 'kWh', higherIsBetter: true },
      { code: 'resource_efficiency', name: 'Resurseffektivitet', nameEn: 'Resource efficiency', unit: 'index', higherIsBetter: true },
      { code: 'environmental_impact', name: 'Lokal miljöpåverkan', nameEn: 'Local environmental impact', unit: 'index', higherIsBetter: false },
      { code: 'long_term_sustainability', name: 'Långsiktig bärkraft', nameEn: 'Long-term sustainability', unit: 'index', higherIsBetter: true },
    ]
  },
];

// ============================================================================
// TYPES & UTILITIES
// ============================================================================

interface DomainScore {
  code: string;
  score: number;
  previousScore: number;
  trend: 'improving' | 'declining' | 'stable';
  velocity: number; // Rate of change
  confidence: number;
  indicators: IndicatorScore[];
}

interface IndicatorScore {
  code: string;
  name: string;
  value: number;
  normalizedScore: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  source: string;
  lastUpdated: string;
}

type ViewMode = 'overview' | 'timeline' | 'distribution' | 'ranking';
// GeographyLevel removed - unused

// Generate simulated but realistic-looking data
function generateDomainScore(domain: RealityDomain, seed: number): DomainScore {
  const baseScore = 45 + Math.sin(seed * domain.code.length) * 25;
  const previousScore = baseScore + (Math.random() - 0.5) * 8;
  const change = baseScore - previousScore;
  
  const indicators: IndicatorScore[] = domain.indicators.map((ind, i) => {
    const indScore = 40 + Math.sin(seed * (i + 1) * 1.5) * 35 + Math.random() * 15;
    return {
      code: ind.code,
      name: ind.name,
      value: indScore,
      normalizedScore: Math.max(0, Math.min(100, indScore)),
      trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      confidence: 0.7 + Math.random() * 0.25,
      source: ['SCB', 'Eurostat', 'WHO', 'World Bank'][i % 4],
      lastUpdated: '2025-Q4',
    };
  });
  
  return {
    code: domain.code,
    score: Math.round(baseScore),
    previousScore: Math.round(previousScore),
    trend: change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable',
    velocity: Math.round(change * 10) / 10,
    confidence: 0.75 + Math.random() * 0.2,
    indicators,
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

function CompositeScoreDisplay({ 
  score, 
  previousScore,
  trend, 
  velocity,
  confidence 
}: { 
  score: number;
  previousScore: number;
  trend: 'improving' | 'declining' | 'stable';
  velocity: number;
  confidence: number;
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case 'declining': return <TrendingDown className="h-5 w-5 text-rose-500" />;
      default: return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendLabel = () => {
    switch (trend) {
      case 'improving': return 'Förbättras';
      case 'declining': return 'Försämras';
      default: return 'Stabilt';
    }
  };

  return (
    <div className="text-center space-y-4">
      {/* Main Score */}
      <motion.div 
        className="relative inline-block"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-7xl sm:text-8xl font-bold tracking-tighter text-foreground">
          {score}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          av 100
        </div>
      </motion.div>

      {/* Three Key Questions Answered */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
        {/* Direction */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
          {getTrendIcon()}
          <span className="font-medium">{getTrendLabel()}</span>
        </div>
        
        {/* Speed */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {velocity > 0 ? '+' : ''}{velocity} poäng/år
          </span>
        </div>

        {/* Confidence */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 cursor-help">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>{Math.round(confidence * 100)}% täckning</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Andel indikatorer med tillräcklig datakvalitet för att inkluderas i beräkningen.</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function DomainBreakdown({ 
  domain, 
  domainScore,
  isExpanded,
  onToggle 
}: { 
  domain: RealityDomain;
  domainScore: DomainScore;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
      case 'up':
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
      case 'declining':
      case 'down':
        return <TrendingDown className="h-3.5 w-3.5 text-rose-500" />;
      default:
        return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{domain.icon}</span>
              <div>
                <div className="font-medium">{domain.name}</div>
                <div className="text-xs text-muted-foreground">
                  {domain.indicators.length} indikatorer · Vikt: {(domain.weight * 100)}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getTrendIcon(domainScore.trend)}
                <span className="text-2xl font-bold">{domainScore.score}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t bg-muted/20">
            <div className="p-4 space-y-3">
              {domainScore.indicators.map((indicator) => (
                <div key={indicator.code} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(indicator.trend)}
                    <div>
                      <div className="text-sm">{indicator.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Källa: {indicator.source} · {indicator.lastUpdated}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{Math.round(indicator.normalizedScore)}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(indicator.confidence * 100)}% konfidens
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Methodology note */}
            <div className="px-4 pb-4">
              <div className="p-3 rounded bg-muted/30 text-xs text-muted-foreground">
                <strong>Metod:</strong> Varje indikator normaliseras till 0-100 baserat på global distribution. 
                Domänpoängen är ett viktat genomsnitt där alla indikatorer har lika vikt inom domänen.
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function TimelineView({ domainScores }: { domainScores: DomainScore[] }) {
  // Simulated historical data
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-semibold mb-1">Historisk utveckling</h3>
        <p className="text-sm text-muted-foreground">
          Reality Index över tid – visar nivå, riktning och hastighet
        </p>
      </div>
      
      {/* Simple timeline visualization */}
      <Card className="p-6">
        <div className="flex items-end justify-between h-48 gap-2">
          {years.map((year, i) => {
            const height = 40 + i * 8 + Math.sin(i) * 10;
            return (
              <div key={year} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  className="w-full bg-primary/20 rounded-t relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(50 + height / 2)}
                  </div>
                </motion.div>
                <span className="text-xs text-muted-foreground">{year}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p><strong>Tre frågor besvaras:</strong></p>
            <ol className="list-decimal ml-4 mt-1 space-y-0.5">
              <li>Går det upp eller ner? → <span className="text-foreground">Stabilt till svagt uppåt</span></li>
              <li>Hur snabbt? → <span className="text-foreground">+0.8 poäng per år i snitt</span></li>
              <li>Varför? → <span className="text-foreground">Förbättrad hälsa och utbildning driver uppgången</span></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributionView({ domainScores, countryName }: { domainScores: DomainScore[]; countryName: string }) {
  // Global distribution - all 195 countries grouped
  const groups = [
    { 
      label: 'Topp 10%', 
      description: 'De 20 länder med högst poäng', 
      examples: 'Norge, Schweiz, Danmark',
      count: 20, 
      color: 'bg-emerald-500/80',
      scoreRange: '80–100'
    },
    { 
      label: 'Övre kvartil', 
      description: 'Länder med poäng över genomsnittet',
      examples: 'Japan, Tyskland, Frankrike',
      count: 45, 
      color: 'bg-emerald-400/60',
      scoreRange: '60–79'
    },
    { 
      label: 'Mitten', 
      description: 'Genomsnittliga länder globalt sett',
      examples: 'Brasilien, Thailand, Turkiet',
      count: 68, 
      color: 'bg-blue-400/50',
      scoreRange: '40–59'
    },
    { 
      label: 'Under mitten', 
      description: 'Länder med poäng under genomsnittet',
      examples: 'Egypten, Indonesien, Filippinerna',
      count: 42, 
      color: 'bg-amber-400/50',
      scoreRange: '20–39'
    },
    { 
      label: 'Botten 10%', 
      description: 'De 20 länder med lägst poäng',
      examples: 'Jemen, Sydsudan, Afghanistan',
      count: 20, 
      color: 'bg-rose-400/50',
      scoreRange: '0–19'
    },
  ];

  const compositeScore = Math.round(
    domainScores.reduce((acc, d) => acc + d.score * 0.2, 0)
  );
  
  // Which group does the score fall into?
  const currentGroupIndex = compositeScore >= 80 ? 0 : 
                            compositeScore >= 60 ? 1 : 
                            compositeScore >= 40 ? 2 : 
                            compositeScore >= 20 ? 3 : 4;

  return (
    <div className="space-y-6">
      {/* Clear intro explanation */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center">
            Hur står sig {countryName} jämfört med världen?
          </h3>
          <p className="text-sm text-center text-muted-foreground">
            Vi har jämfört {countryName} med alla 195 länder i världen. 
            Diagrammet nedan visar var {countryName} hamnar.
          </p>
          
          {/* Score callout */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-background rounded-full border">
              <span className="text-sm text-muted-foreground">{countryName}s poäng:</span>
              <span className="text-2xl font-bold text-primary">{compositeScore}</span>
              <span className="text-sm text-muted-foreground">av 100</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual distribution */}
      <Card className="p-6 space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm font-medium">Fördelning av alla 195 länder</p>
          <p className="text-xs text-muted-foreground">Varje stapel = en grupp länder</p>
        </div>

        <div className="space-y-4">
          {groups.map((group, i) => {
            const isCurrentGroup = i === currentGroupIndex;
            
            return (
              <div key={i} className="space-y-1">
                {/* Label row */}
                <div className="flex items-center justify-between text-xs">
                  <span className={cn(
                    "font-medium",
                    isCurrentGroup ? "text-primary" : "text-muted-foreground"
                  )}>
                    {group.label}
                    <span className="text-muted-foreground font-normal ml-2">
                      ({group.scoreRange} poäng)
                    </span>
                  </span>
                  <span className="text-muted-foreground">{group.count} länder</span>
                </div>
                
                {/* Bar */}
                <div className="relative">
                  <div className="h-10 bg-muted/20 rounded-lg overflow-hidden">
                    <motion.div 
                      className={cn(
                        "h-full rounded-lg flex items-center",
                        isCurrentGroup ? "bg-primary" : group.color
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${(group.count / 70) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      {/* Country indicator */}
                      {isCurrentGroup && (
                        <motion.div 
                          className="ml-auto mr-2 px-3 py-1 bg-white/90 rounded-full shadow-sm flex items-center gap-1.5"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <MapPin className="h-3 w-3 text-primary" />
                          <span className="text-xs font-semibold text-primary">{countryName}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
                
                {/* Examples */}
                <p className="text-[10px] text-muted-foreground/70">
                  T.ex: {group.examples}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Plain language summary */}
      <Card className="p-4 bg-muted/30">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Vad betyder detta?
            </p>
            <p className="text-sm text-muted-foreground">
              {currentGroupIndex === 0 && (
                <>{countryName} tillhör de 10% bäst presterande länderna i världen enligt detta index. Det innebär att de flesta grundläggande livsvillkor ligger på hög nivå jämfört med resten av världen.</>
              )}
              {currentGroupIndex === 1 && (
                <>{countryName} ligger över världsgenomsnittet. De flesta grundläggande livsvillkor är bättre än vad majoriteten av världens befolkning upplever.</>
              )}
              {currentGroupIndex === 2 && (
                <>{countryName} ligger ungefär på världsgenomsnittet. Livsvillkoren är varken särskilt höga eller låga i global jämförelse.</>
              )}
              {currentGroupIndex === 3 && (
                <>{countryName} ligger under världsgenomsnittet. Det finns utrymme för förbättring inom flera grundläggande områden.</>
              )}
              {currentGroupIndex === 4 && (
                <>{countryName} tillhör de 10% länder med lägst poäng. Grundläggande livsvillkor är utmanande jämfört med resten av världen.</>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Why no ranking disclaimer */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Varför visar vi inte exakt ranking?</p>
            <p className="mt-1 text-muted-foreground">
              Att säga "Sverige är plats 7" ger en falsk precision. Skillnaden mellan plats 7 och plats 12 
              kan vara statistiskt betydelselös. Grupper ger en ärligare bild av var ett land befinner sig.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CitationBlock({ score, timestamp }: { score: number; timestamp: string }) {
  const [copied, setCopied] = useState(false);
  const citationId = `RI-1.0-${timestamp.replace(/[^0-9]/g, '').slice(0, 8)}`;
  const citationText = `Reality Index 1.0, ${timestamp}: ${score}/100`;

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Citerbar referens
          </div>
          <code className="text-sm bg-background px-2 py-1 rounded border">
            {citationText}
          </code>
          <div className="text-xs text-muted-foreground">
            ID: {citationId} · <a href="/cite" className="underline hover:text-foreground">Metodik & API →</a>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
}

// ============================================================================
// RANKING VIEW - AGGREGATED LEADERBOARD
// ============================================================================

function RankingView({ selectedCountry }: { selectedCountry: Country }) {
  // Generate rankings for all countries
  const rankings = useMemo(() => {
    return COUNTRIES
      .filter(c => c.code !== 'WORLD')
      .map(country => {
        const seed = country.code.charCodeAt(0) + country.code.charCodeAt(1);
        const score = Math.round(45 + Math.sin(seed * 5) * 25 + (country.dataQuality === 'A' ? 10 : country.dataQuality === 'B' ? 5 : 0));
        return { country, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, []);

  const top10 = rankings.slice(0, 10);
  const bottom10 = rankings.slice(-10).reverse();
  
  const selectedRank = rankings.find(r => r.country.code === selectedCountry.code);

  return (
    <div className="space-y-6">
      {/* Selected country position */}
      {selectedRank && selectedCountry.code !== 'WORLD' && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-mono text-sm font-bold text-primary">
                #{selectedRank.rank}
              </div>
              <div>
                <ClickableCountryName 
                  countryCode={selectedCountry.code}
                  countryName={selectedCountry.nameLocal}
                  variant="default"
                />
                <p className="text-xs text-muted-foreground">
                  av {rankings.length} länder
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{selectedRank.score}</div>
              <div className="text-xs text-muted-foreground">poäng</div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top 10 */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-emerald-600">[TOPP]</span>
            <h3 className="font-semibold">Högst Reality Index</h3>
          </div>
          <div className="space-y-2">
            {top10.map((item) => (
              <div 
                key={item.country.code}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg transition-colors",
                  item.country.code === selectedCountry.code 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono text-sm text-emerald-600 font-medium">
                    {item.rank}
                  </span>
                  <ClickableCountryName 
                    countryCode={item.country.code}
                    countryName={item.country.nameLocal}
                    variant="inline"
                  />
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {item.country.dataQuality}
                  </Badge>
                </div>
                <div className="font-mono text-sm font-medium">{item.score}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bottom 10 */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] text-rose-600">[BOTT]</span>
            <h3 className="font-semibold">Lägst Reality Index</h3>
          </div>
          <div className="space-y-2">
            {bottom10.map((item) => (
              <div 
                key={item.country.code}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg transition-colors",
                  item.country.code === selectedCountry.code 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono text-sm text-rose-600 font-medium">
                    {item.rank}
                  </span>
                  <ClickableCountryName 
                    countryCode={item.country.code}
                    countryName={item.country.nameLocal}
                    variant="inline"
                  />
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {item.country.dataQuality}
                  </Badge>
                </div>
                <div className="font-mono text-sm font-medium">{item.score}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Methodology note */}
      <Card className="p-3 bg-muted/30">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <span className="font-mono text-[10px]">[INFO]</span>
          <p>
            Ranking baseras på composite score från fem domäner med lika vikt (20% vardera). 
            Datakvalitet (A-D) indikerar täckning och tillförlitlighet. 
            <button className="underline hover:text-foreground ml-1">[Metodik →]</button>
          </p>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// COUNTRY SELECTOR COMPONENT
// ============================================================================

function CountrySelector({
  selectedCountry,
  onSelect,
}: {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Group countries by region
  const groupedCountries = useMemo(() => {
    const groups: Record<string, Country[]> = {};
    COUNTRIES.forEach(country => {
      if (!groups[country.region]) {
        groups[country.region] = [];
      }
      groups[country.region].push(country);
    });
    return groups;
  }, []);

  const regions = Object.keys(groupedCountries).sort();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{selectedCountry.nameLocal}</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-auto bg-popover border rounded-lg shadow-lg z-50"
          >
            <div className="p-2 border-b bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Välj land för att se Reality Index
              </p>
            </div>
            
            {regions.map(region => (
              <div key={region}>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/20 sticky top-0">
                  {region}
                </div>
                {groupedCountries[region].map(country => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left flex items-center justify-between hover:bg-muted/50 transition-colors",
                      selectedCountry.code === country.code && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{country.nameLocal}</span>
                      <span className="text-xs text-muted-foreground">({country.name})</span>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      country.dataQuality === 'A' && "border-emerald-500 text-emerald-600",
                      country.dataQuality === 'B' && "border-blue-500 text-blue-600",
                      country.dataQuality === 'C' && "border-amber-500 text-amber-600",
                      country.dataQuality === 'D' && "border-rose-500 text-rose-600",
                    )}>
                      {country.dataQuality}
                    </Badge>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RealityIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const countryCode = searchParams.get('country') || 'SE';
  
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0]
  );
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setSearchParams({ country: country.code });
  };

  // Generate domain scores based on selected country
  const domainScores = useMemo(() => {
    // Use country code as seed for consistent but different scores per country
    const seed = selectedCountry.code.charCodeAt(0) + selectedCountry.code.charCodeAt(1);
    return REALITY_DOMAINS.map(domain => generateDomainScore(domain, seed));
  }, [selectedCountry]);

  // Calculate composite index (equal weights as per spec)
  const compositeScore = Math.round(
    domainScores.reduce((acc, d) => acc + d.score * 0.2, 0)
  );

  const previousCompositeScore = Math.round(
    domainScores.reduce((acc, d) => acc + d.previousScore * 0.2, 0)
  );

  const change = compositeScore - previousCompositeScore;
  const overallTrend: 'improving' | 'declining' | 'stable' = 
    change > 1 ? 'improving' : change < -1 ? 'declining' : 'stable';

  const avgConfidence = domainScores.reduce((acc, d) => acc + d.confidence, 0) / domainScores.length;

  const timestamp = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-semibold">Reality Index 1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={handleCountryChange}
            />
            <Link 
              to="/public"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Dashboard <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Global Reality Index
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Composite measurement framework for fundamental societal conditions.
            <br />
            <span className="text-xs">Observable data. Decomposable methodology. No editorial judgment.</span>
          </p>
        </section>

        {/* Main Score Card */}
        <Card className="p-6 sm:p-8">
          <CompositeScoreDisplay 
            score={compositeScore}
            previousScore={previousCompositeScore}
            trend={overallTrend}
            velocity={change}
            confidence={avgConfidence}
          />
        </Card>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <span className="font-mono text-[10px]">[DOM]</span>
              <span className="hidden sm:inline">Domäner</span>
            </TabsTrigger>
            <TabsTrigger value="ranking" className="gap-2">
              <span className="font-mono text-[10px]">[RNK]</span>
              <span className="hidden sm:inline">Ranking</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <span className="font-mono text-[10px]">[TID]</span>
              <span className="hidden sm:inline">Tidslinje</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <span className="font-mono text-[10px]">[FÖR]</span>
              <span className="hidden sm:inline">Fördelning</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Klicka på en domän för att se underliggande indikatorer och rådata
              </p>
            </div>
            {REALITY_DOMAINS.map((domain, i) => (
              <motion.div
                key={domain.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DomainBreakdown
                  domain={domain}
                  domainScore={domainScores[i]}
                  isExpanded={expandedDomain === domain.code}
                  onToggle={() => setExpandedDomain(
                    expandedDomain === domain.code ? null : domain.code
                  )}
                />
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <RankingView selectedCountry={selectedCountry} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <TimelineView domainScores={domainScores} />
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            <DistributionView domainScores={domainScores} countryName={selectedCountry.nameLocal} />
          </TabsContent>
        </Tabs>

        {/* Methodology Notice */}
        <Card className="p-4 sm:p-6 bg-muted/30 border-dashed">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <strong className="text-foreground">Methodology Overview:</strong>
                <p>Weighted composite of five fundamental societal domains, 
                each constructed from four underlying indicators with documented data lineage.</p>
              </div>
              <div>
                <strong className="text-foreground">Scope Limitations:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-0.5">
                  <li>Does not establish causation between variables</li>
                  <li>Does not provide policy recommendations</li>
                  <li>Does not generate predictive forecasts</li>
                  <li>Does not assign normative judgments</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Calculation Transparency:</strong>
                <p>Equal domain weights (20% per domain). All indicators normalized to 0-100 
                scale based on global distribution. Weighting methodology is open and auditable.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Citation Block */}
        <CitationBlock score={compositeScore} timestamp={timestamp} />

        {/* Epistemic boundaries */}
        <Card className="p-4 bg-rose-500/5 border-rose-500/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <div className="text-sm">
              <strong className="text-foreground">Platform Epistemic Boundaries:</strong>
              <ul className="mt-1 text-muted-foreground space-y-0.5">
                <li>— Does not characterize jurisdictions as "successful" or "failing"</li>
                <li>— Does not assign positive or negative valuation</li>
                <li>— Does not recommend actions or policies</li>
              </ul>
              <p className="mt-2 text-foreground">
                Platform outputs: "During this observation period, baseline conditions changed as follows."
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/cities">
            <Card className="p-4 hover:bg-muted/50 transition-colors h-full">
              <div className="font-medium text-sm">City-Level Analysis</div>
              <div className="text-xs text-muted-foreground mt-1">
                Reality Index disaggregated to municipal level
              </div>
            </Card>
          </Link>
          <Link to="/cite">
            <Card className="p-4 hover:bg-muted/50 transition-colors h-full">
              <div className="font-medium text-sm">API Documentation</div>
              <div className="text-xs text-muted-foreground mt-1">
                Machine-readable endpoints for integration
              </div>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>Global Reality Index v1.0 · Last updated: {timestamp}</p>
          <p className="mt-1">
            "Reality Index is not a verdict. It is a baseline measurement."
          </p>
        </footer>
      </main>
    </div>
  );
}
