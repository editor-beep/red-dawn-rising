import React from 'react';
import { useGame } from '../hooks/useGame';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function TitleScreen() {
  const { dispatch } = useGame();
  const [, setLocation] = useLocation();

  const handleNewGame = () => {
    dispatch({ type: 'RESET' });
    setLocation('/game');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="noise" />
      <div className="scanline" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl w-full text-center z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black text-destructive tracking-tighter mb-4 uppercase">
          RED DAWN<br/>RISING
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-mono mb-16 uppercase tracking-widest">
          A Text Adventure of Revolution
        </p>

        <div className="flex flex-col gap-6 items-center w-full max-w-sm mx-auto">
          <button 
            onClick={handleNewGame}
            className="w-full py-4 px-8 border border-destructive text-destructive font-mono text-xl uppercase hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 relative group"
          >
            <span className="relative z-10">New Game</span>
            <div className="absolute inset-0 bg-destructive/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => setLocation('/game')}
            className="w-full py-4 px-8 border border-border text-foreground font-mono text-xl uppercase hover:bg-border transition-colors duration-300"
          >
            Continue
          </button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 right-8 text-muted-foreground font-mono text-sm opacity-50">
        v1.0.0 // SECURE COMMS ESTABLISHED
      </div>
    </div>
  );
}
