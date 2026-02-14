import { useRouter } from 'expo-router';
import { LogOut, Moon, Search, Sun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AddLinkModal } from '../src/components/dashboard/AddLinkModal';
import { LinkGrid } from '../src/components/dashboard/LinkGrid';
import { FloatingActionButton } from '../src/components/ui/FloatingActionButton'; // Import FAB
import { Input } from '../src/components/ui/Input';
import { Logo } from '../src/components/ui/Logo';
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
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 relative">
            {/* Compact Sticky Header */}
            <View className="absolute top-0 left-0 right-0 z-20 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
                {/* Top Row: Logo + Actions */}
                <View className="pt-10 pb-2 px-4 flex-row items-center justify-between">
                    {/* Brand Identity */}
                    <View className="flex-row items-center gap-2">
                        <Logo width={32} height={32} className="rounded-xl" />
                        <Text className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Snaplinq</Text>
                    </View>

                    {/* Actions Group */}
                    <View className="flex-row items-center gap-1.5">
                        <Pressable
                            onPress={toggleTheme}
                            className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 active:opacity-80 transition-opacity"
                        >
                            {isDark ? <Sun size={20} color="#fcd34d" /> : <Moon size={20} color="#64748b" />}
                        </Pressable>

                        <Pressable
                            onPress={signOut}
                            className="w-10 h-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 active:opacity-80 transition-opacity"
                        >
                            <LogOut size={20} color={isDark ? '#f87171' : '#ef4444'} />
                        </Pressable>
                    </View>
                </View>

                {/* Search Row */}
                <View className="px-4 pb-3">
                    <View className="relative">
                        <View className="absolute left-4 top-3 z-10 opacity-60">
                            <Search size={18} color={isDark ? '#cbd5e1' : '#64748b'} />
                        </View>
                        <Input
                            className="pl-11 h-11 rounded-full bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-base"
                            placeholder="Search links..."
                            placeholderTextColor={isDark ? '#94a3b8' : '#cbd5e1'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </View>

            {/* Main Content with Padding for Header */}
            <LinkGrid
                searchQuery={searchQuery}
                onEdit={(link) => { setEditingLink(link); setShowAddModal(true); }}
                contentContainerStyle={{ paddingTop: 120, paddingBottom: 100 }} // Increased bottom padding for FAB
            />

            {/* Liquid FAB */}
            <FloatingActionButton onPress={() => { setEditingLink(null); setShowAddModal(true); }} />

            {/* Add/Edit Modal */}
            <AddLinkModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                editLink={editingLink}
            />
        </View>
    );
}
