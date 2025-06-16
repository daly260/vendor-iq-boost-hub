
import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = true, 
  animated = true,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-vibrant-blue',
    green: 'bg-vibrant-green',
    purple: 'bg-vibrant-purple',
    orange: 'bg-vibrant-orange',
    pink: 'bg-vibrant-pink'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${colorClasses[color]} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
