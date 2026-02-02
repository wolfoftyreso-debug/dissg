/**
 * PERSONAL INSIGHT BUILDER — Main Component
 * Kombinerar alla PIB-block till en komplett upplevelse
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Brain, Info, Library, Sparkles, ArrowLeft } from 'lucide-react';

import { QuestionInterface } from './QuestionInterface';
import { InsightBlueprintView } from './InsightBlueprint';
import { StepwiseExplorer } from './StepwiseExplorer';
import { UserNotes } from './UserNotes';
import { QualityScore } from './QualityScore';
import { InsightLibraryView } from './InsightLibrary';
import { MisinterpretationGuard } from './MisinterpretationGuard';

import { 
  PIB_CORE_PRINCIPLE,
  type InsightBlueprint,
  type UserNote,
  type QualityCheck,
  type InsightLibrary,
  type ExplorationStepType
} from '@/config/personalInsightConfig';

type BuilderPhase = 'question' | 'blueprint' | 'explore' | 'complete';

// Mock data
const MOCK_BLUEPRINT: InsightBlueprint = {
  questionId: '1',
  dataPoints: [
    { id: 'energy', name: 'Energy prices', nameSv: 'Energipriser', relevance: 'Huvudvariabel' },
    { id: 'household', name: 'Household economy', nameSv: 'Hushållsekonomi', relevance: 'Jämförelsevariabel' },
    { id: 'gdp', name: 'GDP growth', nameSv: 'BNP-tillväxt', relevance: 'Kontextvariabel' },
  ],
  timePeriod: { 
    start: '2015', 
    end: '2024', 
    reason: 'Period med signifikant variation i energipriser' 
  },
  comparisonGroups: [
    { id: 'nordic', name: 'Nordic countries', nameSv: 'Nordiska länder' },
    { id: 'eu', name: 'EU average', nameSv: 'EU-genomsnitt' },
  ],
  potentialConfounders: [
    { factor: 'Monetary policy', factorSv: 'Penningpolitik', impact: 'high' },
    { factor: 'Energy mix', factorSv: 'Energimix', impact: 'medium' },
    { factor: 'Trade balance', factorSv: 'Handelsbalans', impact: 'low' },
  ],
  limitations: ['Data gaps before 2015', 'Methodology changes in 2020'],
  limitationsSv: ['Datagap före 2015', 'Metodändringar 2020'],
};

const MOCK_LIBRARY: InsightLibrary = {
  userId: 'user1',
  entries: [
    { id: '1', question: 'Hur hänger energipriser och inflation ihop?', createdAt: '2024-11-15', qualityScore: 85, stepsCompleted: 5, totalSteps: 5, hasUpdatedData: true },
    { id: '2', question: 'Varför skiljer sig arbetslösheten i Norden?', createdAt: '2024-11-10', qualityScore: 72, stepsCompleted: 4, totalSteps: 5, hasUpdatedData: false },
    { id: '3', question: 'Vad driver BNP-skillnader i EU?', createdAt: '2024-10-28', qualityScore: 58, stepsCompleted: 3, totalSteps: 5, hasUpdatedData: true },
  ],
  learningProgress: {
    totalInsights: 12,
    averageQuality: 71,
    improvementTrend: 'improving',
    skillsStrengthened: ['Jämförelseanalys', 'Trendtolkning'],
    areasToImprove: ['Osäkerhetsbeaktning', 'Begränsningar'],
  },
};

export function PersonalInsightBuilder() {
  const [phase, setPhase] = useState<BuilderPhase>('question');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentInterpretation, setCurrentInterpretation] = useState('');
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [completedSteps, setCompletedSteps] = useState<ExplorationStepType[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  const handleQuestionApproved = (question: string, interpretation: string) => {
    setCurrentQuestion(question);
    setCurrentInterpretation(interpretation);
    setPhase('blueprint');
  };

  const handleProceedToExplore = () => {
    setPhase('explore');
  };

  const handleExplorationComplete = (steps: ExplorationStepType[]) => {
    setCompletedSteps(steps);
    setPhase('complete');
  };

  const handleAddNote = (content: string, type: UserNote['type']) => {
    const newNote: UserNote = {
      id: Date.now().toString(),
      insightId: '1',
      content,
      type,
      createdAt: new Date().toISOString(),
      isPersonal: true,
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const getQualityChecks = (): QualityCheck[] => [
    { 
      criterion: 'clear_question', 
      label: 'Clear question', 
      labelSv: 'Tydlig fråga', 
      status: 'passed' 
    },
    { 
      criterion: 'correct_comparison', 
      label: 'Correct comparison', 
      labelSv: 'Korrekt jämförelse', 
      status: completedSteps.includes('comparison') ? 'passed' : 'warning',
      noteSv: completedSteps.includes('comparison') ? undefined : 'Jämförelsesteg ej slutfört'
    },
    { 
      criterion: 'uncertainty_considered', 
      label: 'Uncertainty considered', 
      labelSv: 'Osäkerhet beaktad', 
      status: completedSteps.includes('covariation') ? 'passed' : 'failed',
      noteSv: completedSteps.includes('covariation') ? undefined : 'Granska samvariationssteg'
    },
    { 
      criterion: 'limitations_reviewed', 
      label: 'Limitations reviewed', 
      labelSv: 'Begränsningar granskade', 
      status: completedSteps.includes('limitations') ? 'passed' : 'failed',
      noteSv: completedSteps.includes('limitations') ? undefined : 'Granska begränsningar'
    },
    { 
      criterion: 'steps_completed', 
      label: 'All steps completed', 
      labelSv: 'Alla steg genomförda', 
      status: completedSteps.length === 5 ? 'passed' : 'warning',
      noteSv: `${completedSteps.length}/5 steg genomförda`
    },
  ];

  const resetBuilder = () => {
    setPhase('question');
    setCurrentQuestion('');
    setCurrentInterpretation('');
    setNotes([]);
    setCompletedSteps([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Personal Insight Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Bygg egna analyser – förstå svaren korrekt
                </p>
              </div>
            </div>
            {phase !== 'question' && (
              <Button variant="outline" onClick={resetBuilder}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ny analys
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Core principle */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {PIB_CORE_PRINCIPLE.statement}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="build" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="build" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Bygg analys
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Mitt bibliotek
            </TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-6">
            {/* Phase: Question */}
            {phase === 'question' && (
              <QuestionInterface onQuestionApproved={handleQuestionApproved} />
            )}

            {/* Phase: Blueprint */}
            {phase === 'blueprint' && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Din fråga:</p>
                  <p className="font-medium">{currentQuestion}</p>
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    → {currentInterpretation}
                  </p>
                </div>
                <InsightBlueprintView 
                  blueprint={MOCK_BLUEPRINT}
                  onProceed={handleProceedToExplore}
                />
              </div>
            )}

            {/* Phase: Explore */}
            {phase === 'explore' && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <StepwiseExplorer 
                    onComplete={handleExplorationComplete}
                    onStepChange={(step) => {
                      // Show warning if skipping steps
                      if (step === 'limitations' && completedSteps.length < 3) {
                        setShowWarning(true);
                      }
                    }}
                  />
                  {showWarning && (
                    <div className="mt-4">
                      <MisinterpretationGuard 
                        type="skipped_step"
                        onDismiss={() => setShowWarning(false)}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <UserNotes 
                    notes={notes}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                  />
                </div>
              </div>
            )}

            {/* Phase: Complete */}
            {phase === 'complete' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <QualityScore checks={getQualityChecks()} />
                <UserNotes 
                  notes={notes}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="library">
            <InsightLibraryView 
              library={MOCK_LIBRARY}
              onSelectInsight={(id) => console.log('Selected insight:', id)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
