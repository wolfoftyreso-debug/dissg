/**
 * STRIM Seed Data: Legal
 * 
 * Narkotikalagstiftning och Alkohollagen.
 */

import type { ValidatedLegal } from '../validation';

const NOW = new Date().toISOString();

export const SEED_LEGAL: ValidatedLegal[] = [
  // ==========================================================================
  // NARKOTIKALAGSTIFTNING (SVENSK)
  // ==========================================================================
  {
    canonical_slug: 'narkotikalagstiftning',
    name_sv: 'Svensk narkotikalagstiftning',
    name_en: 'Swedish Narcotic Drugs Legislation',
    
    sfs_number: 'SFS 1968:64',
    jurisdiction: 'SE',
    jurisdiction_level: 'national',
    
    purpose: 'Reglering av narkotika i Sverige syftar till att begränsa tillgång till substanser klassade som narkotika enligt Läkemedelsverkets förteckningar. Lagstiftningen omfattar produktion, distribution, innehav och användning.',
    
    valid_from: '1968-01-01',
    is_current: true,
    
    amendments: [
      {
        date: '1968-04-01',
        description: 'Narkotikastrafflagen (1968:64) träder i kraft.',
        sfs_reference: 'SFS 1968:64',
      },
      {
        date: '1988-07-01',
        description: 'Kriminalisering av eget bruk av narkotika införs.',
        sfs_reference: 'SFS 1988:286',
      },
      {
        date: '1993-07-01',
        description: 'Straffskärpning för narkotikabrott.',
        sfs_reference: 'SFS 1993:211',
      },
      {
        date: '2023-06-01',
        description: 'Utökad kriminalisering av narkotikakonsumtion.',
        sfs_reference: 'SFS 2023:234',
      },
    ],
    
    impact: {
      healthcare: 'Narkotikaklassificering avgör läkemedels tillgänglighet och förskrivningsrutiner. LARO-läkemedel omfattas av särskilda regler.',
      access: 'Tillgång till narkotikaklassade läkemedel kräver recept och för vissa substanser särskild licens.',
      society: 'Kriminalisering av eget bruk påverkar persons kontakt med rättsväsendet. Debatt om avkriminalisering pågår.',
    },
    
    summary: 'Svensk narkotikalagstiftning bygger primärt på Narkotikastrafflagen (1968:64) och Lag om kontroll av narkotika (1992:860). Substanser klassificeras som narkotika av Läkemedelsverket enligt fem förteckningar. Straffpåföljder varierar från böter till fängelse beroende på brottets svårighetsgrad (ringa, normalgraden, grovt). Sverige har sedan 1988 kriminaliserat eget bruk, vilket är ovanligt internationellt.',
    
    regulates_substances: ['heroin', 'fentanyl'],
    affects_treatments: ['laro'],
    
    sources: [
      {
        name: 'Riksdagen – Narkotikastrafflagen',
        url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/narkotikastrafflag-196864_sfs-1968-64/',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Läkemedelsverket – Narkotika',
        url: 'https://www.lakemedelsverket.se',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
    ],
    
    status: 'active',
    version: 1,
  },

  // ==========================================================================
  // ALKOHOLLAGEN
  // ==========================================================================
  {
    canonical_slug: 'alkohollagen',
    name_sv: 'Alkohollagen',
    name_en: 'Swedish Alcohol Act',
    
    sfs_number: 'SFS 2010:1622',
    jurisdiction: 'SE',
    jurisdiction_level: 'national',
    
    purpose: 'Alkohollagen syftar till att begränsa alkoholens skadeverkningar genom reglering av tillverkning, försäljning och servering av alkoholdrycker. Lagen fastställer Systembolagets detaljhandelsmonopol och åldersgränser.',
    
    valid_from: '2011-01-01',
    is_current: true,
    
    amendments: [
      {
        date: '2011-01-01',
        description: 'Ny samlad alkohollag träder i kraft, ersätter tidigare lagstiftning.',
        sfs_reference: 'SFS 2010:1622',
      },
      {
        date: '2015-01-01',
        description: 'Ändringar avseende serveringstillstånd.',
      },
      {
        date: '2020-07-01',
        description: 'Tillfälliga lättnader för takeaway av alkohol under pandemin.',
      },
    ],
    
    impact: {
      healthcare: 'Alkoholmonopolet och prissättning påverkar konsumtionsnivåer, vilket har folkhälsokonsekvenser.',
      access: 'Detaljhandel med alkohol över 3,5% begränsas till Systembolaget. Åldersgräns 20 år för köp i butik, 18 år för servering.',
      society: 'Reglering av serveringstider och marknadsföringsförbud påverkar alkoholkulturen.',
    },
    
    summary: 'Alkohollagen (2010:1622) reglerar all hantering av alkoholdrycker i Sverige. Lagen upprätthåller Systembolagets monopol på detaljhandel med drycker över 3,5 volymprocent alkohol, sätter åldersgränser för inköp och servering, reglerar tillstånd för tillverkning och servering, och förbjuder viss marknadsföring. Lagen balanserar folkhälsointressen mot konsumenträttigheter och EU-rättsliga krav.',
    
    regulates_substances: ['alkohol'],
    affects_treatments: [],
    
    sources: [
      {
        name: 'Riksdagen – Alkohollag (2010:1622)',
        url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/alkohollag-20101622_sfs-2010-1622/',
        retrieved_at: NOW,
        type: 'primary',
        organization_type: 'government',
      },
      {
        name: 'Folkhälsomyndigheten – Alkohollagens syfte',
        url: 'https://www.folkhalsomyndigheten.se',
        retrieved_at: NOW,
        type: 'secondary',
        organization_type: 'government',
      },
    ],
    
    status: 'active',
    version: 1,
  },
];

export default SEED_LEGAL;
