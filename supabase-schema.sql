-- =============================================
-- Snaplinq - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create the links table
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    icon TEXT,
    category TEXT NOT NULL DEFAULT 'Uncategorized',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    visited BOOLEAN NOT NULL DEFAULT FALSE,
    last_visited_at TIMESTAMPTZ
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Allow users to read their own links
CREATE POLICY "Users can view their own links" 
ON public.links FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own links
CREATE POLICY "Users can insert their own links" 
ON public.links FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own links
CREATE POLICY "Users can update their own links" 
ON public.links FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own links
CREATE POLICY "Users can delete their own links" 
ON public.links FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_category ON public.links(category);

-- 5. Add updated_at trigger function (optional but useful)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: If you want automatic timestamps, add this:
-- ALTER TABLE public.links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
-- CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON public.links
-- FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION QUERY - Run to check setup
-- =============================================
-- SELECT table_name, rowsecurity 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name = 'links';
