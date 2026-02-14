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

    // Responsive columns: Mobile=1, Small Tablet=2, Tablet=3, Desktop=4/5/6
    const numColumns = width > 1536 ? 6 : width > 1280 ? 5 : width > 1024 ? 4 : width > 768 ? 3 : width > 640 ? 2 : 1;

    // Filter links
    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group items for SectionList
    const sections = categories
        .map(category => ({
            title: category,
            data: filteredLinks.filter(l => (l.category || 'Uncategorized') === category)
        }))
        .filter(section => section.data.length > 0);

    // Helper to chunk data for grid layout in SectionList
    const formatData = (data: any[], numColumns: number) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }
        return data;
    }

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
            <FlatList
                data={sections}
                keyExtractor={(item) => item.title}
                renderItem={({ item: section }) => {
                    const chunkedData = [];
                    for (let i = 0; i < section.data.length; i += numColumns) {
                        chunkedData.push(section.data.slice(i, i + numColumns));
                    }

                    return (
                        <View className="mb-6">
                            {/* Category Header */}
                            <View className="flex-row items-center justify-between mb-4 px-2 pt-2">
                                <View className="flex-row items-center gap-3">
                                    <View className="h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center">
                                        <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">{section.data.length}</Text>
                                    </View>
                                    <Text className="text-base font-bold text-slate-700 dark:text-slate-200 tracking-wide uppercase opacity-90">
                                        {section.title}
                                    </Text>
                                </View>

                                {section.title !== 'Uncategorized' && (
                                    <Pressable
                                        onPress={() => deleteCategory(section.title)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
                                    >
                                        <Trash2 size={16} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                                    </Pressable>
                                )}
                            </View>
                            {/* Grid Rows */}
                            <View>
                                {chunkedData.map((row, rowIndex) => (
                                    <View key={rowIndex} className="flex-row">
                                        {row.map((link) => (
                                            <View key={link.id} style={{ width: `${100 / numColumns}%` }}>
                                                <LinkItem link={link} onEdit={onEdit} />
                                            </View>
                                        ))}
                                        {/* Fill remaining space in the row if needed */}
                                        {Array.from({ length: numColumns - row.length }).map((_, i) => (
                                            <View key={`empty-${rowIndex}-${i}`} style={{ width: `${100 / numColumns}%` }} />
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )
                }}
                ListFooterComponent={<View className="h-24" />}
            />
        </View>
    );
};
