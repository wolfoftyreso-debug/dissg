/**
 * 📈 Wrapped Step 2: Biggest Changes
 * "Det här förändrades mest"
 * 
 * Dramatic bar animations with premium visual treatment
 */

import { motion, type Variants } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import type { WrappedOutput, WrappedDataPoint } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedChangesProps {
  data: WrappedOutput['biggestChanges'];
  accentGradient?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function ChangeBar({ 
  indicator, 
  index,
  maxChange 
}: { 
  indicator: WrappedDataPoint; 
  index: number;
  maxChange: number;
}) {
  const absChange = Math.abs(indicator.changePercent || 0);
  const barWidth = (absChange / maxChange) * 100;
  const isPositive = indicator.isPositiveChange;

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "p-5 transition-all duration-300",
        "hover:bg-white/10 hover:border-white/20 group"
      )}
      variants={itemVariants}
      whileHover={{ scale: 1.01, x: 4 }}
    >
      {/* Background gradient bar - animated */}
      <motion.div 
        className={cn(
          "absolute inset-y-0 left-0",
          isPositive 
            ? "bg-gradient-to-r from-emerald-500/20 to-transparent" 
            : "bg-gradient-to-r from-rose-500/20 to-transparent"
        )}
        initial={{ width: 0 }}
        animate={{ width: `${barWidth}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 + index * 0.1 }}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <motion.div 
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isPositive 
                ? "bg-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/20 text-rose-400"
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            {indicator.changeDirection === 'up' ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <TrendingDown className="h-6 w-6" />
            )}
          </motion.div>
          
          <div>
            <p className="font-semibold text-white text-lg">{indicator.indicatorName}</p>
            <p className="text-sm text-white/40">
              {indicator.previousValue?.toLocaleString('sv-SE')} → {indicator.value.toLocaleString('sv-SE')} {indicator.unit}
            </p>
          </div>
        </div>
        
        {/* Percentage change - animated counter effect */}
        <motion.div 
          className={cn(
            "flex items-center gap-2 text-2xl md:text-3xl font-bold tabular-nums",
            isPositive ? "text-emerald-400" : "text-rose-400"
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
        >
          {indicator.changeDirection === 'up' ? (
            <ArrowUp className="h-6 w-6" />
          ) : (
            <ArrowDown className="h-6 w-6" />
          )}
          {indicator.changePercent !== null && (
            <span>
              {indicator.changePercent > 0 ? '+' : ''}
              {indicator.changePercent.toFixed(1)}%
            </span>
          )}
        </motion.div>
      </div>

      {/* Confidence indicator */}
      <motion.div 
        className="relative z-10 mt-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 + index * 0.1 }}
      >
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white/30 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${indicator.confidence}%` }}
            transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
          />
        </div>
        <span className="text-xs text-white/30">
          {indicator.confidence}% konfidens
        </span>
      </motion.div>
    </motion.div>
  );
}

export function WrappedChanges({ data }: WrappedChangesProps) {
  const hasChanges = data.changes.length > 0;
  const maxChange = Math.max(...data.changes.map(c => Math.abs(c.changePercent || 0)));

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
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Det här förändrades mest
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto">
          {data.analysisText}
        </p>
      </motion.div>

      {hasChanges ? (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {data.changes.map((change, index) => (
            <ChangeBar 
              key={change.indicatorId}
              indicator={change}
              index={index}
              maxChange={maxChange}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="py-16 text-center"
          variants={itemVariants}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-white/50">
            Inga indikatorer visade signifikanta förändringar under perioden.
          </p>
        </motion.div>
      )}

      {/* Footer note */}
      {hasChanges && (
        <motion.p 
          className="text-sm text-white/30 text-center"
          variants={itemVariants}
        >
          Förändring mäts jämfört med föregående period. Konfidensintervall baserat på datakvalitet.
        </motion.p>
      )}
    </motion.div>
  );
}
