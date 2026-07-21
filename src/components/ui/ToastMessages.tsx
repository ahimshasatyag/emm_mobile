import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessagesProps {
    visible: boolean;
    type?: ToastType;
    title?: string;
    message: string;
    onClose: () => void;
    duration?: number;
}

export const ToastMessages: React.FC<ToastMessagesProps> = ({
    visible,
    type = 'info',
    title,
    message,
    onClose,
    duration = 3000
}) => {

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (visible && duration > 0) {
            timeout = setTimeout(() => {
                onClose();
            }, duration);
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [visible, duration, onClose]);

    if (!visible) return null;

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle color="#5cb85c" fill="white" size={28} />,
                    bgColor: 'bg-[#5cb85c]',
                    defaultTitle: 'Success'
                };
            case 'error':
                return {
                    icon: <AlertCircle color="#d9534f" fill="white" size={28} />,
                    bgColor: 'bg-[#d9534f]',
                    defaultTitle: 'Danger'
                };
            case 'warning':
                return {
                    icon: <AlertTriangle color="#f0ad4e" fill="white" size={28} />,
                    bgColor: 'bg-[#f0ad4e]',
                    defaultTitle: 'Warning'
                };
            case 'info':
            default:
                return {
                    icon: <Info color="#5bc0de" fill="white" size={28} />,
                    bgColor: 'bg-[#5bc0de]',
                    defaultTitle: 'Info'
                };
        }
    };

    const config = getToastConfig();

    return (
        <Animated.View 
            entering={FadeInUp.duration(400).springify()} 
            exiting={FadeOutUp.duration(300)}
            className="absolute top-20 left-4 right-4 z-50"
            style={styles.shadow}
        >
            <View className={`flex-row p-4 rounded-lg ${config.bgColor}`}>
                <View className="mr-3 justify-center">
                    {config.icon}
                </View>
                <View className="flex-1 justify-center">
                    <Text className="font-bold text-[16px] text-white mb-0.5">
                        {title || config.defaultTitle}
                    </Text>
                    <Text className="text-[14px] text-white">
                        {message}
                    </Text>
                </View>
                <TouchableOpacity onPress={onClose} className="p-1" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <X color="white" size={18} strokeWidth={3} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    }
});
