import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProductSubCategoryData } from '../types/productsubcategory.types';
import { ChevronRight, LayoutList } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

interface ProductSubCategoryCardProps {
    subCategory: ProductSubCategoryData;
    onPress: () => void;
    index: number;
}

export function ProductSubCategoryCard({ subCategory, onPress, index }: ProductSubCategoryCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="bg-white rounded-3xl p-4 mb-4 border border-gray-100 flex-row items-center"
                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            >
                <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center mr-4">
                    <LayoutList color={theme.colors.primary} size={24} />
                </View>

                <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-400 mb-1">
                        {subCategory.kode_product_sub_kategori} • {subCategory.nm_product_kategori}
                    </Text>
                    <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                        {subCategory.nm_product_sub_kategori}
                    </Text>
                </View>

                <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
}
