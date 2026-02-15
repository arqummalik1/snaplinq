import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { MoreHorizontal } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { LiquidAlert } from '../../components/ui/LiquidAlert';
import { useLinkContext } from '../../context/LinkContext';
import { LinkOptionsSheet } from './LinkOptionsSheet';

// Utility to start web browser
const openLink = async (url: string) => {
    try {
        await WebBrowser.openBrowserAsync(url);
    } catch (e) {
        console.error(e);
    }
};


const LinkItemComponent = ({ link, onEdit }: { link: any, onEdit: (link: any) => void }) => {
    const { deleteLink } = useLinkContext();
    const [showMenu, setShowMenu] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Initial for fallback
    const initial = link.title.charAt(0).toUpperCase();

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteLink(link.id);
        } catch (e) {
            console.error(e);
            alert("Failed to delete"); // Fallback for error
        } finally {
            setShowDeleteAlert(false);
        }
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
                <View className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] mb-2 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl items-center justify-center overflow-hidden shadow-sm hover:scale-105 active:scale-95 transition-transform duration-200 border border-slate-200/50 dark:border-slate-700/50">
                    {!imageError && link.icon ? (
                        <Image
                            source={{ uri: link.icon }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
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

            <LinkOptionsSheet
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                onOpen={() => { setShowMenu(false); openLink(link.url); }}
                onEdit={() => { setShowMenu(false); onEdit(link); }}
                onDelete={handleDeleteClick}
            />

            <LiquidAlert
                visible={showDeleteAlert}
                title="Delete Link"
                message="Are you sure you want to delete this link? This action cannot be undone."
                onClose={() => setShowDeleteAlert(false)}
                onConfirm={confirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </View>
    );
};

LinkItemComponent.displayName = 'LinkItem';
export const LinkItem = memo(LinkItemComponent);
