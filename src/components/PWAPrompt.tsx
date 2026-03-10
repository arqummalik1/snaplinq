import AsyncStorage from '@react-native-async-storage/async-storage';
import { Download } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

export function PWAPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [promptDisabled, setPromptDisabled] = useState(true);

    useEffect(() => {
        if (Platform.OS !== 'web') return;
        setPromptDisabled(false); // Enable explicitly for web

        const checkPrompt = async () => {
            try {
                const hasDismissed = await AsyncStorage.getItem('pwa_prompt_dismissed');
                if (hasDismissed === 'true') return;

                // Detect iOS Safari
                const userAgent = window.navigator.userAgent.toLowerCase();
                const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
                const isStandalone = ('standalone' in window.navigator) && ((window.navigator as any).standalone === true);

                if (isIosDevice && !isStandalone) {
                    setIsIOS(true);
                    setShowPrompt(true);
                }
            } catch (e) {
                // Ignore AsyncStorage errors
            }
        };

        checkPrompt();

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            AsyncStorage.getItem('pwa_prompt_dismissed').then((hasDismissed) => {
                if (hasDismissed !== 'true') {
                    setShowPrompt(true);
                }
            });
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Hide prompt if user installs
        window.addEventListener('appinstalled', () => {
            setShowPrompt(false);
            setDeferredPrompt(null);
            AsyncStorage.setItem('pwa_prompt_dismissed', 'true');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = async () => {
        try {
            await AsyncStorage.setItem('pwa_prompt_dismissed', 'true');
        } catch (e) {
            // Error silently
        }
        setShowPrompt(false);
    };

    if (promptDisabled || !showPrompt) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none" className="items-center justify-center p-6 z-50">
            <Animated.View
                entering={FadeInDown.springify().damping(15)}
                exiting={FadeOutDown}
                className="w-full max-w-[420px] bg-[#1C1C1E] rounded-[32px] p-6 shadow-2xl border border-[#2C2C2E] flex-row items-center gap-5"
            >
                <View className="bg-emerald-500/20 p-4 rounded-3xl">
                    <Download size={28} color="#10b981" />
                </View>
                <View className="flex-1">
                    <Text className="font-heavy text-white text-[18px] mb-1">
                        Install Snaplinq
                    </Text>
                    <Text className="text-[14px] text-zinc-400 leading-snug">
                        {isIOS
                            ? "Tap Share and select 'Add to Home Screen' to install."
                            : "Add to your device for a premium, local-first experience."}
                    </Text>
                    <View className="flex-row gap-3 mt-4">
                        {!isIOS && (
                            <Pressable
                                onPress={handleInstall}
                                className="bg-emerald-500 px-6 py-2.5 rounded-full items-center active:scale-95"
                            >
                                <Text className="text-white font-heavy text-sm">Install App</Text>
                            </Pressable>
                        )}
                        <Pressable
                            onPress={handleDismiss}
                            className="bg-[#2C2C2E] px-6 py-2.5 rounded-full items-center active:scale-95"
                        >
                            <Text className="text-zinc-300 font-bold text-sm">Maybe Later</Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}
