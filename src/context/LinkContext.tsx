import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

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
    deleteCategory: (name: string) => void;
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

    const deleteCategory = (name: string) => {
        if (name === 'Uncategorized') return;
        setCategories(categories.filter(c => c !== name));
        // Implementation choice: do we move links to Uncategorized? 
        // For now, let's keep it simple.
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
            deleteCategory
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
