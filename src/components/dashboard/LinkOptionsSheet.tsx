import { Edit2, ExternalLink, Trash2 } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface LinkOptionsSheetProps {
    visible: boolean;
    onClose: () => void;
    onOpen: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const LinkOptionsSheet = ({ visible, onClose, onOpen, onEdit, onDelete }: LinkOptionsSheetProps) => {
    return (
        <Modal visible={visible} onClose={onClose}>
            <View className="gap-3">
                <Button variant="secondary" onPress={onOpen} className="justify-start px-4 py-4 bg-slate-100 dark:bg-slate-800 border-0">
                    <View className="flex-row items-center">
                        <ExternalLink size={20} className="text-slate-900 dark:text-white mr-3" />
                        <Text className="text-slate-900 dark:text-white font-medium text-lg">Open Link</Text>
                    </View>
                </Button>

                <Button variant="secondary" onPress={onEdit} className="justify-start px-4 py-4 bg-slate-100 dark:bg-slate-800 border-0">
                    <View className="flex-row items-center">
                        <Edit2 size={20} className="text-slate-900 dark:text-white mr-3" />
                        <Text className="text-slate-900 dark:text-white font-medium text-lg">Edit Link</Text>
                    </View>
                </Button>

                <Button variant="danger" onPress={onDelete} className="justify-start px-4 py-4 bg-red-50 dark:bg-red-900/20 border-0">
                    <View className="flex-row items-center">
                        <Trash2 size={20} className="text-red-500 mr-3" />
                        <Text className="text-red-500 font-medium text-lg">Delete Link</Text>
                    </View>
                </Button>

                <Button variant="ghost" onPress={onClose} className="mt-2 py-4 border-0">
                    <Text className="text-slate-500 text-lg font-medium">Cancel</Text>
                </Button>
            </View>
        </Modal>
    );
};
