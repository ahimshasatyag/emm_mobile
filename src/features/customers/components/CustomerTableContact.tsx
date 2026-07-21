import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { CustomerContact } from '../types/customers.types';
import { theme } from '../../../theme/theme';

interface CustomerTableContactProps {
    contacts: CustomerContact[];
    onEdit?: (contact: CustomerContact, index: number) => void;
    onDelete?: (index: number) => void;
}

export function CustomerTableContact({ contacts, onEdit, onDelete }: CustomerTableContactProps) {
    return (
        <View className="bg-white border-y border-gray-200">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Header Tabel */}
                    <View className="flex-row border-b border-gray-200 bg-gray-50 px-5 py-3">
                        <Text className="w-48 text-xs font-bold text-gray-500">Nama</Text>
                        <Text className="w-40 text-xs font-bold text-gray-500">Posisi</Text>
                        {(onEdit || onDelete) && (
                            <View className="w-24" />
                        )}
                    </View>

                    {/* Isi Tabel */}
                    {(!contacts || contacts.length === 0) ? (
                        <View className="py-8 items-center justify-center bg-gray-50">
                            <Text className="text-gray-400 text-sm italic">Belum ada kontak tersimpan</Text>
                        </View>
                    ) : (
                        contacts.map((contact, index) => (
                            <TouchableOpacity 
                                key={contact.id_contact || index.toString()} 
                                onPress={() => onEdit && onEdit(contact, index)}
                                activeOpacity={onEdit ? 0.7 : 1}
                                className={`flex-row px-5 py-4 items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                <Text className="w-48 text-sm text-gray-800 font-medium" numberOfLines={1}>
                                    {contact.nm_customers_contact || '-'}
                                </Text>
                                <Text className="w-40 text-sm text-gray-500" numberOfLines={1}>
                                    {contact.customers_contact_posisi || '-'}
                                </Text>
                                
                                {(onEdit || onDelete) && (
                                    <View className="w-24 flex-row justify-center gap-3">
                                        {onEdit && (
                                            <TouchableOpacity 
                                                onPress={() => onEdit(contact, index)}
                                                activeOpacity={0.7}
                                                className="bg-indigo-50 p-2 rounded-lg"
                                            >
                                                <Edit2 size={16} color={theme.colors.primary} />
                                            </TouchableOpacity>
                                        )}
                                        {onDelete && (
                                            <TouchableOpacity 
                                                onPress={() => onDelete(index)}
                                                activeOpacity={0.7}
                                                className="bg-red-50 p-2 rounded-lg"
                                            >
                                                <Trash2 size={16} color="#ef4444" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
