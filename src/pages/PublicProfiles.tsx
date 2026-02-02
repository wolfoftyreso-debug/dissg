import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Search, 
  User,
  Briefcase,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { PublicOfficialProfile } from '@/components/profile/PublicOfficialProfile';
import { LegalDisclaimer } from '@/components/profile/LegalDisclaimer';
import { LANGUAGE_TEMPLATES } from '@/config/publicProfileConfig';

const PublicProfiles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  const [searchQuery, setSearchQuery] = useState('');
  const labels = LANGUAGE_TEMPLATES;

  // Fetch all officials
  const { data: officials, isLoading } = useQuery({
    queryKey: ['public-officials-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_officials')
        .select(`
          id,
          full_name,
          party_affiliation,
          wikipedia_url,
          public_assignments (
            id,
            title,
            assignment_type,
            start_date,
            end_date
          )
        `)
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredOfficials = officials?.filter(o => 
    o.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.party_affiliation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOfficial = (id: string) => {
    setSearchParams({ id });
  };

  const handleBack = () => {
    setSearchParams({});
  };

  // Show individual profile
  if (selectedId) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{labels.profileHeader.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {labels.profileHeader.subtitle}
                </p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <PublicOfficialProfile officialId={selectedId} onBack={handleBack} />
        </main>
      </div>
    );
  }

  // Show list
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Offentliga profiler
              </h1>
              <p className="text-sm text-muted-foreground">
                Uppdrag och observerade utfall för offentliga personer
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Disclaimer */}
        <LegalDisclaimer variant="main" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök efter namn eller parti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Officials List */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filteredOfficials && filteredOfficials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOfficials.map((official) => {
              const activeAssignment = official.public_assignments?.find(a => !a.end_date);
              const totalAssignments = official.public_assignments?.length || 0;

              return (
                <Card 
                  key={official.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => handleSelectOfficial(official.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {official.full_name}
                        </CardTitle>
                        {official.party_affiliation && (
                          <CardDescription>
                            {official.party_affiliation}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {totalAssignments} uppdrag
                      </Badge>
                      {activeAssignment && (
                        <Badge variant="default" className="text-xs">
                          Aktivt uppdrag
                        </Badge>
                      )}
                    </div>
                    {activeAssignment && (
                      <p className="text-sm text-muted-foreground mt-2 truncate">
                        {activeAssignment.title}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {searchQuery ? (
                <p>Inga resultat för "{searchQuery}"</p>
              ) : (
                <div className="space-y-2">
                  <Users className="h-12 w-12 mx-auto opacity-50" />
                  <p>Inga offentliga profiler har registrerats ännu.</p>
                  <p className="text-sm">
                    Profiler skapas baserat på offentliga register och riksdagsdata.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <LegalDisclaimer variant="methodology" />
      </main>
    </div>
  );
};

export default PublicProfiles;
