/**
 * Big Questions Page
 * 
 * Shows auto-ranked structural questions.
 * URL: /big-questions
 * 
 * Part of Block 56: Global Big Questions.
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { BigQuestionsList } from '@/components/big-questions/BigQuestionsList';
import { Globe, Info, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BigQuestionsPage() {
  const [searchParams] = useSearchParams();
  const countryCode = searchParams.get('country');
  const countryName = searchParams.get('name');

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Big Questions</h1>
          </div>
          <p className="text-muted-foreground">
            Strukturella frågor rankade automatiskt baserat på data.
            Inga åsikter. Inga redaktörer.
          </p>
        </header>

        {/* Principles */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Auto-Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Förändringstakt</li>
                <li>• Korsdomän-påverkan</li>
                <li>• Berörd population</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Vad visas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Observerad data</li>
                <li>• Källor</li>
                <li>• Osäkerhet</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Blockerat
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>• Kristermer</li>
                <li>• Prediktioner</li>
                <li>• Policyförslag</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <BigQuestionsList 
          countryCode={countryCode}
          countryName={countryName || undefined}
          limit={10}
          showFilters={true}
        />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>
            Ranking baseras enbart på dataförändringar och uppdateras automatiskt.
          </p>
          <p className="mt-1">
            Ingen manuell prioritering. Ingen redaktion.
          </p>
        </footer>
      </div>
    </div>
  );
}
