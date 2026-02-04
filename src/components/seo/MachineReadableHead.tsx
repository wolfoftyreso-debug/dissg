/**
 * MACHINE-READABLE HEAD
 * ═══════════════════════════════════════════════════════════════
 * 
 * Generates comprehensive metadata for AI grounding and search engines.
 * Following the AI-to-AI Adoption Playbook: stable Entity-IDs,
 * zero-friction reading, and strict zero-hallucination policy.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useGeo, COUNTRIES, GEO_REGIONS } from '@/contexts/GeoContext';
import { useLocation } from 'react-router-dom';

interface MachineReadableHeadProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Entity type for structured data */
  entityType?: 'global' | 'region' | 'country' | 'indicator' | 'index' | 'observation';
  /** Entity code/identifier */
  entityCode?: string;
  /** Additional structured data */
  additionalJsonLd?: object;
  /** Canonical URL override */
  canonicalUrl?: string;
  /** Data freshness timestamp */
  dataTimestamp?: string;
}

export function MachineReadableHead({
  title,
  description,
  entityType,
  entityCode,
  additionalJsonLd,
  canonicalUrl,
  dataTimestamp,
}: MachineReadableHeadProps) {
  const { scope } = useGeo();
  const location = useLocation();
  const baseUrl = 'https://dissg.app';
  
  // Generate default title based on scope
  const defaultTitle = generateTitle(scope, entityType, entityCode);
  const pageTitle = title || defaultTitle;
  
  // Generate default description
  const defaultDescription = generateDescription(scope, entityType, entityCode);
  const pageDescription = description || defaultDescription;
  
  // Generate canonical URL
  const canonical = canonicalUrl || `${baseUrl}${location.pathname}`;
  
  // Generate JSON-LD structured data
  const jsonLd = generateStructuredData({
    scope,
    entityType,
    entityCode,
    title: pageTitle,
    description: pageDescription,
    canonical,
    dataTimestamp,
    additionalJsonLd,
  });
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{pageTitle} | DISSG</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      
      {/* Machine-readable identifiers */}
      <meta name="dissg:entity-type" content={entityType || scope.level} />
      <meta name="dissg:entity-code" content={entityCode || scope.code} />
      <meta name="dissg:cite-url" content={`${baseUrl}/cite/${entityType || scope.level}/${entityCode || scope.code}`} />
      <meta name="dissg:api-url" content={`${baseUrl}/api/v1/${entityType || scope.level}/${entityCode || scope.code}`} />
      
      {/* Data freshness */}
      {dataTimestamp && (
        <meta name="dissg:data-timestamp" content={dataTimestamp} />
      )}
      
      {/* OpenGraph for social and AI systems */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="DISSG" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      
      {/* Dublin Core for academic/institutional systems */}
      <meta name="DC.title" content={pageTitle} />
      <meta name="DC.description" content={pageDescription} />
      <meta name="DC.identifier" content={canonical} />
      <meta name="DC.type" content="Dataset" />
      <meta name="DC.format" content="text/html" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

function generateTitle(
  scope: { level: string; code: string; name: string; name_local?: string },
  entityType?: string,
  entityCode?: string
): string {
  if (entityType === 'indicator' && entityCode) {
    return `${entityCode} Indicator Data`;
  }
  if (entityType === 'index' && entityCode) {
    return `${entityCode} Index`;
  }
  
  switch (scope.level) {
    case 'global':
      return 'Global Overview';
    case 'region':
      return `${scope.name} Region`;
    case 'country':
      return `${scope.name_local || scope.name} – Country Profile`;
    default:
      return 'DISSG';
  }
}

function generateDescription(
  scope: { level: string; code: string; name: string; name_local?: string },
  entityType?: string,
  entityCode?: string
): string {
  const base = 'Diagnostic Information System for Societal Governance. ';
  
  if (entityType === 'indicator') {
    return `${base}Verified data for indicator ${entityCode} across jurisdictions.`;
  }
  
  switch (scope.level) {
    case 'global':
      return `${base}Global overview of societal indicators across all tracked jurisdictions.`;
    case 'region':
      return `${base}Regional analysis for ${scope.name} with comparative country data.`;
    case 'country':
      return `${base}Complete country profile for ${scope.name_local || scope.name} with verified indicator data.`;
    default:
      return `${base}Aggregated data infrastructure for evidence-based governance.`;
  }
}

function generateStructuredData({
  scope,
  entityType,
  entityCode,
  title,
  description,
  canonical,
  dataTimestamp,
  additionalJsonLd,
}: {
  scope: { level: string; code: string; name: string; name_local?: string };
  entityType?: string;
  entityCode?: string;
  title: string;
  description: string;
  canonical: string;
  dataTimestamp?: string;
  additionalJsonLd?: object;
}): object {
  const baseUrl = 'https://dissg.app';
  
  // Base organization data
  const organization = {
    '@type': 'Organization',
    'name': 'DISSG',
    'url': baseUrl,
    'description': 'Diagnostic Information System for Societal Governance',
  };
  
  // WebSite schema
  const website = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    'url': baseUrl,
    'name': 'DISSG',
    'description': 'Diagnostic Information System for Societal Governance',
    'publisher': organization,
  };
  
  // WebPage schema
  const webpage = {
    '@type': 'WebPage',
    '@id': canonical,
    'url': canonical,
    'name': title,
    'description': description,
    'isPartOf': { '@id': `${baseUrl}/#website` },
  };
  
  if (dataTimestamp) {
    (webpage as any).dateModified = dataTimestamp;
  }
  
  // Entity-specific schema
  let entitySchema: object | null = null;
  
  if (scope.level === 'country' || entityType === 'country') {
    const countryData = COUNTRIES[entityCode || scope.code];
    entitySchema = {
      '@type': 'Country',
      '@id': `${baseUrl}/country/${(entityCode || scope.code).toLowerCase()}`,
      'name': countryData?.name || scope.name,
      'alternateName': countryData?.name_local,
      'identifier': entityCode || scope.code,
      'url': canonical,
    };
  } else if (scope.level === 'region' || entityType === 'region') {
    entitySchema = {
      '@type': 'AdministrativeArea',
      '@id': `${baseUrl}/region/${(entityCode || scope.code).toLowerCase()}`,
      'name': scope.name,
      'identifier': entityCode || scope.code,
      'url': canonical,
    };
  } else if (entityType === 'indicator') {
    entitySchema = {
      '@type': 'StatisticalVariable',
      '@id': `${baseUrl}/indicator/${entityCode}`,
      'name': entityCode,
      'url': canonical,
      'measurementTechnique': 'Aggregated official statistics',
    };
  } else if (entityType === 'index') {
    entitySchema = {
      '@type': 'Dataset',
      '@id': `${baseUrl}/index/${entityCode}`,
      'name': entityCode,
      'url': canonical,
      'creator': organization,
      'license': 'https://creativecommons.org/licenses/by/4.0/',
    };
  }
  
  // Combine all schemas
  const graphItems = [website, webpage];
  if (entitySchema) {
    graphItems.push(entitySchema as any);
  }
  
  const result = {
    '@context': 'https://schema.org',
    '@graph': graphItems,
  };
  
  // Merge additional JSON-LD if provided
  if (additionalJsonLd) {
    return { ...result, ...additionalJsonLd };
  }
  
  return result;
}

export default MachineReadableHead;
