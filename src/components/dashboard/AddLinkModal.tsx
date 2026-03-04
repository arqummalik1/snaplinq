import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLinkContext } from '../../context/LinkContext';
import { useToast } from '../../context/ToastContext';
import { Link, LinkPatch, NewLink } from '../../types';
import { categorizeUrl } from '../../utils/categorize';
import { generateTitle } from '../../utils/metadata';
import { getFavicon, isValidUrl, normalizeUrl } from '../../utils/url';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface AddLinkModalProps {
    visible: boolean;
    onClose: () => void;
    editLink?: Link | null;
    sharedUrl?: string | null;
    onClearShare?: () => void;
}

export const AddLinkModal = ({ visible, onClose, editLink, sharedUrl, onClearShare }: AddLinkModalProps) => {
    const { addLink, updateLink, categories, addCategory } = useLinkContext();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [icon, setIcon] = useState('');
    const [newCat, setNewCat] = useState('');
    const [isAddingCat, setIsAddingCat] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const resetForm = useCallback(() => {
        setUrl('');
        setTitle('');
        setCategory('Uncategorized');
        setIcon('');
        setNewCat('');
        setIsAddingCat(false);
        setHasChanges(false);
        if (onClearShare) {
            onClearShare();
        }
    }, [onClearShare]);

    useEffect(() => {
        if (editLink) {
            setUrl(editLink.url);
            setTitle(editLink.title);
            setCategory(editLink.category);
            setIcon(editLink.icon || '');
            setHasChanges(false);
        } else if (sharedUrl) {
            const normalized = normalizeUrl(sharedUrl);
            setUrl(normalized);
            const autoTitle = generateTitle(normalized);
            const autoIcon = getFavicon(normalized);
            const autoCat = categorizeUrl(normalized);
            setTitle(autoTitle);
            setIcon(autoIcon);
            setCategory(autoCat);
            setHasChanges(true); // Since we autopopulated from share intent
        } else if (visible) {
            resetForm();
        }
    }, [editLink, sharedUrl, visible, resetForm]);

    const handleUrlChange = (text: string) => {
        setUrl(text);
        setHasChanges(true);
    };

    const handleTitleChange = (text: string) => {
        setTitle(text);
        setHasChanges(true);
    };

    const handleUrlBlur = () => {
        if (!url) return;

        const normalized = normalizeUrl(url);
        setUrl(normalized);

        // Auto-fetch metadata if fields are empty
        const autoTitle = generateTitle(normalized);
        const autoIcon = getFavicon(normalized);
        const autoCat = categorizeUrl(normalized);

        if (!title) setTitle(autoTitle);
        if (!icon) setIcon(autoIcon);
        if (category === 'Uncategorized') setCategory(autoCat);
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const handleSubmit = async () => {
        const normalizedUrl = normalizeUrl(url);

        if (!normalizedUrl || !title) {
            error('Please enter a URL and title');
            return;
        }

        if (!isValidUrl(normalizedUrl)) {
            error('Please enter a valid URL (e.g., example.com)');
            return;
        }

        setLoading(true);
        try {
            if (editLink) {
                const patch: LinkPatch = { url: normalizedUrl, title, category, icon };
                await updateLink(editLink.id, patch);
                success('Link updated successfully');
            } else {
                const newLink: NewLink = { url: normalizedUrl, title, category, icon };
                await addLink(newLink);
                success('Link added to your vault');
            }
            onClose();
            resetForm();
        } catch (e) {
            console.error(e);
            error(editLink ? 'Failed to update link' : 'Failed to add link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            onClose={handleClose}
            title={editLink ? 'Edit Link' : 'Add Link'}
            hasUnsavedChanges={hasChanges}
        >
            <View className="space-y-4">
                {/* URL Input */}
                <Input
                    label="URL"
                    placeholder="https://example.com"
                    value={url}
                    onChangeText={handleUrlChange}
                    onBlur={handleUrlBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Title Input */}
                <Input
                    label="Title"
                    placeholder="My Cool Link"
                    value={title}
                    onChangeText={handleTitleChange}
                />

                {/* Icon Input */}
                <Input
                    label="Icon URL (Optional)"
                    placeholder="https://example.com/favicon.ico"
                    value={icon}
                    onChangeText={(text) => {
                        setIcon(text);
                        setHasChanges(true);
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Category Selection */}
                <View>
                    <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 mb-2">
                        Category
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {categories.map((c) => (
                            <Pressable
                                key={c}
                                onPress={() => {
                                    setCategory(c);
                                    setHasChanges(true);
                                }}
                                className={`px-3 py-1.5 rounded-full border ${category === c
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-slate-300 dark:border-slate-600'
                                    }`}
                            >
                                <Text
                                    className={`${category === c ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                                        } text-xs font-medium`}
                                >
                                    {c}
                                </Text>
                            </Pressable>
                        ))}
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
                            <Input placeholder="New category name" value={newCat} onChangeText={setNewCat} />
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
                                    setHasChanges(true);
                                }
                            }}
                        >
                            Add
                        </Button>
                    </View>
                )}

                <Button onPress={handleSubmit} loading={loading} className="mt-4">
                    {editLink ? 'Save Changes' : 'Add Link'}
                </Button>
            </View>
        </Modal>
    );
};
