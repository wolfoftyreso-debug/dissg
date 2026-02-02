import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  Database, 
  FileCode, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Calendar,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSource {
  name: string;
  type: 'official' | 'research' | 'derived';
  url?: string;
  lastUpdated?: string;
  reliability: number;
}

interface MethodInfo {
  name: string;
  description: string;
  assumptions: string[];
  limitations: string[];
}

interface HowWeKnowData {
  kpiId: string;
  kpiName: string;
  sources: DataSource[];
  method: MethodInfo;
  confidence: number;
  dataPoints: number;
  timeRange: { start: string; end: string };
  updateFrequency: string;
  lastCalculated: string;
}

interface HowWeKnowSectionProps {
  data: HowWeKnowData;
  variant?: 'button' | 'inline' | 'card';
  className?: string;
}

// Mock data generator for demo
export function generateHowWeKnowData(kpiId: string, kpiName: string): HowWeKnowData {
  return {
    kpiId,
    kpiName,
    sources: [
      { name: 'SCB (Statistiska Centralbyrån)', type: 'official', url: 'https://scb.se', lastUpdated: '2024-01-15', reliability: 95 },
      { name: 'Socialstyrelsen', type: 'official', url: 'https://socialstyrelsen.se', lastUpdated: '2024-01-10', reliability: 92 },
    ],
    method: {
      name: 'Trendanalys med säsongsrensning',
      description: 'Vi använder ett 12-månaders glidande medelvärde med säsongsjustering för att identifiera underliggande trender.',
      assumptions: [
        'Historiska mönster fortsätter',
        'Säsongsvariationer är stabila',
        'Inga strukturella brott i tidsserien'
      ],
      limitations: [
        'Kan inte förutse plötsliga händelser',
        'Eftersläpning på 1-3 månader i data',
        'Regional variation fångas ej'
      ]
    },
    confidence: 85,
    dataPoints: 156,
    timeRange: { start: '2011-01', end: '2024-01' },
    updateFrequency: 'Månadsvis',
    lastCalculated: new Date().toISOString()
  };
}

export function HowWeKnowSection({ data, variant = 'button', className }: HowWeKnowSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'inline') {
    return <HowWeKnowContent data={data} className={className} />;
  }

  if (variant === 'card') {
    return (
      <Card className={cn('bg-card border-border', className)}>
        <CardContent className="pt-4">
          <HowWeKnowContent data={data} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn('gap-2', className)}
          onClick={(e) => e.stopPropagation()}
        >
          <HelpCircle className="h-4 w-4" />
          Hur vet vi det?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Hur vet vi det?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {data.kpiName}
          </p>
        </DialogHeader>
        <HowWeKnowContent data={data} />
      </DialogContent>
    </Dialog>
  );
}

function HowWeKnowContent({ data, className }: { data: HowWeKnowData; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Confidence summary */}
      <div className="p-3 bg-muted/30 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Säkerhet i bedömningen</span>
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs',
              data.confidence >= 80 && 'border-status-positive text-status-positive',
              data.confidence >= 60 && data.confidence < 80 && 'border-status-warning text-status-warning',
              data.confidence < 60 && 'border-status-critical text-status-critical'
            )}
          >
            {data.confidence}%
          </Badge>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all",
              data.confidence >= 80 && "bg-status-positive",
              data.confidence >= 60 && data.confidence < 80 && "bg-status-warning",
              data.confidence < 60 && "bg-status-critical"
            )}
            style={{ width: `${data.confidence}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {data.confidence >= 80 
            ? 'Datat är starkt och pålitligt.'
            : data.confidence >= 60
              ? 'Datat är indikativt men med viss osäkerhet.'
              : 'Preliminära siffror, tolka med försiktighet.'}
        </p>
      </div>

      <Separator />

      {/* Data sources */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Datakällor</span>
        </div>
        <ul className="space-y-2">
          {data.sources.map((source, i) => (
            <li key={i} className="flex items-start justify-between p-2 bg-muted/20 rounded-md">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{source.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {source.type === 'official' ? 'Officiell' : source.type === 'research' ? 'Forskning' : 'Härledd'}
                  </Badge>
                </div>
                {source.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Senast uppdaterad: {source.lastUpdated}
                  </p>
                )}
              </div>
              {source.url && (
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Method */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Analysmetod</span>
        </div>
        <div className="space-y-3">
          <div>
            <Badge variant="outline" className="text-xs mb-2">{data.method.name}</Badge>
            <p className="text-sm text-muted-foreground">{data.method.description}</p>
          </div>
          
          {/* Assumptions */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle className="h-3 w-3 text-status-positive" />
              <span className="text-xs font-medium text-muted-foreground">Antaganden</span>
            </div>
            <ul className="space-y-0.5 pl-4">
              {data.method.assumptions.map((assumption, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {assumption}</li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="h-3 w-3 text-status-warning" />
              <span className="text-xs font-medium text-muted-foreground">Begränsningar</span>
            </div>
            <ul className="space-y-0.5 pl-4">
              {data.method.limitations.map((limitation, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {limitation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Data coverage */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 bg-muted/20 rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tidsperiod</span>
          </div>
          <p className="text-sm font-medium">{data.timeRange.start} – {data.timeRange.end}</p>
        </div>
        <div className="p-2 bg-muted/20 rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <Database className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Datapunkter</span>
          </div>
          <p className="text-sm font-medium">{data.dataPoints} observationer</p>
        </div>
        <div className="p-2 bg-muted/20 rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <RefreshCw className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Uppdateringsfrekvens</span>
          </div>
          <p className="text-sm font-medium">{data.updateFrequency}</p>
        </div>
        <div className="p-2 bg-muted/20 rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Senast beräknad</span>
          </div>
          <p className="text-sm font-medium">
            {new Date(data.lastCalculated).toLocaleDateString('sv-SE')}
          </p>
        </div>
      </div>

      {/* Transparency footer */}
      <div className="pt-2 border-t border-border text-xs text-muted-foreground text-center">
        All data och metodik är öppen och reproducerbar.
      </div>
    </div>
  );
}

/**
 * Compact "Hur vet vi det?" link for inline use
 */
export function HowWeKnowLink({ 
  kpiId, 
  kpiName,
  onClick 
}: { 
  kpiId: string; 
  kpiName: string;
  onClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const data = generateHowWeKnowData(kpiId, kpiName);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <HelpCircle className="h-3 w-3" />
          Hur vet vi det?
          <ChevronRight className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Hur vet vi det?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {kpiName}
          </p>
        </DialogHeader>
        <HowWeKnowContent data={data} />
      </DialogContent>
    </Dialog>
  );
}
