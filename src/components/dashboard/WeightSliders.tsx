import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Scale, AlertTriangle, RotateCcw, RotateCw, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Weights {
  effect: number;
  cost: number;
  risk: number;
  reversibility: number;
}

interface WeightSlidersProps {
  initialWeights?: Weights;
  onChange?: (weights: Weights) => void;
  onSave?: (weights: Weights) => void;
  showFormula?: boolean;
}

const DEFAULT_WEIGHTS: Weights = {
  effect: 40,
  cost: 25,
  risk: 20,
  reversibility: 15,
};

const DIMENSION_CONFIG = {
  effect: {
    label: 'Effekt',
    description: 'Förväntad positiv påverkan på målindikatorerna',
    icon: Target,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
  },
  cost: {
    label: 'Kostnadseffektivitet',
    description: 'Nytta i förhållande till kostnad',
    icon: Scale,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  risk: {
    label: 'Risk (inverterad)',
    description: 'Lägre risk ger högre poäng',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
  },
  reversibility: {
    label: 'Reversibilitet',
    description: 'Möjlighet att ångra vid misslyckande',
    icon: RotateCcw,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
};

export function WeightSliders({ 
  initialWeights = DEFAULT_WEIGHTS,
  onChange,
  onSave,
  showFormula = true,
}: WeightSlidersProps) {
  const [weights, setWeights] = useState<Weights>(initialWeights);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setWeights(initialWeights);
  }, [initialWeights]);

  const total = weights.effect + weights.cost + weights.risk + weights.reversibility;

  const handleWeightChange = (dimension: keyof Weights, value: number[]) => {
    const newWeight = value[0];
    const newWeights = { ...weights, [dimension]: newWeight };
    setWeights(newWeights);
    setIsModified(true);
    onChange?.(newWeights);
  };

  const normalizeWeights = () => {
    const factor = 100 / total;
    const normalized: Weights = {
      effect: Math.round(weights.effect * factor),
      cost: Math.round(weights.cost * factor),
      risk: Math.round(weights.risk * factor),
      reversibility: Math.round(weights.reversibility * factor),
    };
    // Justera för avrundningsfel
    const newTotal = normalized.effect + normalized.cost + normalized.risk + normalized.reversibility;
    if (newTotal !== 100) {
      normalized.effect += (100 - newTotal);
    }
    setWeights(normalized);
    onChange?.(normalized);
  };

  const resetToDefault = () => {
    setWeights(DEFAULT_WEIGHTS);
    setIsModified(false);
    onChange?.(DEFAULT_WEIGHTS);
  };

  const handleSave = () => {
    onSave?.(weights);
    setIsModified(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Viktningsformel</CardTitle>
          <div className="flex items-center gap-2">
            {total !== 100 && (
              <Button variant="outline" size="sm" onClick={normalizeWeights}>
                Normalisera ({total}% → 100%)
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={resetToDefault}>
              <RotateCw className="w-4 h-4 mr-1" />
              Återställ
            </Button>
            {onSave && isModified && (
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Spara
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formula display */}
        {showFormula && (
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
            <div className="text-muted-foreground mb-2">Poäng =</div>
            <div className="flex flex-wrap items-center gap-2">
              <FormulaComponent 
                label="E" 
                weight={weights.effect} 
                color="text-emerald-600" 
              />
              <span className="text-muted-foreground">+</span>
              <FormulaComponent 
                label="K" 
                weight={weights.cost} 
                color="text-blue-600" 
              />
              <span className="text-muted-foreground">+</span>
              <span className="text-amber-600">(100 - R)</span>
              <span className="text-muted-foreground">×</span>
              <span className="font-bold">{(weights.risk / 100).toFixed(2)}</span>
              <span className="text-muted-foreground">+</span>
              <FormulaComponent 
                label="Rev" 
                weight={weights.reversibility} 
                color="text-purple-600" 
              />
            </div>
          </div>
        )}

        {/* Sliders */}
        <div className="space-y-5">
          {(Object.entries(DIMENSION_CONFIG) as [keyof Weights, typeof DIMENSION_CONFIG.effect][]).map(
            ([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${config.bgColor}/10`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <Label className="font-medium">{config.label}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold tabular-nums">
                        {weights[key]}
                      </span>
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[weights[key]]}
                    onValueChange={(value) => handleWeightChange(key, value)}
                    max={60}
                    min={5}
                    step={5}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              );
            }
          )}
        </div>

        {/* Total indicator */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${
          total === 100 ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
        }`}>
          <span className="text-sm font-medium">Total viktning</span>
          <span className={`text-lg font-bold ${
            total === 100 ? 'text-green-600' : 'text-amber-600'
          }`}>
            {total}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function FormulaComponent({ 
  label, 
  weight, 
  color 
}: { 
  label: string; 
  weight: number; 
  color: string;
}) {
  return (
    <>
      <span className={color}>{label}</span>
      <span className="text-muted-foreground">×</span>
      <span className="font-bold">{(weight / 100).toFixed(2)}</span>
    </>
  );
}

export default WeightSliders;
