import { useState } from 'react';
import { useDecisionOutcomes, useDecisionMilestones, useUpdateMilestone, useAddMilestone, DecisionMilestone } from '@/hooks/useDecisionOutcomes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, Minus, Target, Calendar, CheckCircle2, 
  Clock, AlertCircle, Plus, BarChart3
} from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DecisionOutcomeTrackerProps {
  decisionId: string;
  decisionTitle: string;
}

const STATUS_CONFIG: Record<DecisionMilestone['status'], { label: string; icon: typeof CheckCircle2; color: string }> = {
  pending: { label: 'Planerad', icon: Clock, color: 'text-muted-foreground' },
  in_progress: { label: 'Pågående', icon: AlertCircle, color: 'text-blue-500' },
  completed: { label: 'Klar', icon: CheckCircle2, color: 'text-emerald-500' },
  delayed: { label: 'Försenad', icon: AlertCircle, color: 'text-amber-500' },
  cancelled: { label: 'Avbruten', icon: AlertCircle, color: 'text-red-500' },
};

export function DecisionOutcomeTracker({ decisionId, decisionTitle }: DecisionOutcomeTrackerProps) {
  const { data: outcomes, isLoading: outcomesLoading } = useDecisionOutcomes(decisionId);
  const { data: milestones, isLoading: milestonesLoading } = useDecisionMilestones(decisionId);
  const updateMilestone = useUpdateMilestone();
  const addMilestone = useAddMilestone();
  
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    target_date: '',
    responsible_entity: '',
  });

  const handleStatusChange = async (milestone: DecisionMilestone, newStatus: DecisionMilestone['status']) => {
    try {
      await updateMilestone.mutateAsync({
        id: milestone.id,
        status: newStatus,
        completed_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null,
      });
      toast.success('Milstolpe uppdaterad');
    } catch (error) {
      toast.error('Kunde inte uppdatera milstolpe');
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title || !newMilestone.target_date) {
      toast.error('Titel och måldatum krävs');
      return;
    }

    try {
      await addMilestone.mutateAsync({
        decision_id: decisionId,
        title: newMilestone.title,
        description: newMilestone.description || null,
        target_date: newMilestone.target_date,
        status: 'pending',
        responsible_entity: newMilestone.responsible_entity || null,
        completed_date: null,
      });
      toast.success('Milstolpe tillagd');
      setIsAddMilestoneOpen(false);
      setNewMilestone({ title: '', description: '', target_date: '', responsible_entity: '' });
    } catch (error) {
      toast.error('Kunde inte lägga till milstolpe');
    }
  };

  // Calculate progress
  const completedMilestones = milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = milestones?.length || 0;
  const progressPercent = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Calculate outcome summary
  const outcomeStats = outcomes?.reduce((acc, o) => {
    if ((o.change_percent || 0) > 2) acc.improved++;
    else if ((o.change_percent || 0) < -2) acc.declined++;
    else acc.unchanged++;
    return acc;
  }, { improved: 0, declined: 0, unchanged: 0 }) || { improved: 0, declined: 0, unchanged: 0 };

  if (outcomesLoading || milestonesLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Genomförandestatus</CardTitle>
          <CardDescription>
            {completedMilestones} av {totalMilestones} milstolpar slutförda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Start</span>
            <span>{Math.round(progressPercent)}% klart</span>
            <span>Slutfört</span>
          </div>
        </CardContent>
      </Card>

      {/* KPI Outcomes */}
      {outcomes && outcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              KPI-utfall
            </CardTitle>
            <CardDescription>
              Mätbara effekter på kopplade indikatorer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{outcomeStats.improved}</p>
                  <p className="text-xs text-muted-foreground">Förbättrade</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Minus className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{outcomeStats.unchanged}</p>
                  <p className="text-xs text-muted-foreground">Oförändrade</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{outcomeStats.declined}</p>
                  <p className="text-xs text-muted-foreground">Försämrade</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              {outcomes.map((outcome) => (
                <div key={outcome.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {(outcome.change_percent || 0) > 2 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (outcome.change_percent || 0) < -2 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{outcome.kpi_name || 'Okänd KPI'}</p>
                      <p className="text-xs text-muted-foreground">
                        {outcome.kpi_code} • Mätt {format(new Date(outcome.measurement_date), 'd MMM yyyy', { locale: sv })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-mono font-bold",
                      (outcome.change_percent || 0) > 0 && "text-emerald-500",
                      (outcome.change_percent || 0) < 0 && "text-red-500"
                    )}>
                      {(outcome.change_percent || 0) > 0 ? '+' : ''}{outcome.change_percent?.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {outcome.current_value} {outcome.kpi_unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Milstolpar
              </CardTitle>
              <CardDescription>
                Delmål och viktiga händelser i genomförandet
              </CardDescription>
            </div>
            <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Lägg till
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lägg till milstolpe</DialogTitle>
                  <DialogDescription>
                    Skapa en ny milstolpe för {decisionTitle}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titel *</label>
                    <Input
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="T.ex. Lagändring antagen"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Beskrivning</label>
                    <Textarea
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Valfri detaljerad beskrivning..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Måldatum *</label>
                    <Input
                      type="date"
                      value={newMilestone.target_date}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, target_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ansvarig</label>
                    <Input
                      value={newMilestone.responsible_entity}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, responsible_entity: e.target.value }))}
                      placeholder="T.ex. Riksdagen, Arbetsförmedlingen"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMilestoneOpen(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={handleAddMilestone} disabled={addMilestone.isPending}>
                    {addMilestone.isPending ? 'Skapar...' : 'Skapa milstolpe'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {(!milestones || milestones.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Inga milstolpar definierade ännu</p>
              <p className="text-sm">Lägg till milstolpar för att spåra genomförandet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone, index) => {
                const StatusIcon = STATUS_CONFIG[milestone.status].icon;
                const isOverdue = isPast(new Date(milestone.target_date)) && milestone.status !== 'completed';
                const daysUntil = differenceInDays(new Date(milestone.target_date), new Date());

                return (
                  <div 
                    key={milestone.id}
                    className={cn(
                      "relative pl-8 pb-4",
                      index !== milestones.length - 1 && "border-l-2 border-muted ml-2"
                    )}
                  >
                    <div className={cn(
                      "absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-background",
                      milestone.status === 'completed' && "bg-emerald-500 border-emerald-500",
                      milestone.status === 'in_progress' && "bg-blue-500 border-blue-500",
                      milestone.status === 'delayed' && "bg-amber-500 border-amber-500",
                      milestone.status === 'pending' && "bg-muted border-muted-foreground",
                      milestone.status === 'cancelled' && "bg-red-500 border-red-500"
                    )} />
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon className={cn("h-4 w-4", STATUS_CONFIG[milestone.status].color)} />
                          <span className="font-medium">{milestone.title}</span>
                          {isOverdue && milestone.status !== 'cancelled' && (
                            <Badge variant="destructive" className="text-xs">Försenad</Badge>
                          )}
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-1">{milestone.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(milestone.target_date), 'd MMMM yyyy', { locale: sv })}
                            {daysUntil > 0 && milestone.status !== 'completed' && ` (om ${daysUntil} dagar)`}
                          </span>
                          {milestone.responsible_entity && (
                            <span>• {milestone.responsible_entity}</span>
                          )}
                          {milestone.completed_date && (
                            <span className="text-emerald-600">
                              ✓ Slutförd {format(new Date(milestone.completed_date), 'd MMM yyyy', { locale: sv })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Select
                        value={milestone.status}
                        onValueChange={(v) => handleStatusChange(milestone, v as DecisionMilestone['status'])}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Planerad</SelectItem>
                          <SelectItem value="in_progress">Pågående</SelectItem>
                          <SelectItem value="completed">Klar</SelectItem>
                          <SelectItem value="delayed">Försenad</SelectItem>
                          <SelectItem value="cancelled">Avbruten</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
