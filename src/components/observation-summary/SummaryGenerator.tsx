/**
 * SUMMARY GENERATOR COMPONENT
 * 
 * UI for generating observation summaries.
 * Connects to the backend AI generation.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ObservationSummaryView } from './ObservationSummaryView';
import { generateObservationSummary } from '@/lib/observation-summary/summary-generator';
import { STANDARD_NON_CLAIMS } from '@/types/observation-summary';
import type { ObservationSummary, SummaryDomain } from '@/types/observation-summary';

export function SummaryGenerator() {
  const [domain, setDomain] = useState<SummaryDomain>('company');
  const [objectName, setObjectName] = useState('');
  const [periodStart, setPeriodStart] = useState('2020-01');
  const [periodEnd, setPeriodEnd] = useState('2024-12');
  const [language, setLanguage] = useState<'sv' | 'en'>('sv');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<ObservationSummary | null>(null);
  
  const domainLabels: Record<SummaryDomain, string> = {
    company: 'Företag',
    sector: 'Sektor',
    country: 'Land',
    region: 'Region',
    municipality: 'Kommun',
    health: 'Hälsa',
    covid: 'COVID-19',
    environment: 'Miljö',
    policy: 'Policy',
    custom: 'Anpassad'
  };
  
  const handleGenerate = async () => {
    if (!objectName.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Generate demo summary (in real implementation, would call edge function)
      const result = await generateObservationSummary(
        {
          domain,
          object_name: objectName,
          object_id: objectName.toLowerCase().replace(/\s+/g, '_'),
          period_start: periodStart,
          period_end: periodEnd,
          data_sources: [
            { name: 'SCB', code: 'SCB' },
            { name: 'Eurostat', code: 'EUROSTAT' }
          ],
          indicators: [
            {
              id: 'ind_1',
              name: 'Primary Indicator',
              values: [
                { date: '2020-01', value: 100 },
                { date: '2021-01', value: 105 },
                { date: '2022-01', value: 108 },
                { date: '2023-01', value: 112 },
                { date: '2024-01', value: 115 }
              ]
            },
            {
              id: 'ind_2',
              name: 'Secondary Indicator',
              values: [
                { date: '2020-01', value: 50 },
                { date: '2021-01', value: 52 },
                { date: '2022-01', value: 51 },
                { date: '2023-01', value: 53 },
                { date: '2024-01', value: 54 }
              ]
            }
          ],
          language
        },
        STANDARD_NON_CLAIMS[domain]
      );
      
      setSummary(result);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleViewRawData = (link: string) => {
    console.log('View raw data:', link);
    // In real implementation, would open data viewer
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Generator form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generera Observationssammanfattning</CardTitle>
          <p className="text-sm text-muted-foreground">
            Skapa en neutral, strukturerad sammanfattning baserad på data.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domän</Label>
              <Select value={domain} onValueChange={(v) => setDomain(v as SummaryDomain)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(domainLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Språk</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as 'sv' | 'en')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sv">Svenska</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="object">Objekt (namn)</Label>
            <Input
              id="object"
              placeholder="t.ex. Sverige, Stockholm, Company AB"
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Period start</Label>
              <Input
                id="start"
                type="month"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Period slut</Label>
              <Input
                id="end"
                type="month"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !objectName.trim()}
            className="w-full"
          >
            {isGenerating ? 'Genererar...' : 'Generera sammanfattning'}
          </Button>
        </CardContent>
      </Card>
      
      {/* Generated summary */}
      {summary && (
        <ObservationSummaryView 
          summary={summary} 
          onViewRawData={handleViewRawData}
          language={language}
        />
      )}
    </div>
  );
}
