import * as WebBrowser from 'expo-web-browser';
import { MoreVertical } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
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
        <View className="flex-1 m-1.5">
            <Pressable
                onPress={() => openLink(link.url)}
                onLongPress={() => setShowMenu(true)}
                delayLongPress={500}
                className="group flex-row items-center bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
                {/* Large Icon Box */}
                <View className="w-12 h-12 mr-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 p-1 items-center justify-center border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                    {!imageError && link.icon ? (
                        <Image
                            source={{ uri: link.icon }}
                            className="w-full h-full rounded-lg"
                            resizeMode="contain"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Text className="text-xl font-bold text-slate-400">{initial}</Text>
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 pr-2">
                    <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" numberOfLines={1}>
                        {link.title}
                    </Text>
                    <Text className="text-xs text-slate-400 dark:text-slate-500" numberOfLines={1}>
                        {new URL(link.url).hostname.replace('www.', '')}
                    </Text>
                </View>

                {/* Context Menu Trigger */}
                <Pressable
                    className="p-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-all"
                    onPress={(e) => {
                        e.stopPropagation();
                        setShowMenu(true);
                    }}
                >
                    <MoreVertical size={16} className="text-slate-400 dark:text-slate-500" />
                </Pressable>
            </Pressable>

            {/* Configurable Menu Modal (Shared for Mobile/Web) */}
            <Modal visible={showMenu} onClose={() => setShowMenu(false)} title="Options">
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
