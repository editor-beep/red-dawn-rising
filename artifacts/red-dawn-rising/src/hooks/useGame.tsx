import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, ActionType, gameReducer, initialState } from '../types';
import { SCENES } from '../data/gameData';

type SaveSlotMeta = {
  name: string;
  savedAt: string;
  sceneTitle: string;
  act: number | null;
  means: number;
  followers: number;
  surveillanceLevel: number;
};

const SAVE_VERSION = 2;

function migrateState(raw: unknown): GameState {
  const parsed = (raw || {}) as Partial<GameState> & { saveVersion?: number };
  const version = parsed.saveVersion ?? 1;

  if (version >= SAVE_VERSION) {
    return {
      ...initialState,
      ...parsed,
      unlockedEndings: parsed.unlockedEndings ?? [],
      journal: parsed.journal ?? [],
      lastActSeen: parsed.lastActSeen ?? 1,
      nextDieRollModifier: parsed.nextDieRollModifier ?? 0,
      protectedScenesRemaining: parsed.protectedScenesRemaining ?? 0,
      redDawnActive: parsed.redDawnActive ?? false,
      combatBonus: parsed.combatBonus ?? 0,
      saveVersion: SAVE_VERSION,
    };
  }

  return {
    ...initialState,
    ...parsed,
    unlockedEndings: parsed.unlockedEndings ?? [],
    journal: parsed.journal ?? [],
    lastActSeen: parsed.lastActSeen ?? 1,
    nextDieRollModifier: parsed.nextDieRollModifier ?? 0,
    protectedScenesRemaining: parsed.protectedScenesRemaining ?? 0,
    redDawnActive: parsed.redDawnActive ?? false,
    combatBonus: parsed.combatBonus ?? 0,
    saveVersion: SAVE_VERSION,
  };
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<ActionType>;
  saveToSlot: (name: string) => void;
  loadFromSlot: (name: string) => void;
  deleteSlot: (name: string) => void;
  listSlots: () => SaveSlotMeta[];
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem('red-dawn-save');
      if (saved) {
        return migrateState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load save", e);
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('red-dawn-save', JSON.stringify(state));
  }, [state]);

  const saveToSlot = (name: string) => {
    try {
      const slots = JSON.parse(localStorage.getItem('red-dawn-slots') || '{}');
      slots[name] = { ...state, saveVersion: SAVE_VERSION, _savedAt: new Date().toISOString() };
      localStorage.setItem('red-dawn-slots', JSON.stringify(slots));
    } catch {}
  };

  const loadFromSlot = (name: string) => {
    try {
      const slots = JSON.parse(localStorage.getItem('red-dawn-slots') || '{}');
      if (slots[name]) {
        dispatch({ type: 'LOAD_STATE', payload: migrateState(slots[name]) });
      }
    } catch {}
  };

  const deleteSlot = (name: string) => {
    try {
      const slots = JSON.parse(localStorage.getItem('red-dawn-slots') || '{}');
      delete slots[name];
      localStorage.setItem('red-dawn-slots', JSON.stringify(slots));
    } catch {}
  };

  const listSlots = (): SaveSlotMeta[] => {
    try {
      const slots = JSON.parse(localStorage.getItem('red-dawn-slots') || '{}');
      return Object.entries(slots).map(([name, data]: [string, unknown]) => {
        const slot = migrateState(data) as GameState & { _savedAt?: string };
        const scene = SCENES[slot.currentSceneId];
        return {
          name,
          savedAt: slot._savedAt || '',
          sceneTitle: scene?.title || slot.currentSceneId || 'Unknown Scene',
          act: scene?.act ?? null,
          means: slot.means ?? 0,
          followers: slot.followers ?? 0,
          surveillanceLevel: slot.surveillanceLevel ?? 0,
        };
      });
    } catch { return []; }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, saveToSlot, loadFromSlot, deleteSlot, listSlots }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
