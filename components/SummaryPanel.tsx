import React from 'react';
import { useStore } from '../store/gameStore';

interface SummaryPanelProps {
  onPlayAgain: () => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ onPlayAgain }) => {
  const session = useStore(state => state.session);

  if (!session || !session.finishedAt) return null;

  const timeTaken = ((session.finishedAt - session.startedAt) / 1000).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-[var(--color-background)] text-[var(--color-text-main)] p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-4xl font-bold mb-4">Puzzle Complete!</h2>
        <div className="grid grid-cols-2 gap-4 text-lg mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm opacity-80">Time</div>
                <div className="text-2xl font-semibold">{timeTaken}s</div>
            </div>
             <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm opacity-80">Errors</div>
                <div className="text-2xl font-semibold">{session.errors}</div>
            </div>
             <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm opacity-80">Hints Used</div>
                <div className="text-2xl font-semibold">{session.hints}</div>
            </div>
             <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-sm opacity-80">Score</div>
                <div className="text-2xl font-semibold">--</div>
            </div>
        </div>
        <button 
            onClick={onPlayAgain}
            className="w-full py-3 text-xl font-bold text-white bg-green-500 rounded-lg shadow-md transition-colors hover:bg-green-600"
        >
            Play Again
        </button>
      </div>
    </div>
  );
};

export default SummaryPanel;