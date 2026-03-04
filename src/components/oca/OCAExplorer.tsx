/**
 * OCA EXPLORER — Interactive Ontology Core Dashboard
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Shield, Database, GitBranch, AlertTriangle, Lock, Eye, Search,
  CheckCircle, XCircle, Snowflake, ArrowRight, Layers, Activity,
} from 'lucide-react';
import {
  getRegistry, getRegistryByType, getOCAHealth,
  runFullConflictScan, getActiveConflicts, getGovernanceLog,
} from '@/core/oca/engine';
import { OCA_SEED_RELATIONSHIPS } from '@/core/oca/seed-data';
import type { OCARegistryEntry, OCAConflict, OCAObjectType } from '@/core/oca/types';

const TYPE_ICONS: Record<OCAObjectType, React.ReactNode> = {
  entity: <Database className="h-4 w-4" />,
  variable: <Activity className="h-4 w-4" />,
  state: <Eye className="h-4 w-4" />,
  intervention: <GitBranch className="h-4 w-4" />,
  relationship: <ArrowRight className="h-4 w-4" />,
};

const TYPE_COLORS: Record<OCAObjectType, string> = {
  entity: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  variable: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  state: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  intervention: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  relationship: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

const STATUS_BADGE: Record<string, string> = {
  frozen: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  validated: 'bg-green-500/10 text-green-400 border-green-500/30',
  proposed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  deprecated: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function OCAExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<OCARegistryEntry | null>(null);
  const [conflicts, setConflicts] = useState<OCAConflict[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  const registry = useMemo(() => getRegistry(), []);
  const health = useMemo(() => getOCAHealth(), []);
  const governance = useMemo(() => getGovernanceLog(), []);
  const relationships = OCA_SEED_RELATIONSHIPS;

  const filteredRegistry = useMemo(() => {
    if (!searchQuery) return registry;
    const q = searchQuery.toLowerCase();
    return registry.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.domain.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q)
    );
  }, [registry, searchQuery]);

  const handleScan = () => {
    const found = runFullConflictScan();
    setConflicts([...getActiveConflicts(), ...found]);
    setHasScanned(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Ontology Core Architecture
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            5 fundamentala objekttyper · Förhindrar ontologisk kollaps · v{health.ontology_version}
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs px-3 py-1">
          <Lock className="h-3 w-3 mr-1" />
          {health.frozen_entries} frusna koncept
        </Badge>
      </div>

      {/* The 5 Fundamental Types */}
      <div className="grid grid-cols-5 gap-3">
        {(['entity', 'variable', 'state', 'intervention', 'relationship'] as OCAObjectType[]).map(type => {
          const count = type === 'state' ? 0 : getRegistryByType(type).length;
          return (
            <Card key={type} className={`border ${TYPE_COLORS[type]} bg-card`}>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">{TYPE_ICONS[type]}</div>
                <p className="font-mono text-sm font-bold uppercase">{type}</p>
                <p className="text-2xl font-bold mt-1">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {type === 'entity' && 'Något som existerar'}
                  {type === 'variable' && 'Mätbar egenskap'}
                  {type === 'state' && 'Värde vid tidpunkt'}
                  {type === 'intervention' && 'Förändring i systemet'}
                  {type === 'relationship' && 'Hur saker påverkar'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Core Formula */}
      <Card className="border-primary/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-3 font-mono text-sm flex-wrap">
            <Badge className={TYPE_COLORS.entity}>ENTITY</Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge className={TYPE_COLORS.variable}>VARIABLE</Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge className={TYPE_COLORS.state}>STATE</Badge>
            <span className="text-muted-foreground mx-2">|</span>
            <Badge className={TYPE_COLORS.intervention}>INTERVENTION</Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge className={TYPE_COLORS.relationship}>RELATIONSHIP</Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge className="bg-primary/10 text-primary border-primary/30">OUTCOME</Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            All kunskap i hela systemet reduceras till denna struktur
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="registry">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="registry">Register</TabsTrigger>
          <TabsTrigger value="relationships">Relationer</TabsTrigger>
          <TabsTrigger value="conflicts">Konflikter</TabsTrigger>
          <TabsTrigger value="governance">Styrning</TabsTrigger>
          <TabsTrigger value="health">Hälsa</TabsTrigger>
        </TabsList>

        {/* REGISTRY TAB */}
        <TabsContent value="registry" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök koncept, kod, domän..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-2">
            {filteredRegistry.map(entry => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="w-full text-left"
              >
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`p-2 rounded ${TYPE_COLORS[entry.object_type]}`}>
                      {TYPE_ICONS[entry.object_type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-medium truncate">{entry.name}</p>
                        <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                          {entry.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{entry.definition}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px]">{entry.domain}</Badge>
                      <Badge className={`text-[10px] ${STATUS_BADGE[entry.validation_status] || ''}`}>
                        {entry.validation_status === 'frozen' && <Snowflake className="h-3 w-3 mr-1" />}
                        {entry.validation_status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* RELATIONSHIPS TAB */}
        <TabsContent value="relationships" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Kausala relationer i ontologin — varje koppling har evidensnivå, styrka och tidsförskjutning.
          </p>
          <div className="grid gap-2">
            {relationships.map(rel => (
              <Card key={rel.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={TYPE_COLORS[rel.source_type]}>{rel.source_id.split(':').pop()}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="font-mono text-xs">
                      {rel.relationship_type}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge className={TYPE_COLORS[rel.target_type]}>{rel.target_id.split(':').pop()}</Badge>
                    <div className="ml-auto flex gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        styrka: {(rel.strength * 100).toFixed(0)}%
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        konfidens: {(rel.confidence * 100).toFixed(0)}%
                      </Badge>
                      {rel.temporal_delay_days && (
                        <Badge variant="outline" className="text-[10px]">
                          fördröjning: {rel.temporal_delay_days}d
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${rel.is_causal ? 'text-green-400' : 'text-yellow-400'}`}>
                        {rel.is_causal ? 'kausal' : 'korrelation'}
                      </Badge>
                    </div>
                  </div>
                  {rel.mechanism_description && (
                    <p className="text-xs text-muted-foreground mt-2 pl-2 border-l-2 border-muted">
                      {rel.mechanism_description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* CONFLICTS TAB */}
        <TabsContent value="conflicts" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Ontologisk konfliktdetektering — duplicat, definitionskonflikter, semantisk överlapp.
            </p>
            <Button onClick={handleScan} size="sm" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Kör fullständig skanning
            </Button>
          </div>

          {hasScanned && conflicts.length === 0 && (
            <Card className="border-green-500/30">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-sm">Inga aktiva konflikter. Ontologin är konsistent.</p>
              </CardContent>
            </Card>
          )}

          {conflicts.map(conflict => (
            <Card key={conflict.id} className={conflict.severity === 'critical' ? 'border-red-500/50' : ''}>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className={`h-4 w-4 ${conflict.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
                  <p className="text-sm font-medium">{conflict.description}</p>
                  <Badge variant="outline" className="ml-auto text-[10px]">{conflict.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Föreslagen lösning: {conflict.suggested_resolution}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* GOVERNANCE TAB */}
        <TabsContent value="governance" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Alla förändringar i ontologin loggas och kräver steward-godkännande.
          </p>
          {governance.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                Inga styrningsåtgärder har utförts ännu.
              </CardContent>
            </Card>
          ) : (
            governance.map(entry => (
              <Card key={entry.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] font-mono">{entry.action}</Badge>
                  <p className="text-sm flex-1">{entry.object_name}</p>
                  <p className="text-xs text-muted-foreground">{entry.reason}</p>
                  <Badge variant="outline" className="text-[10px]">v{entry.ontology_version_after}</Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* HEALTH TAB */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{health.total_registry_entries}</p>
                <p className="text-xs text-muted-foreground">Registrerade koncept</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{health.frozen_entries}</p>
                <p className="text-xs text-muted-foreground">Frusna (oföränderliga)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{(health.avg_semantic_consistency * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Semantisk konsistens</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono">Domäntäckning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {health.domains_covered.map(d => (
                  <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="py-4 text-center space-y-2">
              <Layers className="h-6 w-6 mx-auto text-primary" />
              <p className="font-mono text-sm font-bold">Varför denna ontologi skyddar mot kollaps</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground max-w-md mx-auto">
                <p>5 typer — inte fler, aldrig färre</p>
                <p>Semantisk hash förhindrar drift</p>
                <p>Frysning gör koncept oföränderliga</p>
                <p>Konfliktdetektering vid varje insert</p>
                <p>Versionering behåller historik</p>
                <p>Alla domäner samma språk</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-lg">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono flex items-center gap-2">
                  {TYPE_ICONS[selectedEntry.object_type]}
                  {selectedEntry.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={TYPE_COLORS[selectedEntry.object_type]}>{selectedEntry.object_type}</Badge>
                  <Badge variant="outline" className="font-mono text-xs">{selectedEntry.code}</Badge>
                  <Badge className={STATUS_BADGE[selectedEntry.validation_status] || ''}>
                    {selectedEntry.validation_status}
                  </Badge>
                  <Badge variant="outline">{selectedEntry.domain}</Badge>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">DEFINITION</p>
                  <p className="text-sm">{selectedEntry.definition}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Semantic Hash</p>
                    <p className="font-mono">{selectedEntry.semantic_hash}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Första källa</p>
                    <p>{selectedEntry.first_source}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Skapad</p>
                    <p>{new Date(selectedEntry.created_at).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frusen</p>
                    <p>{selectedEntry.frozen_at ? new Date(selectedEntry.frozen_at).toLocaleDateString('sv-SE') : '—'}</p>
                  </div>
                </div>

                {/* Show related relationships */}
                {relationships.filter(r => r.source_id === selectedEntry.id || r.target_id === selectedEntry.id).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">RELATIONER</p>
                      <div className="space-y-1">
                        {relationships
                          .filter(r => r.source_id === selectedEntry.id || r.target_id === selectedEntry.id)
                          .map(r => (
                            <div key={r.id} className="flex items-center gap-2 text-xs">
                              <span className="font-mono">{r.source_id.split(':').pop()}</span>
                              <ArrowRight className="h-3 w-3" />
                              <Badge variant="outline" className="text-[10px]">{r.relationship_type}</Badge>
                              <ArrowRight className="h-3 w-3" />
                              <span className="font-mono">{r.target_id.split(':').pop()}</span>
                              <span className="text-muted-foreground ml-auto">{(r.strength * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
