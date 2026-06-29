import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { useProductPriceAgent } from '../hooks/useProductPriceAgent';
import { formatRp, formatUsd } from '../../../utils/helpers/money';
import { formatDate } from '../../../utils/helpers/date';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductPriceAgentDetailSkeleton } from '../skeleton/ProductPriceAgentDetailSkeleton';

export function ProductPriceAgentDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id_product } = route.params || {};

    const { selectedDetail, isDetailLoading, loadDetail } = useProductPriceAgent();

    useEffect(() => {
        if (id_product) {
            loadDetail(id_product);
        }
    }, [id_product]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="DETAIL PRODUCT AGENT" 
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
                        <ProductPriceAgentDetailSkeleton />
                    </Animated.View>
                ) : selectedDetail ? (
                    <Animated.View entering={FadeInUp.duration(400)}>
                        
                        {/* Identitas Produk */}
                        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm" style={{ elevation: 2 }}>
                            <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identitas Produk</Text>
                            </View>
                            <View className="px-4 py-4 border-b border-gray-100 flex-row">
                                <Text className="w-32 text-sm text-gray-500 font-medium">Product Code</Text>
                                <Text className="flex-1 text-sm font-bold text-gray-900">{selectedDetail.code_product}</Text>
                            </View>
                            <View className="px-4 py-4 border-b border-gray-100 flex-row">
                                <Text className="w-32 text-sm text-gray-500 font-medium">Product Name</Text>
                                <Text className="flex-1 text-sm text-gray-800">{selectedDetail.nm_product}</Text>
                            </View>
                            <View className="px-4 py-4 flex-row">
                                <Text className="w-32 text-sm text-gray-500 font-medium">Kurs</Text>
                                <Text className="flex-1 text-sm text-gray-800">{formatRp(selectedDetail.kurs_bank)}</Text>
                            </View>
                        </View>

                        {/* Harga & Update */}
                        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-6 shadow-sm" style={{ elevation: 2 }}>
                            <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spesifikasi Harga</Text>
                            </View>
                            <View className="px-4 py-4 border-b border-gray-100 flex-row items-center">
                                <Text className="w-32 text-sm text-gray-500 font-medium">Price Agent</Text>
                                <Text className="flex-1 text-lg font-extrabold text-blue-600">{formatUsd(selectedDetail.product_price_agent)}</Text>
                            </View>
                            <View className="px-4 py-4 border-b border-gray-100 flex-row">
                                <Text className="w-32 text-sm text-gray-500 font-medium">Update Date</Text>
                                <View className="flex-1">
                                    {(() => {
                                        const wkt = new Date(selectedDetail.date_update);
                                        const diffTime = Math.abs(new Date().getTime() - wkt.getTime());
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        const isGreen = diffDays <= 90;
                                        
                                        const formattedDateText = formatDate(wkt);

                                        return (
                                            <Text className="text-sm font-bold" style={{ color: isGreen ? '#10b981' : '#ef4444' }}>
                                                {formattedDateText}
                                            </Text>
                                        );
                                    })()}
                                </View>
                            </View>
                            <View className="px-4 py-4 flex-row items-center">
                                <Text className="w-32 text-sm text-gray-500 font-medium">Estimation IDR</Text>
                                <Text className="flex-1 text-base font-bold text-green-600">{formatRp(selectedDetail.estimasi)}</Text>
                            </View>
                        </View>

                    </Animated.View>
                ) : (
                    <View className="items-center mt-10">
                        <Text className="text-gray-500">Data tidak ditemukan.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
