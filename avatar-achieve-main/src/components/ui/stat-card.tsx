import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'card-rpg',
    primary: 'card-rpg border-primary/50 shadow-primary',
    secondary: 'card-rpg border-secondary/50 shadow-[0_4px_20px_hsl(var(--secondary)/0.4)]',
    accent: 'card-rpg border-accent/50 shadow-accent',
  };

  return (
    <Card className={cn(variantStyles[variant], 'group hover:scale-105 transition-all duration-300', className)}>
      <CardContent className="p-4 text-center">
        <div className="mb-2 flex justify-center text-2xl group-hover:animate-glow-pulse">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-card-foreground mb-1">{title}</h3>
        <p className="text-3xl font-black gradient-text">{value}</p>
      </CardContent>
    </Card>
  );
};