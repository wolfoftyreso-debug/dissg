/**
 * STRIM JSON-LD Head Component
 * 
 * Injects Schema.org structured data into page <head>.
 * Used by all STRIM entity pages for Google Knowledge Graph integration.
 */

import { Helmet } from 'react-helmet-async';
import { 
  generateJsonLdGraph, 
  serializeJsonLd,
  STRIM_ORGANIZATION,
  type StrimEntityData 
} from '@/lib/strim/schema-org';

interface JsonLdHeadProps {
  entity: StrimEntityData;
  title: string;
  description?: string;
  canonicalUrl: string;
}

/**
 * Injects complete JSON-LD structured data for a STRIM entity
 */
export function JsonLdHead({ entity, title, description, canonicalUrl }: JsonLdHeadProps) {
  const jsonLdGraph = generateJsonLdGraph(entity);
  
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title} | STRIM</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="STRIM" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {serializeJsonLd(jsonLdGraph)}
      </script>
    </Helmet>
  );
}

/**
 * Global organization markup for all pages
 */
export function StrimOrganizationHead() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {serializeJsonLd(STRIM_ORGANIZATION)}
      </script>
    </Helmet>
  );
}

/**
 * Breadcrumb structured data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbHead({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {serializeJsonLd(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}

export default JsonLdHead;
