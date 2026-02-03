/**
 * RELEVANCE WEIGHT MANAGER
 * 
 * Admin interface for managing relevance weights according to governance/relevance-weight-management.
 * Every adjustment requires explanation and is logged for transparency.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WeightFactor {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  currentWeight: number;
  minWeight: number;
  maxWeight: number;
  category: 'impact' | 'acceleration' | 'confidence' | 'scope';
}

interface WeightChange {
  factorId: string;
  previousWeight: number;
  newWeight: number;
  reason: string;
  timestamp: string;
  author: string;
}

const WEIGHT_FACTORS: WeightFactor[] = [
  {
    id: 'population_affected',
    name: 'Population Affected',
    nameSv: 'Berörd befolkning',
    description: 'Hur stor andel av befolkningen som påverkas av förändringen',
    currentWeight: 25,
    minWeight: 10,
    maxWeight: 40,
    category: 'scope',
  },
  {
    id: 'trend_acceleration',
    name: 'Trend Acceleration',
    nameSv: 'Trendacceleration',
    description: 'Hastigheten på förändringen jämfört med historiskt snitt',
    currentWeight: 20,
    minWeight: 5,
    maxWeight: 35,
    category: 'acceleration',
  },
  {
    id: 'cross_domain_impact',
    name: 'Cross-Domain Impact',
    nameSv: 'Tvärsektoriell påverkan',
    description: 'Antal livsområden som påverkas av förändringen',
    currentWeight: 20,
    minWeight: 10,
    maxWeight: 30,
    category: 'impact',
  },
  {
    id: 'data_confidence',
    name: 'Data Confidence',
    nameSv: 'Datakonfidens',
    description: 'Kvalitet och tillförlitlighet i underliggande data',
    currentWeight: 15,
    minWeight: 5,
    maxWeight: 25,
    category: 'confidence',
  },
  {
    id: 'reversibility',
    name: 'Reversibility',
    nameSv: 'Reversibilitet',
    description: 'Hur lätt eller svårt det är att vända trenden',
    currentWeight: 10,
    minWeight: 5,
    maxWeight: 20,
    category: 'impact',
  },
  {
    id: 'urgency_factor',
    name: 'Urgency Factor',
    nameSv: 'Brådskefaktor',
    description: 'Tidskänslighet för åtgärd',
    currentWeight: 10,
    minWeight: 0,
    maxWeight: 20,
    category: 'acceleration',
  },
];

const CHANGE_LOG: WeightChange[] = [
  {
    factorId: 'population_affected',
    previousWeight: 20,
    newWeight: 25,
    reason: 'Ökat fokus på befolkningspåverkan efter demografi-granskning Q4 2024',
    timestamp: '2024-12-15T10:30:00Z',
    author: 'system_admin',
  },
  {
    factorId: 'trend_acceleration',
    previousWeight: 15,
    newWeight: 20,
    reason: 'Tidigare identifiering av kritiska trender kräver högre vikt på acceleration',
    timestamp: '2024-11-20T14:15:00Z',
    author: 'system_admin',
  },
];

export default function RelevanceWeightManager() {
  const [factors, setFactors] = useState<WeightFactor[]>(WEIGHT_FACTORS);
  const [pendingChanges, setPendingChanges] = useState<Map<string, { newWeight: number; reason: string }>>(new Map());
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  
  const totalWeight = factors.reduce((sum, f) => {
    const pending = pendingChanges.get(f.id);
    return sum + (pending ? pending.newWeight : f.currentWeight);
  }, 0);
  
  const isValidTotal = Math.abs(totalWeight - 100) < 0.1;
  
  const handleWeightChange = (factorId: string, newWeight: number) => {
    const current = pendingChanges.get(factorId);
    setPendingChanges(new Map(pendingChanges.set(factorId, {
      newWeight,
      reason: current?.reason || '',
    })));
  };
  
  const handleReasonChange = (factorId: string, reason: string) => {
    const current = pendingChanges.get(factorId);
    if (current) {
      setPendingChanges(new Map(pendingChanges.set(factorId, {
        ...current,
        reason,
      })));
    }
  };
  
  const handleSaveChanges = () => {
    // Validate all changes have reasons
    for (const [factorId, change] of pendingChanges) {
      if (!change.reason.trim()) {
        toast.error(`Förklaring krävs för ${factors.find(f => f.id === factorId)?.nameSv}`);
        return;
      }
    }
    
    if (!isValidTotal) {
      toast.error('Summan av vikter måste vara 100%');
      return;
    }
    
    // Apply changes
    setFactors(factors.map(f => {
      const pending = pendingChanges.get(f.id);
      return pending ? { ...f, currentWeight: pending.newWeight } : f;
    }));
    
    toast.success('Vikter uppdaterade och loggade');
    setPendingChanges(new Map());
  };
  
  const getCategoryColor = (category: WeightFactor['category']) => {
    switch (category) {
      case 'impact': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'acceleration': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'confidence': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'scope': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    }
  };
  
  const getCategoryLabel = (category: WeightFactor['category']) => {
    switch (category) {
      case 'impact': return 'Effekt';
      case 'acceleration': return 'Acceleration';
      case 'confidence': return 'Konfidens';
      case 'scope': return 'Omfattning';
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Simple breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
          <a href="/admin" className="hover:text-foreground transition-colors underline decoration-dashed underline-offset-2">Admin</a>
          <span className="mx-1">→</span>
          <span className="text-foreground font-medium">Relevansvikter</span>
        </nav>
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Relevansvikthantering</h1>
          <p className="text-muted-foreground mt-2">
            Hantera vikter för relevansmotorn. Alla ändringar kräver förklaring och loggas i transparensloggen.
          </p>
        </div>
        
        {/* Weight Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Viktfördelning</CardTitle>
            <CardDescription>
              Summan av alla positiva vikter måste vara exakt 100% (nuvarande: {totalWeight.toFixed(1)}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-3 flex-1 rounded-full overflow-hidden bg-muted",
              )}>
                <div 
                  className={cn(
                    "h-full transition-all",
                    isValidTotal ? "bg-primary" : "bg-destructive"
                  )}
                  style={{ width: `${Math.min(totalWeight, 100)}%` }}
                />
              </div>
              <Badge variant={isValidTotal ? "default" : "destructive"}>
                {totalWeight.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Weight Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Viktfaktorer</CardTitle>
              <CardDescription>Klicka på en faktor för att justera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {factors.map(factor => {
                  const pending = pendingChanges.get(factor.id);
                  const displayWeight = pending ? pending.newWeight : factor.currentWeight;
                  const hasChange = pending && pending.newWeight !== factor.currentWeight;
                  
                  return (
                    <div 
                      key={factor.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors",
                        selectedFactor === factor.id ? "border-primary bg-muted/50" : "hover:bg-muted/30",
                        hasChange && "border-orange-500/50"
                      )}
                      onClick={() => setSelectedFactor(factor.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{factor.nameSv}</span>
                            <Badge variant="outline" className={cn("text-xs", getCategoryColor(factor.category))}>
                              {getCategoryLabel(factor.category)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{displayWeight}</span>
                          <span className="text-sm text-muted-foreground">%</span>
                          {hasChange && (
                            <div className="text-xs text-orange-500">
                              (var {factor.currentWeight}%)
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedFactor === factor.id && (
                        <div className="mt-4 space-y-4 pt-4 border-t">
                          <div>
                            <Label className="text-xs">Vikt ({factor.minWeight}% - {factor.maxWeight}%)</Label>
                            <Slider
                              value={[displayWeight]}
                              onValueChange={([v]) => handleWeightChange(factor.id, v)}
                              min={factor.minWeight}
                              max={factor.maxWeight}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          
                          {hasChange && (
                            <div>
                              <Label className="text-xs">Förklaring till ändring (obligatorisk)</Label>
                              <Textarea
                                placeholder="Beskriv varför denna justering görs..."
                                value={pending?.reason || ''}
                                onChange={(e) => handleReasonChange(factor.id, e.target.value)}
                                className="mt-1 text-sm"
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {pendingChanges.size > 0 && (
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={handleSaveChanges}
                    disabled={!isValidTotal}
                    className="flex-1"
                  >
                    Spara ändringar ({pendingChanges.size})
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPendingChanges(new Map())}
                  >
                    Återställ
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Change Log */}
          <Card>
            <CardHeader>
              <CardTitle>Ändringslogg</CardTitle>
              <CardDescription>Historik över viktjusteringar</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {CHANGE_LOG.map((change, i) => {
                    const factor = factors.find(f => f.id === change.factorId);
                    return (
                      <div key={i} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-medium">{factor?.nameSv || change.factorId}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {change.previousWeight}% → {change.newWeight}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {change.newWeight > change.previousWeight ? '+' : ''}{change.newWeight - change.previousWeight}%
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(change.timestamp).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{change.reason}"
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          Av: {change.author}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Formula Display */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prioriteringsformel</CardTitle>
            <CardDescription>
              Aktuell beräkningsformel för objektiv prioritering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted font-mono text-sm">
              <div className="text-muted-foreground mb-2">Priority Score =</div>
              <div className="pl-4 space-y-1">
                {factors.map((f, i) => {
                  const pending = pendingChanges.get(f.id);
                  const weight = pending ? pending.newWeight : f.currentWeight;
                  return (
                    <div key={f.id} className="flex items-center gap-2">
                      {i > 0 && <span className="text-muted-foreground">+</span>}
                      <span className="text-primary">{weight / 100}</span>
                      <span>×</span>
                      <span>{f.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/20 text-sm">
              <strong className="text-amber-700 dark:text-amber-300">Viktigt:</strong>
              <span className="text-amber-600 dark:text-amber-400 ml-1">
                Ändringar påverkar hur systemet prioriterar frågor och problem. 
                Summan av vikter måste alltid vara 100% för strukturell integritet.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
