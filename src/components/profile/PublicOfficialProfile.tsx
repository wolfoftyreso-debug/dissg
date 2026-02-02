import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User } from 'lucide-react';
import { LANGUAGE_TEMPLATES } from '@/config/publicProfileConfig';
import { LegalDisclaimer } from './LegalDisclaimer';
import { WikipediaFactsSection } from './WikipediaFactsSection';
import { SystemAnalysisSection } from './SystemAnalysisSection';
import { CorrectionNotice } from './CorrectionNotice';
import { AssignmentTimeline } from './AssignmentTimeline';
import { useState } from 'react';

interface PublicOfficialProfileProps {
  officialId: string;
  onBack?: () => void;
}

export function PublicOfficialProfile({ officialId, onBack }: PublicOfficialProfileProps) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const labels = LANGUAGE_TEMPLATES;

  // Fetch official data
  const { data: official, isLoading: officialLoading } = useQuery({
    queryKey: ['public-official', officialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_officials')
        .select('*')
        .eq('id', officialId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['public-assignments', officialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_assignments')
        .select('*')
        .eq('official_id', officialId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch aggregated outcomes
  const { data: outcomes, isLoading: outcomesLoading } = useQuery({
    queryKey: ['assignment-outcomes', officialId],
    queryFn: async () => {
      if (!assignments?.length) return null;
      
      const { data, error } = await supabase
        .from('assignment_outcomes')
        .select('*')
        .in('assignment_id', assignments.map(a => a.id));
      
      if (error) throw error;
      return data;
    },
    enabled: !!assignments?.length,
  });

  // Calculate aggregated stats
  const aggregatedOutcomes = outcomes?.reduce(
    (acc, o) => ({
      improved: acc.improved + (o.months_with_improvement || 0),
      stagnant: acc.stagnant + (o.months_with_stagnation || 0),
      declined: acc.declined + (o.months_with_decline || 0),
    }),
    { improved: 0, stagnant: 0, declined: 0 }
  ) || { improved: 0, stagnant: 0, declined: 0 };

  const totalMonths = aggregatedOutcomes.improved + aggregatedOutcomes.stagnant + aggregatedOutcomes.declined;

  if (officialLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!official) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Personen hittades inte.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {labels.navigation.backToProfile}
        </Button>
      )}

      {/* ===== SEKTION A: FAKTA (Wikipedia-baserat) ===== */}
      <WikipediaFactsSection 
        official={{
          full_name: official.full_name,
          party_affiliation: official.party_affiliation,
          birth_year: official.birth_year,
          wikipedia_url: official.wikipedia_url,
          last_verified_at: official.last_verified_at,
        }}
      />

      {/* Juridisk disclaimer */}
      <LegalDisclaimer variant="main" />

      {/* Visuell separator */}
      <div className="relative py-4">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-wide">
            Systemgenererad analys
          </span>
        </div>
      </div>

      {/* ===== SEKTION B: ANSVAR & UTFALL (systemets data) ===== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Timeline */}
        <AssignmentTimeline
          assignments={assignments?.map(a => ({
            id: a.id,
            title: a.title,
            assignmentType: a.assignment_type,
            startDate: a.start_date,
            endDate: a.end_date,
            responsibilityAreas: a.responsibility_areas || [],
          })) || []}
          onSelectAssignment={setSelectedAssignmentId}
          selectedId={selectedAssignmentId || undefined}
        />

        {/* Right: Analysis */}
        <SystemAnalysisSection
          outcomes={aggregatedOutcomes}
          totalMonths={totalMonths}
        />
      </div>

      {/* Metoddisclaimer */}
      <LegalDisclaimer variant="methodology" />

      {/* Rättelse & transparens */}
      <CorrectionNotice wikipediaUrl={official.wikipedia_url} />

      {/* Footer-disclaimer */}
      <LegalDisclaimer variant="footer" />
    </div>
  );
}
