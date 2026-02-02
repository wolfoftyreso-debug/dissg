import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  AlertCircle, 
  Bell, 
  BellOff,
  RefreshCw,
  ChevronRight,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { useKPIAlerts, type KPIAlert } from '@/hooks/useKPIAlerts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

function AlertCard({ 
  alert, 
  onAcknowledge, 
  onDismiss 
}: { 
  alert: KPIAlert; 
  onAcknowledge: () => void;
  onDismiss: () => void;
}) {
  const isCritical = alert.severity === 'critical';
  
  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all",
      isCritical 
        ? "bg-destructive/10 border-destructive/30" 
        : "bg-warning/10 border-warning/30",
      alert.acknowledged && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-full shrink-0",
          isCritical ? "bg-destructive/20" : "bg-warning/20"
        )}>
          {isCritical ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-warning" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isCritical ? "destructive" : "secondary"} className="text-xs">
              {isCritical ? 'KRITISK' : 'VARNING'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {alert.triggeredAt && format(new Date(alert.triggeredAt), 'HH:mm', { locale: sv })}
            </span>
          </div>
          
          <h4 className="font-medium text-sm mb-1 line-clamp-2">
            {alert.kpiName}
          </h4>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {alert.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Värde:</span>
              <span className="font-mono font-medium">{alert.currentValue}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Tröskel:</span>
              <span className="font-mono">{alert.threshold}</span>
            </div>
            <div className="flex items-center gap-1">
              {alert.trendPercent >= 0 ? (
                <TrendingUp className="h-3 w-3 text-destructive" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={cn(
                "font-mono",
                alert.trendPercent >= 0 ? "text-destructive" : "text-destructive"
              )}>
                {alert.trendPercent >= 0 ? '+' : ''}{alert.trendPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 shrink-0">
          {!alert.acknowledged && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={onAcknowledge}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AlertNotificationPanel() {
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
  
  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);
  
  return (
    <Card className={cn(
      "transition-all",
      criticalCount > 0 && "border-destructive/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5" />
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
              <CardTitle className="text-base">Varningssystem</CardTitle>
              {lastChecked && (
                <p className="text-xs text-muted-foreground">
                  Senast kontrollerad: {format(lastChecked, 'HH:mm:ss', { locale: sv })}
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
            >
              <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
              Analysera
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )} />
            </Button>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="flex gap-2 mt-2">
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {criticalCount} kritiska
          </Badge>
          <Badge variant="secondary" className="gap-1 bg-warning/20 text-warning-foreground">
            <AlertTriangle className="h-3 w-3" />
            {warningCount} varningar
          </Badge>
          {acknowledgedAlerts.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <BellOff className="h-3 w-3" />
              {acknowledgedAlerts.length} kvitterade
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-positive" />
              <p className="text-sm">Inga aktiva varningar</p>
              <p className="text-xs">Alla KPI:er är inom normala tröskelvärden</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <AlertCard
                    key={`${alert.kpiId}-${alert.alertType}`}
                    alert={alert}
                    onAcknowledge={() => acknowledgeAlert(alert.kpiId)}
                    onDismiss={() => dismissAlert(alert.kpiId)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
}
