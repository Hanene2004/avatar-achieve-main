import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Zap } from 'lucide-react';

interface QuestCardProps {
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: 'Sport' | 'Étude' | 'Créativité' | 'Social';
  completed: boolean;
  onComplete: () => void;
  className?: string;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  xpReward,
  difficulty,
  category,
  completed,
  onComplete,
  className,
}) => {
  const difficultyColors = {
    Facile: 'bg-success text-success-foreground',
    Moyen: 'bg-warning text-warning-foreground',
    Difficile: 'bg-destructive text-destructive-foreground',
  };

  const categoryColors = {
    Sport: 'bg-rpg-stamina text-background',
    Étude: 'bg-primary text-primary-foreground',
    Créativité: 'bg-secondary text-secondary-foreground',
    Social: 'bg-accent text-accent-foreground',
  };

  return (
    <Card className={cn(
      'card-rpg hover:shadow-primary transition-all duration-300',
      completed && 'opacity-60 bg-success/10 border-success/30',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-2">
            {completed && <CheckCircle className="w-5 h-5 text-success" />}
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={categoryColors[category]}>{category}</Badge>
            <Badge className={difficultyColors[difficulty]}>{difficulty}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-semibold text-accent">+{xpReward} XP</span>
          </div>
          
          {!completed ? (
            <Button 
              onClick={onComplete}
              variant="default"
              className="bg-gradient-primary hover:shadow-primary transition-all duration-300"
            >
              <Clock className="w-4 h-4 mr-2" />
              Terminer
            </Button>
          ) : (
            <Badge variant="outline" className="border-success text-success">
              <CheckCircle className="w-4 h-4 mr-1" />
              Terminé
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};