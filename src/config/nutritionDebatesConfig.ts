/**
 * 🥗 MASTER EXECUTION BLOCK 50
 * 
 * Example Nutrition Debates — Data Only
 * 
 * Pre-configured debate pages for common nutrition topics.
 * Each follows the mandatory structure.
 */

import type { DebatePageData } from '@/components/seo/DebatePageTemplate';
import { NUTRITION_DISCLAIMERS } from './nutritionDomainConfig';

const BASE_URL = 'https://globalrealityindex.org';

export const NUTRITION_DEBATES: DebatePageData[] = [
  {
    debateId: 'DEBATE-NUTR-LOWCARB-LOWFAT-001',
    slug: 'low-carb-vs-low-fat',
    domain: 'nutrition',
    title: 'Low-carb vs low-fat: what population data shows',
    description: 'Summary of population-level data on low-carbohydrate and low-fat dietary patterns, without recommendations.',
    
    whatDebateIsAbout: 'Different dietary approaches emphasize either reducing carbohydrate or fat intake for weight management and metabolic health. This page summarizes what population-level data shows about these patterns, without endorsing either approach.',
    
    dataUsedInDebate: [
      'National dietary surveys (macronutrient distribution)',
      'Obesity prevalence trends',
      'Type 2 diabetes incidence rates',
      'Published meta-analyses of randomized trials (summary level only)',
    ],
    
    whatDataShows: 'Population data shows that average macronutrient distributions vary significantly between countries and have changed over time. Countries with both high-carbohydrate and high-fat dietary patterns exist across the obesity prevalence spectrum. Short-term trial data suggests both approaches can produce weight loss, with high individual variation.',
    
    whatDataCannotShow: 'Population-level data cannot determine which dietary approach is superior for individuals. Observational data cannot establish causation. Trial data has limited follow-up periods and generalizability. Confounding factors (overall diet quality, physical activity, socioeconomic status) are not fully controlled.',
    
    keyUncertainties: [
      'Long-term adherence and outcomes beyond 2 years',
      'Interaction effects with individual metabolic profiles',
      'Role of food quality vs macronutrient ratios',
      'Publication bias in intervention trials',
    ],
    
    methodologicalChallenges: [
      'Self-reported dietary data is unreliable',
      'Definition of "low-carb" and "low-fat" varies across studies',
      'Ecological comparisons confounded by many factors',
      'Healthy user bias in observational studies',
    ],
    
    underlyingFacts: [
      { url: '/facts/nutrition/intake/global/1960-2024', title: 'Global macronutrient trends (1960–2024)' },
      { url: '/facts/nutrition/health-outcomes/global/1990-2024', title: 'Global obesity prevalence (1990–2024)' },
    ],
    
    underlyingIndicators: [
      { url: '/indicators/nutrition/macronutrient-distribution', title: 'Macronutrient distribution' },
      { url: '/indicators/nutrition/obesity-prevalence', title: 'Obesity prevalence' },
      { url: '/indicators/nutrition/type2-diabetes-prevalence', title: 'Type 2 diabetes prevalence' },
    ],
    
    relatedDebates: [
      { url: '/nutrition/debates/ultra-processed-foods-health', title: 'Ultra-processed foods and health' },
      { url: '/nutrition/debates/sugar-restriction-outcomes', title: 'Sugar restriction and health outcomes' },
    ],
    
    canonicalUrl: `${BASE_URL}/nutrition/debates/low-carb-vs-low-fat`,
    lastUpdated: '2026-02-01',
    version: 'v1.0.0',
    disclaimer: NUTRITION_DISCLAIMERS.debate,
  },
  
  {
    debateId: 'DEBATE-NUTR-REDMEAT-001',
    slug: 'red-meat-consumption-mortality',
    domain: 'nutrition',
    title: 'Red meat consumption and mortality: observed associations',
    description: 'Population data on the association between red meat consumption and mortality rates, with explicit uncertainty.',
    
    whatDebateIsAbout: 'The relationship between red meat consumption and health outcomes, particularly mortality, has been debated for decades. This page summarizes what observational population data shows about this association.',
    
    dataUsedInDebate: [
      'Cohort study meta-analyses (summary level)',
      'National meat consumption data (FAO)',
      'Cause-specific mortality statistics (WHO)',
      'Cardiovascular disease incidence rates',
    ],
    
    whatDataShows: 'Observational studies show modest positive associations between processed meat consumption and all-cause mortality, and smaller or null associations for unprocessed red meat. These associations are attenuated when adjusted for overall dietary patterns and socioeconomic factors. Cross-country ecological comparisons show weak and inconsistent patterns.',
    
    whatDataCannotShow: 'Observational data cannot prove causation. Residual confounding by unmeasured factors (cooking methods, overall diet quality, socioeconomic status) cannot be excluded. The effect of meat type, preparation method, and dietary context cannot be separated in most population data.',
    
    keyUncertainties: [
      'Magnitude of any causal effect (if present)',
      'Distinction between meat type and processing method',
      'Interaction with overall dietary pattern',
      'Generalizability across populations',
    ],
    
    methodologicalChallenges: [
      'Dietary assessment typically captures only baseline habits',
      'Confounding by healthy/unhealthy lifestyle patterns',
      'Publication bias toward positive findings',
      'Changing meat products over time',
    ],
    
    underlyingFacts: [
      { url: '/facts/nutrition/consumption-patterns/global/1960-2024', title: 'Global meat consumption trends (1960–2024)' },
      { url: '/facts/nutrition/health-outcomes/global/1990-2024', title: 'Cardiovascular mortality trends (1990–2024)' },
    ],
    
    underlyingIndicators: [
      { url: '/indicators/nutrition/red-meat-consumption', title: 'Red meat consumption' },
      { url: '/indicators/nutrition/processed-meat-consumption', title: 'Processed meat consumption' },
      { url: '/indicators/nutrition/cvd-mortality', title: 'Cardiovascular mortality' },
    ],
    
    relatedDebates: [
      { url: '/nutrition/debates/low-carb-vs-low-fat', title: 'Low-carb vs low-fat dietary patterns' },
      { url: '/nutrition/debates/plant-based-diets-outcomes', title: 'Plant-based diets and health outcomes' },
    ],
    
    canonicalUrl: `${BASE_URL}/nutrition/debates/red-meat-consumption-mortality`,
    lastUpdated: '2026-02-01',
    version: 'v1.0.0',
    disclaimer: NUTRITION_DISCLAIMERS.debate,
  },
  
  {
    debateId: 'DEBATE-NUTR-UPF-001',
    slug: 'ultra-processed-foods-health',
    domain: 'nutrition',
    title: 'Ultra-processed foods and health outcomes: trends',
    description: 'Population data on ultra-processed food consumption trends and associated health outcomes.',
    
    whatDebateIsAbout: 'Ultra-processed foods (UPF), as defined by the NOVA classification, have been associated with various health outcomes in observational studies. This page summarizes population-level consumption trends and observed associations.',
    
    dataUsedInDebate: [
      'National dietary surveys with NOVA classification',
      'Sales data for packaged foods',
      'Obesity and metabolic disease prevalence',
      'Published cohort study summaries',
    ],
    
    whatDataShows: 'UPF consumption has increased in most high-income countries over the past decades. Observational studies consistently show positive associations between UPF consumption and obesity, type 2 diabetes, and cardiovascular disease. These associations persist after adjustment for total energy intake in most studies.',
    
    whatDataCannotShow: 'Whether the association is causal or due to confounding factors (socioeconomic status, overall diet quality, lifestyle). Whether any effect is due to processing per se, nutrient composition, additives, or other factors. Individual-level variation in response.',
    
    keyUncertainties: [
      'Mechanism of any potential effect',
      'Role of processing vs nutrient profile',
      'Validity of NOVA classification',
      'Threshold effects (if any)',
    ],
    
    methodologicalChallenges: [
      'NOVA classification is debated and may misclassify some foods',
      'Limited long-term intervention data',
      'Difficulty separating UPF from overall dietary pattern',
      'Reverse causation possible in some studies',
    ],
    
    underlyingFacts: [
      { url: '/facts/nutrition/consumption-patterns/global/1990-2024', title: 'UPF consumption trends (1990–2024)' },
      { url: '/facts/nutrition/health-outcomes/global/1990-2024', title: 'Obesity trends (1990–2024)' },
    ],
    
    underlyingIndicators: [
      { url: '/indicators/nutrition/ultra-processed-foods', title: 'Ultra-processed food consumption' },
      { url: '/indicators/nutrition/obesity-prevalence', title: 'Obesity prevalence' },
      { url: '/indicators/nutrition/type2-diabetes-prevalence', title: 'Type 2 diabetes prevalence' },
    ],
    
    relatedDebates: [
      { url: '/nutrition/debates/low-carb-vs-low-fat', title: 'Low-carb vs low-fat dietary patterns' },
      { url: '/nutrition/debates/sugar-restriction-outcomes', title: 'Sugar restriction and health outcomes' },
    ],
    
    canonicalUrl: `${BASE_URL}/nutrition/debates/ultra-processed-foods-health`,
    lastUpdated: '2026-02-01',
    version: 'v1.0.0',
    disclaimer: NUTRITION_DISCLAIMERS.debate,
  },
];

export function getNutritionDebateBySlug(slug: string): DebatePageData | undefined {
  return NUTRITION_DEBATES.find(d => d.slug === slug);
}

export function getAllNutritionDebates(): DebatePageData[] {
  return NUTRITION_DEBATES;
}
