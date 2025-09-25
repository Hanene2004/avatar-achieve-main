import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

export type Item = Tables<'items'>;

export const useItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('obtained_at', { ascending: false });

      if (error) throw error;

      setItems(data as Item[] || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData: {
    item_id: string;
    name: string;
    description?: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    type: 'weapon' | 'armor' | 'accessory' | 'consumable';
    stats: Record<string, number>;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          ...itemData,
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [data as Item, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const equipItem = async (itemId: string) => {
    if (!user) return;

    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      // Unequip other items of the same type
      const updatePromises = items
        .filter(i => i.type === item.type && i.equipped)
        .map(i => 
          supabase
            .from('items')
            .update({ equipped: false })
            .eq('id', i.id)
        );

      await Promise.all(updatePromises);

      // Equip the selected item
      const { data, error } = await supabase
        .from('items')
        .update({ equipped: true })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setItems(prev => 
        prev.map(i => ({
          ...i,
          equipped: i.type === item.type ? i.id === itemId : i.equipped
        }))
      );

      return data;
    } catch (error) {
      console.error('Error equipping item:', error);
      throw error;
    }
  };

  const unequipItem = async (itemId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .update({ equipped: false })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => 
        prev.map(i => i.id === itemId ? { ...i, equipped: false } : i)
      );

      return data;
    } catch (error) {
      console.error('Error unequipping item:', error);
      throw error;
    }
  };

  const getEquippedItems = (): Item[] => {
    return items.filter(item => item.equipped);
  };

  const getTotalStats = (): Record<string, number> => {
    const equippedItems = getEquippedItems();
    const totalStats: Record<string, number> = {};

    equippedItems.forEach(item => {
      const itemStats = item.stats as Record<string, number>;
      Object.entries(itemStats).forEach(([stat, value]) => {
        totalStats[stat] = (totalStats[stat] || 0) + value;
      });
    });

    return totalStats;
  };

  return {
    items,
    loading,
    addItem,
    equipItem,
    unequipItem,
    getEquippedItems,
    getTotalStats,
    refetch: fetchItems,
  };
};