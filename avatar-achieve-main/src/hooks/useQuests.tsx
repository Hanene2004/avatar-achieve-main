import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CompletedQuest {
  id: string;
  user_id: string;
  quest_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export const useQuests = () => {
  const { user } = useAuth();
  const [completedQuests, setCompletedQuests] = useState<CompletedQuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCompletedQuests();
    } else {
      setCompletedQuests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCompletedQuests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      setCompletedQuests(data || []);
    } catch (error) {
      console.error('Error fetching completed quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeQuest = async (questId: string) => {
    if (!user) return;

    try {
      // Check if quest is already completed
      const existingQuest = completedQuests.find(q => q.quest_id === questId);
      if (existingQuest) return;

      const { data, error } = await supabase
        .from('quests')
        .insert({
          user_id: user.id,
          quest_id: questId,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setCompletedQuests(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error completing quest:', error);
      throw error;
    }
  };

  const isQuestCompleted = (questId: string): boolean => {
    return completedQuests.some(q => q.quest_id === questId);
  };

  return {
    completedQuests,
    loading,
    completeQuest,
    isQuestCompleted,
    refetch: fetchCompletedQuests,
  };
};