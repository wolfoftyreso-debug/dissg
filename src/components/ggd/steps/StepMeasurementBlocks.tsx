/**
 * Step 3: Measurement Blocks
 * 
 * ECU-style measurement blocks showing current vs target values.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Info, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import type { MeasurementBlock } from '../types';
import type { LambdaAxis } from '@/lib/lambda/lambda-1.0';

interface StepMeasurementBlocksProps {
  blocks: MeasurementBlock[];
  primaryAxis: LambdaAxis;
  onConfirm: () => void;
}

export function StepMeasurementBlocks({ blocks, primaryAxis, onConfirm }: StepMeasurementBlocksProps) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [viewedBlocks, setViewedBlocks] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const handleBlockClick = (blockId: string) => {
    setSelectedBlock(blockId === selectedBlock ? null : blockId);
    setViewedBlocks(prev => new Set([...prev, blockId]));
  };

  const selectedBlockData = blocks.find(b => b.id === selectedBlock);
  const deviatingBlocks = blocks.filter(b => b.status !== 'normal');
  const allDeviatingViewed = deviatingBlocks.every(b => viewedBlocks.has(b.id));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-4 font-mono">STEG 3 / 8</Badge>
        <h2 className="text-2xl font-bold mb-2">Mätvärdesblock – {primaryAxis}</h2>
        <p className="text-muted-foreground">
          Granska alla mätpunkter. Avvikande värden är markerade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Block list */}
        <div>
          <div className="text-xs text-muted-foreground font-mono mb-2">
            MÄTVÄRDEN ({deviatingBlocks.length} AVVIKANDE)
          </div>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 pr-4">
              {blocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(block.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedBlock === block.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="font-mono text-[10px]"
                        style={{ 
                          borderColor: getStatusColor(block.status),
                          color: getStatusColor(block.status),
                        }}
                      >
                        {block.code}
                      </Badge>
                      <span className="font-medium text-sm">{block.name.sv}</span>
                    </div>
                    {viewedBlocks.has(block.id) && (
                      <Badge variant="secondary" className="text-[10px]">✓</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Aktuellt</div>
                      <div className="font-mono font-bold" style={{ color: getStatusColor(block.status) }}>
                        {block.currentValue.toLocaleString()} {block.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Börvärde</div>
                      <div className="font-mono text-blue-500">
                        {block.targetValue.toLocaleString()} {block.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Avvikelse</div>
                      <div className={`font-mono font-bold ${block.deviation < 0 ? 'text-red-500' : block.deviation > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                        {block.deviation > 0 ? '+' : ''}{block.deviation}%
                      </div>
                    </div>
                  </div>

                  {/* Mini progress bar showing where value is in range */}
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                      {/* Acceptable range */}
                      <div 
                        className="absolute h-full bg-green-500/30"
                        style={{
                          left: `${(block.acceptableRange[0] / (block.targetValue * 2)) * 100}%`,
                          width: `${((block.acceptableRange[1] - block.acceptableRange[0]) / (block.targetValue * 2)) * 100}%`,
                        }}
                      />
                      {/* Current value marker */}
                      <div 
                        className="absolute h-full w-1 rounded"
                        style={{
                          left: `${Math.min(100, (block.currentValue / (block.targetValue * 2)) * 100)}%`,
                          backgroundColor: getStatusColor(block.status),
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Detail panel */}
        <div className="bg-card border rounded-xl p-6">
          {selectedBlockData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="outline" className="font-mono mb-2">{selectedBlockData.code}</Badge>
                  <h3 className="text-lg font-bold">{selectedBlockData.name.sv}</h3>
                  <div className="text-sm text-muted-foreground">{selectedBlockData.category}</div>
                </div>
                <Badge 
                  style={{ 
                    backgroundColor: `${getStatusColor(selectedBlockData.status)}20`,
                    color: getStatusColor(selectedBlockData.status),
                  }}
                >
                  {selectedBlockData.status === 'critical' ? 'Kritisk' : 
                   selectedBlockData.status === 'warning' ? 'Varning' : 'Normal'}
                </Badge>
              </div>

              {/* Values */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">AKTUELLT VÄRDE</div>
                  <div className="text-2xl font-mono font-bold" style={{ color: getStatusColor(selectedBlockData.status) }}>
                    {selectedBlockData.currentValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedBlockData.unit}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">BÖRVÄRDE</div>
                  <div className="text-2xl font-mono font-bold text-blue-500">
                    {selectedBlockData.targetValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedBlockData.unit}</div>
                </div>
              </div>

              {/* Acceptable range */}
              <div className="mb-6">
                <div className="text-xs text-muted-foreground mb-2">ACCEPTABELT INTERVALL</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{selectedBlockData.acceptableRange[0]}</span>
                  <div className="flex-1 h-2 bg-green-500/30 rounded-full" />
                  <span className="font-mono">{selectedBlockData.acceptableRange[1]}</span>
                </div>
              </div>

              {/* Historical chart */}
              <div className="mb-6">
                <div className="text-xs text-muted-foreground mb-2">HISTORIK (25 ÅR)</div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedBlockData.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => v % 5 === 0 ? v.toString() : ''}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ fontSize: 11, background: 'rgba(0,0,0,0.9)', border: 'none' }}
                        formatter={(v: number) => [v.toLocaleString(), selectedBlockData.unit]}
                      />
                      {/* Acceptable range area */}
                      <ReferenceArea 
                        y1={selectedBlockData.acceptableRange[0]} 
                        y2={selectedBlockData.acceptableRange[1]} 
                        fill="#22c55e" 
                        fillOpacity={0.1} 
                      />
                      {/* Target line */}
                      <ReferenceLine 
                        y={selectedBlockData.targetValue} 
                        stroke="#3b82f6" 
                        strokeDasharray="5 5" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={getStatusColor(selectedBlockData.status)} 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Source */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Källa: {selectedBlockData.source} • Konfidens: {selectedBlockData.confidence}%</span>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Välj ett mätvärde för att se detaljer</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {viewedBlocks.size} av {blocks.length} mätvärden granskade
          {!allDeviatingViewed && deviatingBlocks.length > 0 && (
            <span className="text-amber-500 ml-2">
              (Granska alla avvikande värden för att fortsätta)
            </span>
          )}
        </div>
        <Button
          size="lg"
          disabled={!allDeviatingViewed && deviatingBlocks.length > 0}
          onClick={onConfirm}
          className="font-mono"
        >
          Fortsätt till felkoder
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
