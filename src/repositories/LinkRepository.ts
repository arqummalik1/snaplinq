import { LinkService } from '../services/LinkService';
import { Link, LinkPatch, NewLink } from '../types';

export class LinkRepository {
    static async getAll(userId: string): Promise<Link[]> {
        try {
            return await LinkService.fetchLinks(userId);
        } catch (error) {
            console.error('LinkRepository.getAll failed:', error);
            throw new Error('Failed to fetch links. Please try again.');
        }
    }

    static async add(link: NewLink, userId: string): Promise<Link> {
        // Basic validation
        if (!link.url || !link.url.includes('.')) {
            throw new Error('Invalid URL provided.');
        }

        try {
            return await LinkService.insertLink({ ...link, user_id: userId });
        } catch (error) {
            console.error('LinkRepository.add failed:', error);
            throw new Error('Failed to add link. Please check your connection.');
        }
    }

    static async addBulk(links: NewLink[], userId: string): Promise<void> {
        const validLinks = links.filter(l => l.url && l.url.includes('.'));
        if (validLinks.length === 0) return;

        try {
            await LinkService.bulkInsertLinks(validLinks.map(l => ({ ...l, user_id: userId })));
        } catch (error) {
            console.error('LinkRepository.addBulk failed:', error);
            throw new Error('Failed to import links.');
        }
    }

    static async update(id: string, patch: LinkPatch): Promise<Link> {
        try {
            return await LinkService.updateLink(id, patch);
        } catch (error) {
            console.error('LinkRepository.update failed:', error);
            throw new Error('Failed to update link.');
        }
    }

    static async remove(id: string): Promise<void> {
        try {
            await LinkService.deleteLink(id);
        } catch (error) {
            console.error('LinkRepository.remove failed:', error);
            throw new Error('Failed to delete link.');
        }
    }

    static async visit(id: string): Promise<void> {
        const timestamp = new Date().toISOString();
        try {
            await LinkService.markVisited(id, timestamp);
        } catch (error) {
            console.error('LinkRepository.visit failed:', error);
        }
    }
}
