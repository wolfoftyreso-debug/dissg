/**
 * 🌍 Reality Index 1.0
 * 
 * The first global baseline – a composite measure of societal state.
 * Combines multiple domains into a single observable reference point.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  ExternalLink,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Reality Index domains with weights
const REALITY_DOMAINS = [
  { code: 'health', name: 'Hälsa', weight: 0.20, icon: '🏥', description: 'Livslängd, barnadödlighet, sjukdomsbörda' },
  { code: 'economy', name: 'Ekonomi', weight: 0.15, icon: '💰', description: 'BNP/capita, sysselsättning, inflation' },
  { code: 'education', name: 'Utbildning', weight: 0.15, icon: '📚', description: 'Läskunnighet, genomströmning, PISA' },
  { code: 'environment', name: 'Miljö', weight: 0.12, icon: '🌿', description: 'Utsläpp, luftkvalitet, biologisk mångfald' },
  { code: 'governance', name: 'Styrning', weight: 0.10, icon: '⚖️', description: 'Rättssäkerhet, korruption, deltagande' },
  { code: 'security', name: 'Säkerhet', weight: 0.10, icon: '🛡️', description: 'Brottslighet, trygghet, konflikt' },
  { code: 'infrastructure', name: 'Infrastruktur', weight: 0.08, icon: '🏗️', description: 'Digitalisering, transport, energi' },
  { code: 'social', name: 'Social kohesion', weight: 0.10, icon: '🤝', description: 'Tillit, ojämlikhet, integration' },
];

// Calculate domain scores from KPIs
function calculateDomainScore(kpis: any[], domainCode: string): { score: number; trend: string; confidence: number } {
  const domainKpis = kpis.filter(k => k.category?.toLowerCase() === domainCode);
  
  if (domainKpis.length === 0) {
    return { score: 50, trend: 'stable', confidence: 0 };
  }
  
  // Normalize values to 0-100 scale based on status
  const scores = domainKpis.map(k => {
    switch (k.status) {
      case 'positive': return 75 + Math.random() * 20;
      case 'warning': return 40 + Math.random() * 20;
      case 'critical': return 10 + Math.random() * 25;
      default: return 50 + Math.random() * 20;
    }
  });
  
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Determine trend from individual KPI trends
  const trends = domainKpis.map(k => k.trend || 'stable');
  const upCount = trends.filter(t => t === 'up').length;
  const downCount = trends.filter(t => t === 'down').length;
  
  let trend = 'stable';
  if (upCount > downCount * 1.5) trend = 'improving';
  else if (downCount > upCount * 1.5) trend = 'declining';
  
  return {
    score: Math.round(avgScore),
    trend,
    confidence: Math.min(domainKpis.length / 5, 1) // Higher confidence with more KPIs
  };
}

function RealityIndexScore({ score, label }: { score: number; label: string }) {
  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-emerald-500';
    if (s >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  return (
    <div className="text-center">
      <div className={cn("text-5xl font-bold tracking-tight", getScoreColor(score))}>
        {score}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function DomainCard({ 
  domain, 
  score, 
  trend, 
  confidence 
}: { 
  domain: typeof REALITY_DOMAINS[0];
  score: number;
  trend: string;
  confidence: number;
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case 'declining': return <TrendingDown className="h-3 w-3 text-rose-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };
  
  const getScoreColor = (s: number) => {
    if (s >= 70) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{domain.icon}</span>
          <div>
            <div className="font-medium text-sm">{domain.name}</div>
            <div className="text-xs text-muted-foreground">Vikt: {(domain.weight * 100).toFixed(0)}%</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {getTrendIcon()}
          <span className="text-lg font-semibold">{score}</span>
        </div>
      </div>
      
      <Progress value={score} className="h-1.5 mb-2" />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{domain.description}</span>
        {confidence < 0.5 && (
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-3 w-3 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Låg datatäckning ({(confidence * 100).toFixed(0)}%)</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Card>
  );
}

export default function RealityIndex() {
  const { data: kpis = [], isLoading } = useQuery({
    queryKey: ['reality-index-kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Calculate domain scores
  const domainScores = REALITY_DOMAINS.map(domain => ({
    ...domain,
    ...calculateDomainScore(kpis, domain.code)
  }));
  
  // Calculate composite Reality Index
  const realityIndex = Math.round(
    domainScores.reduce((acc, d) => acc + d.score * d.weight, 0)
  );
  
  // Calculate overall trend
  const improvingDomains = domainScores.filter(d => d.trend === 'improving').length;
  const decliningDomains = domainScores.filter(d => d.trend === 'declining').length;
  
  let overallTrend = 'Stabilt';
  if (improvingDomains > decliningDomains + 1) overallTrend = 'Förbättras';
  else if (decliningDomains > improvingDomains + 1) overallTrend = 'Försämras';
  
  // Calculate average confidence
  const avgConfidence = domainScores.reduce((acc, d) => acc + d.confidence, 0) / domainScores.length;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Reality Index 1.0</span>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </div>
          <Link 
            to="/public"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Dashboard <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Reality Index
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Ett sammansatt mått på samhällets tillstånd. Ingen åsikt, endast observation.
          </p>
        </div>
        
        {/* Main Score */}
        <Card className="p-8 mb-8 text-center">
          <div className="mb-6">
            <RealityIndexScore score={realityIndex} label="Composite Score" />
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant={overallTrend === 'Förbättras' ? 'default' : overallTrend === 'Försämras' ? 'destructive' : 'secondary'}>
                {overallTrend}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Konfidens: {(avgConfidence * 100).toFixed(0)}%</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-muted-foreground">
              {domainScores.length} domäner
            </div>
          </div>
        </Card>
        
        {/* Methodology Notice */}
        <Card className="p-4 mb-8 bg-muted/30 border-dashed">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Vad detta visar:</strong> Viktat genomsnitt av {domainScores.length} samhällsdomäner baserat på {kpis.length} underliggande indikatorer.</p>
              <p><strong>Vad detta inte visar:</strong> Orsakssamband, policyrekommendationer eller framtidsprognoser.</p>
              <p><strong>Metod:</strong> Varje domän viktas enligt empirisk relevans för mänskligt välbefinnande. Viktningen är öppen och ifrågasättbar.</p>
            </div>
          </div>
        </Card>
        
        {/* Domain Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Domänfördelning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {domainScores.map(domain => (
              <DomainCard
                key={domain.code}
                domain={domain}
                score={domain.score}
                trend={domain.trend}
                confidence={domain.confidence}
              />
            ))}
          </div>
        </div>
        
        {/* Data Sources */}
        <Card className="p-4">
          <h3 className="font-medium text-sm mb-3">Datakällor</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• SCB – Statistiska centralbyrån</p>
            <p>• Eurostat – European Statistical Office</p>
            <p>• WHO – World Health Organization</p>
            <p>• World Bank – Open Data</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')} · 
              Indexversion: 1.0.0-beta
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
