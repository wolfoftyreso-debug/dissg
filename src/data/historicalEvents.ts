// Historical events in Sweden that the system should have predicted/warned about

export interface HistoricalEvent {
  id: string;
  name: string;
  date: string; // When it became visible
  peakDate: string; // When it peaked
  category: 'economic' | 'health' | 'security' | 'social' | 'infrastructure';
  severity: 'critical' | 'high' | 'moderate';
  description: string;
  affectedKPIs: string[];
  leadIndicators: LeadIndicator[];
  actualOutcome: string;
}

export interface LeadIndicator {
  kpiId: string;
  kpiName: string;
  warningValue: number;
  warningDate: string; // When this indicator started warning
  peakValue: number;
  normalValue: number;
  unit: string;
  leadTimeMonths: number; // How many months before the event this warned
}

export interface HistoricalDataPoint {
  date: string;
  kpiId: string;
  value: number;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'pandemic_2020',
    name: 'COVID-19 Pandemin',
    date: '2020-03-01',
    peakDate: '2020-12-15',
    category: 'health',
    severity: 'critical',
    description: 'Global pandemi som orsakade hög överdödlighet, vårdkris och ekonomisk nedgång',
    affectedKPIs: ['excess_mortality', 'healthcare_queue_functional', 'employment_rate_net', 'gdp'],
    leadIndicators: [
      {
        kpiId: 'excess_mortality',
        kpiName: 'Överdödlighet',
        warningValue: 5.2,
        warningDate: '2020-03-15',
        peakValue: 18.4,
        normalValue: 0,
        unit: '% över baslinjen',
        leadTimeMonths: 0, // Samtidigt
      },
      {
        kpiId: 'healthcare_queue_functional',
        kpiName: 'Vårdkö',
        warningValue: 85,
        warningDate: '2020-04-01',
        peakValue: 142,
        normalValue: 45,
        unit: 'dagar median',
        leadTimeMonths: -1, // Eftersläntrare
      },
    ],
    actualOutcome: 'Över 20 000 dödsfall, vårdkollaps i regioner, BNP-fall på 2.9%',
  },
  {
    id: 'energy_crisis_2022',
    name: 'Energikrisen 2022',
    date: '2022-06-01',
    peakDate: '2022-12-20',
    category: 'infrastructure',
    severity: 'high',
    description: 'Extrema elpriser och energiosäkerhet efter Rysslands invasion av Ukraina',
    affectedKPIs: ['energy_stability', 'public_cost_per_capita', 'inflation'],
    leadIndicators: [
      {
        kpiId: 'energy_stability',
        kpiName: 'Energibalans & Prisvolatilitet',
        warningValue: 52,
        warningDate: '2022-02-24',
        peakValue: 28,
        normalValue: 80,
        unit: 'stabilitetsindex',
        leadTimeMonths: 3,
      },
    ],
    actualOutcome: 'Elpriser på 10+ kr/kWh i SE4, företagskonkurser, statliga stödpaket på 90 mdr',
  },
  {
    id: 'gang_violence_escalation_2022',
    name: 'Gängvåldseskaleringen 2022-2023',
    date: '2022-09-01',
    peakDate: '2023-09-30',
    category: 'security',
    severity: 'critical',
    description: 'Historiskt hög nivå av skjutningar och sprängningar',
    affectedKPIs: ['violent_crime_rate', 'young_men_outside_system', 'trust_institutions'],
    leadIndicators: [
      {
        kpiId: 'young_men_outside_system',
        kpiName: 'Unga Män Utanför System',
        warningValue: 11.8,
        warningDate: '2019-06-01',
        peakValue: 15.2,
        normalValue: 8.5,
        unit: '% av 15-29 män',
        leadTimeMonths: 39, // 3+ år före!
      },
      {
        kpiId: 'violent_crime_rate',
        kpiName: 'Grova Våldsbrott',
        warningValue: 38,
        warningDate: '2021-01-01',
        peakValue: 52,
        normalValue: 28,
        unit: 'per 100 000',
        leadTimeMonths: 20,
      },
    ],
    actualOutcome: '62 dödsskjutningar 2022, 53 sprängningar, NATO-krav på brottsbekämpning',
  },
  {
    id: 'housing_crisis_2023',
    name: 'Bostadskrisen 2023',
    date: '2023-01-01',
    peakDate: '2023-10-01',
    category: 'economic',
    severity: 'high',
    description: 'Byggkollaps och bostadsmarknadskris efter räntehöjningar',
    affectedKPIs: ['housing_turnover', 'tax_base_growth', 'employment_rate_net'],
    leadIndicators: [
      {
        kpiId: 'housing_turnover',
        kpiName: 'Bostadsomsättning',
        warningValue: 3.8,
        warningDate: '2022-06-01',
        peakValue: 2.9,
        normalValue: 6.0,
        unit: '% av bestånd/år',
        leadTimeMonths: 7,
      },
    ],
    actualOutcome: 'Byggstarterna föll 75%, tusentals bostadsbolag i kris, 20 000 jobb försvann',
  },
  {
    id: 'financial_crisis_2008',
    name: 'Finanskrisen 2008-2009',
    date: '2008-09-15',
    peakDate: '2009-03-01',
    category: 'economic',
    severity: 'critical',
    description: 'Global finanskris med kraftig BNP-nedgång och arbetslöshet',
    affectedKPIs: ['employment_rate_net', 'tax_base_growth', 'productivity_per_hour'],
    leadIndicators: [
      {
        kpiId: 'employment_rate_net',
        kpiName: 'Sysselsättningsgrad',
        warningValue: 72.1,
        warningDate: '2008-11-01',
        peakValue: 64.8,
        normalValue: 74.5,
        unit: '%',
        leadTimeMonths: -2, // Laggade
      },
      {
        kpiId: 'tax_base_growth',
        kpiName: 'Skattebasens Reala Tillväxt',
        warningValue: -1.2,
        warningDate: '2008-10-01',
        peakValue: -5.8,
        normalValue: 2.5,
        unit: '% årlig',
        leadTimeMonths: -1,
      },
    ],
    actualOutcome: 'BNP föll 5.2%, arbetslösheten steg till 9.1%, bankkris avvärjd genom stödpaket',
  },
  {
    id: 'refugee_crisis_2015',
    name: 'Flyktingkrisen 2015',
    date: '2015-09-01',
    peakDate: '2015-11-15',
    category: 'social',
    severity: 'high',
    description: '163 000 asylsökande på ett år - systemet överbelastades',
    affectedKPIs: ['long_term_exclusion', 'public_cost_per_capita', 'housing_turnover'],
    leadIndicators: [
      {
        kpiId: 'long_term_exclusion',
        kpiName: 'Långvarigt Utanförskap',
        warningValue: 6.8,
        warningDate: '2016-06-01',
        peakValue: 9.4,
        normalValue: 5.2,
        unit: '% av arbetskraft',
        leadTimeMonths: -7, // Eftersläntrande effekt
      },
    ],
    actualOutcome: 'Gränskontroller återinfördes, integrationsutmaningar i decennier framåt',
  },
  {
    id: 'eurozone_recession_2012',
    name: 'Lågkonjunkturen 2012',
    date: '2012-01-01',
    peakDate: '2012-09-01',
    category: 'economic',
    severity: 'moderate',
    description: 'Eurozonens skuldkris påverkade svensk export och tillväxt',
    affectedKPIs: ['employment_rate_net', 'tax_base_growth', 'productivity_per_hour'],
    leadIndicators: [
      {
        kpiId: 'employment_rate_net',
        kpiName: 'Sysselsättningsgrad',
        warningValue: 73.2,
        warningDate: '2011-11-01',
        peakValue: 71.8,
        normalValue: 74.5,
        unit: '%',
        leadTimeMonths: 2,
      },
      {
        kpiId: 'tax_base_growth',
        kpiName: 'Skattebasens Reala Tillväxt',
        warningValue: 0.8,
        warningDate: '2012-02-01',
        peakValue: -1.4,
        normalValue: 2.5,
        unit: '% årlig',
        leadTimeMonths: -1,
      },
    ],
    actualOutcome: 'BNP-tillväxt stannade vid 0.1%, exportnedgång, men Sverige undvek recession',
  },
  {
    id: 'forest_fires_2018',
    name: 'Skogsbränderna 2018',
    date: '2018-07-01',
    peakDate: '2018-07-25',
    category: 'infrastructure',
    severity: 'high',
    description: 'Sveriges värsta skogsbränder i modern tid - 25 000 hektar brann',
    affectedKPIs: ['emergency_response_capacity', 'climate_resilience', 'public_cost_per_capita'],
    leadIndicators: [
      {
        kpiId: 'emergency_response_capacity',
        kpiName: 'Krisberedskapskapacitet',
        warningValue: 62,
        warningDate: '2018-07-10',
        peakValue: 28,
        normalValue: 85,
        unit: 'index (0-100)',
        leadTimeMonths: 0, // Samtidigt med krisen
      },
      {
        kpiId: 'climate_resilience',
        kpiName: 'Klimatanpassningsindex',
        warningValue: 58,
        warningDate: '2017-06-01',
        peakValue: 42,
        normalValue: 72,
        unit: 'index (0-100)',
        leadTimeMonths: 13, // Förvarning via extremvärme
      },
    ],
    actualOutcome: 'Internationell hjälp krävdes, MSB omstrukturerades, 1 miljard kr i skador',
  },
  {
    id: 'sweden_nato_2022',
    name: 'NATO-ansökan 2022',
    date: '2022-02-24',
    peakDate: '2022-05-18',
    category: 'security',
    severity: 'high',
    description: 'Historisk säkerhetspolitisk omsvängning efter Rysslands invasion av Ukraina',
    affectedKPIs: ['trust_institutions', 'defense_spending', 'geopolitical_stability'],
    leadIndicators: [
      {
        kpiId: 'trust_institutions',
        kpiName: 'Institutionellt Förtroende',
        warningValue: 68,
        warningDate: '2022-03-01',
        peakValue: 74,
        normalValue: 65,
        unit: '% positivt',
        leadTimeMonths: 0,
      },
    ],
    actualOutcome: '52% → 57% folkligt stöd för NATO på en månad, ansökan inlämnad 18 maj',
  },
  {
    id: 'school_segregation_2010s',
    name: 'Skolsegregationen 2010-talet',
    date: '2010-01-01',
    peakDate: '2019-12-01',
    category: 'social',
    severity: 'moderate',
    description: 'Ökande resultatskillnader mellan skolor baserat på socioekonomisk bakgrund',
    affectedKPIs: ['education_completion', 'pisa_scores', 'equality_index'],
    leadIndicators: [
      {
        kpiId: 'education_completion',
        kpiName: 'Gymnasiebehörighet',
        warningValue: 85.2,
        warningDate: '2012-06-01',
        peakValue: 82.1,
        normalValue: 88.5,
        unit: '% av elever',
        leadTimeMonths: 36,
      },
      {
        kpiId: 'pisa_scores',
        kpiName: 'PISA-resultat',
        warningValue: 478,
        warningDate: '2013-12-01',
        peakValue: 465,
        normalValue: 502,
        unit: 'poäng',
        leadTimeMonths: 72, // Lång förvarning
      },
    ],
    actualOutcome: 'Sveriges PISA-resultat sjönk under OECD-snitt 2012, bottennapp 2015',
  },
  {
    id: 'inflation_surge_2022',
    name: 'Inflationschocken 2022-2023',
    date: '2022-01-01',
    peakDate: '2022-12-01',
    category: 'economic',
    severity: 'critical',
    description: 'Inflation steg till högsta nivån på 30 år efter pandemin och energikrisen',
    affectedKPIs: ['inflation', 'real_wage_growth', 'household_savings'],
    leadIndicators: [
      {
        kpiId: 'inflation',
        kpiName: 'KPI-inflation',
        warningValue: 4.1,
        warningDate: '2021-12-01',
        peakValue: 12.3,
        normalValue: 2.0,
        unit: '% årlig',
        leadTimeMonths: 1,
      },
      {
        kpiId: 'real_wage_growth',
        kpiName: 'Reallönetillväxt',
        warningValue: -0.5,
        warningDate: '2022-03-01',
        peakValue: -5.8,
        normalValue: 1.5,
        unit: '% årlig',
        leadTimeMonths: -2,
      },
    ],
    actualOutcome: 'Riksbanken höjde styrräntan från 0% till 4%, hushållens köpkraft föll kraftigt',
  },
  {
    id: 'elderly_care_crisis_2020',
    name: 'Äldrevårdskrisen 2020',
    date: '2020-03-15',
    peakDate: '2020-05-15',
    category: 'health',
    severity: 'critical',
    description: 'COVID-19 spreds på äldreboenden med hög dödlighet',
    affectedKPIs: ['excess_mortality', 'elderly_care_quality', 'healthcare_staffing'],
    leadIndicators: [
      {
        kpiId: 'elderly_care_quality',
        kpiName: 'Äldreomsorgskvalitet',
        warningValue: 62,
        warningDate: '2019-01-01',
        peakValue: 38,
        normalValue: 75,
        unit: 'index (0-100)',
        leadTimeMonths: 15, // Strukturella problem långt före
      },
      {
        kpiId: 'healthcare_staffing',
        kpiName: 'Vårdpersonal per Äldre',
        warningValue: 0.42,
        warningDate: '2018-06-01',
        peakValue: 0.35,
        normalValue: 0.52,
        unit: 'heltid per 80+',
        leadTimeMonths: 21,
      },
    ],
    actualOutcome: 'Hälften av COVID-dödsfall på äldreboenden, corona-kommission kritiserade beredskap',
  },
];

// Generate simulated historical data for backtesting
export function generateHistoricalData(
  event: HistoricalEvent,
  monthsBeforeStart: number = 24,
  monthsAfterPeak: number = 12
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const eventDate = new Date(event.date);
  const peakDate = new Date(event.peakDate);
  
  const startDate = new Date(eventDate);
  startDate.setMonth(startDate.getMonth() - monthsBeforeStart);
  
  const endDate = new Date(peakDate);
  endDate.setMonth(endDate.getMonth() + monthsAfterPeak);
  
  for (const indicator of event.leadIndicators) {
    const warningDate = new Date(indicator.warningDate);
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      let value: number;
      let status: 'positive' | 'warning' | 'critical' | 'neutral';
      
      if (currentDate < warningDate) {
        // Before warning - normal values with some noise
        const noise = (Math.random() - 0.5) * Math.abs(indicator.normalValue) * 0.1;
        value = indicator.normalValue + noise;
        status = 'positive';
      } else if (currentDate < peakDate) {
        // Escalation phase
        const progress = (currentDate.getTime() - warningDate.getTime()) / 
                        (peakDate.getTime() - warningDate.getTime());
        value = indicator.normalValue + 
                (indicator.peakValue - indicator.normalValue) * Math.pow(progress, 0.8);
        
        const escalation = Math.abs(value - indicator.normalValue) / 
                          Math.abs(indicator.peakValue - indicator.normalValue);
        status = escalation > 0.6 ? 'critical' : escalation > 0.3 ? 'warning' : 'neutral';
      } else {
        // Recovery phase
        const monthsAfter = (currentDate.getTime() - peakDate.getTime()) / (30 * 24 * 60 * 60 * 1000);
        const recovery = 1 - Math.exp(-monthsAfter / 8);
        value = indicator.peakValue + (indicator.normalValue - indicator.peakValue) * recovery;
        
        const remaining = Math.abs(value - indicator.normalValue) / 
                         Math.abs(indicator.peakValue - indicator.normalValue);
        status = remaining > 0.5 ? 'critical' : remaining > 0.2 ? 'warning' : 'neutral';
      }
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        kpiId: indicator.kpiId,
        value: Math.round(value * 10) / 10,
        status,
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  
  return data.sort((a, b) => a.date.localeCompare(b.date));
}
