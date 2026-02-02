/**
 * BLOCK TB — INSIGHT BLUEPRINT
 * "För att undersöka detta tittar vi på..."
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, Calendar, Users, AlertTriangle, 
  ChevronRight, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InsightBlueprint } from '@/config/personalInsightConfig';

interface InsightBlueprintViewProps {
  blueprint: InsightBlueprint;
  onProceed: () => void;
}

export function InsightBlueprintView({ blueprint, onProceed }: InsightBlueprintViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Analysplan
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          För att undersöka detta tittar vi på...
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data points */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4" />
            Datapunkter
          </div>
          <div className="pl-6 space-y-1">
            {blueprint.dataPoints.map((dp) => (
              <div key={dp.id} className="flex items-center justify-between text-sm">
                <span>{dp.nameSv}</span>
                <span className="text-xs text-muted-foreground">{dp.relevance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time period */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Tidsperiod
          </div>
          <div className="pl-6 text-sm">
            <span>{blueprint.timePeriod.start} – {blueprint.timePeriod.end}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {blueprint.timePeriod.reason}
            </p>
          </div>
        </div>

        {/* Comparison groups */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4" />
            Jämförelsegrupper
          </div>
          <div className="pl-6 flex flex-wrap gap-1">
            {blueprint.comparisonGroups.map((group) => (
              <Badge key={group.id} variant="secondary">
                {group.nameSv}
              </Badge>
            ))}
          </div>
        </div>

        {/* Potential confounders */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Möjliga störfaktorer
          </div>
          <div className="pl-6 space-y-1">
            {blueprint.potentialConfounders.map((conf, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{conf.factorSv}</span>
                <Badge 
                  variant="outline" 
                  className={
                    conf.impact === 'high' ? 'text-destructive border-destructive' :
                    conf.impact === 'medium' ? 'text-warning border-warning' :
                    'text-muted-foreground'
                  }
                >
                  {conf.impact === 'high' ? 'Hög' : conf.impact === 'medium' ? 'Medel' : 'Låg'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Begränsningar att beakta:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {blueprint.limitationsSv.map((lim, i) => (
              <li key={i}>• {lim}</li>
            ))}
          </ul>
        </div>

        <Button onClick={onProceed} className="w-full">
          Påbörja utforskning
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
