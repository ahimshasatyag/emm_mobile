import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FolderTree } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ProductCategoryData } from '../types/productcategory.types';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ProductCategoryCardProps {
    category: ProductCategoryData;
    onPress: () => void;
    index: number;
    isSelected?: boolean;
    onLongPress?: () => void;
}

export function ProductCategoryCard({ category, onPress, index, isSelected = false, onLongPress }: ProductCategoryCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={onPress}
                onLongPress={onLongPress}
                className={`bg-white p-4 rounded-2xl mb-3 flex-row items-center border ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'}`}
            style={{ 
                elevation: 2, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 4, 
                borderWidth: 1,
                borderColor: 'transparent'
            }}
        >
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                <FolderTree color={theme.colors.primary} size={24} />
            </View>
            
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-bold text-gray-900 text-base flex-1 mr-2" numberOfLines={1}>
                        {category.nm_product_kategori}
                    </Text>
                    <View className="flex-row items-center">
                        <View className="px-2 py-1 rounded-md bg-gray-100">
                            <Text className="text-xs font-bold text-gray-700">
                                {category.kode_product_kategori}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="flex-row items-center flex-wrap mt-1">
                    <Text className="text-sm text-gray-500">Kategori Produk</Text>
                </View>
            </View>
        </TouchableOpacity>
        </Animated.View>
    );
}
