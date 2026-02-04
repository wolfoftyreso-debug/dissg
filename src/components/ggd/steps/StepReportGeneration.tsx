/**
 * Final Step: Report Generation
 * 
 * Generates a version-locked, QR-verifiable diagnostic report.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  Shield, 
  Clock,
  Database,
  Lock,
} from 'lucide-react';
import type { DiagnosticCase, DiagnosticReport } from '../types';
import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';
import { generateChecksum } from '../mockData';

interface StepReportGenerationProps {
  diagnosticCase: DiagnosticCase;
  primaryAxis: LambdaAxis;
  secondaryAxes: LambdaAxis[];
  activeFaultCodes: string[];
  topCauses: { name: string; probability: number }[];
  isPro: boolean;
  onComplete: () => void;
}

export function StepReportGeneration({
  diagnosticCase,
  primaryAxis,
  secondaryAxes,
  activeFaultCodes,
  topCauses,
  isPro,
  onComplete,
}: StepReportGenerationProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const checksum = generateChecksum(diagnosticCase.caseId);
  const qrCode = `GGD-${checksum}`;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setReportGenerated(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Diagnostik slutförd</h2>
        <p className="text-muted-foreground">
          Alla steg har genomförts. Diagnosrapport kan nu genereras.
        </p>
      </div>

      {/* Case summary */}
      <div className="bg-card border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground">ÄRENDE-ID</div>
            <div className="font-mono text-lg font-bold">{diagnosticCase.caseId}</div>
          </div>
          <Badge variant="outline" className="font-mono">
            v{diagnosticCase.dataModelVersion}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">OBJEKT</div>
            <div className="font-medium">{diagnosticCase.geoName}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">TIDSPERIOD</div>
            <div className="font-mono text-sm">
              {diagnosticCase.timeRangeStart} — {diagnosticCase.timeRangeEnd}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">LAMBDA-AVVIKELSE</div>
            <div className="font-mono text-lg text-red-500">
              {diagnosticCase.lambdaDeviation}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">PRIMÄR AXEL</div>
            <Badge className="font-mono">{primaryAxis}</Badge>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Key findings */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-2">AKTIVA FELKODER ({activeFaultCodes.length})</div>
            <div className="flex flex-wrap gap-2">
              {activeFaultCodes.map(code => (
                <Badge key={code} variant="destructive" className="font-mono">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-2">TOPP ORSAKER</div>
            <div className="space-y-1">
              {topCauses.slice(0, 3).map((cause, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{cause.name}</span>
                  <Badge variant="outline">{cause.probability}%</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Lock className="h-4 w-4 text-primary" />
          <span>Versionslåst</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <QrCode className="h-4 w-4 text-primary" />
          <span>QR-verifierbar</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4 text-primary" />
          <span>Full källista</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span>Metodikdokumentation</span>
        </div>
      </div>

      {/* QR / Checksum preview */}
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-1">VERIFIERINGSKOD</div>
            <div className="font-mono text-2xl font-bold">{qrCode}</div>
            <div className="text-xs text-muted-foreground mt-1">
              SHA-256: {checksum}
            </div>
          </div>
          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
            <QrCode className="h-16 w-16 text-black" />
          </div>
        </div>
      </div>

      {/* Acknowledgment */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="acknowledge"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked === true)}
            className="mt-1"
          />
          <label htmlFor="acknowledge" className="text-sm cursor-pointer">
            <span className="font-medium">Jag bekräftar att:</span>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Alla steg i diagnostiken har genomförts korrekt</li>
              <li>• Jag förstår att detta är en datadriven analys, inte en politisk rekommendation</li>
              <li>• Rapporten representerar nuvarande dataläge och kan uppdateras när ny data tillkommer</li>
            </ul>
          </label>
        </div>
      </div>

      {/* Action buttons */}
      {!reportGenerated ? (
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            disabled={!acknowledged || isGenerating}
            onClick={handleGenerateReport}
            className="font-mono"
          >
            {isGenerating ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Genererar rapport...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generera diagnosrapport
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="font-medium text-green-500">Rapport genererad!</div>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" disabled={!isPro}>
              <Download className="mr-2 h-4 w-4" />
              Ladda ner PDF {!isPro && '(PRO)'}
            </Button>
            <Button variant="outline" disabled={!isPro}>
              <Database className="mr-2 h-4 w-4" />
              API Export {!isPro && '(PRO)'}
            </Button>
            <Button onClick={onComplete} className="font-mono">
              Avsluta diagnostik
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span>Datamodell: v{diagnosticCase.dataModelVersion}</span>
          <span>•</span>
          <span>Genererad: {new Date().toISOString().split('T')[0]}</span>
        </div>
        Denna rapport är maskinläsbar och kan verifieras via QR-kod eller API.
      </div>
    </div>
  );
}
