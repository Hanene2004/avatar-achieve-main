-- Table des achievements/récompenses
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for achievements
CREATE POLICY "Users can view their own achievements" 
ON public.achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Table des statistiques quotidiennes
CREATE TABLE public.daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  quests_completed INTEGER NOT NULL DEFAULT 0,
  xp_gained INTEGER NOT NULL DEFAULT 0,
  categories_completed JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily stats
CREATE POLICY "Users can view their own daily stats" 
ON public.daily_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily stats" 
ON public.daily_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily stats" 
ON public.daily_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Table des streaks (séries)
CREATE TABLE public.streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  current_count INTEGER NOT NULL DEFAULT 0,
  best_count INTEGER NOT NULL DEFAULT 0,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Enable RLS
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- RLS policies for streaks
CREATE POLICY "Users can view their own streaks" 
ON public.streaks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" 
ON public.streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Table des objets/équipements
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  type TEXT NOT NULL, -- 'weapon', 'armor', 'accessory', 'consumable'
  stats JSONB DEFAULT '{}', -- {"strength": 5, "intelligence": 3}
  equipped BOOLEAN NOT NULL DEFAULT false,
  obtained_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- RLS policies for items
CREATE POLICY "Users can view their own items" 
ON public.items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items" 
ON public.items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" 
ON public.items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" 
ON public.items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_daily_stats_updated_at
BEFORE UPDATE ON public.daily_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
BEFORE UPDATE ON public.streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_achievements_achievement_id ON public.achievements(achievement_id);
CREATE INDEX idx_daily_stats_user_date ON public.daily_stats(user_id, date);
CREATE INDEX idx_streaks_user_type ON public.streaks(user_id, streak_type);
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_equipped ON public.items(user_id, equipped) WHERE equipped = true;