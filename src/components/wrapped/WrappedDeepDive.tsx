/**
 * 🔍 Wrapped Step 7: Deep Dive
 * "Vill du gå djupare?"
 * 
 * Premium call-to-action with animated options
 */

import { motion, type Variants } from 'framer-motion';
import { BarChart3, BookOpen, Database, FileText, ExternalLink, Sparkles, Share2, Download } from 'lucide-react';
import type { WrappedOutput } from '@/types/wrapped';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WrappedDeepDiveProps {
  data: WrappedOutput['deepDive'];
  isDemo?: boolean;
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function getViewIcon(type: string) {
  switch (type) {
    case 'full_graph': return BarChart3;
    case 'methodology': return BookOpen;
    case 'raw_data': return Database;
    case 'sources': return FileText;
    default: return ExternalLink;
  }
}

function getViewDescription(type: string) {
  switch (type) {
    case 'full_graph': return 'Interaktiva visualiseringar';
    case 'methodology': return 'Beräkningar och definitioner';
    case 'raw_data': return 'Exporterbar data';
    case 'sources': return 'Källhänvisningar';
    default: return 'Utforska mer';
  }
}

export function WrappedDeepDive({ data, isDemo, accentGradient }: WrappedDeepDiveProps) {
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
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur flex items-center justify-center mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Sparkles className="h-8 w-8 text-violet-400" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Vill du gå djupare?
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto">
          Utforska fullständiga data och metodik
        </p>
      </motion.div>

      {/* Action cards grid */}
      <motion.div 
        className="grid gap-4 sm:grid-cols-2"
        variants={containerVariants}
      >
        {data.availableViews.map((view, index) => {
          const Icon = getViewIcon(view.type);
          
          return (
            <motion.div
              key={view.type}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Link 
                to={view.url}
                className={cn(
                  "block relative overflow-hidden rounded-2xl",
                  "bg-white/5 backdrop-blur-xl border border-white/10",
                  "p-6 transition-all duration-300",
                  "hover:bg-white/10 hover:border-white/20 group"
                )}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Icon className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold text-white group-hover:text-white transition-colors">
                      {view.label}
                    </p>
                    <p className="text-sm text-white/40">
                      {getViewDescription(view.type)}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Share/Export section */}
      <motion.div 
        className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
        variants={itemVariants}
      >
        <p className="text-white/50 text-center mb-6">
          Denna sammanfattning är en ingång till data, inte en slutpunkt.
        </p>
        
        {isDemo ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-white/40">
              I demo-läget kan du inte spara eller dela.
            </p>
            <Button 
              variant="outline" 
              disabled
              className="bg-white/5 border-white/20 text-white/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Dela (Endast i fullversion)
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Kopiera länk
            </Button>
            <Button 
              className="bg-white text-slate-900 hover:bg-white/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportera PDF
            </Button>
          </div>
        )}
      </motion.div>

      {/* Return to start */}
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <Button 
          variant="ghost" 
          asChild
          className="text-white/50 hover:text-white hover:bg-white/10"
        >
          <Link to="/">
            Tillbaka till startsidan
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
