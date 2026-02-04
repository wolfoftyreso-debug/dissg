/**
 * INDEX WORLD MAP - Avanza-style
 * 
 * World map with regional index performance overlays.
 * Shows major indices with sparklines and changes.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RegionalIndex {
  code: string;
  name: string;
  change: number;
  flag?: string;
  region: 'nordic' | 'europe' | 'americas' | 'asia' | 'oceania' | 'africa' | 'south_america';
  position: { top: string; left: string };
}

// Mock regional indices with performance
const REGIONAL_INDICES: RegionalIndex[] = [
  // Nordic
  { code: 'NORD_RI', name: 'Nordic Reality Index', change: 0.42, flag: '🇸🇪', region: 'nordic', position: { top: '18%', left: '52%' } },
  { code: 'SWE_RI', name: 'Sweden RI', change: 0.31, flag: '🇸🇪', region: 'nordic', position: { top: '22%', left: '54%' } },
  
  // Europe
  { code: 'EU_RI', name: 'EU Reality Index', change: -0.18, flag: '🇪🇺', region: 'europe', position: { top: '30%', left: '50%' } },
  { code: 'DEU_RI', name: 'Germany RI', change: -0.52, flag: '🇩🇪', region: 'europe', position: { top: '32%', left: '51%' } },
  { code: 'GBR_RI', name: 'UK RI', change: 0.21, flag: '🇬🇧', region: 'europe', position: { top: '28%', left: '45%' } },
  
  // Americas
  { code: 'USA_RI', name: 'US Reality Index', change: -0.67, flag: '🇺🇸', region: 'americas', position: { top: '35%', left: '22%' } },
  { code: 'CAN_RI', name: 'Canada RI', change: 0.15, flag: '🇨🇦', region: 'americas', position: { top: '25%', left: '20%' } },
  { code: 'MEX_RI', name: 'Mexico RI', change: -1.23, flag: '🇲🇽', region: 'americas', position: { top: '42%', left: '18%' } },
  
  // South America
  { code: 'BRA_RI', name: 'Brazil RI', change: -2.84, flag: '🇧🇷', region: 'south_america', position: { top: '62%', left: '30%' } },
  
  // Asia
  { code: 'CHN_RI', name: 'China RI', change: -0.89, flag: '🇨🇳', region: 'asia', position: { top: '40%', left: '75%' } },
  { code: 'JPN_RI', name: 'Japan RI', change: -0.34, flag: '🇯🇵', region: 'asia', position: { top: '38%', left: '85%' } },
  { code: 'IND_RI', name: 'India RI', change: 0.56, flag: '🇮🇳', region: 'asia', position: { top: '45%', left: '70%' } },
  { code: 'HKG_RI', name: 'Hong Kong RI', change: 0.28, flag: '🇭🇰', region: 'asia', position: { top: '43%', left: '80%' } },
  
  // Oceania
  { code: 'AUS_RI', name: 'Australia RI', change: 0.89, flag: '🇦🇺', region: 'oceania', position: { top: '70%', left: '82%' } },
  
  // Africa
  { code: 'ZAF_RI', name: 'South Africa RI', change: -0.45, flag: '🇿🇦', region: 'africa', position: { top: '65%', left: '54%' } },
];

// Mini sparkline component
const MiniSparkline: React.FC<{ trend: 'up' | 'down' | 'flat'; className?: string }> = ({ trend, className }) => {
  const path = trend === 'up' 
    ? 'M0,10 L5,8 L10,9 L15,5 L20,6 L25,2'
    : trend === 'down'
    ? 'M0,2 L5,4 L10,3 L15,7 L20,6 L25,10'
    : 'M0,6 L5,5 L10,6 L15,5 L20,6 L25,5';
  
  return (
    <svg 
      viewBox="0 0 25 12" 
      className={cn("h-3 w-8", className)}
      style={{ overflow: 'visible' }}
    >
      <path 
        d={path} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
    <div className={cn("relative w-full h-[400px] bg-muted/30 rounded-lg border overflow-hidden", className)}>
      {/* World Map Background - simplified SVG */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full text-muted-foreground/20"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified world continents */}
        <g fill="currentColor">
          {/* North America */}
          <path d="M50,80 Q100,50 200,60 Q280,70 300,120 L280,180 Q240,220 180,240 L120,220 Q60,180 50,120 Z" />
          {/* South America */}
          <path d="M180,260 Q220,250 240,280 L260,380 Q240,450 200,460 L160,420 Q140,340 180,260 Z" />
          {/* Europe */}
          <path d="M440,80 Q500,60 560,80 L580,120 Q560,160 520,180 L460,170 Q420,140 440,80 Z" />
          {/* Africa */}
          <path d="M460,200 Q520,180 560,220 L580,340 Q540,400 480,420 L440,380 Q420,280 460,200 Z" />
          {/* Asia */}
          <path d="M600,60 Q700,40 820,80 L900,140 Q920,220 880,280 L800,300 Q720,280 660,220 L600,160 Q580,100 600,60 Z" />
          {/* Australia */}
          <path d="M780,340 Q840,320 880,360 L900,400 Q880,440 820,450 L760,420 Q740,380 780,340 Z" />
        </g>
      </svg>

      {/* Global Index Badge */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/90 px-3 py-2 rounded-lg border shadow-sm">
        <span className="text-lg">🌐</span>
        <span className="font-semibold text-sm">Global Reality Index</span>
        <span className="text-destructive font-mono text-sm">−0.32%</span>
        <MiniSparkline trend="down" className="text-destructive" />
      </div>

      {/* Regional Index Markers */}
      {REGIONAL_INDICES.map((index) => (
        <button
          key={index.code}
          onClick={() => handleClick(index.code)}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2",
            "flex items-center gap-1 px-2 py-1 rounded bg-background/95 border shadow-sm",
            "hover:bg-background hover:shadow-md hover:z-10 transition-all",
            "text-xs font-mono whitespace-nowrap"
          )}
          style={{ top: index.position.top, left: index.position.left }}
        >
          <span>{index.flag}</span>
          <span className="font-semibold">{index.code}</span>
          <span className={cn(
            "font-data",
            index.change >= 0 ? "text-trend-up" : "text-trend-down"
          )}>
            {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}%
          </span>
          <MiniSparkline 
            trend={index.change > 0.1 ? 'up' : index.change < -0.1 ? 'down' : 'flat'} 
            className={index.change >= 0 ? "text-trend-up" : "text-trend-down"}
          />
        </button>
      ))}
    </div>
  );
}

export default IndexWorldMap;
