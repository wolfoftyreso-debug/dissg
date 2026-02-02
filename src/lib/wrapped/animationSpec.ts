/**
 * REALITY WRAPPED - ANIMATION SPECIFICATION
 * ==========================================
 * Programmatic animation configuration for Framer Motion
 * 
 * DISCIPLINE RULES:
 * 1. No animation without verified data
 * 2. Motion duration scales with data complexity
 * 3. Easing reflects confidence (faster = more certain)
 * 4. Stagger reveals promote comprehension
 */

// Core easing curves
export const WRAPPED_EASING = {
  // Primary ease - Confident, smooth deceleration
  confident: [0.16, 1, 0.3, 1] as const,
  
  // Exit ease - Quick departure
  exit: [0.7, 0, 0.84, 0] as const,
  
  // Data reveal - Extra smooth for numbers
  dataReveal: [0.34, 1.56, 0.64, 1] as const,
  
  // Gentle - For background elements
  gentle: [0.4, 0, 0.2, 1] as const,
};

// Duration constants (in seconds)
export const WRAPPED_DURATION = {
  // Quick transitions
  instant: 0.15,
  fast: 0.3,
  
  // Standard animations
  normal: 0.5,
  slow: 0.8,
  
  // Hero moments
  hero: 1.0,
  dramatic: 1.2,
  
  // Page transitions
  pageEnter: 0.6,
  pageExit: 0.4,
};

// Delay constants (in seconds)
export const WRAPPED_DELAY = {
  intro: 0,
  primary: 0.2,
  secondary: 0.4,
  tertiary: 0.6,
  data: 0.8,
  context: 1.0,
  action: 1.2,
};

// Stagger configuration
export const WRAPPED_STAGGER = {
  // Fast stagger for lists
  fast: 0.05,
  
  // Normal stagger for cards
  normal: 0.1,
  
  // Slow stagger for emphasis
  slow: 0.15,
  
  // Very slow for dramatic effect
  dramatic: 0.2,
};

// Animation variant presets for Framer Motion
export const wrappedVariants = {
  // Container that staggers children
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: WRAPPED_STAGGER.normal,
        delayChildren: WRAPPED_DELAY.primary,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: WRAPPED_STAGGER.fast,
        staggerDirection: -1,
      },
    },
  },

  // Slide up entry (primary animation)
  slideUp: {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: WRAPPED_DURATION.slow,
        ease: WRAPPED_EASING.confident,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: WRAPPED_DURATION.fast,
        ease: WRAPPED_EASING.exit,
      },
    },
  },

  // Scale fade (hero moments)
  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.92,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: WRAPPED_DURATION.hero,
        ease: WRAPPED_EASING.confident,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: WRAPPED_DURATION.fast,
        ease: WRAPPED_EASING.exit,
      },
    },
  },

  // Number reveal (for data values)
  numberReveal: {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: WRAPPED_DURATION.hero,
        ease: WRAPPED_EASING.dataReveal,
      },
    },
  },

  // Card entrance with depth
  cardEnter: {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: WRAPPED_DURATION.slow,
        ease: WRAPPED_EASING.confident,
      },
    },
  },

  // Simple fade
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: WRAPPED_DURATION.normal,
        ease: WRAPPED_EASING.gentle,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: WRAPPED_DURATION.fast,
      },
    },
  },

  // Progress bar fill
  progressFill: {
    hidden: { width: '0%' },
    visible: (progress: number) => ({
      width: `${progress}%`,
      transition: {
        duration: WRAPPED_DURATION.dramatic,
        ease: WRAPPED_EASING.confident,
        delay: WRAPPED_DELAY.data,
      },
    }),
  },
};

// Page transition configuration
export const pageTransition = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: wrappedVariants.slideUp,
};

// Stagger configuration for lists
export const staggerTransition = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: wrappedVariants.staggerContainer,
};

// Helper to create delayed animation
export function withDelay(
  delay: keyof typeof WRAPPED_DELAY
): { transition: { delay: number } } {
  return {
    transition: { delay: WRAPPED_DELAY[delay] },
  };
}

// Helper to calculate stagger delay for index
export function getStaggerDelay(
  index: number,
  staggerType: keyof typeof WRAPPED_STAGGER = 'normal'
): number {
  return index * WRAPPED_STAGGER[staggerType];
}

// Animation rules enforcement
export const ANIMATION_RULES = {
  // Maximum total animation duration per screen
  maxScreenDuration: 3.0,
  
  // Minimum time data must be visible before navigation
  minDataVisibility: 1.5,
  
  // Maximum number of animated elements per screen
  maxAnimatedElements: 8,
  
  // Required pause after number reveal
  postNumberPause: 0.5,
} as const;

// Data-bound color mapping
export const DATA_COLORS = {
  positive: 'hsl(145 55% 45%)',
  warning: 'hsl(40 90% 55%)',
  critical: 'hsl(0 70% 55%)',
  neutral: 'hsl(210 15% 60%)',
} as const;

// Get color based on trend direction
export function getTrendColor(
  trend: 'positive' | 'warning' | 'critical' | 'neutral'
): string {
  return DATA_COLORS[trend];
}

// Verification status colors
export const VERIFICATION_COLORS = {
  verified: 'hsl(145 50% 50%)',
  partial: 'hsl(40 80% 50%)',
  unverified: 'hsl(0 60% 50%)',
} as const;
