/**
 * Legal Disclaimer Components - Juridiska skyddsklausuler
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertTriangle, Scale, Shield, FileText, ExternalLink } from 'lucide-react';
import { legalDisclaimers } from '@/config/licensingConfig';

interface DisclaimerBadgeProps {
  type: keyof typeof legalDisclaimers;
  size?: 'sm' | 'md';
}

export function DisclaimerBadge({ type, size = 'sm' }: DisclaimerBadgeProps) {
  const disclaimer = legalDisclaimers[type];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`cursor-help ${size === 'sm' ? 'text-xs' : ''}`}>
          <Info className={`${size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'} mr-1`} />
          {disclaimer.shortText}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-semibold">{disclaimer.title}</p>
        <p className="text-xs mt-1">{disclaimer.fullText}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface DisclaimerAlertProps {
  type: keyof typeof legalDisclaimers;
  variant?: 'default' | 'warning';
}

export function DisclaimerAlert({ type, variant = 'default' }: DisclaimerAlertProps) {
  const disclaimer = legalDisclaimers[type];
  const Icon = variant === 'warning' ? AlertTriangle : Info;

  return (
    <Alert className={variant === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' : ''}>
      <Icon className={`h-4 w-4 ${variant === 'warning' ? 'text-yellow-500' : ''}`} />
      <AlertTitle>{disclaimer.title}</AlertTitle>
      <AlertDescription className="text-sm">
        {disclaimer.fullText}
      </AlertDescription>
    </Alert>
  );
}

export function AllDisclaimersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Juridiska villkor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(legalDisclaimers).map(([key, disclaimer]) => (
          <div key={key} className="p-3 rounded-lg border bg-card/50">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{disclaimer.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{disclaimer.fullText}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CorrelationDisclaimer() {
  return (
    <Alert className="border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle>Korrelation ≠ Orsak</AlertTitle>
      <AlertDescription>
        Visade samband indikerar statistisk samvariation. Kausalitet fastställs inte.
        Tolka mönster med försiktighet och i sitt sammanhang.
      </AlertDescription>
    </Alert>
  );
}

export function DataSourceDisclaimer({ sourceName, sourceUrl }: { sourceName: string; sourceUrl?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <FileText className="h-3 w-3" />
      <span>Källa: {sourceName}</span>
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:underline">
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

interface FullLegalDialogProps {
  trigger?: React.ReactNode;
}

export function FullLegalDialog({ trigger }: FullLegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Scale className="h-4 w-4" />
            Juridiska villkor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Juridiska villkor och ansvarsfriskrivningar
          </DialogTitle>
          <DialogDescription>
            Läs igenom dessa villkor noga. Genom att använda plattformen accepterar du dessa villkor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Object.entries(legalDisclaimers).map(([key, disclaimer]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {disclaimer.title}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {disclaimer.fullText}
              </p>
            </div>
          ))}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Datakategorier</h3>
            <div className="grid gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="font-medium text-green-600">Öppen källdata</h4>
                <p className="text-sm text-muted-foreground">
                  Data från myndigheter och officiella källor. Plattformen aggregerar och presenterar,
                  men äger inte underliggande data.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-medium text-purple-600">Systemgenererad data</h4>
                <p className="text-sm text-muted-foreground">
                  Index, korrelationer, relevansscore och andra beräkningar som produceras av plattformen.
                  Licensieras enligt vald prenumerationsnivå.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>Version 1.0 • Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default {
  DisclaimerBadge,
  DisclaimerAlert,
  AllDisclaimersCard,
  CorrelationDisclaimer,
  DataSourceDisclaimer,
  FullLegalDialog,
};
