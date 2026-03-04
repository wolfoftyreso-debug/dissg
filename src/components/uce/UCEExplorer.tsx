/**
 * UCE EXPLORER — Universal Claim Engine Dashboard
 */

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SEED_CLAIMS,
  evaluateClaimEvidence,
  discoverChains,
  findCrossDomainLinks,
  detectConflicts,
  SEED_EVIDENCE,
} from '@/core/uce';
import type { UniversalClaim, ChainDiscoveryResult, CrossDomainLink, ClaimConflict } from '@/core/uce';
import { ArrowRight, GitBranch, AlertTriangle, Globe, Layers, Search, Zap, Brain } from 'lucide-react';

// Build full claims with IDs for the demo
const demoClaims: UniversalClaim[] = SEED_CLAIMS.map((c, i) => ({
  ...c,
  id: `uce-${i}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const DOMAIN_COLORS: Record<string, string> = {
  health: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  psychology: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  economics: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  society: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  environment: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  supported: 'bg-emerald-500/20 text-emerald-300',
  contested: 'bg-amber-500/20 text-amber-300',
  refuted: 'bg-red-500/20 text-red-300',
  proposed: 'bg-muted text-muted-foreground',
};

export default function UCEExplorer() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const filteredClaims = useMemo(
    () => selectedDomain ? demoClaims.filter(c => c.domain === selectedDomain) : demoClaims,
    [selectedDomain]
  );

  const chains = useMemo(() => discoverChains(demoClaims), []);
  const crossLinks = useMemo(() => findCrossDomainLinks(demoClaims), []);
  const conflicts = useMemo(() => detectConflicts(demoClaims), []);

  const domains = [...new Set(demoClaims.map(c => c.domain))];
  const avgConfidence = demoClaims.reduce((s, c) => s + c.confidence_score, 0) / demoClaims.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Layers className="h-4 w-4" />} label="Universal Claims" value={demoClaims.length} />
        <StatCard icon={<GitBranch className="h-4 w-4" />} label="Causal Chains" value={chains.length} />
        <StatCard icon={<Globe className="h-4 w-4" />} label="Cross-Domain Links" value={crossLinks.length} />
        <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Conflicts" value={conflicts.length} />
      </div>

      {/* Domain Filter */}
      <div className="flex gap-2 flex-wrap">
        <Badge
          variant={selectedDomain === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedDomain(null)}
        >
          All Domains
        </Badge>
        {domains.map(d => (
          <Badge
            key={d}
            variant="outline"
            className={`cursor-pointer ${selectedDomain === d ? DOMAIN_COLORS[d] : ''}`}
            onClick={() => setSelectedDomain(d === selectedDomain ? null : d)}
          >
            {d}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="chains">Chains</TabsTrigger>
          <TabsTrigger value="cross">Cross-Domain</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="claims">
          <ClaimsTab claims={filteredClaims} />
        </TabsContent>

        <TabsContent value="graph">
          <GraphTab claims={demoClaims} chains={chains} />
        </TabsContent>

        <TabsContent value="chains">
          <ChainsTab chains={chains} />
        </TabsContent>

        <TabsContent value="cross">
          <CrossDomainTab links={crossLinks} />
        </TabsContent>

        <TabsContent value="conflicts">
          <ConflictsTab conflicts={conflicts} claims={demoClaims} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function ClaimsTab({ claims }: { claims: UniversalClaim[] }) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {claims.map(claim => (
          <Card key={claim.id} className="border-border/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">{claim.claim_code}</Badge>
                    <Badge variant="outline" className={DOMAIN_COLORS[claim.domain] ?? ''}>
                      {claim.domain}
                    </Badge>
                    <Badge className={STATUS_COLORS[claim.status] ?? ''}>{claim.status}</Badge>
                  </div>

                  {/* ENTITY → VARIABLE → RELATIONSHIP → OUTCOME */}
                  <div className="flex items-center gap-1 text-sm font-mono mb-2 flex-wrap">
                    <span className="text-foreground font-medium">{claim.subject_entity}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-primary">{claim.variable_or_intervention}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className={claim.relationship_type === 'increases' ? 'text-emerald-400' : claim.relationship_type === 'decreases' ? 'text-red-400' : 'text-muted-foreground'}>
                      {claim.relationship_type}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-accent-foreground">{claim.target_outcome}</span>
                  </div>

                  <p className="text-sm text-muted-foreground">{claim.statement}</p>

                  {claim.effect_size != null && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Effect: <span className="font-mono">{claim.effect_size} {claim.effect_size_unit}</span>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold">{Math.round(claim.confidence_score * 100)}%</div>
                  <div className="text-xs text-muted-foreground">confidence</div>
                  <Progress value={claim.confidence_score * 100} className="w-20 h-1.5 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function GraphTab({ claims, chains }: { claims: UniversalClaim[]; chains: ChainDiscoveryResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" />Knowledge Graph Structure</CardTitle>
        <CardDescription>
          {claims.length} claims connected by {chains.length} inferred chains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visual chain representation */}
          {chains.slice(0, 8).map((chain, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-mono p-3 rounded-lg bg-muted/30 border border-border/50">
              <Zap className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{chain.inferred_statement}</span>
              <Badge variant="outline" className="ml-auto shrink-0">{Math.round(chain.confidence * 100)}%</Badge>
            </div>
          ))}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Domains in Graph</h4>
              {[...new Set(claims.map(c => c.domain))].map(d => (
                <Badge key={d} variant="outline" className={`mr-1 mb-1 ${DOMAIN_COLORS[d] ?? ''}`}>{d}</Badge>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Cross-Domain Chains</h4>
              <span className="text-2xl font-bold">
                {chains.filter(c => c.domains_crossed.length > 1).length}
              </span>
              <span className="text-sm text-muted-foreground ml-2">discovered</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChainsTab({ chains }: { chains: ChainDiscoveryResult[] }) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {chains.length === 0 && (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">No chains discovered yet</CardContent></Card>
        )}
        {chains.map((chain, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Transitive Chain #{i + 1}</span>
                <Badge variant="outline" className="ml-auto">{Math.round(chain.confidence * 100)}% confidence</Badge>
              </div>
              <p className="text-sm font-mono text-muted-foreground">{chain.inferred_statement}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Via:</span>
                {chain.shared_entities.map(e => (
                  <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                ))}
                {chain.domains_crossed.length > 1 && (
                  <Badge className="bg-primary/20 text-primary text-xs">Cross-domain</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function CrossDomainTab({ links }: { links: CrossDomainLink[] }) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {links.length === 0 && (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">No cross-domain links found</CardContent></Card>
        )}
        {links.map((link, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-primary" />
                <Badge variant="outline" className={DOMAIN_COLORS[link.source_domain] ?? ''}>{link.source_domain}</Badge>
                <ArrowRight className="h-3 w-3" />
                <Badge variant="outline" className={DOMAIN_COLORS[link.target_domain] ?? ''}>{link.target_domain}</Badge>
                <Badge variant="outline" className="ml-auto">{Math.round(link.strength * 100)}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Shared variable: <span className="font-mono text-foreground">{link.shared_variable}</span>
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                {link.connecting_claims.length} connecting claims
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function ConflictsTab({ conflicts, claims }: { conflicts: ClaimConflict[]; claims: UniversalClaim[] }) {
  const getClaimCode = (id: string) => claims.find(c => c.id === id)?.claim_code ?? id;

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {conflicts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
              No conflicts detected — all claims are consistent
            </CardContent>
          </Card>
        )}
        {conflicts.map((conflict, i) => (
          <Card key={i} className="border-amber-500/30">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <Badge variant="outline" className="bg-amber-500/20 text-amber-300">{conflict.conflict_type}</Badge>
                <Badge variant="outline" className="ml-auto">{conflict.resolution_status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{conflict.description}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span>Claim A ({getClaimCode(conflict.claim_a_id)}): {Math.round((conflict.claim_a_confidence ?? 0) * 100)}%</span>
                <span>Claim B ({getClaimCode(conflict.claim_b_id)}): {Math.round((conflict.claim_b_confidence ?? 0) * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
