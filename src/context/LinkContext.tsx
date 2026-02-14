import { createContext, useContext, useEffect, useState } from 'react';
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
}

interface LinkContextType {
    links: Link[];
    categories: string[];
    loading: boolean;
    refresh: () => Promise<void>;
    addLink: (link: Partial<Link>) => Promise<void>;
    updateLink: (id: string, updates: Partial<Link>) => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
    addCategory: (name: string) => void;
    deleteCategory: (name: string) => Promise<void>;
    renameCategory: (oldName: string, newName: string) => Promise<void>;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([
        'Uncategorized', 'Coding', 'Design', 'Reading', 'Music', 'Social', 'AI Tools', 'News', 'Travel'
    ]);

    const refresh = async () => {
        if (!session?.user) {
            setLinks([]);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setLinks(data || []);
            // Extract unique categories from links to add to list if missing
            const usedCategories = new Set(data?.map(l => l.category));
            setCategories(prev => Array.from(new Set([...prev, ...usedCategories])));
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session) refresh();
    }, [session]);

    const addLink = async (link: Partial<Link>) => {
        if (!session?.user) return;

        const { error } = await supabase.from('links').insert({
            ...link,
            user_id: session.user.id,
            created_at: new Date().toISOString(),
        });

        if (error) throw error;
        refresh();
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
        const { error } = await supabase.from('links').delete().eq('id', id);
        if (error) throw error;
        refresh();
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
            categories,
            loading,
            refresh,
            addLink,
            updateLink,
            deleteLink,
            addCategory,
            deleteCategory,
            renameCategory
        }}>
            {children}
        </LinkContext.Provider>
    );
};

export const useLinks = () => {
    const context = useContext(LinkContext);
    if (!context) throw new Error('useLinks must be used within LinkProvider');
    return context;
};
