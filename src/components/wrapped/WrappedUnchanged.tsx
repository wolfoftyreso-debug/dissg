/**
 * ⏸️ Wrapped Step 5: Unchanged
 * "Vad låg still?"
 * 
 * Calm, stable visualization for unchanged indicators
 */

import { motion, type Variants } from 'framer-motion';
import { Minus, Anchor, Shield } from 'lucide-react';
import type { WrappedOutput } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedUnchangedProps {
  data: WrappedOutput['unchanged'];
  accentGradient?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function WrappedUnchanged({ data }: WrappedUnchangedProps) {
  const hasStableIndicators = data.stableIndicators.length > 0;

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="text-center space-y-3"
        variants={itemVariants}
      >
        <motion.div 
          className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Anchor className="h-8 w-8 text-white/70" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Vad låg still?
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto">
          {data.stabilityText}
        </p>
      </motion.div>

      {hasStableIndicators ? (
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
        >
          {data.stableIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.indicatorId}
              className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-white/5 backdrop-blur-xl border border-white/10",
                "p-5 transition-all duration-300",
                "hover:bg-white/10 hover:border-white/20"
              )}
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Minus className="h-5 w-5 text-white/50" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white">{indicator.indicatorName}</p>
                    <p className="text-sm text-white/40">
                      Källa: {indicator.dataSource}
                    </p>
                  </div>
                </div>
                
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {indicator.value.toLocaleString('sv-SE')}
                    <span className="text-sm text-white/40 ml-2">{indicator.unit}</span>
                  </p>
                  <p className="text-sm text-white/40">
                    {indicator.changePercent !== null 
                      ? `${indicator.changePercent > 0 ? '+' : ''}${indicator.changePercent.toFixed(1)}%`
                      : 'Oförändrad'}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="py-16 text-center"
          variants={itemVariants}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-white/50">
            Alla analyserade indikatorer visade mätbar förändring under perioden.
          </p>
        </motion.div>
      )}

      {/* Why stability matters */}
      <motion.div 
        className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-5"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-white/40" />
          <p className="text-sm text-white/40">
            Stabilitet kan vara lika viktig som förändring. 
            Oförändrade indikatorer visar områden utan signifikant utveckling.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
