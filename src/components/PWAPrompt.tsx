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
        <>
            {/* Background overlay */}
            <View style={StyleSheet.absoluteFill} className="bg-black/60" />
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none" className="items-center justify-center p-6 z-50">
                <Animated.View
                    entering={FadeInDown.springify().damping(15)}
                    exiting={FadeOutDown}
                    className="w-full max-w-[360px] bg-[#18181B] rounded-3xl p-5 shadow-2xl border border-[#27272A]"
                >
                    <View className="flex-row items-center gap-4">
                        <View className="bg-emerald-500/20 p-3 rounded-2xl">
                            <Download size={24} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-white text-base mb-1">
                                Install App
                            </Text>
                            <Text className="text-xs text-zinc-400 leading-snug">
                                {isIOS
                                    ? "Tap Share → Add to Home Screen"
                                    : "Add to your home screen for the best experience"}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row gap-2 mt-4">
                        {!isIOS && (
                            <Pressable
                                onPress={handleInstall}
                                className="flex-1 bg-emerald-500 py-2.5 rounded-xl items-center active:scale-98"
                            >
                                <Text className="text-white font-semibold text-sm">Install</Text>
                            </Pressable>
                        )}
                        <Pressable
                            onPress={handleDismiss}
                            className="flex-1 bg-[#27272A] py-2.5 rounded-xl items-center active:scale-98"
                        >
                            <Text className="text-zinc-300 font-medium text-sm">Later</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </>
    );
}
