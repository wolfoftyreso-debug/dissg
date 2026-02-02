import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  ExternalLink, 
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { LANGUAGE_TEMPLATES, ASSIGNMENT_TYPES } from '@/config/publicProfileConfig';
import { LegalDisclaimer } from './LegalDisclaimer';
import { OutcomeDistribution } from './OutcomeDistribution';
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

  const getOutcomePercentages = () => {
    if (totalMonths === 0) return { improved: 33.3, stagnant: 33.3, declined: 33.3 };
    return {
      improved: (aggregatedOutcomes.improved / totalMonths) * 100,
      stagnant: (aggregatedOutcomes.stagnant / totalMonths) * 100,
      declined: (aggregatedOutcomes.declined / totalMonths) * 100,
    };
  };

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

  const percentages = getOutcomePercentages();

  return (
    <div className="space-y-6">
      {/* Back button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {labels.navigation.backToProfile}
        </Button>
      )}

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{official.full_name}</CardTitle>
                <CardDescription className="text-base">
                  {labels.profileHeader.subtitle}
                </CardDescription>
              </div>
            </div>
            {official.wikipedia_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={official.wikipedia_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Wikipedia
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {official.party_affiliation && (
              <Badge variant="secondary">{official.party_affiliation}</Badge>
            )}
            {assignments && (
              <Badge variant="outline">
                <Briefcase className="h-3 w-3 mr-1" />
                {assignments.length} uppdrag
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legal Disclaimer */}
      <LegalDisclaimer variant="main" />

      {/* Main Content Grid */}
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

        {/* Right: Outcomes */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{labels.responsibilitySummary.title}</CardTitle>
              <CardDescription>
                {labels.responsibilitySummary.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{aggregatedOutcomes.improved}</div>
                  <div className="text-xs text-muted-foreground">månader förbättring</div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <Minus className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-2xl font-bold">{aggregatedOutcomes.stagnant}</div>
                  <div className="text-xs text-muted-foreground">månader stagnation</div>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-5 w-5 mx-auto mb-1 text-destructive" />
                  <div className="text-2xl font-bold">{aggregatedOutcomes.declined}</div>
                  <div className="text-xs text-muted-foreground">månader försämring</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcome Distribution */}
          <OutcomeDistribution
            improved={percentages.improved}
            stagnant={percentages.stagnant}
            declined={percentages.declined}
            totalMonths={totalMonths > 0 ? totalMonths : undefined}
          />
        </div>
      </div>

      {/* Methodology Disclaimer */}
      <LegalDisclaimer variant="methodology" />

      {/* Footer */}
      <LegalDisclaimer variant="footer" />
    </div>
  );
}
