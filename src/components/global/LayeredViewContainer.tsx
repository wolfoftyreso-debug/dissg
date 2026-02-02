/**
 * 🧩 LAYERED VIEW CONTAINER
 * 
 * MASTER EXECUTION BLOCK 41 — Progressive Complexity Container
 * 
 * Manages the three-layer view system:
 * - Layer 1: Simple (all users, 60 seconds)
 * - Layer 2: Detailed (logged in, context & trends)
 * - Layer 3: Advanced (pro/license, professional work)
 * 
 * Implements progressive disclosure: show minimum, reveal on request.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, BarChart3, Wrench, Lock, ChevronDown, ChevronUp,
  Info, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  VIEW_LAYERS,
  PROGRESSIVE_DISCLOSURE,
  SAFE_ANALYSIS,
  type ViewLayer,
} from '@/config/dataArchitectureConfig';

// ============================================================
// TYPES
// ============================================================

type Language = 'sv' | 'en';

interface LayeredViewContainerProps {
  language?: Language;
  currentLayer?: ViewLayer;
  onLayerChange?: (layer: ViewLayer) => void;
  isAuthenticated?: boolean;
  hasProLicense?: boolean;
  children?: {
    simple?: React.ReactNode;
    detailed?: React.ReactNode;
    advanced?: React.ReactNode;
  };
  title?: string;
  description?: string;
}

// ============================================================
// LAYER ICONS
// ============================================================

const LAYER_ICONS: Record<ViewLayer, React.ElementType> = {
  simple: Eye,
  detailed: BarChart3,
  advanced: Wrench,
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export function LayeredViewContainer({
  language = 'en',
  currentLayer: externalLayer,
  onLayerChange,
  isAuthenticated = false,
  hasProLicense = false,
  children,
  title,
  description,
}: LayeredViewContainerProps) {
  const [internalLayer, setInternalLayer] = useState<ViewLayer>('simple');
  const [showDisclosure, setShowDisclosure] = useState<string | null>(null);
  
  const currentLayer = externalLayer ?? internalLayer;
  
  const handleLayerChange = (layer: ViewLayer) => {
    if (onLayerChange) {
      onLayerChange(layer);
    } else {
      setInternalLayer(layer);
    }
  };

  // Check if layer is accessible
  const canAccessLayer = (layer: ViewLayer): boolean => {
    const config = VIEW_LAYERS[layer];
    if (config.requires_license && !hasProLicense) return false;
    if (config.requires_auth && !isAuthenticated) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || description) && (
        <div className="text-center">
          {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}

      {/* Layer selector */}
      <div className="flex justify-center">
        <Tabs value={currentLayer} onValueChange={(v) => handleLayerChange(v as ViewLayer)}>
          <TabsList className="grid grid-cols-3">
            {(Object.keys(VIEW_LAYERS) as ViewLayer[]).map((layerId) => {
              const config = VIEW_LAYERS[layerId];
              const Icon = LAYER_ICONS[layerId];
              const accessible = canAccessLayer(layerId);
              
              return (
                <TabsTrigger 
                  key={layerId}
                  value={layerId}
                  disabled={!accessible}
                  className="flex items-center gap-2"
                >
                  {!accessible ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{config.name[language]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Current layer description */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {VIEW_LAYERS[currentLayer].description[language]}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {VIEW_LAYERS[currentLayer].goal[language]}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0">
              {VIEW_LAYERS[currentLayer].target_audience[language]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Layer content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLayer}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {currentLayer === 'simple' && children?.simple}
          {currentLayer === 'detailed' && children?.detailed}
          {currentLayer === 'advanced' && (
            <>
              {/* Safety disclaimer for advanced layer */}
              <Alert className="mb-6 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  {SAFE_ANALYSIS.disclaimer[language]}
                </AlertDescription>
              </Alert>
              {children?.advanced}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progressive disclosure triggers */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            {language === 'sv' ? 'Vill du veta mer?' : 'Want to know more?'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {PROGRESSIVE_DISCLOSURE.triggers.map((trigger, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowDisclosure(showDisclosure === trigger.en ? null : trigger.en)}
              >
                {trigger[language]}
                {showDisclosure === trigger.en ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
          
          {/* Disclosure content placeholder */}
          <AnimatePresence>
            {showDisclosure && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-slate-50 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">
                  {language === 'sv' 
                    ? `Information om "${showDisclosure}" visas här...`
                    : `Information about "${showDisclosure}" would appear here...`
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* No overload reminder */}
      <p className="text-center text-xs text-muted-foreground italic">
        {PROGRESSIVE_DISCLOSURE.rule[language]}
      </p>
    </div>
  );
}

export default LayeredViewContainer;
