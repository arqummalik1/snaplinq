import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Layout = 'grid' | 'list' | 'compact';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    isDark: boolean;
    layout: Layout;
    setLayout: (layout: Layout) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [layout, setLayoutState] = useState<Layout>('grid');

    useEffect(() => {
        const loadSettings = async () => {
            const savedTheme = await AsyncStorage.getItem('snaplinq_theme');
            const savedLayout = await AsyncStorage.getItem('snaplinq_layout');

            if (savedTheme) {
                setThemeState(savedTheme as Theme);
                setColorScheme(savedTheme as Theme as any);
            }
            if (savedLayout) {
                setLayoutState(savedLayout as Layout);
            }
        };
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        setColorScheme(newTheme as any);
        await AsyncStorage.setItem('snaplinq_theme', newTheme);
    };

    const setLayout = async (newLayout: Layout) => {
        setLayoutState(newLayout);
        await AsyncStorage.setItem('snaplinq_layout', newLayout);
    };

    const toggleTheme = () => {
        const next = colorScheme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            isDark: colorScheme === 'dark',
            layout,
            setLayout,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
