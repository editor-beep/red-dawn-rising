import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SkillCheckModal({ target, itemBonuses = {}, inventory, onComplete, partialTarget }: {
  target: number;
  itemBonuses?: Record<string, number>;
  inventory: string[];
  onComplete: (success: boolean, partial: boolean) => void;
  partialTarget?: number;
}) {
  const [rolling, setRolling] = useState(true);
  const [die1, setDie1] = useState(1);
  const [die2, setDie2] = useState(1);
  const [finalDie1, setFinalDie1] = useState(0);
  const [finalDie2, setFinalDie2] = useState(0);
  const [done, setDone] = useState(false);

  const modifier = Object.entries(itemBonuses)
    .filter(([id]) => inventory.includes(id))
    .reduce((sum, [, bonus]) => sum + bonus, 0);

  useEffect(() => {
    let rollInterval: ReturnType<typeof setInterval>;
    if (rolling) {
      rollInterval = setInterval(() => {
        setDie1(Math.floor(Math.random() * 6) + 1);
        setDie2(Math.floor(Math.random() * 6) + 1);
      }, 80);
      const stopTimer = setTimeout(() => {
        clearInterval(rollInterval);
        setRolling(false);
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setFinalDie1(d1);
        setFinalDie2(d2);
        setDie1(d1);
        setDie2(d2);
        setTimeout(() => {
          setDone(true);
          const total = d1 + d2 + modifier;
          const success = total >= target;
          const partial = !success && partialTarget !== undefined && total >= partialTarget;
          setTimeout(() => onComplete(success, partial), 1200);
        }, 600);
      }, 2000);
      return () => { clearInterval(rollInterval); clearTimeout(stopTimer); };
    }
    return () => clearInterval(rollInterval);
  }, []);

  const total = (done ? finalDie1 + finalDie2 : die1 + die2) + modifier;
  const success = done && (finalDie1 + finalDie2 + modifier) >= target;
  const partial = done && !success && partialTarget !== undefined && (finalDie1 + finalDie2 + modifier) >= partialTarget;

  const dieBorderClass = (isRolling: boolean, isDone: boolean, isSuccess: boolean) => {
    if (isRolling) return 'border-primary/50';
    if (isDone && isSuccess) return 'border-primary bg-primary/20';
    if (isDone) return 'border-destructive bg-destructive/10';
    return 'border-primary';
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="text-primary font-mono mb-2 uppercase tracking-widest text-sm">Skill Check</div>
      <div className="text-muted-foreground font-mono mb-8 text-xs">Target: {target}{modifier !== 0 ? ` // Modifier: ${modifier > 0 ? '+' : ''}${modifier}` : ''}</div>

      <div className="flex gap-8 mb-6">
        {[die1, die2].map((face, i) => (
          <motion.div
            key={i}
            animate={rolling ? { rotate: [0, 90, 180, 270, 360] } : { scale: [1, 1.15, 1] }}
            transition={rolling ? { repeat: Infinity, duration: 0.4, ease: 'linear' } : { duration: 0.4 }}
            className={`w-24 h-24 flex items-center justify-center border-4 ${dieBorderClass(rolling, done, success)} text-5xl font-bold`}
          >
            {face}
          </motion.div>
        ))}
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="font-mono text-lg">
            {finalDie1} + {finalDie2}{modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''} = <span className="text-2xl font-bold">{total}</span>
          </div>
          <div className={`text-xl font-mono uppercase mt-4 ${success ? 'text-primary' : partial ? 'text-foreground' : 'text-destructive'}`}>
            {success ? 'Success' : partial ? 'Partial Success' : 'Failure'}
          </div>
        </motion.div>
      )}

      <div className="sr-only" aria-live="polite">{done ? `Roll result: ${total}` : 'Rolling…'}</div>
    </div>
  );
}
