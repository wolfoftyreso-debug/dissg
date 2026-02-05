/**
 * BOARD DASHBOARD — "WHAT IS ON THE TABLE"
 * 
 * Focus: What requires responsibility NOW.
 * No dashboard. No history. No "overview of everything".
 */

import { cn } from '@/lib/utils';
import type { BoardCase, CaseStatus, ImpactLevel } from './types';

interface BoardDashboardProps {
  cases: BoardCase[];
  userRole: 'chair' | 'secretary' | 'board_member' | 'auditor';
  onSelectCase: (caseId: string) => void;
}

/**
 * Status markers following no-icons doctrine
 */
const STATUS_MARKERS: Record<CaseStatus, string> = {
  preparation: '[PREP]',
  meeting: '[MØTE]',
  locked: '[LÅST]',
  follow_up: '[UPPF]',
};

/**
 * Impact markers
 */
const IMPACT_MARKERS: Record<ImpactLevel, string> = {
  low: '[L]',
  medium: '[M]',
  high: '[H]',
  critical: '[!]',
};

export function BoardDashboard({ cases, userRole, onSelectCase }: BoardDashboardProps) {
  // Filter cases based on role
  const visibleCases = cases.filter(c => {
    if (userRole === 'chair' || userRole === 'secretary' || userRole === 'auditor') {
      return true;
    }
    // Board members only see active cases requiring their attention
    return c.status === 'preparation' || c.status === 'meeting';
  });

  // Sort by urgency: meeting first, then by days until meeting
  const sortedCases = [...visibleCases].sort((a, b) => {
    if (a.status === 'meeting' && b.status !== 'meeting') return -1;
    if (b.status === 'meeting' && a.status !== 'meeting') return 1;
    if (a.days_until_meeting === null) return 1;
    if (b.days_until_meeting === null) return -1;
    return a.days_until_meeting - b.days_until_meeting;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header - minimal */}
      <header className="mb-8">
        <h1 className="font-mono text-lg text-foreground">
          AKTUELLA ÄRENDEN
        </h1>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          {sortedCases.length} ärende{sortedCases.length !== 1 ? 'n' : ''} kräver uppmärksamhet
        </p>
      </header>

      {/* Case list */}
      <div className="space-y-2">
        {sortedCases.map((boardCase) => (
          <CaseRow 
            key={boardCase.case_id} 
            boardCase={boardCase} 
            onSelect={() => onSelectCase(boardCase.case_id)}
          />
        ))}
      </div>

      {sortedCases.length === 0 && (
        <div className="font-mono text-sm text-muted-foreground py-8 text-center">
          Inga ärenden kräver uppmärksamhet just nu.
        </div>
      )}
    </div>
  );
}

interface CaseRowProps {
  boardCase: BoardCase;
  onSelect: () => void;
}

function CaseRow({ boardCase, onSelect }: CaseRowProps) {
  const isLocked = boardCase.status === 'locked';
  const isMeeting = boardCase.status === 'meeting';

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left font-mono text-sm p-4 border transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        isLocked && "bg-muted/50 text-muted-foreground",
        isMeeting && "border-foreground",
        !isLocked && !isMeeting && "hover:bg-accent"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Status + Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "shrink-0",
              isMeeting && "text-foreground font-bold"
            )}>
              {STATUS_MARKERS[boardCase.status]}
            </span>
            <span className="truncate">
              {boardCase.title}
            </span>
          </div>
          
          {/* Impact + Irreversibility */}
          <div className="mt-1 text-muted-foreground">
            {IMPACT_MARKERS[boardCase.impact_level]}
            {' '}
            Påverkar {boardCase.population_affected.toLocaleString()} personer
            {' | '}
            Irreversibilitet: {boardCase.irreversibility}
          </div>
        </div>

        {/* Right: Time until meeting */}
        <div className="shrink-0 text-right">
          {boardCase.days_until_meeting !== null && boardCase.status === 'preparation' && (
            <span className={cn(
              boardCase.days_until_meeting <= 3 && "text-foreground font-bold"
            )}>
              {boardCase.days_until_meeting}d
            </span>
          )}
          {boardCase.status === 'meeting' && (
            <span className="font-bold">[NU]</span>
          )}
          {boardCase.status === 'locked' && (
            <span>[→]</span>
          )}
        </div>
      </div>
    </button>
  );
}
