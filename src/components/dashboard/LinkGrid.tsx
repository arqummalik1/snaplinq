import { Trash2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useLinkContext } from '../../context/LinkContext';
import { LinkItem } from './LinkItem';

interface LinkGridProps {
    searchQuery: string;
    onEdit: (link: any) => void;
    contentContainerStyle?: any;
    ListHeaderComponent?: any;
}

export const LinkGrid = ({ searchQuery, onEdit, contentContainerStyle, ListHeaderComponent }: LinkGridProps) => {
    const { links, categories, deleteCategory, loading } = useLinkContext();
    const { width } = useWindowDimensions();

    // Responsive columns
    // Mobile: 4 columns for denser grid as requested
    // Tablet/Desktop: progressively more
    const numColumns = width < 640 ? 4 : width < 1024 ? 6 : width < 1280 ? 8 : 10;

    // Filter links
    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group items for SectionList
    const sections = useMemo(() => categories
        .map(category => ({
            title: category,
            data: filteredLinks.filter(l => (l.category || 'Uncategorized') === category)
        })), [categories, filteredLinks]);

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

    // Handle empty search results
    if (filteredLinks.length === 0 && searchQuery.trim() !== '') {
        return (
            <View className="flex-1 items-center justify-center pt-32">
                <Text className="text-4xl mb-4">🔍</Text>
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">No results found</Text>
                <Text className="text-slate-400 mt-2">Try searching for something else</Text>
            </View>
        );
    }

    if (filteredLinks.length === 0 && categories.length === 1 && categories[0] === 'Uncategorized') {
        return <EmptyState />;
    }

    return (
        <View className="flex-1 px-4">
            <FlatList
                contentContainerStyle={contentContainerStyle}
                data={sections}
                keyExtractor={(item) => item.title}
                renderItem={({ item: section }) => {
                    if (section.data.length === 0) return null;

                    const chunkedData = [];
                    for (let i = 0; i < section.data.length; i += numColumns) {
                        chunkedData.push(section.data.slice(i, i + numColumns));
                    }

                    return (
                        <View className="mb-5">
                            {/* Category Header */}
                            <View className="flex-row items-center justify-between mb-4 pl-3 pr-2">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                                    <View>
                                        <Text className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                            {section.title}
                                        </Text>
                                        <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-[1.5px] -mt-0.5">
                                            {section.data.length} {section.data.length === 1 ? 'Link' : 'Links'}
                                        </Text>
                                    </View>
                                </View>

                                {section.title !== 'Uncategorized' && section.data.length === 0 && (
                                    <Pressable
                                        onPress={() => deleteCategory(section.title)}
                                        className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <Trash2 size={18} className="text-red-500 opacity-70" />
                                    </Pressable>
                                )}
                            </View>

                            {/* Grid container */}
                            <View>
                                {chunkedData.map((row, rowIndex) => (
                                    <View key={rowIndex} className="flex-row justify-between mb-1">
                                        {row.map((link: any) => (
                                            <View key={link.id} style={{ width: `${100 / numColumns}%` }} className="items-center">
                                                <LinkItem link={link} onEdit={onEdit} />
                                            </View>
                                        ))}
                                        {/* Fill remaining space */}
                                        {Array.from({ length: numColumns - row.length }).map((_, i) => (
                                            <View key={`empty-${rowIndex}-${i}`} style={{ width: `${100 / numColumns}%` }} />
                                        ))}
                                    </View>
                                ))}

                                {/* Show message for empty customizable categories */}
                                {section.data.length === 0 && section.title !== 'Uncategorized' && (
                                    <View className="py-8 items-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl mx-2">
                                        <Text className="text-slate-400 text-sm">No apps in this folder</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )
                }}
                ListFooterComponent={<View className="h-32" />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
