import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * DECISION GRAPH API
 * 
 * POST /decision/resolve - Resolve a decision graph
 * 
 * This does NOT provide recommendations.
 * This provides structured answers to structured questions.
 * Responsibility lies with the user/organization.
 */

interface ResolveRequest {
  graph_id?: string;
  template_id?: string;
  decision_title?: string;
  context: Record<string, string>;
  include_indices?: boolean;
  include_signals?: boolean;
}

interface DecisionNode {
  node_id: string;
  question: string;
  question_type: string;
  status: 'answered' | 'uncertain' | 'missing';
  answer?: {
    summary: string;
    confidence: number;
    limitations: string[];
  };
}

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ResolveRequest = await req.json();
    
    // Validate request
    if (!body.template_id && !body.graph_id && !body.decision_title) {
      return new Response(
        JSON.stringify({ 
          error: "Must provide template_id, graph_id, or decision_title" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get template-based nodes or create custom
    const nodes = getDecisionNodes(body.template_id, body.context);
    
    // Resolve each node
    const resolvedNodes = nodes.map(node => resolveNode(node, body.context));
    
    // Calculate metrics
    const answered = resolvedNodes.filter(n => n.status === 'answered').length;
    const uncertain = resolvedNodes.filter(n => n.status === 'uncertain').length;
    const missing = resolvedNodes.filter(n => n.status === 'missing').length;
    const completeness = answered / resolvedNodes.length;
    const confidence = resolvedNodes
      .filter(n => n.answer)
      .reduce((sum, n) => sum + (n.answer?.confidence || 0), 0) / answered || 0;

    // Build response
    const response = {
      success: true,
      graph: {
        graph_id: `graph_${Date.now()}`,
        version: "1.0.0",
        decision_title: body.decision_title || getTemplateTitle(body.template_id),
        domain: body.context.domain || "general",
        nodes: resolvedNodes,
        overall_confidence: Math.round(confidence * 100) / 100,
        completeness: Math.round(completeness * 100) / 100,
      },
      summary: {
        total_questions: resolvedNodes.length,
        answered_questions: answered,
        uncertain_questions: uncertain,
        missing_questions: missing,
        overall_confidence: Math.round(confidence * 100) / 100,
        completeness_percent: Math.round(completeness * 100),
        critical_gaps: missing,
      },
      context_used: body.context,
      resolved_at: new Date().toISOString(),
      
      // Index context if requested
      indices: body.include_indices ? getIndexContext(body.context) : undefined,
      
      // Signal context if requested
      signals: body.include_signals ? getSignalContext(body.context) : undefined,
      
      // Assumptions needed
      assumptions_needed: [
        {
          assumption_id: "time_horizon",
          description: "What time horizon is relevant?",
          options: ["1 year", "3 years", "5 years", "10+ years"],
          impact: "critical",
        },
        {
          assumption_id: "risk_tolerance",
          description: "What uncertainty level is acceptable?",
          options: ["Low (>80%)", "Medium (>60%)", "High (>40%)"],
          impact: "significant",
        },
      ],
      
      // Data gaps
      data_gaps: resolvedNodes
        .filter(n => n.status === 'missing' || n.status === 'uncertain')
        .map(n => ({
          question: n.question,
          gap_type: n.status === 'missing' ? 'no_data' : 'low_confidence',
          severity: n.status === 'missing' ? 'critical' : 'important',
          what_it_means: n.status === 'missing' 
            ? 'No data available for this question'
            : 'Data available but confidence is low',
          possible_alternatives: ['Proxy measures', 'Alternative sources'],
        })),
      
      // WHAT WE EXPLICITLY DON'T PROVIDE
      not_provided: [
        "Recommendations",
        "Optimal choices",
        "Value judgments",
        "Risk preferences",
        "Priority rankings",
        "Action suggestions",
        "Outcome predictions",
      ],
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Decision API error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Get decision nodes for a template
 */
function getDecisionNodes(templateId: string | undefined, context: Record<string, string>): DecisionNode[] {
  const sector = context.sector || 'general';
  const country = context.country || 'global';
  
  if (templateId === 'investment_decision_v1') {
    return [
      { node_id: 'demand_trend', question: `How has demand for ${sector} changed?`, question_type: 'trend', status: 'answered' },
      { node_id: 'demand_volatility', question: `How volatile is demand in ${sector}?`, question_type: 'volatility', status: 'answered' },
      { node_id: 'regional_diff', question: `How does demand differ across regions in ${country}?`, question_type: 'comparison', status: 'uncertain' },
      { node_id: 'market_normal', question: `What is normal market activity in ${sector}?`, question_type: 'normal_range', status: 'answered' },
      { node_id: 'dependencies', question: `What factors does ${sector} depend on?`, question_type: 'dependency', status: 'answered' },
      { node_id: 'policy_signals', question: `What policy signals affect ${sector}?`, question_type: 'signal', status: 'uncertain' },
    ];
  }
  
  if (templateId === 'healthcare_planning_v1') {
    return [
      { node_id: 'demand_trend', question: 'How has healthcare demand changed?', question_type: 'trend', status: 'answered' },
      { node_id: 'demographic', question: 'How is the population aging?', question_type: 'trend', status: 'answered' },
      { node_id: 'current_load', question: 'What is current healthcare load?', question_type: 'distribution', status: 'answered' },
      { node_id: 'wait_times', question: 'How do wait times compare?', question_type: 'comparison', status: 'answered' },
      { node_id: 'staffing', question: 'How is healthcare staffing trending?', question_type: 'trend', status: 'uncertain' },
      { node_id: 'readmissions', question: 'What are readmission rates?', question_type: 'distribution', status: 'missing' },
    ];
  }
  
  if (templateId === 'policy_decision_v1') {
    return [
      { node_id: 'current_state', question: 'What is the current state?', question_type: 'distribution', status: 'answered' },
      { node_id: 'trend', question: 'How has this changed over the decade?', question_type: 'trend', status: 'answered' },
      { node_id: 'international', question: `How does ${country} compare to peers?`, question_type: 'comparison', status: 'answered' },
      { node_id: 'affected', question: 'Which groups are most affected?', question_type: 'distribution', status: 'uncertain' },
      { node_id: 'dependencies', question: 'What systems depend on this?', question_type: 'dependency', status: 'missing' },
    ];
  }
  
  // Default minimal graph
  return [
    { node_id: 'current', question: 'What is the current state?', question_type: 'distribution', status: 'answered' },
    { node_id: 'trend', question: 'How has this changed?', question_type: 'trend', status: 'answered' },
    { node_id: 'comparison', question: 'How does this compare?', question_type: 'comparison', status: 'uncertain' },
  ];
}

/**
 * Resolve a node with simulated answer
 */
function resolveNode(node: DecisionNode, _context: Record<string, string>): DecisionNode {
  if (node.status === 'missing') {
    return node;
  }
  
  const confidence = node.status === 'answered' ? 0.75 + Math.random() * 0.2 : 0.45 + Math.random() * 0.15;
  
  return {
    ...node,
    answer: {
      summary: generateAnswerSummary(node.question, node.question_type),
      confidence: Math.round(confidence * 100) / 100,
      limitations: [
        'Based on available data',
        'Historical patterns may not predict future',
      ],
    },
  };
}

/**
 * Generate answer summary based on question type
 */
function generateAnswerSummary(question: string, questionType: string): string {
  switch (questionType) {
    case 'trend':
      return 'Moderate increasing trend observed over the analysis period, with seasonal variation.';
    case 'volatility':
      return 'Volatility within normal historical range, with occasional spikes during external shocks.';
    case 'comparison':
      return 'Performance is within the middle tercile compared to peers, with notable variation.';
    case 'normal_range':
      return 'Normal range is 45-65 units, current value is within this band.';
    case 'distribution':
      return 'Distribution shows concentration in urban areas, with long tail in rural regions.';
    case 'dependency':
      return 'Primary dependencies include economic growth, demographic trends, and policy environment.';
    case 'signal':
      return 'Current signal levels are elevated but within historical precedent.';
    default:
      return 'Data available for this dimension.';
  }
}

/**
 * Get template title
 */
function getTemplateTitle(templateId: string | undefined): string {
  switch (templateId) {
    case 'investment_decision_v1': return 'Investment Decision Analysis';
    case 'healthcare_planning_v1': return 'Healthcare Capacity Planning';
    case 'policy_decision_v1': return 'Policy Impact Assessment';
    default: return 'Custom Decision Analysis';
  }
}

/**
 * Get index context
 */
function getIndexContext(_context: Record<string, string>) {
  return [
    {
      index_id: 'system_stability',
      name: 'System Stability Index',
      value: 72,
      interpretation: 'Within normal range',
      relevance: 'Indicates overall system operating conditions',
    },
    {
      index_id: 'societal_stress',
      name: 'Societal Stress Index',
      value: 58,
      interpretation: 'Slightly elevated',
      relevance: 'May affect demand and resource allocation',
    },
  ];
}

/**
 * Get signal context
 */
function getSignalContext(context: Record<string, string>) {
  return [
    {
      signal_type: 'media_attention',
      topic: context.sector || 'general',
      level: 'normal',
      interpretation: 'Standard coverage levels',
      relevance: 'No unusual attention patterns detected',
    },
    {
      signal_type: 'policy_volatility',
      topic: 'regulation',
      level: 'elevated',
      interpretation: 'Above-normal policy activity',
      relevance: 'May indicate upcoming regulatory changes',
    },
  ];
}
