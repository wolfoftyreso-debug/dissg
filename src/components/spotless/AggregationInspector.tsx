/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AGGREGATION INSPECTOR - 1-Click to Bottom (Spotless Protocol §5)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * From any summary, you must be able to click:
 * 
 * Summary → Aggregation logic → Included datasets → Raw source
 * 
 * And back again.
 * 
 * Nothing may be:
 * - Hidden
 * - Merged without display
 * - "Trust us"
 * 
 * Transparency is not a mode – it's architecture.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  Layers,
  Database,
  FileText,
  ArrowRight,
  ExternalLink,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AggregationStep {
  level: 'summary' | 'aggregation' | 'dataset' | 'raw';
  title: string;
  description: string;
  metadata?: Record<string, string | number>;
}

export interface IncludedDataset {
  id: string;
  name: string;
  source: string;
  sourceUrl: string;
  weight?: number;
  coverage: string;
  dataPoints: number;
}

export interface AggregationLogic {
  method: string;
  formula?: string;
  weights?: Record<string, number>;
  normalization?: string;
  timeAlignment?: string;
  missingDataHandling?: string;
}

export interface AggregationData {
  summaryValue: number | string;
  summaryLabel: string;
  aggregationLogic: AggregationLogic;
  includedDatasets: IncludedDataset[];
  lastCalculated: string;
}

interface AggregationInspectorProps {
  data: AggregationData;
  variant?: 'full' | 'compact';
  defaultExpanded?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function AggregationInspector({ 
  data, 
  variant = 'full',
  defaultExpanded = false,
  className 
}: AggregationInspectorProps) {
  const [currentLevel, setCurrentLevel] = useState<'summary' | 'aggregation' | 'datasets' | 'raw'>('summary');
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Breadcrumb navigation
  const levels = [
    { id: 'summary', label: 'Sammanfattning', icon: FileText },
    { id: 'aggregation', label: 'Aggregeringslogik', icon: Calculator },
    { id: 'datasets', label: 'Ingående datamängder', icon: Database },
    { id: 'raw', label: 'Råkälla', icon: Layers },
  ] as const;

  const currentLevelIndex = levels.findIndex(l => l.id === currentLevel);

  if (variant === 'compact') {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Card className={className}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/30 transition-colors text-left">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Visa aggregeringskedja</span>
                <Badge variant="outline" className="text-xs">
                  {data.includedDatasets.length} datamängder
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-4">
              <AggregationContent 
                data={data} 
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
                selectedDataset={selectedDataset}
                setSelectedDataset={setSelectedDataset}
                levels={levels}
                currentLevelIndex={currentLevelIndex}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Aggregeringsinspektion
          <Badge variant="outline" className="ml-auto text-xs">
            1-klick till botten
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AggregationContent 
          data={data} 
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          selectedDataset={selectedDataset}
          setSelectedDataset={setSelectedDataset}
          levels={levels}
          currentLevelIndex={currentLevelIndex}
        />
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface AggregationContentProps {
  data: AggregationData;
  currentLevel: 'summary' | 'aggregation' | 'datasets' | 'raw';
  setCurrentLevel: (level: 'summary' | 'aggregation' | 'datasets' | 'raw') => void;
  selectedDataset: string | null;
  setSelectedDataset: (id: string | null) => void;
  levels: readonly { id: string; label: string; icon: typeof FileText }[];
  currentLevelIndex: number;
}

function AggregationContent({
  data,
  currentLevel,
  setCurrentLevel,
  selectedDataset,
  setSelectedDataset,
  levels,
  currentLevelIndex,
}: AggregationContentProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 flex-wrap">
        {levels.map((level, i) => {
          const Icon = level.icon;
          const isActive = i === currentLevelIndex;
          const isPast = i < currentLevelIndex;
          
          return (
            <div key={level.id} className="flex items-center">
              <button
                onClick={() => setCurrentLevel(level.id as typeof currentLevel)}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                  isActive && 'bg-primary text-primary-foreground',
                  isPast && 'text-primary hover:bg-primary/10',
                  !isActive && !isPast && 'text-muted-foreground'
                )}
              >
                <Icon className="h-3 w-3" />
                {level.label}
              </button>
              {i < levels.length - 1 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground mx-1" />
              )}
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Level content */}
      {currentLevel === 'summary' && (
        <SummaryLevel 
          data={data} 
          onDrillDown={() => setCurrentLevel('aggregation')} 
        />
      )}

      {currentLevel === 'aggregation' && (
        <AggregationLevel 
          logic={data.aggregationLogic} 
          onDrillDown={() => setCurrentLevel('datasets')}
          onBack={() => setCurrentLevel('summary')}
        />
      )}

      {currentLevel === 'datasets' && (
        <DatasetsLevel 
          datasets={data.includedDatasets}
          selectedDataset={selectedDataset}
          onSelectDataset={(id) => {
            setSelectedDataset(id);
            setCurrentLevel('raw');
          }}
          onBack={() => setCurrentLevel('aggregation')}
        />
      )}

      {currentLevel === 'raw' && selectedDataset && (
        <RawLevel 
          dataset={data.includedDatasets.find(d => d.id === selectedDataset)!}
          onBack={() => {
            setSelectedDataset(null);
            setCurrentLevel('datasets');
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function SummaryLevel({ 
  data, 
  onDrillDown 
}: { 
  data: AggregationData; 
  onDrillDown: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {data.summaryLabel}
        </p>
        <p className="text-3xl font-bold">{data.summaryValue}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Senast beräknad: {data.lastCalculated}
        </p>
      </div>

      <div className="text-center">
        <Button onClick={onDrillDown} className="gap-2">
          Visa hur detta beräknades
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function AggregationLevel({ 
  logic, 
  onDrillDown,
  onBack 
}: { 
  logic: AggregationLogic; 
  onDrillDown: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-xs font-medium text-muted-foreground mb-1">Metod</p>
          <p className="text-sm font-semibold">{logic.method}</p>
        </div>

        {logic.formula && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">Formel</p>
            <code className="text-sm font-mono">{logic.formula}</code>
          </div>
        )}

        {logic.weights && Object.keys(logic.weights).length > 0 && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-2">Vikter</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(logic.weights).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {logic.normalization && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">Normalisering</p>
            <p className="text-sm">{logic.normalization}</p>
          </div>
        )}

        {logic.missingDataHandling && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">Hantering av saknad data</p>
            <p className="text-sm">{logic.missingDataHandling}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} size="sm">
          ← Tillbaka
        </Button>
        <Button onClick={onDrillDown} size="sm" className="gap-2">
          Visa ingående datamängder
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function DatasetsLevel({ 
  datasets, 
  selectedDataset,
  onSelectDataset,
  onBack 
}: { 
  datasets: IncludedDataset[];
  selectedDataset: string | null;
  onSelectDataset: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {datasets.length} datamängder ingår i denna aggregering
      </p>

      <div className="space-y-2">
        {datasets.map(ds => (
          <button
            key={ds.id}
            onClick={() => onSelectDataset(ds.id)}
            className={cn(
              'w-full p-3 rounded-md border text-left transition-colors',
              'hover:bg-muted/50',
              selectedDataset === ds.id && 'border-primary bg-primary/5'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{ds.name}</p>
                <p className="text-xs text-muted-foreground">{ds.source}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{ds.coverage}</Badge>
              <Badge variant="outline" className="text-xs">{ds.dataPoints} punkter</Badge>
              {ds.weight && (
                <Badge variant="outline" className="text-xs">Vikt: {ds.weight}</Badge>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button variant="outline" onClick={onBack} size="sm">
        ← Tillbaka
      </Button>
    </div>
  );
}

function RawLevel({ 
  dataset, 
  onBack 
}: { 
  dataset: IncludedDataset;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg space-y-3">
        <h4 className="font-semibold">{dataset.name}</h4>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Källa</p>
            <p className="font-medium">{dataset.source}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Täckning</p>
            <p className="font-medium">{dataset.coverage}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Datapunkter</p>
            <p className="font-medium">{dataset.dataPoints}</p>
          </div>
          {dataset.weight && (
            <div>
              <p className="text-xs text-muted-foreground">Vikt i aggregering</p>
              <p className="font-medium">{dataset.weight}</p>
            </div>
          )}
        </div>
      </div>

      <Button asChild className="w-full gap-2">
        <a href={dataset.sourceUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
          Öppna originalkälla
        </a>
      </Button>

      <Button variant="outline" onClick={onBack} size="sm" className="w-full">
        ← Tillbaka till datamängder
      </Button>
    </div>
  );
}

export default AggregationInspector;
