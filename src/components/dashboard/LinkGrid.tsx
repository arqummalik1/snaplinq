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
            data: filteredLinks.filter(l => (l.category || 'Uncategorized') === category) // Note: This filter is O(N*M), could be optimized but fine for <1000 links
        })), [categories, filteredLinks]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center pt-20">
                <Text className="text-slate-500">Loading your vault...</Text>
            </View>
        );
    }

    // Handle empty search results
    if (filteredLinks.length === 0 && searchQuery.trim() !== '') {
        return (
            <View className="flex-1 items-center justify-center pt-20">
                <Text className="text-slate-500 text-lg">No results found</Text>
                <Text className="text-slate-400 text-sm mt-2">Try a different search term</Text>
            </View>
        );
    }

    if (filteredLinks.length === 0 && categories.length === 1 && categories[0] === 'Uncategorized') {
        return (
            <View className="flex-1 items-center justify-center pt-20">
                <Text className="text-slate-500 text-lg">No links found</Text>
                <Text className="text-slate-400 text-sm mt-2">Tap + to add your first link</Text>
            </View>
        );
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
                            <View className="flex-row items-center justify-between mb-3 pl-2">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-1 h-5 bg-emerald-500 rounded-full" />
                                    <Text className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                        {section.title}
                                    </Text>
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
