import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { PRIVACY_CONFIG, PRIVACY_MESSAGES, DEPTH_PRINCIPLE } from '@/config/depthModelConfig';
import { cn } from '@/lib/utils';

interface PrivacyGuardProps {
  observationCount: number;
  depthLevel: number;
  showDetails?: boolean;
}

type PrivacyStatus = 'safe' | 'warning' | 'blocked';

function getPrivacyStatus(count: number): PrivacyStatus {
  if (count < PRIVACY_CONFIG.minCellSize) return 'blocked';
  if (count < PRIVACY_CONFIG.warningThreshold) return 'warning';
  return 'safe';
}

export function PrivacyGuard({ 
  observationCount, 
  depthLevel,
  showDetails = false 
}: PrivacyGuardProps) {
  const status = getPrivacyStatus(observationCount);
  const noiseApplied = depthLevel >= 3 && status === 'safe';

  if (status === 'blocked') {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertTitle>Integritetsspärr</AlertTitle>
        <AlertDescription>
          {PRIVACY_MESSAGES.blocked}
          <span className="block mt-1 text-xs">
            Underlag: {observationCount} observationer (minimum: {PRIVACY_CONFIG.minCellSize})
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'warning') {
    return (
      <Alert className="border-status-warning bg-status-warning/5">
        <AlertTriangle className="h-4 w-4 text-status-warning" />
        <AlertTitle className="text-status-warning">Begränsat underlag</AlertTitle>
        <AlertDescription>
          {PRIVACY_MESSAGES.warning}
          <span className="block mt-1 text-xs text-muted-foreground">
            Underlag: {observationCount} observationer (rekommenderat: &gt;{PRIVACY_CONFIG.warningThreshold})
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  if (noiseApplied) {
    return (
      <Alert className="bg-muted/50">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {PRIVACY_MESSAGES.noiseApplied} {PRIVACY_MESSAGES.aggregated}
        </AlertDescription>
      </Alert>
    );
  }

  if (showDetails) {
    return (
      <Alert className="bg-status-positive/5 border-status-positive/20">
        <CheckCircle2 className="h-4 w-4 text-status-positive" />
        <AlertDescription className="text-xs text-status-positive">
          Tillräckligt dataunderlag för visning utan begränsningar.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/**
 * Kompakt indikator för integritetsstatus
 */
export function PrivacyIndicator({ observationCount }: { observationCount: number }) {
  const status = getPrivacyStatus(observationCount);

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 text-xs",
        status === 'blocked' && "bg-destructive/10 border-destructive/30 text-destructive",
        status === 'warning' && "bg-status-warning/10 border-status-warning/30 text-status-warning",
        status === 'safe' && "bg-status-positive/10 border-status-positive/30 text-status-positive"
      )}
    >
      {status === 'blocked' ? (
        <>
          <EyeOff className="h-3 w-3" />
          Spärrad
        </>
      ) : status === 'warning' ? (
        <>
          <AlertTriangle className="h-3 w-3" />
          Begränsat
        </>
      ) : (
        <>
          <Eye className="h-3 w-3" />
          Visningsbar
        </>
      )}
    </Badge>
  );
}

/**
 * Detaljerad privacy-informationsruta
 */
export function PrivacyInfoCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Integritetsskydd
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {DEPTH_PRINCIPLE.core}
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium">Automatiska skydd:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-status-positive" />
              K-anonymitet (min {PRIVACY_CONFIG.kAnonymity} individer/grupp)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-status-positive" />
              Minsta cellstorlek ({PRIVACY_CONFIG.minCellSize} observationer)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-status-positive" />
              Statistiskt brus vid djup zoom ({(PRIVACY_CONFIG.noiseLevel * 100).toFixed(0)}%)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-status-positive" />
              Automatisk blockering av små grupper
            </li>
          </ul>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground italic">
            {DEPTH_PRINCIPLE.motto}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
