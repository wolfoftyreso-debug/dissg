import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  User,
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
  Shield,
  AlertTriangle,
  BarChart3,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { LEGAL_DISCLAIMERS } from '@/config/publicProfileConfig';
import { MethodologyDisclosure } from '@/components/transparency/MethodologyDisclosure';
import { SourceAttribution } from '@/components/transparency/SourceAttribution';
import { DataLayerIndicator } from '@/components/transparency/DataLayerIndicator';

/**
 * DEL XIV: Fiktiv politikerprofil (full demo)
 * 
 * OBS: Fiktiv person. Exemplet visar exakt hur verkliga profiler ska se ut.
 * Alla formuleringar är faktaneutrala, spårbara och byggbara direkt.
 */

// Fiktiv demodata
const DEMO_PROFILE = {
  name: 'Alex Bergström',
  party: 'Framtidspartiet',
  birthYear: 1978,
  wikipediaUrl: 'https://sv.wikipedia.org/wiki/Fiktiv_person',
  lastVerified: '2026-02-01',
  
  assignments: [
    {
      id: 'minister-social',
      title: 'Socialminister',
      type: 'minister',
      startDate: '2019-01-01',
      endDate: '2022-09-30',
      months: 45,
      relevantKPIs: 6,
      outcomes: { improved: 2, neutral: 1, declined: 3 },
    },
    {
      id: 'mp-riksdag',
      title: 'Riksdagsledamot',
      type: 'mp',
      startDate: '2014-10-01',
      endDate: '2022-09-30',
      months: 96,
      relevantKPIs: 3,
      outcomes: { improved: 1, neutral: 1, declined: 1 },
    },
  ],
  
  indicators: [
    {
      id: 'working-age-functional',
      name: 'Arbetsför befolkning i funktion (18–64)',
      description: 'Andel personer 18–64 som kan arbeta eller studera.',
      assignmentId: 'minister-social',
      startValue: 71.4,
      endValue: 70.6,
      changePercent: -0.8,
      unit: '%',
      trend: 'declined' as const,
      quartersDeclined: 12,
      quartersTotal: 16,
      timeline: [
        { period: '2019 Q1–Q3', description: 'Stabilt' },
        { period: '2019 Q4–2021 Q2', description: 'Gradvis försämring' },
        { period: '2021 Q3–2022 Q3', description: 'Oförändrat låg nivå' },
      ],
      note: 'Utfallet sammanfaller i tid med ökade långtidssjukskrivningar. Kausalitet fastställs inte.',
      source: 'SCB',
    },
    {
      id: 'long-term-sick',
      name: 'Långvarig sjukskrivning',
      description: 'Antal personer med sjukskrivning över 90 dagar.',
      assignmentId: 'minister-social',
      startValue: 100,
      endValue: 109,
      changePercent: 9,
      unit: 'index',
      trend: 'declined' as const,
      uncertainty: 'medium',
      source: 'Socialstyrelsen',
    },
    {
      id: 'excess-mortality',
      name: 'Överdödlighet',
      description: 'Avvikelse från förväntad dödlighet baserat på 5-årsbaslinjen.',
      assignmentId: 'minister-social',
      startValue: 0,
      endValue: 3.1,
      changePercent: 3.1,
      unit: '%',
      trend: 'varied' as const,
      note: 'Visar fler dödsfall än normalt för perioden. Påverkas av flera externa faktorer.',
      source: 'Socialstyrelsen',
    },
  ],
};

function OutcomeBar({ improved, neutral, declined }: { improved: number; neutral: number; declined: number }) {
  const total = improved + neutral + declined;
  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden">
        <div 
          className="bg-status-positive" 
          style={{ width: `${(improved / total) * 100}%` }}
        />
        <div 
          className="bg-muted-foreground" 
          style={{ width: `${(neutral / total) * 100}%` }}
        />
        <div 
          className="bg-status-critical" 
          style={{ width: `${(declined / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-status-positive" />
          Positiv: {improved}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          Neutral: {neutral}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-status-critical" />
          Negativ: {declined}
        </span>
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: 'improved' | 'declined' | 'neutral' | 'varied' }) {
  if (trend === 'improved') return <TrendingUp className="h-4 w-4 text-status-positive" />;
  if (trend === 'declined') return <TrendingDown className="h-4 w-4 text-status-critical" />;
  if (trend === 'varied') return <BarChart3 className="h-4 w-4 text-status-warning" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function FictionalProfileDemo() {
  const [selectedAssignment, setSelectedAssignment] = useState(DEMO_PROFILE.assignments[0].id);
  const currentAssignment = DEMO_PROFILE.assignments.find(a => a.id === selectedAssignment)!;
  const assignmentIndicators = DEMO_PROFILE.indicators.filter(i => i.assignmentId === selectedAssignment);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Demo Notice */}
      <Alert className="bg-amber-500/10 border-amber-500/30">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Fiktiv demonstration</AlertTitle>
        <AlertDescription>
          Detta är en fiktiv profil för att visa hur verkliga profiler kommer att se ut. 
          All data är påhittad.
        </AlertDescription>
      </Alert>

      {/* E. Politikerprofiler disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{LEGAL_DISCLAIMERS.profile.title}</AlertTitle>
        <AlertDescription className="text-sm">
          {LEGAL_DISCLAIMERS.profile.text}
        </AlertDescription>
      </Alert>

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{DEMO_PROFILE.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{DEMO_PROFILE.party}</Badge>
                  <span>•</span>
                  <span>Född {DEMO_PROFILE.birthYear}</span>
                </CardDescription>
              </div>
            </div>
            <DataLayerIndicator layer="source" variant="badge" />
          </div>
        </CardHeader>
        <CardContent>
          <SourceAttribution
            sourceName="Wikipedia"
            sourceUrl={DEMO_PROFILE.wikipediaUrl}
            license="CC BY-SA"
            lastUpdated={DEMO_PROFILE.lastVerified}
            variant="compact"
          />
        </CardContent>
      </Card>

      {/* Assignments Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Offentliga uppdrag
              </CardTitle>
              <CardDescription>
                {LEGAL_DISCLAIMERS.responsibility.text}
              </CardDescription>
            </div>
            <DataLayerIndicator layer="source" variant="minimal" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {DEMO_PROFILE.assignments.map((assignment) => (
            <button
              key={assignment.id}
              onClick={() => setSelectedAssignment(assignment.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAssignment === assignment.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.startDate.slice(0, 4)}–{assignment.endDate.slice(0, 4)} 
                    <span className="mx-2">•</span>
                    {assignment.months} månader
                  </p>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform ${
                  selectedAssignment === assignment.id ? 'rotate-90' : ''
                }`} />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Assignment Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Ansvar & observerade utfall
              </CardTitle>
              <CardDescription>
                {LEGAL_DISCLAIMERS.analysis.text}
              </CardDescription>
            </div>
            <DataLayerIndicator layer="aggregation" variant="badge" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{currentAssignment.months}</p>
              <p className="text-xs text-muted-foreground">Månader i ansvar</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{currentAssignment.relevantKPIs}</p>
              <p className="text-xs text-muted-foreground">Relevanta indikatorer</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">
                {currentAssignment.outcomes.improved}/{currentAssignment.relevantKPIs}
              </p>
              <p className="text-xs text-muted-foreground">Positiv utveckling</p>
            </div>
          </div>

          {/* Outcome Distribution */}
          <div>
            <p className="text-sm font-medium mb-2">Utfallsfördelning (aggregerad)</p>
            <OutcomeBar {...currentAssignment.outcomes} />
            <p className="text-xs text-muted-foreground mt-2 italic">
              Baseras på observerad utveckling under ansvarstiden. Ingen värdering.
            </p>
          </div>

          <Separator />

          {/* Indicators */}
          <div className="space-y-4">
            <h4 className="font-medium">Relevanta indikatorer</h4>
            
            {assignmentIndicators.map((indicator) => (
              <Card key={indicator.id} className="bg-muted/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendIcon trend={indicator.trend} />
                        {indicator.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {indicator.description}
                      </CardDescription>
                    </div>
                    <MethodologyDisclosure
                      dataType="kpi"
                      kpiCode={indicator.id}
                      sources={[{
                        name: indicator.source,
                        url: '#',
                        license: 'Öppna data',
                      }]}
                      variant="icon"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Values */}
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Före</p>
                      <p className="text-lg font-bold">{indicator.startValue}{indicator.unit}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Efter</p>
                      <p className="text-lg font-bold">{indicator.endValue}{indicator.unit}</p>
                    </div>
                    <Badge 
                      variant={indicator.changePercent < 0 ? 'destructive' : indicator.changePercent > 0 ? 'default' : 'secondary'}
                      className="ml-auto"
                    >
                      {indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent}{indicator.unit === '%' ? ' p.e.' : '%'}
                    </Badge>
                  </div>

                  {/* Timeline if exists */}
                  {indicator.timeline && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Tidslinje</p>
                      {indicator.timeline.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-muted-foreground">{t.period}</span>
                          <span className="text-foreground">{t.description}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Note */}
                  {indicator.note && (
                    <Alert className="bg-muted/50">
                      <Info className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        {indicator.note}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Source */}
                  <SourceAttribution
                    sourceName={indicator.source}
                    sourceUrl="#"
                    license="Öppna data"
                    variant="inline"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Method & Traceability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Metod & spårbarhet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Datakällor</p>
              <p>Myndighetsstatistik (öppen), Wikipedia (grundfakta)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Aggregering</p>
              <p>Fast metod (<a href="#" className="underline">visa metod</a>)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tidsfönster</p>
              <p>Kvartal</p>
            </div>
            <div>
              <p className="text-muted-foreground">Klassificering</p>
              <p>Positiv/Neutral/Negativ enligt publicerade regler</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* F. Correction Notice */}
      <Alert className="bg-muted/30">
        <Shield className="h-4 w-4" />
        <AlertTitle>{LEGAL_DISCLAIMERS.correction.title}</AlertTitle>
        <AlertDescription className="text-sm">
          {LEGAL_DISCLAIMERS.correction.text}
        </AlertDescription>
      </Alert>

      {/* Global Footer Disclaimer */}
      <footer className="text-xs text-muted-foreground border-t pt-6 space-y-2">
        <p className="font-medium">{LEGAL_DISCLAIMERS.global.title}</p>
        <p>{LEGAL_DISCLAIMERS.global.text}</p>
        <div className="flex items-center gap-4 pt-2">
          <MethodologyDisclosure
            dataType="profile"
            variant="link"
          />
          <a href="#" className="underline underline-offset-2">Datakällor</a>
          <a href="#" className="underline underline-offset-2">Om systemet</a>
        </div>
      </footer>
    </div>
  );
}
