import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users } from 'lucide-react-native';
import { SupplierContact } from '../types/suppliers.types';

interface ContactTableProps {
    contacts: SupplierContact[];
    onEditContact: (index: number) => void;
    isEditMode?: boolean;
}

export function ContactTable({ contacts, onEditContact, isEditMode = true }: ContactTableProps) {
    return (
        <View className="mb-4 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                <Text className="flex-[2] text-xs font-bold text-gray-500">Nama Kontak</Text>
                <Text className="flex-1 text-xs font-bold text-gray-500">Posisi</Text>
                <Text className="flex-1 text-xs font-bold text-gray-500 text-right">Phone</Text>
            </View>
            {contacts.map((item, index) => (
                <View
                    key={index}
                    className="flex-row p-3 items-center border-b border-gray-50"
                >
                    <TouchableOpacity
                        className="flex-1 flex-row items-center"
                        onPress={() => onEditContact(index)}
                    >
                        <Text className="flex-[2] text-xs text-gray-800 pr-2" numberOfLines={1}>
                            {item.nm_suppliers_contact || '-'}
                        </Text>
                        <Text className="flex-1 text-xs text-gray-600 pr-2" numberOfLines={1}>
                            {item.suppliers_contact_posisi || '-'}
                        </Text>
                        <Text className="flex-1 text-xs text-gray-700 text-right" numberOfLines={1}>
                            {item.suppliers_contact_phone || '-'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
            {contacts.length === 0 && (
                <View className="py-8 items-center border-b border-gray-50 bg-white">
                    <Users color="#9ca3af" size={32} className="mb-2" />
                    <Text className="text-gray-400 text-xs font-medium">Belum ada kontak</Text>
                </View>
            )}
        </View>
    );
}
