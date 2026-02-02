/**
 * 🌍 BIG QUESTIONS LAYER V2
 * 
 * Master Execution Block 34 implementation.
 * "What the world is facing — based on current data"
 * 
 * 7 locked categories. Sections A-E. Semantic discipline.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Globe, 
  TrendingUp, 
  Cpu, 
  Zap, 
  HeartPulse, 
  GraduationCap, 
  Landmark, 
  ShieldAlert,
  ChevronRight,
  MapPin,
  Bookmark,
  FileText,
  Clock,
  ArrowRight,
  Map,
  History,
  Users,
  Info,
} from 'lucide-react';
import { 
  QUESTION_CATEGORIES, 
  getQuestionContract,
  type QuestionContract,
  type DrillScope,
} from '@/config/bigQuestionsContracts';
import { 
  SemanticTextBlock, 
  SemanticWarning, 
  DataTierBadge,
  PatternBlock,
  HistoricalContextBlock,
} from './SemanticText';

// ============================================================
// TYPES
// ============================================================

interface DrillPath {
  level: DrillScope;
  id: string;
  name: string;
}

interface BigQuestionsLayerV2Props {
  language?: 'sv' | 'en';
  onCreateMission?: (questionId: string, location?: string) => void;
}

// ============================================================
// ICON MAP
// ============================================================

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'trending-up': TrendingUp,
  'cpu': Cpu,
  'zap': Zap,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'landmark': Landmark,
  'shield-alert': ShieldAlert,
};

const COLOR_MAP: Record<string, string> = {
  emerald: 'text-emerald-600 bg-emerald-100 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800',
  violet: 'text-violet-600 bg-violet-100 border-violet-300 dark:bg-violet-950 dark:border-violet-800',
  amber: 'text-amber-600 bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800',
  rose: 'text-rose-600 bg-rose-100 border-rose-300 dark:bg-rose-950 dark:border-rose-800',
  sky: 'text-sky-600 bg-sky-100 border-sky-300 dark:bg-sky-950 dark:border-sky-800',
  slate: 'text-slate-600 bg-slate-100 border-slate-300 dark:bg-slate-950 dark:border-slate-800',
  orange: 'text-orange-600 bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800',
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export function BigQuestionsLayerV2({
  language = 'sv',
  onCreateMission,
}: BigQuestionsLayerV2Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [drillPath, setDrillPath] = useState<DrillPath[]>([
    { level: 'global', id: 'global', name: language === 'sv' ? 'Världen' : 'World' }
  ]);

  const handleDrillDown = (level: DrillScope, id: string, name: string) => {
    setDrillPath(prev => [...prev, { level, id, name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setDrillPath(prev => prev.slice(0, index + 1));
  };

  const currentLocation = drillPath[drillPath.length - 1];
  const selectedContract = selectedCategory ? getQuestionContract(selectedCategory) : null;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10"
        >
          <Globe className="h-10 w-10 text-primary" />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {language === 'sv' 
            ? 'Vad står världen inför?'
            : 'What the world is facing'}
        </h1>
        
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {language === 'sv'
            ? 'Baserat på aktuell data från oberoende källor'
            : 'Based on current data from independent sources'}
        </p>

        {/* System principles */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <SemanticWarning type="no_forecast" language={language} />
          <SemanticWarning type="no_recommendations" language={language} />
        </div>
      </header>

      {/* DRILL-DOWN BREADCRUMB */}
      <nav className="flex justify-center">
        <Card className="inline-flex">
          <CardContent className="py-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                {drillPath.map((item, index) => (
                  <React.Fragment key={`${item.level}-${item.id}`}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === drillPath.length - 1 ? (
                        <BreadcrumbPage className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.name}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleBreadcrumbClick(index);
                          }}
                        >
                          {item.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>
      </nav>

      {/* 7 LOCKED CATEGORIES */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {QUESTION_CATEGORIES.map((category, index) => {
            const Icon = ICON_MAP[category.icon] || Globe;
            const colorClass = COLOR_MAP[category.color] || COLOR_MAP.slate;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedCategory(
                    isSelected ? null : category.id
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">
                          {category.label[language]}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between text-muted-foreground hover:text-foreground"
                    >
                      {language === 'sv' ? 'Utforska' : 'Explore'}
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        isSelected ? 'rotate-90' : ''
                      }`} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SELECTED QUESTION DETAIL (Sections A-E) */}
      <AnimatePresence mode="wait">
        {selectedContract && (
          <QuestionDetailView
            contract={selectedContract}
            language={language}
            currentLocation={currentLocation}
            onDrillDown={handleDrillDown}
            onCreateMission={onCreateMission}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// QUESTION DETAIL VIEW (Sections A-E)
// ============================================================

interface QuestionDetailViewProps {
  contract: QuestionContract;
  language: 'sv' | 'en';
  currentLocation: DrillPath;
  onDrillDown: (level: DrillScope, id: string, name: string) => void;
  onCreateMission?: (questionId: string, location?: string) => void;
  onClose: () => void;
}

function QuestionDetailView({
  contract,
  language,
  currentLocation,
  onDrillDown,
  onCreateMission,
  onClose,
}: QuestionDetailViewProps) {
  const category = QUESTION_CATEGORIES.find(c => c.id === contract.category);
  const Icon = ICON_MAP[contract.icon] || Globe;
  const colorClass = COLOR_MAP[contract.color] || COLOR_MAP.slate;

  // Title based on drill level
  const title = currentLocation.level === 'global'
    ? category?.label[language]
    : `${language === 'sv' ? 'Vad detta betyder för' : 'What this means for'} ${currentLocation.name}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-2">
        {/* Header */}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${colorClass}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {language === 'sv' ? 'Senast uppdaterad: ' : 'Last updated: '}
                  {contract.last_updated}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary" className="text-xs">
                A. {language === 'sv' ? 'Sammanfattning' : 'Summary'}
              </TabsTrigger>
              <TabsTrigger value="patterns" className="text-xs">
                B. {language === 'sv' ? 'Mönster' : 'Patterns'}
              </TabsTrigger>
              <TabsTrigger value="impact" className="text-xs">
                C. {language === 'sv' ? 'Påverkan' : 'Impact'}
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                D. {language === 'sv' ? 'Historik' : 'History'}
              </TabsTrigger>
              <TabsTrigger value="drill" className="text-xs">
                E. {language === 'sv' ? 'Din verklighet' : 'Your reality'}
              </TabsTrigger>
            </TabsList>

            {/* SECTION A: Summary */}
            <TabsContent value="summary" className="space-y-4">
              <SemanticTextBlock
                tag={contract.summary.what_it_is.tag}
                sources={contract.summary.what_it_is.sources}
                language={language}
              >
                {contract.summary.what_it_is.text[language]}
              </SemanticTextBlock>

              <SemanticTextBlock
                tag={contract.summary.why_it_matters_now.tag}
                sources={contract.summary.why_it_matters_now.sources}
                language={language}
              >
                {contract.summary.why_it_matters_now.text[language]}
              </SemanticTextBlock>

              <SemanticTextBlock
                tag={contract.summary.what_data_shows.tag}
                sources={contract.summary.what_data_shows.sources}
                language={language}
              >
                {contract.summary.what_data_shows.text[language]}
              </SemanticTextBlock>
            </TabsContent>

            {/* SECTION B: Patterns */}
            <TabsContent value="patterns" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'sv' 
                  ? 'Observerade mönster utan värdering. Ingen prognos.'
                  : 'Observed patterns without judgment. No forecast.'}
              </p>
              
              {contract.patterns.length > 0 ? (
                <div className="space-y-4">
                  {contract.patterns.map(pattern => (
                    <PatternBlock
                      key={pattern.id}
                      observation={pattern.observation[language]}
                      timeframe={pattern.timeframe}
                      uncertainty={pattern.uncertainty_level}
                      sources={pattern.sources}
                      dataTier={pattern.data_tier}
                      language={language}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    {language === 'sv' 
                      ? 'Detaljerade mönster läggs till löpande.'
                      : 'Detailed patterns are being added continuously.'}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* SECTION C: Impact */}
            <TabsContent value="impact" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Map className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">
                  {language === 'sv' ? 'Var sker påverkan mest?' : 'Where is impact greatest?'}
                </h3>
              </div>

              <div className="grid gap-3">
                {contract.impact_layers.map(layer => (
                  <div 
                    key={layer.level}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium capitalize">
                          {layer.level === 'global' 
                            ? (language === 'sv' ? 'Globalt' : 'Global')
                            : layer.level === 'continent'
                            ? (language === 'sv' ? 'Kontinent' : 'Continent')
                            : layer.level === 'country'
                            ? (language === 'sv' ? 'Land' : 'Country')
                            : layer.level === 'region'
                            ? (language === 'sv' ? 'Region' : 'Region')
                            : (language === 'sv' ? 'Kommun' : 'Municipality')}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {layer.description[language]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DataTierBadge tier={layer.data_tier} />
                      {layer.data_available && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          {language === 'sv' ? 'Tillgänglig' : 'Available'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* SECTION D: Historical context */}
            <TabsContent value="history" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">
                  {language === 'sv' 
                    ? 'Vad har historiskt gjort skillnad?'
                    : 'What has historically made a difference?'}
                </h3>
              </div>

              <SemanticWarning 
                type="correlation" 
                language={language} 
                className="mb-4 p-3 bg-muted rounded-lg"
              />

              {contract.historical_context.length > 0 ? (
                <div className="space-y-4">
                  {contract.historical_context.map(ctx => (
                    <HistoricalContextBlock
                      key={ctx.id}
                      conditions={ctx.context_conditions[language]}
                      outcome={ctx.observed_outcome[language]}
                      whenNotWorked={ctx.when_it_didnt_work[language]}
                      timeLag={ctx.time_lag}
                      sources={ctx.sources}
                      language={language}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    {language === 'sv' 
                      ? 'Historisk kontext läggs till löpande.'
                      : 'Historical context is being added continuously.'}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* SECTION E: Drill-down / Your reality */}
            <TabsContent value="drill" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">
                  {language === 'sv' 
                    ? 'Vad betyder detta för dig?'
                    : 'What does this mean for you?'}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {language === 'sv'
                  ? 'Frågan ändras inte – perspektivet gör det. Välj nivå för att se lokal data.'
                  : 'The question doesn\'t change – the perspective does. Select a level to see local data.'}
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <DrillButton
                  label={language === 'sv' ? 'Välj land' : 'Select country'}
                  description={contract.drill_prompts.country[language]}
                  onClick={() => onDrillDown('country', 'se', 'Sverige')}
                />
                <DrillButton
                  label={language === 'sv' ? 'Välj region' : 'Select region'}
                  description={contract.drill_prompts.region[language]}
                  onClick={() => onDrillDown('region', 'stockholm', 'Stockholm')}
                />
                <DrillButton
                  label={language === 'sv' ? 'Välj kommun' : 'Select municipality'}
                  description={contract.drill_prompts.municipality[language]}
                  onClick={() => onDrillDown('municipality', 'goteborg', 'Göteborg')}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer actions */}
          <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onCreateMission?.(contract.question_id, currentLocation.id)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {language === 'sv' ? 'Skapa mission' : 'Create mission'}
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              {language === 'sv' ? 'Se källor' : 'View sources'}
              <Badge variant="secondary" className="ml-2">
                {contract.sources.length}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

// ============================================================
// DRILL BUTTON
// ============================================================

interface DrillButtonProps {
  label: string;
  description: string;
  onClick: () => void;
}

function DrillButton({ label, description, onClick }: DrillButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{label}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

export default BigQuestionsLayerV2;
