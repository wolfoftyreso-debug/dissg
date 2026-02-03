/**
 * TRUTH LAYER - SANNINGSLAGER
 * 
 * Varje datapunkt i systemet går att spåra hela vägen till källan.
 * 
 * Arkitektur:
 * - Datapunkt (vad du ser)
 * - Aggregering (hur den är beräknad)
 * - Källa (varifrån datan kommer)
 * - Metod (hur den samlades in)
 * - Begränsningar (vad den INTE visar)
 * 
 * Allt är klickbart. Inget värde visas utan kontext.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ExternalLink, Copy, CheckCircle2, Clock, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DataSource {
  id: string;
  name: string;
  nameSv: string;
  type: 'official_statistics' | 'research' | 'aggregator' | 'primary' | 'secondary';
  organization: string;
  url?: string;
  apiEndpoint?: string;
  reliabilityScore: number; // 0-100
  lastUpdated: string;
  updateFrequency: string;
  coverage: string;
  methodology?: string;
}

export interface AggregationStep {
  step: number;
  operation: string;
  operationSv: string;
  inputCount: number;
  outputCount: number;
  formula?: string;
  notes?: string;
}

export interface DataProvenance {
  id: string;
  
  // What you see
  displayValue: string | number;
  unit?: string;
  label: string;
  labelSv: string;
  
  // Context
  geoScope: string;
  geoScopeSv: string;
  timePeriod: string;
  timePeriodSv: string;
  
  // Aggregation chain
  aggregationSteps: AggregationStep[];
  rawDatapointCount: number;
  
  // Sources
  primarySources: DataSource[];
  secondarySources?: DataSource[];
  
  // Quality
  confidenceLevel: 'high' | 'medium' | 'low';
  confidenceRationale: string;
  confidenceRationaleSv: string;
  
  // Limitations
  whatThisShows: string;
  whatThisShowsSv: string;
  whatThisDoesNotShow: string[];
  whatThisDoesNotShowSv: string[];
  
  // Metadata
  lastVerified: string;
  verifiedBy?: string;
  citationFormat: string;
  evidenceHash?: string; // SHA-256 for verification
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface TruthLayerContextType {
  openProvenance: (provenance: DataProvenance) => void;
  closeProvenance: () => void;
  currentProvenance: DataProvenance | null;
  isOpen: boolean;
}

const TruthLayerContext = createContext<TruthLayerContextType | null>(null);

export function useTruthLayer() {
  const context = useContext(TruthLayerContext);
  if (!context) {
    throw new Error('useTruthLayer must be used within TruthLayerProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

interface TruthLayerProviderProps {
  children: ReactNode;
}

export function TruthLayerProvider({ children }: TruthLayerProviderProps) {
  const [currentProvenance, setCurrentProvenance] = useState<DataProvenance | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openProvenance = (provenance: DataProvenance) => {
    setCurrentProvenance(provenance);
    setIsOpen(true);
  };

  const closeProvenance = () => {
    setIsOpen(false);
  };

  return (
    <TruthLayerContext.Provider value={{ openProvenance, closeProvenance, currentProvenance, isOpen }}>
      {children}
      <ProvenanceDialog />
    </TruthLayerContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLICKABLE VALUE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ClickableValueProps {
  value: string | number;
  unit?: string;
  provenance: DataProvenance;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showUnit?: boolean;
}

export function ClickableValue({ 
  value, 
  unit, 
  provenance, 
  className,
  size = 'md',
  showUnit = true
}: ClickableValueProps) {
  const { openProvenance } = useTruthLayer();
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold'
  };

  return (
    <button
      onClick={() => openProvenance(provenance)}
      className={cn(
        "inline-flex items-baseline gap-1 transition-all",
        "border-b border-dashed border-primary/30 hover:border-primary",
        "hover:text-primary cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 rounded-sm",
        sizeClasses[size],
        className
      )}
      title="Klicka för att se källa och metod"
    >
      <span>{value}</span>
      {showUnit && unit && <span className="text-muted-foreground text-[0.8em]">{unit}</span>}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVENANCE DIALOG
// ═══════════════════════════════════════════════════════════════════════════

function ProvenanceDialog() {
  const { currentProvenance, isOpen, closeProvenance } = useTruthLayer();
  const [copied, setCopied] = useState(false);

  if (!currentProvenance) return null;

  const p = currentProvenance;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ConfidenceBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
    const variants = {
      high: { label: 'Hög konfidens', className: 'bg-primary/10 text-primary border-primary/30' },
      medium: { label: 'Medel konfidens', className: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
      low: { label: 'Låg konfidens', className: 'bg-destructive/10 text-destructive border-destructive/30' }
    };
    return <Badge variant="outline" className={variants[level].className}>{variants[level].label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeProvenance}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl flex items-center gap-3">
            <span className="text-3xl font-bold">{p.displayValue}</span>
            {p.unit && <span className="text-muted-foreground">{p.unit}</span>}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <span>{p.labelSv}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{p.geoScopeSv}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{p.timePeriodSv}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 pt-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="overview">Översikt</TabsTrigger>
                <TabsTrigger value="aggregation">Aggregering</TabsTrigger>
                <TabsTrigger value="sources">Källor</TabsTrigger>
                <TabsTrigger value="limitations">Begränsningar</TabsTrigger>
                <TabsTrigger value="cite">Citera</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-center gap-2">
                  <ConfidenceBadge level={p.confidenceLevel} />
                  <span className="text-sm text-muted-foreground">
                    Baserat på {p.rawDatapointCount.toLocaleString()} datapunkter
                  </span>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Vad detta visar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{p.whatThisShowsSv}</p>
                  </CardContent>
                </Card>

                <Alert className="bg-destructive/5 border-destructive/20">
                  <AlertDescription>
                    <p className="font-medium text-sm mb-2">Vad detta INTE visar:</p>
                    <ul className="text-sm space-y-1">
                      {p.whatThisDoesNotShowSv.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-destructive shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Senast verifierat: {new Date(p.lastVerified).toLocaleDateString('sv-SE')}</span>
                  {p.verifiedBy && <span>av {p.verifiedBy}</span>}
                </div>
              </TabsContent>

              {/* Aggregation Tab */}
              <TabsContent value="aggregation" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Så här beräknades värdet du ser — från rådata till aggregerat tal.
                </p>

                <div className="space-y-3">
                  {p.aggregationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium">{step.operationSv}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.inputCount.toLocaleString()} in → {step.outputCount.toLocaleString()} ut
                        </p>
                        {step.formula && (
                          <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block font-mono">
                            {step.formula}
                          </code>
                        )}
                        {step.notes && <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>}
                      </div>
                      {idx < p.aggregationSteps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-2" />
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="text-sm">
                  <span className="font-medium">Totalt antal råa datapunkter: </span>
                  <span>{p.rawDatapointCount.toLocaleString()}</span>
                </div>
              </TabsContent>

              {/* Sources Tab */}
              <TabsContent value="sources" className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Primärkällor</h4>
                  <div className="space-y-3">
                    {p.primarySources.map((source) => (
                      <SourceCard key={source.id} source={source} />
                    ))}
                  </div>
                </div>

                {p.secondarySources && p.secondarySources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Sekundärkällor</h4>
                    <div className="space-y-3">
                      {p.secondarySources.map((source) => (
                        <SourceCard key={source.id} source={source} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Limitations Tab */}
              <TabsContent value="limitations" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <p className="font-medium mb-2">Varför begränsningar är obligatoriska</p>
                    <p className="text-sm text-muted-foreground">
                      Ingen datapunkt är perfekt. Att förstå begränsningarna är avgörande för korrekt tolkning.
                    </p>
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Konfidensnotering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{p.confidenceRationaleSv}</p>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-destructive">Detta visar INTE:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {p.whatThisDoesNotShowSv.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-destructive shrink-0">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Citation Tab */}
              <TabsContent value="cite" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Citeringsformat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono break-all">
                      {p.citationFormat}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => copyToClipboard(p.citationFormat)}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? 'Kopierat!' : 'Kopiera'}
                    </Button>
                  </CardContent>
                </Card>

                {p.evidenceHash && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Verifieringshash
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs bg-muted p-2 rounded block font-mono break-all">
                        {p.evidenceHash}
                      </code>
                      <p className="text-xs text-muted-foreground mt-2">
                        Denna hash kan användas för att verifiera att datan inte har ändrats.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE CARD
// ═══════════════════════════════════════════════════════════════════════════

function SourceCard({ source }: { source: DataSource }) {
  const typeLabels: Record<DataSource['type'], string> = {
    official_statistics: 'Officiell statistik',
    research: 'Forskning',
    aggregator: 'Aggregator',
    primary: 'Primärkälla',
    secondary: 'Sekundärkälla'
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{source.nameSv}</span>
              <Badge variant="outline" className="text-xs">{typeLabels[source.type]}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{source.organization}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Tillförlitlighet: {source.reliabilityScore}/100</span>
              <span>Uppdateras: {source.updateFrequency}</span>
              <span>Täckning: {source.coverage}</span>
            </div>
          </div>
          
          {source.url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { ProvenanceDialog, SourceCard };
