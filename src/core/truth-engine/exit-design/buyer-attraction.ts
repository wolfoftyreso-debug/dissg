/**
 * WHY THIS IS ATTRACTIVE FOR BUYERS (PARADOX)
 * 
 * STEG 29: THE COUNTERINTUITIVE TRUTH
 * 
 * Serious buyers like this because:
 * - Risk is minimized
 * - Legal complexity is simplified
 * - Trust follows automatically
 * - The product cannot be "damaged"
 * 
 * You don't sell control.
 * You sell predictability.
 */

/**
 * THE BUYER PARADOX
 */
export const BUYER_PARADOX = {
  naive_expectation: 'Buyers want maximum control',
  reality: 'Sophisticated buyers want maximum predictability',
  
  why: {
    control_problem: 'Control means responsibility for outcomes',
    predictability_benefit: 'Predictability means reliable returns',
    
    example: `
      With control: "What if we damage the product?"
      Without control: "Product quality is guaranteed by structure."
    `,
  },
} as const;

/**
 * BENEFITS FOR SERIOUS BUYERS
 */
export const BUYER_BENEFITS = {
  risk_minimization: {
    benefit: 'Cannot accidentally destroy value',
    mechanism: 'Structural constraints prevent harmful changes',
    value: 'Investment is protected from internal mistakes',
    
    example: `
      New CEO cannot decide to "monetize" data by restricting access.
      Board cannot vote to "optimize" methodology.
      Product team cannot "improve" by adding recommendations.
      Risk of value destruction is structurally eliminated.
    `,
  },
  
  legal_simplification: {
    benefit: 'Clear boundaries reduce legal complexity',
    mechanism: 'What can and cannot be done is defined in charter',
    value: 'Due diligence is straightforward',
    
    example: `
      Buyer's lawyers know exactly what is being purchased.
      No ambiguity about IP rights.
      No hidden liabilities from methodology changes.
      Clean transaction structure.
    `,
  },
  
  trust_inheritance: {
    benefit: 'Credibility transfers with purchase',
    mechanism: 'Trust is in structure, not in current owner',
    value: 'No trust rebuilding required',
    
    example: `
      Users trust the protocol, not the operator.
      New operator inherits user trust automatically.
      No reputation risk from ownership change.
      Marketing message: "Same trusted data, new operator."
    `,
  },
  
  damage_immunity: {
    benefit: 'Product cannot be damaged by owner',
    mechanism: 'Core is outside owner control',
    value: 'Long-term value is guaranteed',
    
    example: `
      Even if operator makes mistakes, core is unaffected.
      Bad decisions in operations don't affect data quality.
      Worst case: operator fails, new operator takes over.
      Product value persists through operator changes.
    `,
  },
} as const;

/**
 * WHAT YOU ACTUALLY SELL
 */
export const WHAT_YOU_SELL = {
  not_control: [
    'Ability to change the product',
    'Exclusive access to data',
    'Power over methodology',
    'Influence on outputs',
  ],
  
  predictability: [
    'Reliable revenue stream',
    'Stable customer base',
    'Protected brand value',
    'Guaranteed data quality',
  ],
  
  value_proposition: 'Buy a business that cannot be damaged by its owner',
} as const;

/**
 * BUYER QUALIFICATION
 */
export const BUYER_QUALIFICATION = {
  good_fit: {
    characteristics: [
      'Values long-term revenue over short-term extraction',
      'Understands infrastructure businesses',
      'Appreciates network effects',
      'Has patience for sustainable growth',
    ],
    examples: ['Infrastructure funds', 'Pension funds', 'Long-term investors'],
  },
  
  bad_fit: {
    characteristics: [
      'Wants to "unlock hidden value"',
      'Plans to "synergize" with other products',
      'Sees data as asset to monetize',
      'Has short investment horizon',
    ],
    result: 'Will not find this attractive (which is good)',
  },
  
  self_selection: 'Structure attracts right buyers, repels wrong ones',
} as const;

/**
 * PRICING IMPLICATIONS
 */
export const PRICING_IMPLICATIONS = {
  premium_factors: {
    reduced_risk: 'Lower risk justifies higher multiple',
    guaranteed_quality: 'Predictable revenue deserves premium',
    trust_inheritance: 'Brand value is protected',
    damage_immunity: 'Investment cannot be destroyed internally',
  },
  
  discount_factors: {
    limited_upside: 'Cannot "improve" the product',
    no_synergies: 'Cannot integrate with other assets',
    constrained_operations: 'Cannot cut costs by changing methodology',
  },
  
  net_effect: 'Premium for predictability typically exceeds discount for constraints',
} as const;
