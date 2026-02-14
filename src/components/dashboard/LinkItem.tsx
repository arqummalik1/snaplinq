import { View, Text, Image, Pressable, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { MoreVertical, ExternalLink, Trash2, Edit2 } from 'lucide-react-native';
import { useLinks } from '../../context/LinkContext';
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

// Utility to start web browser
const openLink = async (url: string) => {
    try {
        await WebBrowser.openBrowserAsync(url);
    } catch (e) {
        console.error(e);
    }
};

export const LinkItem = ({ link, onEdit }: { link: any, onEdit: (link: any) => void }) => {
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
        <View className="flex-1 m-2">
            <Pressable
                onPress={() => openLink(link.url)}
                onLongPress={() => setShowMenu(true)}
                delayLongPress={500}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 items-center justify-center aspect-square relative"
            >
                {/* Icon */}
                <View className="w-14 h-14 mb-3 rounded-2xl shadow-sm bg-white dark:bg-slate-700 items-center justify-center overflow-hidden">
                    {!imageError && link.icon ? (
                        <Image
                            source={{ uri: link.icon }}
                            className="w-full h-full"
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View className="w-full h-full bg-slate-100 dark:bg-slate-600 items-center justify-center">
                            <Text className="text-2xl font-bold text-slate-400">{initial}</Text>
                        </View>
                    )}
                </View>

                {/* Title */}
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200 text-center w-full" numberOfLines={2}>
                    {link.title}
                </Text>

                {/* Context Menu Trigger (Visual only, on long press) */}
                <Pressable
                    className="absolute top-2 right-2 p-1"
                    onPress={() => setShowMenu(true)}
                >
                    <MoreVertical size={16} color="#94a3b8" />
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
};
