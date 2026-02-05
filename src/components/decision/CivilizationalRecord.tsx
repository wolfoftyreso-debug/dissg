/**
 * CIVILIZATIONAL DECISION RECORD
 * 
 * Complete record of a decision for cross-cultural,
 * cross-generational comparison.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Users,
  Cpu,
  ArrowLeftRight,
  Clock,
  FileJson,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { LegitimacyDisplay } from './LegitimacyDisplay';
import type { CivilizationalDecisionRecord } from '@/core/query-dominance/legitimacy/types';
import { INTERFACE_LAYERS } from '@/core/query-dominance/legitimacy/civilizational-interface';

interface CivilizationalRecordProps {
  record: CivilizationalDecisionRecord;
}

const LAYER_ICONS: Record<string, React.ReactNode> = {
  individual_society: <Users className="h-4 w-4" />,
  data_action: <ArrowLeftRight className="h-4 w-4" />,
  power_responsibility: <Globe className="h-4 w-4" />,
  ai_human: <Cpu className="h-4 w-4" />,
};

export function CivilizationalRecord({ record }: CivilizationalRecordProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Civilizational Decision Record</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Decision {record.decision_id.slice(0, 12)}...
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline">v{record.version}</Badge>
              <span className="text-xs text-muted-foreground">
                {record.schema}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Globally Comparable"
              value={record.globally_comparable}
              icon={<Globe className="h-4 w-4" />}
            />
            <MetricCard
              label="Language Agnostic"
              value={record.language_agnostic}
              icon={<FileJson className="h-4 w-4" />}
            />
            <MetricCard
              label="Generational Relevance"
              value={record.generational_relevance}
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricCard
              label="Time Horizon"
              value={record.time_horizon_classification}
              icon={<Clock className="h-4 w-4" />}
              isText
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="legitimacy">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="legitimacy">Legitimacy</TabsTrigger>
          <TabsTrigger value="interfaces">Interface Symmetry</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="legitimacy" className="mt-4">
          <LegitimacyDisplay check={record.legitimacy_check} />
        </TabsContent>
        
        <TabsContent value="interfaces" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interface Symmetry</CardTitle>
              <p className="text-sm text-muted-foreground">
                All parties meet the same requirements
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {record.interface_symmetries.map((symmetry) => {
                const layerDef = INTERFACE_LAYERS.find(l => l.layer === symmetry.layer);
                
                return (
                  <div 
                    key={symmetry.layer}
                    className="flex items-start gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className={`p-2 rounded-lg ${
                      symmetry.balanced ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}>
                      {LAYER_ICONS[symmetry.layer]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {layerDef?.name || symmetry.layer}
                        </span>
                        {symmetry.balanced ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {layerDef?.symmetry_requirement}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comparison Dimensions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Dimensions available for cross-boundary comparison
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {record.comparison_dimensions.map((dim) => (
                  <Badge key={dim} variant="secondary">
                    {dim.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  This record can be compared with decisions from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Different countries and jurisdictions</li>
                  <li>Different cultures and languages</li>
                  <li>Different time periods and generations</li>
                  <li>Different actors (human and AI)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Machine-Readable Export</CardTitle>
              <p className="text-sm text-muted-foreground">
                JSON-LD format for interoperability
              </p>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-lg overflow-auto text-xs">
                {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Action',
                  identifier: record.decision_id,
                  potentialAction: {
                    '@type': 'AssessAction',
                    result: {
                      legitimacy_score: record.legitimacy_check.legitimacy_score,
                      status: record.legitimacy_check.status,
                    },
                  },
                  temporalCoverage: record.time_horizon_classification,
                  version: record.version,
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  icon,
  isText = false,
}: { 
  label: string; 
  value: boolean | string; 
  icon: React.ReactNode;
  isText?: boolean;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      {isText ? (
        <p className="font-medium text-sm capitalize">
          {String(value).replace(/_/g, ' ')}
        </p>
      ) : (
        <div className="flex items-center gap-1">
          {value ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
          <span className="text-sm font-medium">
            {value ? 'Yes' : 'No'}
          </span>
        </div>
      )}
    </div>
  );
}
