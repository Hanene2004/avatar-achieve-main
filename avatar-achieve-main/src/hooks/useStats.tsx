import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

export type DailyStat = Tables<'daily_stats'>;
export type Streak = Tables<'streaks'>;

export const useStats = () => {
  const { user } = useAuth();
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setDailyStats([]);
      setStreaks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [dailyStatsResult, streaksResult] = await Promise.all([
        supabase
          .from('daily_stats')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30),
        supabase
          .from('streaks')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (dailyStatsResult.error) throw dailyStatsResult.error;
      if (streaksResult.error) throw streaksResult.error;

      setDailyStats(dailyStatsResult.data as DailyStat[] || []);
      setStreaks(streaksResult.data as Streak[] || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDailyStats = async (xpGained: number, category: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Get or create today's stats
      const { data: existingStats } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      const categoriesCompleted = (existingStats?.categories_completed as Record<string, number>) || {};
      categoriesCompleted[category] = (categoriesCompleted[category] || 0) + 1;

      const statsData = {
        user_id: user.id,
        date: today,
        quests_completed: (existingStats?.quests_completed || 0) + 1,
        xp_gained: (existingStats?.xp_gained || 0) + xpGained,
        categories_completed: categoriesCompleted,
      };

      if (existingStats) {
        const { data, error } = await supabase
          .from('daily_stats')
          .update(statsData)
          .eq('id', existingStats.id)
          .select()
          .single();

        if (error) throw error;

        setDailyStats(prev => 
          prev.map(stat => stat.id === existingStats.id ? data as DailyStat : stat)
        );
      } else {
        const { data, error } = await supabase
          .from('daily_stats')
          .insert(statsData)
          .select()
          .single();

        if (error) throw error;

        setDailyStats(prev => [data as DailyStat, ...prev]);
      }

      // Update daily streak
      await updateStreak('daily');
    } catch (error) {
      console.error('Error updating daily stats:', error);
      throw error;
    }
  };

  const updateStreak = async (streakType: 'daily' | 'weekly' | 'monthly') => {
    if (!user) return;

    try {
      const { data: existingStreak } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('streak_type', streakType)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (existingStreak) {
        let newCount = existingStreak.current_count;
        
        if (existingStreak.last_updated === yesterday) {
          // Continue streak
          newCount += 1;
        } else if (existingStreak.last_updated !== today) {
          // Reset streak if more than one day gap
          newCount = 1;
        }

        const { data, error } = await supabase
          .from('streaks')
          .update({
            current_count: newCount,
            best_count: Math.max(existingStreak.best_count, newCount),
            last_updated: today,
          })
          .eq('id', existingStreak.id)
          .select()
          .single();

        if (error) throw error;

        setStreaks(prev => 
          prev.map(streak => streak.id === existingStreak.id ? data as Streak : streak)
        );
      } else {
        // Create new streak
        const { data, error } = await supabase
          .from('streaks')
          .insert({
            user_id: user.id,
            streak_type: streakType,
            current_count: 1,
            best_count: 1,
            last_updated: today,
          })
          .select()
          .single();

        if (error) throw error;

        setStreaks(prev => [...prev, data as Streak]);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const getTodaysStats = (): DailyStat | null => {
    const today = new Date().toISOString().split('T')[0];
    return dailyStats.find(stat => stat.date === today) || null;
  };

  const getStreak = (type: 'daily' | 'weekly' | 'monthly'): Streak | null => {
    return streaks.find(streak => streak.streak_type === type) || null;
  };

  return {
    dailyStats,
    streaks,
    loading,
    updateDailyStats,
    getTodaysStats,
    getStreak,
    refetch: fetchStats,
  };
};