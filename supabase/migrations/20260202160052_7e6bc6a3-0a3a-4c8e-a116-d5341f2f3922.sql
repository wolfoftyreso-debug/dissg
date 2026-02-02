-- Explanation Nodes Table
-- Stores the pyramid of explanations (Level 0-4)
-- Each node can explain a parent node and have children

CREATE TABLE public.explanation_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id TEXT NOT NULL UNIQUE,
  explains TEXT REFERENCES public.explanation_nodes(node_id) ON DELETE SET NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 4),
  scope TEXT NOT NULL,
  content TEXT NOT NULL,
  sources TEXT[] DEFAULT '{}',
  limitations TEXT[] DEFAULT '{}',
  children TEXT[] DEFAULT '{}',
  
  -- URL for SEO
  url TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  deeper_click_count INTEGER DEFAULT 0,
  back_click_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.explanation_nodes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Explanation nodes are publicly readable"
ON public.explanation_nodes
FOR SELECT
USING (is_active = true);

-- Depth Analytics Table
-- Tracks how users navigate through explanation levels
CREATE TABLE public.explanation_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id TEXT NOT NULL REFERENCES public.explanation_nodes(node_id) ON DELETE CASCADE,
  session_id TEXT,
  
  -- Engagement metrics
  time_on_level_ms INTEGER DEFAULT 0,
  clicked_deeper BOOLEAN DEFAULT false,
  clicked_back BOOLEAN DEFAULT false,
  confusion_signals INTEGER DEFAULT 0, -- re-reads, rapid scrolling
  
  -- Context
  entry_level INTEGER NOT NULL,
  exit_level INTEGER,
  max_depth_reached INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.explanation_analytics ENABLE ROW LEVEL SECURITY;

-- Allow inserts for analytics tracking
CREATE POLICY "Allow analytics inserts"
ON public.explanation_analytics
FOR INSERT
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_explanation_nodes_level ON public.explanation_nodes(level);
CREATE INDEX idx_explanation_nodes_explains ON public.explanation_nodes(explains);
CREATE INDEX idx_explanation_nodes_scope ON public.explanation_nodes(scope);
CREATE INDEX idx_explanation_analytics_node ON public.explanation_analytics(node_id);
CREATE INDEX idx_explanation_analytics_session ON public.explanation_analytics(session_id);

-- Function to update view count
CREATE OR REPLACE FUNCTION public.increment_node_view(p_node_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.explanation_nodes 
  SET view_count = view_count + 1 
  WHERE node_id = p_node_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track deeper click
CREATE OR REPLACE FUNCTION public.track_deeper_click(p_node_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.explanation_nodes 
  SET deeper_click_count = deeper_click_count + 1 
  WHERE node_id = p_node_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment for documentation
COMMENT ON TABLE public.explanation_nodes IS 'Explanation pyramid nodes (Level 0-4). Each level provides deeper detail without forcing navigation.';
COMMENT ON TABLE public.explanation_analytics IS 'Tracks how users navigate through explanation levels for self-learning optimization.';