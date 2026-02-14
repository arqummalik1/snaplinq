import { View, Text, Switch, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLinks } from '../../context/LinkContext';
import { getFavicon, generateTitle } from '../../utils/metadata';
import { categorizeUrl } from '../../utils/categorize';

interface AddLinkModalProps {
    visible: boolean;
    onClose: () => void;
    editLink?: any;
}

export const AddLinkModal = ({ visible, onClose, editLink }: AddLinkModalProps) => {
    const { addLink, updateLink, categories, addCategory } = useLinks();
    const [loading, setLoading] = useState(false);

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [icon, setIcon] = useState('');
    const [newCat, setNewCat] = useState('');
    const [isAddingCat, setIsAddingCat] = useState(false);

    useEffect(() => {
        if (editLink) {
            setUrl(editLink.url);
            setTitle(editLink.title);
            setCategory(editLink.category);
            setIcon(editLink.icon || '');
        } else {
            resetForm();
        }
    }, [editLink, visible]);

    const resetForm = () => {
        setUrl('');
        setTitle('');
        setCategory('Uncategorized');
        setIcon('');
        setNewCat('');
        setIsAddingCat(false);
    };

    const handleUrlBlur = () => {
        if (!url || editLink) return;
        // Auto-fetch logic
        const autoTitle = generateTitle(url);
        const autoIcon = getFavicon(url);
        const autoCat = categorizeUrl(url);

        if (!title) setTitle(autoTitle);
        if (!icon) setIcon(autoIcon);
        if (category === 'Uncategorized') setCategory(autoCat);

        // Auto add category if it doesn't exist?
        // customizeUrl returns standard categories.
    };

    const handleSubmit = async () => {
        if (!url || !title) return;

        setLoading(true);
        try {
            const linkData = { url, title, category, icon };

            if (editLink) {
                await updateLink(editLink.id, linkData);
            } else {
                await addLink(linkData);
            }
            onClose();
            resetForm();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} onClose={onClose} title={editLink ? "Edit Link" : "Add Link"}>
            <View className="space-y-4">
                {/* URL Input */}
                <Input
                    label="URL"
                    placeholder="https://example.com"
                    value={url}
                    onChangeText={setUrl}
                    onBlur={handleUrlBlur}
                    autoCapitalize="none"
                />

                {/* Title Input */}
                <Input
                    label="Title"
                    placeholder="My Cool Link"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Category Selection (Simple Horizontal Scroll or Dropdown simulator) */}
                <View>
                    <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2">Category</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {categories.map(c => (
                            <Pressable
                                key={c}
                                onPress={() => setCategory(c)}
                                className={`px-3 py-1.5 rounded-full border ${category === c ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}
                            >
                                <Text className={`${category === c ? 'text-white' : 'text-slate-600 dark:text-slate-400'} text-xs font-medium`}>
                                    {c}
                                </Text>
                            </Pressable>
                        ))}
                        {/* Add Category Button */}
                        <Pressable
                            onPress={() => setIsAddingCat(!isAddingCat)}
                            className="px-3 py-1.5 rounded-full border border-slate-300 border-dashed"
                        >
                            <Text className="text-slate-500 text-xs">+ New</Text>
                        </Pressable>
                    </View>
                </View>

                {isAddingCat && (
                    <View className="flex-row gap-2 items-end">
                        <View className="flex-1">
                            <Input
                                placeholder="New category name"
                                value={newCat}
                                onChangeText={setNewCat}
                            />
                        </View>
                        <Button
                            size="sm"
                            variant="secondary"
                            onPress={() => {
                                if (newCat) {
                                    addCategory(newCat);
                                    setCategory(newCat);
                                    setNewCat('');
                                    setIsAddingCat(false);
                                }
                            }}
                        >
                            Add
                        </Button>
                    </View>
                )}

                <Button onPress={handleSubmit} loading={loading} className="mt-4">
                    {editLink ? "Save Changes" : "Add Link"}
                </Button>
            </View>
        </Modal>
    );
};
