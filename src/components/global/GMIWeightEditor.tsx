import React, { useState } from 'react';
import { gmiPillars, weightPresets, validateWeights, defaultGMIConfig } from '@/config/gmiConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings2, 
  RotateCcw, 
  AlertTriangle,
  Check,
  Info
} from 'lucide-react';

interface GMIWeightEditorProps {
  currentWeights: Record<string, number>;
  onWeightsChange: (weights: Record<string, number>) => void;
  countryCode?: string;
  isLocked?: boolean;
  className?: string;
}

export function GMIWeightEditor({
  currentWeights,
  onWeightsChange,
  countryCode,
  isLocked = false,
  className,
}: GMIWeightEditorProps) {
  const [weights, setWeights] = useState<Record<string, number>>(currentWeights);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const defaultWeights = gmiPillars.reduce((acc, p) => {
    acc[p.id] = p.defaultWeight;
    return acc;
  }, {} as Record<string, number>);

  const handleWeightChange = (pillarId: string, value: number) => {
    const newWeights = { ...weights, [pillarId]: value };
    setWeights(newWeights);
    setSelectedPreset(null);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = weightPresets.find(p => p.id === presetId);
    if (preset) {
      setWeights(preset.weights);
      setSelectedPreset(presetId);
    }
  };

  const handleReset = () => {
    setWeights(defaultWeights);
    setSelectedPreset('global_standard');
  };

  const handleApply = () => {
    if (validateWeights(weights)) {
      onWeightsChange(weights);
    }
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const isValid = Math.abs(totalWeight - 1.0) < 0.001;
  
  // Check if weights are within allowed deviation
  const isWithinLimits = gmiPillars.every(p => {
    const deviation = Math.abs(weights[p.id] - p.defaultWeight);
    return deviation <= defaultGMIConfig.weightAdjustmentLimit;
  });

  // Get applicable presets for this country
  const applicablePresets = weightPresets.filter(p => 
    p.applicableTo.includes('global') || 
    (countryCode && p.applicableTo.includes(countryCode))
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              GMI Vikter
            </CardTitle>
            <CardDescription>
              Anpassa hur pelarna viktas i indexet
            </CardDescription>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset}
            disabled={isLocked}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Återställ
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preset selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Förinställning</label>
          <Select
            value={selectedPreset || ''}
            onValueChange={handlePresetSelect}
            disabled={isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Välj förinställning..." />
            </SelectTrigger>
            <SelectContent>
              {applicablePresets.map(preset => (
                <SelectItem key={preset.id} value={preset.id}>
                  <div>
                    <span>{preset.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {preset.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weight sliders */}
        <div className="space-y-4">
          {gmiPillars.map(pillar => {
            const weight = weights[pillar.id] || pillar.defaultWeight;
            const deviation = weight - pillar.defaultWeight;
            const isDeviating = Math.abs(deviation) > 0.001;
            const isOverLimit = Math.abs(deviation) > defaultGMIConfig.weightAdjustmentLimit;
            
            return (
              <div key={pillar.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pillar.icon}</span>
                    <span className="font-medium">{pillar.name}</span>
                    {isDeviating && (
                      <Badge 
                        variant="outline" 
                        className={isOverLimit ? 'border-orange-500 text-orange-500' : ''}
                      >
                        {deviation > 0 ? '+' : ''}{(deviation * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-lg font-bold">
                    {(weight * 100).toFixed(0)}%
                  </span>
                </div>
                
                <Slider
                  value={[weight * 100]}
                  onValueChange={([value]) => handleWeightChange(pillar.id, value / 100)}
                  min={Math.max(0, (pillar.defaultWeight - 0.10) * 100)}
                  max={Math.min(50, (pillar.defaultWeight + 0.10) * 100)}
                  step={1}
                  disabled={isLocked}
                  className="w-full"
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Standard: {(pillar.defaultWeight * 100).toFixed(0)}%</span>
                  <span>
                    Max avvikelse: ±{(defaultGMIConfig.weightAdjustmentLimit * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total and validation */}
        <div className="p-3 rounded-lg border space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total vikt</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-lg font-bold ${
                isValid ? 'text-green-500' : 'text-red-500'
              }`}>
                {(totalWeight * 100).toFixed(0)}%
              </span>
              {isValid ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
          
          {!isValid && (
            <p className="text-sm text-red-500">
              Vikterna måste summera till 100%
            </p>
          )}
        </div>

        {/* Warnings */}
        {!isWithinLimits && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              En eller flera vikter avviker mer än ±{(defaultGMIConfig.weightAdjustmentLimit * 100).toFixed(0)}% 
              från standardvärdet. Detta kan påverka jämförbarheten.
            </AlertDescription>
          </Alert>
        )}

        {/* Info about weights */}
        <div className="p-3 bg-muted/30 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Om vikter</p>
              <p>
                Vikter påverkar hur mycket varje pelare bidrar till det totala GMI. 
                Alla viktändringar är versionerade och synliga i jämförelser.
                Standard-vikterna är baserade på internationell konsensus.
              </p>
            </div>
          </div>
        </div>

        {/* Apply button */}
        <Button 
          onClick={handleApply}
          disabled={!isValid || isLocked}
          className="w-full"
        >
          Tillämpa vikter
        </Button>
      </CardContent>
    </Card>
  );
}
