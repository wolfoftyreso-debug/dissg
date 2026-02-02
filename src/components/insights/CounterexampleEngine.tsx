/**
 * WAVE 9: BLOCK BX — COUNTEREXAMPLE ENGINE
 * BLOCK BZ — "PROVE ME WRONG" MODE
 * 
 * "Här gäller detta inte" bygger förtroende snabbare än något annat.
 * Kritik inbyggd = oöverträffad trovärdighet.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ChevronDown,
  ChevronUp,
  Shield,
  Eye,
  Info
} from 'lucide-react';
import { 
  WEAKNESS_TYPE_LABELS, 
  DEFAULT_PROVE_WRONG_CONFIG 
} from '@/config/publicLearningConfig';

interface CounterexampleCardProps {
  patternId: string;
  patternDescription: string;
  counterexamples: {
    location: string;
    period: string;
    observation: string;
    potentialExplanations: string[];
    confidence: number;
  }[];
}

export function CounterexampleCard({ 
  patternDescription, 
  counterexamples 
}: CounterexampleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (counterexamples.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-yellow-500/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Här gäller detta inte
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {counterexamples.length} motexempel
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="text-sm text-muted-foreground">
                Mönstret "{patternDescription.slice(0, 50)}..." gäller inte överallt
              </span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-2">
            {counterexamples.map((ce, idx) => (
              <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-sm">{ce.location}</span>
                  <span className="text-xs text-muted-foreground">({ce.period})</span>
                </div>
                
                <p className="text-sm">{ce.observation}</p>
                
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Möjliga förklaringar:</span>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {ce.potentialExplanations.map((exp, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="mt-1">•</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Konfidens: {(ce.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// ============================================================
// PROVE ME WRONG PANEL
// ============================================================

interface ProveWrongPanelProps {
  insightId: string;
  insightTitle: string;
  weaknesses?: {
    type: string;
    description: string;
    severity: 'critical' | 'significant' | 'minor';
    impact: string;
  }[];
  alternativeInterpretations?: {
    interpretation: string;
    plausibility: 'high' | 'moderate' | 'low';
  }[];
  limitations?: string[];
}

export function ProveWrongPanel({
  insightTitle,
  weaknesses = [],
  alternativeInterpretations = [],
  limitations = []
}: ProveWrongPanelProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const config = DEFAULT_PROVE_WRONG_CONFIG;
  if (!config.enabled) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-status-critical';
      case 'significant': return 'text-status-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getPlausibilityBadge = (plausibility: string) => {
    switch (plausibility) {
      case 'high': return <Badge className="bg-status-positive text-primary-foreground text-xs">Hög</Badge>;
      case 'moderate': return <Badge variant="secondary" className="text-xs">Måttlig</Badge>;
      default: return <Badge variant="outline" className="text-xs">Låg</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Ifrågasätt denna insikt
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          "{insightTitle}"
        </p>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {/* Weaknesses */}
        {weaknesses.length > 0 && config.features.includes('weaknesses') && (
          <Collapsible 
            open={activeSection === 'weaknesses'} 
            onOpenChange={(open) => setActiveSection(open ? 'weaknesses' : null)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Visa svagheter</span>
                </span>
                <Badge variant="outline" className="text-xs">{weaknesses.length}</Badge>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {weaknesses.map((weakness, idx) => (
                <div key={idx} className="p-2 bg-muted/50 rounded text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={getSeverityColor(weakness.severity)}>
                      {WEAKNESS_TYPE_LABELS[weakness.type]?.sv || weakness.type}
                    </span>
                    <Badge variant="outline" className="text-xs">{weakness.severity}</Badge>
                  </div>
                  <p className="text-muted-foreground">{weakness.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Påverkan:</strong> {weakness.impact}
                  </p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Alternative Interpretations */}
        {alternativeInterpretations.length > 0 && config.features.includes('alternative_interpretations') && (
          <Collapsible 
            open={activeSection === 'alternatives'} 
            onOpenChange={(open) => setActiveSection(open ? 'alternatives' : null)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Alternativa tolkningar</span>
                </span>
                <Badge variant="outline" className="text-xs">{alternativeInterpretations.length}</Badge>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {alternativeInterpretations.map((alt, idx) => (
                <div key={idx} className="p-2 bg-muted/50 rounded text-sm flex items-start justify-between gap-2">
                  <p className="text-muted-foreground">{alt.interpretation}</p>
                  {getPlausibilityBadge(alt.plausibility)}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Limitations */}
        {limitations.length > 0 && (
          <Collapsible 
            open={activeSection === 'limitations'} 
            onOpenChange={(open) => setActiveSection(open ? 'limitations' : null)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Begränsningar</span>
                </span>
                <Badge variant="outline" className="text-xs">{limitations.length}</Badge>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {limitations.map((limit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground mt-3">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            Kritiskt granskande är inbyggt i systemet. 
            Alla insikter ska kunna ifrågasättas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
