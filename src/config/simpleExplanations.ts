import { SimpleExplanation } from '@/types/kpi';

/**
 * Simple explanations for all KPIs
 * These are designed to be understood by anyone, regardless of statistical knowledge
 */
export const SIMPLE_EXPLANATIONS: Record<string, SimpleExplanation> = {
  life_expectancy: {
    icon: '🧍',
    oneLiner: 'Hur länge en nyfödd person förväntas leva baserat på dagens förhållanden.',
    whatItMeasures: 'Förväntad livslängd vid födseln – ett mått på hela samhällets hälsa och välstånd.',
    whyItMatters: 'Om livslängden minskar betyder det att något i samhället försämras – vård, miljö, säkerhet eller levnadsvillkor.',
    goodDirection: 'up',
  },
  excess_mortality: {
    icon: '☠️',
    oneLiner: 'Fler människor dör nu än vad som brukar vara normalt för den här tiden på året.',
    whatItMeasures: 'Skillnaden mellan faktiska dödsfall och vad som är "normalt" historiskt sett.',
    whyItMatters: 'Överdödlighet kan visa på dolda problem – pandemier, värmeböljar, vårdkris eller försämrad folkhälsa.',
    goodDirection: 'down',
  },
  working_age_functional: {
    icon: '👷',
    oneLiner: 'Andelen vuxna i arbetsför ålder som faktiskt kan arbeta eller studera.',
    whatItMeasures: 'Procent av befolkningen 18-64 år som inte är långtidssjukskrivna, förtidspensionerade eller på annat sätt utanför arbetsmarknaden.',
    whyItMatters: 'Dessa människor finansierar välfärden genom skatt. Färre arbetande = mindre pengar till vård, skola och pension.',
    goodDirection: 'up',
  },
  employment_rate_net: {
    icon: '💼',
    oneLiner: 'Andelen vuxna som faktiskt jobbar, inte bara de som "söker jobb".',
    whatItMeasures: 'Verklig sysselsättning – personer som har ett jobb och arbetar.',
    whyItMatters: 'Hög sysselsättning betyder att fler bidrar till samhället och färre behöver stöd.',
    goodDirection: 'up',
  },
  productivity_per_hour: {
    icon: '📈',
    oneLiner: 'Hur mycket värde Sverige skapar per arbetad timme.',
    whatItMeasures: 'Ekonomiskt värde delat med antal arbetade timmar – effektiviteten i ekonomin.',
    whyItMatters: 'Produktivitet är det enda som långsiktigt kan göra ett land rikare utan att folk behöver arbeta mer.',
    goodDirection: 'up',
  },
  long_term_exclusion: {
    icon: '🚫',
    oneLiner: 'Andelen människor som varit utan jobb eller studier i över ett år.',
    whatItMeasures: 'Personer som varit utanför arbetsmarknad och utbildning i minst 12 månader.',
    whyItMatters: 'Ju längre tid utanför, desto svårare att komma tillbaka. Det kostar samhället och skadar individen.',
    goodDirection: 'down',
  },
  tax_base_growth: {
    icon: '💰',
    oneLiner: 'Hur mycket skatteintäkterna faktiskt växer när man räknar bort inflation.',
    whatItMeasures: 'Real tillväxt i den totala skattebasen.',
    whyItMatters: 'Om skattebasen inte växer kan vi inte finansiera mer välfärd – eller ens behålla den vi har.',
    goodDirection: 'up',
  },
  public_cost_per_capita: {
    icon: '🏛️',
    oneLiner: 'Hur mycket det kostar att driva Sverige per person per år.',
    whatItMeasures: 'Total offentlig kostnad delat med antalet invånare.',
    whyItMatters: 'Om kostnaden ökar snabbare än intäkterna blir systemet ohållbart.',
    goodDirection: 'down',
  },
  dependency_ratio: {
    icon: '⚖️',
    oneLiner: 'Hur många personer varje arbetande person måste försörja.',
    whatItMeasures: 'Antal icke-arbetande per arbetande person i samhället.',
    whyItMatters: 'En hög kvot betyder att färre försörjer fler – vilket pressar pensioner, vård och skola.',
    goodDirection: 'down',
  },
  violent_crime_rate: {
    icon: '⚠️',
    oneLiner: 'Antalet grova våldsbrott per 100 000 invånare.',
    whatItMeasures: 'Mord, dråp, grov misshandel, skjutningar och liknande.',
    whyItMatters: 'Grovt våld förstör liv, skapar otrygghet och kostar samhället enorma resurser.',
    goodDirection: 'down',
  },
  young_men_outside_system: {
    icon: '🧑',
    oneLiner: 'Andelen unga män som varken jobbar, studerar eller har vårdkontakt.',
    whatItMeasures: 'Procent av män 15-29 år som är helt utanför samhällets radar.',
    whyItMatters: 'Denna grupp står för en oproportionerlig andel av framtida sociala problem och kriminalitet.',
    goodDirection: 'down',
  },
  substance_harm: {
    icon: '💊',
    oneLiner: 'Antalet sjukvårdsbesök och dödsfall kopplade till droger och alkohol.',
    whatItMeasures: 'Alla skador relaterade till substansbruk per 100 000 invånare.',
    whyItMatters: 'Missbruksskador visar på samhällsstress och drabbar ofta de mest sårbara.',
    goodDirection: 'down',
  },
  healthcare_queue_functional: {
    icon: '🏥',
    oneLiner: 'Hur länge du faktiskt får vänta på behandling eller operation.',
    whatItMeasures: 'Median-väntetid från beslut om behandling till genomförd åtgärd.',
    whyItMatters: 'Lång väntetid kan förvärra sjukdomar, öka lidande och kosta mer i längden.',
    goodDirection: 'down',
  },
  school_outcomes_grade9: {
    icon: '📚',
    oneLiner: 'Andelen niondeklassare som klarar svenska och matte.',
    whatItMeasures: 'Procent av elever i årskurs 9 med godkänt i svenska och matematik.',
    whyItMatters: 'Utan dessa baskunskaper blir det mycket svårare att klara gymnasiet och få jobb.',
    goodDirection: 'up',
  },
  justice_throughput: {
    icon: '⚖️',
    oneLiner: 'Hur lång tid det tar från brott till dom.',
    whatItMeasures: 'Median-tid från anmält brott till lagakraftvunnen dom.',
    whyItMatters: 'Lång tid underminerar förtroendet för rättsväsendet och gör straff mindre avskräckande.',
    goodDirection: 'down',
  },
  housing_turnover: {
    icon: '🏠',
    oneLiner: 'Hur stor andel av bostäderna som byter ägare eller hyresgäst varje år.',
    whatItMeasures: 'Omsättningen i bostadsmarknaden.',
    whyItMatters: 'Låg omsättning = inlåsta människor, svårt att flytta för jobb eller familj.',
    goodDirection: 'up',
  },
  energy_stability: {
    icon: '⚡',
    oneLiner: 'Hur stabil och tillgänglig energin är till rimligt pris.',
    whatItMeasures: 'Index som kombinerar tillgång och prisstabilitet (100 = optimalt).',
    whyItMatters: 'Ostabil energi slår mot industrin, höjer elkostnader och skapar osäkerhet.',
    goodDirection: 'up',
  },
  regional_divergence: {
    icon: '🗺️',
    oneLiner: 'Hur stora skillnaderna är mellan Sveriges olika regioner.',
    whatItMeasures: 'Standardavvikelse i nyckelvariabler mellan regioner.',
    whyItMatters: 'Stor divergens betyder att vissa delar av Sverige halkar efter – det skapar spänningar.',
    goodDirection: 'down',
  },
  institutional_trust: {
    icon: '🏛️',
    oneLiner: 'Hur mycket folket litar på myndigheter och institutioner.',
    whatItMeasures: 'Index baserat på återkommande mätningar av förtroende.',
    whyItMatters: 'Lågt förtroende gör samhället svårare att styra och beslut får mindre genomslag.',
    goodDirection: 'up',
  },
  critical_imports: {
    icon: '🚢',
    oneLiner: 'Hur beroende Sverige är av import av kritiska varor.',
    whatItMeasures: 'Andel av mediciner, livsmedel och energi som måste importeras.',
    whyItMatters: 'Högt beroende gör Sverige sårbart vid kriser, krig eller handelskonflikter.',
    goodDirection: 'down',
  },
};

/**
 * Get a simple explanation for a KPI, with fallback
 */
export function getSimpleExplanation(kpiId: string): SimpleExplanation {
  return SIMPLE_EXPLANATIONS[kpiId] || {
    icon: '📊',
    oneLiner: 'Ett mått som visar hur Sverige utvecklas på detta område.',
    whatItMeasures: 'Ett statistiskt mått baserat på officiella data.',
    whyItMatters: 'Hjälper oss förstå samhällets tillstånd och utveckling.',
    goodDirection: 'up',
  };
}
