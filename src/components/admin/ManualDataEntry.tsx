import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, 
  Save,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema
const manualEntrySchema = z.object({
  kpiId: z.string().uuid({ message: "Välj en giltig KPI" }),
  value: z.number({ invalid_type_error: "Värde måste vara ett nummer" }),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Ogiltigt datumformat (YYYY-MM-DD)" }),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Ogiltigt datumformat (YYYY-MM-DD)" }),
  trend: z.enum(['up', 'down', 'stable']),
  confidence: z.number().min(0).max(100),
  notes: z.string().max(1000).optional(),
});

type ManualEntry = z.infer<typeof manualEntrySchema>;

export function ManualDataEntry() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<ManualEntry>>({
    trend: 'stable',
    confidence: 80,
    periodStart: new Date().toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch KPI definitions
  const { data: kpiDefinitions } = useQuery({
    queryKey: ['kpi-definitions-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definitions')
        .select('id, code, name, unit, category')
        .eq('is_active', true)
        .order('kpi_index');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch recent manual entries
  const { data: recentEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ['recent-manual-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_values')
        .select(`
          id,
          value,
          period_start,
          period_end,
          trend,
          confidence,
          created_at,
          is_provisional,
          kpi_definitions!inner(code, name, unit)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Get manual data source
  const { data: manualSource } = useQuery({
    queryKey: ['manual-data-source'],
    queryFn: async () => {
      let { data } = await supabase
        .from('data_sources')
        .select('id')
        .eq('code', 'manual')
        .single();
      
      if (!data) {
        // Create manual data source if it doesn't exist
        const { data: newSource, error } = await supabase
          .from('data_sources')
          .insert({
            code: 'manual',
            name: 'Manuell inmatning',
            source_type: 'manual',
            update_frequency: 'daily',
            reliability_score: 70,
            description: 'Manuellt inmatade värden av administratörer',
            is_active: true,
          })
          .select()
          .single();
        
        if (error) throw error;
        data = newSource;
      }
      
      return data;
    },
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (entry: ManualEntry) => {
      if (!manualSource) {
        throw new Error('Manuell datakälla ej konfigurerad');
      }

      // Check for existing value in same period
      const { data: existing } = await supabase
        .from('kpi_values')
        .select('id')
        .eq('kpi_id', entry.kpiId)
        .eq('period_start', entry.periodStart)
        .single();

      const kpiValue = {
        kpi_id: entry.kpiId,
        data_source_id: manualSource.id,
        value: entry.value,
        period_start: entry.periodStart,
        period_end: entry.periodEnd,
        trend: entry.trend,
        confidence: entry.confidence,
        granularity: 'daily',
        region_code: 'SE',
        is_provisional: true,
        raw_data: {
          manual_entry: true,
          notes: entry.notes || null,
          entered_at: new Date().toISOString(),
        },
      };

      if (existing) {
        const { error } = await supabase
          .from('kpi_values')
          .update(kpiValue)
          .eq('id', existing.id);
        if (error) throw error;
        return { updated: true };
      } else {
        const { error } = await supabase
          .from('kpi_values')
          .insert(kpiValue);
        if (error) throw error;
        return { inserted: true };
      }
    },
    onSuccess: (result) => {
      toast.success(result.updated ? 'Värde uppdaterat' : 'Värde sparat');
      queryClient.invalidateQueries({ queryKey: ['recent-manual-entries'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-overview'] });
      // Reset form
      setFormData({
        trend: 'stable',
        confidence: 80,
        periodStart: new Date().toISOString().split('T')[0],
        periodEnd: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    },
    onError: (error) => {
      toast.error(`Kunde inte spara: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = manualEntrySchema.safeParse({
      ...formData,
      value: formData.value ? Number(formData.value) : undefined,
      confidence: formData.confidence ? Number(formData.confidence) : 80,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    submitMutation.mutate(result.data);
  };

  const selectedKpi = kpiDefinitions?.find(k => k.id === formData.kpiId);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Ny manuell inmatning
          </CardTitle>
          <CardDescription>
            Mata in KPI-värden manuellt för källor utan API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* KPI Selection */}
            <div className="space-y-2">
              <Label htmlFor="kpi">KPI *</Label>
              <Select
                value={formData.kpiId || ''}
                onValueChange={(value) => setFormData({ ...formData, kpiId: value })}
              >
                <SelectTrigger className={errors.kpiId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Välj KPI..." />
                </SelectTrigger>
                <SelectContent>
                  {kpiDefinitions?.map((kpi) => (
                    <SelectItem key={kpi.id} value={kpi.id}>
                      <span className="font-medium">{kpi.name}</span>
                      <span className="text-muted-foreground ml-2">({kpi.code})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kpiId && <p className="text-xs text-destructive">{errors.kpiId}</p>}
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor="value">
                Värde * {selectedKpi && <span className="text-muted-foreground">({selectedKpi.unit})</span>}
              </Label>
              <Input
                id="value"
                type="number"
                step="any"
                placeholder="t.ex. 83.5"
                value={formData.value ?? ''}
                onChange={(e) => setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : undefined })}
                className={errors.value ? 'border-destructive' : ''}
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value}</p>}
            </div>

            {/* Period */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodStart">Period start *</Label>
                <Input
                  id="periodStart"
                  type="date"
                  value={formData.periodStart || ''}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  className={errors.periodStart ? 'border-destructive' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodEnd">Period slut *</Label>
                <Input
                  id="periodEnd"
                  type="date"
                  value={formData.periodEnd || ''}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  className={errors.periodEnd ? 'border-destructive' : ''}
                />
              </div>
            </div>

            {/* Trend */}
            <div className="space-y-2">
              <Label>Trend</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.trend === 'up' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, trend: 'up' })}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Uppåt
                </Button>
                <Button
                  type="button"
                  variant={formData.trend === 'stable' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, trend: 'stable' })}
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Stabil
                </Button>
                <Button
                  type="button"
                  variant={formData.trend === 'down' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, trend: 'down' })}
                >
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Nedåt
                </Button>
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <Label htmlFor="confidence">Konfidens (%)</Label>
              <Input
                id="confidence"
                type="number"
                min="0"
                max="100"
                value={formData.confidence ?? 80}
                onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) || 80 })}
              />
              <p className="text-xs text-muted-foreground">
                Hur säker är du på detta värde? (0-100%)
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Anteckningar</Label>
              <Textarea
                id="notes"
                placeholder="Valfria anteckningar om datakälla, metod etc."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                maxLength={1000}
              />
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Spara värde
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Senaste inmatningar</CardTitle>
          <CardDescription>De 10 senaste registrerade värdena</CardDescription>
        </CardHeader>
        <CardContent>
          {entriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : recentEntries && recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {(entry.kpi_definitions as { name: string })?.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {entry.period_start}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {entry.value} {(entry.kpi_definitions as { unit: string })?.unit}
                    </span>
                    {entry.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {entry.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {entry.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Inga inmatningar ännu
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
