import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Hash,
  Clock,
  FileText,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { 
  VERIFICATION_MESSAGE,
  generateBlameSourceMessage 
} from '@/config/dataPositioningConfig';

interface RawDataPoint {
  /** Rå värde exakt som från källa */
  rawValue: number | string;
  /** Visningsvärde (kan vara formaterat) */
  displayValue?: string;
  /** Checksumma */
  checksum: string;
  /** Källa */
  sourceName: string;
  /** Käll-URL */
  sourceUrl: string;
  /** Licens */
  license?: string;
  /** Ingest-tidpunkt */
  ingestedAt: string;
  /** Versions-ID */
  versionId: string;
  /** Period */
  period?: string;
  /** Original datapost (JSON) */
  originalRecord?: Record<string, unknown>;
}

interface RawDataViewerProps {
  /** Datapunkten att visa */
  dataPoint: RawDataPoint;
  
  /** Trigger-variant */
  triggerVariant?: 'button' | 'link' | 'icon';
  
  /** Trigger-text */
  triggerText?: string;
  
  className?: string;
}

/**
 * WAVE 7 BLOCK BD: Raw Data Guarantee Layer
 * 
 * Visar rådata med full transparens:
 * - Exakt värde från källa
 * - Checksumma för verifiering
 * - Länk till ursprungskälla
 * - Verifieringsinstruktioner
 */
export function RawDataViewer({
  dataPoint,
  triggerVariant = 'button',
  triggerText = 'Visa rådata',
  className = '',
}: RawDataViewerProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} kopierad till urklipp`);
    setTimeout(() => setCopied(null), 2000);
  };

  const formattedDate = format(
    new Date(dataPoint.ingestedAt),
    'PPP HH:mm',
    { locale: sv }
  );

  const trigger = triggerVariant === 'link' ? (
    <button className="text-xs text-primary underline underline-offset-2 hover:no-underline">
      {triggerText}
    </button>
  ) : triggerVariant === 'icon' ? (
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <Database className="h-3.5 w-3.5" />
    </Button>
  ) : (
    <Button variant="outline" size="sm" className={className}>
      <Database className="h-3.5 w-3.5 mr-1.5" />
      {triggerText}
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Rådata & verifiering
          </DialogTitle>
          <DialogDescription>
            Exakt data som publicerades av ursprungskällan
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {/* Verifieringsmeddelande */}
            <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                {VERIFICATION_MESSAGE.sv}
              </AlertDescription>
            </Alert>

            {/* Råvärde */}
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Exakt värde
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleCopy(String(dataPoint.rawValue), 'Värde')}
                >
                  {copied === 'Värde' ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="text-2xl font-mono font-bold">
                {String(dataPoint.rawValue)}
              </p>
              {dataPoint.displayValue && dataPoint.displayValue !== String(dataPoint.rawValue) && (
                <p className="text-xs text-muted-foreground mt-1">
                  Visas som: {dataPoint.displayValue}
                </p>
              )}
            </div>

            <Separator />

            {/* Källinformation */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Källa</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Organisation:</span>
                  <span className="font-medium">{dataPoint.sourceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Licens:</span>
                  <Badge variant="outline" className="text-xs">
                    {dataPoint.license || 'Öppen data'}
                  </Badge>
                </div>
                {dataPoint.period && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span>{dataPoint.period}</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                asChild
              >
                <a href={dataPoint.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Gå till källa för manuell verifiering
                </a>
              </Button>
            </div>

            <Separator />

            {/* Integritet */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Integritet & spårbarhet
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-muted/30 rounded font-mono break-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">SHA-256:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1"
                      onClick={() => handleCopy(dataPoint.checksum, 'Checksumma')}
                    >
                      {copied === 'Checksumma' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <span className="text-[10px]">{dataPoint.checksum}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Inhämtad: {formattedDate}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>Version: {dataPoint.versionId}</span>
                </div>
              </div>
            </div>

            {/* Original datapost */}
            {dataPoint.originalRecord && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Original datapost</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleCopy(
                        JSON.stringify(dataPoint.originalRecord, null, 2),
                        'JSON'
                      )}
                    >
                      {copied === 'JSON' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Kopiera
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-2 bg-muted/50 rounded text-[10px] font-mono overflow-x-auto max-h-32">
                    {JSON.stringify(dataPoint.originalRecord, null, 2)}
                  </pre>
                </div>
              </>
            )}

            {/* Blame source */}
            <Separator />
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                {generateBlameSourceMessage(dataPoint.sourceName)}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Kompakt "Visa rådata"-länk för inline-användning
 */
export function RawDataLink({
  dataPoint,
  className = '',
}: {
  dataPoint: RawDataPoint;
  className?: string;
}) {
  return (
    <RawDataViewer
      dataPoint={dataPoint}
      triggerVariant="link"
      triggerText="Visa rådata"
      className={className}
    />
  );
}

/**
 * Ikon-knapp för tabeller och grafer
 */
export function RawDataIcon({
  dataPoint,
  className = '',
}: {
  dataPoint: RawDataPoint;
  className?: string;
}) {
  return (
    <RawDataViewer
      dataPoint={dataPoint}
      triggerVariant="icon"
      className={className}
    />
  );
}
