import { View, Text, Platform, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { LinkGrid } from '../src/components/dashboard/LinkGrid';
import { Input } from '../src/components/ui/Input';
import { useTheme } from '../src/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Sun, Moon, Plus, LogOut } from 'lucide-react-native';
import { AddLinkModal } from '../src/components/dashboard/AddLinkModal';

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
            <View className="pt-12 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-row items-center justify-between z-10">

                {/* Logo */}
                <View className="flex-row items-center gap-2">
                    <LinearGradient
                        colors={['#34d399', '#06b6d4']}
                        className="w-8 h-8 rounded-lg items-center justify-center"
                    >
                        <Text className="text-white font-bold text-lg">S</Text>
                    </LinearGradient>
                    <Text className="font-bold text-xl text-slate-900 dark:text-white">Snaplinq</Text>
                </View>

                {/* Search Bar */}
                <View className="flex-1 mx-4 max-w-md relative">
                    <View className="absolute left-3 top-3 z-10">
                        <Search size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                    </View>
                    <Input
                        className="pl-10 h-10 py-0 rounded-full bg-slate-100 dark:bg-slate-800 border-0"
                        placeholder="Search links..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Actions */}
                <View className="flex-row items-center gap-2">
                    <Pressable onPress={toggleTheme} className="p-2 rounded-full">
                        {isDark ? <Sun size={24} color="#fcd34d" /> : <Moon size={24} color="#475569" />}
                    </Pressable>

                    <Pressable
                        onPress={() => { setEditingLink(null); setShowAddModal(true); }}
                        className="w-10 h-10 bg-emerald-500 rounded-full items-center justify-center shadow-lg"
                    >
                        <Plus size={24} color="white" />
                    </Pressable>

                    <Pressable onPress={signOut} className="p-2 rounded-full">
                        <LogOut size={24} color={isDark ? '#f87171' : '#dc2626'} />
                    </Pressable>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1">
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
