/**
 * CIVILIZATION PHASE MAP (CPM)
 * 
 * "Identifiera var ett samhälle befinner sig i den långsiktiga cykeln – utan att förutsäga slut."
 * 
 * Detta är orientering, inte domedag.
 * En karta, inte en profetia.
 */

// === 1. CORE PRINCIPLE ===

export const CPM_CORE_PRINCIPLE = {
  sv: 'Vissa mönster tenderar att uppstå när vissa strukturella villkor sammanfaller.',
  en: 'Certain patterns tend to emerge when certain structural conditions coincide.'
};

export const CPM_NOT_CLAIMS = [
  { sv: 'Att kollaps är oundviklig', en: 'That collapse is inevitable' },
  { sv: 'Att historien upprepar sig exakt', en: 'That history repeats exactly' }
];

export const CPM_OBSERVATION = {
  sv: 'Komplexa samhällen rör sig genom återkommande faser – men med olika hastighet, skala och utfall.',
  en: 'Complex societies move through recurring phases – but with different speed, scale, and outcomes.'
};

// === 2. THE FIVE PHASES ===
// Förklarade så att en 15-åring förstår

export interface CivilizationPhase {
  id: 'building' | 'expansion' | 'maturity' | 'overload' | 'transition';
  number: number;
  label: string;
  labelSv: string;
  description: string;
  descriptionSv: string;
  simpleExplanation: string; // Enkel förklaring för 15-åringar
  realWorldExample: string; // Konkret exempel
  characteristics: { label: string; labelSv: string }[];
  color: string;
  keyFactors: { label: string; labelSv: string }[];
}

export const CIVILIZATION_PHASES: CivilizationPhase[] = [
  {
    id: 'building',
    number: 1,
    label: 'Building',
    labelSv: 'Uppbyggnad',
    description: 'Foundation establishment, low complexity',
    descriptionSv: 'Grundläggning, låg komplexitet',
    simpleExplanation: 'Samhället är som ett nystartat företag – fullt av energi, få skulder, och alla tror på framtiden. Man bygger skolor, vägar och sjukhus.',
    realWorldExample: 'Sverige 1945-1965: Efter andra världskriget byggdes folkhemmet. Inga stora skulder, massor av jobb, och folk trodde imorgon skulle bli bättre.',
    characteristics: [
      { label: 'Increasing energy per capita', labelSv: 'Ökande energi per capita' },
      { label: 'Growing institutional capacity', labelSv: 'Växande institutionell kapacitet' },
      { label: 'Low debt burden', labelSv: 'Låg skuldbelastning' },
      { label: 'Future optimism', labelSv: 'Framtidsoptimism' }
    ],
    color: 'hsl(142, 76%, 36%)',
    keyFactors: [
      { label: 'Capital formation', labelSv: 'Kapitalbildning' },
      { label: 'Institution building', labelSv: 'Institutionsbyggande' },
      { label: 'Social cohesion', labelSv: 'Social sammanhållning' }
    ]
  },
  {
    id: 'expansion',
    number: 2,
    label: 'Expansion',
    labelSv: 'Expansion',
    description: 'Rapid growth, increasing complexity',
    descriptionSv: 'Snabb tillväxt, ökande komplexitet',
    simpleExplanation: 'Samhället växer snabbt – som en tonåring i tillväxtspurt. Fler människor, mer teknik, allt blir mer komplicerat. Det går bra, men det börjar bli rörigt.',
    realWorldExample: 'Sverige 1965-1990: Ekonomin exploderade. Volvo, IKEA, ABBA. Alla fick det bättre, men skatterna och byråkratin växte också.',
    characteristics: [
      { label: 'Rapid population growth', labelSv: 'Snabb befolkningstillväxt' },
      { label: 'Technical acceleration', labelSv: 'Teknisk acceleration' },
      { label: 'Increasing specialization', labelSv: 'Ökande specialisering' },
      { label: 'Rising complexity', labelSv: 'Stigande komplexitet' }
    ],
    color: 'hsl(217, 91%, 60%)',
    keyFactors: [
      { label: 'Innovation rate', labelSv: 'Innovationstakt' },
      { label: 'Resource access', labelSv: 'Resurstillgång' },
      { label: 'Scaling ability', labelSv: 'Skalningsförmåga' }
    ]
  },
  {
    id: 'maturity',
    number: 3,
    label: 'Maturity',
    labelSv: 'Mognad',
    description: 'Stable growth, high welfare, rising maintenance',
    descriptionSv: 'Stabil tillväxt, högt välstånd, ökande underhåll',
    simpleExplanation: 'Samhället är som en medelålders person med bra jobb – livet är stabilt och bekvämt, men mer tid går åt till att underhålla det man redan har. Mindre tid till nya äventyr.',
    realWorldExample: 'Sverige 1990-2010: Hög levnadsstandard, bra välfärd, men pengarna gick till att reparera och underhålla, inte bygga nytt.',
    characteristics: [
      { label: 'Stable growth', labelSv: 'Stabil tillväxt' },
      { label: 'High prosperity', labelSv: 'Högt välstånd' },
      { label: 'Increasing maintenance requirements', labelSv: 'Ökande underhållskrav' },
      { label: 'Beginning institutional inertia', labelSv: 'Begynnande institutionell tröghet' }
    ],
    color: 'hsl(45, 93%, 47%)',
    keyFactors: [
      { label: 'Institutional maintenance', labelSv: 'Institutionellt underhåll' },
      { label: 'Adaptation capacity', labelSv: 'Anpassningsförmåga' },
      { label: 'Renewal investment', labelSv: 'Förnyelseinvestering' }
    ]
  },
  {
    id: 'overload',
    number: 4,
    label: 'Overload',
    labelSv: 'Överbelastning',
    description: 'Rising debt, shrinking margins, fragmentation',
    descriptionSv: 'Stigande skuld, minskande marginaler, fragmentering',
    simpleExplanation: 'Samhället har för mycket på sitt tallrik. Som när du har för många appar öppna och telefonen blir seg. Skulderna växer, folk bråkar mer om vem som ska betala, och systemet knarrar.',
    realWorldExample: 'Sverige nu (2010-): Välfärden kostar mer än vad vi betalar in. Infrastrukturen förfaller. Politiken blir mer splittrad. Marginalerna krymper.',
    characteristics: [
      { label: 'Rising debt (financial & institutional)', labelSv: 'Stigande skuld (finansiell & institutionell)' },
      { label: 'Shrinking margins', labelSv: 'Minskande marginaler' },
      { label: 'Increasing resource conflicts', labelSv: 'Ökande konflikter om resurser' },
      { label: 'Political fragmentation', labelSv: 'Politisk fragmentering' }
    ],
    color: 'hsl(0, 84%, 60%)',
    keyFactors: [
      { label: 'Debt discipline', labelSv: 'Skulddisciplin' },
      { label: 'Legitimacy', labelSv: 'Legitimitet' },
      { label: 'Conflict management', labelSv: 'Konflikthantering' }
    ]
  },
  {
    id: 'transition',
    number: 5,
    label: 'Transition',
    labelSv: 'Omställning',
    description: 'Reform or decline, power redistribution',
    descriptionSv: 'Reform eller förfall, maktomfördelning',
    simpleExplanation: 'En vägkorsning. Samhället måste välja: förnya sig och börja om (som Japan efter kriget), eller fortsätta nedåt (som Romarriket). Det är nu det avgörs.',
    realWorldExample: 'Japan 1945 valde reform → blev ekonomisk supermakt. Sovjetunionen 1991 klarade inte omställningen → kollapsade.',
    characteristics: [
      { label: 'Reforms or decline', labelSv: 'Reformer eller förfall' },
      { label: 'Power redistribution', labelSv: 'Omfördelning av makt & resurser' },
      { label: 'Simplification or technological leap', labelSv: 'Förenkling eller tekniskt språng' }
    ],
    color: 'hsl(271, 81%, 56%)',
    keyFactors: [
      { label: 'Leadership quality', labelSv: 'Ledarskapskvalitet' },
      { label: 'Social consensus', labelSv: 'Social konsensus' },
      { label: 'External conditions', labelSv: 'Externa förutsättningar' }
    ]
  }
];

// === 3. PLACEMENT INDICATORS ===

export interface PlacementIndicator {
  id: string;
  label: string;
  labelSv: string;
  weight: number;
  description: string;
  descriptionSv: string;
}

export const PLACEMENT_INDICATORS: PlacementIndicator[] = [
  {
    id: 'energy_trend',
    label: 'Energy per capita (trend)',
    labelSv: 'Energi per capita (trend)',
    weight: 0.20,
    description: 'Direction and stability of energy availability',
    descriptionSv: 'Riktning och stabilitet för energitillgång'
  },
  {
    id: 'resilience',
    label: 'Resilience',
    labelSv: 'Resiliens',
    weight: 0.15,
    description: 'Ability to absorb and recover from shocks',
    descriptionSv: 'Förmåga att absorbera och återhämta sig från chocker'
  },
  {
    id: 'intergenerational_debt',
    label: 'Intergenerational debt',
    labelSv: 'Intergenerationell skuld',
    weight: 0.18,
    description: 'Burden passed to future generations',
    descriptionSv: 'Belastning som förs vidare till framtida generationer'
  },
  {
    id: 'institutional_efficiency',
    label: 'Institutional efficiency',
    labelSv: 'Institutionell effektivitet',
    weight: 0.17,
    description: 'Ability to execute decisions and maintain trust',
    descriptionSv: 'Förmåga att genomföra beslut och upprätthålla förtroende'
  },
  {
    id: 'conflict_intensity',
    label: 'Conflict intensity',
    labelSv: 'Konfliktintensitet',
    weight: 0.15,
    description: 'Level of internal social and political tension',
    descriptionSv: 'Nivå av interna sociala och politiska spänningar'
  },
  {
    id: 'innovation_rate',
    label: 'Innovation rate',
    labelSv: 'Innovationsgrad',
    weight: 0.15,
    description: 'Rate of technological and organizational adaptation',
    descriptionSv: 'Takt för teknisk och organisatorisk anpassning'
  }
];

// === 4. COUNTRY PHASE DATA ===

// Historiska omställningar förklarade på ett enkelt sätt
export interface HistoricalTransition {
  year: string;
  name: string;
  fromPhase: string;
  toPhase: string;
  description: string; // Enkel förklaring för 15-åringar
}

export interface CountryPhaseData {
  code: string;
  name: string;
  nameSv: string;
  phasePosition: number; // 0-100 (0=start of building, 100=end of transition)
  phaseRange: [number, number]; // uncertainty range
  velocity: number; // -10 to +10 (negative = moving backward)
  accelerating: boolean;
  historicalTransitions: number; // successful transitions in history
  historicalTransitionDetails: HistoricalTransition[]; // Konkreta exempel
  indicatorScores: Record<string, number>; // 0-100 for each indicator
}

export const COUNTRY_PHASE_DATA: CountryPhaseData[] = [
  {
    code: 'SE',
    name: 'Sweden',
    nameSv: 'Sverige',
    phasePosition: 62,
    phaseRange: [58, 68],
    velocity: 2.5,
    accelerating: false,
    historicalTransitions: 3,
    historicalTransitionDetails: [
      {
        year: '1809',
        name: 'Från stormakt till neutralitet',
        fromPhase: 'Överbelastning',
        toPhase: 'Uppbyggnad',
        description: 'Sverige förlorade Finland och gav upp sina stormaktsdrömmar. Istället började man bygga ett modernt, neutralt land med nya lagar och universitet.'
      },
      {
        year: '1932',
        name: 'Depression till folkhem',
        fromPhase: 'Överbelastning',
        toPhase: 'Uppbyggnad',
        description: 'Under 30-talets kris enades Sverige om "folkhemmet" – en vision där staten tar hand om alla medborgare. Denna omställning la grunden för välfärdsstaten.'
      },
      {
        year: '1991-1994',
        name: 'Finanskris till reform',
        fromPhase: 'Överbelastning',
        toPhase: 'Mognad',
        description: 'Bankerna höll på att krascha och arbetslösheten exploderade. Sverige svarade med stora reformer: budgettak, självständig riksbank, och en ny pensionsmodell.'
      }
    ],
    indicatorScores: {
      energy_trend: 55,
      resilience: 68,
      intergenerational_debt: 45,
      institutional_efficiency: 62,
      conflict_intensity: 35,
      innovation_rate: 72
    }
  },
  {
    code: 'NO',
    name: 'Norway',
    nameSv: 'Norge',
    phasePosition: 52,
    phaseRange: [48, 56],
    velocity: 0.8,
    accelerating: false,
    historicalTransitions: 2,
    historicalTransitionDetails: [
      {
        year: '1905',
        name: 'Självständighet från Sverige',
        fromPhase: 'Expansion',
        toPhase: 'Uppbyggnad',
        description: 'Norge bröt sig loss från unionen med Sverige och började bygga ett eget land från grunden – fredligt och demokratiskt.'
      },
      {
        year: '1969-1990',
        name: 'Oljans omvandling',
        fromPhase: 'Mognad',
        toPhase: 'Expansion',
        description: 'Oljan hittades i Nordsjön. Istället för att slösa bort pengarna skapade Norge en oljefond för framtida generationer – en av världens smartaste ekonomiska beslut.'
      }
    ],
    indicatorScores: {
      energy_trend: 85,
      resilience: 82,
      intergenerational_debt: 22,
      institutional_efficiency: 78,
      conflict_intensity: 18,
      innovation_rate: 65
    }
  },
  {
    code: 'US',
    name: 'United States',
    nameSv: 'USA',
    phasePosition: 72,
    phaseRange: [65, 78],
    velocity: 4.2,
    accelerating: true,
    historicalTransitions: 2,
    historicalTransitionDetails: [
      {
        year: '1861-1865',
        name: 'Inbördeskrig till industrialisering',
        fromPhase: 'Överbelastning',
        toPhase: 'Expansion',
        description: 'Ett brutalt krig som nästan splittrade landet. Men efteråt förenades USA och blev världens starkaste industriland.'
      },
      {
        year: '1933-1945',
        name: 'New Deal och Andra världskriget',
        fromPhase: 'Överbelastning',
        toPhase: 'Expansion',
        description: 'Börskraschen 1929 orsakade massarbetslöshet. President Roosevelt svarade med massiva jobbprogram, och kriget startade en industriboost som varade i decennier.'
      }
    ],
    indicatorScores: {
      energy_trend: 62,
      resilience: 55,
      intergenerational_debt: 68,
      institutional_efficiency: 45,
      conflict_intensity: 65,
      innovation_rate: 85
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    nameSv: 'Japan',
    phasePosition: 78,
    phaseRange: [72, 82],
    velocity: 1.5,
    accelerating: false,
    historicalTransitions: 2,
    historicalTransitionDetails: [
      {
        year: '1868',
        name: 'Meiji-restaurationen',
        fromPhase: 'Omställning',
        toPhase: 'Uppbyggnad',
        description: 'Japan gick från att vara ett isolerat medeltida samhälle till en modern industristat på bara några decennier. En av historiens mest imponerande omställningar.'
      },
      {
        year: '1945-1970',
        name: 'Efterkrigsmiraklet',
        fromPhase: 'Omställning',
        toPhase: 'Expansion',
        description: 'Helt krossade efter atombomberna och kriget byggde Japan upp sig till världens näst största ekonomi. Folk arbetade hårt och sparade pengar till framtiden.'
      }
    ],
    indicatorScores: {
      energy_trend: 42,
      resilience: 72,
      intergenerational_debt: 85,
      institutional_efficiency: 68,
      conflict_intensity: 22,
      innovation_rate: 75
    }
  },
  {
    code: 'CN',
    name: 'China',
    nameSv: 'Kina',
    phasePosition: 48,
    phaseRange: [42, 55],
    velocity: -1.2,
    accelerating: false,
    historicalTransitions: 4,
    historicalTransitionDetails: [
      {
        year: '221 f.Kr.',
        name: 'Första kejsardömet',
        fromPhase: 'Omställning',
        toPhase: 'Uppbyggnad',
        description: 'Kina förenades för första gången under en kejsare. Muren byggdes och ett gemensamt skriftspråk infördes.'
      },
      {
        year: '618-907',
        name: 'Tang-dynastin',
        fromPhase: 'Uppbyggnad',
        toPhase: 'Expansion',
        description: 'En guldålder då Kina var världens mest avancerade civilisation. Konst, poesi och handel blomstrade längs Sidenvägen.'
      },
      {
        year: '1949',
        name: 'Kommunistrevolutionen',
        fromPhase: 'Överbelastning',
        toPhase: 'Omställning',
        description: 'Efter årtionden av kaos och krig tog kommunisterna makten. En total omstart – med både framsteg och enorma tragedier som kulturrevolutionen.'
      },
      {
        year: '1978-idag',
        name: 'Deng Xiaopings reformer',
        fromPhase: 'Omställning',
        toPhase: 'Expansion',
        description: 'Kina öppnade ekonomin och blev världens fabrik. Hundratals miljoner lyftes ur fattigdom på rekordtid.'
      }
    ],
    indicatorScores: {
      energy_trend: 72,
      resilience: 58,
      intergenerational_debt: 55,
      institutional_efficiency: 65,
      conflict_intensity: 45,
      innovation_rate: 78
    }
  },
  {
    code: 'DE',
    name: 'Germany',
    nameSv: 'Tyskland',
    phasePosition: 65,
    phaseRange: [60, 70],
    velocity: 2.8,
    accelerating: true,
    historicalTransitions: 3,
    historicalTransitionDetails: [
      {
        year: '1871',
        name: 'Riksenandet',
        fromPhase: 'Uppbyggnad',
        toPhase: 'Expansion',
        description: 'De tyska småstaterna förenades till ett land. Inom några decennier blev Tyskland Europas starkaste industriland.'
      },
      {
        year: '1945-1955',
        name: 'Wirtschaftswunder',
        fromPhase: 'Omställning',
        toPhase: 'Uppbyggnad',
        description: 'Tyskland låg i ruiner efter kriget. Men med hårt arbete och amerikanskt stöd byggdes landet upp till en ekonomisk stormakt på bara ett decennium.'
      },
      {
        year: '1990',
        name: 'Återförening',
        fromPhase: 'Mognad',
        toPhase: 'Expansion',
        description: 'Muren föll och Öst- och Västtyskland blev ett igen. En enorm utmaning att slå samman två helt olika ekonomiska system.'
      }
    ],
    indicatorScores: {
      energy_trend: 45,
      resilience: 62,
      intergenerational_debt: 52,
      institutional_efficiency: 72,
      conflict_intensity: 38,
      innovation_rate: 68
    }
  },
  {
    code: 'IN',
    name: 'India',
    nameSv: 'Indien',
    phasePosition: 32,
    phaseRange: [28, 38],
    velocity: -2.5,
    accelerating: false,
    historicalTransitions: 2,
    historicalTransitionDetails: [
      {
        year: '1947',
        name: 'Självständighet',
        fromPhase: 'Omställning',
        toPhase: 'Uppbyggnad',
        description: 'Indien bröt sig loss från brittiskt styre efter fredlig kamp under Gandhi. Men delningen med Pakistan orsakade enormt lidande.'
      },
      {
        year: '1991',
        name: 'Ekonomiska liberaliseringen',
        fromPhase: 'Överbelastning',
        toPhase: 'Expansion',
        description: 'Indien stod vid konkursens rand. Svaret blev att öppna ekonomin. Nu växer medelklassen snabbt och IT-industrin är världsledande.'
      }
    ],
    indicatorScores: {
      energy_trend: 75,
      resilience: 48,
      intergenerational_debt: 35,
      institutional_efficiency: 42,
      conflict_intensity: 55,
      innovation_rate: 62
    }
  },
  {
    code: 'BR',
    name: 'Brazil',
    nameSv: 'Brasilien',
    phasePosition: 55,
    phaseRange: [48, 62],
    velocity: 1.8,
    accelerating: false,
    historicalTransitions: 1,
    historicalTransitionDetails: [
      {
        year: '1985-1994',
        name: 'Demokratisering och Plano Real',
        fromPhase: 'Överbelastning',
        toPhase: 'Mognad',
        description: 'Efter årtionden av militärdiktatur blev Brasilien demokratiskt. Hyperinflationen (tusentals procent per år!) tämjdes med en smart valutareform.'
      }
    ],
    indicatorScores: {
      energy_trend: 68,
      resilience: 45,
      intergenerational_debt: 48,
      institutional_efficiency: 38,
      conflict_intensity: 58,
      innovation_rate: 52
    }
  }
];

// === 5. PHASE POSITION HELPERS ===

export const getPhaseFromPosition = (position: number): CivilizationPhase => {
  if (position < 20) return CIVILIZATION_PHASES[0]; // building
  if (position < 40) return CIVILIZATION_PHASES[1]; // expansion
  if (position < 60) return CIVILIZATION_PHASES[2]; // maturity
  if (position < 80) return CIVILIZATION_PHASES[3]; // overload
  return CIVILIZATION_PHASES[4]; // transition
};

export const getPhaseColor = (position: number): string => {
  return getPhaseFromPosition(position).color;
};

// === 6. KEY MESSAGES ===

export const KEY_MESSAGES = {
  notDoom: {
    sv: 'Inte "vi är dömda"',
    en: 'Not "we are doomed"'
  },
  notNostalgia: {
    sv: 'Inte "allt var bättre förr"',
    en: 'Not "everything was better before"'
  },
  notTheory: {
    sv: 'Inte "en teori"',
    en: 'Not "a theory"'
  },
  whatItIs: {
    sv: 'En sammanfattning av strukturella signaler över tid.',
    en: 'A summary of structural signals over time.'
  },
  speedMatters: {
    sv: 'Hastighet är ofta viktigare än nivå.',
    en: 'Speed is often more important than level.'
  },
  transitionOutcomes: {
    sv: 'Omställning kan leda tillbaka till uppbyggnad eller till lång stagnation. Systemet avgör inte vilket.',
    en: 'Transition can lead back to building or to long stagnation. The system does not determine which.'
  },
  placementTransparency: {
    sv: 'Placeringen baseras på följande indikatorer…',
    en: 'The placement is based on the following indicators…'
  },
  coreInsight: {
    sv: 'Det är inte faserna som fäller civilisationer – det är oförmågan att förstå vilken fas man är i.',
    en: 'It is not the phases that fell civilizations – it is the inability to understand which phase one is in.'
  }
};

// === 7. MODULE CONNECTIONS ===

export interface ModuleConnection {
  id: string;
  label: string;
  labelSv: string;
  icon: string;
  description: string;
  descriptionEn: string;
  route: string;
  // Detailed information for drill-down
  fullExplanation: string;
  whyItMatters: string;
  howItConnectsToCPM: string;
  keyMetrics: { label: string; description: string }[];
  realWorldExample: string;
}

export const MODULE_CONNECTIONS: ModuleConnection[] = [
  { 
    id: 'resilience', 
    label: 'Resilience', 
    labelSv: 'Resiliens', 
    icon: '🔄', 
    description: 'Hur väl omställning kan ske', 
    descriptionEn: 'How well transition can occur',
    route: '/resilience',
    fullExplanation: 'Resiliens mäter hur väl ett samhälle klarar chocker – ekonomiska kriser, naturkatastrofer, pandemier eller politiska omvälvningar. Det handlar inte om att undvika problem, utan om att studsa tillbaka efter dem.',
    whyItMatters: 'Ett samhälle med hög resiliens kan gå igenom fas 4 (Överbelastning) utan att kollapsa. Det ger tid att genomföra reformer. Ett samhälle med låg resiliens kan kollapsa vid första allvarliga chock.',
    howItConnectsToCPM: 'Resiliens avgör hastigheten på fasövergångar. Hög resiliens = långsammare förfall, snabbare återhämtning. Låg resiliens = snabba, okontrollerade övergångar.',
    keyMetrics: [
      { label: 'Buffer-kapacitet', description: 'Hur stora reserver finns? (valutareserv, livsmedelslagring, energireserv)' },
      { label: 'Institutionell flexibilitet', description: 'Kan systemet ändra regler snabbt vid kris?' },
      { label: 'Social sammanhållning', description: 'Hjälper folk varandra i kriser eller splittras samhället?' },
      { label: 'Diversifiering', description: 'Är ekonomin beroende av en sektor, eller finns många ben att stå på?' }
    ],
    realWorldExample: 'Finland visade extrem resiliens under 90-talskrisen (BNP föll 14%) – befolkningen accepterade hårda åtstramningar, bankerna räddades ordnat, och landet återhämtade sig på ett decennium. Jämför med Grekland 2010 där låg social sammanhållning ledde till en utdragen kris.'
  },
  { 
    id: 'fairness', 
    label: 'Intergenerational Fairness', 
    labelSv: 'Intergenerationell rättvisa', 
    icon: '⏳', 
    description: 'Vem betalar', 
    descriptionEn: 'Who pays',
    route: '/fairness',
    fullExplanation: 'Denna modul mäter om vi lever på framtida generationers bekostnad. Den räknar samman alla "skulder" vi lämnar efter oss: statsskuld, pensionslöften, klimatpåverkan, utarmad natur, och förfallen infrastruktur.',
    whyItMatters: 'Om vi systematiskt skjuter kostnader på våra barn och barnbarn bygger vi upp en tidsinställd bomb. Vid någon punkt måste notan betalas – antingen genom drastiska nedskärningar, inflation, eller kollaps.',
    howItConnectsToCPM: 'Hög intergenerationell skuld är ett klassiskt tecken på Fas 4 (Överbelastning). Det visar att systemet "lånar" från framtiden för att upprätthålla nuet – en ohållbar strategi.',
    keyMetrics: [
      { label: 'Ofinansierade löften', description: 'Pensioner och välfärd vi lovat men inte sparat till' },
      { label: 'Statsskuld per ung person', description: 'Hur mycket skuld får varje 20-åring ärva?' },
      { label: 'Infrastrukturskuld', description: 'Kostnaden för alla vägar, broar, VA-system som förfaller' },
      { label: 'Klimatskuld', description: 'Kostnaden för klimatanpassning som framtiden måste betala' }
    ],
    realWorldExample: 'Japan har världens högsta skuld (260% av BNP) och en åldrande befolkning. Varje japanskt barn föds med en skuld på över 100 000 dollar. Sverige är bättre, men pensionssystemet och infrastrukturen har stora dolda hål.'
  },
  { 
    id: 'capacity', 
    label: 'Carrying Capacity', 
    labelSv: 'Bärkraft', 
    icon: '🌍', 
    description: 'Energi & resurser', 
    descriptionEn: 'Energy & resources',
    route: '/capacity',
    fullExplanation: 'Bärkraft handlar om fysiska gränser: energi, vatten, mat, mineraler, och planetära gränser. Det svarar på frågan: "Hur många människor kan leva på denna nivå, med tillgängliga resurser?"',
    whyItMatters: 'All ekonomi och välfärd bygger ytterst på fysiska resurser. Om vi överskrider bärkraften – antingen lokalt eller globalt – blir kollaps oundviklig, oavsett ekonomisk skicklighet.',
    howItConnectsToCPM: 'Bärkraft sätter de yttre gränserna för alla faser. Ett samhälle som överskrider sin bärkraft tvingas in i Fas 5 (Omställning), vare sig det vill eller inte.',
    keyMetrics: [
      { label: 'Energi per capita', description: 'Tillgänglig energi per person – grunden för allt' },
      { label: 'Ekologiskt fotavtryck', description: 'Hur många jordklot behövs om alla levde så?' },
      { label: 'Resursberoende', description: 'Import av kritiska resurser (mat, energi, mineraler)' },
      { label: 'Systemgränser', description: 'Hur nära planetära gränser (kol, kväve, vatten) är vi?' }
    ],
    realWorldExample: 'Påskön (Rapa Nui) är historiens mest kända exempel på överskjutande av bärkraft. Befolkningen växte, skogen höggs ner, jorden utarmades, och samhället kollapsade. Det tog 300 år – snabbare än de flesta tror.'
  },
  { 
    id: 'scenarios', 
    label: 'Policy Scenarios', 
    labelSv: 'Policyscenarier', 
    icon: '🧪', 
    description: 'Historiska paralleller', 
    descriptionEn: 'Historical parallels',
    route: '/scenarios',
    fullExplanation: 'Denna modul analyserar vad som historiskt hänt när samhällen stått inför liknande utmaningar. Den identifierar policybeslut som fungerat – och katastrofala misstag som bör undvikas.',
    whyItMatters: 'Vi är inte de första att stå inför dessa utmaningar. Genom att studera historien kan vi lära av andras misstag och framgångar – och undvika att uppfinna hjulet på nytt.',
    howItConnectsToCPM: 'Scenariomotorn kopplar varje fas till historiska paralleller. "Ni är i Fas 4 – här är 12 samhällen som varit där förut, och detta är vad som hände."',
    keyMetrics: [
      { label: 'Historiska paralleller', description: 'Liknande situationer i historien och deras utfall' },
      { label: 'Framgångsrika omställningar', description: 'Vilka policies har faktiskt fungerat?' },
      { label: 'Varningssignaler', description: 'Vilka mönster föregick kollaps i liknande fall?' },
      { label: 'Tidsramar', description: 'Hur lång tid tog omställningar i jämförbara fall?' }
    ],
    realWorldExample: 'När Sverige stod inför bankkrisen 1991-1994 studerade beslutsfattarna Norges misslyckade hantering av en liknande kris. De valde en annan väg – snabb rekapitalisering, dåliga lån i "skräpbanken" – och lyckades. Historisk kunskap räddade Sverige.'
  }
];
