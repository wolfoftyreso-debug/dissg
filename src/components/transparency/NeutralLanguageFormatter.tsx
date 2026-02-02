import { ReactNode } from 'react';
import { ALLOWED_PHRASES, FORBIDDEN_TERMS } from '@/config/publicProfileConfig';

type TrendDirection = 'up' | 'down' | 'stable' | 'unclear';

interface NeutralTrendTextProps {
  /** Trendriktning */
  direction: TrendDirection;
  
  /** Procentuell förändring */
  percent?: number;
  
  /** Period som avses */
  period?: string;
  
  /** Om indikatorn är inverterad (där nedåt är bra) */
  inverted?: boolean;
  
  /** Inkludera period i texten */
  showPeriod?: boolean;
}

interface NeutralTimeTextProps {
  /** Startdatum */
  start: string;
  
  /** Slutdatum */
  end?: string;
}

interface NeutralResponsibilityTextProps {
  /** Typ av formulering */
  type: 'held' | 'assigned' | 'active';
  
  /** Uppdragets titel */
  assignmentTitle: string;
  
  /** Personens namn (valfritt, för passiv formulering) */
  personName?: string;
}

interface NeutralObservationTextProps {
  /** Indikatorns namn */
  indicatorName: string;
  
  /** Förändring */
  changePercent: number;
  
  /** Antal månader */
  months?: number;
  
  /** Totalt antal månader */
  totalMonths?: number;
}

/**
 * DEL XIV: Neutralt trendspråk
 * 
 * Konverterar trenddata till neutral, passiv formulering
 * utan värdeord eller agentspråk.
 */
export function NeutralTrendText({
  direction,
  percent,
  period,
  inverted = false,
  showPeriod = true,
}: NeutralTrendTextProps): ReactNode {
  const trends = ALLOWED_PHRASES.trends;
  
  // Välj rätt trendord (utan värdering)
  const trendWord = direction === 'up' 
    ? trends.improved 
    : direction === 'down' 
      ? trends.declined 
      : direction === 'stable'
        ? trends.stable
        : trends.unclear;
  
  const percentText = percent !== undefined 
    ? ` med ${Math.abs(percent).toFixed(1)}%` 
    : '';
  
  const periodText = showPeriod && period 
    ? ` (${period})` 
    : '';

  return (
    <span>
      Indikatorn {trendWord}{percentText}{periodText}
    </span>
  );
}

/**
 * DEL XIV: Neutral tidsformulering
 */
export function NeutralTimeText({ start, end }: NeutralTimeTextProps): ReactNode {
  if (end) {
    return (
      <span>
        {ALLOWED_PHRASES.timing.between.replace('{start}', start).replace('{end}', end)}
      </span>
    );
  }
  
  return (
    <span>
      {ALLOWED_PHRASES.timing.since.replace('{date}', start)}
    </span>
  );
}

/**
 * DEL XIV: Neutral ansvarsformulering
 * 
 * "Innehade uppdraget" istället för "var ansvarig"
 */
export function NeutralResponsibilityText({
  type,
  assignmentTitle,
  personName,
}: NeutralResponsibilityTextProps): ReactNode {
  const phrases = ALLOWED_PHRASES.responsibility;
  
  const verb = type === 'held' 
    ? phrases.held 
    : type === 'assigned' 
      ? phrases.assigned 
      : phrases.active;
  
  // Passiv formulering - personen är inte subjekt
  if (personName) {
    return (
      <span>
        Under tiden då {personName} {verb} {assignmentTitle}
      </span>
    );
  }
  
  return (
    <span>
      Under perioden då uppdraget {assignmentTitle} innehades
    </span>
  );
}

/**
 * DEL XIV: Neutral observationsformulering
 * 
 * "Under denna period observerades att X" - aldrig "X orsakade"
 */
export function NeutralObservationText({
  indicatorName,
  changePercent,
  months,
  totalMonths,
}: NeutralObservationTextProps): ReactNode {
  const phrases = ALLOWED_PHRASES.observation;
  const isNegative = changePercent < 0;
  
  const monthsText = months !== undefined && totalMonths !== undefined
    ? ` under ${months} av ${totalMonths} månader`
    : '';
  
  return (
    <span>
      {phrases.prefix} {indicatorName.toLowerCase()} {phrases.changed} {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%{monthsText}.
    </span>
  );
}

/**
 * DEL XIV: Validera text mot förbjudna ord
 * 
 * Returnerar true om texten innehåller förbjudna termer
 */
export function containsForbiddenTerms(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_TERMS.some(term => lowerText.includes(term.toLowerCase()));
}

/**
 * DEL XIV: Komplett neutral sambandsformulering
 * 
 * Den "gyllene formuleringen" som är helt oangripbar:
 * "Under denna period, då detta uppdrag bars, utvecklades indikatorn negativt enligt öppna data."
 */
export function NeutralCorrelationStatement({
  assignmentTitle,
  indicatorName,
  direction,
  period,
}: {
  assignmentTitle: string;
  indicatorName: string;
  direction: TrendDirection;
  period: string;
}): ReactNode {
  const trends = ALLOWED_PHRASES.trends;
  const trendWord = direction === 'up' 
    ? trends.improved 
    : direction === 'down' 
      ? trends.declined 
      : trends.stable;

  return (
    <span>
      Under perioden {period}, då uppdraget som {assignmentTitle.toLowerCase()} innehades, {trendWord} indikatorn {indicatorName.toLowerCase()} enligt öppna data.
    </span>
  );
}
