/**
 * ⚠️ Wrapped Step 6: Limitations
 * "Vad detta inte säger"
 * 
 * Premium warning/limitation display with animated reveals
 */

import { motion, type Variants } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, ShieldAlert } from 'lucide-react';
import type { WrappedOutput, WrappedLimitation } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface WrappedLimitationsProps {
  data: WrappedOutput['limitations'];
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function LimitationIcon({ severity }: { severity: WrappedLimitation['severity'] }) {
  switch (severity) {
    case 'significant':
      return <AlertCircle className="h-5 w-5 text-rose-400" />;
    case 'moderate':
      return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    default:
      return <Info className="h-5 w-5 text-white/50" />;
  }
}

function getLimitationTypeLabel(type: WrappedLimitation['type']): string {
  switch (type) {
    case 'causation': return 'Orsakssamband';
    case 'methodology': return 'Metod';
    case 'scope': return 'Omfattning';
    case 'temporal': return 'Tidsmässig';
    case 'data_gap': return 'Datalucka';
    default: return 'Begränsning';
  }
}

export function WrappedLimitations({ data }: WrappedLimitationsProps) {
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
          className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 backdrop-blur flex items-center justify-center mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <ShieldAlert className="h-8 w-8 text-rose-400" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Vad detta inte säger
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto">
          Viktiga begränsningar att ha i åtanke
        </p>
      </motion.div>

      {/* Main disclaimer - emphasized */}
      <motion.div 
        className="rounded-xl bg-amber-500/10 backdrop-blur border border-amber-500/30 p-5"
        variants={itemVariants}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-white/80 leading-relaxed">
            {data.disclaimerText}
          </p>
        </div>
      </motion.div>

      {/* Individual limitations */}
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
      >
        {data.items.map((limitation, index) => (
          <motion.div
            key={`${limitation.type}-${index}`}
            className={cn(
              "relative overflow-hidden rounded-xl",
              "bg-white/5 backdrop-blur-xl border",
              limitation.severity === 'significant' 
                ? "border-rose-500/30" 
                : "border-white/10",
              "p-5 transition-all duration-300",
              "hover:bg-white/10"
            )}
            variants={itemVariants}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <LimitationIcon severity={limitation.severity} />
              </motion.div>
              <div className="flex-1">
                <motion.span 
                  className={cn(
                    "inline-block text-xs px-2 py-1 rounded-full mb-2",
                    limitation.severity === 'significant' 
                      ? "bg-rose-500/20 text-rose-400" 
                      : limitation.severity === 'moderate'
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-white/10 text-white/50"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {getLimitationTypeLabel(limitation.type)}
                </motion.span>
                <p className="text-white/70">{limitation.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fixed disclaimers - always present */}
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
      >
        {[
          'Korrelation innebär inte orsakssamband',
          'Historiska data säger inget om framtiden',
          'Systemgenererad sammanfattning'
        ].map((disclaimer, index) => (
          <motion.div 
            key={index}
            className="flex items-center gap-3 text-white/40"
            variants={itemVariants}
          >
            <motion.span 
              className="w-2 h-2 rounded-full bg-white/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            />
            <span className="text-sm">{disclaimer}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
