/**
 * OEM-Class Fault Code Taxonomy
 * 
 * Civilisationens ECU - felkoder för samhällssystem.
 * Format: [DOMÄN]-[SYSTEM]-[TYP]-[NUMMER]
 * 
 * HÅRDA REGLER:
 * 1. Felkoder är tekniska – aldrig politiska
 * 2. Felkoder beskriver avvikelse, inte skuld
 * 3. En felkod kan aldrig vara ensam
 * 4. Varje felkod måste vara spårbar till mätblock
 * 5. Felkoder triggas bara av data, aldrig text
 */

// =============================================================================
// DOMAINS (TOPPNIVÅ) - LOCKED
// =============================================================================

export type FaultDomain = 
  | 'ECO'  // Ekonomi
  | 'SOC'  // Social struktur
  | 'HEA'  // Hälsa
  | 'EDU'  // Utbildning
  | 'ENE'  // Energi
  | 'ENV'  // Ekologi / miljö
  | 'GOV'  // Institutioner / styrning
  | 'LAB'  // Arbetsmarknad
  | 'SEC'  // Säkerhet
  | 'DEM'; // Demografi

export const FAULT_DOMAINS: Record<FaultDomain, { name: string; description: string }> = {
  ECO: { name: 'Ekonomi', description: 'Ekonomiska system och resurser' },
  SOC: { name: 'Social struktur', description: 'Sociala förhållanden och sammanhållning' },
  HEA: { name: 'Hälsa', description: 'Hälsotillstånd och sjukvård' },
  EDU: { name: 'Utbildning', description: 'Utbildningssystem och kompetens' },
  ENE: { name: 'Energi', description: 'Energiförsörjning och effektivitet' },
  ENV: { name: 'Ekologi', description: 'Miljö och ekologiska system' },
  GOV: { name: 'Styrning', description: 'Institutioner och förvaltning' },
  LAB: { name: 'Arbetsmarknad', description: 'Sysselsättning och arbetsvillkor' },
  SEC: { name: 'Säkerhet', description: 'Samhällssäkerhet och stabilitet' },
  DEM: { name: 'Demografi', description: 'Befolkningsstruktur och dynamik' },
};

// =============================================================================
// SUBSYSTEMS PER DOMAIN - LOCKED
// =============================================================================

export type FaultSubsystem = string;

export const DOMAIN_SUBSYSTEMS: Record<FaultDomain, Record<string, { name: string; description: string }>> = {
  ECO: {
    FIS: { name: 'Offentliga finanser', description: 'Statsbudget, skuld, skatter' },
    MON: { name: 'Monetära förhållanden', description: 'Inflation, räntor, valuta' },
    INE: { name: 'Inkomstfördelning', description: 'Ojämlikhet, Gini, deciler' },
    PRO: { name: 'Produktivitet', description: 'BNP per capita, arbetsproduktivitet' },
    CAP: { name: 'Kapitalallokering', description: 'Investeringar, kapitalbildning' },
    TRD: { name: 'Handel', description: 'Export, import, handelsbalans' },
  },
  SOC: {
    HOU: { name: 'Boende', description: 'Bostadsmarknad, trångboddhet' },
    CRI: { name: 'Brott', description: 'Brottslighet, rättssystem' },
    COH: { name: 'Sammanhållning', description: 'Social tillit, integration' },
    POV: { name: 'Fattigdom', description: 'Relativ och absolut fattigdom' },
    TRU: { name: 'Tillit', description: 'Institutionell och mellanmänsklig tillit' },
    FAM: { name: 'Familj', description: 'Familjestruktur, fertilitet' },
  },
  HEA: {
    MOR: { name: 'Mortalitet', description: 'Dödstal, dödsorsaker' },
    LIF: { name: 'Livslängd', description: 'Förväntad livslängd, friska år' },
    DIS: { name: 'Sjukdomsbörda', description: 'DALY, kroniska sjukdomar' },
    SUB: { name: 'Substanser', description: 'Missbruk, beroende' },
    ACC: { name: 'Tillgänglighet', description: 'Vårdtillgång, väntetider' },
    MEN: { name: 'Mental hälsa', description: 'Psykisk ohälsa, suicid' },
  },
  EDU: {
    LIT: { name: 'Literacy', description: 'Läs- och skrivkunnighet' },
    NUM: { name: 'Numeracy', description: 'Matematisk förmåga' },
    TER: { name: 'Tertiär', description: 'Högre utbildning' },
    VOC: { name: 'Yrkesutbildning', description: 'Yrkesskolor, praktik' },
    QUA: { name: 'Kvalitet', description: 'PISA, lärarresurser' },
    EQU: { name: 'Jämlikhet', description: 'Utbildningsklyftor' },
  },
  ENE: {
    SUP: { name: 'Försörjning', description: 'Energitillgång, produktion' },
    EFF: { name: 'Effektivitet', description: 'Energiintensitet' },
    MIX: { name: 'Energimix', description: 'Fossilt vs förnybart' },
    PRI: { name: 'Priser', description: 'Energikostnader' },
    SEC: { name: 'Säkerhet', description: 'Energioberoende' },
    GRI: { name: 'Nät', description: 'Elnätskapacitet' },
  },
  ENV: {
    EMI: { name: 'Utsläpp', description: 'CO2, växthusgaser' },
    BIO: { name: 'Biologisk mångfald', description: 'Artutdöende, ekosystem' },
    WAT: { name: 'Vatten', description: 'Vattenkvalitet, tillgång' },
    AIR: { name: 'Luft', description: 'Luftkvalitet, partiklar' },
    WAS: { name: 'Avfall', description: 'Sophantering, återvinning' },
    LAN: { name: 'Mark', description: 'Markanvändning, erosion' },
  },
  GOV: {
    COR: { name: 'Korruption', description: 'Korruptionsindex' },
    EFF: { name: 'Effektivitet', description: 'Förvaltningseffektivitet' },
    TRA: { name: 'Transparens', description: 'Öppenhet, insyn' },
    RUL: { name: 'Rättsstat', description: 'Rule of law' },
    DEM: { name: 'Demokrati', description: 'Demokratiindex' },
    REG: { name: 'Reglering', description: 'Regleringsbörda' },
  },
  LAB: {
    UNE: { name: 'Arbetslöshet', description: 'Arbetslöshetsnivåer' },
    PAR: { name: 'Deltagande', description: 'Arbetskraftsdeltagande' },
    WAG: { name: 'Löner', description: 'Lönenivåer, löneutveckling' },
    CON: { name: 'Villkor', description: 'Arbetsvillkor, säkerhet' },
    SKI: { name: 'Kompetens', description: 'Kompetensmatchning' },
    AUT: { name: 'Automatisering', description: 'Automatiseringsrisk' },
  },
  SEC: {
    VIO: { name: 'Våld', description: 'Våldsbrott, mord' },
    TER: { name: 'Terrorism', description: 'Terrorhot' },
    CYB: { name: 'Cyber', description: 'Cybersäkerhet' },
    DEF: { name: 'Försvar', description: 'Försvarskapacitet' },
    DIS: { name: 'Katastrof', description: 'Katastrofberedskap' },
    SOC: { name: 'Social oro', description: 'Protester, konflikter' },
  },
  DEM: {
    AGE: { name: 'Åldersstruktur', description: 'Försörjningskvot' },
    FER: { name: 'Fertilitet', description: 'Födelsetal' },
    MIG: { name: 'Migration', description: 'In- och utvandring' },
    URB: { name: 'Urbanisering', description: 'Stadsbefolkning' },
    POP: { name: 'Population', description: 'Befolkningstillväxt' },
    DEP: { name: 'Beroende', description: 'Försörjningsbörda' },
  },
};

// =============================================================================
// DEVIATION TYPES - LOCKED
// =============================================================================

export type DeviationType = 
  | 'STR'  // Strukturell
  | 'TRE'  // Trendbaserad
  | 'RES'  // Resursrelaterad
  | 'SYS'  // Systemisk
  | 'DAT'  // Datakvalitet
  | 'VAR'; // Volatilitet

export const DEVIATION_TYPES: Record<DeviationType, { name: string; description: string }> = {
  STR: { name: 'Strukturell', description: 'Fel i grundstruktur' },
  TRE: { name: 'Trendbaserad', description: 'Negativ långtidstrend' },
  RES: { name: 'Resursrelaterad', description: 'Resursallokering eller -brist' },
  SYS: { name: 'Systemisk', description: 'Kopplat till systemlogik' },
  DAT: { name: 'Datakvalitet', description: 'Data otillräcklig eller motsägelsefull' },
  VAR: { name: 'Volatilitet', description: 'Onormal fluktuation' },
};

// =============================================================================
// SEVERITY LEVELS (BY NUMBER RANGE)
// =============================================================================

export type FaultSeverity = 'informational' | 'warning' | 'critical' | 'systemic' | 'unknown';

export function getSeverityFromNumber(number: number): FaultSeverity {
  if (number >= 1 && number <= 99) return 'informational';
  if (number >= 100 && number <= 299) return 'warning';
  if (number >= 300 && number <= 699) return 'critical';
  if (number >= 700 && number <= 899) return 'systemic';
  if (number >= 900 && number <= 999) return 'unknown';
  return 'unknown';
}

export const SEVERITY_CONFIG: Record<FaultSeverity, { 
  label: string; 
  color: string; 
  range: string;
  action: string;
}> = {
  informational: { 
    label: 'INFORMATIV', 
    color: 'hsl(var(--muted-foreground))',
    range: '001–099',
    action: 'Observera',
  },
  warning: { 
    label: 'VARNING', 
    color: 'hsl(var(--warning))',
    range: '100–299',
    action: 'Undersök',
  },
  critical: { 
    label: 'KRITISK', 
    color: 'hsl(var(--destructive))',
    range: '300–699',
    action: 'Åtgärda',
  },
  systemic: { 
    label: 'SYSTEMISK', 
    color: 'hsl(var(--accent))',
    range: '700–899',
    action: 'Djupanalys',
  },
  unknown: { 
    label: 'OKÄND', 
    color: 'hsl(var(--muted))',
    range: '900–999',
    action: 'Datainsamling',
  },
};

// =============================================================================
// FAULT CODE FORMAT VALIDATOR
// =============================================================================

export interface ParsedFaultCode {
  domain: FaultDomain;
  subsystem: string;
  deviationType: DeviationType;
  number: number;
  severity: FaultSeverity;
  fullCode: string;
}

export function parseFaultCode(code: string): ParsedFaultCode | null {
  const regex = /^([A-Z]{3})-([A-Z]{3})-([A-Z]{3})-(\d{3})$/;
  const match = code.match(regex);
  
  if (!match) return null;
  
  const [, domain, subsystem, deviationType, numberStr] = match;
  const number = parseInt(numberStr, 10);
  
  if (!FAULT_DOMAINS[domain as FaultDomain]) return null;
  if (!DEVIATION_TYPES[deviationType as DeviationType]) return null;
  
  return {
    domain: domain as FaultDomain,
    subsystem,
    deviationType: deviationType as DeviationType,
    number,
    severity: getSeverityFromNumber(number),
    fullCode: code,
  };
}

export function formatFaultCode(
  domain: FaultDomain,
  subsystem: string,
  deviationType: DeviationType,
  number: number
): string {
  const paddedNumber = number.toString().padStart(3, '0');
  return `${domain}-${subsystem}-${deviationType}-${paddedNumber}`;
}

export function validateFaultCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseFaultCode(code);
  
  if (!parsed) {
    errors.push('Ogiltigt format. Måste vara [DOMÄN]-[SYSTEM]-[TYP]-[NNN]');
    return { valid: false, errors };
  }
  
  if (!FAULT_DOMAINS[parsed.domain]) {
    errors.push(`Okänd domän: ${parsed.domain}`);
  }
  
  const subsystems = DOMAIN_SUBSYSTEMS[parsed.domain];
  if (subsystems && !subsystems[parsed.subsystem]) {
    errors.push(`Okänt subsystem: ${parsed.subsystem} för domän ${parsed.domain}`);
  }
  
  if (!DEVIATION_TYPES[parsed.deviationType]) {
    errors.push(`Okänd avvikelsetyp: ${parsed.deviationType}`);
  }
  
  if (parsed.number < 1 || parsed.number > 999) {
    errors.push('Nummer måste vara mellan 001 och 999');
  }
  
  return { valid: errors.length === 0, errors };
}
