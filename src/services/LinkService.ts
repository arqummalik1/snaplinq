import { supabase } from '../lib/supabase';
import { Link, LinkPatch, NewLink } from '../types';

export class LinkService {
    static async fetchLinks(userId: string): Promise<Link[]> {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    static async insertLink(payload: NewLink & { user_id: string }): Promise<Link> {
        const { data, error } = await supabase
            .from('links')
            .insert({
                ...payload,
                created_at: new Date().toISOString(),
                visited: false,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async bulkInsertLinks(payloads: (NewLink & { user_id: string })[]): Promise<void> {
        const { error } = await supabase
            .from('links')
            .insert(
                payloads.map((p) => ({
                    ...p,
                    created_at: new Date().toISOString(),
                    visited: false,
                }))
            );

        if (error) throw error;
    }

    static async updateLink(id: string, updates: LinkPatch): Promise<Link> {
        const { data, error } = await supabase
            .from('links')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async deleteLink(id: string): Promise<void> {
        const { error } = await supabase.from('links').delete().eq('id', id);

        if (error) throw error;
    }

    static async markVisited(id: string, timestamp: string): Promise<void> {
        const { error } = await supabase
            .from('links')
            .update({
                visited: true,
                last_visited_at: timestamp,
            })
            .eq('id', id);

        if (error) throw error;
    }
}
