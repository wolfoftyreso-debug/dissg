/**
 * 🏛️ INSTITUTIONAL VOICE
 * 
 * The system never sounds like anger. It sounds like an auditor.
 * 
 * Same content. Irrefutable language.
 */

// ============================================================
// CORE PRINCIPLE: AUDITOR, NOT ACTIVIST
// ============================================================

export const VOICE_PRINCIPLE = {
  core: {
    en: 'The system never sounds like anger. It sounds like an auditor.',
    sv: 'Systemet ska aldrig låta som ilska. Det ska låta som en revisor.',
  },
  difference: {
    en: 'The difference is decisive.',
    sv: 'Skillnaden är avgörande.',
  },
};

// ============================================================
// WHAT THE SYSTEM NEVER SAYS
// ============================================================

export const FORBIDDEN_EXPRESSIONS = {
  title: {
    en: 'The System Never Says',
    sv: 'Systemet säger aldrig',
  },
  examples: [
    { en: '"You are insane"', sv: '"Ni är galna"' },
    { en: '"You are lying"', sv: '"Ni ljuger"' },
    { en: '"You are running it into the ground"', sv: '"Ni kör det i botten"' },
    { en: '"This is a disaster"', sv: '"Detta är en katastrof"' },
    { en: '"How can you justify this?"', sv: '"Hur kan ni försvara detta?"' },
  ],
  reason: {
    en: 'Not because they are emotionally wrong. But because they shift focus from substance to tone.',
    sv: 'Inte för att de är fel emotionellt. Utan för att de flyttar fokus från sak till ton.',
  },
};

// ============================================================
// WHAT THE SYSTEM SAYS INSTEAD
// ============================================================

export const INSTITUTIONAL_EXPRESSIONS = {
  title: {
    en: 'The System Says Instead',
    sv: 'Systemet säger istället',
  },
  patterns: [
    {
      id: 'outcome_mismatch',
      trigger: { en: 'When outcomes don\'t match objectives', sv: 'När utfall inte matchar mål' },
      expression: {
        en: 'Observed outcomes do not align with stated objectives.',
        sv: 'Observerade utfall överensstämmer inte med angivna mål.',
      },
    },
    {
      id: 'no_effect_data',
      trigger: { en: 'When no positive effect is documented', sv: 'När ingen positiv effekt är dokumenterad' },
      expression: {
        en: 'No publicly available data was identified that demonstrates positive effect during the implementation period.',
        sv: 'Inga offentligt tillgängliga data har identifierats som visar positiv effekt under genomförandeperioden.',
      },
    },
    {
      id: 'worsening_during_action',
      trigger: { en: 'When data shows worsening during intervention', sv: 'När data visar försämring under åtgärd' },
      expression: {
        en: 'Available data indicates worsening outcomes in this area during the period when measures were intensified. No public disclosure of how this was factored into continued prioritization has been identified.',
        sv: 'Tillgänglig data indikerar försämrade utfall inom detta område under perioden då åtgärderna intensifierades. Någon offentlig redovisning av hur detta vägts in i fortsatt prioritering har inte identifierats.',
      },
    },
    {
      id: 'no_basis_shown',
      trigger: { en: 'When decisions lack visible basis', sv: 'När beslut saknar synligt underlag' },
      expression: {
        en: 'Decisions have been made and investments have continued without an open, comparable and follow-up basis being presented that shows expected or observed effect.',
        sv: 'Beslut har fattats och investeringar har fortsatt utan att ett öppet, jämförbart och uppföljningsbart underlag har presenterats som visar förväntad eller observerad effekt.',
      },
    },
    {
      id: 'continuation_without_review',
      trigger: { en: 'When actions continue despite lack of evidence', sv: 'När åtgärder fortsätter trots avsaknad av bevis' },
      expression: {
        en: 'The measure has been maintained without publicly documented review of effectiveness.',
        sv: 'Åtgärden har upprätthållits utan offentligt dokumenterad utvärdering av effektivitet.',
      },
    },
  ],
  suffix: {
    en: 'That is enough. Everyone understands.',
    sv: 'Det räcker. Alla förstår.',
  },
};

// ============================================================
// THE CORE PROBLEM (SYSTEM FAILURE, NOT PERSONAL FAILURE)
// ============================================================

export const CORE_PROBLEM = {
  title: {
    en: 'The Problem Is Not That Someone Is Wrong',
    sv: 'Problemet är inte att någon har fel',
  },
  statement: {
    en: 'The problem is: The absence of a shared, open way to show:',
    sv: 'Problemet är detta: Avsaknaden av ett gemensamt, öppet sätt att visa:',
  },
  missing: [
    { en: 'Which problem is being addressed', sv: 'Vilket problem som adresseras' },
    { en: 'Which method is being used', sv: 'Vilken metod som används' },
    { en: 'What effect is expected', sv: 'Vilken effekt som förväntas' },
    { en: 'How the outcome actually looks', sv: 'Hur utfallet faktiskt ser ut' },
  ],
  consequences: [
    { en: 'Bad decisions can continue', sv: 'Dåliga beslut kan fortsätta' },
    { en: 'Good decisions cannot be defended', sv: 'Bra beslut kan inte försvaras' },
    { en: 'Accountability cannot be enforced', sv: 'Ansvar kan inte utkrävas' },
    { en: 'Learning cannot happen', sv: 'Lärande kan inte ske' },
  ],
  conclusion: {
    en: 'This is system failure, not personal failure.',
    sv: 'Och det är systemfel, inte personfel.',
  },
};

// ============================================================
// WHY THIS ENABLES DEMOCRACY
// ============================================================

export const DEMOCRACY_ENABLER = {
  title: {
    en: 'Why This Is Not an Attack on Democracy',
    sv: 'Varför detta inte är ett angrepp på demokrati',
  },
  statement: {
    en: 'On the contrary. This is what makes democracy possible:',
    sv: 'Tvärtom. Detta är det som gör demokrati möjlig:',
  },
  enables: [
    { en: 'Voters can see connections', sv: 'Väljare kan se samband' },
    { en: 'Politicians can show basis', sv: 'Politiker kan visa grund' },
    { en: 'Mistakes can be acknowledged without shame', sv: 'Misstag kan erkännas utan skam' },
    { en: 'Course can be changed without prestige', sv: 'Kurs kan ändras utan prestige' },
  ],
  alternative: {
    label: { en: 'The alternative is:', sv: 'Alternativet är:' },
    items: [
      { en: 'Emotion-based debate', sv: 'Känslobaserad debatt' },
      { en: 'Symbolic politics', sv: 'Symbolpolitik' },
      { en: 'Diffusion of responsibility', sv: 'Ansvarsdiffusion' },
    ],
  },
};

// ============================================================
// THE FINAL FORMULATION (CALM AND DIRECT)
// ============================================================

export const FINAL_FORMULATION = {
  observation: {
    en: 'You are not angry because people disagree. You are frustrated because there is no disclosure.',
    sv: 'Du är inte arg för att folk tycker olika. Du är frustrerad för att det saknas redovisning.',
  },
  solution: {
    en: 'And that is exactly the gap your system fills.',
    sv: 'Och det är exakt den luckan ditt system fyller.',
  },
  method: {
    en: 'Not with anger. Not with finger-pointing.',
    sv: 'Inte med ilska. Inte med pekpinnar.',
  },
  output: {
    en: 'But with:',
    sv: 'Utan med:',
  },
  statements: [
    { en: '"Here is the data."', sv: '"Här är datan."' },
    { en: '"Here is the outcome."', sv: '"Här är utfallet."' },
    { en: '"Here is the uncertainty."', sv: '"Här är osäkerheten."' },
    { en: '"Please show your basis."', sv: '"Visa gärna ert underlag."' },
  ],
  conclusion: {
    en: 'After that, no one needs to raise their voice.',
    sv: 'Efter det behöver ingen höja rösten.',
  },
};

// ============================================================
// INCONSISTENCY DETECTION TEMPLATES
// ============================================================

export interface InconsistencyTemplate {
  id: string;
  type: 'mismatch' | 'absence' | 'contradiction' | 'worsening';
  severity: 'notice' | 'observation' | 'significant';
  template: { en: string; sv: string };
  placeholders: string[];
}

export const INCONSISTENCY_TEMPLATES: InconsistencyTemplate[] = [
  {
    id: 'outcome_vs_objective',
    type: 'mismatch',
    severity: 'observation',
    template: {
      en: 'Stated objective: {objective}. Observed outcome during {period}: {outcome}.',
      sv: 'Angivet mål: {objective}. Observerat utfall under {period}: {outcome}.',
    },
    placeholders: ['objective', 'period', 'outcome'],
  },
  {
    id: 'no_public_basis',
    type: 'absence',
    severity: 'notice',
    template: {
      en: 'No publicly available documentation was identified showing the basis for {decision}.',
      sv: 'Ingen offentligt tillgänglig dokumentation identifierades som visar underlaget för {decision}.',
    },
    placeholders: ['decision'],
  },
  {
    id: 'trend_during_action',
    type: 'worsening',
    severity: 'significant',
    template: {
      en: '{indicator} showed {direction} of {magnitude} during the period {period}, when {action} was implemented.',
      sv: '{indicator} visade {direction} på {magnitude} under perioden {period}, då {action} genomfördes.',
    },
    placeholders: ['indicator', 'direction', 'magnitude', 'period', 'action'],
  },
  {
    id: 'claimed_vs_measured',
    type: 'contradiction',
    severity: 'observation',
    template: {
      en: 'Claimed effect: {claimed}. Measured effect in available data: {measured}.',
      sv: 'Påstådd effekt: {claimed}. Uppmätt effekt i tillgänglig data: {measured}.',
    },
    placeholders: ['claimed', 'measured'],
  },
  {
    id: 'continuation_without_evaluation',
    type: 'absence',
    severity: 'notice',
    template: {
      en: '{action} has been maintained since {start_date}. No public evaluation of effectiveness was identified.',
      sv: '{action} har upprätthållits sedan {start_date}. Ingen offentlig utvärdering av effektivitet identifierades.',
    },
    placeholders: ['action', 'start_date'],
  },
];

// ============================================================
// ACCOUNTABILITY WITHOUT LOSING FACE
// ============================================================

export const GRACEFUL_ACCOUNTABILITY = {
  title: {
    en: 'How Accountability Can Be Taken Without Losing Face',
    sv: 'Hur ansvar kan tas utan att tappa ansiktet',
  },
  principle: {
    en: 'The system shows the gap. It does not assign blame.',
    sv: 'Systemet visar luckan. Det tillskriver inte skuld.',
  },
  enables: [
    {
      actor: { en: 'Decision-maker', sv: 'Beslutsfattare' },
      canSay: {
        en: '"Based on this updated picture, we are adjusting our approach."',
        sv: '"Baserat på denna uppdaterade bild justerar vi vårt tillvägagångssätt."',
      },
    },
    {
      actor: { en: 'Opposition', sv: 'Opposition' },
      canSay: {
        en: '"The data shows a different outcome than stated. We request clarification."',
        sv: '"Datan visar ett annat utfall än det angivna. Vi begär förtydligande."',
      },
    },
    {
      actor: { en: 'Media', sv: 'Media' },
      canSay: {
        en: '"According to aggregated public data, observed outcomes differ from stated objectives."',
        sv: '"Enligt aggregerad offentlig data skiljer sig observerade utfall från angivna mål."',
      },
    },
    {
      actor: { en: 'Citizen', sv: 'Medborgare' },
      canSay: {
        en: '"I can see what was claimed and what happened. I can form my own conclusion."',
        sv: '"Jag kan se vad som påstods och vad som hände. Jag kan bilda min egen slutsats."',
      },
    },
  ],
  conclusion: {
    en: 'No accusation. Just visibility.',
    sv: 'Ingen anklagelse. Bara synlighet.',
  },
};
