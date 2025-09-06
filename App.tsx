import React from 'react';
import { useStore } from './store/gameStore';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import SummaryPanel from './components/SummaryPanel';
import ThemeManager from './components/ThemeManager';
import { DEFAULTS } from './constants';

function App() {
  const gameState = useStore((state) => state.gameState);
  const loadNewGame = useStore((state) => state.loadNewGame);

  const handleStart = () => {
    loadNewGame({ ...DEFAULTS, seed: Date.now().toString() });
  };

  const renderGameState = () => {
    switch(gameState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'loading':
        return (
          <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-2xl font-semibold animate-pulse">Loading Puzzle...</h1>
          </div>
        );
      case 'playing':
        return <GameScreen />;
      case 'finished':
        return <SummaryPanel onPlayAgain={handleStart} />;
      case 'error':
          return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800">
              <h1 className="text-2xl font-semibold mb-4">Error</h1>
              <p>Failed to generate the puzzle. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Refresh
              </button>
            </div>
          );
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <>
      <ThemeManager />
      <main className="w-screen h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-text-main)] transition-colors duration-300">
        {renderGameState()}
      </main>
    </>
  );
}

export default App;