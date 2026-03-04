import { sanitizeUrl } from './sanitize';

/**
 * Normalizes a URL by adding https:// if protocol is missing.
 */
export const normalizeUrl = (url: string): string => {
    if (!url) return '';
    let trimmed = url.trim();

    // Sanitize first to catch malicious protocols like javascript:
    const sanitized = sanitizeUrl(trimmed);
    if (!sanitized) return '';

    if (!/^https?:\/\//i.test(sanitized)) {
        return `https://${sanitized}`;
    }

    return sanitized;
};

/**
 * Basic URL validation.
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return false;

    // Check for malicious protocols first
    const sanitized = sanitizeUrl(url.trim());
    if (!sanitized) return false;

    // Basic pattern check
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(sanitized);
};

/**
 * Returns a favicon URL for a given domain using Google's favicon service.
 */
export const getFavicon = (url: string): string => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
        return `https://www.google.com/s2/favicons?domain=${url}&sz=128`;
    }
};
