
import React from 'react';
import { Trophy, Star } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface LevelProgressProps {
  currentLevel: number;
  currentPoints: number;
  className?: string;
}

const basePoints = 500;
const growth = 1.2;

function totalPointsForLevel(level: number, basePoints = 500, growth = 1.2) {
  if (level <= 1) return 0;
  return Math.round(basePoints * (1 - Math.pow(growth, level - 1)) / (1 - growth));
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  currentPoints,
  className = ''
}) => {
  // Calculate cumulative points needed for current and next level
  const currentLevelPoints = totalPointsForLevel(currentLevel, basePoints, growth);
  const nextLevelPoints = totalPointsForLevel(currentLevel + 1, basePoints, growth);
  const pointsToNextLevel = nextLevelPoints - currentPoints;
  const progressPercentage = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className={`bg-wamia-orange p-4 rounded-xl text-white ${className}`}>
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
