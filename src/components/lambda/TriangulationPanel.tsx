/**
 * TRIANGULATION PANEL
 * 
 * Cross-sensor validation display.
 * Rule: At least 3 independent indices required for deviation to be marked.
 * 
 * Shows convergence of multiple data sources to establish signal validity.
 */

import { CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ValidationReport } from '@/lib/lambda/sensor-triangulation';
import { 
  getTriangulationColor, 
  getTriangulationLabel,
  TRIANGULATION_GROUPS 
} from '@/lib/lambda/sensor-triangulation';

interface TriangulationPanelProps {
  report: ValidationReport;
  language?: 'sv' | 'en';
  className?: string;
}

export function TriangulationPanel({
  report,
  language = 'sv',
  className,
}: TriangulationPanelProps) {
  const labels = {
    title: { sv: 'Sensorvalidering', en: 'Sensor Validation' },
    subtitle: { 
      sv: 'Minst 3 oberoende källor krävs för bekräftad signal', 
      en: 'At least 3 independent sources required for confirmed signal' 
    },
    systemConfidence: { sv: 'Systemkonfidens', en: 'System Confidence' },
    groups: { sv: 'Sensorgrupper', en: 'Sensor Groups' },
    confirmed: { sv: 'Bekräftade', en: 'Confirmed' },
    partial: { sv: 'Delvis', en: 'Partial' },
    divergent: { sv: 'Divergerande', en: 'Divergent' },
    insufficient: { sv: 'Otillräckliga', en: 'Insufficient' },
    warnings: { sv: 'Varningar', en: 'Warnings' },
    deviation: { sv: 'Avvikelse', en: 'Deviation' },
  };
  
  const statusIcons = {
    confirmed: CheckCircle,
    partial: AlertCircle,
    divergent: XCircle,
    insufficient: HelpCircle,
  };
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div>
            <span>{labels.title[language]}</span>
            <p className="text-xs text-muted-foreground font-normal mt-1">
              {labels.subtitle[language]}
            </p>
          </div>
          
          {/* Overall confidence */}
          <div className="text-right">
            <span className="text-xs text-muted-foreground">
              {labels.systemConfidence[language]}
            </span>
            <div className="text-2xl font-mono font-bold">
              {(report.overall_system_confidence * 100).toFixed(0)}%
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatBox
            label={labels.confirmed[language]}
            value={report.confirmed_groups}
            total={report.total_groups}
            color="text-blue-500"
          />
          <StatBox
            label={labels.partial[language]}
            value={report.partial_groups}
            total={report.total_groups}
            color="text-amber-500"
          />
          <StatBox
            label={labels.divergent[language]}
            value={report.divergent_groups}
            total={report.total_groups}
            color="text-red-500"
          />
          <StatBox
            label={labels.insufficient[language]}
            value={report.insufficient_groups}
            total={report.total_groups}
            color="text-muted-foreground"
          />
        </div>
        
        {/* Triangulation groups */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">{labels.groups[language]}</h4>
          
          {report.results.map((result) => {
            const group = TRIANGULATION_GROUPS.find(g => g.group_id === result.group_id);
            const StatusIcon = statusIcons[result.status];
            const color = getTriangulationColor(result.status);
            
            return (
              <div 
                key={result.group_id}
                className="flex items-center gap-4 p-3 rounded-lg border"
              >
                <StatusIcon 
                  className="h-5 w-5 shrink-0" 
                  style={{ color }} 
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {group 
                        ? (language === 'sv' ? group.name_sv : group.name_en)
                        : result.group_id
                      }
                    </span>
                    <span 
                      className="text-xs font-medium"
                      style={{ color }}
                    >
                      {getTriangulationLabel(result.status, language)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Progress 
                      value={result.confidence * 100} 
                      className="flex-1 h-1.5"
                    />
                    <span className="text-xs text-muted-foreground font-mono w-12 text-right">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  {result.deviation > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {labels.deviation[language]}: ±{result.deviation.toFixed(1)}%
                    </p>
                  )}
                  
                  {result.divergent_sensors.length > 0 && (
                    <p className="text-xs text-red-500 mt-1 font-mono">
                      {result.divergent_sensors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Warnings */}
        {report.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-500">
              {labels.warnings[language]}
            </h4>
            <ul className="space-y-1">
              {report.warnings.map((warning, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Timestamp */}
        <p className="text-[10px] text-muted-foreground font-mono text-right">
          {new Date(report.timestamp).toISOString()}
        </p>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// STAT BOX
// =============================================================================

interface StatBoxProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function StatBox({ label, value, total, color }: StatBoxProps) {
  return (
    <div className="text-center p-2 rounded-lg bg-muted/30">
      <div className={cn('text-2xl font-bold font-mono', color)}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">
        {label}
      </div>
      <div className="text-[10px] text-muted-foreground font-mono">
        /{total}
      </div>
    </div>
  );
}

export default TriangulationPanel;
