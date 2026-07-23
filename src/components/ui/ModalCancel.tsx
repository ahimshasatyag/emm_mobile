import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle, X, Check } from 'lucide-react-native';
import { theme } from '../../theme/theme';

interface ModalCancelProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ModalCancel: React.FC<ModalCancelProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "YES",
    cancelText = "NO"
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
                <View
                    className="bg-white rounded-3xl w-full max-w-[340px] pt-12 pb-6 px-5 items-center mt-10 shadow-xl"
                    style={{ elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15 }}
                >
                    {/* Top Icon */}
                    <View className="absolute -top-10 self-center">
                        <View className="w-20 h-20 rounded-full bg-red-500 justify-center items-center border-[6px] border-gray-100">
                            <X color="white" size={40} strokeWidth={3} />
                        </View>
                    </View>

                    {/* Content */}
                    <View className="items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</Text>
                        <Text className="text-sm text-gray-500 text-center leading-5">{message}</Text>
                    </View>

                    {/* Buttons */}
                    <View className="flex-row justify-center w-full px-2">
                        <TouchableOpacity
                            className="bg-gray-500 flex-row items-center justify-center py-3 px-4 rounded-xl flex-1 mr-3"
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <X color="white" size={16} strokeWidth={3} className="mr-1.5" />
                            <Text className="text-white text-[15px] font-bold">{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-center py-3 px-4 rounded-xl flex-1 ml-3"
                            style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Check color="white" size={16} strokeWidth={3} className="mr-1.5" />
                            <Text className="text-white text-[15px] font-bold">{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
