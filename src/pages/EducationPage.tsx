 /**
  * EDUCATION PAGE
  * 
  * Comprehensive education and school data hub.
  * All education-related indices, metrics and tools in one place.
  */
 
 import React, { useState } from 'react';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Progress } from '@/components/ui/progress';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 
 // =============================================================================
 // EDUCATION INDICES
 // =============================================================================
 
interface BenchmarkData {
  sweden: number | null;
  oecdAvg: number | null;
  best: { country: string; value: number };
  worst: { country: string; value: number };
  unit: string;
  higherIsBetter: boolean;
}

interface EducationIndex {
  code: string;
  name: string;
  fullName: string;
  description: string;
  source: string;
  sourceUrl: string;
  methodology: string;
  updateFrequency: string;
  coverage: number;
  yearRange: string;
  scale: string;
  categories?: string[];
  benchmark: BenchmarkData;
}
 
 const EDUCATION_INDICES: EducationIndex[] = [
    {
      code: 'PISA',
      name: 'PISA-poäng',
      fullName: 'Programme for International Student Assessment',
      description: 'Mäter 15-åringars kunskaper i läsförståelse, matematik och naturvetenskap',
      source: 'OECD',
      sourceUrl: 'https://www.oecd.org/pisa/',
      methodology: 'Standardiserade tester på representativa urval av elever',
      updateFrequency: 'Var 3:e år',
      coverage: 82,
      yearRange: '2000–2022',
      scale: '0–1000 (snitt 500)',
      categories: ['Läsförståelse', 'Matematik', 'Naturvetenskap'],
      benchmark: { sweden: 502, oecdAvg: 489, best: { country: 'Singapore', value: 569 }, worst: { country: 'Dominikanska rep.', value: 339 }, unit: 'poäng', higherIsBetter: true },
    },
    {
      code: 'HDI-EDU',
      name: 'HDI Utbildningsindex',
      fullName: 'Human Development Index - Education Component',
      description: 'Kombinerar förväntad och genomsnittlig skolår',
      source: 'UNDP',
      sourceUrl: 'https://hdr.undp.org/',
      methodology: 'Normaliserat index baserat på utbildningsdata',
      updateFrequency: 'Årligen',
      coverage: 95,
      yearRange: '1990–2024',
      scale: '0–1.0',
      benchmark: { sweden: 0.911, oecdAvg: 0.870, best: { country: 'Norge', value: 0.953 }, worst: { country: 'Niger', value: 0.209 }, unit: 'index', higherIsBetter: true },
    },
    {
      code: 'LITERACY',
      name: 'Läskunnighet',
      fullName: 'Adult Literacy Rate',
      description: 'Andel av befolkningen 15+ som kan läsa och skriva',
      source: 'UNESCO',
      sourceUrl: 'https://uis.unesco.org/',
      methodology: 'Folkräkningar och hushållsundersökningar',
      updateFrequency: 'Var 5:e år',
      coverage: 88,
      yearRange: '1970–2024',
      scale: '0–100%',
      benchmark: { sweden: 99, oecdAvg: 99, best: { country: 'Finland', value: 100 }, worst: { country: 'Niger', value: 19 }, unit: '%', higherIsBetter: true },
    },
    {
      code: 'ENROLLMENT',
      name: 'Inskrivningsgrad',
      fullName: 'Gross Enrollment Ratio',
      description: 'Andel av relevant åldersgrupp som är inskrivna i utbildning',
      source: 'UNESCO UIS',
      sourceUrl: 'https://uis.unesco.org/',
      methodology: 'Administrativa data från nationella utbildningssystem',
      updateFrequency: 'Årligen',
      coverage: 92,
      yearRange: '1970–2024',
      scale: '0–100%+',
      categories: ['Förskola', 'Grundskola', 'Gymnasium', 'Högre utbildning'],
      benchmark: { sweden: 67, oecdAvg: 75, best: { country: 'Sydkorea', value: 95 }, worst: { country: 'Eritrea', value: 2 }, unit: '% (högre utb.)', higherIsBetter: true },
    },
    {
      code: 'COMPLETION',
      name: 'Avslutad utbildning',
      fullName: 'Educational Attainment Rate',
      description: 'Andel som avslutat respektive utbildningsnivå',
      source: 'UNESCO/Barro-Lee',
      sourceUrl: 'https://barrolee.github.io/BarroLeeDataSet/',
      methodology: 'Folkräkningsdata och utbildningsregister',
      updateFrequency: 'Var 5:e år',
      coverage: 78,
      yearRange: '1950–2024',
      scale: '0–100%',
      categories: ['Grundskola', 'Gymnasium', 'Universitet'],
      benchmark: { sweden: 88, oecdAvg: 80, best: { country: 'Kanada', value: 94 }, worst: { country: 'Moçambique', value: 7 }, unit: '% (gymn.+)', higherIsBetter: true },
    },
    {
      code: 'TIMSS',
      name: 'TIMSS-poäng',
      fullName: 'Trends in International Mathematics and Science Study',
      description: 'Internationell mätning av matematik- och NO-kunskaper',
      source: 'IEA',
      sourceUrl: 'https://timssandpirls.bc.edu/',
      methodology: 'Standardiserade tester för årskurs 4 och 8',
      updateFrequency: 'Var 4:e år',
      coverage: 65,
      yearRange: '1995–2023',
      scale: '0–1000 (snitt 500)',
      categories: ['Matematik', 'Naturvetenskap'],
      benchmark: { sweden: 521, oecdAvg: 503, best: { country: 'Singapore', value: 611 }, worst: { country: 'Sydafrika', value: 372 }, unit: 'poäng', higherIsBetter: true },
    },
    {
      code: 'PIRLS',
      name: 'PIRLS-poäng',
      fullName: 'Progress in International Reading Literacy Study',
      description: 'Internationell mätning av läsförmåga i årskurs 4',
      source: 'IEA',
      sourceUrl: 'https://timssandpirls.bc.edu/',
      methodology: 'Standardiserade lästester',
      updateFrequency: 'Var 5:e år',
      coverage: 58,
      yearRange: '2001–2021',
      scale: '0–1000 (snitt 500)',
      benchmark: { sweden: 544, oecdAvg: 511, best: { country: 'Singapore', value: 576 }, worst: { country: 'Sydafrika', value: 288 }, unit: 'poäng', higherIsBetter: true },
    },
    {
      code: 'SPEND-EDU',
      name: 'Utbildningsutgifter',
      fullName: 'Government Expenditure on Education',
      description: 'Offentliga utgifter för utbildning som andel av BNP',
      source: 'World Bank / UNESCO',
      sourceUrl: 'https://data.worldbank.org/',
      methodology: 'Nationella budgetdata',
      updateFrequency: 'Årligen',
      coverage: 85,
      yearRange: '1970–2024',
      scale: '% av BNP',
      benchmark: { sweden: 7.6, oecdAvg: 4.9, best: { country: 'Norge', value: 7.9 }, worst: { country: 'Bangladesh', value: 1.3 }, unit: '% av BNP', higherIsBetter: true },
    },
    {
      code: 'TEACHER-RATIO',
      name: 'Elev-lärare-kvot',
      fullName: 'Pupil-Teacher Ratio',
      description: 'Antal elever per lärare på olika utbildningsnivåer',
      source: 'UNESCO UIS',
      sourceUrl: 'https://uis.unesco.org/',
      methodology: 'Administrativa utbildningsdata',
      updateFrequency: 'Årligen',
      coverage: 88,
      yearRange: '1970–2024',
      scale: 'Ratio',
      categories: ['Grundskola', 'Gymnasium', 'Högre utbildning'],
      benchmark: { sweden: 12, oecdAvg: 15, best: { country: 'Norge', value: 10 }, worst: { country: 'Centralafrikanska rep.', value: 80 }, unit: 'elever/lärare', higherIsBetter: false },
    },
    {
      code: 'SKILLS-ADULT',
      name: 'Vuxenkompetens',
      fullName: 'PIAAC Adult Skills',
      description: 'Vuxnas kunskaper i läsning, räkning och problemlösning',
      source: 'OECD PIAAC',
      sourceUrl: 'https://www.oecd.org/skills/piaac/',
      methodology: 'Standardiserade tester på vuxen befolkning 16–65',
      updateFrequency: 'Var 10:e år',
      coverage: 42,
      yearRange: '2012–2023',
      scale: '0–500',
      categories: ['Läsning', 'Räkning', 'Problemlösning'],
      benchmark: { sweden: 279, oecdAvg: 263, best: { country: 'Japan', value: 296 }, worst: { country: 'Ecuador', value: 196 }, unit: 'poäng', higherIsBetter: true },
    },
    {
      code: 'DIGITAL-SKILLS',
      name: 'Digitala färdigheter',
      fullName: 'Digital Skills Index',
      description: 'Befolkningens digitala kompetens och internetanvändning',
      source: 'ITU / Eurostat',
      sourceUrl: 'https://www.itu.int/',
      methodology: 'Hushållsundersökningar om digital kompetens',
      updateFrequency: 'Årligen',
      coverage: 72,
      yearRange: '2015–2024',
      scale: '0–100',
      benchmark: { sweden: 72, oecdAvg: 58, best: { country: 'Finland', value: 79 }, worst: { country: 'Rumänien', value: 28 }, unit: '/100', higherIsBetter: true },
    },
    {
      code: 'NEET',
      name: 'NEET-andel',
      fullName: 'Not in Employment, Education or Training',
      description: 'Unga (15–29) som varken arbetar, studerar eller praktiserar',
      source: 'OECD / ILO',
      sourceUrl: 'https://data.oecd.org/',
      methodology: 'Arbetskraftsundersökningar',
      updateFrequency: 'Årligen',
      coverage: 78,
      yearRange: '2000–2024',
      scale: '% av åldersgrupp',
      benchmark: { sweden: 6.5, oecdAvg: 12.1, best: { country: 'Japan', value: 3.1 }, worst: { country: 'Sydafrika', value: 32.4 }, unit: '%', higherIsBetter: false },
    },
 ];
 
 // =============================================================================
 // COUNTRY EDUCATION DATA
 // =============================================================================
 
 interface CountryEducationData {
   code: string;
   name: string;
   pisa_reading: number | null;
   pisa_math: number | null;
   pisa_science: number | null;
   literacy: number;
   enrollment_primary: number;
   enrollment_secondary: number;
   enrollment_tertiary: number;
   spending_gdp: number;
   teacher_ratio_primary: number;
   years_schooling: number;
   neet_rate: number | null;
 }
 
 const COUNTRY_EDUCATION_DATA: CountryEducationData[] = [
   { code: 'SE', name: 'Sverige', pisa_reading: 506, pisa_math: 502, pisa_science: 499, literacy: 99, enrollment_primary: 100, enrollment_secondary: 99, enrollment_tertiary: 67, spending_gdp: 7.6, teacher_ratio_primary: 12, years_schooling: 12.6, neet_rate: 6.5 },
   { code: 'FI', name: 'Finland', pisa_reading: 520, pisa_math: 507, pisa_science: 522, literacy: 99, enrollment_primary: 99, enrollment_secondary: 99, enrollment_tertiary: 90, spending_gdp: 6.3, teacher_ratio_primary: 13, years_schooling: 12.4, neet_rate: 8.2 },
   { code: 'NO', name: 'Norge', pisa_reading: 499, pisa_math: 501, pisa_science: 490, literacy: 99, enrollment_primary: 100, enrollment_secondary: 98, enrollment_tertiary: 82, spending_gdp: 7.9, teacher_ratio_primary: 10, years_schooling: 12.9, neet_rate: 5.8 },
   { code: 'DK', name: 'Danmark', pisa_reading: 501, pisa_math: 509, pisa_science: 493, literacy: 99, enrollment_primary: 100, enrollment_secondary: 99, enrollment_tertiary: 81, spending_gdp: 6.4, teacher_ratio_primary: 11, years_schooling: 12.6, neet_rate: 7.1 },
   { code: 'DE', name: 'Tyskland', pisa_reading: 498, pisa_math: 500, pisa_science: 503, literacy: 99, enrollment_primary: 100, enrollment_secondary: 99, enrollment_tertiary: 70, spending_gdp: 4.9, teacher_ratio_primary: 15, years_schooling: 14.1, neet_rate: 6.8 },
   { code: 'GB', name: 'Storbritannien', pisa_reading: 504, pisa_math: 489, pisa_science: 500, literacy: 99, enrollment_primary: 100, enrollment_secondary: 98, enrollment_tertiary: 60, spending_gdp: 5.5, teacher_ratio_primary: 17, years_schooling: 13.2, neet_rate: 11.4 },
   { code: 'US', name: 'USA', pisa_reading: 505, pisa_math: 478, pisa_science: 502, literacy: 99, enrollment_primary: 99, enrollment_secondary: 96, enrollment_tertiary: 88, spending_gdp: 5.0, teacher_ratio_primary: 14, years_schooling: 13.4, neet_rate: 11.2 },
   { code: 'JP', name: 'Japan', pisa_reading: 516, pisa_math: 536, pisa_science: 529, literacy: 99, enrollment_primary: 100, enrollment_secondary: 99, enrollment_tertiary: 64, spending_gdp: 3.6, teacher_ratio_primary: 15, years_schooling: 12.9, neet_rate: 3.1 },
   { code: 'KR', name: 'Sydkorea', pisa_reading: 514, pisa_math: 527, pisa_science: 519, literacy: 99, enrollment_primary: 99, enrollment_secondary: 99, enrollment_tertiary: 95, spending_gdp: 5.1, teacher_ratio_primary: 16, years_schooling: 12.5, neet_rate: 15.6 },
   { code: 'SG', name: 'Singapore', pisa_reading: 549, pisa_math: 569, pisa_science: 551, literacy: 97, enrollment_primary: 100, enrollment_secondary: 99, enrollment_tertiary: 91, spending_gdp: 2.9, teacher_ratio_primary: 15, years_schooling: 11.6, neet_rate: 4.2 },
   { code: 'CN', name: 'Kina', pisa_reading: 555, pisa_math: 591, pisa_science: 590, literacy: 97, enrollment_primary: 100, enrollment_secondary: 95, enrollment_tertiary: 58, spending_gdp: 4.0, teacher_ratio_primary: 16, years_schooling: 8.1, neet_rate: null },
   { code: 'IN', name: 'Indien', pisa_reading: null, pisa_math: null, pisa_science: null, literacy: 74, enrollment_primary: 100, enrollment_secondary: 74, enrollment_tertiary: 28, spending_gdp: 4.5, teacher_ratio_primary: 26, years_schooling: 6.5, neet_rate: 28.0 },
   { code: 'BR', name: 'Brasilien', pisa_reading: 413, pisa_math: 379, pisa_science: 404, literacy: 93, enrollment_primary: 98, enrollment_secondary: 87, enrollment_tertiary: 55, spending_gdp: 6.3, teacher_ratio_primary: 20, years_schooling: 8.0, neet_rate: 23.0 },
   { code: 'MX', name: 'Mexiko', pisa_reading: 420, pisa_math: 409, pisa_science: 410, literacy: 95, enrollment_primary: 100, enrollment_secondary: 84, enrollment_tertiary: 40, spending_gdp: 4.3, teacher_ratio_primary: 27, years_schooling: 8.8, neet_rate: 18.2 },
   { code: 'ZA', name: 'Sydafrika', pisa_reading: null, pisa_math: null, pisa_science: null, literacy: 87, enrollment_primary: 99, enrollment_secondary: 95, enrollment_tertiary: 24, spending_gdp: 6.6, teacher_ratio_primary: 30, years_schooling: 10.2, neet_rate: 32.4 },
 ];
 
 // =============================================================================
 // INDEX CARD COMPONENT
 // =============================================================================
 
 interface IndexCardProps {
   index: EducationIndex;
   onSelect: () => void;
 }
 
 function IndexCard({ index, onSelect }: IndexCardProps) {
   return (
     <button
       onClick={onSelect}
       className="p-4 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left w-full"
     >
       <div className="flex items-start justify-between mb-2">
         <Badge variant="outline" className="font-mono text-xs">
           {index.code}
         </Badge>
         <span className="text-[10px] text-muted-foreground">{index.source}</span>
       </div>
       <div className="font-semibold text-sm mb-1">{index.name}</div>
       <div className="text-xs text-muted-foreground line-clamp-2 mb-3">
         {index.description}
       </div>
       <div className="flex items-center gap-2 text-[10px]">
         <span className="text-muted-foreground">TÄCKNING:</span>
         <Progress value={index.coverage} className="h-1.5 flex-1" />
         <span className="font-mono">{index.coverage}%</span>
       </div>
       <div className="text-[10px] text-muted-foreground mt-1">
         {index.yearRange} · {index.updateFrequency}
       </div>
     </button>
   );
 }
 
 // =============================================================================
 // INDEX DETAIL MODAL
 // =============================================================================
 
 interface IndexDetailProps {
   index: EducationIndex | null;
   onClose: () => void;
 }
 
 function IndexDetail({ index, onClose }: IndexDetailProps) {
   if (!index) return null;
 
   return (
     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
       <div className="bg-card border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
         <div className="p-4 border-b flex justify-between items-start">
           <div>
             <Badge variant="secondary" className="font-mono mb-2">{index.code}</Badge>
             <h2 className="text-lg font-bold">{index.fullName}</h2>
             <p className="text-sm text-muted-foreground">{index.description}</p>
           </div>
           <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
         </div>
         
         <div className="p-4 space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="p-3 rounded border bg-muted/30">
               <div className="text-xs text-muted-foreground font-mono">KÄLLA</div>
               <div className="font-medium">{index.source}</div>
               <a 
                 href={index.sourceUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-xs text-primary hover:underline"
               >
                 {index.sourceUrl}
               </a>
             </div>
             <div className="p-3 rounded border bg-muted/30">
               <div className="text-xs text-muted-foreground font-mono">SKALA</div>
               <div className="font-medium font-mono">{index.scale}</div>
             </div>
           </div>
 
           <div className="p-3 rounded border bg-muted/30">
             <div className="text-xs text-muted-foreground font-mono mb-1">METODIK</div>
             <div className="text-sm">{index.methodology}</div>
           </div>
 
           <div className="grid grid-cols-3 gap-3">
             <div className="p-3 rounded border bg-muted/30 text-center">
               <div className="text-xl font-bold font-mono">{index.coverage}%</div>
               <div className="text-xs text-muted-foreground">TÄCKNING</div>
             </div>
             <div className="p-3 rounded border bg-muted/30 text-center">
               <div className="text-sm font-bold font-mono">{index.yearRange}</div>
               <div className="text-xs text-muted-foreground">PERIOD</div>
             </div>
             <div className="p-3 rounded border bg-muted/30 text-center">
               <div className="text-sm font-bold">{index.updateFrequency}</div>
               <div className="text-xs text-muted-foreground">UPPDATERING</div>
             </div>
           </div>
 
           {index.categories && (
             <div className="p-3 rounded border bg-muted/30">
               <div className="text-xs text-muted-foreground font-mono mb-2">DELINDEX</div>
               <div className="flex flex-wrap gap-2">
                 {index.categories.map((cat) => (
                   <Badge key={cat} variant="outline">{cat}</Badge>
                 ))}
               </div>
             </div>
           )}
 
           <div className="flex gap-2">
             <Button className="flex-1 font-mono" size="sm">
               VISA DATA →
             </Button>
             <Button variant="outline" className="font-mono" size="sm">
               JÄMFÖR LÄNDER
             </Button>
           </div>
         </div>
       </div>
     </div>
   );
 }
 
 // =============================================================================
 // COUNTRY COMPARISON TABLE
 // =============================================================================
 
 function CountryComparisonTable() {
   const [sortBy, setSortBy] = useState<keyof CountryEducationData>('pisa_math');
   const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
 
   const sortedData = [...COUNTRY_EDUCATION_DATA].sort((a, b) => {
     const aVal = a[sortBy];
     const bVal = b[sortBy];
     if (aVal === null) return 1;
     if (bVal === null) return -1;
     return sortDir === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
   });
 
   const handleSort = (key: keyof CountryEducationData) => {
     if (sortBy === key) {
       setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
       setSortBy(key);
       setSortDir('desc');
     }
   };
 
   return (
     <div className="border rounded-lg overflow-hidden">
       <ScrollArea className="w-full">
         <table className="w-full text-xs">
           <thead className="bg-muted/50 border-b">
             <tr>
               <th className="p-2 text-left font-mono">LAND</th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('pisa_reading')}
               >
                 PISA LÄS {sortBy === 'pisa_reading' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('pisa_math')}
               >
                 PISA MAT {sortBy === 'pisa_math' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('pisa_science')}
               >
                 PISA NO {sortBy === 'pisa_science' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('literacy')}
               >
                 LÄSK. {sortBy === 'literacy' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('enrollment_tertiary')}
               >
                 HÖGSK. {sortBy === 'enrollment_tertiary' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('spending_gdp')}
               >
                 UTG.% {sortBy === 'spending_gdp' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
               <th 
                 className="p-2 text-right font-mono cursor-pointer hover:bg-muted"
                 onClick={() => handleSort('teacher_ratio_primary')}
               >
                 E/L {sortBy === 'teacher_ratio_primary' && (sortDir === 'desc' ? '↓' : '↑')}
               </th>
             </tr>
           </thead>
           <tbody>
             {sortedData.map((country, i) => (
               <tr 
                 key={country.code} 
                 className={`border-b hover:bg-muted/30 cursor-pointer ${i % 2 === 0 ? 'bg-muted/10' : ''}`}
               >
                 <td className="p-2 font-medium">
                   <span className="font-mono text-muted-foreground mr-1">{country.code}</span>
                   {country.name}
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.pisa_reading ?? '—'}
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.pisa_math ?? '—'}
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.pisa_science ?? '—'}
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.literacy}%
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.enrollment_tertiary}%
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.spending_gdp}%
                 </td>
                 <td className="p-2 text-right font-mono">
                   {country.teacher_ratio_primary}:1
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </ScrollArea>
     </div>
   );
 }
 
 // =============================================================================
 // EDUCATION SCORECARD
 // =============================================================================
 
 interface ScorecardProps {
   country: CountryEducationData;
 }
 
 function EducationScorecard({ country }: ScorecardProps) {
   const pisaAvg = country.pisa_reading && country.pisa_math && country.pisa_science
     ? Math.round((country.pisa_reading + country.pisa_math + country.pisa_science) / 3)
     : null;
 
   const getScoreColor = (score: number | null, baseline: number = 500) => {
     if (score === null) return 'text-muted-foreground';
     if (score >= baseline + 30) return 'text-green-500';
     if (score >= baseline - 30) return 'text-foreground';
     return 'text-red-500';
   };
 
   return (
     <Card>
       <CardHeader className="pb-2">
         <CardTitle className="flex items-center gap-2 text-lg">
           <Badge variant="outline" className="font-mono">{country.code}</Badge>
           {country.name}
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         {/* PISA scores */}
         <div className="p-3 rounded border bg-muted/30">
           <div className="text-xs text-muted-foreground font-mono mb-2">PISA 2022</div>
           <div className="grid grid-cols-4 gap-2 text-center">
             <div>
               <div className={`text-lg font-bold font-mono ${getScoreColor(country.pisa_reading)}`}>
                 {country.pisa_reading ?? '—'}
               </div>
               <div className="text-[10px] text-muted-foreground">LÄSNING</div>
             </div>
             <div>
               <div className={`text-lg font-bold font-mono ${getScoreColor(country.pisa_math)}`}>
                 {country.pisa_math ?? '—'}
               </div>
               <div className="text-[10px] text-muted-foreground">MATEMATIK</div>
             </div>
             <div>
               <div className={`text-lg font-bold font-mono ${getScoreColor(country.pisa_science)}`}>
                 {country.pisa_science ?? '—'}
               </div>
               <div className="text-[10px] text-muted-foreground">NO</div>
             </div>
             <div>
               <div className={`text-lg font-bold font-mono ${getScoreColor(pisaAvg)}`}>
                 {pisaAvg ?? '—'}
               </div>
               <div className="text-[10px] text-muted-foreground">SNITT</div>
             </div>
           </div>
         </div>
 
         {/* Enrollment */}
         <div className="grid grid-cols-3 gap-2">
           <div className="p-2 rounded border text-center">
             <div className="text-sm font-bold">{country.enrollment_primary}%</div>
             <div className="text-[10px] text-muted-foreground">GRUNDSKOLA</div>
           </div>
           <div className="p-2 rounded border text-center">
             <div className="text-sm font-bold">{country.enrollment_secondary}%</div>
             <div className="text-[10px] text-muted-foreground">GYMNASIUM</div>
           </div>
           <div className="p-2 rounded border text-center">
             <div className="text-sm font-bold">{country.enrollment_tertiary}%</div>
             <div className="text-[10px] text-muted-foreground">UNIVERSITET</div>
           </div>
         </div>
 
         {/* Other metrics */}
         <div className="grid grid-cols-2 gap-2 text-xs">
           <div className="flex justify-between p-2 rounded bg-muted/20">
             <span className="text-muted-foreground">Utbildningsutgifter</span>
             <span className="font-mono font-bold">{country.spending_gdp}% BNP</span>
           </div>
           <div className="flex justify-between p-2 rounded bg-muted/20">
             <span className="text-muted-foreground">Elever/lärare</span>
             <span className="font-mono font-bold">{country.teacher_ratio_primary}:1</span>
           </div>
           <div className="flex justify-between p-2 rounded bg-muted/20">
             <span className="text-muted-foreground">Läskunnighet</span>
             <span className="font-mono font-bold">{country.literacy}%</span>
           </div>
           <div className="flex justify-between p-2 rounded bg-muted/20">
             <span className="text-muted-foreground">Skolår (snitt)</span>
             <span className="font-mono font-bold">{country.years_schooling} år</span>
           </div>
         </div>
 
         {country.neet_rate !== null && (
           <div className="p-2 rounded border bg-orange-500/10 border-orange-500/30 text-center">
             <div className="text-sm font-bold text-orange-500">{country.neet_rate}%</div>
             <div className="text-[10px] text-muted-foreground">NEET (15–29 år utan jobb/studier)</div>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }
 
 // =============================================================================
 // MAIN EDUCATION PAGE
 // =============================================================================
 
 export default function EducationPage() {
   const [selectedIndex, setSelectedIndex] = useState<EducationIndex | null>(null);
   const [selectedCountry, setSelectedCountry] = useState<string>('SE');
   const [activeTab, setActiveTab] = useState('overview');
 
   const countryData = COUNTRY_EDUCATION_DATA.find(c => c.code === selectedCountry);
 
   return (
     <div className="bg-background">
       {/* Header */}
       <div className="border-b border-border bg-muted/30 p-4">
         <div className="flex items-center justify-between mb-4">
           <div>
             <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
               <span>[EDU]</span>
               <span>UTBILDNING & SKOLA</span>
             </div>
             <h1 className="text-2xl font-bold">Utbildningsdata</h1>
             <p className="text-sm text-muted-foreground mt-1">
               Samlad statistik för skola, utbildning och kompetens
             </p>
           </div>
           <div className="flex items-center gap-2">
             <Select value={selectedCountry} onValueChange={setSelectedCountry}>
               <SelectTrigger className="w-48 font-mono">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {COUNTRY_EDUCATION_DATA.map(c => (
                   <SelectItem key={c.code} value={c.code} className="font-mono">
                     {c.code} – {c.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
 
         {/* Quick stats */}
         <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
           <div className="p-3 rounded border bg-card text-center">
             <div className="text-2xl font-bold font-mono">{EDUCATION_INDICES.length}</div>
             <div className="text-xs text-muted-foreground">INDEX</div>
           </div>
           <div className="p-3 rounded border bg-card text-center">
             <div className="text-2xl font-bold font-mono">{COUNTRY_EDUCATION_DATA.length}</div>
             <div className="text-xs text-muted-foreground">LÄNDER</div>
           </div>
           <div className="p-3 rounded border bg-card text-center">
             <div className="text-2xl font-bold font-mono">1950–2024</div>
             <div className="text-xs text-muted-foreground">PERIOD</div>
           </div>
           <div className="p-3 rounded border bg-card text-center">
             <div className="text-2xl font-bold font-mono">47</div>
             <div className="text-xs text-muted-foreground">DATAKÄLLOR</div>
           </div>
           <div className="p-3 rounded border bg-card text-center">
             <div className="text-2xl font-bold font-mono">78%</div>
             <div className="text-xs text-muted-foreground">GLOBAL TÄCKNING</div>
           </div>
         </div>
       </div>
 
       {/* Tabs */}
       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <div className="border-b border-border px-4">
           <TabsList className="bg-transparent h-auto p-0 gap-0">
             <TabsTrigger 
               value="overview" 
               className="font-mono text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
             >
               [ÖVERSIKT]
             </TabsTrigger>
             <TabsTrigger 
               value="indices" 
               className="font-mono text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
             >
               [INDEX]
             </TabsTrigger>
             <TabsTrigger 
               value="compare" 
               className="font-mono text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
             >
               [JÄMFÖR]
             </TabsTrigger>
             <TabsTrigger 
               value="pisa" 
               className="font-mono text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
             >
               [PISA]
             </TabsTrigger>
             <TabsTrigger 
               value="tools" 
               className="font-mono text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
             >
               [VERKTYG]
             </TabsTrigger>
           </TabsList>
         </div>
 
         {/* Overview Tab */}
         <TabsContent value="overview" className="p-4 space-y-6">
           {countryData && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <EducationScorecard country={countryData} />
               
               <Card>
                 <CardHeader className="pb-2">
                   <CardTitle className="text-lg">Populära index</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-2 gap-3">
                   {EDUCATION_INDICES.slice(0, 6).map(idx => (
                     <button
                       key={idx.code}
                       onClick={() => setSelectedIndex(idx)}
                       className="p-3 rounded border bg-muted/20 hover:bg-muted/40 text-left transition-all"
                     >
                       <Badge variant="outline" className="font-mono text-[10px] mb-1">
                         {idx.code}
                       </Badge>
                       <div className="text-sm font-medium">{idx.name}</div>
                       <div className="text-xs text-muted-foreground">{idx.source}</div>
                     </button>
                   ))}
                 </CardContent>
               </Card>
             </div>
           )}
         </TabsContent>
 
         {/* Indices Tab */}
         <TabsContent value="indices" className="p-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {EDUCATION_INDICES.map(idx => (
               <IndexCard 
                 key={idx.code} 
                 index={idx} 
                 onSelect={() => setSelectedIndex(idx)}
               />
             ))}
           </div>
         </TabsContent>
 
         {/* Compare Tab */}
         <TabsContent value="compare" className="p-4">
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <h2 className="font-mono font-bold">LANDSJÄMFÖRELSE</h2>
               <Badge variant="outline" className="font-mono">
                 {COUNTRY_EDUCATION_DATA.length} LÄNDER
               </Badge>
             </div>
             <CountryComparisonTable />
             <div className="text-xs text-muted-foreground text-center">
               Klicka på kolumnrubriker för att sortera. E/L = Elever per lärare.
             </div>
           </div>
         </TabsContent>
 
         {/* PISA Tab */}
         <TabsContent value="pisa" className="p-4 space-y-4">
           <div className="p-4 rounded-lg border bg-card">
             <div className="flex items-center gap-3 mb-4">
               <Badge className="font-mono">PISA 2022</Badge>
               <span className="text-sm text-muted-foreground">
                 Programme for International Student Assessment
               </span>
             </div>
             <p className="text-sm mb-4">
               PISA mäter 15-åringars kunskaper och färdigheter i läsförståelse, matematik 
               och naturvetenskap. Testet genomförs vart tredje år av OECD.
             </p>
 
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {['Läsförståelse', 'Matematik', 'Naturvetenskap'].map((subject, i) => {
                 const key = ['pisa_reading', 'pisa_math', 'pisa_science'][i] as keyof CountryEducationData;
                 const sorted = [...COUNTRY_EDUCATION_DATA]
                   .filter(c => c[key] !== null)
                   .sort((a, b) => (b[key] as number) - (a[key] as number))
                   .slice(0, 5);
 
                 return (
                   <div key={subject} className="p-4 rounded border bg-muted/20">
                     <div className="font-mono text-xs text-muted-foreground mb-2">{subject.toUpperCase()}</div>
                     <div className="space-y-2">
                       {sorted.map((c, rank) => (
                         <div key={c.code} className="flex items-center justify-between text-sm">
                           <span>
                             <span className="font-mono text-muted-foreground mr-2">{rank + 1}.</span>
                             {c.name}
                           </span>
                           <span className="font-mono font-bold">{c[key]}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
 
           <div className="text-xs text-muted-foreground">
             <strong>Not:</strong> PISA-poäng centreras kring 500 med standardavvikelse 100. 
             Snittpoäng för OECD-länder är ~500.
           </div>
         </TabsContent>
 
         {/* Tools Tab */}
         <TabsContent value="tools" className="p-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <Card className="hover:border-primary transition-all cursor-pointer">
               <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                   <span className="font-mono text-primary">[→]</span>
                   Skolsystemjämförare
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground">
                 Jämför skolsystem mellan länder: struktur, finansiering, 
                 lärarutbildning och resultat.
               </CardContent>
             </Card>
 
             <Card className="hover:border-primary transition-all cursor-pointer">
               <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                   <span className="font-mono text-primary">[→]</span>
                   Utbildningsinvestering
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground">
                 Analysera sambandet mellan utbildningsutgifter och 
                 elevresultat över tid.
               </CardContent>
             </Card>
 
             <Card className="hover:border-primary transition-all cursor-pointer">
               <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                   <span className="font-mono text-primary">[→]</span>
                   Kompetensradar
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground">
                 Visualisera länders kompetensprofil: akademisk, 
                 yrkesinriktad och digital.
               </CardContent>
             </Card>
 
             <Card className="hover:border-primary transition-all cursor-pointer">
               <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                   <span className="font-mono text-primary">[→]</span>
                   Lärarstatistik
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground">
                 Utforska lärardata: löner, utbildning, arbetsbelastning 
                 och pensionsålder.
               </CardContent>
             </Card>
 
             <Card className="hover:border-primary transition-all cursor-pointer">
               <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                   <span className="font-mono text-primary">[→]</span>
                   Utbildning & arbetsmarknad
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground">
                 Koppla utbildningsnivå till sysselsättning, löner 
                 och kompetensmatchning.
               </CardContent>
             </Card>
 
             <Card className="hover:border-primary transition-all cursor-pointer">
               <CardHeader>
                 <CardTitle className="text-base flex items-center gap-2">
                   <span className="font-mono text-primary">[→]</span>
                   Historisk analys
                 </CardTitle>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground">
                 Utforska utbildningstrender från 1950 till idag 
                 med politisk kontext.
               </CardContent>
             </Card>
           </div>
         </TabsContent>
       </Tabs>
 
       {/* Index Detail Modal */}
       <IndexDetail 
         index={selectedIndex} 
         onClose={() => setSelectedIndex(null)} 
       />
     </div>
   );
 }