/**
 * Centralized environment configuration.
 * Using EXPO_PUBLIC_ prefix makes these available in client-side code automatically.
 */

if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    console.warn('EXPO_PUBLIC_SUPABASE_URL is not defined in environment');
}

if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('EXPO_PUBLIC_SUPABASE_ANON_KEY is not defined in environment');
}

export const ENV = {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    IS_DEV: __DEV__,
} as const;

export type EnvConfig = typeof ENV;
