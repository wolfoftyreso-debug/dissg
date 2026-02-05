/**
 * SIGNAL OVERVIEW PAGE - Signalöversikt
 * 
 * Professional dashboard for civilization signals.
 * Light, clean aesthetic inspired by financial dashboards.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface IndexData {
  code: string;
  name: string;
  flag?: string;
  value: number;
  change: number;
  sparkline: number[];
  time: string;
}


// ============================================
// MOCK DATA
// ============================================

const generateSparkline = (base: number, volatility: number = 5): number[] => {
  const points: number[] = [];
  let current = base;
  for (let i = 0; i < 20; i++) {
    current += (Math.random() - 0.5) * volatility;
    points.push(Math.max(0, Math.min(100, current)));
  }
  return points;
};

const NORDIC_INDEX: IndexData[] = [
  { code: 'SE', name: 'Sverige', flag: '🇸🇪', value: 72.45, change: 0.31, sparkline: generateSparkline(72), time: '17:29' },
  { code: 'NO', name: 'Norge', flag: '🇳🇴', value: 74.12, change: 0.28, sparkline: generateSparkline(74), time: '17:29' },
  { code: 'DK', name: 'Danmark', flag: '🇩🇰', value: 73.88, change: -0.15, sparkline: generateSparkline(74), time: '17:33' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', value: 71.56, change: 0.42, sparkline: generateSparkline(71), time: '17:30' },
  { code: 'IS', name: 'Island', flag: '🇮🇸', value: 75.23, change: -0.08, sparkline: generateSparkline(75), time: '17:30' },
];

const WORLD_INDEX: IndexData[] = [
  { code: 'US', name: 'USA', flag: '🇺🇸', value: 65.34, change: -0.67, sparkline: generateSparkline(65), time: '22:04' },
  { code: 'CN', name: 'Kina', flag: '🇨🇳', value: 58.92, change: -0.89, sparkline: generateSparkline(59), time: '23:15' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', value: 68.45, change: -0.34, sparkline: generateSparkline(68), time: '22:04' },
  { code: 'GB', name: 'Storbritannien', flag: '🇬🇧', value: 66.78, change: 0.21, sparkline: generateSparkline(67), time: '18:00' },
  { code: 'AU', name: 'Australien', flag: '🇦🇺', value: 70.12, change: 0.89, sparkline: generateSparkline(70), time: '08:30' },
  { code: 'CA', name: 'Kanada', flag: '🇨🇦', value: 69.45, change: 0.15, sparkline: generateSparkline(69), time: '16:00' },
  { code: 'BR', name: 'Brasilien', flag: '🇧🇷', value: 52.34, change: -2.84, sparkline: generateSparkline(54), time: '19:00' },
  { code: 'IN', name: 'Indien', flag: '🇮🇳', value: 54.67, change: 0.56, sparkline: generateSparkline(55), time: '17:45' },
];

const EUROPE_INDEX: IndexData[] = [
  { code: 'DE', name: 'Tyskland', flag: '🇩🇪', value: 69.23, change: -0.52, sparkline: generateSparkline(70), time: '18:00' },
  { code: 'FR', name: 'Frankrike', flag: '🇫🇷', value: 67.45, change: 0.18, sparkline: generateSparkline(67), time: '17:35' },
  { code: 'NL', name: 'Nederländerna', flag: '🇳🇱', value: 72.56, change: 0.34, sparkline: generateSparkline(72), time: '18:15' },
  { code: 'CH', name: 'Schweiz', flag: '🇨🇭', value: 76.89, change: 0.56, sparkline: generateSparkline(77), time: '17:45' },
  { code: 'ES', name: 'Spanien', flag: '🇪🇸', value: 64.12, change: -0.23, sparkline: generateSparkline(64), time: '18:00' },
  { code: 'IT', name: 'Italien', flag: '🇮🇹', value: 62.78, change: -0.45, sparkline: generateSparkline(63), time: '18:00' },
];

const DOMAIN_INDEX: IndexData[] = [
  { code: 'H', name: 'Hälsa', value: 68.34, change: -0.45, sparkline: generateSparkline(68), time: '00:30' },
  { code: 'E', name: 'Ekonomi', value: 71.23, change: 0.82, sparkline: generateSparkline(71), time: '00:30' },
  { code: 'U', name: 'Utbildning', value: 74.56, change: 0.12, sparkline: generateSparkline(75), time: '00:30' },
  { code: 'T', name: 'Trygghet', value: 58.34, change: -0.89, sparkline: generateSparkline(59), time: '00:26' },
  { code: 'M', name: 'Miljö', value: 62.89, change: -0.67, sparkline: generateSparkline(63), time: '00:30' },
  { code: 'S', name: 'Social', value: 69.45, change: 0.28, sparkline: generateSparkline(69), time: '00:30' },
];

const GLOBAL_REALITY_INDEX = {
  value: 67.82,
  change: -0.32,
  sparkline: generateSparkline(68),
};

// Map bubble data
const MAP_BUBBLES = [
  { code: 'SE', name: 'SWE', x: 52, y: 22, value: 72.45, change: 0.31 },
  { code: 'NO', name: 'NOR', x: 50, y: 18, value: 74.12, change: 0.28 },
  { code: 'US', name: 'USA', x: 22, y: 35, value: 65.34, change: -0.67 },
  { code: 'CA', name: 'CAN', x: 20, y: 25, value: 69.45, change: 0.15 },
  { code: 'MX', name: 'MEX', x: 18, y: 45, value: 54.23, change: -1.23 },
  { code: 'BR', name: 'BRA', x: 32, y: 65, value: 52.34, change: -2.84 },
  { code: 'GB', name: 'GBR', x: 47, y: 28, value: 66.78, change: 0.21 },
  { code: 'DE', name: 'DEU', x: 51, y: 30, value: 69.23, change: -0.52 },
  { code: 'FR', name: 'FRA', x: 48, y: 33, value: 67.45, change: 0.18 },
  { code: 'CN', name: 'CHN', x: 75, y: 38, value: 58.92, change: -0.89 },
  { code: 'JP', name: 'JPN', x: 85, y: 35, value: 68.45, change: -0.34 },
  { code: 'IN', name: 'IND', x: 72, y: 45, value: 54.67, change: 0.56 },
  { code: 'AU', name: 'AUS', x: 83, y: 72, value: 70.12, change: 0.89 },
  { code: 'ZA', name: 'ZAF', x: 55, y: 70, value: 48.45, change: -0.45 },
  { code: 'HK', name: 'HKG', x: 80, y: 42, value: 64.28, change: 0.28 },
];

// ============================================
// SPARKLINE COMPONENT
// ============================================

const MiniSparkline: React.FC<{ data: number[]; positive?: boolean; className?: string }> = ({ 
  data, 
  positive = true,
  className 
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 40;
    const y = 12 - ((val - min) / range) * 10;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="40" height="14" className={cn("inline-block", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={positive ? 'hsl(142, 76%, 45%)' : 'hsl(0, 84%, 60%)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================
// INDEX TABLE COMPONENT
// ============================================

interface IndexTableProps {
  title: string;
  items: IndexData[];
  showFlag?: boolean;
}

const IndexTable: React.FC<IndexTableProps> = ({ title, items, showFlag = true }) => {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="py-3 px-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-800">{title}</CardTitle>
          <button className="text-xs text-slate-400 hover:text-slate-600 font-mono">
            [...]
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-2 px-4 text-xs font-medium text-slate-500">Index</th>
              <th className="text-right py-2 px-2 text-xs font-medium text-slate-500">+/−%</th>
              <th className="text-right py-2 px-2 text-xs font-medium text-slate-500">Senast</th>
              <th className="text-right py-2 px-4 text-xs font-medium text-slate-500">Tid</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr 
                key={item.code} 
                className={cn(
                  "border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer",
                  idx === items.length - 1 && "border-b-0"
                )}
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    {showFlag && <span className="text-base">{item.flag}</span>}
                    <span className="font-mono text-xs text-slate-500">{item.code}</span>
                    <span className="text-slate-700 truncate max-w-[80px]">{item.name}</span>
                    <MiniSparkline data={item.sparkline} positive={item.change >= 0} />
                  </div>
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className={cn(
                    "font-mono text-xs font-medium",
                    item.change >= 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                  {item.value.toFixed(2)}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-slate-400">
                  {item.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

// ============================================
// WORLD MAP COMPONENT
// ============================================

const WorldMapVisualization: React.FC = () => {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-0 relative">
        {/* Map background */}
        <div 
          className="w-full h-[400px] relative"
          style={{
            background: `
              linear-gradient(135deg, hsl(210, 40%, 98%) 0%, hsl(210, 30%, 96%) 100%)
            `,
          }}
        >
          {/* Simplified continent shapes using CSS */}
          <svg 
            viewBox="0 0 100 60" 
            className="absolute inset-0 w-full h-full opacity-20"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* North America */}
            <ellipse cx="20" cy="25" rx="12" ry="10" fill="hsl(210, 20%, 75%)" />
            {/* South America */}
            <ellipse cx="28" cy="48" rx="6" ry="10" fill="hsl(210, 20%, 75%)" />
            {/* Europe */}
            <ellipse cx="50" cy="22" rx="8" ry="6" fill="hsl(210, 20%, 75%)" />
            {/* Africa */}
            <ellipse cx="52" cy="40" rx="7" ry="10" fill="hsl(210, 20%, 75%)" />
            {/* Asia */}
            <ellipse cx="72" cy="28" rx="15" ry="12" fill="hsl(210, 20%, 75%)" />
            {/* Australia */}
            <ellipse cx="82" cy="52" rx="6" ry="5" fill="hsl(210, 20%, 75%)" />
          </svg>
          
          {/* Data bubbles */}
          {MAP_BUBBLES.map((bubble) => (
            <div
              key={bubble.code}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
            >
              {/* Bubble */}
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-sm transition-all",
                "bg-white/95 backdrop-blur-sm hover:bg-white hover:shadow-md",
                bubble.change >= 0 ? "border-emerald-200" : "border-red-200"
              )}>
                <span className="text-xs font-mono text-slate-500">{bubble.name}</span>
                <span className={cn(
                  "text-xs font-mono font-medium",
                  bubble.change >= 0 ? "text-emerald-600" : "text-red-500"
                )}>
                  {bubble.change >= 0 ? '+' : ''}{bubble.change.toFixed(2)}%
                </span>
                <MiniSparkline 
                  data={generateSparkline(bubble.value)} 
                  positive={bubble.change >= 0} 
                />
              </div>
            </div>
          ))}
          
          {/* Global Reality Index badge */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/95 border border-slate-200 shadow-sm">
              <span className="text-lg">🌐</span>
              <div>
                <p className="text-sm font-medium text-slate-700">Global Reality Index</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-mono font-semibold",
                    GLOBAL_REALITY_INDEX.change >= 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    {GLOBAL_REALITY_INDEX.change >= 0 ? '+' : ''}{GLOBAL_REALITY_INDEX.change.toFixed(2)}%
                  </span>
                  <MiniSparkline 
                    data={GLOBAL_REALITY_INDEX.sparkline} 
                    positive={GLOBAL_REALITY_INDEX.change >= 0}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Settings gear */}
          <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function OscilloscopeViewPage() {
  const [activeTab, setActiveTab] = useState('index-idag');
  const [timeSpan, setTimeSpan] = useState('1y');
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Indexöversikt</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeSpan} onValueChange={setTimeSpan}>
                <SelectTrigger className="w-[120px] h-8 text-sm bg-white border-slate-200">
                  <SelectValue placeholder="Tidsperiod" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="1d">Idag</SelectItem>
                  <SelectItem value="1w">1 vecka</SelectItem>
                  <SelectItem value="1m">1 månad</SelectItem>
                  <SelectItem value="1y">1 år</SelectItem>
                  <SelectItem value="5y">5 år</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="h-8 text-sm border-slate-200">
                + Lägg till
              </Button>
              
              <Button variant="outline" size="sm" className="h-8 text-sm border-slate-200">
                ↕ Sortera
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-10 bg-transparent border-b border-slate-200 rounded-none p-0 gap-0">
              <TabsTrigger 
                value="index-idag" 
                className="h-10 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Index idag
              </TabsTrigger>
              <TabsTrigger 
                value="mina-bevakningar" 
                className="h-10 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Mina bevakningar
              </TabsTrigger>
              <TabsTrigger 
                value="anteckningar" 
                className="h-10 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Anteckningar
              </TabsTrigger>
              <TabsTrigger 
                value="larm" 
                className="h-10 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Larm
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>
      
      {/* DESCRIPTION */}
      <div className="bg-slate-50 border-b border-slate-200 py-2">
        <div className="container max-w-7xl mx-auto px-4">
          <p className="text-xs text-slate-500">
            Att jämföra länder och regioner över tid är komplext. Index visar trender och relativa positioner, 
            men ger inte fullständig bild. Klicka på valfritt index för fullständig metodbeskrivning.
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Map link */}
        <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-blue-200 bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors">
          <span>🗺️</span>
          <span>Global diagnostisk karta</span>
        </button>
        
        {/* WORLD MAP */}
        <WorldMapVisualization />
        
        {/* INDEX TABLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <IndexTable title="Nordiska index" items={NORDIC_INDEX} />
          <IndexTable title="Världsindex" items={WORLD_INDEX} />
          <IndexTable title="Europeiska index" items={EUROPE_INDEX} />
          <IndexTable title="Domänindex" items={DOMAIN_INDEX} showFlag={false} />
          <IndexTable title="Trendindex" items={[
            { code: 'R', name: 'Resiliens', value: 64.23, change: -0.34, sparkline: generateSparkline(64), time: '00:30' },
            { code: 'I', name: 'Innovation', value: 71.45, change: 0.67, sparkline: generateSparkline(71), time: '00:30' },
            { code: 'G', name: 'Governance', value: 68.12, change: -0.12, sparkline: generateSparkline(68), time: '00:30' },
            { code: 'S', name: 'Stabilitet', value: 72.34, change: 0.45, sparkline: generateSparkline(72), time: '00:30' },
            { code: 'J', name: 'Jämlikhet', value: 59.78, change: -0.89, sparkline: generateSparkline(60), time: '00:30' },
          ]} showFlag={false} />
        </div>
        
        {/* FOOTER NOTE */}
        <footer className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            Index baseras på normaliserade offentliga datakällor. 
            Korrelation innebär inte kausalitet. 
            <button className="text-blue-600 hover:underline ml-1">Läs mer om metodik</button>
          </p>
        </footer>
      </div>
    </main>
  );
}
