/**
 * Evolution Dashboard
 * Displays system self-improvement insights
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { 
  EvolutionReport, 
  EvolutionRecommendation,
  SemanticGap,
  EpistemicWeakness 
} from '@/lib/evolution/systemEvolutionEngine';

interface EvolutionDashboardProps {
  report: EvolutionReport;
}

export function EvolutionDashboard({ report }: EvolutionDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            [SYSTEMEVOLUTION]
            <Badge variant="outline" className="font-mono text-xs">
              {report.overallScore.toFixed(0)}/100
            </Badge>
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            [{new Date(report.generatedAt).toLocaleString('sv-SE')}]
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Health Scores */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <HealthScore 
            label="[ANATOMI]" 
            value={report.anatomicalHealth}
            description="Strukturell hälsa"
          />
          <HealthScore 
            label="[SEMANTIK]" 
            value={report.semanticCoverage}
            description="Begreppstäckning"
          />
          <HealthScore 
            label="[EPISTEMIK]" 
            value={report.epistemicIntegrity}
            description="Pedagogisk integritet"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 font-mono text-xs">
            <TabsTrigger value="overview">[ÖVERSIKT]</TabsTrigger>
            <TabsTrigger value="anatomical">[STRUKTUR]</TabsTrigger>
            <TabsTrigger value="semantic">[SEMANTIK]</TabsTrigger>
            <TabsTrigger value="epistemic">[EPISTEMIK]</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="overview">
              <RecommendationsList recommendations={report.recommendations} />
            </TabsContent>
            
            <TabsContent value="anatomical">
              <AnatomicalView 
                hotPaths={report.hotPaths}
                frictionPoints={report.frictionPoints}
              />
            </TabsContent>
            
            <TabsContent value="semantic">
              <SemanticView gaps={report.semanticGaps} />
            </TabsContent>
            
            <TabsContent value="epistemic">
              <EpistemicView weaknesses={report.epistemicWeaknesses} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function HealthScore({ label, value, description }: { 
  label: string; 
  value: number; 
  description: string;
}) {
  const getColor = (v: number) => 
    v >= 80 ? 'text-status-positive' : 
    v >= 50 ? 'text-warning' : 'text-destructive';
  
  return (
    <div className="rounded-lg border bg-card p-3 text-center">
      <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold font-mono", getColor(value))}>
        {value.toFixed(0)}
      </p>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

function RecommendationsList({ recommendations }: { 
  recommendations: EvolutionRecommendation[] 
}) {
  const priorityStyles = {
    critical: 'border-destructive/50 bg-destructive/5',
    high: 'border-warning/50 bg-warning/5',
    medium: 'border-primary/30 bg-primary/5',
    low: 'border-muted'
  };
  
  const categoryLabels = {
    anatomical: '[STRUKTUR]',
    semantic: '[SEMANTIK]',
    epistemic: '[EPISTEMIK]'
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono text-muted-foreground">[REKOMMENDATIONER]</h3>
      {recommendations.map((rec, i) => (
        <div 
          key={rec.id}
          className={cn("rounded-lg border p-3", priorityStyles[rec.priority])}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {categoryLabels[rec.category]}
                </Badge>
                <Badge 
                  variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}
                  className="text-[10px] font-mono"
                >
                  [{rec.priority.toUpperCase()}]
                </Badge>
              </div>
              <p className="text-sm font-medium">{rec.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-mono text-muted-foreground">[PÅVERKAN]</p>
              <p className="text-lg font-bold font-mono">{rec.estimatedImpact}</p>
            </div>
          </div>
          
          {rec.evidence.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <p className="text-[10px] font-mono text-muted-foreground">[EVIDENS]</p>
              <ul className="text-xs space-y-0.5 mt-1">
                {rec.evidence.map((e, j) => (
                  <li key={j} className="flex items-start gap-1">
                    <span className="text-primary font-mono">•</span>
                    <span className="text-muted-foreground">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-2 flex items-center gap-2">
            {rec.autoImplementable && (
              <Badge variant="outline" className="text-[10px] font-mono text-status-positive">
                [AUTO-FIX]
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] font-mono">
              [{rec.estimatedEffort.toUpperCase()}]
            </Badge>
          </div>
        </div>
      ))}
      
      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="font-mono text-2xl text-status-positive">[OK]</p>
          <p className="text-sm text-muted-foreground">Inga prioriterade rekommendationer</p>
        </div>
      )}
    </div>
  );
}

function AnatomicalView({ hotPaths, frictionPoints }: {
  hotPaths: string[];
  frictionPoints: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-3">
        <h4 className="text-xs font-mono text-muted-foreground mb-2">[POPULÄRA SÖKVÄGAR]</h4>
        <div className="space-y-1">
          {hotPaths.map((path, i) => (
            <div key={path} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground w-6">#{i + 1}</span>
              <span className="font-mono text-primary">{path}</span>
            </div>
          ))}
        </div>
      </div>
      
      {frictionPoints.length > 0 && (
        <div className="rounded-lg border border-warning/50 bg-warning/5 p-3">
          <h4 className="text-xs font-mono text-warning mb-2">[FRIKTIONSPUNKTER]</h4>
          <div className="space-y-1">
            {frictionPoints.map((path) => (
              <div key={path} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-warning">[!]</span>
                <span className="font-mono">{path}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SemanticView({ gaps }: { gaps: SemanticGap[] }) {
  const priorityStyles = {
    critical: 'text-destructive',
    high: 'text-warning',
    medium: 'text-primary',
    low: 'text-muted-foreground'
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono text-muted-foreground">[SEMANTISKA LUCKOR]</h3>
      {gaps.map((gap, i) => (
        <div key={i} className="rounded-lg border bg-card p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-sm">"{gap.query}"</span>
            <Badge 
              variant="outline" 
              className={cn("text-[10px] font-mono", priorityStyles[gap.priority])}
            >
              [{gap.priority.toUpperCase()}]
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{gap.suggestedAction}</p>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono">
            <span className="text-muted-foreground">Frekvens: {gap.frequency}</span>
            {gap.relatedTerms.length > 0 && (
              <span className="text-muted-foreground">
                Relaterat: {gap.relatedTerms.slice(0, 3).join(', ')}
              </span>
            )}
          </div>
        </div>
      ))}
      
      {gaps.length === 0 && (
        <div className="text-center py-8">
          <p className="font-mono text-2xl text-status-positive">[OK]</p>
          <p className="text-sm text-muted-foreground">Inga betydande semantiska luckor</p>
        </div>
      )}
    </div>
  );
}

function EpistemicView({ weaknesses }: { weaknesses: EpistemicWeakness[] }) {
  const severityStyles = {
    critical: 'border-destructive/50 bg-destructive/5',
    high: 'border-warning/50 bg-warning/5',
    medium: 'border-primary/30',
    low: 'border-muted'
  };
  
  const typeLabels: Record<EpistemicWeakness['weaknessType'], string> = {
    unclear_uncertainty: 'Otydlig osäkerhet',
    missing_context: 'Saknad kontext',
    misleading_visualization: 'Vilseledande graf',
    insufficient_warning: 'Svag varning',
    pedagogy_failure: 'Pedagogiskt fel'
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono text-muted-foreground">[EPISTEMISKA SVAGHETER]</h3>
      {weaknesses.map((weakness, i) => (
        <div 
          key={i} 
          className={cn("rounded-lg border p-3", severityStyles[weakness.severity])}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{typeLabels[weakness.weaknessType]}</span>
            <Badge variant="outline" className="text-[10px] font-mono">
              [{weakness.severity.toUpperCase()}]
            </Badge>
          </div>
          <p className="text-xs font-mono text-muted-foreground mb-2">{weakness.location}</p>
          <p className="text-xs">{weakness.suggestedFix}</p>
          <div className="mt-2">
            {weakness.evidence.map((e, j) => (
              <p key={j} className="text-[10px] text-muted-foreground">• {e}</p>
            ))}
          </div>
        </div>
      ))}
      
      {weaknesses.length === 0 && (
        <div className="text-center py-8">
          <p className="font-mono text-2xl text-status-positive">[OK]</p>
          <p className="text-sm text-muted-foreground">Inga epistemiska svagheter detekterade</p>
        </div>
      )}
    </div>
  );
}
