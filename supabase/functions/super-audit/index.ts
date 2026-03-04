/**
 * Super Audit Edge Function — V2
 * 
 * POST-ACQUISITION GOD MODE — ABSOLUTE REALITY CHECK
 * 
 * Now audits ALL system modules:
 * 1. Structural Audit (hierarchy & flow)
 * 2. Clarity Audit (human comprehension)
 * 3. Data Integrity Audit (truth over completeness)
 * 4. AI-Agent Audit (grounding & hallucination resistance)
 * 5. Causal DAG Audit (graph integrity & epistemics)
 * 6. Calibration Audit (Brier scores & confidence)
 * 7. Accountability Audit (SMART goals & assignments)
 * 8. Power/Abuse Audit (manipulation resistance)
 * 9. Simplicity Audit (reduction metrics)
 * 10. Red Team Audit (attack surface analysis)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditFinding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  location?: string;
  suggestedAction: 'delete' | 'simplify' | 'preserve' | 'constrain';
  details?: string;
}

interface AuditResult {
  auditType: string;
  passed: boolean;
  score: number;
  findings: AuditFinding[];
  recommendations: string[];
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const auditResults: AuditResult[] = [];
    const toDelete: string[] = [];
    const toSimplify: string[] = [];
    const neverChange: string[] = [];
    const newConstraints: string[] = [];

    // ========================================
    // 1. STRUCTURAL AUDIT
    // ========================================
    const structuralFindings: AuditFinding[] = [];
    
    const { data: allIndicators } = await supabase
      .from('kpi_definitions')
      .select('id, code, name, category')
      .eq('is_active', true);
    
    const { data: observationCounts } = await supabase
      .from('observations')
      .select('kpi_id');
    
    const observedKpis = new Set(observationCounts?.map(o => o.kpi_id) || []);
    const indicatorCount = allIndicators?.length ?? 0;
    let orphanedCount = 0;
    
    allIndicators?.forEach(indicator => {
      if (!observedKpis.has(indicator.id)) {
        orphanedCount++;
        structuralFindings.push({
          severity: 'medium',
          category: 'orphaned_indicator',
          description: `Indicator "${indicator.name}" (${indicator.code}) has no observations`,
          location: `/indicators/${indicator.code}`,
          suggestedAction: 'delete',
          details: 'Dead node in knowledge graph — no data flows through it',
        });
        toDelete.push(`Orphaned indicator: ${indicator.code}`);
      }
    });

    // Check analysis chains without linked observations
    const { data: chainsWithoutObs } = await supabase
      .from('analysis_chains')
      .select('id, observation_id')
      .is('observation_id', null);
    
    if (chainsWithoutObs && chainsWithoutObs.length > 0) {
      structuralFindings.push({
        severity: 'high',
        category: 'dangling_chain',
        description: `${chainsWithoutObs.length} analysis chains without linked observation`,
        suggestedAction: 'delete',
        details: 'Analysis chains must trace back to observations for epistemological integrity',
      });
      toDelete.push(`${chainsWithoutObs.length} dangling analysis chains`);
    }

    const structuralScore = indicatorCount > 0
      ? Math.max(0, 100 - (orphanedCount / indicatorCount) * 100)
      : 100;

    auditResults.push({
      auditType: 'STRUCTURAL_AUDIT',
      passed: structuralFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.round(structuralScore),
      findings: structuralFindings,
      recommendations: [
        'Remove indicators without observations',
        'Ensure clear Facts → Indicators → Questions → Understanding flow',
        'Delete dangling analysis chains',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 2. CLARITY AUDIT
    // ========================================
    const clarityFindings: AuditFinding[] = [];
    
    const { data: definitions } = await supabase
      .from('kpi_definitions')
      .select('id, code, description, name')
      .eq('is_active', true);
    
    let longDescriptions = 0;
    definitions?.forEach(def => {
      if (def.description) {
        const wordCount = def.description.split(' ').length;
        if (wordCount > 50) {
          longDescriptions++;
          clarityFindings.push({
            severity: 'medium',
            category: 'complex_description',
            description: `"${def.name}" description too long (${wordCount} words)`,
            location: def.code,
            suggestedAction: 'simplify',
            details: `15-year-old test: FAIL. Reduce to <50 words. Current: ${wordCount}`,
          });
          toSimplify.push(`Simplify: ${def.code} (${wordCount} words)`);
        }
      }
    });

    // Check for questions without clear scope
    const { data: questionsWithoutScope } = await supabase
      .from('canonical_questions')
      .select('id, canonical_text, scope_level')
      .is('scope_level', null);

    if (questionsWithoutScope && questionsWithoutScope.length > 0) {
      clarityFindings.push({
        severity: 'high',
        category: 'missing_scope',
        description: `${questionsWithoutScope.length} canonical questions without scope level`,
        suggestedAction: 'constrain',
        details: 'Every question must declare its scope (national/regional/global)',
      });
      newConstraints.push('Require scope_level for all canonical questions');
    }

    auditResults.push({
      auditType: 'CLARITY_AUDIT',
      passed: clarityFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - longDescriptions * 5),
      findings: clarityFindings,
      recommendations: ['Reduce description length', 'Add scope to all questions'],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 3. DATA INTEGRITY AUDIT
    // ========================================
    const integrityFindings: AuditFinding[] = [];
    
    const { data: obsWithoutUncertainty, count: uncertaintyMissing } = await supabase
      .from('observations')
      .select('id', { count: 'exact' })
      .is('uncertainty', null);
    
    if (uncertaintyMissing && uncertaintyMissing > 0) {
      integrityFindings.push({
        severity: 'critical',
        category: 'missing_uncertainty',
        description: `${uncertaintyMissing} observations without uncertainty level`,
        suggestedAction: 'constrain',
        details: 'TRUTH ENGINE VIOLATION: Every observation MUST declare uncertainty',
      });
      newConstraints.push('Require uncertainty for all observations');
    }

    const { count: estimatedNoMethod } = await supabase
      .from('kpi_values')
      .select('id', { count: 'exact' })
      .eq('is_estimated', true)
      .is('estimation_method', null);
    
    if (estimatedNoMethod && estimatedNoMethod > 0) {
      integrityFindings.push({
        severity: 'critical',
        category: 'unmarked_estimation',
        description: `${estimatedNoMethod} estimated values without method declaration`,
        suggestedAction: 'constrain',
        details: 'Inferred values presented as observed = epistemic fraud. Must label.',
      });
      newConstraints.push('Block estimated values without estimation_method');
    }

    // Check for gaps silently smoothed (values with same value across long periods)
    const { data: staleValues } = await supabase
      .from('kpi_values')
      .select('kpi_id, value, period_start, period_end')
      .eq('status', 'current')
      .order('period_start', { ascending: false })
      .limit(500);

    const kpiValueMap = new Map<string, number[]>();
    staleValues?.forEach(v => {
      const arr = kpiValueMap.get(v.kpi_id) || [];
      arr.push(v.value);
      kpiValueMap.set(v.kpi_id, arr);
    });
    
    let suspiciouslyStable = 0;
    kpiValueMap.forEach((values, kpiId) => {
      if (values.length >= 5) {
        const allSame = values.slice(0, 5).every(v => v === values[0]);
        if (allSame) suspiciouslyStable++;
      }
    });

    if (suspiciouslyStable > 0) {
      integrityFindings.push({
        severity: 'high',
        category: 'suspicious_stability',
        description: `${suspiciouslyStable} KPIs with identical values across 5+ periods`,
        suggestedAction: 'simplify',
        details: 'Possibly silently smoothed or stale data. Verify or show gaps explicitly.',
      });
    }

    const integrityScore = Math.max(0, 100 - integrityFindings.length * 20);
    auditResults.push({
      auditType: 'DATA_INTEGRITY_AUDIT',
      passed: integrityFindings.filter(f => f.severity === 'critical').length === 0,
      score: integrityScore,
      findings: integrityFindings,
      recommendations: [
        'Add uncertainty to all observations',
        'Document estimation methods',
        'Show gaps rather than smoothing',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 4. AI-AGENT AUDIT
    // ========================================
    const aiFindings: AuditFinding[] = [];
    
    // Check canonical answers without methodology
    const { count: answersNoMethod } = await supabase
      .from('canonical_answers')
      .select('id', { count: 'exact' })
      .is('methodology_text', null)
      .eq('is_current', true);

    if (answersNoMethod && answersNoMethod > 0) {
      aiFindings.push({
        severity: 'high',
        category: 'missing_methodology',
        description: `${answersNoMethod} canonical answers without methodology`,
        suggestedAction: 'constrain',
        details: 'AI agents MUST be able to cite methodology. No black boxes.',
      });
      newConstraints.push('Require methodology for all canonical answers');
    }

    // Check response templates for forbidden patterns
    const { data: templates } = await supabase
      .from('ai_response_templates')
      .select('id, template_code, template_text')
      .eq('is_active', true);

    const forbiddenPatterns = ['should', 'must', 'recommend', 'best', 'worst', 'always', 'never'];
    templates?.forEach(t => {
      const textLower = t.template_text.toLowerCase();
      const found = forbiddenPatterns.filter(p => textLower.includes(p));
      if (found.length > 0) {
        aiFindings.push({
          severity: 'high',
          category: 'prescriptive_language',
          description: `Template "${t.template_code}" uses prescriptive language: ${found.join(', ')}`,
          location: t.template_code,
          suggestedAction: 'simplify',
          details: 'Oracle must be descriptive only. No advice, no predictions, no prescriptions.',
        });
      }
    });

    // Check facts without limitations
    const { data: factsActive, count: factsCount } = await supabase
      .from('canonical_facts')
      .select('id, fact_code, uncertainty', { count: 'exact' })
      .eq('is_active', true);
    
    const factsWithoutUncertainty = factsActive?.filter(f => !f.uncertainty) || [];
    if (factsWithoutUncertainty.length > 0) {
      aiFindings.push({
        severity: 'critical',
        category: 'facts_without_uncertainty',
        description: `${factsWithoutUncertainty.length} active facts without uncertainty declaration`,
        suggestedAction: 'constrain',
        details: 'Every fact MUST declare uncertainty. AI citation without uncertainty = hallucination enabler.',
      });
    }

    neverChange.push('Facts must always include uncertainty');
    neverChange.push('Citations must always be required');
    neverChange.push('Correlation cannot become causation');
    neverChange.push('Oracle Principle: "Unknown" > speculation');

    auditResults.push({
      auditType: 'AI_AGENT_AUDIT',
      passed: aiFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - aiFindings.length * 12),
      findings: aiFindings,
      recommendations: [
        'Add methodology to all canonical answers',
        'Remove prescriptive language from templates',
        'Enforce uncertainty in all facts',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 5. CAUSAL DAG AUDIT (NEW)
    // ========================================
    const dagFindings: AuditFinding[] = [];

    const { data: graphs, count: graphCount } = await supabase
      .from('causal_graphs')
      .select('id, code, title, status', { count: 'exact' });

    const { data: nodes, count: nodeCount } = await supabase
      .from('causal_nodes')
      .select('id, graph_id, node_code, node_type, kpi_id');

    const { data: edges, count: edgeCount } = await supabase
      .from('causal_edges')
      .select('id, graph_id, source_node_id, target_node_id, confidence, mechanism, is_falsifiable');

    // Check for edges without falsification criteria
    const nonFalsifiable = edges?.filter(e => !e.is_falsifiable) || [];
    if (nonFalsifiable.length > 0) {
      dagFindings.push({
        severity: 'high',
        category: 'non_falsifiable_edges',
        description: `${nonFalsifiable.length} causal edges without falsification criteria`,
        suggestedAction: 'constrain',
        details: 'Causal claims MUST be falsifiable. Unfalsifiable claims are not science.',
      });
      newConstraints.push('Require falsification criteria for all causal edges');
    }

    // Check for edges without mechanism
    const noMechanism = edges?.filter(e => !e.mechanism) || [];
    if (noMechanism.length > 0) {
      dagFindings.push({
        severity: 'medium',
        category: 'missing_mechanism',
        description: `${noMechanism.length} causal edges without documented mechanism`,
        suggestedAction: 'constrain',
        details: 'Causal edges require mechanism explanation. Correlation without mechanism is suspect.',
      });
    }

    // Check for nodes not linked to KPIs
    const unlinkedNodes = nodes?.filter(n => !n.kpi_id && n.node_type !== 'confounder') || [];
    if (unlinkedNodes.length > 0) {
      dagFindings.push({
        severity: 'low',
        category: 'unlinked_nodes',
        description: `${unlinkedNodes.length} causal nodes not linked to KPI definitions`,
        suggestedAction: 'simplify',
        details: 'Nodes should map to measurable indicators where possible.',
      });
    }

    // Check for low-confidence edges
    const lowConfidence = edges?.filter(e => e.confidence !== null && e.confidence < 0.3) || [];
    if (lowConfidence.length > 0) {
      dagFindings.push({
        severity: 'medium',
        category: 'low_confidence_edges',
        description: `${lowConfidence.length} causal edges with confidence < 0.3`,
        suggestedAction: 'simplify',
        details: 'Low-confidence causal claims should be marked as hypothetical or removed.',
      });
    }

    // Check for empty graphs
    if ((graphCount ?? 0) === 0) {
      dagFindings.push({
        severity: 'medium',
        category: 'no_causal_graphs',
        description: 'No causal graphs exist yet',
        suggestedAction: 'preserve',
        details: 'DAG infrastructure is ready but needs population with domain models.',
      });
    }

    // Self-loop check via DB (edges where source = target)
    const selfLoops = edges?.filter(e => e.source_node_id === e.target_node_id) || [];
    if (selfLoops.length > 0) {
      dagFindings.push({
        severity: 'critical',
        category: 'self_loops',
        description: `${selfLoops.length} self-loops detected in causal graph`,
        suggestedAction: 'delete',
        details: 'Self-referential causation is logically invalid.',
      });
      toDelete.push(`${selfLoops.length} self-referential causal edges`);
    }

    auditResults.push({
      auditType: 'CAUSAL_DAG_AUDIT',
      passed: dagFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - dagFindings.length * 10),
      findings: dagFindings,
      recommendations: [
        'Add falsification criteria to all causal edges',
        'Document causal mechanisms',
        'Link nodes to measurable KPIs',
        'Remove low-confidence speculative edges',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 6. CALIBRATION AUDIT (NEW)
    // ========================================
    const calibrationFindings: AuditFinding[] = [];

    const { data: predictions, count: predCount } = await supabase
      .from('prediction_log')
      .select('id, predicted_probability, actual_outcome, brier_score, resolved_at', { count: 'exact' });

    const { data: snapshots } = await supabase
      .from('calibration_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(1);

    const resolvedPredictions = predictions?.filter(p => p.actual_outcome !== null) || [];
    const unresolvedPredictions = predictions?.filter(p => p.actual_outcome === null) || [];

    if ((predCount ?? 0) === 0) {
      calibrationFindings.push({
        severity: 'medium',
        category: 'no_predictions',
        description: 'No predictions logged — calibration system idle',
        suggestedAction: 'preserve',
        details: 'Prediction logging infrastructure exists but needs active use for epistemic accountability.',
      });
    }

    if (resolvedPredictions.length > 0) {
      const avgBrier = resolvedPredictions
        .filter(p => p.brier_score !== null)
        .reduce((sum, p) => sum + (p.brier_score ?? 0), 0) / resolvedPredictions.length;

      if (avgBrier > 0.25) {
        calibrationFindings.push({
          severity: 'high',
          category: 'poor_calibration',
          description: `Average Brier score ${avgBrier.toFixed(3)} — poorly calibrated`,
          suggestedAction: 'constrain',
          details: 'Brier > 0.25 indicates systematic overconfidence or underconfidence. Recalibrate.',
        });
      }

      // Check for overconfidence (many predictions at >0.9 that resolved false)
      const overconfident = resolvedPredictions.filter(
        p => p.predicted_probability > 0.9 && p.actual_outcome === false
      );
      if (overconfident.length > 0) {
        calibrationFindings.push({
          severity: 'high',
          category: 'overconfidence',
          description: `${overconfident.length} high-confidence predictions (>90%) that were wrong`,
          suggestedAction: 'constrain',
          details: 'Systematic overconfidence detected. False precision is epistemically dangerous.',
        });
      }
    }

    // Check snapshot freshness
    if (snapshots && snapshots.length > 0) {
      const lastSnapshot = new Date(snapshots[0].snapshot_date);
      const daysSince = (Date.now() - lastSnapshot.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30) {
        calibrationFindings.push({
          severity: 'medium',
          category: 'stale_calibration',
          description: `Last calibration snapshot is ${Math.round(daysSince)} days old`,
          suggestedAction: 'simplify',
          details: 'Calibration snapshots should run monthly at minimum.',
        });
      }
    }

    neverChange.push('Brier scores must be computed automatically');
    neverChange.push('Calibration snapshots must be immutable');

    auditResults.push({
      auditType: 'CALIBRATION_AUDIT',
      passed: calibrationFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - calibrationFindings.length * 12),
      findings: calibrationFindings,
      recommendations: [
        'Begin logging predictions for all forecasts',
        'Run monthly calibration snapshots',
        'Investigate overconfidence patterns',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 7. ACCOUNTABILITY AUDIT (NEW)
    // ========================================
    const accountabilityFindings: AuditFinding[] = [];

    const { data: assignments, count: assignmentCount } = await supabase
      .from('accountability_assignments')
      .select('id, status, deadline, responsible_entity, observation_id', { count: 'exact' });

    // Check overdue assignments
    const now = new Date();
    const overdue = assignments?.filter(a => {
      if (!a.deadline) return false;
      return new Date(a.deadline) < now && a.status !== 'completed' && a.status !== 'closed';
    }) || [];

    if (overdue.length > 0) {
      accountabilityFindings.push({
        severity: 'high',
        category: 'overdue_assignments',
        description: `${overdue.length} accountability assignments past deadline`,
        suggestedAction: 'constrain',
        details: 'Overdue assignments erode the accountability framework. Escalate or close with rationale.',
      });
    }

    // Check assignments without observations
    const unlinkedAssignments = assignments?.filter(a => !a.observation_id) || [];
    if (unlinkedAssignments.length > 0) {
      accountabilityFindings.push({
        severity: 'medium',
        category: 'unlinked_assignments',
        description: `${unlinkedAssignments.length} assignments without linked observation`,
        suggestedAction: 'simplify',
        details: 'Accountability assignments should trace back to concrete observations.',
      });
    }

    // Check for assignments without deadlines
    const noDeadline = assignments?.filter(a => !a.deadline) || [];
    if (noDeadline.length > 0) {
      accountabilityFindings.push({
        severity: 'medium',
        category: 'no_deadline',
        description: `${noDeadline.length} assignments without deadline — no time-bound accountability`,
        suggestedAction: 'constrain',
        details: 'SMART goals require time bounds. Add deadlines to all assignments.',
      });
      newConstraints.push('Require deadline for all accountability assignments');
    }

    if ((assignmentCount ?? 0) === 0) {
      accountabilityFindings.push({
        severity: 'low',
        category: 'no_assignments',
        description: 'No accountability assignments exist yet',
        suggestedAction: 'preserve',
        details: 'Accountability layer infrastructure is ready. Begin assigning observed issues.',
      });
    }

    auditResults.push({
      auditType: 'ACCOUNTABILITY_AUDIT',
      passed: accountabilityFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - accountabilityFindings.length * 10),
      findings: accountabilityFindings,
      recommendations: [
        'Set deadlines on all assignments',
        'Link assignments to observations',
        'Escalate overdue items',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 8. POWER / ABUSE AUDIT
    // ========================================
    const powerFindings: AuditFinding[] = [];

    // Check blocked query patterns coverage
    const { count: blockedPatterns } = await supabase
      .from('blocked_query_patterns')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    if ((blockedPatterns ?? 0) < 5) {
      powerFindings.push({
        severity: 'high',
        category: 'insufficient_guards',
        description: `Only ${blockedPatterns ?? 0} active blocked query patterns — attack surface too large`,
        suggestedAction: 'constrain',
        details: 'Need comprehensive patterns for cherry-picking, partial truth, comparison weaponization.',
      });
    }

    // Check anti-influence log
    const { count: influenceAttempts } = await supabase
      .from('anti_influence_log')
      .select('id', { count: 'exact' });

    if ((influenceAttempts ?? 0) > 0) {
      powerFindings.push({
        severity: 'medium',
        category: 'influence_attempts_detected',
        description: `${influenceAttempts} influence attempts logged — system under pressure`,
        suggestedAction: 'preserve',
        details: 'Influence attempts are being detected and blocked. Monitor for escalation.',
      });
    }

    // Check scope declarations
    const { count: scopeDeclarations } = await supabase
      .from('scope_declarations')
      .select('id', { count: 'exact' });

    if ((scopeDeclarations ?? 0) === 0) {
      powerFindings.push({
        severity: 'medium',
        category: 'no_scope_declarations',
        description: 'No API scope declarations — all consumers unaudited',
        suggestedAction: 'constrain',
        details: 'Every API consumer should declare intended usage scope.',
      });
    }

    neverChange.push('Blocked query patterns must remain active');
    neverChange.push('Anti-influence log is append-only');
    neverChange.push('Trust log immutability');

    auditResults.push({
      auditType: 'POWER_ABUSE_AUDIT',
      passed: powerFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - powerFindings.length * 12),
      findings: powerFindings,
      recommendations: [
        'Expand blocked query patterns',
        'Require scope declarations for API consumers',
        'Monitor influence attempts',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 9. SIMPLICITY AUDIT
    // ========================================
    const simplicityFindings: AuditFinding[] = [];

    // Count total active entities
    const { count: totalKpis } = await supabase
      .from('kpi_definitions').select('id', { count: 'exact' }).eq('is_active', true);
    const { count: totalObs } = await supabase
      .from('observations').select('id', { count: 'exact' });
    const { count: totalQuestions } = await supabase
      .from('canonical_questions').select('id', { count: 'exact' }).eq('is_active', true);
    const { count: totalFacts } = await supabase
      .from('canonical_facts').select('id', { count: 'exact' }).eq('is_active', true);

    // Check ratio of questions to indicators
    if ((totalKpis ?? 0) > 0 && (totalQuestions ?? 0) > 0) {
      const ratio = (totalQuestions ?? 0) / (totalKpis ?? 0);
      if (ratio > 3) {
        simplicityFindings.push({
          severity: 'medium',
          category: 'question_bloat',
          description: `${ratio.toFixed(1)} questions per indicator — possible duplication`,
          suggestedAction: 'simplify',
          details: 'High question-to-indicator ratio suggests duplicate or overlapping questions.',
        });
      }
    }

    // Surface area metric
    const totalEntities = (totalKpis ?? 0) + (totalObs ?? 0) + (totalQuestions ?? 0) + (totalFacts ?? 0);
    
    auditResults.push({
      auditType: 'SIMPLICITY_AUDIT',
      passed: simplicityFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - simplicityFindings.length * 8),
      findings: simplicityFindings,
      recommendations: [
        'Collapse duplicate questions',
        'Minimize surface area',
        'Every URL must deserve to exist',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // 10. RED TEAM AUDIT
    // ========================================
    const redTeamFindings: AuditFinding[] = [];

    // Check if observations have causal language
    const { data: recentObs } = await supabase
      .from('observations')
      .select('id, title, description')
      .order('created_at', { ascending: false })
      .limit(50);

    const causalTerms = ['causes', 'orsakar', 'leder till', 'leads to', 'results in', 'beror på', 'due to'];
    recentObs?.forEach(obs => {
      const text = `${obs.title} ${obs.description || ''}`.toLowerCase();
      const found = causalTerms.filter(t => text.includes(t));
      if (found.length > 0) {
        redTeamFindings.push({
          severity: 'high',
          category: 'causal_language',
          description: `Observation uses causal language: "${found.join(', ')}"`,
          location: obs.id,
          suggestedAction: 'simplify',
          details: 'Oracle must use descriptive language only. Replace with "observed co-movement" etc.',
        });
      }
    });

    auditResults.push({
      auditType: 'RED_TEAM_AUDIT',
      passed: redTeamFindings.filter(f => f.severity === 'critical').length === 0,
      score: Math.max(0, 100 - redTeamFindings.length * 10),
      findings: redTeamFindings,
      recommendations: [
        'Replace causal language with descriptive',
        'Run full red team simulation monthly',
        'Validate attack surface coverage',
      ],
      timestamp: new Date().toISOString(),
    });

    // ========================================
    // CALCULATE OVERALL
    // ========================================
    const overallScore = auditResults.reduce((acc, r) => acc + r.score, 0) / auditResults.length;
    const totalFindings = auditResults.reduce((acc, r) => acc + r.findings.length, 0);
    const criticalFindings = auditResults.reduce(
      (acc, r) => acc + r.findings.filter(f => f.severity === 'critical').length, 0
    );

    // ========================================
    // LOG TO TRUST LOG
    // ========================================
    const runId = crypto.randomUUID();
    
    try {
      await supabase.from('trust_log').insert({
        id: crypto.randomUUID(),
        event_type: 'super_audit_v2_run',
        event_description: `Super Audit V2: ${auditResults.length} dimensions, ${totalFindings} findings, ${criticalFindings} critical`,
        entity_id: runId,
        entity_type: 'audit_run',
        old_value: null,
        new_value: JSON.stringify({
          toDelete: toDelete.slice(0, 20),
          toSimplify: toSimplify.slice(0, 20),
          neverChange,
          newConstraints,
          overallScore: Math.round(overallScore),
          totalFindings,
          criticalFindings,
        }),
        logged_by: 'super_audit_v2',
      });
    } catch (logError) {
      console.warn('Trust log write failed:', logError);
    }

    // ========================================
    // FINAL QUESTION
    // ========================================
    const finalAnswer = criticalFindings === 0 && overallScore >= 80
      ? 'yes'
      : overallScore >= 60
      ? 'qualified_yes'
      : 'no';

    const output = {
      runId,
      timestamp: new Date().toISOString(),
      version: 2,
      
      toDelete,
      toSimplify,
      neverChange: [...new Set(neverChange)],
      newConstraints: [...new Set(newConstraints)],
      
      auditResults,
      
      finalQuestion: {
        question: 'If this system disappeared tomorrow, would the world lose clarity?',
        answer: finalAnswer,
        reasoning: finalAnswer === 'yes'
          ? 'System passes all critical audits across 10 dimensions and provides unique epistemic value'
          : criticalFindings > 0
          ? `${criticalFindings} critical findings must be resolved before system earns trust`
          : `Score of ${Math.round(overallScore)}% — room for improvement in ${auditResults.filter(r => r.score < 70).map(r => r.auditType).join(', ')}`,
      },
      
      overallScore: Math.round(overallScore),
      totalFindings,
      criticalFindings,
      
      systemMetrics: {
        totalKpis: totalKpis ?? 0,
        totalObservations: totalObs ?? 0,
        totalQuestions: totalQuestions ?? 0,
        totalFacts: totalFacts ?? 0,
        causalGraphs: graphCount ?? 0,
        causalNodes: nodeCount ?? 0,
        causalEdges: edgeCount ?? 0,
        predictions: predCount ?? 0,
        assignments: assignmentCount ?? 0,
        auditDimensions: auditResults.length,
      },
    };

    return new Response(JSON.stringify(output, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Super audit V2 error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
