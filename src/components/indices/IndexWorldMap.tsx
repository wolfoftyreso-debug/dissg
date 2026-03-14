/**
 * INDEX WORLD MAP - Avanza-inspired, but with a real map
 * 
 * Proper SVG world map with country outlines and index ticker overlays.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RegionalIndex {
  code: string;
  label: string;
  change: number;
  flag: string;
  alpha3: string;
  position: { top: string; left: string };
  fullName: string;
  value: number;
  domains: { name: string; score: number; trend: 'up' | 'down' | 'flat' }[];
}

const REGIONAL_INDICES: RegionalIndex[] = [
  // Nordics
  { code: 'SWE_RI', label: 'SWE', change: 0.31, flag: 'SE', alpha3: 'SWE', position: { top: '16%', left: '54%' } },
  { code: 'NOR_RI', label: 'NOR', change: 0.19, flag: 'NO', alpha3: 'NOR', position: { top: '12%', left: '51%' } },
  
  // Europe
  { code: 'GBR_RI', label: 'GBR', change: 0.21, flag: 'GB', alpha3: 'GBR', position: { top: '24%', left: '46%' } },
  { code: 'DEU_RI', label: 'DEU', change: -0.52, flag: 'DE', alpha3: 'DEU', position: { top: '24%', left: '51%' } },
  { code: 'FRA_RI', label: 'FRA', change: 0.18, flag: 'FR', alpha3: 'FRA', position: { top: '28%', left: '47%' } },

  // North America
  { code: 'CAN_RI', label: 'CAN', change: 0.15, flag: 'CA', alpha3: 'CAN', position: { top: '18%', left: '22%' } },
  { code: 'USA_RI', label: 'USA', change: -0.67, flag: 'US', alpha3: 'USA', position: { top: '30%', left: '19%' } },
  { code: 'MEX_RI', label: 'MEX', change: -1.23, flag: 'MX', alpha3: 'MEX', position: { top: '40%', left: '15%' } },

  // South America
  { code: 'BRA_RI', label: 'BRA', change: -2.84, flag: 'BR', alpha3: 'BRA', position: { top: '58%', left: '30%' } },
  { code: 'ARG_RI', label: 'ARG', change: -0.91, flag: 'AR', alpha3: 'ARG', position: { top: '72%', left: '28%' } },

  // Africa
  { code: 'ZAF_RI', label: 'ZAF', change: -0.45, flag: 'ZA', alpha3: 'ZAF', position: { top: '66%', left: '54%' } },
  { code: 'NGA_RI', label: 'NGA', change: -1.12, flag: 'NG', alpha3: 'NGA', position: { top: '47%', left: '49%' } },
  { code: 'EGY_RI', label: 'EGY', change: 0.34, flag: 'EG', alpha3: 'EGY', position: { top: '36%', left: '56%' } },

  // Asia
  { code: 'CHN_RI', label: 'CHN', change: -0.89, flag: 'CN', alpha3: 'CHN', position: { top: '32%', left: '76%' } },
  { code: 'IND_RI', label: 'IND', change: 0.56, flag: 'IN', alpha3: 'IND', position: { top: '40%', left: '70%' } },
  { code: 'JPN_RI', label: 'JPN', change: -0.34, flag: 'JP', alpha3: 'JPN', position: { top: '28%', left: '87%' } },
  { code: 'KOR_RI', label: 'KOR', change: 0.42, flag: 'KR', alpha3: 'KOR', position: { top: '32%', left: '84%' } },
  { code: 'SAU_RI', label: 'SAU', change: 0.11, flag: 'SA', alpha3: 'SAU', position: { top: '38%', left: '61%' } },
  { code: 'IDN_RI', label: 'IDN', change: -0.28, flag: 'ID', alpha3: 'IDN', position: { top: '52%', left: '80%' } },

  // Oceania
  { code: 'AUS_RI', label: 'AUS', change: 0.89, flag: 'AU', alpha3: 'AUS', position: { top: '70%', left: '85%' } },

  // Russia
  { code: 'RUS_RI', label: 'RUS', change: -1.45, flag: 'RU', alpha3: 'RUS', position: { top: '16%', left: '70%' } },
];

// Compact sparkline
const Sparkline: React.FC<{ trend: 'up' | 'down' | 'flat'; className?: string }> = ({ trend, className }) => {
  const path = trend === 'up' 
    ? 'M0,8 L4,7 L8,8 L12,4 L16,5 L20,2'
    : trend === 'down'
    ? 'M0,2 L4,3 L8,2 L12,6 L16,5 L20,8'
    : 'M0,5 L4,4 L8,5 L12,4 L16,5 L20,4';
  
  return (
    <svg viewBox="0 0 20 10" className={cn("h-2.5 w-5", className)}>
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
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  const handleClick = (code: string) => {
    if (onSelectIndex) {
      onSelectIndex(code);
    } else {
      navigate(`/index/${code}`);
    }
  };

  return (
    <div className={cn("relative w-full bg-card rounded-lg border overflow-hidden", className)} style={{ height: '420px' }}>
      {/* Real SVG World Map */}
      <svg
        viewBox="0 0 1200 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="landFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width="1200" height="600" fill="url(#oceanGradient)" />
        
        {/* Grid lines for professional look */}
        <g stroke="hsl(var(--border))" strokeWidth="0.3" strokeOpacity="0.3">
          {[100,200,300,400,500].map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} />
          ))}
          {[200,400,600,800,1000].map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" />
          ))}
        </g>

        {/* Proper continent shapes using polygon paths */}
        <g fill="url(#landFill)" stroke="hsl(var(--border))" strokeWidth="0.6" strokeOpacity="0.4">
          {/* North America */}
          <path d="M120,60 L180,50 L240,55 L280,70 L310,100 L320,130 L310,160 L290,190 L270,210 L260,230 L240,250 L220,260 L200,270 L180,265 L170,280 L155,285 L150,270 L140,250 L130,230 L115,220 L100,200 L90,180 L85,150 L90,120 L100,90 L110,70 Z" />
          {/* Greenland */}
          <path d="M280,30 L320,25 L350,35 L360,55 L350,80 L330,85 L310,80 L290,65 L275,45 Z" />
          {/* Central America */}
          <path d="M155,285 L170,280 L180,290 L185,300 L180,310 L170,315 L160,320 L155,315 L150,305 L148,295 Z" />
          
          {/* South America */}
          <path d="M220,320 L250,310 L280,315 L310,330 L330,350 L340,380 L345,410 L340,440 L330,465 L315,485 L300,495 L285,500 L270,490 L260,475 L250,455 L240,430 L235,400 L230,380 L225,360 L220,340 Z" />
          
          {/* Europe */}
          <path d="M470,65 L490,60 L510,55 L530,58 L555,65 L570,75 L575,90 L580,105 L575,120 L565,135 L555,145 L540,155 L530,165 L520,170 L510,175 L495,170 L480,165 L470,155 L465,140 L460,125 L455,110 L458,90 L462,75 Z" />
          {/* UK & Ireland */}
          <path d="M445,90 L455,85 L460,95 L458,108 L450,115 L442,110 L440,100 Z" />
          {/* Scandinavia */}
          <path d="M510,30 L520,25 L535,30 L540,45 L545,60 L540,75 L530,55 L520,50 L515,40 Z" />
          
          {/* Africa */}
          <path d="M470,185 L500,180 L530,185 L560,195 L580,210 L600,240 L610,270 L615,300 L610,335 L600,365 L585,390 L570,410 L555,420 L540,425 L520,420 L500,410 L485,395 L475,375 L465,350 L455,320 L450,290 L448,260 L452,230 L458,210 L465,195 Z" />
          
          {/* Asia - main mass */}
          <path d="M580,50 L620,40 L680,35 L740,40 L800,50 L860,55 L920,60 L960,70 L980,85 L990,100 L985,120 L975,140 L960,160 L940,180 L920,195 L895,205 L870,210 L840,215 L810,220 L780,225 L750,230 L720,225 L690,215 L670,200 L650,185 L635,170 L620,155 L610,135 L600,115 L590,95 L582,75 Z" />
          {/* India */}
          <path d="M720,225 L740,230 L760,245 L770,265 L775,290 L770,310 L760,320 L745,325 L730,320 L720,305 L715,280 L710,260 L712,240 Z" />
          {/* Arabian Peninsula */}
          <path d="M610,195 L640,185 L665,195 L680,210 L685,230 L675,245 L660,250 L640,245 L625,235 L615,220 L610,205 Z" />
          {/* Southeast Asia */}
          <path d="M810,220 L830,225 L850,240 L860,260 L865,275 L855,285 L840,280 L825,270 L815,255 L808,240 Z" />
          {/* Japan */}
          <path d="M960,100 L975,95 L985,105 L988,120 L982,135 L972,140 L965,130 L958,115 Z" />
          {/* Korean Peninsula */}
          <path d="M940,110 L950,105 L958,112 L955,125 L948,132 L940,128 L938,118 Z" />
          {/* Indonesia archipelago */}
          <path d="M840,310 L860,308 L880,312 L900,310 L915,315 L910,325 L890,328 L870,325 L850,322 L838,318 Z" />
          
          {/* Australia */}
          <path d="M880,370 L920,360 L960,365 L990,380 L1010,400 L1015,425 L1005,450 L985,465 L960,470 L935,465 L910,455 L895,440 L885,420 L878,400 L876,385 Z" />
          {/* New Zealand */}
          <path d="M1040,445 L1048,440 L1055,450 L1052,465 L1045,470 L1038,462 Z" />
        </g>
      </svg>

      {/* Global Index Badge */}
      <button
        onClick={() => handleClick('GLOBAL_RI')}
        className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/95 backdrop-blur-sm px-3 py-2 rounded border shadow-sm hover:shadow-md transition-shadow z-10"
      >
        <span className="font-mono text-xs text-muted-foreground">[G]</span>
        <span className="font-medium text-sm text-foreground">Global Reality Index</span>
        <span className="text-trend-down font-mono text-sm font-medium">−0,32%</span>
        <Sparkline trend="down" className="text-trend-down" />
      </button>

      {/* Settings button */}
      <button className="absolute top-3 right-3 p-1.5 rounded hover:bg-muted/50 transition-colors z-10">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Regional Index Markers */}
      {REGIONAL_INDICES.map((index) => (
        <button
          key={index.code}
          onClick={() => handleClick(index.code)}
          onMouseEnter={() => setHoveredIndex(index.code)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
            "flex items-center gap-1 px-1.5 py-0.5 rounded",
            "bg-background/90 backdrop-blur-sm border",
            "hover:bg-background hover:shadow-md hover:z-20 transition-all",
            "text-[11px] whitespace-nowrap",
            hoveredIndex === index.code && "ring-1 ring-primary/50 shadow-md z-20"
          )}
          style={{ top: index.position.top, left: index.position.left }}
        >
          <span className="text-muted-foreground font-medium">{index.flag}</span>
          <span className="font-semibold text-foreground">{index.alpha3}</span>
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
