import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Puzzle, Session, GameState, PuzzleGenerationParams } from '../types';
import { generatePuzzle } from '../services/puzzleGenerator';

interface ThemeState {
  id: string;
  highContrast: boolean;
  fontSizeScale: number;
}

interface UnlockedState {
  undersea: boolean;
  jungle: boolean;
}

interface TimerState {
  intervalId: ReturnType<typeof setInterval> | null;
  ms: number;
}

interface GameStore {
  puzzle: Puzzle | null;
  session: Session | null;
  gameState: GameState;
  theme: ThemeState;
  unlocked: UnlockedState;
  timer: TimerState;

  loadNewGame: (params: PuzzleGenerationParams) => void;
  makeGuess: (payload: { success: boolean, nextNodeId: string }) => void;
  showHint: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  setTheme: (id: string) => void;
  toggleHighContrast: () => void;
  setFontSizeScale: (scale: number) => void;
  unlockTheme: (id: keyof UnlockedState) => void;
}

export const useStore = create<GameStore>()(subscribeWithSelector((set, get) => ({
  puzzle: null,
  session: null,
  gameState: 'start',
  theme: { id: 'classic', highContrast: false, fontSizeScale: 1.0 },
  unlocked: { undersea: true, jungle: true },
  timer: { intervalId: null, ms: 0 },

  loadNewGame: (params) => {
    set({ gameState: 'loading' });
    // Use a timeout to allow the loading screen to render before the potentially blocking generation starts.
    setTimeout(() => {
        try {
            const puzzle = generatePuzzle(params);
            if (puzzle) {
                const session: Session = {
                puzzleId: puzzle.id,
                startedAt: Date.now(),
                finishedAt: null,
                ms: 0,
                errors: 0,
                hints: 0,
                path: [puzzle.order[0]],
                };
                set({ puzzle, session, gameState: 'playing', timer: { intervalId: null, ms: 0 } });
                get().startTimer();
            } else {
                set({ gameState: 'error' });
            }
        } catch (error) {
            console.error("Failed to load new game:", error);
            set({ gameState: 'error' });
        }
    }, 50);
  },

  makeGuess: ({ success, nextNodeId }) => {
    set((state) => {
      if (!state.puzzle || !state.session) {
        return {}; // No state change if game is not ready
      }

      if (success) {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        const newPath = [...state.session.path, nextNodeId];
        const isFinished = newPath.length === state.puzzle.order.length;

        if (isFinished) {
          if (state.timer.intervalId) {
            clearInterval(state.timer.intervalId);
          }
          return {
            gameState: 'finished',
            session: { ...state.session, path: newPath, finishedAt: Date.now() },
            timer: { ...state.timer, intervalId: null },
          };
        }
        return {
          session: { ...state.session, path: newPath },
        };
      } else {
        return {
          session: { ...state.session, errors: state.session.errors + 1 },
        };
      }
    });
  },

  showHint: () => set(state => ({
    session: state.session ? { ...state.session, hints: state.session.hints + 1 } : null
  })),
  
  startTimer: () => {
    get().stopTimer();
    const intervalId = setInterval(() => {
        const startedAt = get().session?.startedAt;
        if (startedAt) {
            set(state => ({ timer: { ...state.timer, ms: Date.now() - startedAt }}));
        }
    }, 100);
    set(state => ({ timer: { ...state.timer, intervalId }}));
  },
  
  stopTimer: () => {
    const { intervalId } = get().timer;
    if(intervalId) {
      clearInterval(intervalId);
      set(state => ({ timer: { ...state.timer, intervalId: null } }));
    }
  },

  setTheme: (id) => set(state => ({ theme: { ...state.theme, id } })),
  toggleHighContrast: () => set(state => ({ theme: { ...state.theme, highContrast: !state.theme.highContrast } })),
  setFontSizeScale: (scale) => set(state => ({ theme: { ...state.theme, fontSizeScale: scale } })),
  unlockTheme: (id) => set(state => ({ unlocked: { ...state.unlocked, [id]: true } })),
})));