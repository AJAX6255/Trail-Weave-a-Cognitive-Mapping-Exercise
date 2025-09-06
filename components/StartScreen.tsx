
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-blue-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-2 text-blue-800 tracking-tight">Trail Weave</h1>
        <p className="text-xl text-blue-600 mb-8">Connect the dots in sequence. It's not as easy as it looks.</p>
        <button 
          onClick={onStart}
          className="py-4 px-10 text-2xl font-bold text-white bg-green-500 rounded-lg shadow-lg transform transition-all hover:bg-green-600 hover:scale-105 active:scale-100"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
