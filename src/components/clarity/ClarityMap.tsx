/**
 * Clarity Map Component
 * 
 * Map is not graphics – it's an index.
 * Every map = a question
 * Every color = an exactly defined measure
 * Every pixel = aggregated data with source
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, Database, FileText, Info, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MAP_CLICK_HIERARCHY } from '@/config/extremeClaritySystem';

interface MapRegion {
  id: string;
  name: string;
  value: number;
  color: string;
  sources: string[];
  period: string;
  limitations: string[];
}

interface ClarityMapProps {
  question: string;           // "How is life expectancy developing?"
  measure: string;            // What the colors represent
  regions: MapRegion[];
  legend: LegendItem[];
  sources: string[];
  period: string;
  className?: string;
}

interface LegendItem {
  color: string;
  label: string;
  range: [number, number];
  definition: string;
}

interface ClickDepthState {
  level: 1 | 2 | 3 | 4;
  region: MapRegion | null;
}

/**
 * Main Clarity Map component with 4-level click depth
 */
export function ClarityMap({
  question,
  measure,
  regions,
  legend,
  sources,
  period,
  className,
}: ClarityMapProps) {
  const [clickDepth, setClickDepth] = useState<ClickDepthState | null>(null);
  
  function handleRegionClick(region: MapRegion) {
    setClickDepth({ level: 1, region });
  }
  
  function goDeeper() {
    if (clickDepth && clickDepth.level < 4) {
      setClickDepth({ ...clickDepth, level: (clickDepth.level + 1) as 1 | 2 | 3 | 4 });
    }
  }
  
  function goBack() {
    if (clickDepth && clickDepth.level > 1) {
      setClickDepth({ ...clickDepth, level: (clickDepth.level - 1) as 1 | 2 | 3 | 4 });
    }
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Question header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{question}</h3>
        <p className="text-sm text-muted-foreground">{period}</p>
      </div>
      
      {/* Map placeholder (would be actual map component) */}
      <div className="relative border rounded-lg overflow-hidden bg-muted/20">
        <div className="aspect-[16/9] flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Interactive map</p>
            <p className="text-xs text-muted-foreground">Click any region for depth</p>
          </div>
        </div>
        
        {/* Demo clickable regions */}
        <div className="absolute inset-0 flex flex-wrap gap-2 p-4">
          {regions.slice(0, 6).map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionClick(region)}
              className={cn(
                'px-3 py-2 rounded text-sm font-medium transition-all',
                'hover:scale-105 hover:shadow-md'
              )}
              style={{ backgroundColor: region.color, color: 'white' }}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Legend (required) */}
      <MapLegend items={legend} measure={measure} />
      
      {/* Sources */}
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">Källor: </span>
        {sources.join(', ')}
      </div>
      
      {/* Click depth dialog */}
      <Dialog open={!!clickDepth} onOpenChange={(open) => !open && setClickDepth(null)}>
        <DialogContent className="max-w-lg">
          {clickDepth?.region && (
            <MapDepthView
              region={clickDepth.region}
              level={clickDepth.level}
              measure={measure}
              onGoDeeper={goDeeper}
              onGoBack={goBack}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Map legend with exact definitions
 */
function MapLegend({ items, measure }: { items: LegendItem[]; measure: string }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <Info className="h-4 w-4" />
        Färgförklaring: {measure}
      </button>
      
      {expanded && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-xs">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> ({item.range[0]}–{item.range[1]})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Depth view for clicked region - 4 levels
 */
interface MapDepthViewProps {
  region: MapRegion;
  level: 1 | 2 | 3 | 4;
  measure: string;
  onGoDeeper: () => void;
  onGoBack: () => void;
}

function MapDepthView({
  region,
  level,
  measure,
  onGoDeeper,
  onGoBack,
}: MapDepthViewProps) {
  const levelConfig = MAP_CLICK_HIERARCHY[`click${level}` as keyof typeof MAP_CLICK_HIERARCHY];
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: region.color }}
          />
          {region.name}
        </DialogTitle>
      </DialogHeader>
      
      {/* Level indicator */}
      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs',
              l === level
                ? 'bg-primary text-primary-foreground'
                : l < level
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
            )}
          >
            {l}
          </span>
        ))}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{levelConfig.label}</span>
      </div>
      
      {/* Content based on level */}
      <div className="space-y-4 py-4">
        {level === 1 && (
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {region.value.toFixed(1)} {measure}
            </p>
            <p className="text-sm text-muted-foreground">
              This color represents {measure}, aggregated from {region.sources.join(', ')}, for {region.period}.
            </p>
          </div>
        )}
        
        {level === 2 && (
          <div className="space-y-2">
            <h4 className="font-medium">Hur räknas detta?</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Indikatorer:</strong> {measure}</li>
              <li>• <strong>Datakällor:</strong> {region.sources.join(', ')}</li>
              <li>• <strong>Aggregering:</strong> Nationell nivå, årsmedel</li>
            </ul>
          </div>
        )}
        
        {level === 3 && (
          <div className="space-y-2">
            <h4 className="font-medium">Begränsningar</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {region.limitations.length > 0 ? (
                region.limitations.map((lim, i) => (
                  <li key={i}>• {lim}</li>
                ))
              ) : (
                <>
                  <li>• Kartan visar inte regional variation</li>
                  <li>• Tidsfördröjning i data kan finnas</li>
                  <li>• Definitionen kan skilja mellan länder</li>
                </>
              )}
            </ul>
          </div>
        )}
        
        {level === 4 && (
          <div className="space-y-4">
            <h4 className="font-medium">Rådata</h4>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Database className="h-4 w-4 mr-2" />
                API-åtkomst
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Ladda ner CSV
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Senast uppdaterad: {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoBack}
          disabled={level === 1}
        >
          ← Tillbaka
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoDeeper}
          disabled={level === 4}
        >
          Gå djupare →
        </Button>
      </div>
    </>
  );
}

/**
 * Demo component
 */
export function ClarityMapDemo() {
  const demoRegions: MapRegion[] = [
    { id: 'SE', name: 'Sverige', value: 82.4, color: '#22c55e', sources: ['SCB'], period: '2023', limitations: [] },
    { id: 'NO', name: 'Norge', value: 83.1, color: '#16a34a', sources: ['SSB'], period: '2023', limitations: [] },
    { id: 'DK', name: 'Danmark', value: 81.3, color: '#4ade80', sources: ['DST'], period: '2023', limitations: [] },
    { id: 'FI', name: 'Finland', value: 81.8, color: '#22c55e', sources: ['Tilastokeskus'], period: '2023', limitations: [] },
    { id: 'DE', name: 'Tyskland', value: 80.9, color: '#86efac', sources: ['Destatis'], period: '2023', limitations: [] },
    { id: 'PL', name: 'Polen', value: 76.5, color: '#fbbf24', sources: ['GUS'], period: '2023', limitations: [] },
  ];
  
  const legend: LegendItem[] = [
    { color: '#16a34a', label: 'Mycket hög', range: [83, 90], definition: 'Förväntad livslängd 83+ år' },
    { color: '#22c55e', label: 'Hög', range: [81, 83], definition: 'Förväntad livslängd 81-83 år' },
    { color: '#86efac', label: 'Medel', range: [79, 81], definition: 'Förväntad livslängd 79-81 år' },
    { color: '#fbbf24', label: 'Under medel', range: [75, 79], definition: 'Förväntad livslängd 75-79 år' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <ClarityMap
        question="Hur utvecklas livslängden i Europa?"
        measure="Förväntad livslängd (år)"
        regions={demoRegions}
        legend={legend}
        sources={['Eurostat', 'WHO']}
        period="2023"
      />
    </div>
  );
}
