import { PriorityMatrix } from './PriorityMatrix';
import { NewActionForm } from './NewActionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Lightbulb } from 'lucide-react';

interface DecisionPriorityPanelProps {
  kpiId?: string;
}

export function DecisionPriorityPanel({ kpiId }: DecisionPriorityPanelProps) {
  return (
    <div className="space-y-6">
      {/* Introduktion */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Beslutsprioriteringsmotor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            AI-driven viktning av åtgärdsförslag mot fyra dimensioner för objektiv prioritering:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <DimensionInfo 
              title="Effekt" 
              description="Förväntad positiv påverkan på målindikatorerna"
              weight="40%"
            />
            <DimensionInfo 
              title="Kostnad" 
              description="Kostnadseffektivitet relativt förväntad nytta"
              weight="25%"
            />
            <DimensionInfo 
              title="Risk" 
              description="Sannolikhet för negativa sidoeffekter"
              weight="20%"
            />
            <DimensionInfo 
              title="Reversibilitet" 
              description="Möjlighet att backa vid misslyckande"
              weight="15%"
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
    </div>
  );
}

function DimensionInfo({ 
  title, 
  description, 
  weight 
}: { 
  title: string; 
  description: string; 
  weight: string;
}) {
  return (
    <div className="bg-background rounded-lg p-3 border">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-muted-foreground">{weight}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default DecisionPriorityPanel;