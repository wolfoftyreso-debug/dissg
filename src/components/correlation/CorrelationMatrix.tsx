/**
 * CORRELATION MATRIX
 * Shows pairwise correlations with stability indicators
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DOMAIN_CONFIGS, type CorrelationDomain } from '@/types/correlation';
import { formatCorrelation } from '@/lib/correlation/correlation-engine';

interface Props {
  domains: CorrelationDomain[];
}

// Mock correlation data
const MOCK_CORRELATIONS: Record<string, Record<string, { r: number; stable: boolean; n: number }>> = {
  health_outcomes: {
    policy_actions: { r: 0.72, stable: true, n: 24 },
    macro_economy: { r: -0.45, stable: false, n: 24 },
    sector_economics: { r: 0.38, stable: true, n: 24 },
  },
  policy_actions: {
    health_outcomes: { r: 0.72, stable: true, n: 24 },
    macro_economy: { r: -0.28, stable: false, n: 24 },
    sector_economics: { r: 0.15, stable: false, n: 24 },
  },
  macro_economy: {
    health_outcomes: { r: -0.45, stable: false, n: 24 },
    policy_actions: { r: -0.28, stable: false, n: 24 },
    sector_economics: { r: 0.82, stable: true, n: 24 },
  },
  sector_economics: {
    health_outcomes: { r: 0.38, stable: true, n: 24 },
    policy_actions: { r: 0.15, stable: false, n: 24 },
    macro_economy: { r: 0.82, stable: true, n: 24 },
  },
};

function getCorrelationColor(r: number): string {
  const absR = Math.abs(r);
  if (absR < 0.2) return 'hsl(var(--muted))';
  if (absR < 0.4) return r > 0 ? 'hsl(210, 70%, 80%)' : 'hsl(0, 70%, 80%)';
  if (absR < 0.7) return r > 0 ? 'hsl(210, 70%, 60%)' : 'hsl(0, 70%, 60%)';
  return r > 0 ? 'hsl(210, 70%, 40%)' : 'hsl(0, 70%, 40%)';
}

function getCorrelationLabel(r: number): string {
  const absR = Math.abs(r);
  if (absR < 0.2) return 'None';
  if (absR < 0.4) return 'Weak';
  if (absR < 0.7) return 'Moderate';
  return 'Strong';
}

export function CorrelationMatrix({ domains }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Korrelationsmatris / Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Disclaimer */}
        <div className="mb-4 p-3 bg-warning/10 rounded-lg text-sm">
          <p className="text-warning">
            <strong>Note:</strong> Correlation coefficient (r) measures linear relationship strength.
            Values near ±1 indicate strong co-movement. This is mathematics, not causation.
          </p>
        </div>

        {/* Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left"></th>
                {domains.map(domain => (
                  <th key={domain} className="p-2 text-center text-sm">
                    <div className="flex flex-col items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: DOMAIN_CONFIGS[domain].color }}
                      />
                      <span>{DOMAIN_CONFIGS[domain].nameSv}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domains.map(rowDomain => (
                <tr key={rowDomain}>
                  <td className="p-2 text-sm font-medium">
                    {DOMAIN_CONFIGS[rowDomain].nameSv}
                  </td>
                  {domains.map(colDomain => {
                    if (rowDomain === colDomain) {
                      return (
                        <td key={colDomain} className="p-2 text-center">
                          <div className="w-16 h-16 mx-auto bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">—</span>
                          </div>
                        </td>
                      );
                    }
                    
                    const corr = MOCK_CORRELATIONS[rowDomain]?.[colDomain];
                    if (!corr) return <td key={colDomain} className="p-2" />;
                    
                    return (
                      <td key={colDomain} className="p-2">
                        <div 
                          className="w-16 h-16 mx-auto rounded flex flex-col items-center justify-center gap-1"
                          style={{ backgroundColor: getCorrelationColor(corr.r) }}
                        >
                          <span className="font-mono text-sm font-bold text-white">
                            {formatCorrelation(corr.r)}
                          </span>
                          <Badge 
                            variant={corr.stable ? 'default' : 'secondary'}
                            className="text-[10px] px-1 py-0"
                          >
                            {corr.stable ? 'Stable' : 'Unstable'}
                          </Badge>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium">Legend:</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(0.8) }} />
              <span className="text-sm">Strong positive (+0.7 to +1.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(0.5) }} />
              <span className="text-sm">Moderate positive (+0.4 to +0.7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(0.1) }} />
              <span className="text-sm">No/weak correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(-0.5) }} />
              <span className="text-sm">Moderate negative</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(-0.8) }} />
              <span className="text-sm">Strong negative</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-2">
            <div className="flex items-center gap-2">
              <Badge>Stable</Badge>
              <span className="text-sm text-muted-foreground">Consistent across subperiods</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Unstable</Badge>
              <span className="text-sm text-muted-foreground">Varies across subperiods</span>
            </div>
          </div>
        </div>

        {/* Interpretation note */}
        <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium">How to read this:</p>
          <p className="text-muted-foreground mt-1">
            Each cell shows the Pearson correlation (r) between two domains. 
            "Stable" means the correlation is consistent when the time period is divided into subperiods.
            This is pure statistics — interpretation is your responsibility.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
