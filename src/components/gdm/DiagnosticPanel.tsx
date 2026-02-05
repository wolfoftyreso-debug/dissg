/**
 * Diagnostic Side Panel
 * 
 * Shows detailed diagnostics when a country is selected.
 * Follows ODIS/VIDA guided diagnostic flow.
 * MYNDIGHETSDESIGN: Strikt, klinisk, dämpade färger.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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

// Lambda gauge mini - Myndighetsdesign
function LambdaGaugeMini({ lambda, trend }: { lambda: number; trend: string }) {
  const color = getLambdaColor(lambda);
  const trendMarker = trend === 'improving' ? '[↑]' : trend === 'declining' ? '[↓]' : '[→]';
  
  return (
    <div className="flex items-center gap-4 p-3 bg-slate-800/40 rounded-sm border border-slate-700/50">
      <div className="text-center">
        <div 
          className="text-2xl font-mono font-semibold"
          style={{ color }}
        >
          {lambda.toFixed(3)}
        </div>
        <div className="text-[9px] text-slate-500 uppercase tracking-wider">Lambda</div>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <Badge 
          variant="outline"
          className="font-mono text-[10px] rounded-sm border-slate-600 text-slate-300 bg-slate-800/50"
          style={{ borderLeftColor: color, borderLeftWidth: '2px' }}
        >
          {getSystemStatus(lambda).label.sv}
        </Badge>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
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

// GEDI Code Card - Myndighetsdesign
function GEDICodeCard({ 
  gedi, 
  onClick 
}: { 
  gedi: GEDICodeSummary; 
  onClick: () => void;
}) {
  // Dämpade severity-färger
  const severityStyles: Record<string, { marker: string; borderColor: string }> = {
    INFO: { marker: '[i]', borderColor: '#64748b' },
    WARN: { marker: '[~]', borderColor: '#78716c' },
    MAJOR: { marker: '[!]', borderColor: '#6b7280' },
    CRITICAL: { marker: '[!!]', borderColor: '#57534e' },
  };
  
  const style = severityStyles[gedi.severity] || severityStyles.WARN;
  
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-sm text-left transition-all cursor-pointer bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500"
      style={{ borderLeftWidth: '3px', borderLeftColor: style.borderColor }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-500">{style.marker}</span>
          <Badge 
            variant="outline"
            className="font-mono text-[10px] px-1.5 py-0 text-slate-400 border-slate-600 bg-slate-800/50 rounded-sm"
          >
            {gedi.code}
          </Badge>
          <span className="text-[10px] font-mono text-slate-500">
            {gedi.status === 'ACTIVE' ? 'Aktiv' : 'Historisk'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">[→]</span>
      </div>
      <div className="mt-1.5 text-xs font-medium text-slate-300">{gedi.name}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{gedi.description}</div>
    </button>
  );
}

// Probable Cause Card - Myndighetsdesign
function CauseCard({ cause }: { cause: ProbableCause }) {
  return (
    <div className="p-3 rounded-sm border border-slate-700/50 bg-slate-800/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{cause.label.sv}</span>
        <Badge variant="outline" className="font-mono text-[10px] text-slate-400 border-slate-600 rounded-sm">
          {cause.probability}%
        </Badge>
      </div>
      <Progress value={cause.probability} className="h-0.5 mt-2 bg-slate-700" />
      <div className="flex flex-wrap gap-1 mt-2">
        {cause.indicators.map(ind => (
          <Badge key={ind} variant="outline" className="text-[9px] font-mono text-slate-500 border-slate-700 rounded-sm">
            {ind}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Lever Card - Myndighetsdesign
function LeverCard({ lever, isPro }: { lever: Lever; isPro: boolean }) {
  const difficultyLabels = {
    low: { text: 'Enkel', marker: '[L]' },
    medium: { text: 'Medel', marker: '[M]' },
    high: { text: 'Svår', marker: '[H]' },
  };
  
  const diff = difficultyLabels[lever.difficulty];
  
  return (
    <div className={`p-3 rounded-sm border border-slate-700/50 ${isPro ? 'bg-slate-800/30' : 'bg-slate-800/15 opacity-50'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{lever.label.sv}</span>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[9px] text-slate-500 border-slate-700 rounded-sm">
            {diff.marker} {diff.text}
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px] text-slate-400 border-slate-600 rounded-sm">
            +{(lever.impact * 100).toFixed(1)}%
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
        <span>[→]</span>
        <span>Påverkar: {lever.axis}</span>
      </div>
      {!isPro && (
        <div className="mt-2 text-[10px] text-slate-500 font-mono">
          [PRO] Krävs för simulering
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
      <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm">
        [~] Data ej tillgänglig
      </div>
    );
  }

  const { geo, lambda, gediCodes, topCauses, topLevers, historicalLambda } = data;
  const visibleCauses = showAllCauses ? topCauses : topCauses.slice(0, 3);

  return (
    <div 
      className="h-full flex flex-col border-l"
      style={{ 
        background: 'rgba(15,23,42,0.95)', 
        borderColor: 'rgba(71,85,105,0.5)' 
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClickableCountryName
              countryCode={geo.code}
              countryName={geo.name.sv}
              variant="default"
              className="text-xl font-semibold text-slate-200"
            />
            <Badge variant="outline" className="font-mono text-[10px] text-slate-400 border-slate-600 rounded-sm">
              {geo.code}
            </Badge>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Pop: {geo.population?.toLocaleString()} | Konf: {lambda.confidence}%
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="font-mono text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
        >
          [x]
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Lambda Gauge */}
          <LambdaGaugeMini lambda={lambda.lambda} trend={lambda.trend} />

          {/* Historical Chart */}
          <div>
            <div className="text-[9px] text-slate-500 mb-2 font-mono uppercase tracking-wider">
              HISTORIK (25 år)
            </div>
            <div className="h-28 bg-slate-800/30 rounded-sm p-2 border border-slate-700/30">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalLambda}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.3)" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 8, fill: '#64748b' }} 
                    tickFormatter={(v) => v % 5 === 0 ? v : ''}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <YAxis 
                    domain={[0.6, 1.2]} 
                    tick={{ fontSize: 8, fill: '#64748b' }}
                    tickFormatter={(v) => v.toFixed(1)}
                    axisLine={{ stroke: '#475569' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 10, 
                      background: 'rgba(15,23,42,0.95)', 
                      border: '1px solid rgba(71,85,105,0.5)',
                      borderRadius: '2px'
                    }}
                    formatter={(v: number) => [v.toFixed(3), 'λ']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getLambdaColor(lambda.lambda)} 
                    strokeWidth={1.5}
                    dot={false}
                  />
                  {/* Reference line at 1.0 */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 1.0} 
                    stroke="rgba(100,116,139,0.4)" 
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator className="bg-slate-700/30" />

          {/* GEDI Codes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] text-slate-500">[DIAG]</span>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                Systemdiagnostik ({gediCodes.length})
              </span>
            </div>
            
            {gediCodes.length > 0 ? (
              <div className="space-y-1.5">
                {gediCodes.map(gedi => (
                  <GEDICodeCard 
                    key={gedi.code} 
                    gedi={gedi} 
                    onClick={() => onSelectGEDI(gedi.code)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-[10px] text-slate-500 bg-slate-800/30 rounded-sm font-mono border border-slate-700/30">
                [OK] Inga aktiva GEDI-koder
              </div>
            )}
          </div>

          <Separator className="bg-slate-700/30" />

          {/* Probable Causes */}
          <div>
            <div className="text-[9px] text-slate-500 font-mono mb-2 uppercase tracking-wider">
              Sannolika orsaker
            </div>
            <div className="space-y-1.5">
              {visibleCauses.map(cause => (
                <CauseCard key={cause.id} cause={cause} />
              ))}
            </div>
            {topCauses.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                onClick={() => setShowAllCauses(!showAllCauses)}
              >
                {showAllCauses ? 'Visa färre' : `Visa alla (${topCauses.length})`}
              </Button>
            )}
          </div>

          <Separator className="bg-slate-700/30" />

          {/* Top Levers */}
          <div>
            <div className="text-[9px] text-slate-500 font-mono mb-2 uppercase tracking-wider">
              Hävstänger
            </div>
            <div className="space-y-1.5">
              {topLevers.map(lever => (
                <LeverCard key={lever.id} lever={lever} isPro={isPro} />
              ))}
              {topLevers.length === 0 && (
                <div className="p-3 text-center text-[10px] text-slate-500 bg-slate-800/30 rounded-sm border border-slate-700/30">
                  [~] Inga hävstänger identifierade
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700/30 text-[9px] text-slate-500 text-center font-mono">
        Klicka GEDI-kod för guidad analys [→]
      </div>
    </div>
  );
}

export default DiagnosticPanel;
