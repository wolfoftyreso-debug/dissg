/**
 * GSSE — Cross-Domain Causal Graph
 * Maps how variables propagate effects across domains with time delays
 */

import type { CausalGraph } from './types';

export const CROSS_DOMAIN_GRAPH: CausalGraph = {
  ultra_processed_food: [
    { target: "obesity",             strength: 0.72, delayLag: 1, delayPeak: 5,  domain: "health",       direction: "positive" },
    { target: "gut_microbiome",      strength: 0.58, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "negative" },
    { target: "healthcare_cost",     strength: 0.61, delayLag: 3, delayPeak: 10, domain: "economic",     direction: "positive" },
    { target: "food_system_cost",    strength: 0.44, delayLag: 0, delayPeak: 3,  domain: "economic",     direction: "positive" },
  ],
  obesity: [
    { target: "type2_diabetes",      strength: 0.88, delayLag: 2, delayPeak: 8,  domain: "health",       direction: "positive" },
    { target: "cardiovascular",      strength: 0.79, delayLag: 3, delayPeak: 10, domain: "health",       direction: "negative" },
    { target: "mental_health",       strength: 0.52, delayLag: 1, delayPeak: 4,  domain: "health",       direction: "negative" },
    { target: "workforce_productivity", strength: 0.43, delayLag: 2, delayPeak: 7, domain: "economic",   direction: "negative" },
    { target: "healthcare_cost",     strength: 0.74, delayLag: 2, delayPeak: 8,  domain: "economic",     direction: "positive" },
  ],
  type2_diabetes: [
    { target: "life_expectancy",     strength: 0.71, delayLag: 5, delayPeak: 15, domain: "health",       direction: "negative" },
    { target: "healthcare_cost",     strength: 0.82, delayLag: 1, delayPeak: 6,  domain: "economic",     direction: "positive" },
    { target: "cardiovascular",      strength: 0.76, delayLag: 3, delayPeak: 10, domain: "health",       direction: "negative" },
  ],
  resistance_training: [
    { target: "muscle_mass",         strength: 0.82, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "positive" },
    { target: "metabolic_rate",      strength: 0.74, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "positive" },
    { target: "insulin_sensitivity", strength: 0.78, delayLag: 0, delayPeak: 0,  domain: "health",       direction: "positive" },
    { target: "mental_health",       strength: 0.61, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "positive" },
    { target: "healthcare_cost",     strength: 0.52, delayLag: 5, delayPeak: 15, domain: "economic",     direction: "negative" },
  ],
  aerobic_exercise: [
    { target: "cardiovascular",      strength: 0.88, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "positive" },
    { target: "mental_health",       strength: 0.72, delayLag: 0, delayPeak: 0,  domain: "health",       direction: "positive" },
    { target: "air_quality",         strength: 0.15, delayLag: 0, delayPeak: 5,  domain: "environmental", direction: "negative" },
    { target: "life_expectancy",     strength: 0.69, delayLag: 3, delayPeak: 10, domain: "health",       direction: "positive" },
  ],
  nature_exposure: [
    { target: "stress_levels",       strength: 0.64, delayLag: 0, delayPeak: 0,  domain: "health",       direction: "negative" },
    { target: "mental_health",       strength: 0.68, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "positive" },
    { target: "physical_activity",   strength: 0.52, delayLag: 0, delayPeak: 1,  domain: "behavioral",   direction: "positive" },
    { target: "biodiversity",        strength: 0.48, delayLag: 1, delayPeak: 10, domain: "environmental", direction: "positive" },
    { target: "air_quality",         strength: 0.41, delayLag: 0, delayPeak: 5,  domain: "environmental", direction: "positive" },
    { target: "social_cohesion",     strength: 0.44, delayLag: 0, delayPeak: 2,  domain: "social",       direction: "positive" },
  ],
  sleep_duration: [
    { target: "cognitive_function",  strength: 0.78, delayLag: 0, delayPeak: 0,  domain: "health",       direction: "positive" },
    { target: "immune_function",     strength: 0.65, delayLag: 0, delayPeak: 0,  domain: "health",       direction: "positive" },
    { target: "mental_health",       strength: 0.74, delayLag: 0, delayPeak: 1,  domain: "health",       direction: "positive" },
    { target: "cortisol",            strength: 0.81, delayLag: 0, delayPeak: 0,  domain: "health",       direction: "negative" },
    { target: "workforce_productivity", strength: 0.58, delayLag: 0, delayPeak: 1, domain: "economic",   direction: "positive" },
  ],
  education_investment: [
    { target: "income_level",        strength: 0.72, delayLag: 5, delayPeak: 20, domain: "economic",     direction: "positive" },
    { target: "health_literacy",     strength: 0.68, delayLag: 3, delayPeak: 15, domain: "health",       direction: "positive" },
    { target: "diet_quality",        strength: 0.54, delayLag: 5, delayPeak: 15, domain: "behavioral",   direction: "positive" },
    { target: "inequality",          strength: 0.61, delayLag: 8, delayPeak: 25, domain: "economic",     direction: "negative" },
    { target: "gdp_growth",          strength: 0.67, delayLag: 10, delayPeak: 30, domain: "economic",    direction: "positive" },
    { target: "political_stability", strength: 0.48, delayLag: 10, delayPeak: 25, domain: "social",      direction: "positive" },
  ],
  active_transport: [
    { target: "physical_activity",   strength: 0.71, delayLag: 0, delayPeak: 2,  domain: "behavioral",   direction: "positive" },
    { target: "air_quality",         strength: 0.68, delayLag: 0, delayPeak: 3,  domain: "environmental", direction: "positive" },
    { target: "co2_emissions",       strength: 0.55, delayLag: 0, delayPeak: 5,  domain: "environmental", direction: "negative" },
    { target: "cardiovascular",      strength: 0.62, delayLag: 1, delayPeak: 5,  domain: "health",       direction: "positive" },
    { target: "social_cohesion",     strength: 0.38, delayLag: 0, delayPeak: 3,  domain: "social",       direction: "positive" },
    { target: "transport_cost",      strength: 0.52, delayLag: 0, delayPeak: 2,  domain: "economic",     direction: "negative" },
  ],
  renewable_energy: [
    { target: "co2_emissions",       strength: 0.88, delayLag: 0, delayPeak: 5,  domain: "environmental", direction: "negative" },
    { target: "air_quality",         strength: 0.72, delayLag: 0, delayPeak: 3,  domain: "environmental", direction: "positive" },
    { target: "respiratory_health",  strength: 0.58, delayLag: 1, delayPeak: 5,  domain: "health",       direction: "positive" },
    { target: "energy_cost",         strength: 0.42, delayLag: 3, delayPeak: 10, domain: "economic",     direction: "negative" },
    { target: "energy_security",     strength: 0.61, delayLag: 2, delayPeak: 8,  domain: "economic",     direction: "positive" },
    { target: "biodiversity",        strength: 0.31, delayLag: 5, delayPeak: 20, domain: "environmental", direction: "positive" },
  ],
};
