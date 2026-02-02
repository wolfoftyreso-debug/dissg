/**
 * Simplified Page Layout
 * 
 * Enforces design rules:
 * - Single primary column
 * - Strict heading hierarchy
 * - No decorative elements
 * - Consistent layout per page type
 */

import { cn } from '@/lib/utils';
import { 
  SimplifiedSummary, 
  WhatThisShowsBlock,
  SemanticLinkGroup 
} from '@/components/content/SimplifiedContentBlock';

interface SimplifiedPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main page container - single column, no decorations
 */
export function SimplifiedPageLayout({ children, className }: SimplifiedPageLayoutProps) {
  return (
    <main className={cn(
      'max-w-3xl mx-auto px-4 py-8',
      'space-y-8',
      className
    )}>
      {children}
    </main>
  );
}

interface PageHeaderProps {
  h1: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
}

/**
 * Page header - H1 only, optional subtitle
 */
export function PageHeader({ h1, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      {/* Breadcrumb - minimal */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="text-sm text-muted-foreground">
          {breadcrumb.map((item, i) => (
            <span key={i}>
              <a href={item.href} className="hover:text-foreground">
                {item.label}
              </a>
              {i < breadcrumb.length - 1 && ' / '}
            </span>
          ))}
        </nav>
      )}
      
      {/* H1 - the only large text */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
        {h1}
      </h1>
      
      {/* Subtitle - if needed */}
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}

interface FactPageProps {
  title: string;
  breadcrumb?: { label: string; href: string }[];
  summary: string[];
  whatThisShows: string;
  whatThisDoesNotShow: string[];
  children: React.ReactNode; // Data visualization
  contextLinks: { href: string; label: string; reason: string }[];
  evidenceLinks: { href: string; label: string; reason: string }[];
  sources: { name: string; url: string }[];
}

/**
 * Complete Fact Page Template
 * 
 * Order enforced:
 * 1. H1
 * 2. Summary (max 3 sentences)
 * 3. What this shows / does not show
 * 4. Data visualization
 * 5. Links (max 12 total)
 * 6. Sources
 */
export function FactPageTemplate({
  title,
  breadcrumb,
  summary,
  whatThisShows,
  whatThisDoesNotShow,
  children,
  contextLinks,
  evidenceLinks,
  sources,
}: FactPageProps) {
  const allLinks = [
    ...contextLinks.map(l => ({ ...l, type: 'context' as const })),
    ...evidenceLinks.map(l => ({ ...l, type: 'evidence' as const })),
  ];
  
  return (
    <SimplifiedPageLayout>
      <PageHeader h1={title} breadcrumb={breadcrumb} />
      
      <SimplifiedSummary sentences={summary} />
      
      <WhatThisShowsBlock 
        shows={whatThisShows} 
        doesNotShow={whatThisDoesNotShow} 
      />
      
      {/* Data - the main content */}
      <section className="py-4">
        {children}
      </section>
      
      {/* Navigation links - strictly typed */}
      <SemanticLinkGroup links={allLinks} />
      
      {/* Sources - minimal */}
      <footer className="pt-4 border-t border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Sources
        </h3>
        <ul className="text-sm space-y-1">
          {sources.map((source, i) => (
            <li key={i}>
              <a 
                href={source.url} 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </SimplifiedPageLayout>
  );
}

interface IndicatorPageProps {
  title: string;
  breadcrumb?: { label: string; href: string }[];
  definition: string;
  method: string;
  unit: string;
  dataAvailability: {
    countries: number;
    regions: number;
    timeRange: string;
  };
  children?: React.ReactNode;
}

/**
 * Indicator Page Template
 */
export function IndicatorPageTemplate({
  title,
  breadcrumb,
  definition,
  method,
  unit,
  dataAvailability,
  children,
}: IndicatorPageProps) {
  return (
    <SimplifiedPageLayout>
      <PageHeader h1={title} breadcrumb={breadcrumb} />
      
      {/* Definition - single clear statement */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Definition</h2>
        <p className="text-foreground/90">{definition}</p>
      </section>
      
      {/* Method - extremely short */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Method</h2>
        <p className="text-foreground/90">{method}</p>
      </section>
      
      {/* Unit */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Unit</h2>
        <p className="text-foreground/90 font-mono">{unit}</p>
      </section>
      
      {/* Data availability */}
      <section className="bg-muted/30 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Data Availability</h2>
        <dl className="grid grid-cols-3 gap-4 text-center">
          <div>
            <dt className="text-sm text-muted-foreground">Countries</dt>
            <dd className="text-xl font-bold">{dataAvailability.countries}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Regions</dt>
            <dd className="text-xl font-bold">{dataAvailability.regions}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Time Range</dt>
            <dd className="text-xl font-bold">{dataAvailability.timeRange}</dd>
          </div>
        </dl>
      </section>
      
      {children}
    </SimplifiedPageLayout>
  );
}
