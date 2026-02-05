/**
 * WHY THIS MATTERS
 * 
 * 3-5 points max. Machine-generated from Semantic Output.
 * Must be readable aloud without sounding like an opinion.
 */

interface WhyThisMatterProps {
  reasons: string[];
}

export function WhyThisMatters({ reasons }: WhyThisMatterProps) {
  if (reasons.length === 0) return null;
  
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-xs text-muted-foreground tracking-wide">
        WHY THIS MATTERS
      </h2>
      
      <ul className="space-y-2">
        {reasons.slice(0, 5).map((reason, i) => (
          <li 
            key={i}
            className="flex items-start gap-2 text-sm text-foreground"
          >
            <span className="font-mono text-muted-foreground shrink-0">[{i + 1}]</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
