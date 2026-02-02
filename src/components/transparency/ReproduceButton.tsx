import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Database,
  Calendar,
  MapPin,
  FileCode
} from 'lucide-react';
import { type ReproducibilityRecord, generateReproductionUrl } from '@/config/radicalOpennessConfig';
import { cn } from '@/lib/utils';

interface ReproduceButtonProps {
  record: ReproducibilityRecord;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ReproduceButton({ 
  record, 
  variant = 'outline', 
  size = 'sm',
  className 
}: ReproduceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<'url' | 'query' | null>(null);

  const reproductionUrl = generateReproductionUrl(
    record.entityType,
    record.entityId,
    record.methodCode
  );

  const handleCopy = async (type: 'url' | 'query') => {
    const text = type === 'url' 
      ? reproductionUrl 
      : JSON.stringify(record.reproductionQuery, null, 2);
    
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setIsOpen(true)}
        className={cn('gap-2', className)}
      >
        <RefreshCw className="h-4 w-4" />
        Reproducera
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Reproducera denna insikt
            </DialogTitle>
            <DialogDescription>
              Alla data och metoder som krävs för att återskapa detta resultat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Reproduction status */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Reproducerbarhet</span>
                {record.isPubliclyReproducible ? (
                  <Badge className="bg-status-positive text-white text-xs">
                    Publik
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Begränsad
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Återskapad {record.reproductionCount} gånger
              </div>
            </div>

            <Separator />

            {/* Required data sources */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Datakällor</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.requiredDataSources.map((source, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Time range */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tidsperiod</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {record.requiredTimeRange.start} – {record.requiredTimeRange.end}
              </p>
            </div>

            {/* Geographic scope */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Geografisk omfattning</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {record.requiredGeoScope.map((geo, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {geo}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Method */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Metod</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {record.methodCode} v{record.methodVersion}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  Visa specifikation
                </Button>
              </div>
            </div>

            {/* Parameters */}
            {Object.keys(record.methodParameters).length > 0 && (
              <div>
                <span className="text-sm font-medium">Parametrar</span>
                <pre className="mt-2 p-3 bg-muted/50 rounded-md text-xs overflow-x-auto">
                  {JSON.stringify(record.methodParameters, null, 2)}
                </pre>
              </div>
            )}

            <Separator />

            {/* Copy options */}
            <div className="grid gap-2 md:grid-cols-2">
              <Button 
                variant="outline" 
                onClick={() => handleCopy('url')}
                className="justify-start"
              >
                {copied === 'url' ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-status-positive" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Kopiera API-URL
              </Button>
              
              {record.reproductionQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => handleCopy('query')}
                  className="justify-start"
                >
                  {copied === 'query' ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-status-positive" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Kopiera query
                </Button>
              )}
            </div>

            {/* Last reproduction info */}
            {record.lastReproducedAt && (
              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
                <p>
                  Senast reproducerad: {new Date(record.lastReproducedAt).toLocaleDateString('sv-SE')}
                </p>
                {record.lastReproductionMatched ? (
                  <p className="text-status-positive">✓ Resultatet matchade</p>
                ) : (
                  <p className="text-status-warning">
                    ⚠ Avvikelse: {record.deviationIfAny?.toFixed(2)}%
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Stäng
            </Button>
            <Button onClick={() => window.open(reproductionUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Kör reproduktion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Inline reproduce link
 */
interface ReproduceLinkProps {
  entityType: string;
  entityId: string;
  methodCode: string;
}

export function ReproduceLink({ entityType, entityId, methodCode }: ReproduceLinkProps) {
  const url = generateReproductionUrl(entityType, entityId, methodCode);
  
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
    >
      <RefreshCw className="h-3 w-3" />
      Reproducera
    </a>
  );
}
