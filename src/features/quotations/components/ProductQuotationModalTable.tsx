import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { formatInputNumber, parseInputNumber } from '../../../utils/helpers/money';

export const ProductQuotationModalTable = () => {
    return (
        <View>
            <Text className="text-sm font-bold text-gray-700 mt-2 mb-2">Options / Varian</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                    <Text className="flex-[0.5] text-xs font-bold text-gray-600 text-center">No</Text>
                    <Text className="flex-[1.5] text-xs font-bold text-gray-600">ID & Nama</Text>
                    <Text className="flex-[1.5] text-xs font-bold text-gray-600 text-center">Harga</Text>
                    <Text className="flex-[1] text-xs font-bold text-gray-600 text-center">Qty</Text>
                    <Text className="flex-[0.5] text-xs font-bold text-gray-600 text-center">Aksi</Text>
                </View>

                {/* Dummy Row for Mockup */}
                <View className="flex-row p-2 border-b border-gray-100 items-center">
                    <Text className="flex-[0.5] text-xs text-gray-600 text-center">1</Text>
                    <View className="flex-[1.5]">
                        <Text className="text-xs text-gray-800 font-medium">OPT-001</Text>
                        <Text className="text-[10px] text-gray-500">Option Name</Text>
                    </View>
                    <View className="flex-[1.5] px-1">
                        <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="0" value={formatInputNumber('0')} keyboardType="numeric" />
                    </View>
                    <View className="flex-[1] px-1">
                        <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="1" keyboardType="numeric" />
                    </View>
                    <View className="flex-[0.5] items-center">
                        <TouchableOpacity>
                            <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row p-2 items-center">
                    <Text className="flex-[0.5] text-xs text-gray-600 text-center">2</Text>
                    <View className="flex-[1.5]">
                        <Text className="text-xs text-gray-800 font-medium">OPT-002</Text>
                        <Text className="text-[10px] text-gray-500">Extra Option</Text>
                    </View>
                    <View className="flex-[1.5] px-1">
                        <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="0" value={formatInputNumber('0')} keyboardType="numeric" />
                    </View>
                    <View className="flex-[1] px-1">
                        <TextInput className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-center" placeholder="1" keyboardType="numeric" />
                    </View>
                    <View className="flex-[0.5] items-center">
                        <TouchableOpacity>
                            <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
