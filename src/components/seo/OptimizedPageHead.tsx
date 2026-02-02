/**
 * Optimized Page Head Component
 * 
 * Generates perfect SEO metadata following simplification rules:
 * - Title: {fact} + {location} + {time}
 * - Description: 1 sentence, {what} + {where} + {time}
 * - Only allowed Schema.org types
 */

import { Helmet } from 'react-helmet-async';
import { 
  generateOptimizedTitle, 
  generateOptimizedDescription,
} from '@/config/simplificationConfig';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StatisticalData {
  name: string;
  value: number;
  unit: string;
  dateObserved: string;
  location: string;
}

interface OptimizedPageHeadProps {
  // Core metadata
  fact: string;
  location: string;
  timeRange: string;
  
  // Optional additions
  description?: string;
  canonicalUrl?: string;
  breadcrumbs?: BreadcrumbItem[];
  
  // Statistical data for schema
  statisticalData?: StatisticalData;
  
  // Page type for schema selection
  pageType: 'fact' | 'indicator' | 'question' | 'location' | 'source' | 'method';
}

export function OptimizedPageHead({
  fact,
  location,
  timeRange,
  description,
  canonicalUrl,
  breadcrumbs,
  statisticalData,
  pageType,
}: OptimizedPageHeadProps) {
  const title = generateOptimizedTitle(fact, location, timeRange);
  const desc = description || generateOptimizedDescription(fact, location, timeRange);
  
  // Build schema based on page type (only allowed types)
  const schemas: object[] = [];
  
  // Always add BreadcrumbList if breadcrumbs provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }
  
  // Add Dataset for fact/indicator pages
  if (pageType === 'fact' || pageType === 'indicator') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: fact,
      description: desc,
      temporalCoverage: timeRange,
      spatialCoverage: {
        '@type': 'Place',
        name: location,
      },
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: canonicalUrl ? `${canonicalUrl}?format=json` : undefined,
      },
    });
  }
  
  // Add Observation for statistical data
  if (statisticalData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Observation',
      measuredProperty: {
        '@type': 'StatisticalVariable',
        name: statisticalData.name,
      },
      measuredValue: {
        '@type': 'QuantitativeValue',
        value: statisticalData.value,
        unitCode: statisticalData.unit,
      },
      observationDate: statisticalData.dateObserved,
      observationAbout: {
        '@type': 'Place',
        name: statisticalData.location,
      },
    });
  }
  
  return (
    <Helmet>
      {/* Core Meta */}
      <title>{title}</title>
      <meta name="description" content={desc} />
      
      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      
      {/* Schema.org JSON-LD (only allowed types) */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

/**
 * Simple wrapper for pages without statistical data
 */
export function SimplePageHead({
  title,
  description,
  canonicalUrl,
}: {
  title: string;
  description: string;
  canonicalUrl?: string;
}) {
  // Enforce length limits
  const cleanTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const cleanDesc = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  return (
    <Helmet>
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDesc} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={cleanTitle} />
      <meta property="og:description" content={cleanDesc} />
    </Helmet>
  );
}
