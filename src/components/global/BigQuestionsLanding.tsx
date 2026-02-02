/**
 * 🧭 BIG QUESTIONS LANDING PAGE
 * 
 * MASTER EXECUTION BLOCK 36 — Landing UX
 * Orientation in <30 seconds. World → You in 2 clicks.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Cpu, Zap, HeartPulse, GraduationCap, 
  Landmark, ShieldAlert, Globe, MapPin, ChevronRight,
  FileText, Scale, HelpCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  GLOBAL_HEADER, 
  GLOBAL_FOOTER, 
  QUESTION_CATEGORIES,
  QUESTION_CONTRACTS,
  type DrillScope 
} from '@/config/bigQuestionsContracts';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';

interface LocationSelection {
  scope: DrillScope;
  code?: string;
  name?: string;
}

interface CurrentPattern {
  id: string;
  text: { sv: string; en: string };
  questionId: string;
}

// ============================================================
// ICON MAPPING
// ============================================================

const ICON_MAP: Record<string, React.ElementType> = {
  'trending-up': TrendingUp,
  'cpu': Cpu,
  'zap': Zap,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'landmark': Landmark,
  'shield-alert': ShieldAlert,
};

const COLOR_MAP: Record<string, string> = {
  'emerald': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'violet': 'bg-violet-50 text-violet-700 border-violet-200',
  'amber': 'bg-amber-50 text-amber-700 border-amber-200',
  'rose': 'bg-rose-50 text-rose-700 border-rose-200',
  'sky': 'bg-sky-50 text-sky-700 border-sky-200',
  'slate': 'bg-slate-50 text-slate-700 border-slate-200',
  'orange': 'bg-orange-50 text-orange-700 border-orange-200',
};

// ============================================================
// CURRENT PATTERNS (Auto-selected based on data movement)
// ============================================================

const CURRENT_PATTERNS: CurrentPattern[] = [
  {
    id: 'cost_of_living',
    text: {
      sv: 'Stigande levnadskostnader i flera regioner',
      en: 'Rising cost of living across multiple regions',
    },
    questionId: 'economy_livability',
  },
  {
    id: 'productivity_divergence',
    text: {
      sv: 'Divergerande produktivitetstillväxt mellan sektorer',
      en: 'Diverging productivity growth between sectors',
    },
    questionId: 'work_productivity_ai',
  },
  {
    id: 'ai_adoption',
    text: {
      sv: 'Ojämn AI-adoption på arbetsmarknader',
      en: 'Uneven AI adoption across labor markets',
    },
    questionId: 'work_productivity_ai',
  },
  {
    id: 'aging_populations',
    text: {
      sv: 'Åldrande befolkningar i industrialiserade länder',
      en: 'Aging populations in industrialized countries',
    },
    questionId: 'health_demographics',
  },
];

// ============================================================
// SAMPLE LOCATIONS (Placeholder)
// ============================================================

const SAMPLE_COUNTRIES = [
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'UK', name: 'United Kingdom' },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

interface BigQuestionsLandingProps {
  language?: Language;
  onQuestionSelect?: (questionId: string) => void;
  onLocationChange?: (location: LocationSelection) => void;
}

export function BigQuestionsLanding({
  language = 'en',
  onQuestionSelect,
  onLocationChange,
}: BigQuestionsLandingProps) {
  const [location, setLocation] = useState<LocationSelection>({ scope: 'global' });

  const handleLocationChange = (value: string) => {
    if (value === 'global') {
      const newLocation = { scope: 'global' as DrillScope };
      setLocation(newLocation);
      onLocationChange?.(newLocation);
    } else {
      const country = SAMPLE_COUNTRIES.find(c => c.code === value);
      if (country) {
        const newLocation = { scope: 'country' as DrillScope, code: country.code, name: country.name };
        setLocation(newLocation);
        onLocationChange?.(newLocation);
      }
    }
  };

  const headerTitle = useMemo(() => {
    if (location.scope === 'global') {
      return GLOBAL_HEADER.title[language];
    }
    return language === 'sv' 
      ? `Vad detta betyder för ${location.name}`
      : `What this means for ${location.name}`;
  }, [location, language]);

  return (
    <div className="min-h-screen bg-background">
      {/* ─────────────────────────────────────────────────────── */}
      {/* TOP SECTION: ORIENTATION */}
      {/* ─────────────────────────────────────────────────────── */}
      <header className="w-full bg-gradient-to-b from-slate-50 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Location Filter - Sticky on mobile */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={location.scope === 'global' ? 'global' : location.code} 
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder={language === 'sv' ? 'Välj plats' : 'Select location'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{language === 'sv' ? 'Världen' : 'World'}</span>
                    </div>
                  </SelectItem>
                  {SAMPLE_COUNTRIES.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Header */}
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.h1
                key={headerTitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight mb-6"
              >
                {headerTitle}
              </motion.h1>
            </AnimatePresence>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              {GLOBAL_HEADER.subtitle[language]}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-slate-800 hover:bg-slate-900 text-white"
                onClick={() => document.getElementById('questions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {language === 'sv' ? 'Utforska de stora frågorna' : 'Explore the big questions'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleLocationChange('SE')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {language === 'sv' ? 'Välj din plats' : 'Select your location'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────── */}
      {/* THE 7 BIG QUESTIONS */}
      {/* ─────────────────────────────────────────────────────── */}
      <section id="questions" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8">
          {language === 'sv' ? 'De stora frågorna' : 'The big questions'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {QUESTION_CATEGORIES.map((category, index) => {
            const contract = QUESTION_CONTRACTS.find(q => q.question_id === category.id);
            const IconComponent = ICON_MAP[category.icon] || Globe;
            const colorClasses = COLOR_MAP[category.color] || COLOR_MAP.slate;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card 
                  className="h-full cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 group"
                  onClick={() => onQuestionSelect?.(category.id)}
                >
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorClasses} border`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                      {contract?.title[language] || category.label[language]}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {contract?.short_description[language] || ''}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* WHAT MATTERS NOW */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            {language === 'sv' ? 'Vad som spelar roll nu' : 'What matters now'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === 'sv' 
              ? 'Strukturella mönster baserade på datarörelse och bredd' 
              : 'Structural patterns based on data movement and breadth'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRENT_PATTERNS.map((pattern, index) => {
              const question = QUESTION_CONTRACTS.find(q => q.question_id === pattern.questionId);
              const category = QUESTION_CATEGORIES.find(c => c.id === pattern.questionId);
              const colorClasses = category ? COLOR_MAP[category.color] : COLOR_MAP.slate;
              
              return (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary/20 transition-colors cursor-pointer"
                  onClick={() => onQuestionSelect?.(pattern.questionId)}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${colorClasses.replace('bg-', 'bg-').replace('-50', '-500')}`} />
                  <div>
                    <p className="text-foreground font-medium">
                      {pattern.text[language]}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {question?.title[language]}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* TRUST TRIGGERS (FOOTER) */}
      {/* ─────────────────────────────────────────────────────── */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Trust Statements */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{language === 'sv' ? 'Baserat på offentligt tillgänglig data' : 'Based on publicly available data'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span>{language === 'sv' ? 'Metod och osäkerhet alltid synlig' : 'Methods and uncertainty always visible'}</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>{language === 'sv' ? 'Inga prognoser, inga policyrekommendationer' : 'No predictions, no policy recommendations'}</span>
          </div>
        </div>
        
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">
            {language === 'sv' ? 'Metodik' : 'Methodology'}
          </Button>
          <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">
            {language === 'sv' ? 'Källor' : 'Sources'}
          </Button>
          <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">
            {language === 'sv' ? 'Hur man läser denna data' : 'How to read this data'}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            {GLOBAL_FOOTER.disclaimer[language]}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default BigQuestionsLanding;
