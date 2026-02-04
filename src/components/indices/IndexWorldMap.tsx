/**
 * INDEX WORLD MAP - Avanza-inspired, but better
 * 
 * Clean, professional world map with regional index overlays.
 * Compact ticker-style markers with sparklines.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RegionalIndex {
  code: string;
  name: string;
  change: number;
  flag?: string;
  position: { top: string; left: string };
  isGroup?: boolean;
}

// Regional indices with better positioning
const REGIONAL_INDICES: RegionalIndex[] = [
  // Nordic cluster
  { code: 'NORD_RI', name: 'Nordic RI', change: 0.42, flag: 'SE', position: { top: '15%', left: '52%' }, isGroup: true },
  { code: 'SWE_RI', name: 'Sweden RI', change: 0.31, flag: 'SE', position: { top: '18%', left: '55%' } },
  
  // Europe
  { code: 'GBR_RI', name: 'UK RI', change: 0.21, flag: 'GB', position: { top: '26%', left: '46%' } },
  { code: 'DEU_RI', name: 'Germany RI', change: -0.52, flag: 'DE', position: { top: '28%', left: '51%' } },
  
  // North America
  { code: 'CAN_RI', name: 'Canada RI', change: 0.15, flag: 'CA', position: { top: '22%', left: '22%' } },
  { code: 'USA_RI', name: 'US RI', change: -0.67, flag: 'US', position: { top: '32%', left: '20%' } },
  { code: 'MEX_RI', name: 'Mexico RI', change: -1.23, flag: 'MX', position: { top: '42%', left: '16%' } },
  
  // South America
  { code: 'BRA_RI', name: 'Brazil RI', change: -2.84, flag: 'BR', position: { top: '58%', left: '30%' } },
  
  // Africa
  { code: 'ZAF_RI', name: 'South Africa RI', change: -0.45, flag: 'ZA', position: { top: '62%', left: '54%' } },
  
  // Asia
  { code: 'CHN_RI', name: 'China RI', change: -0.89, flag: 'CN', position: { top: '36%', left: '76%' } },
  { code: 'IND_RI', name: 'India RI', change: 0.56, flag: 'IN', position: { top: '42%', left: '70%' } },
  { code: 'JPN_RI', name: 'Japan RI', change: -0.34, flag: 'JP', position: { top: '34%', left: '86%' } },
  { code: 'HKG_RI', name: 'Hong Kong RI', change: 0.28, flag: 'HK', position: { top: '40%', left: '82%' } },
  
  // Oceania
  { code: 'AUS_RI', name: 'Australia RI', change: 0.89, flag: 'AU', position: { top: '68%', left: '84%' } },
];

// Compact sparkline - more refined
const Sparkline: React.FC<{ trend: 'up' | 'down' | 'flat'; className?: string }> = ({ trend, className }) => {
  const path = trend === 'up' 
    ? 'M0,8 L4,7 L8,8 L12,4 L16,5 L20,2'
    : trend === 'down'
    ? 'M0,2 L4,3 L8,2 L12,6 L16,5 L20,8'
    : 'M0,5 L4,4 L8,5 L12,4 L16,5 L20,4';
  
  return (
    <svg viewBox="0 0 20 10" className={cn("h-2.5 w-6", className)}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

interface IndexWorldMapProps {
  className?: string;
  onSelectIndex?: (code: string) => void;
}

export function IndexWorldMap({ className, onSelectIndex }: IndexWorldMapProps) {
  const navigate = useNavigate();

  const handleClick = (code: string) => {
    if (onSelectIndex) {
      onSelectIndex(code);
    } else {
      navigate(`/index/${code}`);
    }
  };

  return (
    <div className={cn("relative w-full h-[380px] bg-muted/20 rounded-lg border overflow-hidden", className)}>
      {/* World Map Background - cleaner, more professional */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        
        {/* Simplified but cleaner continents */}
        <g fill="url(#landGradient)" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeOpacity="0.15">
          {/* North America */}
          <ellipse cx="200" cy="140" rx="120" ry="90" />
          {/* South America */}
          <ellipse cx="280" cy="340" rx="60" ry="100" />
          {/* Europe */}
          <ellipse cx="500" cy="120" rx="70" ry="50" />
          {/* Africa */}
          <ellipse cx="520" cy="280" rx="80" ry="110" />
          {/* Asia */}
          <ellipse cx="720" cy="160" rx="150" ry="100" />
          {/* Australia */}
          <ellipse cx="850" cy="380" rx="60" ry="45" />
        </g>
      </svg>

      {/* Global Index Badge - bottom left */}
      <button
        onClick={() => handleClick('GLOBAL_RI')}
        className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/95 backdrop-blur-sm px-3 py-2 rounded border shadow-sm hover:shadow-md transition-shadow"
      >
        <span className="text-base">🌐</span>
        <span className="font-medium text-sm text-foreground">Global Reality Index</span>
        <span className="text-trend-down font-mono text-sm font-medium">−0,32%</span>
        <Sparkline trend="down" className="text-trend-down" />
      </button>

      {/* Settings button - top right of map */}
      <button className="absolute top-3 right-3 p-1.5 rounded hover:bg-muted/50 transition-colors">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Regional Index Markers - Avanza-style compact tickers */}
      {REGIONAL_INDICES.map((index) => (
        <button
          key={index.code}
          onClick={() => handleClick(index.code)}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2",
            "flex items-center gap-1.5 px-2 py-1 rounded-sm",
            "bg-background/95 backdrop-blur-sm border shadow-sm",
            "hover:bg-background hover:shadow-md hover:z-20 transition-all",
            "text-xs whitespace-nowrap group"
          )}
          style={{ top: index.position.top, left: index.position.left }}
        >
          <span className="text-muted-foreground font-medium">{index.flag}</span>
          <span className="font-semibold text-foreground">{index.code.replace('_RI', '')}</span>
          <span className={cn(
            "font-mono font-medium",
            index.change >= 0 ? "text-trend-up" : "text-trend-down"
          )}>
            {index.change >= 0 ? '+' : ''}{index.change.toFixed(2).replace('.', ',')}%
          </span>
          <Sparkline 
            trend={index.change > 0.1 ? 'up' : index.change < -0.1 ? 'down' : 'flat'} 
            className={index.change >= 0 ? "text-trend-up" : "text-trend-down"}
          />
        </button>
      ))}
    </div>
  );
}

export default IndexWorldMap;
