export const getFavicon = (url: string) => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
        return '';
    }
};

export const generateTitle = (url: string) => {
    try {
        return new URL(url).hostname.replace('www.', '').split('.')[0];
    } catch (e) {
        return url;
    }
};
