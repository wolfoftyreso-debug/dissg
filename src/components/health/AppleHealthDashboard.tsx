/**
 * APPLE HEALTH-STYLE DASHBOARD
 * 
 * Pedagogical, friendly, and accessible design inspired by iPhone Health app.
 * Uses soft colors, rounded cards, progress rings, and human-readable labels.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// ============================================
// PROGRESS RING COMPONENT
// ============================================
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: 'green' | 'amber' | 'red' | 'blue';
  showPercentage?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 60,
  strokeWidth = 6,
  color = 'green',
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    green: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-rose-500',
    blue: 'text-blue-500',
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-100"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700 ease-out", colorClasses[color])}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-sm font-bold", colorClasses[color])}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// HEALTH CATEGORY CARD
// ============================================
interface CategoryData {
  id: string;
  name: string;
  icon: string;
  score: number;
  trend: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
  description: string;
  indicators: IndicatorData[];
}

interface IndicatorData {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
  explanation: string;
  lastUpdated: string;
  // Extended pedagogical fields
  whatItMeasures?: string;
  howItsMeasured?: string;
  whyItMatters?: string;
  exampleInPractice?: string;
  source?: string;
  sourceUrl?: string;
}

interface CategoryCardProps {
  category: CategoryData;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const statusConfig = {
    excellent: { label: 'Utmärkt', color: 'green' as const, bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700' },
    good: { label: 'Bra', color: 'blue' as const, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
    attention: { label: 'Behöver uppmärksamhet', color: 'amber' as const, bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-700' },
    critical: { label: 'Kritiskt', color: 'red' as const, bgColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-700' },
  };

  const config = statusConfig[category.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border-2 p-4 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        {/* Progress ring */}
        <ProgressRing 
          progress={category.score} 
          color={config.color}
          size={64}
          strokeWidth={7}
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {category.name}
            </h3>
          </div>
          
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {category.description}
          </p>
          
          <div className="flex items-center gap-3">
            <Badge className={cn("text-xs font-medium", config.bgColor, config.textColor, "border-0")}>
              {config.label}
            </Badge>
            
            <span className={cn(
              "text-sm font-medium",
              category.trend >= 0 ? "text-emerald-600" : "text-rose-600"
            )}>
              {category.trend >= 0 ? '↑' : '↓'} {Math.abs(category.trend).toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Arrow */}
        <span className="text-slate-400 text-xl mt-2">→</span>
      </div>
    </button>
  );
};

// ============================================
// INDICATOR ROW
// ============================================
interface IndicatorRowProps {
  indicator: IndicatorData;
  onClick: () => void;
}

const IndicatorRow: React.FC<IndicatorRowProps> = ({ indicator, onClick }) => {
  const statusColors = {
    excellent: 'bg-emerald-500',
    good: 'bg-blue-500',
    attention: 'bg-amber-500',
    critical: 'bg-rose-500',
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all text-left"
    >
      {/* Status dot */}
      <span className={cn("w-3 h-3 rounded-full shrink-0", statusColors[indicator.status])} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900">{indicator.name}</div>
        <div className="text-sm text-slate-500">{indicator.explanation}</div>
      </div>
      
      {/* Value */}
      <div className="text-right shrink-0">
        <div className="font-bold text-lg text-slate-900">
          {indicator.value}
          <span className="text-sm font-normal text-slate-500 ml-1">{indicator.unit}</span>
        </div>
        <div className={cn(
          "text-sm font-medium",
          indicator.trend >= 0 ? "text-emerald-600" : "text-rose-600"
        )}>
          {indicator.trend >= 0 ? '+' : ''}{indicator.trend.toFixed(1)}%
        </div>
      </div>
      
      {/* Arrow */}
      <span className="text-slate-300">›</span>
    </button>
  );
};

// ============================================
// CATEGORY DETAIL DIALOG
// ============================================
interface CategoryDetailDialogProps {
  category: CategoryData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndicatorClick: (indicator: IndicatorData) => void;
}

const CategoryDetailDialog: React.FC<CategoryDetailDialogProps> = ({
  category,
  open,
  onOpenChange,
  onIndicatorClick,
}) => {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <DialogTitle className="text-xl">{category.name}</DialogTitle>
              <DialogDescription className="mt-1">{category.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 py-4">
            {/* Summary card */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Övergripande poäng</p>
                    <p className="text-4xl font-bold text-slate-900">{category.score}%</p>
                    <p className={cn(
                      "text-sm font-medium mt-1",
                      category.trend >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {category.trend >= 0 ? '↑' : '↓'} {Math.abs(category.trend).toFixed(1)}% senaste året
                    </p>
                  </div>
                  <ProgressRing 
                    progress={category.score} 
                    size={80} 
                    strokeWidth={8}
                    color={category.status === 'critical' ? 'red' : category.status === 'attention' ? 'amber' : 'green'}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Indicators */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                📊 Ingående mätvärden ({category.indicators.length})
              </h4>
              <div className="space-y-2">
                {category.indicators.map((indicator) => (
                  <IndicatorRow
                    key={indicator.id}
                    indicator={indicator}
                    onClick={() => onIndicatorClick(indicator)}
                  />
                ))}
              </div>
            </div>
            
            {/* What this shows */}
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  💡 Vad visar detta?
                </h4>
                <p className="text-sm text-blue-800">
                  Denna kategori sammanställer {category.indicators.length} olika mätvärden 
                  för att ge en översiktlig bild av {category.name.toLowerCase()}. 
                  Varje mätvärde kan klickas för att se detaljerad information, 
                  historik och källhänvisningar.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// INDICATOR DETAIL DIALOG
// ============================================
interface IndicatorDetailDialogProps {
  indicator: IndicatorData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IndicatorDetailDialog: React.FC<IndicatorDetailDialogProps> = ({
  indicator,
  open,
  onOpenChange,
}) => {
  if (!indicator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-xl">{indicator.name}</DialogTitle>
          <DialogDescription className="text-base">{indicator.explanation}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 py-4">
            {/* Big value display */}
            <div className="text-center py-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
              <span className="text-5xl font-bold text-slate-900">
                {indicator.value}
              </span>
              <span className="text-xl text-slate-500 ml-2">{indicator.unit}</span>
              <p className={cn(
                "text-lg font-semibold mt-2",
                indicator.trend >= 0 ? "text-emerald-600" : "text-rose-600"
              )}>
                {indicator.trend >= 0 ? '↑' : '↓'} {Math.abs(indicator.trend).toFixed(1)}% senaste året
              </p>
            </div>

            {/* PEDAGOGICAL EXPLANATION - What does this measure? */}
            {indicator.whatItMeasures && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">📖</span> Vad mäter detta?
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {indicator.whatItMeasures}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* How is it measured? */}
            {indicator.howItsMeasured && (
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🔬</span> Hur mäts det?
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {indicator.howItsMeasured}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Why does it matter? */}
            {indicator.whyItMatters && (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span> Varför är det viktigt?
                  </h4>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    {indicator.whyItMatters}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Practical example */}
            {indicator.exampleInPractice && (
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">🏠</span> Konkret exempel
                  </h4>
                  <p className="text-sm text-purple-800 leading-relaxed italic">
                    "{indicator.exampleInPractice}"
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Meta info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span>📅</span> Senast uppdaterad
                  </span>
                  <span className="font-medium">{indicator.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span>📍</span> Geografiskt område
                  </span>
                  <span className="font-medium">Sverige, nationellt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span>🔄</span> Uppdateringsfrekvens
                  </span>
                  <span className="font-medium">Månadsvis</span>
                </div>
              </CardContent>
            </Card>
            
            {/* What this does NOT show */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Vad detta INTE visar
                </h4>
                <ul className="text-sm text-amber-800 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Bakomliggande orsaker till förändringen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Individuella variationer mellan grupper</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Regionala skillnader inom landet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Kvalitativa aspekter som inte kan mätas numeriskt</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Source link */}
            <a 
              href={indicator.sourceUrl || "https://www.scb.se"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                🔗 Gå till primärkällan ({indicator.source || 'SCB'}) →
              </Button>
            </a>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// GEO SCOPE TYPES & DATA
// ============================================

type GeoLevel = 'global' | 'continent' | 'country' | 'region';

interface GeoScope {
  level: GeoLevel;
  code: string;
  name: string;
  flag?: string;
  parent?: string;
}

const GEO_SCOPES: Record<string, GeoScope> = {
  // Global
  'global': { level: 'global', code: 'global', name: 'Hela världen', flag: '🌍' },
  // Continents
  'europe': { level: 'continent', code: 'europe', name: 'Europa', flag: '🇪🇺', parent: 'global' },
  'asia': { level: 'continent', code: 'asia', name: 'Asien', flag: '🌏', parent: 'global' },
  'americas': { level: 'continent', code: 'americas', name: 'Amerika', flag: '🌎', parent: 'global' },
  'africa': { level: 'continent', code: 'africa', name: 'Afrika', flag: '🌍', parent: 'global' },
  // Countries
  'SE': { level: 'country', code: 'SE', name: 'Sverige', flag: '🇸🇪', parent: 'europe' },
  'NO': { level: 'country', code: 'NO', name: 'Norge', flag: '🇳🇴', parent: 'europe' },
  'DK': { level: 'country', code: 'DK', name: 'Danmark', flag: '🇩🇰', parent: 'europe' },
  'FI': { level: 'country', code: 'FI', name: 'Finland', flag: '🇫🇮', parent: 'europe' },
  'DE': { level: 'country', code: 'DE', name: 'Tyskland', flag: '🇩🇪', parent: 'europe' },
  'FR': { level: 'country', code: 'FR', name: 'Frankrike', flag: '🇫🇷', parent: 'europe' },
  'GB': { level: 'country', code: 'GB', name: 'Storbritannien', flag: '🇬🇧', parent: 'europe' },
  'US': { level: 'country', code: 'US', name: 'USA', flag: '🇺🇸', parent: 'americas' },
  'CN': { level: 'country', code: 'CN', name: 'Kina', flag: '🇨🇳', parent: 'asia' },
  'JP': { level: 'country', code: 'JP', name: 'Japan', flag: '🇯🇵', parent: 'asia' },
  // Swedish regions
  'SE-AB': { level: 'region', code: 'SE-AB', name: 'Stockholms län', parent: 'SE' },
  'SE-O': { level: 'region', code: 'SE-O', name: 'Västra Götaland', parent: 'SE' },
  'SE-M': { level: 'region', code: 'SE-M', name: 'Skåne', parent: 'SE' },
};

const LEVEL_LABELS: Record<GeoLevel, { icon: string; label: string }> = {
  global: { icon: '🌍', label: 'Global' },
  continent: { icon: '🗺️', label: 'Världsdel' },
  country: { icon: '🏳️', label: 'Land' },
  region: { icon: '📍', label: 'Region' },
};

// Data sources by geo scope
const GEO_DATA_SOURCES: Record<string, { sources: string[]; note: string }> = {
  'global': { 
    sources: ['World Bank', 'WHO', 'UN Statistics', 'IMF', 'OECD'],
    note: 'Globala aggregat baserade på nationella rapporter'
  },
  'europe': { 
    sources: ['Eurostat', 'OECD', 'European Commission', 'WHO Europe'],
    note: 'Europeiska aggregat med harmoniserad metodik'
  },
  'americas': { 
    sources: ['US Census Bureau', 'BLS', 'PAHO', 'World Bank', 'ECLAC'],
    note: 'Data från nord- och sydamerikanska statistikbyråer'
  },
  'asia': { 
    sources: ['World Bank', 'Asian Development Bank', 'UN ESCAP', 'WHO WPRO'],
    note: 'Asiatiska aggregat med varierande datatäckning'
  },
  'africa': { 
    sources: ['African Development Bank', 'UN ECA', 'World Bank', 'WHO AFRO'],
    note: 'Afrikanska aggregat – notera varierande datakvalitet'
  },
  'SE': { 
    sources: ['SCB', 'Socialstyrelsen', 'Brå', 'Skolverket', 'Naturvårdsverket'],
    note: 'Svenska officiella statistikbyråer'
  },
  'NO': { 
    sources: ['SSB', 'Folkehelseinstituttet', 'Utdanningsdirektoratet'],
    note: 'Norska officiella statistikbyråer'
  },
  'DK': { 
    sources: ['Danmarks Statistik', 'Sundhedsdatastyrelsen'],
    note: 'Danska officiella statistikbyråer'
  },
  'FI': { 
    sources: ['Statistics Finland', 'THL', 'Finnish Education Evaluation Centre'],
    note: 'Finska officiella statistikbyråer'
  },
  'DE': { 
    sources: ['Destatis', 'Robert Koch Institut', 'Bundesagentur für Arbeit'],
    note: 'Tyska officiella statistikbyråer'
  },
  'FR': { 
    sources: ['INSEE', 'Santé Publique France', 'Ministère de l\'Éducation'],
    note: 'Franska officiella statistikbyråer'
  },
  'GB': { 
    sources: ['ONS', 'NHS Digital', 'Department for Education'],
    note: 'Brittiska officiella statistikbyråer'
  },
  'US': { 
    sources: ['US Census Bureau', 'BLS', 'CDC', 'EPA', 'Department of Education'],
    note: 'Amerikanska federala statistikbyråer'
  },
  'CN': { 
    sources: ['National Bureau of Statistics of China', 'WHO', 'World Bank'],
    note: 'Kinesiska officiella källor – notera begränsad oberoende verifiering'
  },
  'JP': { 
    sources: ['Statistics Bureau of Japan', 'MHLW', 'MEXT'],
    note: 'Japanska officiella statistikbyråer'
  },
};

// ============================================
// GEO SCOPE SELECTOR COMPONENT
// ============================================

interface GeoScopeSelectorProps {
  currentScope: string;
  onScopeChange: (scope: string) => void;
}

const GeoScopeSelector: React.FC<GeoScopeSelectorProps> = ({ currentScope, onScopeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scope = GEO_SCOPES[currentScope] || GEO_SCOPES['SE'];
  const levelInfo = LEVEL_LABELS[scope.level];

  // Group scopes by level for selection
  const scopesByLevel = {
    global: Object.values(GEO_SCOPES).filter(s => s.level === 'global'),
    continent: Object.values(GEO_SCOPES).filter(s => s.level === 'continent'),
    country: Object.values(GEO_SCOPES).filter(s => s.level === 'country'),
    region: Object.values(GEO_SCOPES).filter(s => s.level === 'region' && s.parent === currentScope),
  };

  return (
    <div className="relative">
      {/* Current scope button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
      >
        <span className="text-xl">{scope.flag || levelInfo.icon}</span>
        <div className="text-left">
          <div className="text-xs text-slate-500 uppercase tracking-wide">{levelInfo.label}</div>
          <div className="font-semibold text-slate-900">{scope.name}</div>
        </div>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>


      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-medium text-slate-600">Välj geografisk nivå</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {/* Global */}
              <div className="p-2 border-b border-slate-100">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 px-2 mb-1">Global</p>
                {scopesByLevel.global.map(s => (
                  <button
                    key={s.code}
                    onClick={() => { onScopeChange(s.code); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-blue-50 transition-colors ${currentScope === s.code ? 'bg-blue-50' : ''}`}
                  >
                    <span className="text-lg">{s.flag}</span>
                    <span className="font-medium text-slate-700">{s.name}</span>
                    {currentScope === s.code && <span className="ml-auto text-blue-600">✓</span>}
                  </button>
                ))}
              </div>

              {/* Continents */}
              <div className="p-2 border-b border-slate-100">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 px-2 mb-1">Världsdelar</p>
                <div className="grid grid-cols-2 gap-1">
                  {scopesByLevel.continent.map(s => (
                    <button
                      key={s.code}
                      onClick={() => { onScopeChange(s.code); setIsOpen(false); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-blue-50 transition-colors text-sm ${currentScope === s.code ? 'bg-blue-50' : ''}`}
                    >
                      <span>{s.flag}</span>
                      <span className="text-slate-700">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="p-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 px-2 mb-1">Länder</p>
                <div className="grid grid-cols-2 gap-1">
                  {scopesByLevel.country.map(s => (
                    <button
                      key={s.code}
                      onClick={() => { onScopeChange(s.code); setIsOpen(false); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-blue-50 transition-colors text-sm ${currentScope === s.code ? 'bg-blue-50' : ''}`}
                    >
                      <span>{s.flag}</span>
                      <span className="text-slate-700 truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// SCOPE-AWARE TITLE
// ============================================

function getScopeTitle(scope: GeoScope): { title: string; subtitle: string } {
  switch (scope.level) {
    case 'global':
      return { title: 'Global Diagnos', subtitle: 'Hur mår världen just nu? Klicka för att utforska.' };
    case 'continent':
      return { title: `${scope.name}s Hälsa`, subtitle: `Hur mår ${scope.name} just nu? Klicka för att utforska.` };
    case 'country':
      return { title: `${scope.name}s Hälsa`, subtitle: `Hur mår ${scope.name} just nu? Klicka för att utforska.` };
    case 'region':
      return { title: `${scope.name}`, subtitle: `Regional status för ${scope.name}. Klicka för att utforska.` };
    default:
      return { title: 'Samhällets Hälsa', subtitle: 'Klicka för att utforska.' };
  }
}

// ============================================
// MAIN APPLE HEALTH DASHBOARD
// ============================================
export interface AppleHealthDashboardProps {
  className?: string;
}

export const AppleHealthDashboard: React.FC<AppleHealthDashboardProps> = ({ className }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorData | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [indicatorDialogOpen, setIndicatorDialogOpen] = useState(false);
  
  // GEO SCOPE STATE - defaults to global
  const [currentGeoScope, setCurrentGeoScope] = useState<string>('global');
  const geoScope = GEO_SCOPES[currentGeoScope] || GEO_SCOPES['global'];
  const { title: scopeTitle, subtitle: scopeSubtitle } = getScopeTitle(geoScope);

  // Mock data (would be fetched based on geo scope in real implementation)
  const categories: CategoryData[] = [
    {
      id: 'health',
      name: 'Hälsa & Välbefinnande',
      icon: '❤️',
      score: 82,
      trend: 1.2,
      status: 'good',
      description: 'Livslängd, sjukvård och allmän folkhälsa',
      indicators: [
        { 
          id: '1', name: 'Förväntad livslängd', value: '83.1', unit: 'år', trend: 0.12, status: 'excellent', 
          explanation: 'Genomsnittlig förväntad livslängd vid födseln', lastUpdated: '2025-01-15',
          whatItMeasures: 'Detta mäter hur många år en person som föds idag statistiskt kan förväntas leva, baserat på nuvarande dödlighetstal i olika åldersgrupper.',
          howItsMeasured: 'SCB samlar in data om alla dödsfall i Sverige och beräknar sannolikheten att dö i varje åldersgrupp. Dessa sannolikheter summeras sedan till en förväntad livslängd.',
          whyItMatters: 'Förväntad livslängd är en av de viktigaste indikatorerna på ett samhälles övergripande hälsa. Den påverkas av sjukvårdens kvalitet, levnadsvanor, miljö och socioekonomiska faktorer.',
          exampleInPractice: 'Om du föds i Sverige 2025 kan du statistiskt förvänta dig att leva till 83 år. Men detta är ett genomsnitt – din faktiska livslängd beror på dina livsval och omständigheter.',
          source: 'SCB', sourceUrl: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning/befolkningens-sammansattning/befolkningsstatistik/'
        },
        { 
          id: '2', name: 'Överdödlighet', value: '4.2', unit: '%', trend: 10.5, status: 'attention', 
          explanation: 'Dödlighet över förväntad baslinje', lastUpdated: '2025-01-15',
          whatItMeasures: 'Överdödlighet visar hur många fler personer som dött jämfört med vad som är "normalt" baserat på historiska mönster.',
          howItsMeasured: 'Man jämför faktiska dödsfall med en förväntad nivå beräknad från de senaste 5 årens genomsnitt, justerat för åldersfördelning och säsongsvariationer.',
          whyItMatters: 'Överdödlighet fungerar som en "varningsklocka" för folkhälsan. Ökad överdödlighet kan signalera pandemier, värmeböljor, eller försämrad sjukvård.',
          exampleInPractice: 'Om överdödligheten är 4.2% betyder det att 4.2% fler människor har dött än förväntat. I ett land med 100 000 förväntade dödsfall per år motsvarar det 4 200 extra dödsfall.',
          source: 'Socialstyrelsen', sourceUrl: 'https://www.socialstyrelsen.se/'
        },
        { 
          id: '3', name: 'Vårdkötid', value: '89', unit: 'dagar', trend: 5.3, status: 'attention', 
          explanation: 'Medianväntetid för specialistvård', lastUpdated: '2025-01-15',
          whatItMeasures: 'Detta mäter hur länge patienter i genomsnitt väntar på att få träffa en specialist efter remiss från vårdcentral.',
          howItsMeasured: 'Regionerna rapporterar väntetider för alla patienter i kö till specialistvård. Medianen beräknas – alltså den tid där hälften väntat kortare och hälften längre.',
          whyItMatters: 'Långa vårdköer kan leda till att sjukdomar förvärras, ökad smärta och lidande, samt i värsta fall att behandling kommer för sent.',
          exampleInPractice: 'Om du behöver träffa en ortoped för en knäskada tar det i genomsnitt 89 dagar från remiss till första besök. Under denna tid kan du behöva hantera smärta och begränsad rörlighet.',
          source: 'SKR', sourceUrl: 'https://www.vantetider.se/'
        },
      ]
    },
    {
      id: 'economy',
      name: 'Ekonomi & Arbete',
      icon: '💼',
      score: 71,
      trend: -0.8,
      status: 'attention',
      description: 'Sysselsättning, inkomster och ekonomisk stabilitet',
      indicators: [
        { 
          id: '4', name: 'Arbetslöshet', value: '7.8', unit: '%', trend: 1.2, status: 'attention', 
          explanation: 'Andel arbetslösa av arbetskraften', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen personer som aktivt söker arbete men inte har ett jobb, av alla som antingen arbetar eller söker arbete.',
          howItsMeasured: 'SCB genomför månatliga arbetskraftsundersökningar (AKU) där ett urval av befolkningen intervjuas om sin arbetsmarknadsstatus.',
          whyItMatters: 'Arbetslöshet påverkar individers ekonomi, psykiska hälsa och samhällets skatteintäkter. Hög arbetslöshet kan leda till ökade sociala problem.',
          exampleInPractice: 'Av 100 personer som vill arbeta har 7-8 stycken inget jobb just nu trots att de aktivt söker. Detta inkluderar inte de som gett upp att söka.',
          source: 'SCB', sourceUrl: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/'
        },
        { 
          id: '5', name: 'Medianinkomst', value: '32,400', unit: 'kr', trend: 2.1, status: 'good', 
          explanation: 'Median månadslön före skatt', lastUpdated: '2025-01-15',
          whatItMeasures: 'Den månadslön där hälften av alla anställda tjänar mer och hälften tjänar mindre. Visar vad en "typisk" person tjänar.',
          howItsMeasured: 'Arbetsgivare rapporterar alla löner till Skatteverket. SCB beräknar sedan medianen för alla heltidsanställda.',
          whyItMatters: 'Medianinkomsten visar den ekonomiska standarden för vanliga människor bättre än genomsnittslön, eftersom extremt höga löner inte snedvrider resultatet.',
          exampleInPractice: 'Om medianinkomsten är 32 400 kr betyder det att en "vanlig" svensk tjänar ungefär detta före skatt. Efter skatt blir det cirka 25 000-26 000 kr.',
          source: 'SCB', sourceUrl: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/arbetsmarknad/loner-och-arbetskostnader/'
        },
        { 
          id: '6', name: 'BNP-tillväxt', value: '1.2', unit: '%', trend: -0.5, status: 'attention', 
          explanation: 'Årlig ekonomisk tillväxt', lastUpdated: '2025-01-15',
          whatItMeasures: 'BNP (Bruttonationalprodukt) mäter det totala värdet av alla varor och tjänster som produceras i landet under ett år. Tillväxten visar hur mycket detta ökat jämfört med förra året.',
          howItsMeasured: 'SCB samlar in data från företag, myndigheter och hushåll om produktion, konsumtion, investeringar, export och import. Allt summeras och jämförs med föregående år.',
          whyItMatters: 'BNP-tillväxt indikerar om ekonomin expanderar eller krymper. Positiv tillväxt betyder oftast fler jobb och högre inkomster, men säger inget om hur välståndet fördelas.',
          exampleInPractice: 'Om BNP växer 1.2% och förra årets BNP var 5 000 miljarder kr, har ekonomin vuxit med 60 miljarder kr. Det motsvarar ungefär värdet av all svensk möbelproduktion.',
          source: 'SCB', sourceUrl: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/nationalrakenskaper/'
        },
      ]
    },
    {
      id: 'education',
      name: 'Utbildning & Kunskap',
      icon: '🎓',
      score: 78,
      trend: 0.5,
      status: 'good',
      description: 'Skolresultat, utbildningsnivå och kompetens',
      indicators: [
        { 
          id: '7', name: 'Gymnasiebehörighet', value: '84.2', unit: '%', trend: -0.3, status: 'good', 
          explanation: 'Andel elever som uppnår gymnasiebehörighet', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen niondeklassare som har tillräckligt höga betyg för att bli antagna till ett nationellt gymnasieprogram.',
          howItsMeasured: 'Skolverket samlar in slutbetygen från alla grundskolor. För gymnasiebehörighet krävs godkänt i svenska, engelska, matematik och minst fem andra ämnen.',
          whyItMatters: 'Elever utan gymnasiebehörighet har svårare att få jobb och löper högre risk för arbetslöshet och utanförskap senare i livet.',
          exampleInPractice: 'I en klass med 30 elever når 25-26 stycken gymnasiebehörighet. De 4-5 som inte gör det behöver gå introduktionsprogram innan de kan börja ett vanligt gymnasieprogram.',
          source: 'Skolverket', sourceUrl: 'https://www.skolverket.se/'
        },
        { 
          id: '8', name: 'Högskoleutbildade', value: '43.1', unit: '%', trend: 0.8, status: 'good', 
          explanation: 'Andel av befolkningen med eftergymnasial utbildning', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen vuxna (25-64 år) som har genomfört minst två års högskoleutbildning eller motsvarande.',
          howItsMeasured: 'SCB registrerar alla examina och utbildningar och beräknar andelen av befolkningen i arbetsför ålder med eftergymnasial utbildning.',
          whyItMatters: 'Utbildningsnivån påverkar innovation, produktivitet och konkurrenskraft. Högutbildade har generellt högre inkomster och lägre arbetslöshet.',
          exampleInPractice: 'Av 10 vuxna svenskar har ungefär 4 stycken en högskoleexamen eller liknande. Detta är en av de högsta andelarna i världen.',
          source: 'SCB', sourceUrl: 'https://www.scb.se/hitta-statistik/statistik-efter-amne/utbildning-och-forskning/'
        },
      ]
    },
    {
      id: 'environment',
      name: 'Miljö & Klimat',
      icon: '🌿',
      score: 68,
      trend: 2.3,
      status: 'attention',
      description: 'Utsläpp, förnybar energi och naturresurser',
      indicators: [
        { 
          id: '9', name: 'CO2-utsläpp', value: '4.2', unit: 'ton/capita', trend: -3.2, status: 'good', 
          explanation: 'Årliga koldioxidutsläpp per person', lastUpdated: '2025-01-15',
          whatItMeasures: 'Den genomsnittliga mängden koldioxid som varje invånare orsakar genom transport, uppvärmning, konsumtion och industri.',
          howItsMeasured: 'Naturvårdsverket samlar in data om bränsleförbrukning, industriutsläpp och energianvändning. Totala utsläpp delas med befolkningen.',
          whyItMatters: 'Koldioxid är den viktigaste växthusgasen som driver klimatförändringarna. Minskade utsläpp är nödvändigt för att uppnå klimatmålen.',
          exampleInPractice: '4.2 ton CO2 motsvarar ungefär att köra 20 000 km med en bensinbil, eller 8 flygresor Stockholm-London tur och retur.',
          source: 'Naturvårdsverket', sourceUrl: 'https://www.naturvardsverket.se/'
        },
        { 
          id: '10', name: 'Förnybar energi', value: '56.4', unit: '%', trend: 2.1, status: 'excellent', 
          explanation: 'Andel energi från förnybara källor', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen av Sveriges totala energiförbrukning som kommer från förnybara källor som vattenkraft, vindkraft, sol och biobränslen.',
          howItsMeasured: 'Energimyndigheten samlar in data om all energiproduktion och -konsumtion i Sverige och beräknar andelen från förnybara källor.',
          whyItMatters: 'Förnybar energi minskar beroendet av fossila bränslen, reducerar utsläpp och stärker energisäkerheten.',
          exampleInPractice: 'Av elen du använder hemma kommer mer än hälften från vattenkraft, vindkraft eller sol. Resten kommer främst från kärnkraft.',
          source: 'Energimyndigheten', sourceUrl: 'https://www.energimyndigheten.se/'
        },
      ]
    },
    {
      id: 'safety',
      name: 'Trygghet & Säkerhet',
      icon: '🛡️',
      score: 65,
      trend: -2.1,
      status: 'attention',
      description: 'Brottslighet, rättsväsende och social trygghet',
      indicators: [
        { 
          id: '11', name: 'Anmälda brott', value: '14,200', unit: 'per 100k', trend: 3.5, status: 'attention', 
          explanation: 'Antal anmälda brott per 100 000 invånare', lastUpdated: '2025-01-15',
          whatItMeasures: 'Antalet brott som anmäls till polisen per 100 000 invånare under ett år.',
          howItsMeasured: 'Brå (Brottsförebyggande rådet) sammanställer alla polisanmälningar och normaliserar per capita för att kunna jämföra mellan regioner och över tid.',
          whyItMatters: 'Anmälda brott ger en bild av brottsligheten, men visar inte hela sanningen eftersom många brott aldrig anmäls (mörkertal).',
          exampleInPractice: 'I en stad med 100 000 invånare anmäls ungefär 14 200 brott per år – cirka 40 per dag. Detta inkluderar allt från cykelstölder till grova våldsbrott.',
          source: 'Brå', sourceUrl: 'https://www.bra.se/'
        },
        { 
          id: '12', name: 'Uppklarade brott', value: '18.2', unit: '%', trend: -1.2, status: 'critical', 
          explanation: 'Andel brott som leder till åtal', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen av alla anmälda brott där någon identifieras, åtalas och döms eller får annan påföljd.',
          howItsMeasured: 'Brå följer alla anmälningar och registrerar hur många som leder till att ärendet "klaras upp" genom lagföring, åtalsunderlåtelse eller nedläggning.',
          whyItMatters: 'Låg uppklaringsgrad kan minska förtroendet för rättssystemet och signalera att det "lönar sig" att begå brott.',
          exampleInPractice: 'Av 100 anmälda brott leder bara 18 till att någon ställs till svars. 82 brott förblir outredda – ofta för att det saknas bevis eller vittnen.',
          source: 'Brå', sourceUrl: 'https://www.bra.se/'
        },
      ]
    },
    {
      id: 'democracy',
      name: 'Demokrati & Samhälle',
      icon: '🏛️',
      score: 88,
      trend: 0.3,
      status: 'excellent',
      description: 'Politiskt deltagande, förtroende och medborgarskap',
      indicators: [
        { 
          id: '13', name: 'Valdeltagande', value: '87.2', unit: '%', trend: 0.5, status: 'excellent', 
          explanation: 'Andel röstande i senaste riksdagsvalet', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen röstberättigade som faktiskt röstar i riksdagsvalet.',
          howItsMeasured: 'Valmyndigheten räknar alla giltiga röster och jämför med antalet röstberättigade medborgare.',
          whyItMatters: 'Högt valdeltagande stärker demokratins legitimitet. När många röstar representerar de folkvalda en bredare del av befolkningen.',
          exampleInPractice: 'Av 100 röstberättigade svenskar går 87 och röstar. Detta är ett av de högsta valdeltagandena i världen.',
          source: 'Valmyndigheten', sourceUrl: 'https://www.val.se/'
        },
        { 
          id: '14', name: 'Institutionsförtroende', value: '62.3', unit: '%', trend: -1.8, status: 'good', 
          explanation: 'Andel med förtroende för offentliga institutioner', lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen befolkning som uppger att de har stort eller ganska stort förtroende för institutioner som riksdag, regering, polis och domstolar.',
          howItsMeasured: 'SOM-institutet vid Göteborgs universitet genomför årliga enkätundersökningar med ett representativt urval av befolkningen.',
          whyItMatters: 'Förtroende för institutioner är grunden för ett fungerande samhälle. Lågt förtroende kan leda till minskad följsamhet av lagar och ökad polarisering.',
          exampleInPractice: 'Av 10 svenskar har 6 stycken förtroende för våra myndigheter och institutioner. 4 har lågt eller inget förtroende.',
          source: 'SOM-institutet', sourceUrl: 'https://www.gu.se/som-institutet'
        },
      ]
    },
  ];

  const handleCategoryClick = (category: CategoryData) => {
    setSelectedCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleIndicatorClick = (indicator: IndicatorData) => {
    setSelectedIndicator(indicator);
    setIndicatorDialogOpen(true);
  };

  // Calculate overall score
  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
  const criticalCount = categories.filter(c => c.status === 'critical').length;
  const attentionCount = categories.filter(c => c.status === 'attention').length;

  return (
    <div className={cn("min-h-screen bg-slate-50", className)}>
      {/* Header with Geo Scope Selector */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            {/* Geo Scope Selector - Left side */}
            <div className="flex-1">
              <GeoScopeSelector 
                currentScope={currentGeoScope} 
                onScopeChange={setCurrentGeoScope} 
              />
            </div>
            
            {/* Login button - Right side */}
            <Link 
              to="/login" 
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shrink-0"
            >
              Logga in
            </Link>
          </div>
          
          {/* Dynamic title based on scope */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-slate-900">{scopeTitle}</h1>
            <p className="text-slate-600 text-sm mt-1">{scopeSubtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Summary card */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <ProgressRing 
                progress={overallScore} 
                size={80} 
                strokeWidth={8}
                color={overallScore >= 75 ? 'green' : overallScore >= 50 ? 'amber' : 'red'}
              />
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Övergripande status</p>
                <p className="text-3xl font-bold text-slate-900">{overallScore}%</p>
                <div className="flex gap-2 mt-2">
                  {criticalCount > 0 && (
                    <Badge className="bg-rose-100 text-rose-700 border-0">
                      {criticalCount} kritiska
                    </Badge>
                  )}
                  {attentionCount > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 border-0">
                      {attentionCount} behöver uppmärksamhet
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-200">
              💡 <strong>Tips:</strong> Klicka på en kategori nedan för att se detaljer, 
              eller på ett enskilt mätvärde för att se källa och metodik.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Categories */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Kategorier</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
        
        {/* Footer info - Dynamic based on geo scope */}
        {(() => {
          const dataSources = GEO_DATA_SOURCES[currentGeoScope] || GEO_DATA_SOURCES['global'];
          return (
            <Card className="mt-6 bg-slate-100 border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">
                  📊 Data från {dataSources.sources.join(', ')}
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {dataSources.note}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
                </p>
              </CardContent>
            </Card>
          );
        })()}
      </div>
      
      {/* Dialogs */}
      <CategoryDetailDialog
        category={selectedCategory}
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onIndicatorClick={handleIndicatorClick}
      />
      
      <IndicatorDetailDialog
        indicator={selectedIndicator}
        open={indicatorDialogOpen}
        onOpenChange={setIndicatorDialogOpen}
      />
    </div>
  );
};

export default AppleHealthDashboard;
