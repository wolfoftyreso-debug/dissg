/**
 * PORTFOLIO DOMAIN CHART
 * ═══════════════════════════════════════════════════════════════
 * 
 * Visar domänpoäng per land i portföljen.
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Country {
  code: string;
  name: string;
}

interface PortfolioDomainChartProps {
  countryCodes: string[];
  countries: Country[];
}

// Simulated domain scores
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

const DOMAIN_COLORS = {
  vitality: 'hsl(142, 76%, 36%)',
  livelihood: 'hsl(48, 96%, 53%)',
  capacity: 'hsl(217, 91%, 60%)',
  stability: 'hsl(280, 65%, 60%)',
  sustainability: 'hsl(173, 80%, 40%)',
};

export function PortfolioDomainChart({ countryCodes, countries }: PortfolioDomainChartProps) {
  const chartData = useMemo(() => {
    const countryMap = new Map(countries.map((c) => [c.code, c]));
    
    return countryCodes.map((code) => {
      const country = countryMap.get(code);
      const scores = getSimulatedDomainScores(code);
      return {
        code,
        name: country?.name || code,
        ...scores,
      };
    });
  }, [countryCodes, countries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-mono">[DOM] Domänpoäng per land</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="vitality" name="[VIT] Vitalitet" fill={DOMAIN_COLORS.vitality} />
            <Bar dataKey="livelihood" name="[FÖR] Försörjning" fill={DOMAIN_COLORS.livelihood} />
            <Bar dataKey="capacity" name="[KAP] Kapacitet" fill={DOMAIN_COLORS.capacity} />
            <Bar dataKey="stability" name="[STA] Stabilitet" fill={DOMAIN_COLORS.stability} />
            <Bar dataKey="sustainability" name="[HÅL] Hållbarhet" fill={DOMAIN_COLORS.sustainability} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
