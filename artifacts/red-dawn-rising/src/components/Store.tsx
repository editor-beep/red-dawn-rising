import React from 'react';
import { useGame } from '../hooks/useGame';
import { STORE_ITEMS } from '../data/gameData';
import { motion } from 'framer-motion';

export function StoreModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();

  const handleBuy = (item: typeof STORE_ITEMS[0]) => {
    const effectiveCost = state.redDawnActive ? Math.floor(item.cost / 2) : item.cost;
    if (state.means >= effectiveCost && !state.inventory.includes(item.id)) {
      dispatch({ type: 'SUBTRACT_MEANS', payload: effectiveCost });
      dispatch({ type: 'ADD_ITEM', payload: item.id });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-card border border-primary p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-mono text-primary uppercase tracking-widest">Supply Network</h2>
          <div className="text-xl font-mono">⊘ {state.means}</div>
        </div>

        <div className="grid gap-4">
          {STORE_ITEMS.map(item => {
            const owned = state.inventory.includes(item.id);
            const effectiveCost = state.redDawnActive ? Math.floor(item.cost / 2) : item.cost;
            const canAfford = state.means >= effectiveCost;
            return (
              <div key={item.id} className={`flex justify-between items-center p-4 border ${owned ? 'border-border bg-border/20' : 'border-border hover:border-primary/50'} transition-colors`}>
                <div>
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{item.description}</p>
                </div>
                <button
                  disabled={owned || !canAfford}
                  onClick={() => handleBuy(item)}
                  className={`px-4 py-2 font-mono uppercase text-sm ${
                    owned 
                      ? 'text-muted-foreground' 
                      : canAfford 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : 'border border-destructive/50 text-destructive/50'
                  }`}
                >
                  {owned ? 'Acquired' : state.redDawnActive ? `⊘ ${effectiveCost} (50% off)` : `⊘ ${item.cost}`}
                </button>
              </div>
            );
          })}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-3 border border-border text-muted-foreground hover:text-foreground hover:bg-border/20 font-mono uppercase transition-colors"
        >
          Close Secure Channel
        </button>
      </motion.div>
    </div>
  );
}
