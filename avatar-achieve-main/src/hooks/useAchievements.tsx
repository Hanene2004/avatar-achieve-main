import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Achievement {
  id: string;
  user_id: string;
  achievement_id: string;
  title: string;
  description: string;
  icon?: string;
  xp_reward: number;
  unlocked_at: string;
  created_at: string;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    } else {
      setAchievements([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementData: {
    achievement_id: string;
    title: string;
    description: string;
    icon?: string;
    xp_reward: number;
  }) => {
    if (!user) return;

    try {
      // Check if achievement already exists
      const existingAchievement = achievements.find(
        a => a.achievement_id === achievementData.achievement_id
      );
      if (existingAchievement) return;

      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          ...achievementData,
        })
        .select()
        .single();

      if (error) throw error;

      setAchievements(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  };

  const hasAchievement = (achievementId: string): boolean => {
    return achievements.some(a => a.achievement_id === achievementId);
  };

  return {
    achievements,
    loading,
    unlockAchievement,
    hasAchievement,
    refetch: fetchAchievements,
  };
};