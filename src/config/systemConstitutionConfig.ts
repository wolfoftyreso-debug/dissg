/**
 * 📜 SYSTEMETS GRUNDLAG
 * Ett öppet system för att göra verkligheten begriplig
 * 
 * Version 1.0 — FRYST
 * 
 * Detta dokument är inte marknadsföring.
 * Detta är inte vision.
 * Detta är en grundlag.
 */

// ============================================================
// DOCUMENT METADATA
// ============================================================

export const CONSTITUTION_META = {
  version: '1.0',
  status: 'FROZEN' as const,
  frozenAt: '2026-02-02',
  changeRequirements: [
    'Exceptionell anledning',
    'Full transparens',
    'Offentlig motivering',
  ],
} as const;

// ============================================================
// ARTICLE 1: SYSTEMETS SYFTE
// ============================================================

export const ARTICLE_1_PURPOSE = {
  number: 1,
  title: 'SYSTEMETS SYFTE',
  
  coreStatement: 'Göra samhällelig verklighet begriplig genom aggregerad, spårbar och korrekt data.',
  
  systemDoes: [
    'Beskriver verkligheten',
    'Förklarar samband',
    'Synliggör konsekvenser',
  ] as const,
  
  systemDoesNot: [
    'Föreskriver handling',
    'Rekommenderar policy',
    'Tar ställning',
  ] as const,
} as const;

// ============================================================
// ARTICLE 2: SANNINGSPRINCIPEN
// ============================================================

export const ARTICLE_2_TRUTH = {
  number: 2,
  title: 'SANNINGSPRINCIPEN',
  
  coreStatement: 'Systemet gör inga egna påståenden om världen.',
  
  requirements: [
    'Aggregerar data från öppna, namngivna källor',
    'Redovisar metod, osäkerhet och begränsningar',
    'Skiljer alltid mellan observation, samvariation och orsak',
  ] as const,
  
  goldenRule: 'Om data är osäker, ska osäkerheten visas tydligare än siffran.',
} as const;

// ============================================================
// ARTICLE 3: SKALPRINCIPEN
// ============================================================

export const ARTICLE_3_SCALE = {
  number: 3,
  title: 'SKALPRINCIPEN',
  
  coreStatement: 'All information ska visas på rätt skala.',
  
  requirements: [
    'Börjar alltid i det stora perspektivet',
    'Tillåter fördjupning utan att tappa kontext',
    'Förhindrar feltolkning genom skalförlust',
  ] as const,
  
  prohibitions: [
    'Inget lokalt får presenteras som globalt',
    'Inget kortsiktigt får presenteras som långsiktigt',
  ] as const,
} as const;

// ============================================================
// ARTICLE 4: TIDSPRINCIPEN
// ============================================================

export const ARTICLE_4_TIME = {
  number: 4,
  title: 'TIDSPRINCIPEN',
  
  acknowledgements: [
    'Beslut får konsekvenser över generationer',
    'Kostnader skjuts ofta fram i tid',
    'Nutida vinster kan skapa framtida belastning',
  ] as const,
  
  requirements: [
    'Visa historik',
    'Visa tidsförskjutning',
    'Synliggöra intergenerationella effekter',
  ] as const,
} as const;

// ============================================================
// ARTICLE 5: NEUTRALITETSPRINCIPEN
// ============================================================

export const ARTICLE_5_NEUTRALITY = {
  number: 5,
  title: 'NEUTRALITETSPRINCIPEN',
  
  coreStatement: 'Systemet är politiskt, ideologiskt och kommersiellt neutralt.',
  
  doesNotFavor: [
    'Inget parti',
    'Ingen ideologi',
    'Inga särintressen',
  ] as const,
  
  loyalty: 'Systemets lojalitet är bunden till data, metod och mänskligt välbefinnande – inte till makt.',
} as const;

// ============================================================
// ARTICLE 6: MÄNNISKOPRINCIPEN
// ============================================================

export const ARTICLE_6_HUMAN_DIGNITY = {
  number: 6,
  title: 'MÄNNISKOPRINCIPEN',
  
  coreStatement: 'Systemet beskriver strukturer, inte individer.',
  
  requirements: [
    'Använder endast aggregerad data',
    'Rangordnar inte människor',
    'Tillskriver inte skuld till grupper',
  ] as const,
  
  goldenRule: 'All data ska presenteras så att människors värdighet bevaras.',
} as const;

// ============================================================
// ARTICLE 7: TRANSPARENSPRINCIPEN
// ============================================================

export const ARTICLE_7_TRANSPARENCY = {
  number: 7,
  title: 'TRANSPARENSPRINCIPEN',
  
  coreStatement: 'Allt systemet gör ska kunna granskas.',
  
  appliesToAll: [
    'Indikatorval',
    'Viktningar',
    'Indexkonstruktion',
    'Metodändringar',
  ] as const,
  
  prohibition: 'Inga "black boxes" får existera.',
} as const;

// ============================================================
// ARTICLE 8: ANSVARSPRINCIPEN
// ============================================================

export const ARTICLE_8_ACCOUNTABILITY = {
  number: 8,
  title: 'ANSVARSPRINCIPEN',
  
  systemShows: [
    'Vilka beslut som tagits',
    'När de tagits',
    'I vilka roller',
    'I vilka kontexter',
  ] as const,
  
  balance: {
    doesNot: 'Pekar ut skuld',
    never: 'Döljer ansvar',
  },
} as const;

// ============================================================
// ARTICLE 9: BEGRÄNSNINGSPRINCIPEN
// ============================================================

export const ARTICLE_9_LIMITATIONS = {
  number: 9,
  title: 'BEGRÄNSNINGSPRINCIPEN',
  
  coreStatement: 'Systemet ska alltid tala om vad det inte kan visa.',
  
  prohibitions: [
    'Låtsas veta mer än datan tillåter',
    'Fylla luckor med antaganden',
    'Maskera okunskap med precision',
  ] as const,
  
  goldenRule: 'Tystnad är bättre än felaktig tydlighet.',
} as const;

// ============================================================
// ARTICLE 10: FÖRVALTNINGSPRINCIPEN
// ============================================================

export const ARTICLE_10_STEWARDSHIP = {
  number: 10,
  title: 'FÖRVALTNINGSPRINCIPEN',
  
  changeRequirements: [
    'Dokumenterad metodändring',
    'Versionshantering',
    'Offentlig changelog',
  ] as const,
  
  prohibition: 'Historiska vyer får aldrig skrivas om retroaktivt.',
} as const;

// ============================================================
// ARTICLE 11: ANTI-FEATURE-PRINCIPEN
// ============================================================

export const ARTICLE_11_ANTI_FEATURES = {
  number: 11,
  title: 'ANTI-FEATURE-PRINCIPEN',
  
  permanentlyExcluded: [
    'Prognoser om framtiden',
    'Rekommendationer om vad som bör göras',
    'Rankningar av människor eller kulturer',
    'Persondata',
    'Sentimentmanipulation',
  ] as const,
} as const;

// ============================================================
// ARTICLE 12: SLUTSATS
// ============================================================

export const ARTICLE_12_CONCLUSION = {
  number: 12,
  title: 'SLUTSATS',
  
  purpose: 'Detta system är inte till för att vinna debatter. Det är till för att göra ansvar möjligt.',
  
  violations: [
    'Blir ett maktverktyg',
    'Blir ett propagandainstrument',
    'Blir ett narrativ',
  ] as const,
  
  consequence: 'Har det brutit mot sin grundlag.',
} as const;

// ============================================================
// ALL ARTICLES COLLECTION
// ============================================================

export const ALL_ARTICLES = [
  ARTICLE_1_PURPOSE,
  ARTICLE_2_TRUTH,
  ARTICLE_3_SCALE,
  ARTICLE_4_TIME,
  ARTICLE_5_NEUTRALITY,
  ARTICLE_6_HUMAN_DIGNITY,
  ARTICLE_7_TRANSPARENCY,
  ARTICLE_8_ACCOUNTABILITY,
  ARTICLE_9_LIMITATIONS,
  ARTICLE_10_STEWARDSHIP,
  ARTICLE_11_ANTI_FEATURES,
  ARTICLE_12_CONCLUSION,
] as const;

// ============================================================
// CONSTITUTION FULL TEXT (FOR DISPLAY)
// ============================================================

export const CONSTITUTION_FULL_TEXT = `
📜 SYSTEMETS GRUNDLAG
Ett öppet system för att göra verkligheten begriplig

Version 1.0 — FRYST

────────────────────────────────────────

1. SYSTEMETS SYFTE

Detta system existerar för att:
göra samhällelig verklighet begriplig genom aggregerad, spårbar och korrekt data.

Systemet:
• beskriver verkligheten
• förklarar samband
• synliggör konsekvenser

Systemet:
• föreskriver inte handling
• rekommenderar inte policy
• tar inte ställning

────────────────────────────────────────

2. SANNINGSPRINCIPEN

Systemet gör inga egna påståenden om världen.

Det:
• aggregerar data från öppna, namngivna källor
• redovisar metod, osäkerhet och begränsningar
• skiljer alltid mellan observation, samvariation och orsak

Om data är osäker, ska osäkerheten visas tydligare än siffran.

────────────────────────────────────────

3. SKALPRINCIPEN

All information ska visas på rätt skala.

Systemet:
• börjar alltid i det stora perspektivet
• tillåter fördjupning utan att tappa kontext
• förhindrar feltolkning genom skalförlust

Inget lokalt får presenteras som globalt.
Inget kortsiktigt som långsiktigt.

────────────────────────────────────────

4. TIDSPRINCIPEN

Systemet erkänner att:
• beslut får konsekvenser över generationer
• kostnader ofta skjuts fram i tid
• nutida vinster kan skapa framtida belastning

Systemet ska därför alltid:
• visa historik
• visa tidsförskjutning
• synliggöra intergenerationella effekter

────────────────────────────────────────

5. NEUTRALITETSPRINCIPEN

Systemet är politiskt, ideologiskt och kommersiellt neutralt.

Det:
• gynnar inget parti
• gynnar ingen ideologi
• gynnar inga särintressen

Systemets lojalitet är bunden till data, metod och mänskligt välbefinnande – inte till makt.

────────────────────────────────────────

6. MÄNNISKOPRINCIPEN

Systemet beskriver strukturer, inte individer.

Det:
• använder endast aggregerad data
• rangordnar inte människor
• tillskriver inte skuld till grupper

All data ska presenteras så att människors värdighet bevaras.

────────────────────────────────────────

7. TRANSPARENSPRINCIPEN

Allt systemet gör ska kunna granskas.

Det gäller:
• indikatorval
• viktningar
• indexkonstruktion
• metodändringar

Inga "black boxes" får existera.

────────────────────────────────────────

8. ANSVARSPRINCIPEN

Systemet visar:
• vilka beslut som tagits
• när de tagits
• i vilka roller
• i vilka kontexter

Systemet:
• pekar inte ut skuld
• men döljer aldrig ansvar

────────────────────────────────────────

9. BEGRÄNSNINGSPRINCIPEN

Systemet ska alltid tala om vad det inte kan visa.

Det ska aldrig:
• låtsas veta mer än datan tillåter
• fylla luckor med antaganden
• maskera okunskap med precision

Tystnad är bättre än felaktig tydlighet.

────────────────────────────────────────

10. FÖRVALTNINGSPRINCIPEN

Systemet får förändras endast genom:
• dokumenterad metodändring
• versionshantering
• offentlig changelog

Historiska vyer får aldrig skrivas om retroaktivt.

────────────────────────────────────────

11. ANTI-FEATURE-PRINCIPEN

Systemet ska aldrig innehålla:
• prognoser om framtiden
• rekommendationer om vad som bör göras
• rankningar av människor eller kulturer
• persondata
• sentimentmanipulation

────────────────────────────────────────

12. SLUTSATS

Detta system är inte till för att vinna debatter.
Det är till för att göra ansvar möjligt.

Om systemet någon gång:
• blir ett maktverktyg
• blir ett propagandainstrument
• blir ett narrativ

har det brutit mot sin grundlag.

────────────────────────────────────────

🔒 STATUS

Detta dokument är fryst.
Ändringar kräver:
• exceptionell anledning
• full transparens
• offentlig motivering

────────────────────────────────────────

KLART

Nu är allt på plats.
Det finns inget mer att bygga.
Bara att vårda.
`.trim();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getArticle(number: number) {
  return ALL_ARTICLES.find(a => a.number === number);
}

export function isConstitutionFrozen(): boolean {
  return CONSTITUTION_META.status === 'FROZEN';
}

export function canModifyConstitution(reason: string, isPublic: boolean): boolean {
  if (!isConstitutionFrozen()) return true;
  
  // Even when frozen, modifications require exceptional circumstances
  const hasExceptionalReason = reason.length > 100; // Substantial explanation
  const isTransparent = isPublic;
  
  return hasExceptionalReason && isTransparent;
}
