import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-accent rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-1 h-1 bg-secondary rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-10 w-2 h-2 bg-primary-glow rounded-full animate-float opacity-30" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-10 right-1/3 w-3 h-3 bg-accent-glow rounded-full animate-float opacity-40" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-glow-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-3/4 left-1/3 w-20 h-20 bg-secondary/10 rounded-full blur-xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};