/**
 * DEL XXIV — KOMPONENTER FÖR KÄNSLIGA VYER
 * 
 * Kön, migration, ursprung – korrekt och utförligt.
 * "Visa hur vi vet" + obligatoriska disclaimers.
 */

import { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, Shield, Info, 
  Database, Clock, FileText, ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// SENSITIVE VIEW DISCLAIMER
// ═══════════════════════════════════════════════════════════════

interface SensitiveViewDisclaimerProps {
  type: 'demographic' | 'migration' | 'origin' | 'correlation';
  className?: string;
}

const DISCLAIMER_CONTENT = {
  demographic: {
    title: 'Demografisk vy',
    description: 'Data visas aggregerat på gruppnivå. Inga individer kan identifieras.',
    icon: Database,
  },
  migration: {
    title: 'Migrationsdata',
    description: 'Korrelation visar samvariation över tid. Kausalitet fastställs inte. Flera faktorer påverkar utfall oberoende av bakgrund.',
    icon: AlertTriangle,
  },
  origin: {
    title: 'Ursprungsdata',
    description: 'Visas på bred regional nivå (världsdelar) där N är tillräckligt stort. Enskilda länder redovisas inte.',
    icon: Shield,
  },
  correlation: {
    title: 'Korrelationsanalys',
    description: 'Korrelation innebär inte orsakssamband. Två variabler kan samvariera av slump, genom gemensam orsak, eller omvänd kausalitet.',
    icon: Info,
  },
};

export function SensitiveViewDisclaimer({ type, className }: SensitiveViewDisclaimerProps) {
  const content = DISCLAIMER_CONTENT[type];
  const Icon = content.icon;

  return (
    <Alert className={cn("bg-muted/50 border-muted", className)}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <strong className="block mb-1">{content.title}</strong>
        {content.description}
      </AlertDescription>
    </Alert>
  );
}

// ═══════════════════════════════════════════════════════════════
// "VISA HUR VI VET" (Transparent methodology)
// ═══════════════════════════════════════════════════════════════

interface ShowHowWeKnowProps {
  source: string;
  definition: string;
  timeWindow: string;
  uncertainty: number;
  nThreshold?: number;
  license?: string;
  sourceUrl?: string;
  className?: string;
}

export function ShowHowWeKnow({ 
  source, 
  definition, 
  timeWindow, 
  uncertainty,
  nThreshold,
  license,
  sourceUrl,
  className,
}: ShowHowWeKnowProps) {
  return (
    <Card className={cn("bg-muted/30", className)}>
      <CardContent className="py-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Visa hur vi vet
        </div>
        
        <div className="grid gap-2 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Database className="h-3 w-3 mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-foreground">Källa:</span> {source}
              {sourceUrl && (
                <a 
                  href={sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-foreground">Definition:</span> {definition}
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-3 w-3 mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-foreground">Tidsfönster:</span> {timeWindow}
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-foreground">Osäkerhet:</span> ±{uncertainty}%
            </div>
          </div>
          
          {nThreshold && (
            <div className="flex items-start gap-2">
              <Shield className="h-3 w-3 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">N-gräns:</span> Minimum {nThreshold} individer
              </div>
            </div>
          )}
          
          {license && (
            <div className="pt-2 border-t border-muted">
              <Badge variant="outline" className="text-[10px]">{license}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// MANDATORY DISCLAIMERS
// ═══════════════════════════════════════════════════════════════

interface MandatoryDisclaimersProps {
  type: 'correlation' | 'comparison' | 'demographic' | 'migration';
  compact?: boolean;
  className?: string;
}

const DISCLAIMER_ITEMS = {
  correlation: [
    'Korrelation innebär inte orsakssamband.',
    'Flera bakomliggande faktorer kan förklara sambandet.',
  ],
  comparison: [
    'Jämförelser görs på gruppnivå.',
    'Individuella variationer inom grupper är betydande.',
  ],
  demographic: [
    'Data visas aggregerat, aldrig på individnivå.',
    'Definitioner följer officiella klassificeringar.',
  ],
  migration: [
    'Korrelation med integrationstid visar statistiskt mönster, inte kausalitet.',
    'Många faktorer påverkar utfall oberoende av bakgrund.',
  ],
};

export function MandatoryDisclaimers({ type, compact = false, className }: MandatoryDisclaimersProps) {
  const items = DISCLAIMER_ITEMS[type];

  if (compact) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {items.map((item, i) => (
          <Badge key={i} variant="outline" className="text-xs font-normal">
            {item}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Alert className={cn("bg-muted/50 border-muted", className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-xs space-y-1">
        {items.map((item, i) => (
          <p key={i}>• {item}</p>
        ))}
      </AlertDescription>
    </Alert>
  );
}

// ═══════════════════════════════════════════════════════════════
// N-COUNT DISPLAY (Always transparent)
// ═══════════════════════════════════════════════════════════════

interface NCountDisplayProps {
  n: number;
  threshold?: number;
  showWarning?: boolean;
  className?: string;
}

export function NCountDisplay({ 
  n, 
  threshold = 100, 
  showWarning = true,
  className 
}: NCountDisplayProps) {
  const isLow = n < threshold;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs tabular-nums",
      isLow && showWarning ? "text-status-warning" : "text-muted-foreground",
      className
    )}>
      <Database className="h-3 w-3" />
      N={n.toLocaleString('sv-SE')}
      {isLow && showWarning && (
        <AlertTriangle className="h-3 w-3" />
      )}
    </span>
  );
}
