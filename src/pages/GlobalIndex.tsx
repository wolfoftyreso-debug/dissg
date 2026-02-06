import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Globe, TrendingUp, Users, Heart, GraduationCap, 
  Briefcase, Scale, Zap, Home, Train, Plane, Building2, Package,
  Cpu, Newspaper, Landmark, Shield, Clock, Flag, ShoppingCart,
  Wheat, Church, Cloud, Lightbulb, FileText, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Icon mapping
const DOMAIN_ICONS: Record<string, any> = {
  'DEMO': Users,
  'ECON': TrendingUp,
  'TAX': FileText,
  'HEALTH': Heart,
  'EDU': GraduationCap,
  'LABOR': Briefcase,
  'CRIME': Scale,
  'ENERGY': Zap,
  'HOUSING': Home,
  'TRANSPORT': Train,
  'MIGRATION': Plane,
  'BUSINESS': Building2,
  'TRADE': Package,
  'TECH': Cpu,
  'INTERNET': Globe,
  'MEDIA': Newspaper,
  'GOV': Landmark,
  'WELFARE': Shield,
  'PENSION': Clock,
  'INTL': Flag,
  'CONSUME': ShoppingCart,
  'FOOD': Wheat,
  'URBAN': Building2,
  'RELIGION': Church,
  'ADDICTION': Heart,
  'CLIMATE': Cloud,
  'RND': Lightbulb,
  'CRYPTO': TrendingUp,
  'PROCUREMENT': FileText,
  'INEQUALITY': BarChart3,
};

const DATA_QUALITY_COLORS: Record<string, string> = {
  'A': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'B': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'C': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'D': 'bg-red-500/20 text-red-400 border-red-500/30',
  'unverified': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export default function GlobalIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Fetch domains
  const { data: domains = [] } = useQuery({
    queryKey: ['global-question-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_question_domains')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['global-index-questions', selectedDomain],
    queryFn: async () => {
      let query = supabase
        .from('global_index_questions')
        .select('*')
        .eq('is_published', true)
        .order('seo_priority', { ascending: false })
        .limit(100);

      if (selectedDomain) {
        query = query.eq('domain_code', selectedDomain);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Filter questions by search
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    const q = searchQuery.toLowerCase();
    return questions.filter(
      (question) =>
        question.question_en?.toLowerCase().includes(q) ||
        question.question_sv?.toLowerCase().includes(q) ||
        question.ai_retrieval_tags?.some((tag: string) => tag.toLowerCase().includes(q))
    );
  }, [questions, searchQuery]);

  // Group questions by domain
  const questionsByDomain = useMemo(() => {
    const grouped: Record<string, typeof questions> = {};
    filteredQuestions.forEach((q) => {
      if (!grouped[q.domain_code]) {
        grouped[q.domain_code] = [];
      }
      grouped[q.domain_code].push(q);
    });
    return grouped;
  }, [filteredQuestions]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Global Index</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {domains.length} domäner · {questions.length} frågor · Maskinläsbar · AI-optimerad
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              v1.0.0
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök frågor, domäner, taggar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Domain sidebar */}
          <aside>
            <Card className="sticky top-32">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Domäner</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[60vh]">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => setSelectedDomain(null)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        !selectedDomain
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Alla domäner</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {questions.length}
                      </Badge>
                    </button>

                    {domains.map((domain) => {
                      const Icon = DOMAIN_ICONS[domain.code] || Globe;
                      const count = questionsByDomain[domain.code]?.length || 0;
                      
                      return (
                        <button
                          key={domain.code}
                          onClick={() => setSelectedDomain(domain.code)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                            selectedDomain === domain.code
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted text-muted-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="truncate flex-1 text-left">{domain.name_sv}</span>
                          {count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {count}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <main className="space-y-6">
            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredQuestions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Inga frågor hittades</h3>
                  <p className="text-sm text-muted-foreground">
                    Inga frågor matchar din sökning. Prova med andra sökord.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => {
                  const Icon = DOMAIN_ICONS[question.domain_code] || Globe;
                  const domain = domains.find((d) => d.code === question.domain_code);

                  return (
                    <Card key={question.id} className="group hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs font-mono">
                                {question.question_id}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={cn('text-xs', DATA_QUALITY_COLORS[question.data_quality || 'unverified'])}
                              >
                                Kvalitet {question.data_quality}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {question.scope}
                              </Badge>
                            </div>

                            <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                              {question.question_sv}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {question.question_en}
                            </p>

                            <div className="flex flex-wrap gap-1">
                              {question.ai_retrieval_tags?.slice(0, 5).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {question.cross_reference_domains?.length > 0 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  +{question.cross_reference_domains.length} korsreferenser
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="text-right text-xs text-muted-foreground">
                            <div className="font-mono">{question.data_coverage_percent}%</div>
                            <div>täckning</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Machine-readable metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DataCatalog',
            name: 'DISSG Global Index',
            description: 'Machine-readable global question index for AI agents and search engines',
            url: window.location.href,
            provider: {
              '@type': 'Organization',
              name: 'DISSG',
            },
            dataset: domains.map((d) => ({
              '@type': 'Dataset',
              name: d.name_en,
              description: d.name_sv,
              identifier: d.code,
            })),
          }),
        }}
      />
    </div>
  );
}
