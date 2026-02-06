/**
 * Diagnostic Scope Selector
 * 
 * Pre-session selector for choosing diagnostic scope:
 * - Global (full civilizational diagnosis)
 * - Continent/Region
 * - Nation
 * - City/Municipality
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  CONTINENTS, 
  COUNTRIES, 
  getTotalCountryCount 
} from '@/lib/geo/countries';
import { ALL_CITIES } from '@/data/cities';

// =============================================================================
// TYPES
// =============================================================================

export type DiagnosticScopeLevel = 'global' | 'continent' | 'country' | 'city';

export interface DiagnosticScope {
  level: DiagnosticScopeLevel;
  code: string;
  name: string;
  dataCoverage: number;
  indicatorCount: number;
  lastUpdate: string;
}

interface ScopeLevelOption {
  level: DiagnosticScopeLevel;
  marker: string;
  title: string;
  subtitle: string;
  description: string;
  available: boolean;
}

// =============================================================================
// SCOPE LEVEL SELECTOR
// =============================================================================

interface ScopeLevelSelectorProps {
  selectedLevel: DiagnosticScopeLevel | null;
  onSelectLevel: (level: DiagnosticScopeLevel) => void;
}

function ScopeLevelSelector({ selectedLevel, onSelectLevel }: ScopeLevelSelectorProps) {
  const levels: ScopeLevelOption[] = [
    {
      level: 'global',
      marker: '[◉]',
      title: 'GLOBAL',
      subtitle: 'Fullständig civilisationsdiagnos',
      description: '195 nationer • 184 indikatorer • 7 världsdelar',
      available: true,
    },
    {
      level: 'continent',
      marker: '[▣]',
      title: 'VÄRLDSDEL',
      subtitle: 'Regional systemdiagnos',
      description: 'Europa, Asien, Afrika, Amerika, Oceanien',
      available: true,
    },
    {
      level: 'country',
      marker: '[▢]',
      title: 'NATION',
      subtitle: 'Nationell systemdiagnos',
      description: 'Individuell nation med full indikatoruppsättning',
      available: true,
    },
    {
      level: 'city',
      marker: '[•]',
      title: 'STAD / KOMMUN',
      subtitle: 'Lokal systemdiagnos',
      description: 'Metropolitanområden med tillgänglig data',
      available: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-mono font-bold mb-2">VÄLJ DIAGNOSTISK OMFATTNING</h2>
        <p className="text-sm text-muted-foreground">
          Definiera systemets gränser för diagnossessionen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map((option) => (
          <button
            key={option.level}
            onClick={() => onSelectLevel(option.level)}
            disabled={!option.available}
            className={`
              p-5 rounded-lg border text-left transition-all
              ${selectedLevel === option.level 
                ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
              ${!option.available && 'opacity-50 cursor-not-allowed'}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                font-mono text-2xl
                ${selectedLevel === option.level ? 'text-primary' : 'text-muted-foreground'}
              `}>
                {option.marker}
              </div>
              <div className="flex-1">
                <div className="font-mono font-bold text-sm">{option.title}</div>
                <div className="text-sm text-foreground mt-1">{option.subtitle}</div>
                <div className="text-xs text-muted-foreground mt-2">{option.description}</div>
              </div>
              {selectedLevel === option.level && (
                <span className="font-mono text-primary">[→]</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// ENTITY SELECTOR
// =============================================================================

interface EntitySelectorProps {
  level: DiagnosticScopeLevel;
  onSelectEntity: (scope: DiagnosticScope) => void;
  onBack: () => void;
}

function EntitySelector({ level, onSelectEntity, onBack }: EntitySelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const levelConfig = {
    global: { title: 'GLOBAL DIAGNOS', singular: 'Global' },
    continent: { title: 'VÄLJ VÄRLDSDEL', singular: 'Världsdel' },
    country: { title: 'VÄLJ NATION', singular: 'Nation' },
    city: { title: 'VÄLJ STAD', singular: 'Stad' },
  };

  // If global, directly return the global scope
  if (level === 'global') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="font-mono text-xs">
            ← TILLBAKA
          </Button>
          <h2 className="text-lg font-mono font-bold">{levelConfig[level].title}</h2>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="font-mono text-4xl text-primary">
              [◉]
            </div>
            <div>
              <div className="text-2xl font-mono font-bold">GLOBAL CIVILISATION</div>
              <div className="text-muted-foreground">Fullständig systemdiagnos</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded border bg-muted/30 text-center">
              <div className="font-mono text-2xl font-bold">{getTotalCountryCount()}</div>
              <div className="text-xs text-muted-foreground">NATIONER</div>
            </div>
            <div className="p-4 rounded border bg-muted/30 text-center">
              <div className="font-mono text-2xl font-bold">184</div>
              <div className="text-xs text-muted-foreground">INDIKATORER</div>
            </div>
            <div className="p-4 rounded border bg-muted/30 text-center">
              <div className="font-mono text-2xl font-bold">76%</div>
              <div className="text-xs text-muted-foreground">DATATÄCKNING</div>
            </div>
          </div>

          <div className="flex gap-3 text-xs text-muted-foreground mb-6">
            <Badge variant="outline" className="font-mono">
              [λ] 0.78
            </Badge>
            <Badge variant="outline" className="font-mono">
              [↗] 1990–2025
            </Badge>
            <Badge variant="outline" className="font-mono">
              [DB] 47 DATAKÄLLOR
            </Badge>
          </div>

          <Button 
            onClick={() => onSelectEntity({
              level: 'global',
              code: 'GLOBAL',
              name: 'Global Civilisation',
              dataCoverage: 82,
              indicatorCount: 184,
              lastUpdate: '2024-11-15',
            })}
            className="w-full font-mono"
          >
            STARTA GLOBAL DIAGNOS
          </Button>
        </div>
      </div>
    );
  }

  // For continent selection
  if (level === 'continent') {
    const filteredContinents = CONTINENTS.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="font-mono text-xs">
            ← TILLBAKA
          </Button>
          <h2 className="text-lg font-mono font-bold">{levelConfig[level].title}</h2>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-sm">[SÖK]</span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök världsdel..."
            className="pl-16 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredContinents.map((continent) => (
            <button
              key={continent.code}
              onClick={() => onSelectEntity({
                level: 'continent',
                code: continent.code,
                name: continent.name,
                dataCoverage: continent.dataCoverage,
                indicatorCount: continent.indicatorCount,
                lastUpdate: '2024-11-15',
              })}
              className="p-4 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="font-mono font-bold">{continent.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {continent.countries} nationer
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {continent.dataCoverage}% DATA
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // For country selection
  if (level === 'country') {
    const filteredCountries = COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    ).filter(c => !selectedContinent || c.continent === selectedContinent);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="font-mono text-xs">
            ← TILLBAKA
          </Button>
          <h2 className="text-lg font-mono font-bold">{levelConfig[level].title}</h2>
        </div>

        {/* Continent filter */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={!selectedContinent ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setSelectedContinent(null)}
            className="font-mono text-xs"
          >
            ALLA
          </Button>
          {CONTINENTS.map(c => (
            <Button
              key={c.code}
              variant={selectedContinent === c.code ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedContinent(c.code)}
              className="font-mono text-xs"
            >
              {c.name.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-sm">[SÖK]</span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök nation..."
            className="pl-16 font-mono"
          />
        </div>

        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => onSelectEntity({
                  level: 'country',
                  code: country.code,
                  name: country.name,
                  dataCoverage: country.dataCoverage,
                  indicatorCount: country.indicatorCount,
                  lastUpdate: '2024-11-15',
                })}
                className="p-3 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-mono text-xs text-muted-foreground">{country.code}</div>
                <div className="font-semibold text-sm">{country.name}</div>
                <Badge variant="secondary" className="font-mono text-[10px] mt-2">
                  {country.dataCoverage}%
                </Badge>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="text-xs text-muted-foreground text-center">
          Visar {filteredCountries.length} av {COUNTRIES.length} nationer
        </div>
      </div>
    );
  }

  // For city selection
  if (level === 'city') {
    const filteredCities = ALL_CITIES.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.region?.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 100); // Limit initial display

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="font-mono text-xs">
            ← TILLBAKA
          </Button>
          <h2 className="text-lg font-mono font-bold">{levelConfig[level].title}</h2>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-sm">[SÖK]</span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök stad, kommun eller region..."
            className="pl-16 font-mono"
          />
        </div>

        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCities.map((city) => {
              const country = COUNTRIES.find(c => c.code === city.country);
              const qualityColor = city.dataQuality === 'A' ? 'text-green-600' : city.dataQuality === 'B' ? 'text-blue-600' : city.dataQuality === 'C' ? 'text-yellow-600' : 'text-red-600';
              return (
                <button
                  key={`${city.code}-${city.country}`}
                  onClick={() => onSelectEntity({
                    level: 'city',
                    code: city.code,
                    name: city.name,
                    dataCoverage: city.dataCoverage,
                    indicatorCount: city.indicatorCount,
                    lastUpdate: city.lastUpdate,
                  })}
                  className="p-3 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{city.code}</span>
                    <span className={`font-mono text-[10px] ${qualityColor}`}>[{city.dataQuality}]</span>
                  </div>
                  <div className="font-semibold text-sm">{city.name}</div>
                  <div className="text-xs text-muted-foreground">{city.region ? `${city.region}, ` : ''}{country?.name}</div>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {city.dataCoverage}%
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {city.indicatorCount} ind.
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="text-xs text-muted-foreground text-center">
          Visar {filteredCities.length} av {ALL_CITIES.length} städer och kommuner
        </div>
      </div>
    );
  }

  return null;
}

// =============================================================================
// MAIN SCOPE SELECTOR COMPONENT
// =============================================================================

interface DiagnosticScopeSelectorProps {
  onSelectScope: (scope: DiagnosticScope) => void;
}

export function DiagnosticScopeSelector({ onSelectScope }: DiagnosticScopeSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<DiagnosticScopeLevel | null>(null);

  return (
    <div className="bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-mono text-xs text-primary">[●]</span>
            <span className="font-mono text-xs text-muted-foreground">DIAGNOSTISK SESSION</span>
          </div>
          <h1 className="text-3xl font-mono font-bold mb-2">SYSTEMDIAGNOS</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            OEM-klass diagnostikverktyg för civilisatorisk systemanalys. 
            Neutral, datadriven, utan rekommendationer.
          </p>
        </div>

        {/* Hierarchy indicator */}
        <div className="flex justify-center gap-2 mb-8 text-xs font-mono">
          <span className={`px-2 py-1 rounded ${selectedLevel === 'global' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            GLOBAL
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-2 py-1 rounded ${selectedLevel === 'continent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            VÄRLDSDEL
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-2 py-1 rounded ${selectedLevel === 'country' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            NATION
          </span>
          <span className="text-muted-foreground">→</span>
          <span className={`px-2 py-1 rounded ${selectedLevel === 'city' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            STAD
          </span>
        </div>

        {/* Main content */}
        <div className="bg-card border rounded-lg p-6">
          {!selectedLevel ? (
            <ScopeLevelSelector 
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
            />
          ) : (
            <EntitySelector
              level={selectedLevel}
              onSelectEntity={onSelectScope}
              onBack={() => setSelectedLevel(null)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground font-mono">
          <div className="flex justify-center gap-4">
            <span>195 NATIONER</span>
            <span>•</span>
            <span>184 INDIKATORER</span>
            <span>•</span>
            <span>47 DATAKÄLLOR</span>
            <span>•</span>
            <span>1990–2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticScopeSelector;
