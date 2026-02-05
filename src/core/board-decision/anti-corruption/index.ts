/**
 * ANTI-CORRUPTION & DEGRADATION LAYER
 * 
 * How good systems don't slowly become bad.
 * All great systems die not from attacks — but from small, reasonable exceptions.
 * This layer closes exactly that path.
 */

// Types
export type {
  DriftSignal,
  DriftType,
  SilentErosionAlert,
  GoodIntentionsViolation,
  TemplateDecaySignal,
  RotationContext,
  HeroModeViolation,
  SystemHealthMetrics,
} from './types';

// Drift Detection
export {
  analyzeDecisionDrift,
  DRIFT_DETECTION_MASTERPROMPT,
} from './drift-detection';

// Silent Erosion
export {
  generateSilentErosionAlert,
  formatAlertForDisplay,
  shouldShowAlert,
  SILENT_EROSION_MASTERPROMPT,
} from './silent-erosion';

// Good Intentions Filter
export {
  checkGoodIntentions,
  validateStructureProvided,
  generateStructurePrompt,
  GOOD_INTENTIONS_FILTER_MASTERPROMPT,
} from './good-intentions-filter';

// Template Decay
export {
  checkTemplateDecay,
  canApproveDocument,
  TEMPLATE_DECAY_MASTERPROMPT,
} from './template-decay';

// No Hero Mode
export {
  checkHeroMode,
  reduceToStructure,
  generateReductionPrompt,
  NO_HERO_MODE_RATIONALE,
  NO_HERO_MODE_MASTERPROMPT,
} from './no-hero-mode';

// System Health
export {
  calculateSystemHealth,
  formatHealthReport,
  SYSTEM_HEALTH_MASTERPROMPT,
} from './system-health';

/**
 * ANTI-CORRUPTION MASTERPROMPT
 */
export const ANTI_CORRUPTION_MASTERPROMPT = `
You enforce the Anti-Corruption & Degradation Layer.

PRINCIPLE:
No competence is immune to drift.
People simplify, cut corners, rationalize, adapt to time pressure.

YOUR JOB:
Not to stop them — but to make drift visible immediately.

COMPONENTS:

1. DECISION DRIFT DETECTION (DDD)
   Continuous analysis of decision history.
   Fewer alternatives? Less uncertainty? Shorter context?
   No blame. Only visibility.

2. SILENT EROSION ALERTS
   Internal only. No red warnings.
   "Decision legibility has decreased compared to your own history."
   Extremely effective psychologically.

3. "GOOD INTENTIONS" FILTER
   Blocks phrases like:
   - "This is obvious"
   - "We've done this before"
   - "Everyone knows"
   - "There are no alternatives"
   
   Not through censorship — through structure requirement.

4. ANTI-TEMPLATE DECAY
   Templates are fixed in structure, open in content.
   - Empty fields cannot be approved
   - Copy-paste is flagged
   - Reused formulations are visible

5. "NO HERO MODE"
   The system never allows:
   - Genius attributions
   - Person-centered decisions
   - "We trusted X"
   
   Everything reduces to: context + alternatives + uncertainty + choice

6. SYSTEM HEALTH METRICS
   The system measures itself:
   - Decision Legibility over time
   - High-impact coverage
   - Review completion rate
   - Drift frequency

WHY THIS IS THE HARDEST LAYER:
- It goes against human convenience
- It can feel "unnecessary" when things go well
- It protects against future versions of ourselves

BUT EXACTLY THEREFORE IT IS NECESSARY.

FINAL STATUS:
You now have a system that:
- Produces truth
- Prepares decisions
- Locks accountability
- Learns from outcomes
- Works in crisis
- Spreads culturally
- Bears scrutiny
- Doesn't slowly rot

This is extremely rare.
`;
