import { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info,
} from 'lucide-react';
import { 
  containsForbiddenValueWord,
  ALLOWED_NEUTRAL_WORDS,
  MISINTERPRETATION_GUARDS,
  validateComparison,
  type DefinitionDiff
} from '@/config/dataPositioningConfig';

// =============================================================================
// BF: ZERO-INTERPRETATION MODE
// =============================================================================

type TrendDirection = 'up' | 'down' | 'stable' | 'unclear';

interface ZeroInterpretTrendProps {
  /** Trendriktning */
  direction: TrendDirection;
  /** Procentuell förändring */
  percent?: number;
  /** Period */
  period?: string;
  /** Språk */
  lang?: 'sv' | 'en';
}

/**
 * WAVE 7 BLOCK BF: Zero-Interpretation Trend Text
 * 
 * Visar trender utan värdeord.
 * Endast: ökade, minskade, förändrades, var oförändrad
 */
export function ZeroInterpretTrend({
  direction,
  percent,
  period,
  lang = 'sv',
}: ZeroInterpretTrendProps): ReactNode {
  const words = ALLOWED_NEUTRAL_WORDS.change[lang];
  
  const trendWord = direction === 'up' 
    ? words[0] // ökade
    : direction === 'down'
      ? words[1] // minskade
      : direction === 'stable'
        ? words[3] // var oförändrad
        : words[2]; // förändrades
  
  const percentText = percent !== undefined 
    ? ` ${percent > 0 ? '+' : ''}${percent.toFixed(1)}%` 
    : '';
  
  const periodText = period ? ` (${period})` : '';

  return (
    <span className="text-foreground">
      {lang === 'sv' ? 'Värdet ' : 'The value '}
      <span className="font-medium">{trendWord}</span>
      {percentText}
      {periodText}
    </span>
  );
}

interface ZeroInterpretComparisonProps {
  /** Vad som jämförs */
  subjectA: string;
  subjectB: string;
  /** Hur de förhåller sig */
  relationship: 'coincides' | 'deviates' | 'differs' | 'resembles';
  /** Detalj */
  detail?: string;
  /** Språk */
  lang?: 'sv' | 'en';
}

/**
 * WAVE 7 BLOCK BF: Zero-Interpretation Comparison Text
 * 
 * Jämför utan värdering.
 * Endast: sammanfaller med, avviker från, skiljer sig från, liknar
 */
export function ZeroInterpretComparison({
  subjectA,
  subjectB,
  relationship,
  detail,
  lang = 'sv',
}: ZeroInterpretComparisonProps): ReactNode {
  const words = ALLOWED_NEUTRAL_WORDS.comparison[lang];
  
  const relationWord = relationship === 'coincides'
    ? words[0]
    : relationship === 'deviates'
      ? words[1]
      : relationship === 'differs'
        ? words[2]
        : words[3];

  return (
    <span className="text-foreground">
      {subjectA} <span className="font-medium">{relationWord}</span> {subjectB}
      {detail && <span className="text-muted-foreground"> ({detail})</span>}
    </span>
  );
}

/**
 * Validerar text och visar varning om förbjudna ord hittas
 */
export function ValueWordGuard({ 
  text, 
  children 
}: { 
  text: string; 
  children: ReactNode;
}) {
  const check = containsForbiddenValueWord(text);
  
  if (check.found) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Varning:</strong> Texten innehåller förbjudna värdeord: {check.words.join(', ')}.
            <br />
            Föreslagna alternativ: {check.suggestions.join('; ')}
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
}

// =============================================================================
// BG: USER-DRIVEN COMPARISON ENGINE
// =============================================================================

interface DefinitionDiffDisplayProps {
  diff: DefinitionDiff;
  className?: string;
}

/**
 * WAVE 7 BLOCK BG: Definition Diff Display
 * 
 * Visar skillnader mellan två datakällors definitioner
 */
export function DefinitionDiffDisplay({ diff, className = '' }: DefinitionDiffDisplayProps) {
  const getSeverityColor = (severity: 'minor' | 'moderate' | 'major') => {
    switch (severity) {
      case 'minor': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'major': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Jämförbarhet mellan källor</h4>
        <Badge 
          variant={diff.comparabilityScore > 70 ? 'default' : 'destructive'}
          className="text-xs"
        >
          {diff.comparabilityScore}% jämförbar
        </Badge>
      </div>

      {diff.comparabilityWarning && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {diff.comparabilityWarning}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Källa A */}
        <div className="p-3 border rounded-lg bg-muted/20">
          <p className="text-xs font-semibold mb-2">{diff.sourceA.name}</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Definition:</strong> {diff.sourceA.definition}</p>
            <p><strong>Metod:</strong> {diff.sourceA.measurementMethod}</p>
            <p><strong>Täckning:</strong> {diff.sourceA.coverage}</p>
          </div>
        </div>
        
        {/* Källa B */}
        <div className="p-3 border rounded-lg bg-muted/20">
          <p className="text-xs font-semibold mb-2">{diff.sourceB.name}</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Definition:</strong> {diff.sourceB.definition}</p>
            <p><strong>Metod:</strong> {diff.sourceB.measurementMethod}</p>
            <p><strong>Täckning:</strong> {diff.sourceB.coverage}</p>
          </div>
        </div>
      </div>

      {/* Skillnader */}
      {diff.differences.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold">Identifierade skillnader:</p>
          {diff.differences.map((d, i) => (
            <div 
              key={i}
              className={`p-2 text-xs rounded border ${getSeverityColor(d.severity)}`}
            >
              <span className="font-medium">{d.field}:</span> {d.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BK: ANTI-MISINTERPRETATION GUARD
// =============================================================================

interface MisinterpretationWarningProps {
  /** Typ av varning */
  type: 'cherry_picking' | 'invalid_comparison' | 'statistical_invalid';
  /** Visa alltid eller bara om relevant */
  show?: boolean;
  className?: string;
}

/**
 * WAVE 7 BLOCK BK: Misinterpretation Warning
 * 
 * Varnar för potentiella feltolkningar
 */
export function MisinterpretationWarning({
  type,
  show = true,
  className = '',
}: MisinterpretationWarningProps) {
  if (!show) return null;

  const guard = MISINTERPRETATION_GUARDS[type];

  return (
    <Alert variant="default" className={`bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 py-2 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
        {guard.message_sv}
      </AlertDescription>
    </Alert>
  );
}

interface ComparisonStrengthBadgeProps {
  /** Jämförelsens styrka */
  strength: 'strong' | 'moderate' | 'weak';
  /** Visa label */
  showLabel?: boolean;
  className?: string;
}

/**
 * Visar jämförelsens metodologiska styrka
 */
export function ComparisonStrengthBadge({
  strength,
  showLabel = true,
  className = '',
}: ComparisonStrengthBadgeProps) {
  const config = {
    strong: {
      label: 'Stark jämförbarhet',
      icon: CheckCircle2,
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    moderate: {
      label: 'Måttlig jämförbarhet',
      icon: Info,
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    weak: {
      label: 'Svag jämförbarhet',
      icon: AlertTriangle,
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const { label, icon: Icon, className: badgeClass } = config[strength];

  return (
    <Badge variant="outline" className={`${badgeClass} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {showLabel && label}
    </Badge>
  );
}

/**
 * Wrapper som validerar och visar varningar för jämförelser
 */
export function ComparisonGuard({
  sourceA,
  sourceB,
  definitionMatch,
  methodMatch,
  coverageMatch,
  children,
}: {
  sourceA: string;
  sourceB: string;
  definitionMatch: number;
  methodMatch: number;
  coverageMatch: number;
  children: ReactNode;
}) {
  const validation = validateComparison({
    sourceA,
    sourceB,
    definitionMatch,
    methodMatch,
    coverageMatch,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Jämförelse: {sourceA} ↔ {sourceB}
        </span>
        <ComparisonStrengthBadge strength={validation.strength} />
      </div>
      
      {validation.warnings.map((warning, i) => (
        <Alert 
          key={i}
          variant="default" 
          className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 py-2"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
            {warning}
          </AlertDescription>
        </Alert>
      ))}
      
      {children}
    </div>
  );
}
