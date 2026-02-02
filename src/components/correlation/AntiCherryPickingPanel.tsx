/**
 * ANTI-CHERRY-PICKING PANEL
 * Shows what else moved (and what didn't)
 * 
 * RULE: Every correlation must show context to prevent selective presentation
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus, Shield } from 'lucide-react';
import { DOMAIN_CONFIGS, type CorrelationDomain } from '@/types/correlation';
import { generateContextStatement, generateContextStatementSv } from '@/lib/correlation/anti-cherry-picking';
import type { ContextResult } from '@/lib/correlation/anti-cherry-picking';

interface Props {
  domains: CorrelationDomain[];
}

// Mock context data
const MOCK_CONTEXT: ContextResult = {
  alsoMoved: [
    { 
      variable: { id: '1', domain: 'macro_economy', code: 'gdp', name: 'BNP', description: '', unit: '%', dataSourceCode: 'scb', granularity: 'quarterly' },
      correlation: -0.62,
      direction: 'opposite',
    },
    { 
      variable: { id: '2', domain: 'policy_actions', code: 'restrictions', name: 'Restriktionsnivå', description: '', unit: 'index', dataSourceCode: 'gov', granularity: 'monthly' },
      correlation: 0.78,
      direction: 'same',
    },
    { 
      variable: { id: '3', domain: 'health_outcomes', code: 'hospital', name: 'Sjukhusinläggningar', description: '', unit: 'antal', dataSourceCode: 'scb', granularity: 'weekly' },
      correlation: 0.85,
      direction: 'same',
    },
  ],
  didNotMove: [
    { 
      variable: { id: '4', domain: 'sector_economics', code: 'retail', name: 'Detaljhandel', description: '', unit: 'index', dataSourceCode: 'scb', granularity: 'monthly' },
      correlation: 0.08,
    },
    { 
      variable: { id: '5', domain: 'macro_economy', code: 'export', name: 'Export', description: '', unit: 'mdr', dataSourceCode: 'scb', granularity: 'quarterly' },
      correlation: -0.12,
    },
  ],
  totalVariablesChecked: 15,
};

export function AntiCherryPickingPanel({ domains }: Props) {
  const contextEn = generateContextStatement(MOCK_CONTEXT);
  const contextSv = generateContextStatementSv(MOCK_CONTEXT);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Anti-Cherry-Picking Kontext
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Explanation */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <p className="text-sm">
            <strong>Varför denna vy?</strong> När en korrelation visas måste systemet 
            också visa vad <em>annat</em> som förändrades (och vad som <em>inte</em> gjorde det).
            Detta förhindrar selektiv presentation.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Why this view?</strong> When a correlation is shown, the system must 
            also show what <em>else</em> changed (and what did <em>not</em>).
            This prevents selective presentation.
          </p>
        </div>

        {/* Generated context statement */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">System statement:</h4>
          <p className="text-sm">{contextEn}</p>
          <p className="text-sm text-muted-foreground mt-1">{contextSv}</p>
        </div>

        {/* What also moved */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-primary" />
            Also changed during this period:
          </h4>
          <div className="space-y-2">
            {MOCK_CONTEXT.alsoMoved.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: DOMAIN_CONFIGS[item.variable.domain].color }}
                  />
                  <span>{item.variable.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {DOMAIN_CONFIGS[item.variable.domain].nameSv}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {item.direction === 'same' ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-mono text-sm">
                    r = {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                  </span>
                  <Badge variant={item.direction === 'same' ? 'default' : 'destructive'}>
                    {item.direction === 'same' ? 'Same direction' : 'Opposite'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What did not move */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Minus className="h-4 w-4 text-muted-foreground" />
            Did NOT show significant movement:
          </h4>
          <div className="space-y-2">
            {MOCK_CONTEXT.didNotMove.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: DOMAIN_CONFIGS[item.variable.domain].color }}
                  />
                  <span className="text-muted-foreground">{item.variable.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {DOMAIN_CONFIGS[item.variable.domain].nameSv}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    r = {item.correlation.toFixed(2)}
                  </span>
                  <Badge variant="secondary">No correlation</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <p>
            Checked {MOCK_CONTEXT.totalVariablesChecked} variables. 
            {MOCK_CONTEXT.alsoMoved.length} showed co-movement, 
            {MOCK_CONTEXT.didNotMove.length} showed no significant correlation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
