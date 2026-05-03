import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, ActionType, gameReducer, initialState } from '../types';

type SaveSlotMeta = { name: string; savedAt: string; sceneTitle: string };

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
        const parsed = JSON.parse(saved);
        return {
          ...initial,
          ...parsed,
          unlockedEndings: parsed.unlockedEndings ?? [],
          journal: parsed.journal ?? [],
          lastActSeen: parsed.lastActSeen ?? 1,
        };
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
      slots[name] = { ...state, _savedAt: new Date().toISOString() };
      localStorage.setItem('red-dawn-slots', JSON.stringify(slots));
    } catch {}
  };

  const loadFromSlot = (name: string) => {
    try {
      const slots = JSON.parse(localStorage.getItem('red-dawn-slots') || '{}');
      if (slots[name]) {
        dispatch({ type: 'LOAD_STATE', payload: slots[name] });
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
      return Object.entries(slots).map(([name, data]: [string, any]) => ({
        name,
        savedAt: data._savedAt || '',
        sceneTitle: data.currentSceneId || '',
      }));
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
