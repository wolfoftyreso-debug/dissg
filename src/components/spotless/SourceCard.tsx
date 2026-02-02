/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SOURCE CARD - Complete Source Attribution (Spotless Protocol §2-3)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Every data point must have:
 * 1. Primary source
 * 2. Publication date
 * 3. Data coverage
 * 4. Method type
 * 5. Link to original source
 * 
 * Sources are NODES, not footnotes. They must be:
 * - Always visible (not hover-only)
 * - Always clickable
 * - Lead to depth (other data using same source)
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  ExternalLink, 
  Database, 
  Calendar, 
  MapPin, 
  FileText, 
  ChevronRight,
  Link2,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SourceAttribution } from '@/context/SpotlessContext';

interface SourceCardProps {
  source: SourceAttribution;
  /** Other data points using this source */
  relatedDataPoints?: Array<{ id: string; name: string; path: string }>;
  /** How this source is used in aggregation */
  aggregationUsage?: string;
  /** Compact inline display */
  variant?: 'full' | 'compact' | 'inline';
  className?: string;
}

export function SourceCard({ 
  source, 
  relatedDataPoints = [],
  aggregationUsage,
  variant = 'full',
  className 
}: SourceCardProps) {
  const [isDepthOpen, setIsDepthOpen] = useState(false);

  // Validate completeness
  const isComplete = Boolean(
    source.primarySource &&
    source.publicationDate &&
    source.dataCoverage &&
    source.methodType &&
    source.originalSourceUrl
  );

  if (variant === 'inline') {
    return (
      <Dialog open={isDepthOpen} onOpenChange={setIsDepthOpen}>
        <DialogTrigger asChild>
          <button 
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs',
              'bg-muted/50 hover:bg-muted transition-colors',
              'text-muted-foreground hover:text-foreground',
              className
            )}
          >
            <Database className="h-3 w-3" />
            <span className="font-medium">{source.primarySource}</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </DialogTrigger>
        <SourceDepthDialog 
          source={source} 
          relatedDataPoints={relatedDataPoints}
          aggregationUsage={aggregationUsage}
        />
      </Dialog>
    );
  }

  if (variant === 'compact') {
    return (
      <Dialog open={isDepthOpen} onOpenChange={setIsDepthOpen}>
        <DialogTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 p-2 rounded-md border',
              'bg-card hover:bg-muted/50 transition-colors text-left w-full',
              !isComplete && 'border-status-critical/40',
              className
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {isComplete ? (
                  <CheckCircle className="h-3.5 w-3.5 text-status-positive shrink-0" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-status-critical shrink-0" />
                )}
                <span className="text-sm font-medium truncate">{source.primarySource}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>{source.publicationDate}</span>
                <span>•</span>
                <span>{source.methodType}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </DialogTrigger>
        <SourceDepthDialog 
          source={source} 
          relatedDataPoints={relatedDataPoints}
          aggregationUsage={aggregationUsage}
        />
      </Dialog>
    );
  }

  // Full variant
  return (
    <Card className={cn(!isComplete && 'border-status-critical/40', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4" />
          Källa
          {isComplete ? (
            <Badge variant="outline" className="ml-auto text-status-positive border-status-positive/40">
              <CheckCircle className="h-3 w-3 mr-1" />
              Komplett
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto text-status-critical border-status-critical/40">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Ofullständig
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Source */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Primär källa
          </p>
          <p className="font-semibold">{source.primarySource || '—'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Publication Date */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Publiceringsdatum
            </p>
            <p className="text-sm">{source.publicationDate || '—'}</p>
          </div>

          {/* Data Coverage */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Datatäckning
            </p>
            <p className="text-sm">{source.dataCoverage || '—'}</p>
          </div>
        </div>

        {/* Method Type */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Metodtyp
          </p>
          <p className="text-sm">{source.methodType || '—'}</p>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {source.originalSourceUrl && (
            <Button variant="outline" size="sm" asChild className="justify-start">
              <a href={source.originalSourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Öppna originalkälla
              </a>
            </Button>
          )}
          
          <Dialog open={isDepthOpen} onOpenChange={setIsDepthOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start">
                <Link2 className="h-4 w-4 mr-2" />
                Visa källdjup ({relatedDataPoints.length} relaterade datapunkter)
              </Button>
            </DialogTrigger>
            <SourceDepthDialog 
              source={source} 
              relatedDataPoints={relatedDataPoints}
              aggregationUsage={aggregationUsage}
            />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE DEPTH DIALOG (Spotless Protocol §3)
// ═══════════════════════════════════════════════════════════════════════════

interface SourceDepthDialogProps {
  source: SourceAttribution;
  relatedDataPoints: Array<{ id: string; name: string; path: string }>;
  aggregationUsage?: string;
}

function SourceDepthDialog({ source, relatedDataPoints, aggregationUsage }: SourceDepthDialogProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {source.primarySource}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Full source details */}
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Publicerad</p>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {source.publicationDate}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Täckning</p>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {source.dataCoverage}
              </p>
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Metod</p>
            <p className="text-sm">{source.methodType}</p>
          </div>
        </div>

        <Separator />

        {/* Aggregation usage */}
        {aggregationUsage && (
          <>
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Användning i aggregering
              </h4>
              <p className="text-sm text-muted-foreground">{aggregationUsage}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Related data points */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Datapunkter som använder denna källa ({relatedDataPoints.length})
          </h4>
          {relatedDataPoints.length > 0 ? (
            <div className="space-y-2">
              {relatedDataPoints.map(dp => (
                <a
                  key={dp.id}
                  href={dp.path}
                  className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{dp.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Inga andra datapunkter använder denna källa för närvarande.
            </p>
          )}
        </div>

        <Separator />

        {/* Original source link */}
        <Button asChild className="w-full">
          <a href={source.originalSourceUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Öppna originalkälla
          </a>
        </Button>
      </div>
    </DialogContent>
  );
}

export default SourceCard;
