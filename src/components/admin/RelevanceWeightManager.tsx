/**
 * ADMIN: RELEVANSVIKTHANTERARE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Gränssnitt för att:
 * - Visa och redigera relevansvikter
 * - Skapa nya versioner med förklaringar
 * - Visa versionshistorik
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWeightVersions, useActiveWeights, useCalculateRelevance } from '@/hooks/useRelevanceEngine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Scale, 
  Save, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  User,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WeightConfig {
  impact: number;
  acceleration: number;
  breadth: number;
  persistence: number;
  responsibility: number;
  dataConfidence: number;
}

const WEIGHT_LABELS: Record<keyof WeightConfig, { label: string; description: string; icon: string }> = {
  impact: {
    label: 'Påverkan',
    description: 'Hur många människor påverkas och hur allvarligt?',
    icon: '💥'
  },
  acceleration: {
    label: 'Acceleration',
    description: 'Hur snabbt förändras trenden? Snabba förändringar kräver uppmärksamhet.',
    icon: '🚀'
  },
  breadth: {
    label: 'Bredd',
    description: 'Hur många samhällsområden påverkas?',
    icon: '🌐'
  },
  persistence: {
    label: 'Ihållighet',
    description: 'Hur länge har trenden pågått? Längre = allvarligare.',
    icon: '⏱️'
  },
  responsibility: {
    label: 'Ansvarsklarhet',
    description: 'Finns tydligt mandat att agera på denna indikator?',
    icon: '🏛️'
  },
  dataConfidence: {
    label: 'Dataosäkerhet',
    description: 'Negativt straff för osäker eller ofullständig data.',
    icon: '📊'
  }
};

export function RelevanceWeightManager() {
  const queryClient = useQueryClient();
  const { data: versions, isLoading: versionsLoading } = useWeightVersions();
  const { data: activeWeights, isLoading: activeLoading } = useActiveWeights();
  const calculateRelevance = useCalculateRelevance();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [weights, setWeights] = useState<WeightConfig>({
    impact: 0.30,
    acceleration: 0.20,
    breadth: 0.15,
    persistence: 0.15,
    responsibility: 0.10,
    dataConfidence: 0.10
  });

  // Synka med aktiva vikter när de laddas
  useState(() => {
    if (activeWeights) {
      setWeights({
        impact: Number(activeWeights.impact_weight),
        acceleration: Number(activeWeights.acceleration_weight),
        breadth: Number(activeWeights.breadth_weight),
        persistence: Number(activeWeights.persistence_weight),
        responsibility: Number(activeWeights.responsibility_weight),
        dataConfidence: Number(activeWeights.data_confidence_weight)
      });
    }
  });

  // Mutation för att skapa ny version
  const createVersion = useMutation({
    mutationFn: async () => {
      const nextVersion = versions ? Math.max(...versions.map(v => v.version)) + 1 : 1;
      
      // Deaktivera gamla versioner
      await supabase
        .from('relevance_weight_versions')
        .update({ is_active: false })
        .eq('is_active', true);
      
      // Skapa ny version
      const { data, error } = await supabase
        .from('relevance_weight_versions')
        .insert({
          version: nextVersion,
          name: versionName || `Version ${nextVersion}`,
          description: `Viktjustering skapad ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
          impact_weight: weights.impact,
          acceleration_weight: weights.acceleration,
          breadth_weight: weights.breadth,
          persistence_weight: weights.persistence,
          responsibility_weight: weights.responsibility,
          data_confidence_weight: weights.dataConfidence,
          is_active: true,
          created_by: 'admin',
          change_reason: changeReason
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relevance-weight-versions'] });
      queryClient.invalidateQueries({ queryKey: ['relevance-weights-active'] });
      toast.success('Nya vikter sparade och aktiverade');
      setIsEditing(false);
      setVersionName('');
      setChangeReason('');
    },
    onError: (error) => {
      toast.error(`Kunde inte spara vikter: ${error.message}`);
    }
  });

  // Aktivera en specifik version
  const activateVersion = useMutation({
    mutationFn: async (versionId: string) => {
      // Deaktivera alla
      await supabase
        .from('relevance_weight_versions')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Aktivera vald
      const { error } = await supabase
        .from('relevance_weight_versions')
        .update({ is_active: true })
        .eq('id', versionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relevance-weight-versions'] });
      queryClient.invalidateQueries({ queryKey: ['relevance-weights-active'] });
      toast.success('Version aktiverad');
    }
  });

  // Beräkna totalsumma
  const totalWeight = Object.entries(weights).reduce((sum, [key, value]) => {
    return key === 'dataConfidence' ? sum - value : sum + value;
  }, 0);

  const isValidSum = Math.abs(totalWeight - 0.90) < 0.01;

  if (versionsLoading || activeLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Relevansvikter
          </h2>
          <p className="text-sm text-muted-foreground">
            Justera hur olika faktorer påverkar prioriteringsalgoritmen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-2" />
            Historik ({versions?.length ?? 0})
          </Button>
          {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Redigera vikter
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Avbryt
            </Button>
          )}
        </div>
      </div>

      {/* Active weights info */}
      {activeWeights && !isEditing && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Aktiv version: {activeWeights.name}</AlertTitle>
          <AlertDescription>
            Version {activeWeights.version} • Skapad {format(new Date(activeWeights.created_at), 'PPP', { locale: sv })}
            {activeWeights.change_reason && (
              <span className="block mt-1 text-xs">
                Ändring: {activeWeights.change_reason}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Weight editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isEditing ? 'Justera vikter' : 'Aktuella vikter'}
          </CardTitle>
          <CardDescription>
            Summan av positiva vikter ska vara 0.90 (90%), dataosäkerhetsstraffet dras av.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(weights).map(([key, value]) => {
            const config = WEIGHT_LABELS[key as keyof WeightConfig];
            const isNegative = key === 'dataConfidence';
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                    {isNegative && (
                      <Badge variant="outline" className="text-xs">Straff</Badge>
                    )}
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-mono",
                      isNegative && "text-destructive"
                    )}>
                      {isNegative ? '-' : ''}{(value * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {config.description}
                </p>
                
                {isEditing ? (
                  <Slider
                    value={[value * 100]}
                    onValueChange={([v]) => setWeights(prev => ({
                      ...prev,
                      [key]: v / 100
                    }))}
                    min={0}
                    max={50}
                    step={5}
                    className={cn(isNegative && "[&>span]:bg-destructive")}
                  />
                ) : (
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        isNegative ? "bg-destructive" : "bg-primary"
                      )}
                      style={{ width: `${value * 200}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <Separator />

          {/* Sum validation */}
          <div className="flex items-center justify-between py-2">
            <span className="font-medium">Totalsumma (exkl. straff)</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-mono font-bold",
                isValidSum ? "text-emerald-600" : "text-destructive"
              )}>
                {(totalWeight * 100).toFixed(0)}%
              </span>
              {isValidSum ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>

          {!isValidSum && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Ogiltig summa</AlertTitle>
              <AlertDescription>
                Summan av vikterna måste vara 90% (0.90). Just nu: {(totalWeight * 100).toFixed(0)}%
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        {isEditing && (
          <CardFooter className="flex-col gap-4 border-t pt-4">
            <div className="w-full space-y-3">
              <div>
                <Label htmlFor="version-name">Versionsnamn</Label>
                <Input
                  id="version-name"
                  placeholder="T.ex. 'Ökat fokus på acceleration'"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="change-reason">Förklaring till ändringen *</Label>
                <Textarea
                  id="change-reason"
                  placeholder="Beskriv varför vikterna justeras och vad du förväntar dig för effekt..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Loggas i systemets transparenslogg (Trust Log)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset to active weights
                  if (activeWeights) {
                    setWeights({
                      impact: Number(activeWeights.impact_weight),
                      acceleration: Number(activeWeights.acceleration_weight),
                      breadth: Number(activeWeights.breadth_weight),
                      persistence: Number(activeWeights.persistence_weight),
                      responsibility: Number(activeWeights.responsibility_weight),
                      dataConfidence: Number(activeWeights.data_confidence_weight)
                    });
                  }
                }}
              >
                Avbryt
              </Button>
              <Button
                onClick={() => createVersion.mutate()}
                disabled={!isValidSum || !changeReason || createVersion.isPending}
              >
                {createVersion.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Spara som ny version
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Recalculate button */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Omberäkna relevans</p>
              <p className="text-sm text-muted-foreground">
                Kör relevansmotorn med aktuella vikter på all data
              </p>
            </div>
            <Button
              onClick={() => calculateRelevance.mutate()}
              disabled={calculateRelevance.isPending}
            >
              {calculateRelevance.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Beräkna nu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Version history */}
      <Collapsible open={showHistory} onOpenChange={setShowHistory}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Versionshistorik
            </span>
            {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Alla viktversioner</CardTitle>
              <CardDescription>
                Fullständig historik över alla viktändringar i systemet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {versions?.map((version, index) => (
                    <Card 
                      key={version.id} 
                      className={cn(
                        "relative",
                        version.is_active && "ring-2 ring-primary/30 bg-primary/5"
                      )}
                    >
                      {/* Timeline connector */}
                      {index < (versions?.length ?? 0) - 1 && (
                        <div className="absolute left-6 top-full w-0.5 h-3 bg-border" />
                      )}
                      
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm">{version.name}</h4>
                              {version.is_active && (
                                <Badge variant="default" className="text-xs">Aktiv</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">v{version.version}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(version.created_at), 'PPP HH:mm', { locale: sv })}
                              </span>
                              {version.created_by && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {version.created_by}
                                </span>
                              )}
                            </div>

                            {version.change_reason && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                <p className="font-medium text-muted-foreground mb-1">Ändringsförklaring:</p>
                                <p>{version.change_reason}</p>
                              </div>
                            )}

                            {/* Weight summary */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Påv: {(Number(version.impact_weight) * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Acc: {(Number(version.acceleration_weight) * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Bre: {(Number(version.breadth_weight) * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Ihå: {(Number(version.persistence_weight) * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Ans: {(Number(version.responsibility_weight) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>

                          {!version.is_active && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => activateVersion.mutate(version.id)}
                              disabled={activateVersion.isPending}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Aktivera
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Principle footer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Transparensprincip</AlertTitle>
        <AlertDescription>
          Alla viktändringar loggas publikt med tidsstämpel, version och förklaring. 
          Ingen ändring sker utan spår – detta är en del av systemets konstitutionella 
          åtagande för transparens enligt Trust Log.
        </AlertDescription>
      </Alert>
    </div>
  );
}
