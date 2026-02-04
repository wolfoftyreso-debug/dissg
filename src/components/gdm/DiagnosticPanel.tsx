/**
 * Diagnostic Side Panel
 * 
 * Shows detailed diagnostics when a country is selected.
 * Follows ODIS/VIDA guided diagnostic flow.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDiagnosticPanelData, getLambdaColor, getSystemStatus } from './mockData';
import type { GEDICodeSummary, ProbableCause, Lever } from './types';
import { ClickableCountryName } from '@/components/ui/ClickableCountryName';

interface DiagnosticPanelProps {
  countryCode: string;
  onClose: () => void;
  onSelectGEDI: (code: string) => void;
  isPro: boolean;
}

// Lambda gauge mini
function LambdaGaugeMini({ lambda, trend }: { lambda: number; trend: string }) {
  const color = getLambdaColor(lambda);
  const trendMarker = trend === 'improving' ? '[↑]' : trend === 'declining' ? '[↓]' : '[→]';
  
  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center flex-col"
        style={{ 
          background: `conic-gradient(${color} ${((lambda - 0.7) / 0.6) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
          border: `3px solid ${color}`,
        }}
      >
        <div className="text-xl font-mono font-bold text-white">{lambda.toFixed(2)}</div>
        <div className="text-[10px] text-muted-foreground">λ</div>
      </div>
      
      <div className="flex flex-col gap-1">
        <Badge 
          className="font-mono"
          style={{ backgroundColor: color, color: 'white' }}
        >
          {getSystemStatus(lambda).label.sv}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
          <span>{trendMarker}</span>
          <span>
            {trend === 'improving' ? 'Förbättras' : 
             trend === 'declining' ? 'Försämras' : 'Stabil'}
          </span>
        </div>
      </div>
    </div>
  );
}

// GEDI Code Card - with clear clickability
function GEDICodeCard({ 
  gedi, 
  onClick 
}: { 
  gedi: GEDICodeSummary; 
  onClick: () => void;
}) {
  const severityColors: Record<string, { bg: string; border: string; text: string }> = {
    INFO: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
    WARN: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' },
    MAJOR: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' },
    CRITICAL: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
  };
  
  const colors = severityColors[gedi.severity] || severityColors.WARN;
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-lg border-2 text-left transition-all cursor-pointer
        ${colors.bg} ${colors.border}
        hover:scale-[1.02] hover:shadow-lg hover:brightness-110
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge 
            className={`font-mono text-xs px-2 py-1 ${colors.text} bg-background/80 border ${colors.border}`}
          >
            {gedi.code}
          </Badge>
          <span className={`text-xs font-mono ${colors.text}`}>
            {gedi.status === 'ACTIVE' ? '● Aktiv' : '○ Historisk'}
          </span>
        </div>
        <span className="font-mono text-muted-foreground">[→]</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">{gedi.name}</div>
      <div className="text-xs text-muted-foreground mt-1">{gedi.description}</div>
    </button>
  );
}

// Probable Cause Card
function CauseCard({ cause }: { cause: ProbableCause }) {
  return (
    <div className="p-3 rounded-lg border border-muted bg-muted/20">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{cause.label.sv}</span>
        <Badge variant="secondary" className="font-mono">
          {cause.probability}%
        </Badge>
      </div>
      <Progress value={cause.probability} className="h-1 mt-2" />
      <div className="flex flex-wrap gap-1 mt-2">
        {cause.indicators.map(ind => (
          <Badge key={ind} variant="outline" className="text-[10px] font-mono">
            {ind}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Lever Card
function LeverCard({ lever, isPro }: { lever: Lever; isPro: boolean }) {
  const difficultyLabels = {
    low: { text: 'Enkel', color: 'text-green-400 border-green-500 bg-green-500/20' },
    medium: { text: 'Medel', color: 'text-amber-400 border-amber-500 bg-amber-500/20' },
    high: { text: 'Svår', color: 'text-red-400 border-red-500 bg-red-500/20' },
  };
  
  const diff = difficultyLabels[lever.difficulty];
  
  return (
    <div className={`p-3 rounded-lg border border-muted ${isPro ? 'bg-muted/20' : 'bg-muted/10 opacity-60'}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{lever.label.sv}</span>
        <div className="flex items-center gap-2">
          <Badge className={`font-mono text-[10px] border ${diff.color}`}>
            {diff.text}
          </Badge>
          <Badge variant="secondary" className="font-mono">
            +{(lever.impact * 100).toFixed(1)}%
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-mono">
        <span>[→]</span>
        <span>Påverkar: {lever.axis}</span>
      </div>
      {!isPro && (
        <div className="mt-2 text-xs text-amber-500 font-mono">
          [LÅS] PRO krävs för simulering
        </div>
      )}
    </div>
  );
}

export function DiagnosticPanel({ countryCode, onClose, onSelectGEDI, isPro }: DiagnosticPanelProps) {
  const data = getDiagnosticPanelData(countryCode);
  const [showAllCauses, setShowAllCauses] = useState(false);
  
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Data ej tillgänglig
      </div>
    );
  }

  const { geo, lambda, gediCodes, topCauses, topLevers, historicalLambda } = data;
  const visibleCauses = showAllCauses ? topCauses : topCauses.slice(0, 3);

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-md border-l">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClickableCountryName
              countryCode={geo.code}
              countryName={geo.name.sv}
              variant="default"
              className="text-2xl"
            />
            <Badge variant="outline" className="font-mono">{geo.code}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Pop: {geo.population?.toLocaleString()} • Konfidens: {lambda.confidence}%
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Lambda Gauge */}
          <div>
            <LambdaGaugeMini lambda={lambda.lambda} trend={lambda.trend} />
          </div>

          {/* Historical Chart */}
          <div>
            <div className="text-xs text-muted-foreground mb-2 font-mono">
              HISTORIK (25 år)
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalLambda}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 9 }} 
                    tickFormatter={(v) => v % 5 === 0 ? v : ''}
                  />
                  <YAxis 
                    domain={[0.6, 1.2]} 
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v) => v.toFixed(1)}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 11, background: 'rgba(0,0,0,0.8)', border: 'none' }}
                    formatter={(v: number) => [v.toFixed(3), 'λ']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getLambdaColor(lambda.lambda)} 
                    strokeWidth={2}
                    dot={false}
                  />
                  {/* Reference line at 1.0 */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 1.0} 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator />

          {/* GEDI Codes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-amber-500">[!]</span>
              <span className="text-xs text-muted-foreground font-mono">
                SYSTEM DIAGNOSTICS ({gediCodes.length} aktiva)
              </span>
            </div>
            
            {gediCodes.length > 0 ? (
              <div className="space-y-2">
                {gediCodes.map(gedi => (
                  <GEDICodeCard 
                    key={gedi.code} 
                    gedi={gedi} 
                    onClick={() => onSelectGEDI(gedi.code)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20 rounded-lg font-mono">
                [OK] Inga aktiva GEDI-koder
              </div>
            )}
          </div>

          <Separator />

          {/* Probable Causes */}
          <div>
            <div className="text-xs text-muted-foreground font-mono mb-3">
              SANNOLIKA ORSAKER (rankade)
            </div>
            <div className="space-y-2">
              {visibleCauses.map(cause => (
                <CauseCard key={cause.id} cause={cause} />
              ))}
            </div>
            {topCauses.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setShowAllCauses(!showAllCauses)}
              >
                {showAllCauses ? 'Visa färre' : `Visa alla (${topCauses.length})`}
              </Button>
            )}
          </div>

          <Separator />

          {/* Top Levers */}
          <div>
            <div className="text-xs text-muted-foreground font-mono mb-3">
              TOP HÄVSTÄNGER (vad påverkar mest)
            </div>
            <div className="space-y-2">
              {topLevers.map(lever => (
                <LeverCard key={lever.id} lever={lever} isPro={isPro} />
              ))}
              {topLevers.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20 rounded-lg">
                  Inga hävstänger identifierade
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t text-xs text-muted-foreground text-center">
        Klicka på GEDI-kod för guidad analys →
      </div>
    </div>
  );
}

export default DiagnosticPanel;
