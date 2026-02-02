/**
 * 🥗 MASTER EXECUTION BLOCK 50
 * 
 * DEBATE PAGE TEMPLATE — Neutral, Data-First
 * 
 * For contested topics (nutrition, policy, etc.) where:
 * - No winner is declared
 * - Only data is shown
 * - Limitations are explicit
 * 
 * Structure (mandatory):
 * 1. What the debate is about (1 paragraph)
 * 2. What data is used in the debate
 * 3. What the data shows
 * 4. What the data cannot show
 * 5. Links to underlying facts/indicators
 * 
 * 📌 No winner is declared. Just data.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// ============================================================
// TYPES
// ============================================================

export interface DebatePosition {
  name: string;
  summary: string;
  dataPoints: string[];
}

export interface DebatePageData {
  // Core identifiers
  debateId: string;
  slug: string;
  domain: string; // e.g., "nutrition"
  
  // Content
  title: string; // H1 text
  description: string; // Meta description
  
  // Debate structure
  whatDebateIsAbout: string; // 1 paragraph
  dataUsedInDebate: string[]; // List of data types used
  whatDataShows: string; // Neutral summary of observations
  whatDataCannotShow: string; // Explicit limitations
  
  // Positions (optional, for structured debates)
  positions?: DebatePosition[];
  
  // Uncertainty
  keyUncertainties: string[];
  methodologicalChallenges: string[];
  
  // Links
  underlyingFacts: Array<{
    url: string;
    title: string;
  }>;
  
  underlyingIndicators: Array<{
    url: string;
    title: string;
  }>;
  
  relatedDebates: Array<{
    url: string;
    title: string;
  }>;
  
  // Technical
  canonicalUrl: string;
  lastUpdated: string;
  version: string;
  
  // Domain-specific disclaimer
  disclaimer: string;
}

// ============================================================
// STRUCTURED DATA
// ============================================================

function generateDebateSchema(debate: DebatePageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': debate.canonicalUrl,
    headline: debate.title,
    description: debate.description,
    articleSection: 'Data Analysis',
    about: {
      '@type': 'Thing',
      name: debate.title,
    },
    dateModified: debate.lastUpdated,
  };
}

function generateBreadcrumbSchema(debate: DebatePageData, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: formatDomain(debate.domain),
        item: `${baseUrl}/${debate.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Debates',
        item: `${baseUrl}/${debate.domain}/debates/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: debate.title,
        item: debate.canonicalUrl,
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

interface DebatePageTemplateProps {
  debate: DebatePageData;
  baseUrl?: string;
}

/**
 * Debate Page Template
 * 
 * Neutral, data-first presentation of contested topics.
 * No winner declared. Only data.
 */
export function DebatePageTemplate({ 
  debate, 
  baseUrl = '' 
}: DebatePageTemplateProps) {
  const debateSchema = generateDebateSchema(debate);
  const breadcrumbSchema = generateBreadcrumbSchema(debate, baseUrl);
  
  return (
    <>
      {/* HEAD */}
      <Helmet>
        <html lang="en" />
        <title>{debate.title} – What population data shows</title>
        <meta name="description" content={debate.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={debate.canonicalUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(debateSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* BODY */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {/* H1 */}
        <h1 className="text-xl font-semibold text-foreground mb-4">
          {debate.title}
        </h1>

        {/* Disclaimer (prominent) */}
        <div className="bg-muted/50 border border-border rounded px-4 py-3 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {debate.disclaimer}
          </p>
        </div>

        {/* 1. What the debate is about */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            What this debate is about
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {debate.whatDebateIsAbout}
          </p>
        </section>

        {/* 2. Data used in the debate */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            Data used in this debate
          </h2>
          <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
            {debate.dataUsedInDebate.map((dataType, index) => (
              <li key={index}>{dataType}</li>
            ))}
          </ul>
        </section>

        {/* 3. What the data shows */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            What the data shows
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {debate.whatDataShows}
          </p>
        </section>

        {/* 4. What the data cannot show */}
        <section className="mb-6">
          <h2 className="text-base font-medium text-foreground mb-2">
            What the data cannot show
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {debate.whatDataCannotShow}
          </p>
        </section>

        {/* Key uncertainties */}
        {debate.keyUncertainties.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Key uncertainties
            </h2>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              {debate.keyUncertainties.map((uncertainty, index) => (
                <li key={index}>{uncertainty}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Methodological challenges */}
        {debate.methodologicalChallenges.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Methodological challenges
            </h2>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              {debate.methodologicalChallenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 5. Underlying facts */}
        {debate.underlyingFacts.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Underlying facts
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {debate.underlyingFacts.map((fact, index) => (
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

        {/* Underlying indicators */}
        {debate.underlyingIndicators.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Indicators used
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {debate.underlyingIndicators.map((indicator, index) => (
                <li key={index}>
                  <Link 
                    to={indicator.url}
                    className="text-primary hover:underline"
                  >
                    {indicator.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related debates */}
        {debate.relatedDebates.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-medium text-foreground mb-2">
              Related debates
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {debate.relatedDebates.map((related, index) => (
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

      {/* FOOTER */}
      <footer className="max-w-2xl mx-auto px-4 py-6 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This page summarizes population-level data on a contested topic. 
          It does not endorse any position or provide recommendations.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Debate ID: {debate.debateId} · Version: {debate.version} · Updated: {debate.lastUpdated}
        </p>
      </footer>
    </>
  );
}

export default DebatePageTemplate;
