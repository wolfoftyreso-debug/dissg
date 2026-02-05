/**
 * DECISION SCOPE SELECTOR
 * 
 * Simple UI for ordinary humans.
 * Controls which blocks activate.
 * Changes which trade-offs show.
 * Without the system "choosing".
 * 
 * The user makes the decision.
 * The system shows the consequences.
 */

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Shield, User } from 'lucide-react';
import type { DecisionScope } from '@/core/query-dominance/everyday/types';

interface ScopeSelectorProps {
  value: DecisionScope;
  onChange: (scope: DecisionScope) => void;
  usageProfiles?: string[];
}

export function ScopeSelector({
  value,
  onChange,
  usageProfiles = [
    'General consumer',
    'Professional/Business',
    'Family-oriented',
    'Budget-conscious',
    'Premium seeker',
    'First-time buyer',
  ],
}: ScopeSelectorProps) {
  const handleTimeChange = (values: number[]) => {
    const horizons: DecisionScope['time_horizon'][] = ['short', 'medium', 'long'];
    onChange({
      ...value,
      time_horizon: horizons[values[0]] || 'medium',
    });
  };

  const handleRiskChange = (risk: string) => {
    onChange({
      ...value,
      risk_tolerance: risk as DecisionScope['risk_tolerance'],
    });
  };

  const handleProfileChange = (profile: string) => {
    onChange({
      ...value,
      usage_profile: profile,
    });
  };

  const timeValue = { short: 0, medium: 1, long: 2 }[value.time_horizon] ?? 1;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          Your Decision Context
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Adjust to see how trade-offs change for your situation
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Time Horizon Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Time Horizon</Label>
          </div>
          <div className="px-2">
            <Slider
              value={[timeValue]}
              onValueChange={handleTimeChange}
              max={2}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Short-term</span>
              <span>Medium-term</span>
              <span>Long-term</span>
            </div>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Risk Tolerance</Label>
          </div>
          <RadioGroup
            value={value.risk_tolerance}
            onValueChange={handleRiskChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="risk-low" />
              <Label htmlFor="risk-low" className="text-sm cursor-pointer">
                Low
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="risk-normal" />
              <Label htmlFor="risk-normal" className="text-sm cursor-pointer">
                Normal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="risk-high" />
              <Label htmlFor="risk-high" className="text-sm cursor-pointer">
                High
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Usage Profile */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Usage Profile</Label>
          </div>
          <Select
            value={value.usage_profile}
            onValueChange={handleProfileChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your profile" />
            </SelectTrigger>
            <SelectContent>
              {usageProfiles.map((profile) => (
                <SelectItem key={profile} value={profile}>
                  {profile}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scope Summary */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Your context:</strong>{' '}
            {value.time_horizon}-term • {value.risk_tolerance} risk • {value.usage_profile}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Trade-offs and analysis will be filtered to match this context.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
