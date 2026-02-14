import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LinkProvider } from '../src/context/LinkContext';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LinkProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="add-link" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </LinkProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
