/**
 * LAMBDA SENSOR BREAKDOWN
 * 
 * Displays sensor contributions as PARALLEL HORIZONTAL BARS
 * NOT spider/radar charts (FORBIDDEN - too misleading)
 * 
 * Same scale for all bars to enable honest comparison.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info } from 'lucide-react';
import { SENSOR_CATEGORIES } from '@/config/lambdaVisualizationRules';

interface SensorValue {
  id: string;
  value: number; // 0-1 normalized
  weight: number; // contribution weight
  trend: 'up' | 'down' | 'stable';
  uncertainty: number;
}

interface LambdaSensorBreakdownBarsProps {
  sensors: SensorValue[];
  language?: 'sv' | 'en';
  onSensorClick?: (sensorId: string) => void;
}

export const LambdaSensorBreakdownBars: React.FC<LambdaSensorBreakdownBarsProps> = ({
  sensors,
  language = 'sv',
  onSensorClick,
}) => {
  // Get sensor metadata
  const getSensorMeta = (id: string) => {
    return SENSOR_CATEGORIES.find(s => s.id === id) || { 
      id, 
      name: { sv: id, en: id }, 
      icon: '📊' 
    };
  };

  // Sort by weight (most influential first)
  const sortedSensors = [...sensors].sort((a, b) => b.weight - a.weight);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {language === 'sv' ? 'Sensorfördelning' : 'Sensor Breakdown'}
        </CardTitle>
        <CardDescription>
          {language === 'sv' 
            ? 'Parallella horisontella staplar – samma skala för alla'
            : 'Parallel horizontal bars – same scale for all'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSensors.map((sensor) => {
          const meta = getSensorMeta(sensor.id);
          const percentage = sensor.value * 100;
          
          // Determine color based on value relative to ideal (0.5 = neutral)
          const getBarColor = (val: number) => {
            if (val < 0.4) return 'bg-secondary';
            if (val > 0.6) return 'bg-secondary';
            return 'bg-primary';
          };

          return (
            <div key={sensor.id} className="space-y-1">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSensorClick?.(sensor.id)}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <span>{meta.icon}</span>
                  <span className="font-medium">{meta.name[language]}</span>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </button>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground text-xs">
                    {language === 'sv' ? 'vikt' : 'weight'}: {(sensor.weight * 100).toFixed(0)}%
                  </span>
                  <span className="font-mono font-medium">
                    {sensor.value.toFixed(2)}
                    <span className="text-muted-foreground text-xs ml-1">
                      ±{sensor.uncertainty.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-xs">
                    {sensor.trend === 'up' && '↑'}
                    {sensor.trend === 'down' && '↓'}
                    {sensor.trend === 'stable' && '→'}
                  </span>
                </div>
              </div>
              
              {/* Bar */}
              <div className="relative h-6 bg-muted rounded overflow-hidden">
                {/* Uncertainty band */}
                <div 
                  className="absolute top-0 bottom-0 bg-primary/10"
                  style={{ 
                    left: `${Math.max(0, (sensor.value - sensor.uncertainty) * 100)}%`,
                    width: `${sensor.uncertainty * 2 * 100}%`,
                  }}
                />
                
                {/* Value bar */}
                <div 
                  className={`absolute top-1 bottom-1 rounded ${getBarColor(sensor.value)} transition-all duration-300 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
                
                {/* Ideal marker (0.5 = balanced) */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-muted-foreground/30"
                  style={{ left: '50%' }}
                />
              </div>
            </div>
          );
        })}

        {/* Scale legend */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t mt-4">
          <span>0.0 ({language === 'sv' ? 'Kritisk' : 'Critical'})</span>
          <span>0.5 ({language === 'sv' ? 'Balans' : 'Balanced'})</span>
          <span>1.0 ({language === 'sv' ? 'Stress' : 'Stress'})</span>
        </div>

        {/* Method link */}
        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
          <Info className="h-4 w-4 mr-2" />
          {language === 'sv' ? 'Visa indikatorer & viktning' : 'Show indicators & weighting'}
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default LambdaSensorBreakdownBars;
