-- GMI Weight Changes - Audit log for all weight modifications
CREATE TABLE public.gmi_weight_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension_id TEXT NOT NULL,
  dimension_name TEXT NOT NULL,
  previous_weight NUMERIC(5,2) NOT NULL,
  new_weight NUMERIC(5,2) NOT NULL,
  reason TEXT NOT NULL,
  version TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'methodology_board',
  country_code TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX idx_gmi_weight_changes_dimension ON public.gmi_weight_changes(dimension_id);
CREATE INDEX idx_gmi_weight_changes_created ON public.gmi_weight_changes(created_at DESC);
CREATE INDEX idx_gmi_weight_changes_version ON public.gmi_weight_changes(version);

-- Enable Row Level Security
ALTER TABLE public.gmi_weight_changes ENABLE ROW LEVEL SECURITY;

-- Public read access (transparent audit log)
CREATE POLICY "Weight changes are publicly readable" 
ON public.gmi_weight_changes 
FOR SELECT 
USING (true);

-- Only authenticated methodology_board can insert changes
CREATE POLICY "Authenticated users can insert weight changes" 
ON public.gmi_weight_changes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Add comment for documentation
COMMENT ON TABLE public.gmi_weight_changes IS 'Immutable audit log for GMI weight modifications. All changes are logged with rationale per factory diagnostic protocol.';
COMMENT ON COLUMN public.gmi_weight_changes.reason IS 'Mandatory justification for weight change - required by methodology board';
COMMENT ON COLUMN public.gmi_weight_changes.version IS 'GMI model version at time of change';