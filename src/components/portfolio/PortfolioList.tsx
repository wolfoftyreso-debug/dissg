/**
 * PORTFOLIO LIST
 * ═══════════════════════════════════════════════════════════════
 * 
 * Sidebar list of user's portfolios.
 */

import React from 'react';
import { usePortfolios } from '@/hooks/use-portfolios';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PortfolioList({ selectedId, onSelect }: PortfolioListProps) {
  const { data: portfolios, isLoading, error } = usePortfolios();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4 border border-destructive/20 rounded-lg">
        Kunde inte ladda portföljer
      </div>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
        Inga portföljer ännu
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {portfolios.map((portfolio) => (
        <button
          key={portfolio.id}
          onClick={() => onSelect(portfolio.id)}
          className={cn(
            "w-full text-left p-3 rounded-lg border transition-colors",
            "hover:bg-muted/50",
            selectedId === portfolio.id
              ? "bg-primary/10 border-primary/30"
              : "bg-card border-border"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">{portfolio.name}</h3>
              {portfolio.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {portfolio.description}
                </p>
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
              {new Date(portfolio.created_at).toLocaleDateString('sv-SE')}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
