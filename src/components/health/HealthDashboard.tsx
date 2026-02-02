/**
 * HEALTH DASHBOARD - Main Entry Point
 * 
 * Population-level health data overview.
 * NO medical advice. Epidemiological reference only.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Activity, Heart, Pill, Building2, TrendingUp, FileText } from 'lucide-react';
import { HealthDisclaimer } from './HealthDisclaimer';
import { DiseaseBurdenView } from './DiseaseBurdenView';
import { LifeExpectancyView } from './LifeExpectancyView';
import { SubstanceProfileView } from './SubstanceProfileView';
import { HealthPolicyTimeline } from './HealthPolicyTimeline';
import { HealthScenarioLab } from './HealthScenarioLab';
import { supabase } from '@/integrations/supabase/client';

const AVAILABLE_COUNTRIES = [
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' }
];

export function HealthDashboard() {
  const [selectedCountry, setSelectedCountry] = useState('SE');
  const [selectedYear, setSelectedYear] = useState(2022);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch countries from database
  const { data: countries } = useQuery({
    queryKey: ['countries-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data?.length ? data : AVAILABLE_COUNTRIES;
    }
  });

  const countryList = countries || AVAILABLE_COUNTRIES;
  const selectedCountryName = countryList.find(c => c.code === selectedCountry)?.name || selectedCountry;

  return (
    <div className="space-y-6">
      {/* Always-visible disclaimer */}
      <HealthDisclaimer variant="banner" />

      {/* Header with controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health & Substance Reality Layer</h1>
          <p className="text-muted-foreground">
            Population-level epidemiological data • Not medical advice
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000].map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="disease-burden" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Disease Burden</span>
          </TabsTrigger>
          <TabsTrigger value="life-expectancy" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Life Expectancy</span>
          </TabsTrigger>
          <TabsTrigger value="substances" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Substances</span>
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Capacity</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <HealthOverviewCards 
            countryCode={selectedCountry}
            countryName={selectedCountryName}
            year={selectedYear}
          />
        </TabsContent>

        <TabsContent value="disease-burden">
          <DiseaseBurdenView 
            countryCode={selectedCountry}
            countryName={selectedCountryName}
            year={selectedYear}
          />
        </TabsContent>

        <TabsContent value="life-expectancy">
          <LifeExpectancyView 
            countryCode={selectedCountry}
            countryName={selectedCountryName}
          />
        </TabsContent>

        <TabsContent value="substances">
          <SubstanceProfileView 
            countryCode={selectedCountry}
            countryName={selectedCountryName}
          />
        </TabsContent>

        <TabsContent value="capacity">
          <HealthPolicyTimeline 
            countryCode={selectedCountry}
            countryName={selectedCountryName}
          />
        </TabsContent>

        <TabsContent value="scenarios">
          <HealthScenarioLab 
            countryCode={selectedCountry}
            countryName={selectedCountryName}
          />
        </TabsContent>
      </Tabs>

      {/* Footer disclaimer */}
      <HealthDisclaimer variant="compact" className="mt-8" />
    </div>
  );
}

function HealthOverviewCards({ 
  countryCode, 
  countryName,
  year 
}: { 
  countryCode: string;
  countryName: string;
  year: number;
}) {
  // Note: In production, these would fetch from the database
  // For now, showing placeholder structure
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Life Expectancy</CardDescription>
          <CardTitle className="text-2xl">
            <span className="text-muted-foreground text-sm">Data pending</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Average years at birth, {year}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Healthcare Spending</CardDescription>
          <CardTitle className="text-2xl">
            <span className="text-muted-foreground text-sm">Data pending</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Percent of GDP, {year}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Physicians</CardDescription>
          <CardTitle className="text-2xl">
            <span className="text-muted-foreground text-sm">Data pending</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Per 10,000 population, {year}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Hospital Beds</CardDescription>
          <CardTitle className="text-2xl">
            <span className="text-muted-foreground text-sm">Data pending</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Per 10,000 population, {year}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Top Disease Burden Causes</CardTitle>
          <CardDescription>
            DALYs per 100,000 population in {countryName}, {year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Disease burden data will be loaded from WHO/GBD sources.
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">What This Shows</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-green-700 dark:text-green-400 mb-1">Shows</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Population-level statistics</li>
              <li>• Historical trends</li>
              <li>• Cross-country comparisons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-destructive mb-1">Does NOT Show</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Individual health status</li>
              <li>• Treatment recommendations</li>
              <li>• Diagnostic information</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HealthDashboard;
