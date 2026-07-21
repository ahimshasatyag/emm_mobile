import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface MessageInputProps {
    onSend: (message: string) => void;
    sending?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, sending = false }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim().length > 0 && !sending) {
            onSend(text.trim());
            setText('');
        }
    };

    return (
        <View className="flex-row items-end p-2 bg-[#f0f2f5]">
            <TextInput
                className="flex-1 bg-white rounded-2xl p-3 pt-3 max-h-32 text-gray-800 text-base shadow-sm"
                multiline
                placeholder="Tulis pesan..."
                placeholderTextColor="#9CA3AF"
                value={text}
                onChangeText={setText}
                editable={!sending}
            />
            <View className="ml-2 mb-1 justify-center items-center">
                <TouchableOpacity 
                    className="w-12 h-12 rounded-full items-center justify-center shadow-sm"
                    style={{ backgroundColor: text.trim().length > 0 ? theme.colors.primary : '#9CA3AF' }}
                    onPress={handleSend}
                    disabled={text.trim().length === 0 || sending}
                >
                    {sending ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Send color="white" size={20} style={{ marginLeft: 3 }} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};
