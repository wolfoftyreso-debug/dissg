/**
 * Government Budget Explorer
 * 
  * Global budget comparison for all countries with government data.
  * Simple, visual budget comparison that a 15-year-old can understand.
 * Every element is clickable for deeper exploration.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GOVERNMENT_REGISTRY,
  type GovernmentPeriod, 
  BLOC_COLORS,
  COUNTRY_META,
} from '@/lib/political/politicalRegistry';
import { ChevronRight, TrendingUp, TrendingDown, Info, AlertTriangle, Globe } from 'lucide-react';

// Available countries with government data
const AVAILABLE_COUNTRIES = Object.keys(GOVERNMENT_REGISTRY).filter(
  code => GOVERNMENT_REGISTRY[code] && GOVERNMENT_REGISTRY[code].length > 0
);

// Budget categories with simple explanations
interface BudgetCategory {
  id: string;
  name: string;
  simpleExplanation: string;
  icon: string;
  color: string;
}

const BUDGET_CATEGORIES: BudgetCategory[] = [
  { 
    id: 'health', 
    name: 'Sjukvård & Hälsa', 
    simpleExplanation: 'Pengar till sjukhus, vårdcentraler och medicin',
    icon: '🏥',
    color: 'bg-emerald-500'
  },
  { 
    id: 'education', 
    name: 'Utbildning', 
    simpleExplanation: 'Pengar till skolor, universitet och lärare',
    icon: '📚',
    color: 'bg-blue-500'
  },
  { 
    id: 'defense', 
    name: 'Försvar', 
    simpleExplanation: 'Pengar till militären och landets säkerhet',
    icon: '🛡️',
    color: 'bg-slate-500'
  },
  { 
    id: 'social', 
    name: 'Socialt Skydd', 
    simpleExplanation: 'Pengar till pensioner, barnbidrag och hjälp till arbetslösa',
    icon: '🤝',
    color: 'bg-rose-500'
  },
  { 
    id: 'infrastructure', 
    name: 'Infrastruktur', 
    simpleExplanation: 'Pengar till vägar, järnvägar och broar',
    icon: '🚂',
    color: 'bg-amber-500'
  },
  { 
    id: 'environment', 
    name: 'Miljö & Klimat', 
    simpleExplanation: 'Pengar till att skydda naturen och minska utsläpp',
    icon: '🌿',
    color: 'bg-green-500'
  },
  { 
    id: 'justice', 
    name: 'Rättsväsende', 
    simpleExplanation: 'Pengar till polis, domstolar och fängelser',
    icon: '⚖️',
    color: 'bg-purple-500'
  },
  { 
    id: 'culture', 
    name: 'Kultur & Fritid', 
    simpleExplanation: 'Pengar till bibliotek, muséer och idrott',
    icon: '🎭',
    color: 'bg-pink-500'
  },
];

// Mock budget data - in production would come from database
interface GovernmentBudget {
  governmentId: string;
  year: number;
  totalBudget: number; // in billions SEK
  categories: Record<string, number>; // percentage of total
  deficit: number; // positive = surplus, negative = deficit
  debtRatio: number; // debt as % of GDP
}

const generateMockBudget = (gov: GovernmentPeriod, year: number): GovernmentBudget => {
  const isLeft = gov.bloc === 'left';
  const seed = gov.id.length + year;
  
  // Left vs right bloc tends to prioritize different things (simplified for education)
  return {
    governmentId: gov.id,
    year,
    totalBudget: 1000 + (seed % 200), // Around 1000-1200 billion
    categories: {
      health: isLeft ? 22 : 20,
      education: isLeft ? 18 : 16,
      defense: isLeft ? 4 : 6,
      social: isLeft ? 28 : 24,
      infrastructure: isLeft ? 8 : 10,
      environment: isLeft ? 4 : 3,
      justice: isLeft ? 6 : 8,
      culture: isLeft ? 3 : 2,
    },
    deficit: isLeft ? -15 + (seed % 30) : -10 + (seed % 25),
    debtRatio: 35 + (seed % 15),
  };
};

// Simple percentage bar
const PercentBar: React.FC<{
  percent: number;
  color: string;
  label: string;
  onClick?: () => void;
}> = ({ percent, color, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full group text-left"
  >
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-mono font-medium">{percent}%</span>
    </div>
    <div className="h-6 bg-muted rounded-full overflow-hidden">
      <div 
        className={cn(color, 'h-full rounded-full transition-all group-hover:opacity-80')}
        style={{ width: `${percent}%` }}
      />
    </div>
  </button>
);

// Money visualization - makes big numbers understandable
const MoneyExplainer: React.FC<{
  amount: number; // in billions
  label: string;
  population: number;
  currencySymbol: string;
  onClick?: () => void;
}> = ({ amount, label, population, currencySymbol, onClick }) => {
  // Convert to relatable examples
  const perPerson = Math.round((amount * 1000000000) / (population * 1000000));
  const perMonth = Math.round(perPerson / 12);
  
  return (
    <button
      onClick={onClick}
      className="w-full p-4 border rounded-lg text-left hover:bg-muted/50 transition-colors"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{amount.toLocaleString('sv-SE')} mdr {currencySymbol}</p>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        <p>= <span className="text-foreground font-medium">{perPerson.toLocaleString('sv-SE')} {currencySymbol}</span> per person</p>
        <p>= <span className="text-foreground font-medium">{perMonth.toLocaleString('sv-SE')} {currencySymbol}</span> per person/månad</p>
      </div>
    </button>
  );
};

// Government card for selection
const GovernmentCard: React.FC<{
  government: GovernmentPeriod;
  isSelected: boolean;
  onClick: () => void;
}> = ({ government, isSelected, onClick }) => {
  const bloc = BLOC_COLORS[government.bloc];
  const startYear = government.startDate.split('-')[0];
  const endYear = government.endDate ? government.endDate.split('-')[0] : 'nu';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 border-2 rounded-lg text-left transition-all w-full',
        bloc.bg,
        isSelected ? 'border-primary ring-2 ring-primary/30' : bloc.border,
        'hover:scale-[1.02]'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{government.leaderName}</p>
          <p className="text-sm text-muted-foreground">{government.leaderParty}</p>
        </div>
        <span className="text-xs bg-background/80 px-2 py-0.5 rounded">
          {startYear}–{endYear}
        </span>
      </div>
      <div className="mt-2 text-xs">
        <span className={cn(
          'px-2 py-0.5 rounded',
          government.bloc === 'left' ? 'bg-red-500/20 text-red-700' :
          government.bloc === 'right' ? 'bg-blue-500/20 text-blue-700' :
          'bg-muted text-muted-foreground'
        )}>
          {bloc.label}
        </span>
      </div>
    </button>
  );
};

// Category detail dialog
const CategoryDetailDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: BudgetCategory | null;
  budget: GovernmentBudget | null;
  government: GovernmentPeriod | null;
}> = ({ open, onOpenChange, category, budget, government }) => {
  if (!category || !budget || !government) return null;
  
  const percent = budget.categories[category.id] || 0;
  const amountBillions = (budget.totalBudget * percent) / 100;
  const perPerson = Math.round((amountBillions * 1000000000) / 10500000);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            {category.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Simple explanation */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Vad är detta?</p>
                  <p className="text-sm text-muted-foreground">{category.simpleExplanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Budget numbers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Andel av hela budgeten</p>
                <p className="text-3xl font-bold">{percent}%</p>
              </div>
              <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', category.color)}>
                <span className="text-2xl">{category.icon}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">Totalt belopp</p>
                <p className="text-xl font-bold">{amountBillions.toFixed(0)} mdr kr</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">Per person</p>
                <p className="text-xl font-bold">{perPerson.toLocaleString('sv-SE')} kr</p>
              </div>
            </div>
          </div>
          
          {/* Under whose government */}
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Under denna regering:</p>
            <p className="font-medium">{government.leaderName} ({government.leaderParty})</p>
            <p className="text-sm text-muted-foreground">
              {government.startDate.split('-')[0]}–{government.endDate?.split('-')[0] || 'pågående'}
            </p>
          </div>
          
          {/* Limitations */}
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-700 mb-1">Viktigt att veta</p>
                  <p className="text-muted-foreground">
                    Siffrorna är förenklade. I verkligheten är budgetposter komplexa 
                    och överlappar ofta. Ändringar beror på många faktorer, inte bara 
                    på vem som styr.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main component
export const GovernmentBudgetExplorer: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('SE');
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailContext, setDetailContext] = useState<'gov1' | 'gov2'>('gov1');
  
  // Get governments for selected country
  const countryGovernments = useMemo(() => 
    GOVERNMENT_REGISTRY[selectedCountry] || [], 
    [selectedCountry]
  );
  
  // Get country metadata
  const countryMeta = useMemo(() => 
    COUNTRY_META[selectedCountry] || { 
      code: selectedCountry, 
      name: selectedCountry, 
      nameLocal: selectedCountry, 
      leaderTitle: 'Leader', 
      population: 10, 
      currency: 'USD', 
      currencySymbol: '$' 
    }, 
    [selectedCountry]
  );
  
  const [selectedGov1, setSelectedGov1] = useState<GovernmentPeriod | null>(null);
  const [selectedGov2, setSelectedGov2] = useState<GovernmentPeriod | null>(null);
  
  // Update selections when country changes
  React.useEffect(() => {
    if (countryGovernments.length > 0) {
      setSelectedGov1(countryGovernments[0]);
      setSelectedGov2(countryGovernments[Math.min(2, countryGovernments.length - 1)]);
    } else {
      setSelectedGov1(null);
      setSelectedGov2(null);
    }
  }, [selectedCountry, countryGovernments]);
  
  const budget1 = useMemo(() => 
    selectedGov1 ? generateMockBudget(selectedGov1, parseInt(selectedGov1.startDate.split('-')[0])) : null, 
    [selectedGov1]
  );
  
  const budget2 = useMemo(() => 
    selectedGov2 ? generateMockBudget(selectedGov2, parseInt(selectedGov2.startDate.split('-')[0])) : null, 
    [selectedGov2]
  );
  
  const handleCategoryClick = (category: BudgetCategory, context: 'gov1' | 'gov2') => {
    setSelectedCategory(category);
    setDetailContext(context);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-8">
      <CategoryDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        category={selectedCategory}
        budget={detailContext === 'gov1' ? budget1 : budget2}
        government={detailContext === 'gov1' ? selectedGov1 : selectedGov2}
      />
      
      {/* Country Selector */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
        <Globe className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground">Välj land att analysera</label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="mt-1 w-full max-w-xs">
              <SelectValue placeholder="Välj land..." />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_COUNTRIES.map(code => {
                const meta = COUNTRY_META[code];
                return (
                  <SelectItem key={code} value={code}>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">[{code}]</span>
                      <span>{meta?.nameLocal || code}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">{countryMeta.nameLocal}</p>
          <p className="text-muted-foreground">{countryMeta.population.toFixed(1)}M inv · {countryMeta.currency}</p>
        </div>
      </div>
      
      {/* Header with explanation */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">🏛️ Vad gör regeringen med pengarna?</h1>
          <p className="text-muted-foreground">
            Varje år bestämmer regeringen hur {countryMeta.nameLocal} ska använda sina pengar. 
            Här kan du jämföra vad olika regeringar har satsat på. 
            <strong className="text-foreground"> Klicka på allt för att lära dig mer!</strong>
          </p>
        </CardContent>
      </Card>
      
      {countryGovernments.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Ingen regeringsdata tillgänglig för {countryMeta.nameLocal} ännu.</p>
            <p className="text-sm text-muted-foreground mt-2">Data läggs till löpande för fler länder.</p>
          </CardContent>
        </Card>
      ) : selectedGov1 && selectedGov2 && budget1 && budget2 ? (
      <>
      {/* Government selectors */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Välj första regeringen</h2>
          <div className="space-y-2">
            {countryGovernments.slice(0, 5).map(gov => (
              <GovernmentCard
                key={gov.id}
                government={gov}
                isSelected={selectedGov1.id === gov.id}
                onClick={() => setSelectedGov1(gov)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Välj andra regeringen att jämföra</h2>
          <div className="space-y-2">
            {countryGovernments.slice(0, 5).map(gov => (
              <GovernmentCard
                key={gov.id}
                government={gov}
                isSelected={selectedGov2.id === gov.id}
                onClick={() => setSelectedGov2(gov)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Total budget comparison */}
      <div className="grid grid-cols-2 gap-6">
        <MoneyExplainer 
          amount={budget1.totalBudget} 
          label={`Total budget (${selectedGov1.leaderName})`}
          population={countryMeta.population}
          currencySymbol={countryMeta.currencySymbol}
        />
        <MoneyExplainer 
          amount={budget2.totalBudget} 
          label={`Total budget (${selectedGov2.leaderName})`}
          population={countryMeta.population}
          currencySymbol={countryMeta.currencySymbol}
        />
      </div>
      
      {/* Visual budget comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hur pengarna fördelas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Klicka på en kategori för att se vad den betyder
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Government 1 */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className={cn(
                  'w-3 h-3 rounded-full',
                  selectedGov1.bloc === 'left' ? 'bg-red-500' : 'bg-blue-500'
                )} />
                {selectedGov1.leaderName}
              </h3>
              <div className="space-y-4">
                {BUDGET_CATEGORIES.map(cat => (
                  <PercentBar
                    key={cat.id}
                    percent={budget1.categories[cat.id]}
                    color={cat.color}
                    label={`${cat.icon} ${cat.name}`}
                    onClick={() => handleCategoryClick(cat, 'gov1')}
                  />
                ))}
              </div>
            </div>
            
            {/* Government 2 */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className={cn(
                  'w-3 h-3 rounded-full',
                  selectedGov2.bloc === 'left' ? 'bg-red-500' : 'bg-blue-500'
                )} />
                {selectedGov2.leaderName}
              </h3>
              <div className="space-y-4">
              {BUDGET_CATEGORIES.map(cat => {
                  const diff = budget1.categories[cat.id] - budget2.categories[cat.id];
                  return (
                    <div key={cat.id}>
                      <button
                        onClick={() => handleCategoryClick(cat, 'gov2')}
                        className="w-full group text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{cat.icon} {cat.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-medium">{budget2.categories[cat.id]}%</span>
                            {Math.abs(diff) >= 1 && (
                              <span className={cn(
                                'text-xs font-mono px-1.5 py-0.5 rounded',
                                diff > 0 ? 'text-red-600 bg-red-100' : 'text-emerald-600 bg-emerald-100'
                              )}>
                                {diff > 0 ? '−' : '+'}{Math.abs(diff)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(cat.color, 'h-full rounded-full transition-all group-hover:opacity-80')}
                            style={{ width: `${budget2.categories[cat.id]}%` }}
                          />
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Key differences summary */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">📊 Huvudsakliga skillnader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {BUDGET_CATEGORIES
              .map(cat => ({
                ...cat,
                diff: budget1.categories[cat.id] - budget2.categories[cat.id]
              }))
              .filter(cat => Math.abs(cat.diff) >= 2)
              .slice(0, 3)
              .map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDetailContext(cat.diff > 0 ? 'gov1' : 'gov2');
                    setDetailOpen(true);
                  }}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.diff > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600 font-mono">
                          {selectedGov1.leaderName} satsar {cat.diff}% mer
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 font-mono">
                          {selectedGov2.leaderName} satsar {Math.abs(cat.diff)}% mer
                        </span>
                      </>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Important disclaimer */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-700 mb-2">⚠️ Viktigt att komma ihåg</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Budgetar är <strong>komplexa</strong> – detta är en förenkling för att göra det lättare att förstå</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Förändringar beror på <strong>många faktorer</strong>, inte bara vem som styr</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Dessa siffror visar <strong>ungefärliga fördelningar</strong>, inte exakta belopp</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Korrelation (att saker händer samtidigt) betyder <strong>inte kausalitet</strong> (att det ena orsakar det andra)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      ) : null}
    </div>
  );
};

export default GovernmentBudgetExplorer;
