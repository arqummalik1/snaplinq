import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Link {
    id: string;
    url: string;
    title: string;
    icon?: string;
    category: string;
    created_at?: string;
    user_id?: string;
    visited?: boolean;
    last_visited_at?: string;
}

interface LinkContextType {
    links: Link[];
    recentLinks: Link[];
    dailyRecommendations: Link[];
    categories: string[];
    loading: boolean;
    refresh: () => Promise<void>;
    addLink: (link: Partial<Link>) => Promise<void>;
    updateLink: (id: string, updates: Partial<Link>) => Promise<void>;
    markVisited: (id: string) => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
    addCategory: (name: string) => void;
    deleteCategory: (name: string) => Promise<void>;
    renameCategory: (oldName: string, newName: string) => Promise<void>;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [recentLinks, setRecentLinks] = useState<Link[]>([]);
    const [dailyRecommendations, setDailyRecommendations] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([
        'Uncategorized', 'Coding', 'Design', 'Reading', 'Music', 'Social', 'AI Tools', 'News', 'Travel'
    ]);

    const generateDailyRecommendations = (allLinks: Link[]) => {
        if (allLinks.length === 0) return [];
        
        // Use the current date as a seed for consistent daily recommendations
        const today = new Date().toDateString();
        let seed = 0;
        for (let i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i);
        }

        // Shuffle based on seed
        const shuffled = [...allLinks].sort((a, b) => {
            const valA = (parseInt(a.id.slice(0, 8), 16) || 0) + seed;
            const valB = (parseInt(b.id.slice(0, 8), 16) || 0) + seed;
            return (valA % 100) - (valB % 100);
        });

        return shuffled.slice(0, 3);
    };

    const refresh = useCallback(async () => {
        if (!session?.user) {
            setLinks([]);
            setRecentLinks([]);
            setDailyRecommendations([]);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Fetch Error:", error);
            } else {
                const fetchedLinks = data || [];
                setLinks(fetchedLinks);
                
                // Recents: Last 10 added links
                setRecentLinks(fetchedLinks.slice(0, 10));
                
                // Daily Recommendations: 3 random tools (seeded by date)
                setDailyRecommendations(generateDailyRecommendations(fetchedLinks));

                // Extract unique categories
                const usedCategories = new Set(fetchedLinks.map(l => l.category));
                setCategories(prev => Array.from(new Set([...prev, ...usedCategories])));
            }
        } catch (e) {
            console.error("Refresh Error:", e);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) refresh();
    }, [session, refresh]);

    const addLink = async (link: Partial<Link>) => {
        if (!session?.user) return;

        const { error } = await supabase.from('links').insert({
            ...link,
            user_id: session.user.id,
            created_at: new Date().toISOString(),
            visited: false,
        });

        if (error) throw error;
        refresh();
    };

    const markVisited = async (id: string) => {
        const timestamp = new Date().toISOString();
        const { error } = await supabase
            .from('links')
            .update({ 
                visited: true, 
                last_visited_at: timestamp 
            })
            .eq('id', id);

        if (error) {
            console.error("Mark Visited Error:", error);
            throw error;
        }
        
        // Optimistic update
        setLinks(prev => prev.map(l => l.id === id ? { ...l, visited: true, last_visited_at: timestamp } : l));
    };

    const updateLink = async (id: string, updates: Partial<Link>) => {
        const { error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        refresh();
    };

    const deleteLink = async (id: string) => {
        try {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;

            // Optimistic update: remove from local state immediately
            setLinks(prev => prev.filter(l => l.id !== id));

            // Also update categories if needed (if it was the last link in a category?)
            // Actually, we keep categories even if empty usually, or refresh handles it.
            // But refreshing strictly for categories might be overkill if we just deleted one link.
            // We can skip refresh() to make it instant.
        } catch (e) {
            console.error("Delete Error:", e);
            throw e;
        }
    };

    // Local category mgmt (simple version, just updates state until link added)
    const addCategory = (name: string) => {
        if (!categories.includes(name)) setCategories([...categories, name]);
    };

    const deleteCategory = async (name: string) => {
        if (name === 'Uncategorized') {
            Alert.alert('Cannot delete default category');
            return;
        }

        try {
            // 1. Move all links in this category to 'Uncategorized'
            const { error: updateError } = await supabase
                .from('links')
                .update({ category: 'Uncategorized' })
                .eq('category', name)
                .eq('user_id', session?.user?.id);

            if (updateError) throw updateError;

            // 2. Remove from local state
            setCategories(categories.filter(c => c !== name));
            await refresh(); // Refresh to get updated links
        } catch (error) {
            console.error('Error deleting category:', error);
            Alert.alert('Error', 'Failed to delete category');
            throw error;
        }
    };

    const renameCategory = async (oldName: string, newName: string) => {
        if (oldName === 'Uncategorized') {
            Alert.alert('Cannot rename default category');
            return;
        }
        if (categories.includes(newName)) {
            Alert.alert('Category name already exists');
            return;
        }

        try {
            // 1. Update all links with this category
            const { error } = await supabase
                .from('links')
                .update({ category: newName })
                .eq('category', oldName)
                .eq('user_id', session?.user?.id);

            if (error) throw error;

            // 2. Update local state
            setCategories(categories.map(c => c === oldName ? newName : c));
            await refresh();
        } catch (error) {
            console.error('Error renaming category:', error);
            Alert.alert('Error', 'Failed to rename category');
            throw error;
        }
    };

    return (
        <LinkContext.Provider value={{
            links,
            recentLinks,
            dailyRecommendations,
            categories,
            loading,
            refresh,
            addLink,
            updateLink,
            markVisited,
            deleteLink,
            addCategory,
            deleteCategory,
            renameCategory
        }}>
            {children}
        </LinkContext.Provider>
    );
};

export const useLinkContext = () => {
    const context = useContext(LinkContext);
    if (!context) throw new Error('useLinkContext must be used within LinkProvider');
    return context;
};
