/**
 * 📊 MASTER EXECUTION BLOCK 49
 * 
 * INDICATOR PAGE — CANONICAL TEMPLATE (SEO + AI SAFE)
 * 
 * Purpose:
 * - Define what is measured
 * - Show how it is measured
 * - Show where it is used
 * - Link to all facts building on it
 * 
 * 📌 1 indicator = 1 page = 1 definition
 * 
 * CRITICAL RULES (NEVER BREAK):
 * ❌ No graphs
 * ❌ No country figures
 * ❌ No conclusions
 * ❌ No CTAs
 * ✅ Definition
 * ✅ Method
 * ✅ Limitations
 * ✅ Links to facts
 * 
 * 📌 Indicator is neutral infrastructure, no narrative.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// ============================================================
// TYPES
// ============================================================

export interface IndicatorPageData {
  // Core identifiers
  indicatorId: string;
  slug: string;
  domain: string; // e.g., "work-and-ai"
  
  // Content
  name: string; // H1 text
  description: string; // Meta description
  summary: string; // Main paragraph (2-4 sentences)
  
  // Definition
  whatItMeasures: string;
  howDataCollected: string;
  timeCoverage: string; // e.g., "1960–2024 (varies by country)"
  
  // Quality
  uncertainty: string;
  limitations: string[];
  
  // Sources
  primarySources: Array<{
    name: string;
    url?: string;
  }>;
  
  // Links
  factsUsingIndicator: Array<{
    url: string;
    title: string;
  }>;
  
  relatedQuestions: Array<{
    url: string;
    title: string;
  }>;
  
  relatedIndicators: Array<{
    url: string;
    title: string;
  }>;
  
  // Technical
  canonicalUrl: string;
  lastUpdated: string;
  version: string;
  measurementTechnique?: string;
}

// ============================================================
// STRUCTURED DATA (SCHEMA.ORG)
// ============================================================

function generateStatisticalVariableSchema(indicator: IndicatorPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'StatisticalVariable',
    name: indicator.name,
    description: indicator.whatItMeasures,
    measurementTechnique: indicator.measurementTechnique || indicator.howDataCollected,
    temporalCoverage: indicator.timeCoverage,
  };
}

function generateBreadcrumbSchema(indicator: IndicatorPageData, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Indicators',
        item: `${baseUrl}/indicators/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: formatDomain(indicator.domain),
        item: `${baseUrl}/indicators/${indicator.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: indicator.name,
        item: indicator.canonicalUrl,
      },
    ],
  };
}

function formatDomain(domain: string): string {
  return domain
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface IndicatorPageTemplateProps {
  indicator: IndicatorPageData;
  baseUrl?: string;
}

/**
 * Canonical Indicator Page Template
 * 
 * Ultra-minimal, semantic HTML optimized for:
 * - Google indexing as entity
 * - AI agent understanding ("what does X measure?")
 * - Anti-hallucination by design
 * 
 * NO: graphs, country figures, conclusions, CTAs
 * YES: definition, method, limitations, links
 */
export function IndicatorPageTemplate({ 
  indicator, 
  baseUrl = '' 
}: IndicatorPageTemplateProps) {
  const statisticalVariableSchema = generateStatisticalVariableSchema(indicator);
  const breadcrumbSchema = generateBreadcrumbSchema(indicator, baseUrl);
  
  return (
    <>
      {/* HEAD - Meta tags and structured data */}
      <Helmet>
        <html lang="en" />
        <title>{indicator.name} – Definition, method and usage</title>
        <meta name="description" content={indicator.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={indicator.canonicalUrl} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(statisticalVariableSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* BODY - Pure semantic HTML */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {/* H1 - The indicator name */}
        <h1 className="text-xl font-semibold text-foreground mb-4">
          {indicator.name}
        </h1>

        {/* Summary - 2-4 sentences, neutral, descriptive */}
        <p className="text-base text-foreground/90 mb-6 leading-relaxed">
          {indicator.summary}
        </p>

        {/* What this indicator measures */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            What this indicator measures
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {indicator.whatItMeasures}
          </p>
        </section>

        {/* How data is collected */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            How the data is collected
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {indicator.howDataCollected}
          </p>
        </section>

        {/* Time coverage */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Time coverage
          </h2>
          <p className="text-sm text-foreground/80">
            {indicator.timeCoverage}
          </p>
        </section>

        {/* Uncertainty and limitations */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Uncertainty and limitations
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed mb-2">
            {indicator.uncertainty}
          </p>
          {indicator.limitations.length > 0 && (
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              {indicator.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Primary sources */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Primary sources
          </h2>
          <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
            {indicator.primarySources.map((source, index) => (
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
              </li>
            ))}
          </ul>
        </section>

        {/* Facts using this indicator */}
        {indicator.factsUsingIndicator.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Facts using this indicator
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {indicator.factsUsingIndicator.map((fact, index) => (
                <li key={index}>
                  <Link 
                    to={fact.url}
                    className="text-primary hover:underline"
                  >
                    {fact.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related questions */}
        {indicator.relatedQuestions.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Related questions
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {indicator.relatedQuestions.map((question, index) => (
                <li key={index}>
                  <Link 
                    to={question.url}
                    className="text-primary hover:underline"
                  >
                    {question.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related indicators */}
        {indicator.relatedIndicators.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Related indicators
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {indicator.relatedIndicators.map((ind, index) => (
                <li key={index}>
                  <Link 
                    to={ind.url}
                    className="text-primary hover:underline"
                  >
                    {ind.title}
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
          This indicator definition is provided for transparency and comparability. 
          No normative conclusions are made.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Indicator ID: {indicator.indicatorId} · Version: {indicator.version} · Updated: {indicator.lastUpdated}
        </p>
      </footer>
    </>
  );
}

export default IndicatorPageTemplate;
