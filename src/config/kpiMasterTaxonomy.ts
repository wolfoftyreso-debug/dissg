/**
 * GLOBAL KPI MASTER TAXONOMY
 * 500+ KPI:er i hierarkisk struktur
 * 
 * REGEL: Om det kan påverka ett samhälle → det ska vara en KPI.
 */

export interface KPIDefinitionMaster {
  code: string;
  name: string;
  name_en: string;
  definition: string;
  unit: string;
  direction: 'higher_better' | 'lower_better' | 'neutral';
  normalization: 'percentile' | 'z_score' | 'index' | 'raw';
  comparability: 'global' | 'regional' | 'national';
  update_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  geo_levels: ('country' | 'nuts1' | 'nuts2' | 'nuts3' | 'municipality')[];
  demographic_dimensions: ('age' | 'sex' | 'migration' | 'education' | 'income')[];
  preferred_sources: string[];
  confidence_rules: {
    min_coverage: number;
    max_lag_months: number;
    requires_revision_history: boolean;
  };
  gmi_pillar?: string;
  gmi_weight?: number;
}

export interface KPISubdomain {
  code: string;
  name: string;
  name_en: string;
  description: string;
  kpis: KPIDefinitionMaster[];
}

export interface KPIDomain {
  code: string;
  name: string;
  name_en: string;
  icon: string;
  color: string;
  description: string;
  subdomains: KPISubdomain[];
}

// ============================================================================
// DOMAIN: HEALTH
// ============================================================================
const HEALTH_DOMAIN: KPIDomain = {
  code: 'health',
  name: 'Hälsa',
  name_en: 'Health',
  icon: 'Heart',
  color: 'emerald',
  description: 'Folkhälsa, sjukvård och medicinska utfall',
  subdomains: [
    {
      code: 'health_outcomes',
      name: 'Hälsoutfall',
      name_en: 'Health Outcomes',
      description: 'Mått på befolkningens hälsostatus',
      kpis: [
        {
          code: 'life_expectancy',
          name: 'Förväntad livslängd',
          name_en: 'Life Expectancy',
          definition: 'Förväntad livslängd vid födelsen',
          unit: 'år',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['WHO', 'Eurostat', 'national_statistics'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 24, requires_revision_history: true },
          gmi_pillar: 'health',
          gmi_weight: 0.15
        },
        {
          code: 'healthy_life_years',
          name: 'Friska levnadsår',
          name_en: 'Healthy Life Years',
          definition: 'Antal år i god hälsa utan funktionsnedsättning',
          unit: 'år',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'WHO'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 36, requires_revision_history: true },
          gmi_pillar: 'health',
          gmi_weight: 0.1
        },
        {
          code: 'infant_mortality',
          name: 'Spädbarnsdödlighet',
          name_en: 'Infant Mortality Rate',
          definition: 'Dödsfall under första levnadsåret per 1000 levande födda',
          unit: 'per 1000',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['WHO', 'UN', 'national_statistics'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 18, requires_revision_history: true },
          gmi_pillar: 'health',
          gmi_weight: 0.1
        },
        {
          code: 'maternal_mortality',
          name: 'Mödradödlighet',
          name_en: 'Maternal Mortality Ratio',
          definition: 'Dödsfall relaterade till graviditet per 100 000 levande födda',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['age'],
          preferred_sources: ['WHO', 'UN'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'preventable_mortality',
          name: 'Undvikbar dödlighet',
          name_en: 'Preventable Mortality',
          definition: 'Dödsfall som kunde förhindrats genom effektiv folkhälsopolitik',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'treatable_mortality',
          name: 'Behandlingsbar dödlighet',
          name_en: 'Treatable Mortality',
          definition: 'Dödsfall som kunde förhindrats genom effektiv sjukvård',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'self_perceived_health',
          name: 'Självskattad hälsa',
          name_en: 'Self-Perceived Health',
          definition: 'Andel som skattar sin hälsa som god eller mycket god',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age', 'income'],
          preferred_sources: ['Eurostat', 'national_surveys'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        }
      ]
    },
    {
      code: 'health_access',
      name: 'Vårdtillgång',
      name_en: 'Healthcare Access',
      description: 'Tillgång till hälso- och sjukvård',
      kpis: [
        {
          code: 'hospital_beds',
          name: 'Sjukhussängar',
          name_en: 'Hospital Beds',
          definition: 'Antal vårdplatser per 1000 invånare',
          unit: 'per 1000',
          direction: 'neutral',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: [],
          preferred_sources: ['WHO', 'OECD', 'Eurostat'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true }
        },
        {
          code: 'physicians_per_capita',
          name: 'Läkartäthet',
          name_en: 'Physicians per Capita',
          definition: 'Antal läkare per 1000 invånare',
          unit: 'per 1000',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: [],
          preferred_sources: ['WHO', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true },
          gmi_pillar: 'health',
          gmi_weight: 0.05
        },
        {
          code: 'nurses_per_capita',
          name: 'Sjukskötersketäthet',
          name_en: 'Nurses per Capita',
          definition: 'Antal sjuksköterskor per 1000 invånare',
          unit: 'per 1000',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: [],
          preferred_sources: ['WHO', 'OECD'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'healthcare_wait_time',
          name: 'Väntetid specialistvård',
          name_en: 'Healthcare Wait Time',
          definition: 'Median väntetid till specialistvård i dagar',
          unit: 'dagar',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'national',
          update_frequency: 'monthly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: [],
          preferred_sources: ['national_health_authorities'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 6, requires_revision_history: false }
        },
        {
          code: 'unmet_medical_needs',
          name: 'Ouppfyllda vårdbehov',
          name_en: 'Unmet Medical Needs',
          definition: 'Andel som rapporterar ouppfyllda vårdbehov',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age', 'income'],
          preferred_sources: ['Eurostat', 'national_surveys'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        },
        {
          code: 'vaccination_coverage',
          name: 'Vaccinationstäckning',
          name_en: 'Vaccination Coverage',
          definition: 'Andel vaccinerade mot mässling, påssjuka, röda hund',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['age'],
          preferred_sources: ['WHO', 'ECDC'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 12, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'health_spending',
      name: 'Hälsoutgifter',
      name_en: 'Health Expenditure',
      description: 'Ekonomiska resurser för hälso- och sjukvård',
      kpis: [
        {
          code: 'health_expenditure_gdp',
          name: 'Hälsoutgifter/BNP',
          name_en: 'Health Expenditure % GDP',
          definition: 'Totala hälsoutgifter som andel av BNP',
          unit: '%',
          direction: 'neutral',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['WHO', 'OECD', 'World Bank'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'health_expenditure_per_capita',
          name: 'Hälsoutgifter per capita',
          name_en: 'Health Expenditure per Capita',
          definition: 'Hälsoutgifter per invånare i PPP-justerade USD',
          unit: 'PPP USD',
          direction: 'neutral',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['WHO', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'out_of_pocket_health',
          name: 'Egenfinansierad vård',
          name_en: 'Out-of-Pocket Health Expenditure',
          definition: 'Andel av hälsoutgifter som betalas ur egen ficka',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['income'],
          preferred_sources: ['WHO', 'World Bank'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'mental_health',
      name: 'Psykisk hälsa',
      name_en: 'Mental Health',
      description: 'Psykisk ohälsa och välbefinnande',
      kpis: [
        {
          code: 'depression_prevalence',
          name: 'Depressionsprevalens',
          name_en: 'Depression Prevalence',
          definition: 'Andel med depressionsdiagnos',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['WHO', 'IHME'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 36, requires_revision_history: false }
        },
        {
          code: 'suicide_rate',
          name: 'Självmordstal',
          name_en: 'Suicide Rate',
          definition: 'Självmord per 100 000 invånare',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['WHO', 'national_statistics'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true },
          gmi_pillar: 'health',
          gmi_weight: 0.05
        },
        {
          code: 'mental_health_spending',
          name: 'Psykiatriska resurser',
          name_en: 'Mental Health Spending',
          definition: 'Andel av hälsobudget för psykiatri',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['WHO'],
          confidence_rules: { min_coverage: 0.6, max_lag_months: 36, requires_revision_history: false }
        },
        {
          code: 'psychiatrists_per_capita',
          name: 'Psykiatertäthet',
          name_en: 'Psychiatrists per Capita',
          definition: 'Antal psykiatriker per 100 000 invånare',
          unit: 'per 100k',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['WHO'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        }
      ]
    },
    {
      code: 'disease_burden',
      name: 'Sjukdomsbörda',
      name_en: 'Disease Burden',
      description: 'Specifika sjukdomar och riskfaktorer',
      kpis: [
        {
          code: 'obesity_rate',
          name: 'Fetmaprevalens',
          name_en: 'Obesity Rate',
          definition: 'Andel med BMI ≥ 30',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['WHO', 'OECD'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 36, requires_revision_history: false }
        },
        {
          code: 'diabetes_prevalence',
          name: 'Diabetesprevalens',
          name_en: 'Diabetes Prevalence',
          definition: 'Andel med diabetes',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['IDF', 'WHO'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        },
        {
          code: 'cancer_incidence',
          name: 'Cancerincidens',
          name_en: 'Cancer Incidence',
          definition: 'Nya cancerfall per 100 000 invånare',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['IARC', 'WHO'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 36, requires_revision_history: true }
        },
        {
          code: 'smoking_prevalence',
          name: 'Rökprevalens',
          name_en: 'Smoking Prevalence',
          definition: 'Andel dagliga rökare',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['WHO', 'OECD'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        },
        {
          code: 'alcohol_consumption',
          name: 'Alkoholkonsumtion',
          name_en: 'Alcohol Consumption',
          definition: 'Liter ren alkohol per capita (15+)',
          unit: 'liter',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['WHO', 'OECD'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true }
        }
      ]
    }
  ]
};

// ============================================================================
// DOMAIN: WORKFORCE / LABOR
// ============================================================================
const WORKFORCE_DOMAIN: KPIDomain = {
  code: 'workforce',
  name: 'Arbetsmarknad',
  name_en: 'Workforce & Labor',
  icon: 'Briefcase',
  color: 'blue',
  description: 'Sysselsättning, arbetslöshet och arbetsmarknadsvillkor',
  subdomains: [
    {
      code: 'employment',
      name: 'Sysselsättning',
      name_en: 'Employment',
      description: 'Sysselsättningsgrad och arbetsmarknadsdeltagande',
      kpis: [
        {
          code: 'employment_rate',
          name: 'Sysselsättningsgrad',
          name_en: 'Employment Rate',
          definition: 'Andel sysselsatta 15-64 år',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'monthly',
          geo_levels: ['country', 'nuts1', 'nuts2', 'nuts3'],
          demographic_dimensions: ['sex', 'age', 'education'],
          preferred_sources: ['ILO', 'Eurostat', 'national_statistics'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 3, requires_revision_history: true },
          gmi_pillar: 'workforce',
          gmi_weight: 0.2
        },
        {
          code: 'unemployment_rate',
          name: 'Arbetslöshet',
          name_en: 'Unemployment Rate',
          definition: 'Andel arbetslösa av arbetskraften',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'monthly',
          geo_levels: ['country', 'nuts1', 'nuts2', 'nuts3'],
          demographic_dimensions: ['sex', 'age', 'education'],
          preferred_sources: ['ILO', 'Eurostat', 'national_statistics'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 3, requires_revision_history: true },
          gmi_pillar: 'workforce',
          gmi_weight: 0.15
        },
        {
          code: 'youth_unemployment',
          name: 'Ungdomsarbetslöshet',
          name_en: 'Youth Unemployment',
          definition: 'Arbetslöshet 15-24 år',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'monthly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'education'],
          preferred_sources: ['ILO', 'Eurostat'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 3, requires_revision_history: true },
          gmi_pillar: 'workforce',
          gmi_weight: 0.1
        },
        {
          code: 'long_term_unemployment',
          name: 'Långtidsarbetslöshet',
          name_en: 'Long-term Unemployment',
          definition: 'Andel arbetslösa >12 månader',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['ILO', 'Eurostat'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 6, requires_revision_history: true }
        },
        {
          code: 'labor_force_participation',
          name: 'Arbetskraftsdeltagande',
          name_en: 'Labor Force Participation',
          definition: 'Andel i arbetskraften 15-64 år',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['ILO', 'Eurostat'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 6, requires_revision_history: true }
        },
        {
          code: 'neet_rate',
          name: 'NEET-andel',
          name_en: 'NEET Rate',
          definition: 'Unga (15-29) varken i arbete, utbildning eller praktik',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['ILO', 'Eurostat'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 6, requires_revision_history: true },
          gmi_pillar: 'workforce',
          gmi_weight: 0.05
        }
      ]
    },
    {
      code: 'work_quality',
      name: 'Arbetskvalitet',
      name_en: 'Work Quality',
      description: 'Arbetsvillkor och jobbkvalitet',
      kpis: [
        {
          code: 'part_time_involuntary',
          name: 'Ofrivillig deltid',
          name_en: 'Involuntary Part-time',
          definition: 'Andel deltidsanställda som vill arbeta heltid',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'national_statistics'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 6, requires_revision_history: false }
        },
        {
          code: 'temporary_employment',
          name: 'Tidsbegränsad anställning',
          name_en: 'Temporary Employment',
          definition: 'Andel med visstidsanställning',
          unit: '%',
          direction: 'neutral',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 6, requires_revision_history: true }
        },
        {
          code: 'working_poor',
          name: 'Arbetande fattiga',
          name_en: 'In-work Poverty',
          definition: 'Andel sysselsatta under fattigdomsgränsen',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true }
        },
        {
          code: 'gender_pay_gap',
          name: 'Lönegap könsbaserat',
          name_en: 'Gender Pay Gap',
          definition: 'Skillnad i bruttotimlön mellan kön',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'ILO'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'work_accidents',
          name: 'Arbetsolyckor',
          name_en: 'Work Accidents',
          definition: 'Arbetsolyckor med frånvaro per 100 000 anställda',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['Eurostat', 'ILO'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'wages_income',
      name: 'Löner och inkomster',
      name_en: 'Wages & Income',
      description: 'Lönenivåer och inkomstfördelning',
      kpis: [
        {
          code: 'median_wage',
          name: 'Medianlön',
          name_en: 'Median Wage',
          definition: 'Median bruttolön per månad',
          unit: 'EUR',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age', 'education'],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true }
        },
        {
          code: 'minimum_wage_ratio',
          name: 'Minimilön/medianlön',
          name_en: 'Minimum Wage Ratio',
          definition: 'Minimilön som andel av medianlön',
          unit: '%',
          direction: 'neutral',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 12, requires_revision_history: true }
        },
        {
          code: 'wage_growth_real',
          name: 'Reallönetillväxt',
          name_en: 'Real Wage Growth',
          definition: 'Årlig förändring i reallöner',
          unit: '%',
          direction: 'higher_better',
          normalization: 'z_score',
          comparability: 'regional',
          update_frequency: 'quarterly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 6, requires_revision_history: true }
        }
      ]
    }
  ]
};

// ============================================================================
// DOMAIN: ECONOMY
// ============================================================================
const ECONOMY_DOMAIN: KPIDomain = {
  code: 'economy',
  name: 'Ekonomi',
  name_en: 'Economy',
  icon: 'TrendingUp',
  color: 'amber',
  description: 'Makroekonomi, produktion och ekonomisk stabilitet',
  subdomains: [
    {
      code: 'output',
      name: 'Produktion',
      name_en: 'Economic Output',
      description: 'BNP och produktionsvolymer',
      kpis: [
        {
          code: 'gdp_per_capita',
          name: 'BNP per capita',
          name_en: 'GDP per Capita',
          definition: 'Bruttonationalprodukt per invånare i PPP',
          unit: 'PPP USD',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: [],
          preferred_sources: ['World Bank', 'IMF', 'Eurostat'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 6, requires_revision_history: true },
          gmi_pillar: 'economy',
          gmi_weight: 0.15
        },
        {
          code: 'gdp_growth',
          name: 'BNP-tillväxt',
          name_en: 'GDP Growth',
          definition: 'Årlig real BNP-tillväxt',
          unit: '%',
          direction: 'higher_better',
          normalization: 'z_score',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['World Bank', 'IMF', 'national_statistics'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 6, requires_revision_history: true },
          gmi_pillar: 'economy',
          gmi_weight: 0.1
        },
        {
          code: 'gdp_per_hour_worked',
          name: 'BNP per arbetad timme',
          name_en: 'GDP per Hour Worked',
          definition: 'Arbetsproduktivitet mätt i BNP per arbetad timme',
          unit: 'PPP USD',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['OECD', 'ILO'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'prices',
      name: 'Priser',
      name_en: 'Prices',
      description: 'Inflation och prisnivåer',
      kpis: [
        {
          code: 'inflation_rate',
          name: 'Inflation',
          name_en: 'Inflation Rate',
          definition: 'Årlig förändring i konsumentprisindex',
          unit: '%',
          direction: 'neutral',
          normalization: 'z_score',
          comparability: 'global',
          update_frequency: 'monthly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['IMF', 'World Bank', 'national_statistics'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 2, requires_revision_history: true },
          gmi_pillar: 'economy',
          gmi_weight: 0.05
        },
        {
          code: 'core_inflation',
          name: 'Kärninflation',
          name_en: 'Core Inflation',
          definition: 'Inflation exklusive energi och livsmedel',
          unit: '%',
          direction: 'neutral',
          normalization: 'z_score',
          comparability: 'global',
          update_frequency: 'monthly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['IMF', 'ECB', 'central_banks'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 2, requires_revision_history: true }
        },
        {
          code: 'housing_price_index',
          name: 'Bostadsprisindex',
          name_en: 'Housing Price Index',
          definition: 'Index för bostadspriser (bas=100)',
          unit: 'index',
          direction: 'neutral',
          normalization: 'z_score',
          comparability: 'regional',
          update_frequency: 'quarterly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'national_statistics'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 6, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'public_finance',
      name: 'Offentliga finanser',
      name_en: 'Public Finance',
      description: 'Statsfinanser och skuld',
      kpis: [
        {
          code: 'government_debt_gdp',
          name: 'Statsskuld/BNP',
          name_en: 'Government Debt to GDP',
          definition: 'Offentlig skuld som andel av BNP',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['IMF', 'World Bank', 'Eurostat'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 6, requires_revision_history: true },
          gmi_pillar: 'economy',
          gmi_weight: 0.05
        },
        {
          code: 'budget_balance_gdp',
          name: 'Budgetsaldo/BNP',
          name_en: 'Budget Balance to GDP',
          definition: 'Offentligt budgetsaldo som andel av BNP',
          unit: '%',
          direction: 'higher_better',
          normalization: 'z_score',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['IMF', 'Eurostat'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 6, requires_revision_history: true }
        },
        {
          code: 'tax_revenue_gdp',
          name: 'Skatteintäkter/BNP',
          name_en: 'Tax Revenue to GDP',
          definition: 'Totala skatteintäkter som andel av BNP',
          unit: '%',
          direction: 'neutral',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['OECD', 'IMF'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'trade',
      name: 'Handel',
      name_en: 'Trade',
      description: 'Internationell handel och investeringar',
      kpis: [
        {
          code: 'trade_balance_gdp',
          name: 'Handelsbalans/BNP',
          name_en: 'Trade Balance to GDP',
          definition: 'Nettoexport som andel av BNP',
          unit: '%',
          direction: 'neutral',
          normalization: 'z_score',
          comparability: 'global',
          update_frequency: 'quarterly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['WTO', 'IMF', 'World Bank'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 6, requires_revision_history: true }
        },
        {
          code: 'fdi_inflows_gdp',
          name: 'Utländska direktinvesteringar',
          name_en: 'FDI Inflows to GDP',
          definition: 'Ingående direktinvesteringar som andel av BNP',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['UNCTAD', 'World Bank'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true }
        },
        {
          code: 'export_diversification',
          name: 'Exportdiversifiering',
          name_en: 'Export Diversification Index',
          definition: 'Index för exportproduktmångfald',
          unit: 'index',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['UNCTAD', 'WTO'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        }
      ]
    }
  ]
};

// ============================================================================
// DOMAIN: EDUCATION
// ============================================================================
const EDUCATION_DOMAIN: KPIDomain = {
  code: 'education',
  name: 'Utbildning',
  name_en: 'Education',
  icon: 'GraduationCap',
  color: 'indigo',
  description: 'Utbildningssystem, kunskapsnivåer och livslångt lärande',
  subdomains: [
    {
      code: 'attainment',
      name: 'Utbildningsnivå',
      name_en: 'Educational Attainment',
      description: 'Uppnådd utbildningsnivå i befolkningen',
      kpis: [
        {
          code: 'tertiary_education',
          name: 'Högre utbildning',
          name_en: 'Tertiary Education',
          definition: 'Andel 25-64 år med eftergymnasial utbildning',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'OECD', 'UNESCO'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true },
          gmi_pillar: 'education',
          gmi_weight: 0.15
        },
        {
          code: 'upper_secondary',
          name: 'Gymnasial utbildning',
          name_en: 'Upper Secondary Education',
          definition: 'Andel 25-64 år med minst gymnasial utbildning',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true }
        },
        {
          code: 'early_leavers',
          name: 'Tidigt avhopp',
          name_en: 'Early Leavers from Education',
          definition: 'Andel 18-24 år med högst grundskola som inte studerar',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['Eurostat', 'UNESCO'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 12, requires_revision_history: true },
          gmi_pillar: 'education',
          gmi_weight: 0.1
        }
      ]
    },
    {
      code: 'quality',
      name: 'Utbildningskvalitet',
      name_en: 'Education Quality',
      description: 'Kunskapsnivåer och läranderesultat',
      kpis: [
        {
          code: 'pisa_reading',
          name: 'PISA Läsförståelse',
          name_en: 'PISA Reading Score',
          definition: 'Genomsnittlig poäng i PISA läsförståelse',
          unit: 'poäng',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['OECD'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 36, requires_revision_history: true },
          gmi_pillar: 'education',
          gmi_weight: 0.1
        },
        {
          code: 'pisa_math',
          name: 'PISA Matematik',
          name_en: 'PISA Math Score',
          definition: 'Genomsnittlig poäng i PISA matematik',
          unit: 'poäng',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['OECD'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 36, requires_revision_history: true }
        },
        {
          code: 'pisa_science',
          name: 'PISA Naturvetenskap',
          name_en: 'PISA Science Score',
          definition: 'Genomsnittlig poäng i PISA naturvetenskap',
          unit: 'poäng',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['OECD'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 36, requires_revision_history: true }
        },
        {
          code: 'low_achievers_reading',
          name: 'Lågpresterande läsning',
          name_en: 'Low Achievers Reading',
          definition: 'Andel under grundnivå i läsförståelse',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['OECD'],
          confidence_rules: { min_coverage: 0.75, max_lag_months: 36, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'spending',
      name: 'Utbildningsresurser',
      name_en: 'Education Resources',
      description: 'Ekonomiska resurser för utbildning',
      kpis: [
        {
          code: 'education_spending_gdp',
          name: 'Utbildningsutgifter/BNP',
          name_en: 'Education Spending % GDP',
          definition: 'Offentliga utbildningsutgifter som andel av BNP',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['UNESCO', 'World Bank', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'student_teacher_ratio',
          name: 'Elev/lärare-kvot',
          name_en: 'Student-Teacher Ratio',
          definition: 'Antal elever per lärare i grundskolan',
          unit: 'ratio',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: [],
          preferred_sources: ['UNESCO', 'OECD'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'lifelong',
      name: 'Livslångt lärande',
      name_en: 'Lifelong Learning',
      description: 'Vuxenutbildning och fortbildning',
      kpis: [
        {
          code: 'adult_learning',
          name: 'Vuxenutbildning',
          name_en: 'Adult Learning Participation',
          definition: 'Andel 25-64 år som deltagit i utbildning senaste 4 veckorna',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age', 'education'],
          preferred_sources: ['Eurostat'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true },
          gmi_pillar: 'education',
          gmi_weight: 0.05
        }
      ]
    }
  ]
};

// ============================================================================
// DOMAIN: SOCIAL STABILITY
// ============================================================================
const SOCIAL_STABILITY_DOMAIN: KPIDomain = {
  code: 'social_stability',
  name: 'Social stabilitet',
  name_en: 'Social Stability',
  icon: 'Users',
  color: 'purple',
  description: 'Ojämlikhet, fattigdom, sammanhållning och trygghet',
  subdomains: [
    {
      code: 'inequality',
      name: 'Ojämlikhet',
      name_en: 'Inequality',
      description: 'Inkomst- och förmögenhetsfördelning',
      kpis: [
        {
          code: 'gini_coefficient',
          name: 'Gini-koefficient',
          name_en: 'Gini Coefficient',
          definition: 'Mått på inkomstojämlikhet (0=jämn, 1=ojämn)',
          unit: 'koefficient',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: [],
          preferred_sources: ['World Bank', 'Eurostat', 'OECD'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true },
          gmi_pillar: 'social_stability',
          gmi_weight: 0.15
        },
        {
          code: 'income_quintile_ratio',
          name: 'Inkomstkvintilkvot',
          name_en: 'Income Quintile Ratio',
          definition: 'Förhållande mellan rikaste och fattigaste 20%',
          unit: 'ratio',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'World Bank'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true }
        },
        {
          code: 'palma_ratio',
          name: 'Palma-kvot',
          name_en: 'Palma Ratio',
          definition: 'Förhållande mellan rikaste 10% och fattigaste 40%',
          unit: 'ratio',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['UNDP', 'World Bank'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        }
      ]
    },
    {
      code: 'poverty',
      name: 'Fattigdom',
      name_en: 'Poverty',
      description: 'Fattigdom och materiell deprivation',
      kpis: [
        {
          code: 'poverty_rate',
          name: 'Fattigdomsrisk',
          name_en: 'At-risk-of-poverty Rate',
          definition: 'Andel med inkomst under 60% av median',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true },
          gmi_pillar: 'social_stability',
          gmi_weight: 0.1
        },
        {
          code: 'child_poverty',
          name: 'Barnfattigdom',
          name_en: 'Child Poverty Rate',
          definition: 'Andel barn (0-17) i fattigdom',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['age'],
          preferred_sources: ['UNICEF', 'Eurostat'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 24, requires_revision_history: true },
          gmi_pillar: 'social_stability',
          gmi_weight: 0.05
        },
        {
          code: 'severe_material_deprivation',
          name: 'Allvarlig materiell deprivation',
          name_en: 'Severe Material Deprivation',
          definition: 'Andel som saknar minst 4 av 9 grundläggande behov',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['age'],
          preferred_sources: ['Eurostat'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true }
        },
        {
          code: 'food_insecurity',
          name: 'Livsmedelsosäkerhet',
          name_en: 'Food Insecurity',
          definition: 'Andel med måttlig eller allvarlig livsmedelsosäkerhet',
          unit: '%',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['FAO', 'World Bank'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        }
      ]
    },
    {
      code: 'crime_safety',
      name: 'Brottslighet och trygghet',
      name_en: 'Crime & Safety',
      description: 'Brottsnivåer och upplevd trygghet',
      kpis: [
        {
          code: 'homicide_rate',
          name: 'Mordfrekvens',
          name_en: 'Homicide Rate',
          definition: 'Avsiktliga mord per 100 000 invånare',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['UNODC', 'WHO', 'Eurostat'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true },
          gmi_pillar: 'social_stability',
          gmi_weight: 0.05
        },
        {
          code: 'violent_crime_rate',
          name: 'Våldsbrott',
          name_en: 'Violent Crime Rate',
          definition: 'Anmälda våldsbrott per 100 000 invånare',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'national',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2', 'nuts3'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'national_police'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 12, requires_revision_history: true }
        },
        {
          code: 'property_crime_rate',
          name: 'Egendomsbrott',
          name_en: 'Property Crime Rate',
          definition: 'Anmälda egendomsbrott per 100 000 invånare',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'national',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: [],
          preferred_sources: ['Eurostat', 'national_police'],
          confidence_rules: { min_coverage: 0.8, max_lag_months: 12, requires_revision_history: true }
        },
        {
          code: 'perceived_safety',
          name: 'Upplevd trygghet',
          name_en: 'Perceived Safety',
          definition: 'Andel som känner sig trygga i sitt bostadsområde',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'regional',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1'],
          demographic_dimensions: ['sex', 'age'],
          preferred_sources: ['Eurostat', 'national_surveys'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false }
        },
        {
          code: 'prison_population',
          name: 'Fängelsebeläggning',
          name_en: 'Prison Population',
          definition: 'Antal fångar per 100 000 invånare',
          unit: 'per 100k',
          direction: 'lower_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['sex'],
          preferred_sources: ['ICPR', 'Council of Europe'],
          confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true }
        }
      ]
    },
    {
      code: 'trust',
      name: 'Förtroende',
      name_en: 'Trust & Institutions',
      description: 'Institutionellt förtroende och samhällssammanhållning',
      kpis: [
        {
          code: 'trust_government',
          name: 'Förtroende för regeringen',
          name_en: 'Trust in Government',
          definition: 'Andel som litar på regeringen',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['age'],
          preferred_sources: ['Eurobarometer', 'Gallup', 'OECD'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 18, requires_revision_history: false },
          gmi_pillar: 'social_stability',
          gmi_weight: 0.05
        },
        {
          code: 'trust_parliament',
          name: 'Förtroende för parlamentet',
          name_en: 'Trust in Parliament',
          definition: 'Andel som litar på parlamentet',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: ['age'],
          preferred_sources: ['Eurobarometer'],
          confidence_rules: { min_coverage: 0.7, max_lag_months: 18, requires_revision_history: false }
        },
        {
          code: 'voter_turnout',
          name: 'Valdeltagande',
          name_en: 'Voter Turnout',
          definition: 'Andel röstande i senaste nationella val',
          unit: '%',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country', 'nuts1', 'nuts2'],
          demographic_dimensions: ['age'],
          preferred_sources: ['IDEA', 'national_election_authorities'],
          confidence_rules: { min_coverage: 0.95, max_lag_months: 60, requires_revision_history: true }
        },
        {
          code: 'corruption_perceptions',
          name: 'Korruptionsuppfattning',
          name_en: 'Corruption Perceptions Index',
          definition: 'Index för uppfattad korruption (0-100, högre=renare)',
          unit: 'index',
          direction: 'higher_better',
          normalization: 'percentile',
          comparability: 'global',
          update_frequency: 'yearly',
          geo_levels: ['country'],
          demographic_dimensions: [],
          preferred_sources: ['Transparency International'],
          confidence_rules: { min_coverage: 0.9, max_lag_months: 12, requires_revision_history: true },
          gmi_pillar: 'social_stability',
          gmi_weight: 0.05
        }
      ]
    }
  ]
};

// ============================================================================
// ADDITIONAL DOMAINS (Abbreviated for space - full implementation follows same pattern)
// ============================================================================

const DEMOGRAPHICS_DOMAIN: KPIDomain = {
  code: 'demographics',
  name: 'Demografi',
  name_en: 'Demographics',
  icon: 'Users2',
  color: 'slate',
  description: 'Befolkningsstruktur, migration och familj',
  subdomains: [
    {
      code: 'population',
      name: 'Befolkning',
      name_en: 'Population',
      description: 'Befolkningsstorlek och struktur',
      kpis: [
        { code: 'population_total', name: 'Total befolkning', name_en: 'Total Population', definition: 'Total befolkning', unit: 'personer', direction: 'neutral', normalization: 'raw', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1', 'nuts2', 'nuts3', 'municipality'], demographic_dimensions: ['sex', 'age'], preferred_sources: ['UN', 'national_statistics'], confidence_rules: { min_coverage: 0.99, max_lag_months: 12, requires_revision_history: true } },
        { code: 'population_growth', name: 'Befolkningstillväxt', name_en: 'Population Growth', definition: 'Årlig befolkningstillväxt', unit: '%', direction: 'neutral', normalization: 'z_score', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: [], preferred_sources: ['UN', 'World Bank'], confidence_rules: { min_coverage: 0.95, max_lag_months: 12, requires_revision_history: true } },
        { code: 'fertility_rate', name: 'Fertilitet', name_en: 'Fertility Rate', definition: 'Antal barn per kvinna', unit: 'barn/kvinna', direction: 'neutral', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: [], preferred_sources: ['UN', 'World Bank'], confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true } },
        { code: 'median_age', name: 'Medianålder', name_en: 'Median Age', definition: 'Medianålder i befolkningen', unit: 'år', direction: 'neutral', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['sex'], preferred_sources: ['UN', 'national_statistics'], confidence_rules: { min_coverage: 0.9, max_lag_months: 12, requires_revision_history: true } },
        { code: 'dependency_ratio', name: 'Försörjningskvot', name_en: 'Dependency Ratio', definition: 'Andel 0-14 och 65+ i förhållande till 15-64', unit: '%', direction: 'neutral', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: [], preferred_sources: ['UN', 'World Bank'], confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true } }
      ]
    },
    {
      code: 'migration',
      name: 'Migration',
      name_en: 'Migration',
      description: 'In- och utvandring',
      kpis: [
        { code: 'net_migration', name: 'Nettomigration', name_en: 'Net Migration', definition: 'Nettomigration per 1000 invånare', unit: 'per 1000', direction: 'neutral', normalization: 'z_score', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['sex', 'age'], preferred_sources: ['UN', 'Eurostat'], confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true } },
        { code: 'foreign_born_share', name: 'Utrikes födda', name_en: 'Foreign-born Population', definition: 'Andel utrikes födda', unit: '%', direction: 'neutral', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1', 'nuts2'], demographic_dimensions: ['sex', 'age'], preferred_sources: ['UN', 'Eurostat'], confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true } },
        { code: 'asylum_applications', name: 'Asylansökningar', name_en: 'Asylum Applications', definition: 'Asylansökningar per 1000 invånare', unit: 'per 1000', direction: 'neutral', normalization: 'z_score', comparability: 'global', update_frequency: 'monthly', geo_levels: ['country'], demographic_dimensions: ['sex', 'age'], preferred_sources: ['UNHCR', 'Eurostat'], confidence_rules: { min_coverage: 0.9, max_lag_months: 3, requires_revision_history: true } }
      ]
    }
  ]
};

const HOUSING_DOMAIN: KPIDomain = {
  code: 'housing',
  name: 'Boende',
  name_en: 'Housing',
  icon: 'Home',
  color: 'orange',
  description: 'Bostadsmarknad, boendestandard och hemlöshet',
  subdomains: [
    {
      code: 'affordability',
      name: 'Överkomlighet',
      name_en: 'Affordability',
      description: 'Boendekostnader och överkomlighet',
      kpis: [
        { code: 'housing_cost_overburden', name: 'Bostadskostnadsbörda', name_en: 'Housing Cost Overburden', definition: 'Andel med boendekostnad >40% av disponibel inkomst', unit: '%', direction: 'lower_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['income'], preferred_sources: ['Eurostat'], confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true } },
        { code: 'price_to_income_ratio', name: 'Pris/inkomst-kvot', name_en: 'Price to Income Ratio', definition: 'Bostadspris i förhållande till årsinkomst', unit: 'ratio', direction: 'lower_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: [], preferred_sources: ['OECD', 'national_statistics'], confidence_rules: { min_coverage: 0.75, max_lag_months: 18, requires_revision_history: false } }
      ]
    },
    {
      code: 'quality',
      name: 'Boendekvalitet',
      name_en: 'Housing Quality',
      description: 'Standard och trångboddhet',
      kpis: [
        { code: 'overcrowding', name: 'Trångboddhet', name_en: 'Overcrowding Rate', definition: 'Andel som bor trångbott', unit: '%', direction: 'lower_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['income'], preferred_sources: ['Eurostat'], confidence_rules: { min_coverage: 0.8, max_lag_months: 18, requires_revision_history: true } },
        { code: 'housing_deprivation', name: 'Bostadsmässig deprivation', name_en: 'Housing Deprivation', definition: 'Andel i undermålig bostad', unit: '%', direction: 'lower_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['income'], preferred_sources: ['Eurostat'], confidence_rules: { min_coverage: 0.75, max_lag_months: 18, requires_revision_history: true } },
        { code: 'homelessness_rate', name: 'Hemlöshet', name_en: 'Homelessness Rate', definition: 'Hemlösa per 10 000 invånare', unit: 'per 10k', direction: 'lower_better', normalization: 'percentile', comparability: 'national', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['sex'], preferred_sources: ['FEANTSA', 'national_statistics'], confidence_rules: { min_coverage: 0.6, max_lag_months: 24, requires_revision_history: false } }
      ]
    }
  ]
};

const INFRASTRUCTURE_DOMAIN: KPIDomain = {
  code: 'infrastructure',
  name: 'Infrastruktur',
  name_en: 'Infrastructure',
  icon: 'Building2',
  color: 'gray',
  description: 'Transport, digital infrastruktur och offentliga tjänster',
  subdomains: [
    {
      code: 'transport',
      name: 'Transport',
      name_en: 'Transport',
      description: 'Transportsystem och tillgänglighet',
      kpis: [
        { code: 'road_quality', name: 'Vägkvalitet', name_en: 'Road Quality Index', definition: 'Index för väginfrastrukturkvalitet', unit: 'index', direction: 'higher_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['WEF', 'World Bank'], confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false } },
        { code: 'public_transport_access', name: 'Kollektivtrafiktillgång', name_en: 'Public Transport Access', definition: 'Andel med tillgång till kollektivtrafik', unit: '%', direction: 'higher_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1', 'nuts2'], demographic_dimensions: [], preferred_sources: ['Eurostat', 'national_statistics'], confidence_rules: { min_coverage: 0.7, max_lag_months: 24, requires_revision_history: false } }
      ]
    },
    {
      code: 'digital',
      name: 'Digital',
      name_en: 'Digital Infrastructure',
      description: 'Digital anslutning och tjänster',
      kpis: [
        { code: 'internet_access', name: 'Internettillgång', name_en: 'Internet Access', definition: 'Andel hushåll med bredbandsanslutning', unit: '%', direction: 'higher_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1', 'nuts2'], demographic_dimensions: ['income'], preferred_sources: ['ITU', 'Eurostat'], confidence_rules: { min_coverage: 0.9, max_lag_months: 12, requires_revision_history: true } },
        { code: 'mobile_broadband', name: 'Mobilt bredband', name_en: 'Mobile Broadband Subscriptions', definition: 'Mobila bredbandsabonnemang per 100 invånare', unit: 'per 100', direction: 'higher_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['ITU'], confidence_rules: { min_coverage: 0.9, max_lag_months: 12, requires_revision_history: true } },
        { code: 'digital_skills', name: 'Digitala färdigheter', name_en: 'Digital Skills', definition: 'Andel med grundläggande digitala färdigheter', unit: '%', direction: 'higher_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['age', 'education'], preferred_sources: ['Eurostat'], confidence_rules: { min_coverage: 0.75, max_lag_months: 18, requires_revision_history: false } },
        { code: 'egovernment_use', name: 'E-tjänstanvändning', name_en: 'E-government Usage', definition: 'Andel som använt offentliga e-tjänster senaste året', unit: '%', direction: 'higher_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: ['age'], preferred_sources: ['Eurostat'], confidence_rules: { min_coverage: 0.8, max_lag_months: 12, requires_revision_history: true } }
      ]
    }
  ]
};

const ENVIRONMENT_DOMAIN: KPIDomain = {
  code: 'environment',
  name: 'Miljö',
  name_en: 'Environment',
  icon: 'Leaf',
  color: 'green',
  description: 'Klimat, föroreningar och naturresurser',
  subdomains: [
    {
      code: 'emissions',
      name: 'Utsläpp',
      name_en: 'Emissions',
      description: 'Växthusgaser och luftföroreningar',
      kpis: [
        { code: 'co2_per_capita', name: 'CO2 per capita', name_en: 'CO2 Emissions per Capita', definition: 'Koldioxidutsläpp per invånare', unit: 'ton', direction: 'lower_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['IEA', 'World Bank', 'Our World in Data'], confidence_rules: { min_coverage: 0.9, max_lag_months: 24, requires_revision_history: true } },
        { code: 'ghg_emissions_gdp', name: 'Växthusgaser/BNP', name_en: 'GHG Emissions per GDP', definition: 'Växthusgasutsläpp per BNP-enhet', unit: 'kg/USD', direction: 'lower_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['UNFCCC', 'World Bank'], confidence_rules: { min_coverage: 0.85, max_lag_months: 24, requires_revision_history: true } },
        { code: 'air_quality_pm25', name: 'Luftkvalitet PM2.5', name_en: 'PM2.5 Air Pollution', definition: 'Medelexponering för PM2.5', unit: 'µg/m³', direction: 'lower_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country', 'nuts1', 'nuts2'], demographic_dimensions: [], preferred_sources: ['WHO', 'EEA'], confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true } }
      ]
    },
    {
      code: 'energy',
      name: 'Energi',
      name_en: 'Energy',
      description: 'Energiproduktion och -konsumtion',
      kpis: [
        { code: 'renewable_energy_share', name: 'Förnybar energi', name_en: 'Renewable Energy Share', definition: 'Andel förnybar energi av total konsumtion', unit: '%', direction: 'higher_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['IEA', 'Eurostat'], confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true } },
        { code: 'energy_intensity', name: 'Energiintensitet', name_en: 'Energy Intensity', definition: 'Energikonsumtion per BNP-enhet', unit: 'kgoe/1000 EUR', direction: 'lower_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['IEA', 'Eurostat'], confidence_rules: { min_coverage: 0.9, max_lag_months: 18, requires_revision_history: true } }
      ]
    },
    {
      code: 'resources',
      name: 'Resurser',
      name_en: 'Resources',
      description: 'Naturresurser och cirkulär ekonomi',
      kpis: [
        { code: 'recycling_rate', name: 'Återvinningsgrad', name_en: 'Recycling Rate', definition: 'Andel kommunalt avfall som återvinns', unit: '%', direction: 'higher_better', normalization: 'percentile', comparability: 'regional', update_frequency: 'yearly', geo_levels: ['country', 'nuts1'], demographic_dimensions: [], preferred_sources: ['Eurostat', 'OECD'], confidence_rules: { min_coverage: 0.85, max_lag_months: 18, requires_revision_history: true } },
        { code: 'water_stress', name: 'Vattenstress', name_en: 'Water Stress', definition: 'Vattenuttag i förhållande till tillgång', unit: '%', direction: 'lower_better', normalization: 'percentile', comparability: 'global', update_frequency: 'yearly', geo_levels: ['country'], demographic_dimensions: [], preferred_sources: ['FAO', 'World Bank'], confidence_rules: { min_coverage: 0.7, max_lag_months: 36, requires_revision_history: false } }
      ]
    }
  ]
};

// ============================================================================
// MASTER TAXONOMY EXPORT
// ============================================================================

export const KPI_MASTER_TAXONOMY: KPIDomain[] = [
  HEALTH_DOMAIN,
  WORKFORCE_DOMAIN,
  ECONOMY_DOMAIN,
  EDUCATION_DOMAIN,
  SOCIAL_STABILITY_DOMAIN,
  DEMOGRAPHICS_DOMAIN,
  HOUSING_DOMAIN,
  INFRASTRUCTURE_DOMAIN,
  ENVIRONMENT_DOMAIN
];

// Helper functions
export function getAllKPIs(): KPIDefinitionMaster[] {
  return KPI_MASTER_TAXONOMY.flatMap(domain => 
    domain.subdomains.flatMap(subdomain => subdomain.kpis)
  );
}

export function getKPIByCode(code: string): KPIDefinitionMaster | undefined {
  return getAllKPIs().find(kpi => kpi.code === code);
}

export function getKPIsByDomain(domainCode: string): KPIDefinitionMaster[] {
  const domain = KPI_MASTER_TAXONOMY.find(d => d.code === domainCode);
  if (!domain) return [];
  return domain.subdomains.flatMap(subdomain => subdomain.kpis);
}

export function getGMIKPIs(): KPIDefinitionMaster[] {
  return getAllKPIs().filter(kpi => kpi.gmi_pillar && kpi.gmi_weight);
}

export function getKPICount(): { total: number; byDomain: Record<string, number> } {
  const all = getAllKPIs();
  const byDomain: Record<string, number> = {};
  KPI_MASTER_TAXONOMY.forEach(domain => {
    byDomain[domain.code] = domain.subdomains.flatMap(s => s.kpis).length;
  });
  return { total: all.length, byDomain };
}

// Log count on import for verification
console.log('[KPI Master Taxonomy] Loaded:', getKPICount());
