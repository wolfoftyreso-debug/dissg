/**
 * PORTFOLIO PAGE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Premium feature för Analyst/Institutional tiers.
 * Bygg och analysera landsportföljer.
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import { PortfolioList } from '@/components/portfolio/PortfolioList';
import { PortfolioDetail } from '@/components/portfolio/PortfolioDetail';
import { CreatePortfolioDialog } from '@/components/portfolio/CreatePortfolioDialog';
import { Button } from '@/components/ui/button';

export default function PortfolioPage() {
  useAuth(); // Ensure auth context is available
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold font-mono">
                [PORT] Landsportföljer
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Skapa portföljer av länder och få aggregerad statistik
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                [ANALYST+]
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4">
        <SubscriptionGate 
          requiredTier="analyst"
          fallback={
            <div className="text-center py-16 space-y-4">
              <div className="text-4xl font-mono text-muted-foreground">[🔒]</div>
              <h2 className="text-xl font-semibold">Premium-funktion</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Portföljfunktionen är tillgänglig för Analyst- och Institutional-konton.
                Uppgradera för att kunna bygga egna landsportföljer med aggregerad statistik.
              </p>
              <Button variant="default" className="mt-4">
                Uppgradera till Analyst
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-12 gap-6">
            {/* Portfolio list sidebar */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="sticky top-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-sm font-medium">Mina portföljer</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    [+] Ny
                  </Button>
                </div>
                
                <PortfolioList 
                  selectedId={selectedPortfolioId}
                  onSelect={setSelectedPortfolioId}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="col-span-12 lg:col-span-9">
              {selectedPortfolioId ? (
                <PortfolioDetail portfolioId={selectedPortfolioId} />
              ) : (
                <div className="border border-dashed border-border rounded-lg p-12 text-center">
                  <div className="text-2xl font-mono text-muted-foreground mb-4">[PORT]</div>
                  <h3 className="text-lg font-medium mb-2">Välj eller skapa en portfölj</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Portföljer låter dig gruppera länder och få aggregerad statistik 
                    för Reality Index, domänpoäng och trendanalys.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    Skapa din första portfölj
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SubscriptionGate>
      </main>

      {/* Create dialog */}
      <CreatePortfolioDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={(portfolio) => {
          setSelectedPortfolioId(portfolio.id);
          setCreateDialogOpen(false);
        }}
      />
    </div>
  );
}
