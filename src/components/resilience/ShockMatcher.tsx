/**
 * BLOCK SD — SHOCK TYPE MATCHING
 * "Hur väl är detta land rustat för..."
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingDown, Users, Heart, Globe, Cloud } from 'lucide-react';
import type { ResilienceProfile } from '@/config/systemResilienceConfig';
import { SHOCK_TYPES, RESILIENCE_DIMENSIONS, ShockType } from '@/config/systemResilienceConfig';

interface ShockMatcherProps {
  profile: ResilienceProfile;
}

const SHOCK_ICONS: Record<ShockType, React.ReactNode> = {
  energy_shock: <Zap className="h-5 w-5" />,
  economic_downturn: <TrendingDown className="h-5 w-5" />,
  demographic_change: <Users className="h-5 w-5" />,
  health_crisis: <Heart className="h-5 w-5" />,
  geopolitical_disruption: <Globe className="h-5 w-5" />,
  climate_event: <Cloud className="h-5 w-5" />,
};

export function ShockMatcher({ profile }: ShockMatcherProps) {
  const [selectedShock, setSelectedShock] = useState<ShockType | null>(null);

  const calculateShockResilience = (shockType: ShockType): number => {
    const shock = SHOCK_TYPES.find(s => s.id === shockType);
    if (!shock) return 0;

    let weightedScore = 0;
    profile.dimensions.forEach((dim) => {
      const weight = shock.dimensionWeights[dim.dimensionId] || 0;
      weightedScore += dim.overallScore * weight;
    });

    return Math.round(weightedScore);
  };

  const selectedShockConfig = SHOCK_TYPES.find(s => s.id === selectedShock);
  const shockScore = selectedShock ? calculateShockResilience(selectedShock) : 0;

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: 'Relativt hög', color: 'text-success' };
    if (score >= 50) return { label: 'Måttlig', color: 'text-warning' };
    return { label: 'Begränsad', color: 'text-destructive' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Hur väl är {profile.entityNameSv} rustat för...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shock type buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SHOCK_TYPES.map((shock) => (
            <Button
              key={shock.id}
              variant={selectedShock === shock.id ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() => setSelectedShock(shock.id)}
            >
              <span className="mr-2">{SHOCK_ICONS[shock.id]}</span>
              <span className="text-sm">{shock.nameSv}</span>
            </Button>
          ))}
        </div>

        {/* Result */}
        {selectedShock && selectedShockConfig && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{selectedShockConfig.nameSv}</h4>
              <Badge className={getScoreLabel(shockScore).color}>
                {getScoreLabel(shockScore).label} kapacitet
              </Badge>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Relativ kapacitet att absorbera</span>
                <span className="font-medium">{shockScore}/100</span>
              </div>
              <Progress value={shockScore} className="h-3" />
            </div>

            <p className="text-sm text-muted-foreground">
              {selectedShockConfig.descriptionSv}
            </p>

            {/* Relevant dimensions */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Mest relevanta dimensioner:</h5>
              {selectedShockConfig.relevantDimensions.map((dimId) => {
                const dim = profile.dimensions.find(d => d.dimensionId === dimId);
                const dimConfig = RESILIENCE_DIMENSIONS.find(d => d.id === dimId);
                if (!dim || !dimConfig) return null;

                return (
                  <div key={dimId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{dimConfig.icon}</span>
                      {dimConfig.nameSv}
                    </span>
                    <span className="font-medium">{dim.overallScore}/100</span>
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <p className="text-xs text-muted-foreground italic border-t pt-3">
              Detta visar relativ kapacitet – inte en förutsägelse om utfall.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
