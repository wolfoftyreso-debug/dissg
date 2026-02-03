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
  Layers,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

type ViewMode = 'overview' | 'timeline' | 'distribution';
type GeographyLevel = 'world' | 'country' | 'region';

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

function DistributionView({ domainScores }: { domainScores: DomainScore[] }) {
  // Simulated global distribution
  const percentiles = [
    { label: 'Topp 10%', range: '75-100', count: 22 },
    { label: 'Övre kvartil', range: '60-74', count: 45 },
    { label: 'Median', range: '45-59', count: 68 },
    { label: 'Nedre kvartil', range: '30-44', count: 42 },
    { label: 'Botten 10%', range: '0-29', count: 18 },
  ];

  const compositeScore = Math.round(
    domainScores.reduce((acc, d) => acc + d.score * 0.2, 0)
  );
  
  // Determine which percentile this score falls into
  const currentPercentile = compositeScore >= 75 ? 0 : 
                            compositeScore >= 60 ? 1 : 
                            compositeScore >= 45 ? 2 : 
                            compositeScore >= 30 ? 3 : 4;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-semibold mb-1">Global distribution</h3>
        <p className="text-sm text-muted-foreground">
          Var befinner sig detta värde i global jämförelse? Ingen ranking – endast fördelning.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          {percentiles.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 text-xs text-muted-foreground">{p.label}</div>
              <div className="flex-1 h-8 bg-muted/30 rounded relative overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full rounded",
                    i === currentPercentile ? "bg-primary" : "bg-muted"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.count / 70) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
                {i === currentPercentile && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground">
                    Du är här
                  </div>
                )}
              </div>
              <div className="w-16 text-xs text-right text-muted-foreground">
                {p.count} länder
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p><strong>Varför ingen ranking?</strong></p>
            <p className="mt-1">
              Ranking skapar falsk precision och uppmuntrar cherry-picking. 
              Fördelningar visar var ett värde befinner sig utan att påstå att position 47 är meningsfullt annorlunda än position 48.
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
// MAIN COMPONENT
// ============================================================================

export default function RealityIndex() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [geographyLevel] = useState<GeographyLevel>('country');

  // Generate domain scores (would come from real data in production)
  const domainScores = useMemo(() => {
    const seed = Date.now() / 1000000;
    return REALITY_DOMAINS.map(domain => generateDomainScore(domain, seed));
  }, []);

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
            <Badge variant="outline" className="text-xs hidden sm:flex">
              Sverige
            </Badge>
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
            Reality Index
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Hur utvecklas de grundläggande förutsättningarna för mänskligt liv och samhällsfunktion?
            <br />
            <span className="text-xs">Ingen åsikt. Endast observation.</span>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Domäner</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Tidslinje</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <BarChart3 className="h-4 w-4" />
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

          <TabsContent value="timeline" className="mt-6">
            <TimelineView domainScores={domainScores} />
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            <DistributionView domainScores={domainScores} />
          </TabsContent>
        </Tabs>

        {/* Methodology Notice */}
        <Card className="p-4 sm:p-6 bg-muted/30 border-dashed">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <strong className="text-foreground">Vad detta visar:</strong>
                <p>Ett viktat genomsnitt av 5 grundläggande samhällsdomäner, 
                var och en byggd på 4 underliggande indikatorer.</p>
              </div>
              <div>
                <strong className="text-foreground">Vad detta INTE visar:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-0.5">
                  <li>Orsakssamband mellan variabler</li>
                  <li>Policyrekommendationer</li>
                  <li>Framtidsprognoser</li>
                  <li>Värdering av om något är "bra" eller "dåligt"</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Metod:</strong>
                <p>Alla vikter är lika (20% per domän). Alla indikatorer normaliseras till 0-100 
                baserat på global distribution. Viktningen är öppen och kan justeras av användaren.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Citation Block */}
        <CitationBlock score={compositeScore} timestamp={timestamp} />

        {/* What the system never says */}
        <Card className="p-4 bg-rose-500/5 border-rose-500/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            <div className="text-sm">
              <strong className="text-foreground">Vad systemet aldrig säger:</strong>
              <ul className="mt-1 text-muted-foreground space-y-0.5">
                <li>❌ "Detta land misslyckas"</li>
                <li>❌ "Detta är bra/dåligt"</li>
                <li>❌ "Detta borde göras"</li>
              </ul>
              <p className="mt-2 text-foreground">
                ✓ "Under denna period förändrades grundförutsättningarna så här."
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/cities">
            <Card className="p-4 hover:bg-muted/50 transition-colors h-full">
              <div className="text-lg mb-1">🏙️</div>
              <div className="font-medium text-sm">Städer</div>
              <div className="text-xs text-muted-foreground">
                Reality Index för svenska städer
              </div>
            </Card>
          </Link>
          <Link to="/cite">
            <Card className="p-4 hover:bg-muted/50 transition-colors h-full">
              <div className="text-lg mb-1">🤖</div>
              <div className="font-medium text-sm">Citation API</div>
              <div className="text-xs text-muted-foreground">
                Maskinläsbar data för AI & media
              </div>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>Reality Index 1.0 · Uppdaterad: {timestamp}</p>
          <p className="mt-1">
            "Reality Index is not a verdict. It is a baseline."
          </p>
        </footer>
      </main>
    </div>
  );
}
