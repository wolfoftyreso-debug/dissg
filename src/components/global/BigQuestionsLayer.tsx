/**
 * 🌍 BIG QUESTIONS LAYER (BQL)
 * 
 * Systemets högsta orienteringsskikt.
 * "Vad står världen inför – och vad visar datan faktiskt?"
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Layers, 
  TrendingUp, 
  Cpu, 
  MapPin, 
  History, 
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Info,
  Bookmark,
  ArrowRight,
} from 'lucide-react';
import { QUESTION_CONTENT, UI_LABELS, WARNINGS, getTranslation } from '@/config/bigQuestionsContent';
import type { QuestionContent } from '@/config/bigQuestionsContent';

// ============================================================
// TYPES
// ============================================================

type DrillLevel = 'world' | 'continent' | 'country' | 'region' | 'municipality';

interface DrillPath {
  level: DrillLevel;
  id: string;
  name: string;
}

interface BigQuestionsLayerProps {
  language?: 'sv' | 'en';
  onSelectQuestion?: (questionId: string) => void;
  onDrillDown?: (path: DrillPath[]) => void;
}

// ============================================================
// ICON MAPPING
// ============================================================

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  'trending-up': TrendingUp,
  cpu: Cpu,
  'map-pin': MapPin,
  history: History,
  sparkles: Sparkles,
};

const COLOR_MAP: Record<string, string> = {
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  green: 'text-green-500 bg-green-500/10 border-green-500/20',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  teal: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
};

// ============================================================
// COMPONENT
// ============================================================

export function BigQuestionsLayer({ 
  language = 'sv',
  onSelectQuestion,
  onDrillDown,
}: BigQuestionsLayerProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [drillPath, setDrillPath] = useState<DrillPath[]>([
    { level: 'world', id: 'world', name: language === 'sv' ? 'Världen' : 'World' }
  ]);

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestion(questionId);
    onSelectQuestion?.(questionId);
  };

  const handleDrillDown = (level: DrillLevel, id: string, name: string) => {
    const newPath = [...drillPath, { level, id, name }];
    setDrillPath(newPath);
    onDrillDown?.(newPath);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = drillPath.slice(0, index + 1);
    setDrillPath(newPath);
    onDrillDown?.(newPath);
  };

  const currentLevel = drillPath[drillPath.length - 1].level;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Globe className="h-12 w-12 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold">
          {language === 'sv' 
            ? 'Vad står världen inför?' 
            : 'What does the world face?'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === 'sv'
            ? 'De stora frågorna, med disciplin, tydlighet och mänskligt perspektiv.'
            : 'The big questions, with discipline, clarity, and human perspective.'}
        </p>
      </div>

      {/* Drill-down Breadcrumb */}
      <div className="flex justify-center">
        <Card className="inline-flex">
          <CardContent className="py-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                {drillPath.map((item, index) => (
                  <React.Fragment key={`${item.level}-${item.id}`}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === drillPath.length - 1 ? (
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
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
      </div>

      {/* System Principles Banner */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{getTranslation(WARNINGS.no_forecast, language)}</p>
              <p>{getTranslation(WARNINGS.no_recommendations, language)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="wait">
          {QUESTION_CONTENT.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              language={language}
              index={index}
              isSelected={selectedQuestion === question.id}
              currentLevel={currentLevel}
              onSelect={() => handleSelectQuestion(question.id)}
              onDrillDown={handleDrillDown}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Selected Question Detail */}
      <AnimatePresence mode="wait">
        {selectedQuestion && (
          <QuestionDetail
            questionId={selectedQuestion}
            language={language}
            drillPath={drillPath}
            onClose={() => setSelectedQuestion(null)}
            onDrillDown={handleDrillDown}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// QUESTION CARD
// ============================================================

interface QuestionCardProps {
  question: QuestionContent;
  language: 'sv' | 'en';
  index: number;
  isSelected: boolean;
  currentLevel: DrillLevel;
  onSelect: () => void;
  onDrillDown: (level: DrillLevel, id: string, name: string) => void;
}

function QuestionCard({ 
  question, 
  language, 
  index, 
  isSelected,
  currentLevel,
  onSelect,
}: QuestionCardProps) {
  const IconComponent = ICON_MAP[question.icon] || Layers;
  const colorClass = COLOR_MAP[question.color] || COLOR_MAP.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg border ${colorClass}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-xs">
              {currentLevel === 'world' 
                ? (language === 'sv' ? 'Global' : 'Global')
                : currentLevel}
            </Badge>
          </div>
          <CardTitle className="text-lg mt-3 leading-snug">
            {getTranslation(question.title, language)}
          </CardTitle>
          <CardDescription>
            {getTranslation(question.subtitle, language)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between group"
          >
            {getTranslation(UI_LABELS.see_details, language)}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// QUESTION DETAIL
// ============================================================

interface QuestionDetailProps {
  questionId: string;
  language: 'sv' | 'en';
  drillPath: DrillPath[];
  onClose: () => void;
  onDrillDown: (level: DrillLevel, id: string, name: string) => void;
}

function QuestionDetail({ 
  questionId, 
  language, 
  drillPath,
  onClose,
  onDrillDown,
}: QuestionDetailProps) {
  const question = QUESTION_CONTENT.find(q => q.id === questionId);
  if (!question) return null;

  const IconComponent = ICON_MAP[question.icon] || Layers;
  const colorClass = COLOR_MAP[question.color] || COLOR_MAP.blue;
  const currentLevel = drillPath[drillPath.length - 1].level;

  // Demo drill-down options
  const drillOptions = getDrillOptions(currentLevel, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg border ${colorClass}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {getTranslation(question.title, language)}
                </CardTitle>
                <CardDescription className="mt-1">
                  {getTranslation(question.subtitle, language)}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-muted-foreground">
            {getTranslation(question.description, language)}
          </p>

          {/* What it means / doesn't mean */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                  <Info className="h-4 w-4" />
                  {getTranslation(UI_LABELS.what_this_means, language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {getTranslation(question.what_it_means, language)}
              </CardContent>
            </Card>

            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  {getTranslation(UI_LABELS.what_this_doesnt_mean, language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {getTranslation(question.what_it_doesnt_mean, language)}
              </CardContent>
            </Card>
          </div>

          {/* Uncertainty note */}
          <Card className="bg-muted/50">
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                {getTranslation(question.uncertainty_note, language)}
              </p>
            </CardContent>
          </Card>

          {/* Drill-down options */}
          {drillOptions.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {getTranslation(UI_LABELS.drill_down, language)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {drillOptions.map(option => (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onDrillDown(option.level, option.id, option.name)}
                    className="group"
                  >
                    {option.name}
                    <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              {getTranslation(UI_LABELS.create_mission, language)}
            </Button>
            <Button variant="outline" size="sm">
              {getTranslation(UI_LABELS.sources, language)}
            </Button>
            <Button variant="outline" size="sm">
              {getTranslation(UI_LABELS.methodology, language)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function getDrillOptions(
  currentLevel: DrillLevel, 
  language: 'sv' | 'en'
): { level: DrillLevel; id: string; name: string }[] {
  switch (currentLevel) {
    case 'world':
      return [
        { level: 'continent', id: 'europe', name: language === 'sv' ? 'Europa' : 'Europe' },
        { level: 'continent', id: 'asia', name: language === 'sv' ? 'Asien' : 'Asia' },
        { level: 'continent', id: 'americas', name: language === 'sv' ? 'Amerika' : 'Americas' },
        { level: 'continent', id: 'africa', name: language === 'sv' ? 'Afrika' : 'Africa' },
      ];
    case 'continent':
      return [
        { level: 'country', id: 'se', name: 'Sverige' },
        { level: 'country', id: 'de', name: 'Tyskland' },
        { level: 'country', id: 'fr', name: 'Frankrike' },
        { level: 'country', id: 'uk', name: 'Storbritannien' },
      ];
    case 'country':
      return [
        { level: 'region', id: 'stockholm', name: 'Stockholm' },
        { level: 'region', id: 'vastra-gotaland', name: 'Västra Götaland' },
        { level: 'region', id: 'skane', name: 'Skåne' },
      ];
    case 'region':
      return [
        { level: 'municipality', id: 'goteborg', name: 'Göteborg' },
        { level: 'municipality', id: 'boras', name: 'Borås' },
        { level: 'municipality', id: 'trollhattan', name: 'Trollhättan' },
      ];
    default:
      return [];
  }
}

export default BigQuestionsLayer;
