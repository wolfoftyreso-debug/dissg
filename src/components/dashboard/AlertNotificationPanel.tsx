import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKPIAlerts, type KPIAlert } from '@/hooks/useKPIAlerts';
import { AlertDetailPanel } from './AlertDetailPanel';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface AlertCardProps {
  alert: KPIAlert;
  onAcknowledge: () => void;
  onDismiss: () => void;
  onExpand: () => void;
}

function AlertCard({ alert, onAcknowledge, onDismiss, onExpand }: AlertCardProps) {
  const isCritical = alert.severity === 'critical';
  
  return (
    <div 
      className={cn(
        "p-4 rounded-lg border transition-all cursor-pointer hover:ring-2 hover:ring-primary/30",
        isCritical 
          ? "bg-destructive/10 border-destructive/30" 
          : "bg-warning/10 border-warning/30",
        alert.acknowledged && "opacity-60"
      )}
      onClick={onExpand}
    >
      <div className="flex items-start gap-3">
        <span className={cn(
          "font-mono text-sm font-bold shrink-0 mt-0.5",
          isCritical ? "text-destructive" : "text-warning"
        )}>
          {isCritical ? '[!!]' : '[!]'}
        </span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isCritical ? "destructive" : "secondary"} className="text-xs font-mono">
              {isCritical ? 'KRITISK' : 'VARNING'}
            </Badge>
            {alert.priorityIndex !== undefined && (
              <Badge variant="outline" className="text-xs font-mono">
                P:{alert.priorityIndex}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground font-mono">
              [{alert.triggeredAt && format(new Date(alert.triggeredAt), 'HH:mm', { locale: sv })}]
            </span>
          </div>
          
          <h4 className="font-medium text-sm mb-1 line-clamp-2">
            {alert.kpiName}
          </h4>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {alert.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">[VÄRDE]</span>
              <span className="font-medium">{alert.currentValue}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">[TRÖSKEL]</span>
              <span>{alert.threshold}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn(
                "font-bold",
                alert.trendPercent >= 0 ? "text-destructive" : "text-destructive"
              )}>
                {alert.trendPercent >= 0 ? '[↑]' : '[↓]'}
                {alert.trendPercent >= 0 ? '+' : ''}{alert.trendPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Click hint */}
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-mono">
              [KLICKA FÖR DETALJER →]
            </span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] font-mono">
                [ROTORSAK]
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                [ÅTGÄRDER]
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {!alert.acknowledged && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 font-mono text-xs"
              onClick={onAcknowledge}
            >
              [OK]
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-muted-foreground font-mono text-xs"
            onClick={onDismiss}
          >
            [X]
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AlertNotificationPanelProps {
  licenseLevel?: 'observer' | 'analyst' | 'institutional';
}

export function AlertNotificationPanel({ licenseLevel = 'observer' }: AlertNotificationPanelProps) {
  const { 
    alerts, 
    isLoading, 
    lastChecked, 
    analyzeAlerts, 
    acknowledgeAlert, 
    dismissAlert,
    criticalCount,
    warningCount 
  } = useKPIAlerts();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<KPIAlert | null>(null);
  
  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);
  
  return (
    <>
      <Card className={cn(
        "transition-all",
        criticalCount > 0 && "border-destructive/50"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative font-mono text-sm font-bold">
                [ALERTMOTOR]
                {(criticalCount + warningCount) > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                    criticalCount > 0 ? "bg-destructive" : "bg-warning"
                  )}>
                    {criticalCount + warningCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-base font-mono">Varningssystem</CardTitle>
                {lastChecked && (
                  <p className="text-xs text-muted-foreground font-mono">
                    [SENAST: {format(lastChecked, 'HH:mm:ss', { locale: sv })}]
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={analyzeAlerts}
                disabled={isLoading}
                className="font-mono text-xs"
              >
                {isLoading ? '[...]' : '[↻ ANALYSERA]'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="font-mono text-xs"
              >
                {isExpanded ? '[−]' : '[+]'}
              </Button>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex gap-2 mt-2">
            <Badge variant="destructive" className="gap-1 font-mono">
              [!!] {criticalCount} kritiska
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-warning/20 text-warning-foreground font-mono">
              [!] {warningCount} varningar
            </Badge>
            {acknowledgedAlerts.length > 0 && (
              <Badge variant="outline" className="gap-1 font-mono">
                [OK] {acknowledgedAlerts.length} kvitterade
              </Badge>
            )}
          </div>

          {/* License indicator */}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-mono">
            <span>[LICENS: {licenseLevel.toUpperCase()}]</span>
            {licenseLevel === 'observer' && (
              <span className="text-primary">[UPPGRADERA FÖR ROTORSAK + ÅTGÄRDER]</span>
            )}
            {licenseLevel === 'analyst' && (
              <span className="text-primary">[UPPGRADERA FÖR ÅTGÄRDSPLANER]</span>
            )}
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="font-mono text-2xl mb-2 text-positive">[OK]</p>
                <p className="text-sm">Inga aktiva varningar</p>
                <p className="text-xs">Alla KPI:er är inom normala tröskelvärden</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-3">
                  {/* Sorted by priorityIndex (highest first) */}
                  {[...activeAlerts]
                    .sort((a, b) => (b.priorityIndex ?? 0) - (a.priorityIndex ?? 0))
                    .map((alert, index) => (
                      <div key={`${alert.kpiId}-${alert.alertType}`} className="relative">
                        {/* Rank indicator */}
                        <div className="absolute -left-1 -top-1 bg-background border rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-mono font-bold z-10">
                          {index + 1}
                        </div>
                        <AlertCard
                          alert={alert}
                          onAcknowledge={() => acknowledgeAlert(alert.kpiId)}
                          onDismiss={() => dismissAlert(alert.kpiId)}
                          onExpand={() => setSelectedAlert(alert)}
                        />
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        )}
      </Card>

      {/* Detail Panel */}
      {selectedAlert && (
        <AlertDetailPanel
          alert={selectedAlert}
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          isPro={licenseLevel !== 'observer'}
          licenseLevel={licenseLevel}
        />
      )}
    </>
  );
}
