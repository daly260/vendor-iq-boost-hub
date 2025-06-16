
import React from 'react';
import { Trophy, Star } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface LevelProgressProps {
  currentLevel: number;
  currentPoints: number;
  nextLevelPoints: number;
  className?: string;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  currentPoints,
  nextLevelPoints,
  className = ''
}) => {
  const pointsToNextLevel = nextLevelPoints - currentPoints;
  const progressPercentage = (currentPoints / nextLevelPoints) * 100;

  return (
    <div className={`bg-gradient-wamia p-4 rounded-xl text-white ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <span className="font-bold text-lg font-title">Niveau {currentLevel}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4" />
          <span className="text-sm font-body">{currentPoints.toLocaleString()} pts</span>
        </div>
      </div>
      
      <ProgressBar 
        progress={progressPercentage}
        showPercentage={false}
        color="blue"
        className="mb-2"
      />
      
      <div className="flex justify-between items-center text-sm font-body">
        <span>{pointsToNextLevel.toLocaleString()} pts jusqu'au niveau {currentLevel + 1}</span>
        <span className="opacity-90">{Math.round(progressPercentage)}%</span>
      </div>
    </div>
  );
};

export default LevelProgress;
