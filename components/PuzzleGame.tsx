
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus } from '../types';

interface PuzzleGameProps {
  size: number;
  onSolve: () => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ size, onSolve }) => {
  const totalTiles = size * size;
  const emptyValue = totalTiles - 1;

  const [tiles, setTiles] = useState<number[]>(Array.from({ length: totalTiles }, (_, i) => i));
  const [status, setStatus] = useState<GameStatus>('idle');
  const [showHint, setShowHint] = useState(false);

  const allIcons = [
    '🌟', '👑', '👶', '🐫', '🛖', '🎁', '👼', '🐏', 
    '🕯️', '🔔', '🍪', '🫏', '🐄', '🧤', '❄️'
  ];
  
  const currentIcons = allIcons.slice(0, totalTiles - 1);

  const shuffle = useCallback(() => {
    let newTiles = Array.from({ length: totalTiles }, (_, i) => i);
    const moves = size === 2 ? 30 : size === 3 ? 120 : 250;
    
    for (let i = 0; i < moves; i++) {
      const emptyIdx = newTiles.indexOf(emptyValue);
      const possibleMoves = [];
      const row = Math.floor(emptyIdx / size);
      const col = emptyIdx % size;

      if (row > 0) possibleMoves.push(emptyIdx - size);
      if (row < size - 1) possibleMoves.push(emptyIdx + size);
      if (col > 0) possibleMoves.push(emptyIdx - 1);
      if (col < size - 1) possibleMoves.push(emptyIdx + 1);

      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [newTiles[emptyIdx], newTiles[move]] = [newTiles[move], newTiles[emptyIdx]];
    }
    setTiles(newTiles);
    setStatus('playing');
    setShowHint(false);
  }, [totalTiles, emptyValue, size]);

  useEffect(() => {
    shuffle();
  }, [shuffle]);

  const handleTileClick = (index: number) => {
    if (status !== 'playing') return;

    const emptyIdx = tiles.indexOf(emptyValue);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIdx / size);
    const emptyCol = emptyIdx % size;

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);

      if (newTiles.every((t, i) => t === i)) {
        setStatus('solved');
        setTimeout(onSolve, 800);
      }
    }
  };

  const getTileContent = (val: number) => {
    if (val === emptyValue) return null;
    return currentIcons[val];
  };

  const gridColsClass = size === 2 ? 'grid-cols-2' : size === 3 ? 'grid-cols-3' : 'grid-cols-4';
  const tileSizeClass = size === 4 ? 'w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl' : 
                        size === 3 ? 'w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl' : 
                        'w-24 h-24 md:w-32 md:h-32 text-4xl md:text-5xl';

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className={`grid ${gridColsClass} gap-2 bg-red-800 p-3 rounded-xl shadow-2xl border-4 border-yellow-500`}>
          {tiles.map((tile, idx) => (
            <div
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`
                ${tileSizeClass} flex items-center justify-center rounded-lg cursor-pointer puzzle-tile relative
                ${tile === emptyValue ? 'bg-transparent' : 'bg-white shadow-inner hover:bg-yellow-50 active:scale-95'}
                ${status === 'solved' ? 'border-2 border-green-500 bg-green-50' : ''}
              `}
            >
              {getTileContent(tile)}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="text-red-700 font-bold text-xs bg-yellow-100 px-4 py-2 rounded-full hover:bg-yellow-200 transition border border-yellow-300 shadow-sm"
          >
            <i className="fas fa-lightbulb mr-1"></i> {showHint ? "..." : "?"}
          </button>
          
          {showHint && (
            <div className="animate-in fade-in zoom-in duration-300 bg-white/80 p-3 rounded-lg border border-yellow-200 flex flex-wrap justify-center gap-1 max-w-[250px] shadow-lg">
              {currentIcons.map((icon, i) => (
                <span key={i} className="text-lg">{icon}</span>
              ))}
              <span className="text-lg opacity-20">⬜</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;
