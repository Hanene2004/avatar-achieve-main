import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PlayerProfile {
  id: string;
  user_id: string;
  player_name: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  strength: number;
  intelligence: number;
  endurance: number;
  charisma: number;
  luck: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<PlayerProfile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const gainXP = async (xpAmount: number) => {
    if (!profile) return;

    let newXP = profile.xp + xpAmount;
    let newLevel = profile.level;
    let newXPToNext = profile.xp_to_next_level;
    
    // Check for level up
    let leveledUp = false;
    while (newXP >= newXPToNext) {
      newXP -= newXPToNext;
      newLevel++;
      newXPToNext = Math.floor(newXPToNext * 1.2); // Increase XP requirement by 20%
      leveledUp = true;
    }

    // If leveled up, add random stat points
    const updates: Partial<PlayerProfile> = {
      xp: newXP,
      level: newLevel,
      xp_to_next_level: newXPToNext,
    };

    if (leveledUp) {
      // Add 2-4 random stat points distributed across stats
      const statNames: (keyof PlayerProfile)[] = ['strength', 'intelligence', 'endurance', 'charisma', 'luck'];
      const statGains = Array(5).fill(0);
      
      for (let i = 0; i < 3; i++) {
        const randomStat = Math.floor(Math.random() * 5);
        statGains[randomStat]++;
      }

      updates.strength = profile.strength + statGains[0];
      updates.intelligence = profile.intelligence + statGains[1];
      updates.endurance = profile.endurance + statGains[2];
      updates.charisma = profile.charisma + statGains[3];
      updates.luck = profile.luck + statGains[4];
    }

    await updateProfile(updates);
    
    return { leveledUp, newLevel };
  };

  return {
    profile,
    loading,
    updateProfile,
    gainXP,
    refetch: fetchProfile,
  };
};