import { FolderOpen, FolderPlus, LogOut, Moon, Sun, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Modal } from '../../src/components/ui/Modal';
import { useAuth } from '../../src/context/AuthContext';
import { useLinkContext } from '../../src/context/LinkContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function SettingsScreen() {
    const { signOut } = useAuth();
    const { categories, addCategory, deleteCategory, renameCategory } = useLinkContext();
    const { isDark, toggleTheme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);

    const handleSave = async () => {
        if (!newCategoryName.trim()) return;

        try {
            if (editingCategory) {
                await renameCategory(editingCategory, newCategoryName);
            } else {
                addCategory(newCategoryName);
            }
            setShowModal(false);
            setNewCategoryName('');
            setEditingCategory(null);
        } catch {
            Alert.alert("Error", "Failed to save category");
        }
    };

    const handleDelete = (name: string) => {
        Alert.alert(
            "Delete Category",
            "Are you sure? This will not delete the links inside it (they will be uncategorized).",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteCategory(name) }
            ]
        );
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 pt-12 px-4">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-3xl font-bold text-slate-900 dark:text-white">Settings</Text>
                <View className="flex-row gap-2">
                    <Pressable
                        onPress={toggleTheme}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full active:opacity-70"
                    >
                        {isDark ? (
                            <Sun size={20} className="text-amber-500" />
                        ) : (
                            <Moon size={20} className="text-indigo-500" />
                        )}
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            Alert.alert("Log Out", "Are you sure you want to log out?", [
                                { text: "Cancel", style: "cancel" },
                                { text: "Log Out", style: "destructive", onPress: signOut }
                            ]);
                        }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full active:opacity-70"
                    >
                        <LogOut size={20} className="text-slate-600 dark:text-slate-300" />
                    </Pressable>
                </View>
            </View>

            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-slate-800 dark:text-slate-200">Categories</Text>
                <Pressable
                    onPress={() => { setEditingCategory(null); setNewCategoryName(''); setShowModal(true); }}
                    className="flex-row items-center bg-emerald-500 px-3 py-2 rounded-full active:opacity-80"
                >
                    <FolderPlus size={18} color="white" />
                    <Text className="text-white font-medium ml-2">Add New</Text>
                </Pressable>
            </View>

            <FlatList
                data={categories}
                keyExtractor={item => item}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <View className="bg-white dark:bg-slate-800 p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700">
                        <View className="flex-row items-center">
                            <FolderOpen size={20} color={isDark ? '#cbd5e1' : '#64748b'} />
                            <Text className="text-slate-700 dark:text-slate-200 ml-3 text-lg font-medium">{item}</Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <Pressable onPress={() => { setEditingCategory(item); setNewCategoryName(item); setShowModal(true); }}>
                                <Text className="text-emerald-600 font-medium">Edit</Text>
                            </Pressable>
                            <Pressable onPress={() => handleDelete(item)}>
                                <Trash2 size={20} color="#ef4444" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />




            <Modal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
            >
                <Input
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                />
                <Button onPress={handleSave} className="mt-4">Save</Button>
            </Modal>
        </View>
    );
}
