/**
 * DOMAIN ORIENTATION BAR
 * 
 * Immediate context, not navigation.
 * User never wonders "does this apply to me?"
 */

interface DomainOrientationBarProps {
  domain: string;
  population: string;
  geo: string;
  time: string;
  confidence: number;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-emerald-600 dark:text-emerald-400';
  if (confidence >= 0.6) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'HIGH';
  if (confidence >= 0.6) return 'MEDIUM';
  return 'LOW';
}

export function DomainOrientationBar({
  domain,
  population,
  geo,
  time,
  confidence
}: DomainOrientationBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/50 border-b border-border font-mono text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">[DOMAIN]</span>
        <span className="font-medium">{domain}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">[POP]</span>
        <span className="font-medium">{population}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">[GEO]</span>
        <span className="font-medium">{geo}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">[TIME]</span>
        <span className="font-medium">{time}</span>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-muted-foreground">[CONF]</span>
        <span className={`font-medium ${getConfidenceColor(confidence)}`}>
          {(confidence * 100).toFixed(0)}% {getConfidenceLabel(confidence)}
        </span>
      </div>
    </div>
  );
}
