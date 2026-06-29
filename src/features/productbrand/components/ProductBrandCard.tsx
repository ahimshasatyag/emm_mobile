import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Tag, ChevronRight } from 'lucide-react-native';
import { ProductBrand } from '../types/productbrand.types';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ProductBrandCardProps {
    brand: ProductBrand;
    isSelected?: boolean;
    onPress: () => void;
    onLongPress?: () => void;
    index: number;
}

export function ProductBrandCard({ brand, isSelected = false, onPress, onLongPress, index }: ProductBrandCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.7}
                className={`bg-white rounded-2xl p-4 mb-3 border ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'} shadow-sm`}
                style={{ elevation: isSelected ? 4 : 2, shadowColor: isSelected ? theme.colors.primary : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                        <View className={`w-12 h-12 rounded-xl items-center justify-center ${isSelected ? 'bg-indigo-200' : 'bg-gray-100'} mr-4`}>
                            <Tag color={isSelected ? theme.colors.primary : '#6b7280'} size={24} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-900 text-base mb-1" numberOfLines={1}>
                                {brand.nm_product_brand}
                            </Text>
                            <Text className="text-gray-500 text-xs font-medium">
                                Kode: {brand.id_product_brand}
                            </Text>
                        </View>
                    </View>

                    <ChevronRight color={theme.colors.primary} size={20} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
