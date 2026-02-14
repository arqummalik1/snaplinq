import { Trash2 } from 'lucide-react-native';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useLinks } from '../../context/LinkContext';
import { LinkItem } from './LinkItem';

interface LinkGridProps {
    searchQuery: string;
    onEdit: (link: any) => void;
}

export const LinkGrid = ({ searchQuery, onEdit }: LinkGridProps) => {
    const { links, categories, deleteCategory, loading } = useLinks();
    const { width } = useWindowDimensions();

    // Responsive columns: Mobile=2, Tablet=4, Desktop=6
    const numColumns = width > 1280 ? 10 : width > 1024 ? 8 : width > 768 ? 5 : width > 640 ? 4 : 2;

    // Filter links
    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by category
    const groupedLinks: Record<string, typeof links> = {};
    filteredLinks.forEach(link => {
        const cat = link.category || 'Uncategorized';
        if (!groupedLinks[cat]) groupedLinks[cat] = [];
        groupedLinks[cat].push(link);
    });

    // Sort categories (custom order + alphabetical)
    const sortedCategories = categories.filter(c => groupedLinks[c]?.length > 0);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center pt-20">
                <Text className="text-slate-500">Loading your vault...</Text>
            </View>
        );
    }

    if (filteredLinks.length === 0) {
        return (
            <View className="flex-1 items-center justify-center pt-20">
                <Text className="text-slate-500 text-lg">No links found</Text>
                <Text className="text-slate-400 text-sm mt-2">Tap + to add your first link</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 px-2">
            {sortedCategories.map(category => (
                <View key={category} className="mb-6">
                    {/* Category Header */}
                    <View className="flex-row items-center justify-between mb-2 px-2">
                        <View className="flex-row items-center space-x-2">
                            <View className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                {category} <Text className="text-slate-400 text-sm font-normal">({groupedLinks[category].length})</Text>
                            </Text>
                        </View>
                        {category !== 'Uncategorized' && (
                            <Pressable onPress={() => deleteCategory(category)} className="p-2">
                                <Trash2 size={16} color="#94a3b8" />
                            </Pressable>
                        )}
                    </View>

                    {/* Grid */}
                    <FlatList
                        data={groupedLinks[category]}
                        key={`grid-${numColumns}-${category}`} // Force re-render on column change
                        numColumns={numColumns}
                        scrollEnabled={false} // Since we are mapping categories, list is inside scrollview usually. 
                        // Wait, nesting FlatLists is bad. 
                        // Better approach: One SectionList or FlatList with sections.
                        // But for now, mapping Views is easier for "grouped" layout visuals.
                        renderItem={({ item }) => (
                            <View style={{ width: `${100 / numColumns}%` }}>
                                <LinkItem link={item} onEdit={onEdit} />
                            </View>
                        )}
                    />
                </View>
            ))}
            <View className="h-24" /> {/* Bottom padding */}
        </View>
    );
};
