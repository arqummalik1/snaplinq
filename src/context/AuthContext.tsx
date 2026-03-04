import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { type Session, type User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Web: Setup for Auth Session
if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
} else {
    // Basic Google Config (User needs to replace webClientId with their own from Google Cloud)
    // This is a placeholder config.
    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
    });
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (Platform.OS === 'web') {
            // WEB: OAuth Redirect
            // Use window.location.origin but ensure it doesn't have trailing slash for Supabase matching
            const origin = typeof window !== 'undefined' ? window.location.origin.replace(/\/$/, '') : '';
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: origin,
                    skipBrowserRedirect: false,
                },
            });
            if (error) {
                console.error("Google Signin Error:", error);
                throw error;
            }
        } else {
            // MOBILE: Native SDK
            try {
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                if (userInfo.data?.idToken) {
                    const { error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: userInfo.data.idToken,
                    });
                    if (error) throw error;
                } else {
                    throw new Error('No ID token present!');
                }
            } catch (error: any) {
                // Show error to user via console and handle gracefully
                console.error('Google Sign-In Error:', error);
                // Return a structured error that can be caught by the caller
                throw new Error(error?.message || 'Google Sign-In failed. Please try again.');
            }
        }
    };

    const signOut = async () => {
        if (Platform.OS !== 'web') {
            try {
                await GoogleSignin.signOut();
            } catch {
                // ignore if not signed in with google
            }
        }
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
