// Wrapped index - exports

export { WrappedViewer } from './WrappedViewer';
export { WrappedOverview } from './WrappedOverview';
export { WrappedChanges } from './WrappedChanges';
export { WrappedTimeline } from './WrappedTimeline';
export { WrappedComparisons } from './WrappedComparisons';
export { WrappedUnchanged } from './WrappedUnchanged';
export { WrappedLimitations } from './WrappedLimitations';
export { WrappedDeepDive } from './WrappedDeepDive';

// WAVE 7: Public Learning Engine
export { DailyLearningFeed, PatternLifecycleCard } from './DailyLearningFeed';

// Reality Wrapped - Disciplined Spotify-style animation system
export {
  WrappedSlide,
  WrappedHeroText,
  WrappedNumber,
  WrappedBody,
  WrappedCaption,
  WrappedCard,
  WrappedProgress,
  WrappedStaggerContainer,
  WrappedStaggerItem,
  WrappedVerifiedBadge,
} from './WrappedSlide';

// Animation specifications
export {
  WRAPPED_EASING,
  WRAPPED_DURATION,
  WRAPPED_DELAY,
  WRAPPED_STAGGER,
  wrappedVariants,
  pageTransition,
  staggerTransition,
  withDelay,
  getStaggerDelay,
  ANIMATION_RULES,
  DATA_COLORS,
  getTrendColor,
  VERIFICATION_COLORS,
} from '@/lib/wrapped/animationSpec';
