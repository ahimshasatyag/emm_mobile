import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { Contact } from '../types/whatsappchat.types';

interface ContactItemProps {
    contact: Contact;
    onPress: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onPress }) => {
    // Basic date formatting
    const dateObj = new Date(contact.date_create);
    const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    return (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center p-3 mb-2 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
            <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3 border border-gray-200">
                <User color="#9CA3AF" size={24} />
            </View>
            <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base mb-1" numberOfLines={1}>
                    {contact.number}
                </Text>
                <Text className="text-gray-400 text-xs">
                    {dateStr} {timeStr}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
