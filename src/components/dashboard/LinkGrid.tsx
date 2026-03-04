import { Trash2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { useLinkContext } from '../../context/LinkContext';
import { LinkItem } from './LinkItem';

interface LinkGridProps {
    searchQuery: string;
    onEdit: (link: any) => void;
    contentContainerStyle?: any;
}

export const LinkGrid = ({ searchQuery, onEdit, contentContainerStyle }: LinkGridProps) => {
    const { links, categories, deleteCategory, loading } = useLinkContext();

    // Filter links based on search
    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group items by category
    const sections = useMemo(() => categories
        .map(category => ({
            title: category,
            data: filteredLinks.filter(l => (l.category || 'Uncategorized') === category)
        }))
        .filter(section => section.data.length > 0), [categories, filteredLinks]);

    const EmptyState = () => (
        <View className="flex-1 items-center justify-center pt-32 pb-20">
            <View className="w-24 h-24 bg-emerald-500/10 rounded-full items-center justify-center mb-6">
                <View className="w-16 h-16 bg-emerald-500/20 rounded-full items-center justify-center">
                    <Text className="text-4xl">✨</Text>
                </View>
            </View>
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Your Vault is Empty
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-center max-w-[280px] leading-relaxed">
                Start building your collection by adding your favorite links and resources.
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center pt-20">
                <View className="animate-pulse items-center">
                    <View className="w-12 h-12 bg-emerald-500/20 rounded-full mb-4" />
                    <Text className="text-slate-400 font-medium">Synchronizing your vault...</Text>
                </View>
            </View>
        );
    }

    if (filteredLinks.length === 0 && searchQuery.trim() !== '') {
        return (
            <View className="flex-1 items-center justify-center pt-32">
                <Text className="text-4xl mb-4">🔍</Text>
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">No results found</Text>
                <Text className="text-slate-400 mt-2">Try searching for something else</Text>
            </View>
        );
    }

    if (sections.length === 0) {
        return <EmptyState />;
    }

    return (
        <FlatList
            contentContainerStyle={contentContainerStyle}
            data={sections}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View className="h-40" />}
            renderItem={({ item: section }) => (
                <View className="mb-8">
                    {/* Category Header with Elite Spacing */}
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
                                onPress={() => deleteCategory(section.title)}
                                className="w-8 h-8 items-center justify-center rounded-full bg-red-500/5 active:bg-red-500/10"
                            >
                                <Trash2 size={14} color="#ef4444" opacity={0.6} />
                            </Pressable>
                        )}
                    </View>

                    {/* Elite Horizontal Scrolling Grid (iOS App Store Style) */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        decelerationRate="fast"
                    >
                        {section.data.map((link: any) => (
                            <LinkItem key={link.id} link={link} onEdit={onEdit} />
                        ))}
                    </ScrollView>
                </View>
            )}
        />
    );
};
