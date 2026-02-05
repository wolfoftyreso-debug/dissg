/**
 * PRIORITY MAP
 * 
 * UIE (Universal Importance Engine) in UI form.
 * Three fixed zones: Structural, Acute, Contextual.
 * No ranking. No valuation. Just system impact.
 */

interface PriorityItem {
  text: string;
}

interface PriorityMapProps {
  structural: PriorityItem[];
  acute: PriorityItem[];
  contextual: PriorityItem[];
}

function PriorityZone({ 
  label, 
  marker, 
  items,
  variant
}: { 
  label: string; 
  marker: string;
  items: PriorityItem[];
  variant: 'structural' | 'acute' | 'contextual';
}) {
  const variantStyles = {
    structural: 'border-l-muted-foreground/50 bg-muted/30',
    acute: 'border-l-amber-500/50 bg-amber-500/5',
    contextual: 'border-l-blue-500/50 bg-blue-500/5'
  };

  if (items.length === 0) return null;

  return (
    <div className={`border-l-2 pl-3 py-2 ${variantStyles[variant]}`}>
      <div className="font-mono text-xs text-muted-foreground mb-2">
        [{marker}] {label}
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-foreground">
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PriorityMap({ structural, acute, contextual }: PriorityMapProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-xs text-muted-foreground tracking-wide">
        WHAT IS IMPORTANT
      </h2>
      
      <div className="grid gap-3 md:grid-cols-3">
        <PriorityZone 
          label="Structural" 
          marker="STR" 
          items={structural}
          variant="structural"
        />
        <PriorityZone 
          label="Acute" 
          marker="ACU" 
          items={acute}
          variant="acute"
        />
        <PriorityZone 
          label="Contextual" 
          marker="CTX" 
          items={contextual}
          variant="contextual"
        />
      </div>
    </section>
  );
}
