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
        console.log('=== LinkService DEBUG ===');
        console.log('Payload URL:', payload.url);
        console.log('Payload Title:', payload.title);
        console.log('Payload Category:', payload.category);
        console.log('Payload UserID:', payload.user_id);

        const insertData = {
            url: payload.url,
            title: payload.title,
            category: payload.category || 'Uncategorized',
            icon: payload.icon || '',
            user_id: payload.user_id,
            created_at: new Date().toISOString(),
            visited: false,
        };

        console.log('Insert data:', JSON.stringify(insertData));

        const { data, error } = await supabase
            .from('links')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error('=== SUPABASE ERROR ===');
            console.error('Error:', error);
            throw error;
        }

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
