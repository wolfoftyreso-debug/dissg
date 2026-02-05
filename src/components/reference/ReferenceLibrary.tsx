/**
 * REFERENCE LIBRARY
 * 
 * Public read-only view of all reference cases.
 * Structural proof, not marketing.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Library,
  Users,
  Building2,
  Landmark,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
} from 'lucide-react';
import { ReferenceCaseCard } from './ReferenceCaseCard';
import {
  INITIAL_REFERENCE_CASES,
  getCurrentLibraryStats,
  CATEGORY_DISTRIBUTION,
  MIX_RATIONALE,
} from '@/core/adoption/reference-cases';
import type { ReferenceCaseCategory } from '@/core/adoption/reference-cases/types';

const CATEGORY_ICONS: Record<ReferenceCaseCategory, React.ReactNode> = {
  everyday_consumer: <Users className="h-4 w-4" />,
  board_governance: <Building2 className="h-4 w-4" />,
  public_policy: <Landmark className="h-4 w-4" />,
  failed_outcome: <TrendingDown className="h-4 w-4" />,
  ignored_uncertainty: <AlertTriangle className="h-4 w-4" />,
  learning_changed: <RefreshCw className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<ReferenceCaseCategory, string> = {
  everyday_consumer: 'Consumer',
  board_governance: 'Governance',
  public_policy: 'Policy',
  failed_outcome: 'Failed Outcomes',
  ignored_uncertainty: 'Ignored Warnings',
  learning_changed: 'Learnings',
};

export function ReferenceLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<ReferenceCaseCategory | 'all'>('all');
  const stats = getCurrentLibraryStats();

  const filteredCases = selectedCategory === 'all'
    ? INITIAL_REFERENCE_CASES
    : INITIAL_REFERENCE_CASES.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Library className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Reference Case Library</CardTitle>
              <p className="text-sm text-muted-foreground">
                Structural proof, not marketing. {stats.total_cases} cases.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Cases"
              value={stats.total_cases}
            />
            <StatCard
              label="Avg Legibility"
              value={`${Math.round(stats.average_legibility_score * 100)}%`}
            />
            <StatCard
              label="With Reality Check"
              value={stats.cases_with_reality_check}
            />
            <StatCard
              label="Deviations Flagged"
              value={stats.foreseeable_deviations_flagged}
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs 
        value={selectedCategory} 
        onValueChange={(v) => setSelectedCategory(v as ReferenceCaseCategory | 'all')}
      >
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="text-xs">
            All ({stats.total_cases})
          </TabsTrigger>
          {(Object.keys(CATEGORY_LABELS) as ReferenceCaseCategory[]).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-xs gap-1">
              {CATEGORY_ICONS[cat]}
              {CATEGORY_LABELS[cat]} ({stats.by_category[cat]})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          {/* Category rationale */}
          {selectedCategory !== 'all' && (
            <Card className="mb-4 bg-muted/30">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Why included:</strong>{' '}
                  {MIX_RATIONALE[selectedCategory as ReferenceCaseCategory]}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cases Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((summary) => (
              <ReferenceCaseCard
                key={summary.case_id}
                summary={summary}
                onClick={() => console.log('View case:', summary.case_code)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* What this demonstrates */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">What This Library Demonstrates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">The system does NOT:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Promise right outcomes</li>
                <li>• Hide when things go wrong</li>
                <li>• Cherry-pick success stories</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium">The system DOES:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Show what was known at decision time</li>
                <li>• Include legitimate decisions with bad outcomes</li>
                <li>• Make responsibility technical, not personal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
