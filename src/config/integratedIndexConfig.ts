/**
 * WAVE 8 BLOCK BS: Economy × Society Index Family
 * 
 * Nya integrerade index – ekonomi isolerat = förbjudet.
 */

export interface IntegratedIndex {
  id: string;
  code: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  components: IndexComponent[];
  methodology: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  availableFrom: string;
  limitations: string[];
}

export interface IndexComponent {
  domain: string;
  weight: number;
  indicators: string[];
  rationale: string;
}

/**
 * BS1: Integrerade index
 */
export const INTEGRATED_INDICES: IntegratedIndex[] = [
  {
    id: 'socio_economic_stability',
    code: 'SESI',
    name: 'Socioekonomiskt Stabilitetsindex',
    name_en: 'Socio-Economic Stability Index',
    description: 'Kombinerat mått på ekonomisk och social stabilitet.',
    description_en: 'Combined measure of economic and social stability.',
    components: [
      {
        domain: 'economy',
        weight: 0.25,
        indicators: ['BNP-tillväxt', 'Inflation', 'Arbetslöshet'],
        rationale: 'Makroekonomisk grundstabilitet',
      },
      {
        domain: 'social',
        weight: 0.25,
        indicators: ['Inkomstojämlikhet', 'Relativ fattigdom', 'Social rörlighet'],
        rationale: 'Social sammanhållning',
      },
      {
        domain: 'institutional',
        weight: 0.25,
        indicators: ['Rättsstatindex', 'Korruptionsindex', 'Politisk stabilitet'],
        rationale: 'Institutionell förutsägbarhet',
      },
      {
        domain: 'demographic',
        weight: 0.25,
        indicators: ['Försörjningskvot', 'Urbaniseringstakt', 'Utbildningsnivå'],
        rationale: 'Strukturella förutsättningar',
      },
    ],
    methodology: 'Viktad z-score normalisering med rullande 5-årsbasperiod.',
    updateFrequency: 'monthly',
    availableFrom: '2010-01',
    limitations: [
      'Aggregering döljer regional variation',
      'Viktningen är metodologiskt val, inte objektiv sanning',
      'Historiska data kan revideras retroaktivt av källor',
    ],
  },
  {
    id: 'energy_economy_stress',
    code: 'EESI',
    name: 'Energi-Ekonomi Stressindex',
    name_en: 'Energy-Economy Stress Index',
    description: 'Mäter spänningar mellan energisystem och ekonomisk aktivitet.',
    description_en: 'Measures tensions between energy systems and economic activity.',
    components: [
      {
        domain: 'energy_supply',
        weight: 0.30,
        indicators: ['Effektbrist', 'Importberoende', 'Förnybar andel'],
        rationale: 'Energisystemets robusthet',
      },
      {
        domain: 'energy_price',
        weight: 0.30,
        indicators: ['Spotpris el', 'Prisvolatilitet', 'Industripris'],
        rationale: 'Kostnadstryck',
      },
      {
        domain: 'economic_impact',
        weight: 0.40,
        indicators: ['Energikostnad/BNP', 'Industriproduktion', 'Konkurser energikänsliga'],
        rationale: 'Realekonomisk påverkan',
      },
    ],
    methodology: 'Normaliserat stressindex med tröskelbaserade varningar.',
    updateFrequency: 'weekly',
    availableFrom: '2015-01',
    limitations: [
      'Prisdata kan vara försenad',
      'Regional variation inom Sverige stor',
      'Vädereffekter skapar kortsiktig volatilitet',
    ],
  },
  {
    id: 'workforce_sustainability',
    code: 'WSI',
    name: 'Arbetskrafts Hållbarhetsindex',
    name_en: 'Workforce Sustainability Index',
    description: 'Långsiktig hållbarhet i arbetskraftsutbud och -kvalitet.',
    description_en: 'Long-term sustainability of labor supply and quality.',
    components: [
      {
        domain: 'quantity',
        weight: 0.30,
        indicators: ['Arbetskraftsdeltagande', 'Demografisk trend', 'Nettomigration yrkesverk'],
        rationale: 'Kvantitativt utbud',
      },
      {
        domain: 'quality',
        weight: 0.35,
        indicators: ['Utbildningsnivå', 'Kompetensmatchning', 'Livslångt lärande'],
        rationale: 'Kvalitativt utbud',
      },
      {
        domain: 'health',
        weight: 0.35,
        indicators: ['Ohälsotal', 'Pensionsålder effektiv', 'Arbetsrelaterad ohälsa'],
        rationale: 'Arbetskraftens hälsa',
      },
    ],
    methodology: 'Framåtblickande projektion med historisk validering.',
    updateFrequency: 'quarterly',
    availableFrom: '2008-01',
    limitations: [
      'Prognoser har hög osäkerhet',
      'Beteendeförändringar svåra att förutse',
      'Konjunkturkänslighet i vissa komponenter',
    ],
  },
  {
    id: 'household_pressure',
    code: 'HPI',
    name: 'Hushållspressindex',
    name_en: 'Household Pressure Index',
    description: 'Kombinerat tryck på hushållens ekonomi.',
    description_en: 'Combined pressure on household finances.',
    components: [
      {
        domain: 'housing',
        weight: 0.35,
        indicators: ['Boendekostnad/inkomst', 'Räntekänslighet', 'Trångboddhet'],
        rationale: 'Boendekostnader',
      },
      {
        domain: 'consumption',
        weight: 0.30,
        indicators: ['Inflation', 'Energikostnader', 'Livsmedelspriser'],
        rationale: 'Levnadskostnader',
      },
      {
        domain: 'income',
        weight: 0.35,
        indicators: ['Reallöneutveckling', 'Arbetslöshet', 'Bidragsberoende'],
        rationale: 'Inkomstutveckling',
      },
    ],
    methodology: 'Viktad stressindikator med inkomstdecil-segmentering.',
    updateFrequency: 'monthly',
    availableFrom: '2012-01',
    limitations: [
      'Genomsnittsvärden döljer fördelningseffekter',
      'Skuldsättning inte fullt inkluderad',
      'Beteendeanpassningar underskattas',
    ],
  },
  {
    id: 'institutional_capacity',
    code: 'ICI',
    name: 'Institutionell Kapacitetsindex',
    name_en: 'Institutional Capacity Index',
    description: 'Offentliga institutioners förmåga att leverera.',
    description_en: 'Public institutions\' ability to deliver.',
    components: [
      {
        domain: 'efficiency',
        weight: 0.30,
        indicators: ['Handläggningstider', 'Digitalisering', 'Administrativa kostnader'],
        rationale: 'Effektivitet',
      },
      {
        domain: 'quality',
        weight: 0.35,
        indicators: ['Vårdköer', 'Skolresultat', 'Brottsuppklaring'],
        rationale: 'Tjänstekvalitet',
      },
      {
        domain: 'trust',
        weight: 0.35,
        indicators: ['Myndighetsförtroende', 'Klagomål', 'Överklaganden'],
        rationale: 'Medborgarförtroende',
      },
    ],
    methodology: 'Multidimensionellt kapacitetsindex med sektorvikter.',
    updateFrequency: 'quarterly',
    availableFrom: '2010-01',
    limitations: [
      'Mätsvårigheter i kvalitativa dimensioner',
      'Förändringstakt långsam',
      'Politisk känslighet i tolkningar',
    ],
  },
];

/**
 * Hämta index med fullständig metodbeskrivning
 */
export function getIndexWithMethod(indexId: string): IntegratedIndex | null {
  return INTEGRATED_INDICES.find(i => i.id === indexId) || null;
}

/**
 * Lista alla index med domänfilter
 */
export function getIndicesByDomain(domain: string): IntegratedIndex[] {
  return INTEGRATED_INDICES.filter(index => 
    index.components.some(c => c.domain === domain)
  );
}

/**
 * Generera viktningsförklaring
 */
export function getWeightExplanation(indexId: string, lang: 'sv' | 'en' = 'sv'): string {
  const index = INTEGRATED_INDICES.find(i => i.id === indexId);
  if (!index) return '';

  const components = index.components
    .map(c => `${c.domain}: ${(c.weight * 100).toFixed(0)}%`)
    .join(', ');

  if (lang === 'sv') {
    return `Viktning: ${components}. ${index.methodology}`;
  }
  return `Weighting: ${components}. ${index.methodology}`;
}
