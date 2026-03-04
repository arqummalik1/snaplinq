// ─────────────────────────────────────────────────────────────────────────────
// Snaplinq — Canonical Domain Types
// All components, contexts, services, and repositories import from here.
// ─────────────────────────────────────────────────────────────────────────────

export interface Link {
    id: string;
    url: string;
    title: string;
    icon?: string;
    category: string;
    created_at: string;
    user_id: string;
    visited: boolean;
    last_visited_at?: string;
}

/** Payload for creating a new link (server-generated fields omitted) */
export type NewLink = Omit<Link, 'id' | 'created_at' | 'user_id' | 'visited'>;

/** Patch payload — partial updates to an existing link */
export type LinkPatch = Partial<Omit<Link, 'id' | 'user_id' | 'created_at'>>;

export interface Category {
    name: string;
    count: number;
}

export type Theme = 'light' | 'dark' | 'system';
export type SortOrder = 'newest' | 'oldest' | 'alphabetical';
export type Layout = 'grid' | 'list' | 'compact';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

// ─── Context / ViewModel shape ───────────────────────────────────────────────

export interface LinkContextType {
    links: Link[];
    recentLinks: Link[];
    dailyRecommendations: Link[];
    categories: string[];
    loading: boolean;
    refresh: () => Promise<void>;
    addLink: (link: NewLink) => Promise<void>;
    importLinks: (links: NewLink[]) => Promise<void>;
    updateLink: (id: string, updates: LinkPatch) => Promise<void>;
    markVisited: (id: string) => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
    addCategory: (name: string) => void;
    deleteCategory: (name: string) => Promise<void>;
    renameCategory: (oldName: string, newName: string) => Promise<void>;
}
