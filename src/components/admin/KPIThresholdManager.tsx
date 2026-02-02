/**
 * KPI Threshold Manager
 * Admin component for configuring threshold values per KPI
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Save, Trash2, AlertTriangle, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ThresholdType = 'critical_low' | 'warning_low' | 'target' | 'warning_high' | 'critical_high';

interface Threshold {
  id: string;
  kpi_id: string;
  threshold_type: ThresholdType;
  threshold_value: number;
  description: string | null;
  is_active: boolean;
}

interface KPIDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  is_inverted: boolean;
}

const THRESHOLD_TYPES: { value: ThresholdType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'critical_low', label: 'Kritisk låg', icon: <TrendingDown className="h-4 w-4" />, color: 'text-red-500' },
  { value: 'warning_low', label: 'Varning låg', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-orange-500' },
  { value: 'target', label: 'Målvärde', icon: <Target className="h-4 w-4" />, color: 'text-green-500' },
  { value: 'warning_high', label: 'Varning hög', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-orange-500' },
  { value: 'critical_high', label: 'Kritisk hög', icon: <TrendingUp className="h-4 w-4" />, color: 'text-red-500' },
];

export function KPIThresholdManager() {
  const queryClient = useQueryClient();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [editingThresholds, setEditingThresholds] = useState<Record<ThresholdType, { value: string; description: string }>>({
    critical_low: { value: '', description: '' },
    warning_low: { value: '', description: '' },
    target: { value: '', description: '' },
    warning_high: { value: '', description: '' },
    critical_high: { value: '', description: '' },
  });

  // Fetch KPI definitions
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpi-definitions-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('id, code, name, category, unit, is_inverted')
        .eq('is_active', true)
        .order('category')
        .order('name');
      
      if (error) throw error;
      return data as KPIDefinition[];
    },
  });

  // Fetch thresholds for selected KPI
  const { data: thresholds, isLoading: thresholdsLoading } = useQuery({
    queryKey: ['kpi-thresholds', selectedKPI],
    queryFn: async () => {
      if (!selectedKPI) return [];
      const { data, error } = await supabase
        .from('kpi_thresholds')
        .select('*')
        .eq('kpi_id', selectedKPI);
      
      if (error) throw error;
      return data as Threshold[];
    },
    enabled: !!selectedKPI,
  });

  // Update editing state when thresholds change
  React.useEffect(() => {
    if (thresholds) {
      const newState = { ...editingThresholds };
      thresholds.forEach(t => {
        newState[t.threshold_type as ThresholdType] = {
          value: t.threshold_value.toString(),
          description: t.description || '',
        };
      });
      setEditingThresholds(newState);
    }
  }, [thresholds]);

  // Save threshold mutation
  const saveMutation = useMutation({
    mutationFn: async ({ type, value, description }: { type: ThresholdType; value: number; description: string }) => {
      if (!selectedKPI) throw new Error('No KPI selected');

      const existing = thresholds?.find(t => t.threshold_type === type);
      
      if (existing) {
        const { error } = await supabase
          .from('kpi_thresholds')
          .update({
            threshold_value: value,
            description: description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kpi_thresholds')
          .insert({
            kpi_id: selectedKPI,
            threshold_type: type,
            threshold_value: value,
            description: description || null,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-thresholds', selectedKPI] });
      toast.success('Tröskelvärde sparat');
    },
    onError: (error) => {
      toast.error(`Fel vid sparande: ${error.message}`);
    },
  });

  // Delete threshold mutation
  const deleteMutation = useMutation({
    mutationFn: async (thresholdId: string) => {
      const { error } = await supabase
        .from('kpi_thresholds')
        .delete()
        .eq('id', thresholdId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-thresholds', selectedKPI] });
      toast.success('Tröskelvärde borttaget');
    },
    onError: (error) => {
      toast.error(`Fel vid borttagning: ${error.message}`);
    },
  });

  const handleSave = (type: ThresholdType) => {
    const data = editingThresholds[type];
    const value = parseFloat(data.value);
    
    if (isNaN(value)) {
      toast.error('Ange ett giltigt numeriskt värde');
      return;
    }
    
    saveMutation.mutate({ type, value, description: data.description });
  };

  const handleDelete = (type: ThresholdType) => {
    const existing = thresholds?.find(t => t.threshold_type === type);
    if (existing) {
      deleteMutation.mutate(existing.id);
      setEditingThresholds(prev => ({
        ...prev,
        [type]: { value: '', description: '' },
      }));
    }
  };

  const selectedKPIData = kpis?.find(k => k.id === selectedKPI);

  // Group KPIs by category
  const groupedKPIs = React.useMemo(() => {
    if (!kpis) return {};
    return kpis.reduce((acc, kpi) => {
      if (!acc[kpi.category]) acc[kpi.category] = [];
      acc[kpi.category].push(kpi);
      return acc;
    }, {} as Record<string, KPIDefinition[]>);
  }, [kpis]);

  if (kpisLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* KPI Selection */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Välj KPI</CardTitle>
          <CardDescription>
            Välj en KPI för att konfigurera tröskelvärden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedKPIs).map(([category, categoryKpis]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryKpis.length}
                      </Badge>
                      {category}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 pl-2">
                      {categoryKpis.map(kpi => (
                        <button
                          key={kpi.id}
                          onClick={() => setSelectedKPI(kpi.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedKPI === kpi.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="font-medium">{kpi.name}</div>
                          <div className="text-xs opacity-70">{kpi.code} • {kpi.unit}</div>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Threshold Configuration */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tröskelvärden
          </CardTitle>
          {selectedKPIData && (
            <CardDescription>
              Konfigurera tröskelvärden för <strong>{selectedKPIData.name}</strong> ({selectedKPIData.unit})
              {selectedKPIData.is_inverted && (
                <Badge variant="secondary" className="ml-2 text-xs">Inverterad</Badge>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!selectedKPI ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Välj en KPI i listan till vänster</p>
            </div>
          ) : thresholdsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {THRESHOLD_TYPES.map(({ value: type, label, icon, color }) => {
                const existing = thresholds?.find(t => t.threshold_type === type);
                const data = editingThresholds[type];
                
                return (
                  <div key={type} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={color}>{icon}</span>
                      <Label className="font-medium">{label}</Label>
                      {existing && (
                        <Badge variant="secondary" className="text-xs">Konfigurerad</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Värde ({selectedKPIData?.unit})</Label>
                        <Input
                          type="number"
                          step="any"
                          value={data.value}
                          onChange={(e) => setEditingThresholds(prev => ({
                            ...prev,
                            [type]: { ...prev[type], value: e.target.value },
                          }))}
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Beskrivning (valfri)</Label>
                        <Input
                          value={data.description}
                          onChange={(e) => setEditingThresholds(prev => ({
                            ...prev,
                            [type]: { ...prev[type], description: e.target.value },
                          }))}
                          placeholder="Förklaring av tröskelvärdet..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-3">
                      {existing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(type)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Ta bort
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleSave(type)}
                        disabled={!data.value || saveMutation.isPending}
                      >
                        {saveMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-1" />
                        )}
                        Spara
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {/* Summary */}
              {thresholds && thresholds.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Konfigurerade tröskelvärden</h4>
                  <div className="flex flex-wrap gap-2">
                    {thresholds.map(t => {
                      const typeInfo = THRESHOLD_TYPES.find(tt => tt.value === t.threshold_type);
                      return (
                        <Badge key={t.id} variant="outline" className={typeInfo?.color}>
                          {typeInfo?.label}: {t.threshold_value} {selectedKPIData?.unit}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
