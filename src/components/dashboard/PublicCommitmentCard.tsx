import { 
  PublicCommitment, 
  calculateCommitmentProgress, 
  getCommitmentStatus 
} from '@/config/publicCommitmentConfig';
import { cn } from '@/lib/utils';
import { 
  FileSignature, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface PublicCommitmentCardProps {
  commitment: PublicCommitment;
  compact?: boolean;
}

export function PublicCommitmentCard({ commitment, compact = false }: PublicCommitmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const daysRemaining = differenceInDays(parseISO(commitment.validUntil), new Date());
  const daysSigned = differenceInDays(new Date(), parseISO(commitment.signedAt));
  
  // Calculate overall progress
  const overallProgress = commitment.kpiCommitments.reduce((sum, c) => {
    return sum + calculateCommitmentProgress(c);
  }, 0) / commitment.kpiCommitments.length;

  const signatoryTypeLabels: Record<string, string> = {
    party: 'Politiskt parti',
    government: 'Regering',
    municipality: 'Kommun',
    region: 'Region',
    agency: 'Myndighet',
    organization: 'Organisation',
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            commitment.verified ? "bg-status-positive/20" : "bg-muted"
          )}>
            {commitment.verified ? (
              <Shield className="h-4 w-4 text-status-positive" />
            ) : (
              <FileSignature className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{commitment.signatoryName}</p>
            <p className="text-[10px] text-muted-foreground">
              {signatoryTypeLabels[commitment.signatoryType]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-primary">{overallProgress.toFixed(0)}%</p>
            <p className="text-[10px] text-muted-foreground">{daysRemaining}d kvar</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            commitment.verified ? "bg-status-positive/20" : "bg-muted"
          )}>
            {commitment.verified ? (
              <Shield className="h-6 w-6 text-status-positive" />
            ) : (
              <FileSignature className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{commitment.signatoryName}</h3>
            <p className="text-xs text-muted-foreground">
              {signatoryTypeLabels[commitment.signatoryType]} • Signerat {format(parseISO(commitment.signedAt), 'd MMM yyyy', { locale: sv })}
            </p>
          </div>
        </div>
        {commitment.verified && (
          <div className="flex items-center gap-1 rounded-full bg-status-positive/20 px-2 py-0.5 text-[10px] font-semibold text-status-positive">
            <CheckCircle2 className="h-3 w-3" />
            Verifierad
          </div>
        )}
      </div>

      {/* Core pledge badges */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-border bg-muted/30">
        {commitment.corePledge.acceptsDataAsReference && (
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            <Target className="h-3 w-3" />
            Accepterar data
          </span>
        )}
        {commitment.corePledge.acceptsTransparentFollowup && (
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            <CheckCircle2 className="h-3 w-3" />
            Öppen uppföljning
          </span>
        )}
        {commitment.accountability.respondToRedFlags && (
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            <AlertTriangle className="h-3 w-3" />
            Svarar på varningar
          </span>
        )}
      </div>

      {/* Overall progress */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Total framsteg</span>
          <span className="text-lg font-bold text-primary">{overallProgress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>{daysSigned} dagar sedan start</span>
          <span>{daysRemaining} dagar kvar</span>
        </div>
      </div>

      {/* KPI commitments */}
      <div className="border-t border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
        >
          <span className="text-xs font-medium text-foreground">
            {commitment.kpiCommitments.length} åtaganden
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )} />
        </button>
        
        {expanded && (
          <div className="space-y-2 p-3 pt-0">
            {commitment.kpiCommitments.map((kpiCommitment) => {
              const progress = calculateCommitmentProgress(kpiCommitment);
              const status = getCommitmentStatus(kpiCommitment, daysRemaining);
              
              return (
                <div 
                  key={kpiCommitment.kpiId}
                  className="rounded border border-border bg-background p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold",
                          kpiCommitment.priority === 'primary' && "bg-primary text-primary-foreground",
                          kpiCommitment.priority === 'secondary' && "bg-muted text-foreground",
                          kpiCommitment.priority === 'supporting' && "bg-muted text-muted-foreground",
                        )}>
                          {kpiCommitment.priority === 'primary' ? 'P' : kpiCommitment.priority === 'secondary' ? 'S' : '•'}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {kpiCommitment.kpiName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        <span>Baslinje: {kpiCommitment.baselineValue}</span>
                        <span>→</span>
                        <span>Mål: {kpiCommitment.targetValue}</span>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      status === 'on_track' && "bg-status-positive/20 text-status-positive",
                      status === 'at_risk' && "bg-status-warning/20 text-status-warning",
                      status === 'behind' && "bg-status-critical/20 text-status-critical",
                      status === 'achieved' && "bg-status-positive/20 text-status-positive",
                      status === 'failed' && "bg-status-critical/20 text-status-critical",
                    )}>
                      {status === 'on_track' && <TrendingUp className="h-3 w-3" />}
                      {status === 'at_risk' && <AlertTriangle className="h-3 w-3" />}
                      {status === 'behind' && <TrendingDown className="h-3 w-3" />}
                      {status === 'achieved' && <CheckCircle2 className="h-3 w-3" />}
                      {status === 'failed' && <XCircle className="h-3 w-3" />}
                      {status === 'on_track' && 'På spår'}
                      {status === 'at_risk' && 'Risk'}
                      {status === 'behind' && 'Efter'}
                      {status === 'achieved' && 'Uppnått'}
                      {status === 'failed' && 'Missat'}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          status === 'on_track' && "bg-status-positive",
                          status === 'at_risk' && "bg-status-warning",
                          status === 'behind' && "bg-status-critical",
                          status === 'achieved' && "bg-status-positive",
                          status === 'failed' && "bg-status-critical",
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Planned measures */}
                  {kpiCommitment.plannedMeasures && kpiCommitment.plannedMeasures.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {kpiCommitment.plannedMeasures.map((measure, i) => (
                        <span 
                          key={i}
                          className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                        >
                          {measure}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Public statement preview */}
      {commitment.publicStatement && (
        <div className="border-t border-border p-4 bg-muted/30">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-2">
            Offentligt åtagande
          </p>
          <p className="text-xs text-foreground whitespace-pre-line line-clamp-4">
            {commitment.publicStatement}
          </p>
        </div>
      )}
    </div>
  );
}
