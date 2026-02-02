/**
 * MISUSE PROTECTION DISPLAY
 * 
 * Visual warnings when potential data misuse is detected.
 * Makes it technically difficult to weaponize data.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  type MisuseDetection,
  type ProtectedDataResponse,
  DATA_USE_TERMS
} from '@/lib/environment';
import { 
  Shield, 
  ShieldAlert, 
  ShieldX,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MisuseWarningProps {
  detections: MisuseDetection[];
  onAcknowledge?: () => void;
}

export function MisuseWarning({ detections, onAcknowledge }: MisuseWarningProps) {
  const highSeverity = detections.filter(d => d.severity === 'high');
  const mediumSeverity = detections.filter(d => d.severity === 'medium');
  const lowSeverity = detections.filter(d => d.severity === 'low');
  
  const hasBlockingIssues = highSeverity.length > 0;
  
  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return <ShieldX className="w-5 h-5 text-destructive" />;
      case 'medium': return <ShieldAlert className="w-5 h-5 text-warning" />;
      case 'low': return <Shield className="w-5 h-5 text-muted-foreground" />;
    }
  };
  
  const getSeverityBadgeClass = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'medium': return 'bg-warning/10 text-warning border-warning/30';
      case 'low': return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (detections.length === 0) {
    return (
      <Card className="border-chart-2/30 bg-chart-2/5">
        <CardContent className="py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <p className="font-medium text-chart-2">Ingen misstänkt missbruk detekterad</p>
            <p className="text-sm text-muted-foreground">
              Dataförfrågan följer användningsvillkoren
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-2",
      hasBlockingIssues ? "border-destructive/50 bg-destructive/5" : "border-warning/50 bg-warning/5"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg flex items-center gap-2",
          hasBlockingIssues ? "text-destructive" : "text-warning"
        )}>
          {hasBlockingIssues ? (
            <ShieldX className="w-5 h-5" />
          ) : (
            <ShieldAlert className="w-5 h-5" />
          )}
          {hasBlockingIssues 
            ? 'Potentiellt missbruk detekterat' 
            : 'Varningar för dataanvändning'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* High severity (blocking) */}
        {highSeverity.length > 0 && (
          <div className="space-y-2">
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              {highSeverity.length} kritiska problem
            </Badge>
            {highSeverity.map((detection, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                {getSeverityIcon(detection.severity)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    {detection.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rekommendation: {detection.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Medium severity (warnings) */}
        {mediumSeverity.length > 0 && (
          <div className="space-y-2">
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
              {mediumSeverity.length} varningar
            </Badge>
            {mediumSeverity.map((detection, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg">
                {getSeverityIcon(detection.severity)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-warning">
                    {detection.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rekommendation: {detection.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Low severity (notes) */}
        {lowSeverity.length > 0 && (
          <div className="space-y-2">
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              {lowSeverity.length} noteringar
            </Badge>
            {lowSeverity.map((detection, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                {getSeverityIcon(detection.severity)}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {detection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Acknowledgment */}
        {hasBlockingIssues ? (
          <div className="pt-2 border-t border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              Data kan inte exporteras förrän kritiska problem åtgärdas
            </p>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full min-h-[44px]"
            onClick={onAcknowledge}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Jag har läst varningarna och förstår begränsningarna
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface DataTermsAcceptanceProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function DataTermsAcceptance({ onAccept, onDecline }: DataTermsAcceptanceProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Användningsvillkor för data
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Genom att använda denna data accepterar du följande villkor:
        </p>
        
        <ul className="space-y-2">
          {DATA_USE_TERMS.terms.map((term, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{term}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 min-h-[44px]"
            onClick={onDecline}
          >
            Avböj
          </Button>
          <Button 
            className="flex-1 min-h-[44px]"
            onClick={onAccept}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Acceptera villkor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProtectedDataBadgeProps {
  protection: ProtectedDataResponse<any>['protection'];
  compact?: boolean;
}

export function ProtectedDataBadge({ protection, compact = false }: ProtectedDataBadgeProps) {
  if (compact) {
    return (
      <Badge variant="outline" className="gap-1 text-xs border-chart-2/50 text-chart-2">
        <Shield className="w-3 h-3" />
        Skyddad
      </Badge>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
      <Shield className="w-4 h-4 text-chart-2" />
      <span>
        ID: {protection.requestId.slice(0, 12)}... | 
        Charter v{protection.charterId} | 
        {protection.tamperedDetectable && ' Manipulering detekterbar'}
      </span>
    </div>
  );
}
