export const categorizeUrl = (url: string): string => {
    const lower = url.toLowerCase();

    if (lower.match(/github|gitlab|stackoverflow|dev\.to|code/)) return 'Coding';
    if (lower.match(/gpt|openai|claude|midjourney|ai/)) return 'AI Tools';
    if (lower.match(/dribbble|behance|figma|unsplash|design/)) return 'Design';
    if (lower.match(/twitter|x\.com|linkedin|facebook|instagram/)) return 'Social';
    if (lower.match(/bbc|cnn|nytimes|news/)) return 'News';
    if (lower.match(/flight|hotel|booking|airbnb|trip/)) return 'Travel';
    if (lower.match(/youtube|spotify|music|video/)) return 'Music';

    return 'Uncategorized';
};
