// Wrapped Demo Page - Interactive demonstration of the Wrapped Engine

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Play, Info } from 'lucide-react';
import { WrappedViewer } from '@/components/wrapped';
import { useWrappedEngine } from '@/hooks/useWrappedEngine';
import { SCOPE_LABELS, THEME_LABELS, COMPARISON_LABELS, DEMO_MODE } from '@/config/wrappedConfig';
import type { WrappedScope, WrappedTheme, ComparisonType, WrappedInput } from '@/types/wrapped';

export default function WrappedDemo() {
  const navigate = useNavigate();
  const { 
    wrapped, 
    currentStep, 
    isGenerating, 
    error,
    generate, 
    nextStep, 
    prevStep, 
    goToStep,
    reset,
    totalSteps 
  } = useWrappedEngine();

  // Form state
  const [scope, setScope] = useState<WrappedScope>('country');
  const [geoId, setGeoId] = useState('SE');
  const [timeRange, setTimeRange] = useState('2025');
  const [selectedThemes, setSelectedThemes] = useState<WrappedTheme[]>(['economy', 'health']);
  const [selectedComparisons, setSelectedComparisons] = useState<ComparisonType[]>(['previous_year']);

  // Keyboard navigation
  useEffect(() => {
    if (!wrapped) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'Escape') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wrapped, nextStep, prevStep, reset]);

  const handleGenerate = async () => {
    const input: WrappedInput = {
      scope,
      geoIds: [geoId],
      timeRange,
      indicators: selectedThemes,
      comparison: selectedComparisons,
    };
    await generate(input);
  };

  const toggleTheme = (theme: WrappedTheme) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const toggleComparison = (comparison: ComparisonType) => {
    setSelectedComparisons(prev =>
      prev.includes(comparison)
        ? prev.filter(c => c !== comparison)
        : [...prev, comparison]
    );
  };

  // Show the Wrapped viewer if we have generated content
  if (wrapped) {
    return (
      <WrappedViewer
        wrapped={wrapped}
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
        onGoToStep={goToStep}
        onClose={reset}
        totalSteps={totalSteps}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Wrapped Engine</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Generera datadrivna årssammanfattningar för valfritt urval.
            Ingen story – bara sekvenserad förståelse.
          </p>
        </div>

        {/* Demo notice */}
        <Card className="mb-6 border-chart-4/50 bg-chart-4/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Demo-läge</p>
                <p className="text-muted-foreground">
                  {DEMO_MODE.watermarkText}. Du kan generera och visa, men inte spara eller dela.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration form */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column - Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Välj urval</CardTitle>
              <CardDescription>Definiera vad du vill sammanfatta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Scope */}
              <div className="space-y-2">
                <Label>Geografisk nivå</Label>
                <Select value={scope} onValueChange={(v) => setScope(v as WrappedScope)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SCOPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label.sv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Geo ID */}
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={geoId} onValueChange={setGeoId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SE">Sverige</SelectItem>
                    <SelectItem value="SE-AB">Stockholm</SelectItem>
                    <SelectItem value="SE-O">Västra Götaland</SelectItem>
                    <SelectItem value="SE-M">Skåne</SelectItem>
                    <SelectItem value="NO">Norge</SelectItem>
                    <SelectItem value="DK">Danmark</SelectItem>
                    <SelectItem value="FI">Finland</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time range */}
              <div className="space-y-2">
                <Label>Tidsperiod</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2020-2025">2020–2025 (5 år)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Right column - Themes & Comparisons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teman & jämförelser</CardTitle>
              <CardDescription>Välj vilka indikatorer som ska inkluderas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Themes */}
              <div className="space-y-3">
                <Label>Teman (välj minst ett)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(THEME_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`theme-${key}`}
                        checked={selectedThemes.includes(key as WrappedTheme)}
                        onCheckedChange={() => toggleTheme(key as WrappedTheme)}
                      />
                      <Label 
                        htmlFor={`theme-${key}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {label.icon} {label.sv}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparisons */}
              <div className="space-y-3">
                <Label>Jämförelser</Label>
                <div className="space-y-2">
                  {Object.entries(COMPARISON_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`comparison-${key}`}
                        checked={selectedComparisons.includes(key as ComparisonType)}
                        onCheckedChange={() => toggleComparison(key as ComparisonType)}
                      />
                      <Label 
                        htmlFor={`comparison-${key}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {label.sv}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error display */}
        {error && (
          <Card className="mt-6 border-destructive bg-destructive/10">
            <CardContent className="py-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Generate button */}
        <div className="mt-8 text-center">
          <Button 
            size="lg" 
            onClick={handleGenerate}
            disabled={isGenerating || selectedThemes.length === 0 || selectedComparisons.length === 0}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Genererar...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Generera Wrapped
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Alla steg visas i ordning. Tryck ESC för att avbryta.
          </p>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Tillbaka till startsidan
          </Button>
        </div>
      </div>
    </div>
  );
}
