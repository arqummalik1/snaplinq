import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MoreVertical, Search } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolate,
  FadeOut,
  ZoomIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '../../constants/theme';
import { AddLinkModal } from '../../src/components/dashboard/AddLinkModal';
import { LinkGrid } from '../../src/components/dashboard/LinkGrid';
import { AppLoader } from '../../src/components/ui/AppLoader';
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton';
import { Logo } from '../../src/components/ui/Logo';
import { TopLiquidSearchBar } from '../../src/components/ui/TopLiquidSearchBar';
import { DEBOUNCE_MS } from '../../src/constants';
import { useAuth } from '../../src/context/AuthContext';
import { useShare } from '../../src/context/ShareContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function Dashboard() {
  const router = useRouter();
  const { top: safeTop } = useSafeAreaInsets();
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
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const HEADER_CONTENT_HEIGHT = 64;
  const HEADER_TOTAL_HEIGHT = safeTop + HEADER_CONTENT_HEIGHT;

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 60],
      [1, 0.97],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 60],
      [0, -4],
      Extrapolate.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 60],
      [1, 0.88],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }] };
  }, []);

  // Debounce search input cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (sharedUrl) setShowAddModal(true);
  }, [sharedUrl]);

  useEffect(() => {
    if (!loading && !session) router.replace('/login');
  }, [session, loading, router]);

  const handleSignOut = useCallback(() => {
    setShowMenu(false);
    signOut();
  }, [signOut]);

  const toggleThemeCallback = useCallback(() => {
    setShowMenu(false);
    toggleTheme();
  }, [toggleTheme]);

  if (loading) return <AppLoader />;
  if (!session) return null;

  return (
    <View style={{ flex: 1 }} className="bg-slate-50 dark:bg-[#0f172a]">
      <Animated.View
        style={[headerStyle, { height: HEADER_TOTAL_HEIGHT, paddingTop: safeTop }, styles.headerContainer]}
      >
        <View style={StyleSheet.absoluteFill} className="bg-white/80 dark:bg-[#0f172a]/90" />
        {Platform.OS === 'web' && (
          <View style={[StyleSheet.absoluteFill, styles.webBlur]} />
        )}

        <View style={styles.headerContent}>
          <View style={styles.brandRow}>
            <Animated.View style={[logoStyle, styles.logoShadow]}>
              <View style={styles.logoGlow} />
              <Logo width={40} height={40} className="rounded-[14px]" />
            </Animated.View>
            <View>
              <Text
                style={[styles.appName, { fontFamily: Fonts.rounded }]}
                className="text-slate-900 dark:text-white"
              >
                Snaplinq
              </Text>
              <View style={styles.vaultRow}>
                <View style={styles.vaultDot} />
                <Text style={styles.vaultText} className="text-slate-500 dark:text-slate-400">
                  VAULT
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsPill} className="bg-white/70 dark:bg-slate-800/70">
            <Pressable
              onPress={() => setShowSearch(true)}
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              hitSlop={12}
            >
              <Search size={19} color={isDark ? '#e2e8f0' : '#334155'} strokeWidth={2.5} />
            </Pressable>

            <View style={styles.actionDivider} className="bg-slate-200 dark:bg-slate-600" />

            <View style={{ position: 'relative' }}>
              <Pressable
                onPress={() => setShowMenu(!showMenu)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                hitSlop={12}
              >
                <MoreVertical size={19} color={isDark ? '#e2e8f0' : '#334155'} strokeWidth={2.5} />
              </Pressable>

              {showMenu && (
                <Animated.View
                  entering={ZoomIn.duration(200)}
                  exiting={FadeOut.duration(150)}
                  style={[styles.menu, isDark ? styles.menuDark : styles.menuLight]}
                >
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      setTimeout(() => router.push('/settings'), 100);
                    }}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  >
                    <Text style={styles.menuItemText} className="text-slate-800 dark:text-white">Settings</Text>
                    <View style={styles.menuItemDot} />
                  </Pressable>
                  <Pressable
                    onPress={toggleThemeCallback}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  >
                    <Text style={styles.menuItemText} className="text-slate-800 dark:text-white">Theme</Text>
                    <View style={[styles.menuItemDot, { backgroundColor: isDark ? '#fbbf24' : '#1e293b', width: 12, height: 12, borderRadius: 6 }]} />
                  </Pressable>
                  <Pressable
                    onPress={handleSignOut}
                    style={({ pressed }) => [styles.menuItemLast, pressed && styles.menuItemPressedDanger]}
                  >
                    <Text style={styles.menuItemDanger}>SIGN OUT</Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </View>

        <LinearGradient
          colors={['transparent', '#10b981', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentLine}
        />
      </Animated.View>

      <TopLiquidSearchBar
        visible={showSearch}
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClose={() => setShowSearch(false)}
      />

      <LinkGrid
        searchQuery={debouncedSearch}
        onEdit={(link) => { setEditingLink(link); setShowAddModal(true); }}
        onAddLink={() => { setEditingLink(null); setShowAddModal(true); }}
        contentContainerStyle={{ paddingTop: HEADER_TOTAL_HEIGHT + 12, paddingBottom: 100 }}
        onScroll={scrollHandler}
      />

      <FloatingActionButton
        onPress={() => { setEditingLink(null); setShowAddModal(true); }}
        style={{ bottom: 36 }}
      />

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    } : {}),
  } as any,
  webBlur: {
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    } : {}),
  } as any,
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoShadow: {
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  logoGlow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderRadius: 999,
    transform: [{ scale: 1.5 }],
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  vaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -1,
  },
  vaultDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10b981',
  },
  vaultText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  actionsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
    // Removed overflow: 'hidden' to allow dropdown menu visibility
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    }),
  } as any,
  actionBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.88 }],
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 200,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  menuLight: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
  },
  menuDark: {
    backgroundColor: 'rgba(30,41,59,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(51,65,85,0.8)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  menuItemLast: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(148,163,184,0.1)',
  },
  menuItemPressedDanger: {
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '700',
  },
  menuItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  menuItemDanger: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ef4444',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.5,
  },
});
