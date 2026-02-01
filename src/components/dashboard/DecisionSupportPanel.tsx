import { useState } from 'react';
import { KPI } from '@/types/kpi';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  Zap,
  Scale,
  DollarSign,
  Shield,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  FileText,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionSupportPanelProps {
  kpi: KPI;
  forecastData?: any;
}

interface Action {
  id: string;
  title: string;
  description: string;
  category: 'policy' | 'investment' | 'regulation' | 'organizational' | 'communication';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  effect: {
    score: number;
    description: string;
    magnitude: string;
    confidence: number;
  };
  cost: {
    score: number;
    estimate: string;
    type: 'one_time' | 'recurring' | 'mixed';
  };
  risk: {
    score: number;
    factors: string[];
    mitigation: string;
  };
  implementation: {
    complexity: 'low' | 'medium' | 'high';
    responsible_ministry: string;
    key_stakeholders: string[];
    first_steps: string[];
  };
  dependencies: string[];
  side_effects: {
    positive: string[];
    negative: string[];
  };
  priority_score: number;
}

interface DecisionData {
  actions: Action[];
  summary: {
    recommended_action: string;
    rationale: string;
    alternative_approach: string;
    warning?: string;
  };
  quick_wins: string[];
  requires_legislation: string[];
}

const CATEGORY_CONFIG = {
  policy: { label: 'Policy', icon: FileText, color: 'text-blue-400' },
  investment: { label: 'Investering', icon: DollarSign, color: 'text-green-400' },
  regulation: { label: 'Reglering', icon: Scale, color: 'text-purple-400' },
  organizational: { label: 'Organisation', icon: Building2, color: 'text-orange-400' },
  communication: { label: 'Kommunikation', icon: Users, color: 'text-cyan-400' },
};

const TIMEFRAME_CONFIG = {
  immediate: { label: 'Omedelbart', color: 'bg-status-critical/20 text-status-critical' },
  short_term: { label: '0-6 mån', color: 'bg-status-warning/20 text-status-warning' },
  medium_term: { label: '6-18 mån', color: 'bg-primary/20 text-primary' },
  long_term: { label: '18+ mån', color: 'bg-muted text-muted-foreground' },
};

const COMPLEXITY_CONFIG = {
  low: { label: 'Låg', color: 'text-status-positive' },
  medium: { label: 'Medel', color: 'text-status-warning' },
  high: { label: 'Hög', color: 'text-status-critical' },
};

function ScoreBar({ score, max = 10, colorFn }: { score: number; max?: number; colorFn?: (score: number) => string }) {
  const percentage = (score / max) * 100;
  const defaultColor = score <= 3 ? 'bg-status-positive' : score <= 6 ? 'bg-status-warning' : 'bg-status-critical';
  const color = colorFn ? colorFn(score) : defaultColor;
  
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div 
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground w-4">{score}</span>
    </div>
  );
}

function EffectScoreBar({ score }: { score: number }) {
  return <ScoreBar score={score} colorFn={(s) => s >= 7 ? 'bg-status-positive' : s >= 4 ? 'bg-status-warning' : 'bg-status-critical'} />;
}

export function DecisionSupportPanel({ kpi, forecastData }: DecisionSupportPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [decisions, setDecisions] = useState<DecisionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  const generateDecisions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('kpi-decisions', {
        body: { 
          kpi: {
            id: kpi.id,
            name: kpi.name,
            category: kpi.category,
            value: kpi.value,
            unit: kpi.unit,
            trend: kpi.trend,
            trendPercent: kpi.trendPercent,
            status: kpi.status,
            inverted: kpi.inverted,
            rationale: kpi.rationale,
          },
          forecastData,
          constraints: {
            timeframe: '12 månader',
          }
        }
      });

      if (fnError) throw fnError;

      if (data?.decisions) {
        setDecisions(data.decisions);
        if (data.decisions.actions?.length > 0) {
          setExpandedAction(data.decisions.actions[0].id);
        }
      } else {
        throw new Error('Ingen analysdata mottagen');
      }
    } catch (err) {
      console.error('Decision support error:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte generera åtgärdsförslag');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAction = (actionId: string) => {
    setExpandedAction(expandedAction === actionId ? null : actionId);
  };

  if (!decisions && !isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Beslutsstöd (Nivå 4)
        </h3>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-accent/10 p-2">
              <Zap className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                AI-driven åtgärdsanalys
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Genererar konkreta åtgärdsförslag viktade mot effekt, kostnad och risk.
                Inkluderar implementeringsplan och ansvariga departement.
              </p>
              <button
                onClick={generateDecisions}
                disabled={isLoading}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyserar...
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3" />
                    Generera åtgärdsförslag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Beslutsstöd (Nivå 4)
        </h3>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">
              Genererar åtgärdsförslag...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Beslutsstöd (Nivå 4)
        </h3>
        <div className="rounded-lg border border-status-critical/30 bg-status-critical/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-status-critical" />
            <div>
              <p className="text-sm font-medium text-status-critical">Fel vid analys</p>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
              <button
                onClick={generateDecisions}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!decisions) return null;

  const recommendedAction = decisions.actions?.find(a => a.id === decisions.summary?.recommended_action);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Beslutsstöd (Nivå 4)
        </h3>
        <button
          onClick={generateDecisions}
          className="text-xs text-primary hover:underline"
        >
          Uppdatera
        </button>
      </div>

      {/* Recommendation Summary */}
      {decisions.summary && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Rekommenderad åtgärd
              </p>
              {recommendedAction && (
                <p className="mt-1 text-sm text-foreground font-medium">
                  {recommendedAction.title}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {decisions.summary.rationale}
              </p>
              {decisions.summary.warning && (
                <div className="mt-2 flex items-start gap-2 rounded bg-status-warning/10 px-2 py-1.5">
                  <AlertCircle className="h-3 w-3 text-status-warning mt-0.5" />
                  <p className="text-xs text-status-warning">{decisions.summary.warning}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {decisions.quick_wins?.length > 0 && (
        <div className="rounded-lg border border-status-positive/30 bg-status-positive/5 p-3">
          <p className="text-xs font-medium text-status-positive flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Snabba vinster
          </p>
          <ul className="mt-2 space-y-1">
            {decisions.quick_wins.map((win, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <ArrowRight className="h-3 w-3 text-status-positive mt-0.5" />
                {win}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions List */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          ÅTGÄRDSFÖRSLAG ({decisions.actions?.length || 0})
        </p>
        
        {decisions.actions?.map((action, index) => {
          const CategoryIcon = CATEGORY_CONFIG[action.category]?.icon || FileText;
          const isExpanded = expandedAction === action.id;
          const isRecommended = action.id === decisions.summary?.recommended_action;
          
          return (
            <div 
              key={action.id} 
              className={cn(
                "rounded-lg border bg-card overflow-hidden transition-all",
                isRecommended ? "border-primary/50" : "border-border"
              )}
            >
              {/* Action Header */}
              <button
                onClick={() => toggleAction(action.id)}
                className="flex w-full items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  isRecommended ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{action.title}</span>
                    {isRecommended && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        REKOMMENDERAD
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px]",
                      CATEGORY_CONFIG[action.category]?.color
                    )}>
                      <CategoryIcon className="h-3 w-3" />
                      {CATEGORY_CONFIG[action.category]?.label}
                    </span>
                    <span className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      TIMEFRAME_CONFIG[action.timeframe]?.color
                    )}>
                      {TIMEFRAME_CONFIG[action.timeframe]?.label}
                    </span>
                  </div>
                </div>
                {/* Score Summary */}
                <div className="flex items-center gap-3 text-[10px]">
                  <div className="text-center">
                    <p className="text-muted-foreground">Effekt</p>
                    <p className={cn(
                      "font-bold",
                      action.effect.score >= 7 ? "text-status-positive" : 
                      action.effect.score >= 4 ? "text-status-warning" : "text-status-critical"
                    )}>
                      {action.effect.score}/10
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Kostnad</p>
                    <p className={cn(
                      "font-bold",
                      action.cost.score <= 3 ? "text-status-positive" : 
                      action.cost.score <= 6 ? "text-status-warning" : "text-status-critical"
                    )}>
                      {action.cost.score}/10
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Risk</p>
                    <p className={cn(
                      "font-bold",
                      action.risk.score <= 3 ? "text-status-positive" : 
                      action.risk.score <= 6 ? "text-status-warning" : "text-status-critical"
                    )}>
                      {action.risk.score}/10
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border p-3 space-y-4">
                  <p className="text-sm text-muted-foreground">{action.description}</p>

                  {/* Scores Detail */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" /> EFFEKT
                      </p>
                      <EffectScoreBar score={action.effect.score} />
                      <p className="text-xs text-foreground">{action.effect.magnitude}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {action.effect.confidence}% säkerhet
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> KOSTNAD
                      </p>
                      <ScoreBar score={action.cost.score} />
                      <p className="text-xs text-foreground">{action.cost.estimate}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {action.cost.type === 'one_time' ? 'Engångskostnad' : 
                         action.cost.type === 'recurring' ? 'Löpande' : 'Blandad'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" /> RISK
                      </p>
                      <ScoreBar score={action.risk.score} />
                      {action.risk.factors?.slice(0, 2).map((factor, i) => (
                        <p key={i} className="text-[10px] text-muted-foreground">• {factor}</p>
                      ))}
                    </div>
                  </div>

                  {/* Implementation */}
                  <div className="rounded bg-muted/50 p-2 space-y-2">
                    <p className="text-[10px] font-medium text-muted-foreground">IMPLEMENTERING</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Komplexitet:</p>
                        <p className={cn("font-medium", COMPLEXITY_CONFIG[action.implementation.complexity]?.color)}>
                          {COMPLEXITY_CONFIG[action.implementation.complexity]?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ansvarigt departement:</p>
                        <p className="font-medium text-foreground">{action.implementation.responsible_ministry}</p>
                      </div>
                    </div>
                    {action.implementation.first_steps?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Första steg:</p>
                        <ol className="space-y-0.5">
                          {action.implementation.first_steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <span className="text-muted-foreground">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  {/* Side Effects */}
                  {(action.side_effects?.positive?.length > 0 || action.side_effects?.negative?.length > 0) && (
                    <div className="grid grid-cols-2 gap-2">
                      {action.side_effects.positive?.length > 0 && (
                        <div className="rounded bg-status-positive/5 border border-status-positive/20 p-2">
                          <p className="text-[10px] font-medium text-status-positive flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Positiva bieffekter
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {action.side_effects.positive.map((effect, i) => (
                              <li key={i} className="text-[10px] text-foreground">• {effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {action.side_effects.negative?.length > 0 && (
                        <div className="rounded bg-status-critical/5 border border-status-critical/20 p-2">
                          <p className="text-[10px] font-medium text-status-critical flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Negativa bieffekter
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {action.side_effects.negative.map((effect, i) => (
                              <li key={i} className="text-[10px] text-foreground">• {effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Requires Legislation */}
      {decisions.requires_legislation?.length > 0 && (
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-3">
          <p className="text-xs font-medium text-status-warning flex items-center gap-1.5">
            <Scale className="h-3 w-3" />
            Kräver lagändring
          </p>
          <ul className="mt-2 space-y-1">
            {decisions.requires_legislation.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
