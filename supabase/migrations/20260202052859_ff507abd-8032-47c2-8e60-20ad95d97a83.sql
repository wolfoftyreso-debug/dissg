-- Enable realtime for policy_decisions and decision_timeline
ALTER PUBLICATION supabase_realtime ADD TABLE public.policy_decisions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.decision_timeline;