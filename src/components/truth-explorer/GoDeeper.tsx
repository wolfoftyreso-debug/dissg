/**
 * GO DEEPER / NEXT VALID QUESTIONS
 * 
 * The knowledge engine. Three columns:
 * - Deeper: more granular data, longer time series
 * - Related: connected nodes, other domains
 * - Next Questions: valid questions to explore
 * 
 * No "what should I do?" links. Just understand more.
 */

interface GoDeeperLink {
  id: string;
  label: string;
}

interface GoDeeperProps {
  deeper: GoDeeperLink[];
  related: GoDeeperLink[];
  nextQuestions: string[];
  onNavigate: (nodeId: string) => void;
}

export function GoDeeper({ deeper, related, nextQuestions, onNavigate }: GoDeeperProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-xs text-muted-foreground tracking-wide">
        EXPLORE FURTHER
      </h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Deeper */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [↓] GO DEEPER
          </div>
          <ul className="space-y-1">
            {deeper.length > 0 ? (
              deeper.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-sm text-foreground hover:text-primary transition-colors text-left w-full"
                  >
                    [→] {link.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Maximum depth reached</li>
            )}
          </ul>
        </div>
        
        {/* Related */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [↔] RELATED
          </div>
          <ul className="space-y-1">
            {related.length > 0 ? (
              related.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-sm text-foreground hover:text-primary transition-colors text-left w-full"
                  >
                    [→] {link.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No related nodes</li>
            )}
          </ul>
        </div>
        
        {/* Next Valid Questions */}
        <div className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">
            [?] NEXT VALID QUESTIONS
          </div>
          <ul className="space-y-1">
            {nextQuestions.length > 0 ? (
              nextQuestions.map((question, i) => (
                <li 
                  key={i}
                  className="text-sm text-muted-foreground"
                >
                  {question}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Exploring options...</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
