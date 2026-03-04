import { useRouter } from 'expo-router';
import { MoreVertical, Search } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
    Extrapolate,
    FadeOut,
    ZoomIn,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { Fonts } from '../../constants/theme';
import { AddLinkModal } from '../../src/components/dashboard/AddLinkModal';
import { LinkGrid } from '../../src/components/dashboard/LinkGrid';
import { AppLoader } from '../../src/components/ui/AppLoader';
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton';
import { Logo } from '../../src/components/ui/Logo';
import { TopLiquidSearchBar } from '../../src/components/ui/TopLiquidSearchBar';
import { useAuth } from '../../src/context/AuthContext';
import { useShare } from '../../src/context/ShareContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function Dashboard() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { session, loading, signOut } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { sharedUrl, clearSharedUrl } = useShare();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll animations for header
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 50],
      [100, 75],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.98],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, -5],
      Extrapolate.CLAMP
    );

    return {
      height,
      opacity,
      transform: [{ translateY }],
      paddingTop: interpolate(scrollY.value, [0, 50], [45, 15], Extrapolate.CLAMP),
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0.8],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }] };
  });

  // Debounce search input
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 300);
  }, []);

  useEffect(() => {
    if (sharedUrl) setShowAddModal(true);
  }, [sharedUrl]);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [session, loading, router]);

  if (loading) return <AppLoader />;

  if (!session) return null;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-[#0f172a] relative">
      {/* Premium Collapsible Header */}
      <Animated.View 
        style={[headerStyle, styles.headerContainer]}
        className="absolute top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/30 dark:border-slate-800/30 backdrop-blur-3xl px-8 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3">
          <Animated.View style={[logoStyle, styles.logoShadow]}>
            <View className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/10 blur-xl rounded-full scale-150" />
            <Logo width={40} height={40} className="rounded-[14px]" />
          </Animated.View>
          <View>
            <Text
              className="font-black text-xl text-slate-900 dark:text-white tracking-tighter"
              style={{ fontFamily: Fonts.rounded }}
            >
              Snaplinq
            </Text>
            <View className="flex-row items-center gap-1 -mt-1">
              <View className="w-1 h-1 rounded-full bg-emerald-500" />
              <Text className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-[1.5px]">
                Vault
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => setShowSearch(true)}
            className="w-10 h-10 items-center justify-center rounded-[14px] bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm active:scale-90 transition-all"
          >
            <Search size={20} color={isDark ? '#f1f5f9' : '#334155'} strokeWidth={2.5} />
          </Pressable>

          <View className="relative">
            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              className="w-10 h-10 items-center justify-center rounded-[14px] bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm active:scale-90 transition-all"
            >
              <MoreVertical size={20} color={isDark ? '#f1f5f9' : '#334155'} strokeWidth={2.5} />
            </Pressable>

            {showMenu && (
              <Animated.View 
                entering={ZoomIn.duration(200)} 
                exiting={FadeOut.duration(150)}
                style={styles.menu}
                className="absolute right-0 top-14 w-52 bg-white/90 dark:bg-slate-800/90 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 backdrop-blur-xl"
              >
                <Pressable 
                  onPress={() => { setShowMenu(false); router.push('/settings'); }}
                  className="px-6 py-4 active:bg-slate-100 dark:active:bg-slate-700 border-b border-slate-50 dark:border-slate-700 flex-row items-center justify-between"
                >
                  <Text className="font-bold text-slate-800 dark:text-white">Settings</Text>
                  <View className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                </Pressable>
                <Pressable 
                  onPress={() => { setShowMenu(false); toggleTheme(); }}
                  className="px-6 py-4 active:bg-slate-100 dark:active:bg-slate-700 border-b border-slate-50 dark:border-slate-700 flex-row items-center justify-between"
                >
                  <Text className="font-bold text-slate-800 dark:text-white">Theme</Text>
                  <View className={`w-3 h-3 rounded-full ${isDark ? 'bg-amber-400' : 'bg-slate-800'}`} />
                </Pressable>
                <Pressable 
                  onPress={() => { setShowMenu(false); signOut(); }}
                  className="px-6 py-5 active:bg-red-50 dark:active:bg-red-900/10"
                >
                  <Text className="font-black text-red-500 uppercase tracking-widest text-[11px]">Sign Out</Text>
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Top Liquid Search Overlay */}
      <TopLiquidSearchBar
        visible={showSearch}
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClose={() => setShowSearch(false)}
      />

      {/* Main Content */}
      <LinkGrid
        searchQuery={debouncedSearch}
        onEdit={(link) => { setEditingLink(link); setShowAddModal(true); }}
        contentContainerStyle={{ paddingTop: 110, paddingBottom: 150 }}
        onScroll={scrollHandler}
      />

      {/* FAB */}
      <FloatingActionButton
        onPress={() => { setEditingLink(null); setShowAddModal(true); }}
        style={{ bottom: 120 }}
      />

      {/* Add/Edit Modal */}
      <AddLinkModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingLink(null);
          clearSharedUrl();
        }}
        editLink={editingLink}
        sharedUrl={sharedUrl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
  },
  logoShadow: {
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  menu: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  }
});
