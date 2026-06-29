import React from 'react';
import { View, Text } from 'react-native';
import {
    Tag, DollarSign, Calendar, RefreshCcw, Calculator
} from 'lucide-react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { formatRp, formatUsd } from '../../../utils/helpers/money';
import { formatDate } from '../../../utils/helpers/date';
import { ProductPriceAgentDetail } from '../types/productpriceagent.types';

interface ProductPriceAgentCardProps {
    detail: ProductPriceAgentDetail;
}

export function ProductPriceAgentCard({ detail }: ProductPriceAgentCardProps) {

    // Status warna dari logic PHP: <= 90 hari = hijau, lebih = merah
    const lastUpdateDate = new Date(detail.date_update);
    const diffTime = Math.abs(new Date().getTime() - lastUpdateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isNew = diffDays <= 90;
    const statusColor = isNew ? '#10b981' : '#ef4444'; // green vs red

    const formattedDateText = formatDate(lastUpdateDate);

    return (
        <Animated.View
            entering={FadeInUp.duration(400).springify()}
            layout={LinearTransition.springify()}
        >
            <View className="bg-white rounded-2xl p-4 mb-4 border shadow-sm" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
                borderColor: '#F3F4F6',
            }}>
                {/* Header */}
                <View className="flex-row items-start mb-4">
                    <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: theme.colors.primaryContainer }}>
                        <Tag color={theme.colors.primary} size={22} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-800 mb-0.5" numberOfLines={1}>
                            {detail.code_product}
                        </Text>
                        <Text className="text-xs text-gray-500 mb-1" numberOfLines={2}>
                            {detail.nm_product}
                        </Text>
                        <View className="flex-row items-center">
                            <Calendar size={11} color="#9CA3AF" />
                            <Text className="text-[10px] text-gray-400 ml-1">
                                Last Modified: {formattedDateText}
                            </Text>
                            <View className={`ml-2 px-2 py-0.5 rounded-full ${isNew ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-[9px] font-bold ${isNew ? 'text-green-700' : 'text-red-700'}`}>
                                    {isNew ? '● RECENT' : '● OUTDATED'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price Grid */}
                <View className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                    <View className="flex-row mb-2">
                        {/* Price */}
                        <View className="flex-row items-center bg-white p-2.5 rounded-lg border border-gray-100 flex-1 mr-2 shadow-sm">
                            <DollarSign size={13} color="#6B7280" />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-[10px] text-gray-500 mb-0.5">Price</Text>
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatUsd(detail.product_price_agent)}
                                </Text>
                            </View>
                        </View>
                        {/* Kurs */}
                        <View className="flex-row items-center bg-white p-2.5 rounded-lg border border-gray-100 flex-1 shadow-sm">
                            <RefreshCcw size={13} color="#6B7280" />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-[10px] text-gray-500 mb-0.5">Kurs</Text>
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatRp(detail.kurs_bank)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    
                    <View className="flex-row">
                        {/* Est IDR */}
                        <View className="flex-row items-center p-2.5 rounded-lg border flex-1 shadow-sm" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
                            <Calculator size={13} color="#059669" />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-[10px] text-emerald-600 mb-0.5">Estimation IDR</Text>
                                <Text className="text-xs font-bold text-emerald-700" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatRp(detail.estimasi)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
