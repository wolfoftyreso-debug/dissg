-- ═══════════════════════════════════════════════════════════════
-- COUNTRY PORTFOLIOS - Premium feature for Analyst/Institutional tiers
-- ═══════════════════════════════════════════════════════════════

-- Portfolio table - stores user portfolios
CREATE TABLE public.country_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure unique portfolio names per user
  UNIQUE(user_id, name)
);

-- Portfolio items - links countries to portfolios
CREATE TABLE public.country_portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.country_portfolios(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  
  -- Each country can only be in a portfolio once
  UNIQUE(portfolio_id, country_code)
);

-- Enable RLS
ALTER TABLE public.country_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_portfolio_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolios
CREATE POLICY "Users can view their own portfolios"
ON public.country_portfolios
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create portfolios"
ON public.country_portfolios
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND public.has_tier_access(auth.uid(), 'analyst')
);

CREATE POLICY "Users can update their own portfolios"
ON public.country_portfolios
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
ON public.country_portfolios
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for portfolio items
CREATE POLICY "Users can view items in their portfolios"
ON public.country_portfolio_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.country_portfolios p
    WHERE p.id = portfolio_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add items to their portfolios"
ON public.country_portfolio_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.country_portfolios p
    WHERE p.id = portfolio_id 
      AND p.user_id = auth.uid()
      AND public.has_tier_access(auth.uid(), 'analyst')
  )
);

CREATE POLICY "Users can update items in their portfolios"
ON public.country_portfolio_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.country_portfolios p
    WHERE p.id = portfolio_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete items from their portfolios"
ON public.country_portfolio_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.country_portfolios p
    WHERE p.id = portfolio_id AND p.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_country_portfolios_updated_at
  BEFORE UPDATE ON public.country_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_country_portfolios_user ON public.country_portfolios(user_id);
CREATE INDEX idx_country_portfolio_items_portfolio ON public.country_portfolio_items(portfolio_id);
CREATE INDEX idx_country_portfolio_items_country ON public.country_portfolio_items(country_code);