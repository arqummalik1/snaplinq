import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { ENV } from '../config/env';

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return AsyncStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        return AsyncStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        return AsyncStorage.removeItem(key);
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage:
            Platform.OS === 'web' && typeof window === 'undefined'
                ? {
                    // SSR Mock
                    getItem: () => Promise.resolve(null),
                    setItem: () => Promise.resolve(),
                    removeItem: () => Promise.resolve(),
                }
                : ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable session detection from URL for Web OAuth
    },
});
