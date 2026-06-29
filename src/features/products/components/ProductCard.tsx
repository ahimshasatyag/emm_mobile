import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Database, Package } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ProductData } from '../types/products.types';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ProductCardProps {
    product: ProductData;
    onPress: () => void;
    onLongPress?: () => void;
    isSelected?: boolean;
    index: number;
}

export function ProductCard({ product, onPress, onLongPress, isSelected, index }: ProductCardProps) {
    return (
        <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity 
            activeOpacity={0.7}
            onPress={onPress}
            onLongPress={onLongPress}
            className="bg-white p-4 rounded-2xl mb-3 flex-row items-center"
            style={{ 
                elevation: 2, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 4, 
                opacity: product.f_status === 'f' ? 0.6 : 1,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? theme.colors.primary : 'transparent'
            }}
        >
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.colors.primaryContainer }}>
                <Database color={theme.colors.primary} size={24} />
            </View>
            
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-bold text-gray-900 text-base flex-1 mr-2" numberOfLines={1}>
                        {product.nm_product}
                    </Text>
                    <View className="flex-row items-center">
                        <View className={`px-2 py-1 rounded-md ${product.f_status === 'f' ? 'bg-red-100' : 'bg-green-100'}`}>
                            <Text className={`text-xs font-bold ${product.f_status === 'f' ? 'text-red-700' : 'text-green-700'}`}>
                                {product.code_product}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View className="flex-row items-center flex-wrap">
                    <View className="flex-row items-center mr-3 mb-1">
                        <Package color="#6b7280" size={14} className="mr-1" />
                        <Text className="text-sm text-gray-500">{product.nm_product_kategori}</Text>
                    </View>
                    <View className="flex-row items-center mb-1">
                        <Text className="text-sm text-gray-500">• {product.nm_product_brand}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        </Animated.View>
    );
}
