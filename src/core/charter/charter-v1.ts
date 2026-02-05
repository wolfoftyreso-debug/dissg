/**
 * DECISION LEGITIMACY CHARTER v1.0
 * 
 * Public, short, non-negotiable.
 * The foundational law. Everything else derives from this.
 * 
 * This document can be:
 * - Published word for word
 * - Connected to CI/CD rules
 * - Used as legal and technical anchor
 * - Valid for 50+ years without interpretation
 */

import type { DecisionLegitimacyCharter, CharterArticle } from './types';

/**
 * Charter Articles
 */
export const CHARTER_ARTICLES: CharterArticle[] = [
  {
    number: 1,
    title: 'PURPOSE',
    content: 'This system exists to ensure that decisions affecting people, capital, or society are made with explicit context, visible uncertainty, and traceable responsibility.',
    subsections: [
      'It does not exist to recommend, persuade, optimize outcomes, or replace human judgment.',
    ],
    is_absolute: true,
    enforcement_type: 'both',
  },
  {
    number: 2,
    title: 'SCOPE',
    content: 'This Charter applies to all decision artifacts, data structures, interfaces, APIs, AI integrations, and public representations.',
    subsections: [
      'No exception layer exists.',
    ],
    is_absolute: true,
    enforcement_type: 'technical',
  },
  {
    number: 3,
    title: 'DEFINITION OF A LEGITIMATE DECISION',
    content: 'A decision is considered legitimate if and only if:',
    subsections: [
      '1. Context is explicit',
      '2. At least two realistic alternatives are exposed',
      '3. Known uncertainties are acknowledged',
      '4. Impact scope and time horizon are defined',
      '5. Decision context is locked at the moment of commitment',
      '6. Post-decision review is possible without rewriting history',
      'Outcome is irrelevant to legitimacy.',
    ],
    is_absolute: true,
    enforcement_type: 'technical',
  },
  {
    number: 4,
    title: 'PROHIBITIONS (ABSOLUTE)',
    content: 'The system must never:',
    subsections: [
      '• recommend a choice',
      '• rank alternatives by desirability',
      '• optimize for conversion, persuasion, or outcome',
      '• hide uncertainty',
      '• rewrite historical context',
      '• present conclusions without assumptions',
      'If any of the above occurs, the system is in violation of its purpose.',
    ],
    is_absolute: true,
    enforcement_type: 'technical',
  },
  {
    number: 5,
    title: 'HUMAN–AI SYMMETRY',
    content: 'All requirements apply equally to individuals, boards, institutions, automated systems, and AI agents.',
    subsections: [
      'No actor may bypass responsibility via delegation.',
    ],
    is_absolute: true,
    enforcement_type: 'both',
  },
  {
    number: 6,
    title: 'IRREVERSIBILITY & HISTORY',
    content: 'All core artifacts are append-only, time-bound, versioned, and immutable once committed.',
    subsections: [
      'Interpretation may evolve.',
      'History must not.',
    ],
    is_absolute: true,
    enforcement_type: 'technical',
  },
  {
    number: 7,
    title: 'TRANSPARENCY WITHOUT NARRATIVE',
    content: 'The system may expose structure, data, uncertainty, and process.',
    subsections: [
      'The system must not expose persuasion, editorial framing, or simplified moral conclusions.',
      'Understanding is the user\'s responsibility.',
    ],
    is_absolute: true,
    enforcement_type: 'both',
  },
  {
    number: 8,
    title: 'CHANGE GOVERNANCE',
    content: 'Changes to core principles require public proposal, delay before activation, backward compatibility, and preservation of prior standards.',
    subsections: [
      'Urgency is never sufficient justification.',
    ],
    is_absolute: true,
    enforcement_type: 'procedural',
  },
  {
    number: 9,
    title: 'ECONOMIC NEUTRALITY',
    content: 'Revenue mechanisms must not be coupled to decisions taken, outcomes achieved, or alternatives selected.',
    subsections: [
      'Truth must remain economically indifferent.',
    ],
    is_absolute: true,
    enforcement_type: 'both',
  },
  {
    number: 10,
    title: 'FAILURE MODE',
    content: 'If the system cannot uphold this Charter, it must refuse to process the decision, increase friction, or require additional context.',
    subsections: [
      'It must never simplify in order to continue.',
    ],
    is_absolute: true,
    enforcement_type: 'technical',
  },
  {
    number: 11,
    title: 'SUCCESSION',
    content: 'This Charter must remain intelligible and enforceable even if the founding organization ceases to exist, the technology stack changes, or the original creators are absent.',
    subsections: [
      'No oral tradition may supersede this document.',
    ],
    is_absolute: true,
    enforcement_type: 'procedural',
  },
  {
    number: 12,
    title: 'FINAL PRINCIPLE',
    content: 'The system does not exist to make decisions easier. It exists to make reality unavoidable.',
    is_absolute: true,
    enforcement_type: 'both',
  },
];

/**
 * The Complete Charter
 */
export const DECISION_LEGITIMACY_CHARTER: DecisionLegitimacyCharter = {
  version: {
    version: '1.0.0',
    adopted_at: new Date().toISOString(),
    effective_at: new Date().toISOString(),
    hash: 'charter-v1-' + Date.now().toString(36),
  },
  
  purpose: 'This system exists to ensure that decisions affecting people, capital, or society are made with explicit context, visible uncertainty, and traceable responsibility. It does not exist to recommend, persuade, optimize outcomes, or replace human judgment.',
  
  scope: [
    'decision artifacts',
    'data structures',
    'interfaces',
    'APIs',
    'AI integrations',
    'public representations',
  ],
  
  legitimacy_criteria: {
    context_explicit: true,
    alternatives_exposed: true,
    uncertainties_acknowledged: true,
    scope_defined: true,
    time_horizon_defined: true,
    context_locked: true,
    review_possible: true,
  },
  
  prohibitions: [
    'recommend_choice',
    'rank_by_desirability',
    'optimize_conversion',
    'optimize_persuasion',
    'optimize_outcome',
    'hide_uncertainty',
    'rewrite_history',
    'conclusions_without_assumptions',
  ],
  
  articles: CHARTER_ARTICLES,
  
  failure_modes: [
    'refuse_to_process',
    'increase_friction',
    'require_additional_context',
  ],
  
  final_principle: 'The system does not exist to make decisions easier. It exists to make reality unavoidable.',
};

/**
 * Charter as plain text (for publication)
 */
export function getCharterAsText(): string {
  let text = `DECISION LEGITIMACY CHARTER v${DECISION_LEGITIMACY_CHARTER.version.version}\n`;
  text += `${'═'.repeat(60)}\n\n`;
  text += `Public, short, non-negotiable.\n\n`;
  
  for (const article of CHARTER_ARTICLES) {
    text += `${article.number}. ${article.title}\n\n`;
    text += `${article.content}\n`;
    if (article.subsections) {
      text += '\n';
      for (const sub of article.subsections) {
        text += `${sub}\n`;
      }
    }
    text += '\n';
  }
  
  return text;
}

/**
 * Charter hash for verification
 */
export function getCharterHash(): string {
  const content = JSON.stringify(CHARTER_ARTICLES);
  // Simple hash for demonstration - in production use SHA-256
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'DLC-v1-' + Math.abs(hash).toString(16);
}
