import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Scale, AlertTriangle, RotateCcw, Calculator, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormulaDisplayProps {
  effectScore?: number;
  costScore?: number;
  riskScore?: number;
  reversibilityScore?: number;
  weights?: {
    effect: number;
    cost: number;
    risk: number;
    reversibility: number;
  };
  showCalculation?: boolean;
}

const DEFAULT_WEIGHTS = {
  effect: 40,
  cost: 25,
  risk: 20,
  reversibility: 15,
};

export function FormulaDisplay({
  effectScore,
  costScore,
  riskScore,
  reversibilityScore,
  weights = DEFAULT_WEIGHTS,
  showCalculation = false,
}: FormulaDisplayProps) {
  const hasScores = effectScore !== undefined && 
    costScore !== undefined && 
    riskScore !== undefined && 
    reversibilityScore !== undefined;

  // Calculate weighted score
  const calculateScore = () => {
    if (!hasScores) return null;
    const invertedRisk = 100 - riskScore!;
    return (
      effectScore! * (weights.effect / 100) +
      costScore! * (weights.cost / 100) +
      invertedRisk * (weights.risk / 100) +
      reversibilityScore! * (weights.reversibility / 100)
    );
  };

  const weightedScore = calculateScore();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Viktningsformel</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="text-xs">
                  Formeln beräknar ett viktat genomsnitt där varje dimension 
                  multipliceras med sin vikt. Risk inverteras så att lägre 
                  risk ger högre poäng.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Formula */}
          <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-4">
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground text-xs mb-3">Viktad poäng =</div>
              
              <div className="grid grid-cols-1 gap-2">
                {/* Effect */}
                <FormulaRow
                  icon={Target}
                  label="Effekt"
                  score={effectScore}
                  weight={weights.effect}
                  color="emerald"
                />
                
                {/* Cost */}
                <FormulaRow
                  icon={Scale}
                  label="Kostnadseff."
                  score={costScore}
                  weight={weights.cost}
                  color="blue"
                />
                
                {/* Risk (inverted) */}
                <FormulaRow
                  icon={AlertTriangle}
                  label="(100 - Risk)"
                  score={riskScore !== undefined ? 100 - riskScore : undefined}
                  weight={weights.risk}
                  color="amber"
                  isInverted
                  originalScore={riskScore}
                />
                
                {/* Reversibility */}
                <FormulaRow
                  icon={RotateCcw}
                  label="Reversibilitet"
                  score={reversibilityScore}
                  weight={weights.reversibility}
                  color="purple"
                />
              </div>
            </div>
          </div>

          {/* Result */}
          {showCalculation && hasScores && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="font-medium">Slutpoäng</span>
              <span className="text-2xl font-bold text-primary">
                {weightedScore?.toFixed(1)}
              </span>
            </div>
          )}

          {/* Weight summary */}
          <div className="grid grid-cols-4 gap-2">
            <WeightBadge label="E" weight={weights.effect} color="emerald" />
            <WeightBadge label="K" weight={weights.cost} color="blue" />
            <WeightBadge label="R" weight={weights.risk} color="amber" />
            <WeightBadge label="Rev" weight={weights.reversibility} color="purple" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FormulaRow({
  icon: Icon,
  label,
  score,
  weight,
  color,
  isInverted: _isInverted = false,
  originalScore: _originalScore,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  score?: number;
  weight: number;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
  isInverted?: boolean;
  originalScore?: number;
}) {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-100',
    blue: 'text-blue-600 bg-blue-100',
    amber: 'text-amber-600 bg-amber-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  const result = score !== undefined ? score * (weight / 100) : null;

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded ${colorClasses[color]}`}>
          <Icon className={`w-3 h-3 ${colorClasses[color].split(' ')[0]}`} />
        </div>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono">
        {score !== undefined ? (
          <>
            <span className="font-medium">{score.toFixed(0)}</span>
            <span className="text-muted-foreground">×</span>
            <span className="text-muted-foreground">{(weight / 100).toFixed(2)}</span>
            <span className="text-muted-foreground">=</span>
            <span className="font-bold">{result?.toFixed(1)}</span>
          </>
        ) : (
          <>
            <span className="text-muted-foreground italic">poäng</span>
            <span className="text-muted-foreground">×</span>
            <span>{(weight / 100).toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  );
}

function WeightBadge({
  label,
  weight,
  color,
}: {
  label: string;
  weight: number;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
}) {
  const bgClasses = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className={`text-center py-1.5 px-2 rounded ${bgClasses[color]}`}>
      <div className="text-[10px] font-medium">{label}</div>
      <div className="text-sm font-bold">{weight}%</div>
    </div>
  );
}

export default FormulaDisplay;
