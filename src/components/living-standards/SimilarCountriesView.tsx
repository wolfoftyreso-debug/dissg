import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HUMAN_INDICATORS } from '@/lib/living-standards';
import type { SimilarCountryResult } from '@/lib/living-standards/scenarioTypes';
import { Search, GitBranch, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SimilarCountriesViewProps {
  availableCountries: { code: string; name: string }[];
  availableYears: number[];
  result?: SimilarCountryResult;
  onSearch: (countryCode: string, year: number) => void;
  isSearching?: boolean;
}

function TrajectoryCard({ 
  match 
}: { 
  match: SimilarCountryResult['matches'][0];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium">{match.countryName}</p>
            <p className="text-sm text-muted-foreground">
              Liknande profil år {match.matchYear}
            </p>
          </div>
          <Badge 
            variant="secondary"
            className={cn(
              match.overallSimilarity >= 80 && "bg-chart-2/20 text-chart-2",
              match.overallSimilarity >= 60 && match.overallSimilarity < 80 && "bg-warning/20 text-warning"
            )}
          >
            {match.overallSimilarity}% match
          </Badge>
        </div>

        {/* Dimension matches */}
        <div className="flex flex-wrap gap-1 mb-3">
          {match.dimensionMatches.slice(0, 4).map(dim => (
            <Badge key={dim.dimension} variant="outline" className="text-xs">
              {dim.dimension}: {dim.deviation > 0 ? '+' : ''}{dim.deviation.toFixed(0)}%
            </Badge>
          ))}
        </div>

        {/* Key trajectory outcomes */}
        <div className="space-y-2">
          {match.trajectory.slice(0, 3).map(traj => {
            const meta = HUMAN_INDICATORS[traj.indicatorId];
            const isPositive = meta.higherIsBetter 
              ? traj.netChange > 0 
              : traj.netChange < 0;
            
            return (
              <div key={traj.indicatorId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{meta.nameShort}</span>
                <span className={cn(
                  "font-medium tabular-nums",
                  isPositive ? "text-chart-2" : "text-destructive"
                )}>
                  {traj.netChange > 0 ? '+' : ''}{traj.netChange.toFixed(0)}%
                  <span className="text-xs text-muted-foreground ml-1">
                    ({traj.yearsTracked}år)
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Divergence points */}
        {match.divergences.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3 pt-3 border-t border-border flex items-center justify-between text-sm min-h-[44px]"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="w-4 h-4" />
              {match.divergences.length} vägskäl
            </span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-90"
            )} />
          </button>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                {match.divergences.map((div, i) => (
                  <div key={i} className="text-xs bg-muted/50 rounded p-2">
                    <p className="font-medium">{div.year}: {div.description}</p>
                    <p className="text-muted-foreground mt-1">
                      Påverkade: {div.indicatorsAffected.map(id => 
                        HUMAN_INDICATORS[id]?.nameShort
                      ).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function SimilarCountriesView({
  availableCountries,
  availableYears,
  result,
  onSearch,
  isSearching
}: SimilarCountriesViewProps) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleSearch = () => {
    if (selectedCountry && selectedYear) {
      onSearch(selectedCountry, parseInt(selectedYear));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Visa liknande länder</h2>
        <p className="text-sm text-muted-foreground">
          "Vilka länder såg ut som detta land vid denna tidpunkt – och hur utvecklades de?"
        </p>
      </div>

      {/* Search form */}
      <Card>
        <CardContent className="py-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Välj referensland" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map(c => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue placeholder="Välj referensår" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full min-h-[44px]"
            disabled={!selectedCountry || !selectedYear || isSearching}
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Söker...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Hitta liknande länder
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={`${result.query.referenceCountry}-${result.query.referenceYear}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Query summary */}
            <Card className="bg-muted/30">
              <CardContent className="py-3">
                <p className="text-sm">
                  Länder som liknade{' '}
                  <span className="font-medium">
                    {availableCountries.find(c => c.code === result.query.referenceCountry)?.name}
                  </span>
                  {' '}år{' '}
                  <span className="font-medium">{result.query.referenceYear}</span>
                </p>
              </CardContent>
            </Card>

            {/* Match cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                {result.matches.length} liknande länder hittades
              </h3>
              
              {result.matches.map(match => (
                <TrajectoryCard 
                  key={`${match.countryCode}-${match.matchYear}`}
                  match={match}
                />
              ))}
            </div>

            {/* Observed patterns */}
            {result.observedPatterns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Observerade mönster</h3>
                
                {result.observedPatterns.map(pattern => (
                  <Card key={pattern.id} className="bg-muted/30">
                    <CardContent className="py-4">
                      <p className="text-sm font-medium mb-2">{pattern.statement}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {pattern.support.countriesObserved} länder
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {pattern.support.timePeriod.start}–{pattern.support.timePeriod.end}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            pattern.uncertainty.level === 'high' && "border-destructive text-destructive",
                            pattern.uncertainty.level === 'medium' && "border-warning text-warning"
                          )}
                        >
                          {pattern.uncertainty.level === 'low' ? 'Låg' : 
                           pattern.uncertainty.level === 'medium' ? 'Måttlig' : 'Hög'} osäkerhet
                        </Badge>
                      </div>
                      
                      {pattern.limitations.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                          <p className="font-medium text-destructive mb-1">Begränsningar:</p>
                          <ul className="space-y-0.5">
                            {pattern.limitations.map((lim, i) => (
                              <li key={i}>• {lim}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
