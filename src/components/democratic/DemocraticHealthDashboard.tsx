/**
 * Democratic Health Dashboard
 * 
 * Global aggregation view for democratic participation and governance quality.
 * Shows regime type distribution, turnout trends, and freedom indices globally.
 */

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Vote,
  Shield,
  Newspaper,
  BarChart3,
  Info,
} from 'lucide-react';
import {
  DEMOCRATIC_INDICATORS,
  GLOBAL_DEMOCRATIC_AGGREGATES,
  REGIME_CLASSIFICATIONS,
  SAMPLE_COUNTRY_DEMOCRATIC_DATA,
  DEMOCRATIC_FAULT_CODES,
  getRegimeClassification,
  calculateDemocraticLambda,
  type RegimeType,
  type CountryDemocraticData,
} from '@/lib/democratic-health';

// =============================================================================
// GLOBAL OVERVIEW PANEL
// =============================================================================

function GlobalOverviewPanel() {
  return (
    <div className="space-y-6">
      {/* Lambda Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GLOBAL_DEMOCRATIC_AGGREGATES.map((aggregate) => {
          const trendIcon = aggregate.trend === 'improving' 
            ? <TrendingUp className="w-4 h-4 text-green-500" />
            : aggregate.trend === 'declining'
              ? <TrendingDown className="w-4 h-4 text-red-500" />
              : <Minus className="w-4 h-4 text-muted-foreground" />;
          
          return (
            <div key={aggregate.code} className="p-4 rounded-lg border bg-card">
              <div className="font-mono text-xs text-muted-foreground mb-1">
                {aggregate.name.toUpperCase()}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold">{aggregate.globalValue}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {trendIcon}
                <span className="text-xs text-muted-foreground">
                  {aggregate.trendPeriod}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-mono">λ</span>
                <Progress 
                  value={aggregate.globalLambda * 100} 
                  className="h-1.5 flex-1" 
                />
                <span className="text-xs font-mono">{aggregate.globalLambda}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regime Type Distribution */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="font-mono text-sm font-semibold mb-4">
          GLOBAL REGIMTYPFÖRDELNING (2024)
        </div>
        <div className="space-y-3">
          {REGIME_CLASSIFICATIONS.map((regime) => {
            const percentage = Math.round((regime.countryCount / 167) * 100);
            return (
              <div key={regime.type} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: regime.color }}
                />
                <div className="w-32 text-sm font-medium">{regime.label}</div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: regime.color,
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right font-mono text-sm">
                  {regime.countryCount} länder
                </div>
                <div className="w-12 text-right font-mono text-xs text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
          Baserat på Economist Intelligence Unit Democracy Index 2024
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COUNTRY RANKING TABLE
// =============================================================================

interface CountryRankingTableProps {
  sortBy: 'democracy' | 'freedom' | 'turnout' | 'press';
}

function CountryRankingTable({ sortBy }: CountryRankingTableProps) {
  const sortedData = useMemo(() => {
    return [...SAMPLE_COUNTRY_DEMOCRATIC_DATA].sort((a, b) => {
      switch (sortBy) {
        case 'democracy': return b.democracyIndex - a.democracyIndex;
        case 'freedom': return b.freedomScore - a.freedomScore;
        case 'turnout': return b.voterTurnout - a.voterTurnout;
        case 'press': return b.pressFreedopm - a.pressFreedopm;
        default: return 0;
      }
    });
  }, [sortBy]);

  return (
    <div className="rounded-lg border">
      <div className="grid grid-cols-7 gap-2 p-3 bg-muted/30 text-xs font-mono font-semibold border-b">
        <div>#</div>
        <div className="col-span-2">NATION</div>
        <div className="text-right">DEM.INDEX</div>
        <div className="text-right">FRIHET</div>
        <div className="text-right">VALDELT.</div>
        <div className="text-right">PRESS</div>
      </div>
      <ScrollArea className="h-[400px]">
        {sortedData.map((country, index) => {
          const regime = getRegimeClassification(country.regimeType);
          const lambda = calculateDemocraticLambda(country);
          
          return (
            <div 
              key={country.countryCode}
              className="grid grid-cols-7 gap-2 p-3 border-b hover:bg-muted/30 transition-colors items-center text-sm"
            >
              <div className="font-mono text-muted-foreground">{index + 1}</div>
              <div className="col-span-2 flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: regime?.color }}
                />
                <span className="font-medium">{country.countryName}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {country.countryCode}
                </span>
              </div>
              <div className="text-right font-mono">
                {country.democracyIndex.toFixed(2)}
              </div>
              <div className="text-right font-mono">
                {country.freedomScore}
              </div>
              <div className="text-right font-mono">
                {country.voterTurnout > 0 ? `${country.voterTurnout}%` : '—'}
              </div>
              <div className="text-right font-mono">
                {country.pressFreedopm.toFixed(1)}
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}

// =============================================================================
// FAULT CODE PANEL
// =============================================================================

function DemocraticFaultCodePanel() {
  const severityColors = {
    informational: 'text-muted-foreground border-muted-foreground',
    warning: 'text-yellow-500 border-yellow-500',
    critical: 'text-red-500 border-red-500',
    systemic: 'text-purple-500 border-purple-500',
  };

  return (
    <div className="space-y-3">
      <div className="font-mono text-sm font-semibold">
        DEMOKRATISKA FELKODER
      </div>
      <div className="space-y-2">
        {DEMOCRATIC_FAULT_CODES.map((fc) => (
          <div key={fc.code} className="p-3 rounded-lg border bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs border px-2 py-0.5 rounded ${severityColors[fc.severity]}`}>
                  {fc.code}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {fc.severity.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="text-sm mt-2">{fc.description}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Triggas: {fc.triggeredWhen}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// INDICATOR DEFINITIONS
// =============================================================================

function IndicatorDefinitionsPanel() {
  const categoryIcons = {
    'GOV-DEM-TURNOUT': Vote,
    'GOV-DEM-TURNOUT-GAP': BarChart3,
    'GOV-DEM-YOUTH-VOTE': Users,
    'GOV-DEM-INDEX': Globe,
    'GOV-DEM-FREEDOM': Shield,
    'GOV-DEM-PRESS': Newspaper,
  } as Record<string, React.ComponentType<any>>;

  return (
    <div className="space-y-3">
      <div className="font-mono text-sm font-semibold">
        DEMOKRATISKA MÄTBLOCK
      </div>
      <div className="grid gap-3">
        {DEMOCRATIC_INDICATORS.map((indicator) => {
          const Icon = categoryIcons[indicator.code] || Info;
          
          return (
            <div key={indicator.code} className="p-3 rounded-lg border bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-muted">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {indicator.code}
                    </span>
                  </div>
                  <div className="font-semibold text-sm">{indicator.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {indicator.description}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {indicator.unit}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {indicator.source}
                    </Badge>
                    {indicator.setpointMin && (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        ≥{indicator.setpointMin}
                      </Badge>
                    )}
                    {indicator.setpointMax && (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        ≤{indicator.setpointMax}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

export function DemocraticHealthDashboard() {
  const [sortBy, setSortBy] = useState<'democracy' | 'freedom' | 'turnout' | 'press'>('democracy');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold">DEMOKRATISK HÄLSA</h1>
              <p className="text-sm text-muted-foreground">
                Global aggregering av valdeltagande, demokratiindex och styrelseformer
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 text-xs font-mono text-muted-foreground">
            <Badge variant="secondary">195 NATIONER</Badge>
            <Badge variant="secondary">10 INDIKATORER</Badge>
            <Badge variant="secondary">6 DATAKÄLLOR</Badge>
            <Badge variant="outline">SENAST UPPDATERAD: 2024-11</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="font-mono">
            <TabsTrigger value="overview">ÖVERSIKT</TabsTrigger>
            <TabsTrigger value="ranking">RANKNING</TabsTrigger>
            <TabsTrigger value="indicators">MÄTBLOCK</TabsTrigger>
            <TabsTrigger value="faults">FELKODER</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <GlobalOverviewPanel />
          </TabsContent>

          <TabsContent value="ranking" className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant={sortBy === 'democracy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('democracy')}
                className="font-mono text-xs"
              >
                DEM.INDEX
              </Button>
              <Button 
                variant={sortBy === 'freedom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('freedom')}
                className="font-mono text-xs"
              >
                FRIHET
              </Button>
              <Button 
                variant={sortBy === 'turnout' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('turnout')}
                className="font-mono text-xs"
              >
                VALDELTAGANDE
              </Button>
              <Button 
                variant={sortBy === 'press' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('press')}
                className="font-mono text-xs"
              >
                PRESSFRIHET
              </Button>
            </div>
            <CountryRankingTable sortBy={sortBy} />
          </TabsContent>

          <TabsContent value="indicators">
            <IndicatorDefinitionsPanel />
          </TabsContent>

          <TabsContent value="faults">
            <DemocraticFaultCodePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DemocraticHealthDashboard;
