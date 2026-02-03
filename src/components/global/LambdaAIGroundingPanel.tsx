/**
 * LAMBDA AI GROUNDING PANEL
 * 
 * "The truth layer for machine cognition"
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  CheckCircle2, 
  XCircle,
  Link,
  FileJson,
  Shield,
  Zap,
  Database,
} from 'lucide-react';
import {
  GROUNDING_ENDPOINTS,
  AI_AGENT_STRICT_MODE,
  AI_RESPONSE_CONSTRAINTS,
  ANTI_HALLUCINATION,
  VERIFICATION_RESPONSES,
  AI_GROUNDING_PHILOSOPHY,
  GROUNDING_DOCTRINE,
} from '@/config/lambdaAIGroundingProtocol';

interface LambdaAIGroundingPanelProps {
  language?: 'sv' | 'en';
  showEndpoints?: boolean;
}

export const LambdaAIGroundingPanel: React.FC<LambdaAIGroundingPanelProps> = ({
  language = 'sv',
  showEndpoints = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Philosophy header */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                {AI_GROUNDING_PHILOSOPHY.principle[language]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {AI_GROUNDING_PHILOSOPHY.goal[language]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      {showEndpoints && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              {language === 'sv' ? 'Grounding API Endpoints' : 'Grounding API Endpoints'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {GROUNDING_ENDPOINTS.map((endpoint) => (
                <div key={endpoint.path} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {endpoint.method}
                    </Badge>
                    <code className="text-xs font-mono text-primary">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {endpoint.description[language]}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {endpoint.latency}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      {endpoint.caching}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strict Mode Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {language === 'sv' ? 'AI Agent Strict Mode' : 'AI Agent Strict Mode'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Tillåtna operationer' : 'Allowed Operations'}
              </div>
              <ul className="space-y-1">
                {AI_AGENT_STRICT_MODE.allowed_operations.map(op => (
                  <li key={op} className="text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    {op.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {language === 'sv' ? 'Förbjudna operationer' : 'Forbidden Operations'}
              </div>
              <ul className="space-y-1">
                {AI_AGENT_STRICT_MODE.forbidden_operations.map(op => (
                  <li key={op} className="text-xs flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-destructive" />
                    {op.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {language === 'sv' ? 'Svarsmall' : 'Response Template'}
            </div>
            <code className="text-xs bg-muted p-2 rounded block">
              {AI_RESPONSE_CONSTRAINTS.template[language]}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Response Constraints */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-primary">
              {language === 'sv' ? 'Måste inkludera' : 'Must Include'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {AI_RESPONSE_CONSTRAINTS.must_include.map(item => (
                <li key={item} className="text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {item.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-destructive">
              {language === 'sv' ? 'Får aldrig inkludera' : 'Must Never Include'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {AI_RESPONSE_CONSTRAINTS.must_not_include.map(item => (
                <li key={item} className="text-xs flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-destructive" />
                  {item.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Anti-Hallucination */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {language === 'sv' ? 'Anti-hallucinationsskydd' : 'Anti-Hallucination Protection'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            {ANTI_HALLUCINATION.measures.map((measure, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {measure[language]}
              </li>
            ))}
          </ul>
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm font-medium">
              "{ANTI_HALLUCINATION.fail_mode[language]}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            {language === 'sv' ? 'Verifieringssvar' : 'Verification Responses'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(VERIFICATION_RESPONSES).map(([key, value]) => (
              <div key={key} className={`p-2 rounded text-center text-xs ${
                key === 'VERIFIED' ? 'bg-primary/10' :
                key === 'PARTIALLY_VERIFIED' ? 'bg-yellow-500/10' :
                key === 'CONTRADICTED' ? 'bg-destructive/10' :
                'bg-muted'
              }`}>
                <div className="font-mono font-bold mb-1">{key}</div>
                <div className="text-muted-foreground">{value[language]}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Doctrine */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6 text-center">
          <p className="text-sm italic">
            "{GROUNDING_DOCTRINE[language]}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LambdaAIGroundingPanel;
