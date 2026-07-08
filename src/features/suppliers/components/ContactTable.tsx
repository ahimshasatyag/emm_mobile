import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users, Trash2 } from 'lucide-react-native';
import { SupplierContact } from '../types/suppliers.types';

interface ContactTableProps {
    contacts: SupplierContact[];
    onEditContact: (index: number) => void;
    onDeleteContact?: (index: number) => void;
    isEditMode?: boolean;
}

export function ContactTable({ contacts, onEditContact, onDeleteContact, isEditMode = true }: ContactTableProps) {
    return (
        <View className="mb-4 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                <Text className="flex-1 text-xs font-bold text-gray-500">Nama & Posisi</Text>
                <Text className="flex-1 text-xs font-bold text-gray-500">Kontak</Text>
                {isEditMode && <View className="w-10" />}
            </View>
            {contacts.map((item, index) => (
                <View
                    key={index}
                    className="flex-row p-3 items-center border-b border-gray-50"
                >
                    <TouchableOpacity 
                        className="flex-1 pr-2 flex-row" 
                        onPress={() => onEditContact(index)}
                        disabled={!isEditMode}
                    >
                        <View className="flex-1 pr-2 border-r border-gray-100">
                            <Text className="text-xs font-bold text-gray-800" numberOfLines={1}>
                                {item.nm_suppliers_contact || '-'}
                            </Text>
                            <Text className="text-[10px] text-gray-500 mt-1" numberOfLines={1}>{item.suppliers_contact_posisi || '-'}</Text>
                        </View>
                        <View className="flex-1 pl-2">
                            <Text className="text-[10px] text-gray-700" numberOfLines={1}>{item.suppliers_contact_phone || '-'}</Text>
                            <Text className="text-[10px] text-gray-500 mt-1" numberOfLines={1}>{item.suppliers_contact_email || '-'}</Text>
                        </View>
                    </TouchableOpacity>

                    {isEditMode && onDeleteContact && (
                        <TouchableOpacity 
                            onPress={() => onDeleteContact(index)}
                            className="w-10 items-center justify-center py-2"
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                    )}
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
