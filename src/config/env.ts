/**
 * Centralized environment configuration.
 * Using EXPO_PUBLIC_ prefix makes these available in client-side code automatically.
 */

// Validate required environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || SUPABASE_URL === '') {
    console.error('❌ MISSING: EXPO_PUBLIC_SUPABASE_URL is not defined in environment');
    console.error('   Please add EXPO_PUBLIC_SUPABASE_URL to your .env file');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === '') {
    console.error('❌ MISSING: EXPO_PUBLIC_SUPABASE_ANON_KEY is not defined in environment');
    console.error('   Please add EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file');
}

export const ENV = {
    SUPABASE_URL: SUPABASE_URL || '',
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || '',
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    IS_DEV: __DEV__,
} as const;

export type EnvConfig = typeof ENV;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};
