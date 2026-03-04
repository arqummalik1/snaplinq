import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './ui/Button';

interface ErrorScreenProps {
    error: Error | null;
    resetError: () => void;
}

export const ErrorScreen = ({ error, resetError }: ErrorScreenProps) => {
    return (
        <View style={styles.container} className="bg-slate-50 dark:bg-slate-950">
            <View style={styles.content} className="bg-white dark:bg-slate-900">
                <View style={styles.iconContainer} className="bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle size={48} color="#ef4444" />
                </View>

                <Text style={styles.title} className="text-slate-900 dark:text-white">
                    Something went wrong
                </Text>

                <Text style={styles.message} className="text-slate-500 dark:text-slate-400">
                    We encountered an unexpected error. Don't worry, your data is safe.
                </Text>

                {error && (
                    <View style={styles.errorBox} className="bg-slate-100 dark:bg-slate-800">
                        <Text style={styles.errorText} className="text-red-500">
                            {error.message || error.toString()}
                        </Text>
                    </View>
                )}

                <Button onPress={resetError} variant="primary" className="w-full">
                    Reload Application
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    errorBox: {
        width: '100%',
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    errorText: {
        fontSize: 13,
        fontFamily: 'monospace',
    },
});
