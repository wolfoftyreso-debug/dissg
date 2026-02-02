import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  HelpCircle, 
  AlertTriangle, 
  XCircle,
  Info
} from 'lucide-react';
import { 
  type TruthDisclosure, 
  getConfidenceExplanation,
  MANDATORY_DISCLOSURES 
} from '@/config/truthGuardConfig';
import { cn } from '@/lib/utils';

interface TruthDisclosureCardProps {
  disclosure: TruthDisclosure;
  showMandatory?: boolean;
  compact?: boolean;
  className?: string;
}

export function TruthDisclosureCard({ 
  disclosure, 
  showMandatory = true,
  compact = false,
  className 
}: TruthDisclosureCardProps) {
  const hasUnknowns = disclosure.weDontKnow.aspects.length > 0 || disclosure.weDontKnow.gaps.length > 0;
  const hasAssumptions = disclosure.weAssume.explicit.length > 0 || disclosure.weAssume.implicit.length > 0;
  const hasMissing = disclosure.isMissing.data.length > 0 || disclosure.isMissing.periods.length > 0 || disclosure.isMissing.geographies.length > 0;

  if (compact) {
    return (
      <div className={cn('bg-muted/30 rounded-md p-3 text-sm', className)}>
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{disclosure.title}</span>
        </div>
        <p className="text-muted-foreground">{disclosure.weKnow.confidence}</p>
        {disclosure.caveats.length > 0 && (
          <p className="text-xs text-status-warning mt-1">
            ⚠ {disclosure.caveats[0]}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          {disclosure.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* What we know */}
        <Section
          icon={<CheckCircle className="h-4 w-4 text-status-positive" />}
          title="Vad vi vet"
          badge={disclosure.weKnow.confidence}
          badgeVariant="positive"
        >
          <ul className="space-y-1">
            {disclosure.weKnow.facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-status-positive mt-0.5">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </Section>
        
        {/* What we don't know */}
        {hasUnknowns && (
          <>
            <Separator />
            <Section
              icon={<HelpCircle className="h-4 w-4 text-status-warning" />}
              title="Vad vi inte vet"
            >
              {disclosure.weDontKnow.aspects.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Aspekter</span>
                  <ul className="mt-1 space-y-1">
                    {disclosure.weDontKnow.aspects.map((aspect, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-status-warning mt-0.5">?</span>
                        <span>{aspect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {disclosure.weDontKnow.gaps.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Dataluckor</span>
                  <ul className="mt-1 space-y-1">
                    {disclosure.weDontKnow.gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-status-warning mt-0.5">○</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>
          </>
        )}
        
        {/* Assumptions */}
        {hasAssumptions && (
          <>
            <Separator />
            <Section
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
              title="Vad vi antar"
            >
              {disclosure.weAssume.explicit.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Explicita antaganden</span>
                  <ul className="mt-1 space-y-1">
                    {disclosure.weAssume.explicit.map((assumption, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500 mt-0.5">→</span>
                        <span>{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {disclosure.weAssume.implicit.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Implicita antaganden</span>
                  <ul className="mt-1 space-y-1">
                    {disclosure.weAssume.implicit.map((assumption, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5">→</span>
                        <span>{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>
          </>
        )}
        
        {/* Missing data */}
        {hasMissing && (
          <>
            <Separator />
            <Section
              icon={<XCircle className="h-4 w-4 text-status-critical" />}
              title="Vad som saknas"
            >
              <div className="grid gap-2 md:grid-cols-3">
                {disclosure.isMissing.data.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Datatyper</span>
                    <ul className="mt-1 space-y-0.5">
                      {disclosure.isMissing.data.map((item, i) => (
                        <li key={i} className="text-sm text-status-critical">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {disclosure.isMissing.periods.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Tidsperioder</span>
                    <ul className="mt-1 space-y-0.5">
                      {disclosure.isMissing.periods.map((item, i) => (
                        <li key={i} className="text-sm text-status-critical">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {disclosure.isMissing.geographies.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Geografier</span>
                    <ul className="mt-1 space-y-0.5">
                      {disclosure.isMissing.geographies.map((item, i) => (
                        <li key={i} className="text-sm text-status-critical">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          </>
        )}
        
        {/* Caveats */}
        {disclosure.caveats.length > 0 && (
          <>
            <Separator />
            <div className="bg-status-warning/10 border border-status-warning/30 rounded-md p-3">
              <span className="text-xs font-medium text-status-warning uppercase tracking-wide">Förbehåll</span>
              <ul className="mt-2 space-y-1">
                {disclosure.caveats.map((caveat, i) => (
                  <li key={i} className="text-sm">{caveat}</li>
                ))}
              </ul>
            </div>
          </>
        )}
        
        {/* Mandatory disclosures */}
        {showMandatory && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              {MANDATORY_DISCLOSURES.map((disclosure, i) => (
                <p key={i}>• {disclosure}</p>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeVariant?: 'positive' | 'warning' | 'critical';
  children: React.ReactNode;
}

function Section({ icon, title, badge, badgeVariant, children }: SectionProps) {
  const badgeColors = {
    positive: 'bg-status-positive/20 text-status-positive border-status-positive',
    warning: 'bg-status-warning/20 text-status-warning border-status-warning',
    critical: 'bg-status-critical/20 text-status-critical border-status-critical'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {badge && (
          <Badge 
            variant="outline" 
            className={cn('text-xs', badgeVariant && badgeColors[badgeVariant])}
          >
            {badge}
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * Compact confidence indicator for inline use
 */
interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ConfidenceIndicator({ confidence, showLabel = true, size = 'md' }: ConfidenceIndicatorProps) {
  const explanation = getConfidenceExplanation(confidence);
  
  const sizeClasses = {
    sm: 'h-1.5 w-12',
    md: 'h-2 w-16'
  };
  
  const getColorClass = () => {
    if (confidence >= 0.75) return 'bg-status-positive';
    if (confidence >= 0.5) return 'bg-status-warning';
    return 'bg-status-critical';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div 
          className={cn('h-full rounded-full transition-all', getColorClass())}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {explanation.label}
        </span>
      )}
    </div>
  );
}
