/**
 * 📅 Wrapped Step 3: Timeline
 * "När hände det?"
 * 
 * Animated timeline visualization with premium design
 */

import { useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import type { WrappedOutput, WrappedTimelineMarker } from '@/types/wrapped';
import { cn } from '@/lib/utils';
import { ChartExportButton } from '@/components/export';

interface WrappedTimelineProps {
  data: WrappedOutput['timeline'];
  accentGradient?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function TimelineMarker({ 
  marker, 
  index, 
  isLast
}: { 
  marker: WrappedTimelineMarker; 
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div 
      className="relative flex items-start gap-4"
      variants={itemVariants}
      whileHover={{ x: 4 }}
    >
      {/* Timeline connector */}
      <div className="relative flex flex-col items-center">
        <motion.div 
          className={cn(
            "w-4 h-4 rounded-full border-2 z-10",
            marker.isSignificant 
              ? "bg-white border-white" 
              : "bg-white/20 border-white/30"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
        />
        {!isLast && (
          <motion.div 
            className="w-0.5 h-16 bg-gradient-to-b from-white/30 to-transparent"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
          />
        )}
      </div>
      
      {/* Content */}
      <div className={cn(
        "flex-1 pb-8 transition-all",
        marker.isSignificant && "pl-2"
      )}>
        <div className={cn(
          "rounded-xl p-4 transition-all",
          marker.isSignificant 
            ? "bg-white/10 backdrop-blur-lg border border-white/20" 
            : "hover:bg-white/5"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              {format(parseISO(marker.date), 'd MMM yyyy', { locale: sv })}
            </span>
            {marker.isSignificant && (
              <motion.span 
                className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                Signifikant
              </motion.span>
            )}
          </div>
          <motion.p 
            className={cn(
              "font-semibold tabular-nums",
              marker.isSignificant ? "text-2xl text-white" : "text-lg text-white/70"
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {marker.value.toLocaleString('sv-SE')}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export function WrappedTimeline({ data, accentGradient }: WrappedTimelineProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const periodStart = format(parseISO(data.periodStart), 'd MMM yyyy', { locale: sv });
  const periodEnd = format(parseISO(data.periodEnd), 'd MMM yyyy', { locale: sv });

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
          <CalendarDays className="h-8 w-8 text-white/70" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          När hände det?
        </h2>
        <p className="text-lg text-white/50">
          {periodStart} – {periodEnd}
        </p>
      </motion.div>

      {/* Timeline visualization */}
      <motion.div 
        ref={chartRef}
        className="relative max-w-lg mx-auto"
        variants={containerVariants}
      >
        {/* Glow effect behind timeline */}
        <div className={cn(
          "absolute -inset-8 opacity-30 blur-3xl rounded-full bg-gradient-to-r",
          accentGradient
        )} />
        
        <div className="relative">
          {data.markers.map((marker, index) => (
            <TimelineMarker 
              key={`${marker.date}-${marker.indicatorId}`}
              marker={marker}
              index={index}
              isLast={index === data.markers.length - 1}
            />
          ))}
        </div>
      </motion.div>

      {/* Legend */}
      {data.markers.some(m => m.isSignificant) && (
        <motion.div 
          className="flex items-center justify-center gap-6 text-sm text-white/40"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white" />
            <span>Signifikant datapunkt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <span>Övrig datapunkt</span>
          </div>
        </motion.div>
      )}

      {/* Export button */}
      <motion.div 
        className="flex justify-center"
        variants={itemVariants}
      >
        <ChartExportButton
          chartRef={chartRef}
          filename={`tidslinje-${data.periodStart}-${data.periodEnd}`}
          size="sm"
          variant="ghost"
          className="text-white/50 hover:text-white hover:bg-white/10"
        />
      </motion.div>

      <motion.p 
        className="text-sm text-white/30 text-center"
        variants={itemVariants}
      >
        Tidslinjen visar datapunkter, inte händelser eller beslut.
      </motion.p>
    </motion.div>
  );
}
