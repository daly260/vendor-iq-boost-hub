
import React from 'react';
import { Badge as BadgeType } from '@/types';

interface BadgeDisplayProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  unlocked?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badge, 
  size = 'md', 
  showTooltip = true,
  unlocked = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <div 
      className={`relative group ${unlocked ? 'animate-bounce-in' : 'opacity-50 grayscale'}`}
      title={showTooltip ? badge.description : undefined}
    >
      <div className={`${sizeClasses[size]} rounded-full ${badge.color} bg-white dark:bg-gray-800 border-2 border-current flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 ${unlocked ? 'animate-pulse-glow' : ''}`}>
        <span className={unlocked ? 'animate-wiggle' : ''}>{badge.icon}</span>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          <div className="font-semibold">{badge.name}</div>
          <div className="text-gray-300">{badge.description}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
