import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECK } from '../data/gameData';
import { useGame } from '../hooks/useGame';

export function CardDrawModal({
  onComplete,
  count,
  title = 'Intercepted Intel',
  subtitle,
}: {
  onComplete: () => void;
  count: number;
  title?: string;
  subtitle?: string;
}) {
  const { dispatch } = useGame();
  const [drawn, setDrawn] = useState<typeof DECK>([]);
  const [revealed, setRevealed] = useState<number>(0);

  useEffect(() => {
    const shuffled = [...DECK].sort(() => Math.random() - 0.5);
    setDrawn(shuffled.slice(0, count));
  }, [count]);

  const handleReveal = () => {
    if (revealed < count) {
      const card = drawn[revealed];
      dispatch({ type: 'ADD_DRAWN_CARD', payload: card.id });
      if (card.id === 'c1') dispatch({ type: 'MODIFY_NEXT_DIE_ROLL', payload: 1 });
      if (card.id === 'c6') dispatch({ type: 'MODIFY_NEXT_DIE_ROLL', payload: -1 });
      if (card.id === 'c3') dispatch({ type: 'ADD_MEANS', payload: 80 });
      if (card.id === 'c5') dispatch({ type: 'ADD_MEANS', payload: 100 });
      if (card.id === 'c8') dispatch({ type: 'SET_PROTECTED_SCENES', payload: 2 });
      setRevealed(r => r + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md">
      <div className="flex flex-col items-center min-h-full py-12 px-4">
        <h2 className="text-2xl font-mono text-primary uppercase mb-2">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground font-mono mb-8">{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}

        <div className="flex gap-4 flex-wrap justify-center max-w-3xl">
          <AnimatePresence>
            {drawn.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`w-48 h-72 border-2 ${idx < revealed ? 'border-primary bg-card' : 'border-border bg-border/20'} p-4 flex flex-col relative overflow-hidden`}
              >
                {idx < revealed ? (
                  <motion.div
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    className="h-full flex flex-col"
                  >
                    <div className="text-xs text-muted-foreground border-b border-border pb-2 mb-2 font-mono">DECRYPTED</div>
                    <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{card.name}</h3>
                    <p className="text-sm text-primary/80 font-mono mt-auto">{card.effectDescription}</p>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30 font-mono text-4xl">
                    ?
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={handleReveal}
          className="mt-12 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase transition-colors"
        >
          {revealed < count ? 'Decrypt Next' : 'Acknowledge'}
        </button>
      </div>
    </div>
  );
}
