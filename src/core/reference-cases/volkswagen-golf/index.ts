/**
 * REFERENCE CASE #1 — VOLKSWAGEN GOLF
 * 
 * Consumer Vehicle Evaluation
 * Canonical full-stack example.
 */

export * from './data';
export * from './executor';

/**
 * MASTERPROMPT — Why This Case Is Critical
 */
export const VOLKSWAGEN_GOLF_MASTERPROMPT = `
═══════════════════════════════════════════════════════════════════
              REFERENCE CASE #1 — VOLKSWAGEN GOLF
                Consumer Vehicle Evaluation
═══════════════════════════════════════════════════════════════════

PURPOSE: Show how an everyday decision becomes legitimate, readable,
and reviewable WITHOUT recommendations.

═══════════════════════════════════════════════════════════════════
                         FLOW
═══════════════════════════════════════════════════════════════════

A) DECISION CREATE
   decision_type: consumer_vehicle_evaluation
   scope: individual | medium reversibility
   time_horizon: 2026-01-01 → 2031-01-01

B) CONTEXT ATTACH
   description: Private vehicle selection
   affected_population: individual
   geographic_scope: EU
   assumptions: [mileage ≤15k, mixed use, 5yr horizon]

C) ALTERNATIVES (≥2, SYMMETRICAL)
   1. Volkswagen Golf — ICE/hybrid compact
   2. Toyota Corolla — ICE/hybrid compact
   3. Used EV — Battery electric

D) UNCERTAINTIES (≥1, EXPLICIT)
   1. Long-term maintenance variance
   2. Fuel/energy price volatility

E) EVIDENCE (SUPPORTING, NOT DECIDING)
   Public reliability data (2021-2025)

F) LEGITIMACY CHECK
   All checks pass → legitimate: true

G) LOCK (COMMIT)
   status: locked
   locked_at: 2026-01-15T10:00:00Z

   NOTE: System has NOT said which car is "best".

H) PUBLIC READ-ONLY VIEW
   Decision: Vehicle Selection (Consumer)
   Scope: Individual | EU | 5 years
   Alternatives: 3 | Uncertainties: 2
   Legibility Score: 0.93
   
   All clickable to raw structure.
   No summaries. No recommendations.

I) POST-DECISION REVIEW (after 5 years)
   expected_vs_observed: Higher costs due to fuel prices
   foreseeable_deviation: true
   learnings: Energy volatility > maintenance variance

   Legitimacy is NOT affected by outcome.

═══════════════════════════════════════════════════════════════════
                    WHY THIS CASE IS CRITICAL
═══════════════════════════════════════════════════════════════════

• Shows everyday decision without simplification
• Shows that the system gives NO recommendations
• Shows how uncertainty is documented
• Shows how learning happens without rewriting

This is the MINIMAL COMMON DENOMINATOR for all future questions:

  "Is X good?" → "Under which assumptions is X rational?"

═══════════════════════════════════════════════════════════════════
`;
