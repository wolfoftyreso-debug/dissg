/**
 * SVERIGES 21 LÄN - KONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * Officiella länskoder (SCB-standard) och metadata
 */

export interface SwedishRegion {
  code: string;         // SCB länskod (01-25)
  name: string;         // Officiellt länsnamn
  shortName: string;    // Kortnamn
  population: number;   // Befolkning (ungefärlig)
  capital: string;      // Residensstad
  areaKm2: number;      // Yta i km²
}

/**
 * Alla 21 svenska län
 */
export const SWEDISH_REGIONS: SwedishRegion[] = [
  { code: '01', name: 'Stockholms län', shortName: 'Stockholm', population: 2415139, capital: 'Stockholm', areaKm2: 6519 },
  { code: '03', name: 'Uppsala län', shortName: 'Uppsala', population: 395026, capital: 'Uppsala', areaKm2: 8207 },
  { code: '04', name: 'Södermanlands län', shortName: 'Södermanland', population: 301166, capital: 'Nyköping', areaKm2: 6102 },
  { code: '05', name: 'Östergötlands län', shortName: 'Östergötland', population: 470920, capital: 'Linköping', areaKm2: 10602 },
  { code: '06', name: 'Jönköpings län', shortName: 'Jönköping', population: 367064, capital: 'Jönköping', areaKm2: 10495 },
  { code: '07', name: 'Kronobergs län', shortName: 'Kronoberg', population: 203691, capital: 'Växjö', areaKm2: 8466 },
  { code: '08', name: 'Kalmar län', shortName: 'Kalmar', population: 247175, capital: 'Kalmar', areaKm2: 11217 },
  { code: '09', name: 'Gotlands län', shortName: 'Gotland', population: 60124, capital: 'Visby', areaKm2: 3151 },
  { code: '10', name: 'Blekinge län', shortName: 'Blekinge', population: 159606, capital: 'Karlskrona', areaKm2: 2947 },
  { code: '12', name: 'Skåne län', shortName: 'Skåne', population: 1402425, capital: 'Malmö', areaKm2: 11035 },
  { code: '13', name: 'Hallands län', shortName: 'Halland', population: 338842, capital: 'Halmstad', areaKm2: 5460 },
  { code: '14', name: 'Västra Götalands län', shortName: 'Västra Götaland', population: 1744859, capital: 'Göteborg', areaKm2: 23956 },
  { code: '17', name: 'Värmlands län', shortName: 'Värmland', population: 282847, capital: 'Karlstad', areaKm2: 17591 },
  { code: '18', name: 'Örebro län', shortName: 'Örebro', population: 306792, capital: 'Örebro', areaKm2: 8546 },
  { code: '19', name: 'Västmanlands län', shortName: 'Västmanland', population: 278967, capital: 'Västerås', areaKm2: 5145 },
  { code: '20', name: 'Dalarnas län', shortName: 'Dalarna', population: 288387, capital: 'Falun', areaKm2: 28189 },
  { code: '21', name: 'Gävleborgs län', shortName: 'Gävleborg', population: 287678, capital: 'Gävle', areaKm2: 18198 },
  { code: '22', name: 'Västernorrlands län', shortName: 'Västernorrland', population: 245453, capital: 'Härnösand', areaKm2: 21683 },
  { code: '23', name: 'Jämtlands län', shortName: 'Jämtland', population: 132054, capital: 'Östersund', areaKm2: 49341 },
  { code: '24', name: 'Västerbottens län', shortName: 'Västerbotten', population: 274516, capital: 'Umeå', areaKm2: 55190 },
  { code: '25', name: 'Norrbottens län', shortName: 'Norrbotten', population: 250570, capital: 'Luleå', areaKm2: 98249 },
];

/**
 * Hämta region efter kod
 */
export function getRegionByCode(code: string): SwedishRegion | undefined {
  return SWEDISH_REGIONS.find(r => r.code === code);
}

/**
 * Hämta alla länskoder
 */
export function getAllRegionCodes(): string[] {
  return SWEDISH_REGIONS.map(r => r.code);
}

/**
 * Formatera länsnamn (kort eller långt)
 */
export function formatRegionName(code: string, short: boolean = false): string {
  const region = getRegionByCode(code);
  if (!region) return `Län ${code}`;
  return short ? region.shortName : region.name;
}

/**
 * Total befolkning i Sverige
 */
export function getTotalPopulation(): number {
  return SWEDISH_REGIONS.reduce((sum, r) => sum + r.population, 0);
}

/**
 * Beräkna befolkningsandel
 */
export function getPopulationShare(code: string): number {
  const region = getRegionByCode(code);
  if (!region) return 0;
  return region.population / getTotalPopulation();
}

/**
 * Gruppera län efter geografi
 */
export const REGION_GROUPS = {
  storstadslan: ['01', '12', '14'], // Stockholm, Skåne, Västra Götaland
  mellansverige: ['03', '04', '05', '18', '19'], // Uppsala, Södermanland, Östergötland, Örebro, Västmanland
  smalandOchOarna: ['06', '07', '08', '09', '10'], // Jönköping, Kronoberg, Kalmar, Gotland, Blekinge
  norrland: ['17', '20', '21', '22', '23', '24', '25'], // Värmland, Dalarna, Gävleborg, Västernorrland, Jämtland, Västerbotten, Norrbotten
  vastsverige: ['13'], // Halland
} as const;

export const REGION_GROUP_LABELS: Record<keyof typeof REGION_GROUPS, string> = {
  storstadslan: 'Storstadslän',
  mellansverige: 'Mellansverige',
  smalandOchOarna: 'Småland och öarna',
  norrland: 'Norrland',
  vastsverige: 'Västsverige',
};
