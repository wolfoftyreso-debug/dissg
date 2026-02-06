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
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{indicator.name}</DialogTitle>
          <DialogDescription>{indicator.explanation}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
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
            
            {/* Info cards */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">📅 Senast uppdaterad</span>
                  <span className="font-medium">{indicator.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">📍 Geografiskt område</span>
                  <span className="font-medium">Sverige, nationellt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">🔄 Uppdateringsfrekvens</span>
                  <span className="font-medium">Månadsvis</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-900 mb-2">⚠️ Vad detta inte visar</h4>
                <p className="text-sm text-amber-800">
                  Detta mätvärde visar bara det som går att mäta statistiskt. 
                  Bakomliggande orsaker, individuella variationer och regionala 
                  skillnader kräver djupare analys.
                </p>
              </CardContent>
            </Card>
            
            <a 
              href="https://www.scb.se" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                🔗 Gå till primärkällan (SCB) →
              </Button>
            </a>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

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

  // Mock data
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
        { id: '1', name: 'Förväntad livslängd', value: '83.1', unit: 'år', trend: 0.12, status: 'excellent', explanation: 'Genomsnittlig förväntad livslängd vid födseln', lastUpdated: '2025-01-15' },
        { id: '2', name: 'Överdödlighet', value: '4.2', unit: '%', trend: 10.5, status: 'attention', explanation: 'Dödlighet över förväntad baslinjen', lastUpdated: '2025-01-15' },
        { id: '3', name: 'Vårdkötid', value: '89', unit: 'dagar', trend: 5.3, status: 'attention', explanation: 'Medianväntetid för specialistvård', lastUpdated: '2025-01-15' },
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
        { id: '4', name: 'Arbetslöshet', value: '7.8', unit: '%', trend: 1.2, status: 'attention', explanation: 'Andel arbetslösa av arbetskraften', lastUpdated: '2025-01-15' },
        { id: '5', name: 'Medianinkomst', value: '32,400', unit: 'kr', trend: 2.1, status: 'good', explanation: 'Median månadslön före skatt', lastUpdated: '2025-01-15' },
        { id: '6', name: 'BNP-tillväxt', value: '1.2', unit: '%', trend: -0.5, status: 'attention', explanation: 'Årlig ekonomisk tillväxt', lastUpdated: '2025-01-15' },
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
        { id: '7', name: 'Gymnasiebehörighet', value: '84.2', unit: '%', trend: -0.3, status: 'good', explanation: 'Andel elever som uppnår gymnasiebehörighet', lastUpdated: '2025-01-15' },
        { id: '8', name: 'Högskoleutbildade', value: '43.1', unit: '%', trend: 0.8, status: 'good', explanation: 'Andel av befolkningen med eftergymnasial utbildning', lastUpdated: '2025-01-15' },
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
        { id: '9', name: 'CO2-utsläpp', value: '4.2', unit: 'ton/capita', trend: -3.2, status: 'good', explanation: 'Årliga koldioxidutsläpp per person', lastUpdated: '2025-01-15' },
        { id: '10', name: 'Förnybar energi', value: '56.4', unit: '%', trend: 2.1, status: 'excellent', explanation: 'Andel energi från förnybara källor', lastUpdated: '2025-01-15' },
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
        { id: '11', name: 'Anmälda brott', value: '14,200', unit: 'per 100k', trend: 3.5, status: 'attention', explanation: 'Antal anmälda brott per 100 000 invånare', lastUpdated: '2025-01-15' },
        { id: '12', name: 'Uppklarade brott', value: '18.2', unit: '%', trend: -1.2, status: 'critical', explanation: 'Andel brott som leder till åtal', lastUpdated: '2025-01-15' },
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
        { id: '13', name: 'Valdeltagande', value: '87.2', unit: '%', trend: 0.5, status: 'excellent', explanation: 'Andel röstande i senaste riksdagsvalet', lastUpdated: '2025-01-15' },
        { id: '14', name: 'Institutionsförtroende', value: '62.3', unit: '%', trend: -1.8, status: 'good', explanation: 'Andel med förtroende för offentliga institutioner', lastUpdated: '2025-01-15' },
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
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Samhällets Hälsa</h1>
              <p className="text-slate-600 text-sm mt-1">
                Hur mår Sverige just nu? Klicka för att utforska.
              </p>
            </div>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              Logga in
            </Link>
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
        
        {/* Footer info */}
        <Card className="mt-6 bg-slate-100 border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-slate-600">
              📊 Data från Statistiska Centralbyrån (SCB), 
              Socialstyrelsen, Brottsförebyggande rådet m.fl.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
            </p>
          </CardContent>
        </Card>
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
