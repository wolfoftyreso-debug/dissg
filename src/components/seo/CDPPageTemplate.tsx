/**
 * CDP PAGE TEMPLATE
 * 
 * Conditional Decision Page - canonical structure
 * Google + AI agents consume same content
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  generateCanonicalH1,
  generateCDPSections,
  generateMetaTags,
  generateCombinedSchema,
  generateMachineReadableOutput,
  generateFullLinkSet,
  createJsonLdScript,
  buildCDPUrl,
  CDP_SECTION_ORDER,
  type CDPSection,
} from '@/core/seo';

export interface CDPPageData {
  readonly entity: string;
  readonly domain: string;
  readonly decisionType: string;
  readonly originalQuestion?: string;
  readonly scope: string;
  readonly assumptions: readonly string[];
  readonly alternatives: readonly { label: string; description?: string }[];
  readonly tradeOffs: readonly string[];
  readonly uncertainties: readonly string[];
  readonly limitations: readonly string[];
  readonly relatedDomains?: readonly string[];
  readonly alternativeEntities?: readonly string[];
  readonly referenceIds?: readonly string[];
}

interface CDPPageTemplateProps {
  data: CDPPageData;
  baseUrl: string;
}

export function CDPPageTemplate({ data, baseUrl }: CDPPageTemplateProps) {
  const canonicalUrl = `${baseUrl}${buildCDPUrl(data.domain, data.entity)}`;
  const h1 = generateCanonicalH1(data.entity);
  const meta = generateMetaTags(data.entity, data.domain, canonicalUrl);
  const schema = generateCombinedSchema(data.entity, data.decisionType, data.originalQuestion);
  const sections = generateCDPSections({
    scope: data.scope,
    assumptions: data.assumptions,
    alternatives: data.alternatives.map(a => a.label),
    tradeOffs: data.tradeOffs,
    uncertainties: data.uncertainties,
    limitations: data.limitations,
  });
  const links = generateFullLinkSet(data.domain, data.entity, {
    relatedDomains: data.relatedDomains,
    alternativeEntities: data.alternativeEntities,
    referenceIds: data.referenceIds,
  });

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta name="robots" content={meta.robots} />
        <script type="application/ld+json">
          {JSON.stringify(schema.schemaOrg)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(schema.decisionLegitimacy)}
        </script>
        {schema.faq && (
          <script type="application/ld+json">
            {JSON.stringify(schema.faq)}
          </script>
        )}
      </Helmet>

      <article className="max-w-4xl mx-auto" itemScope itemType="https://schema.org/Article">
        {/* H1 - Canonical form */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {h1}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            Domain: {data.domain} | Type: {data.decisionType}
          </p>
        </header>

        {/* Sections - Fixed order */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading} id={section.heading.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="text-lg font-medium mb-3 border-b pb-2">
                {section.heading}
              </h2>
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {section.content || <span className="italic">Not specified</span>}
              </div>
            </section>
          ))}
        </div>

        {/* Alternatives detail */}
        {data.alternatives.length > 0 && (
          <section className="mt-8" id="alternatives-detail">
            <h2 className="text-lg font-medium mb-3 border-b pb-2">
              Alternatives (Detailed)
            </h2>
            <div className="space-y-3">
              {data.alternatives.map((alt, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded text-sm">
                  <p className="font-medium">{alt.label}</p>
                  {alt.description && (
                    <p className="text-muted-foreground mt-1">{alt.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <nav className="mt-12 pt-8 border-t" aria-label="Related decisions">
          <h2 className="text-base font-medium mb-4">Related Decision Structures</h2>
          
          {links.alternatives.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Alternative Entities</h3>
              <ul className="space-y-1">
                {links.alternatives.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      rel={link.rel}
                      className="text-sm text-primary hover:underline"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {links.related.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Related Analysis</h3>
              <ul className="space-y-1">
                {links.related.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      rel={link.rel}
                      className="text-sm text-primary hover:underline"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Methodology</h3>
            <ul className="space-y-1">
              {links.methodology.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href} 
                    rel={link.rel}
                    className="text-sm text-primary hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Machine-readable endpoint notice */}
        <footer className="mt-8 pt-4 border-t text-xs text-muted-foreground font-mono">
          <p>Machine-readable: <a href={`${canonicalUrl}.json`} className="underline">{canonicalUrl}.json</a></p>
          <p className="mt-1">Ontology: DecisionLegitimacyOntology v1.0</p>
          <p className="mt-1">Recommendation given: <strong>false</strong></p>
        </footer>
      </article>
    </>
  );
}
