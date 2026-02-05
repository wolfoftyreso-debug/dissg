/**
 * UYP PAGE TEMPLATE
 * 
 * Unanswerable Yet Page
 * "This question cannot be answered responsibly yet"
 * 
 * Google loves:
 * - Clear limitations
 * - Low hallucination risk
 * 
 * This ranks even with "cannot answer".
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateUYPMetaTags, buildUYPUrl, type UnanswerableYetData } from '@/core/seo';

interface UYPPageTemplateProps {
  data: UnanswerableYetData;
  baseUrl: string;
}

export function UYPPageTemplate({ data, baseUrl }: UYPPageTemplateProps) {
  const canonicalUrl = `${baseUrl}${buildUYPUrl(data.query_hash)}`;
  const meta = generateUYPMetaTags(data.original_query, canonicalUrl);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Unanswerable Decision Query',
    description: meta.description,
    mainEntity: {
      '@type': 'Question',
      name: data.original_query,
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This question cannot be answered responsibly yet due to documented data gaps.',
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta name="robots" content={meta.robots} />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <article className="max-w-3xl mx-auto">
        {/* H1 - Clear limitation */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            This question cannot be answered responsibly yet
          </h1>
        </header>

        {/* Original query */}
        <section className="mb-8 p-4 bg-muted/50 rounded-lg">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Original Query</h2>
          <p className="text-lg font-mono">"{data.original_query}"</p>
        </section>

        {/* Data gaps */}
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3 border-b pb-2">
            Data Gaps Preventing Legitimate Decision
          </h2>
          <ul className="space-y-2">
            {data.data_gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-destructive mt-0.5">○</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Missing requirements */}
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3 border-b pb-2">
            Missing Requirements
          </h2>
          <ul className="space-y-2">
            {data.missing_requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Resolution estimate */}
        {data.estimated_resolution && (
          <section className="mb-8 p-4 border rounded-lg">
            <h2 className="text-sm font-medium mb-2">Estimated Resolution</h2>
            <p className="text-sm text-muted-foreground">{data.estimated_resolution}</p>
          </section>
        )}

        {/* Why this is transparent */}
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3 border-b pb-2">
            Why This Page Exists
          </h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              We document questions we cannot answer responsibly. This transparency:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Prevents hallucination and speculation</li>
              <li>Shows exactly what data is missing</li>
              <li>Maintains trust through honesty</li>
              <li>Will be updated when data becomes available</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t text-xs text-muted-foreground font-mono">
          <p>Query hash: {data.query_hash}</p>
          <p className="mt-1">Status: UNANSWERABLE_YET</p>
          <p className="mt-1">Recommendation given: <strong>false</strong></p>
        </footer>
      </article>
    </>
  );
}
