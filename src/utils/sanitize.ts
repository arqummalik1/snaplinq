export const sanitizeInput = (input: string): string => {
    if (!input) return '';
    return input
        .trim()
        .replace(/[<>]/g, '') // Basic HTML tag stripping
        .slice(0, 500); // Reasonable length limit
};

export const sanitizeUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();

    // Block javascript: protocol
    if (/^javascript:/i.test(trimmed)) {
        return '';
    }

    // Prevent data: URIs if not explicitly needed
    if (/^data:/i.test(trimmed)) {
        return '';
    }

    return trimmed;
};
