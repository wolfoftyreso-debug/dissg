/**
 * BLOCK 2: CORE INDEX ENGINE - UNIFIED INDEX VIEWER
 * 
 * Standard component for displaying any composite index
 * with full transparency: components, weights, sources, uncertainties
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Info,
  XCircle,
  ExternalLink,
  Calculator,
  Scale,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type CompositeIndex,
  type IndexComponent,
  INDEX_DEFINITIONS,
  getIndexComponents
} from '@/config/coreIndexEngineConfig';
import { DataQualityBadge, type DataQualityMetrics } from '@/components/quality';

interface IndexViewerProps {
  index: CompositeIndex;
  dataQuality?: DataQualityMetrics;
  showMethodology?: boolean;
  compact?: boolean;
  className?: string;
}

// Trend indicator
const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable'; change?: number }> = ({ 
  trend, 
  change 
}) => {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color = trend === 'up' ? 'text-trend-up' : trend === 'down' ? 'text-trend-down' : 'text-trend-stable';
  
  return (
    <div className={cn("flex items-center gap-1", color)}>
      <Icon className="h-4 w-4" />
      {change !== undefined && (
        <span className="text-xs font-data">
          {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

// Component row with full transparency
const ComponentRow: React.FC<{
  component: IndexComponent;
  maxWeight: number;
  expanded: boolean;
  onToggle: () => void;
}> = ({ component, maxWeight, expanded, onToggle }) => {
  const weightPercent = (component.weight / maxWeight) * 100;

  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="w-full text-left hover:bg-muted/50 p-2 rounded-sm transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            <span className="text-sm font-medium">{component.nameSv}</span>
            <Badge variant="outline" className="text-xs">
              {(component.weight * 100).toFixed(0)}% vikt
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-data text-sm">{component.value.toFixed(1)}</span>
            <TrendIndicator trend={component.trend} />
          </div>
        </div>
        
        {/* Weight bar */}
        <div className="mt-2 flex items-center gap-2">
          <Progress value={component.value} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground font-data">
            ±{component.uncertainty}%
          </span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <Card className="ml-4 bg-muted/30 border-l-2 border-primary/30">
          <CardContent className="p-3 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Råvärde:</span>
                <span className="ml-1 font-data">{component.rawValue.toFixed(2)} {component.unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Källa:</span>
                <span className="ml-1">{component.source}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Uppdaterad:</span>
                <span className="ml-1">{component.lastUpdated.toLocaleDateString('sv-SE')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Osäkerhet:</span>
                <span className="ml-1 font-data">±{component.uncertainty}%</span>
              </div>
            </div>
            {component.methodology && (
              <p className="text-muted-foreground pt-1 border-t">
                <Info className="h-3 w-3 inline mr-1" />
                {component.methodology}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Aggregation method explanation
const MethodologySection: React.FC<{ index: CompositeIndex }> = ({ index }) => {
  const methodLabels = {
    weighted_average: 'Vägt genomsnitt',
    geometric_mean: 'Geometriskt medelvärde',
    min_of_components: 'Minimum av komponenter'
  };

  const methodDescriptions = {
    weighted_average: 'Varje komponent multipliceras med sin vikt och summeras.',
    geometric_mean: 'Produkten av alla värden upphöjt till 1/n. Straffar låga värden hårdare.',
    min_of_components: 'Det lägsta komponentvärdet bestämmer index. Kedjan är så stark som svagaste länk.'
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Hur detta index beräknas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{methodLabels[index.aggregationMethod]}</span>
        </div>
        <p className="text-muted-foreground">
          {methodDescriptions[index.aggregationMethod]}
        </p>
        <p className="text-muted-foreground">
          {index.methodology.summary}
        </p>
        {index.methodology.fullDocumentUrl && (
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href={index.methodology.fullDocumentUrl} target="_blank" rel="noopener noreferrer">
              Fullständig metoddokumentation
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Limitations section
const LimitationsSection: React.FC<{ index: CompositeIndex }> = ({ index }) => {
  return (
    <Card className="bg-status-warning/5 border-status-warning/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-status-warning" />
          Begränsningar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-xs space-y-1">
          {index.limitations.map((limit, i) => (
            <li key={i} className="flex items-start gap-1">
              <span className="text-muted-foreground">•</span>
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// What this is NOT section
const DisclaimerSection: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <Card className="bg-destructive/5 border-destructive/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-destructive" />
          <CardTitle className="text-sm">Detta är INTE:</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <Badge key={i} variant="outline" className="text-xs border-destructive/30">
              ❌ {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Index Viewer component
export const UnifiedIndexViewer: React.FC<IndexViewerProps> = ({
  index,
  dataQuality,
  showMethodology = true,
  compact = false,
  className
}) => {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [showAllSections, setShowAllSections] = useState(!compact);

  const maxWeight = Math.max(...index.components.map(c => c.weight));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header card with main value */}
      <Card className="data-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">{index.code}</Badge>
              <CardTitle className="text-xl">{index.nameSv}</CardTitle>
              <CardDescription>{index.descriptionSv}</CardDescription>
            </div>
            {dataQuality && (
              <DataQualityBadge 
                level={index.dataQuality} 
                metrics={dataQuality}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-data">
                  {index.value.toFixed(1)}
                </span>
                <span className="text-muted-foreground">/ 100</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <TrendIndicator trend={index.trend} change={index.changePercent} />
                <span className="text-xs text-muted-foreground">
                  vs {index.comparedToPeriod}
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>Version {index.version}</div>
              <div>Beräknat {index.lastCalculated.toLocaleDateString('sv-SE')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            Komponenter ({index.components.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Klicka för att se detaljer, källa och osäkerhet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {index.components.map((component) => (
            <ComponentRow
              key={component.id}
              component={component}
              maxWeight={maxWeight}
              expanded={expandedComponent === component.id}
              onToggle={() => setExpandedComponent(
                expandedComponent === component.id ? null : component.id
              )}
            />
          ))}
        </CardContent>
      </Card>

      {/* Toggle for additional sections in compact mode */}
      {compact && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllSections(!showAllSections)}
          className="w-full text-xs"
        >
          {showAllSections ? 'Dölj detaljer' : 'Visa metod, begränsningar & disclaimers'}
          {showAllSections ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
        </Button>
      )}

      {/* Methodology, Limitations, Disclaimers */}
      {showAllSections && (
        <>
          {showMethodology && <MethodologySection index={index} />}
          <LimitationsSection index={index} />
          <DisclaimerSection items={index.whatThisIsNot} />
        </>
      )}
    </div>
  );
};

export default UnifiedIndexViewer;
