/**
 * WHAT THIS DOES NOT MEAN
 * 
 * Obligatory section. Always visible.
 * This is protection, not disclaimer.
 */

interface WhatThisDoesNotMeanProps {
  exclusions: string[];
}

export function WhatThisDoesNotMean({ exclusions }: WhatThisDoesNotMeanProps) {
  if (exclusions.length === 0) return null;
  
  return (
    <section className="space-y-3 p-3 bg-muted/30 border border-border rounded">
      <h2 className="font-mono text-xs text-muted-foreground tracking-wide">
        [!] WHAT THIS DOES NOT MEAN
      </h2>
      
      <ul className="space-y-1">
        {exclusions.map((exclusion, i) => (
          <li 
            key={i}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <span className="font-mono shrink-0">[—]</span>
            <span>{exclusion}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
