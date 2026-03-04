import * as Clipboard from 'expo-clipboard';
import {
    AppWindow,
    ChevronDown,
    Database,
    Download,
    FolderOpen,
    Grid,
    Layout as LayoutIcon,
    List,
    LogOut,
    Moon,
    Palette,
    Sun,
    Trash2,
    Upload,
    User,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Modal } from '../../src/components/ui/Modal';
import { useAuth } from '../../src/context/AuthContext';
import { useLinkContext } from '../../src/context/LinkContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useToast } from '../../src/context/ToastContext';
import { NewLink } from '../../src/types';

type ThemeOption = 'light' | 'dark' | 'system';
type LayoutOption = 'grid' | 'list' | 'compact';

export default function SettingsScreen() {
    const { signOut, user } = useAuth();
    const { links, categories, addCategory, deleteCategory, renameCategory, importLinks } = useLinkContext();
    const { theme: currentTheme, setTheme, isDark, layout: currentLayout, setLayout } = useTheme();
    const { success, error: toastError } = useToast();

    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [categoriesExpanded, setCategoriesExpanded] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

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
            Alert.alert('Error', 'Failed to save category');
        }
    };

    const handleDelete = (name: string) => {
        Alert.alert(
            'Delete Category',
            'Are you sure? This will not delete the links inside it (they will be uncategorized).',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(name) },
            ]
        );
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = JSON.stringify(links, null, 2);
            await Clipboard.setStringAsync(data);
            success('Vault data copied to clipboard');
        } catch (e) {
            console.error(e);
            toastError('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async () => {
        setIsImporting(true);
        try {
            const content = await Clipboard.getStringAsync();
            if (!content) {
                toastError('Clipboard is empty');
                return;
            }

            const parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) {
                toastError('Invalid data format');
                return;
            }

            const linksToImport: NewLink[] = parsed.map((item: any) => ({
                url: item.url,
                title: item.title,
                category: item.category || 'Uncategorized',
                icon: item.icon || '',
            }));

            Alert.alert(
                'Import Links',
                `Ready to import ${linksToImport.length} links. This will not delete existing links.`,
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => setIsImporting(false) },
                    {
                        text: 'Import',
                        onPress: async () => {
                            try {
                                await importLinks(linksToImport);
                                success('Links imported successfully');
                            } catch (e) {
                                toastError('Import failed');
                            } finally {
                                setIsImporting(false);
                            }
                        },
                    },
                ]
            );
        } catch (e) {
            console.error(e);
            toastError('Failed to parse clipboard data');
            setIsImporting(false);
        }
    };

    const ThemeCard = ({
        option,
        label,
        icon: Icon,
        selected,
    }: {
        option: ThemeOption;
        label: string;
        icon: any;
        selected: boolean;
    }) => (
        <Pressable
            onPress={() => setTheme(option)}
            className={`flex-1 p-4 rounded-2xl items-center justify-center transition-all ${selected
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                }`}
        >
            <View
                className={`p-3 rounded-full mb-2 ${selected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                    }`}
            >
                <Icon size={22} color={selected ? 'white' : isDark ? '#94a3b8' : '#64748b'} />
            </View>
            <Text
                className={`text-[12px] font-bold uppercase tracking-wider ${selected ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
            >
                {label}
            </Text>
        </Pressable>
    );

    const LayoutCard = ({
        option,
        label,
        icon: Icon,
        selected,
    }: {
        option: LayoutOption;
        label: string;
        icon: any;
        selected: boolean;
    }) => (
        <Pressable
            onPress={() => setLayout(option)}
            className={`flex-1 p-4 rounded-2xl items-center justify-center transition-all ${selected
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                }`}
        >
            <View
                className={`p-3 rounded-full mb-2 ${selected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                    }`}
            >
                <Icon size={22} color={selected ? 'white' : isDark ? '#94a3b8' : '#64748b'} />
            </View>
            <Text
                className={`text-[12px] font-bold uppercase tracking-wider ${selected ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
            >
                {label}
            </Text>
        </Pressable>
    );

    const SettingSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
        <View className="mb-8">
            <View className="flex-row items-center mb-4 px-1">
                <View className="w-8 h-8 rounded-lg bg-emerald-500/10 items-center justify-center mr-3">
                    <Icon size={18} color="#10b981" />
                </View>
                <Text className="text-[13px] font-black text-slate-400 uppercase tracking-[2px]">{title}</Text>
            </View>
            <View className="bg-white/50 dark:bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
                {children}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-slate-50 dark:bg-[#0f172a]">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Premium Header */}
                <View className="pt-20 px-8 pb-8">
                    <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Settings
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Personalize your experience
                    </Text>
                </View>

                {/* Profile Card */}
                <View className="mx-8 mb-10">
                    <View className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-black/5 border border-slate-50 dark:border-slate-700">
                        <View className="flex-row items-center">
                            <View className="w-16 h-14 rounded-2xl bg-emerald-500 items-center justify-center shadow-lg shadow-emerald-500/40">
                                <User size={32} color="white" />
                            </View>
                            <View className="ml-5 flex-1">
                                <Text className="text-slate-900 dark:text-white text-xl font-black tracking-tight">
                                    {user?.email?.split('@')[0] || 'User'}
                                </Text>
                                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mt-0.5">
                                    {user?.email || 'Guest User'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Appearance Section */}
                <View className="px-8">
                    <SettingSection title="Interface" icon={Palette}>
                        <View className="p-6">
                            <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Color Theme
                            </Text>
                            <View className="flex-row gap-3 mb-8">
                                <ThemeCard
                                    option="light"
                                    label="Light"
                                    icon={Sun}
                                    selected={currentTheme === 'light'}
                                />
                                <ThemeCard option="dark" label="Dark" icon={Moon} selected={currentTheme === 'dark'} />
                                <ThemeCard
                                    option="system"
                                    label="System"
                                    icon={AppWindow}
                                    selected={currentTheme === 'system'}
                                />
                            </View>

                            <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Vault Layout
                            </Text>
                            <View className="flex-row gap-3">
                                <LayoutCard
                                    option="grid"
                                    label="Grid"
                                    icon={Grid}
                                    selected={currentLayout === 'grid'}
                                />
                                <LayoutCard
                                    option="list"
                                    label="List"
                                    icon={List}
                                    selected={currentLayout === 'list'}
                                />
                                <LayoutCard
                                    option="compact"
                                    label="Compact"
                                    icon={LayoutIcon}
                                    selected={currentLayout === 'compact'}
                                />
                            </View>
                        </View>
                    </SettingSection>
                </View>

                {/* Organization Section */}
                <View className="px-8">
                    <SettingSection title="Organization" icon={FolderOpen}>
                        <Pressable
                            onPress={() => setCategoriesExpanded(!categoriesExpanded)}
                            className="flex-row items-center justify-between p-6"
                        >
                            <View className="flex-row items-center">
                                <Text className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                                    Manage Categories
                                </Text>
                                <View className="ml-3 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                                    <Text className="text-[10px] font-black text-emerald-500">{categories.length}</Text>
                                </View>
                            </View>
                            <ChevronDown
                                size={20}
                                color={isDark ? '#94a3b8' : '#64748b'}
                                style={{ transform: [{ rotate: categoriesExpanded ? '0deg' : '-90deg' }] }}
                            />
                        </Pressable>

                        {categoriesExpanded && (
                            <View className="px-6 pb-6">
                                {categories.map((category) => (
                                    <View key={category} className="flex-row items-center justify-between py-3">
                                        <Text className="text-slate-700 dark:text-slate-200 font-bold">{category}</Text>
                                        <View className="flex-row gap-2">
                                            <Pressable
                                                onPress={() => {
                                                    setEditingCategory(category);
                                                    setNewCategoryName(category);
                                                    setShowModal(true);
                                                }}
                                                className="w-8 h-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
                                            >
                                                <Palette size={14} color={isDark ? '#94a3b8' : '#64748b'} />
                                            </Pressable>
                                            <Pressable
                                                onPress={() => handleDelete(category)}
                                                className="w-8 h-8 items-center justify-center rounded-lg bg-red-500/10"
                                            >
                                                <Trash2 size={14} color="#ef4444" />
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                                <Button
                                    onPress={() => {
                                        setEditingCategory(null);
                                        setNewCategoryName('');
                                        setShowModal(true);
                                    }}
                                    variant="secondary"
                                    className="mt-4 border-dashed border-2 border-emerald-500/30 bg-transparent"
                                >
                                    <Text className="text-emerald-500 font-black">+ Add Category</Text>
                                </Button>
                            </View>
                        )}
                    </SettingSection>
                </View>

                {/* Data Management Section */}
                <View className="px-8">
                    <SettingSection title="Data Management" icon={Database}>
                        <View className="p-6">
                            <View className="flex-row gap-4">
                                <Button
                                    onPress={handleExport}
                                    variant="secondary"
                                    className="flex-1"
                                    loading={isExporting}
                                >
                                    <Download size={18} color="#10b981" style={{ marginRight: 8 }} />
                                    <Text className="text-emerald-500 font-black">Export</Text>
                                </Button>
                                <Button
                                    onPress={handleImport}
                                    variant="secondary"
                                    className="flex-1"
                                    loading={isImporting}
                                >
                                    <Upload size={18} color="#10b981" style={{ marginRight: 8 }} />
                                    <Text className="text-emerald-500 font-black">Import</Text>
                                </Button>
                            </View>
                            <Text className="text-[10px] text-slate-400 mt-4 text-center font-bold uppercase tracking-wider">
                                Export to JSON clipboard or Import from valid JSON
                            </Text>
                        </View>
                    </SettingSection>
                </View>

                {/* Danger Zone */}
                <View className="px-8 mt-4">
                    <Pressable
                        onPress={() => {
                            Alert.alert('Log Out', 'Are you sure?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Log Out', style: 'destructive', onPress: signOut },
                            ]);
                        }}
                        className="bg-red-500/10 p-6 rounded-[32px] flex-row items-center justify-center border border-red-500/20"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-500 font-black ml-3 uppercase tracking-widest text-xs">
                            Sign Out of Vault
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title={editingCategory ? 'Rename Category' : 'Create Category'}
            >
                <Input
                    placeholder="e.g. Design Inspiration"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    autoFocus
                />
                <View className="flex-row gap-3 mt-6">
                    <Button variant="secondary" onPress={() => setShowModal(false)} className="flex-1">
                        Cancel
                    </Button>
                    <Button onPress={handleSave} className="flex-1">
                        Save
                    </Button>
                </View>
            </Modal>
        </View>
    );
}
