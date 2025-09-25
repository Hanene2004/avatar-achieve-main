import React, { useState, useEffect } from 'react';
import { CharacterProfile } from '@/components/character-profile';
import { QuestBoard } from '@/components/quest-board';
import { XPNotification } from '@/components/xp-notification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Settings, Trophy, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useQuests } from '@/hooks/useQuests';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, gainXP } = useProfile();
  const { completeQuest, isQuestCompleted } = useQuests();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [xpNotification, setXpNotification] = useState({
    show: false,
    xpGained: 0,
    levelUp: false,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !profileLoading) {
      navigate('/auth');
    }
  }, [user, profileLoading, navigate]);

  // Show loading state while checking auth
  if (profileLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-rpg flex items-center justify-center">
        <Card className="card-rpg p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de votre aventure...</p>
        </Card>
      </div>
    );
  }

  const handleQuestComplete = async (questId: string, xpGained: number) => {
    try {
      // Check if quest is already completed
      if (isQuestCompleted(questId)) {
        toast({
          title: "Quête déjà terminée",
          description: "Vous avez déjà complété cette quête aujourd'hui !",
          variant: "destructive",
        });
        return;
      }

      // Mark quest as completed
      await completeQuest(questId);
      
      // Gain XP and check for level up
      const result = await gainXP(xpGained);
      
      setXpNotification({
        show: true,
        xpGained,
        levelUp: result?.leveledUp || false,
      });
    } catch (error) {
      console.error('Error completing quest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer la quête",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleNotificationEnd = () => {
    setXpNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête héroïque */}
      <div className="bg-gradient-hero py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-background mb-2 flex items-center gap-3">
                <Gamepad2 className="w-10 h-10" />
                LifeRPG
              </h1>
              <p className="text-background/90 text-lg">
                Transformez votre vie en aventure épique !
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-background/10 border-background/30 text-background hover:bg-background/20">
                <Trophy className="w-4 h-4 mr-2" />
                Classements
              </Button>
              <Button variant="outline" size="sm" className="bg-background/10 border-background/30 text-background hover:bg-background/20">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-background/10 border-background/30 text-background hover:bg-background/20"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil du personnage */}
          <div className="lg:col-span-1">
            <CharacterProfile 
              playerName={profile.player_name}
              stats={{
                level: profile.level,
                xp: profile.xp,
                xpToNextLevel: profile.xp_to_next_level,
                strength: profile.strength,
                intelligence: profile.intelligence,
                endurance: profile.endurance,
                charisma: profile.charisma,
                luck: profile.luck,
              }}
            />
          </div>

          {/* Tableau des quêtes */}
          <div className="lg:col-span-2">
            <QuestBoard 
              onQuestComplete={handleQuestComplete}
              isQuestCompleted={isQuestCompleted}
            />
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-rpg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-card-foreground">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">+85 XP</div>
              <p className="text-sm text-muted-foreground">3 quêtes terminées</p>
            </CardContent>
          </Card>

          <Card className="card-rpg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-card-foreground">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">+340 XP</div>
              <p className="text-sm text-muted-foreground">12 quêtes terminées</p>
            </CardContent>
          </Card>

          <Card className="card-rpg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-card-foreground">Série actuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">5 jours</div>
              <p className="text-sm text-muted-foreground">Continue comme ça !</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification XP */}
      <XPNotification
        xpGained={xpNotification.xpGained}
        show={xpNotification.show}
        levelUp={xpNotification.levelUp}
        onAnimationEnd={handleNotificationEnd}
      />
    </div>
  );
};

export default Index;
