/**
 * PORTFOLIO DETAIL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Visar portföljinnehåll med aggregerad statistik:
 * - Reality Index (sammanvägt)
 * - Domänpoäng (Hälsa, Ekonomi, etc.)
 * - Trendanalys
 * - Jämförelse mot global/regional
 */

import React, { useState, useMemo } from 'react';
import { usePortfolio, useDeletePortfolio, useRemoveFromPortfolio } from '@/hooks/use-portfolios';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddCountryDialog } from './AddCountryDialog';
import { PortfolioStats } from './PortfolioStats';
import { PortfolioDomainChart } from './PortfolioDomainChart';
import { PortfolioTrendChart } from './PortfolioTrendChart';
import { PortfolioComparison } from './PortfolioComparison';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PortfolioDetailProps {
  portfolioId: string;
}

export function PortfolioDetail({ portfolioId }: PortfolioDetailProps) {
  const { data: portfolio, isLoading, error } = usePortfolio(portfolioId);
  const deletePortfolio = useDeletePortfolio();
  const removeFromPortfolio = useRemoveFromPortfolio();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  // Fetch country details for items
  const countryCodes = useMemo(
    () => portfolio?.items.map((item) => item.country_code) || [],
    [portfolio?.items]
  );

  const { data: countries } = useQuery({
    queryKey: ['countries-for-portfolio', countryCodes],
    queryFn: async () => {
      if (countryCodes.length === 0) return [];
      
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .in('code', countryCodes);
      
      if (error) throw error;
      return data;
    },
    enabled: countryCodes.length > 0,
  });

  const handleDelete = async () => {
    await deletePortfolio.mutateAsync(portfolioId);
    setDeleteDialogOpen(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromPortfolio.mutateAsync({ itemId, portfolioId });
    setRemovingItemId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="text-center py-12 text-destructive">
        Kunde inte ladda portföljen
      </div>
    );
  }

  const countryMap = new Map(countries?.map((c) => [c.code, c]) || []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{portfolio.name}</h2>
          {portfolio.description && (
            <p className="text-muted-foreground mt-1">{portfolio.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {portfolio.items.length} {portfolio.items.length === 1 ? 'land' : 'länder'} · 
            Skapad {new Date(portfolio.created_at).toLocaleDateString('sv-SE')}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            onClick={() => setAddDialogOpen(true)}
          >
            [+] Lägg till land
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs text-destructive hover:text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            [×] Radera
          </Button>
        </div>
      </div>

      {/* Country list */}
      {portfolio.items.length > 0 ? (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono">Länder i portföljen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {portfolio.items.map((item) => {
                  const country = countryMap.get(item.country_code);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full",
                        "bg-muted text-sm border border-border"
                      )}
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        [{item.country_code}]
                      </span>
                      <span>{country?.name || item.country_code}</span>
                      <button
                        onClick={() => setRemovingItemId(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                        title="Ta bort"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Statistics tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="font-mono">
              <TabsTrigger value="overview">[IX] Översikt</TabsTrigger>
              <TabsTrigger value="domains">[DOM] Domäner</TabsTrigger>
              <TabsTrigger value="trends">[↗] Trender</TabsTrigger>
              <TabsTrigger value="compare">[⟷] Jämför</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PortfolioStats countryCodes={countryCodes} countries={countries || []} />
            </TabsContent>

            <TabsContent value="domains">
              <PortfolioDomainChart countryCodes={countryCodes} countries={countries || []} />
            </TabsContent>

            <TabsContent value="trends">
              <PortfolioTrendChart countryCodes={countryCodes} />
            </TabsContent>

            <TabsContent value="compare">
              <PortfolioComparison countryCodes={countryCodes} countries={countries || []} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="text-2xl font-mono text-muted-foreground mb-4">[∅]</div>
            <h3 className="font-medium mb-2">Portföljen är tom</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Lägg till länder för att se aggregerad statistik.
            </p>
            <Button onClick={() => setAddDialogOpen(true)}>
              Lägg till första landet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add country dialog */}
      <AddCountryDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        portfolioId={portfolioId}
        existingCountryCodes={countryCodes}
      />

      {/* Delete portfolio confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera portfölj?</AlertDialogTitle>
            <AlertDialogDescription>
              Är du säker på att du vill radera "{portfolio.name}"? 
              Detta kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove item confirmation */}
      <AlertDialog open={!!removingItemId} onOpenChange={() => setRemovingItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta bort land?</AlertDialogTitle>
            <AlertDialogDescription>
              Vill du ta bort detta land från portföljen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removingItemId && handleRemoveItem(removingItemId)}
            >
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
