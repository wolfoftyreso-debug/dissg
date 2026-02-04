-- Fix the trigger function to work properly with BEFORE INSERT
-- The issue is that the revision is inserted before the main row exists
-- Change to AFTER INSERT trigger instead

DROP TRIGGER IF EXISTS kpi_value_revision_trigger ON public.kpi_values;

-- Create a simpler approach: skip revision on insert, only track updates
CREATE OR REPLACE FUNCTION public.create_kpi_value_revision()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_checksum TEXT;
  prev_checksum TEXT;
  new_revision INTEGER;
BEGIN
  -- Compute checksum of current state
  new_checksum := public.compute_checksum(jsonb_build_object(
    'kpi_id', NEW.kpi_id,
    'value', NEW.value,
    'period_start', NEW.period_start,
    'period_end', NEW.period_end,
    'status', NEW.status,
    'trend', NEW.trend,
    'confidence', NEW.confidence
  ));
  
  -- For INSERT, just set the checksum and return (no revision record needed initially)
  IF TG_OP = 'INSERT' THEN
    NEW.checksum := new_checksum;
    NEW.current_revision := 1;
    RETURN NEW;
  END IF;
  
  -- For UPDATE, create revision if data changed
  SELECT checksum INTO prev_checksum FROM public.kpi_values WHERE id = NEW.id;
  
  IF prev_checksum IS NULL OR prev_checksum != new_checksum THEN
    SELECT COALESCE(MAX(revision_number), 0) + 1 INTO new_revision
    FROM public.kpi_value_revisions
    WHERE kpi_value_id = NEW.id;
    
    INSERT INTO public.kpi_value_revisions (
      kpi_value_id, revision_number, value, previous_value, status, trend,
      trend_percent, confidence, is_provisional, checksum, previous_checksum,
      revision_type, revision_reason
    ) VALUES (
      NEW.id, new_revision, NEW.value, NEW.previous_value, NEW.status, NEW.trend,
      NEW.trend_percent, NEW.confidence, NEW.is_provisional, new_checksum, prev_checksum,
      'data_update', 'Value updated'
    );
    
    NEW.current_revision := new_revision;
    NEW.checksum := new_checksum;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate trigger
CREATE TRIGGER kpi_value_revision_trigger
  BEFORE INSERT OR UPDATE ON public.kpi_values
  FOR EACH ROW
  EXECUTE FUNCTION public.create_kpi_value_revision();