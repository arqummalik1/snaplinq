import * as WebBrowser from 'expo-web-browser';
import { MoreHorizontal } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import { useLinks } from '../../context/LinkContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

// Utility to start web browser
const openLink = async (url: string) => {
    try {
        await WebBrowser.openBrowserAsync(url);
    } catch (e) {
        console.error(e);
    }
};

export const LinkItem = memo(({ link, onEdit }: { link: any, onEdit: (link: any) => void }) => {
    const { deleteLink } = useLinks();
    const [showMenu, setShowMenu] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Initial for fallback
    const initial = link.title.charAt(0).toUpperCase();

    const handleDelete = () => {
        Alert.alert(
            "Delete Link",
            "Are you sure you want to delete this link?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteLink(link.id) }
            ]
        );
        setShowMenu(false);
    };

    return (
        <View className="items-center mb-6">
            <Pressable
                onPress={() => openLink(link.url)}
                onLongPress={() => setShowMenu(true)}
                delayLongPress={500}
                className="group items-center justify-center"
            >
                {/* iOS App Icon Shape */}
                <View className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] mb-2 bg-white dark:bg-slate-800 rounded-[14px] sm:rounded-[18px] items-center justify-center overflow-hidden shadow-sm hover:scale-105 active:scale-95 transition-transform duration-200 border border-slate-200/50 dark:border-slate-700/50">
                    {!imageError && link.icon ? (
                        <Image
                            source={{ uri: link.icon }}
                            className="w-full h-full"
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View className="w-full h-full bg-slate-100 dark:bg-slate-700 items-center justify-center">
                            <Text className="text-2xl sm:text-3xl font-bold text-slate-400">{initial}</Text>
                        </View>
                    )}
                </View>

                {/* App Label */}
                <Text
                    className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 text-center w-full px-1"
                    numberOfLines={1}
                >
                    {link.title}
                </Text>
            </Pressable>

            {/* Context Menu Trigger (optional / alternative to long press) */}
            {Platform.OS === 'web' && (
                <Pressable
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-200 dark:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPress={(e) => {
                        e.stopPropagation();
                        setShowMenu(true);
                    }}
                >
                    <MoreHorizontal size={12} className="text-slate-500 dark:text-slate-400" />
                </Pressable>
            )}

            {/* Configurable Menu Modal */}
            <Modal visible={showMenu} onClose={() => setShowMenu(false)} title={link.title}>
                <View className="space-y-3">
                    <Button variant="secondary" onPress={() => openLink(link.url)}>
                        Open Link
                    </Button>
                    <Button variant="secondary" onPress={() => { setShowMenu(false); onEdit(link); }}>
                        Edit Link
                    </Button>
                    <Button variant="danger" onPress={handleDelete}>
                        Delete Link
                    </Button>
                </View>
            </Modal>
        </View>
    );
});

