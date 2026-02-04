/**
 * Fault Code Browser Component
 * 
 * OEM-class fault code display and exploration.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FAULT_DOMAINS,
  DOMAIN_SUBSYSTEMS,
  DEVIATION_TYPES,
  SEVERITY_CONFIG,
  type FaultDomain,
  type DeviationType,
  type FaultSeverity,
  parseFaultCode,
} from '@/lib/fault-codes';
import { ALL_PREDEFINED_FAULT_CODES } from '@/lib/fault-codes/predefined-codes';

// =============================================================================
// DOMAIN BADGE
// =============================================================================

function DomainBadge({ domain }: { domain: FaultDomain }) {
  const info = FAULT_DOMAINS[domain];
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {domain} | {info.name}
    </Badge>
  );
}

// =============================================================================
// SEVERITY INDICATOR
// =============================================================================

function SeverityIndicator({ severity }: { severity: FaultSeverity }) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: config.color }}
      />
      <span className="font-mono text-xs">{config.label}</span>
      <span className="text-xs text-muted-foreground">({config.range})</span>
    </div>
  );
}

// =============================================================================
// FAULT CODE CARD
// =============================================================================

interface FaultCodeCardProps {
  code: string;
  description?: string;
  affectedBlocks?: string[];
  linkedCodes?: string[];
}

function FaultCodeCard({ code, description, affectedBlocks, linkedCodes }: FaultCodeCardProps) {
  const parsed = parseFaultCode(code);
  
  if (!parsed) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-3">
          <span className="font-mono text-destructive">{code} - Ogiltigt format</span>
        </CardContent>
      </Card>
    );
  }
  
  const domain = FAULT_DOMAINS[parsed.domain];
  const subsystems = DOMAIN_SUBSYSTEMS[parsed.domain];
  const subsystem = subsystems?.[parsed.subsystem];
  const deviationType = DEVIATION_TYPES[parsed.deviationType];
  const severityConfig = SEVERITY_CONFIG[parsed.severity];
  
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-mono text-lg">{code}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <SeverityIndicator severity={parsed.severity} />
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="font-mono text-[10px]"
            style={{ borderColor: severityConfig.color, color: severityConfig.color }}
          >
            {severityConfig.action}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Domän:</span>
            <span className="ml-2 font-mono">{domain?.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Subsystem:</span>
            <span className="ml-2 font-mono">{subsystem?.name || parsed.subsystem}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Typ:</span>
            <span className="ml-2 font-mono">{deviationType?.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Nummer:</span>
            <span className="ml-2 font-mono">{parsed.number}</span>
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">{description}</p>
          </>
        )}
        
        {/* Affected Blocks */}
        {affectedBlocks && affectedBlocks.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Påverkade mätblock:</div>
            <div className="flex flex-wrap gap-1">
              {affectedBlocks.map((block) => (
                <Badge key={block} variant="secondary" className="font-mono text-[10px]">
                  {block}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Linked Codes */}
        {linkedCodes && linkedCodes.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Kopplade felkoder:</div>
            <div className="flex flex-wrap gap-1">
              {linkedCodes.map((lc) => (
                <Badge key={lc} variant="outline" className="font-mono text-[10px]">
                  {lc}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// DOMAIN LIST
// =============================================================================

function DomainList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {(Object.entries(FAULT_DOMAINS) as [FaultDomain, { name: string; description: string }][]).map(([code, info]) => (
        <Card key={code} className="border-border/50">
          <CardContent className="py-3 text-center">
            <div className="font-mono text-xl font-bold">{code}</div>
            <div className="text-sm text-muted-foreground">{info.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================================================
// DEVIATION TYPE LIST
// =============================================================================

function DeviationTypeList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {(Object.entries(DEVIATION_TYPES) as [DeviationType, { name: string; description: string }][]).map(([code, info]) => (
        <Card key={code} className="border-border/50">
          <CardContent className="py-3">
            <div className="font-mono text-lg font-bold">{code}</div>
            <div className="text-sm font-medium">{info.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{info.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FaultCodeBrowser() {
  const [selectedDomain, setSelectedDomain] = useState<FaultDomain | 'all'>('all');
  
  const filteredCodes = selectedDomain === 'all' 
    ? ALL_PREDEFINED_FAULT_CODES
    : ALL_PREDEFINED_FAULT_CODES.filter(fc => fc.code?.startsWith(selectedDomain));
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-mono font-semibold">FELKODSTAXONOMI</h1>
        <p className="text-sm text-muted-foreground">
          OEM-klass felkodsystem för samhällsdiagnostik
        </p>
      </div>
      
      <Tabs defaultValue="codes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="codes" className="font-mono text-xs">FELKODER</TabsTrigger>
          <TabsTrigger value="domains" className="font-mono text-xs">DOMÄNER</TabsTrigger>
          <TabsTrigger value="types" className="font-mono text-xs">AVVIKELSETYPER</TabsTrigger>
          <TabsTrigger value="severity" className="font-mono text-xs">SVÅRIGHETSGRAD</TabsTrigger>
        </TabsList>
        
        <TabsContent value="codes" className="space-y-4">
          {/* Domain Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedDomain === 'all' ? 'default' : 'outline'}
              className="cursor-pointer font-mono"
              onClick={() => setSelectedDomain('all')}
            >
              ALLA
            </Badge>
            {(Object.keys(FAULT_DOMAINS) as FaultDomain[]).map((domain) => (
              <Badge
                key={domain}
                variant={selectedDomain === domain ? 'default' : 'outline'}
                className="cursor-pointer font-mono"
                onClick={() => setSelectedDomain(domain)}
              >
                {domain}
              </Badge>
            ))}
          </div>
          
          {/* Codes Grid */}
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {filteredCodes.map((fc) => (
                <FaultCodeCard
                  key={fc.code}
                  code={fc.code!}
                  description={fc.technicalDescription}
                  affectedBlocks={fc.affectedMeasureBlocks}
                  linkedCodes={fc.linkedFaultCodes}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="domains">
          <DomainList />
          
          <div className="mt-6 space-y-4">
            <h3 className="font-mono text-sm">SUBSYSTEM PER DOMÄN</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {(Object.entries(DOMAIN_SUBSYSTEMS) as [FaultDomain, Record<string, { name: string; description: string }>][]).map(([domain, subsystems]) => (
                  <Card key={domain} className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-mono text-sm">
                        {domain} - {FAULT_DOMAINS[domain].name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(subsystems).map(([code, info]) => (
                          <div key={code} className="text-xs">
                            <span className="font-mono font-bold">{code}</span>
                            <span className="text-muted-foreground ml-2">{info.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="types">
          <DeviationTypeList />
        </TabsContent>
        
        <TabsContent value="severity">
          <div className="space-y-4">
            {(Object.entries(SEVERITY_CONFIG) as [FaultSeverity, typeof SEVERITY_CONFIG[FaultSeverity]][]).map(([severity, config]) => (
              <Card key={severity} className="border-border/50">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: config.color }}
                    />
                    <div>
                      <div className="font-mono font-bold">{config.label}</div>
                      <div className="text-xs text-muted-foreground">Nummerserie: {config.range}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {config.action}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground font-mono pt-6 border-t border-border/50">
        FORMAT: [DOMÄN]-[SYSTEM]-[TYP]-[NNN] | FELKODER ÄR TEKNISKA – ALDRIG POLITISKA
      </div>
    </div>
  );
}

export default FaultCodeBrowser;
