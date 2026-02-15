import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { AuthProvider } from '../src/context/AuthContext';
import { LinkProvider } from '../src/context/LinkContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { ToastProvider } from '../src/context/ToastContext';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <LinkProvider>
            <ToastProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="add-link" options={{ presentation: 'modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ToastProvider>
          </LinkProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
