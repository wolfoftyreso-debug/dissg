/**
 * 🛑 BLOCK 51 — SHOW THE DATA BUTTON
 * 
 * Standard button on every view that reveals:
 * - Sources
 * - Time series
 * - Method
 * - Uncertainty
 * 
 * "No one should need to 'trust' anything."
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Database, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface DataSource {
  name: string;
  url?: string;
  type: 'primary' | 'secondary' | 'derived';
}

interface ShowDataButtonProps {
  /** Data sources */
  sources: DataSource[];
  /** Time coverage description */
  timeCoverage: string;
  /** Method description */
  method: string;
  /** Uncertainty description */
  uncertainty: string;
  /** Additional method notes */
  methodNotes?: string[];
  className?: string;
}

/**
 * Show Data Button
 * 
 * Reveals underlying data details on click.
 * Every view must have this button.
 */
export function ShowDataButton({
  sources,
  timeCoverage,
  method,
  uncertainty,
  methodNotes = [],
  className,
}: ShowDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3',
          'bg-muted/50 hover:bg-muted transition-colors',
          'text-sm font-medium text-foreground'
        )}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span>Show underlying data</span>
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-card">
          {/* Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Sources
            </h4>
            <ul className="space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    source.type === 'primary' && 'bg-status-positive/20 text-status-positive',
                    source.type === 'secondary' && 'bg-status-warning/20 text-status-warning',
                    source.type === 'derived' && 'bg-muted text-muted-foreground',
                  )}>
                    {source.type}
                  </span>
                  {source.url ? (
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {source.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-foreground">{source.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Time Coverage */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Time coverage
            </h4>
            <p className="text-sm text-foreground">{timeCoverage}</p>
          </div>

          {/* Method */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Method
            </h4>
            <p className="text-sm text-foreground">{method}</p>
            {methodNotes.length > 0 && (
              <ul className="mt-2 space-y-1">
                {methodNotes.map((note, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    • {note}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Uncertainty */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Uncertainty
            </h4>
            <p className="text-sm text-foreground">{uncertainty}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for inline use
 */
export function ShowDataLink({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-xs text-primary hover:underline flex items-center gap-1',
        className
      )}
    >
      <Database className="h-3 w-3" />
      <span>Show data</span>
    </button>
  );
}

export default ShowDataButton;
