import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, Modal as RNModal, Text, View } from 'react-native';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    hasUnsavedChanges?: boolean;
}

export const Modal = ({ visible, onClose, title, children, hasUnsavedChanges = false }: ModalProps) => {

    const handleClose = () => {
        if (hasUnsavedChanges) {
            onClose();
        } else {
            onClose();
        }
    };
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-end"
            >
                {/* Background overlay */}
                <Pressable className="absolute inset-0 bg-black/60" onPress={handleClose} />

                {/* Modal Content */}
                <View className="bg-white dark:bg-slate-900 w-full rounded-t-3xl max-h-[85vh] shadow-2xl border-t border-slate-200 dark:border-slate-800">
                    {/* Handle bar and close button */}
                    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
                        {/* Drag handle */}
                        <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />

                        {/* Close button */}
                        <Pressable
                            onPress={handleClose}
                            className="w-8 h-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                            hitSlop={8}
                        >
                            <X size={18} className="text-slate-500" />
                        </Pressable>
                    </View>

                    {title && (
                        <Text className="text-lg font-bold text-slate-900 dark:text-white px-6 pb-4 text-center">
                            {title}
                        </Text>
                    )}

                    <View className="px-6 pb-6 overflow-y-auto">
                        {children}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </RNModal>
    );
};
