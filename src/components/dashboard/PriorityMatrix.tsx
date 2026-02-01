import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Scale, 
  AlertTriangle, 
  RotateCcw, 
  Loader2, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CircleDot,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface ActionOption {
  id: string;
  title: string;
  description: string;
  target_kpi_ids: string[];
  category: string;
  responsible_department: string;
  estimated_cost_sek: number | null;
  estimated_timeframe_months: number | null;
  status: string;
  proposed_at: string;
}

interface ActionEvaluation {
  id: string;
  action_id: string;
  effect_score: number;
  cost_score: number;
  risk_score: number;
  reversibility_score: number;
  weighted_score: number;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'monitor';
  effect_rationale: string;
  cost_rationale: string;
  risk_rationale: string;
  reversibility_rationale: string;
  summary: string;
  recommendation: string;
  potential_side_effects: string[];
  dependencies: string[];
  kpi_impact_forecast: { kpi_id: string; expected_change_percent: number; confidence: number }[] | null;
  evaluated_at: string;
}

interface PriorityMatrixProps {
  kpiId?: string;
}

const PRIORITY_CONFIG = {
  critical: { label: 'Kritisk', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50' },
  high: { label: 'Hög', color: 'bg-orange-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50' },
  medium: { label: 'Medel', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgLight: 'bg-yellow-50' },
  low: { label: 'Låg', color: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
  monitor: { label: 'Bevaka', color: 'bg-gray-400', textColor: 'text-gray-600', bgLight: 'bg-gray-50' },
};

const _DIMENSION_ICONS = {
  effect: Target,
  cost: Scale,
  risk: AlertTriangle,
  reversibility: RotateCcw,
};

export function PriorityMatrix({ kpiId }: PriorityMatrixProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'list'>('matrix');
  const queryClient = useQueryClient();

  // Hämta åtgärder
  const { data: actions, isLoading: actionsLoading } = useQuery({
    queryKey: ['action_options', kpiId],
    queryFn: async () => {
      let query = supabase
        .from('action_options')
        .select('*')
        .order('proposed_at', { ascending: false });
      
      if (kpiId) {
        query = query.contains('target_kpi_ids', [kpiId]);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ActionOption[];
    },
  });

  // Hämta utvärderingar
  const { data: evaluations, isLoading: evaluationsLoading } = useQuery({
    queryKey: ['action_evaluations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_evaluations')
        .select('*')
        .order('weighted_score', { ascending: false });
      if (error) throw error;
      // Map the JSON fields to proper types
      return (data || []).map(item => ({
        ...item,
        kpi_impact_forecast: Array.isArray(item.kpi_impact_forecast) 
          ? item.kpi_impact_forecast as { kpi_id: string; expected_change_percent: number; confidence: number }[]
          : null,
      })) as ActionEvaluation[];
    },
  });

  // Mutation för att utvärdera åtgärder
  const evaluateMutation = useMutation({
    mutationFn: async (actionIds: string[]) => {
      const response = await supabase.functions.invoke('prioritize-actions', {
        body: { action_ids: actionIds },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action_evaluations'] });
      toast.success('Åtgärder utvärderade');
    },
    onError: (error) => {
      console.error('Evaluation error:', error);
      toast.error('Kunde inte utvärdera åtgärder');
    },
  });

  // Kombinera åtgärder med deras senaste utvärderingar
  const actionsWithEvaluations = actions?.map(action => {
    const latestEval = evaluations
      ?.filter(e => e.action_id === action.id)
      .sort((a, b) => new Date(b.evaluated_at).getTime() - new Date(a.evaluated_at).getTime())[0];
    return { ...action, evaluation: latestEval };
  });

  // Gruppera efter prioritet för matrisen
  const groupedByPriority = actionsWithEvaluations?.reduce((acc, item) => {
    const priority = item.evaluation?.priority || 'monitor';
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(item);
    return acc;
  }, {} as Record<string, typeof actionsWithEvaluations>);

  const unevaluatedActions = actionsWithEvaluations?.filter(a => !a.evaluation) || [];

  if (actionsLoading || evaluationsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Beslutsprioriteringsmotor</h2>
          <p className="text-sm text-muted-foreground">
            AI-viktning mot effekt, kostnad, risk och reversibilitet
          </p>
        </div>
        <div className="flex gap-2">
          {unevaluatedActions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => evaluateMutation.mutate(unevaluatedActions.map(a => a.id))}
              disabled={evaluateMutation.isPending}
            >
              {evaluateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Utvärdera {unevaluatedActions.length} nya
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'matrix' | 'list')}>
        <TabsList className="grid w-full max-w-[300px] grid-cols-2">
          <TabsTrigger value="matrix">Prioriteringsmatris</TabsTrigger>
          <TabsTrigger value="list">Detaljerad lista</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-4">
          <PriorityMatrixView 
            groupedByPriority={groupedByPriority || {}}
            onSelectAction={setSelectedAction}
            selectedAction={selectedAction}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <DetailedListView 
            actions={actionsWithEvaluations || []}
            onSelectAction={setSelectedAction}
            selectedAction={selectedAction}
          />
        </TabsContent>
      </Tabs>

      {/* Detaljer för vald åtgärd */}
      {selectedAction && (
        <ActionDetailPanel 
          action={actionsWithEvaluations?.find(a => a.id === selectedAction)}
          onClose={() => setSelectedAction(null)}
        />
      )}
    </div>
  );
}

function PriorityMatrixView({ 
  groupedByPriority, 
  onSelectAction,
  selectedAction 
}: { 
  groupedByPriority: Record<string, (ActionOption & { evaluation?: ActionEvaluation })[]>;
  onSelectAction: (id: string) => void;
  selectedAction: string | null;
}) {
  const priorities = ['critical', 'high', 'medium', 'low', 'monitor'] as const;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {priorities.map(priority => {
        const config = PRIORITY_CONFIG[priority];
        const items = groupedByPriority[priority] || [];
        
        return (
          <div key={priority} className={`rounded-lg border ${config.bgLight} p-3`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              <span className={`text-sm font-medium ${config.textColor}`}>
                {config.label}
              </span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {items.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">
                  Inga åtgärder
                </p>
              ) : (
                items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelectAction(item.id)}
                    className={`w-full text-left p-2 rounded border bg-background hover:bg-accent transition-colors ${
                      selectedAction === item.id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <p className="text-xs font-medium line-clamp-2">{item.title}</p>
                    {item.evaluation && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          Poäng: {item.evaluation.weighted_score.toFixed(0)}
                        </span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailedListView({
  actions,
  onSelectAction,
  selectedAction,
}: {
  actions: (ActionOption & { evaluation?: ActionEvaluation })[];
  onSelectAction: (id: string) => void;
  selectedAction: string | null;
}) {
  // Sortera efter weighted_score
  const sorted = [...actions].sort((a, b) => 
    (b.evaluation?.weighted_score || 0) - (a.evaluation?.weighted_score || 0)
  );

  return (
    <div className="space-y-2">
      {sorted.map((item, index) => {
        const eval_ = item.evaluation;
        const priorityConfig = eval_ ? PRIORITY_CONFIG[eval_.priority] : null;
        
        return (
          <button
            key={item.id}
            onClick={() => onSelectAction(item.id)}
            className={`w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
              selectedAction === item.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  {priorityConfig && (
                    <Badge className={`${priorityConfig.color} text-white text-[10px]`}>
                      {priorityConfig.label}
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {item.description}
                </p>

                {eval_ && (
                  <div className="grid grid-cols-4 gap-2">
                    <ScoreMini label="Effekt" score={eval_.effect_score} icon={Target} />
                    <ScoreMini label="Kostnad" score={eval_.cost_score} icon={Scale} />
                    <ScoreMini label="Risk" score={eval_.risk_score} icon={AlertTriangle} inverted />
                    <ScoreMini label="Reversi." score={eval_.reversibility_score} icon={RotateCcw} />
                  </div>
                )}
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                {eval_ ? (
                  <div className="text-2xl font-bold text-foreground">
                    {eval_.weighted_score.toFixed(0)}
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Ej utvärderad
                  </Badge>
                )}
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ScoreMini({ 
  label, 
  score, 
  icon: Icon,
  inverted = false 
}: { 
  label: string; 
  score: number; 
  icon: React.ComponentType<{ className?: string }>;
  inverted?: boolean;
}) {
  // För risk är lägre bättre
  const displayScore = inverted ? 100 - score : score;
  const color = displayScore >= 70 ? 'text-positive' : displayScore >= 40 ? 'text-warning' : 'text-critical';
  
  return (
    <div className="flex items-center gap-1">
      <Icon className="w-3 h-3 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground">{label}:</span>
      <span className={`text-xs font-medium ${color}`}>{score}</span>
    </div>
  );
}

function ActionDetailPanel({
  action,
  onClose,
}: {
  action?: ActionOption & { evaluation?: ActionEvaluation };
  onClose: () => void;
}) {
  if (!action) return null;
  
  const eval_ = action.evaluation;
  const priorityConfig = eval_ ? PRIORITY_CONFIG[eval_.priority] : null;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {priorityConfig && (
                <Badge className={`${priorityConfig.color} text-white`}>
                  {priorityConfig.label} prioritet
                </Badge>
              )}
              <Badge variant="outline">{action.category}</Badge>
            </div>
            <CardTitle className="text-lg">{action.title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Beskrivning */}
        <p className="text-sm text-muted-foreground">{action.description}</p>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Ansvarig:</span>
            <span className="ml-2 font-medium">{action.responsible_department}</span>
          </div>
          {action.estimated_cost_sek && (
            <div>
              <span className="text-muted-foreground">Kostnad:</span>
              <span className="ml-2 font-medium">
                {(action.estimated_cost_sek / 1000000).toFixed(0)} MSEK
              </span>
            </div>
          )}
          {action.estimated_timeframe_months && (
            <div>
              <span className="text-muted-foreground">Tid till effekt:</span>
              <span className="ml-2 font-medium">{action.estimated_timeframe_months} mån</span>
            </div>
          )}
        </div>

        {eval_ && (
          <>
            {/* Poängmatris */}
            <div className="grid grid-cols-2 gap-3">
              <ScoreCard 
                label="Effekt" 
                score={eval_.effect_score} 
                rationale={eval_.effect_rationale}
                icon={Target}
              />
              <ScoreCard 
                label="Kostnadseffektivitet" 
                score={eval_.cost_score} 
                rationale={eval_.cost_rationale}
                icon={Scale}
              />
              <ScoreCard 
                label="Risk" 
                score={eval_.risk_score} 
                rationale={eval_.risk_rationale}
                icon={AlertTriangle}
                inverted
              />
              <ScoreCard 
                label="Reversibilitet" 
                score={eval_.reversibility_score} 
                rationale={eval_.reversibility_rationale}
                icon={RotateCcw}
              />
            </div>

            {/* Sammanfattning */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Sammanfattning</h4>
                <p className="text-sm text-muted-foreground">{eval_.summary}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Rekommendation</h4>
                <p className="text-sm">{eval_.recommendation}</p>
              </div>
            </div>

            {/* Sidoeffekter & beroenden */}
            {(eval_.potential_side_effects?.length > 0 || eval_.dependencies?.length > 0) && (
              <div className="grid grid-cols-2 gap-4">
                {eval_.potential_side_effects?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Potentiella sidoeffekter
                    </h4>
                    <ul className="text-xs space-y-1">
                      {eval_.potential_side_effects.map((effect, i) => (
                        <li key={i} className="text-muted-foreground">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {eval_.dependencies?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      Beroenden
                    </h4>
                    <ul className="text-xs space-y-1">
                      {eval_.dependencies.map((dep, i) => (
                        <li key={i} className="text-muted-foreground">• {dep}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* KPI-påverkan */}
            {eval_.kpi_impact_forecast?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Förväntad KPI-påverkan</h4>
                <div className="space-y-2">
                  {eval_.kpi_impact_forecast.map((impact, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {impact.expected_change_percent > 0 ? (
                        <TrendingUp className="w-4 h-4 text-positive" />
                      ) : impact.expected_change_percent < 0 ? (
                        <TrendingDown className="w-4 h-4 text-critical" />
                      ) : (
                        <CircleDot className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">
                        {impact.expected_change_percent > 0 ? '+' : ''}{impact.expected_change_percent.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground">
                        (konfidens: {impact.confidence}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreCard({
  label,
  score,
  rationale,
  icon: Icon,
  inverted = false,
}: {
  label: string;
  score: number;
  rationale: string;
  icon: React.ComponentType<{ className?: string }>;
  inverted?: boolean;
}) {
  // För inverterade mått (risk) är lägre bättre
  const effectiveScore = inverted ? 100 - score : score;
  const color = effectiveScore >= 70 ? 'bg-positive' : effectiveScore >= 40 ? 'bg-warning' : 'bg-critical';
  
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-lg font-bold">{score}</span>
      </div>
      <Progress value={score} className={`h-2 ${color}`} />
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{rationale}</p>
    </div>
  );
}

export default PriorityMatrix;