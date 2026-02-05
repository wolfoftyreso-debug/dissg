/**
 * UNCERTAINTY & LIMITATIONS
 * 
 * Displayed as checklist. No "small print".
 * Uncertainty must be as visible as data.
 */

interface UncertaintyPanelProps {
  dataSources: string[];
  knownBiases: string[];
  missingData: string[];
  confidence: number;
}

export function UncertaintyPanel({
  dataSources,
  knownBiases,
  missingData,
  confidence
}: UncertaintyPanelProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-xs text-muted-foreground tracking-wide">
        UNCERTAINTY & LIMITATIONS
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Data Sources */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [SRC] Data Sources
          </div>
          <ul className="space-y-1">
            {dataSources.map((source, i) => (
              <li key={i} className="text-sm text-foreground">
                {source}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Known Biases */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [BIAS] Known Biases
          </div>
          <ul className="space-y-1">
            {knownBiases.length > 0 ? (
              knownBiases.map((bias, i) => (
                <li key={i} className="text-sm text-foreground">
                  {bias}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">None identified</li>
            )}
          </ul>
        </div>
        
        {/* Missing Data */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [GAP] Missing Data
          </div>
          <ul className="space-y-1">
            {missingData.length > 0 ? (
              missingData.map((gap, i) => (
                <li key={i} className="text-sm text-foreground">
                  {gap}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">None identified</li>
            )}
          </ul>
        </div>
        
        {/* Confidence */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [CONF] Confidence Score
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground/60"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-sm font-mono">
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
