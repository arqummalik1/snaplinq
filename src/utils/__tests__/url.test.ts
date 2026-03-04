import { isValidUrl, normalizeUrl } from '../url';

describe('URL Utilities', () => {
    describe('normalizeUrl', () => {
        it('adds https:// if missing', () => {
            expect(normalizeUrl('google.com')).toBe('https://google.com');
        });

        it('preserves existing http://', () => {
            expect(normalizeUrl('http://example.com')).toBe('http://example.com');
        });

        it('strips leading/trailing whitespace', () => {
            expect(normalizeUrl('  github.com  ')).toBe('https://github.com');
        });

        it('blocks javascript: protocol', () => {
            expect(normalizeUrl('javascript:alert(1)')).toBe('');
        });
    });

    describe('isValidUrl', () => {
        it('returns true for valid URLs', () => {
            expect(isValidUrl('https://google.com')).toBe(true);
            expect(isValidUrl('google.com')).toBe(true);
        });

        it('returns false for invalid inputs', () => {
            expect(isValidUrl('')).toBe(false);
            expect(isValidUrl('not-a-url')).toBe(false);
            expect(isValidUrl('http://')).toBe(false);
        });

        it('returns false for malicious protocols', () => {
            expect(isValidUrl('javascript:alert(1)')).toBe(false);
        });
    });
});
