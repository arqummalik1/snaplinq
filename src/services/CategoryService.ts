import { supabase } from '../lib/supabase';

export class CategoryService {
    static async moveLinksToCategoryDefault(categoryName: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('links')
            .update({ category: 'Uncategorized' })
            .eq('category', categoryName)
            .eq('user_id', userId);

        if (error) throw error;
    }

    static async renameLinksCategory(oldName: string, newName: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('links')
            .update({ category: newName })
            .eq('category', oldName)
            .eq('user_id', userId);

        if (error) throw error;
    }
}
