 import React, { useState } from 'react';
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover";
 import { useNavigate } from 'react-router-dom';
 
 /**
  * TERM DEFINITIONS DATABASE
  * All technical terms with pedagogical explanations
  */
 export const TERM_DEFINITIONS: Record<string, {
   name: string;
   shortExplanation: string;
   fullExplanation: string;
   components?: string[];
   range?: string;
   source?: string;
   relatedTerms?: string[];
   indicatorCode?: string;
 }> = {
   // === INDICES ===
   'HDI': {
     name: 'Human Development Index (HDI)',
     shortExplanation: 'FN:s mått på mänsklig utveckling',
     fullExplanation: 'HDI mäter ett lands genomsnittliga prestation inom tre grundläggande dimensioner av mänsklig utveckling: ett långt och hälsosamt liv, tillgång till kunskap, och en skälig levnadsstandard. Det är ett alternativ till att bara mäta ekonomisk tillväxt.',
     components: [
       'Hälsa: Förväntad livslängd vid födseln',
       'Utbildning: Förväntade skolår + genomsnittliga skolår',
       'Levnadsstandard: BNI per capita (PPP-justerad)'
     ],
     range: '0 (lägst) till 1 (högst). Över 0.8 = "Mycket hög utveckling"',
     source: 'UNDP (FN:s utvecklingsprogram)',
     relatedTerms: ['BNP/capita', 'Livslängd', 'Gini'],
     indicatorCode: 'hdi'
   },
   'Gini': {
     name: 'Gini-koefficient',
     shortExplanation: 'Mått på inkomstojämlikhet',
     fullExplanation: 'Gini-koefficienten mäter hur ojämnt inkomster är fördelade i ett land. Den beräknas genom att jämföra den faktiska inkomstfördelningen med en hypotetisk helt jämlik fördelning.',
     range: '0 = perfekt jämlikhet (alla har lika mycket), 1 = maximal ojämlikhet (en person har allt)',
     source: 'Världsbanken, nationella statistikbyråer',
     relatedTerms: ['HDI', 'BNP/capita'],
     indicatorCode: 'gini'
   },
   
   // === ECONOMIC INDICATORS ===
   'BNP/capita': {
     name: 'BNP per capita',
     shortExplanation: 'Ekonomisk produktion per person',
     fullExplanation: 'Bruttonationalprodukt (BNP) delat med befolkningen. Visar den genomsnittliga ekonomiska produktionen per invånare. PPP-justerad betyder att siffran tar hänsyn till skillnader i prisnivå mellan länder.',
     components: [
       'BNP: Totalt värde av varor och tjänster producerade',
       'PPP: Köpkraftsparitet – justerar för prisskillnader',
       'Per capita: Delat med befolkningsantal'
     ],
     range: 'Från ~$500 (fattigaste) till ~$130,000 (rikaste)',
     source: 'Världsbanken, IMF, nationella statistikbyråer',
     relatedTerms: ['HDI', 'BNP-tillväxt'],
     indicatorCode: 'gdp_capita'
   },
   'BNP-tillväxt': {
     name: 'BNP-tillväxt',
     shortExplanation: 'Årlig förändring i ekonomisk produktion',
     fullExplanation: 'Procentuell förändring i BNP från ett år till nästa. Positiv tillväxt = ekonomin växer. Negativ tillväxt = ekonomin krymper (recession om det varar längre).',
     range: 'Typiskt -5% till +10% per år. 2-3% anses "normalt" för utvecklade ekonomier.',
     source: 'Världsbanken, IMF, SCB',
     relatedTerms: ['BNP/capita', 'Inflation'],
     indicatorCode: 'gdp_growth'
   },
   'Inflation': {
     name: 'Inflation',
     shortExplanation: 'Årlig prisökning i ekonomin',
     fullExplanation: 'Mäter hur mycket priserna ökar över tid. Hög inflation = pengar förlorar köpkraft snabbt. De flesta centralbanker siktar på ~2% inflation per år.',
     range: '0-2% = låg, 2-5% = måttlig, >10% = hög, >50% = hyperinflation',
     source: 'Centralbanker, nationella statistikbyråer',
     relatedTerms: ['BNP-tillväxt', 'Ränta'],
     indicatorCode: 'inflation'
   },
   
   // === HEALTH INDICATORS ===
   'Livslängd': {
     name: 'Förväntad livslängd',
     shortExplanation: 'Hur länge en nyfödd förväntas leva',
     fullExplanation: 'Statistisk beräkning baserad på nuvarande dödlighetstal. Om dödligheten förblir oförändrad, hur gammal blir en person född idag i genomsnitt?',
     range: 'Från ~50 år (lägsta) till ~85 år (högsta, Japan)',
     source: 'WHO, nationella hälsomyndigheter',
     relatedTerms: ['HDI', 'Barnadödlighet', 'Sjukvårdsutgifter'],
     indicatorCode: 'life_exp'
   },
   'Barnadödlighet': {
     name: 'Barnadödlighet (under 5 år)',
     shortExplanation: 'Antal barn som dör före 5 års ålder per 1000 födda',
     fullExplanation: 'En av de viktigaste indikatorerna för ett samhälles hälsotillstånd och utvecklingsnivå. Mäter hur många barn per 1000 levande födda som dör innan de fyller 5 år.',
     range: 'Från ~2/1000 (bäst, t.ex. Island) till >100/1000 (sämst)',
     source: 'WHO, UNICEF',
     relatedTerms: ['Livslängd', 'Mödradödlighet'],
     indicatorCode: 'child_mortality'
   },
   
   // === LABOR INDICATORS ===
   'Arbetslöshet': {
     name: 'Arbetslöshet',
     shortExplanation: 'Andel av arbetskraften utan jobb',
     fullExplanation: 'Procent av arbetskraften (de som vill och kan arbeta) som aktivt söker jobb men inte har något. OBS: Inkluderar inte de som gett upp att söka.',
     range: 'Typiskt 3-10%. Under 4% = "full sysselsättning"',
     source: 'ILO, Arbetsförmedlingen, SCB',
     relatedTerms: ['Sysselsättningsgrad', 'BNP-tillväxt'],
     indicatorCode: 'unemployment'
   },
   
   // === EDUCATION INDICATORS ===
   'PISA': {
     name: 'PISA-resultat',
     shortExplanation: 'Internationellt kunskapstest för 15-åringar',
     fullExplanation: 'OECD:s standardiserade test som mäter 15-åringars kunskaper i läsning, matematik och naturvetenskap. Genomförs vart 3:e år i ~80 länder.',
     components: [
       'Läsförståelse: Tolka och analysera texter',
       'Matematik: Problemlösning och resonemang',
       'Naturvetenskap: Vetenskapligt tänkande'
     ],
     range: 'Poäng: 200-800. Genomsnitt = 500. Över 550 = toppresterande',
     source: 'OECD',
     relatedTerms: ['HDI', 'Utbildningsnivå'],
     indicatorCode: 'pisa'
   },
   
   // === ENVIRONMENTAL INDICATORS ===
   'CO₂/capita': {
     name: 'CO₂-utsläpp per capita',
     shortExplanation: 'Ton koldioxid per person och år',
     fullExplanation: 'Totala koldioxidutsläpp från fossila bränslen och cement, delat med befolkningen. Inkluderar inte konsumtionsbaserade utsläpp (importerade varor).',
     range: 'Från <1 ton (fattigaste länder) till >30 ton (Qatar, Kuwait)',
     source: 'Global Carbon Project, IEA',
     relatedTerms: ['BNP/capita', 'Förnybar energi'],
     indicatorCode: 'co2_capita'
   }
 };
 
 interface TermExplainerProps {
   term: string;
   children?: React.ReactNode;
   className?: string;
   showArrow?: boolean;
 }
 
 /**
  * TermExplainer - Klickbar term med popup-förklaring
  * Följer "Spotless UI Protocol" - allt är klickbart
  */
 export const TermExplainer: React.FC<TermExplainerProps> = ({
   term,
   children,
   className = '',
   showArrow = true
 }) => {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const definition = TERM_DEFINITIONS[term];
   
   if (!definition) {
     // Om termen inte finns definierad, visa den som vanlig text
     return <span className={className}>{children || term}</span>;
   }
 
   const handleDeepDive = () => {
     if (definition.indicatorCode) {
       navigate(`/indicator/${definition.indicatorCode}`);
     }
     setOpen(false);
   };
 
   return (
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <button
           className={`
             inline-flex items-center gap-1
             text-primary hover:text-primary/80
             underline decoration-dotted underline-offset-2
             cursor-help transition-colors
             ${className}
           `}
         >
           {children || term}
           {showArrow && <span className="text-xs opacity-60">[?]</span>}
         </button>
       </PopoverTrigger>
       <PopoverContent 
         className="w-96 p-0 font-mono text-xs"
         side="top"
         align="start"
       >
         <div className="border-b border-border p-3 bg-muted/30">
           <div className="font-semibold text-sm">{definition.name}</div>
           <div className="text-muted-foreground mt-1">
             {definition.shortExplanation}
           </div>
         </div>
         
         <div className="p-3 space-y-3">
           <div>
             <div className="font-semibold text-muted-foreground mb-1">[VAD DET MÄTER]</div>
             <p className="text-foreground leading-relaxed">
               {definition.fullExplanation}
             </p>
           </div>
           
           {definition.components && (
             <div>
               <div className="font-semibold text-muted-foreground mb-1">[KOMPONENTER]</div>
               <ul className="space-y-1">
                 {definition.components.map((comp, i) => (
                   <li key={i} className="flex items-start gap-2">
                     <span className="text-muted-foreground">•</span>
                     <span>{comp}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
           
           {definition.range && (
             <div>
               <div className="font-semibold text-muted-foreground mb-1">[SKALA]</div>
               <p>{definition.range}</p>
             </div>
           )}
           
           {definition.source && (
             <div>
               <div className="font-semibold text-muted-foreground mb-1">[KÄLLA]</div>
               <p className="text-muted-foreground">{definition.source}</p>
             </div>
           )}
           
           {definition.relatedTerms && definition.relatedTerms.length > 0 && (
             <div>
               <div className="font-semibold text-muted-foreground mb-1">[RELATERADE]</div>
               <div className="flex flex-wrap gap-1">
                 {definition.relatedTerms.map((related) => (
                   <span
                     key={related}
                     className="px-2 py-0.5 bg-muted rounded text-muted-foreground"
                   >
                     {related}
                   </span>
                 ))}
               </div>
             </div>
           )}
         </div>
         
         {definition.indicatorCode && (
           <div className="border-t border-border p-3 bg-muted/30">
             <button
               onClick={handleDeepDive}
               className="w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
             >
               [UTFORSKA DATA] →
             </button>
           </div>
         )}
       </PopoverContent>
     </Popover>
   );
 };
 
 /**
  * TermLegend - Wrapper för Recharts Legend som gör alla termer klickbara
  */
 interface TermLegendProps {
   payload?: Array<{ value: string; color: string }>;
 }
 
 export const TermLegend: React.FC<TermLegendProps> = ({ payload }) => {
   if (!payload) return null;
   
   return (
     <div className="flex items-center justify-center gap-6 mt-4">
       {payload.map((entry, index) => (
         <div key={index} className="flex items-center gap-2">
           <div 
             className="w-3 h-3 rounded-sm" 
             style={{ backgroundColor: entry.color }}
           />
           <TermExplainer term={entry.value} showArrow={true}>
             {entry.value}
           </TermExplainer>
         </div>
       ))}
     </div>
   );
 };
 
 export default TermExplainer;