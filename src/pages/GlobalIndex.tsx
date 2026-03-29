import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LiveDataWidget } from '@/components/data/LiveDataWidget';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Globe, TrendingUp, Users, Heart, GraduationCap, 
  Briefcase, Scale, Zap, Home, Train, Plane, Building2, Package,
  Cpu, Newspaper, Landmark, Shield, Clock, Flag, ShoppingCart,
  Wheat, Church, Cloud, Lightbulb, FileText, BarChart3, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_AGENT_CLASSES, type AIAgentClass } from '@/core/truth-engine/expansion/questions/ai-agent-questions';

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

const AGENT_ICONS: Record<string, any> = {
  'policy': Landmark,
  'journalism': Newspaper,
  'finance': TrendingUp,
  'corporate': Building2,
  'health': Heart,
  'legal': Scale,
  'general': Globe,
};

const DATA_QUALITY_COLORS: Record<string, string> = {
  'A': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'B': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'C': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'D': 'bg-red-500/20 text-red-400 border-red-500/30',
  'unverified': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

const AGENT_COLORS: Record<string, string> = {
  'policy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'journalism': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'finance': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'corporate': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'health': 'bg-red-500/20 text-red-400 border-red-500/30',
  'legal': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'general': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

const RISK_COLORS: Record<string, string> = {
  'low': 'bg-emerald-500/20 text-emerald-400',
  'medium': 'bg-amber-500/20 text-amber-400',
  'high': 'bg-red-500/20 text-red-400',
};

export default function GlobalIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AIAgentClass | null>(null);
  const [viewMode, setViewMode] = useState<'domains' | 'agents'>('domains');

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

  // Fetch questions with agent data
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['global-index-questions', selectedDomain, selectedAgent],
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
      
      if (selectedAgent) {
        query = query.eq('primary_ai_agent', selectedAgent);
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

  // Group questions by agent
  const questionsByAgent = useMemo(() => {
    const grouped: Record<string, typeof questions> = {};
    filteredQuestions.forEach((q) => {
      const agent = q.primary_ai_agent || 'general';
      if (!grouped[agent]) {
        grouped[agent] = [];
      }
      grouped[agent].push(q);
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

      {/* Live global WorldBank stats */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
        <LiveDataWidget countryCode="WLD" showTitle={true} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar with tabs for Domains/Agents */}
          <aside>
            <Card className="sticky top-32">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'domains' | 'agents')}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="domains">Domäner</TabsTrigger>
                  <TabsTrigger value="agents">AI-Agenter</TabsTrigger>
                </TabsList>

                <TabsContent value="domains" className="mt-0">
                  <ScrollArea className="h-[55vh]">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => { setSelectedDomain(null); setSelectedAgent(null); }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          !selectedDomain && !selectedAgent
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
                            onClick={() => { setSelectedDomain(domain.code); setSelectedAgent(null); }}
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
                </TabsContent>

                <TabsContent value="agents" className="mt-0">
                  <ScrollArea className="h-[55vh]">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => { setSelectedAgent(null); setSelectedDomain(null); }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          !selectedAgent && !selectedDomain
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted text-muted-foreground'
                        )}
                      >
                        <Globe className="h-4 w-4" />
                        <span>Alla agenter</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {questions.length}
                        </Badge>
                      </button>

                      {AI_AGENT_CLASSES.map((agent) => {
                        const Icon = AGENT_ICONS[agent.code] || Globe;
                        const count = questionsByAgent[agent.code]?.length || 0;
                        
                        return (
                          <button
                            key={agent.code}
                            onClick={() => { setSelectedAgent(agent.code); setSelectedDomain(null); }}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                              selectedAgent === agent.code
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-muted text-muted-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="truncate flex-1 text-left">{agent.name_sv}</span>
                            <Badge variant="secondary" className="text-xs">
                              {count}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
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
                  return (
                    <Card key={question.id} className="group hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="outline" className="text-xs font-mono">
                                {question.question_id}
                              </Badge>
                              {question.primary_ai_agent && (
                                <Badge 
                                  variant="outline" 
                                  className={cn('text-xs', AGENT_COLORS[question.primary_ai_agent])}
                                >
                                  {AI_AGENT_CLASSES.find(a => a.code === question.primary_ai_agent)?.name_sv || question.primary_ai_agent}
                                </Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={cn('text-xs', DATA_QUALITY_COLORS[question.data_quality || 'unverified'])}
                              >
                                Kvalitet {question.data_quality}
                              </Badge>
                              {question.misinterpretation_risk && question.misinterpretation_risk !== 'low' && (
                                <Badge 
                                  variant="outline" 
                                  className={cn('text-xs flex items-center gap-1', RISK_COLORS[question.misinterpretation_risk])}
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  {question.misinterpretation_risk === 'high' ? 'Hög risk' : 'Medel risk'}
                                </Badge>
                              )}
                            </div>

                            <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                              {question.question_sv}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {question.question_en}
                            </p>

                            <div className="flex flex-wrap gap-1">
                              {question.intent_layer && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  {question.intent_layer}
                                </Badge>
                              )}
                              {question.ai_retrieval_tags?.slice(0, 4).map((tag: string) => (
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
