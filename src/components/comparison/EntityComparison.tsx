/**
 * Entity Comparison Component
 * 
 * Compare 2-5 countries/cities on ONE indicator
 * 
 * Rules:
 * - Same scale
 * - Same time period
 * - Same method
 * - Same definition
 * 
 * System BLOCKS comparisons with different definitions/methodology
 */

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMPARISON_RULES } from '@/config/extremeClarityVisuals';

// ============================================
// TYPES
// ============================================

interface Entity {
  code: string;
  name: string;
  nameSv: string;
  type: 'country' | 'city';
  region?: string;
}

interface Indicator {
  code: string;
  name: string;
  nameSv: string;
  unit: string;
  definition: string;
  methodology: string;
}

interface ComparisonData {
  entityCode: string;
  value: number;
  period: string;
  methodology: string;
  definition: string;
  isComparable: boolean;
  incompatibilityReason?: string;
}

interface EntityComparisonProps {
  availableEntities: Entity[];
  availableIndicators: Indicator[];
  fetchData: (entityCodes: string[], indicatorCode: string) => Promise<ComparisonData[]>;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function EntityComparison({
  availableEntities,
  availableIndicators,
  fetchData,
  className,
}: EntityComparisonProps) {
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<ComparisonData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCompare = selectedEntities.length >= COMPARISON_RULES.selectionLimits.min &&
                     selectedEntities.length <= COMPARISON_RULES.selectionLimits.max &&
                     selectedIndicator !== '';

  async function handleCompare() {
    if (!canCompare) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchData(selectedEntities, selectedIndicator);
      setComparisonData(data);
    } catch {
      setError('Could not fetch comparison data');
    } finally {
      setIsLoading(false);
    }
  }

  function addEntity(code: string) {
    if (selectedEntities.length < COMPARISON_RULES.selectionLimits.max) {
      setSelectedEntities([...selectedEntities, code]);
      setComparisonData(null);
    }
  }

  function removeEntity(code: string) {
    setSelectedEntities(selectedEntities.filter(e => e !== code));
    setComparisonData(null);
  }

  // Check for incompatibilities
  const incompatibilities = useMemo(() => {
    if (!comparisonData) return [];
    return comparisonData.filter(d => !d.isComparable);
  }, [comparisonData]);

  const hasIncompatibilities = incompatibilities.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Jämför länder & städer</h2>
        <p className="text-sm text-muted-foreground">
          Välj 2–5 enheter och en indikator. Systemet blockerar ojämförbara kombinationer.
        </p>
      </div>

      {/* Entity selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
          Enheter ({selectedEntities.length}/{COMPARISON_RULES.selectionLimits.max})
        </label>
        
        {/* Selected entities */}
        <div className="flex flex-wrap gap-2">
          {selectedEntities.map(code => {
            const entity = availableEntities.find(e => e.code === code);
            return (
              <div 
                key={code}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{entity?.nameSv || code}</span>
                <button onClick={() => removeEntity(code)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add entity */}
        {selectedEntities.length < COMPARISON_RULES.selectionLimits.max && (
          <Select onValueChange={addEntity}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Lägg till enhet..." />
            </SelectTrigger>
            <SelectContent>
              {availableEntities
                .filter(e => !selectedEntities.includes(e.code))
                .map(entity => (
                  <SelectItem key={entity.code} value={entity.code}>
                    {entity.nameSv} ({entity.type === 'country' ? 'Land' : 'Stad'})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Indicator selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Indikator</label>
        <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Välj indikator..." />
          </SelectTrigger>
          <SelectContent>
            {availableIndicators.map(ind => (
              <SelectItem key={ind.code} value={ind.code}>
                {ind.nameSv} ({ind.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Compare button */}
      <Button 
        onClick={handleCompare} 
        disabled={!canCompare || isLoading}
        className="w-full max-w-xs"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        {isLoading ? 'Laddar...' : 'Jämför'}
      </Button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Incompatibility warnings */}
      {hasIncompatibilities && (
        <IncompatibilityWarning incompatibilities={incompatibilities} />
      )}

      {/* Results */}
      {comparisonData && !hasIncompatibilities && (
        <ComparisonResults 
          data={comparisonData}
          entities={availableEntities.filter(e => selectedEntities.includes(e.code))}
          indicator={availableIndicators.find(i => i.code === selectedIndicator)!}
        />
      )}
    </div>
  );
}

// ============================================
// INCOMPATIBILITY WARNING
// ============================================

function IncompatibilityWarning({ incompatibilities }: { incompatibilities: ComparisonData[] }) {
  return (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg space-y-3">
      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Kan inte jämföras</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Följande enheter kan inte jämföras på grund av metodskillnader:
      </p>
      
      <ul className="text-sm space-y-2">
        {incompatibilities.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>
              <strong>{item.entityCode}</strong>: {item.incompatibilityReason}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground italic">
        "{COMPARISON_RULES.principle}"
      </p>
    </div>
  );
}

// ============================================
// COMPARISON RESULTS
// ============================================

interface ComparisonResultsProps {
  data: ComparisonData[];
  entities: Entity[];
  indicator: Indicator;
}

function ComparisonResults({ data, entities, indicator }: ComparisonResultsProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-semibold">{indicator.nameSv}</h3>
        <p className="text-sm text-muted-foreground">{indicator.definition}</p>
      </div>

      {/* Verification badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1 px-2 py-1 bg-status-positive/10 text-status-positive rounded">
          <Check className="h-3 w-3" /> Samma skala
        </span>
        <span className="flex items-center gap-1 px-2 py-1 bg-status-positive/10 text-status-positive rounded">
          <Check className="h-3 w-3" /> Samma period
        </span>
        <span className="flex items-center gap-1 px-2 py-1 bg-status-positive/10 text-status-positive rounded">
          <Check className="h-3 w-3" /> Samma metod
        </span>
      </div>

      {/* Bar chart */}
      <div className="space-y-3">
        {sortedData.map((item, i) => {
          const entity = entities.find(e => e.code === item.entityCode);
          const barWidth = ((item.value - minValue) / (maxValue - minValue)) * 100;
          
          return (
            <div key={item.entityCode} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {i + 1}. {entity?.nameSv || item.entityCode}
                </span>
                <span className="font-mono">
                  {item.value.toFixed(1)} {indicator.unit}
                </span>
              </div>
              <div className="h-6 bg-muted rounded overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.max(barWidth, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Period info */}
      <p className="text-xs text-muted-foreground">
        Period: {sortedData[0]?.period} • Källa: {indicator.methodology}
      </p>
    </div>
  );
}

// ============================================
// DEMO
// ============================================

export function EntityComparisonDemo() {
  const entities: Entity[] = [
    { code: 'SE', name: 'Sweden', nameSv: 'Sverige', type: 'country', region: 'Nordics' },
    { code: 'NO', name: 'Norway', nameSv: 'Norge', type: 'country', region: 'Nordics' },
    { code: 'DK', name: 'Denmark', nameSv: 'Danmark', type: 'country', region: 'Nordics' },
    { code: 'FI', name: 'Finland', nameSv: 'Finland', type: 'country', region: 'Nordics' },
    { code: 'DE', name: 'Germany', nameSv: 'Tyskland', type: 'country', region: 'Central Europe' },
    { code: 'FR', name: 'France', nameSv: 'Frankrike', type: 'country', region: 'Western Europe' },
  ];

  const indicators: Indicator[] = [
    { 
      code: 'unemployment', 
      name: 'Unemployment', 
      nameSv: 'Arbetslöshet', 
      unit: '%',
      definition: 'Andel av arbetskraften som är arbetslös enligt ILO-definition',
      methodology: 'Eurostat LFS'
    },
    { 
      code: 'life-expectancy', 
      name: 'Life expectancy', 
      nameSv: 'Medellivslängd', 
      unit: 'år',
      definition: 'Förväntad livslängd vid födseln',
      methodology: 'WHO/Eurostat'
    },
    { 
      code: 'gdp-per-capita', 
      name: 'GDP per capita', 
      nameSv: 'BNP per capita', 
      unit: 'EUR',
      definition: 'Bruttonationalprodukt per invånare, köpkraftsjusterat',
      methodology: 'Eurostat/World Bank'
    },
  ];

  async function mockFetchData(entityCodes: string[], indicatorCode: string): Promise<ComparisonData[]> {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    
    const mockValues: Record<string, Record<string, number>> = {
      unemployment: { SE: 7.2, NO: 3.5, DK: 5.1, FI: 7.8, DE: 5.9, FR: 7.1 },
      'life-expectancy': { SE: 82.4, NO: 83.1, DK: 81.3, FI: 81.8, DE: 80.9, FR: 82.0 },
      'gdp-per-capita': { SE: 52000, NO: 67000, DK: 58000, FI: 48000, DE: 51000, FR: 45000 },
    };

    return entityCodes.map(code => ({
      entityCode: code,
      value: mockValues[indicatorCode]?.[code] || 0,
      period: '2024',
      methodology: 'Standard EU methodology',
      definition: 'Standard definition',
      isComparable: true,
    }));
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <EntityComparison
        availableEntities={entities}
        availableIndicators={indicators}
        fetchData={mockFetchData}
      />
    </div>
  );
}
