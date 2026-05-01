
import React from 'react';
import { Play, Square } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, togglePlay }) => {
  return (
    <button
      onClick={togglePlay}
      className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-stone-700 bg-transparent transition-all duration-500 focus:outline-none"
      aria-label={isPlaying ? "Стопирај" : "Слушај во живо"}
    >
      <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse opacity-20 transition-opacity duration-500"></div>
      {isPlaying ? (
        <Square className="w-8 h-8 text-white fill-current" />
      ) : (
        <Play className="w-8 h-8 text-white fill-current ml-1" />
      )}
    </button>
  );
};

export default PlayerControls;
