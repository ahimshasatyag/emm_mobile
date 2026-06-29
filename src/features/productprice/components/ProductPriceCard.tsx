import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Tag, DollarSign, Building, Calendar, RefreshCcw, Calculator } from 'lucide-react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { ProductPrice } from '../types/productprice.types';
import { formatDateTime } from '../../../utils/helpers/date';
import { formatRp, formatUsd } from '../../../utils/helpers/money';

interface ProductPriceCardProps {
    item: ProductPrice;
    index: number;
    isSelected?: boolean;
    onPress: () => void;
    onLongPress?: () => void;
}

export function ProductPriceCard({ item, index, isSelected = false, onPress, onLongPress }: ProductPriceCardProps) {

    const renderDate = (dateString?: string) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return formatDateTime(d);
    };

    return (
        <Animated.View 
            entering={FadeInUp.delay(index * 50).springify()} 
            layout={LinearTransition.springify()}
            className="mb-4"
        >
            <TouchableOpacity 
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.7}
                className="bg-white rounded-2xl p-4 border shadow-sm"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? theme.colors.primary : '#F3F4F6'
                }}
            >
                <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 rounded-xl bg-indigo-50 items-center justify-center mr-4">
                        <Tag color={theme.colors.primary} size={24} />
                    </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                            {item.code_product}
                        </Text>
                        {item.nm_product_brand ? (
                            <View className="justify-center mt-0.5">
                                <Text className="text-xs font-medium text-gray-500">{item.nm_product_brand}</Text>
                            </View>
                        ) : null}
                    </View>
                    
                    <Text className="text-xs font-medium text-gray-500 mb-1">{item.nm_product}</Text>
                    
                    <View className="flex-row items-center mb-2">
                        <Calendar size={12} color="#9CA3AF" className="mr-1" />
                        <Text className="text-[10px] text-gray-400">Last Mod: {renderDate(item.waktu)}</Text>
                    </View>
                    

                </View>
                </View>

                {/* Harga dan Est. IDR */}
                <View className="bg-gray-50/50 rounded-xl p-2 border border-gray-100">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center bg-white p-2.5 rounded-lg border border-gray-100 flex-1 mr-2 shadow-sm">
                            <DollarSign size={14} color="#6B7280" className="mr-2" />
                            <View className="flex-1">
                                <Text className="text-[10px] text-gray-500 mb-0.5">Price</Text>
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>{formatUsd(item.product_price)}</Text>
                            </View>
                        </View>
                        
                        <View className="flex-row items-center bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 flex-1 shadow-sm">
                            <Building size={14} color={theme.colors.primary} className="mr-2" />
                            <View className="flex-1">
                                <Text className="text-[10px] text-indigo-500 mb-0.5">Agent Price</Text>
                                <Text className="text-xs font-bold text-indigo-700" numberOfLines={1} adjustsFontSizeToFit>{formatUsd(item.product_price_agent)}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center bg-white p-2.5 rounded-lg border border-gray-100 flex-1 mr-2 shadow-sm">
                            <RefreshCcw size={14} color="#6B7280" className="mr-2" />
                            <View className="flex-1">
                                <Text className="text-[10px] text-gray-500 mb-0.5">Kurs</Text>
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>{formatRp(item.kurs || '0')}</Text>
                            </View>
                        </View>
                        
                        <View className="flex-row items-center bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 flex-1 shadow-sm">
                            <Calculator size={14} color="#059669" className="mr-2" />
                            <View className="flex-1">
                                <Text className="text-[10px] text-emerald-600 mb-0.5">Est. IDR</Text>
                                <Text className="text-xs font-bold text-emerald-700" numberOfLines={1} adjustsFontSizeToFit>{formatRp(item.est_idr || '0')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
