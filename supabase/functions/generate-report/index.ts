/**
 * GENERATE REPORT
 * ============================================================================
 * 
 * Edge function that generates analysis reports using an AI service.
 * Follows the A2F (Always-Answer Format) structure with 6 mandatory parts.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface GenerateReportRequest {
  question_id: string;
  geo_code?: string;
  time_period?: string;
  force_regenerate?: boolean;
}

interface A2FReport {
  title: string;
  subtitle: string;
  summary: string;
  mechanisms: string;
  timeline: { year: string; event: string }[];
  comparison: Record<string, any>;
  uncertainty: string;
  deep_dive_links: string[];
  content_markdown: string;
  confidence_score: number;
  citations: { source_name: string; source_organization: string; source_url: string; data_type: string }[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question_id, geo_code, time_period, force_regenerate } = await req.json() as GenerateReportRequest;

    if (!question_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'question_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiApiKey = Deno.env.get('AI_API_KEY');
    const aiChatCompletionsUrl = Deno.env.get('AI_CHAT_COMPLETIONS_URL');
    if (!aiApiKey || !aiChatCompletionsUrl) {
      console.error('AI service not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the question
    const { data: question, error: questionError } = await supabase
      .from('report_questions')
      .select('*')
      .eq('id', question_id)
      .single();

    if (questionError || !question) {
      return new Response(
        JSON.stringify({ success: false, error: 'Question not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating report for question:', question.question_text);

    // Build the generation prompt
    const systemPrompt = `You are DISSG, a diagnostic information system for societal governance. 
You generate factual, data-driven analysis reports that answer questions about society.

CRITICAL RULES:
1. NEVER give opinions, recommendations, or normative statements
2. ALWAYS cite sources for every claim
3. Use neutral language: "observed co-movement" not "caused by"
4. Include uncertainty and limitations prominently
5. Present data, not conclusions

OUTPUT FORMAT: You must respond with valid JSON matching this structure:
{
  "title": "Clear, descriptive title",
  "subtitle": "Additional context",
  "summary": "2-3 sentence factual answer to the question",
  "mechanisms": "Explanation of driving factors (what the data shows)",
  "timeline": [{"year": "2020", "event": "Description of what happened"}],
  "comparison": {"context": "How this compares to other regions/time periods"},
  "uncertainty": "Clear statement of data limitations and what cannot be concluded",
  "deep_dive_links": ["Related topics for further exploration"],
  "content_markdown": "Full article content in markdown format, 500-1000 words",
  "confidence_score": 0.85,
  "citations": [{"source_name": "Source title", "source_organization": "Organization", "source_url": "https://...", "data_type": "statistic"}]
}`;

    const userPrompt = `Generate a comprehensive analysis report answering this question:

QUESTION: ${question.question_text}

GEOGRAPHIC SCOPE: ${geo_code || question.geo_code || 'Global'}
TIME PERIOD: ${time_period || 'Latest available data'}
CATEGORY: ${question.category}
RELATED INDICATORS: ${question.primary_indicator_codes?.join(', ') || 'General societal indicators'}

Remember:
- Answer the question directly with facts
- Cite credible sources (government statistics, international organizations)
- Include historical context
- Compare with relevant benchmarks
- State limitations clearly
- Write in Swedish for a Swedish audience`;

    const aiResponse = await fetch(aiChatCompletionsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResult = await aiResponse.json();
    const responseContent = aiResult.choices?.[0]?.message?.content;

    if (!responseContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'Empty AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let reportData: A2FReport;
    try {
      // Extract JSON from potential markdown code blocks
      let jsonStr = responseContent;
      if (responseContent.includes('```json')) {
        jsonStr = responseContent.split('```json')[1].split('```')[0].trim();
      } else if (responseContent.includes('```')) {
        jsonStr = responseContent.split('```')[1].split('```')[0].trim();
      }
      reportData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', responseContent);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate slug
    const slug = generateSlug(reportData.title, geo_code || question.geo_code);
    const now = new Date().toISOString();

    // Insert the report
    const { data: report, error: reportError } = await supabase
      .from('analysis_reports')
      .insert({
        question_id,
        slug,
        title: reportData.title,
        subtitle: reportData.subtitle,
        summary: reportData.summary,
        mechanisms: reportData.mechanisms,
        timeline: reportData.timeline,
        comparison: reportData.comparison,
        uncertainty: reportData.uncertainty,
        deep_dive_links: reportData.deep_dive_links,
        content_markdown: reportData.content_markdown,
        model_used: 'google/gemini-2.5-pro',
        generation_timestamp: now,
        confidence_score: reportData.confidence_score,
        status: 'draft', // Needs review before publishing
        data_last_verified: now,
        meta_title: `${reportData.title} | DISSG`,
        meta_description: reportData.summary.substring(0, 155),
      })
      .select()
      .single();

    if (reportError) {
      console.error('Failed to save report:', reportError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save report' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert citations
    if (reportData.citations && reportData.citations.length > 0) {
      const citations = reportData.citations.map((c, index) => ({
        report_id: report.id,
        source_name: c.source_name,
        source_organization: c.source_organization,
        source_url: c.source_url,
        data_type: c.data_type,
        citation_order: index + 1,
      }));

      const { error: citationError } = await supabase
        .from('report_citations')
        .insert(citations);

      if (citationError) {
        console.error('Failed to save citations:', citationError);
      }
    }

    console.log('Report generated successfully:', report.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        report_id: report.id,
        slug: report.slug,
        status: 'draft'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSlug(title: string, geoCode?: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
  
  const date = new Date().toISOString().split('T')[0];
  const suffix = geoCode ? `-${geoCode.toLowerCase()}` : '';
  
  return `${baseSlug}${suffix}-${date}`;
}
