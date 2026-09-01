import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Package, Hash } from 'lucide-react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { ProductSn } from '../types/productsn.types';

interface ProductsnCardProps {
    item: ProductSn;
    index: number;
    onPress: () => void;
}

export function ProductsnCard({ item, index, onPress }: ProductsnCardProps) {
    return (
        <Animated.View
            entering={FadeInUp.delay(index * 50).springify()}
            layout={LinearTransition.springify()}
            className="mb-4"
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mr-4">
                    <Package color={theme.colors.primary} size={24} />
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                            {item.product?.code_product}
                        </Text>
                        <View className={`px-2 py-0.5 rounded-md ${Number(item.nqty) === 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                            <Text className={`text-xs font-bold ${Number(item.nqty) === 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {Number(item.nqty) === 0 ? 'SALE' : 'READY'}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-xs text-gray-500 font-medium mb-2">
                        {item.product?.nm_product}
                    </Text>

                    {item.sn ? (
                        <View className="flex-row items-center bg-gray-50 p-1.5 rounded-lg border border-gray-100 self-start">
                            <Hash size={12} color="#6B7280" className="mr-1" />
                            <Text className="text-xs font-bold text-gray-700">{item.sn}</Text>
                        </View>
                    ) : null}
                </View>

                <View className="ml-3 items-center justify-center">
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                        <ChevronRight color={theme.colors.primary} size={20} />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
