import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedChartContainerProps {
  children: ReactNode;
  dataKey: string; // Change this to trigger animation
  className?: string;
}

/**
 * Wrapper that animates chart content when data changes
 */
export function AnimatedChartContainer({
  children,
  dataKey,
  className
}: AnimatedChartContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dataKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] // ease-out cubic
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface AnimatedDataPointProps {
  value: number;
  previousValue?: number;
  formatValue?: (v: number) => string;
  className?: string;
}

/**
 * Animated number display with counting effect
 */
export function AnimatedDataPoint({
  value,
  formatValue = (v) => v.toLocaleString('sv-SE'),
  className
}: AnimatedDataPointProps) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {formatValue(value)}
    </motion.span>
  );
}

interface ChartTransitionWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  periodKey: string;
}

/**
 * Complete chart transition wrapper with loading state
 */
export function ChartTransitionWrapper({
  children,
  isLoading,
  periodKey
}: ChartTransitionWrapperProps) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <AnimatedChartContainer dataKey={periodKey}>
        {children}
      </AnimatedChartContainer>
    </div>
  );
}

/**
 * Staggered animation for multiple chart elements
 */
interface StaggeredChartItemsProps {
  children: ReactNode[];
  staggerDelay?: number;
}

export function StaggeredChartItems({
  children,
  staggerDelay = 0.05
}: StaggeredChartItemsProps) {
  return (
    <>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: index * staggerDelay,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
