import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestCard } from '@/components/ui/quest-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Calendar, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: 'Sport' | 'Étude' | 'Créativité' | 'Social';
  type: 'daily' | 'weekly';
  completed: boolean;
}

interface QuestBoardProps {
  onQuestComplete: (questId: string, xpGained: number) => void;
  isQuestCompleted?: (questId: string) => boolean;
  className?: string;
}

export const QuestBoard: React.FC<QuestBoardProps> = ({
  onQuestComplete,
  isQuestCompleted = () => false,
  className,
}) => {
  const { toast } = useToast();
  
  const [quests, setQuests] = useState<Quest[]>([
    // Quêtes quotidiennes
    {
      id: 'daily-1',
      title: 'Session de lecture',
      description: 'Lire 20 pages d\'un livre ou article',
      xpReward: 25,
      difficulty: 'Facile',
      category: 'Étude',
      type: 'daily',
      completed: false,
    },
    {
      id: 'daily-2',
      title: 'Exercice physique',
      description: 'Faire 30 minutes d\'activité physique',
      xpReward: 30,
      difficulty: 'Moyen',
      category: 'Sport',
      type: 'daily',
      completed: false,
    },
    {
      id: 'daily-3',
      title: 'Création artistique',
      description: 'Dessiner, écrire ou créer quelque chose pendant 15 min',
      xpReward: 20,
      difficulty: 'Facile',
      category: 'Créativité',
      type: 'daily',
      completed: false,
    },
    {
      id: 'daily-4',
      title: 'Connexion sociale',
      description: 'Appeler un ami ou rencontrer quelqu\'un',
      xpReward: 15,
      difficulty: 'Facile',
      category: 'Social',
      type: 'daily',
      completed: false,
    },
    
    // Quêtes hebdomadaires
    {
      id: 'weekly-1',
      title: 'Maîtrise d\'une compétence',
      description: 'Terminer un tutoriel complet ou apprendre une nouvelle notion',
      xpReward: 100,
      difficulty: 'Difficile',
      category: 'Étude',
      type: 'weekly',
      completed: false,
    },
    {
      id: 'weekly-2',
      title: 'Projet créatif',
      description: 'Finaliser un projet personnel (code, art, musique...)',
      xpReward: 150,
      difficulty: 'Difficile',
      category: 'Créativité',
      type: 'weekly',
      completed: false,
    },
    {
      id: 'weekly-3',
      title: 'Défi sportif',
      description: 'Réaliser 5 séances de sport dans la semaine',
      xpReward: 120,
      difficulty: 'Moyen',
      category: 'Sport',
      type: 'weekly',
      completed: false,
    },
  ]);

  const handleQuestComplete = (questId: string) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        onQuestComplete(questId, quest.xpReward);
        
        toast({
          title: "Quête terminée ! 🎉",
          description: `+${quest.xpReward} XP pour "${quest.title}"`,
          duration: 3000,
        });
        
        return { ...quest, completed: true };
      }
      return quest;
    }));
  };

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');
  
  const dailyCompleted = dailyQuests.filter(q => q.completed).length;
  const weeklyCompleted = weeklyQuests.filter(q => q.completed).length;

  return (
    <Card className={`card-rpg ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
          <ScrollText className="w-6 h-6" />
          Tableau des Quêtes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Quotidiennes
              <Badge variant="outline">{dailyCompleted}/{dailyQuests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Hebdomadaires
              <Badge variant="outline">{weeklyCompleted}/{weeklyQuests.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            {dailyQuests.map(quest => (
                <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                xpReward={quest.xpReward}
                difficulty={quest.difficulty}
                category={quest.category}
                completed={isQuestCompleted(quest.id)}
                onComplete={() => handleQuestComplete(quest.id)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            {weeklyQuests.map(quest => (
                <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                xpReward={quest.xpReward}
                difficulty={quest.difficulty}
                category={quest.category}
                completed={isQuestCompleted(quest.id)}
                onComplete={() => handleQuestComplete(quest.id)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};