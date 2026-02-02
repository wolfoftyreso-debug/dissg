import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  HUMAN_INDICATORS, 
  getOrderedIndicators,
  type HumanBaseLayerIndicators,
  type LivingStandardsSnapshot
} from '@/lib/living-standards';
import { ArrowRight, Equal, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CompareViewProps {
  snapshotA?: LivingStandardsSnapshot;
  snapshotB?: LivingStandardsSnapshot;
  availableCountries: { code: string; name: string }[];
  availableYears: number[];
  onSelectA: (countryCode: string, year: number) => void;
  onSelectB: (countryCode: string, year: number) => void;
}

function ComparisonRow({
  indicatorId,
  valueA,
  valueB,
  index
}: {
  indicatorId: keyof HumanBaseLayerIndicators;
  valueA: number | null;
  valueB: number | null;
  index: number;
}) {
  const meta = HUMAN_INDICATORS[indicatorId];
  
  const getDifference = () => {
    if (valueA === null || valueB === null) return null;
    const diff = valueB - valueA;
    const percentDiff = valueA !== 0 ? (diff / valueA) * 100 : 0;
    return { diff, percentDiff };
  };
  
  const difference = getDifference();
  
  const getDirectionIcon = () => {
    if (!difference) return <Equal className="w-4 h-4 text-muted-foreground" />;
    
    // For indicators where higher is better
    if (meta.higherIsBetter) {
      if (difference.diff > 0) return <TrendingUp className="w-4 h-4 text-chart-2" />;
      if (difference.diff < 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    } else {
      // For indicators where lower is better (like infant mortality)
      if (difference.diff < 0) return <TrendingUp className="w-4 h-4 text-chart-2" />;
      if (difference.diff > 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    }
    return <Equal className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-3 border-b border-border last:border-0"
    >
      {/* Value A */}
      <div className="text-right">
        {valueA !== null ? (
          <span className="text-lg font-semibold tabular-nums">
            {valueA.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">–</span>
        )}
        <span className="text-xs text-muted-foreground ml-1">{meta.unit}</span>
      </div>
      
      {/* Indicator name and direction */}
      <div className="flex flex-col items-center gap-1 min-w-[120px]">
        <span className="text-xs font-medium text-center">{meta.nameShort}</span>
        {getDirectionIcon()}
        {difference && (
          <span className={cn(
            "text-xs tabular-nums",
            difference.percentDiff > 0 ? "text-chart-2" : 
            difference.percentDiff < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {difference.percentDiff > 0 ? '+' : ''}{difference.percentDiff.toFixed(0)}%
          </span>
        )}
      </div>
      
      {/* Value B */}
      <div className="text-left">
        {valueB !== null ? (
          <span className="text-lg font-semibold tabular-nums">
            {valueB.toLocaleString('sv-SE', { maximumFractionDigits: 1 })}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">–</span>
        )}
        <span className="text-xs text-muted-foreground ml-1">{meta.unit}</span>
      </div>
    </motion.div>
  );
}

export function CompareView({
  snapshotA,
  snapshotB,
  availableCountries,
  availableYears,
  onSelectA,
  onSelectB
}: CompareViewProps) {
  const [countryA, setCountryA] = useState(snapshotA?.countryCode || '');
  const [yearA, setYearA] = useState(snapshotA?.year.toString() || '');
  const [countryB, setCountryB] = useState(snapshotB?.countryCode || '');
  const [yearB, setYearB] = useState(snapshotB?.year.toString() || '');
  
  const orderedIndicators = getOrderedIndicators();
  
  const handleApply = () => {
    if (countryA && yearA) onSelectA(countryA, parseInt(yearA));
    if (countryB && yearB) onSelectB(countryB, parseInt(yearB));
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Jämför levnadsstandard</h2>
        <p className="text-sm text-muted-foreground">
          Hur levde en genomsnittlig person i två olika sammanhang?
        </p>
      </div>

      {/* Selectors */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        {/* Selection A */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Person A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={countryA} onValueChange={setCountryA}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Välj land" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map(c => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearA} onValueChange={setYearA}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Välj år" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Selection B */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Person B</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={countryB} onValueChange={setCountryB}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Välj land" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map(c => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearB} onValueChange={setYearB}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Välj år" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={handleApply} 
        className="w-full min-h-[44px]"
        disabled={!countryA || !yearA || !countryB || !yearB}
      >
        Jämför
      </Button>

      {/* Comparison results */}
      <AnimatePresence mode="wait">
        {snapshotA && snapshotB && (
          <motion.div
            key={`${snapshotA.id}-${snapshotB.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Headers */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 text-center">
              <div>
                <p className="font-medium">{snapshotA.countryName}</p>
                <p className="text-sm text-muted-foreground">{snapshotA.year}</p>
              </div>
              <div className="min-w-[120px]" />
              <div>
                <p className="font-medium">{snapshotB.countryName}</p>
                <p className="text-sm text-muted-foreground">{snapshotB.year}</p>
              </div>
            </div>

            {/* Comparison rows */}
            <Card>
              <CardContent className="py-4">
                {orderedIndicators.map((indicatorId, index) => (
                  <ComparisonRow
                    key={indicatorId}
                    indicatorId={indicatorId}
                    valueA={snapshotA.indicators[indicatorId]}
                    valueB={snapshotB.indicators[indicatorId]}
                    index={index}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Comparability note */}
            <Card className="bg-muted/30">
              <CardContent className="py-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Om denna jämförelse:</p>
                <p>
                  Samma indikatorer, samma enheter, samma skala. Skillnader visar förändring i B jämfört med A.
                  Grön pil = bättre enligt indikatordefinitionen. Data från respektive lands officiella statistik.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
