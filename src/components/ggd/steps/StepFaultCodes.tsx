/**
 * Step 4: Fault Codes (GEDI)
 * 
 * Display generated GEDI fault codes - exactly like EOBD.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, AlertTriangle, Clock, Zap, Tag } from 'lucide-react';
import type { GEDIFaultCode } from '../types';

interface StepFaultCodesProps {
  faultCodes: GEDIFaultCode[];
  onConfirm: () => void;
}

export function StepFaultCodes({ faultCodes, onConfirm }: StepFaultCodesProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(
    faultCodes.length > 0 ? faultCodes[0].code : null
  );

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return '#dc2626';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const getClassIcon = (cls: string) => {
    switch (cls) {
      case 'economic': return '💰';
      case 'social': return '👥';
      case 'systemic': return '⚙️';
      case 'climate': return '🌡️';
      case 'governance': return '🏛️';
      default: return '📊';
    }
  };

  const selectedCodeData = faultCodes.find(c => c.code === selectedCode);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 4 / 8</Badge>
        <h2 className="text-2xl font-bold mb-2">Felkodslogik (GEDI)</h2>
        <p className="text-muted-foreground">
          Systemet har genererat följande diagnostiska felkoder
        </p>
      </div>

      {faultCodes.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-xl font-bold text-green-500 mb-2">Inga aktiva felkoder</h3>
          <p className="text-muted-foreground">
            Systemet visar inga kritiska avvikelser som genererar felkoder.
          </p>
          <Button size="lg" onClick={onConfirm} className="mt-6 font-mono">
            Fortsätt
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code list */}
          <div className="lg:col-span-1">
            <div className="text-xs text-muted-foreground font-mono mb-2">
              AKTIVA FELKODER ({faultCodes.length})
            </div>
            <ScrollArea className="h-[450px]">
              <div className="space-y-2 pr-4">
                {faultCodes.map((code) => (
                  <button
                    key={code.code}
                    onClick={() => setSelectedCode(code.code)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedCode === code.code 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        className="font-mono"
                        style={{ 
                          backgroundColor: getCriticalityColor(code.criticality),
                          color: 'white',
                        }}
                      >
                        {code.code}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">{code.name.sv}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getClassIcon(code.class)} {code.class.charAt(0).toUpperCase() + code.class.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 bg-card border rounded-xl p-6">
            {selectedCodeData ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge 
                      className="font-mono text-lg px-4 py-1 mb-2"
                      style={{ 
                        backgroundColor: getCriticalityColor(selectedCodeData.criticality),
                        color: 'white',
                      }}
                    >
                      {selectedCodeData.code}
                    </Badge>
                    <h3 className="text-xl font-bold">{selectedCodeData.name.sv}</h3>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {getClassIcon(selectedCodeData.class)} {selectedCodeData.class}
                  </Badge>
                </div>

                {/* Description */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <p className="text-sm">{selectedCodeData.description.sv}</p>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      KRITIKALITET
                    </div>
                    <Badge 
                      style={{ 
                        backgroundColor: `${getCriticalityColor(selectedCodeData.criticality)}20`,
                        color: getCriticalityColor(selectedCodeData.criticality),
                      }}
                    >
                      {selectedCodeData.criticality.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      VARAKTIGHET
                    </div>
                    <div className="font-mono text-lg font-bold">
                      {selectedCodeData.duration} mån
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Zap className="h-3 w-3" />
                      LAMBDA-PÅVERKAN
                    </div>
                    <div className="font-mono text-lg font-bold text-red-500">
                      {selectedCodeData.lambdaImpact > 0 ? '+' : ''}{selectedCodeData.lambdaImpact}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Tag className="h-3 w-3" />
                      TRIGGAD
                    </div>
                    <div className="font-mono text-sm">
                      {selectedCodeData.triggeredAt}
                    </div>
                  </div>
                </div>

                {/* Affected axes */}
                <div className="mb-6">
                  <div className="text-xs text-muted-foreground mb-2">PÅVERKADE AXLAR</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCodeData.affectedAxes.map(axis => (
                      <Badge key={axis} variant="secondary" className="font-mono">
                        {axis}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Related indicators */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">RELATERADE INDIKATORER</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCodeData.indicators.map(ind => (
                      <Badge key={ind} variant="outline" className="font-mono text-xs">
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Välj en felkod för att se detaljer
              </div>
            )}
          </div>
        </div>
      )}

      {faultCodes.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={onConfirm}
            className="font-mono"
          >
            Fortsätt till orsaksanalys
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
