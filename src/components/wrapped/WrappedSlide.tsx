import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { wrappedVariants, pageTransition, WRAPPED_DELAY } from '@/lib/wrapped/animationSpec';
import { cn } from '@/lib/utils';

interface WrappedSlideProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  slideKey: string;
}

/**
 * WrappedSlide - Container for a single Wrapped presentation step
 * 
 * DISCIPLINE:
 * - Only renders when isActive
 * - Enforces consistent entry/exit animations
 * - Dark background for Wrapped aesthetic
 */
export function WrappedSlide({ 
  children, 
  className,
  isActive = true,
  slideKey 
}: WrappedSlideProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slideKey}
          className={cn(
            'wrapped-bg min-h-screen flex flex-col items-center justify-center p-6',
            className
          )}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={wrappedVariants.slideUp}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface WrappedHeroTextProps {
  children: ReactNode;
  className?: string;
  delay?: keyof typeof WRAPPED_DELAY;
}

/**
 * WrappedHeroText - Large headline with scale animation
 */
export function WrappedHeroText({ 
  children, 
  className,
  delay = 'primary' 
}: WrappedHeroTextProps) {
  return (
    <motion.h1
      className={cn('wrapped-text-hero text-center max-w-4xl', className)}
      variants={wrappedVariants.scaleIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: WRAPPED_DELAY[delay] }}
    >
      {children}
    </motion.h1>
  );
}

interface WrappedNumberProps {
  value: string | number;
  label?: string;
  trend?: 'positive' | 'warning' | 'critical' | 'neutral';
  unit?: string;
  className?: string;
}

/**
 * WrappedNumber - Large data value with reveal animation
 * 
 * DISCIPLINE: Only use with verified data
 */
export function WrappedNumber({ 
  value, 
  label, 
  trend,
  unit,
  className 
}: WrappedNumberProps) {
  const trendClass = trend ? `wrapped-trend-${trend}` : '';
  
  return (
    <motion.div
      className={cn('text-center', className)}
      variants={wrappedVariants.numberReveal}
      initial="hidden"
      animate="visible"
    >
      {label && (
        <motion.p 
          className="wrapped-text-caption mb-2"
          variants={wrappedVariants.fade}
        >
          {label}
        </motion.p>
      )}
      <div className={cn('wrapped-number-large', trendClass)}>
        {value}
        {unit && <span className="text-[0.4em] ml-2 opacity-60">{unit}</span>}
      </div>
    </motion.div>
  );
}

interface WrappedBodyProps {
  children: ReactNode;
  className?: string;
  delay?: keyof typeof WRAPPED_DELAY;
}

/**
 * WrappedBody - Secondary text with slide-up animation
 */
export function WrappedBody({ 
  children, 
  className,
  delay = 'secondary' 
}: WrappedBodyProps) {
  return (
    <motion.p
      className={cn('wrapped-text-body text-center max-w-xl', className)}
      variants={wrappedVariants.slideUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: WRAPPED_DELAY[delay] }}
    >
      {children}
    </motion.p>
  );
}

interface WrappedCaptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * WrappedCaption - Small contextual text
 */
export function WrappedCaption({ children, className }: WrappedCaptionProps) {
  return (
    <motion.p
      className={cn('wrapped-text-caption', className)}
      variants={wrappedVariants.fade}
      initial="hidden"
      animate="visible"
      transition={{ delay: WRAPPED_DELAY.context }}
    >
      {children}
    </motion.p>
  );
}

interface WrappedCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * WrappedCard - Elevated surface container
 */
export function WrappedCard({ children, className }: WrappedCardProps) {
  return (
    <motion.div
      className={cn('wrapped-surface-elevated p-6', className)}
      variants={wrappedVariants.cardEnter}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

interface WrappedProgressProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

/**
 * WrappedProgress - Animated progress indicator
 */
export function WrappedProgress({ value, label, className }: WrappedProgressProps) {
  return (
    <div className={cn('w-full max-w-md', className)}>
      {label && (
        <p className="wrapped-text-caption mb-2">{label}</p>
      )}
      <div className="wrapped-progress-track">
        <motion.div
          className="wrapped-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: WRAPPED_DELAY.data,
          }}
        />
      </div>
    </div>
  );
}

interface WrappedStaggerContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * WrappedStaggerContainer - Container that staggers child animations
 */
export function WrappedStaggerContainer({ 
  children, 
  className 
}: WrappedStaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={wrappedVariants.staggerContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

interface WrappedStaggerItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * WrappedStaggerItem - Item within stagger container
 */
export function WrappedStaggerItem({ 
  children, 
  className 
}: WrappedStaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={wrappedVariants.slideUp}
    >
      {children}
    </motion.div>
  );
}

interface WrappedVerifiedBadgeProps {
  isVerified: boolean;
  className?: string;
}

/**
 * WrappedVerifiedBadge - Data verification indicator
 */
export function WrappedVerifiedBadge({ 
  isVerified, 
  className 
}: WrappedVerifiedBadgeProps) {
  return (
    <motion.div
      className={cn(
        isVerified ? 'wrapped-verified-badge' : 'wrapped-unverified-badge',
        className
      )}
      variants={wrappedVariants.fade}
      initial="hidden"
      animate="visible"
      transition={{ delay: WRAPPED_DELAY.context }}
    >
      {isVerified ? (
        <>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            aria-hidden="true"
          >
            <path 
              d="M2 6L5 9L10 3" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="wrapped-check-animated"
            />
          </svg>
          Verified
        </>
      ) : (
        <>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
          </svg>
          Unverified
        </>
      )}
    </motion.div>
  );
}
