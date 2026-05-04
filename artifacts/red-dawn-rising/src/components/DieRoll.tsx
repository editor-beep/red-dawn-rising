import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function DieRollModal({ onComplete, modifier = 0 }: { onComplete: (result: number) => void; modifier?: number }) {
  const [rolling, setRolling] = useState(true);
  const [face, setFace] = useState(1);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (rolling) {
      interval = setInterval(() => {
        setFace(Math.floor(Math.random() * 6) + 1);
      }, 100);

      setTimeout(() => {
        setRolling(false);
        const naturalRoll = Math.floor(Math.random() * 6) + 1;
        const modifiedRoll = Math.max(1, Math.min(6, naturalRoll + modifier));
        setFace(modifiedRoll);
        setTimeout(() => onComplete(modifiedRoll), 1500);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [rolling, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="text-primary font-mono mb-2 uppercase tracking-widest">Calculating outcome...</div>
      {modifier !== 0 && (
        <div className={`mb-6 px-3 py-1 border font-mono text-sm ${modifier > 0 ? 'border-primary/60 text-primary bg-primary/10' : 'border-destructive/60 text-destructive bg-destructive/10'}`}>
          Active Modifier: {modifier > 0 ? '+' : ''}{modifier}
        </div>
      )}
      {modifier === 0 && <div className="mb-8" />}
      
      <motion.div 
        animate={rolling ? { rotate: [0, 90, 180, 270, 360] } : { scale: [1, 1.2, 1] }}
        transition={rolling ? { repeat: Infinity, duration: 0.4, ease: "linear" } : { duration: 0.5 }}
        className={`w-32 h-32 flex items-center justify-center border-4 ${rolling ? 'border-primary/50' : face === 1 ? 'border-destructive bg-destructive/10' : face === 6 ? 'border-primary bg-primary/20' : 'border-primary'} text-6xl font-bold`}
      >
        {face}
      </motion.div>
      
      {!rolling && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-2xl font-mono uppercase"
        >
          {face === 1 && <span className="text-destructive">Critical Failure</span>}
          {(face === 2 || face === 3) && <span className="text-muted-foreground">Failure</span>}
          {face === 4 && <span className="text-foreground">Partial Success</span>}
          {face === 5 && <span className="text-primary">Success</span>}
          {face === 6 && <span className="text-primary font-bold">Critical Success</span>}
        </motion.div>
      )}
    </div>
  );
}
