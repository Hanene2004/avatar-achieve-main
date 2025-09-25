import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Sword, Brain, Heart, Zap, Users, Star } from 'lucide-react';
import defaultAvatar from '@/assets/default-avatar.png';

interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  strength: number;
  intelligence: number;
  endurance: number;
  charisma: number;
  luck: number;
}

interface CharacterProfileProps {
  playerName: string;
  stats: PlayerStats;
  className?: string;
}

export const CharacterProfile: React.FC<CharacterProfileProps> = ({
  playerName,
  stats,
  className,
}) => {
  return (
    <div className={className}>
      {/* Profil principal */}
      <Card className="card-rpg mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text text-center">
            Profil Aventurier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar et info de base */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={defaultAvatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-primary glow-primary"
              />
              <Badge 
                className="absolute -bottom-2 -right-2 bg-gradient-reward text-background font-bold"
              >
                Niv. {stats.level}
              </Badge>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                {playerName}
              </h2>
              <ProgressBar
                value={stats.xp}
                max={stats.xpToNextLevel}
                variant="xp"
                label="Expérience"
                animated
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="card-rpg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-card-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Force"
              value={stats.strength}
              icon={<Sword className="w-6 h-6 text-destructive" />}
              variant="default"
            />
            <StatCard
              title="Intelligence"
              value={stats.intelligence}
              icon={<Brain className="w-6 h-6 text-primary" />}
              variant="primary"
            />
            <StatCard
              title="Endurance"
              value={stats.endurance}
              icon={<Heart className="w-6 h-6 text-rpg-stamina" />}
              variant="default"
            />
            <StatCard
              title="Charisme"
              value={stats.charisma}
              icon={<Users className="w-6 h-6 text-secondary" />}
              variant="secondary"
            />
            <StatCard
              title="Chance"
              value={stats.luck}
              icon={<Zap className="w-6 h-6 text-accent" />}
              variant="accent"
            />
            <StatCard
              title="Niveau"
              value={stats.level}
              icon={<Star className="w-6 h-6 text-accent" />}
              variant="accent"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};