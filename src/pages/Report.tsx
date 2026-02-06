/**
 * ANALYSIS REPORT PAGE
 * ============================================================================
 * 
 * SEO-optimized, machine-readable report page following A2F structure.
 * Each report answers a canonical question with verifiable data sources.
 * 
 * URL: /report/:slug
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Calendar, 
  Globe, 
  TrendingUp, 
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  Clock,
  Share2,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportCitation {
  id: string;
  source_name: string;
  source_organization: string | null;
  source_url: string | null;
  data_type: string | null;
  cited_value: string | null;
  cited_date: string | null;
  reliability_score: number | null;
  is_verified: boolean;
  citation_order: number;
}

interface AnalysisReport {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  mechanisms: string | null;
  timeline: any[];
  comparison: Record<string, any>;
  uncertainty: string | null;
  deep_dive_links: string[];
  content_markdown: string;
  structured_data: Record<string, any>;
  data_period_start: string | null;
  data_period_end: string | null;
  data_last_verified: string | null;
  model_used: string | null;
  confidence_score: number | null;
  status: string;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  view_count: number;
  citation_count: number;
  created_at: string;
  updated_at: string;
}

const ReportPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch report with citations
  const { data, isLoading, error } = useQuery({
    queryKey: ['report', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');

      // Get report
      const { data: report, error: reportError } = await supabase
        .from('analysis_reports')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (reportError) throw reportError;

      // Get citations
      const { data: citations, error: citError } = await supabase
        .from('report_citations')
        .select('*')
        .eq('report_id', report.id)
        .order('citation_order', { ascending: true });

      if (citError) throw citError;

      return { 
        report: report as AnalysisReport, 
        citations: (citations || []) as ReportCitation[] 
      };
    },
    enabled: !!slug,
  });

  // Increment view count
  useEffect(() => {
    if (data?.report?.id) {
      supabase.rpc('increment_report_view', { p_report_id: data.report.id });
    }
  }, [data?.report?.id]);

  if (isLoading) {
    return <ReportSkeleton />;
  }

  if (error || !data) {
    return <ReportNotFound />;
  }

  const { report, citations } = data;

  // Schema.org structured data
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': report.title,
    'description': report.meta_description || report.summary,
    'datePublished': report.published_at,
    'dateModified': report.updated_at,
    'author': {
      '@type': 'Organization',
      'name': 'DISSG',
      'url': 'https://dissg.global'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'DISSG - Diagnostic Information System for Societal Governance',
      'url': 'https://dissg.global'
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://dissg.global/report/${slug}`
    },
    'citation': citations.map(c => ({
      '@type': 'CreativeWork',
      'name': c.source_name,
      'url': c.source_url,
      'author': { '@type': 'Organization', 'name': c.source_organization }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{report.meta_title || report.title} | DISSG</title>
        <meta name="description" content={report.meta_description || report.summary} />
        <link rel="canonical" href={report.canonical_url || `https://dissg.global/report/${slug}`} />
        <meta property="og:title" content={report.title} />
        <meta property="og:description" content={report.meta_description || report.summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://dissg.global/report/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(schemaOrg)}
        </script>
      </Helmet>

      <article className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link 
              to="/reports" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Alla rapporter
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {report.title}
            </h1>
            
            {report.subtitle && (
              <p className="text-lg text-muted-foreground mb-4">
                {report.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {report.data_period_start && report.data_period_end && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Data: {new Date(report.data_period_start).toLocaleDateString('sv-SE')} – {new Date(report.data_period_end).toLocaleDateString('sv-SE')}
                  </span>
                </div>
              )}
              
              {report.data_last_verified && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>
                    Verifierad: {new Date(report.data_last_verified).toLocaleDateString('sv-SE')}
                  </span>
                </div>
              )}

              {report.confidence_score && (
                <Badge variant="outline" className="font-mono">
                  Konfidens: {Math.round(report.confidence_score * 100)}%
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary - The short factual answer */}
              <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Kort svar
                </h2>
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                  <p className="text-foreground leading-relaxed">
                    {report.summary}
                  </p>
                </div>
              </section>

              {/* Mechanisms - Driving factors */}
              {report.mechanisms && (
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Drivande faktorer
                  </h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>{report.mechanisms}</p>
                  </div>
                </section>
              )}

              {/* Timeline */}
              {report.timeline && report.timeline.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Historisk utveckling
                  </h2>
                  <div className="space-y-2">
                    {report.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <span className="font-mono text-sm text-muted-foreground min-w-[60px]">
                          {item.year || item.date}
                        </span>
                        <span className="text-sm">{item.event || item.description}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Comparison */}
              {report.comparison && Object.keys(report.comparison).length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-emerald-600" />
                    Jämförelse
                  </h2>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(report.comparison, null, 2)}
                    </pre>
                  </div>
                </section>
              )}

              {/* Uncertainty */}
              {report.uncertainty && (
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Osäkerhet och begränsningar
                  </h2>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      {report.uncertainty}
                    </p>
                  </div>
                </section>
              )}

              {/* Full content */}
              <Separator />
              <section>
                <h2 className="text-lg font-semibold mb-4">Fullständig analys</h2>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {report.content_markdown.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-1" />
                  Dela
                </Button>
              </div>

              {/* Citations */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-sm">
                  Källor ({citations.length})
                </h3>
                <div className="space-y-3">
                  {citations.map((citation, index) => (
                    <div key={citation.id} className="text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-muted-foreground min-w-[20px]">
                          [{index + 1}]
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {citation.source_name}
                          </div>
                          {citation.source_organization && (
                            <div className="text-xs text-muted-foreground">
                              {citation.source_organization}
                            </div>
                          )}
                          {citation.source_url && (
                            <a 
                              href={citation.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Källa <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {citation.is_verified && (
                            <Badge variant="outline" className="text-xs ml-2">
                              <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                              Verifierad
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep dive links */}
              {report.deep_dive_links && report.deep_dive_links.length > 0 && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-sm">Fördjupning</h3>
                  <div className="space-y-2">
                    {report.deep_dive_links.map((link, index) => (
                      <a 
                        key={index}
                        href={link}
                        className="block text-sm text-primary hover:underline"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Visningar: {report.view_count.toLocaleString('sv-SE')}</p>
                <p>Publicerad: {report.published_at ? new Date(report.published_at).toLocaleDateString('sv-SE') : 'Ej publicerad'}</p>
                {report.model_used && <p>Genererad med: {report.model_used}</p>}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
};

const ReportSkeleton = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </header>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-32 w-full mb-8" />
      <Skeleton className="h-48 w-full mb-8" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

const ReportNotFound = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Rapport hittades inte</h1>
      <p className="text-muted-foreground mb-4">
        Den efterfrågade rapporten finns inte eller är inte publicerad.
      </p>
      <Link to="/reports">
        <Button>Till alla rapporter</Button>
      </Link>
    </div>
  </div>
);

export default ReportPage;
