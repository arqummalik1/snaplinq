import { ActivityIndicator, Pressable, Text } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export const Button = ({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    disabled,
    loading,
    className
}: ButtonProps) => {

    const baseStyles = "flex-row items-center justify-center rounded-xl transition-all active:opacity-80";

    const variants = {
        primary: "bg-emerald-500",
        secondary: "bg-slate-200 dark:bg-slate-700",
        ghost: "bg-transparent",
        danger: "bg-red-500"
    };

    const sizes = {
        sm: "px-3 py-1.5",
        md: "px-4 py-3",
        lg: "px-6 py-4"
    };

    const textStyles = {
        primary: "text-white font-semibold",
        secondary: "text-slate-900 dark:text-white font-medium",
        ghost: "text-slate-600 dark:text-slate-400 font-medium",
        danger: "text-white font-semibold"
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#64748b' : 'white'} />
            ) : (
                <Text className={`${textStyles[variant]} text-center`}>
                    {children}
                </Text>
            )}
        </Pressable>
    );
};
