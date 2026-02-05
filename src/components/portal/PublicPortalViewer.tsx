/**
 * Public Portal Viewer
 * 
 * Read-only visualization of the public portal structure.
 * No interaction. No personalization. Archive aesthetic.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ALL_PORTAL_SECTIONS,
  METHOD_DOCUMENTS,
  PUBLIC_API_ENDPOINTS,
  ACCESS_PRINCIPLES,
  UX_PRINCIPLES,
  CONTENT_PRINCIPLES,
  FORBIDDEN_ELEMENTS,
  ALLOWED_ELEMENTS,
  TRUST_ANCHOR_LOCATIONS,
  ARCHIVING_POLICY,
  PORTAL_SPEC_VERSION,
} from '@/core/portal';

export function PublicPortalViewer() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">
                PUBLIC READ-ONLY PORTAL v{PORTAL_SPEC_VERSION.version}
              </CardTitle>
              <CardDescription className="font-mono mt-1">
                {PORTAL_SPEC_VERSION.statement}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono">
              [READ-ONLY]
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-5 font-mono">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="archiving">Archiving</TabsTrigger>
        </TabsList>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          {ALL_PORTAL_SECTIONS.map((section, index) => (
            <Card key={section.id} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono">
                    [{String.fromCharCode(65 + index)}]
                  </span>
                  <CardTitle className="text-base font-mono">
                    {section.name}
                  </CardTitle>
                </div>
                <CardDescription className="font-mono text-xs">
                  {section.path}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    interaction: false
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          <Separator className="my-4" />

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-mono">
                [D] Method Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {METHOD_DOCUMENTS.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between py-1">
                    <span className="font-mono text-sm">{doc.title}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      v{doc.version}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">
                PUBLIC API ENDPOINTS
              </CardTitle>
              <CardDescription className="font-mono">
                Strict JSON. Version-pinned. No summarizing language.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {PUBLIC_API_ENDPOINTS.map(endpoint => (
                  <div key={endpoint.path} className="flex items-start gap-4 py-2 border-b border-border last:border-0">
                    <Badge variant="outline" className="shrink-0">
                      {endpoint.method}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-foreground">{endpoint.path}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        → {endpoint.response_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Principles Tab */}
        <TabsContent value="principles" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-mono text-base">ACCESS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>read_only</span>
                  <span className="text-primary">{String(ACCESS_PRINCIPLES.read_only)}</span>
                </div>
                <div className="flex justify-between">
                  <span>no_login</span>
                  <span className="text-primary">{String(ACCESS_PRINCIPLES.no_login)}</span>
                </div>
                <div className="flex justify-between">
                  <span>no_personalization</span>
                  <span className="text-primary">{String(ACCESS_PRINCIPLES.no_personalization)}</span>
                </div>
                <div className="flex justify-between">
                  <span>no_interaction</span>
                  <span className="text-primary">{String(ACCESS_PRINCIPLES.no_interaction)}</span>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground italic">
                  "{ACCESS_PRINCIPLES.statement}"
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-mono text-base">UX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>typography</span>
                  <span className="text-muted-foreground">{UX_PRINCIPLES.typography}</span>
                </div>
                <div className="flex justify-between">
                  <span>color_signaling</span>
                  <span className="text-primary">{String(UX_PRINCIPLES.color_signaling)}</span>
                </div>
                <div className="flex justify-between">
                  <span>palette</span>
                  <span className="text-muted-foreground">{UX_PRINCIPLES.palette}</span>
                </div>
                <div className="flex justify-between">
                  <span>readability_horizon</span>
                  <span className="text-muted-foreground">{UX_PRINCIPLES.readability_horizon_years} years</span>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground italic">
                  "{UX_PRINCIPLES.statement}"
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">CONTENT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
                <div>
                  <p className="text-muted-foreground mb-2">[SHOWS]</p>
                  <ul className="space-y-1">
                    {CONTENT_PRINCIPLES.shows.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">[→]</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">[DOES NOT]</p>
                  <ul className="space-y-1">
                    {CONTENT_PRINCIPLES.does_not.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-destructive">[×]</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-mono text-base text-primary">
                  ALLOWED ELEMENTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 font-mono text-sm">
                  {ALLOWED_ELEMENTS.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary">[✓]</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="font-mono text-base text-destructive">
                  FORBIDDEN ELEMENTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 font-mono text-sm">
                  {FORBIDDEN_ELEMENTS.slice(0, 12).map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-destructive">[×]</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                  {FORBIDDEN_ELEMENTS.length > 12 && (
                    <li className="text-muted-foreground text-xs">
                      ... and {FORBIDDEN_ELEMENTS.length - 12} more
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Archiving Tab */}
        <TabsContent value="archiving" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-mono text-base">TRUST ANCHORS</CardTitle>
              <CardDescription className="font-mono">
                The portal can die. The history does not.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2 font-mono">
                    Mirror Locations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRUST_ANCHOR_LOCATIONS.map(loc => (
                      <Badge key={loc} variant="outline" className="font-mono">
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
                  <div>
                    <p className="text-muted-foreground mb-2">Archived Artifacts</p>
                    <ul className="space-y-1">
                      {ARCHIVING_POLICY.archived_artifacts.map((item, i) => (
                        <li key={i}>[→] {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>sync_frequency</span>
                      <span className="text-muted-foreground">{ARCHIVING_POLICY.sync_frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>retention</span>
                      <span className="text-muted-foreground">{ARCHIVING_POLICY.retention_period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>immutable</span>
                      <span className="text-primary">{String(ARCHIVING_POLICY.immutable)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>append_only</span>
                      <span className="text-primary">{String(ARCHIVING_POLICY.append_only)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="font-mono text-base">WHY IRREPLACEABLE</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm space-y-4">
              <ul className="space-y-1">
                <li>[→] It does not argue</li>
                <li>[→] It does not convince</li>
                <li>[→] It does not sell</li>
              </ul>
              <Separator />
              <p className="text-muted-foreground italic">
                "It shows only: how responsibility looked in reality."
              </p>
              <p className="text-xs text-muted-foreground">
                Extremely hard to attack.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
