/**
 * Diagnostic Side Panel
 * 
 * Shows detailed diagnostics when a country is selected.
 * Follows ODIS/VIDA guided diagnostic flow.
 * MYNDIGHETSDESIGN: Strikt, klinisk, dämpade färger.
 * 
 * @semantic Proper article/section structure
 * @a11y Complete keyboard navigation and screen reader support
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
  const trendMarker = trend === 'improving' ? '[UP]' : trend === 'declining' ? '[DN]' : '[ST]';
  const trendLabel = trend === 'improving' ? 'Förbättras' : trend === 'declining' ? 'Försämras' : 'Stabil';
  
  return (
    <article 
      className="flex items-center gap-4 p-3 bg-slate-800/40 rounded-sm border border-slate-700/50"
      aria-label="Lambda-status"
    >
      <div className="text-center">
        <output 
          className="text-2xl font-mono font-semibold block"
          style={{ color }}
          aria-label={`Lambda-värde: ${lambda.toFixed(3)}`}
        >
          {lambda.toFixed(3)}
        </output>
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Lambda</span>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <Badge 
          variant="outline"
          className="font-mono text-[10px] rounded-sm border-slate-600 text-slate-300 bg-slate-800/50"
          style={{ borderLeftColor: color, borderLeftWidth: '2px' }}
        >
          {getSystemStatus(lambda).label.sv}
        </Badge>
        <div 
          className="flex items-center gap-1 text-[10px] text-slate-500 font-mono"
          aria-label={`Trend: ${trendLabel}`}
        >
          <span aria-hidden="true">{trendMarker}</span>
          <span>{trendLabel}</span>
        </div>
      </div>
    </article>
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
  const severityStyles: Record<string, { marker: string; borderColor: string; label: string }> = {
    INFO: { marker: '[i]', borderColor: 'hsl(215 16.3% 46.9%)', label: 'Information' },
    WARN: { marker: '[~]', borderColor: 'hsl(30 6.1% 44.7%)', label: 'Varning' },
    MAJOR: { marker: '[!]', borderColor: 'hsl(220 8.9% 46.1%)', label: 'Major' },
    CRITICAL: { marker: '[!!]', borderColor: 'hsl(25 5.3% 32.9%)', label: 'Kritisk' },
  };
  
  const style = severityStyles[gedi.severity] || severityStyles.WARN;
  
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-sm text-left transition-all cursor-pointer bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500"
      style={{ borderLeftWidth: '3px', borderLeftColor: style.borderColor }}
      aria-label={`${gedi.code}: ${gedi.name}. Allvarlighetsgrad: ${style.label}. Status: ${gedi.status === 'ACTIVE' ? 'Aktiv' : 'Historisk'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-500" aria-hidden="true">{style.marker}</span>
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
        <span className="font-mono text-[10px] text-slate-500" aria-hidden="true">[GO]</span>
      </div>
      <div className="mt-1.5 text-xs font-medium text-slate-300">{gedi.name}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{gedi.description}</div>
    </button>
  );
}

// Probable Cause Card - Myndighetsdesign
function CauseCard({ cause }: { cause: ProbableCause }) {
  return (
    <article 
      className="p-3 rounded-sm border border-slate-700/50 bg-slate-800/30"
      aria-labelledby={`cause-${cause.id}`}
    >
      <div className="flex items-center justify-between">
        <h4 id={`cause-${cause.id}`} className="text-xs font-medium text-slate-300">
          {cause.label.sv}
        </h4>
        <Badge 
          variant="outline" 
          className="font-mono text-[10px] text-slate-400 border-slate-600 rounded-sm"
          aria-label={`Sannolikhet: ${cause.probability} procent`}
        >
          {cause.probability}%
        </Badge>
      </div>
      <Progress 
        value={cause.probability} 
        className="h-0.5 mt-2 bg-slate-700" 
        aria-hidden="true"
      />
      <ul className="flex flex-wrap gap-1 mt-2" aria-label="Relaterade indikatorer">
        {cause.indicators.map(ind => (
          <li key={ind}>
            <Badge variant="outline" className="text-[9px] font-mono text-slate-500 border-slate-700 rounded-sm">
              {ind}
            </Badge>
          </li>
        ))}
      </ul>
    </article>
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
    <article 
      className={`p-3 rounded-sm border border-slate-700/50 ${isPro ? 'bg-slate-800/30' : 'bg-slate-800/15 opacity-50'}`}
      aria-labelledby={`lever-${lever.id}`}
      aria-disabled={!isPro}
    >
      <div className="flex items-center justify-between">
        <h4 id={`lever-${lever.id}`} className="text-xs font-medium text-slate-300">
          {lever.label.sv}
        </h4>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="font-mono text-[9px] text-slate-500 border-slate-700 rounded-sm"
            aria-label={`Svårighetsgrad: ${diff.text}`}
          >
            {diff.marker} {diff.text}
          </Badge>
          <Badge 
            variant="outline" 
            className="font-mono text-[10px] text-slate-400 border-slate-600 rounded-sm"
            aria-label={`Förväntad påverkan: plus ${(lever.impact * 100).toFixed(1)} procent`}
          >
            +{(lever.impact * 100).toFixed(1)}%
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
        <span aria-hidden="true">[AX]</span>
        <span>Påverkar: {lever.axis}</span>
      </div>
      {!isPro && (
        <p className="mt-2 text-[10px] text-slate-500 font-mono">
          [PRO] Krävs för simulering
        </p>
      )}
    </article>
  );
}

export function DiagnosticPanel({ countryCode, onClose, onSelectGEDI, isPro }: DiagnosticPanelProps) {
  const data = getDiagnosticPanelData(countryCode);
  const [showAllCauses, setShowAllCauses] = useState(false);
  
  if (!data) {
    return (
      <div 
        className="h-full flex items-center justify-center text-slate-500 font-mono text-sm"
        role="status"
      >
        [~] Data ej tillgänglig
      </div>
    );
  }

  const { geo, lambda, gediCodes, topCauses, topLevers, historicalLambda } = data;
  const visibleCauses = showAllCauses ? topCauses : topCauses.slice(0, 3);

  return (
    <article 
      className="h-full flex flex-col border-l"
      style={{ 
        background: 'hsl(222.2 84% 4.9% / 0.95)', 
        borderColor: 'hsl(215 20.2% 35% / 0.5)' 
      }}
      aria-labelledby="diagnostic-panel-heading"
    >
      {/* Header */}
      <header className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="diagnostic-panel-heading">
              <ClickableCountryName
                countryCode={geo.code}
                countryName={geo.name.sv}
                variant="default"
                className="text-xl font-semibold text-slate-200"
              />
            </h2>
            <Badge variant="outline" className="font-mono text-[10px] text-slate-400 border-slate-600 rounded-sm">
              {geo.code}
            </Badge>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            Pop: {geo.population?.toLocaleString()} | Konf: {lambda.confidence}%
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="font-mono text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
          aria-label="Stäng diagnostikpanel"
        >
          [CLOSE]
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Lambda Gauge */}
          <section aria-label="Lambda-status">
            <LambdaGaugeMini lambda={lambda.lambda} trend={lambda.trend} />
          </section>

          {/* Historical Chart */}
          <section aria-labelledby="historical-heading">
            <h3 
              id="historical-heading"
              className="text-[9px] text-slate-500 mb-2 font-mono uppercase tracking-wider"
            >
              HISTORIK (25 år)
            </h3>
            <div 
              className="h-28 bg-slate-800/30 rounded-sm p-2 border border-slate-700/30"
              role="img"
              aria-label="Linjediagram som visar Lambda-värden över 25 år"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalLambda}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20.2% 35% / 0.3)" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 8, fill: 'hsl(215 16.3% 46.9%)' }} 
                    tickFormatter={(v) => v % 5 === 0 ? v : ''}
                    axisLine={{ stroke: 'hsl(215 20.2% 35%)' }}
                  />
                  <YAxis 
                    domain={[0.6, 1.2]} 
                    tick={{ fontSize: 8, fill: 'hsl(215 16.3% 46.9%)' }}
                    tickFormatter={(v) => v.toFixed(1)}
                    axisLine={{ stroke: 'hsl(215 20.2% 35%)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 10, 
                      background: 'hsl(222.2 84% 4.9% / 0.95)', 
                      border: '1px solid hsl(215 20.2% 35% / 0.5)',
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
                    stroke="hsl(215 20.2% 45% / 0.4)" 
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <Separator className="bg-slate-700/30" />

          {/* GEDI Codes */}
          <section aria-labelledby="gedi-heading">
            <header className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] text-slate-500" aria-hidden="true">[DIAG]</span>
              <h3 
                id="gedi-heading"
                className="text-[9px] text-slate-500 font-mono uppercase tracking-wider"
              >
                Systemdiagnostik ({gediCodes.length})
              </h3>
            </header>
            
            {gediCodes.length > 0 ? (
              <ul className="space-y-1.5" aria-label="GEDI-felkoder">
                {gediCodes.map(gedi => (
                  <li key={gedi.code}>
                    <GEDICodeCard 
                      gedi={gedi} 
                      onClick={() => onSelectGEDI(gedi.code)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p 
                className="p-3 text-center text-[10px] text-slate-500 bg-slate-800/30 rounded-sm font-mono border border-slate-700/30"
                role="status"
              >
                [OK] Inga aktiva GEDI-koder
              </p>
            )}
          </section>

          <Separator className="bg-slate-700/30" />

          {/* Probable Causes */}
          <section aria-labelledby="causes-heading">
            <h3 
              id="causes-heading"
              className="text-[9px] text-slate-500 font-mono mb-2 uppercase tracking-wider"
            >
              Sannolika orsaker
            </h3>
            <ul className="space-y-1.5">
              {visibleCauses.map(cause => (
                <li key={cause.id}>
                  <CauseCard cause={cause} />
                </li>
              ))}
            </ul>
            {topCauses.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                onClick={() => setShowAllCauses(!showAllCauses)}
                aria-expanded={showAllCauses}
              >
                {showAllCauses ? 'Visa färre' : `Visa alla (${topCauses.length})`}
              </Button>
            )}
          </section>

          <Separator className="bg-slate-700/30" />

          {/* Top Levers */}
          <section aria-labelledby="levers-heading">
            <h3 
              id="levers-heading"
              className="text-[9px] text-slate-500 font-mono mb-2 uppercase tracking-wider"
            >
              Hävstänger
            </h3>
            {topLevers.length > 0 ? (
              <ul className="space-y-1.5">
                {topLevers.map(lever => (
                  <li key={lever.id}>
                    <LeverCard lever={lever} isPro={isPro} />
                  </li>
                ))}
              </ul>
            ) : (
              <p 
                className="p-3 text-center text-[10px] text-slate-500 bg-slate-800/30 rounded-sm border border-slate-700/30"
                role="status"
              >
                [~] Inga hävstänger identifierade
              </p>
            )}
          </section>
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="p-3 border-t border-slate-700/30 text-[9px] text-slate-500 text-center font-mono">
        Klicka GEDI-kod för guidad analys [GO]
      </footer>
    </article>
  );
}

export default DiagnosticPanel;
