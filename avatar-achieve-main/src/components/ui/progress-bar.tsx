import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'xp' | 'health' | 'mana' | 'stamina';
  label?: string;
  showNumbers?: boolean;
  className?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  variant = 'xp',
  label,
  showNumbers = true,
  className,
  animated = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variantStyles = {
    xp: 'bg-rpg-xp',
    health: 'bg-rpg-health',
    mana: 'bg-rpg-mana',
    stamina: 'bg-rpg-stamina',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showNumbers) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium text-card-foreground">{label}</span>}
          {showNumbers && (
            <span className="text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden border border-border/50">
        <div
          className={cn(
            'h-full transition-all duration-700 ease-out rounded-full',
            variantStyles[variant],
            animated && 'animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};