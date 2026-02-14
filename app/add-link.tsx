import { View, Text, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useLinks } from '../src/context/LinkContext';
import { getFavicon, generateTitle } from '../src/utils/metadata';
import { categorizeUrl } from '../src/utils/categorize';
import { StatusBar } from 'expo-status-bar';

export default function AddLinkScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addLink, categories } = useLinks(); // Reusing context

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params.url) {
            const sharedUrl = params.url as string;
            setUrl(sharedUrl);

            // Auto-fill
            setTitle(generateTitle(sharedUrl));
            setCategory(categorizeUrl(sharedUrl));
        }
    }, [params.url]);

    const handleSubmit = async () => {
        if (!url || !title) return;
        setLoading(true);
        try {
            await addLink({
                url,
                title,
                category,
                icon: getFavicon(url)
            });
            router.back();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-900 p-6 pt-12">
            <StatusBar style="light" />
            <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Link</Text>

            <View className="space-y-4">
                <Input
                    label="URL"
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                />
                <Input
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <View>
                    <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2">Category</Text>
                    <View className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                        <Text className="text-slate-900 dark:text-white">{category}</Text>
                        {/* Simple fallback for now, full selector in modal */}
                    </View>
                </View>

                <View className="flex-row gap-4 mt-8">
                    <Button variant="ghost" className="flex-1" onPress={() => router.back()}>Cancel</Button>
                    <Button className="flex-1" onPress={handleSubmit} loading={loading}>Save Link</Button>
                </View>
            </View>
        </View>
    );
}
