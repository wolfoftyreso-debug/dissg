/**
 * Trust Log Entry Component
 * 
 * Displays a single trust log entry with full transparency.
 * Part of Block 55.
 * NO ICONS - text markers only per no-icons-doctrine.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  TrustLogEntry as TrustLogEntryType,
  CHANGE_TYPES,
  REVIEW_STATUSES,
  GOVERNANCE_ROLES,
} from '@/config/trustLogConfig';
import { Badge } from '@/components/ui/badge';

interface TrustLogEntryProps {
  entry: TrustLogEntryType;
  showDetails?: boolean;
  className?: string;
}

// Text markers instead of icons
const CHANGE_TYPE_MARKERS: Record<string, string> = {
  data_update: '[D]',
  method_update: '[M]',
  text_simplification: '[T]',
  structure_change: '[S]',
  bug_fix: '[B]',
  deprecation: '[X]',
};

const REVIEW_STATUS_MARKERS: Record<string, string> = {
  pending: '[...]',
  verified: '[OK]',
  disputed: '[!]',
  resolved: '[V]',
};

export function TrustLogEntry({
  entry,
  showDetails = true,
  className,
}: TrustLogEntryProps) {
  const changeTypeInfo = CHANGE_TYPES[entry.change_type];
  const reviewStatusInfo = REVIEW_STATUSES[entry.review_status];
  const changeMarker = CHANGE_TYPE_MARKERS[entry.change_type] || '[?]';
  const statusMarker = REVIEW_STATUS_MARKERS[entry.review_status] || '[?]';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn(
      'border border-border rounded-lg p-4 bg-card',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{changeMarker}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {entry.log_id}
          </span>
        </div>
        <Badge 
          variant="outline"
          className={cn(
            'text-xs font-mono',
            reviewStatusInfo.color,
            reviewStatusInfo.bgColor
          )}
        >
          {statusMarker} {reviewStatusInfo.label}
        </Badge>
      </div>

      {/* Change type */}
      <div className="mb-2">
        <span className="text-sm font-medium">{changeTypeInfo.label}</span>
        <span className="text-sm text-muted-foreground ml-2">
          — {changeTypeInfo.description}
        </span>
      </div>

      {/* Scope */}
      <div className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded mb-3">
        {entry.scope}
      </div>

      {/* Reason */}
      <p className="text-sm text-foreground mb-3">
        {entry.reason}
      </p>

      {showDetails && (
        <>
          {/* Impact indicators */}
          <div className="flex gap-4 text-xs mb-3">
            <span className={cn(
              'px-2 py-0.5 rounded font-mono',
              entry.data_changed 
                ? 'bg-status-warning/10 text-status-warning' 
                : 'bg-muted text-muted-foreground'
            )}>
              Data: {entry.data_changed ? '[Y]' : '[N]'}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded font-mono',
              entry.method_changed 
                ? 'bg-status-warning/10 text-status-warning' 
                : 'bg-muted text-muted-foreground'
            )}>
              Metod: {entry.method_changed ? '[Y]' : '[N]'}
            </span>
          </div>

          {/* Content impact */}
          {entry.content_impact && (
            <p className="text-xs text-muted-foreground mb-3">
              Effekt: {entry.content_impact}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
            <span>
              Initierad av: {entry.initiated_by}
              {entry.initiated_by_role && (
                <span className="ml-1">
                  ({GOVERNANCE_ROLES[entry.initiated_by_role]?.label})
                </span>
              )}
            </span>
            <span>{formatDate(entry.created_at)}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default TrustLogEntry;
