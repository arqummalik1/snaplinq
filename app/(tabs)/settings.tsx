import { ChevronDown, ChevronRight, Edit2, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { AddLinkModal } from '../../src/components/dashboard/AddLinkModal';
import { Input } from '../../src/components/ui/Input';
import { useLinks } from '../../src/context/LinkContext';

export default function SettingsScreen() {
    const { categories, links, deleteCategory, renameCategory, deleteLink, addCategory } = useLinks();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [editingCategory, setEditingCategory] = useState<{ oldName: string, newName: string } | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

    // Link editing
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [editingLink, setEditingLink] = useState<any>(null);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleRenameCategory = async () => {
        if (!editingCategory || !editingCategory.newName.trim()) return;
        try {
            await renameCategory(editingCategory.oldName, editingCategory.newName.trim());
            setEditingCategory(null);
        } catch (e) {
            // Alert handled in context
        }
    };

    const handleDeleteCategory = (category: string) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category}"? Links will be moved to Uncategorized.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category) }
            ]
        );
    };

    const handleDeleteLink = (id: string) => {
        Alert.alert(
            'Delete Link',
            'Are you sure you want to delete this link?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteLink(id) }
            ]
        );
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        addCategory(newCategoryName.trim());
        setNewCategoryName('');
        setShowAddCategoryModal(false);
    };

    const renderCategoryItem = ({ item: category }: { item: string }) => {
        const categoryLinks = links.filter(l => (l.category || 'Uncategorized') === category);
        const isExpanded = expandedCategories.includes(category);

        return (
            <View className="mb-4 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <View className="flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50">
                    <Pressable
                        className="flex-row items-center flex-1 gap-3"
                        onPress={() => toggleCategory(category)}
                    >
                        {isExpanded ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
                        <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {category} <Text className="text-slate-400 text-sm font-normal">({categoryLinks.length})</Text>
                        </Text>
                    </Pressable>

                    <View className="flex-row gap-2">
                        {category !== 'Uncategorized' && (
                            <>
                                <Pressable
                                    onPress={() => setEditingCategory({ oldName: category, newName: category })}
                                    className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full"
                                >
                                    <Edit2 size={16} className="text-slate-600 dark:text-slate-300" />
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDeleteCategory(category)}
                                    className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>

                {isExpanded && (
                    <View className="p-2">
                        {categoryLinks.length === 0 ? (
                            <Text className="text-slate-400 p-4 text-center italic">No links in this category</Text>
                        ) : (
                            categoryLinks.map(link => (
                                <View key={link.id} className="flex-row items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                                    <View className="flex-1 mr-4">
                                        <Text className="font-medium text-slate-700 dark:text-slate-300" numberOfLines={1}>{link.title}</Text>
                                        <Text className="text-xs text-slate-400" numberOfLines={1}>{link.url}</Text>
                                    </View>
                                    <View className="flex-row gap-2">
                                        <Pressable
                                            onPress={() => { setEditingLink(link); setShowLinkModal(true); }}
                                            className="p-2"
                                        >
                                            <Edit2 size={14} className="text-slate-400" />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => handleDeleteLink(link.id)}
                                            className="p-2"
                                        >
                                            <Trash2 size={14} className="text-red-400" />
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 pt-16 px-4">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-3xl font-bold text-slate-900 dark:text-white">Settings</Text>
                <Pressable
                    onPress={() => setShowAddCategoryModal(true)}
                    className="flex-row items-center gap-2 bg-emerald-500 px-4 py-2 rounded-xl"
                >
                    <Plus size={20} color="white" />
                    <Text className="text-white font-semibold">New Category</Text>
                </Pressable>
            </View>

            <FlatList
                data={categories}
                keyExtractor={item => item}
                renderItem={renderCategoryItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Rename Category Modal */}
            <Modal
                visible={!!editingCategory}
                transparent
                animationType="fade"
                onRequestClose={() => setEditingCategory(null)}
            >
                <View className="flex-1 bg-black/50 items-center justify-center p-4">
                    <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-xl">
                        <Text className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Rename Category</Text>
                        <Input
                            value={editingCategory?.newName}
                            onChangeText={(text) => setEditingCategory(prev => prev ? { ...prev, newName: text } : null)}
                            placeholder="Category Name"
                            className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 mb-4"
                        />
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setEditingCategory(null)}
                                className="flex-1 p-3 bg-slate-100 dark:bg-slate-700 rounded-xl items-center"
                            >
                                <Text className="font-semibold text-slate-600 dark:text-slate-300">Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleRenameCategory}
                                className="flex-1 p-3 bg-emerald-500 rounded-xl items-center"
                            >
                                <Text className="font-semibold text-white">Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Category Modal */}
            <Modal
                visible={showAddCategoryModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddCategoryModal(false)}
            >
                <View className="flex-1 bg-black/50 items-center justify-center p-4">
                    <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-xl">
                        <Text className="text-xl font-bold mb-4 text-slate-900 dark:text-white">New Category</Text>
                        <Input
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                            placeholder="Category Name"
                            className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 mb-4"
                        />
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setShowAddCategoryModal(false)}
                                className="flex-1 p-3 bg-slate-100 dark:bg-slate-700 rounded-xl items-center"
                            >
                                <Text className="font-semibold text-slate-600 dark:text-slate-300">Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleAddCategory}
                                className="flex-1 p-3 bg-emerald-500 rounded-xl items-center"
                            >
                                <Text className="font-semibold text-white">Create</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Link Modal (Reusing existing component) */}
            <AddLinkModal
                visible={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                editLink={editingLink}
            />
        </View>
    );
}
