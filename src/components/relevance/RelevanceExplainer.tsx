/**
 * VARFÖR VISAS DETTA?
 * ═══════════════════════════════════════════════════════════════
 * 
 * Modal som visar exakt:
 * - vilka faktorer som bidrog
 * - hur mycket varje del vägde
 * - när poängen beräknades
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HelpCircle, Target, TrendingUp, Users, Clock, Building2, Database, Info } from 'lucide-react';

interface RelevanceBreakdown {
  impactRaw: number;
  accelerationRaw: number;
  breadthRaw: number;
  persistenceRaw: number;
  responsibilityRaw: number;
  dataConfidenceRaw: number;
  impactWeighted: number;
  accelerationWeighted: number;
  breadthWeighted: number;
  persistenceWeighted: number;
  responsibilityWeighted: number;
  dataConfidenceContribution: number;
  calculationDetails?: Record<string, string>;
}

interface RelevanceExplainerProps {
  totalScore: number;
  breakdown: RelevanceBreakdown;
  primaryReason: string;
  secondaryReasons?: string[];
  calculatedAt?: string;
  weightVersion?: number;
  kpiName?: string;
}

export function RelevanceExplainer({
  totalScore,
  breakdown,
  primaryReason,
  secondaryReasons = [],
  calculatedAt,
  weightVersion = 1,
  kpiName,
}: RelevanceExplainerProps) {
  const components = [
    {
      name: 'Impact',
      label: 'Påverkan på masterindex',
      icon: Target,
      raw: breakdown.impactRaw,
      weighted: breakdown.impactWeighted,
      maxWeight: 30,
      description: 'Hur starkt bidrar denna indikator till det nationella funktionsindexet?',
      detail: breakdown.calculationDetails?.impact,
      color: 'bg-blue-500',
    },
    {
      name: 'Acceleration',
      label: 'Förändringstakt',
      icon: TrendingUp,
      raw: breakdown.accelerationRaw,
      weighted: breakdown.accelerationWeighted,
      maxWeight: 20,
      description: 'Hur snabbt förändras värdet just nu?',
      detail: breakdown.calculationDetails?.acceleration,
      color: 'bg-orange-500',
    },
    {
      name: 'Breadth',
      label: 'Geografisk spridning',
      icon: Users,
      raw: breakdown.breadthRaw,
      weighted: breakdown.breadthWeighted,
      maxWeight: 15,
      description: 'Hur många människor och regioner berörs?',
      detail: breakdown.calculationDetails?.breadth,
      color: 'bg-green-500',
    },
    {
      name: 'Persistence',
      label: 'Varaktighet',
      icon: Clock,
      raw: breakdown.persistenceRaw,
      weighted: breakdown.persistenceWeighted,
      maxWeight: 15,
      description: 'Hur länge har trenden pågått?',
      detail: breakdown.calculationDetails?.persistence,
      color: 'bg-purple-500',
    },
    {
      name: 'Responsibility',
      label: 'Ansvarsmandat',
      icon: Building2,
      raw: breakdown.responsibilityRaw,
      weighted: breakdown.responsibilityWeighted,
      maxWeight: 10,
      description: 'Finns tydligt ansvar kopplat till denna indikator?',
      detail: breakdown.calculationDetails?.responsibility,
      color: 'bg-indigo-500',
    },
    {
      name: 'Data Confidence',
      label: 'Datakvalitet',
      icon: Database,
      raw: breakdown.dataConfidenceRaw,
      weighted: breakdown.dataConfidenceContribution,
      maxWeight: 10,
      description: 'Hur robust och aktuell är datan?',
      detail: breakdown.calculationDetails?.dataConfidence,
      color: breakdown.dataConfidenceContribution >= 0 ? 'bg-emerald-500' : 'bg-red-500',
      isConfidence: true,
    },
  ];

  const formattedDate = calculatedAt 
    ? new Date(calculatedAt).toLocaleString('sv-SE', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Idag';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Varför visas detta?</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Varför visas detta?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Huvudsammanfattning */}
          <div className="rounded-lg bg-muted/50 p-4">
            {kpiName && (
              <p className="text-sm text-muted-foreground mb-1">Indikator</p>
            )}
            {kpiName && (
              <p className="font-medium mb-3">{kpiName}</p>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Relevanspoäng</p>
                <p className="text-2xl font-bold">{totalScore.toFixed(1)}</p>
              </div>
              <Badge variant={totalScore >= 75 ? 'destructive' : totalScore >= 50 ? 'default' : 'secondary'}>
                {totalScore >= 75 ? 'Kritisk' : totalScore >= 50 ? 'Hög' : 'Normal'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <span className="font-medium text-foreground">{primaryReason}</span>
              {secondaryReasons.length > 0 && (
                <span className="block mt-1">
                  Även: {secondaryReasons.join(', ').toLowerCase()}
                </span>
              )}
            </p>
          </div>

          {/* Komponentnedbrytning */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Komponentnedbrytning</h4>
            
            {components.map((comp) => {
              const Icon = comp.icon;
              const percentage = (comp.weighted / comp.maxWeight) * 100;
              
              return (
                <div key={comp.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{comp.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {comp.isConfidence 
                          ? `${comp.weighted >= 0 ? '+' : ''}${comp.weighted.toFixed(1)}`
                          : `${comp.weighted.toFixed(1)} / ${comp.maxWeight}`
                        }
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {comp.raw.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={comp.isConfidence ? 50 + (comp.weighted / comp.maxWeight) * 50 : Math.max(0, percentage)} 
                    className="h-2" 
                  />
                  {comp.detail && (
                    <p className="text-xs text-muted-foreground">{comp.detail}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <span>Beräknad: {formattedDate}</span>
            <span>Viktversion: {weightVersion}</span>
          </div>

          {/* Transparensmeddelande */}
          <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            Relevansmotorn är helt automatiserad och redaktörsfri. Vikterna är öppna, 
            dokumenterade och versionerade. Alla historiska startsidor kan återskapas.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
