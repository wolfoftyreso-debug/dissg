/**
 * SECTION C: PEER COMPARISON
 * 
 * Similar countries, similar demographics, similar economy.
 * Implicitly answers: "Is this unique or normal?"
 * But the system NEVER says it.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface PeerData {
  code: string;
  name: string;
  value: number;
  rank?: number;
  deviation: number; // from group average
  groupAverage: number;
}

export interface ComparisonGroup {
  name: string;
  description: string;
  peers: PeerData[];
  subject: PeerData; // The entity being analyzed
  groupAverage: number;
}

export interface ComparisonData {
  indicator: string;
  unit: string;
  period: string;
  groups: ComparisonGroup[];
}

interface ComparisonSectionProps {
  data: ComparisonData;
  language: 'en' | 'sv';
}

export function ComparisonSection({ data, language }: ComparisonSectionProps) {
  return (
    <div className="space-y-6">
      {/* Indicator being compared */}
      <div className="text-xs text-muted-foreground font-mono">
        <span className="uppercase tracking-wider">
          {language === 'sv' ? 'Indikator' : 'Indicator'}:
        </span>{' '}
        <span className="text-foreground">{data.indicator}</span>{' '}
        <span>({data.unit})</span>{' '}
        <span>· {data.period}</span>
      </div>

      {data.groups.map((group, i) => (
        <ComparisonGroupCard 
          key={i}
          group={group}
          unit={data.unit}
          language={language}
        />
      ))}
    </div>
  );
}

function ComparisonGroupCard({
  group,
  unit,
  language,
}: {
  group: ComparisonGroup;
  unit: string;
  language: 'en' | 'sv';
}) {
  // Sort by value for visual ordering
  const sortedPeers = [...group.peers].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedPeers.map(p => p.value), group.subject.value);

  return (
    <Card className="border-border bg-background">
      <CardContent className="p-4">
        {/* Group Header */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground">
            {group.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {group.description}
          </p>
        </div>

        {/* Comparison bars */}
        <div className="space-y-2">
          {sortedPeers.map((peer) => {
            const isSubject = peer.code === group.subject.code;
            const width = (peer.value / maxValue) * 100;
            
            return (
              <div key={peer.code} className="flex items-center gap-3">
                {/* Country name */}
                <div className="w-24 flex-shrink-0">
                  <span className={`text-xs font-mono ${isSubject ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {peer.name}
                  </span>
                </div>
                
                {/* Bar */}
                <div className="flex-1 h-4 bg-muted/30 relative">
                  <div 
                    className={`h-full ${isSubject ? 'bg-foreground' : 'bg-muted-foreground/50'}`}
                    style={{ width: `${width}%` }}
                  />
                  {/* Group average marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-muted-foreground"
                    style={{ left: `${(group.groupAverage / maxValue) * 100}%` }}
                    title={language === 'sv' ? 'Gruppsnitt' : 'Group average'}
                  />
                </div>

                {/* Value */}
                <div className="w-20 flex-shrink-0 text-right">
                  <span className={`text-xs font-mono ${isSubject ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {peer.value.toLocaleString()}
                  </span>
                </div>

                {/* Deviation */}
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="text-xs font-mono text-muted-foreground">
                    {peer.deviation > 0 ? '+' : ''}{peer.deviation.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-foreground" />
              {language === 'sv' ? 'Analyserat' : 'Analyzed'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-muted-foreground/50" />
              {language === 'sv' ? 'Jämförelsegrupp' : 'Peer group'}
            </span>
          </div>
          <span>
            {language === 'sv' ? 'Gruppsnitt' : 'Group avg'}: {group.groupAverage.toLocaleString()} {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComparisonSection;
