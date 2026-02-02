/**
 * 🔒 Sharing & Media Blocker
 * 
 * Blocks sharing that could lead to misinterpretation.
 * Enforces mandatory context for all shared content.
 */

import type {
  ShareValidation,
  ShareBlockReason,
  ShareWarning,
  EmbedRules,
  VerificationProof,
} from '@/types/realityOnly';

// ============================================
// MANDATORY ELEMENTS FOR SHARING
// ============================================

export const MANDATORY_SHARE_ELEMENTS = {
  sources: true,           // Must include source attribution
  uncertainty: true,       // Must show uncertainty/confidence
  limitations: true,       // Must show limitations
  verification: true,      // Must include verification hash/QR
  timeContext: true,       // Must show data date
  scopeContext: true,      // Must show geographic scope
} as const;

// ============================================
// BLOCK RULES
// ============================================

interface ContentContext {
  hasSourceAttribution: boolean;
  hasUncertainty: boolean;
  hasLimitations: boolean;
  hasVerification: boolean;
  hasTimeContext: boolean;
  hasScopeContext: boolean;
  dataAvailability: 'verified' | 'partial' | 'insufficient' | 'stale' | 'conflicting';
  contentType: 'graph' | 'wrapped_step' | 'reality_check' | 'comparison' | 'correlation';
  intendedPlatform?: 'twitter' | 'facebook' | 'linkedin' | 'embed' | 'download';
}

/**
 * Validate if content can be shared
 */
export function validateSharing(context: ContentContext): ShareValidation {
  const blockReasons: ShareBlockReason[] = [];
  const warnings: ShareWarning[] = [];
  const requiredContext: string[] = [];
  
  // Block if data is insufficient
  if (context.dataAvailability === 'insufficient') {
    blockReasons.push({
      code: 'INSUFFICIENT_DATA',
      message: 'Cannot share: underlying data is insufficient for reliable presentation.',
      messageLocal: { sv: 'Kan inte delas: underliggande data är otillräcklig för tillförlitlig presentation.' },
      severity: 'block',
    });
  }
  
  // Block if sources conflict
  if (context.dataAvailability === 'conflicting') {
    blockReasons.push({
      code: 'CONFLICTING_SOURCES',
      message: 'Cannot share: data sources conflict and may mislead without full context.',
      messageLocal: { sv: 'Kan inte delas: datakällor är motstridiga och kan vilseleda utan fullständig kontext.' },
      severity: 'block',
    });
  }
  
  // Require context elements
  if (!context.hasSourceAttribution) {
    blockReasons.push({
      code: 'MISSING_SOURCES',
      message: 'Source attribution is required for sharing.',
      messageLocal: { sv: 'Källhänvisning krävs för delning.' },
      severity: 'require_context',
    });
    requiredContext.push('Source attribution');
  }
  
  if (!context.hasUncertainty) {
    blockReasons.push({
      code: 'MISSING_UNCERTAINTY',
      message: 'Uncertainty/confidence indicators are required for sharing.',
      messageLocal: { sv: 'Osäkerhets-/konfidensindikationer krävs för delning.' },
      severity: 'require_context',
    });
    requiredContext.push('Uncertainty range');
  }
  
  if (!context.hasVerification) {
    blockReasons.push({
      code: 'MISSING_VERIFICATION',
      message: 'Verification hash is required for sharing.',
      messageLocal: { sv: 'Verifieringshash krävs för delning.' },
      severity: 'require_context',
    });
    requiredContext.push('Verification link');
  }
  
  if (!context.hasTimeContext) {
    blockReasons.push({
      code: 'MISSING_TIME',
      message: 'Time context (data date) is required for sharing.',
      messageLocal: { sv: 'Tidskontext (datadatum) krävs för delning.' },
      severity: 'require_context',
    });
    requiredContext.push('Data date');
  }
  
  // Warnings for partial/stale data
  if (context.dataAvailability === 'partial') {
    warnings.push({
      code: 'PARTIAL_DATA',
      message: 'This content is based on partial data. Full context is recommended.',
      suggestion: 'Include a note about data coverage.',
    });
  }
  
  if (context.dataAvailability === 'stale') {
    warnings.push({
      code: 'STALE_DATA',
      message: 'This data may be outdated. Consider noting the data date prominently.',
      suggestion: 'Highlight the data date in your share.',
    });
  }
  
  // Platform-specific warnings
  if (context.intendedPlatform === 'twitter') {
    warnings.push({
      code: 'TWITTER_CONTEXT_LIMIT',
      message: 'Twitter\'s character limit may not allow full context. Consider using a thread.',
      suggestion: 'Share link to full view instead of screenshot.',
    });
  }
  
  // Generate suggested caption
  const suggestedCaption = generateSuggestedCaption(context);
  
  // Generate mandatory disclaimer
  const mandatoryDisclaimer = generateMandatoryDisclaimer(context);
  
  // Determine if can share
  const hardBlocks = blockReasons.filter(r => r.severity === 'block');
  const canShare = hardBlocks.length === 0;
  
  return {
    canShare,
    blockReasons,
    warnings,
    requiredContext,
    suggestedCaption,
    mandatoryDisclaimer,
  };
}

/**
 * Generate suggested caption for sharing
 */
function generateSuggestedCaption(context: ContentContext): string {
  const parts: string[] = [];
  
  parts.push('[Data visualization from Reality Check]');
  parts.push('');
  parts.push('Note: This shows observed data only, not causes or predictions.');
  parts.push('');
  parts.push('Full context and verification: [link]');
  
  return parts.join('\n');
}

/**
 * Generate mandatory disclaimer
 */
function generateMandatoryDisclaimer(context: ContentContext): string {
  const disclaimers: string[] = [];
  
  disclaimers.push('This visualization shows observed data from verified sources.');
  
  if (context.dataAvailability === 'partial') {
    disclaimers.push('Note: Based on partial data coverage.');
  }
  
  if (context.contentType === 'correlation') {
    disclaimers.push('Correlation does not imply causation.');
  }
  
  disclaimers.push('Verify at: [verification_url]');
  
  return disclaimers.join(' ');
}

// ============================================
// EMBED RULES
// ============================================

/**
 * Get embedding rules for content
 */
export function getEmbedRules(contentType: ContentContext['contentType']): EmbedRules {
  return {
    allowIframe: true,
    allowScreenshot: true, // But with watermark
    requireAttribution: true,
    attributionText: 'Source: Reality Check Engine | Verification: {hash}',
    mandatoryElements: ['sources', 'uncertainty', 'limitations', 'verification'],
    forbiddenContexts: [
      'political_campaign',
      'advertising',
      'paid_promotion',
      'misleading_headline',
    ],
  };
}

// ============================================
// SCREENSHOT VALIDATION
// ============================================

/**
 * Generate watermark data for screenshots
 */
export function generateScreenshotWatermark(
  verification: VerificationProof,
  contentType: string
): {
  text: string;
  qrData: string;
  timestamp: string;
} {
  return {
    text: `Reality Check | ${verification.hash} | ${new Date().toISOString().split('T')[0]}`,
    qrData: verification.buildPageUrl,
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// FORBIDDEN CONTEXTS
// ============================================

/**
 * Check if sharing context is forbidden
 */
export function isForbiddenContext(
  context: string,
  embedRules: EmbedRules
): boolean {
  return embedRules.forbiddenContexts.some(
    forbidden => context.toLowerCase().includes(forbidden)
  );
}

// ============================================
// SHARE LINK GENERATION
// ============================================

/**
 * Generate shareable link with mandatory context
 */
export function generateShareLink(
  baseUrl: string,
  verification: VerificationProof,
  options: {
    includeSnapshot?: boolean;
    expiresIn?: number; // hours
  } = {}
): string {
  const params = new URLSearchParams({
    v: verification.hash,
    t: Date.now().toString(36),
  });
  
  if (options.includeSnapshot) {
    params.set('snapshot', 'true');
  }
  
  if (options.expiresIn) {
    const expires = Date.now() + (options.expiresIn * 60 * 60 * 1000);
    params.set('exp', expires.toString(36));
  }
  
  return `${baseUrl}?${params.toString()}`;
}
