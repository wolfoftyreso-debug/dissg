import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useHasRole, useUserRoles } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Lock, LogIn, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface NewActionFormProps {
  kpiIds?: string[];
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: 'policy', label: 'Policyförändring' },
  { value: 'budget', label: 'Budgetåtgärd' },
  { value: 'organization', label: 'Organisationsförändring' },
  { value: 'legislation', label: 'Lagstiftning' },
  { value: 'infrastructure', label: 'Infrastruktur' },
  { value: 'education', label: 'Utbildning/Information' },
];

const DEPARTMENTS = [
  { value: 'Statsrådsberedningen', label: 'Statsrådsberedningen' },
  { value: 'Finansdepartementet', label: 'Finansdepartementet' },
  { value: 'Justitiedepartementet', label: 'Justitiedepartementet' },
  { value: 'Socialdepartementet', label: 'Socialdepartementet' },
  { value: 'Arbetsmarknadsdepartementet', label: 'Arbetsmarknadsdepartementet' },
  { value: 'Utbildningsdepartementet', label: 'Utbildningsdepartementet' },
  { value: 'Näringsdepartementet', label: 'Näringsdepartementet' },
  { value: 'Infrastrukturdepartementet', label: 'Infrastrukturdepartementet' },
  { value: 'Klimat- och miljödepartementet', label: 'Klimat- och miljödepartementet' },
  { value: 'Kulturdepartementet', label: 'Kulturdepartementet' },
];

export function NewActionForm({ kpiIds = [], onSuccess }: NewActionFormProps) {
  const { user, loading: authLoading } = useAuth();
  const hasAuthorizedRole = useHasRole('researcher'); // researcher or higher
  const { data: roleData, isLoading: rolesLoading } = useUserRoles();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    responsible_department: '',
    estimated_cost_sek: '',
    estimated_timeframe_months: '',
    source_document: '',
  });

  const queryClient = useQueryClient();
  
  const isLoading = authLoading || rolesLoading;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Du måste vara inloggad för att skapa åtgärdsförslag');
      }

      const { data, error } = await supabase
        .from('action_options')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          responsible_department: formData.responsible_department,
          target_kpi_ids: kpiIds,
          estimated_cost_sek: formData.estimated_cost_sek 
            ? parseInt(formData.estimated_cost_sek) * 1000000 
            : null,
          estimated_timeframe_months: formData.estimated_timeframe_months 
            ? parseInt(formData.estimated_timeframe_months) 
            : null,
          source_document: formData.source_document || null,
          proposed_by: user.id,
          status: 'proposed',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action_options'] });
      toast.success('Åtgärdsförslag skapat');
      setOpen(false);
      resetForm();
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Create action error:', error);
      if (error.message.includes('row-level security')) {
        toast.error('Autentisering krävs – logga in för att skapa förslag');
      } else {
        toast.error('Kunde inte skapa åtgärdsförslag');
      }
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      responsible_department: '',
      estimated_cost_sek: '',
      estimated_timeframe_months: '',
      source_document: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Du måste vara inloggad för att skapa åtgärdsförslag');
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.responsible_department) {
      toast.error('Fyll i alla obligatoriska fält');
      return;
    }

    createMutation.mutate();
  };

  // Visa låst knapp om ej inloggad
  if (!isLoading && !user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="opacity-70">
            <Lock className="w-4 h-4 mr-2" />
            Nytt åtgärdsförslag
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Inloggning krävs
            </DialogTitle>
            <DialogDescription>
              För att skapa åtgärdsförslag måste du vara inloggad som behörig användare.
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertDescription className="space-y-3">
              <p>
                Endast behöriga användare kan skapa och utvärdera åtgärdsförslag. 
                Detta säkerställer spårbarhet och kvalitet i beslutsstödet.
              </p>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Logga in
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/register">Registrera</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  // Visa meddelande om inloggad men saknar rätt roll
  if (!isLoading && user && !hasAuthorizedRole) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="opacity-70">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Nytt åtgärdsförslag
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-warning" />
              Behörighet saknas
            </DialogTitle>
            <DialogDescription>
              Du är inloggad men saknar nödvändig behörighet för att skapa åtgärdsförslag.
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertDescription className="space-y-3">
              <p>
                För att skapa åtgärdsförslag krävs minst rollen <strong>Researcher</strong>.
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Din nuvarande roll: <Badge variant="outline">{roleData?.highestRole || 'public'}</Badge></p>
                <p className="text-xs">
                  Behöriga roller: Researcher, Department Lead, Minister, Prime Minister, System Admin
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Kontakta en systemadministratör om du behöver utökad behörighet.
              </p>
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Nytt åtgärdsförslag
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Skapa nytt åtgärdsförslag</DialogTitle>
          <DialogDescription>
            Beskriv en potentiell åtgärd för AI-utvärdering mot effekt, kostnad, risk och reversibilitet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titel */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              placeholder="Kort, beskrivande titel"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Beskrivning */}
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning *</Label>
            <Textarea
              id="description"
              placeholder="Detaljerad beskrivning av åtgärden, dess syfte och förväntade effekter..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Kategori */}
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ansvarigt departement */}
            <div className="space-y-2">
              <Label>Ansvarigt departement *</Label>
              <Select
                value={formData.responsible_department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, responsible_department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj departement" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(dept => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Uppskattad kostnad */}
            <div className="space-y-2">
              <Label htmlFor="cost">Uppskattad kostnad (MSEK)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="t.ex. 500"
                value={formData.estimated_cost_sek}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost_sek: e.target.value }))}
              />
            </div>

            {/* Tid till effekt */}
            <div className="space-y-2">
              <Label htmlFor="timeframe">Tid till effekt (månader)</Label>
              <Input
                id="timeframe"
                type="number"
                placeholder="t.ex. 12"
                value={formData.estimated_timeframe_months}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_timeframe_months: e.target.value }))}
              />
            </div>
          </div>

          {/* Källdokument */}
          <div className="space-y-2">
            <Label htmlFor="source">Källdokument/utredning (URL)</Label>
            <Input
              id="source"
              type="url"
              placeholder="https://..."
              value={formData.source_document}
              onChange={(e) => setFormData(prev => ({ ...prev, source_document: e.target.value }))}
            />
          </div>

          {/* Inloggad som */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            Inloggad som: {user?.email}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Skapar...
                </>
              ) : (
                'Skapa förslag'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewActionForm;