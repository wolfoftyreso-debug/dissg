/**
 * ADD COUNTRY DIALOG
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddToPortfolio } from '@/hooks/use-portfolios';
import { cn } from '@/lib/utils';

interface AddCountryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: string;
  existingCountryCodes: string[];
}

export function AddCountryDialog({
  open,
  onOpenChange,
  portfolioId,
  existingCountryCodes,
}: AddCountryDialogProps) {
  const [search, setSearch] = useState('');
  const addToPortfolio = useAddToPortfolio();

  // Fetch all countries
  const { data: countries, isLoading } = useQuery({
    queryKey: ['all-countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name, name_local, region, bloc')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Filter countries
  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    
    const searchLower = search.toLowerCase();
    return countries.filter((country) => {
      // Exclude already added
      if (existingCountryCodes.includes(country.code)) return false;
      
      // Search filter
      if (search) {
        return (
          country.name.toLowerCase().includes(searchLower) ||
          country.code.toLowerCase().includes(searchLower) ||
          country.name_local?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [countries, search, existingCountryCodes]);

  // Group by region
  const groupedCountries = useMemo(() => {
    const groups: Record<string, typeof filteredCountries> = {};
    
    filteredCountries.forEach((country) => {
      const region = country.region || 'Övriga';
      if (!groups[region]) groups[region] = [];
      groups[region].push(country);
    });
    
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredCountries]);

  const handleAdd = async (countryCode: string) => {
    await addToPortfolio.mutateAsync({
      portfolioId,
      countryCode,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-mono">[+] Lägg till land</DialogTitle>
          <DialogDescription>
            Sök och lägg till länder i din portfölj.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Sök land..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="my-2"
        />

        <ScrollArea className="flex-1 -mx-6 px-6">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Laddar länder...
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {search ? 'Inga matchande länder' : 'Alla länder är redan tillagda'}
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {groupedCountries.map(([region, countries]) => (
                <div key={region}>
                  <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2 sticky top-0 bg-background py-1">
                    {region}
                  </h4>
                  <div className="space-y-1">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleAdd(country.code)}
                        disabled={addToPortfolio.isPending}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md transition-colors",
                          "hover:bg-muted/80 flex items-center justify-between gap-2",
                          "disabled:opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            [{country.code}]
                          </span>
                          <span>{country.name}</span>
                          {country.bloc && (
                            <span className="text-xs text-muted-foreground">
                              ({country.bloc})
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-primary font-mono opacity-0 group-hover:opacity-100">
                          [+]
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
