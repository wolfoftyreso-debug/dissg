/**
 * PORTFOLIO COMPARISON
 * ═══════════════════════════════════════════════════════════════
 * 
 * Jämför portföljens statistik mot globalt/regionalt genomsnitt.
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Country {
  code: string;
  name: string;
  region?: string | null;
}

interface PortfolioComparisonProps {
  countryCodes: string[];
  countries: Country[];
}

// Simulated benchmarks
const GLOBAL_BENCHMARK = {
  vitality: 58,
  livelihood: 52,
  capacity: 55,
  stability: 60,
  sustainability: 48,
};

const OECD_BENCHMARK = {
  vitality: 78,
  livelihood: 72,
  capacity: 75,
  stability: 80,
  sustainability: 62,
};

function getSimulatedDomainScores(code: string) {
  const hash = code.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const base = 45 + (hash % 35);
  return {
    vitality: Math.min(100, base + (hash % 20)),
    livelihood: Math.min(100, base + ((hash * 2) % 20)),
    capacity: Math.min(100, base + ((hash * 3) % 20)),
    stability: Math.min(100, base + ((hash * 4) % 20)),
    sustainability: Math.min(100, base + ((hash * 5) % 20)),
  };
}

export function PortfolioComparison({ countryCodes, countries: _countries }: PortfolioComparisonProps) {
  const comparison = useMemo(() => {
    if (countryCodes.length === 0) return null;

    // Calculate portfolio averages
    const portfolioScores = countryCodes.map(getSimulatedDomainScores);
    const portfolio = {
      vitality: portfolioScores.reduce((a, b) => a + b.vitality, 0) / portfolioScores.length,
      livelihood: portfolioScores.reduce((a, b) => a + b.livelihood, 0) / portfolioScores.length,
      capacity: portfolioScores.reduce((a, b) => a + b.capacity, 0) / portfolioScores.length,
      stability: portfolioScores.reduce((a, b) => a + b.stability, 0) / portfolioScores.length,
      sustainability: portfolioScores.reduce((a, b) => a + b.sustainability, 0) / portfolioScores.length,
    };

    // Calculate differences
    const diffs = {
      vsGlobal: {
        vitality: portfolio.vitality - GLOBAL_BENCHMARK.vitality,
        livelihood: portfolio.livelihood - GLOBAL_BENCHMARK.livelihood,
        capacity: portfolio.capacity - GLOBAL_BENCHMARK.capacity,
        stability: portfolio.stability - GLOBAL_BENCHMARK.stability,
        sustainability: portfolio.sustainability - GLOBAL_BENCHMARK.sustainability,
      },
      vsOECD: {
        vitality: portfolio.vitality - OECD_BENCHMARK.vitality,
        livelihood: portfolio.livelihood - OECD_BENCHMARK.livelihood,
        capacity: portfolio.capacity - OECD_BENCHMARK.capacity,
        stability: portfolio.stability - OECD_BENCHMARK.stability,
        sustainability: portfolio.sustainability - OECD_BENCHMARK.sustainability,
      },
    };

    return { portfolio, diffs };
  }, [countryCodes]);

  if (!comparison) return null;

  // Radar chart data
  const radarData = [
    { domain: 'Vitalitet', portfolio: comparison.portfolio.vitality, global: GLOBAL_BENCHMARK.vitality, oecd: OECD_BENCHMARK.vitality },
    { domain: 'Försörjning', portfolio: comparison.portfolio.livelihood, global: GLOBAL_BENCHMARK.livelihood, oecd: OECD_BENCHMARK.livelihood },
    { domain: 'Kapacitet', portfolio: comparison.portfolio.capacity, global: GLOBAL_BENCHMARK.capacity, oecd: OECD_BENCHMARK.capacity },
    { domain: 'Stabilitet', portfolio: comparison.portfolio.stability, global: GLOBAL_BENCHMARK.stability, oecd: OECD_BENCHMARK.stability },
    { domain: 'Hållbarhet', portfolio: comparison.portfolio.sustainability, global: GLOBAL_BENCHMARK.sustainability, oecd: OECD_BENCHMARK.sustainability },
  ];

  const formatDiff = (diff: number) => {
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}`;
  };

  const getDiffColor = (diff: number) => {
    if (diff > 5) return 'text-emerald-600 dark:text-emerald-400';
    if (diff < -5) return 'text-red-600 dark:text-red-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="space-y-6">
      {/* Radar comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-mono">[⟷] Domänjämförelse</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="domain" 
                tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Portfölj"
                dataKey="portfolio"
                stroke="hsl(217, 91%, 60%)"
                fill="hsl(217, 91%, 60%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Globalt snitt"
                dataKey="global"
                stroke="hsl(var(--muted-foreground))"
                fill="none"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
              <Radar
                name="OECD snitt"
                dataKey="oecd"
                stroke="hsl(142, 76%, 36%)"
                fill="none"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Difference tables */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono">[⟷] vs Globalt snitt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(comparison.diffs.vsGlobal).map(([key, diff]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                <span className="text-sm capitalize">{key === 'vitality' ? 'Vitalitet' : key === 'livelihood' ? 'Försörjning' : key === 'capacity' ? 'Kapacitet' : key === 'stability' ? 'Stabilitet' : 'Hållbarhet'}</span>
                <span className={cn("font-mono text-sm", getDiffColor(diff))}>
                  {formatDiff(diff)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono">[⟷] vs OECD snitt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(comparison.diffs.vsOECD).map(([key, diff]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                <span className="text-sm capitalize">{key === 'vitality' ? 'Vitalitet' : key === 'livelihood' ? 'Försörjning' : key === 'capacity' ? 'Kapacitet' : key === 'stability' ? 'Stabilitet' : 'Hållbarhet'}</span>
                <span className={cn("font-mono text-sm", getDiffColor(diff))}>
                  {formatDiff(diff)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insight cards */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="text-xs font-mono text-muted-foreground mb-2">[!] Tolkning</div>
          <p className="text-sm text-muted-foreground">
            Din portfölj jämförs med globalt genomsnitt ({countryCodes.length === 1 ? 'ett land' : `${countryCodes.length} länder`}) 
            och OECD-snittet (38 utvecklade ekonomier). Positiva värden indikerar att portföljen 
            presterar bättre än referensgruppen. Negativa värden visar områden med förbättringspotential.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
