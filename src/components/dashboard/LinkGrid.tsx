import { FlashList } from '@shopify/flash-list';
import { Trash2 } from 'lucide-react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useLinkContext } from '../../context/LinkContext';
import { Link } from '../../types';
import { LinkItemSkeleton } from '../ui/Skeleton';
import { EmptyState } from './EmptyState';
import { LinkItem } from './LinkItem';

interface LinkGridProps {
    searchQuery: string;
    onEdit: (link: Link) => void;
    onAddLink?: () => void;
    contentContainerStyle?: any;
    onScroll?: any;
}

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export const LinkGrid = memo(({ searchQuery, onEdit, onAddLink, contentContainerStyle, onScroll }: LinkGridProps) => {
    const { links, recentLinks, dailyRecommendations, categories, deleteCategory, loading } = useLinkContext();

    const isSearching = useMemo(() => searchQuery.trim() !== '', [searchQuery]);

    // Filter links based on search
    const filteredLinks = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return links.filter(
            (link) => link.title.toLowerCase().includes(query) || link.url.toLowerCase().includes(query)
        );
    }, [links, searchQuery]);

    // Group items by category
    const sections = useMemo(() => {
        return categories
            .map((category) => ({
                title: category,
                data: filteredLinks.filter((l) => (l.category || 'Uncategorized') === category),
            }))
            .filter((section) => section.data.length > 0);
    }, [categories, filteredLinks]);

    const handleDeleteCategory = useCallback((name: string) => {
        deleteCategory(name);
    }, [deleteCategory]);

    const LoadingState = () => (
        <View className="px-6 pt-10">
            <View className="mb-8">
                <View className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 opacity-50" />
                <View className="flex-row">
                    <LinkItemSkeleton />
                    <LinkItemSkeleton />
                    <LinkItemSkeleton />
                </View>
            </View>
            <View className="mb-8">
                <View className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 opacity-50" />
                <View className="flex-row">
                    <LinkItemSkeleton />
                    <LinkItemSkeleton />
                    <LinkItemSkeleton />
                </View>
            </View>
        </View>
    );

    if (loading) {
        return <LoadingState />;
    }

    if (filteredLinks.length === 0 && isSearching) {
        return (
            <View className="flex-1 items-center justify-center pt-32">
                <Text className="text-4xl mb-4">🔍</Text>
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">No results found</Text>
                <Text className="text-slate-400 mt-2">Try searching for something else</Text>
            </View>
        );
    }

    if (links.length === 0) {
        return <EmptyState onAddPress={onAddLink || (() => { })} />;
    }

    const HorizontalSection = ({
        title,
        subtitle,
        data,
    }: {
        title: string;
        subtitle?: string;
        data: Link[];
    }) => {
        if (data.length === 0) return null;
        return (
            <View className="mb-8">
                <View className="flex-row items-center justify-between mb-5 px-6">
                    <View className="flex-row items-center gap-3">
                        <View className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                        <View>
                            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {title}
                            </Text>
                            {subtitle && (
                                <Text className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] -mt-1">
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    decelerationRate="fast"
                >
                    {data.map((link) => (
                        <LinkItem key={`${title}-${link.id}`} link={link} onEdit={onEdit} />
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <AnimatedFlashList
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={contentContainerStyle}
            data={sections}
            keyExtractor={(item: any) => item.title}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                !isSearching ? (
                    <View>
                        <HorizontalSection
                            title="Daily Picks"
                            subtitle="Curated for you today"
                            data={dailyRecommendations}
                        />
                        <HorizontalSection title="Recents" subtitle="Jump back in" data={recentLinks} />
                        <View className="h-4" />
                    </View>
                ) : null
            }
            ListFooterComponent={<View className="h-40" />}
            renderItem={({ item: section }: any) => (
                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-5 px-6">
                        <View className="flex-row items-center gap-3">
                            <View className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            <View>
                                <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {section.title}
                                </Text>
                                <Text className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] -mt-1">
                                    {section.data.length} {section.data.length === 1 ? 'Link' : 'Links'}
                                </Text>
                            </View>
                        </View>

                        {section.title !== 'Uncategorized' && (
                            <Pressable
                                onPress={() => handleDeleteCategory(section.title)}
                                className="w-8 h-8 items-center justify-center rounded-full bg-red-500/5 active:bg-red-500/10"
                            >
                                <Trash2 size={14} color="#ef4444" opacity={0.6} />
                            </Pressable>
                        )}
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        decelerationRate="fast"
                    >
                        {section.data.map((link: Link) => (
                            <LinkItem key={link.id} link={link} onEdit={onEdit} />
                        ))}
                    </ScrollView>
                </View>
            )}
        />
    );
});
