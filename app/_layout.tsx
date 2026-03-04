import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import '../global.css';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { AuthProvider } from '../src/context/AuthContext';
import { LinkProvider } from '../src/context/LinkContext';
import { ShareProvider, useShare } from '../src/context/ShareContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { ToastProvider } from '../src/context/ToastContext';

function App() {
  const { setSharedUrl } = useShare();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    ReceiveSharingIntent.getReceivedFiles((files: any) => {
      if (files[0]?.weblink) {
        setSharedUrl(files[0].weblink);
      }
    }, 
    (error: any) => {
      console.error('Error receiving shared file:', error);
    },
    'snaplinq' // Add this line
    );

    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="add-link" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ShareProvider>
            <LinkProvider>
              <ToastProvider>
                <App />
                <StatusBar style="auto" />
              </ToastProvider>
            </LinkProvider>
          </ShareProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
