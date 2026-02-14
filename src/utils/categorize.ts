export const categorizeUrl = (url: string): string => {
    if (/github|gitlab|stackoverflow|dev\.to|code/i.test(url)) return 'Coding';
    if (/gpt|openai|claude|midjourney|ai/i.test(url)) return 'AI Tools';
    if (/dribbble|behance|figma|unsplash|design/i.test(url)) return 'Design';
    if (/twitter|x\.com|linkedin|facebook|instagram/i.test(url)) return 'Social';
    if (/bbc|cnn|nytimes|news/i.test(url)) return 'News';
    if (/flight|hotel|booking|airbnb|trip/i.test(url)) return 'Travel';
    if (/youtube|spotify|music|video/i.test(url)) return 'Music';

    return 'Uncategorized';
};
