/**
 * PORTFOLIO STATS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Aggregerad statistik för portföljens länder.
 * Visar Reality Index och nyckeltal.
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Country {
  code: string;
  name: string;
  population?: number | null;
  gdp_per_capita?: number | null;
  data_quality_score?: number | null;
}

interface PortfolioStatsProps {
  countryCodes: string[];
  countries: Country[];
}

// Simulated Reality Index scores (would come from real data)
function getSimulatedRealityIndex(code: string): number {
  const hash = code.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return 40 + (hash % 45); // 40-85 range
}

function getSimulatedDomainScores(code: string) {
  const base = getSimulatedRealityIndex(code);
  return {
    vitality: base + Math.random() * 10 - 5,
    livelihood: base + Math.random() * 10 - 5,
    capacity: base + Math.random() * 10 - 5,
    stability: base + Math.random() * 10 - 5,
    sustainability: base + Math.random() * 10 - 5,
  };
}

export function PortfolioStats({ countryCodes, countries }: PortfolioStatsProps) {
  const stats = useMemo(() => {
    if (countryCodes.length === 0) return null;

    // Calculate aggregated stats
    const realityScores = countryCodes.map(getSimulatedRealityIndex);
    const avgRealityIndex = realityScores.reduce((a, b) => a + b, 0) / realityScores.length;
    const minRI = Math.min(...realityScores);
    const maxRI = Math.max(...realityScores);

    // Aggregated domain scores
    const domainScores = countryCodes.map(getSimulatedDomainScores);
    const avgDomains = {
      vitality: domainScores.reduce((a, b) => a + b.vitality, 0) / domainScores.length,
      livelihood: domainScores.reduce((a, b) => a + b.livelihood, 0) / domainScores.length,
      capacity: domainScores.reduce((a, b) => a + b.capacity, 0) / domainScores.length,
      stability: domainScores.reduce((a, b) => a + b.stability, 0) / domainScores.length,
      sustainability: domainScores.reduce((a, b) => a + b.sustainability, 0) / domainScores.length,
    };

    // Population and GDP
    const totalPopulation = countries.reduce((sum, c) => sum + (c.population || 0), 0);
    const avgGDP = countries.reduce((sum, c) => sum + (c.gdp_per_capita || 0), 0) / countries.length;
    const avgDataQuality = countries.reduce((sum, c) => sum + (c.data_quality_score || 0), 0) / countries.length;

    return {
      avgRealityIndex,
      minRI,
      maxRI,
      spread: maxRI - minRI,
      avgDomains,
      totalPopulation,
      avgGDP,
      avgDataQuality,
    };
  }, [countryCodes, countries]);

  if (!stats) return null;

  const formatNumber = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toFixed(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Main Reality Index Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono">[RI] Reality Index - Portfölj</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-5xl font-bold", getScoreColor(stats.avgRealityIndex))}>
              {stats.avgRealityIndex.toFixed(1)}
            </span>
            <span className="text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Genomsnitt av {countryCodes.length} länder · 
            Spridning: {stats.minRI.toFixed(0)} – {stats.maxRI.toFixed(0)} (±{(stats.spread / 2).toFixed(0)})
          </div>
        </CardContent>
      </Card>

      {/* Domain scores */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { key: 'vitality', label: 'Vitalitet', marker: '[VIT]' },
          { key: 'livelihood', label: 'Försörjning', marker: '[FÖR]' },
          { key: 'capacity', label: 'Kapacitet', marker: '[KAP]' },
          { key: 'stability', label: 'Stabilitet', marker: '[STA]' },
          { key: 'sustainability', label: 'Hållbarhet', marker: '[HÅL]' },
        ].map(({ key, label, marker }) => {
          const score = stats.avgDomains[key as keyof typeof stats.avgDomains];
          return (
            <Card key={key} className="text-center">
              <CardContent className="pt-4 pb-3">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">
                  {marker}
                </div>
                <div className={cn("text-2xl font-bold", getScoreColor(score))}>
                  {score.toFixed(0)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">[POP] Total befolkning</div>
            <div className="text-2xl font-semibold">{formatNumber(stats.totalPopulation)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">[GDP] Snitt BNP/capita</div>
            <div className="text-2xl font-semibold">
              ${formatNumber(stats.avgGDP)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">[DQ] Datakvalitet</div>
            <div className="text-2xl font-semibold">
              {(stats.avgDataQuality * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
