import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Map,
  Building2,
  Users,
  Database,
  FileText,
  Lock,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { DEPTH_LEVELS, PRIVACY_CONFIG, PRIVACY_MESSAGES, type DepthLevel } from '@/config/depthModelConfig';
import { cn } from '@/lib/utils';

interface DepthNavigatorProps {
  currentLevel: DepthLevel;
  onLevelChange: (level: DepthLevel) => void;
  observationCount?: number;
  selectedRegion?: string;
  selectedKpi?: string;
}

const LEVEL_ICONS = [Globe, Map, Building2, Users, Database, FileText];

export function DepthNavigator({
  currentLevel,
  onLevelChange,
  observationCount = 1000000,
  selectedRegion,
  selectedKpi,
}: DepthNavigatorProps) {
  const currentConfig = DEPTH_LEVELS[currentLevel];
  const isBlocked = observationCount < PRIVACY_CONFIG.minCellSize;
  const isWarning = observationCount < PRIVACY_CONFIG.warningThreshold;

  const canDrillDown = currentLevel < 5 && !isBlocked;
  const canDrillUp = currentLevel > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Analysnivå
              <Badge variant="outline" className="font-mono">
                Nivå {currentLevel}
              </Badge>
            </CardTitle>
            <CardDescription>
              {currentConfig.question}
            </CardDescription>
          </div>
          {isBlocked && (
            <Badge variant="destructive" className="gap-1">
              <Lock className="h-3 w-3" />
              Spärrad
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Breadcrumb */}
        <div className="flex items-center gap-1 text-sm overflow-x-auto pb-2">
          {DEPTH_LEVELS.slice(0, currentLevel + 1).map((level, idx) => {
            const Icon = LEVEL_ICONS[idx];
            return (
              <div key={level.id} className="flex items-center">
                {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
                <button
                  onClick={() => onLevelChange(idx as DepthLevel)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md transition-colors",
                    idx === currentLevel 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span className="whitespace-nowrap">{level.name}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Current Level Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            {(() => {
              const Icon = LEVEL_ICONS[currentLevel];
              return <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />;
            })()}
            <div>
              <p className="font-medium">{currentConfig.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentConfig.description}
              </p>
            </div>
          </div>

          {currentConfig.example && (
            <Alert className="bg-background">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <span className="font-medium">Exempel:</span> {currentConfig.example}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Observation Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Observationer</span>
            <span className="font-mono">
              {observationCount.toLocaleString('sv-SE')}
            </span>
          </div>
          <Progress 
            value={Math.min(100, (observationCount / currentConfig.minObservations) * 100)} 
            className={cn(
              "h-2",
              isBlocked && "[&>div]:bg-destructive",
              isWarning && !isBlocked && "[&>div]:bg-status-warning"
            )}
          />
          <p className="text-xs text-muted-foreground">
            Minimum för denna nivå: {currentConfig.minObservations.toLocaleString('sv-SE')}
          </p>
        </div>

        {/* Privacy Warning */}
        {isWarning && (
          <Alert variant={isBlocked ? "destructive" : "default"} className="bg-muted/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {isBlocked ? PRIVACY_MESSAGES.blocked : PRIVACY_MESSAGES.warning}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!canDrillUp}
            onClick={() => onLevelChange((currentLevel - 1) as DepthLevel)}
            className="flex-1"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Upp
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!canDrillDown}
            onClick={() => onLevelChange((currentLevel + 1) as DepthLevel)}
            className="flex-1"
          >
            Ned
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Context */}
        {(selectedRegion || selectedKpi) && (
          <div className="pt-2 border-t space-y-1">
            {selectedRegion && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Region</span>
                <Badge variant="secondary">{selectedRegion}</Badge>
              </div>
            )}
            {selectedKpi && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Indikator</span>
                <Badge variant="secondary">{selectedKpi}</Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
