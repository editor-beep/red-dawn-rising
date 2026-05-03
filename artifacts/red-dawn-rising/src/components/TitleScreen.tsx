import React from 'react';
import { useGame } from '../hooks/useGame';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ENDINGS, SECRET_ENDING_ID, SECRET_START_SCENE } from '../data/gameData';

export default function TitleScreen() {
  const { state, dispatch } = useGame();
  const [, setLocation] = useLocation();

  const standardEndings = ENDINGS.filter(e => e.id !== SECRET_ENDING_ID);
  const allStandardUnlocked = standardEndings.every(e => state.unlockedEndings.includes(e.id));
  const secretUnlocked = state.unlockedEndings.includes(SECRET_ENDING_ID);

  const handleNewGame = () => {
    dispatch({ type: 'RESET' });
    setLocation('/game');
  };

  const handleSecretPath = () => {
    dispatch({ type: 'RESET', payload: { startSceneId: SECRET_START_SCENE } });
    setLocation('/game');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-40 relative overflow-x-hidden">
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
        <p className="text-xl md:text-2xl text-muted-foreground font-mono mb-12 uppercase tracking-widest">
          A Text Adventure of Revolution
        </p>

        <div className="flex flex-col gap-4 items-center w-full max-w-sm mx-auto">
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

          {allStandardUnlocked && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={handleSecretPath}
              className="w-full py-4 px-8 border border-primary text-primary font-mono text-xl uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 relative group shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
            >
              <span className="relative z-10">▸ The Fifth Path</span>
              <div className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </motion.button>
          )}
        </div>

        {/* Endings tracker */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3 opacity-60">
            // Paths Walked &nbsp;[{state.unlockedEndings.length} / {ENDINGS.length}]
          </div>
          <ul className="space-y-1.5 text-left font-mono text-xs md:text-sm">
            {ENDINGS.map((ending) => {
              const unlocked = state.unlockedEndings.includes(ending.id);
              const isSecret = ending.id === SECRET_ENDING_ID;
              const showSecret = isSecret && (allStandardUnlocked || unlocked);
              if (isSecret && !showSecret) return null;
              return (
                <li
                  key={ending.id}
                  className={`flex items-baseline gap-3 px-3 py-1.5 border ${
                    unlocked
                      ? isSecret
                        ? 'border-primary/40 bg-primary/5 text-primary'
                        : 'border-destructive/40 bg-destructive/5 text-foreground'
                      : 'border-border/40 bg-transparent text-muted-foreground/50'
                  }`}
                >
                  <span className="opacity-60 w-6 shrink-0">{ending.codename}</span>
                  <span className="flex-1 truncate">
                    {unlocked ? ending.title : '████████████████████'}
                  </span>
                  <span className="text-[10px] opacity-60 shrink-0">
                    {unlocked ? '[UNLOCKED]' : '[LOCKED]'}
                  </span>
                </li>
              );
            })}
          </ul>
          {!allStandardUnlocked && (
            <div className="mt-3 text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest text-center">
              Walk all four paths to unlock the fifth.
            </div>
          )}
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 text-muted-foreground font-mono text-xs md:text-sm px-4">
        <a
          href="https://www.themeansofproduction.press"
          target="_blank"
          rel="noopener noreferrer"
          className="text-destructive/80 hover:text-destructive uppercase tracking-widest transition-colors"
        >
          themeansofproduction.press
        </a>
        <div className="opacity-50 text-center">
          © The Means of Production 2026
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-muted-foreground font-mono text-xs opacity-30 hidden md:block">
        v1.1.0
      </div>
    </div>
  );
}
