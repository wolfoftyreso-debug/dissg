/**
 * ⚖️ INCONSISTENCY & ACCOUNTABILITY LAYER
 * 
 * When decisions, motives and outcomes don't align.
 * This is not review. This is disclosure.
 */

// ============================================================
// THE THREE-POINT COMPARISON (ALWAYS IN THIS ORDER)
// ============================================================

export const COMPARISON_FRAMEWORK = {
  title: {
    en: 'What the System Compares',
    sv: 'Vad systemet jämför',
  },
  subtitle: {
    en: 'Three elements — always in the same order',
    sv: 'Tre element — alltid i samma ordning',
  },
  points: [
    {
      id: 'declared_objective',
      order: 1,
      label: { en: 'Declared Objective', sv: 'Angivet mål' },
      question: { en: 'What has been stated publicly?', sv: 'Vad har sagts offentligt?' },
      examples: { en: 'Goal, ambition, purpose, strategy', sv: 'Mål, ambition, syfte, strategi' },
    },
    {
      id: 'observed_action',
      order: 2,
      label: { en: 'Observed Action', sv: 'Observerad handling' },
      question: { en: 'What has actually been done?', sv: 'Vad har faktiskt gjorts?' },
      examples: { en: 'Investments, policy, resource allocation, decisions', sv: 'Investeringar, policy, resursallokering, beslut' },
    },
    {
      id: 'observed_outcome',
      order: 3,
      label: { en: 'Observed Outcome', sv: 'Observerat utfall' },
      question: { en: 'What does the data show afterwards?', sv: 'Vad visar datan efteråt?' },
      examples: { en: 'Outcomes, trends, changes', sv: 'Utfall, trender, förändringar' },
    },
  ],
  principle: {
    en: 'The system makes no valuation. It only compares.',
    sv: 'Systemet gör ingen värdering. Det bara jämför.',
  },
};

// ============================================================
// INCONSISTENCY TRIGGER CONDITIONS
// ============================================================

export const INCONSISTENCY_TRIGGERS = {
  title: {
    en: 'When an Inconsistency Is Flagged',
    sv: 'När en inkonsistens markeras',
  },
  conditions: [
    {
      id: 'opposite_direction',
      condition: {
        en: 'The outcome moves in the opposite direction of the goal',
        sv: 'Utfallet rör sig i motsatt riktning mot målet',
      },
    },
    {
      id: 'unchanged_despite_action',
      condition: {
        en: 'The outcome is unchanged despite intensified measures',
        sv: 'Utfallet är oförändrat trots intensifierad åtgärd',
      },
    },
    {
      id: 'no_basis',
      condition: {
        en: 'No open documentation shows expected effect',
        sv: 'Inget öppet underlag finns som visar förväntad effekt',
      },
    },
    {
      id: 'continuation_without_followup',
      condition: {
        en: 'Decisions continue despite lack of follow-up',
        sv: 'Beslut fortsätter trots saknad uppföljning',
      },
    },
  ],
  threshold: {
    en: 'Failure is not required. Lack of demonstrated effect is sufficient.',
    sv: 'Det krävs inte "misslyckande". Det räcker med brist på visad effekt.',
  },
};

// ============================================================
// FOUR CLASSES OF INCONSISTENCY (STANDARD)
// ============================================================

export type InconsistencyClass = 'unverified_effect' | 'neutral_outcome' | 'negative_divergence' | 'insufficient_data';

export interface InconsistencyClassDefinition {
  id: InconsistencyClass;
  code: string;
  label: { en: string; sv: string };
  description: { en: string; sv: string };
  color: string; // Tailwind class
  icon: string;
}

export const INCONSISTENCY_CLASSES: InconsistencyClassDefinition[] = [
  {
    id: 'unverified_effect',
    code: 'A',
    label: { en: 'Unverified Effect', sv: 'Overifierad effekt' },
    description: {
      en: 'Measure was taken, but no follow-up can be identified.',
      sv: 'Åtgärd vidtogs, men ingen uppföljning kan identifieras.',
    },
    color: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
    icon: '?',
  },
  {
    id: 'neutral_outcome',
    code: 'B',
    label: { en: 'Neutral Outcome', sv: 'Neutralt utfall' },
    description: {
      en: 'Measure was taken, but outcome is statistically unchanged.',
      sv: 'Åtgärd vidtogs, men utfallet är statistiskt oförändrat.',
    },
    color: 'bg-slate-500/20 text-slate-700 border-slate-500/30',
    icon: '—',
  },
  {
    id: 'negative_divergence',
    code: 'C',
    label: { en: 'Negative Divergence', sv: 'Negativ avvikelse' },
    description: {
      en: 'Outcome moves in the opposite direction of the goal.',
      sv: 'Utfallet rör sig i motsatt riktning mot målet.',
    },
    color: 'bg-red-500/20 text-red-700 border-red-500/30',
    icon: '↓',
  },
  {
    id: 'insufficient_data',
    code: 'D',
    label: { en: 'Insufficient Data', sv: 'Otillräcklig data' },
    description: {
      en: 'Data is missing to draw any conclusion.',
      sv: 'Data saknas för att dra någon slutsats.',
    },
    color: 'bg-muted text-muted-foreground border-border',
    icon: '∅',
  },
];

export const CLASSES_PRINCIPLE = {
  en: 'All classes are equally neutral. The system classifies — never judges.',
  sv: 'Alla klasser är lika neutrala. Systemet klassar — aldrig dömer.',
};

// ============================================================
// PRESENTATION RULES (EXTREMELY IMPORTANT)
// ============================================================

export const PRESENTATION_RULES = {
  title: {
    en: 'How It Is Presented',
    sv: 'Hur det presenteras',
  },
  never: {
    label: { en: 'Never like this', sv: 'Aldrig så här' },
    examples: [
      { en: '"This is wrong"', sv: '"Detta är fel"' },
      { en: '"You failed"', sv: '"Ni misslyckades"' },
      { en: '"This causes harm"', sv: '"Detta skadar"' },
    ],
  },
  always: {
    label: { en: 'Always like this', sv: 'Alltid så här' },
    examples: [
      {
        en: 'Observed outcomes during this period do not align with stated objectives.',
        sv: 'Observerade utfall under denna period överensstämmer inte med angivna mål.',
      },
      {
        en: 'No publicly available data was identified that demonstrates positive effect following the implemented measures.',
        sv: 'Inga offentligt tillgängliga data identifierades som visar positiv effekt efter genomförda åtgärder.',
      },
      {
        en: 'Continued investment occurred without corresponding improvement in observed indicators.',
        sv: 'Fortsatt investering skedde utan motsvarande förbättring i observerade indikatorer.',
      },
    ],
  },
  principle: {
    en: 'No blame. Just facts.',
    sv: 'Ingen skuld. Bara fakta.',
  },
};

// ============================================================
// THE DECISIVE QUESTION (IMPLICIT IN EVERY VIEW)
// ============================================================

export const DECISIVE_QUESTION = {
  title: {
    en: 'The Decisive Question',
    sv: 'Den avgörande frågan',
  },
  note: {
    en: 'The system never asks questions aloud. But it implants this question in every view:',
    sv: 'Systemet ställer aldrig frågor högt. Men det implanterar denna fråga i varje vy:',
  },
  question: {
    en: '"Which evidence was used to justify continuation?"',
    sv: '"Vilket underlag användes för att motivera fortsättning?"',
  },
  ifExists: {
    en: 'If it exists: Perfect — link it.',
    sv: 'Om det finns: perfekt — länka det.',
  },
  ifNotExists: {
    en: "If it doesn't exist: It shows.",
    sv: 'Om det inte finns: det syns.',
  },
};

// ============================================================
// OFFICIAL PLATFORM STANCE (ALWAYS VISIBLE)
// ============================================================

export const OFFICIAL_STANCE = {
  title: {
    en: 'Official Platform Stance',
    sv: 'Plattformens officiella hållning',
  },
  statement: {
    en: 'The platform does not assess intent or competence. It displays alignment between stated objectives, actions, and observable outcomes.',
    sv: 'Plattformen bedömer inte avsikt eller kompetens. Den visar samstämmighet mellan angivna mål, handlingar och observerbara utfall.',
  },
  note: {
    en: 'This is the entire legitimacy.',
    sv: 'Detta är hela legitimiteten.',
  },
};

// ============================================================
// WHY THIS IS UNASSAILABLE
// ============================================================

export const UNASSAILABLE_LOGIC = {
  title: {
    en: 'Why This Is Unassailable',
    sv: 'Varför detta är oangripbart',
  },
  isNot: [
    { en: 'It is not criticism', sv: 'Det är inte kritik' },
    { en: 'It is not activism', sv: 'Det är inte aktivism' },
    { en: 'It is not opposition', sv: 'Det är inte opposition' },
  ],
  isSameAs: {
    label: { en: 'It is the same logic as:', sv: 'Det är samma logik som:' },
    examples: [
      { en: 'Audit', sv: 'Revision' },
      { en: 'Follow-up', sv: 'Uppföljning' },
      { en: 'Quality control', sv: 'Kvalitetskontroll' },
    ],
  },
  conclusion: {
    en: 'All organizations claim they do this. You only show if it happens.',
    sv: 'Alla organisationer säger att de gör detta. Ni visar bara om det sker.',
  },
};

// ============================================================
// WHAT HAPPENS IN PRACTICE
// ============================================================

export const PRACTICAL_EFFECTS = {
  title: {
    en: 'What Happens in Practice',
    sv: 'Vad som händer i praktiken',
  },
  intro: {
    en: 'After this, actors begin to:',
    sv: 'Efter detta börjar aktörer:',
  },
  effects: [
    { en: 'Attach reports voluntarily', sv: 'Bifoga rapporter frivilligt' },
    { en: 'Disclose assumptions', sv: 'Redovisa antaganden' },
    { en: 'Show method before criticism arises', sv: 'Visa metod innan kritik uppstår' },
    { en: 'Change course earlier', sv: 'Ändra kurs tidigare' },
  ],
  reason: {
    en: 'Not because they are forced. But because the alternative becomes embarrassing.',
    sv: 'Inte för att de tvingas. Utan för att alternativet blir pinsamt.',
  },
};

// ============================================================
// COMPLETION CRITERIA
// ============================================================

export const COMPLETION_CRITERIA = {
  title: {
    en: 'Completion Criteria',
    sv: 'Klart-kriterium',
  },
  intro: {
    en: 'This module is complete when:',
    sv: 'Denna modul är klar när:',
  },
  criteria: [
    { en: 'No one needs to raise their voice', sv: 'Ingen behöver höja rösten' },
    { en: 'Debates shift from emotion to evidence', sv: 'Debatter flyttar från känsla till underlag' },
    { en: '"Show the data" becomes the standard reply', sv: '"Visa datan" blir standardreplik' },
    { en: 'Actors begin referencing you voluntarily', sv: 'Aktörer börjar referera till er självmant' },
  ],
};

// ============================================================
// TRANSLATION HELPER
// ============================================================

export const FINAL_TRANSLATION = {
  from: {
    en: 'What you react to — "this is insane" —',
    sv: 'Det du reagerar på — "detta är galet" —',
  },
  to: {
    en: 'translates here to:',
    sv: 'översätts här till:',
  },
  result: {
    en: '"Alignment cannot be demonstrated."',
    sv: '"Samstämmighet kan inte påvisas."',
  },
  qualities: [
    { en: 'It is calm.', sv: 'Det är lugnt.' },
    { en: 'It is precise.', sv: 'Det är exakt.' },
    { en: 'And it is impossible to dismiss.', sv: 'Och det är omöjligt att vifta bort.' },
  ],
};
