/**
 * SUB-INDEX DETAIL VIEW
 * 
 * Pedagogical breakdown of a sub-index, designed for comprehension by a 12-year-old.
 * Shows: what it measures, how it works, country rankings, and a visual scale.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// =============================================================================
// SUB-INDEX DATA
// =============================================================================

interface SubIndexInfo {
  name: string;
  parentCode: string;
  emoji: string;
  whatIsIt: string;
  howItWorks: string;
  whyItMatters: string;
  funFact: string;
  scale: { min: number; max: number; unit: string };
  countries: { code: string; name: string; score: number; flag: string }[];
  globalAverage: number;
}

const SUB_INDEX_DATABASE: Record<string, Record<string, SubIndexInfo>> = {
  PISA: {
    'Läsförståelse': {
      name: 'Läsförståelse',
      parentCode: 'PISA',
      emoji: '📖',
      whatIsIt: 'Det här mäter hur bra 15-åringar är på att läsa och förstå texter. Inte bara att kunna läsa orden – utan att verkligen förstå vad texten menar, kunna hitta information och dra egna slutsatser.',
      howItWorks: 'Elever i hela världen får läsa texter och svara på frågor. Det kan vara allt från nyhetsartiklar till instruktioner. Poängen visar hur bra man förstår det man läser.',
      whyItMatters: 'Att kunna läsa och förstå text är grunden för nästan allt man gör i skolan, på jobbet och i livet. Den som inte förstår vad hen läser har svårare att lära sig andra saker.',
      funFact: 'I PISA-testet 2022 fick elever bland annat läsa om klimatförändringar och sociala medier – saker som berör ungdomar direkt.',
      scale: { min: 0, max: 700, unit: 'poäng' },
      countries: [
        { code: 'SG', name: 'Singapore', score: 549, flag: '🇸🇬' },
        { code: 'IE', name: 'Irland', score: 516, flag: '🇮🇪' },
        { code: 'JP', name: 'Japan', score: 516, flag: '🇯🇵' },
        { code: 'KR', name: 'Sydkorea', score: 514, flag: '🇰🇷' },
        { code: 'EE', name: 'Estland', score: 511, flag: '🇪🇪' },
        { code: 'SE', name: 'Sverige', score: 506, flag: '🇸🇪' },
        { code: 'CA', name: 'Kanada', score: 507, flag: '🇨🇦' },
        { code: 'US', name: 'USA', score: 505, flag: '🇺🇸' },
        { code: 'FI', name: 'Finland', score: 520, flag: '🇫🇮' },
        { code: 'DE', name: 'Tyskland', score: 498, flag: '🇩🇪' },
        { code: 'FR', name: 'Frankrike', score: 474, flag: '🇫🇷' },
        { code: 'BR', name: 'Brasilien', score: 413, flag: '🇧🇷' },
        { code: 'MX', name: 'Mexiko', score: 420, flag: '🇲🇽' },
        { code: 'ID', name: 'Indonesien', score: 359, flag: '🇮🇩' },
        { code: 'PH', name: 'Filippinerna', score: 340, flag: '🇵🇭' },
      ],
      globalAverage: 476,
    },
    'Matematik': {
      name: 'Matematik',
      parentCode: 'PISA',
      emoji: '🔢',
      whatIsIt: 'Det här mäter hur bra 15-åringar är på matematik – inte bara att räkna, utan att använda matte för att lösa verkliga problem. Kan du räkna ut hur mycket pizza varje person får? Det är den typen av tänkande.',
      howItWorks: 'Eleverna får matteproblem som handlar om vardagssituationer. Det kan vara att tolka diagram, räkna ut priser eller förstå statistik. Man behöver inte kunna svåra formler – det handlar om att tänka logiskt.',
      whyItMatters: 'Matematik finns överallt: i din mobil, i ekonomin, i medicin. Länder där ungdomar är bra på matte har oftast starkare ekonomier och mer innovation.',
      funFact: 'Singapore har toppat PISA-matten flera gånger. En anledning: de lär ut matte med bilder och block redan från tidig ålder, så barnen "ser" matematiken.',
      scale: { min: 0, max: 700, unit: 'poäng' },
      countries: [
        { code: 'SG', name: 'Singapore', score: 569, flag: '🇸🇬' },
        { code: 'TW', name: 'Taiwan', score: 547, flag: '🇹🇼' },
        { code: 'JP', name: 'Japan', score: 536, flag: '🇯🇵' },
        { code: 'KR', name: 'Sydkorea', score: 527, flag: '🇰🇷' },
        { code: 'EE', name: 'Estland', score: 510, flag: '🇪🇪' },
        { code: 'CH', name: 'Schweiz', score: 508, flag: '🇨🇭' },
        { code: 'DK', name: 'Danmark', score: 509, flag: '🇩🇰' },
        { code: 'SE', name: 'Sverige', score: 502, flag: '🇸🇪' },
        { code: 'FI', name: 'Finland', score: 507, flag: '🇫🇮' },
        { code: 'DE', name: 'Tyskland', score: 500, flag: '🇩🇪' },
        { code: 'US', name: 'USA', score: 478, flag: '🇺🇸' },
        { code: 'FR', name: 'Frankrike', score: 474, flag: '🇫🇷' },
        { code: 'BR', name: 'Brasilien', score: 379, flag: '🇧🇷' },
        { code: 'ID', name: 'Indonesien', score: 366, flag: '🇮🇩' },
        { code: 'PH', name: 'Filippinerna', score: 353, flag: '🇵🇭' },
      ],
      globalAverage: 472,
    },
    'Naturvetenskap': {
      name: 'Naturvetenskap',
      parentCode: 'PISA',
      emoji: '🔬',
      whatIsIt: 'Det här mäter hur bra 15-åringar förstår naturvetenskap – biologi, fysik och kemi. Kan du förklara varför det regnar? Eller varför vaccin fungerar? Det är den sortens kunskap som testas.',
      howItWorks: 'Eleverna läser om vetenskapliga fenomen och experiment, och måste sedan svara på frågor. Det handlar inte om att memorera fakta, utan om att förstå hur vetenskap fungerar och kunna tänka kritiskt.',
      whyItMatters: 'Vi lever i en värld full av vetenskapliga utmaningar – klimatförändringar, pandemier, ny teknik. Medborgare som förstår vetenskap kan fatta bättre beslut för sig själva och samhället.',
      funFact: 'I PISA:s NO-test 2022 fick elever bland annat analysera experiment om vattenrening – kunskap som kan rädda liv i delar av världen utan rent vatten.',
      scale: { min: 0, max: 700, unit: 'poäng' },
      countries: [
        { code: 'SG', name: 'Singapore', score: 551, flag: '🇸🇬' },
        { code: 'JP', name: 'Japan', score: 529, flag: '🇯🇵' },
        { code: 'EE', name: 'Estland', score: 526, flag: '🇪🇪' },
        { code: 'FI', name: 'Finland', score: 522, flag: '🇫🇮' },
        { code: 'KR', name: 'Sydkorea', score: 519, flag: '🇰🇷' },
        { code: 'CA', name: 'Kanada', score: 515, flag: '🇨🇦' },
        { code: 'IE', name: 'Irland', score: 504, flag: '🇮🇪' },
        { code: 'DE', name: 'Tyskland', score: 503, flag: '🇩🇪' },
        { code: 'US', name: 'USA', score: 502, flag: '🇺🇸' },
        { code: 'SE', name: 'Sverige', score: 499, flag: '🇸🇪' },
        { code: 'FR', name: 'Frankrike', score: 487, flag: '🇫🇷' },
        { code: 'BR', name: 'Brasilien', score: 404, flag: '🇧🇷' },
        { code: 'MX', name: 'Mexiko', score: 410, flag: '🇲🇽' },
        { code: 'ID', name: 'Indonesien', score: 383, flag: '🇮🇩' },
        { code: 'PH', name: 'Filippinerna', score: 356, flag: '🇵🇭' },
      ],
      globalAverage: 485,
    },
  },
  TIMSS: {
    'Matematik': {
      name: 'Matematik',
      parentCode: 'TIMSS',
      emoji: '🧮',
      whatIsIt: 'TIMSS testar hur bra elever i årskurs 4 och 8 är på matematik. Till skillnad från PISA fokuserar TIMSS mer på vad som faktiskt lärs ut i skolan.',
      howItWorks: 'Elever gör ett matteprov som är kopplat till vad de borde ha lärt sig i skolan. Det testar saker som tal, algebra, geometri och statistik.',
      whyItMatters: 'TIMSS visar om skolor lyckas lära ut den matte som finns i läroplanen. Det hjälper länder att förbättra sin undervisning.',
      funFact: 'Singapore har legat i topp på TIMSS sedan 1995 – de har ett helt undervisningssystem byggt kring visuell matematik.',
      scale: { min: 0, max: 700, unit: 'poäng' },
      countries: [
        { code: 'SG', name: 'Singapore', score: 611, flag: '🇸🇬' },
        { code: 'KR', name: 'Sydkorea', score: 594, flag: '🇰🇷' },
        { code: 'JP', name: 'Japan', score: 593, flag: '🇯🇵' },
        { code: 'SE', name: 'Sverige', score: 521, flag: '🇸🇪' },
        { code: 'FI', name: 'Finland', score: 520, flag: '🇫🇮' },
        { code: 'US', name: 'USA', score: 535, flag: '🇺🇸' },
        { code: 'GB', name: 'Storbritannien', score: 524, flag: '🇬🇧' },
        { code: 'ZA', name: 'Sydafrika', score: 372, flag: '🇿🇦' },
      ],
      globalAverage: 503,
    },
    'Naturvetenskap': {
      name: 'Naturvetenskap',
      parentCode: 'TIMSS',
      emoji: '🧪',
      whatIsIt: 'TIMSS NO-del testar hur bra elever i årskurs 4 och 8 förstår naturvetenskap – biologi, fysik, kemi och geovetenskap.',
      howItWorks: 'Eleverna svarar på frågor om naturvetenskapliga begrepp som de borde ha lärt sig i skolan. Det testar både fakta och förmågan att tillämpa kunskapen.',
      whyItMatters: 'Det visar om skolans NO-undervisning fungerar. Länder som presterar bra på TIMSS NO har ofta fler ungdomar som väljer naturvetenskapliga yrken.',
      funFact: 'Singapores elever i årskurs 4 presterar lika bra som genomsnittliga 8:or i många andra länder!',
      scale: { min: 0, max: 700, unit: 'poäng' },
      countries: [
        { code: 'SG', name: 'Singapore', score: 590, flag: '🇸🇬' },
        { code: 'KR', name: 'Sydkorea', score: 583, flag: '🇰🇷' },
        { code: 'JP', name: 'Japan', score: 570, flag: '🇯🇵' },
        { code: 'FI', name: 'Finland', score: 555, flag: '🇫🇮' },
        { code: 'SE', name: 'Sverige', score: 537, flag: '🇸🇪' },
        { code: 'US', name: 'USA', score: 539, flag: '🇺🇸' },
        { code: 'GB', name: 'Storbritannien', score: 537, flag: '🇬🇧' },
        { code: 'ZA', name: 'Sydafrika', score: 324, flag: '🇿🇦' },
      ],
      globalAverage: 494,
    },
  },
  ENROLLMENT: {
    'Förskola': {
      name: 'Förskola',
      parentCode: 'ENROLLMENT',
      emoji: '👶',
      whatIsIt: 'Andelen barn som går i förskola innan de börjar grundskolan. Förskolan lägger grunden för allt lärande som kommer efteråt.',
      howItWorks: 'Man räknar hur många barn i "rätt ålder" som faktiskt går i förskola, jämfört med alla barn i den åldern. Över 100% kan hända om äldre barn också går kvar.',
      whyItMatters: 'Forskning visar att barn som gått i förskola ofta klarar skolan bättre, får bättre jobb och mår bättre som vuxna. Det är en av de bästa investeringarna ett land kan göra.',
      funFact: 'I de nordiska länderna går nästan alla barn i förskola från 1 års ålder. I vissa länder börjar barnen inte skolan förrän vid 7 år – men de har ändå gått i förskola.',
      scale: { min: 0, max: 120, unit: '%' },
      countries: [
        { code: 'FR', name: 'Frankrike', score: 100, flag: '🇫🇷' },
        { code: 'SE', name: 'Sverige', score: 97, flag: '🇸🇪' },
        { code: 'DK', name: 'Danmark', score: 98, flag: '🇩🇰' },
        { code: 'DE', name: 'Tyskland', score: 95, flag: '🇩🇪' },
        { code: 'US', name: 'USA', score: 67, flag: '🇺🇸' },
        { code: 'IN', name: 'Indien', score: 32, flag: '🇮🇳' },
        { code: 'NG', name: 'Nigeria', score: 14, flag: '🇳🇬' },
      ],
      globalAverage: 62,
    },
    'Grundskola': {
      name: 'Grundskola',
      parentCode: 'ENROLLMENT',
      emoji: '🏫',
      whatIsIt: 'Andelen barn som går i grundskolan. I de flesta länder är grundskolan obligatorisk – alla barn SKA gå i skolan.',
      howItWorks: 'Man räknar hur många barn i grundskoleåldern som faktiskt går i skolan. Målet är 100%, men det uppnås inte överallt.',
      whyItMatters: 'Grundskolan ger barn läsning, matematik och grundläggande kunskap. Utan grundskola har man svårt att klara sig i samhället.',
      funFact: 'Globalt har vi gått från att bara hälften av alla barn gick i skolan 1950 till att nästan alla gör det idag – en av mänsklighetens största framgångar!',
      scale: { min: 0, max: 110, unit: '%' },
      countries: [
        { code: 'SE', name: 'Sverige', score: 100, flag: '🇸🇪' },
        { code: 'JP', name: 'Japan', score: 100, flag: '🇯🇵' },
        { code: 'DE', name: 'Tyskland', score: 100, flag: '🇩🇪' },
        { code: 'BR', name: 'Brasilien', score: 98, flag: '🇧🇷' },
        { code: 'IN', name: 'Indien', score: 100, flag: '🇮🇳' },
        { code: 'NG', name: 'Nigeria', score: 70, flag: '🇳🇬' },
        { code: 'ET', name: 'Etiopien', score: 88, flag: '🇪🇹' },
      ],
      globalAverage: 95,
    },
    'Gymnasium': {
      name: 'Gymnasium',
      parentCode: 'ENROLLMENT',
      emoji: '🎒',
      whatIsIt: 'Andelen ungdomar som går i gymnasium (eller motsvarande). Här börjar skillnaderna mellan länder bli stora.',
      howItWorks: 'Man mäter hur stor andel av ungdomar i "gymnasieåldern" som faktiskt studerar. I rika länder är det nästan alla, men i fattigare länder slutar många efter grundskolan.',
      whyItMatters: 'Gymnasiet förbereder unga för högre utbildning eller arbetslivet. Utan gymnasium har man färre möjligheter.',
      funFact: 'I Sydkorea går 99% av ungdomarna i gymnasium – och de pluggar i snitt 16 timmar om dagen under provperioder!',
      scale: { min: 0, max: 110, unit: '%' },
      countries: [
        { code: 'KR', name: 'Sydkorea', score: 99, flag: '🇰🇷' },
        { code: 'SE', name: 'Sverige', score: 99, flag: '🇸🇪' },
        { code: 'JP', name: 'Japan', score: 99, flag: '🇯🇵' },
        { code: 'US', name: 'USA', score: 96, flag: '🇺🇸' },
        { code: 'BR', name: 'Brasilien', score: 87, flag: '🇧🇷' },
        { code: 'IN', name: 'Indien', score: 74, flag: '🇮🇳' },
        { code: 'ET', name: 'Etiopien', score: 38, flag: '🇪🇹' },
      ],
      globalAverage: 77,
    },
    'Högre utbildning': {
      name: 'Högre utbildning',
      parentCode: 'ENROLLMENT',
      emoji: '🎓',
      whatIsIt: 'Andelen unga vuxna som studerar på universitet eller högskola. Det här är frivilligt – man väljer själv om man vill plugga vidare.',
      howItWorks: 'Man mäter hur stor andel av unga vuxna (vanligtvis 18-24 år) som studerar på högskolenivå. Siffran kan vara över 100% om äldre studenter räknas in.',
      whyItMatters: 'Högre utbildning ger ofta bättre jobb, högre lön och mer kunskap. Men det betyder inte att alla MÅSTE gå på universitet – yrkesprogram och andra vägar finns också.',
      funFact: 'Sydkorea har världens högsta andel unga i högre utbildning (95%), men också en av de högsta NEET-talen – många unga hittar inte jobb efter studierna.',
      scale: { min: 0, max: 150, unit: '%' },
      countries: [
        { code: 'GR', name: 'Grekland', score: 143, flag: '🇬🇷' },
        { code: 'AU', name: 'Australien', score: 116, flag: '🇦🇺' },
        { code: 'KR', name: 'Sydkorea', score: 95, flag: '🇰🇷' },
        { code: 'US', name: 'USA', score: 88, flag: '🇺🇸' },
        { code: 'SE', name: 'Sverige', score: 67, flag: '🇸🇪' },
        { code: 'CN', name: 'Kina', score: 58, flag: '🇨🇳' },
        { code: 'IN', name: 'Indien', score: 28, flag: '🇮🇳' },
        { code: 'ET', name: 'Etiopien', score: 8, flag: '🇪🇹' },
      ],
      globalAverage: 40,
    },
  },
  COMPLETION: {
    'Grundskola': {
      name: 'Grundskola',
      parentCode: 'COMPLETION',
      emoji: '✅',
      whatIsIt: 'Andelen vuxna som har gått klart hela grundskolan.',
      howItWorks: 'Man frågar vuxna vilken utbildning de har slutfört och räknar andelen med minst grundskola.',
      whyItMatters: 'Visar om ett lands utbildningssystem har nått hela befolkningen.',
      funFact: 'Idag har 90% av världens vuxna grundskoleutbildning – en fördubbling sedan 1960.',
      scale: { min: 0, max: 100, unit: '%' },
      countries: [
        { code: 'SE', name: 'Sverige', score: 99, flag: '🇸🇪' },
        { code: 'JP', name: 'Japan', score: 99, flag: '🇯🇵' },
        { code: 'BR', name: 'Brasilien', score: 75, flag: '🇧🇷' },
        { code: 'IN', name: 'Indien', score: 60, flag: '🇮🇳' },
      ],
      globalAverage: 86,
    },
    'Gymnasium': {
      name: 'Gymnasium',
      parentCode: 'COMPLETION',
      emoji: '📜',
      whatIsIt: 'Andelen vuxna som har fullföljt gymnasieutbildning eller motsvarande.',
      howItWorks: 'Baserat på folkräkningar och undersökningar om högsta avslutade utbildning.',
      whyItMatters: 'Gymnasiekompetens är ofta minimikravet på arbetsmarknaden i utvecklade länder.',
      funFact: 'I Kanada har 94% av vuxna gymnasieexamen – högst i världen.',
      scale: { min: 0, max: 100, unit: '%' },
      countries: [
        { code: 'CA', name: 'Kanada', score: 94, flag: '🇨🇦' },
        { code: 'SE', name: 'Sverige', score: 88, flag: '🇸🇪' },
        { code: 'DE', name: 'Tyskland', score: 87, flag: '🇩🇪' },
        { code: 'BR', name: 'Brasilien', score: 52, flag: '🇧🇷' },
        { code: 'IN', name: 'Indien', score: 35, flag: '🇮🇳' },
      ],
      globalAverage: 65,
    },
    'Universitet': {
      name: 'Universitet',
      parentCode: 'COMPLETION',
      emoji: '🏛️',
      whatIsIt: 'Andelen vuxna med universitets- eller högskoleexamen.',
      howItWorks: 'Baserat på andelen av befolkning 25+ med avslutad högre utbildning.',
      whyItMatters: 'Visar ett lands kunskapsbas och kapacitet för innovation och forskning.',
      funFact: 'I Sydkorea har andelen med universitetsexamen gått från 5% till 70% på bara 50 år.',
      scale: { min: 0, max: 80, unit: '%' },
      countries: [
        { code: 'CA', name: 'Kanada', score: 63, flag: '🇨🇦' },
        { code: 'JP', name: 'Japan', score: 55, flag: '🇯🇵' },
        { code: 'KR', name: 'Sydkorea', score: 52, flag: '🇰🇷' },
        { code: 'SE', name: 'Sverige', score: 45, flag: '🇸🇪' },
        { code: 'US', name: 'USA', score: 50, flag: '🇺🇸' },
        { code: 'BR', name: 'Brasilien', score: 18, flag: '🇧🇷' },
      ],
      globalAverage: 28,
    },
  },
  'TEACHER-RATIO': {
    'Grundskola': {
      name: 'Grundskola',
      parentCode: 'TEACHER-RATIO',
      emoji: '👩‍🏫',
      whatIsIt: 'Antal elever per lärare i grundskolan. Färre elever per lärare betyder ofta att varje barn får mer uppmärksamhet.',
      howItWorks: 'Man delar totalt antal elever med totalt antal lärare. OBS: detta är ett genomsnitt – verkligheten varierar mellan skolor.',
      whyItMatters: 'Forskning visar att mindre klasser kan hjälpa barn att lära sig bättre, särskilt de som har det svårast. Men en bra lärare i en stor klass kan vara bättre än en dålig lärare i en liten.',
      funFact: 'I Norge har man i snitt 10 elever per lärare – men i Rwanda kan det vara 58 elever i ett klassrum!',
      scale: { min: 0, max: 80, unit: 'elever/lärare' },
      countries: [
        { code: 'NO', name: 'Norge', score: 10, flag: '🇳🇴' },
        { code: 'SE', name: 'Sverige', score: 12, flag: '🇸🇪' },
        { code: 'DE', name: 'Tyskland', score: 15, flag: '🇩🇪' },
        { code: 'US', name: 'USA', score: 14, flag: '🇺🇸' },
        { code: 'BR', name: 'Brasilien', score: 20, flag: '🇧🇷' },
        { code: 'IN', name: 'Indien', score: 26, flag: '🇮🇳' },
        { code: 'RW', name: 'Rwanda', score: 58, flag: '🇷🇼' },
      ],
      globalAverage: 23,
    },
    'Gymnasium': {
      name: 'Gymnasium',
      parentCode: 'TEACHER-RATIO',
      emoji: '🧑‍🏫',
      whatIsIt: 'Antal elever per lärare på gymnasienivå.',
      howItWorks: 'Samma princip som grundskolan men för gymnasieelever. I många länder är kvoterna liknande.',
      whyItMatters: 'På gymnasiet blir ämnena svårare, så lärarstöd blir ännu viktigare. Stor spridning mellan länder.',
      funFact: 'I Finland har gymnasielärare ofta masterexamen i sitt ämne – och yrket är ett av de mest respekterade i landet.',
      scale: { min: 0, max: 60, unit: 'elever/lärare' },
      countries: [
        { code: 'NO', name: 'Norge', score: 9, flag: '🇳🇴' },
        { code: 'SE', name: 'Sverige', score: 12, flag: '🇸🇪' },
        { code: 'FI', name: 'Finland', score: 13, flag: '🇫🇮' },
        { code: 'US', name: 'USA', score: 15, flag: '🇺🇸' },
        { code: 'BR', name: 'Brasilien', score: 18, flag: '🇧🇷' },
        { code: 'IN', name: 'Indien', score: 30, flag: '🇮🇳' },
      ],
      globalAverage: 18,
    },
    'Högre utbildning': {
      name: 'Högre utbildning',
      parentCode: 'TEACHER-RATIO',
      emoji: '👨‍🎓',
      whatIsIt: 'Antal studenter per lärare/professor på universitetet.',
      howItWorks: 'Inkluderar alla studenter och all akademisk personal. Låga siffror innebär mer tid med professor.',
      whyItMatters: 'På universitetsnivå handlar det ofta om handledning och mentorskap – något som kräver tid och små grupper.',
      funFact: 'Vissa elituniversitet har ratios under 5:1, medan stora statliga universitet kan ha 30+.',
      scale: { min: 0, max: 50, unit: 'studenter/lärare' },
      countries: [
        { code: 'SE', name: 'Sverige', score: 12, flag: '🇸🇪' },
        { code: 'NO', name: 'Norge', score: 10, flag: '🇳🇴' },
        { code: 'US', name: 'USA', score: 16, flag: '🇺🇸' },
        { code: 'IN', name: 'Indien', score: 28, flag: '🇮🇳' },
      ],
      globalAverage: 17,
    },
  },
  'SKILLS-ADULT': {
    'Läsning': {
      name: 'Läsning',
      parentCode: 'SKILLS-ADULT',
      emoji: '📚',
      whatIsIt: 'Hur bra vuxna (16-65 år) är på att läsa och förstå text i vardagen – instruktioner, nyheter, avtal.',
      howItWorks: 'Vuxna gör ett läsprov med verkliga texter som de kan stöta på i vardagen eller på jobbet.',
      whyItMatters: 'Vuxna som har svårt att läsa missar ofta viktig information – allt från medicininstruktioner till anställningsavtal.',
      funFact: 'Japan har högst läskompetens bland vuxna – något som bidrar till landets höga produktivitet.',
      scale: { min: 0, max: 500, unit: 'poäng' },
      countries: [
        { code: 'JP', name: 'Japan', score: 296, flag: '🇯🇵' },
        { code: 'FI', name: 'Finland', score: 288, flag: '🇫🇮' },
        { code: 'SE', name: 'Sverige', score: 279, flag: '🇸🇪' },
        { code: 'NO', name: 'Norge', score: 278, flag: '🇳🇴' },
        { code: 'US', name: 'USA', score: 270, flag: '🇺🇸' },
        { code: 'DE', name: 'Tyskland', score: 270, flag: '🇩🇪' },
      ],
      globalAverage: 263,
    },
    'Räkning': {
      name: 'Räkning',
      parentCode: 'SKILLS-ADULT',
      emoji: '🧮',
      whatIsIt: 'Hur bra vuxna är på att använda matematik i vardagen – räkna ut priser, förstå statistik, läsa diagram.',
      howItWorks: 'Vuxna löser vardagliga matteproblem som att jämföra priser, beräkna procent eller tolka tabeller.',
      whyItMatters: 'Den som inte kan grundläggande matte har svårare att hantera sin ekonomi, förstå risker och navigera i samhället.',
      funFact: 'I Japan är vuxna bäst på räkning i världen – men japaner tycker själva inte att de är bra på matte!',
      scale: { min: 0, max: 500, unit: 'poäng' },
      countries: [
        { code: 'JP', name: 'Japan', score: 288, flag: '🇯🇵' },
        { code: 'FI', name: 'Finland', score: 282, flag: '🇫🇮' },
        { code: 'SE', name: 'Sverige', score: 279, flag: '🇸🇪' },
        { code: 'NO', name: 'Norge', score: 278, flag: '🇳🇴' },
        { code: 'DE', name: 'Tyskland', score: 272, flag: '🇩🇪' },
        { code: 'US', name: 'USA', score: 253, flag: '🇺🇸' },
      ],
      globalAverage: 263,
    },
    'Problemlösning': {
      name: 'Problemlösning',
      parentCode: 'SKILLS-ADULT',
      emoji: '🧩',
      whatIsIt: 'Hur bra vuxna är på att använda datorer och teknik för att lösa problem – söka information, jämföra alternativ, organisera data.',
      howItWorks: 'Vuxna får uppgifter vid en dator – t.ex. hitta billigaste flygbiljetten, sortera mejl eller tolka data i ett kalkylblad.',
      whyItMatters: 'I dagens digitala samhälle behöver man kunna använda teknik effektivt. Den som inte kan det riskerar att hamna utanför.',
      funFact: 'Sverige ligger i topp 5 på digital problemlösning – men 25% av svenska vuxna klarar inte ens de enklaste uppgifterna.',
      scale: { min: 0, max: 500, unit: 'poäng' },
      countries: [
        { code: 'JP', name: 'Japan', score: 294, flag: '🇯🇵' },
        { code: 'FI', name: 'Finland', score: 289, flag: '🇫🇮' },
        { code: 'SE', name: 'Sverige', score: 280, flag: '🇸🇪' },
        { code: 'NO', name: 'Norge', score: 275, flag: '🇳🇴' },
        { code: 'DE', name: 'Tyskland', score: 268, flag: '🇩🇪' },
        { code: 'US', name: 'USA', score: 265, flag: '🇺🇸' },
      ],
      globalAverage: 258,
    },
  },
};

// Fallback for any sub-index not explicitly in the database
function getGenericSubIndex(parentCode: string, categoryName: string): SubIndexInfo {
  return {
    name: categoryName,
    parentCode,
    emoji: '📊',
    whatIsIt: `"${categoryName}" är en delmätning inom ${parentCode}-indexet. Den fokuserar specifikt på ${categoryName.toLowerCase()}-aspekten av det som mäts.`,
    howItWorks: 'Data samlas in genom standardiserade metoder som är jämförbara mellan länder och över tid.',
    whyItMatters: `Genom att bryta ner indexet i delar som "${categoryName}" kan vi se exakt var styrkor och svagheter finns – istället för att bara titta på ett enda tal.`,
    funFact: 'Delindex hjälper forskare och beslutsfattare att förstå VAR problemen finns, inte bara ATT de finns.',
    scale: { min: 0, max: 100, unit: 'index' },
    countries: [],
    globalAverage: 50,
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

interface SubIndexDetailProps {
  parentCode: string;
  categoryName: string;
  onClose: () => void;
  onBack: () => void;
}

export function SubIndexDetail({ parentCode, categoryName, onClose, onBack }: SubIndexDetailProps) {
  const info = SUB_INDEX_DATABASE[parentCode]?.[categoryName] 
    ?? getGenericSubIndex(parentCode, categoryName);

  const sortedCountries = [...info.countries].sort((a, b) => {
    // For teacher ratio, lower is better
    if (parentCode === 'TEACHER-RATIO') return a.score - b.score;
    return b.score - a.score;
  });

  const lowerIsBetter = parentCode === 'TEACHER-RATIO';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-card border rounded-lg max-w-2xl w-full max-h-[85vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="font-mono text-xs">
              ← {info.parentCode}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.emoji}</span>
            <div>
              <Badge variant="outline" className="font-mono text-xs mb-1">{info.parentCode} / {info.name}</Badge>
              <h2 className="text-xl font-bold">{info.name}</h2>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* What is it? */}
          <div className="p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤔</span>
              <h3 className="font-bold text-sm">Vad mäter det här?</h3>
            </div>
            <p className="text-sm leading-relaxed">{info.whatIsIt}</p>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚙️</span>
              <h3 className="font-bold text-sm">Hur fungerar det?</h3>
            </div>
            <p className="text-sm leading-relaxed">{info.howItWorks}</p>
          </div>

          {/* Why it matters */}
          <div className="p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h3 className="font-bold text-sm">Varför är det viktigt?</h3>
            </div>
            <p className="text-sm leading-relaxed">{info.whyItMatters}</p>
          </div>

          {/* Fun fact */}
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌟</span>
              <h3 className="font-bold text-sm">Visste du att...</h3>
            </div>
            <p className="text-sm leading-relaxed italic">{info.funFact}</p>
          </div>

          {/* Country ranking */}
          {sortedCountries.length > 0 && (
            <div className="p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🏆</span>
                <h3 className="font-bold text-sm">Hur ligger länderna till?</h3>
              </div>
              
              {/* Global average line */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 px-2">
                <span className="font-mono">GLOBALT SNITT: {info.globalAverage} {info.scale.unit}</span>
                <span className="text-muted-foreground/60">|</span>
                <span>{lowerIsBetter ? 'Lägre = bättre' : 'Högre = bättre'}</span>
              </div>

              <div className="space-y-2">
                {sortedCountries.map((country, i) => {
                  const percentage = ((country.score - info.scale.min) / (info.scale.max - info.scale.min)) * 100;
                  const isAboveAvg = lowerIsBetter 
                    ? country.score <= info.globalAverage
                    : country.score >= info.globalAverage;
                  
                  return (
                    <div key={country.code} className="flex items-center gap-2">
                      <span className="w-5 text-xs text-muted-foreground font-mono text-right">{i + 1}.</span>
                      <span className="text-sm">{country.flag}</span>
                      <span className="w-28 text-sm truncate">{country.name}</span>
                      <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all ${isAboveAvg ? 'bg-emerald-500/70' : 'bg-amber-500/70'}`}
                          style={{ width: `${Math.min(Math.max(percentage, 3), 100)}%` }}
                        />
                        {/* Global avg marker */}
                        <div 
                          className="absolute top-0 h-full w-0.5 bg-foreground/40"
                          style={{ left: `${((info.globalAverage - info.scale.min) / (info.scale.max - info.scale.min)) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-sm font-mono font-bold">
                        {country.score} <span className="text-[10px] text-muted-foreground font-normal">{info.scale.unit}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t flex items-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span>{lowerIsBetter ? 'Under' : 'Över'} globalt snitt</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <span>{lowerIsBetter ? 'Över' : 'Under'} globalt snitt</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 bg-foreground/40" />
                  <span>Globalt snitt</span>
                </div>
              </div>
            </div>
          )}

          {/* Scale explanation */}
          <div className="p-3 rounded border bg-muted/10 text-xs text-muted-foreground">
            <span className="font-mono font-bold">SKALA:</span> {info.scale.min}–{info.scale.max} {info.scale.unit}
            {' · '}{lowerIsBetter ? 'Lägre värde = bättre resultat' : 'Högre värde = bättre resultat'}
          </div>
        </div>
      </div>
    </div>
  );
}
