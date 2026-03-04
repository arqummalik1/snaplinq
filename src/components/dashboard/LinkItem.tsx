import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { MoreHorizontal } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { LiquidAlert } from '../../components/ui/LiquidAlert';
import { useLinkContext } from '../../context/LinkContext';
import { LinkOptionsSheet } from './LinkOptionsSheet';

// Utility to open link in browser
const openLink = async (url: string) => {
    try {
        await WebBrowser.openBrowserAsync(url);
    } catch (e) {
        console.error(e);
    }
};

// Google-style colorful gradients for fallback icons
const FALLBACK_COLORS = [
    ['#4285F4', '#34A853'], // Google Blue/Green
    ['#EA4335', '#FBBC05'], // Google Red/Yellow
    ['#10b981', '#3b82f6'], // Emerald/Blue
    ['#8b5cf6', '#ec4899'], // Violet/Pink
    ['#f97316', '#ef4444'], // Orange/Red
    ['#06b6d4', '#8b5cf6'], // Cyan/Violet
];

const getFallbackColors = (title: string) => {
    const charCode = title.charCodeAt(0) || 0;
    return FALLBACK_COLORS[charCode % FALLBACK_COLORS.length];
};

const LinkItemComponent = ({ link, onEdit }: { link: any, onEdit: (link: any) => void }) => {
    const { deleteLink, markVisited } = useLinkContext();
    const [showMenu, setShowMenu] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Initial for fallback
    const title = link.title || 'App';
    const initial = title.charAt(0).toUpperCase();
    const colors = getFallbackColors(title) as [string, string];

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handlePress = async () => {
        try {
            await markVisited(link.id);
            await openLink(link.url);
        } catch (e) {
            console.error("Link Open Error:", e);
        }
    };

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteLink(link.id);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to delete link. Please try again.');
        } finally {
            setShowDeleteAlert(false);
        }
    };


    return (
        <View className="items-center w-[84px] sm:w-[100px] mb-6">
            <Pressable
                onPress={handlePress}
                onLongPress={() => setShowMenu(true)}
                delayLongPress={500}
                className="group items-center w-full"
            >
                {/* Elite Apple-Style Icon Card */}
                <View className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] mb-2 bg-white/90 dark:bg-slate-800/90 rounded-[22px] sm:rounded-[28px] items-center justify-center overflow-hidden shadow-sm border border-white/50 dark:border-slate-700/50 backdrop-blur-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-95 group-hover:shadow-emerald-500/20">
                    {!imageError && link.icon ? (
                        <Image
                            source={{ uri: link.icon }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <LinearGradient
                            colors={colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-full h-full items-center justify-center"
                        >
                            <Text className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">{initial}</Text>
                        </LinearGradient>
                    )}

                    {/* Visited Status Indicator (Liquid Glass Dot) */}
                    {!link.visited && (
                        <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm z-10" />
                    )}

                    {/* Premium Hover Overlay */}
                    <View className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </View>

                {/* Highly Readable Elite Typography */}
                <View className="h-[32px] justify-start items-center px-1">
                    <Text
                        className={`text-[11px] sm:text-[12px] font-bold text-center leading-tight tracking-tight transition-colors ${link.visited
                                ? 'text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-100'
                            } group-hover:text-emerald-500 dark:group-hover:text-emerald-400`}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {link.title}
                    </Text>
                </View>

                {/* Discreet Web Context Menu */}
                {Platform.OS === 'web' && (
                    <Pressable
                        className="absolute -top-1 -right-1 w-6 h-6 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500 hover:scale-110 border border-slate-100 dark:border-slate-600"
                        onPress={(e) => {
                            e.stopPropagation();
                            setShowMenu(true);
                        }}
                    >
                        <MoreHorizontal size={12} color="#64748b" />
                    </Pressable>
                )}
            </Pressable>

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
