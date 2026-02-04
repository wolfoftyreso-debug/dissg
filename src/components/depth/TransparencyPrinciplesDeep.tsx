/**
 * TRANSPARENCY PRINCIPLES - DEEP CLICKABLE
 * 
 * Full "Zero Dead-Ends" implementation för transparensprinciper.
 * Varje princip öppnar sig med full förklaringspyramid.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TRANSPARENCY_PRINCIPLES_DEEP,
  TRANSPARENCY_OUTCOME_DEEP,
  type TransparencyPrincipleDeep
} from '@/config/demographyCorrelationConfig';

interface PrincipleCardProps {
  principle: TransparencyPrincipleDeep;
  isOpen: boolean;
  onToggle: () => void;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ principle, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'implementation' | 'sources'>('overview');

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-start gap-2 text-sm text-left p-3 rounded-lg hover:bg-accent/50 transition-colors group"
          aria-expanded={isOpen}
        >
          <span className="font-mono text-primary text-xs mt-0.5">
            {isOpen ? '[−]' : '[+]'}
          </span>
          <div className="flex-1">
            <span className="group-hover:text-primary transition-colors">
              {principle.title.sv}
            </span>
            {!isOpen && (
              <span className="text-xs text-muted-foreground ml-2">[KLICKA FÖR DJUP]</span>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-6 mt-2 space-y-4 pb-4"
            >
              {/* Tab Navigation */}
              <div className="flex gap-1 text-xs">
                {(['overview', 'implementation', 'sources'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                    className={`px-3 py-1 rounded border transition-colors ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {tab === 'overview' ? 'ÖVERSIKT' : tab === 'implementation' ? 'TILLÄMPNING' : 'KÄLLOR'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Description */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{principle.description.sv}</p>
                  </div>

                  {/* Methodology */}
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">METODIK</p>
                    <p className="text-sm">{principle.methodology.sv}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">FÖRDELAR</p>
                      <ul className="space-y-1">
                        {principle.benefits.sv.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary font-bold">+</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">BEGRÄNSNINGAR</p>
                      <ul className="space-y-1">
                        {principle.limitations.sv.map((l, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-muted-foreground font-bold">!</span>
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'implementation' && (
                <div className="space-y-3">
                  <p className="text-xs font-mono text-muted-foreground">TEKNISK IMPLEMENTATION I DETTA SYSTEM</p>
                  <ul className="space-y-2">
                    {principle.implementation.sv.map((impl, i) => (
                      <li key={i} className="flex items-start gap-3 p-2 bg-muted/30 rounded text-sm">
                        <span className="font-mono text-primary text-xs">{String(i + 1).padStart(2, '0')}</span>
                        {impl}
                      </li>
                    ))}
                  </ul>

                  {/* Related Principles */}
                  {principle.relatedPrinciples.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-mono text-muted-foreground mb-2">RELATERADE PRINCIPER</p>
                      <div className="flex gap-2 flex-wrap">
                        {principle.relatedPrinciples.map(relId => {
                          const rel = TRANSPARENCY_PRINCIPLES_DEEP.find(p => p.id === relId);
                          return rel ? (
                            <span key={relId} className="text-xs px-2 py-1 bg-accent rounded">
                              {rel.title.sv}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sources' && (
                <div className="space-y-3">
                  <p className="text-xs font-mono text-muted-foreground">VETENSKAPLIG GRUND</p>
                  <ul className="space-y-2">
                    {principle.sources.map((src, i) => (
                      <li key={i} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">{src.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {src.source} • {src.year}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3">
                    REF: TRANSPARENCY::{principle.id.toUpperCase()}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

const OutcomeDeep: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full text-center text-sm font-medium text-primary hover:underline py-2"
          aria-expanded={isOpen}
        >
          {TRANSPARENCY_OUTCOME_DEEP.title.sv}
          <span className="text-xs ml-2 opacity-60">{isOpen ? '[−]' : '[+]'}</span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
            >
              {/* Description */}
              <p className="text-sm">{TRANSPARENCY_OUTCOME_DEEP.description.sv}</p>

              {/* Mechanism */}
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-1">MEKANISM</p>
                <p className="text-sm">{TRANSPARENCY_OUTCOME_DEEP.mechanism.sv}</p>
              </div>

              {/* Evidence */}
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">EVIDENS</p>
                <ul className="space-y-1">
                  {TRANSPARENCY_OUTCOME_DEEP.evidence.sv.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">→</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sources */}
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">KÄLLOR</p>
                <div className="flex gap-2 flex-wrap">
                  {TRANSPARENCY_OUTCOME_DEEP.sources.map((src, i) => (
                    <span key={i} className="text-xs px-2 py-1 border rounded">
                      {src.title} ({src.source}, {src.year})
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3">
                REF: TRANSPARENCY::OUTCOME::POLARIZATION
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const TransparencyPrinciplesDeep: React.FC = () => {
  const [openPrinciple, setOpenPrinciple] = useState<string | null>(null);
  const [outcomeOpen, setOutcomeOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Transparensprinciper
          <span className="text-xs font-normal text-muted-foreground">
            [KLICKA VARJE FÖR DJUP]
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1 md:grid-cols-2">
          {TRANSPARENCY_PRINCIPLES_DEEP.map(principle => (
            <PrincipleCard
              key={principle.id}
              principle={principle}
              isOpen={openPrinciple === principle.id}
              onToggle={() => setOpenPrinciple(
                openPrinciple === principle.id ? null : principle.id
              )}
            />
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <OutcomeDeep
          isOpen={outcomeOpen}
          onToggle={() => setOutcomeOpen(!outcomeOpen)}
        />
      </CardContent>
    </Card>
  );
};

export default TransparencyPrinciplesDeep;
