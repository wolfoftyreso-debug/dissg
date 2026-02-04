/**
 * CREATE PORTFOLIO DIALOG
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePortfolio, Portfolio } from '@/hooks/use-portfolios';

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (portfolio: Portfolio) => void;
}

export function CreatePortfolioDialog({ 
  open, 
  onOpenChange,
  onCreated 
}: CreatePortfolioDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createPortfolio = useCreatePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      const portfolio = await createPortfolio.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      
      setName('');
      setDescription('');
      onCreated?.(portfolio);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">[+] Ny portfölj</DialogTitle>
          <DialogDescription>
            Skapa en ny landsportfölj för att samla och analysera statistik.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Namn *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.ex. Nordiska länder"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valfri beskrivning av portföljen..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Avbryt
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || createPortfolio.isPending}
            >
              {createPortfolio.isPending ? 'Skapar...' : 'Skapa portfölj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
