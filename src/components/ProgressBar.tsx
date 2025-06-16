
import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: 'wamia' | 'orange' | 'green' | 'blue' | 'teal';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = true, 
  animated = true,
  color = 'wamia'
}) => {
  const colorClasses = {
    wamia: 'bg-wamia-orange',
    orange: 'bg-wamia-orange',
    green: 'bg-wamia-teal',
    blue: 'bg-wamia-blue',
    teal: 'bg-wamia-teal'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm font-medium font-body text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full ${colorClasses[color]} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
