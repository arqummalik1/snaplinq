import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useLinkContext } from '../src/context/LinkContext';
import { useToast } from '../src/context/ToastContext';
import { categorizeUrl } from '../src/utils/categorize';
import { generateTitle, getFavicon } from '../src/utils/metadata';

export default function AddLinkScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { addLink } = useLinkContext(); // Reusing context

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

    const { success, error } = useToast();

    const handleSubmit = async () => {
        if (!url || !title) {
            error("Please enter a URL and title");
            return;
        }
        setLoading(true);
        try {
            await addLink({
                url,
                title,
                category,
                icon: getFavicon(url)
            });
            success("Link added successfully!");
            router.back();
        } catch (e) {
            console.error(e);
            error("Failed to add link");
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
