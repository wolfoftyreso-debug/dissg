import { useState } from 'react';
import { PriorityMatrix } from './PriorityMatrix';
import { NewActionForm } from './NewActionForm';
import { WeightSliders } from './WeightSliders';
import { FormulaDisplay } from './FormulaDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Lightbulb, Settings2, BarChart3 } from 'lucide-react';

interface DecisionPriorityPanelProps {
  kpiId?: string;
}

interface Weights {
  effect: number;
  cost: number;
  risk: number;
  reversibility: number;
}

const DEFAULT_WEIGHTS: Weights = {
  effect: 40,
  cost: 25,
  risk: 20,
  reversibility: 15,
};

export function DecisionPriorityPanel({ kpiId }: DecisionPriorityPanelProps) {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  return (
    <div className="space-y-6">
      {/* Header med tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'overview' | 'settings')}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Beslutsprioriteringsmotor
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-driven viktning av åtgärdsförslag mot fyra dimensioner
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Vikter
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Översikt-tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Dimensionsinfo */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Viktningsformel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Varje åtgärd poängsätts enligt formeln:
              </p>
              
              {/* Visual formula */}
              <div className="bg-background rounded-lg p-4 font-mono text-sm border mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">Poäng =</span>
                  <span className="text-emerald-600 font-medium">Effekt</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">
                    {(weights.effect / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">+</span>
                  <span className="text-blue-600 font-medium">Kostnad</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                    {(weights.cost / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">+</span>
                  <span className="text-amber-600 font-medium">(100-Risk)</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                    {(weights.risk / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">+</span>
                  <span className="text-purple-600 font-medium">Reversi.</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">
                    {(weights.reversibility / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <DimensionInfo 
                  title="Effekt" 
                  description="Förväntad positiv påverkan på målindikatorerna"
                  weight={`${weights.effect}%`}
                  color="emerald"
                />
                <DimensionInfo 
                  title="Kostnad" 
                  description="Kostnadseffektivitet relativt förväntad nytta"
                  weight={`${weights.cost}%`}
                  color="blue"
                />
                <DimensionInfo 
                  title="Risk" 
                  description="Sannolikhet för negativa sidoeffekter (inverteras)"
                  weight={`${weights.risk}%`}
                  color="amber"
                />
                <DimensionInfo 
                  title="Reversibilitet" 
                  description="Möjlighet att backa vid misslyckande"
                  weight={`${weights.reversibility}%`}
                  color="purple"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="w-4 h-4" />
              <span>Lägg till åtgärdsförslag för AI-utvärdering</span>
            </div>
            <NewActionForm kpiIds={kpiId ? [kpiId] : []} />
          </div>

          {/* Priority Matrix */}
          <PriorityMatrix kpiId={kpiId} />
        </TabsContent>

        {/* Settings-tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <WeightSliders 
              initialWeights={weights}
              onChange={setWeights}
              showFormula={false}
            />
            <FormulaDisplay 
              weights={weights}
              showCalculation={false}
            />
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-medium text-sm mb-2">Om viktningen</h4>
            <p className="text-sm text-muted-foreground">
              Standardvikterna är baserade på beslutsteoretiska principer där 
              <strong className="text-foreground"> effekt</strong> väger tyngst (40%) eftersom det är huvudmålet, 
              följt av <strong className="text-foreground">kostnadseffektivitet</strong> (25%). 
              <strong className="text-foreground"> Risk</strong> (20%) inverteras i beräkningen så att lägre risk 
              ger högre poäng. <strong className="text-foreground">Reversibilitet</strong> (15%) ger bonus till 
              åtgärder som kan ångras vid misslyckande.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DimensionInfo({ 
  title, 
  description, 
  weight,
  color,
}: { 
  title: string; 
  description: string; 
  weight: string;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
}) {
  const colorClasses = {
    emerald: 'border-emerald-200 bg-emerald-50',
    blue: 'border-blue-200 bg-blue-50',
    amber: 'border-amber-200 bg-amber-50',
    purple: 'border-purple-200 bg-purple-50',
  };
  
  const textColorClasses = {
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
    purple: 'text-purple-700',
  };

  return (
    <div className={`rounded-lg p-3 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`font-medium text-sm ${textColorClasses[color]}`}>{title}</span>
        <span className={`text-xs font-bold ${textColorClasses[color]}`}>{weight}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default DecisionPriorityPanel;