/**
 * DRILL-DOWN COMPONENT
 * 
 * Enables exploration from Answer Packet → Source → Snapshot.
 * Every data point is traceable to its origin.
 * 
 * Click → Answer Packet → Source → Raw Data
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExternalLink, Database, FileText, Clock, ChevronRight, Copy, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  source_id: string;
  name: string;
  tier: 1 | 2 | 3;
  url?: string;
  last_updated: string;
  reliability_score: number;
}

interface Snapshot {
  snapshot_id: string;
  captured_at: string;
  checksum: string;
  raw_value: unknown;
  transformations: string[];
}

interface DrillDownProps {
  answerPacketId: string;
  answerPacketRef: string;
  summary: string;
  confidence: number;
  sources: Source[];
  snapshot?: Snapshot;
  onViewRawData?: () => void;
}

export function DrillDown({
  answerPacketId,
  answerPacketRef,
  summary,
  confidence,
  sources,
  snapshot,
}: DrillDownProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Data Provenance</CardTitle>
            <CardDescription>Trace this answer to its sources</CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {answerPacketRef}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Navigation breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer">Decision Graph</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer">Answer Packet</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Sources</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Answer Packet details */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            Answer Packet
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{summary}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Confidence: {Math.round(confidence * 100)}%</Badge>
            <Badge variant="outline">ID: {answerPacketId}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-2"
              onClick={() => copyToClipboard(answerPacketId, 'packet')}
            >
              {copiedId === 'packet' ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              Copy ID
            </Button>
          </div>
        </div>
        
        {/* Sources */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Data Sources ({sources.length})</h3>
          <div className="space-y-2">
            {sources.map((source) => (
              <SourceCard key={source.source_id} source={source} />
            ))}
          </div>
        </div>
        
        {/* Snapshot details */}
        {snapshot && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Database className="h-4 w-4" />
                View Raw Data Snapshot
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[500px] sm:w-[600px]">
              <SheetHeader>
                <SheetTitle>Raw Data Snapshot</SheetTitle>
                <SheetDescription>
                  Immutable record of the data at time of capture
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Captured: {new Date(snapshot.captured_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-muted-foreground">Checksum:</span>
                  <code className="rounded bg-muted px-2 py-0.5 text-xs">
                    {snapshot.checksum.slice(0, 16)}...
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => copyToClipboard(snapshot.checksum, 'checksum')}
                  >
                    {copiedId === 'checksum' ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                
                {snapshot.transformations.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Transformations Applied</h4>
                    <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                      {snapshot.transformations.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                <div>
                  <h4 className="mb-2 text-sm font-medium">Raw Value</h4>
                  <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-4 text-xs">
                    {JSON.stringify(snapshot.raw_value, null, 2)}
                  </pre>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Verification note */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p>
            All data is versioned and checksummed. Use the Answer Packet ID or checksum 
            to verify provenance or reproduce this exact view via API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SourceCard({ source }: { source: Source }) {
  const tierColors = {
    1: 'border-green-500/30 bg-green-500/5',
    2: 'border-blue-500/30 bg-blue-500/5',
    3: 'border-yellow-500/30 bg-yellow-500/5',
  };
  
  const tierLabels = {
    1: 'Official',
    2: 'Semi-Official',
    3: 'Third Party',
  };

  return (
    <div className={cn("rounded-lg border p-3", tierColors[source.tier])}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium text-sm">{source.name}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Updated: {new Date(source.last_updated).toLocaleDateString()}</span>
            <span>•</span>
            <span>Reliability: {Math.round(source.reliability_score * 100)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Tier {source.tier}: {tierLabels[source.tier]}
          </Badge>
          {source.url && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrillDown;
