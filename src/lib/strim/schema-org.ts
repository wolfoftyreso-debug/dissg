/**
 * STRIM Schema.org Generator
 * 
 * Automatisk generering av JSON-LD från STRIM-datamodellen.
 * Följer Googles riktlinjer för structured data.
 * 
 * Princip: Schema markup får aldrig ljuga, förenkla eller marknadsföra.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SchemaOrgBase {
  '@context': 'https://schema.org';
  '@type': string;
  '@id': string;
  name: string;
  description?: string;
  publisher?: SchemaOrgReference;
}

export interface SchemaOrgReference {
  '@id': string;
  '@type'?: string;
}

export interface SchemaOrgOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo?: string;
  nonprofitStatus?: string;
  foundingLocation?: {
    '@type': 'Country';
    name: string;
  };
}

export interface SchemaOrgDrug extends SchemaOrgBase {
  '@type': 'Drug';
  drugClass?: string;
  administrationRoute?: string[];
  legalStatus?: {
    '@type': 'DrugLegalStatus';
    name: string;
  };
  isRelatedTo?: SchemaOrgReference[];
}

export interface SchemaOrgMedicalCondition extends SchemaOrgBase {
  '@type': 'MedicalCondition';
  code?: {
    '@type': 'MedicalCode';
    codingSystem: string;
    codeValue: string;
  };
  possibleTreatment?: SchemaOrgReference | SchemaOrgReference[];
  cause?: SchemaOrgReference | SchemaOrgReference[];
}

export interface SchemaOrgMedicalTherapy extends SchemaOrgBase {
  '@type': 'MedicalTherapy';
  medicalSpecialty?: string;
  indication?: SchemaOrgReference | SchemaOrgReference[];
}

export interface SchemaOrgLegislation extends SchemaOrgBase {
  '@type': 'Legislation';
  jurisdiction?: {
    '@type': 'Country';
    name: string;
  };
  legislationDate?: string;
  legislationType?: string;
}

export interface SchemaOrgDataset extends SchemaOrgBase {
  '@type': 'Dataset';
  creator?: SchemaOrgReference;
  spatialCoverage?: {
    '@type': 'Country';
    name: string;
  };
  temporalCoverage?: string;
  variableMeasured?: string;
}

export interface SchemaOrgDefinedTerm extends SchemaOrgBase {
  '@type': 'DefinedTerm';
  inDefinedTermSet?: SchemaOrgReference;
  termCode?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE_URL = 'https://strim.se';

export const STRIM_ORGANIZATION: SchemaOrgOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Stiftelsen för samordning och riktlinjer för missbruksvård',
  url: BASE_URL,
  logo: `${BASE_URL}/static/logo.png`,
  nonprofitStatus: 'Nonprofit',
  foundingLocation: {
    '@type': 'Country',
    name: 'Sverige',
  },
};

const PUBLISHER_REF: SchemaOrgReference = {
  '@id': `${BASE_URL}/#organization`,
};

// =============================================================================
// PATH MAPPINGS
// =============================================================================

const PATH_MAP = {
  substance: 'substans',
  diagnosis: 'diagnos',
  treatment: 'behandling',
  legal: 'lag',
  statistic: 'statistik',
  term: 'begrepp',
} as const;

function getCanonicalUrl(type: keyof typeof PATH_MAP, slug: string): string {
  return `${BASE_URL}/data/${PATH_MAP[type]}/${slug}`;
}

// =============================================================================
// DRUG CLASS MAPPING
// =============================================================================

const DRUG_CLASS_MAP: Record<string, string> = {
  depressant: 'Centraldämpande',
  stimulant: 'Centralstimulantia',
  opioid: 'Opioider',
  hallucinogen: 'Hallucinogener',
  cannabinoid: 'Cannabinoider',
  dissociative: 'Dissociativa',
  inhalant: 'Inhalanter',
  other: 'Övrigt',
};

const LEGAL_STATUS_MAP: Record<string, string> = {
  legal: 'Laglig i Sverige',
  prescription: 'Receptbelagd i Sverige',
  controlled: 'Kontrollerad substans i Sverige',
  illegal: 'Narkotikaklassad i Sverige',
  varies: 'Varierar beroende på användning',
};

const ADMIN_ROUTE_MAP: Record<string, string> = {
  oral: 'Oral',
  inhalation: 'Inhalation',
  injection: 'Injektion',
  insufflation: 'Nasal',
  transdermal: 'Transdermal',
  sublingual: 'Sublingual',
  rectal: 'Rektal',
  other: 'Övrigt',
};

// =============================================================================
// GENERATORS
// =============================================================================

/**
 * Generate Schema.org Drug from STRIM Substance
 */
export function generateDrugSchema(substance: {
  canonical_slug: string;
  name_sv: string;
  definition?: string;
  classification_primary?: string;
  administration_routes?: string[];
  current_legal_status?: string;
  causes_diagnoses?: string[];
}): SchemaOrgDrug {
  const schema: SchemaOrgDrug = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    '@id': getCanonicalUrl('substance', substance.canonical_slug),
    name: substance.name_sv,
    publisher: PUBLISHER_REF,
  };

  // Only add description if meaningful (not empty, not too short)
  if (substance.definition && substance.definition.length > 20) {
    schema.description = substance.definition;
  }

  // Drug class
  if (substance.classification_primary) {
    const drugClass = DRUG_CLASS_MAP[substance.classification_primary];
    if (drugClass) {
      schema.drugClass = drugClass;
    }
  }

  // Administration routes
  if (substance.administration_routes && substance.administration_routes.length > 0) {
    schema.administrationRoute = substance.administration_routes
      .map(route => ADMIN_ROUTE_MAP[route])
      .filter(Boolean);
  }

  // Legal status
  if (substance.current_legal_status) {
    const legalName = LEGAL_STATUS_MAP[substance.current_legal_status];
    if (legalName) {
      schema.legalStatus = {
        '@type': 'DrugLegalStatus',
        name: legalName,
      };
    }
  }

  // Related diagnoses
  if (substance.causes_diagnoses && substance.causes_diagnoses.length > 0) {
    schema.isRelatedTo = substance.causes_diagnoses.map(slug => ({
      '@type': 'MedicalCondition',
      '@id': getCanonicalUrl('diagnosis', slug),
    }));
  }

  return schema;
}

/**
 * Generate Schema.org MedicalCondition from STRIM Diagnosis
 */
export function generateMedicalConditionSchema(diagnosis: {
  canonical_slug: string;
  name_sv: string;
  definition?: string;
  icd_10_code?: string;
  treated_by_methods?: string[];
  caused_by_substances?: string[];
}): SchemaOrgMedicalCondition {
  const schema: SchemaOrgMedicalCondition = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    '@id': getCanonicalUrl('diagnosis', diagnosis.canonical_slug),
    name: diagnosis.name_sv,
    publisher: PUBLISHER_REF,
  };

  if (diagnosis.definition && diagnosis.definition.length > 20) {
    schema.description = diagnosis.definition;
  }

  // ICD-10 code
  if (diagnosis.icd_10_code) {
    schema.code = {
      '@type': 'MedicalCode',
      codingSystem: 'ICD-10',
      codeValue: diagnosis.icd_10_code,
    };
  }

  // Treatments
  if (diagnosis.treated_by_methods && diagnosis.treated_by_methods.length > 0) {
    const treatments = diagnosis.treated_by_methods.map(slug => ({
      '@type': 'MedicalTherapy' as const,
      '@id': getCanonicalUrl('treatment', slug),
    }));
    schema.possibleTreatment = treatments.length === 1 ? treatments[0] : treatments;
  }

  // Causes (substances)
  if (diagnosis.caused_by_substances && diagnosis.caused_by_substances.length > 0) {
    const causes = diagnosis.caused_by_substances.map(slug => ({
      '@type': 'Drug' as const,
      '@id': getCanonicalUrl('substance', slug),
    }));
    schema.cause = causes.length === 1 ? causes[0] : causes;
  }

  return schema;
}

/**
 * Generate Schema.org MedicalTherapy from STRIM Treatment
 */
export function generateMedicalTherapySchema(treatment: {
  canonical_slug: string;
  name_sv: string;
  definition?: string;
  method_type?: string;
  used_for_diagnoses?: string[];
}): SchemaOrgMedicalTherapy {
  const schema: SchemaOrgMedicalTherapy = {
    '@context': 'https://schema.org',
    '@type': 'MedicalTherapy',
    '@id': getCanonicalUrl('treatment', treatment.canonical_slug),
    name: treatment.name_sv,
    publisher: PUBLISHER_REF,
    medicalSpecialty: 'AddictionMedicine',
  };

  if (treatment.definition && treatment.definition.length > 20) {
    schema.description = treatment.definition;
  }

  // Indications (diagnoses this treats)
  if (treatment.used_for_diagnoses && treatment.used_for_diagnoses.length > 0) {
    const indications = treatment.used_for_diagnoses.map(slug => ({
      '@type': 'MedicalCondition' as const,
      '@id': getCanonicalUrl('diagnosis', slug),
    }));
    schema.indication = indications.length === 1 ? indications[0] : indications;
  }

  return schema;
}

/**
 * Generate Schema.org Legislation from STRIM Legal
 */
export function generateLegislationSchema(legal: {
  canonical_slug: string;
  name_sv: string;
  purpose?: string;
  valid_from?: string;
  jurisdiction?: string;
}): SchemaOrgLegislation {
  const schema: SchemaOrgLegislation = {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    '@id': getCanonicalUrl('legal', legal.canonical_slug),
    name: legal.name_sv,
    publisher: PUBLISHER_REF,
    legislationType: 'Statute',
  };

  if (legal.purpose && legal.purpose.length > 20) {
    schema.description = legal.purpose;
  }

  // Jurisdiction
  if (legal.jurisdiction === 'SE') {
    schema.jurisdiction = {
      '@type': 'Country',
      name: 'Sverige',
    };
  }

  // Legislation date
  if (legal.valid_from) {
    schema.legislationDate = legal.valid_from;
  }

  return schema;
}

/**
 * Generate Schema.org Dataset from STRIM Statistic
 */
export function generateDatasetSchema(statistic: {
  canonical_slug: string;
  name_sv: string;
  description?: string;
  temporal_coverage_start?: string;
  temporal_coverage_end?: string;
  variable_measured?: string;
}): SchemaOrgDataset {
  const schema: SchemaOrgDataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': getCanonicalUrl('statistic', statistic.canonical_slug),
    name: statistic.name_sv,
    creator: PUBLISHER_REF,
    publisher: PUBLISHER_REF,
    spatialCoverage: {
      '@type': 'Country',
      name: 'Sverige',
    },
  };

  if (statistic.description && statistic.description.length > 20) {
    schema.description = statistic.description;
  }

  // Temporal coverage
  if (statistic.temporal_coverage_start || statistic.temporal_coverage_end) {
    const start = statistic.temporal_coverage_start || '';
    const end = statistic.temporal_coverage_end || '';
    schema.temporalCoverage = `${start}/${end}`;
  }

  if (statistic.variable_measured) {
    schema.variableMeasured = statistic.variable_measured;
  }

  return schema;
}

/**
 * Generate Schema.org DefinedTerm from STRIM Term
 */
export function generateDefinedTermSchema(term: {
  canonical_slug: string;
  term_sv: string;
  definition_sv?: string;
}): SchemaOrgDefinedTerm {
  const schema: SchemaOrgDefinedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': getCanonicalUrl('term', term.canonical_slug),
    name: term.term_sv,
    publisher: PUBLISHER_REF,
    inDefinedTermSet: {
      '@id': `${BASE_URL}/data/begrepp`,
    },
    termCode: term.canonical_slug,
  };

  if (term.definition_sv && term.definition_sv.length > 20) {
    schema.description = term.definition_sv;
  }

  return schema;
}

// =============================================================================
// COMBINED GRAPH OUTPUT
// =============================================================================

export type StrimEntityData = 
  | { type: 'substance'; data: Parameters<typeof generateDrugSchema>[0] }
  | { type: 'diagnosis'; data: Parameters<typeof generateMedicalConditionSchema>[0] }
  | { type: 'treatment'; data: Parameters<typeof generateMedicalTherapySchema>[0] }
  | { type: 'legal'; data: Parameters<typeof generateLegislationSchema>[0] }
  | { type: 'statistic'; data: Parameters<typeof generateDatasetSchema>[0] }
  | { type: 'term'; data: Parameters<typeof generateDefinedTermSchema>[0] };

/**
 * Generate complete JSON-LD graph including organization
 */
export function generateJsonLdGraph(entity: StrimEntityData): object {
  let entitySchema: object;

  switch (entity.type) {
    case 'substance':
      entitySchema = generateDrugSchema(entity.data);
      break;
    case 'diagnosis':
      entitySchema = generateMedicalConditionSchema(entity.data);
      break;
    case 'treatment':
      entitySchema = generateMedicalTherapySchema(entity.data);
      break;
    case 'legal':
      entitySchema = generateLegislationSchema(entity.data);
      break;
    case 'statistic':
      entitySchema = generateDatasetSchema(entity.data);
      break;
    case 'term':
      entitySchema = generateDefinedTermSchema(entity.data);
      break;
  }

  // Return as @graph with organization
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Organization (without duplicate @context)
      {
        '@type': 'Organization',
        '@id': STRIM_ORGANIZATION['@id'],
        name: STRIM_ORGANIZATION.name,
        url: STRIM_ORGANIZATION.url,
        logo: STRIM_ORGANIZATION.logo,
        nonprofitStatus: STRIM_ORGANIZATION.nonprofitStatus,
        foundingLocation: STRIM_ORGANIZATION.foundingLocation,
      },
      // Entity (without duplicate @context)
      (() => {
        const { '@context': _, ...rest } = entitySchema as Record<string, unknown>;
        return rest;
      })(),
    ],
  };
}

/**
 * Serialize JSON-LD for HTML injection
 */
export function serializeJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Generate HTML script tag for JSON-LD
 */
export function generateJsonLdScript(entity: StrimEntityData): string {
  const graph = generateJsonLdGraph(entity);
  return `<script type="application/ld+json">\n${serializeJsonLd(graph)}\n</script>`;
}
