-- Fix RLS on new tables
ALTER TABLE public.query_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precomputed_aggregations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Cache is publicly readable"
  ON public.query_cache FOR SELECT USING (true);

CREATE POLICY "Precomputed aggregations are publicly readable"
  ON public.precomputed_aggregations FOR SELECT USING (true);

CREATE POLICY "Pipeline status is publicly readable"
  ON public.pipeline_status FOR SELECT USING (true);

CREATE POLICY "System metrics are publicly readable"
  ON public.system_metrics FOR SELECT USING (true);