import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { SCENES, SceneChoice, STORE_ITEMS } from '../data/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { StoreModal } from './Store';
import { DieRollModal } from './DieRoll';
import { CardDrawModal } from './CardDraw';
import { SkillCheckModal } from './SkillCheck';
import { StealthPhaseModal } from './StealthPhase';
import { SettingsModal } from './Settings';
import { SaveSlotsModal } from './SaveSlots';
import { useAudio } from '../hooks/useAudio';
import { Menu, X, ShieldAlert, Pocket, Users, BookOpen, Settings as SettingsIcon, Save } from 'lucide-react';

export default function GameScreen() {
  const { state, dispatch } = useGame();
  const { playTypewriterClack, playGeigerTick } = useAudio();
  const [, setLocation] = useLocation();
  const [showStore, setShowStore] = useState(false);
  const [dieConfig, setDieConfig] = useState<{ outcomes: Record<number, string> } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [falloutPending, setFalloutPending] = useState(false);
  const [skillCheckConfig, setSkillCheckConfig] = useState<SceneChoice['skillCheck'] | null>(null);
  const [stealthPhaseActive, setStealthPhaseActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [saveSlotsMode, setSaveSlotsMode] = useState<'save' | 'load'>('save');
  const [animationSkipped, setAnimationSkipped] = useState(false);

  const scene = SCENES[state.currentSceneId];

  useEffect(() => {
    setAnimationSkipped(false);
  }, [state.currentSceneId]);

  useEffect(() => {
    if (!scene) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    scene.text.forEach((_, idx) => {
      timers.push(setTimeout(() => playTypewriterClack(), idx * 400));
    });
    return () => timers.forEach(clearTimeout);
  }, [scene?.id]);

  if (!scene) {
    return <div className="p-8 text-destructive font-mono">CRITICAL ERROR: SCENE_NOT_FOUND [{state.currentSceneId}]</div>;
  }

  const handleSkipAnimation = () => {
    setAnimationSkipped(true);
  };

  const handleChoice = (choice: SceneChoice) => {
    if (choice.effects) {
      if (choice.effects.means) {
        if (choice.effects.means > 0) dispatch({ type: 'ADD_MEANS', payload: choice.effects.means });
        else dispatch({ type: 'SUBTRACT_MEANS', payload: Math.abs(choice.effects.means) });
      }
      if (choice.effects.surveillance) {
        dispatch({ type: 'MODIFY_SURVEILLANCE', payload: choice.effects.surveillance });
        if (choice.effects.surveillance > 0) playGeigerTick();
      }
      if (choice.effects.addFlags) choice.effects.addFlags.forEach(f => dispatch({ type: 'SET_FLAG', payload: { flag: f, value: true } }));
      if (choice.effects.removeFlags) choice.effects.removeFlags.forEach(f => dispatch({ type: 'SET_FLAG', payload: { flag: f, value: false } }));
      if (choice.effects.addItems) choice.effects.addItems.forEach(i => dispatch({ type: 'ADD_ITEM', payload: i }));
      if (choice.effects.removeItems) choice.effects.removeItems.forEach(i => dispatch({ type: 'REMOVE_ITEM', payload: i }));
      if (choice.effects.addJournalEntries) choice.effects.addJournalEntries.forEach(e => dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: e }));
    }

    if (choice.skillCheck) {
      setSkillCheckConfig(choice.skillCheck);
    } else if (choice.dieRoll) {
      setDieConfig(choice.dieRoll);
      dispatch({ type: 'SET_ROLLING', payload: true });
    } else if (choice.nextSceneId) {
      goToScene(choice.nextSceneId);
    }
  };

  const goToScene = (sceneId: string) => {
    const nextScene = SCENES[sceneId];
    if (nextScene?.unlocksEnding) {
      dispatch({ type: 'UNLOCK_ENDING', payload: nextScene.unlocksEnding });
    }
    if (nextScene?.autoEffects) {
      if (nextScene.autoEffects.means) {
        if (nextScene.autoEffects.means > 0) dispatch({ type: 'ADD_MEANS', payload: nextScene.autoEffects.means });
        else dispatch({ type: 'SUBTRACT_MEANS', payload: Math.abs(nextScene.autoEffects.means) });
      }
      if (nextScene.autoEffects.surveillance) {
        dispatch({ type: 'MODIFY_SURVEILLANCE', payload: nextScene.autoEffects.surveillance });
        if (nextScene.autoEffects.surveillance > 0) playGeigerTick();
      }
      if (nextScene.autoEffects.addFlags) nextScene.autoEffects.addFlags.forEach(f => dispatch({ type: 'SET_FLAG', payload: { flag: f, value: true } }));
      if (nextScene.autoEffects.addJournalEntries) nextScene.autoEffects.addJournalEntries.forEach(e => dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: e }));
    }
    dispatch({ type: 'SET_SCENE', payload: sceneId });

    if (nextScene?.autoDrawCards) {
      dispatch({ type: 'SET_DRAWING', payload: true });
    }

    if (nextScene?.falloutCards && state.surveillanceLevel > 40) {
      setFalloutPending(true);
    }

    if (nextScene && nextScene.act > scene.act && state.surveillanceLevel > 60 && state.lastActSeen < nextScene.act) {
      setStealthPhaseActive(true);
      dispatch({ type: 'SET_LAST_ACT_SEEN', payload: nextScene.act });
    }
  };

  const handleDieResult = (roll: number) => {
    dispatch({ type: 'SET_ROLLING', payload: false });
    if (dieConfig && dieConfig.outcomes[roll]) {
      goToScene(dieConfig.outcomes[roll]);
    } else if (dieConfig) {
      let fallbackRoll = roll;
      while (fallbackRoll > 0 && !dieConfig.outcomes[fallbackRoll]) fallbackRoll--;
      if (fallbackRoll > 0) goToScene(dieConfig.outcomes[fallbackRoll]);
    }
    setDieConfig(null);
  };

  const handleSkillCheckResult = (success: boolean, partial: boolean) => {
    if (!skillCheckConfig) return;
    setSkillCheckConfig(null);
    if (success) goToScene(skillCheckConfig.successScene);
    else if (partial && skillCheckConfig.partialScene) goToScene(skillCheckConfig.partialScene);
    else goToScene(skillCheckConfig.failureScene);
  };

  const handleStealthResolve = (action: 'burn_item' | 'accept', itemId?: string) => {
    setStealthPhaseActive(false);
    if (action === 'burn_item' && itemId) {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      dispatch({ type: 'MODIFY_SURVEILLANCE', payload: -20 });
    } else {
      dispatch({ type: 'MODIFY_SURVEILLANCE', payload: 15 });
    }
  };

  const availableChoices = scene.choices.filter(choice => {
    if (!choice.condition) return true;
    const { flag, item, missingFlag, missingItem } = choice.condition;
    if (flag && !state.flags[flag]) return false;
    if (missingFlag && state.flags[missingFlag]) return false;
    if (item && !state.inventory.includes(item)) return false;
    if (missingItem && state.inventory.includes(missingItem)) return false;
    return true;
  });

  const activeAllies = Object.entries(state.allies).filter(([, trust]) => trust > 0);

  const getAnimStyle = (idx: number) =>
    animationSkipped
      ? { animationDuration: '0s', animationDelay: '0s' }
      : { animationDelay: `${idx * 0.4}s`, animationDuration: 'var(--text-anim-duration, 1.5s)' };

  return (
    <div className="min-h-screen bg-background flex text-foreground overflow-hidden">
      <div className="noise" />
      <div className="scanline" />

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-40 w-80 bg-card border-r border-border flex flex-col lg:relative lg:translate-x-0"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                <span className="font-mono text-primary font-bold tracking-widest">DOSSIER</span>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-8 font-mono">
                {/* Status */}
                <section>
                  <h4 className="flex items-center gap-2 text-muted-foreground text-xs mb-3 uppercase tracking-wider"><ShieldAlert size={14} /> Current Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Surveillance</span>
                      <span className={state.surveillanceLevel > 70 ? 'text-destructive' : 'text-primary'}>{state.surveillanceLevel}%</span>
                    </div>
                    <div className="w-full bg-border h-1">
                      <div className={`h-full ${state.surveillanceLevel > 70 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${state.surveillanceLevel}%` }} />
                    </div>
                  </div>
                </section>

                {/* Inventory */}
                <section>
                  <h4 className="flex items-center gap-2 text-muted-foreground text-xs mb-3 uppercase tracking-wider"><Pocket size={14} /> Assets</h4>
                  {state.inventory.length === 0 ? (
                    <div className="text-sm text-muted-foreground/50 italic">No assets acquired.</div>
                  ) : (
                    <ul className="space-y-2">
                      {state.inventory.map(id => {
                        const item = STORE_ITEMS.find(i => i.id === id);
                        return (
                          <li key={id} className="text-sm border-l-2 border-primary pl-2 text-foreground/90">
                            {item?.name || id}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>

                {/* Allies */}
                <section>
                  <h4 className="flex items-center gap-2 text-muted-foreground text-xs mb-3 uppercase tracking-wider"><Users size={14} /> Network</h4>
                  <ul className="space-y-3 text-sm">
                    {activeAllies.map(([ally, trust]) => (
                      <li key={ally} className="flex justify-between items-center">
                        <span className="capitalize">{ally}</span>
                        <div className="flex w-16 bg-border h-1 ml-2">
                          <div className="h-full bg-primary/70" style={{ width: `${trust}%` }} />
                        </div>
                      </li>
                    ))}
                    {activeAllies.length === 0 && (
                      <li className="text-muted-foreground/50 italic text-sm">No active contacts.</li>
                    )}
                  </ul>
                </section>

                {/* Field Notes / Journal */}
                <section>
                  <h4 className="flex items-center gap-2 text-muted-foreground text-xs mb-3 uppercase tracking-wider"><BookOpen size={14} /> Field Notes</h4>
                  {state.journal.length === 0 ? (
                    <div className="text-sm text-muted-foreground/50 italic">No intel recorded.</div>
                  ) : (
                    <ul className="space-y-3">
                      {[...state.journal].reverse().map((entry, idx) => (
                        <li key={idx} className="text-xs border-l-2 border-muted pl-2 text-foreground/70 leading-relaxed">{entry}</li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative z-10 w-full">
        {/* Top Bar */}
        <header className="border-b border-border p-4 flex justify-between items-center bg-card/50 backdrop-blur shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-primary transition-colors">
              <Menu size={24} />
            </button>
            <div>
              <h2 className="font-bold text-lg text-primary uppercase tracking-wider hidden sm:block">Marco "Red" Rivera</h2>
              <div className="text-xs text-muted-foreground font-mono">ACT {scene.act} // SCENE {scene.id.replace('scene-', '').toUpperCase()}</div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            <div className="text-lg md:text-xl font-mono text-primary border border-primary/30 px-3 py-1 bg-primary/5 shadow-[0_0_10px_rgba(220,38,38,0.1)]">
              ⊘ {state.means}
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              title="Settings"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        {/* Narrative + Choices */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-4 md:p-8 lg:p-12 w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-6"
              >
                <h3 className="text-xl md:text-2xl font-bold uppercase border-b border-border/50 pb-4 mb-8 text-primary/90 tracking-widest font-mono">
                  // {scene.title}
                </h3>

                <div
                  className="space-y-6 text-base md:text-lg leading-relaxed text-foreground/90 font-serif cursor-pointer"
                  onClick={handleSkipAnimation}
                  title="Click to skip animation"
                >
                  {scene.text.map((paragraph, idx) => (
                    <p key={idx} className="typewriter" style={getAnimStyle(idx)}>
                      {paragraph}
                    </p>
                  ))}
                  {scene.conditionalText?.filter(ct => state.flags[ct.flag]).map((ct, idx) => (
                    <p
                      key={`ct-${idx}`}
                      className="typewriter italic text-foreground/70 border-l-2 border-primary/40 pl-4"
                      style={animationSkipped ? { animationDuration: '0s', animationDelay: '0s' } : { animationDelay: `${(scene.text.length + idx) * 0.4}s`, animationDuration: '2s' }}
                    >
                      {ct.paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Choices */}
            <div className="mt-10 border-t border-border pt-6 grid gap-3">
              {availableChoices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="text-left p-3 md:p-4 border border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden bg-background/50"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                  <span className="font-mono text-primary/60 mr-4 text-sm md:text-base">[{String.fromCharCode(65 + idx)}]</span>
                  <span className="font-sans text-sm md:text-base text-foreground/90 group-hover:text-foreground transition-colors">{choice.text}</span>
                </button>
              ))}
            </div>

            {/* Bottom actions */}
            <div className="mt-6 flex justify-between items-center pt-4 border-t border-border/30 pb-8">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowStore(true)}
                  className="text-xs md:text-sm font-mono uppercase text-primary hover:text-primary-foreground hover:bg-primary border border-primary/30 px-4 py-2 transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.05)] hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                >
                  Access Supply Network
                </button>
                <button
                  onClick={() => { setSaveSlotsMode('save'); setShowSaveSlots(true); }}
                  className="text-xs md:text-sm font-mono uppercase text-muted-foreground hover:text-foreground border border-border/40 px-3 py-2 transition-colors flex items-center gap-1"
                  title="Save game"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
              <button
                onClick={() => setLocation('/')}
                className="text-xs md:text-sm font-mono uppercase text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
              >
                Terminate Link
              </button>
            </div>
          </div>
        </main>
      </div>

      {showStore && <StoreModal onClose={() => setShowStore(false)} />}
      {state.isRolling && <DieRollModal onComplete={handleDieResult} />}
      {state.isDrawingCards && (
        <CardDrawModal
          onComplete={() => dispatch({ type: 'SET_DRAWING', payload: false })}
          count={scene.autoDrawCards || 1}
        />
      )}
      {falloutPending && (
        <CardDrawModal
          onComplete={() => setFalloutPending(false)}
          count={scene.falloutCards || 1}
          title="FALLOUT"
          subtitle="Events beyond your control..."
        />
      )}
      {skillCheckConfig && (
        <SkillCheckModal
          target={skillCheckConfig.target}
          itemBonuses={skillCheckConfig.itemBonuses || {}}
          inventory={state.inventory}
          partialTarget={skillCheckConfig.partialTarget}
          onComplete={handleSkillCheckResult}
        />
      )}
      {stealthPhaseActive && (
        <StealthPhaseModal
          surveillanceLevel={state.surveillanceLevel}
          inventory={state.inventory}
          onResolve={handleStealthResolve}
        />
      )}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showSaveSlots && <SaveSlotsModal onClose={() => setShowSaveSlots(false)} mode={saveSlotsMode} />}
    </div>
  );
}
