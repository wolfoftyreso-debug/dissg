/**
 * Trust Log List
 * 
 * Displays the public trust log with filtering.
 * Part of Block 55.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTrustLog, useTrustLogStats } from '@/hooks/useTrustLog';
import { TrustLogEntry } from './TrustLogEntry';
import { CHANGE_TYPES, ChangeType } from '@/config/trustLogConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Shield, Filter } from 'lucide-react';

interface TrustLogListProps {
  scope?: string;
  limit?: number;
  showStats?: boolean;
  className?: string;
}

export function TrustLogList({
  scope,
  limit = 20,
  showStats = true,
  className,
}: TrustLogListProps) {
  const [selectedType, setSelectedType] = useState<ChangeType | undefined>();
  
  const { data: entries, isLoading } = useTrustLog({
    limit,
    changeType: selectedType,
    scope,
  });
  
  const { data: stats } = useTrustLogStats();

  const changeTypes = Object.keys(CHANGE_TYPES) as ChangeType[];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Trust Log</h2>
        {stats && (
          <Badge variant="secondary" className="text-xs">
            {stats.total} ändringar
          </Badge>
        )}
      </div>

      {/* Stats */}
      {showStats && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-semibold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Totalt</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-semibold">{stats.recentCount}</div>
            <div className="text-xs text-muted-foreground">Senaste 30 dagar</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-semibold">
              {stats.byStatus?.verified || 0}
            </div>
            <div className="text-xs text-muted-foreground">Verifierade</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-semibold">
              {stats.byStatus?.pending || 0}
            </div>
            <div className="text-xs text-muted-foreground">Väntande</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <button
          onClick={() => setSelectedType(undefined)}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors',
            !selectedType 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          Alla
        </button>
        {changeTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              selectedType === type 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {CHANGE_TYPES[type].label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : entries && entries.length > 0 ? (
          entries.map((entry) => (
            <TrustLogEntry key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>Inga ändringar loggade ännu.</p>
            <p className="text-xs mt-1">
              Alla framtida ändringar kommer visas här.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrustLogList;
