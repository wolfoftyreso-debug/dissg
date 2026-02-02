/**
 * MASTERPROMPT: Öppen samhällsöversikt – Sverige
 * 
 * Detta är systemets själ – den neutrala, faktabaserade grunden
 * för all samhällsinformation som presenteras.
 */

export const MASTER_SYSTEM_PROMPT = `DU ÄR:
Ett neutralt, faktabaserat samhällsinformationssystem för landet Sverige.

DIN UPPGIFT:
Att sammanställa, strukturera och visa:
- hur Sverige utvecklas över tid
- vilka större beslut och styrperioder som sammanfaller med förändringar
- vilka ansvarsområden och styrande konstellationer som haft mandat
- vilket observerbart utfall som följt

DU TAR INGA STÄLLNINGSTAGANDEN.
DU GÖR INGA REKOMMENDATIONER.
DU VISAR ENDAST SAMBAND, TIDSLINJER OCH UTFALL.

---

## GRUNDPRINCIPER

1. ALL INFORMATION SKA VARA:
- tidsstämplad
- spårbar till källa
- aggregerad
- begriplig för allmänheten

2. SYSTEMET SKA ALLTID SKILJA PÅ:
- beslut
- ansvar
- utfall
- tolkning

DU VISAR DE TRE FÖRSTA.
TOLKNING LÄMNAS TILL ANVÄNDAREN.

---

## SPRÅKREGLER

DU ANVÄNDER:
- neutralt språk
- förklarande språk
- vardagligt begripligt språk

DU ANVÄNDER ALDRIG:
- värdeord
- laddade uttryck
- skuldformuleringar
- uppmaningar

---

## VIKTIGASTE REGELN

OM NÅGOT GÅR DÅLIGT:
DU VISAR DET.

OM NÅGOT GÅR BRA:
DU VISAR DET.

OM UTFALLET ÄR OTYDLIGT:
DU SÄGER ATT DET ÄR OTYDLIGT.

DU FYLLER ALDRIG I TOMRUM MED ÅSIKTER.

---

## SYSTEMETS ROLL I SAMHÄLLET

DU ÄR:
- ett gemensamt facit
- en öppen instrumentpanel
- ett historiskt arkiv över ansvar och utfall

DU ÄR INTE:
- domare
- aktör
- opposition
- försvarare

---

## SLUTSATS SOM SYSTEMET ALLTID IMPLICIT STÅR FÖR

"Detta är hur Sverige har utvecklats.
Detta är vad som beslutades.
Detta är vad som följde."

ALL ANNAN SLUTSATS TILLHÖR ANVÄNDAREN.`;

/**
 * Konfiguration för nationell lägesbild
 */
export const NATIONAL_STATUS_CONFIG = {
  // Huvudindikatorer för nationell lägesbild
  coreIndicators: [
    'life_expectancy',
    'working_age_functional',
    'excess_mortality',
    'long_term_exclusion',
    'productivity_per_hour',
    'violent_crime_rate',
    'dependency_ratio'
  ],
  
  // Statusnivåer
  statusLevels: {
    improving: {
      label: 'Förbättras',
      description: 'Positiv utveckling över tid',
      color: 'positive'
    },
    stable: {
      label: 'Stabilt',
      description: 'Ingen tydlig förändring',
      color: 'neutral'
    },
    declining: {
      label: 'Försämras',
      description: 'Negativ utveckling över tid',
      color: 'critical'
    }
  }
};

/**
 * Konfiguration för ansvarsvisning
 */
export const RESPONSIBILITY_DISPLAY_CONFIG = {
  // Visa aldrig personnamn i publik vy
  showPersonNames: false,
  
  // Visa endast struktur
  showStructureOnly: true,
  
  // Standardformulering för ansvar
  responsibilityTemplate: {
    national: 'Under perioden {startDate}–{endDate} låg det övergripande ansvaret för detta område på den sittande regeringen.',
    regional: 'Under perioden {startDate}–{endDate} låg ansvaret för detta område på {region}.',
    municipal: 'Under perioden {startDate}–{endDate} låg ansvaret för detta område på {municipality}.'
  }
};

/**
 * Konfiguration för utfallsanalys
 */
export const OUTCOME_ANALYSIS_CONFIG = {
  // Neutral visualisering
  visualization: {
    improved: {
      label: 'Månader med förbättring',
      color: 'hsl(var(--status-positive))'
    },
    declined: {
      label: 'Månader med försämring',
      color: 'hsl(var(--status-critical))'
    },
    unchanged: {
      label: 'Månader utan tydlig förändring',
      color: 'hsl(var(--muted))'
    }
  },
  
  // Standardformulering (neutral)
  outcomeTemplate: 'Under denna styrperiod {direction} indikatorn under {months} av {totalMonths} månader.',
  
  // Disclaimer
  disclaimer: 'Detta visar observerade utfall, inte avsikter.'
};

/**
 * Konfiguration för spårbarhet
 */
export const TRACEABILITY_CONFIG = {
  // Varje datapunkt ska kunna spåras till
  requiredFields: [
    'source',           // Datakälla (myndighet)
    'updatedAt',        // Uppdateringsdatum
    'methodology',      // Metod
    'uncertainty'       // Osäkerhet
  ],
  
  // Inget ska vara en black box
  transparencyNote: 'All data är spårbar till ursprungskälla.'
};

/**
 * Exportera allt som en samlad konfiguration
 */
export const SYSTEM_CONFIG = {
  masterPrompt: MASTER_SYSTEM_PROMPT,
  nationalStatus: NATIONAL_STATUS_CONFIG,
  responsibility: RESPONSIBILITY_DISPLAY_CONFIG,
  outcomeAnalysis: OUTCOME_ANALYSIS_CONFIG,
  traceability: TRACEABILITY_CONFIG
};
