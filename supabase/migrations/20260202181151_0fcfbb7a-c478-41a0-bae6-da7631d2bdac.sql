-- Create KPI thresholds table for configurable threshold values per KPI
CREATE TABLE public.kpi_thresholds (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(id) ON DELETE CASCADE,
    threshold_type TEXT NOT NULL CHECK (threshold_type IN ('critical_low', 'warning_low', 'target', 'warning_high', 'critical_high')),
    threshold_value NUMERIC NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (kpi_id, threshold_type)
);

-- Enable RLS
ALTER TABLE public.kpi_thresholds ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read thresholds
CREATE POLICY "Public can read thresholds"
ON public.kpi_thresholds
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only admins can modify thresholds
CREATE POLICY "Admins can insert thresholds"
ON public.kpi_thresholds
FOR INSERT
TO authenticated
WITH CHECK (
    public.has_gov_role(auth.uid(), 'statsminister') OR
    public.has_gov_role(auth.uid(), 'system_admin')
);

CREATE POLICY "Admins can update thresholds"
ON public.kpi_thresholds
FOR UPDATE
TO authenticated
USING (
    public.has_gov_role(auth.uid(), 'statsminister') OR
    public.has_gov_role(auth.uid(), 'system_admin')
);

CREATE POLICY "Admins can delete thresholds"
ON public.kpi_thresholds
FOR DELETE
TO authenticated
USING (
    public.has_gov_role(auth.uid(), 'statsminister') OR
    public.has_gov_role(auth.uid(), 'system_admin')
);

-- Trigger for updated_at
CREATE TRIGGER update_kpi_thresholds_updated_at
BEFORE UPDATE ON public.kpi_thresholds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.kpi_thresholds IS 'Configurable threshold values per KPI for alerts and visualization';