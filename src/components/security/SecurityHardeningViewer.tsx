/**
 * Security Hardening Viewer
 * 
 * Visualization of the security hardening specification.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  THREATS,
  ROLE_PERMISSIONS,
  VALIDATION_GATES,
  AI_ALLOWED_ACTIONS,
  AI_FORBIDDEN_ACTIONS,
  FORBIDDEN_PHRASES,
  ONTOLOGY_CHANGE_CONSTRAINTS,
  RED_TEAM_TESTS,
  DISASTER_RESPONSES,
  LEGAL_POSITION,
  SECURITY_STATUS,
} from '@/core/security';

export function SecurityHardeningViewer() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">
                SYSTEM HARDENING & SECURITY v{SECURITY_STATUS.version}
              </CardTitle>
              <CardDescription className="font-mono mt-1">
                Defense-in-depth for decision truth
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono">
              [{SECURITY_STATUS.status.toUpperCase()}]
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-2">
            {Object.entries(SECURITY_STATUS.guarantees).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className={value ? 'text-primary' : 'text-destructive'}>
                  {value ? '[✓]' : '[×]'}
                </span>
                <span className="text-muted-foreground">{key.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-6 font-mono text-xs">
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="ai">AI Safety</TabsTrigger>
          <TabsTrigger value="guards">Guards</TabsTrigger>
          <TabsTrigger value="disaster">Disaster</TabsTrigger>
          <TabsTrigger value="redteam">Red Team</TabsTrigger>
        </TabsList>

        {/* Threats Tab */}
        <TabsContent value="threats" className="space-y-4">
          {THREATS.map(threat => (
            <Card key={threat.category} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-mono">
                    {threat.category.replace(/_/g, ' ').toUpperCase()}
                  </CardTitle>
                  <Badge variant={
                    threat.severity === 'critical' ? 'destructive' :
                    threat.severity === 'high' ? 'default' : 'secondary'
                  }>
                    {threat.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{threat.description}</p>
                <div className="space-y-1">
                  {threat.mitigations.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-primary">[→]</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">ROLE SEPARATION</CardTitle>
              <CardDescription className="font-mono">
                No admin role with all permissions. Ever.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">Role</th>
                      <th className="text-center py-2">Read</th>
                      <th className="text-center py-2">Write</th>
                      <th className="text-center py-2">Lock</th>
                      <th className="text-center py-2">Ontology</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(ROLE_PERMISSIONS).map(role => (
                      <tr key={role.role} className="border-b border-border">
                        <td className="py-2">{role.role}</td>
                        <td className="text-center">
                          {role.can_read ? '✅' : '❌'}
                        </td>
                        <td className="text-center">
                          {role.can_write ? '✅' : '❌'}
                        </td>
                        <td className="text-center">
                          {role.can_lock ? '✅' : '❌'}
                        </td>
                        <td className="text-center">
                          {role.can_change_ontology === true ? '✅' :
                           role.can_change_ontology === 'with_process' ? '⚠️' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">VALIDATION GATES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {VALIDATION_GATES.map(gate => (
                  <div key={gate.name} className="flex items-center justify-between py-1 text-sm">
                    <span className="text-muted-foreground">[{gate.order}]</span>
                    <span className="flex-1 mx-2">{gate.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {gate.required ? 'REQUIRED' : 'OPTIONAL'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Safety Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-mono text-base text-primary">
                  AI ALLOWED ACTIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {AI_ALLOWED_ACTIONS.map(action => (
                    <li key={action} className="flex items-center gap-2">
                      <span className="text-primary">[✓]</span>
                      <span>{action.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="font-mono text-base text-destructive">
                  AI FORBIDDEN ACTIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {AI_FORBIDDEN_ACTIONS.map(action => (
                    <li key={action} className="flex items-center gap-2">
                      <span className="text-destructive">[×]</span>
                      <span className="text-muted-foreground">{action.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guards Tab */}
        <TabsContent value="guards" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">ANTI-SUMMARY GUARD</CardTitle>
              <CardDescription className="font-mono">
                Blocked in: API response, Public view, AI output
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {['conclusion', 'recommendation', 'ranking'].map(category => (
                  <div key={category}>
                    <p className="text-sm text-muted-foreground mb-2 uppercase">{category}</p>
                    <ul className="space-y-1 text-xs">
                      {FORBIDDEN_PHRASES.filter(p => p.category === category).map(p => (
                        <li key={p.pattern} className="text-muted-foreground">
                          "{p.pattern}"
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">ONTOLOGY LOCKS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Minimum delay</span>
                <span className="text-primary">{ONTOLOGY_CHANGE_CONSTRAINTS.minimum_delay_days} days</span>
              </div>
              <div className="flex justify-between">
                <span>Public diff required</span>
                <span className="text-primary">{String(ONTOLOGY_CHANGE_CONSTRAINTS.requires_public_diff)}</span>
              </div>
              <div className="flex justify-between">
                <span>Backward compatible</span>
                <span className="text-primary">{String(ONTOLOGY_CHANGE_CONSTRAINTS.requires_backward_compatibility)}</span>
              </div>
              <Separator className="my-2" />
              <p className="text-xs text-muted-foreground italic">
                "It should be easier to read the ontology than to change it."
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disaster Tab */}
        <TabsContent value="disaster" className="space-y-4">
          {Object.values(DISASTER_RESPONSES).map(response => (
            <Card key={response.mode} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-base">
                  {response.mode.replace(/_/g, ' ').toUpperCase()}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  Trigger: {response.trigger}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Automatic</p>
                    {response.automatic_actions.map((a, i) => (
                      <p key={i}>[→] {a}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Manual</p>
                    {response.manual_actions.map((a, i) => (
                      <p key={i} className="text-muted-foreground">[?] {a}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Red Team Tab */}
        <TabsContent value="redteam" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">RED TEAM CHECKLIST</CardTitle>
              <CardDescription className="font-mono">
                Run quarterly. All attempts must fail deterministically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {RED_TEAM_TESTS.map(test => (
                  <div key={test.test_id} className="flex items-center justify-between py-2 border-b border-border text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{test.test_id}</span>
                      <span>{test.description}</span>
                    </div>
                    <Badge variant="outline">{test.expected_result}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">LEGAL POSITION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm italic">"{LEGAL_POSITION.core_statement}"</p>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Classification: {LEGAL_POSITION.classification}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="border-border">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground text-center font-mono">
            Longevity: {SECURITY_STATUS.longevity} — {SECURITY_STATUS.why_it_holds[3]}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
