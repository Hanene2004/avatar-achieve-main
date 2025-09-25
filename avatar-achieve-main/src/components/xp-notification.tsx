import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Star } from 'lucide-react';

interface XPNotificationProps {
  xpGained: number;
  show: boolean;
  onAnimationEnd: () => void;
  levelUp?: boolean;
}

export const XPNotification: React.FC<XPNotificationProps> = ({
  xpGained,
  show,
  onAnimationEnd,
  levelUp = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onAnimationEnd, 300);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onAnimationEnd]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div
        className={cn(
          'bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg shadow-primary font-bold text-lg flex items-center gap-2 transform transition-all duration-300',
          isVisible 
            ? 'animate-level-up scale-100 opacity-100' 
            : 'scale-0 opacity-0',
          levelUp && 'animate-glow-pulse'
        )}
      >
        {levelUp ? (
          <>
            <Star className="w-6 h-6 text-accent animate-spin" />
            NIVEAU SUPÉRIEUR !
            <Star className="w-6 h-6 text-accent animate-spin" />
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 text-accent" />
            +{xpGained} XP
            <Zap className="w-5 h-5 text-accent" />
          </>
        )}
      </div>
    </div>
  );
};