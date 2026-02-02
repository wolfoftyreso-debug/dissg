import React from 'react';
import { DecisionTimelineView } from '@/components/dashboard/DecisionTimelineView';
import { GlobalDisclaimer } from '@/components/transparency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Info, Shield } from 'lucide-react';

export default function DecisionTimeline() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b border-border bg-card/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-mono text-lg font-semibold uppercase tracking-wider">
                Nationellt Läge
              </h1>
              <p className="text-xs text-muted-foreground">
                Offentlig Styrning — NOGF
              </p>
            </div>
          </div>
          <Link 
            to="/public" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Intern vy ↗
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to="/public" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka till dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Beslutstidslinje</h1>
          <p className="text-muted-foreground max-w-2xl">
            Visualisering av policy-beslut i relation till KPI-förändringar över tid. 
            Systemet visar korrelationer – inte kausalitet.
          </p>
        </div>

        {/* Info card */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Hur tidslinjen fungerar</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• <span className="text-primary">Policy-beslut</span> visas med datum och berörda KPI:er</li>
                  <li>• <span className="text-blue-500">Händelser</span> markerar reformer, lagändringar och budgetbeslut</li>
                  <li>• <span className="text-green-500">KPI-förändringar</span> visar signifikanta rörelser (&gt;2%)</li>
                  <li>• Effektivitetsberäkning baseras på observerade trender efter beslut</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main timeline */}
        <DecisionTimelineView className="mb-8" />

        {/* Methodology note */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Metodologisk anmärkning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Tidslinjen visar <strong>korrelationer i tid</strong> mellan politiska beslut och 
              förändringar i KPI-värden. Detta innebär inte att besluten orsakade förändringarna.
            </p>
            <p>
              Effektivitetsberäkningen baseras på andelen positiva KPI-trender efter beslutsdatum 
              för de KPI:er som identifierats som målvariabler. Många faktorer påverkar samhällsutfall 
              och enskilda beslut kan sällan tillskrivas isolerad effekt.
            </p>
            <p>
              <strong>Datakällor:</strong> Riksdagens dokument, regeringskansliets publikationer, 
              SCB, Kolada, och myndighetsrapporter.
            </p>
          </CardContent>
        </Card>

        <GlobalDisclaimer className="mt-8" />
      </main>
    </div>
  );
}
