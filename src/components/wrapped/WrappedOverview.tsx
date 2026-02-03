/**
 * 🌟 Wrapped Step 1: Overview
 * "Så här såg året ut"
 * 
 * Spotify-style dramatic reveal with animated statistics
 */

import { motion, type Variants } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Verified } from 'lucide-react';
import type { WrappedOutput } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedOverviewProps {
  data: WrappedOutput['overview'];
  isDemo?: boolean;
  accentGradient?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const numberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function WrappedOverview({ data, isDemo, accentGradient }: WrappedOverviewProps) {
  return (
    <motion.div 
      className="space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Header */}
      <motion.div 
        className="text-center space-y-4"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white tracking-tight"
          variants={numberVariants}
        >
          {data.title}
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-white/60 max-w-lg mx-auto"
          variants={itemVariants}
        >
          {data.subtitle}
        </motion.p>
      </motion.div>

      {/* Main indicators - Premium cards */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        variants={containerVariants}
      >
        {data.mainIndicators.map((indicator, index) => (
          <motion.div 
            key={indicator.indicatorId}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
              "relative group overflow-hidden rounded-2xl",
              "bg-white/5 backdrop-blur-xl border border-white/10",
              "p-6 transition-all duration-300",
              "hover:bg-white/10 hover:border-white/20"
            )}
          >
            {/* Subtle gradient glow on hover */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-br",
              accentGradient
            )} style={{ opacity: 0.05 }} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/50 font-medium uppercase tracking-wider">
                    {indicator.indicatorName}
                  </p>
                  <motion.div 
                    className="flex items-baseline gap-2"
                    variants={numberVariants}
                  >
                    <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                      {typeof indicator.value === 'number' 
                        ? indicator.value.toLocaleString('sv-SE')
                        : indicator.value}
                    </span>
                    <span className="text-lg text-white/40">
                      {indicator.unit}
                    </span>
                  </motion.div>
                </div>
                
                {/* Change indicator with animated entrance */}
                <motion.div 
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                    indicator.isPositiveChange && indicator.changeDirection !== 'stable'
                      ? "bg-emerald-500/20 text-emerald-400"
                      : indicator.changeDirection !== 'stable'
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-white/10 text-white/50"
                  )}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {indicator.changeDirection === 'up' && (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {indicator.changeDirection === 'down' && (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {indicator.changeDirection === 'stable' && (
                    <Minus className="h-4 w-4" />
                  )}
                  {indicator.changePercent !== null && (
                    <span className="tabular-nums">
                      {indicator.changePercent > 0 ? '+' : ''}
                      {indicator.changePercent.toFixed(1)}%
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Source - subtle */}
              <div className="flex items-center gap-2 text-xs text-white/30">
                <Verified className="h-3 w-3" />
                <span>Källa: {indicator.dataSource}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary text with gradient underline */}
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <p className="text-white/50 max-w-xl mx-auto text-lg leading-relaxed">
          {data.summaryText}
        </p>
      </motion.div>

      {/* Demo watermark */}
      {isDemo && (
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs text-white/40 bg-white/5 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            DEMO – Begränsad funktionalitet
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
