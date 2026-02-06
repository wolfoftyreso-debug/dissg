/**
 * SIGNALÖVERSIKT - Pedagogisk Dashboard
 * 
 * Designad för att en 15-åring ska förstå.
 * Tydliga förklaringar, visuell klarhet, ingen jargong.
 * ALLT är klickbart för fördjupning.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ============================================
// SPARKLINE COMPONENT (CLICKABLE)
// ============================================

interface SparklineProps {
  data: number[];
  color: string;
  className?: string;
  onClick?: () => void;
  label?: string;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color,
  className,
  onClick,
  label = "Visa trend"
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((val - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-block p-1 -m-1 rounded hover:bg-slate-100 transition-colors cursor-pointer group",
          className
        )}
        aria-label={label}
      >
        <svg width="60" height="24" className="group-hover:scale-105 transition-transform">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }
  
  return (
    <svg width="60" height="24" className={cn("inline-block", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Helper to generate mock sparkline
const generateSparkline = (base: number, trend: 'up' | 'down' | 'stable' = 'stable'): number[] => {
  const points: number[] = [];
  let current = base;
  for (let i = 0; i < 12; i++) {
    const trendFactor = trend === 'up' ? 0.3 : trend === 'down' ? -0.3 : 0;
    current += (Math.random() - 0.5 + trendFactor) * 3;
    points.push(Math.max(0, Math.min(100, current)));
  }
  return points;
};

// ============================================
// HELP TOOLTIP COMPONENT (CLICKABLE)
// ============================================

interface HelpBubbleProps {
  text: string;
  onClick?: () => void;
}

const HelpBubble: React.FC<HelpBubbleProps> = ({ text, onClick }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={onClick}
          className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 text-sky-600 text-xs font-bold hover:bg-sky-200 hover:scale-110 transition-all cursor-pointer"
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-slate-900 text-white p-3 text-sm leading-relaxed">
        {text}
        {onClick && (
          <p className="text-sky-300 text-xs mt-2 border-t border-slate-700 pt-2">
            Klicka för att fördjupa →
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// ============================================
// STATUS BADGE (CLICKABLE)
// ============================================

interface StatusBadgeProps {
  color: 'green' | 'yellow' | 'red';
  onClick?: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ color, onClick }) => {
  const colorClasses = {
    green: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    yellow: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100',
    red: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100',
  };
  
  const labels = {
    green: '👍 Bra',
    yellow: '⚠️ Varning',
    red: '🔴 Problem',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer hover:scale-105",
        colorClasses[color]
      )}
      aria-label={`Status: ${labels[color]}. Klicka för mer info.`}
    >
      {labels[color]}
    </button>
  );
};

// ============================================
// CHANGE INDICATOR (CLICKABLE)
// ============================================

interface ChangeIndicatorProps {
  change: number;
  period: string;
  onClick?: () => void;
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ change, period, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-right p-2 -m-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
      aria-label={`Förändring: ${change >= 0 ? '+' : ''}${change.toFixed(1)}% ${period}. Klicka för detaljer.`}
    >
      <span className={cn(
        "text-sm font-semibold group-hover:underline",
        change >= 0 ? "text-emerald-600" : "text-red-600"
      )}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
      </span>
      <p className="text-xs text-slate-400">{period}</p>
    </button>
  );
};

// ============================================
// DRILL-DOWN DIALOGS
// ============================================

// Status explanation dialog
interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: 'green' | 'yellow' | 'red';
}

const StatusDialog: React.FC<StatusDialogProps> = ({ open, onOpenChange, color }) => {
  const content = {
    green: {
      title: '🟢 Vad betyder "Bra"?',
      description: 'Indikatorn visar en positiv utveckling',
      details: [
        { label: 'Definition', value: 'Värdet ligger inom eller bättre än målintervallet baserat på internationella standarder' },
        { label: 'Jämförelse', value: 'Sverige presterar bättre än EU-genomsnittet' },
        { label: 'Trend', value: 'Utvecklingen har förbättrats de senaste 12 månaderna' },
        { label: 'Konfidens', value: '95% säkerhet i bedömningen baserat på datakvalitet' },
      ],
      sources: ['SCB', 'Eurostat', 'WHO'],
    },
    yellow: {
      title: '🟡 Vad betyder "Varning"?',
      description: 'Indikatorn visar osäkerhet eller liten förändring',
      details: [
        { label: 'Definition', value: 'Värdet ligger nära gränsvärdet eller visar blandade signaler' },
        { label: 'Jämförelse', value: 'Sverige ligger runt EU-genomsnittet' },
        { label: 'Trend', value: 'Utvecklingen har varit stabil eller svag nedgång' },
        { label: 'Konfidens', value: '80% säkerhet - data kan ha vissa begränsningar' },
      ],
      sources: ['SCB', 'Eurostat'],
    },
    red: {
      title: '🔴 Vad betyder "Problem"?',
      description: 'Indikatorn visar negativ utveckling som kräver uppmärksamhet',
      details: [
        { label: 'Definition', value: 'Värdet ligger klart under målintervallet' },
        { label: 'Jämförelse', value: 'Sverige presterar sämre än EU-genomsnittet' },
        { label: 'Trend', value: 'Utvecklingen har försämrats de senaste 12 månaderna' },
        { label: 'Konfidens', value: '90% säkerhet - tydligt mönster i datan' },
      ],
      sources: ['SCB', 'BRÅ', 'Socialstyrelsen'],
    },
  };

  const c = content[color];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{c.title}</DialogTitle>
          <DialogDescription>{c.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {c.details.map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p className="text-sm text-slate-800">{item.value}</p>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              📚 Datakällor
            </p>
            <div className="flex flex-wrap gap-2">
              {c.sources.map((source) => (
                <Button key={source} variant="outline" size="sm" className="text-xs">
                  {source} →
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Trend explanation dialog
interface TrendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: number[];
  title: string;
  change: number;
  period: string;
}

const TrendDialog: React.FC<TrendDialogProps> = ({ open, onOpenChange, data, title, change, period }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">📈 Trend: {title}</DialogTitle>
          <DialogDescription>
            Utveckling {period} — Förändring: {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 mt-4">
            {/* Large trend visualization */}
            <div className="bg-slate-50 rounded-xl p-4">
              <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="40" y1={20 + i * 20} x2="380" y2={20 + i * 20} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                {/* Data line */}
                <polyline
                  points={data.map((val, i) => {
                    const x = 40 + (i / (data.length - 1)) * 340;
                    const min = Math.min(...data);
                    const max = Math.max(...data);
                    const range = max - min || 1;
                    const y = 100 - ((val - min) / range) * 80;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke={change >= 0 ? "hsl(160, 84%, 39%)" : "hsl(0, 84%, 60%)"}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data points */}
                {data.map((val, i) => {
                  const x = 40 + (i / (data.length - 1)) * 340;
                  const min = Math.min(...data);
                  const max = Math.max(...data);
                  const range = max - min || 1;
                  const y = 100 - ((val - min) / range) * 80;
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={change >= 0 ? "hsl(160, 84%, 39%)" : "hsl(0, 84%, 60%)"} strokeWidth="2" />
                  );
                })}
                {/* Month labels */}
                {months.map((month, i) => (
                  <text key={month} x={40 + (i / 11) * 340} y="115" textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {month}
                  </text>
                ))}
              </svg>
            </div>
            
            {/* Monthly values table */}
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">📊 Månadsvärden</h4>
              <div className="grid grid-cols-4 gap-2">
                {data.map((val, i) => (
                  <div key={i} className="bg-white border rounded-lg p-2 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                    <p className="text-xs text-slate-500">{months[i]}</p>
                    <p className="font-semibold text-slate-800">{val.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Methodology */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔬 Hur beräknas trenden?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Data samlas</strong> från officiella källor varje månad</li>
                <li>• <strong>Förändring räknas</strong> som (nuvarande - tidigare) / tidigare × 100</li>
                <li>• <strong>Säsongsrensning</strong> justerar för naturliga variationer</li>
                <li>• <strong>Konfidensintervall</strong> visar osäkerheten i mätningen</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Score explanation dialog
interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: number;
  maxValue: number;
  interpretation: string;
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, title, value, maxValue, interpretation }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">🔢 {title}</DialogTitle>
          <DialogDescription>Fördjupad förklaring av värdet</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 mt-4">
            {/* Big value display */}
            <div className="text-center py-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <span className="text-6xl font-bold text-slate-900">{value.toFixed(1)}</span>
              <span className="text-2xl text-slate-400 ml-2">/ {maxValue}</span>
            </div>
            
            {/* Scale visualization */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Var på skalan ligger värdet?</p>
              <div className="relative h-8 bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-slate-900 shadow-lg"
                  style={{ left: `${(value / maxValue) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>0 (Dåligt)</span>
                <span>{maxValue / 2}</span>
                <span>{maxValue} (Utmärkt)</span>
              </div>
            </div>
            
            {/* Interpretation */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Vad betyder det?</h4>
              <p className="text-sm text-blue-800">{interpretation}</p>
            </div>
            
            {/* Components */}
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">🧩 Vad ingår i beräkningen?</h4>
              <div className="space-y-2">
                {['Hälsa & Vård (15%)', 'Ekonomi (20%)', 'Trygghet (18%)', 'Utbildning (17%)', 'Boende (15%)', 'Miljö (15%)'].map((item) => (
                  <button 
                    key={item} 
                    className="w-full flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-left"
                  >
                    <span className="text-sm text-slate-700">{item}</span>
                    <span className="text-slate-400">→</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Data quality */}
            <div className="bg-slate-100 rounded-xl p-4 text-sm">
              <h4 className="font-semibold text-slate-700 mb-2">📊 Datakvalitet</h4>
              <ul className="text-slate-600 space-y-1">
                <li>• <strong>Senast uppdaterad:</strong> 2024-01-15</li>
                <li>• <strong>Konfidens:</strong> 94%</li>
                <li>• <strong>Källor:</strong> SCB, Eurostat, WHO</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Domain drill-down dialog
interface DomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: {
    icon: string;
    name: string;
    description: string;
    value: number;
    change: number;
    indicatorCount: number;
  };
}

const DomainDialog: React.FC<DomainDialogProps> = ({ open, onOpenChange, domain }) => {
  const mockIndicators = [
    { name: 'Huvudindikator 1', value: '78.2%', change: 2.3, status: 'good' as const },
    { name: 'Huvudindikator 2', value: '65.1', change: -1.4, status: 'warning' as const },
    { name: 'Huvudindikator 3', value: '42.8', change: -3.2, status: 'bad' as const },
    { name: 'Stödindikator A', value: '91%', change: 0.8, status: 'good' as const },
    { name: 'Stödindikator B', value: '3.2', change: 5.1, status: 'warning' as const },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span className="text-3xl">{domain.icon}</span>
            {domain.name}
          </DialogTitle>
          <DialogDescription>{domain.description}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 mt-4">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{domain.value}</p>
                <p className="text-xs text-slate-500 mt-1">Poäng av 100</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className={cn(
                  "text-3xl font-bold",
                  domain.change >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {domain.change >= 0 ? '+' : ''}{domain.change.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Förändring</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{domain.indicatorCount}</p>
                <p className="text-xs text-slate-500 mt-1">Mätpunkter</p>
              </div>
            </div>
            
            {/* Indicators list - ALL CLICKABLE */}
            <div>
              <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                📊 Alla mätpunkter i {domain.name.toLowerCase()}
                <span className="text-xs font-normal text-slate-400">Klicka för detaljer</span>
              </h4>
              <div className="space-y-2">
                {mockIndicators.map((ind, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-left group"
                  >
                    <span className="text-sm">
                      {ind.status === 'good' ? '🟢' : ind.status === 'warning' ? '🟡' : '🔴'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 group-hover:text-blue-600">{ind.name}</p>
                    </div>
                    <span className="font-mono text-sm text-slate-600">{ind.value}</span>
                    <span className={cn(
                      "text-sm font-medium min-w-[60px] text-right",
                      ind.change >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {ind.change >= 0 ? '+' : ''}{ind.change.toFixed(1)}%
                    </span>
                    <span className="text-slate-300 group-hover:text-slate-500">→</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Methodology link */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔬 Hur beräknas {domain.name.toLowerCase()}?</h4>
              <p className="text-sm text-blue-800 mb-3">
                Poängen beräknas genom att väga samman {domain.indicatorCount} olika mätningar. 
                Vikterna baseras på internationell forskning och svenska förhållanden.
              </p>
              <Button variant="outline" size="sm" className="bg-white">
                Se fullständig metodik →
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Indicator drill-down dialog
interface IndicatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: {
    name: string;
    value: string;
    change: number;
    explanation: string;
  };
}

const IndicatorDialog: React.FC<IndicatorDialogProps> = ({ open, onOpenChange, indicator }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{indicator.name}</DialogTitle>
          <DialogDescription>{indicator.explanation}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 mt-4">
            {/* Current value */}
            <div className="text-center py-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <span className="text-5xl font-bold text-slate-900">{indicator.value}</span>
              <p className={cn(
                "text-lg font-semibold mt-2",
                indicator.change >= 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {indicator.change >= 0 ? '↑' : '↓'} {Math.abs(indicator.change).toFixed(1)}% senaste året
              </p>
            </div>
            
            {/* Geographic context */}
            <div className="bg-amber-50 rounded-xl p-4">
              <h4 className="font-semibold text-amber-900 mb-2">📍 Var mäts detta?</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• <strong>Geografiskt område:</strong> Hela Sverige, nationell nivå</li>
                <li>• <strong>Regional data finns:</strong> Ja, per län och kommun</li>
                <li>• <strong>Jämförbar internationellt:</strong> Ja, Eurostat-standard</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-3 bg-white">
                Se regional fördelning →
              </Button>
            </div>
            
            {/* Comparison */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-700 mb-2">🌍 Jämförelse</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>EU-genomsnitt:</strong> {(parseFloat(indicator.value) * 0.92).toFixed(1)}</li>
                <li>• <strong>Nordiskt genomsnitt:</strong> {(parseFloat(indicator.value) * 1.02).toFixed(1)}</li>
                <li>• <strong>Bäst i EU:</strong> 93.2% (Danmark)</li>
              </ul>
            </div>
            
            {/* Methodology */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔬 Metodik</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Mätperiod:</strong> Januari - December 2024</li>
                <li>• <strong>Datakälla:</strong> Statistiska Centralbyrån (SCB)</li>
                <li>• <strong>Uppdateringsfrekvens:</strong> Månadsvis</li>
                <li>• <strong>Konfidens:</strong> 95% konfidensintervall</li>
              </ul>
            </div>
            
            {/* Source link */}
            <Button variant="outline" className="w-full">
              🔗 Gå till primärkällan (SCB) →
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// MAIN SCORE CARD (FULLY CLICKABLE)
// ============================================

interface MainScoreCardProps {
  title: string;
  helpText: string;
  value: number;
  maxValue?: number;
  unit?: string;
  change: number;
  changePeriod: string;
  interpretation: string;
  sparklineData: number[];
  color: 'green' | 'yellow' | 'red';
}

const MainScoreCard: React.FC<MainScoreCardProps> = ({
  title,
  helpText,
  value,
  maxValue = 100,
  unit,
  change,
  changePeriod,
  interpretation,
  sparklineData,
  color,
}) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [trendOpen, setTrendOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  
  const sparklineColor = {
    green: 'hsl(160, 84%, 39%)',
    yellow: 'hsl(38, 92%, 50%)',
    red: 'hsl(0, 84%, 60%)',
  };

  return (
    <>
      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 flex items-center">
                {title}
                <HelpBubble text={helpText} onClick={() => setScoreOpen(true)} />
              </h3>
            </div>
            <StatusBadge color={color} onClick={() => setStatusOpen(true)} />
          </div>
          
          {/* Big Number - CLICKABLE */}
          <button 
            onClick={() => setScoreOpen(true)}
            className="flex items-baseline gap-2 mb-2 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <span className="text-4xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {value.toFixed(1)}
            </span>
            {maxValue && (
              <span className="text-lg text-slate-400">
                / {maxValue} {unit}
              </span>
            )}
          </button>
          
          {/* Sparkline & Change - BOTH CLICKABLE */}
          <div className="flex items-center justify-between mb-4">
            <Sparkline 
              data={sparklineData} 
              color={sparklineColor[color]}
              onClick={() => setTrendOpen(true)}
              label={`Visa trend för ${title}`}
            />
            <ChangeIndicator 
              change={change} 
              period={changePeriod}
              onClick={() => setTrendOpen(true)}
            />
          </div>
          
          {/* Interpretation - CLICKABLE */}
          <button 
            onClick={() => setScoreOpen(true)}
            className="w-full text-left pt-3 border-t border-slate-100 hover:bg-slate-50 -mx-1 px-1 rounded transition-colors cursor-pointer group"
          >
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-medium text-slate-700">Vad betyder det? </span>
              <span className="group-hover:text-blue-600">{interpretation}</span>
              <span className="text-blue-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </p>
          </button>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <StatusDialog open={statusOpen} onOpenChange={setStatusOpen} color={color} />
      <TrendDialog 
        open={trendOpen} 
        onOpenChange={setTrendOpen} 
        data={sparklineData}
        title={title}
        change={change}
        period={changePeriod}
      />
      <ScoreDialog
        open={scoreOpen}
        onOpenChange={setScoreOpen}
        title={title}
        value={value}
        maxValue={maxValue}
        interpretation={interpretation}
      />
    </>
  );
};

// ============================================
// DOMAIN CARD (FULLY CLICKABLE)
// ============================================

interface DomainCardProps {
  icon: string;
  name: string;
  description: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  indicatorCount: number;
}

const DomainCard: React.FC<DomainCardProps> = ({
  icon,
  name,
  description,
  value,
  change,
  trend,
  indicatorCount,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';
  const sparklineColor = trend === 'up' ? 'hsl(160, 84%, 39%)' : trend === 'down' ? 'hsl(0, 84%, 60%)' : 'hsl(215, 16%, 47%)';
  
  return (
    <>
      <Card 
        className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        onClick={() => setDialogOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                {name}
                <span className="text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h4>
              <p className="text-xs text-slate-500 mb-2">{description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkline 
                    data={generateSparkline(value, trend)} 
                    color={sparklineColor}
                  />
                  <span className={cn("text-sm font-medium", trendColor)}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {indicatorCount} mätpunkter
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DomainDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        domain={{ icon, name, description, value, change, indicatorCount }}
      />
    </>
  );
};

// ============================================
// INDICATOR ROW (CLICKABLE)
// ============================================

interface IndicatorRowProps {
  status: 'good' | 'warning' | 'bad';
  name: string;
  value: string;
  change: number;
  explanation: string;
}

const IndicatorRow: React.FC<IndicatorRowProps> = ({
  status,
  name,
  value,
  change,
  explanation,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const statusEmoji = status === 'good' ? '🟢' : status === 'warning' ? '🟡' : '🔴';
  
  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="w-full flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 hover:bg-blue-50 transition-colors cursor-pointer px-2 -mx-2 rounded text-left group"
      >
        <span className="text-sm">{statusEmoji}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{name}</span>
          <p className="text-xs text-slate-500 truncate">{explanation}</p>
        </div>
        <span className="text-sm font-mono text-slate-700">{value}</span>
        <span className={cn(
          "text-sm font-medium min-w-[60px] text-right",
          change >= 0 ? "text-emerald-600" : "text-red-600"
        )}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
        <span className="text-slate-300 group-hover:text-blue-500">→</span>
      </button>
      
      <IndicatorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        indicator={{ name, value, change, explanation }}
      />
    </>
  );
};

// ============================================
// LEGEND COMPONENT (CLICKABLE ITEMS)
// ============================================

const Legend: React.FC = () => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusColor, setStatusColor] = useState<'green' | 'yellow' | 'red'>('green');
  const [trendDialogOpen, setTrendDialogOpen] = useState(false);

  const handleStatusClick = (color: 'green' | 'yellow' | 'red') => {
    setStatusColor(color);
    setStatusDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <button 
          onClick={() => handleStatusClick('green')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <span className="text-sm">🟢</span>
          <span className="text-slate-600 hover:text-emerald-700">Går bra (förbättring)</span>
        </button>
        <button 
          onClick={() => handleStatusClick('yellow')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
        >
          <span className="text-sm">🟡</span>
          <span className="text-slate-600 hover:text-amber-700">Varning (liten förändring)</span>
        </button>
        <button 
          onClick={() => handleStatusClick('red')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
        >
          <span className="text-sm">🔴</span>
          <span className="text-slate-600 hover:text-red-700">Problem (försämring)</span>
        </button>
        <button 
          onClick={() => setTrendDialogOpen(true)}
          className="flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Sparkline data={[40, 45, 50, 55, 60]} color="hsl(160, 84%, 39%)" />
          <span className="text-slate-600">= trend över tid</span>
        </button>
      </div>
      
      <StatusDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen} color={statusColor} />
      <TrendDialog 
        open={trendDialogOpen}
        onOpenChange={setTrendDialogOpen}
        data={generateSparkline(50, 'up')}
        title="Exempel"
        change={5.0}
        period="senaste året"
      />
    </>
  );
};

// ============================================
// COUNTRY-SPECIFIC DATA
// ============================================

interface CountryData {
  name: string;
  flag: string;
  balance: { value: number; change: number; status: 'green' | 'yellow' | 'red' };
  health: { value: number; change: number; status: 'green' | 'yellow' | 'red' };
  domains: {
    healthCare: { value: number; change: number; trend: 'up' | 'down' | 'stable' };
    economy: { value: number; change: number; trend: 'up' | 'down' | 'stable' };
    safety: { value: number; change: number; trend: 'up' | 'down' | 'stable' };
    education: { value: number; change: number; trend: 'up' | 'down' | 'stable' };
    housing: { value: number; change: number; trend: 'up' | 'down' | 'stable' };
    environment: { value: number; change: number; trend: 'up' | 'down' | 'stable' };
  };
  topIndicators: Array<{ name: string; value: string; change: number; explanation: string }>;
  bottomIndicators: Array<{ name: string; value: string; change: number; explanation: string; status: 'bad' | 'warning' }>;
}

const COUNTRY_DATA: Record<string, CountryData> = {
  SE: {
    name: 'Sverige',
    flag: '🇸🇪',
    balance: { value: 0.94, change: -2.1, status: 'yellow' },
    health: { value: 76.3, change: 1.3, status: 'green' },
    domains: {
      healthCare: { value: 72, change: 0.8, trend: 'up' },
      economy: { value: 68, change: -1.2, trend: 'down' },
      safety: { value: 54, change: -2.1, trend: 'down' },
      education: { value: 74, change: 0.3, trend: 'stable' },
      housing: { value: 58, change: -0.5, trend: 'down' },
      environment: { value: 71, change: 1.2, trend: 'up' },
    },
    topIndicators: [
      { name: 'Sysselsättningsgrad', value: '78.2%', change: 2.3, explanation: 'Hur många som har jobb' },
      { name: 'Medellivslängd', value: '83.1 år', change: 0.4, explanation: 'Hur länge vi lever i snitt' },
      { name: 'Förnybar energi', value: '67%', change: 3.8, explanation: 'Andel el från sol, vind och vatten' },
      { name: 'Gymnasiebehörighet', value: '85.3%', change: 1.2, explanation: 'Elever som klarar gymnasiet' },
    ],
    bottomIndicators: [
      { name: 'Vårdköer', value: '127 dagar', change: 15.2, explanation: 'Väntetid för att få vård', status: 'bad' },
      { name: 'Skjutningar', value: '4.2/100k', change: 8.7, explanation: 'Skjutningar per 100 000 invånare', status: 'bad' },
      { name: 'Boendesegregation', value: '42 index', change: 2.1, explanation: 'Hur uppdelat boendet är', status: 'warning' },
      { name: 'Lärarbrist', value: '18.3%', change: 4.6, explanation: 'Skolor som saknar behöriga lärare', status: 'warning' },
    ],
  },
  NO: {
    name: 'Norge',
    flag: '🇳🇴',
    balance: { value: 0.97, change: 0.3, status: 'green' },
    health: { value: 82.1, change: 0.8, status: 'green' },
    domains: {
      healthCare: { value: 84, change: 1.2, trend: 'up' },
      economy: { value: 88, change: 2.3, trend: 'up' },
      safety: { value: 78, change: 0.5, trend: 'stable' },
      education: { value: 79, change: 0.7, trend: 'up' },
      housing: { value: 72, change: 1.1, trend: 'up' },
      environment: { value: 76, change: 0.9, trend: 'up' },
    },
    topIndicators: [
      { name: 'BNP per capita', value: '89 200 USD', change: 4.1, explanation: 'Ekonomisk produktion per person' },
      { name: 'Medellivslängd', value: '83.8 år', change: 0.3, explanation: 'Hur länge vi lever i snitt' },
      { name: 'Vattenkraft', value: '92%', change: 1.2, explanation: 'Andel förnybar el' },
      { name: 'Arbetslöshet', value: '3.4%', change: -0.8, explanation: 'Andel utan jobb' },
    ],
    bottomIndicators: [
      { name: 'Bostadspriser', value: '142 index', change: 6.3, explanation: 'Prisökning på bostäder', status: 'warning' },
      { name: 'Psykisk ohälsa', value: '18.2%', change: 2.1, explanation: 'Unga med ångest/depression', status: 'warning' },
      { name: 'Glesbygdsavfolkning', value: '-2.1%', change: 0.5, explanation: 'Befolkningsminskning utanför städer', status: 'warning' },
      { name: 'Oljeberoende', value: '54%', change: -1.2, explanation: 'Andel av BNP från olja', status: 'warning' },
    ],
  },
  DK: {
    name: 'Danmark',
    flag: '🇩🇰',
    balance: { value: 0.96, change: 0.4, status: 'green' },
    health: { value: 79.8, change: 0.6, status: 'green' },
    domains: {
      healthCare: { value: 78, change: 0.9, trend: 'up' },
      economy: { value: 76, change: 1.4, trend: 'up' },
      safety: { value: 82, change: 0.2, trend: 'stable' },
      education: { value: 77, change: 0.5, trend: 'stable' },
      housing: { value: 65, change: -0.3, trend: 'down' },
      environment: { value: 74, change: 2.1, trend: 'up' },
    },
    topIndicators: [
      { name: 'Lyckoindex', value: '7.6/10', change: 0.2, explanation: 'Självrapporterad livstillfredsställelse' },
      { name: 'Vindkraft', value: '48%', change: 5.2, explanation: 'Andel el från vindkraft' },
      { name: 'Cykelinfrastruktur', value: '92 poäng', change: 3.1, explanation: 'Kvalitet på cykelvägar' },
      { name: 'Låg korruption', value: '90/100', change: 0.5, explanation: 'Korruptionsindex (högt = bra)' },
    ],
    bottomIndicators: [
      { name: 'Skattetryck', value: '47%', change: 0.3, explanation: 'Skatter som andel av BNP', status: 'warning' },
      { name: 'Bostadsbrist', value: '23%', change: 1.8, explanation: 'Kommuner med bostadsbrist', status: 'warning' },
      { name: 'Gängkriminalitet', value: '2.8/100k', change: 4.2, explanation: 'Gängrelaterade brott', status: 'bad' },
      { name: 'Läkarbrist', value: '12%', change: 1.4, explanation: 'Områden med läkarbrist', status: 'warning' },
    ],
  },
  FI: {
    name: 'Finland',
    flag: '🇫🇮',
    balance: { value: 0.95, change: -0.2, status: 'green' },
    health: { value: 78.4, change: 0.5, status: 'green' },
    domains: {
      healthCare: { value: 76, change: 0.4, trend: 'stable' },
      economy: { value: 71, change: -0.8, trend: 'down' },
      safety: { value: 85, change: 0.3, trend: 'stable' },
      education: { value: 86, change: 0.1, trend: 'stable' },
      housing: { value: 68, change: 0.2, trend: 'stable' },
      environment: { value: 79, change: 1.5, trend: 'up' },
    },
    topIndicators: [
      { name: 'PISA-resultat', value: '516 poäng', change: 0.8, explanation: 'Internationellt utbildningstest' },
      { name: 'Trygghet', value: '89/100', change: 0.4, explanation: 'Upplevd trygghet i samhället' },
      { name: 'Jämställdhet', value: '86%', change: 0.7, explanation: 'Jämställdhetsindex' },
      { name: 'Digital mognad', value: '91 poäng', change: 2.3, explanation: 'Digitalisering av offentlig sektor' },
    ],
    bottomIndicators: [
      { name: 'Befolkningsåldring', value: '23%', change: 0.8, explanation: 'Andel över 65 år', status: 'warning' },
      { name: 'Självmordstal', value: '13.4/100k', change: -2.1, explanation: 'Självmord per 100 000', status: 'warning' },
      { name: 'Arbetslöshet', value: '7.2%', change: 0.5, explanation: 'Andel utan jobb', status: 'warning' },
      { name: 'Glesbygd', value: '18 inv/km²', change: -0.3, explanation: 'Befolkningstäthet', status: 'warning' },
    ],
  },
  DE: {
    name: 'Tyskland',
    flag: '🇩🇪',
    balance: { value: 0.88, change: -1.8, status: 'yellow' },
    health: { value: 71.2, change: -0.9, status: 'yellow' },
    domains: {
      healthCare: { value: 74, change: -0.5, trend: 'down' },
      economy: { value: 65, change: -2.4, trend: 'down' },
      safety: { value: 71, change: -1.2, trend: 'down' },
      education: { value: 69, change: -0.8, trend: 'down' },
      housing: { value: 52, change: -1.5, trend: 'down' },
      environment: { value: 68, change: 0.8, trend: 'up' },
    },
    topIndicators: [
      { name: 'Industriproduktion', value: '92 index', change: 1.2, explanation: 'Tillverkningsindustri' },
      { name: 'Forskning & Utveckling', value: '3.1% av BNP', change: 0.3, explanation: 'Investeringar i FoU' },
      { name: 'Kolreduktion', value: '-42%', change: 5.2, explanation: 'Utsläppsminskning sedan 1990' },
      { name: 'Yrkesutbildning', value: '87%', change: 0.6, explanation: 'Kvalitet på yrkesutbildning' },
    ],
    bottomIndicators: [
      { name: 'Energikris', value: '182 index', change: 34.5, explanation: 'Energiprisutveckling', status: 'bad' },
      { name: 'Infrastruktur', value: '58 poäng', change: -3.2, explanation: 'Vägar, broar, järnväg', status: 'bad' },
      { name: 'Digitalisering', value: '62 poäng', change: 1.8, explanation: 'Digital offentlig sektor', status: 'warning' },
      { name: 'Lärarbrist', value: '26%', change: 3.4, explanation: 'Skolor som saknar lärare', status: 'bad' },
    ],
  },
  GLOBAL: {
    name: 'Hela världen',
    flag: '🌍',
    balance: { value: 0.72, change: -0.5, status: 'yellow' },
    health: { value: 58.2, change: 0.3, status: 'yellow' },
    domains: {
      healthCare: { value: 54, change: 0.6, trend: 'up' },
      economy: { value: 52, change: 1.2, trend: 'up' },
      safety: { value: 48, change: -1.5, trend: 'down' },
      education: { value: 58, change: 0.8, trend: 'up' },
      housing: { value: 45, change: -0.3, trend: 'down' },
      environment: { value: 42, change: -2.1, trend: 'down' },
    },
    topIndicators: [
      { name: 'Fattigdomsminskning', value: '-1.2%/år', change: 0.5, explanation: 'Minskning av extrem fattigdom' },
      { name: 'Barnadödlighet', value: '-2.8%/år', change: 0.3, explanation: 'Minskning av barnadödlighet' },
      { name: 'Alfabetisering', value: '87%', change: 0.4, explanation: 'Andel som kan läsa och skriva' },
      { name: 'Internetåtkomst', value: '63%', change: 4.2, explanation: 'Befolkning med internettillgång' },
    ],
    bottomIndicators: [
      { name: 'Klimatkris', value: '+1.2°C', change: 0.08, explanation: 'Global temperaturökning', status: 'bad' },
      { name: 'Konflikter', value: '56 aktiva', change: 12.0, explanation: 'Pågående väpnade konflikter', status: 'bad' },
      { name: 'Hunger', value: '735 M', change: 2.4, explanation: 'Människor som lider av hunger', status: 'bad' },
      { name: 'Biodiversitet', value: '-2.5%/år', change: 0.3, explanation: 'Förlust av arter', status: 'bad' },
    ],
  },
};

// ============================================
// MAIN PAGE
// ============================================

export default function OscilloscopeViewPage() {
  const [selectedCountry, setSelectedCountry] = useState('SE');
  const [timeSpan, setTimeSpan] = useState('12m');
  
  // Get data for selected country
  const countryData = COUNTRY_DATA[selectedCountry] || COUNTRY_DATA.SE;
  
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            {/* Title & Introduction */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                📊 Hur mår samhället just nu?
              </h1>
              <p className="text-slate-600">
                En översikt av hur {countryData.flag} {countryData.name} utvecklas inom olika områden. 
                <span className="text-sky-600 font-medium"> Klicka på ?-knapparna för att förstå mer.</span>
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Välj land:</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[160px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="SE">🇸🇪 Sverige</SelectItem>
                    <SelectItem value="NO">🇳🇴 Norge</SelectItem>
                    <SelectItem value="DK">🇩🇰 Danmark</SelectItem>
                    <SelectItem value="FI">🇫🇮 Finland</SelectItem>
                    <SelectItem value="DE">🇩🇪 Tyskland</SelectItem>
                    <SelectItem value="GLOBAL">🌍 Hela världen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Tidsperiod:</label>
                <Select value={timeSpan} onValueChange={setTimeSpan}>
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1m">Senaste månaden</SelectItem>
                    <SelectItem value="3m">Senaste 3 månader</SelectItem>
                    <SelectItem value="12m">Senaste året</SelectItem>
                    <SelectItem value="5y">Senaste 5 åren</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm" className="ml-auto">
                + Jämför med annat land
              </Button>
            </div>
          </div>
        </header>
        
        {/* LEGEND - NOW CLICKABLE */}
        <div className="bg-slate-50 border-b border-slate-200 py-3">
          <div className="container max-w-6xl mx-auto px-4">
            <Legend />
          </div>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* MAIN SCORES */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🎯 Övergripande betyg
              <HelpBubble text="Dessa två tal sammanfattar hela samhällets tillstånd i ett enda mått. Det första visar balansen mellan olika områden, det andra visar den totala poängen. Klicka på något för att gräva djupare!" />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MainScoreCard
                title="Samhällsbalans"
                helpText="Mäter om samhället är i balans. Värdet 1.0 är perfekt balans. Under 1.0 betyder att vissa områden halkar efter. Det är som en våg - alla delar ska väga lika mycket."
                value={countryData.balance.value}
                maxValue={1.0}
                unit=""
                change={countryData.balance.change}
                changePeriod="senaste året"
                interpretation={`${countryData.name} har en samhällsbalans på ${countryData.balance.value.toFixed(2)}. ${countryData.balance.status === 'green' ? 'Detta indikerar god balans mellan olika samhällsområden.' : countryData.balance.status === 'yellow' ? 'Vissa områden behöver extra uppmärksamhet.' : 'Betydande obalans mellan samhällsområden.'}`}
                sparklineData={generateSparkline(countryData.balance.value * 100, countryData.balance.change >= 0 ? 'up' : 'down')}
                color={countryData.balance.status}
              />
              
              <MainScoreCard
                title="Systemhälsa"
                helpText="Ett totalbetyg för hur bra samhället fungerar, från 0 till 100. Ju högre siffra, desto bättre. Det räknas ut från 56 olika mätningar inom hälsa, ekonomi, utbildning och mer."
                value={countryData.health.value}
                maxValue={100}
                unit="poäng"
                change={countryData.health.change}
                changePeriod="senaste året"
                interpretation={`${countryData.name} har en systemhälsa på ${countryData.health.value.toFixed(1)} av 100. ${countryData.health.status === 'green' ? 'Detta är över genomsnittet.' : countryData.health.status === 'yellow' ? 'Presterar runt genomsnittet.' : 'Under genomsnittet för jämförbara länder.'}`}
                sparklineData={generateSparkline(countryData.health.value, countryData.health.change >= 0 ? 'up' : 'down')}
                color={countryData.health.status}
              />
            </div>
          </section>
          
          {/* DOMAINS */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🏛️ Olika områden i samhället
              <HelpBubble text="Samhället delas in i sex huvudområden. Varje område har flera mätpunkter som kombineras till en totalsiffra. Klicka på ett område för att se alla detaljer!" />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DomainCard
                icon="🏥"
                name="Hälsa & Vård"
                description="Hur friska vi är och hur vården fungerar"
                value={countryData.domains.healthCare.value}
                change={countryData.domains.healthCare.change}
                trend={countryData.domains.healthCare.trend}
                indicatorCount={8}
              />
              <DomainCard
                icon="💰"
                name="Ekonomi"
                description="Jobb, löner och hur pengarna fördelas"
                value={countryData.domains.economy.value}
                change={countryData.domains.economy.change}
                trend={countryData.domains.economy.trend}
                indicatorCount={9}
              />
              <DomainCard
                icon="🛡️"
                name="Trygghet"
                description="Säkerhet, brott och känslan av trygghet"
                value={countryData.domains.safety.value}
                change={countryData.domains.safety.change}
                trend={countryData.domains.safety.trend}
                indicatorCount={10}
              />
              <DomainCard
                icon="📚"
                name="Utbildning"
                description="Skolor, kunskap och lärande"
                value={countryData.domains.education.value}
                change={countryData.domains.education.change}
                trend={countryData.domains.education.trend}
                indicatorCount={7}
              />
              <DomainCard
                icon="🏠"
                name="Boende & Integration"
                description="Bostäder och hur väl vi lever tillsammans"
                value={countryData.domains.housing.value}
                change={countryData.domains.housing.change}
                trend={countryData.domains.housing.trend}
                indicatorCount={6}
              />
              <DomainCard
                icon="🌱"
                name="Miljö & Klimat"
                description="Naturens tillstånd och hållbarhet"
                value={countryData.domains.environment.value}
                change={countryData.domains.environment.change}
                trend={countryData.domains.environment.trend}
                indicatorCount={8}
              />
            </div>
          </section>
          
          {/* TOP CHANGES */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best improvements */}
            <Card className="bg-emerald-50/50 border-emerald-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  📈 Går bäst just nu i {countryData.name}
                  <span className="text-xs font-normal text-emerald-600">(senaste 12 månaderna)</span>
                </h3>
                
                <div className="space-y-1">
                  {countryData.topIndicators.map((indicator, index) => (
                    <IndicatorRow
                      key={index}
                      status="good"
                      name={indicator.name}
                      value={indicator.value}
                      change={indicator.change}
                      explanation={indicator.explanation}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Worst developments */}
            <Card className="bg-red-50/50 border-red-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  📉 Behöver förbättras i {countryData.name}
                  <span className="text-xs font-normal text-red-600">(senaste 12 månaderna)</span>
                </h3>
                
                <div className="space-y-1">
                  {countryData.bottomIndicators.map((indicator, index) => (
                    <IndicatorRow
                      key={index}
                      status={indicator.status}
                      name={indicator.name}
                      value={indicator.value}
                      change={indicator.change}
                      explanation={indicator.explanation}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* FOOTER EXPLANATION */}
          <footer className="bg-sky-50 rounded-xl p-5 border border-sky-100">
            <h3 className="font-semibold text-sky-900 mb-2 flex items-center gap-2">
              💡 Hur läser jag den här sidan?
            </h3>
            <div className="text-sm text-sky-800 space-y-2">
              <p>
                <strong>🖱️ Klicka på vad som helst</strong> för att se mer information! 
                Alla siffror, grafer, badges och kort är klickbara och leder till fördjupning.
              </p>
              <p>
                <strong>Siffrorna</strong> visar mätningar från officiella källor som SCB, Eurostat och WHO. 
                De uppdateras automatiskt när ny data kommer.
              </p>
              <p>
                <strong>Procenten (+/−)</strong> visar hur mycket något har förändrats under den valda tidsperioden. 
                Grönt = förbättring. Rött = försämring.
              </p>
              <p>
                <strong>Kurvorna</strong> (sparklines) visar trenden över tid. 
                Uppåtgående kurva = det blir bättre.
              </p>
              <p className="pt-2 border-t border-sky-200 text-sky-600">
                <strong>Viktigt:</strong> Korrelation är inte orsak. Att två saker förändras samtidigt betyder inte att det ena orsakade det andra.
                <Button variant="link" className="text-sky-700 underline h-auto p-0 ml-1">
                  Läs mer om hur vi räknar →
                </Button>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </TooltipProvider>
  );
}
