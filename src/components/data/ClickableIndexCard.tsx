 /**
  * CLICKABLE INDEX CARD
  * ═══════════════════════════════════════════════════════════════
  * 
  * Klickbar rad för nyckelindex med bottenlös fördjupning.
  * Varje index leder till full exploration med 5 djupnivåer.
  * 
  * Spotless Protocol: Allt är klickbart.
  */
 
 import React from 'react';
 import { useNavigate } from 'react-router-dom';
 import { cn } from '@/lib/utils';
 import { useInfiniteDepth, DataPoint } from './InfiniteDepthProvider';
 
 // =============================================================================
 // INDEX DEFINITIONS WITH FULL DEPTH
 // =============================================================================
 
 export const INDEX_DEPTH_DATA: Record<string, {
   code: string;
   name: string;
   fullName: string;
   unit: string;
   description: string;
   depth: {
     observation: string;
     mechanism: string;
     methodology: string;
     limitations: string[];
     rawDataNote: string;
   };
   sources: Array<{ name: string; url?: string; reliability: number }>;
   relatedIndicators: string[];
 }> = {
   'HDI': {
     code: 'hdi',
     name: 'HDI',
     fullName: 'Human Development Index',
     unit: 'index (0-1)',
     description: 'FN:s sammanfattande mått på mänsklig utveckling inom hälsa, utbildning och levnadsstandard.',
     depth: {
       observation: 'HDI-värdet visar den genomsnittliga utvecklingsnivån för ett lands befolkning. Värden över 0.8 klassificeras som "mycket hög mänsklig utveckling".',
       mechanism: 'HDI beräknas som det geometriska medelvärdet av tre normaliserade delindex: (1) Livslängdsindex baserat på förväntad livslängd vid födseln, (2) Utbildningsindex baserat på förväntade skolår och genomsnittliga skolår, (3) Inkomstindex baserat på BNI per capita (PPP).',
       methodology: 'Data samlas in årligen av UNDP från nationella statistikbyråer. Normaliseringen använder fasta min/max-gränser (t.ex. livslängd 20-85 år). Det geometriska medelvärdet säkerställer att låga värden i en dimension inte fullt kan kompenseras av höga i en annan.',
       limitations: [
         'Visar nationella genomsnitt – döljer ojämlikheter inom länder',
         'Inkluderar inte miljömässig hållbarhet',
         'Mäter inte politisk frihet eller säkerhet',
         'BNI-komponenten kan vara missvisande för länder med stora informella sektorer',
         'Årlig uppdatering innebär eftersläpning på 1-2 år'
       ],
       rawDataNote: 'Underliggande data tillgänglig via UNDP Human Development Reports API och nationella statistikbyråer.'
     },
     sources: [
       { name: 'UNDP Human Development Reports', url: 'https://hdr.undp.org/data-center', reliability: 95 },
       { name: 'World Bank', url: 'https://data.worldbank.org', reliability: 92 },
       { name: 'UNESCO Institute for Statistics', reliability: 90 }
     ],
     relatedIndicators: ['life_expectancy', 'education_years', 'gni_capita']
   },
   'Gini': {
     code: 'gini',
     name: 'Gini',
     fullName: 'Gini-koefficient',
     unit: '0-100',
     description: 'Standardmått på inkomstojämlikhet. 0 = perfekt jämlikhet, 100 = maximal ojämlikhet.',
     depth: {
       observation: 'Gini-koefficienten visar hur ojämnt inkomster är fördelade. Skandinaviska länder ligger typiskt runt 25-30, medan länder som Sydafrika och Brasilien har värden över 50.',
       mechanism: 'Beräknas genom att jämföra den kumulativa inkomstfördelningen med en hypotetisk perfekt jämlik fördelning. Matematiskt motsvarar detta förhållandet mellan ytan under Lorenz-kurvan och ytan under den perfekta jämlikhetslinjen.',
       methodology: 'Data samlas in via hushållsundersökningar. Mätningarna kan baseras på disponibel inkomst (efter skatt och transfereringar) eller marknadsinkomst (före). OECD och Världsbanken använder olika definitioner.',
       limitations: [
         'Jämförelser mellan länder kompliceras av olika definitioner (före/efter skatt)',
         'Mäter inkomstojämlikhet – inte förmögenhetsojämlikhet',
         'Känslig för datakvalitet i hushållsundersökningar',
         'Fångar inte informella inkomster eller svart ekonomi',
         'Samma Gini-värde kan representera helt olika fördelningar'
       ],
       rawDataNote: 'Mikro-data från hushållsundersökningar ofta tillgängliga via nationella statistikbyråer.'
     },
     sources: [
       { name: 'World Bank PovcalNet', url: 'https://pip.worldbank.org', reliability: 90 },
       { name: 'OECD Income Distribution Database', reliability: 92 },
       { name: 'Luxembourg Income Study', reliability: 95 }
     ],
     relatedIndicators: ['poverty_rate', 'gdp_capita', 'social_mobility']
   },
   'BNP/capita': {
     code: 'gdp_capita',
     name: 'BNP/capita',
     fullName: 'BNP per capita (PPP)',
     unit: 'USD',
     description: 'Ekonomisk produktion per person, justerad för köpkraftsskillnader mellan länder.',
     depth: {
       observation: 'BNP per capita visar den genomsnittliga ekonomiska produktionen per invånare. PPP-justering gör att siffror blir jämförbara mellan länder med olika prisnivåer.',
       mechanism: 'BNP (totalt värde av producerade varor och tjänster) delas med befolkningsantalet. PPP-justeringen använder priskorgar för att kompensera för att samma belopp köper olika mycket i olika länder.',
       methodology: 'Nationalräkenskaper baseras på produktion, inkomst eller utgiftsmetoden (ska ge samma resultat). PPP-omräkningsfaktorer uppdateras via International Comparison Program vart 6:e år.',
       limitations: [
         'Genomsnitt döljer fördelning – säger inget om ojämlikhet',
         'Mäter inte välfärd, lycka eller livskvalitet',
         'Informella sektorer underrapporteras, särskilt i utvecklingsländer',
         'PPP-faktorer kan vara föråldrade mellan ICP-rundor',
         'Naturresursrika länder kan ha hög BNP utan bred välståndsspridning'
       ],
       rawDataNote: 'Kvartalsdata tillgänglig för de flesta OECD-länder. Årsdata från World Bank och IMF.'
     },
     sources: [
       { name: 'World Bank', url: 'https://data.worldbank.org', reliability: 93 },
       { name: 'IMF World Economic Outlook', url: 'https://imf.org/weo', reliability: 94 },
       { name: 'OECD National Accounts', reliability: 95 }
     ],
     relatedIndicators: ['gdp_growth', 'unemployment', 'inflation']
   },
   'CO₂/capita': {
     code: 'co2_capita',
     name: 'CO₂/capita',
     fullName: 'CO₂-utsläpp per capita',
     unit: 'ton/år',
     description: 'Årliga koldioxidutsläpp per person från fossila bränslen och cementproduktion.',
     depth: {
       observation: 'CO₂ per capita visar varje lands genomsnittliga klimatpåverkan per invånare. Utvecklade länder har typiskt 5-15 ton, medan fattiga länder kan ha under 1 ton.',
       mechanism: 'Mäter CO₂ från förbränning av fossila bränslen (kol, olja, gas) plus industriella processer (främst cement). Produktionsbaserat = utsläpp inom landets gränser. Konsumtionsbaserat = inkluderar importerade varors utsläpp.',
       methodology: 'Data kombinerar energistatistik med emissionsfaktorer. IEA och Global Carbon Project är huvudkällor. Produktionsbaserade mätningar är mer tillförlitliga än konsumtionsbaserade.',
       limitations: [
         'Produktionsbaserat mått – missar utsläpp från import',
         'Historiska utsläpp (kumulativt ansvar) visas inte',
         'Inkluderar inte andra växthusgaser (metan, N₂O)',
         'Internationell sjöfart och luftfart fördelas olika i olika dataset',
         'Skogssänkor och markanvändning ofta exkluderade'
       ],
       rawDataNote: 'Årliga uppdateringar från Global Carbon Project. Månadsdata tillgänglig för större ekonomier.'
     },
     sources: [
       { name: 'Global Carbon Project', url: 'https://globalcarbonproject.org', reliability: 92 },
       { name: 'IEA CO2 Emissions', url: 'https://iea.org/data-and-statistics', reliability: 94 },
       { name: 'Our World in Data', url: 'https://ourworldindata.org/co2-emissions', reliability: 90 }
     ],
     relatedIndicators: ['energy_mix', 'gdp_capita', 'renewable_share']
   },
   'GMI': {
     code: 'gmi',
     name: 'GMI',
     fullName: 'Global Master Index',
     unit: 'index (0-100)',
     description: 'Aggregerat samhällsindex som väger samman ekonomi, hälsa, utbildning, jämlikhet och miljö.',
     depth: {
       observation: 'GMI ger en helhetsbild av ett lands tillstånd genom att kombinera de viktigaste dimensionerna av samhällsutveckling i ett enda värde.',
       mechanism: 'Beräknas genom viktad aggregering av normaliserade delindikatorer. Vikterna är transparenta och justerbara. Geometriskt medelvärde används för att förhindra kompensation mellan dimensioner.',
       methodology: 'Metodik inspirerad av HDI men utökad med fler dimensioner. Alla underliggande indikatorer har definierade min/max-värden för normalisering. Årlig uppdatering.',
       limitations: [
         'Aggregerade index döljer per definition underliggande variation',
         'Viktningen är normativ – andra vikter ger andra resultat',
         'Datakvalitet varierar mellan länder och indikatorer',
         'Jämförelser över tid påverkas av metodförändringar',
         'Saknar dimensioner som politisk frihet och kulturell utveckling'
       ],
       rawDataNote: 'Alla underliggande datapunkter är separat tillgängliga för djupare analys.'
     },
     sources: [
       { name: 'Kompositindex baserat på multipla källor', reliability: 85 },
       { name: 'UNDP, World Bank, WHO, IEA', reliability: 90 }
     ],
     relatedIndicators: ['hdi', 'gini', 'co2_capita', 'life_expectancy']
   },
   'EPI': {
     code: 'epi',
     name: 'EPI',
     fullName: 'Environmental Performance Index',
     unit: 'index (0-100)',
     description: 'Mäter länders miljöprestanda inom ekosystemvitalitet och miljöhälsa.',
     depth: {
       observation: 'EPI rankar länder baserat på 40 prestationsindikatorer inom 11 kategorier som täcker klimat, luftkvalitet, vatten, biologisk mångfald och jordbruk.',
       mechanism: 'Index konstrueras genom viktning av normaliserade indikatorer. Mål (targets) baseras på internationella överenskommelser, vetenskapliga tröskelvärden eller bästa presterande länder.',
       methodology: 'Produceras av Yale och Columbia University vartannat år. Data från FN-organ, satellitobservationer och nationell rapportering.',
       limitations: [
         'Datakvalitet varierar kraftigt mellan indikatorer och länder',
         'Vissa kritiska miljöfrågor saknar globalt jämförbara data',
         'Viktningen är subjektiv och påverkar rankningen',
         'Trendriktning kan skilja sig från absolutnivå',
         'Lokala miljöproblem döljs i nationella genomsnitt'
       ],
       rawDataNote: 'Fullständigt dataset och metoddokumentation tillgängligt via epi.yale.edu'
     },
     sources: [
       { name: 'Yale Center for Environmental Law & Policy', url: 'https://epi.yale.edu', reliability: 88 },
       { name: 'Columbia Earth Institute', reliability: 88 }
     ],
     relatedIndicators: ['co2_capita', 'renewable_share', 'air_quality', 'biodiversity']
   }
 };
 
 // =============================================================================
 // PROPS
 // =============================================================================
 
 interface ClickableIndexCardProps {
   /** Index code (HDI, Gini, etc.) */
   indexCode: string;
   /** Current value */
   value: number;
   /** Global rank */
   rank: number;
   /** Country code for context */
   countryCode?: string;
   /** Custom className */
   className?: string;
 }
 
 // =============================================================================
 // COMPONENT
 // =============================================================================
 
 export const ClickableIndexCard: React.FC<ClickableIndexCardProps> = ({
   indexCode,
   value,
   rank,
   countryCode,
   className
 }) => {
   const navigate = useNavigate();
   const { openDepth } = useInfiniteDepth();
   
   const indexData = INDEX_DEPTH_DATA[indexCode];
   
   if (!indexData) {
     return (
       <div className={cn("p-3 rounded border", className)}>
         <span className="text-sm">{indexCode}: {value.toFixed(2)}</span>
       </div>
     );
   }
 
   const handleClick = () => {
     // Create full DataPoint for infinite depth exploration
     const dataPoint: DataPoint = {
       id: `${indexCode}-${countryCode || 'global'}`,
       value: value,
       label: indexData.fullName,
       type: 'index',
       unit: indexData.unit,
       depth: [
         {
           level: 1,
           title: 'Observation',
           content: indexData.depth.observation,
           shows: [`Aktuellt värde: ${value.toFixed(2)} ${indexData.unit}`, `Global ranking: #${rank}`],
           doesNotShow: ['Kausalitet', 'Framtida utveckling'],
         },
         {
           level: 2,
           title: 'Mekanism',
           content: indexData.depth.mechanism,
         },
         {
           level: 3,
           title: 'Metod',
           content: indexData.depth.methodology,
           sources: indexData.sources.map((s, i) => ({
             id: `source-${i}`,
             name: s.name,
             type: 'official' as const,
             url: s.url,
             reliability: s.reliability,
             accessDate: new Date().toISOString().split('T')[0],
           })),
         },
         {
           level: 4,
           title: 'Begränsningar',
           content: 'Följande begränsningar gäller för denna indikator:',
           doesNotShow: indexData.depth.limitations,
         },
         {
           level: 5,
           title: 'Rådata & Proveniens',
           content: indexData.depth.rawDataNote,
           drillDown: indexData.relatedIndicators.map(code => ({
             id: code,
             label: code,
             description: `Utforska relaterad indikator: ${code}`,
             targetUrl: `/indicator/${code}`,
           })),
         },
       ],
     };
     
     openDepth(dataPoint);
   };
 
   // Navigate to indicator page on double-click
   const handleDoubleClick = () => {
     navigate(`/indicator/${indexData.code}`);
   };
 
   return (
     <div
       onClick={handleClick}
       onDoubleClick={handleDoubleClick}
       className={cn(
         "group flex items-center justify-between p-3 rounded border",
         "hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer",
         "relative overflow-hidden",
         className
       )}
     >
       {/* Hover indicator */}
       <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary transition-colors" />
       
       <div className="pl-2">
         <div className="flex items-center gap-2">
           <span className="font-medium text-sm group-hover:text-primary transition-colors">
             {indexData.fullName}
           </span>
           <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
             [KLICKA FÖR DJUPDYKNING]
           </span>
         </div>
         <p className="text-xs text-muted-foreground">
           Rank #{rank} globalt
         </p>
       </div>
       
       <div className="flex items-center gap-3">
         <div className="text-right">
           <p className="text-lg font-bold font-mono group-hover:text-primary transition-colors">
             {value.toFixed(2)}
           </p>
         </div>
         <div className="opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-muted-foreground text-xs">[→]</span>
         </div>
       </div>
     </div>
   );
 };
 
 export default ClickableIndexCard;