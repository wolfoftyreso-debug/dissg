/**
 * 🔗 MASTER EXECUTION BLOCK 48
 * 
 * Semantic Link Section Component
 * 
 * Renders grouped links in semantic HTML for SEO:
 * - Links in content (not footer only)
 * - Proper anchor text (fact descriptions, never "read more")
 * - All internal links: follow (never nofollow)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkGroup, SemanticLink } from '@/lib/seo/linkTypes';

interface SemanticLinkSectionProps {
  /** Grouped links from useSemanticLinks */
  groups: LinkGroup[];
  
  /** Optional: render all as flat list */
  flat?: boolean;
  
  /** Optional: custom class for section */
  className?: string;
}

/**
 * Renders semantic links in SEO-optimal HTML structure
 */
export function SemanticLinkSection({ 
  groups, 
  flat = false,
  className = '',
}: SemanticLinkSectionProps) {
  if (groups.length === 0) {
    return null;
  }
  
  // Flat mode: single list of all links
  if (flat) {
    const allLinks = groups.flatMap(g => g.links);
    return (
      <section className={`mb-6 ${className}`}>
        <h2 className="text-base font-medium text-foreground mb-2">
          Related facts
        </h2>
        <LinkList links={allLinks} />
      </section>
    );
  }
  
  // Grouped mode: sections by category
  return (
    <div className={className}>
      {groups.map((group) => (
        <section key={group.category} className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            {group.heading}
          </h2>
          <LinkList links={group.links} />
        </section>
      ))}
    </div>
  );
}

/**
 * Internal: renders a list of links
 */
function LinkList({ links }: { links: SemanticLink[] }) {
  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={`${link.url}-${index}`}>
          <Link
            to={link.url}
            className="group flex items-center gap-2 p-2 -mx-2 rounded-md text-sm text-primary hover:bg-primary/10 hover:underline transition-colors cursor-pointer"
            aria-label={link.ariaLabel}
          >
            <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary">[→]</span>
            <span className="flex-1">{link.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Minimal variant for inline use
 */
export function InlineSemanticLinks({ 
  links,
  maxLinks = 5,
}: { 
  links: SemanticLink[];
  maxLinks?: number;
}) {
  const displayLinks = links.slice(0, maxLinks);
  
  if (displayLinks.length === 0) {
    return null;
  }
  
  return (
    <span className="text-sm text-foreground/80">
      <span className="font-mono text-[10px] text-muted-foreground mr-1">[RELATERAT]</span>
      {displayLinks.map((link, index) => (
        <React.Fragment key={link.url}>
          <Link
            to={link.url}
            className="text-primary hover:underline hover:bg-primary/10 px-1 py-0.5 rounded cursor-pointer transition-colors"
          >
            {link.title}
          </Link>
          {index < displayLinks.length - 1 && ', '}
        </React.Fragment>
      ))}
    </span>
  );
}

export default SemanticLinkSection;
