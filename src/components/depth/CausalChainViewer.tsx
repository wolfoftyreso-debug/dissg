import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  GitBranch,
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown,
  Info,
  ZoomIn,
} from 'lucide-react';
import { CAUSAL_CHAIN_CONFIG } from '@/config/depthModelConfig';
import { cn } from '@/lib/utils';

interface CausalLink {
  from: { id: string; name: string };
  to: { id: string; name: string };
  strength: number;
  lag: number;
  stability: number;
  direction: 'positive' | 'negative' | 'complex';
}

interface CausalChainViewerProps {
  kpiId?: string;
  kpiName?: string;
  links?: CausalLink[];
}

// Demo-data för orsakskedjor
const DEMO_LINKS: CausalLink[] = [
  {
    from: { id: 'education', name: 'Utbildningsnivå' },
    to: { id: 'employment', name: 'Sysselsättning' },
    strength: 0.72,
    lag: 24,
    stability: 85,
    direction: 'positive',
  },
  {
    from: { id: 'employment', name: 'Sysselsättning' },
    to: { id: 'productivity', name: 'Produktivitet' },
    strength: 0.58,
    lag: 6,
    stability: 78,
    direction: 'positive',
  },
  {
    from: { id: 'healthcare_access', name: 'Vårdtillgång' },
    to: { id: 'life_expectancy', name: 'Medellivslängd' },
    strength: 0.45,
    lag: 36,
    stability: 92,
    direction: 'positive',
  },
  {
    from: { id: 'unemployment', name: 'Arbetslöshet' },
    to: { id: 'crime_rate', name: 'Brottslighet' },
    strength: 0.38,
    lag: 12,
    stability: 65,
    direction: 'positive',
  },
  {
    from: { id: 'income_inequality', name: 'Inkomstspridning' },
    to: { id: 'health_outcomes', name: 'Hälsoutfall' },
    strength: -0.42,
    lag: 48,
    stability: 71,
    direction: 'negative',
  },
];

function StrengthBar({ strength }: { strength: number }) {
  const absStrength = Math.abs(strength);
  const isNegative = strength < 0;
  
  return (
    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          isNegative ? "bg-status-critical" : "bg-status-positive"
        )}
        style={{ width: `${absStrength * 100}%` }}
      />
    </div>
  );
}

function CausalLinkCard({ link }: { link: CausalLink }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      {/* From */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{link.from.name}</p>
        <p className="text-xs text-muted-foreground">Påverkande</p>
      </div>
      
      {/* Arrow with metadata */}
      <div className="flex flex-col items-center gap-1 px-2">
        <div className="flex items-center gap-1">
          {link.direction === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-status-positive" />
          ) : link.direction === 'negative' ? (
            <TrendingDown className="h-4 w-4 text-status-critical" />
          ) : (
            <GitBranch className="h-4 w-4 text-status-warning" />
          )}
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {link.lag} mån
        </div>
      </div>
      
      {/* To */}
      <div className="flex-1 min-w-0 text-right">
        <p className="font-medium text-sm truncate">{link.to.name}</p>
        <p className="text-xs text-muted-foreground">Påverkad</p>
      </div>
      
      {/* Metrics */}
      <div className="flex flex-col items-end gap-1 pl-3 border-l">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Styrka</span>
          <StrengthBar strength={link.strength} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Stabilitet</span>
          <Badge variant="outline" className="text-xs font-mono">
            {link.stability}%
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function CausalChainViewer({ 
  kpiId: _kpiId, 
  kpiName = 'Sysselsättningsgrad',
  links = DEMO_LINKS 
}: CausalChainViewerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Orsakskedja
            </CardTitle>
            <CardDescription>
              Samvarierande indikatorer för: {kpiName}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4 mr-1" />
            Expandera
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Disclaimer */}
        <Alert className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {CAUSAL_CHAIN_CONFIG.disclaimer}
          </AlertDescription>
        </Alert>

        {/* Links */}
        <div className="space-y-2">
          {links.map((link, idx) => (
            <CausalLinkCard key={idx} link={link} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-status-positive" />
            Positiv samvariation
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-status-critical" />
            Negativ samvariation
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Tidsförskjutning (månader)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
