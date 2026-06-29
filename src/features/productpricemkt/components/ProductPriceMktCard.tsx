import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
    Tag, DollarSign, Building, Calendar, RefreshCcw, Calculator, TrendingUp, TrendingDown
} from 'lucide-react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { ProductPriceMktDetail, ProductPriceMktOption } from '../types/productpricemkt.types';
import { formatRp, formatUsd } from '../../../utils/helpers/money';

interface ProductPriceMktCardProps {
    detail: ProductPriceMktDetail;
    options: ProductPriceMktOption[];
}

export function ProductPriceMktCard({ detail, options }: ProductPriceMktCardProps) {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return '-';
        }
    };

    return (
        <Animated.View
            entering={FadeInUp.duration(400).springify()}
            layout={LinearTransition.springify()}
        >
            {/* Main Price Card */}
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
                                Last Update: {formatDate(detail.date_update)}
                            </Text>
                            <View className={`ml-2 px-2 py-0.5 rounded-full ${detail.is_recent ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-[9px] font-bold ${detail.is_recent ? 'text-green-700' : 'text-red-700'}`}>
                                    {detail.is_recent ? '● RECENT' : '● OUTDATED'}
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
                                <Text className="text-[10px] text-gray-500 mb-0.5">Price (USD)</Text>
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatUsd(detail.product_price)}
                                </Text>
                            </View>
                        </View>
                        {/* Agent Price */}
                        <View className="flex-row items-center p-2.5 rounded-lg border flex-1 shadow-sm" style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }}>
                            <Building size={13} color={theme.colors.primary} />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-[10px] mb-0.5" style={{ color: theme.colors.primary }}>Agent Price</Text>
                                <Text className="text-xs font-bold" style={{ color: theme.colors.primary }} numberOfLines={1} adjustsFontSizeToFit>
                                    {formatUsd(detail.product_price_agent)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row">
                        {/* Kurs */}
                        <View className="flex-row items-center bg-white p-2.5 rounded-lg border border-gray-100 flex-1 mr-2 shadow-sm">
                            <RefreshCcw size={13} color="#6B7280" />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-[10px] text-gray-500 mb-0.5">Kurs IDR</Text>
                                <Text className="text-xs font-bold text-gray-800" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatRp(detail.kurs_bank)}
                                </Text>
                            </View>
                        </View>
                        {/* Est IDR */}
                        <View className="flex-row items-center p-2.5 rounded-lg border flex-1 shadow-sm" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
                            <Calculator size={13} color="#059669" />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-[10px] text-emerald-600 mb-0.5">Est. IDR</Text>
                                <Text className="text-xs font-bold text-emerald-700" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatRp(detail.estimasi)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Options Table (if any) */}
            {options.length > 0 && (
                <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm" style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <Text className="text-sm font-bold text-gray-700 mb-3">Nama Options</Text>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-50 rounded-lg px-3 py-2 mb-1">
                        <Text className="flex-[2] text-[10px] font-bold text-gray-500">Nama</Text>
                        <Text className="flex-1 text-[10px] font-bold text-gray-500 text-right">Harga USD</Text>
                        <Text className="flex-1 text-[10px] font-bold text-gray-500 text-right">Est. IDR</Text>
                    </View>
                    {options.map((opt, idx) => (
                        <View key={idx} className={`flex-row px-3 py-2.5 ${idx < options.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <Text className="flex-[2] text-xs text-gray-700" numberOfLines={2}>{opt.nm_product_opt}</Text>
                            <Text className="flex-1 text-xs text-gray-700 text-right">{formatUsd(opt.amount)}</Text>
                            <Text className="flex-1 text-xs font-bold text-emerald-700 text-right">{formatRp(opt.estimasi)}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Animated.View>
    );
}
