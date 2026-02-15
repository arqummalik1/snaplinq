import { useRouter } from 'expo-router';
import { Moon, Search, Sun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Fonts } from '../../constants/theme';
import { AddLinkModal } from '../../src/components/dashboard/AddLinkModal';
import { LinkGrid } from '../../src/components/dashboard/LinkGrid';
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton';
import { Logo } from '../../src/components/ui/Logo';
import { TopLiquidSearchBar } from '../../src/components/ui/TopLiquidSearchBar';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function Dashboard() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [session, loading, router]);

  if (loading || !session) return <View className="flex-1 bg-slate-50 dark:bg-slate-900" />;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900 relative">
      {/* Designer-Grade Header: Extreme Glassmorphism & High-Precision Spacing */}
      <View className="absolute top-0 left-0 right-0 z-40 bg-white/45 dark:bg-slate-900/45 border-b border-slate-200/30 dark:border-slate-800/30 backdrop-blur-3xl pt-16 pb-6 px-8 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="relative">
            <View className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl rounded-full scale-150" />
            <Logo width={52} height={52} className="rounded-[18px] shadow-lg" />
          </View>
          <View>
            <Text
              className="font-bold text-2xl text-slate-900 dark:text-white tracking-[-0.5px]"
              style={{ fontFamily: Fonts.rounded }}
            >
              Snaplinq
            </Text>
            <View className="flex-row items-center gap-1.5 -mt-0.5">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <Text className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-[1.8px]">
                Vault
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => setShowSearch(true)}
            className="w-12 h-12 items-center justify-center rounded-[18px] bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 shadow-sm active:scale-95 transition-all"
          >
            <Search size={24} color={isDark ? '#f1f5f9' : '#334155'} strokeWidth={2.2} />
          </Pressable>

          <Pressable
            onPress={toggleTheme}
            className="w-12 h-12 items-center justify-center rounded-[18px] bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 shadow-sm active:scale-95 transition-all"
          >
            {isDark ? (
              <Sun size={24} color="#fcd34d" strokeWidth={1.8} />
            ) : (
              <Moon size={24} color="#334155" strokeWidth={1.8} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Top Liquid Search Overlay */}
      <TopLiquidSearchBar
        visible={showSearch}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClose={() => setShowSearch(false)}
      />

      {/* Main Content */}
      <LinkGrid
        searchQuery={searchQuery}
        onEdit={(link) => { setEditingLink(link); setShowAddModal(true); }}
        // Padding: Header ~150. Bottom ~150 (Tabs 90 + FAB 64)
        contentContainerStyle={{ paddingTop: 150, paddingBottom: 150 }}
      />

      {/* Liquid FAB (Bottom 160 -> Lowered to 110 since search bar is gone) */}
      {/* TabBar ends at 90. FAB needs to be above it. 110 is safe. */}
      <FloatingActionButton
        onPress={() => { setEditingLink(null); setShowAddModal(true); }}
        style={{ bottom: 110 }}
      />

      {/* Add/Edit Modal */}
      <AddLinkModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        editLink={editingLink}
      />
    </View>
  );
}
