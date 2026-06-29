import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Customer } from '../types/customers.types';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Users, MapPin, Phone, FileText } from 'lucide-react-native';

interface CustomerCardProps {
    item: Customer;
    index: number;
    onPress: (item: Customer) => void;
}

export function CustomerCard({ item, index, onPress }: CustomerCardProps) {
    return (
        <Animated.View 
            entering={FadeInDown.delay(index * 100).springify()}
            className="bg-white rounded-2xl mb-4 border border-gray-100"
            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
        >
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => onPress(item)}
                className="p-4"
            >
                <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-indigo-50 px-3 py-1 rounded-lg">
                        <Text className="text-indigo-600 font-bold text-xs">{item.code_customers}</Text>
                    </View>
                </View>

                <View className="mb-3">
                    <Text className="text-lg font-bold text-gray-900 mb-1">{item.nm_customers}</Text>
                    {item.f_company && item.nama_lengkap && (
                        <View className="flex-row items-center mb-1">
                            <Users size={14} color="#6b7280" />
                            <Text className="text-gray-500 text-sm ml-1">PIC: {item.nama_lengkap}</Text>
                        </View>
                    )}
                </View>

                <View className="space-y-2 bg-gray-50 p-3 rounded-xl">
                    {item.customers_phone || item.customers_mobile ? (
                        <View className="flex-row items-start">
                            <Phone size={14} color="#6b7280" className="mt-0.5" />
                            <Text className="text-gray-600 text-sm ml-2 flex-1">
                                {item.customers_phone} {item.customers_phone && item.customers_mobile ? '/' : ''} {item.customers_mobile}
                            </Text>
                        </View>
                    ) : null}
                    
                    <View className="flex-row items-start mt-2">
                        <MapPin size={14} color="#6b7280" className="mt-0.5" />
                        <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={2}>
                            {item.customers_address}
                        </Text>
                    </View>
                    
                    <View className="flex-row items-start mt-2">
                        <MapPin size={14} color="#9ca3af" className="mt-0.5" />
                        <Text className="text-gray-500 text-xs ml-2 flex-1">
                            {item.kabupaten}, {item.provinsi}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                        <FileText size={14} color="#6366f1" />
                        <Text className="text-indigo-600 text-xs font-bold ml-1">{item.jumlah_so || 0} SO</Text>
                    </View>
                    {item.is_blacklist && (
                        <View className="bg-red-50 px-2 py-0.5 rounded">
                            <Text className="text-red-600 text-xs font-bold">Blacklist</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
