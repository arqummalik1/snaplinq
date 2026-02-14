import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LogOut, Moon, Plus, Search, Sun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AddLinkModal } from '../src/components/dashboard/AddLinkModal';
import { LinkGrid } from '../src/components/dashboard/LinkGrid';
import { Input } from '../src/components/ui/Input';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';

export default function Dashboard() {
    const router = useRouter();
    const { session, loading, signOut } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLink, setEditingLink] = useState<any>(null);

    useEffect(() => {
        if (!loading && !session) {
            router.replace('/login');
        }
    }, [session, loading]);

    if (loading || !session) return <View className="flex-1 bg-slate-50 dark:bg-slate-900" />;

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            {/* Sticky Header */}
            {/* Glassmorphic Sticky Header Overlay */}
            <View className="absolute top-0 left-0 right-0 z-20 pt-12 pb-4 px-6 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 flex-row items-center justify-between backdrop-blur-xl">

                {/* Brand Identity */}
                <View className="flex-row items-center gap-3">
                    <LinearGradient
                        colors={['#34d399', '#06b6d4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-10 h-10 rounded-xl items-center justify-center shadow-emerald-500/20 shadow-lg"
                    >
                        <Text className="text-white font-bold text-xl font-sans">S</Text>
                    </LinearGradient>
                    <Text className="font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight hidden md:flex">Snaplinq</Text>
                </View>

                {/* Premium Search Bar */}
                <View className="flex-1 mx-4 lg:mx-8 max-w-2xl relative">
                    <View className="absolute left-4 top-3.5 z-10 opacity-60">
                        <Search size={18} color={isDark ? '#cbd5e1' : '#64748b'} />
                    </View>
                    <Input
                        className="pl-12 h-12 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-base"
                        placeholder="Search..."
                        placeholderTextColor={isDark ? '#94a3b8' : '#cbd5e1'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Actions Group */}
                <View className="flex-row items-center gap-2 lg:gap-3">
                    <Pressable
                        onPress={toggleTheme}
                        className="w-10 h-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isDark ? <Sun size={20} color="#fcd34d" /> : <Moon size={20} color="#64748b" />}
                    </Pressable>

                    <Pressable
                        onPress={() => { setEditingLink(null); setShowAddModal(true); }}
                        className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl flex-row items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} color="white" strokeWidth={2.5} />
                        <Text className="text-white font-semibold text-sm hidden sm:flex">Add Link</Text>
                    </Pressable>

                    <Pressable
                        onPress={signOut}
                        className="w-10 h-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <LogOut size={20} color={isDark ? '#f87171' : '#ef4444'} />
                    </Pressable>
                </View>
            </View>

            {/* Main Content with Padding for Header */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingTop: 130, paddingBottom: 40 }}
            >
                <LinkGrid
                    searchQuery={searchQuery}
                    onEdit={(link) => { setEditingLink(link); setShowAddModal(true); }}
                />
            </ScrollView>

            {/* Add/Edit Modal */}
            <AddLinkModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                editLink={editingLink}
            />
        </View>
    );
}
