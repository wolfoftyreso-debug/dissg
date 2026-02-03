/**
 * GMI WEIGHT EDITOR
 * 
 * Editor for Global Master Index weights.
 * Allows adjustment of dimension weights with full transparency and audit logging.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Scale, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Globe,
  Heart,
  GraduationCap,
  Briefcase,
  Shield,
  Leaf,
  Building2,
  Users
} from 'lucide-react';

interface GmiDimension {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  icon: React.ElementType;
  currentWeight: number;
  defaultWeight: number;
  subDimensions: Array<{
    id: string;
    name: string;
    weight: number;
  }>;
}

interface WeightChange {
  dimensionId: string;
  previousWeight: number;
  newWeight: number;
  reason: string;
  timestamp: string;
  author: string;
  version: string;
}

const GMI_DIMENSIONS: GmiDimension[] = [
  {
    id: 'health',
    name: 'Health',
    nameSv: 'Hälsa',
    description: 'Livslängd, sjukvårdskvalitet, mental hälsa, barnadödlighet',
    icon: Heart,
    currentWeight: 15,
    defaultWeight: 15,
    subDimensions: [
      { id: 'life_expectancy', name: 'Förväntad livslängd', weight: 30 },
      { id: 'healthcare_access', name: 'Vårdtillgång', weight: 25 },
      { id: 'mental_health', name: 'Psykisk hälsa', weight: 25 },
      { id: 'child_mortality', name: 'Barnadödlighet', weight: 20 },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    nameSv: 'Utbildning',
    description: 'Läskunnighet, skolnivåer, utbildningskvalitet, tillgång',
    icon: GraduationCap,
    currentWeight: 15,
    defaultWeight: 15,
    subDimensions: [
      { id: 'literacy', name: 'Läskunnighet', weight: 25 },
      { id: 'enrollment', name: 'Inskrivningsgrad', weight: 25 },
      { id: 'quality', name: 'Utbildningskvalitet (PISA)', weight: 30 },
      { id: 'tertiary', name: 'Högre utbildning', weight: 20 },
    ],
  },
  {
    id: 'economy',
    name: 'Economy',
    nameSv: 'Ekonomi',
    description: 'BNP per capita, sysselsättning, ekonomisk stabilitet',
    icon: Briefcase,
    currentWeight: 12,
    defaultWeight: 12,
    subDimensions: [
      { id: 'gdp_per_capita', name: 'BNP per capita', weight: 35 },
      { id: 'employment', name: 'Sysselsättning', weight: 35 },
      { id: 'inflation', name: 'Prisstabilitet', weight: 15 },
      { id: 'inequality', name: 'Ekonomisk jämlikhet', weight: 15 },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    nameSv: 'Säkerhet',
    description: 'Personlig säkerhet, brottslighet, konflikt, rättssäkerhet',
    icon: Shield,
    currentWeight: 12,
    defaultWeight: 12,
    subDimensions: [
      { id: 'homicide', name: 'Mordfrekvens', weight: 25 },
      { id: 'crime', name: 'Övrig brottslighet', weight: 25 },
      { id: 'conflict', name: 'Konflikt/Krig', weight: 25 },
      { id: 'rule_of_law', name: 'Rättssäkerhet', weight: 25 },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    nameSv: 'Miljö',
    description: 'Luftkvalitet, vatten, klimatpåverkan, biologisk mångfald',
    icon: Leaf,
    currentWeight: 12,
    defaultWeight: 12,
    subDimensions: [
      { id: 'air_quality', name: 'Luftkvalitet', weight: 30 },
      { id: 'water', name: 'Vattenkvalitet', weight: 25 },
      { id: 'emissions', name: 'Utsläpp per capita', weight: 25 },
      { id: 'biodiversity', name: 'Biologisk mångfald', weight: 20 },
    ],
  },
  {
    id: 'governance',
    name: 'Governance',
    nameSv: 'Samhällsstyrning',
    description: 'Demokrati, korruption, transparens, institutioner',
    icon: Building2,
    currentWeight: 12,
    defaultWeight: 12,
    subDimensions: [
      { id: 'democracy', name: 'Demokratiindex', weight: 30 },
      { id: 'corruption', name: 'Korruptionskontroll', weight: 30 },
      { id: 'transparency', name: 'Transparens', weight: 20 },
      { id: 'institutions', name: 'Institutionell styrka', weight: 20 },
    ],
  },
  {
    id: 'social',
    name: 'Social Cohesion',
    nameSv: 'Social sammanhållning',
    description: 'Tillit, jämlikhet, inkludering, socialt kapital',
    icon: Users,
    currentWeight: 12,
    defaultWeight: 12,
    subDimensions: [
      { id: 'trust', name: 'Samhällstillit', weight: 30 },
      { id: 'equality', name: 'Jämlikhet', weight: 25 },
      { id: 'inclusion', name: 'Inkludering', weight: 25 },
      { id: 'social_capital', name: 'Socialt kapital', weight: 20 },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    nameSv: 'Infrastruktur',
    description: 'Digitalisering, transport, boende, grundservice',
    icon: Globe,
    currentWeight: 10,
    defaultWeight: 10,
    subDimensions: [
      { id: 'digital', name: 'Digitalisering', weight: 30 },
      { id: 'transport', name: 'Transport', weight: 25 },
      { id: 'housing', name: 'Boende', weight: 25 },
      { id: 'utilities', name: 'Grundservice', weight: 20 },
    ],
  },
];

const CHANGE_LOG: WeightChange[] = [
  {
    dimensionId: 'environment',
    previousWeight: 10,
    newWeight: 12,
    reason: 'Ökad vikt på miljö efter klimatpanelens rekommendation och samråd med expertgrupp',
    timestamp: '2024-11-01T09:00:00Z',
    author: 'methodology_board',
    version: '2.1.0',
  },
  {
    dimensionId: 'economy',
    previousWeight: 15,
    newWeight: 12,
    reason: 'Balansering efter att ekonomiska indikatorer överrepresenterades i tidigare version',
    timestamp: '2024-11-01T09:00:00Z',
    author: 'methodology_board',
    version: '2.1.0',
  },
];

export default function GmiWeightEditor() {
  const [dimensions, setDimensions] = useState<GmiDimension[]>(GMI_DIMENSIONS);
  const [pendingChanges, setPendingChanges] = useState<Map<string, { newWeight: number; reason: string }>>(new Map());
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('weights');
  
  const totalWeight = dimensions.reduce((sum, d) => {
    const pending = pendingChanges.get(d.id);
    return sum + (pending ? pending.newWeight : d.currentWeight);
  }, 0);
  
  const isValidTotal = Math.abs(totalWeight - 100) < 0.1;
  
  const handleWeightChange = (dimensionId: string, newWeight: number) => {
    const current = pendingChanges.get(dimensionId);
    setPendingChanges(new Map(pendingChanges.set(dimensionId, {
      newWeight,
      reason: current?.reason || '',
    })));
  };
  
  const handleReasonChange = (dimensionId: string, reason: string) => {
    const current = pendingChanges.get(dimensionId);
    if (current) {
      setPendingChanges(new Map(pendingChanges.set(dimensionId, {
        ...current,
        reason,
      })));
    }
  };
  
  const handleSaveChanges = () => {
    for (const [dimensionId, change] of pendingChanges) {
      if (!change.reason.trim()) {
        toast.error(`Förklaring krävs för ${dimensions.find(d => d.id === dimensionId)?.nameSv}`);
        return;
      }
    }
    
    if (!isValidTotal) {
      toast.error('Summan av vikter måste vara 100%');
      return;
    }
    
    setDimensions(dimensions.map(d => {
      const pending = pendingChanges.get(d.id);
      return pending ? { ...d, currentWeight: pending.newWeight } : d;
    }));
    
    toast.success('Vikter uppdaterade - ny version skapad');
    setPendingChanges(new Map());
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono mb-6">
          <a href="/gmi" className="hover:text-foreground transition-colors underline decoration-dashed underline-offset-2">GMI</a>
          <span className="mx-1">→</span>
          <span className="text-foreground font-medium">Vikteditor</span>
        </nav>
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">GMI Vikteditor</h1>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Hantera vikter för Global Master Index. Alla justeringar kräver motivering 
              och loggas för full transparens. Summan måste alltid vara 100%.
            </p>
          </div>
          
          <Badge variant="outline" className="text-sm">
            Version 2.1.0
          </Badge>
        </div>
        
        {/* Weight summary bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label className="shrink-0">Total:</Label>
              <div className="flex-1 h-4 rounded-full overflow-hidden bg-muted">
                <div 
                  className={cn(
                    "h-full transition-all",
                    isValidTotal ? "bg-primary" : "bg-destructive"
                  )}
                  style={{ width: `${Math.min(totalWeight, 100)}%` }}
                />
              </div>
              <Badge variant={isValidTotal ? "default" : "destructive"} className="shrink-0">
                {totalWeight.toFixed(1)}%
              </Badge>
              {isValidTotal ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="weights">Dimensionsvikter</TabsTrigger>
            <TabsTrigger value="subdimensions">Underdimensioner</TabsTrigger>
            <TabsTrigger value="history">Ändringshistorik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weights">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dimension weights */}
              <Card>
                <CardHeader>
                  <CardTitle>Huvuddimensioner</CardTitle>
                  <CardDescription>Klicka för att justera vikten</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dimensions.map(dim => {
                      const Icon = dim.icon;
                      const pending = pendingChanges.get(dim.id);
                      const displayWeight = pending ? pending.newWeight : dim.currentWeight;
                      const hasChange = pending && pending.newWeight !== dim.currentWeight;
                      
                      return (
                        <div 
                          key={dim.id}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-colors",
                            selectedDimension === dim.id ? "border-primary bg-muted/50" : "hover:bg-muted/30",
                            hasChange && "border-orange-500/50"
                          )}
                          onClick={() => setSelectedDimension(dim.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{dim.nameSv}</div>
                              <div className="text-xs text-muted-foreground truncate">{dim.description}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xl font-bold">{displayWeight}</span>
                              <span className="text-sm text-muted-foreground">%</span>
                              {hasChange && (
                                <div className="text-xs text-orange-500">(var {dim.currentWeight}%)</div>
                              )}
                            </div>
                          </div>
                          
                          {selectedDimension === dim.id && (
                            <div className="mt-4 pt-4 border-t space-y-4">
                              <div>
                                <Label className="text-xs">Vikt (5% - 25%)</Label>
                                <Slider
                                  value={[displayWeight]}
                                  onValueChange={([v]) => handleWeightChange(dim.id, v)}
                                  min={5}
                                  max={25}
                                  step={1}
                                  className="mt-2"
                                />
                              </div>
                              
                              {hasChange && (
                                <div>
                                  <Label className="text-xs">Motivering (obligatorisk)</Label>
                                  <Textarea
                                    placeholder="Varför justeras denna vikt..."
                                    value={pending?.reason || ''}
                                    onChange={(e) => handleReasonChange(dim.id, e.target.value)}
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
              
              {/* Visual breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Viktfördelning</CardTitle>
                  <CardDescription>Visuell representation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dimensions.map(dim => {
                      const Icon = dim.icon;
                      const pending = pendingChanges.get(dim.id);
                      const displayWeight = pending ? pending.newWeight : dim.currentWeight;
                      
                      return (
                        <div key={dim.id} className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm w-32 truncate">{dim.nameSv}</span>
                          <div className="flex-1 h-6 rounded bg-muted overflow-hidden">
                            <div 
                              className="h-full bg-primary/80 transition-all flex items-center justify-end pr-2"
                              style={{ width: `${displayWeight * 4}%` }}
                            >
                              <span className="text-xs text-primary-foreground font-medium">
                                {displayWeight}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Info box */}
                  <div className="mt-6 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Viktprinciper:</strong>
                        <ul className="mt-1 list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                          <li>Ingen dimension får understiga 5%</li>
                          <li>Ingen dimension får överstiga 25%</li>
                          <li>Alla ändringar kräver dokumenterad motivering</li>
                          <li>Metodikstyrelsen godkänner större omviktningar</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subdimensions">
            <div className="grid md:grid-cols-2 gap-6">
              {dimensions.map(dim => {
                const Icon = dim.icon;
                return (
                  <Card key={dim.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="h-5 w-5" />
                        {dim.nameSv}
                      </CardTitle>
                      <CardDescription>{dim.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dim.subDimensions.map(sub => (
                          <div key={sub.id} className="flex items-center gap-3">
                            <span className="text-sm flex-1">{sub.name}</span>
                            <div className="w-24 h-2 rounded bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-primary/60"
                                style={{ width: `${sub.weight}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {sub.weight}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Ändringshistorik
                </CardTitle>
                <CardDescription>Alla viktjusteringar med motivering</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {CHANGE_LOG.map((change, i) => {
                      const dim = dimensions.find(d => d.id === change.dimensionId);
                      const Icon = dim?.icon || Globe;
                      
                      return (
                        <div key={i} className="p-4 rounded-lg border bg-muted/30">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <span className="font-medium">{dim?.nameSv || change.dimensionId}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {change.previousWeight}% → {change.newWeight}%
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    v{change.version}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                              {new Date(change.timestamp).toLocaleDateString('sv-SE')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-3 italic">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
