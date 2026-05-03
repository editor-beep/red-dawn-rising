import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, ActionType, gameReducer, initialState } from '../types';

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<ActionType>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem('red-dawn-save');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load save", e);
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('red-dawn-save', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
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
