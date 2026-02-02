import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ExternalLink,
  Info,
  Database,
  GitBranch,
  Calculator,
  Eye,
  Clock,
  Shield,
} from 'lucide-react';
import { DATA_LAYERS, LEGAL_DISCLAIMERS } from '@/config/publicProfileConfig';

interface DataSource {
  name: string;
  url: string;
  license: string;
  lastUpdated?: string;
}

interface MethodologyDisclosureProps {
  /** Typ av data som visas */
  dataType: 'kpi' | 'profile' | 'aggregation' | 'timeline';
  
  /** KPI-kod om relevant */
  kpiCode?: string;
  
  /** Tidsintervall för datan */
  timeRange?: { start: string; end: string };
  
  /** Datakällor som används */
  sources?: DataSource[];
  
  /** Klassificeringsregler som tillämpas */
  classificationRules?: string[];
  
  /** Aggregeringsmetod */
  aggregationMethod?: string;
  
  /** Visa som kompakt länk eller knapp */
  variant?: 'link' | 'button' | 'icon';
  
  className?: string;
}

/**
 * DEL XIV: Metodtransparenskomponent
 * 
 * "Visa metod" - obligatorisk länk på varje sida
 * Visar exakt datakälla, tidsintervall, klassificeringsregel och aggregeringsmetod
 */
export function MethodologyDisclosure({
  dataType,
  kpiCode,
  timeRange,
  sources = [],
  classificationRules = [],
  aggregationMethod,
  variant = 'link',
  className = '',
}: MethodologyDisclosureProps) {
  const [open, setOpen] = useState(false);

  const dataTypeLabels = {
    kpi: 'Indikatorvärde',
    profile: 'Profildata',
    aggregation: 'Sammanställning',
    timeline: 'Tidslinje',
  };

  const triggerElement = variant === 'icon' ? (
    <Button variant="ghost" size="icon" className={className}>
      <Info className="h-4 w-4" />
    </Button>
  ) : variant === 'button' ? (
    <Button variant="outline" size="sm" className={className}>
      <Info className="h-4 w-4 mr-2" />
      Så här är detta beräknat
    </Button>
  ) : (
    <button className={`text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 ${className}`}>
      Så här är detta beräknat
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Metodtransparens: {dataTypeLabels[dataType]}
          </DialogTitle>
          <DialogDescription>
            {LEGAL_DISCLAIMERS.aggregation.text}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Tre-lager-modellen */}
            <section>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Datalager
              </h4>
              <div className="grid gap-3">
                {Object.values(DATA_LAYERS).map((layer) => (
                  <div key={layer.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="shrink-0">
                      {layer.id === 'source' ? 'A' : layer.id === 'aggregation' ? 'B' : 'C'}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{layer.name}</p>
                      <p className="text-xs text-muted-foreground">{layer.description}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">{layer.disclaimer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Datakällor */}
            <section>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Datakällor
              </h4>
              {sources.length > 0 ? (
                <div className="space-y-2">
                  {sources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          {source.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-xs text-muted-foreground">
                          Licens: {source.license}
                        </p>
                      </div>
                      {source.lastUpdated && (
                        <Badge variant="secondary" className="text-xs">
                          {source.lastUpdated}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Specifika datakällor visas på detaljnivå för varje indikator.
                </p>
              )}
            </section>

            <Separator />

            {/* Tidsintervall */}
            {timeRange && (
              <>
                <section>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tidsintervall
                  </h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Från:</span> {timeRange.start}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Till:</span> {timeRange.end}
                    </p>
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Klassificeringsregler */}
            {classificationRules.length > 0 && (
              <>
                <section>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Klassificeringsregler
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {classificationRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <Separator />
              </>
            )}

            {/* Aggregeringsmetod */}
            {aggregationMethod && (
              <>
                <section>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Aggregeringsmetod
                  </h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-line">{aggregationMethod}</p>
                  </div>
                </section>
                <Separator />
              </>
            )}

            {/* Dataansvar */}
            <section>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Om data och ansvar
              </h4>
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-sm whitespace-pre-line">
                  {LEGAL_DISCLAIMERS.dataResponsibility.text}
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
