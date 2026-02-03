/**
 * 🏆 Wrapped Step 4: Comparisons
 * "Hur stod det sig?"
 * 
 * Premium ranking visualization with animated gauges
 */

import { motion, type Variants } from 'framer-motion';
import { Trophy, Medal, Target } from 'lucide-react';
import type { WrappedOutput, WrappedRanking } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedComparisonsProps {
  data: WrappedOutput['comparisons'];
  accentGradient?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

function RankingCard({ ranking, index }: { ranking: WrappedRanking; index: number }) {
  const positionPercent = (ranking.rank / ranking.total) * 100;
  const isTopQuarter = ranking.rank <= ranking.total / 4;
  const isTopHalf = ranking.rank <= ranking.total / 2;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "p-6 transition-all duration-300",
        "hover:bg-white/10 hover:border-white/20"
      )}
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Top quarter badge */}
      {isTopQuarter && (
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
        >
          <Trophy className="h-6 w-6 text-amber-400" />
        </motion.div>
      )}

      <div className="space-y-6">
        <div>
          <p className="font-semibold text-white text-lg mb-1">
            {ranking.indicatorId.replace(/_/g, ' ')}
          </p>
          <p className="text-sm text-white/40">
            {ranking.referenceGroupDescription}
          </p>
        </div>

        {/* Ranking visualization - animated gauge */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-white/40">
            <span>Bäst</span>
            <span>Sämst</span>
          </div>
          
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-amber-500/30 to-rose-500/30" />
            
            {/* Position marker with animation */}
            <motion.div 
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg",
                isTopQuarter 
                  ? "bg-emerald-400" 
                  : isTopHalf 
                  ? "bg-amber-400" 
                  : "bg-rose-400"
              )}
              initial={{ left: '0%', scale: 0 }}
              animate={{ 
                left: `${positionPercent}%`, 
                scale: 1,
                x: '-50%'
              }}
              transition={{ 
                duration: 1, 
                ease: [0.16, 1, 0.3, 1] as const,
                delay: 0.3 + index * 0.1 
              }}
            />
          </div>
        </div>

        {/* Rank text - bold number reveal */}
        <div className="text-center">
          <motion.p 
            className="text-5xl font-bold text-white tabular-nums mb-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          >
            {ranking.rank}
            <span className="text-xl text-white/40 ml-1">av {ranking.total}</span>
          </motion.p>
          <p className="text-sm text-white/40">
            Top {ranking.percentile}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function WrappedComparisons({ data }: WrappedComparisonsProps) {
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Target className="h-8 w-8 text-white/70" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Hur stod det sig?
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto">
          {data.comparisonText}
        </p>
      </motion.div>

      {/* Rankings grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        variants={containerVariants}
      >
        {data.rankings.map((ranking, index) => (
          <RankingCard 
            key={ranking.indicatorId} 
            ranking={ranking} 
            index={index}
          />
        ))}
      </motion.div>

      {/* Reference note */}
      <motion.div 
        className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-4"
        variants={itemVariants}
      >
        <p className="text-sm text-white/40 text-center">
          Jämförelser görs mot {data.rankings[0]?.referenceGroup || 'vald referensgrupp'}. 
          Ranking baseras på senast tillgängliga data.
        </p>
      </motion.div>
    </motion.div>
  );
}
