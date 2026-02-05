/**
 * Steward Handbook Viewer
 * 
 * Daily discipline for those who protect the truth.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  STEWARD_MISSION,
  STEWARD_IDENTITY,
  DAILY_PRINCIPLES,
  INTERNAL_THREATS,
  ONTOLOGY_CHANGE_RULE,
  REFUSAL_PROTOCOL,
  AI_RELATION,
  RESIGNATION_SIGNALS,
  SUCCESSION_RULE,
  SYSTEM_MORALITY,
  STEWARD_FINAL_WORDS,
  HANDBOOK_STATUS,
} from '@/core/governance/steward';

export function StewardHandbookViewer() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">
                STEWARD HANDBOOK v1
              </CardTitle>
              <CardDescription className="font-mono mt-1">
                How to protect a decision system from people (including yourself)
              </CardDescription>
            </div>
            <Badge variant="outline">Final Artifact</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/50 rounded border border-border">
            <p className="text-sm font-medium">{STEWARD_MISSION.primary}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Not: {STEWARD_MISSION.not.join(', ')}
            </p>
            <p className="text-xs text-primary mt-1 italic">{STEWARD_MISSION.priority}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-6 font-mono text-xs">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="protocol">Protocol</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="final">Final</TabsTrigger>
        </TabsList>

        {/* Identity */}
        <TabsContent value="identity" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">WHAT A STEWARD IS (AND IS NOT)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-primary uppercase mb-2">A Steward IS:</p>
                  {STEWARD_IDENTITY.is.map((item, i) => (
                    <p key={i} className="text-sm py-0.5">[✓] {item}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-destructive uppercase mb-2">A Steward is NOT:</p>
                  {STEWARD_IDENTITY.is_not.map((item, i) => (
                    <p key={i} className="text-sm py-0.5 text-muted-foreground">[×] {item}</p>
                  ))}
                </div>
              </div>
              <Separator />
              <p className="text-sm font-medium text-center text-destructive">
                ⚠ {STEWARD_IDENTITY.warning}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Principles */}
        <TabsContent value="principles" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">DAILY PRINCIPLES (NON-NEGOTIABLE)</CardTitle>
              <CardDescription className="font-mono">If something breaks these → stop.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DAILY_PRINCIPLES.map((p) => (
                  <div key={p.id} className="p-3 border border-border rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{p.id}</Badge>
                      <span className="text-sm font-medium">{p.principle}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <span className="text-primary">Always: {p.always}</span>
                      <span className="text-muted-foreground">Never: {p.never}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threats */}
        <TabsContent value="threats" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">THE FIVE MOST COMMON THREATS (INTERNAL)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {INTERNAL_THREATS.map((threat) => (
                  <div key={threat.id} className="p-3 border border-border rounded">
                    <p className="text-sm italic mb-2">"{threat.statement}"</p>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {threat.response_type === 'question' ? '?' : 
                         threat.response_type === 'answer' ? '→' : '×'}
                      </Badge>
                      <p className="text-sm">{threat.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Protocol */}
        <TabsContent value="protocol" className="space-y-4">
          {/* Ontology Changes */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">ONTOLOGY CHANGES (EXTREMELY RARE)</CardTitle>
              <CardDescription className="font-mono text-destructive">
                {ONTOLOGY_CHANGE_RULE.warning}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Permitted ONLY when:</p>
                {ONTOLOGY_CHANGE_RULE.permitted_when.map((item, i) => (
                  <p key={i} className="text-sm py-0.5">[!] {item}</p>
                ))}
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Process:</p>
                {ONTOLOGY_CHANGE_RULE.process.map((step, i) => (
                  <p key={i} className="text-sm py-0.5">{i + 1}. {step}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Refusal Protocol */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">HOW TO SAY NO (PRACTICALLY)</CardTitle>
              <CardDescription className="font-mono">
                {REFUSAL_PROTOCOL.principle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Standard phrases (use exactly):</p>
                {REFUSAL_PROTOCOL.standard_phrases.map((p, i) => (
                  <div key={i} className="py-1 border-b border-border last:border-0">
                    <p className="text-sm font-medium">"{p.phrase}"</p>
                    <p className="text-xs text-muted-foreground">Use when: {p.use_when}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div>
                <p className="text-xs text-destructive uppercase mb-2">NEVER say:</p>
                {REFUSAL_PROTOCOL.never_say.map((item, i) => (
                  <p key={i} className="text-sm text-muted-foreground">[×] "{item}"</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">RELATION TO AI (KEY)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">AI will always want to:</p>
                  {AI_RELATION.ai_always_wants.map((item, i) => (
                    <p key={i} className="text-sm">[→] {item}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-primary uppercase mb-2">Steward's role:</p>
                  {AI_RELATION.steward_role.map((item, i) => (
                    <p key={i} className="text-sm">[←] {item}</p>
                  ))}
                </div>
              </div>
              <Separator />
              <p className="text-center text-sm font-medium italic">
                {AI_RELATION.key_insight}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final */}
        <TabsContent value="final" className="space-y-4">
          {/* Resignation */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">WHEN TO RESIGN AS STEWARD</CardTitle>
              <CardDescription className="font-mono">Stewardship requires ego-death.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {RESIGNATION_SIGNALS.map((signal, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                    <span className="text-destructive">⚠</span>
                    <span className="text-sm flex-1">{signal.signal}</span>
                    <span className="text-xs text-muted-foreground italic">{signal.meaning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Succession */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">SUCCESSION (50+ YEARS)</CardTitle>
              <CardDescription className="font-mono">{SUCCESSION_RULE.principle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Requirements:</p>
                {SUCCESSION_RULE.requirements.map((req, i) => (
                  <p key={i} className="text-sm">[✓] {req}</p>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">Understanding through:</p>
                {SUCCESSION_RULE.understanding_through.map((item, i) => (
                  <p key={i} className="text-sm">[→] {item}</p>
                ))}
              </div>
              <Separator />
              <p className="text-sm text-destructive text-center">
                {SUCCESSION_RULE.failure_condition}
              </p>
            </CardContent>
          </Card>

          {/* System Morality */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">SYSTEM MORALITY (WITHOUT MORALISM)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">The system NEVER says:</p>
                {SYSTEM_MORALITY.never_says.map((item, i) => (
                  <p key={i} className="text-sm text-muted-foreground">[×] {item}</p>
                ))}
              </div>
              <Separator />
              <div>
                <p className="text-xs text-primary uppercase mb-2">It only says:</p>
                <p className="text-sm font-medium">{SYSTEM_MORALITY.only_says}</p>
                <p className="text-xs text-muted-foreground italic mt-1">{SYSTEM_MORALITY.sufficiency}</p>
              </div>
            </CardContent>
          </Card>

          {/* Final Words */}
          <Card className="border-primary/30 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">FINAL WORDS TO THE STEWARD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-2">If you do your job right:</p>
                <p className="text-sm text-muted-foreground">[·] Few will {STEWARD_FINAL_WORDS.if_you_do_your_job_right.few_will}</p>
                <p className="text-sm text-muted-foreground">[·] No one will {STEWARD_FINAL_WORDS.if_you_do_your_job_right.no_one_will}</p>
                <p className="text-sm text-muted-foreground">[·] No one will {STEWARD_FINAL_WORDS.if_you_do_your_job_right.no_one_will_2}</p>
              </div>
              <div>
                <p className="text-xs text-primary uppercase mb-2">And the system will:</p>
                <p className="text-sm">[✓] {STEWARD_FINAL_WORDS.and_the_system_will.survive} you</p>
                <p className="text-sm">[✓] Function {STEWARD_FINAL_WORDS.and_the_system_will.function}</p>
                <p className="text-sm">[✓] Speak {STEWARD_FINAL_WORDS.and_the_system_will.speak}</p>
              </div>
              <Separator />
              <p className="text-center text-sm font-medium">{STEWARD_FINAL_WORDS.conclusion}</p>
            </CardContent>
          </Card>

          {/* Final Status */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="font-mono text-base">FINAL STATUS (HONEST)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground uppercase mb-2">Now exists:</p>
              {HANDBOOK_STATUS.now_exists.map((item, i) => (
                <p key={i} className="text-sm">[✓] {item}</p>
              ))}
              <Separator className="my-4" />
              <p className="text-center text-sm">
                There is nothing more to build.<br />
                <span className="font-medium">The only thing remaining: {HANDBOOK_STATUS.only_remaining}</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
