/**
 * 🧱 MASTER EXECUTION BLOCK 45
 * 
 * CANONICAL FACT PAGE — HTML / SEO / AI TEMPLATE (FINAL)
 * 
 * Purpose:
 * - Contains one verifiable claim
 * - Machine and human readable
 * - Can be cited in isolation
 * - Stable over time
 * - Works without JS, CSS, or images
 * 
 * 📌 1 page = 1 fact statement
 * 
 * CRITICAL RULES (NEVER BREAK):
 * ❌ No images
 * ❌ No graphs in HTML (graphs via API separately)
 * ❌ No value words
 * ❌ No CTAs
 * ❌ No forms
 * ✅ Text
 * ✅ Structure
 * ✅ Links
 * ✅ Sources
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// ============================================================
// TYPES
// ============================================================

export interface FactPageData {
  // Core identifiers
  factId: string;
  topic: string;
  scope: 'global' | 'country' | 'region' | 'municipality';
  location: string;
  locationCode: string; // ISO code
  timeRange: string; // "1990-2024"
  
  // Content
  title: string; // H1 text
  description: string; // Meta description
  summary: string; // Main paragraph (2-4 sentences)
  whatThisDescribes: string; // Explanation paragraph
  
  // Metadata
  sources: Array<{
    name: string;
    type: 'observed' | 'estimated' | 'calculated';
    url?: string;
  }>;
  
  uncertainty: string; // Explicit limitations text
  
  // Links
  relatedFacts: Array<{
    url: string;
    title: string;
  }>;
  
  parentUrl?: string;
  
  // Technical
  canonicalUrl: string;
  lastUpdated: string;
  version: string;
}

// ============================================================
// STRUCTURED DATA (SCHEMA.ORG)
// ============================================================

function generateDatasetSchema(fact: FactPageData) {
  const [startYear, endYear] = fact.timeRange.split('-');
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: fact.title,
    description: fact.description,
    temporalCoverage: `${startYear}/${endYear}`,
    spatialCoverage: fact.locationCode,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      name: 'Global Reality Index',
    },
    dateModified: fact.lastUpdated,
    version: fact.version,
  };
}

function generateBreadcrumbSchema(fact: FactPageData, baseUrl: string) {
  const items = [
    { name: 'Facts', url: `${baseUrl}/facts/` },
    { name: fact.topic, url: `${baseUrl}/facts/${fact.topic}/` },
    { name: fact.scope, url: `${baseUrl}/facts/${fact.topic}/${fact.scope}/` },
    { name: fact.location, url: fact.canonicalUrl },
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface FactPageTemplateProps {
  fact: FactPageData;
  baseUrl?: string;
}

/**
 * Canonical Fact Page Template
 * 
 * Ultra-minimal, semantic HTML optimized for:
 * - Google indexing (< 100ms load)
 * - AI agent citation (stable, quotable)
 * - Human understanding (clear, honest)
 * 
 * NO: images, graphs, CTAs, forms, value words
 * YES: text, structure, links, sources
 */
export function FactPageTemplate({ fact, baseUrl = '' }: FactPageTemplateProps) {
  const datasetSchema = generateDatasetSchema(fact);
  const breadcrumbSchema = generateBreadcrumbSchema(fact, baseUrl);
  
  return (
    <>
      {/* HEAD - Meta tags and structured data */}
      <Helmet>
        <html lang="en" />
        <title>{fact.title} – Verified data overview</title>
        <meta name="description" content={fact.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={fact.canonicalUrl} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(datasetSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* BODY - Pure semantic HTML */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {/* H1 - The fact statement */}
        <h1 className="text-xl font-semibold text-foreground mb-4">
          {fact.title}
        </h1>

        {/* Summary - 2-4 sentences, neutral, descriptive */}
        <p className="text-base text-foreground/90 mb-6 leading-relaxed">
          {fact.summary}
        </p>

        {/* What this fact describes */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            What this fact describes
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {fact.whatThisDescribes}
          </p>
        </section>

        {/* Time span */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Time span
          </h2>
          <p className="text-sm text-foreground/80">
            {fact.timeRange.replace('-', '–')}
          </p>
        </section>

        {/* Geographic scope */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Geographic scope
          </h2>
          <p className="text-sm text-foreground/80">
            {fact.scope.charAt(0).toUpperCase() + fact.scope.slice(1)}: {fact.location}
          </p>
        </section>

        {/* Sources */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Sources
          </h2>
          <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
            {fact.sources.map((source, index) => (
              <li key={index}>
                {source.url ? (
                  <a 
                    href={source.url} 
                    className="text-primary hover:underline"
                    rel="noopener noreferrer"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
                {' '}({source.type} data)
              </li>
            ))}
          </ul>
        </section>

        {/* Uncertainty and limitations */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Uncertainty and limitations
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {fact.uncertainty}
          </p>
        </section>

        {/* Related facts */}
        {fact.relatedFacts.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Related facts
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {fact.relatedFacts.map((related, index) => (
                <li key={index}>
                  <Link 
                    to={related.url}
                    className="text-primary hover:underline"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

      </main>

      {/* FOOTER - Disclaimer */}
      <footer className="max-w-2xl mx-auto px-4 py-6 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This page presents aggregated, open data for informational purposes only. 
          No predictions or policy recommendations are made.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Fact ID: {fact.factId} · Version: {fact.version} · Updated: {fact.lastUpdated}
        </p>
      </footer>
    </>
  );
}

export default FactPageTemplate;
