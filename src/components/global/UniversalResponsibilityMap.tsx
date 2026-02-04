/**
 * UNIVERSAL RESPONSIBILITY MAP
 * ═══════════════════════════════════════════════════════════════
 * 
 * Jurisdiktionsneutralt ramverk för att visualisera:
 * - Mänskliga behov (universella domäner)
 * - Geografisk nivå (global → lokal)
 * - Ansvarskoppling (vem kan påverka vad)
 * 
 * Följer CRM (Civilization Relevance Model) och perspektivhierarkin:
 * Civilisation → Världsdel → Nation → Region → System → Indikator
 * 
 * NO ICONS - text markers only per design doctrine.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// UNIVERSAL HUMAN NEEDS FRAMEWORK
// Based on fundamental requirements for human flourishing
// ═══════════════════════════════════════════════════════════════

interface UniversalIndicator {
  code: string;
  name: string;
  unit: string;
  description: string;
  dataAvailability: 'high' | 'medium' | 'low' | 'none';
}

interface GovernanceLevel {
  id: string;
  name: string;
  nameLocal?: Record<string, string>;
  description: string;
  marker: string;
  typicalActors: string[];
  jurisdictionExamples: string[];
}

interface HumanNeedDomain {
  id: string;
  code: string;
  name: string;
  nameLocal?: Record<string, string>;
  marker: string;
  color: string;
  description: string;
  universalIndicators: UniversalIndicator[];
  governanceLevels: {
    global: string[];
    continental: string[];
    national: string[];
    regional: string[];
    local: string[];
  };
}

// Governance levels - universal across all jurisdictions
// Using text markers instead of icons
const GOVERNANCE_LEVELS: GovernanceLevel[] = [
  {
    id: 'global',
    name: 'Global',
    description: 'International bodies, treaties, and cross-border coordination',
    marker: '[GLOBAL]',
    typicalActors: ['UN agencies', 'WHO', 'ILO', 'World Bank', 'IMF', 'WTO'],
    jurisdictionExamples: ['Paris Agreement', 'SDGs', 'IHR', 'Basel Accords']
  },
  {
    id: 'continental',
    name: 'Kontinental / Block',
    description: 'Regional economic and political unions',
    marker: '[KONT]',
    typicalActors: ['EU', 'AU', 'ASEAN', 'Mercosur', 'NAFTA/USMCA'],
    jurisdictionExamples: ['EU Directives', 'AU Protocols', 'ASEAN Framework']
  },
  {
    id: 'national',
    name: 'Nationell',
    description: 'Sovereign state legislation and policy',
    marker: '[NAT]',
    typicalActors: ['Parliament', 'Federal agencies', 'National ministries'],
    jurisdictionExamples: ['National constitution', 'Federal law', 'National budget']
  },
  {
    id: 'regional',
    name: 'Regional / Provinsiell',
    description: 'Sub-national administrative units',
    marker: '[REG]',
    typicalActors: ['States', 'Provinces', 'Länder', 'Regions', 'Counties'],
    jurisdictionExamples: ['State law', 'Regional planning', 'Provincial services']
  },
  {
    id: 'local',
    name: 'Lokal / Kommunal',
    description: 'Cities, municipalities, and communities',
    marker: '[LOK]',
    typicalActors: ['City councils', 'Mayors', 'Municipal agencies'],
    jurisdictionExamples: ['Zoning', 'Local services', 'Community programs']
  }
];

// Universal human needs domains - using text markers
const HUMAN_NEEDS_DOMAINS: HumanNeedDomain[] = [
  {
    id: 'life-health',
    code: 'LH',
    name: 'Liv & Hälsa',
    marker: 'Hälsa',
    color: 'bg-destructive/10 text-destructive border-destructive/30',
    description: 'Överlevnad, fysisk hälsa, psykiskt välbefinnande, sjukvårdstillgång',
    universalIndicators: [
      { code: 'LH01', name: 'Förväntad livslängd vid födsel', unit: 'år', description: 'Genomsnittliga år en nyfödd kan förväntas leva', dataAvailability: 'high' },
      { code: 'LH02', name: 'Frisk livslängd', unit: 'år', description: 'År levda i full hälsa', dataAvailability: 'medium' },
      { code: 'LH03', name: 'Spädbarnsdödlighet', unit: 'per 1 000', description: 'Dödsfall före 1 års ålder per 1 000 levande födda', dataAvailability: 'high' },
      { code: 'LH04', name: 'Mödradödlighet', unit: 'per 100 000', description: 'Mödradödsfall per 100 000 levande födda', dataAvailability: 'high' },
      { code: 'LH05', name: 'Sjukvårdstillgång', unit: 'index 0-100', description: 'Tillgång till grundläggande sjukvård', dataAvailability: 'medium' },
      { code: 'LH06', name: 'Psykisk ohälsa (behandlingsgap)', unit: '%', description: 'Obehandlade psykiska störningar', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['WHO-riktlinjer', 'IHR-efterlevnad', 'Pandemiberedskap'],
      continental: ['Regionala hälsoramverk', 'Gränsöverskridande hälsa', 'Gemensam upphandling'],
      national: ['Hälsosystemdesign', 'Universell täckning', 'Läkemedelsreglering'],
      regional: ['Sjukhusnätverk', 'Akutsjukvård', 'Folkhälsa'],
      local: ['Primärvård', 'Lokala kliniker', 'Förebyggande vård']
    }
  },
  {
    id: 'livelihood-work',
    code: 'LW',
    name: 'Försörjning & Arbete',
    marker: 'Arbete',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    description: 'Sysselsättning, inkomst, ekonomiskt deltagande, arbetsrätt',
    universalIndicators: [
      { code: 'LW01', name: 'Sysselsättningsgrad', unit: '%', description: 'Andel av befolkningen i arbetsför ålder som arbetar', dataAvailability: 'high' },
      { code: 'LW02', name: 'Ungdomsarbetslöshet', unit: '%', description: 'Arbetslösa 15-24 år', dataAvailability: 'high' },
      { code: 'LW03', name: 'Medianinkomst (PPP)', unit: 'USD/år', description: 'Köpkraftsjusterad medianinkomst', dataAvailability: 'medium' },
      { code: 'LW04', name: 'Fattigdom trots arbete', unit: '%', description: 'Arbetande under fattigdomsgränsen', dataAvailability: 'medium' },
      { code: 'LW05', name: 'Arbetskraftsdeltagande', unit: '%', description: 'Aktiv arbetskraftsandel', dataAvailability: 'high' },
      { code: 'LW06', name: 'Inkomstojämlikhet (Gini)', unit: 'index 0-1', description: 'Ojämlikhet i inkomstfördelning', dataAvailability: 'high' }
    ],
    governanceLevels: {
      global: ['ILO-standarder', 'Handelsavtal', 'Migrationsramverk'],
      continental: ['Arbetskraftsrörlighet', 'Minimistandarder', 'Socialförsäkringskoordinering'],
      national: ['Arbetsrätt', 'Minimilön', 'Socialförsäkring', 'Skattepolitik'],
      regional: ['Arbetsmarknadsprogram', 'Kompetensmatching', 'Regional utveckling'],
      local: ['Arbetsförmedlingar', 'Lokala arbetsgivare', 'Kommunal sysselsättning']
    }
  },
  {
    id: 'knowledge-skills',
    code: 'KS',
    name: 'Kunskap & Kompetens',
    marker: 'Utbildning',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    description: 'Utbildning, läskunnighet, kompetensutveckling, livslångt lärande',
    universalIndicators: [
      { code: 'KS01', name: 'Läskunnighet bland vuxna', unit: '%', description: 'Vuxna som kan läsa och skriva', dataAvailability: 'high' },
      { code: 'KS02', name: 'Genomsnittlig skolgång', unit: 'år', description: 'Genomsnittlig avslutad utbildning', dataAvailability: 'high' },
      { code: 'KS03', name: 'Förväntad skolgång', unit: 'år', description: 'År ett barn kan förväntas gå i skolan', dataAvailability: 'high' },
      { code: 'KS04', name: 'PISA-poäng (genomsnitt)', unit: 'poäng', description: 'Internationell elevbedömning', dataAvailability: 'medium' },
      { code: 'KS05', name: 'Högskoleinskrivning', unit: '%', description: 'Deltagande i högre utbildning', dataAvailability: 'high' },
      { code: 'KS06', name: 'Digital kompetens', unit: '%', description: 'Grundläggande digitala färdigheter', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['UNESCO-standarder', 'SDG 4-uppföljning', 'Erkännanderamverk'],
      continental: ['Bolognaprocessen', 'Kvalifikationsramverk', 'Studentmobilitet'],
      national: ['Läroplaner', 'Lärarcertifiering', 'Högskolesystem'],
      regional: ['Skolnätverk', 'Yrkesutbildning', 'Högre utbildning'],
      local: ['Skolverksamhet', 'Förskola', 'Vuxenutbildning']
    }
  },
  {
    id: 'safety-security',
    code: 'SS',
    name: 'Trygghet & Säkerhet',
    marker: 'Säkerhet',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    description: 'Fysisk säkerhet, rättsstat, konflikter, krisberedskap',
    universalIndicators: [
      { code: 'SS01', name: 'Mordfrekvens', unit: 'per 100 000', description: 'Avsiktliga mord', dataAvailability: 'high' },
      { code: 'SS02', name: 'Global Peace Index', unit: 'index 1-5', description: 'Övergripande fredlighet', dataAvailability: 'high' },
      { code: 'SS03', name: 'Rule of Law Index', unit: 'index 0-1', description: 'Rättssystemets styrka', dataAvailability: 'medium' },
      { code: 'SS04', name: 'Internflyktingar', unit: 'per 100 000', description: 'Internt fördrivna personer', dataAvailability: 'medium' },
      { code: 'SS05', name: 'Upplevd trygghet', unit: '%', description: 'Känner sig trygg att gå ut på natten', dataAvailability: 'medium' },
      { code: 'SS06', name: 'Katastrofberedskap', unit: 'index 0-100', description: 'Krishanteringskapacitet', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['FN-fredsbevarande', 'Internationell rätt', 'Vapennedrustning'],
      continental: ['Regional säkerhet', 'Interpol', 'Gränskoordinering'],
      national: ['Försvar', 'Rättsväsende', 'Polis', 'Krishantering'],
      regional: ['Regional polis', 'Domstolar', 'Räddningstjänst'],
      local: ['Lokal polis', 'Brandförsvar', 'Trygghetsskapande']
    }
  },
  {
    id: 'shelter-infrastructure',
    code: 'SI',
    name: 'Boende & Infrastruktur',
    marker: 'Bostad',
    color: 'bg-teal-500/10 text-teal-500 border-teal-500/30',
    description: 'Bostäder, vatten, sanitet, transport, uppkoppling',
    universalIndicators: [
      { code: 'SI01', name: 'Tillgång till rent vatten', unit: '%', description: 'Befolkning med säkert dricksvatten', dataAvailability: 'high' },
      { code: 'SI02', name: 'Tillgång till sanitet', unit: '%', description: 'Befolkning med adekvat sanitet', dataAvailability: 'high' },
      { code: 'SI03', name: 'Bostadsöverkomlighet', unit: 'kvot', description: 'Boendekostnad i förhållande till inkomst', dataAvailability: 'medium' },
      { code: 'SI04', name: 'Trångboddhet', unit: '%', description: 'Boende i trånga förhållanden', dataAvailability: 'medium' },
      { code: 'SI05', name: 'Internettillgång', unit: '%', description: 'Hushåll med internet', dataAvailability: 'high' },
      { code: 'SI06', name: 'Kollektivtrafiktillgång', unit: 'index', description: 'Tillgång till kollektivtrafik', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['SDG-mål', 'Habitat-agendan', 'Klimatanpassning'],
      continental: ['Infrastrukturnätverk', 'Elnät', 'Digitala korridorer'],
      national: ['Bostadspolitik', 'Infrastrukturinvesteringar', 'Reglering av allmännyttiga tjänster'],
      regional: ['Regional planering', 'Transportnät', 'Vattensystem'],
      local: ['Detaljplanering', 'Lokala nyttigheter', 'Bostadsförsörjning', 'Vägar']
    }
  },
  {
    id: 'environment-resources',
    code: 'ER',
    name: 'Miljö & Resurser',
    marker: 'Miljö',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    description: 'Luftkvalitet, klimat, biologisk mångfald, resurshållbarhet',
    universalIndicators: [
      { code: 'ER01', name: 'Luftkvalitet (PM2.5)', unit: 'μg/m³', description: 'Koncentration av fina partiklar', dataAvailability: 'high' },
      { code: 'ER02', name: 'CO2 per capita', unit: 'ton/år', description: 'Koldioxidutsläpp per person', dataAvailability: 'high' },
      { code: 'ER03', name: 'Förnybar energi', unit: '%', description: 'Energi från förnybara källor', dataAvailability: 'high' },
      { code: 'ER04', name: 'Skyddad mark', unit: '%', description: 'Mark under skydd', dataAvailability: 'high' },
      { code: 'ER05', name: 'Vattenstress', unit: 'index 0-5', description: 'Sötvattensuttag vs tillgång', dataAvailability: 'medium' },
      { code: 'ER06', name: 'Återvinningsgrad', unit: '%', description: 'Kommunalt avfall som återvinns', dataAvailability: 'medium' }
    ],
    governanceLevels: {
      global: ['Parisavtalet', 'CBD', 'Montrealprotokollet', 'Baselkonventionen'],
      continental: ['Utsläppshandel', 'Miljöstandarder', 'Gränsöverskridande'],
      national: ['Miljölagstiftning', 'Klimatmål', 'Naturskyddsområden'],
      regional: ['Regional naturvård', 'Luftkvalitet', 'Avrinningsområden'],
      local: ['Avfallshantering', 'Lokalt naturskydd', 'Stadsgrönska']
    }
  },
  {
    id: 'energy-food',
    code: 'EF',
    name: 'Energi & Mat',
    marker: 'Energi',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    description: 'Energitillgång, livsmedelssäkerhet, nutrition, jordbruk',
    universalIndicators: [
      { code: 'EF01', name: 'Eltillgång', unit: '%', description: 'Befolkning med elektricitet', dataAvailability: 'high' },
      { code: 'EF02', name: 'Livsmedelsotrygghet', unit: '%', description: 'Måttlig eller svår livsmedelsotrygghet', dataAvailability: 'high' },
      { code: 'EF03', name: 'Undernäring', unit: '%', description: 'Otillräckligt kaloriintag', dataAvailability: 'high' },
      { code: 'EF04', name: 'Hämmad tillväxt hos barn', unit: '%', description: 'Barn under 5 med hämmad tillväxt', dataAvailability: 'high' },
      { code: 'EF05', name: 'Energiintensitet', unit: 'MJ/USD BNP', description: 'Energianvändning per ekonomisk produktion', dataAvailability: 'high' },
      { code: 'EF06', name: 'Jordbruksproduktivitet', unit: 'USD/arbetare', description: 'Förädlingsvärde per jordbruksarbetare', dataAvailability: 'medium' }
    ],
    governanceLevels: {
      global: ['FAO', 'WFP', 'IEA', 'Handelsavtal'],
      continental: ['Energiunioner', 'Jordbrukspolitik', 'Livsmedelsstandarder'],
      national: ['Energipolitik', 'Jordbrukssubventioner', 'Livsmedelssäkerhet'],
      regional: ['Elnätsoperatörer', 'Jordbruksrådgivning', 'Livsmedelsdistribution'],
      local: ['Lokala marknader', 'Stadsodling', 'Energikooperativ']
    }
  },
  {
    id: 'governance-rights',
    code: 'GR',
    name: 'Styrning & Rättigheter',
    marker: 'Demokrati',
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
    description: 'Demokratiskt deltagande, mänskliga rättigheter, transparens, inkludering',
    universalIndicators: [
      { code: 'GR01', name: 'Demokratiindex', unit: 'index 0-10', description: 'Övergripande demokratisk kvalitet', dataAvailability: 'high' },
      { code: 'GR02', name: 'Valdeltagande', unit: '%', description: 'Valdeltagande', dataAvailability: 'high' },
      { code: 'GR03', name: 'Pressfrihet', unit: 'index 0-100', description: 'Medieoberoende', dataAvailability: 'high' },
      { code: 'GR04', name: 'Korruptionsuppfattning', unit: 'index 0-100', description: 'Uppfattad korruption i offentlig sektor', dataAvailability: 'high' },
      { code: 'GR05', name: 'Jämställdhetsindex', unit: 'index 0-1', description: 'Utjämning av könsgap', dataAvailability: 'high' },
      { code: 'GR06', name: 'Mänskliga rättigheter', unit: 'index 0-1', description: 'Rättighetsskydd', dataAvailability: 'medium' }
    ],
    governanceLevels: {
      global: ['FN:s råd för mänskliga rättigheter', 'ICC', 'Internationella fördrag'],
      continental: ['Regionala domstolar', 'MR-stadgor', 'Demokratistandarder'],
      national: ['Konstitution', 'Val', 'Domstolar', 'Rättighetslagstiftning'],
      regional: ['Regional förvaltning', 'Förvaltningsdomstolar', 'Ombudsmän'],
      local: ['Lokal demokrati', 'Medborgardeltagande', 'Transparens']
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS - NO ICONS
// ═══════════════════════════════════════════════════════════════

// Indicator badge with data availability
const IndicatorBadge: React.FC<{ indicator: UniversalIndicator }> = ({ indicator }) => {
  const availabilityColors = {
    high: 'bg-emerald-500/20 text-emerald-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-red-500/20 text-red-400',
    none: 'bg-muted text-muted-foreground'
  };

  const availabilityMarkers = {
    high: '[HÖG]',
    medium: '[MED]',
    low: '[LÅG]',
    none: '[−]'
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border/50 font-mono">
      <Badge variant="outline" className="font-mono text-xs">
        {indicator.code}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{indicator.name}</p>
        <p className="text-xs text-muted-foreground">{indicator.unit}</p>
      </div>
      <Badge className={cn("text-xs font-mono", availabilityColors[indicator.dataAvailability])}>
        {availabilityMarkers[indicator.dataAvailability]}
      </Badge>
    </div>
  );
};

// Governance level section
const GovernanceLevelSection: React.FC<{ 
  level: GovernanceLevel;
  responsibilities: string[];
}> = ({ level, responsibilities }) => {
  if (responsibilities.length === 0) return null;

  return (
    <div className="space-y-2 font-mono">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-xs text-muted-foreground">{level.marker}</span>
        <span>{level.name}</span>
      </div>
      <div className="ml-6 space-y-1">
        {responsibilities.map((resp, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>[→]</span>
            <span>{resp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Domain card
const DomainCard: React.FC<{ domain: HumanNeedDomain }> = ({ domain }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalIndicators = domain.universalIndicators.length;
  const highAvailability = domain.universalIndicators.filter(i => i.dataAvailability === 'high').length;

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg border font-mono", domain.color)}>
                {domain.marker}
              </div>
              <div className="flex-1 text-left">
                <CardTitle className="text-lg flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground text-sm">{domain.code}</span>
                  {domain.name}
                  <span className="text-muted-foreground ml-auto text-sm">
                    {isExpanded ? '[−]' : '[+]'}
                  </span>
                </CardTitle>
                <CardDescription>{domain.description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap font-mono">
              <Badge variant="secondary" className="text-xs">
                {totalIndicators} indikatorer
              </Badge>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                {highAvailability} hög datatillgång
              </Badge>
              <Badge variant="outline" className="text-xs">
                5 styrningsnivåer
              </Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CardContent className="pt-0 space-y-6">
                  {/* Universal indicators */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 font-mono">
                      [DATA] Universella indikatorer
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {domain.universalIndicators.map((indicator) => (
                        <IndicatorBadge key={indicator.code} indicator={indicator} />
                      ))}
                    </div>
                  </div>

                  {/* Governance levels */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 font-mono">
                      [NIVÅ] Styrningsnivåer & typiskt mandat
                    </h4>
                    <div className="space-y-4">
                      {GOVERNANCE_LEVELS.map((level) => (
                        <GovernanceLevelSection
                          key={level.id}
                          level={level}
                          responsibilities={domain.governanceLevels[level.id as keyof typeof domain.governanceLevels] || []}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Statistics summary
const StatsSummary: React.FC = () => {
  const totalIndicators = HUMAN_NEEDS_DOMAINS.reduce(
    (sum, d) => sum + d.universalIndicators.length, 0
  );
  const highAvailability = HUMAN_NEEDS_DOMAINS.reduce(
    (sum, d) => sum + d.universalIndicators.filter(i => i.dataAvailability === 'high').length, 0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-primary">{HUMAN_NEEDS_DOMAINS.length}</div>
        <div className="text-xs text-muted-foreground">Behovsdomäner</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold">{totalIndicators}</div>
        <div className="text-xs text-muted-foreground">Universella indikatorer</div>
      </Card>
      <Card className="p-4 text-center bg-emerald-500/10 border-emerald-500/30">
        <div className="text-2xl font-bold text-emerald-400">{highAvailability}</div>
        <div className="text-xs text-muted-foreground">Hög datatillgång</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold">{GOVERNANCE_LEVELS.length}</div>
        <div className="text-xs text-muted-foreground">Styrningsnivåer</div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const UniversalResponsibilityMap: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  return (
    <div className="space-y-6 font-mono">
      {/* Header - descriptive text instead of icons */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div>
            <CardTitle className="text-xl">[ANSVAR] Universell Ansvarsmatris</CardTitle>
            <CardDescription className="mt-2">
              Globalt ramverk för mänskliga behov, indikatorer och styrningsnivåer — oberoende av jurisdiktion. 
              Varje behov kan spåras från individnivå upp till globala fördrag.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <StatsSummary />
        </CardContent>
      </Card>

      {/* Perspective reminder */}
      <Alert className="bg-muted/50">
        <span className="font-mono text-xs mr-2">[!]</span>
        <AlertDescription className="text-xs">
          <strong>Perspektivhierarki:</strong> Civilisation → Världsdel → Nation → Region → System → Indikator → Datapunkt. 
          Alla datapunkter existerar i sitt globala sammanhang.
        </AlertDescription>
      </Alert>

      {/* Level filter - text-based tabs */}
      <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
        <TabsList className="flex-wrap h-auto font-mono">
          <TabsTrigger value="all" className="gap-1.5">
            Alla nivåer
          </TabsTrigger>
          {GOVERNANCE_LEVELS.map((level) => (
            <TabsTrigger key={level.id} value={level.id} className="gap-1.5">
              {level.marker} {level.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Domain cards */}
      <div className="grid gap-4">
        {HUMAN_NEEDS_DOMAINS.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>

      {/* Data availability legend */}
      <Card className="p-4 font-mono">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400">[HÖG]</Badge>
            <span>Hög datatillgång (SDG, WHO, WB)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400">[MED]</Badge>
            <span>Medium (nationella källor)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400">[LÅG]</Badge>
            <span>Låg (begränsad/fragmenterad)</span>
          </div>
        </div>
      </Card>

      {/* Principle */}
      <Alert>
        <span className="font-mono text-xs mr-2">[!]</span>
        <AlertDescription>
          <strong>Universell princip:</strong> Mänskliga behov är konstanta över jurisdiktioner. 
          Indikatorerna är desamma oavsett om du tittar på Sverige, Kenya eller Japan – 
          endast datatillgång och styrningsstruktur varierar.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UniversalResponsibilityMap;
