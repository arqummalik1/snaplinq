import {
    AppWindow,
    ChevronDown,
    ChevronRight,
    FolderOpen,
    FolderPlus,
    Info,
    LogOut,
    Moon,
    Palette,
    Sun,
    Trash2,
    User
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Modal } from '../../src/components/ui/Modal';
import { useAuth } from '../../src/context/AuthContext';
import { useLinkContext } from '../../src/context/LinkContext';
import { useTheme } from '../../src/context/ThemeContext';

type ThemeOption = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
    const { signOut, user } = useAuth();
    const { categories, addCategory, deleteCategory, renameCategory } = useLinkContext();
    const { theme: currentTheme, setTheme, isDark } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [categoriesExpanded, setCategoriesExpanded] = useState(true);

    const handleSave = async () => {
        if (!newCategoryName.trim()) return;

        try {
            if (editingCategory) {
                await renameCategory(editingCategory, newCategoryName);
            } else {
                await addCategory(newCategoryName);
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

    const ThemeCard = ({ option, label, icon: Icon, selected }: { 
        option: ThemeOption; 
        label: string; 
        icon: any;
        selected: boolean;
    }) => (
        <Pressable
            onPress={() => setTheme(option)}
            className={`flex-1 p-4 rounded-2xl items-center justify-center transition-all ${
                selected 
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-100 dark:bg-slate-800'
            }`}
        >
            <View className={`p-3 rounded-full mb-2 ${selected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <Icon 
                    size={24} 
                    color={selected ? 'white' : isDark ? '#cbd5e1' : '#64748b'} 
                />
            </View>
            <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                {label}
            </Text>
        </Pressable>
    );

    const SettingSection = ({ title, icon: Icon, children }: { 
        title: string; 
        icon: any;
        children: React.ReactNode;
    }) => (
        <View className="mb-6">
            <View className="flex-row items-center mb-3 px-1">
                <Icon size={18} className="text-slate-400 mr-2" />
                <Text className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</Text>
            </View>
            <View className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
                {children}
            </View>
        </View>
    );

    const SettingRow = ({ 
        icon: Icon, 
        title, 
        subtitle, 
        onPress, 
        rightElement,
        danger = false 
    }: { 
        icon: any; 
        title: string; 
        subtitle?: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
        danger?: boolean;
    }) => (
        <Pressable 
            onPress={onPress}
            className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 active:bg-slate-50 dark:active:bg-slate-700/50"
        >
            <View className="flex-row items-center flex-1">
                <View className={`p-2.5 rounded-xl ${danger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Icon 
                        size={20} 
                        color={danger ? '#ef4444' : isDark ? '#cbd5e1' : '#64748b'} 
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text className={`text-base font-semibold ${danger ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</Text>
                    )}
                </View>
            </View>
            {rightElement || (onPress && (
                <ChevronRight size={20} className="text-slate-300" />
            ))}
        </Pressable>
    );

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View className="pt-14 px-5 pb-6">
                    <Text className="text-3xl font-bold text-slate-900 dark:text-white">Settings</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-1">Manage your preferences</Text>
                </View>

                {/* Profile Card */}
                <View className="mx-5 mb-6">
                    <View className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-lg shadow-emerald-500/25">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                                <User size={28} color="white" />
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-white text-lg font-bold">
                                    {user?.email?.split('@')[0] || 'User'}
                                </Text>
                                <Text className="text-white/80 text-sm">
                                    {user?.email || 'Sign in to sync your data'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Appearance Section */}
                <View className="px-5">
                    <SettingSection title="Appearance" icon={Palette}>
                        <View className="p-4">
                            <Text className="text-slate-600 dark:text-slate-300 font-medium mb-3">Theme</Text>
                            <View className="flex-row gap-3">
                                <ThemeCard 
                                    option="light" 
                                    label="Light" 
                                    icon={Sun} 
                                    selected={currentTheme === 'light'} 
                                />
                                <ThemeCard 
                                    option="dark" 
                                    label="Dark" 
                                    icon={Moon} 
                                    selected={currentTheme === 'dark'} 
                                />
                                <ThemeCard 
                                    option="system" 
                                    label="System" 
                                    icon={AppWindow} 
                                    selected={currentTheme === 'system'} 
                                />
                            </View>
                        </View>
                    </SettingSection>
                </View>

                {/* Categories Section */}
                <View className="px-5">
                    <SettingSection title="Categories" icon={FolderOpen}>
                        <Pressable 
                            onPress={() => setCategoriesExpanded(!categoriesExpanded)}
                            className="flex-row items-center justify-between p-4"
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700">
                                    <FolderOpen size={20} color={isDark ? '#cbd5e1' : '#64748b'} />
                                </View>
                                <View className="ml-3">
                                    <Text className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                        Manage Categories
                                    </Text>
                                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                                        {categories.length} category{categories.length !== 1 ? 'ies' : ''}
                                    </Text>
                                </View>
                            </View>
                            {categoriesExpanded ? (
                                <ChevronDown size={20} className="text-slate-400" />
                            ) : (
                                <ChevronRight size={20} className="text-slate-400" />
                            )}
                        </Pressable>

                        {categoriesExpanded && (
                            <View className="border-t border-slate-100 dark:border-slate-700">
                                {categories.map((category, index) => (
                                    <View 
                                        key={category}
                                        className={`flex-row items-center justify-between p-4 ${
                                            index !== categories.length - 1 
                                                ? 'border-b border-slate-100 dark:border-slate-700' 
                                                : ''
                                        }`}
                                    >
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-2 h-2 rounded-full bg-emerald-400 mr-3" />
                                            <Text className="text-slate-700 dark:text-slate-200 font-medium">
                                                {category}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <Pressable 
                                                onPress={() => { 
                                                    setEditingCategory(category); 
                                                    setNewCategoryName(category); 
                                                    setShowModal(true); 
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700"
                                            >
                                                <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Edit</Text>
                                            </Pressable>
                                            <Pressable 
                                                onPress={() => handleDelete(category)}
                                                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20"
                                            >
                                                <Trash2 size={16} color="#ef4444" />
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}

                                {categories.length === 0 && (
                                    <View className="p-4 items-center">
                                        <Text className="text-slate-400 text-sm">No categories yet</Text>
                                    </View>
                                )}

                                <Pressable 
                                    onPress={() => { 
                                        setEditingCategory(null); 
                                        setNewCategoryName(''); 
                                        setShowModal(true); 
                                    }}
                                    className="flex-row items-center justify-center p-4 border-t border-slate-100 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/10"
                                >
                                    <FolderPlus size={18} color="#10b981" />
                                    <Text className="text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
                                        Add New Category
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </SettingSection>
                </View>

                {/* About Section */}
                <View className="px-5">
                    <SettingSection title="About" icon={Info}>
                        <SettingRow 
                            icon={AppWindow} 
                            title="SnapLinq" 
                            subtitle="Version 1.0.0"
                        />
                        <SettingRow 
                            icon={Info} 
                            title="About" 
                            subtitle="Your personal link manager"
                            onPress={() => Alert.alert("SnapLinq", "A beautiful link management app to organize your favorite links with categories and quick access.")}
                        />
                    </SettingSection>
                </View>

                {/* Logout Section */}
                <View className="px-5 mt-2">
                    <Pressable
                        onPress={() => {
                            Alert.alert("Log Out", "Are you sure you want to log out?", [
                                { text: "Cancel", style: "cancel" },
                                { text: "Log Out", style: "destructive", onPress: signOut }
                            ]);
                        }}
                        className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl flex-row items-center justify-center"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-500 font-semibold ml-2">Log Out</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
            >
                <Input
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    autoFocus
                />
                <View className="flex-row gap-3 mt-4">
                    <Button 
                        variant="secondary" 
                        onPress={() => setShowModal(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onPress={handleSave}
                        className="flex-1"
                    >
                        Save
                    </Button>
                </View>
            </Modal>
        </View>
    );
}
