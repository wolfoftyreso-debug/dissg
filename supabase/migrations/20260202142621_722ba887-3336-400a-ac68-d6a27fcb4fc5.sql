-- ============================================================
-- USER MISSIONS TABLE
-- "Ansvar utan skuld" - Personal tracking without judgment
-- ============================================================

-- Create missions table
CREATE TABLE public.user_missions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Focus definition
  focus_type TEXT NOT NULL CHECK (focus_type IN ('municipality', 'region', 'country', 'topic')),
  focus_id TEXT NOT NULL, -- GMID for geo, topic code for topics
  focus_name TEXT NOT NULL, -- Human-readable name
  
  -- Mission details
  title TEXT, -- Optional custom title
  description TEXT, -- Optional description
  
  -- Tracking configuration
  tracking_enabled BOOLEAN NOT NULL DEFAULT true,
  notification_frequency TEXT DEFAULT 'weekly' CHECK (notification_frequency IN ('daily', 'weekly', 'monthly', 'never')),
  
  -- Related questions (which BQL questions to track)
  tracked_question_ids TEXT[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mission snapshots for historical tracking
CREATE TABLE public.mission_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.user_missions(id) ON DELETE CASCADE,
  
  -- Snapshot data
  snapshot_date DATE NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('improving', 'declining', 'stable', 'unclear')),
  direction_score NUMERIC(5,2), -- -100 to +100
  
  -- Key indicators at this point
  key_indicators JSONB DEFAULT '{}',
  
  -- Summary
  summary_text TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mission alerts
CREATE TABLE public.mission_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.user_missions(id) ON DELETE CASCADE,
  
  -- Alert details
  alert_type TEXT NOT NULL CHECK (alert_type IN ('direction_change', 'significant_movement', 'new_data', 'milestone')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_data JSONB DEFAULT '{}',
  
  -- Status
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_missions
CREATE POLICY "Users can view their own missions" 
ON public.user_missions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own missions" 
ON public.user_missions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own missions" 
ON public.user_missions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own missions" 
ON public.user_missions 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for mission_snapshots (via mission ownership)
CREATE POLICY "Users can view snapshots of their missions" 
ON public.mission_snapshots 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_missions 
    WHERE id = mission_snapshots.mission_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "System can create snapshots" 
ON public.mission_snapshots 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_missions 
    WHERE id = mission_snapshots.mission_id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for mission_alerts (via mission ownership)
CREATE POLICY "Users can view alerts for their missions" 
ON public.mission_alerts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_missions 
    WHERE id = mission_alerts.mission_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update alerts (mark as read)" 
ON public.mission_alerts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_missions 
    WHERE id = mission_alerts.mission_id 
    AND user_id = auth.uid()
  )
);

-- Indexes for performance
CREATE INDEX idx_user_missions_user_id ON public.user_missions(user_id);
CREATE INDEX idx_user_missions_focus ON public.user_missions(focus_type, focus_id);
CREATE INDEX idx_user_missions_active ON public.user_missions(is_active) WHERE is_active = true;

CREATE INDEX idx_mission_snapshots_mission_id ON public.mission_snapshots(mission_id);
CREATE INDEX idx_mission_snapshots_date ON public.mission_snapshots(snapshot_date DESC);

CREATE INDEX idx_mission_alerts_mission_id ON public.mission_alerts(mission_id);
CREATE INDEX idx_mission_alerts_unread ON public.mission_alerts(mission_id) WHERE is_read = false;

-- Trigger for updated_at
CREATE TRIGGER update_user_missions_updated_at
BEFORE UPDATE ON public.user_missions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();