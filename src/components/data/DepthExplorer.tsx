/**
 * DEPTH EXPLORER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Full-screen modal for exploring data at infinite depth.
 * Each level reveals more context, methodology, and raw data.
 * 
 * Follows the explanation pyramid:
 * L1: Observation → L2: Mechanism → L3: Method → L4: Limitations → L5: Raw Data
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  Zap,
  Microscope,
  AlertTriangle,
  Database,
  Network,
  ExternalLink,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  Eye,
  QrCode,
} from 'lucide-react';
import { 
  useInfiniteDepth, 
  DataPoint,
  DepthLayer, 
  DEPTH_LEVEL_CONFIG,
  DepthLevelId,
} from './InfiniteDepthProvider';
import { cn } from '@/lib/utils';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

// =============================================================================
// ICON MAPPING
// =============================================================================

const levelIcons = {
  0: Eye,
  1: BarChart3,
  2: Zap,
  3: Microscope,
  4: AlertTriangle,
  5: Database,
  6: Network,
};

// =============================================================================
// DEPTH EXPLORER COMPONENT
// =============================================================================

export const DepthExplorer: React.FC = () => {
  const { 
    activeDataPoint, 
    currentLevel, 
    isOpen, 
    closeDepth, 
    goToLevel,
    goBack,
    navigationStack 
  } = useInfiniteDepth();
  
  if (!activeDataPoint || !isOpen) return null;
  
  const currentLayerData = activeDataPoint.depth.find(d => d.level === currentLevel);
  const maxLevel = Math.max(...activeDataPoint.depth.map(d => d.level));
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDepth()}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0">
        <div className="flex h-full">
          {/* Level Navigation Sidebar */}
          <div className="w-56 border-r bg-muted/30 p-4 flex flex-col">
            {/* Back button */}
            {navigationStack.length > 1 && (
              <Button variant="ghost" size="sm" onClick={goBack} className="mb-4 justify-start">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Tillbaka
              </Button>
            )}
            
            {/* Level buttons */}
            <div className="space-y-1 flex-1">
              {Object.entries(DEPTH_LEVEL_CONFIG).map(([levelStr, config]) => {
                const level = parseInt(levelStr) as DepthLevelId;
                const Icon = levelIcons[level];
                const hasContent = activeDataPoint.depth.some(d => d.level === level);
                const isActive = currentLevel === level;
                
                if (level === 0) return null; // Skip L0 (current view)
                
                return (
                  <button
                    key={level}
                    onClick={() => hasContent && goToLevel(level)}
                    disabled={!hasContent}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all',
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : hasContent 
                          ? 'hover:bg-muted cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{config.labelSv}</span>
                    </div>
                    <p className={cn(
                      'text-xs mt-1',
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                      {config.descriptionSv}
                    </p>
                  </button>
                );
              })}
            </div>
            
            <Separator className="my-4" />
            
            {/* Actions */}
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <QrCode className="h-3 w-3 mr-2" />
                Verifieringslänk
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Download className="h-3 w-3 mr-2" />
                Exportera
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Share2 className="h-3 w-3 mr-2" />
                Dela
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {DEPTH_LEVEL_CONFIG[currentLevel as DepthLevelId]?.labelSv}
                  </Badge>
                  <DialogTitle className="text-xl">{activeDataPoint.label}</DialogTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={closeDepth}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Current value display */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold">
                  {typeof activeDataPoint.value === 'number' 
                    ? activeDataPoint.value.toLocaleString('sv-SE')
                    : activeDataPoint.value}
                </span>
                {activeDataPoint.unit && (
                  <span className="text-lg text-muted-foreground">{activeDataPoint.unit}</span>
                )}
              </div>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                {activeDataPoint.geoScope && (
                  <>
                    <span>{activeDataPoint.geoScope}</span>
                    <span>•</span>
                  </>
                )}
                {activeDataPoint.timeScope && (
                  <>
                    <span>{activeDataPoint.timeScope.start} – {activeDataPoint.timeScope.end}</span>
                    <span>•</span>
                  </>
                )}
                {activeDataPoint.confidence !== undefined && (
                  <Badge variant={activeDataPoint.confidence > 0.8 ? 'default' : 'secondary'}>
                    Konfidens: {(activeDataPoint.confidence * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            </DialogHeader>
            
            {/* Layer Content */}
            <ScrollArea className="flex-1 p-6">
              {currentLayerData ? (
                <LayerContent layer={currentLayerData} dataPoint={activeDataPoint} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Ingen data tillgänglig för denna nivå.</p>
                </div>
              )}
            </ScrollArea>
            
            {/* Navigation footer */}
            <div className="border-t p-4 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => goToLevel(currentLevel - 1)}
                disabled={currentLevel <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Föregående nivå
              </Button>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map(level => {
                  const hasContent = activeDataPoint.depth.some(d => d.level === level);
                  return (
                    <button
                      key={level}
                      onClick={() => hasContent && goToLevel(level)}
                      disabled={!hasContent}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all',
                        currentLevel === level
                          ? 'bg-primary text-primary-foreground'
                          : hasContent
                            ? 'bg-muted hover:bg-muted/80'
                            : 'bg-muted/30 text-muted-foreground/50 cursor-not-allowed'
                      )}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => goToLevel(currentLevel + 1)}
                disabled={currentLevel >= maxLevel}
              >
                Nästa nivå
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// LAYER CONTENT
// =============================================================================

interface LayerContentProps {
  layer: DepthLayer;
  dataPoint: DataPoint;
}

const LayerContent: React.FC<LayerContentProps> = ({ layer }) => {
  return (
    <div className="space-y-6">
      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{layer.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{layer.content}</p>
        </CardContent>
      </Card>
      
      {/* This shows / This does NOT show */}
      {(layer.shows || layer.doesNotShow) && (
        <div className="grid md:grid-cols-2 gap-4">
          {layer.shows && layer.shows.length > 0 && (
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Detta visar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {layer.shows.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {layer.doesNotShow && layer.doesNotShow.length > 0 && (
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-700 dark:text-red-400">
                  <XCircle className="h-4 w-4" />
                  Detta visar INTE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {layer.doesNotShow.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Data visualization */}
      {layer.data && (
        <LayerDataVisualization layerData={layer.data} />
      )}
      
      {/* Sources */}
      {layer.sources && layer.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Källor
            </CardTitle>
            <CardDescription>Tillförlitlighet och ursprung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {layer.sources.map((source, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{source.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {source.type === 'official' ? 'Officiell' : 
                       source.type === 'academic' ? 'Akademisk' : 
                       source.type === 'institutional' ? 'Institutionell' : 'Beräknad'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Tillförlitlighet:</span>
                    <Progress value={source.reliability} className="h-2 flex-1" />
                    <span className="text-xs">{source.reliability}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Hämtad: {source.accessDate}</span>
                    {source.url && (
                      <a href={source.url} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-1 hover:text-primary">
                        <ExternalLink className="h-3 w-3" />
                        Öppna källa
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Drill-down options */}
      {layer.drillDown && layer.drillDown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Fördjupa vidare</CardTitle>
            <CardDescription>Relaterad data och kopplingar</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {layer.drillDown.map((option, idx) => (
              <button
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 hover:border-primary/50 transition-all text-left"
              >
                <div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// =============================================================================
// DATA VISUALIZATION
// =============================================================================

interface LayerDataVisualizationProps {
  layerData: DepthLayer['data'];
}

const LayerDataVisualization: React.FC<LayerDataVisualizationProps> = ({ layerData }) => {
  if (!layerData) return null;
  
  const { type, data } = layerData;
  
  if (type === 'chart' && Array.isArray(data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tidsserie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data as Array<Record<string, unknown>>}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (type === 'comparison' && Array.isArray(data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Jämförelse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data as Array<Record<string, unknown>>} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (type === 'table' && Array.isArray(data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Datatabell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {Object.keys((data as Array<Record<string, unknown>>)[0] || {}).map(key => (
                    <th key={key} className="text-left p-2 font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data as Array<Record<string, unknown>>).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(row).map((val, vIdx) => (
                      <td key={vIdx} className="p-2">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (type === 'list' && Array.isArray(data)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lista</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(data as string[]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default DepthExplorer;
