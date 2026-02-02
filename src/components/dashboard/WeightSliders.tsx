import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target, Scale, AlertTriangle, RotateCcw, RotateCw, Save, 
  Loader2, Check, Trash2, Star 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useEvaluationWeights, EvaluationWeights } from '@/hooks/useEvaluationWeights';

interface Weights {
  effect: number;
  cost: number;
  risk: number;
  reversibility: number;
}

interface WeightSlidersProps {
  initialWeights?: Weights;
  onChange?: (weights: Weights) => void;
  showFormula?: boolean;
  enablePersistence?: boolean;
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
  showFormula = true,
  enablePersistence = true,
}: WeightSlidersProps) {
  const [weights, setWeights] = useState<Weights>(initialWeights);
  const [isModified, setIsModified] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const { 
    weights: savedWeights, 
    activeWeights,
    isLoading, 
    isSaving,
    saveWeights,
    setActiveWeight,
    deleteWeights,
  } = useEvaluationWeights();

  // Sync with active weights from database
  useEffect(() => {
    if (activeWeights && enablePersistence) {
      setWeights({
        effect: Math.round(activeWeights.effect_weight * 100),
        cost: Math.round(activeWeights.cost_weight * 100),
        risk: Math.round(activeWeights.risk_weight * 100),
        reversibility: Math.round(activeWeights.reversibility_weight * 100),
      });
    }
  }, [activeWeights, enablePersistence]);

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
    const newTotal = normalized.effect + normalized.cost + normalized.risk + normalized.reversibility;
    if (newTotal !== 100) {
      normalized.effect += (100 - newTotal);
    }
    setWeights(normalized);
    setIsModified(true);
    onChange?.(normalized);
  };

  const resetToDefault = () => {
    setWeights(DEFAULT_WEIGHTS);
    setIsModified(false);
    onChange?.(DEFAULT_WEIGHTS);
  };

  const handleSaveWeights = async () => {
    if (!presetName.trim()) return;
    
    await saveWeights({
      name: presetName,
      effect_weight: weights.effect / 100,
      cost_weight: weights.cost / 100,
      risk_weight: weights.risk / 100,
      reversibility_weight: weights.reversibility / 100,
    });
    
    setPresetName('');
    setShowSaveForm(false);
    setIsModified(false);
  };

  const handleLoadPreset = async (preset: EvaluationWeights) => {
    setWeights({
      effect: Math.round(preset.effect_weight * 100),
      cost: Math.round(preset.cost_weight * 100),
      risk: Math.round(preset.risk_weight * 100),
      reversibility: Math.round(preset.reversibility_weight * 100),
    });
    await setActiveWeight(preset.id);
    setIsModified(false);
    onChange?.({
      effect: Math.round(preset.effect_weight * 100),
      cost: Math.round(preset.cost_weight * 100),
      risk: Math.round(preset.risk_weight * 100),
      reversibility: Math.round(preset.reversibility_weight * 100),
    });
  };

  const userPresets = savedWeights.filter(w => w.user_id !== null);
  const systemPresets = savedWeights.filter(w => w.user_id === null);

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
            {enablePersistence && isModified && (
              <Button 
                size="sm" 
                onClick={() => setShowSaveForm(true)}
                disabled={total !== 100}
              >
                <Save className="w-4 h-4 mr-1" />
                Spara
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Saved presets */}
        {enablePersistence && (userPresets.length > 0 || systemPresets.length > 0) && (
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Sparade vikter
            </Label>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {systemPresets.map((preset) => (
                    <PresetBadge
                      key={preset.id}
                      preset={preset}
                      isActive={activeWeights?.id === preset.id}
                      onLoad={handleLoadPreset}
                      canDelete={false}
                    />
                  ))}
                  {userPresets.map((preset) => (
                    <PresetBadge
                      key={preset.id}
                      preset={preset}
                      isActive={activeWeights?.id === preset.id}
                      onLoad={handleLoadPreset}
                      onDelete={deleteWeights}
                      canDelete={true}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Save form */}
        {showSaveForm && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Input
              placeholder="Namn på viktkonfiguration..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1"
            />
            <Button 
              size="sm" 
              onClick={handleSaveWeights}
              disabled={!presetName.trim() || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSaveForm(false)}
            >
              Avbryt
            </Button>
          </div>
        )}

        {enablePersistence && <Separator />}

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

function PresetBadge({ 
  preset, 
  isActive, 
  onLoad, 
  onDelete,
  canDelete 
}: { 
  preset: EvaluationWeights;
  isActive: boolean;
  onLoad: (preset: EvaluationWeights) => void;
  onDelete?: (id: string) => void;
  canDelete: boolean;
}) {
  return (
    <Badge 
      variant={isActive ? "default" : "outline"}
      className="gap-1 cursor-pointer group pr-1"
      onClick={() => onLoad(preset)}
    >
      {isActive && <Star className="h-3 w-3 fill-current" />}
      {preset.name}
      {canDelete && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(preset.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </Badge>
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
