import AsyncStorage from '@react-native-async-storage/async-storage';
import { Download } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
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
        <Animated.View
            entering={FadeInDown.springify().damping(15)}
            exiting={FadeOutDown}
            className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-100 dark:border-slate-700 z-50 flex-row items-center gap-4"
        >
            <View className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-full">
                <Download size={24} color="#10b981" />
            </View>
            <View className="flex-1">
                <Text className="font-bold text-slate-900 dark:text-white mb-1">
                    Install Snaplinq
                </Text>
                <Text className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-tight">
                    {isIOS
                        ? "Tap the Share icon below and select 'Add to Home Screen' to install."
                        : "Install this app on your device for a better experience."}
                </Text>
            </View>
            <View className="flex-col gap-2">
                {!isIOS && (
                    <Pressable
                        onPress={handleInstall}
                        className="bg-emerald-500 px-4 py-2 rounded-xl active:scale-95 transition-transform items-center"
                    >
                        <Text className="text-white font-bold text-sm">Install</Text>
                    </Pressable>
                )}
                <Pressable
                    onPress={handleDismiss}
                    className="p-2 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 active:scale-95"
                >
                    <Text className="text-slate-500 dark:text-slate-300 font-bold text-sm">Dismiss</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}
