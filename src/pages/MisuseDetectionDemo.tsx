/**
 * Block 21: Governance, Integrity & Anti-Corruption Layer Demo
 * 
 * Innehåller:
 * - Anti-Feature List
 * - Red Team Analysis
 * - System Health Dashboard
 * - Accountability Chain
 */

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MisuseDetectionPanel } from '@/components/transparency/MisuseDetectionPanel';
import { SystemBreadcrumbs } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, XCircle, Lock, AlertTriangle, 
  Eye, CheckCircle, Users, FileText 
} from 'lucide-react';
import {
  ANTI_FEATURE_LIST,
  ANTI_FEATURE_POLICY,
  RED_TEAM_QUESTIONS,
  RED_TEAM_PRINCIPLE,
  ACCOUNTABILITY_ROLES,
  ACCOUNTABILITY_PRINCIPLE,
  NO_PERSONALITY_CULT,
  OPEN_CHALLENGE_POLICY,
  BLOCK_21_DONE_WHEN,
} from '@/config/governanceConfig';

// === ANTI-FEATURE LIST COMPONENT ===
function AntiFeatureList() {
  return (
    <div className="space-y-4">
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium">
            Saker som ALDRIG kommer byggas
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {ANTI_FEATURE_POLICY.changeProcessSv}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {ANTI_FEATURE_LIST.map(feature => (
          <Card key={feature.id} className="border-dashed border-destructive/30">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm">{feature.featureSv}</CardTitle>
                </div>
                {feature.permanent && (
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Permanent
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{feature.rationaleSv}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4 text-center">
          <p className="text-sm italic">"{ANTI_FEATURE_POLICY.statementSv}"</p>
        </CardContent>
      </Card>
    </div>
  );
}

// === RED TEAM SECTION ===
function RedTeamSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">Red Team Princip</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{RED_TEAM_PRINCIPLE.statementSv}"
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {RED_TEAM_QUESTIONS.map((q, i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{q.qSv}</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.q}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Analysprocess
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>För varje ny funktion dokumenteras:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Risker för misstolkning, cherry-picking, propaganda, kontextförlust</li>
            <li>Riskklass (låg / medel / hög / kritisk)</li>
            <li>Skyddsmekanismer och UI-begränsningar</li>
            <li>Obligatoriska varningar och språkjusteringar</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// === ACCOUNTABILITY SECTION ===
function AccountabilitySection() {
  return (
    <div className="space-y-4">
      <Card className="bg-muted/30">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium">
            "{ACCOUNTABILITY_PRINCIPLE.statementSv}"
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {ACCOUNTABILITY_ROLES.map(role => (
          <Card key={role.domain}>
            <CardContent className="py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{role.roleNameSv}</span>
                <div className="flex gap-1">
                  {role.isNamed && <Badge variant="outline" className="text-xs">Namngiven</Badge>}
                  {role.isTraceable && <Badge variant="outline" className="text-xs">Spårbar</Badge>}
                  {role.isLogged && <Badge variant="outline" className="text-xs">Loggad</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Ingen personkult – Någonsin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {NO_PERSONALITY_CULT.rules.map((r, i) => (
              <li key={i} className="flex items-center gap-2">
                <XCircle className="h-3 w-3 text-destructive" />
                {r.ruleSv}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm italic border-t pt-3">
            "{NO_PERSONALITY_CULT.identitySv}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// === OPEN CHALLENGE SECTION ===
function OpenChallengeSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4 text-center">
          <p className="text-sm font-medium">
            "{OPEN_CHALLENGE_POLICY.statementSv}"
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vem kan utmana?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Externa forskare</li>
              <li>• Journalister</li>
              <li>• Analytiker</li>
              <li>• Vem som helst</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vad kan utmanas?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Metod</li>
              <li>• Viktning</li>
              <li>• Dataval</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-3">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-1" />
              <p className="font-medium">All feedback</p>
              <p className="text-xs text-muted-foreground">Offentlig</p>
            </div>
            <div>
              <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-1" />
              <p className="font-medium">All feedback</p>
              <p className="text-xs text-muted-foreground">Besvarad</p>
            </div>
            <div>
              <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-1" />
              <p className="font-medium">All feedback</p>
              <p className="text-xs text-muted-foreground">Arkiverad</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// === MAIN PAGE ===
export default function MisuseDetectionDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <SystemBreadcrumbs
          items={[
            { label: 'System', labelSv: 'System', level: 'world', href: '/' },
            { label: 'Governance', labelSv: 'Governance', level: 'indicator' },
          ]}
        />

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Block 21: Governance & Integritet
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Säkerställer att systemet inte kan kidnappas – varken politiskt, kommersiellt eller ideologiskt.
          </p>
        </div>

        <Tabs defaultValue="anti-features">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="anti-features" className="text-xs">
              <XCircle className="h-3 w-3 mr-1" />
              Anti-Features
            </TabsTrigger>
            <TabsTrigger value="red-team" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Red Team
            </TabsTrigger>
            <TabsTrigger value="accountability" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Ansvar
            </TabsTrigger>
            <TabsTrigger value="challenge" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Utmaning
            </TabsTrigger>
            <TabsTrigger value="misuse" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Missbruk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anti-features" className="mt-4">
            <AntiFeatureList />
          </TabsContent>

          <TabsContent value="red-team" className="mt-4">
            <RedTeamSection />
          </TabsContent>

          <TabsContent value="accountability" className="mt-4">
            <AccountabilitySection />
          </TabsContent>

          <TabsContent value="challenge" className="mt-4">
            <OpenChallengeSection />
          </TabsContent>

          <TabsContent value="misuse" className="mt-4">
            <MisuseDetectionPanel />
          </TabsContent>
        </Tabs>

        {/* Block 21 completion criteria */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-4 text-center">
            <p className="text-sm font-medium mb-2">Definition of Done (Block 21)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {BLOCK_21_DONE_WHEN.criteriaSv.map((c, i) => (
                <Badge key={i} variant="outline">{c}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              "{BLOCK_21_DONE_WHEN.statementSv}"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
