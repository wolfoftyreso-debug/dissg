/**
 * COMPUTATIONAL CORRELATION LAYER - Main Dashboard
 * Shows co-movement across domains without causal claims
 * 
 * RULE: System identifies simultaneity and covariation – never motive, intent, or cause.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Layers, Shield, Info } from 'lucide-react';
import { DOMAIN_CONFIGS, type CorrelationDomain } from '@/types/correlation';
import { MANDATORY_DISCLAIMERS } from '@/lib/correlation/language-guard';
import { CorrelationTimeline } from './CorrelationTimeline';
import { CorrelationMatrix } from './CorrelationMatrix';
import { AntiCherryPickingPanel } from './AntiCherryPickingPanel';
import { LanguageGuardDisplay } from './LanguageGuardDisplay';

export function CorrelationDashboard() {
  const [selectedDomains, setSelectedDomains] = useState<CorrelationDomain[]>([
    'health_outcomes',
    'policy_actions',
    'macro_economy',
  ]);

  const toggleDomain = (domain: CorrelationDomain) => {
    setSelectedDomains(prev => 
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  return (
    <div className="space-y-6" data-testid="correlation-dashboard">
      {/* Mandatory disclaimer - always visible */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-warning">
                {MANDATORY_DISCLAIMERS.correlationNotCausation.en}
              </p>
              <p className="text-sm text-muted-foreground">
                {MANDATORY_DISCLAIMERS.correlationNotCausation.sv}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Domäner / Domains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(DOMAIN_CONFIGS) as [CorrelationDomain, typeof DOMAIN_CONFIGS[CorrelationDomain]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleDomain(key)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedDomains.includes(key)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-medium">{config.nameSv}</span>
                </div>
                <p className="text-xs text-left mt-1 opacity-70">{config.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tidslinje
          </TabsTrigger>
          <TabsTrigger value="matrix">Korrelationsmatris</TabsTrigger>
          <TabsTrigger value="context" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Kontext
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Språkkontroll
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <CorrelationTimeline domains={selectedDomains} />
        </TabsContent>

        <TabsContent value="matrix">
          <CorrelationMatrix domains={selectedDomains} />
        </TabsContent>

        <TabsContent value="context">
          <AntiCherryPickingPanel domains={selectedDomains} />
        </TabsContent>

        <TabsContent value="language">
          <LanguageGuardDisplay />
        </TabsContent>
      </Tabs>

      {/* What system does NOT say */}
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            Vad systemet INTE säger / What the system does NOT say
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Förbjudna formuleringar:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "A ledde till B"</li>
                <li>• "A orsakades av B"</li>
                <li>• "X gynnades av Y"</li>
                <li>• "X tjänade på Y"</li>
                <li>• "Detta bevisar att..."</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Forbidden phrases:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "A led to B"</li>
                <li>• "A was caused by B"</li>
                <li>• "X benefited from Y"</li>
                <li>• "X profited from Y"</li>
                <li>• "This proves that..."</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Systemets enda språk / The system's only language:</strong>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">Observed</Badge>
              <Badge variant="outline">Not observed</Badge>
              <Badge variant="outline">Varies by...</Badge>
              <Badge variant="outline">Data insufficient</Badge>
              <Badge variant="outline">Correlation present/absent/unstable</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
