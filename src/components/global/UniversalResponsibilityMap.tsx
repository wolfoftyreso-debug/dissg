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
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  MapPin, 
  Building2, 
  Heart,
  Briefcase,
  GraduationCap,
  Shield,
  Home,
  Leaf,
  Zap,
  Scale,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Target,
  AlertCircle
} from 'lucide-react';
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
  icon: React.ReactNode;
  typicalActors: string[];
  jurisdictionExamples: string[];
}

interface HumanNeedDomain {
  id: string;
  code: string;
  name: string;
  nameLocal?: Record<string, string>;
  icon: React.ReactNode;
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
const GOVERNANCE_LEVELS: GovernanceLevel[] = [
  {
    id: 'global',
    name: 'Global',
    description: 'International bodies, treaties, and cross-border coordination',
    icon: <Globe className="h-4 w-4" />,
    typicalActors: ['UN agencies', 'WHO', 'ILO', 'World Bank', 'IMF', 'WTO'],
    jurisdictionExamples: ['Paris Agreement', 'SDGs', 'IHR', 'Basel Accords']
  },
  {
    id: 'continental',
    name: 'Continental / Bloc',
    description: 'Regional economic and political unions',
    icon: <Layers className="h-4 w-4" />,
    typicalActors: ['EU', 'AU', 'ASEAN', 'Mercosur', 'NAFTA/USMCA'],
    jurisdictionExamples: ['EU Directives', 'AU Protocols', 'ASEAN Framework']
  },
  {
    id: 'national',
    name: 'National',
    description: 'Sovereign state legislation and policy',
    icon: <MapPin className="h-4 w-4" />,
    typicalActors: ['Parliament', 'Federal agencies', 'National ministries'],
    jurisdictionExamples: ['National constitution', 'Federal law', 'National budget']
  },
  {
    id: 'regional',
    name: 'Regional / Provincial',
    description: 'Sub-national administrative units',
    icon: <Target className="h-4 w-4" />,
    typicalActors: ['States', 'Provinces', 'Länder', 'Regions', 'Counties'],
    jurisdictionExamples: ['State law', 'Regional planning', 'Provincial services']
  },
  {
    id: 'local',
    name: 'Local / Municipal',
    description: 'Cities, municipalities, and communities',
    icon: <Building2 className="h-4 w-4" />,
    typicalActors: ['City councils', 'Mayors', 'Municipal agencies'],
    jurisdictionExamples: ['Zoning', 'Local services', 'Community programs']
  }
];

// Universal human needs domains - applicable everywhere
const HUMAN_NEEDS_DOMAINS: HumanNeedDomain[] = [
  {
    id: 'life-health',
    code: 'LH',
    name: 'Life & Health',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Survival, physical health, mental wellbeing, healthcare access',
    universalIndicators: [
      { code: 'LH01', name: 'Life expectancy at birth', unit: 'years', description: 'Average years a newborn can expect to live', dataAvailability: 'high' },
      { code: 'LH02', name: 'Healthy life expectancy', unit: 'years', description: 'Years lived in full health', dataAvailability: 'medium' },
      { code: 'LH03', name: 'Infant mortality rate', unit: 'per 1,000', description: 'Deaths before age 1 per 1,000 live births', dataAvailability: 'high' },
      { code: 'LH04', name: 'Maternal mortality ratio', unit: 'per 100,000', description: 'Maternal deaths per 100,000 live births', dataAvailability: 'high' },
      { code: 'LH05', name: 'Healthcare access index', unit: 'index 0-100', description: 'Access to essential health services', dataAvailability: 'medium' },
      { code: 'LH06', name: 'Mental health treatment gap', unit: '%', description: 'Untreated mental disorders', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['WHO guidelines', 'IHR compliance', 'Pandemic preparedness'],
      continental: ['Regional health frameworks', 'Cross-border health', 'Joint procurement'],
      national: ['Health system design', 'Universal coverage policy', 'Drug regulation'],
      regional: ['Hospital networks', 'Emergency services', 'Public health'],
      local: ['Primary care access', 'Community health', 'Local clinics']
    }
  },
  {
    id: 'livelihood-work',
    code: 'LW',
    name: 'Livelihood & Work',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Employment, income, economic participation, labor rights',
    universalIndicators: [
      { code: 'LW01', name: 'Employment rate', unit: '%', description: 'Working-age population in employment', dataAvailability: 'high' },
      { code: 'LW02', name: 'Youth unemployment', unit: '%', description: 'Unemployed 15-24 year olds', dataAvailability: 'high' },
      { code: 'LW03', name: 'Median income (PPP)', unit: 'USD/year', description: 'Purchasing-power adjusted median income', dataAvailability: 'medium' },
      { code: 'LW04', name: 'Working poverty rate', unit: '%', description: 'Employed but below poverty line', dataAvailability: 'medium' },
      { code: 'LW05', name: 'Labor force participation', unit: '%', description: 'Active labor force share', dataAvailability: 'high' },
      { code: 'LW06', name: 'Income inequality (Gini)', unit: 'index 0-1', description: 'Income distribution inequality', dataAvailability: 'high' }
    ],
    governanceLevels: {
      global: ['ILO standards', 'Trade agreements', 'Migration frameworks'],
      continental: ['Labor mobility', 'Minimum standards', 'Social security coordination'],
      national: ['Labor law', 'Minimum wage', 'Social insurance', 'Tax policy'],
      regional: ['Labor market programs', 'Skills matching', 'Regional development'],
      local: ['Job centers', 'Local employers', 'Community employment']
    }
  },
  {
    id: 'knowledge-skills',
    code: 'KS',
    name: 'Knowledge & Skills',
    icon: <GraduationCap className="h-5 w-5" />,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Education, literacy, skill development, lifelong learning',
    universalIndicators: [
      { code: 'KS01', name: 'Adult literacy rate', unit: '%', description: 'Adults who can read and write', dataAvailability: 'high' },
      { code: 'KS02', name: 'Mean years of schooling', unit: 'years', description: 'Average education completed', dataAvailability: 'high' },
      { code: 'KS03', name: 'Expected years of schooling', unit: 'years', description: 'Years child can expect to attend', dataAvailability: 'high' },
      { code: 'KS04', name: 'PISA score average', unit: 'score', description: 'International student assessment', dataAvailability: 'medium' },
      { code: 'KS05', name: 'Tertiary enrollment', unit: '%', description: 'Higher education participation', dataAvailability: 'high' },
      { code: 'KS06', name: 'Digital literacy', unit: '%', description: 'Basic digital skills', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['UNESCO standards', 'SDG 4 monitoring', 'Recognition frameworks'],
      continental: ['Bologna Process', 'Qualification frameworks', 'Student mobility'],
      national: ['Curriculum standards', 'Teacher certification', 'University system'],
      regional: ['School networks', 'Vocational training', 'Higher education'],
      local: ['Schools operation', 'Early childhood', 'Adult education']
    }
  },
  {
    id: 'safety-security',
    code: 'SS',
    name: 'Safety & Security',
    icon: <Shield className="h-5 w-5" />,
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Physical safety, rule of law, conflict, emergency response',
    universalIndicators: [
      { code: 'SS01', name: 'Homicide rate', unit: 'per 100,000', description: 'Intentional homicides', dataAvailability: 'high' },
      { code: 'SS02', name: 'Global Peace Index', unit: 'index 1-5', description: 'Overall peacefulness', dataAvailability: 'high' },
      { code: 'SS03', name: 'Rule of Law Index', unit: 'index 0-1', description: 'Legal system strength', dataAvailability: 'medium' },
      { code: 'SS04', name: 'Displacement rate', unit: 'per 100,000', description: 'Internally displaced persons', dataAvailability: 'medium' },
      { code: 'SS05', name: 'Perceived safety', unit: '%', description: 'Feel safe walking at night', dataAvailability: 'medium' },
      { code: 'SS06', name: 'Disaster preparedness', unit: 'index 0-100', description: 'Emergency response capacity', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['UN peacekeeping', 'International law', 'Arms treaties'],
      continental: ['Regional security', 'Interpol', 'Border coordination'],
      national: ['Defense', 'Justice system', 'Police', 'Emergency management'],
      regional: ['Regional police', 'Courts', 'Emergency services'],
      local: ['Local police', 'Fire services', 'Community safety']
    }
  },
  {
    id: 'shelter-infrastructure',
    code: 'SI',
    name: 'Shelter & Infrastructure',
    icon: <Home className="h-5 w-5" />,
    color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    description: 'Housing, water, sanitation, transport, connectivity',
    universalIndicators: [
      { code: 'SI01', name: 'Access to safe water', unit: '%', description: 'Population with safe drinking water', dataAvailability: 'high' },
      { code: 'SI02', name: 'Access to sanitation', unit: '%', description: 'Population with adequate sanitation', dataAvailability: 'high' },
      { code: 'SI03', name: 'Housing affordability', unit: 'ratio', description: 'Housing cost to income ratio', dataAvailability: 'medium' },
      { code: 'SI04', name: 'Overcrowding rate', unit: '%', description: 'Living in overcrowded conditions', dataAvailability: 'medium' },
      { code: 'SI05', name: 'Internet access', unit: '%', description: 'Households with internet', dataAvailability: 'high' },
      { code: 'SI06', name: 'Transport access', unit: 'index', description: 'Access to public transport', dataAvailability: 'low' }
    ],
    governanceLevels: {
      global: ['SDG targets', 'Habitat agenda', 'Climate adaptation'],
      continental: ['Infrastructure networks', 'Energy grids', 'Digital corridors'],
      national: ['Housing policy', 'Infrastructure investment', 'Utility regulation'],
      regional: ['Regional planning', 'Transport networks', 'Water systems'],
      local: ['Zoning', 'Local utilities', 'Housing provision', 'Roads']
    }
  },
  {
    id: 'environment-resources',
    code: 'ER',
    name: 'Environment & Resources',
    icon: <Leaf className="h-5 w-5" />,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Air quality, climate, biodiversity, resource sustainability',
    universalIndicators: [
      { code: 'ER01', name: 'Air quality (PM2.5)', unit: 'μg/m³', description: 'Fine particulate matter concentration', dataAvailability: 'high' },
      { code: 'ER02', name: 'CO2 per capita', unit: 'tonnes/year', description: 'Carbon emissions per person', dataAvailability: 'high' },
      { code: 'ER03', name: 'Renewable energy share', unit: '%', description: 'Energy from renewables', dataAvailability: 'high' },
      { code: 'ER04', name: 'Protected land area', unit: '%', description: 'Land under protection', dataAvailability: 'high' },
      { code: 'ER05', name: 'Water stress', unit: 'index 0-5', description: 'Freshwater withdrawal vs availability', dataAvailability: 'medium' },
      { code: 'ER06', name: 'Waste recycling rate', unit: '%', description: 'Municipal waste recycled', dataAvailability: 'medium' }
    ],
    governanceLevels: {
      global: ['Paris Agreement', 'CBD', 'Montreal Protocol', 'Basel Convention'],
      continental: ['Emissions trading', 'Environmental standards', 'Transboundary'],
      national: ['Environmental law', 'Climate targets', 'Protected areas'],
      regional: ['Regional conservation', 'Air quality', 'Watershed management'],
      local: ['Waste management', 'Local conservation', 'Urban green space']
    }
  },
  {
    id: 'energy-food',
    code: 'EF',
    name: 'Energy & Food',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'Energy access, food security, nutrition, agriculture',
    universalIndicators: [
      { code: 'EF01', name: 'Electricity access', unit: '%', description: 'Population with electricity', dataAvailability: 'high' },
      { code: 'EF02', name: 'Food insecurity', unit: '%', description: 'Moderate or severe food insecurity', dataAvailability: 'high' },
      { code: 'EF03', name: 'Undernourishment', unit: '%', description: 'Insufficient caloric intake', dataAvailability: 'high' },
      { code: 'EF04', name: 'Child stunting', unit: '%', description: 'Children under 5 with stunted growth', dataAvailability: 'high' },
      { code: 'EF05', name: 'Energy intensity', unit: 'MJ/USD GDP', description: 'Energy use per economic output', dataAvailability: 'high' },
      { code: 'EF06', name: 'Agricultural productivity', unit: 'USD/worker', description: 'Value added per agricultural worker', dataAvailability: 'medium' }
    ],
    governanceLevels: {
      global: ['FAO', 'WFP', 'IEA', 'Trade agreements'],
      continental: ['Energy unions', 'Agricultural policy', 'Food standards'],
      national: ['Energy policy', 'Agricultural subsidies', 'Food safety'],
      regional: ['Grid operation', 'Agricultural extension', 'Food distribution'],
      local: ['Local markets', 'Urban farming', 'Energy cooperatives']
    }
  },
  {
    id: 'governance-rights',
    code: 'GR',
    name: 'Governance & Rights',
    icon: <Scale className="h-5 w-5" />,
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    description: 'Democratic participation, human rights, transparency, inclusion',
    universalIndicators: [
      { code: 'GR01', name: 'Democracy Index', unit: 'index 0-10', description: 'Overall democratic quality', dataAvailability: 'high' },
      { code: 'GR02', name: 'Electoral participation', unit: '%', description: 'Voter turnout', dataAvailability: 'high' },
      { code: 'GR03', name: 'Press Freedom Index', unit: 'index 0-100', description: 'Media independence', dataAvailability: 'high' },
      { code: 'GR04', name: 'Corruption Perception', unit: 'index 0-100', description: 'Perceived public sector corruption', dataAvailability: 'high' },
      { code: 'GR05', name: 'Gender equality index', unit: 'index 0-1', description: 'Gender gap closure', dataAvailability: 'high' },
      { code: 'GR06', name: 'Human rights score', unit: 'index 0-1', description: 'Rights protection', dataAvailability: 'medium' }
    ],
    governanceLevels: {
      global: ['UN Human Rights', 'ICC', 'International treaties'],
      continental: ['Regional courts', 'Human rights charters', 'Democratic standards'],
      national: ['Constitution', 'Elections', 'Courts', 'Rights legislation'],
      regional: ['Regional government', 'Administrative courts', 'Ombudsman'],
      local: ['Local democracy', 'Citizen participation', 'Transparency']
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Indicator badge with data availability
const IndicatorBadge: React.FC<{ indicator: UniversalIndicator }> = ({ indicator }) => {
  const availabilityColors = {
    high: 'bg-emerald-500/20 text-emerald-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-red-500/20 text-red-400',
    none: 'bg-muted text-muted-foreground'
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border/50">
      <Badge variant="outline" className="font-mono text-xs">
        {indicator.code}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{indicator.name}</p>
        <p className="text-xs text-muted-foreground">{indicator.unit}</p>
      </div>
      <Badge className={cn("text-xs", availabilityColors[indicator.dataAvailability])}>
        {indicator.dataAvailability === 'high' ? '●' : indicator.dataAvailability === 'medium' ? '◐' : '○'}
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
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        {level.icon}
        <span>{level.name}</span>
      </div>
      <div className="ml-6 space-y-1">
        {responsibilities.map((resp, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
            <ChevronRight className="h-3 w-3" />
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
              <div className={cn("p-2 rounded-lg border", domain.color)}>
                {domain.icon}
              </div>
              <div className="flex-1 text-left">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="font-mono text-muted-foreground text-sm">{domain.code}</span>
                  {domain.name}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>{domain.description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
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
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Universella indikatorer
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {domain.universalIndicators.map((indicator) => (
                        <IndicatorBadge key={indicator.code} indicator={indicator} />
                      ))}
                    </div>
                  </div>

                  {/* Governance levels */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Styrningsnivåer & typiskt mandat
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Universal Responsibility Map</CardTitle>
              <CardDescription>
                Globalt ramverk för mänskliga behov, indikatorer och styrningsnivåer – oberoende av jurisdiktion
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <StatsSummary />
        </CardContent>
      </Card>

      {/* Perspective reminder */}
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Perspektivhierarki:</strong> Civilisation → Världsdel → Nation → Region → System → Indikator → Datapunkt. 
          Alla datapunkter existerar i sitt globala sammanhang.
        </AlertDescription>
      </Alert>

      {/* Level filter */}
      <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all" className="gap-1.5">
            <Scale className="h-3.5 w-3.5" />
            Alla nivåer
          </TabsTrigger>
          {GOVERNANCE_LEVELS.map((level) => (
            <TabsTrigger key={level.id} value={level.id} className="gap-1.5">
              {level.icon}
              {level.name}
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
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400">●</Badge>
            <span>Hög datatillgång (SDG, WHO, WB)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400">◐</Badge>
            <span>Medium (nationella källor)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400">○</Badge>
            <span>Låg (begränsad/fragmenterad)</span>
          </div>
        </div>
      </Card>

      {/* Principle */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
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
