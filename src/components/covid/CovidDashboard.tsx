/**
 * COVID-19 REALITY LAYER - Main Dashboard
 * Raw data, method tracking, no interpretations
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileText, GitCompare, Scale, Sliders } from 'lucide-react';
import { CovidRawDataView } from './CovidRawDataView';
import { CovidExcessMortalityView } from './CovidExcessMortalityView';
import { CovidComparisonTool } from './CovidComparisonTool';
import { CovidSensitivityPanel } from './CovidSensitivityPanel';
import { CovidConclusionGuard } from './CovidConclusionGuard';

export function CovidDashboard() {
  const [activeTab, setActiveTab] = useState('raw-data');

  return (
    <div className="space-y-6">
      {/* Permanent Disclaimer */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">COVID-19 Reality Layer</p>
              <p className="text-xs text-muted-foreground">
                This module displays official reported data with full methodology transparency. 
                It does not provide medical advice, policy recommendations, or causal conclusions. 
                Comparisons across countries or time periods may be invalid due to definitional differences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="raw-data" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Raw Data</span>
          </TabsTrigger>
          <TabsTrigger value="excess-mortality" className="gap-2">
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Excess Mortality</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-2">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="gap-2">
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Fjädran</span>
          </TabsTrigger>
          <TabsTrigger value="conclusions" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Conclusions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="raw-data" className="mt-6">
          <CovidRawDataView />
        </TabsContent>

        <TabsContent value="excess-mortality" className="mt-6">
          <CovidExcessMortalityView />
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <CovidComparisonTool />
        </TabsContent>

        <TabsContent value="sensitivity" className="mt-6">
          <CovidSensitivityPanel />
        </TabsContent>

        <TabsContent value="conclusions" className="mt-6">
          <CovidConclusionGuard />
        </TabsContent>
      </Tabs>

      {/* Standard Questions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What does the raw data show?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-medium text-foreground">1.</span>
              <span>What is being measured? (definition, coverage, reporter)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">2.</span>
              <span>How is it measured? (methodology, frequency, lag)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">3.</span>
              <span>What does the raw data show? (values, trends, patterns)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">4.</span>
              <span>Where is the uncertainty? (confidence intervals, revisions, gaps)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">5.</span>
              <span>What cannot be concluded? (blocked comparisons, invalid inferences)</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
