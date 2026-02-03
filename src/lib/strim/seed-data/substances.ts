/**
 * STRIM Seed Data: Substances
 * 
 * De första 3 substanserna för att etablera kunskapsgrafen.
 * Varje entitet följer masterdatamallen exakt.
 */

import type { ValidatedSubstance } from '../validation';

const NOW = new Date().toISOString();

export const SEED_SUBSTANCES: ValidatedSubstance[] = [
  // ==========================================================================
  // ALKOHOL
  // ==========================================================================
  {
    canonical_slug: 'alkohol',
    name_sv: 'Alkohol',
    name_en: 'Alcohol (ethanol)',
    
    definition: 'Alkohol (etanol, C₂H₅OH) är en psykoaktiv substans som produceras genom jäsning av sockerarter. Substansen har en central dämpande effekt på nervsystemet och är den mest använda psykoaktiva substansen i Sverige. Etanol metaboliseras primärt i levern via enzymet alkoholdehydrogenas.',
    
    classification_primary: 'depressant',
    classification_secondary: ['sedative', 'anxiolytic'],
    pharmacological_class: 'GABA-agonist',
    
    mechanism_of_action: 'Alkohol förstärker GABA-A-receptorns hämmande verkan och blockerar glutamatreceptorer (NMDA), vilket resulterar i central dämpning. Vid låga doser uppstår disinhibition, vid högre doser sedering.',
    
    administration_routes: ['oral'],
    
    dependence_potential: 'high',
    dependence_uncertainty: 'Beroendegrad varierar med genetiska faktorer, konsumtionsmönster och psykosociala förhållanden.',
    
    acute_risks: [
      'Nedsatt koordination och reaktionsförmåga',
      'Alkoholförgiftning vid höga doser',
      'Andningsdepression vid mycket höga blodalkoholnivåer',
      'Ökad olycksrisk',
    ],
    chronic_risks: [
      'Leversjukdom inklusive cirros',
      'Neurologisk påverkan inklusive minnesförlust',
      'Ökad risk för flera cancerformer',
      'Kardiomyopati vid långvarigt högt intag',
      'Beroendeutveckling',
    ],
    risk_category: 'high',
    
    introduction_sweden: {
      approximate_year: undefined, // Urminnes
      context: 'Alkohol har använts i Sverige sedan förhistorisk tid. Systematisk reglering infördes under 1800-talet.',
    },
    historical_changes: [
      {
        period: '1800-tal',
        description: 'Nykterhetsrörelsen växer fram som reaktion på hög alkoholkonsumtion.',
      },
      {
        period: '1955',
        description: 'Motboken avskaffas.',
      },
      {
        period: '1995',
        description: 'Införselkvoter ändras vid EU-inträde.',
      },
    ],
    
    current_legal_status: 'legal',
    legal_history: [
      {
        year: 1855,
        change: 'Brännvinsförordningen begränsar tillverkning.',
      },
      {
        year: 1917,
        change: 'Motboken införs för att begränsa individuell konsumtion.',
      },
      {
        year: 1955,
        change: 'Motboken avskaffas, Systembolaget kvarstår som monopol.',
      },
    ],
    
    causes_diagnoses: ['alkoholberoende'],
    regulated_by_laws: ['alkohollagen', 'narkotikalagstiftning'],
    associated_concepts: ['beroende', 'skademinimering'],
    
    sources: [
      {
        name: 'Folkhälsomyndigheten',
        url: 'https://www.folkhalsomyndigheten.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Socialstyrelsen – Nationella riktlinjer',
        url: 'https://www.socialstyrelsen.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'WHO – Global Status Report on Alcohol and Health',
        url: 'https://www.who.int',
        retrieved_at: NOW,
        type: 'secondary',
        organization_type: 'international',
      },
    ],
    
    status: 'active',
    version: 1,
  },

  // ==========================================================================
  // HEROIN
  // ==========================================================================
  {
    canonical_slug: 'heroin',
    name_sv: 'Heroin',
    name_en: 'Heroin (diacetylmorphine)',
    
    definition: 'Heroin (diacetylmorfin, diamorfin) är en semisyntetisk opioid som framställs ur morfin. Substansen passerar snabbt blod-hjärnbarriären och omvandlas till morfin i centrala nervsystemet. Heroin klassificeras som narkotika enligt svensk lag.',
    
    classification_primary: 'opioid',
    classification_secondary: ['analgesic', 'narcotic'],
    pharmacological_class: 'Opioidagonist (μ-receptor)',
    
    mechanism_of_action: 'Heroin metaboliseras till morfin som binder till μ-opioidreceptorer i CNS. Aktivering medför analgesi, eufori, sedering och andningsdepression. Snabb tillvänjning utvecklas vid upprepad användning.',
    
    administration_routes: ['injection', 'insufflation', 'inhalation'],
    
    dependence_potential: 'very_high',
    dependence_uncertainty: 'Fysiskt beroende kan utvecklas inom veckor vid daglig användning. Psykologiskt beroende varierar individuellt.',
    
    acute_risks: [
      'Överdos med andningsdepression',
      'Infektionsrisk vid injektion',
      'Medvetslöshet',
    ],
    chronic_risks: [
      'Svårt beroendesyndrom',
      'Infektionssjukdomar (HIV, hepatit) vid delat injektionsmaterial',
      'Venösa skador',
      'Social marginalisering',
    ],
    risk_category: 'very_high',
    
    introduction_sweden: {
      approximate_year: 1960,
      context: 'Heroinanvändning dokumenterades i Sverige från 1960-talet, med ökning under 1970-talet.',
    },
    historical_changes: [
      {
        period: '1960-tal',
        description: 'Första dokumenterade fall av heroinanvändning i Sverige.',
      },
      {
        period: '1980-tal',
        description: 'HIV-epidemi kopplad till injektionsmissbruk.',
      },
      {
        period: '2010-tal',
        description: 'Fentanyl börjar ersätta heroin på delar av marknaden.',
      },
    ],
    
    current_legal_status: 'illegal',
    legal_history: [
      {
        year: 1968,
        change: 'Narkotikastrafflagen införs, heroin klassas som narkotika.',
      },
    ],
    
    causes_diagnoses: ['opioidberoende'],
    regulated_by_laws: ['narkotikalagstiftning'],
    associated_concepts: ['beroende', 'skademinimering'],
    
    sources: [
      {
        name: 'Folkhälsomyndigheten',
        url: 'https://www.folkhalsomyndigheten.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'EMCDDA – European Drug Report',
        url: 'https://www.emcdda.europa.eu',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'international',
      },
    ],
    
    status: 'active',
    version: 1,
  },

  // ==========================================================================
  // FENTANYL
  // ==========================================================================
  {
    canonical_slug: 'fentanyl',
    name_sv: 'Fentanyl',
    name_en: 'Fentanyl',
    
    definition: 'Fentanyl är en syntetisk opioid med mycket hög potens, uppskattningsvis 50–100 gånger starkare än morfin. Substansen utvecklades för medicinsk smärtlindring och används vid svår smärta samt inom anestesi. Illegalt fentanyl har blivit en betydande orsak till opioidrelaterade dödsfall.',
    
    classification_primary: 'opioid',
    classification_secondary: ['analgesic', 'synthetic'],
    pharmacological_class: 'Syntetisk opioidagonist (μ-receptor)',
    
    mechanism_of_action: 'Fentanyl binder med hög affinitet till μ-opioidreceptorer. Den höga potensen innebär att mycket små doser ger kraftig effekt, vilket ökar överdosrisken markant jämfört med andra opioider.',
    
    administration_routes: ['transdermal', 'injection', 'sublingual', 'insufflation'],
    
    dependence_potential: 'very_high',
    dependence_uncertainty: 'Den höga potensen medför snabb toleransutveckling. Data om beroendeutveckling vid icke-medicinsk användning är begränsade.',
    
    acute_risks: [
      'Överdos vid mycket låga doser',
      'Snabb andningsdepression',
      'Död inom minuter vid överdos utan naloxon',
    ],
    chronic_risks: [
      'Svårt beroendesyndrom',
      'Upprepade överdoser',
      'Toleransutveckling som ökar dosering',
    ],
    risk_category: 'very_high',
    
    introduction_sweden: {
      approximate_year: 2015,
      context: 'Illegalt fentanyl identifierades på svensk marknad omkring 2015, med ökande dödsfall därefter.',
    },
    historical_changes: [
      {
        period: '2015–2020',
        description: 'Ökning av fentanylrelaterade dödsfall i Sverige.',
      },
    ],
    
    current_legal_status: 'controlled',
    legal_history: [
      {
        year: 1963,
        change: 'Fentanyl godkänns för medicinsk användning internationellt.',
      },
      {
        year: 2015,
        change: 'Flera fentanylanaloger narkotikaklassas i Sverige.',
      },
    ],
    
    causes_diagnoses: ['opioidberoende'],
    regulated_by_laws: ['narkotikalagstiftning'],
    associated_concepts: ['skademinimering'],
    
    sources: [
      {
        name: 'Läkemedelsverket',
        url: 'https://www.lakemedelsverket.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Folkhälsomyndigheten – Narkotikarelaterade dödsfall',
        url: 'https://www.folkhalsomyndigheten.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'CDC – Fentanyl Facts',
        url: 'https://www.cdc.gov',
        retrieved_at: NOW,
        type: 'secondary',
        organization_type: 'government',
      },
    ],
    
    status: 'active',
    version: 1,
  },
];

export default SEED_SUBSTANCES;
