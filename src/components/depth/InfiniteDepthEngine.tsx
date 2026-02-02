import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Plus,
  X,
  Filter,
  Calendar,
  BarChart3,
  MapPin,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Users,
  Repeat,
} from 'lucide-react';

// =====================================================
// DEL XIX — VARFÖR DETTA BLIR OÄNDLIGT
// =====================================================
// Systemet tar aldrig slut, för varje vy har:
// - fler filter
// - fler jämförelser
// - fler tidsfönster
// - fler kombinationer
// - fler "varför"

interface FilterConfig {
  id: string;
  type: 'region' | 'time' | 'age' | 'gender' | 'kpi' | 'cluster';
  label: string;
  value: string | number[];
}

// ComparisonConfig kept for future feature expansion
// interface ComparisonConfig { ... }

interface WhyQuestion {
  id: string;
  question: string;
  answer: string;
  depth: number;
  childQuestions: WhyQuestion[];
}

const FILTER_TYPES = [
  { id: 'region', label: 'Region', icon: <MapPin className="h-3 w-3" /> },
  { id: 'time', label: 'Tidsperiod', icon: <Calendar className="h-3 w-3" /> },
  { id: 'age', label: 'Ålder', icon: <Users className="h-3 w-3" /> },
  { id: 'kpi', label: 'Indikator', icon: <BarChart3 className="h-3 w-3" /> },
  { id: 'cluster', label: 'Kluster', icon: <Layers className="h-3 w-3" /> },
] as const;

const REGION_OPTIONS = [
  { value: 'se', label: 'Hela Sverige' },
  { value: '01', label: 'Stockholms län' },
  { value: '03', label: 'Uppsala län' },
  { value: '12', label: 'Skåne län' },
  { value: '14', label: 'Västra Götalands län' },
  { value: '17', label: 'Värmlands län' },
];

const KPI_OPTIONS = [
  { value: 'employment_rate', label: 'Sysselsättningsgrad' },
  { value: 'life_expectancy', label: 'Medellivslängd' },
  { value: 'productivity', label: 'Produktivitet' },
  { value: 'violent_crime', label: 'Våldsbrott' },
  { value: 'education', label: 'Gymnasieexamen' },
];

const CLUSTER_OPTIONS = [
  { value: 'cluster_1', label: 'Hög vårdkonsumtion + låg arbetsförmåga' },
  { value: 'cluster_2', label: 'Ung befolkning + stigande sysselsättning' },
  { value: 'cluster_3', label: 'Snabb försämring senaste 24 mån' },
  { value: 'cluster_4', label: 'Stabilt hög livskvalitet' },
];

// Rekursiva "varför"-frågor
const DEMO_WHY_TREE: WhyQuestion = {
  id: 'root',
  question: 'Varför sjunker sysselsättningsgraden i Malmö?',
  answer: 'Sysselsättningsgraden har minskat 1.2% senaste 12 mån. Tre faktorer identifieras.',
  depth: 0,
  childQuestions: [
    {
      id: 'why_1',
      question: 'Varför ökar långtidsarbetslösheten?',
      answer: 'Andelen som varit arbetslösa >12 mån har ökat från 28% till 34%. Koncentrerat till vissa stadsdelar.',
      depth: 1,
      childQuestions: [
        {
          id: 'why_1_1',
          question: 'Varför är det koncentrerat geografiskt?',
          answer: 'Stadsdelar med hög andel utrikes födda och låg utbildningsnivå visar starkast samband.',
          depth: 2,
          childQuestions: [],
        },
        {
          id: 'why_1_2',
          question: 'Varför fungerar inte arbetsmarknadsåtgärderna?',
          answer: 'Deltagandegrad hög men övergång till jobb låg. Matchningsproblem identifierat.',
          depth: 2,
          childQuestions: [],
        },
      ],
    },
    {
      id: 'why_2',
      question: 'Varför minskar deltidsarbete?',
      answer: 'Deltidsanställda har övergått till heltid eller lämnat arbetskraften. Nettoeffekt negativ.',
      depth: 1,
      childQuestions: [],
    },
    {
      id: 'why_3',
      question: 'Varför ökar sjukskrivningarna?',
      answer: 'Psykisk ohälsa står för 45% av ökningen. Korrelation med bostadsområde stark.',
      depth: 1,
      childQuestions: [
        {
          id: 'why_3_1',
          question: 'Varför ökar psykisk ohälsa?',
          answer: 'Multipla faktorer: ekonomisk stress, arbetsmiljö, sociala faktorer. Data otillräcklig för kausalitet.',
          depth: 2,
          childQuestions: [],
        },
      ],
    },
  ],
};

// =====================================================
// FILTER COMPONENT
// =====================================================

interface FilterChipProps {
  filter: FilterConfig;
  onRemove: () => void;
}

function FilterChip({ filter, onRemove }: FilterChipProps) {
  const filterType = FILTER_TYPES.find(t => t.id === filter.type);
  
  return (
    <Badge variant="secondary" className="gap-1.5 pl-2 pr-1 py-1">
      {filterType?.icon}
      <span className="text-xs">{filter.label}: {filter.value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 hover:bg-destructive/20 rounded-full"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}

// =====================================================
// WHY TREE COMPONENT
// =====================================================

interface WhyTreeNodeProps {
  question: WhyQuestion;
  isExpanded: boolean;
  onToggle: () => void;
  expandedNodes: Set<string>;
  onNodeToggle: (id: string) => void;
}

function WhyTreeNode({ question, isExpanded, onToggle, expandedNodes, onNodeToggle }: WhyTreeNodeProps) {
  const hasChildren = question.childQuestions.length > 0;
  
  return (
    <div className={cn("space-y-2", question.depth > 0 && "ml-4 border-l pl-3")}>
      <button
        onClick={onToggle}
        className={cn(
          "w-full text-left p-3 rounded-lg border transition-all",
          "hover:border-primary/50 hover:bg-muted/50",
          isExpanded && "border-primary bg-primary/5"
        )}
      >
        <div className="flex items-start gap-2">
          {hasChildren && (
            <div className="pt-0.5">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              {question.question}
            </p>
            {isExpanded && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {question.answer}
              </p>
            )}
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            Djup {question.depth}
          </Badge>
        </div>
      </button>
      
      {isExpanded && hasChildren && (
        <div className="space-y-2">
          {question.childQuestions.map((child) => (
            <WhyTreeNode
              key={child.id}
              question={child}
              isExpanded={expandedNodes.has(child.id)}
              onToggle={() => onNodeToggle(child.id)}
              expandedNodes={expandedNodes}
              onNodeToggle={onNodeToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// MAIN INFINITE DEPTH ENGINE
// =====================================================

interface InfiniteDepthEngineProps {
  className?: string;
}

export function InfiniteDepthEngine({ className }: InfiniteDepthEngineProps) {
  const [filters, setFilters] = useState<FilterConfig[]>([
    { id: '1', type: 'region', label: 'Region', value: 'Malmö kommun' },
    { id: '2', type: 'kpi', label: 'KPI', value: 'Sysselsättningsgrad' },
  ]);
  const [newFilterType, setNewFilterType] = useState<string>('');
  const [newFilterValue, setNewFilterValue] = useState<string>('');
  const [timeRange, setTimeRange] = useState([12]); // månader
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [isLoading, setIsLoading] = useState(false);

  const addFilter = useCallback(() => {
    if (!newFilterType || !newFilterValue) return;
    
    const filterType = FILTER_TYPES.find(t => t.id === newFilterType);
    const newFilter: FilterConfig = {
      id: Date.now().toString(),
      type: newFilterType as FilterConfig['type'],
      label: filterType?.label || newFilterType,
      value: newFilterValue,
    };
    
    setFilters(prev => [...prev, newFilter]);
    setNewFilterType('');
    setNewFilterValue('');
  }, [newFilterType, newFilterValue]);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Beräkna kombinationer
  const combinationCount = useMemo(() => {
    const regionCount = REGION_OPTIONS.length;
    const kpiCount = KPI_OPTIONS.length;
    const timeWindows = 36; // månader
    const ageGroups = 10;
    const clusterTypes = CLUSTER_OPTIONS.length;
    
    return regionCount * kpiCount * timeWindows * ageGroups * clusterTypes;
  }, []);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Oändligt djup
            </CardTitle>
            <CardDescription className="text-xs">
              Rekursiv utforskning – varje vy har fler filter, jämförelser och "varför"
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1 text-xs">
            {combinationCount.toLocaleString('sv-SE')}+ kombinationer
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Aktiva filter
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
              Uppdatera
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <FilterChip
                key={filter.id}
                filter={filter}
                onRemove={() => removeFilter(filter.id)}
              />
            ))}
          </div>
        </div>

        {/* Add Filter */}
        <div className="flex gap-2">
          <Select value={newFilterType} onValueChange={setNewFilterType}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Filtertyp..." />
            </SelectTrigger>
            <SelectContent>
              {FILTER_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id} className="text-xs">
                  <span className="flex items-center gap-2">
                    {type.icon}
                    {type.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {newFilterType === 'region' && (
            <Select value={newFilterValue} onValueChange={setNewFilterValue}>
              <SelectTrigger className="h-8 flex-1 text-xs">
                <SelectValue placeholder="Välj region..." />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.label} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {newFilterType === 'kpi' && (
            <Select value={newFilterValue} onValueChange={setNewFilterValue}>
              <SelectTrigger className="h-8 flex-1 text-xs">
                <SelectValue placeholder="Välj indikator..." />
              </SelectTrigger>
              <SelectContent>
                {KPI_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.label} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {newFilterType === 'cluster' && (
            <Select value={newFilterValue} onValueChange={setNewFilterValue}>
              <SelectTrigger className="h-8 flex-1 text-xs">
                <SelectValue placeholder="Välj kluster..." />
              </SelectTrigger>
              <SelectContent>
                {CLUSTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.label} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(newFilterType === 'time' || newFilterType === 'age') && (
            <Input
              value={newFilterValue}
              onChange={(e) => setNewFilterValue(e.target.value)}
              placeholder={newFilterType === 'time' ? 'Ex: 2020-2024' : 'Ex: 25-34'}
              className="h-8 flex-1 text-xs"
            />
          )}

          <Button
            size="icon"
            onClick={addFilter}
            disabled={!newFilterType || !newFilterValue}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Tidsfönster
            </label>
            <span className="text-xs font-mono">{timeRange[0]} månader</span>
          </div>
          <Slider
            value={timeRange}
            onValueChange={setTimeRange}
            min={1}
            max={120}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1 mån</span>
            <span>5 år</span>
            <span>10 år</span>
          </div>
        </div>

        <Separator />

        {/* Why Tree */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Rekursiva "varför"-frågor
            </p>
            <Badge variant="secondary" className="text-[10px]">
              Oändlig kedja
            </Badge>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <WhyTreeNode
                question={DEMO_WHY_TREE}
                isExpanded={expandedNodes.has('root')}
                onToggle={() => toggleNode('root')}
                expandedNodes={expandedNodes}
                onNodeToggle={toggleNode}
              />
            )}
          </ScrollArea>
        </div>

        <Separator />

        {/* Infinity Explainer */}
        <Alert className="bg-primary/5 border-primary/20">
          <Repeat className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            <strong>Varför oändligt?</strong> Varje vy har fler filter, fler jämförelser, 
            fler tidsfönster, fler kombinationer och fler "varför". Men: inga hemligheter, 
            inga svarta lådor, inga individer.
          </AlertDescription>
        </Alert>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-primary">{REGION_OPTIONS.length * 290}</p>
            <p className="text-[10px] text-muted-foreground">Geografiska enheter</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-primary">120</p>
            <p className="text-[10px] text-muted-foreground">Månaders historik</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-primary">∞</p>
            <p className="text-[10px] text-muted-foreground">"Varför"-frågor</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
