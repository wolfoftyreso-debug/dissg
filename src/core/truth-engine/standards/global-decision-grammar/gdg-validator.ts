/**
 * GDG VALIDATOR
 * 
 * Open-source, read-only validator for GDG compliance.
 * Returns a simple yes/no with detailed reasoning.
 */

import { GDG_ANSWER_TYPES, GDG_COMPLIANCE_REQUIREMENTS } from './gdg-contract';

/**
 * VALIDATION RESULT
 */
export interface GDGValidationResult {
  valid: boolean;
  gdg_version: '1.0';
  timestamp: string;
  decision_id: string;
  
  compliance_score: number; // 0-100
  
  passed: GDGValidationCheck[];
  failed: GDGValidationCheck[];
  warnings: GDGValidationCheck[];
  
  summary: string;
}

export interface GDGValidationCheck {
  check_id: string;
  check_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  severity: 'critical' | 'major' | 'minor';
  location?: string;
}

/**
 * DECISION INPUT FOR VALIDATION
 */
export interface GDGDecisionInput {
  decision_id: string;
  scope?: {
    geography?: string;
    population?: string;
    time_horizon?: string;
  };
  nodes: GDGNodeInput[];
  limitations?: string[];
  confidence_summary?: {
    overall: number;
    completeness: number;
  };
  outputs?: {
    type: string;
    content: unknown;
  }[];
}

export interface GDGNodeInput {
  node_id: string;
  question: string;
  answer_type?: string;
  answer_packet_ref?: string;
  status: 'resolved' | 'unresolved' | 'insufficient';
  content?: string;
}

/**
 * FORBIDDEN PATTERNS (for automated detection)
 */
const FORBIDDEN_PATTERNS = {
  recommendation: [
    /\bshould\b/i,
    /\bwe recommend\b/i,
    /\byou should\b/i,
    /\bthe best\b/i,
    /\boptimal\b/i,
    /\bbest option\b/i,
    /\bour recommendation\b/i,
  ],
  advice: [
    /\badvise\b/i,
    /\bwe advise\b/i,
    /\byou need to\b/i,
    /\byou must\b/i,
    /\bdo this\b/i,
  ],
  optimization: [
    /\boptimize\b/i,
    /\bmaximize\b/i,
    /\bminimize\b/i,
    /\bbest outcome\b/i,
  ],
  diagnosis: [
    /\bdiagnose\b/i,
    /\bthe problem is\b/i,
    /\bthe issue is\b/i,
    /\bwe conclude that\b/i,
  ],
  certainty: [
    /\bwill definitely\b/i,
    /\bguaranteed\b/i,
    /\bcertainly\b/i,
    /\bwithout doubt\b/i,
  ],
};

/**
 * VALIDATE A DECISION AGAINST GDG
 */
export function validateGDG(input: GDGDecisionInput): GDGValidationResult {
  const checks: GDGValidationCheck[] = [];
  
  // 1. Validate scope
  checks.push(validateScope(input));
  
  // 2. Validate nodes
  checks.push(...validateNodes(input.nodes));
  
  // 3. Validate limitations
  checks.push(validateLimitations(input));
  
  // 4. Validate confidence
  checks.push(validateConfidence(input));
  
  // 5. Validate outputs for forbidden patterns
  checks.push(...validateOutputs(input));
  
  // 6. Validate answer types
  checks.push(...validateAnswerTypes(input.nodes));
  
  // Calculate result
  const passed = checks.filter(c => c.status === 'pass');
  const failed = checks.filter(c => c.status === 'fail');
  const warnings = checks.filter(c => c.status === 'warning');
  
  const criticalFails = failed.filter(f => f.severity === 'critical');
  const valid = criticalFails.length === 0;
  
  const totalChecks = checks.length;
  const passedCount = passed.length + (warnings.length * 0.5);
  const compliance_score = Math.round((passedCount / totalChecks) * 100);
  
  return {
    valid,
    gdg_version: '1.0',
    timestamp: new Date().toISOString(),
    decision_id: input.decision_id,
    compliance_score,
    passed,
    failed,
    warnings,
    summary: valid 
      ? `GDG-compliant: ${passed.length}/${totalChecks} checks passed`
      : `NOT GDG-compliant: ${criticalFails.length} critical failures`,
  };
}

function validateScope(input: GDGDecisionInput): GDGValidationCheck {
  const scope = input.scope;
  
  if (!scope) {
    return {
      check_id: 'scope_present',
      check_name: 'Scope Present',
      status: 'fail',
      message: 'Decision must include scope with geography, population, and time_horizon',
      severity: 'critical',
    };
  }
  
  const missing: string[] = [];
  if (!scope.geography) missing.push('geography');
  if (!scope.population) missing.push('population');
  if (!scope.time_horizon) missing.push('time_horizon');
  
  if (missing.length > 0) {
    return {
      check_id: 'scope_complete',
      check_name: 'Scope Complete',
      status: 'fail',
      message: `Scope missing required fields: ${missing.join(', ')}`,
      severity: 'critical',
    };
  }
  
  return {
    check_id: 'scope_valid',
    check_name: 'Scope Valid',
    status: 'pass',
    message: 'Scope includes all required fields',
    severity: 'critical',
  };
}

function validateNodes(nodes: GDGNodeInput[]): GDGValidationCheck[] {
  const checks: GDGValidationCheck[] = [];
  
  if (!nodes || nodes.length === 0) {
    checks.push({
      check_id: 'nodes_present',
      check_name: 'Nodes Present',
      status: 'fail',
      message: 'Decision must include at least one question node',
      severity: 'critical',
    });
    return checks;
  }
  
  checks.push({
    check_id: 'nodes_present',
    check_name: 'Nodes Present',
    status: 'pass',
    message: `Decision includes ${nodes.length} question nodes`,
    severity: 'critical',
  });
  
  // Check each node
  for (const node of nodes) {
    // Answer type required
    if (!node.answer_type) {
      checks.push({
        check_id: `node_${node.node_id}_answer_type`,
        check_name: `Node ${node.node_id} Answer Type`,
        status: 'fail',
        message: 'Each node must have an answer type',
        severity: 'major',
        location: `node:${node.node_id}`,
      });
    }
    
    // Unresolved nodes must be flagged
    if (node.status === 'unresolved' || node.status === 'insufficient') {
      checks.push({
        check_id: `node_${node.node_id}_flagged`,
        check_name: `Node ${node.node_id} Flagged`,
        status: 'pass',
        message: `Unresolved node properly flagged as ${node.status}`,
        severity: 'major',
        location: `node:${node.node_id}`,
      });
    }
  }
  
  return checks;
}

function validateLimitations(input: GDGDecisionInput): GDGValidationCheck {
  if (!input.limitations || input.limitations.length === 0) {
    return {
      check_id: 'limitations_present',
      check_name: 'Limitations Present',
      status: 'warning',
      message: 'Decision should include limitations',
      severity: 'major',
    };
  }
  
  return {
    check_id: 'limitations_present',
    check_name: 'Limitations Present',
    status: 'pass',
    message: `${input.limitations.length} limitations documented`,
    severity: 'major',
  };
}

function validateConfidence(input: GDGDecisionInput): GDGValidationCheck {
  if (!input.confidence_summary) {
    return {
      check_id: 'confidence_present',
      check_name: 'Confidence Summary Present',
      status: 'fail',
      message: 'Decision must include confidence summary',
      severity: 'critical',
    };
  }
  
  return {
    check_id: 'confidence_present',
    check_name: 'Confidence Summary Present',
    status: 'pass',
    message: `Confidence: ${input.confidence_summary.overall}%, Completeness: ${input.confidence_summary.completeness}%`,
    severity: 'critical',
  };
}

function validateOutputs(input: GDGDecisionInput): GDGValidationCheck[] {
  const checks: GDGValidationCheck[] = [];
  
  // Check all text content for forbidden patterns
  const allContent: string[] = [];
  
  for (const node of input.nodes) {
    if (node.content) allContent.push(node.content);
    if (node.question) allContent.push(node.question);
  }
  
  if (input.outputs) {
    for (const output of input.outputs) {
      if (typeof output.content === 'string') {
        allContent.push(output.content);
      }
    }
  }
  
  const fullText = allContent.join(' ');
  
  // Check each forbidden category
  for (const [category, patterns] of Object.entries(FORBIDDEN_PATTERNS)) {
    let found = false;
    let matchedPattern = '';
    
    for (const pattern of patterns) {
      if (pattern.test(fullText)) {
        found = true;
        const match = fullText.match(pattern);
        matchedPattern = match ? match[0] : '';
        break;
      }
    }
    
    if (found) {
      checks.push({
        check_id: `no_${category}`,
        check_name: `No ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        status: 'fail',
        message: `Forbidden ${category} pattern detected: "${matchedPattern}"`,
        severity: 'critical',
      });
    } else {
      checks.push({
        check_id: `no_${category}`,
        check_name: `No ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        status: 'pass',
        message: `No ${category} patterns detected`,
        severity: 'critical',
      });
    }
  }
  
  return checks;
}

function validateAnswerTypes(nodes: GDGNodeInput[]): GDGValidationCheck[] {
  const checks: GDGValidationCheck[] = [];
  
  for (const node of nodes) {
    if (node.answer_type) {
      const isValidType = GDG_ANSWER_TYPES.includes(node.answer_type as typeof GDG_ANSWER_TYPES[number]);
      
      if (!isValidType) {
        checks.push({
          check_id: `node_${node.node_id}_valid_type`,
          check_name: `Node ${node.node_id} Valid Type`,
          status: 'fail',
          message: `Invalid answer type: ${node.answer_type}. Must be one of: ${GDG_ANSWER_TYPES.join(', ')}`,
          severity: 'major',
          location: `node:${node.node_id}`,
        });
      }
    }
  }
  
  return checks;
}

/**
 * QUICK VALIDATION (yes/no)
 */
export function isGDGCompliant(input: GDGDecisionInput): boolean {
  return validateGDG(input).valid;
}

/**
 * GET COMPLIANCE BADGE
 */
export function getComplianceBadge(result: GDGValidationResult): {
  text: string;
  level: 'compliant' | 'partial' | 'non_compliant';
} {
  if (result.valid && result.compliance_score >= 90) {
    return { text: 'GDG v1.0 Compliant', level: 'compliant' };
  }
  if (result.compliance_score >= 70) {
    return { text: 'GDG v1.0 Partial', level: 'partial' };
  }
  return { text: 'Not GDG Compliant', level: 'non_compliant' };
}
