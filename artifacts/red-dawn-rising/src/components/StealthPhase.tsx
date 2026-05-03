import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export function StealthPhaseModal({
  surveillanceLevel,
  inventory,
  onResolve
}: {
  surveillanceLevel: number;
  inventory: string[];
  onResolve: (action: 'burn_item' | 'accept', itemId?: string) => void;
}) {
  const ITEM_NAMES: Record<string, string> = {
    encrypted_comms: 'Encrypted Comms Device',
    forged_docs: 'Forged Documents',
    safe_house_upgrade: 'Safe House Upgrade',
    medical_supplies: 'Medical Supplies',
    weapons_cache: 'Weapons Cache',
    propaganda_press: 'Propaganda Press',
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-card border border-destructive p-8 space-y-6"
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-destructive" size={28} />
          <div>
            <h2 className="font-mono text-xl text-destructive uppercase tracking-widest">Surveillance Alert</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">LEVEL {surveillanceLevel}% — Going dark before continuing</p>
          </div>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed font-serif">
          The heat is too high. Before moving forward, you need to lay low —
          burn an asset, go off-grid, and pray nobody talks.
        </p>
        <div className="space-y-3">
          {inventory.map(id => (
            <button
              key={id}
              onClick={() => onResolve('burn_item', id)}
              className="w-full text-left p-3 border border-border hover:border-destructive hover:bg-destructive/5 transition-all font-mono text-sm"
            >
              <span className="text-destructive mr-2">[BURN]</span>
              {ITEM_NAMES[id] || id}
              <span className="float-right text-muted-foreground text-xs">-20 Surveillance</span>
            </button>
          ))}
          <button
            onClick={() => onResolve('accept')}
            className="w-full text-left p-3 border border-border hover:border-primary hover:bg-primary/5 transition-all font-mono text-sm"
          >
            <span className="text-muted-foreground mr-2">[PRESS ON]</span>
            Accept the risk. Continue without burning anything.
            <span className="float-right text-destructive text-xs">+15 Surveillance</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
