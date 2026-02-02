/**
 * 📄 FACT PAGE TEMPLATE
 * 
 * Block 44: AI + Google optimized fact page structure
 * 
 * This is the canonical template for all fact pages.
 * Every element is intentional for SEO and AI discoverability.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, AlertCircle, Clock, MapPin, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  createDatasetSchema, 
  createBreadcrumbSchema,
  generateCitations,
  type FactPageStructure 
} from '@/config/seoFactStructureConfig';

interface FactPageProps {
  fact: FactPageStructure;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

/**
 * Structured Data Component
 * Renders JSON-LD for Google/AI understanding
 */
function StructuredData({ fact, value }: { fact: FactPageStructure; value: number | string }) {
  const datasetSchema = createDatasetSchema({
    name: fact.h1,
    description: fact.summary,
    startYear: parseInt(fact.timeSpan.split('–')[0]),
    endYear: parseInt(fact.timeSpan.split('–')[1]),
    spatialCoverage: fact.geographicLevel,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    contentUrl: fact.citationUrl,
  });

  const breadcrumbItems = [
    { name: 'Facts', url: '/facts/' },
    { name: fact.geographicLevel, url: fact.links.parent },
  ];

  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

/**
 * Breadcrumb Navigation
 * Semantic hierarchy visible to users and crawlers
 */
function Breadcrumbs({ fact }: { fact: FactPageStructure }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
      <ol className="flex items-center gap-1 flex-wrap">
        <li>
          <Link to="/facts/" className="hover:text-foreground transition-colors">
            Facts
          </Link>
        </li>
        <ChevronRight className="h-3 w-3" />
        <li>
          <Link to={fact.links.parent} className="hover:text-foreground transition-colors">
            {fact.geographicLevel}
          </Link>
        </li>
        <ChevronRight className="h-3 w-3" />
        <li className="text-foreground font-medium" aria-current="page">
          {fact.h1}
        </li>
      </ol>
    </nav>
  );
}

/**
 * Uncertainty Badge
 * Always visible, always honest
 */
function UncertaintyBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { label: 'High confidence', className: 'bg-emerald-100 text-emerald-800' },
    medium: { label: 'Moderate confidence', className: 'bg-amber-100 text-amber-800' },
    high: { label: 'Significant uncertainty', className: 'bg-rose-100 text-rose-800' },
  };

  const { label, className } = config[level];

  return (
    <Badge variant="outline" className={className}>
      <AlertCircle className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

/**
 * Source Attribution
 * Prominent, clickable, verifiable
 */
function SourceAttribution({ sources }: { sources: string[] }) {
  return (
    <div className="border-l-2 border-muted pl-4 py-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Sources</p>
      <ul className="space-y-1">
        {sources.map((source, i) => (
          <li key={i}>
            <Link 
              to={`/sources/${source.toLowerCase().replace(/\s+/g, '-')}/`}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {source}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Citation Block
 * Makes it trivially easy for AI/humans to cite
 */
function CitationBlock({ fact }: { fact: FactPageStructure }) {
  const citations = generateCitations({
    statement: fact.h1,
    source: fact.sources[0],
    year: parseInt(fact.timeSpan.split('–')[1]),
    url: fact.citationUrl,
    accessDate: new Date().toISOString().split('T')[0],
  });

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Cite this fact
        </p>
        <code className="block text-xs bg-background p-2 rounded border overflow-x-auto">
          {citations.apa}
        </code>
        <p className="text-xs text-muted-foreground mt-2">
          Permanent URL: <a href={fact.citationUrl} className="text-primary">{fact.citationUrl}</a>
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Related Links
 * Semantic connections, not decorative
 */
function RelatedLinks({ fact }: { fact: FactPageStructure }) {
  return (
    <nav aria-label="Related content">
      <h2 className="text-sm font-semibold mb-3">Related</h2>
      <ul className="space-y-2 text-sm">
        <li>
          <Link 
            to={fact.links.indicator}
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" />
            View indicator time series
          </Link>
        </li>
        <li>
          <Link 
            to={fact.links.question}
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" />
            Related Big Question
          </Link>
        </li>
        <li>
          <Link 
            to={fact.links.history}
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Historical context
          </Link>
        </li>
        {fact.links.children?.map((child, i) => (
          <li key={i}>
            <Link 
              to={child}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-3 w-3 inline" />
              View sub-regions
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Main Fact Page Component
 * 
 * Structure optimized for:
 * - Google crawlers (semantic HTML, structured data)
 * - AI agents (clear statement, sources, citability)
 * - Human readers (scannable, trustworthy)
 */
export function FactPageTemplate({ fact, value, unit, trend, lastUpdated }: FactPageProps) {
  return (
    <>
      {/* Structured Data (invisible to users, visible to crawlers) */}
      <StructuredData fact={fact} value={value} />

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs fact={fact} />

        {/* Main Heading (H1) - The fact statement */}
        <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
          {fact.h1}
        </h1>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {fact.geographicLevel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {fact.timeSpan}
          </Badge>
          <UncertaintyBadge level={fact.uncertainty} />
        </div>

        {/* Summary - 2-4 sentences */}
        <p className="text-base text-foreground/90 leading-relaxed mb-6">
          {fact.summary}
        </p>

        {/* Current value (if applicable) */}
        {value !== undefined && (
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Current value
            </p>
            <p className="text-3xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {unit && <span className="text-lg font-normal text-muted-foreground ml-1">{unit}</span>}
            </p>
            {trend && (
              <p className="text-sm text-muted-foreground mt-1">
                Trend: {trend === 'up' ? '↑ Increasing' : trend === 'down' ? '↓ Decreasing' : '→ Stable'}
              </p>
            )}
          </div>
        )}

        {/* Sources */}
        <div className="mb-6">
          <SourceAttribution sources={fact.sources} />
        </div>

        {/* Citation block */}
        <div className="mb-6">
          <CitationBlock fact={fact} />
        </div>

        {/* Related content */}
        <div className="border-t pt-6">
          <RelatedLinks fact={fact} />
        </div>

        {/* Footer metadata */}
        <footer className="mt-8 pt-4 border-t text-xs text-muted-foreground">
          <p>
            Fact ID: <code className="bg-muted px-1 rounded">{fact.factId}</code>
          </p>
          <p>
            Last updated: {lastUpdated}
          </p>
          <p>
            <Link to={fact.citationUrl} className="text-primary hover:underline">
              Permanent citation URL
            </Link>
          </p>
        </footer>
      </article>
    </>
  );
}

export default FactPageTemplate;
