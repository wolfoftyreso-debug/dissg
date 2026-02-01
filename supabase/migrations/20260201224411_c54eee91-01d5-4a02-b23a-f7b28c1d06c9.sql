-- ═══════════════════════════════════════════════════════════════
-- UPPDATERA RLS-POLICIES FÖR WRITE-OPERATIONER
-- ═══════════════════════════════════════════════════════════════

-- Tillåt INSERT för action_options (alla kan föreslå åtgärder)
CREATE POLICY "Anyone can propose actions" ON public.action_options
  FOR INSERT WITH CHECK (true);

-- Tillåt UPDATE för action_options (för statusändringar)
CREATE POLICY "Anyone can update actions" ON public.action_options
  FOR UPDATE USING (true);

-- Tillåt INSERT för action_evaluations (edge function använder service role)
CREATE POLICY "Service can insert evaluations" ON public.action_evaluations
  FOR INSERT WITH CHECK (true);