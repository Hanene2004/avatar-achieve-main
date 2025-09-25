import React from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';

interface RPGLogoProps {
  className?: string;
}

export const RPGLogo: React.FC<RPGLogoProps> = ({ className }) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="relative inline-block">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-accent animate-glow-pulse" />
          <Gamepad2 className="w-12 h-12 text-primary animate-float" />
          <Sparkles className="w-8 h-8 text-accent animate-glow-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-glow-pulse"></div>
      </div>
      <div>
        <h1 className="text-4xl font-black gradient-text">LifeRPG</h1>
        <p className="text-muted-foreground mt-2">Transformez votre vie en aventure épique</p>
      </div>
    </div>
  );
};