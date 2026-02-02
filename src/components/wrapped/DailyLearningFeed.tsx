import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Globe,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { 
  type DailyLearning, 
  type PatternLifecycle,
  generateDailySummary,
  STAGE_DISPLAY 
} from '@/config/publicLearningConfig';
import { cn } from '@/lib/utils';

interface DailyLearningFeedProps {
  learning: DailyLearning;
  onViewInsight?: (id: string) => void;
  onViewPattern?: (id: string) => void;
  className?: string;
}

export function DailyLearningFeed({ 
  learning, 
  onViewInsight,
  onViewPattern,
  className 
}: DailyLearningFeedProps) {
  const summary = generateDailySummary(learning);

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">
                {new Date(learning.learningDate).toLocaleDateString('sv-SE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Daglig sammanfattning</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-2">
          <StatBox 
            icon={<Lightbulb className="h-4 w-4" />}
            value={learning.totalNewInsights}
            label="Nya insikter"
            color="text-primary"
          />
          <StatBox 
            icon={<CheckCircle className="h-4 w-4" />}
            value={learning.totalConfirmedPatterns}
            label="Bekräftade"
            color="text-status-positive"
          />
          <StatBox 
            icon={<XCircle className="h-4 w-4" />}
            value={learning.totalFalsifiedPatterns}
            label="Falsifierade"
            color="text-status-critical"
          />
          <StatBox 
            icon={<RefreshCw className="h-4 w-4" />}
            value={learning.totalReplications}
            label="Replikationer"
            color="text-blue-500"
          />
        </div>

        {/* Summary text */}
        <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
          {summary}
        </p>

        <Separator />

        {/* Top learnings */}
        {learning.topLearnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-status-positive" />
              Viktigaste lärdomarna
            </h4>
            <ul className="space-y-2">
              {learning.topLearnings.slice(0, 3).map((item) => (
                <li 
                  key={item.id}
                  className="flex items-start justify-between p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onViewInsight?.(item.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.isNew && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          Ny
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.summary}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notable failures */}
        {learning.notableFailures.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-status-critical" />
              Vad som inte fungerade
            </h4>
            <ul className="space-y-2">
              {learning.notableFailures.slice(0, 2).map((item) => (
                <li 
                  key={item.id}
                  className="p-2 border border-status-critical/30 bg-status-critical/5 rounded-md"
                >
                  <p className="text-sm font-medium">{item.hypothesis}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Varför:</strong> {item.whyFailed}
                  </p>
                  <p className="text-xs text-status-positive mt-1">
                    <strong>Lärdom:</strong> {item.whatWeLearned}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Replication updates */}
        {learning.replicationUpdates.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              Replikeringsuppdateringar
            </h4>
            <ul className="space-y-2">
              {learning.replicationUpdates.slice(0, 3).map((update, i) => (
                <li 
                  key={i}
                  className="flex items-center gap-2 text-sm"
                  onClick={() => onViewPattern?.(update.patternId)}
                >
                  <Badge variant="outline" className={cn('text-xs', STAGE_DISPLAY[update.previousStage].color)}>
                    {STAGE_DISPLAY[update.previousStage].label}
                  </Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="outline" className={cn('text-xs', STAGE_DISPLAY[update.newStage].color)}>
                    {STAGE_DISPLAY[update.newStage].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex-1 truncate">
                    {update.patternDescription}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Countries */}
        {learning.countriesWithUpdates.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Uppdateringar från: {learning.countriesWithUpdates.join(', ')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatBoxProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

function StatBox({ icon, value, label, color }: StatBoxProps) {
  return (
    <div className="text-center p-2 bg-muted/30 rounded-md">
      <div className={cn('flex justify-center mb-1', color)}>
        {icon}
      </div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

/**
 * Pattern lifecycle card
 */
interface PatternLifecycleCardProps {
  pattern: PatternLifecycle;
  onViewDetails?: () => void;
  className?: string;
}

export function PatternLifecycleCard({ pattern, onViewDetails, className }: PatternLifecycleCardProps) {
  const stageInfo = STAGE_DISPLAY[pattern.stage];
  
  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={cn('text-xs', stageInfo.color)}>
            {stageInfo.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {pattern.replications} rep / {pattern.failedReplications} misslyckade
          </span>
        </div>
        
        <p className="text-sm font-medium mb-2">{pattern.patternDescription}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Först: {pattern.firstObservedGeo}</span>
          {pattern.confirmedInGeos.length > 0 && (
            <span>Bekräftad i {pattern.confirmedInGeos.length} regioner</span>
          )}
        </div>
        
        {onViewDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewDetails}
            className="w-full mt-3 text-xs"
          >
            Visa historik <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
