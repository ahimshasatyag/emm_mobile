import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { useProductPriceMkt } from '../hooks/useProductPriceMkt';
import { formatRp, formatUsd } from '../../../utils/helpers/money';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductPriceMktDetailSkeleton } from '../skeleton/ProductPriceMktDetailSkeleton';

export function ProductPriceMktDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id_product } = route.params || {};

    const { selectedDetail, options, isDetailLoading, loadDetail, resetDetail } = useProductPriceMkt();

    useEffect(() => {
        if (id_product) {
            loadDetail(id_product);
        }
    }, [id_product]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return '';
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={'Detail Product'}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl refreshing={isDetailLoading} onRefresh={() => { if (id_product) loadDetail(id_product); }} colors={[theme.colors.primary]} />
                }
            >
                {isDetailLoading ? (
                    <Animated.View exiting={FadeOut.duration(200)}>
                        <ProductPriceMktDetailSkeleton />
                    </Animated.View>
                ) : selectedDetail ? (
                    <Animated.View entering={FadeInUp.duration(400)}>
                        {/* Header Info - Table style */}
                        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm" style={{ elevation: 2 }}>
                            <View className="px-4 py-3 border-b border-gray-100 flex-row">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Product Code</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className="flex-1 text-gray-800 font-bold text-sm">{selectedDetail.code_product}</Text>
                            </View>
                            <View className="px-4 py-3 border-b border-gray-100 flex-row">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Product Name</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className="flex-1 text-gray-600 text-sm">{selectedDetail.nm_product}</Text>
                            </View>
                            <View className="px-4 py-3 border-b border-gray-100 flex-row">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Deskripsi</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className="flex-1 text-gray-600 text-sm">-</Text>
                            </View>
                            <View className="px-4 py-3 flex-row">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Kurs</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className="flex-1 text-gray-600 text-sm">{formatRp(selectedDetail.kurs_bank)}</Text>
                            </View>
                        </View>

                        {/* Price Info - Table style */}
                        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-6 shadow-sm" style={{ elevation: 2 }}>
                            <View className="px-4 py-3 border-b border-gray-100 flex-row">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Price</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className="flex-1 text-gray-600 text-sm">{formatUsd(selectedDetail.product_price)}</Text>
                            </View>
                            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Update Date</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className={`flex-1 text-sm font-bold ${selectedDetail.is_recent ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatDate(selectedDetail.date_update)}
                                </Text>
                            </View>
                            <View className="px-4 py-3 flex-row">
                                <Text className="flex-[0.5] text-gray-800 font-bold text-sm">Estimation IDR</Text>
                                <Text className="mr-2 text-gray-800 font-bold">:</Text>
                                <Text className="flex-1 text-gray-600 text-sm">{formatRp(selectedDetail.estimasi)}</Text>
                            </View>
                        </View>

                        {/* Options Table */}
                        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-6 shadow-sm" style={{ elevation: 2 }}>
                            {/* Table Header */}
                            <View className="flex-row bg-gray-100 px-3 py-3 border-b border-gray-200">
                                <Text className="w-6 font-bold text-gray-800 text-[10px]">No</Text>
                                <Text className="flex-[1.5] font-bold text-gray-800 text-[10px]">Nama Option</Text>
                                <Text className="flex-1 font-bold text-gray-800 text-[10px] text-right">Harga USD</Text>
                                <Text className="flex-1 font-bold text-gray-800 text-[10px] text-right">Kurs</Text>
                                <Text className="flex-[1.2] font-bold text-gray-800 text-[10px] text-right">Estimasi IDR</Text>
                            </View>
                            {/* Table Body */}
                            {options && options.length > 0 ? (
                                options.map((opt, idx) => (
                                    <View key={idx} className={`flex-row px-3 py-3 ${idx < options.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                        <Text className="w-6 text-gray-600 text-[10px]">{idx + 1}</Text>
                                        <Text className="flex-[1.5] text-gray-600 text-[10px]">{opt.nm_product_opt}</Text>
                                        <Text className="flex-1 text-gray-600 text-[10px] text-right">{formatUsd(opt.amount).replace('$', '')}</Text>
                                        <Text className="flex-1 text-gray-600 text-[10px] text-right">{formatRp(opt.kurs).replace('Rp', '').trim()}</Text>
                                        <Text className="flex-[1.2] text-gray-600 text-[10px] text-right">{formatRp(opt.estimasi).replace('Rp', '').trim()}</Text>
                                    </View>
                                ))
                            ) : (
                                <View className="px-4 py-6 items-center">
                                    <Text className="text-gray-400 text-sm">Tidak ada data option</Text>
                                </View>
                            )}
                        </View>

                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInUp.duration(300)} className="items-center justify-center mt-20">
                        <Text className="text-gray-500">Data tidak ditemukan.</Text>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
