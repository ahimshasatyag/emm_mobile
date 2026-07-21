import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { X, Send } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface NewChatModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSend: (number: string, message: string) => void;
    sending?: boolean;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
    visible,
    onDismiss,
    onSend,
    sending = false
}) => {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSend = () => {
        if (!phone.trim()) {
            setError('Nomor HP tidak boleh kosong');
            return;
        }
        if (!message.trim()) {
            setError('Pesan tidak boleh kosong');
            return;
        }
        setError('');
        
        // Simple formatting simulation
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.substring(1);
        }
        if (!formattedPhone.endsWith('@s.whatsapp.net')) {
            formattedPhone += '@s.whatsapp.net';
        }

        onSend(formattedPhone, message.trim());
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl min-h-[50%]">
                    <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">Pesan Baru</Text>
                        <TouchableOpacity onPress={onDismiss} className="p-2 bg-gray-100 rounded-full" disabled={sending}>
                            <X color="#6B7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    <View className="p-5">
                        {error ? <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text> : null}
                        
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nomor HP <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl bg-gray-50 text-gray-800 p-4"
                                placeholder="Contoh: 62812345678"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                editable={!sending}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Pesan <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="border border-gray-200 rounded-xl bg-gray-50 text-gray-800 p-4"
                                placeholder="Ketik pesan..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                textAlignVertical="top"
                                value={message}
                                onChangeText={setMessage}
                                editable={!sending}
                                style={{ minHeight: 80 }}
                            />
                        </View>
                    </View>

                    <View className="p-4 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={sending}
                            className="w-full py-4 rounded-2xl flex-row items-center justify-center"
                            style={{ 
                                backgroundColor: theme.colors.primary,
                                opacity: sending ? 0.7 : 1,
                                elevation: 4, 
                                shadowColor: theme.colors.primary, 
                                shadowOffset: { width: 0, height: 4 }, 
                                shadowOpacity: 0.3, 
                                shadowRadius: 8 
                            }}
                        >
                            {sending ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Send color="#fff" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Kirim Pesan</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
