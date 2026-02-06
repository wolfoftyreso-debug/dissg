/**
 * REPORTS INDEX PAGE
 * ============================================================================
 * 
 * Lists all published analysis reports with search and filtering.
 * Designed for discovery by users, search engines, and AI agents.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Globe, 
  TrendingUp, 
  BarChart3,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  data_period_start: string | null;
  data_period_end: string | null;
  confidence_score: number | null;
  view_count: number;
  published_at: string | null;
  question_id: string;
}

interface QuestionWithReports {
  id: string;
  slug: string;
  question_text: string;
  category: string;
  geo_level: string;
  geo_code: string | null;
  reports: ReportSummary[];
}

const categoryLabels: Record<string, string> = {
  'societal_state': 'Samhällstillstånd',
  'comparison': 'Jämförelser',
  'trend': 'Trender'
};

const categoryIcons: Record<string, React.ReactNode> = {
  'societal_state': <BarChart3 className="h-5 w-5" />,
  'comparison': <Globe className="h-5 w-5" />,
  'trend': <TrendingUp className="h-5 w-5" />
};

const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all published reports
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_reports')
        .select(`
          id,
          slug,
          title,
          subtitle,
          summary,
          data_period_start,
          data_period_end,
          confidence_score,
          view_count,
          published_at,
          question_id
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as ReportSummary[];
    }
  });

  // Fetch questions for categorization
  const { data: questions } = useQuery({
    queryKey: ['report-questions', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_questions')
        .select('id, slug, question_text, category, geo_level, geo_code')
        .eq('is_active', true)
        .order('priority_rank', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Filter reports
  const filteredReports = reports?.filter(report => {
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory && questions) {
      const question = questions.find(q => q.id === report.question_id);
      if (!question || question.category !== selectedCategory) return false;
    }

    return true;
  });

  // Group by category
  const reportsByCategory = filteredReports?.reduce((acc, report) => {
    const question = questions?.find(q => q.id === report.question_id);
    const category = question?.category || 'other';
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(report);
    return acc;
  }, {} as Record<string, ReportSummary[]>);

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Analysrapporter | DISSG',
    'description': 'Omfattande analysrapporter som svarar på vanliga samhällsfrågor med verifierade datakällor.',
    'url': 'https://dissg.global/reports',
    'publisher': {
      '@type': 'Organization',
      'name': 'DISSG'
    }
  };

  return (
    <>
      <Helmet>
        <title>Analysrapporter | DISSG</title>
        <meta name="description" content="Omfattande analysrapporter som svarar på vanliga samhällsfrågor med verifierade datakällor." />
        <link rel="canonical" href="https://dissg.global/reports" />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrg)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Analysrapporter
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Omfattande analysrapporter som svarar på vanliga frågor om samhällets tillstånd. 
              Varje rapport bygger på verifierade datakällor och följer en strukturerad analysmetod.
            </p>
          </div>
        </header>

        {/* Search and filters */}
        <div className="border-b border-border bg-card/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sök rapporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    !selectedCategory 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Alla
                </button>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5 ${
                      selectedCategory === key 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {categoryIcons[key]}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports list */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredReports && filteredReports.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(reportsByCategory || {}).map(([category, categoryReports]) => (
                <section key={category}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {categoryIcons[category]}
                    {categoryLabels[category] || 'Övriga'}
                    <Badge variant="secondary" className="ml-2">
                      {categoryReports.length}
                    </Badge>
                  </h2>
                  
                  <div className="grid gap-4">
                    {categoryReports.map(report => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Inga rapporter matchade din sökning.' 
                  : 'Inga publicerade rapporter ännu.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ReportCard: React.FC<{ report: ReportSummary }> = ({ report }) => {
  return (
    <Link 
      to={`/report/${report.slug}`}
      className="block bg-card border rounded-lg p-5 hover:border-primary/50 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {report.title}
          </h3>
          {report.subtitle && (
            <p className="text-sm text-muted-foreground mb-2">
              {report.subtitle}
            </p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {report.summary}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {report.data_period_end && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Data t.o.m. {new Date(report.data_period_end).toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })}
              </span>
            )}
            {report.confidence_score && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                {Math.round(report.confidence_score * 100)}% konfidens
              </span>
            )}
            <span>{report.view_count.toLocaleString('sv-SE')} visningar</span>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </Link>
  );
};

export default ReportsPage;
