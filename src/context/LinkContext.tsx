import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { DAILY_RECS_COUNT, DEFAULT_CATEGORIES, RECENT_LINKS_COUNT } from '../constants';
import { LinkRepository } from '../repositories/LinkRepository';
import { CategoryService } from '../services/CategoryService';
import { Link, LinkContextType, LinkPatch, NewLink } from '../types';
import { useAuth } from './AuthContext';

// Extending LinkContextType to include importLinks
interface ExtendedLinkContextType extends LinkContextType {
    importLinks: (links: NewLink[]) => Promise<void>;
}

const LinkContext = createContext<ExtendedLinkContextType | undefined>(undefined);

export const LinkProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [recentLinks, setRecentLinks] = useState<Link[]>([]);
    const [dailyRecommendations, setDailyRecommendations] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

    const generateDailyRecommendations = (allLinks: Link[]) => {
        if (allLinks.length === 0) return [];

        const today = new Date().toDateString();
        let seed = 0;
        for (let i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i);
        }

        const shuffled = [...allLinks];
        let m = shuffled.length, t, i;
        let currentSeed = seed;

        const seededRandom = (s: number) => {
            const x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        };

        while (m) {
            i = Math.floor(seededRandom(currentSeed++) * m--);
            t = shuffled[m];
            shuffled[m] = shuffled[i];
            shuffled[i] = t;
        }

        return shuffled.slice(0, DAILY_RECS_COUNT);
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
            const fetchedLinks = await LinkRepository.getAll(session.user.id);
            setLinks(fetchedLinks);
            setRecentLinks(fetchedLinks.slice(0, RECENT_LINKS_COUNT));
            setDailyRecommendations(generateDailyRecommendations(fetchedLinks));
            const usedCategories = new Set(fetchedLinks.map((l) => l.category));
            setCategories((prev) => Array.from(new Set([...prev, ...usedCategories])));
        } catch (e) {
            console.error('Refresh Error:', e);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) refresh();
    }, [session, refresh]);

    const addLink = async (link: NewLink) => {
        if (!session?.user) return;
        await LinkRepository.add(link, session.user.id);
        await refresh();
    };

    const importLinks = async (newLinks: NewLink[]) => {
        if (!session?.user) return;
        await LinkRepository.addBulk(newLinks, session.user.id);
        await refresh();
    };

    const markVisited = async (id: string) => {
        const timestamp = new Date().toISOString();
        try {
            await LinkRepository.visit(id);
            setLinks((prev) =>
                prev.map((l) => (l.id === id ? { ...l, visited: true, last_visited_at: timestamp } : l))
            );
        } catch (e) {
            console.error('Mark Visited Error:', e);
            throw e;
        }
    };

    const updateLink = async (id: string, updates: LinkPatch) => {
        await LinkRepository.update(id, updates);
        await refresh();
    };

    const deleteLink = async (id: string) => {
        try {
            await LinkRepository.remove(id);
            setLinks((prev) => prev.filter((l) => l.id !== id));
        } catch (e) {
            console.error('Delete Error:', e);
            throw e;
        }
    };

    const addCategory = (name: string) => {
        if (!categories.includes(name)) setCategories([...categories, name]);
    };

    const deleteCategory = async (name: string) => {
        if (name === 'Uncategorized') {
            Alert.alert('Cannot delete default category');
            return;
        }
        if (!session?.user) return;
        try {
            await CategoryService.moveLinksToCategoryDefault(name, session.user.id);
            setCategories(categories.filter((c) => c !== name));
            await refresh();
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
        if (!session?.user) return;
        try {
            await CategoryService.renameLinksCategory(oldName, newName, session.user.id);
            setCategories(categories.map((c) => (c === oldName ? newName : c)));
            await refresh();
        } catch (error) {
            console.error('Error renaming category:', error);
            Alert.alert('Error', 'Failed to rename category');
            throw error;
        }
    };

    return (
        <LinkContext.Provider
            value={{
                links,
                recentLinks,
                dailyRecommendations,
                categories,
                loading,
                refresh,
                addLink,
                importLinks,
                updateLink,
                markVisited,
                deleteLink,
                addCategory,
                deleteCategory,
                renameCategory,
            }}
        >
            {children}
        </LinkContext.Provider>
    );
};

export const useLinkContext = () => {
    const context = useContext(LinkContext);
    if (!context) throw new Error('useLinkContext must be used within LinkProvider');
    return context;
};
