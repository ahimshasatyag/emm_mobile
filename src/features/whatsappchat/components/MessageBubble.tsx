import React from 'react';
import { View, Text } from 'react-native';
import { ChatMessage } from '../types/whatsappchat.types';
import { ADMIN_NUMBER } from '../data/whatsappchat.data';

interface MessageBubbleProps {
    message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isMe = message.mobile_number_sender === ADMIN_NUMBER;

    return (
        <View className={`mb-3 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
            <View 
                className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    isMe ? 'bg-[#DCF8C6] rounded-tr-sm' : 'bg-white rounded-tl-sm border border-gray-100'
                }`}
            >
                <Text className="text-gray-800 text-[15px] leading-5 mb-1">
                    {message.message}
                </Text>
                <Text className="text-gray-400 text-[10px] self-end mt-1">
                    {message.date_create}
                </Text>
            </View>
        </View>
    );
};
