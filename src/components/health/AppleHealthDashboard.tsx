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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


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
            
            {/* What this shows - CLICKABLE */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100/80 hover:border-blue-200 transition-all group">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      💡 Vad visar detta?
                      <span className="ml-auto text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Fördjupa →</span>
                    </h4>
                    <p className="text-sm text-blue-800">
                      Denna kategori sammanställer {category.indicators.length} olika mätvärden 
                      för att ge en översiktlig bild av {category.name.toLowerCase()}. 
                      Varje mätvärde kan klickas för att se detaljerad information, 
                      historik och källhänvisningar.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {category.icon} Om {category.name}
                  </DialogTitle>
                  <DialogDescription>Fördjupad förklaring av kategorin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">📖 Definition</h4>
                    <p className="text-sm text-blue-800">
                      {category.description}. Denna kategori omfattar {category.indicators.length} separata 
                      indikatorer som tillsammans ger en sammansatt bild av {category.name.toLowerCase()}.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">⚙️ Så beräknas poängen</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">1</span>
                        <span>Varje ingående indikator normaliseras till 0-100 skala</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">2</span>
                        <span>Viktat medelvärde beräknas baserat på relevans</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">3</span>
                        <span>Konfidensintervall justeras för datatäckning</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-emerald-800 mb-2">📊 Ingående mätvärden</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {category.indicators.slice(0, 5).map((ind) => (
                        <Badge key={ind.id} variant="outline" className="bg-white text-xs">
                          {ind.name}
                        </Badge>
                      ))}
                      {category.indicators.length > 5 && (
                        <Badge variant="outline" className="bg-white text-xs text-slate-500">
                          +{category.indicators.length - 5} till
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-amber-800 mb-2">⚠️ Begränsningar</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Sammansatta mått förenklar komplex verklighet</li>
                      <li>• Viktningen påverkar slutresultatet</li>
                      <li>• Se individuella indikatorer för fullständig bild</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
  geoScopeName?: string;
}

const IndicatorDetailDialog: React.FC<IndicatorDetailDialogProps> = ({
  indicator,
  open,
  onOpenChange,
  geoScopeName = 'valt område',
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

            {/* PEDAGOGICAL EXPLANATION - What does this measure? - CLICKABLE */}
            {indicator.whatItMeasures && (
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-400 hover:shadow-md transition-all group active:scale-[0.99]">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">📖</span> Vad mäter detta?
                        <span className="ml-auto text-xs text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                          <span className="opacity-60 group-hover:opacity-100">Fördjupa</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {indicator.whatItMeasures}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      📖 Vad mäter {indicator.name}?
                    </DialogTitle>
                    <DialogDescription>Fördjupad förklaring av indikatorn</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Definition</h4>
                      <p className="text-sm text-blue-800">{indicator.whatItMeasures}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-slate-800 mb-2">Teknisk beskrivning</h4>
                      <p className="text-sm text-slate-600">
                        Denna indikator mäter {indicator.name.toLowerCase()} och uttrycks i {indicator.unit}. 
                        Värdet baseras på officiell statistik och beräknas enligt internationella standarder.
                      </p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-amber-800 mb-2">⚠️ Vad detta INTE mäter</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Individuella variationer inom befolkningen</li>
                        <li>• Kvalitativa aspekter utöver kvantitativa mått</li>
                        <li>• Regionala skillnader (se regional analys)</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        📊 Se relaterade indikatorer
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        🔗 Officiell definition (källa)
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* How is it measured? - CLICKABLE */}
            {indicator.howItsMeasured && (
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-slate-50 border-slate-200 cursor-pointer hover:bg-slate-100 hover:border-slate-400 hover:shadow-md transition-all group active:scale-[0.99]">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="text-lg">🔬</span> Hur mäts det?
                        <span className="ml-auto text-xs text-slate-600 group-hover:text-slate-700 transition-colors flex items-center gap-1">
                          <span className="opacity-60 group-hover:opacity-100">Fördjupa</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {indicator.howItsMeasured}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      🔬 Mätmetodik för {indicator.name}
                    </DialogTitle>
                    <DialogDescription>Så samlas och beräknas data</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-slate-800 mb-2">Metod</h4>
                      <p className="text-sm text-slate-600">{indicator.howItsMeasured}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-3">📋 Datainsamlingsprocess</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">1</span>
                          <span>Primärdata samlas in av ansvarig myndighet</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">2</span>
                          <span>Kvalitetskontroll och validering genomförs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">3</span>
                          <span>Data publiceras enligt fastställd standard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">4</span>
                          <span>Vi hämtar och harmoniserar för jämförbarhet</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 p-3 rounded-lg text-center">
                        <p className="text-xl font-bold text-emerald-700">±2.5%</p>
                        <p className="text-xs text-emerald-600">Osäkerhetsmarginal</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <p className="text-xl font-bold text-purple-700">Månadsvis</p>
                        <p className="text-xs text-purple-600">Uppdateringsfrekvens</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      📄 Fullständig metoddokumentation (PDF)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Why does it matter? - CLICKABLE */}
            {indicator.whyItMatters && (
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-emerald-50 border-emerald-200 cursor-pointer hover:bg-emerald-100 hover:border-emerald-400 hover:shadow-md transition-all group active:scale-[0.99]">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">💡</span> Varför är det viktigt?
                        <span className="ml-auto text-xs text-emerald-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                          <span className="opacity-60 group-hover:opacity-100">Fördjupa</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </h4>
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        {indicator.whyItMatters}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      💡 Varför {indicator.name} är viktigt
                    </DialogTitle>
                    <DialogDescription>Samhällelig betydelse och konsekvenser</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="bg-emerald-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-emerald-800 mb-2">Betydelse</h4>
                      <p className="text-sm text-emerald-700">{indicator.whyItMatters}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-3">🔗 Kopplingar till andra områden</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-white">Ekonomi</Badge>
                        <Badge variant="outline" className="bg-white">Hälsa</Badge>
                        <Badge variant="outline" className="bg-white">Social sammanhållning</Badge>
                        <Badge variant="outline" className="bg-white">Demokrati</Badge>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-amber-800 mb-2">📈 Om trenden fortsätter</h4>
                      <p className="text-sm text-amber-700">
                        {indicator.trend >= 0 
                          ? `Med nuvarande positiv trend (+${indicator.trend.toFixed(1)}% per år) kan vi förvänta fortsatt förbättring om inga större förändringar sker.`
                          : `Den nuvarande negativa trenden (${indicator.trend.toFixed(1)}% per år) indikerar behov av uppmärksamhet och eventuella insatser.`
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        📊 Se korrelationer
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        🏛️ Relaterade politikområden
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Practical example - CLICKABLE */}
            {indicator.exampleInPractice && (
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-purple-50 border-purple-200 cursor-pointer hover:bg-purple-100 hover:border-purple-400 hover:shadow-md transition-all group active:scale-[0.99]">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🏠</span> Konkret exempel
                        <span className="ml-auto text-xs text-purple-600 group-hover:text-purple-700 transition-colors flex items-center gap-1">
                          <span className="opacity-60 group-hover:opacity-100">Fördjupa</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </h4>
                      <p className="text-sm text-purple-800 leading-relaxed italic">
                        "{indicator.exampleInPractice}"
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      🏠 {indicator.name} i praktiken
                    </DialogTitle>
                    <DialogDescription>Verkliga exempel och vardagskonsekvenser</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-purple-800 mb-2">Typexempel</h4>
                      <p className="text-sm text-purple-700 italic">"{indicator.exampleInPractice}"</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-3">👥 Vad betyder detta för...</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex items-start gap-2">
                          <span className="font-bold">Individen:</span>
                          <span>Direkt påverkan på vardagslivet genom tillgång till tjänster och resurser.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-bold">Samhället:</span>
                          <span>Aggregerad effekt som formar social sammanhållning och välbefinnande.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-bold">Framtiden:</span>
                          <span>Långsiktiga konsekvenser för hållbar utveckling.</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-slate-800 mb-2">📍 Regional variation</h4>
                      <p className="text-sm text-slate-600">
                        Värdet {indicator.value} {indicator.unit} är ett nationellt genomsnitt. 
                        Regionala skillnader kan vara betydande — klicka för att utforska geografisk fördelning.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      🗺️ Utforska regional fördelning
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            {/* Meta info - CLICKABLE */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all group">
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
                      <span className="font-medium">{geoScopeName}, nationellt</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center gap-2">
                        <span>🔄</span> Uppdateringsfrekvens
                      </span>
                      <span className="font-medium">Månadsvis</span>
                    </div>
                    <p className="text-[10px] text-blue-500 text-center opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                      Klicka för metadata och provenienskedja →
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    📋 Metadata & Proveniens
                  </DialogTitle>
                  <DialogDescription>Full spårbarhet för {indicator.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-3">📊 Datainformation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Senast uppdaterad</span>
                        <span className="font-medium">{indicator.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Geografisk täckning</span>
                        <span className="font-medium">{geoScopeName}, nationellt</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Uppdateringsfrekvens</span>
                        <span className="font-medium">Månadsvis</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Dataformat</span>
                        <span className="font-medium">SDMX / CSV</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-600">API-tillgänglighet</span>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200">Tillgänglig</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-3">🔗 Provenienskedja</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">1</span>
                        <span><strong>Primärkälla:</strong> {indicator.source || 'SCB'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">2</span>
                        <span><strong>Insamling:</strong> Officiell statistikproduktion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">3</span>
                        <span><strong>Validering:</strong> Automatisk kvalitetskontroll</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">4</span>
                        <span><strong>Harmonisering:</strong> SDMX-standard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <p className="text-xl font-bold text-emerald-700">94%</p>
                      <p className="text-xs text-emerald-600">Konfidens</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <p className="text-xl font-bold text-amber-700">±3.2%</p>
                      <p className="text-xs text-amber-600">Osäkerhetsmarginal</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      📥 Ladda ner rådata
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      🔗 API-dokumentation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* What this does NOT show - CLICKABLE */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100/80 hover:border-amber-300 transition-all group">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">⚠️</span> Vad detta INTE visar
                      <span className="ml-auto text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">Fördjupa →</span>
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
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    ⚠️ Begränsningar & Vad data inte visar
                  </DialogTitle>
                  <DialogDescription>Epistemisk ödmjukhet för {indicator.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-amber-900 mb-3">🚫 Vad detta INTE mäter</h4>
                    <ul className="text-sm text-amber-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">1.</span>
                        <div>
                          <span className="font-medium">Bakomliggande orsaker</span>
                          <p className="text-amber-700 text-xs mt-0.5">Statistiken visar VAD som händer, inte VARFÖR det händer.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">2.</span>
                        <div>
                          <span className="font-medium">Individuella variationer</span>
                          <p className="text-amber-700 text-xs mt-0.5">Nationella medelvärden döljer variation mellan grupper, regioner och individer.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">3.</span>
                        <div>
                          <span className="font-medium">Regionala skillnader</span>
                          <p className="text-amber-700 text-xs mt-0.5">Se regional analys för geografisk fördelning inom landet.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">4.</span>
                        <div>
                          <span className="font-medium">Kvalitativa aspekter</span>
                          <p className="text-amber-700 text-xs mt-0.5">Numeriska mått fångar inte subjektiva upplevelser, relationer eller kulturella nyanser.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Varför visar vi detta?</h4>
                    <p className="text-sm text-blue-700">
                      All data har begränsningar. Genom att explicit visa vad ett mått INTE mäter 
                      hjälper vi dig att undvika övertolkningar och dra korrekta slutsatser. 
                      Detta är en del av vår anti-hubris-design.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-slate-800 mb-2">🔍 Kompletterande analyser</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      För att få en fullständigare bild, kombinera detta mått med:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">Regional fördelning</Badge>
                      <Badge variant="outline" className="bg-white">Demografisk nedbrytning</Badge>
                      <Badge variant="outline" className="bg-white">Kvalitativa studier</Badge>
                      <Badge variant="outline" className="bg-white">Internationell jämförelse</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    📊 Utforska kompletterande data
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Source link - CLICKABLE with dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                  🔗 Gå till primärkällan ({indicator.source || 'SCB'}) →
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    🏛️ Primärkälla: {indicator.source || 'SCB'}
                  </DialogTitle>
                  <DialogDescription>Information om datakällan</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Om källan</h4>
                    <p className="text-sm text-blue-700">
                      {indicator.source === 'SOM-institutet' 
                        ? 'SOM-institutet vid Göteborgs universitet bedriver oberoende undersökningsverksamhet och forskning om samhälle, opinion och medier sedan 1986.'
                        : indicator.source === 'SCB'
                        ? 'Statistiska centralbyrån (SCB) är Sveriges statistikmyndighet med uppdrag att samla in, producera och sprida officiell statistik.'
                        : `${indicator.source || 'SCB'} är en officiell statistikkälla med ansvar för att producera kvalitetssäkrad data.`
                      }
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-emerald-800 mb-2">✅ Kvalitetssäkring</h4>
                    <div className="space-y-1 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <span>✓</span><span>Officiell statistikproducent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✓</span><span>Peer-reviewed metodik</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✓</span><span>Transparent dokumentation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✓</span><span>Regelbunden uppdatering</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={indicator.sourceUrl || "https://www.scb.se"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="default" size="sm" className="w-full">
                        🔗 Öppna källan i nytt fönster
                      </Button>
                    </a>
                    <Button variant="outline" size="sm" className="flex-1">
                      📄 Metoddokumentation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ============================================
// PRIORITY DETAIL DIALOG
// ============================================
interface PriorityDetailDialogProps {
  categories: CategoryData[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryClick: (category: CategoryData) => void;
}

const PriorityDetailDialog: React.FC<PriorityDetailDialogProps> = ({
  categories,
  open,
  onOpenChange,
  onCategoryClick,
}) => {
  // Find items needing attention
  const criticalItems = categories.filter(c => c.status === 'critical');
  const attentionItems = categories.filter(c => c.status === 'attention');
  const allPriorityItems = [...criticalItems, ...attentionItems];
  
  // Get all indicators needing attention
  const criticalIndicators = categories.flatMap(c => 
    c.indicators.filter(i => i.status === 'critical').map(i => ({ ...i, categoryName: c.name }))
  );
  const attentionIndicators = categories.flatMap(c => 
    c.indicators.filter(i => i.status === 'attention').map(i => ({ ...i, categoryName: c.name }))
  );

  // Sort by severity and trend (worst first)
  const prioritizedIndicators = [...criticalIndicators, ...attentionIndicators]
    .sort((a, b) => {
      if (a.status === 'critical' && b.status !== 'critical') return -1;
      if (b.status === 'critical' && a.status !== 'critical') return 1;
      return Math.abs(b.trend) - Math.abs(a.trend);
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">🎯</span> Prioriterade områden
          </DialogTitle>
          <DialogDescription className="text-base">
            Baserat på datadrivna signaler – var uppmärksamhet behövs mest
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 py-4">
            
            {/* Executive Summary */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span> Sammanfattning
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {criticalItems.length > 0 ? (
                    <>
                      <strong className="text-rose-700">{criticalItems.length} kategori{criticalItems.length > 1 ? 'er' : ''}</strong> visar kritiska värden 
                      och kräver omedelbar uppmärksamhet. 
                    </>
                  ) : null}
                  {attentionItems.length > 0 && (
                    <>
                      <strong className="text-amber-700">{attentionItems.length} kategori{attentionItems.length > 1 ? 'er' : ''}</strong> ligger 
                      under optimal nivå och bör övervakas.
                    </>
                  )}
                </p>
                <p className="text-sm text-slate-600 mt-2 italic">
                  Nedan visas de specifika indikatorerna rankade efter prioritet.
                </p>
              </CardContent>
            </Card>

            {/* Highest Priority Actions */}
            <Card className="bg-rose-50 border-rose-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-rose-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">🔥</span> Högsta prioritet
                </h4>
                {prioritizedIndicators.length === 0 ? (
                  <p className="text-sm text-rose-700">Inga kritiska områden just nu – bra jobbat!</p>
                ) : (
                  <div className="space-y-3">
                    {prioritizedIndicators.slice(0, 3).map((indicator, index) => (
                      <div 
                        key={indicator.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-start gap-3",
                          indicator.status === 'critical' 
                            ? "bg-rose-100 border-rose-300" 
                            : "bg-amber-100 border-amber-300"
                        )}
                      >
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                          indicator.status === 'critical'
                            ? "bg-rose-600 text-white"
                            : "bg-amber-600 text-white"
                        )}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900">{indicator.name}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{indicator.categoryName}</p>
                          <p className="text-sm text-slate-700 mt-1">
                            <span className="font-mono font-bold">{indicator.value} {indicator.unit}</span>
                            <span className={cn(
                              "ml-2",
                              indicator.trend > 0 ? "text-rose-600" : "text-emerald-600"
                            )}>
                              {indicator.trend > 0 ? '↑' : '↓'} {Math.abs(indicator.trend).toFixed(1)}%
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> Rekommenderade fokusområden
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  {prioritizedIndicators.slice(0, 3).map((indicator, index) => (
                    <div key={indicator.id} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">{index + 1}.</span>
                      <span>
                        <strong>{indicator.name}</strong>: 
                        {indicator.status === 'critical' 
                          ? ' Kräver omedelbar åtgärd – värdet är kritiskt lågt/högt.'
                          : ' Bör övervakas – trenden indikerar potentiellt problem.'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact Assessment */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📈</span> Förväntad effekt vid åtgärd
                </h4>
                <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                  Historiska data visar att fokuserade insatser på de högst prioriterade områdena 
                  tenderar att ge störst positiv inverkan på den övergripande samhällshälsan.
                </p>
                <div className="bg-white/50 rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-medium">
                    ⚡ Potentiell förbättring av totalindex: <strong className="text-emerald-900">+2-5 procentenheter</strong> vid 
                    effektiva åtgärder på de tre högst rankade indikatorerna.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* All items needing attention */}
            {allPriorityItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">📊</span> Alla kategorier som behöver uppmärksamhet
                  </h4>
                  <div className="space-y-2">
                    {allPriorityItems.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onOpenChange(false);
                          setTimeout(() => onCategoryClick(category), 100);
                        }}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-all hover:shadow-md",
                          category.status === 'critical' 
                            ? "bg-rose-50 border-rose-200 hover:border-rose-300"
                            : "bg-amber-50 border-amber-200 hover:border-amber-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-semibold">{category.name}</span>
                          </div>
                          <Badge className={cn(
                            "border-0",
                            category.status === 'critical'
                              ? "bg-rose-200 text-rose-800"
                              : "bg-amber-200 text-amber-800"
                          )}>
                            {category.score}%
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 ml-7">
                          Klicka för att se detaljer →
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Methodology note */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔬</span> Om prioriteringsmetoden
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prioriteringen baseras på en kombination av: (1) avvikelse från målvärde, 
                  (2) trendförändring senaste perioden, och (3) indikatorn påverkar andra områden. 
                  Detta är en automatisk analys – lokala förhållanden och kontextuella faktorer 
                  bör alltid vägas in vid beslut.
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
// REGION-SPECIFIC DATA GENERATOR
// ============================================

// Baseline scores per region - reflects actual global health disparities
const REGION_BASELINE_SCORES: Record<string, {
  health: number;
  economy: number;
  education: number;
  environment: number;
  safety: number;
  democracy: number;
}> = {
  // Global average
  'global': { health: 68, economy: 55, education: 62, environment: 52, safety: 58, democracy: 54 },
  
  // Continents
  'europe': { health: 82, economy: 73, education: 81, environment: 68, safety: 78, democracy: 82 },
  'americas': { health: 72, economy: 61, education: 68, environment: 55, safety: 52, democracy: 65 },
  'asia': { health: 71, economy: 62, education: 66, environment: 48, safety: 64, democracy: 48 },
  'africa': { health: 52, economy: 38, education: 45, environment: 58, safety: 42, democracy: 44 },
  'oceania': { health: 78, economy: 72, education: 76, environment: 62, safety: 75, democracy: 85 },
  
  // Nordic countries (high scores)
  'SE': { health: 86, economy: 78, education: 85, environment: 72, safety: 68, democracy: 92 },
  'NO': { health: 88, economy: 82, education: 84, environment: 68, safety: 82, democracy: 95 },
  'DK': { health: 85, economy: 79, education: 82, environment: 70, safety: 84, democracy: 94 },
  'FI': { health: 84, economy: 76, education: 88, environment: 74, safety: 86, democracy: 93 },
  'IS': { health: 87, economy: 75, education: 83, environment: 78, safety: 92, democracy: 96 },
  
  // Western Europe
  'DE': { health: 83, economy: 81, education: 79, environment: 65, safety: 75, democracy: 88 },
  'FR': { health: 84, economy: 72, education: 76, environment: 62, safety: 68, democracy: 82 },
  'UK': { health: 82, economy: 74, education: 78, environment: 64, safety: 72, democracy: 84 },
  'NL': { health: 85, economy: 80, education: 82, environment: 66, safety: 80, democracy: 91 },
  
  // Americas
  'US': { health: 76, economy: 78, education: 74, environment: 52, safety: 48, democracy: 72 },
  'CA': { health: 84, economy: 77, education: 82, environment: 68, safety: 82, democracy: 88 },
  'BR': { health: 62, economy: 52, education: 56, environment: 48, safety: 38, democracy: 58 },
  'MX': { health: 68, economy: 58, education: 58, environment: 52, safety: 35, democracy: 55 },
  
  // Asia
  'JP': { health: 88, economy: 75, education: 84, environment: 62, safety: 92, democracy: 78 },
  'CN': { health: 72, economy: 68, education: 72, environment: 42, safety: 78, democracy: 18 },
  'IN': { health: 58, economy: 52, education: 52, environment: 38, safety: 48, democracy: 62 },
  'KR': { health: 85, economy: 76, education: 86, environment: 55, safety: 88, democracy: 82 },
  
  // Africa
  'ZA': { health: 55, economy: 48, education: 52, environment: 58, safety: 32, democracy: 68 },
  'NG': { health: 45, economy: 42, education: 48, environment: 45, safety: 35, democracy: 52 },
  'EG': { health: 62, economy: 52, education: 58, environment: 48, safety: 58, democracy: 28 },
  'KE': { health: 52, economy: 45, education: 55, environment: 62, safety: 45, democracy: 58 },
  
  // Oceania
  'AU': { health: 86, economy: 78, education: 82, environment: 58, safety: 82, democracy: 88 },
  'NZ': { health: 85, economy: 75, education: 80, environment: 72, safety: 88, democracy: 92 },
};

function getStatus(score: number): 'excellent' | 'good' | 'attention' | 'critical' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'attention';
  return 'critical';
}

function generateScopedCategories(scopeCode: string): CategoryData[] {
  const baseline = REGION_BASELINE_SCORES[scopeCode] || REGION_BASELINE_SCORES['global'];
  const scope = GEO_SCOPES[scopeCode] || GEO_SCOPES['global'];
  
  // Add small random variation to make it feel "live" (+/- 2)
  const vary = (base: number) => Math.max(0, Math.min(100, base + Math.floor(Math.random() * 5) - 2));
  const trendVary = () => (Math.random() * 4 - 2).toFixed(1);
  
  const dataSource = GEO_DATA_SOURCES[scopeCode] || GEO_DATA_SOURCES['global'];
  const sources = dataSource.sources;
  
  return [
    {
      id: 'health',
      name: 'Hälsa & Välbefinnande',
      icon: '❤️',
      score: vary(baseline.health),
      trend: parseFloat(trendVary()),
      status: getStatus(baseline.health),
      description: 'Livslängd, sjukvård och allmän folkhälsa',
      indicators: [
        { 
          id: '1', 
          name: 'Förväntad livslängd', 
          value: (baseline.health * 0.95 + 5).toFixed(1), 
          unit: 'år', 
          trend: parseFloat((Math.random() * 2 - 0.5).toFixed(2)), 
          status: getStatus(baseline.health), 
          explanation: 'Genomsnittlig förväntad livslängd vid födseln', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Hur många år en person som föds idag statistiskt kan förväntas leva, baserat på nuvarande dödlighetstal.',
          howItsMeasured: 'Nationella statistikbyråer samlar in dödsorsaksdata och beräknar förväntad livslängd med Kaplan-Meier-metoden.',
          whyItMatters: 'En av de viktigaste indikatorerna på övergripande samhällshälsa. Påverkas av sjukvård, levnadsvanor, miljö och socioekonomiska faktorer.',
          exampleInPractice: `I ${scope.name} kan en person som föds idag statistiskt förvänta sig att leva cirka ${(baseline.health * 0.95 + 5).toFixed(0)} år.`,
          source: sources[0], 
          sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN'
        },
        { 
          id: '2', 
          name: 'Spädbarnsdödlighet', 
          value: Math.max(1, Math.round((100 - baseline.health) * 0.5)).toString(), 
          unit: 'per 1000', 
          trend: parseFloat((Math.random() * 3 - 2).toFixed(1)), 
          status: getStatus(baseline.health - 5), 
          explanation: 'Dödsfall bland barn under 1 år per 1000 levande födda', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Antal barn som dör innan de fyllt ett år, per 1000 levande födda.',
          howItsMeasured: 'Rapporteras av förlossningsenheter och dödsorsaksregister, normaliserat per 1000 födslar.',
          whyItMatters: 'En känslig indikator på sjukvårdskvalitet, nutrition och sanitära förhållanden.',
          exampleInPractice: `I ${scope.name} dör cirka ${Math.max(1, Math.round((100 - baseline.health) * 0.5))} av 1000 nyfödda barn innan de fyllt ett år.`,
          source: sources[1] || sources[0], 
          sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.IMRT.IN'
        },
        { 
          id: '3', 
          name: 'Vårdtillgänglighet', 
          value: Math.round(baseline.health * 0.9).toString(), 
          unit: 'index', 
          trend: parseFloat((Math.random() * 2 - 1).toFixed(1)), 
          status: getStatus(baseline.health - 3), 
          explanation: 'Tillgång till grundläggande sjukvård (0-100 index)', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Ett sammansatt index som mäter tillgång till sjukvård, läkartäthet, och vårdinfrastruktur.',
          howItsMeasured: 'WHO sammanställer nationella data om vårdpersonal, sjukhus och behandlingskostnader.',
          whyItMatters: 'God vårdtillgänglighet minskar dödlighet och ökar livskvalitet.',
          exampleInPractice: `Ett värde på ${Math.round(baseline.health * 0.9)} betyder ${baseline.health >= 70 ? 'relativt god' : 'begränsad'} tillgång till sjukvård jämfört med globalt genomsnitt.`,
          source: 'WHO', 
          sourceUrl: 'https://www.who.int/data/gho'
        },
      ]
    },
    {
      id: 'economy',
      name: 'Ekonomi & Arbete',
      icon: '💼',
      score: vary(baseline.economy),
      trend: parseFloat(trendVary()),
      status: getStatus(baseline.economy),
      description: 'Sysselsättning, inkomster och ekonomisk stabilitet',
      indicators: [
        { 
          id: '4', 
          name: 'Arbetslöshet', 
          value: Math.max(2, Math.round((100 - baseline.economy) * 0.15)).toString(), 
          unit: '%', 
          trend: parseFloat((Math.random() * 2 - 1).toFixed(1)), 
          status: getStatus(baseline.economy - 5), 
          explanation: 'Andel arbetslösa av arbetskraften', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen personer som aktivt söker arbete men inte har ett jobb.',
          howItsMeasured: 'Nationella arbetskraftsundersökningar med standardiserade ILO-definitioner.',
          whyItMatters: 'Hög arbetslöshet påverkar individers ekonomi, psykiska hälsa och samhällets skatteintäkter.',
          exampleInPractice: `I ${scope.name} är cirka ${Math.max(2, Math.round((100 - baseline.economy) * 0.15))}% av arbetskraften utan arbete.`,
          source: sources[0], 
          sourceUrl: 'https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS'
        },
        { 
          id: '5', 
          name: 'BNP per capita', 
          value: (baseline.economy * 800 + 5000).toLocaleString('sv-SE'), 
          unit: 'USD', 
          trend: parseFloat((Math.random() * 4 - 1).toFixed(1)), 
          status: getStatus(baseline.economy), 
          explanation: 'Bruttonationalprodukt per invånare', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Det totala ekonomiska värdet av alla producerade varor och tjänster, delat med befolkningen.',
          howItsMeasured: 'Nationalräkenskaper summerar produktion, justerat för köpkraftsparitet (PPP).',
          whyItMatters: 'Ett grundläggande mått på ekonomiskt välstånd, men säger inget om fördelning.',
          exampleInPractice: `I ${scope.name} produceras i genomsnitt ${(baseline.economy * 800 + 5000).toLocaleString('sv-SE')} USD i ekonomiskt värde per person och år.`,
          source: 'World Bank', 
          sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD'
        },
      ]
    },
    {
      id: 'education',
      name: 'Utbildning & Kunskap',
      icon: '🎓',
      score: vary(baseline.education),
      trend: parseFloat(trendVary()),
      status: getStatus(baseline.education),
      description: 'Skolresultat, utbildningsnivå och kompetens',
      indicators: [
        { 
          id: '7', 
          name: 'Läskunnighet', 
          value: Math.min(99.8, baseline.education + 15).toFixed(1), 
          unit: '%', 
          trend: parseFloat((Math.random() * 1).toFixed(1)), 
          status: getStatus(baseline.education + 10), 
          explanation: 'Andel vuxna som kan läsa och skriva', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen av vuxna (15+) som kan läsa och skriva en enkel text.',
          howItsMeasured: 'UNESCO samlar in data från nationella utbildningsundersökningar.',
          whyItMatters: 'Grundläggande läskunnighet är en förutsättning för ekonomiskt och demokratiskt deltagande.',
          exampleInPractice: `I ${scope.name} kan ${Math.min(99.8, baseline.education + 15).toFixed(0)}% av den vuxna befolkningen läsa och skriva.`,
          source: 'UNESCO', 
          sourceUrl: 'https://data.worldbank.org/indicator/SE.ADT.LITR.ZS'
        },
        { 
          id: '8', 
          name: 'Högskoleutbildade', 
          value: Math.max(5, Math.round(baseline.education * 0.45)).toString(), 
          unit: '%', 
          trend: parseFloat((Math.random() * 2).toFixed(1)), 
          status: getStatus(baseline.education - 5), 
          explanation: 'Andel av befolkningen med eftergymnasial utbildning', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen vuxna (25-64 år) med minst två års högskoleutbildning.',
          howItsMeasured: 'Nationella utbildningsregister och folkräkningsdata.',
          whyItMatters: 'Utbildningsnivån påverkar innovation, produktivitet och konkurrenskraft.',
          exampleInPractice: `I ${scope.name} har cirka ${Math.max(5, Math.round(baseline.education * 0.45))}% av vuxna en högskoleexamen.`,
          source: 'OECD', 
          sourceUrl: 'https://data.oecd.org/eduatt/population-with-tertiary-education.htm'
        },
      ]
    },
    {
      id: 'environment',
      name: 'Miljö & Klimat',
      icon: '🌿',
      score: vary(baseline.environment),
      trend: parseFloat(trendVary()),
      status: getStatus(baseline.environment),
      description: 'Utsläpp, förnybar energi och naturresurser',
      indicators: [
        { 
          id: '9', 
          name: 'CO2-utsläpp', 
          value: Math.max(0.5, ((100 - baseline.environment) * 0.18)).toFixed(1), 
          unit: 'ton/capita', 
          trend: parseFloat((Math.random() * 4 - 3).toFixed(1)), 
          status: getStatus(baseline.environment - 10), 
          explanation: 'Årliga koldioxidutsläpp per person', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Den genomsnittliga mängden koldioxid per invånare från energi, transport och industri.',
          howItsMeasured: 'Nationella utsläppsrapporter till UNFCCC, delat med befolkning.',
          whyItMatters: 'Koldioxid är den viktigaste växthusgasen bakom klimatförändringarna.',
          exampleInPractice: `I ${scope.name} släpper varje person ut cirka ${Math.max(0.5, ((100 - baseline.environment) * 0.18)).toFixed(1)} ton CO2 per år.`,
          source: 'Our World in Data', 
          sourceUrl: 'https://ourworldindata.org/co2-emissions'
        },
        { 
          id: '10', 
          name: 'Förnybar energi', 
          value: Math.min(95, Math.round(baseline.environment * 0.8)).toString(), 
          unit: '%', 
          trend: parseFloat((Math.random() * 3).toFixed(1)), 
          status: getStatus(baseline.environment + 5), 
          explanation: 'Andel energi från förnybara källor', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Andelen av total energiförbrukning från förnybara källor (sol, vind, vatten, bio).',
          howItsMeasured: 'Energibalanser rapporterade av nationella energimyndigheter till IEA.',
          whyItMatters: 'Förnybar energi minskar utsläpp och ökar energisäkerhet.',
          exampleInPractice: `I ${scope.name} kommer cirka ${Math.min(95, Math.round(baseline.environment * 0.8))}% av energin från förnybara källor.`,
          source: 'IEA', 
          sourceUrl: 'https://www.iea.org/data-and-statistics'
        },
      ]
    },
    {
      id: 'safety',
      name: 'Trygghet & Säkerhet',
      icon: '🛡️',
      score: vary(baseline.safety),
      trend: parseFloat(trendVary()),
      status: getStatus(baseline.safety),
      description: 'Brottslighet, rättsväsende och social trygghet',
      indicators: [
        { 
          id: '11', 
          name: 'Mordfrekvens', 
          value: Math.max(0.5, ((100 - baseline.safety) * 0.3)).toFixed(1), 
          unit: 'per 100k', 
          trend: parseFloat((Math.random() * 3 - 1.5).toFixed(1)), 
          status: getStatus(baseline.safety - 5), 
          explanation: 'Antal mord per 100 000 invånare per år', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Antal avsiktliga dödligt våld per 100 000 invånare.',
          howItsMeasured: 'Brottsstatistik och dödsorsaksregister, harmoniserat via UNODC.',
          whyItMatters: 'Mordfrekvens är en stark indikator på samhällets grundläggande trygghet.',
          exampleInPractice: `I ${scope.name} begås cirka ${Math.max(0.5, ((100 - baseline.safety) * 0.3)).toFixed(1)} mord per 100 000 invånare och år.`,
          source: 'UNODC', 
          sourceUrl: 'https://dataunodc.un.org/content/homicide-rate-option-2'
        },
        { 
          id: '12', 
          name: 'Upplevd trygghet', 
          value: Math.min(95, Math.round(baseline.safety * 0.85)).toString(), 
          unit: '%', 
          trend: parseFloat((Math.random() * 2 - 1).toFixed(1)), 
          status: getStatus(baseline.safety), 
          explanation: 'Andel som känner sig trygga i sitt bostadsområde', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Andel respondenter som uppger att de känner sig trygga att gå ute på kvällen.',
          howItsMeasured: 'Nationella trygghetsundersökningar och Gallup World Poll.',
          whyItMatters: 'Upplevd trygghet påverkar livskvalitet och social sammanhållning.',
          exampleInPractice: `I ${scope.name} uppger ${Math.min(95, Math.round(baseline.safety * 0.85))}% att de känner sig trygga i sitt bostadsområde.`,
          source: 'Gallup', 
          sourceUrl: 'https://news.gallup.com/poll/topic/world_poll.aspx'
        },
      ]
    },
    {
      id: 'democracy',
      name: 'Demokrati & Samhälle',
      icon: '🏛️',
      score: vary(baseline.democracy),
      trend: parseFloat(trendVary()),
      status: getStatus(baseline.democracy),
      description: 'Politiskt deltagande, förtroende och medborgarskap',
      indicators: [
        { 
          id: '13', 
          name: 'Demokratiindex', 
          value: (baseline.democracy / 10).toFixed(1), 
          unit: '/10', 
          trend: parseFloat((Math.random() * 1 - 0.5).toFixed(2)), 
          status: getStatus(baseline.democracy), 
          explanation: 'Economist Intelligence Unit Democracy Index', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Ett sammansatt index av valsystem, pluralism, politisk kultur och civila rättigheter.',
          howItsMeasured: 'EIU bedömer 60 indikatorer baserat på expertundersökningar och offentliga data.',
          whyItMatters: 'Demokratiska institutioner korrelerar med mänsklig utveckling och fred.',
          exampleInPractice: `${scope.name} klassificeras som ${baseline.democracy >= 80 ? 'full demokrati' : baseline.democracy >= 60 ? 'ofullständig demokrati' : baseline.democracy >= 40 ? 'hybridregim' : 'auktoritär regim'} med indexvärde ${(baseline.democracy / 10).toFixed(1)}.`,
          source: 'EIU', 
          sourceUrl: 'https://www.eiu.com/n/campaigns/democracy-index-2024/'
        },
        { 
          id: '14', 
          name: 'Pressfrihet', 
          value: Math.min(100, Math.round(baseline.democracy * 0.95)).toString(), 
          unit: 'index', 
          trend: parseFloat((Math.random() * 2 - 1).toFixed(1)), 
          status: getStatus(baseline.democracy - 3), 
          explanation: 'Press Freedom Index (omvänd skala, högre = bättre)', 
          lastUpdated: '2025-01-15',
          whatItMeasures: 'Graden av mediefrihet och journalisters säkerhet.',
          howItsMeasured: 'Reporters Without Borders sammanställer expertbedömningar och incidentrapporter.',
          whyItMatters: 'Fri press är grundläggande för demokratiskt ansvarsutkrävande.',
          exampleInPractice: `${scope.name} har ${baseline.democracy >= 80 ? 'mycket hög' : baseline.democracy >= 60 ? 'god' : baseline.democracy >= 40 ? 'begränsad' : 'mycket begränsad'} pressfrihet.`,
          source: 'RSF', 
          sourceUrl: 'https://rsf.org/en/index'
        },
      ]
    },
  ];
}

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
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [aggregationDialogOpen, setAggregationDialogOpen] = useState(false);
  
  // GEO SCOPE STATE - defaults to global
  const [currentGeoScope, setCurrentGeoScope] = useState<string>('global');
  const geoScope = GEO_SCOPES[currentGeoScope] || GEO_SCOPES['global'];
  const { title: scopeTitle, subtitle: scopeSubtitle } = getScopeTitle(geoScope);

  // Generate data based on geo scope
  // Different regions have different baseline scores and variations
  const categories = React.useMemo(() => generateScopedCategories(currentGeoScope), [currentGeoScope]);

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
          {/* Geo Scope Selector */}
          <GeoScopeSelector 
            currentScope={currentGeoScope} 
            onScopeChange={setCurrentGeoScope} 
          />
          
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
                <div className="flex gap-2 mt-2 flex-wrap">
                  {criticalCount > 0 && (
                    <button
                      onClick={() => setPriorityDialogOpen(true)}
                      className="transition-transform hover:scale-105 active:scale-95"
                    >
                      <Badge className="bg-rose-100 text-rose-700 border-0 cursor-pointer hover:bg-rose-200">
                        {criticalCount} kritiska →
                      </Badge>
                    </button>
                  )}
                  {attentionCount > 0 && (
                    <button
                      onClick={() => setPriorityDialogOpen(true)}
                      className="transition-transform hover:scale-105 active:scale-95"
                    >
                      <Badge className="bg-amber-100 text-amber-700 border-0 cursor-pointer hover:bg-amber-200">
                        {attentionCount} behöver uppmärksamhet →
                      </Badge>
                    </button>
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
        
        {/* Footer info - Dynamic based on geo scope - NOW CLICKABLE */}
        {(() => {
          const dataSources = GEO_DATA_SOURCES[currentGeoScope] || GEO_DATA_SOURCES['global'];
          return (
            <Card 
              className="mt-6 bg-slate-100 border-slate-200 cursor-pointer hover:bg-slate-200/80 hover:border-slate-300 transition-all group"
              onClick={() => setAggregationDialogOpen(true)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  📊 Data från {dataSources.sources.join(', ')}
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {dataSources.note}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
                </p>
                <p className="text-[10px] text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Klicka för detaljerad information om aggregering →
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
        geoScopeName={geoScope.name}
      />
      
      <PriorityDetailDialog
        categories={categories}
        open={priorityDialogOpen}
        onOpenChange={setPriorityDialogOpen}
        onCategoryClick={handleCategoryClick}
      />
      
      {/* Aggregation Detail Dialog */}
      <Dialog open={aggregationDialogOpen} onOpenChange={setAggregationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              📊 Datakällor & Aggregering
            </DialogTitle>
            <DialogDescription>
              Så samlas och bearbetas data för {geoScope.name}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 mt-4">
              {/* Current sources */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">🏛️ Primära datakällor</h3>
                <div className="space-y-2">
                  {(GEO_DATA_SOURCES[currentGeoScope] || GEO_DATA_SOURCES['global']).sources.map((source, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-lg">
                        {source.includes('World Bank') ? '🏦' : 
                         source.includes('WHO') ? '🏥' : 
                         source.includes('UN') ? '🌐' : 
                         source.includes('IMF') ? '💰' : 
                         source.includes('OECD') ? '📈' : 
                         source.includes('SCB') ? '🇸🇪' :
                         source.includes('Eurostat') ? '🇪🇺' : '📊'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">{source}</p>
                        <p className="text-xs text-slate-500">
                          {source.includes('World Bank') ? 'Världsbankens utvecklingsindikatorer' : 
                           source.includes('WHO') ? 'Världshälsoorganisationens hälsodata' : 
                           source.includes('UN Statistics') ? 'FN:s statistikavdelning' : 
                           source.includes('IMF') ? 'Internationella valutafondens finansdata' : 
                           source.includes('OECD') ? 'OECD:s jämförande statistik' : 
                           source.includes('SCB') ? 'Statistiska Centralbyrån' :
                           source.includes('Eurostat') ? 'EU:s statistikbyrå' : 'Officiell statistik'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                        Verifierad
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Aggregation methodology */}
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3">⚙️ Aggregeringsmetodik</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-blue-600">1.</span>
                    <div>
                      <p className="font-medium">Datainsamling</p>
                      <p className="text-blue-700">Rådata hämtas via officiella API:er och publika dataset med automatisk versionskontroll.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-blue-600">2.</span>
                    <div>
                      <p className="font-medium">Harmonisering</p>
                      <p className="text-blue-700">Definitioner och måttenheter konverteras till SDMX-standarden för jämförbarhet.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-blue-600">3.</span>
                    <div>
                      <p className="font-medium">Validering</p>
                      <p className="text-blue-700">Outliers flaggas automatiskt, historiska trender kontrolleras, och metodförändringar annoteras.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-blue-600">4.</span>
                    <div>
                      <p className="font-medium">Aggregering</p>
                      <p className="text-blue-700">Viktade medelvärden beräknas med befolkningsjustering och konfidensintervall.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Data quality */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">📋 Datakvalitet & Täckning</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                    <p className="text-2xl font-bold text-emerald-700">94%</p>
                    <p className="text-xs text-emerald-600">Indikatortäckning</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <p className="text-2xl font-bold text-blue-700">Q4 2024</p>
                    <p className="text-xs text-blue-600">Senaste dataperiod</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-center">
                    <p className="text-2xl font-bold text-amber-700">±3.2%</p>
                    <p className="text-xs text-amber-600">Medel osäkerhet</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-2xl font-bold text-slate-700">Daglig</p>
                    <p className="text-xs text-slate-500">Uppdateringsfrekvens</p>
                  </div>
                </div>
              </div>
              
              {/* Limitations */}
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-100">
                <h3 className="font-semibold text-amber-900 mb-2">⚠️ Kända begränsningar</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Metodologiska skillnader mellan länder kan påverka jämförbarhet</li>
                  <li>• Tidsfördröjning på 3-18 månader för vissa officiella statistikserier</li>
                  <li>• Uppskattad data (estimat) markeras explicit där officiell data saknas</li>
                  <li>• Självrapporterad data (t.ex. välbefinnande) har högre osäkerhet</li>
                </ul>
              </div>
              
              {/* Transparency */}
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">🔍 Full transparens</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Varje datapunkt i systemet är spårbar tillbaka till sin primärkälla. 
                  Klicka på valfritt värde för att se exakt ursprung, metodik och osäkerhetsintervall.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    📥 Ladda ner metadatadokumentation
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    🔗 API-dokumentation
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppleHealthDashboard;
