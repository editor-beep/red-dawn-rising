export type Item = {
  id: string;
  name: string;
  cost: number;
  description: string;
};

export type Card = {
  id: string;
  name: string;
  effectDescription: string;
};

export type Flags = Record<string, boolean>;
export type Allies = Record<string, number>;

export type GameState = {
  currentSceneId: string;
  means: number;
  surveillanceLevel: number;
  inventory: string[];
  flags: Flags;
  allies: Allies;
  history: string[];
  cardsDrawn: string[];
  isRolling: boolean;
  isDrawingCards: boolean;
};

export type ActionType = 
  | { type: 'SET_SCENE'; payload: string }
  | { type: 'ADD_MEANS'; payload: number }
  | { type: 'SUBTRACT_MEANS'; payload: number }
  | { type: 'ADD_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_FLAG'; payload: { flag: string; value: boolean } }
  | { type: 'MODIFY_ALLY_TRUST'; payload: { ally: string; amount: number } }
  | { type: 'MODIFY_SURVEILLANCE'; payload: number }
  | { type: 'ADD_DRAWN_CARD'; payload: string }
  | { type: 'SET_ROLLING'; payload: boolean }
  | { type: 'SET_DRAWING'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'RESET' };

export const initialState: GameState = {
  currentSceneId: 'scene-1',
  means: 0,
  surveillanceLevel: 10,
  inventory: [],
  flags: {},
  allies: {
    elena: 50,
    darius: 50,
    mike: 0,
    fatima: 0,
    ghost: 50,
    alex: 0
  },
  history: [],
  cardsDrawn: [],
  isRolling: false,
  isDrawingCards: false,
};

export function gameReducer(state: GameState, action: ActionType): GameState {
  switch (action.type) {
    case 'SET_SCENE':
      return { ...state, currentSceneId: action.payload, history: [...state.history, state.currentSceneId] };
    case 'ADD_MEANS':
      return { ...state, means: state.means + action.payload };
    case 'SUBTRACT_MEANS':
      return { ...state, means: Math.max(0, state.means - action.payload) };
    case 'ADD_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, inventory: state.inventory.filter(i => i !== action.payload) };
    case 'SET_FLAG':
      return { ...state, flags: { ...state.flags, [action.payload.flag]: action.payload.value } };
    case 'MODIFY_ALLY_TRUST':
      return { 
        ...state, 
        allies: { 
          ...state.allies, 
          [action.payload.ally]: Math.max(0, Math.min(100, (state.allies[action.payload.ally] || 0) + action.payload.amount))
        } 
      };
    case 'MODIFY_SURVEILLANCE':
      return { ...state, surveillanceLevel: Math.max(0, Math.min(100, state.surveillanceLevel + action.payload)) };
    case 'ADD_DRAWN_CARD':
      return { ...state, cardsDrawn: [...state.cardsDrawn, action.payload] };
    case 'SET_ROLLING':
      return { ...state, isRolling: action.payload };
    case 'SET_DRAWING':
      return { ...state, isDrawingCards: action.payload };
    case 'LOAD_STATE':
      return action.payload;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
