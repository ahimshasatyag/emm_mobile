import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Package, Calendar, ChevronDown } from 'lucide-react-native';

interface IncshipmentInvoiceTableProps {
    details?: any[];
}

export function IncshipmentInvoiceTable({ details = [] }: IncshipmentInvoiceTableProps) {
    return (
        <View className="mb-4">
            {/* Form Input Area */}
            <View className="mb-6">
                <View className="mb-4">
                    <Text className="text-sm font-bold text-gray-700 mb-2">Expected Date <Text className="text-red-500">*</Text></Text>
                    <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 flex-row justify-between items-center">
                        <Text className="text-gray-500">Pilih Tanggal...</Text>
                        <Calendar size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Destination <Text className="text-red-500">*</Text></Text>
                    <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 flex-row justify-between items-center">
                        <Text className="text-gray-500">Pilih Destination...</Text>
                        <ChevronDown size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
