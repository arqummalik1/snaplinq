import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    className?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
    return (
        <View className="w-full space-y-2">
            {label && (
                <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                    {label}
                </Text>
            )}
            <TextInput
                placeholderTextColor="#94a3b8"
                className={`w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 ${className}`}
                {...props}
            />
        </View>
    );
};
