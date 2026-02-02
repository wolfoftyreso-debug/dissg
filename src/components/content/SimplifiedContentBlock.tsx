/**
 * Simplified Content Block
 * 
 * Forces clinical clarity:
 * - Max 3 sentences for summary
 * - Max 5 lines per section
 * - Only data/method/limitation sentences allowed
 */

import { cn } from '@/lib/utils';

interface SimplifiedSummaryProps {
  sentences: string[];
  className?: string;
}

/**
 * Summary block - max 3 sentences
 */
export function SimplifiedSummary({ sentences, className }: SimplifiedSummaryProps) {
  // Enforce max 3 sentences
  const displaySentences = sentences.slice(0, 3);
  
  return (
    <div className={cn('text-lg text-foreground/90 leading-relaxed', className)}>
      {displaySentences.map((sentence, i) => (
        <span key={i}>
          {sentence}
          {i < displaySentences.length - 1 && ' '}
        </span>
      ))}
    </div>
  );
}

interface WhatThisShowsProps {
  shows: string;
  doesNotShow: string[];
  className?: string;
}

/**
 * What This Shows / Does Not Show - must appear early on page
 */
export function WhatThisShowsBlock({ shows, doesNotShow, className }: WhatThisShowsProps) {
  return (
    <div className={cn('space-y-4 py-4 border-y border-border/50', className)}>
      {/* What it shows - single clear statement */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
          What this shows
        </h3>
        <p className="text-foreground font-medium">{shows}</p>
      </div>
      
      {/* What it does NOT show - list format */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
          What this does NOT show
        </h3>
        <ul className="text-foreground/80 space-y-1">
          {doesNotShow.slice(0, 4).map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-muted-foreground">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface SectionBlockProps {
  title: string;
  content: string;
  className?: string;
}

/**
 * Section block - enforces max 5 lines
 */
export function SectionBlock({ title, content, className }: SectionBlockProps) {
  // Split into lines and enforce max
  const lines = content.split('\n').filter(Boolean);
  const displayLines = lines.slice(0, 5);
  const truncated = lines.length > 5;
  
  return (
    <section className={cn('space-y-2', className)}>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="text-foreground/80 leading-relaxed">
        {displayLines.map((line, i) => (
          <p key={i} className="mb-1">{line}</p>
        ))}
        {truncated && (
          <p className="text-muted-foreground text-sm italic">
            [Content truncated for clarity]
          </p>
        )}
      </div>
    </section>
  );
}

interface SemanticLinkProps {
  type: 'context' | 'evidence' | 'comparison';
  href: string;
  label: string;
  reason: string;
}

/**
 * Semantic link - must declare its type and reason
 */
export function SemanticLink({ type, href, label, reason }: SemanticLinkProps) {
  const typeLabels = {
    context: '↑',
    evidence: '↓',
    comparison: '↔',
  };
  
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-primary hover:underline"
      title={reason}
    >
      <span className="text-muted-foreground text-xs">{typeLabels[type]}</span>
      <span>{label}</span>
    </a>
  );
}

interface LinkGroupProps {
  links: SemanticLinkProps[];
  className?: string;
}

/**
 * Link group - max 12 links, grouped by type
 */
export function SemanticLinkGroup({ links, className }: LinkGroupProps) {
  // Enforce max 12 links
  const displayLinks = links.slice(0, 12);
  
  const contextLinks = displayLinks.filter(l => l.type === 'context');
  const evidenceLinks = displayLinks.filter(l => l.type === 'evidence');
  const comparisonLinks = displayLinks.filter(l => l.type === 'comparison');
  
  return (
    <nav className={cn('space-y-3', className)}>
      {contextLinks.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Context
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {contextLinks.map((link, i) => (
              <SemanticLink key={i} {...link} />
            ))}
          </div>
        </div>
      )}
      
      {evidenceLinks.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Evidence
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {evidenceLinks.map((link, i) => (
              <SemanticLink key={i} {...link} />
            ))}
          </div>
        </div>
      )}
      
      {comparisonLinks.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Compare
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {comparisonLinks.map((link, i) => (
              <SemanticLink key={i} {...link} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
