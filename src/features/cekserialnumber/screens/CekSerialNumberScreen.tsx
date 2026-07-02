import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Search, PackageSearch } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { useCekSerialNumber } from '../hooks/useCekSerialNumber';
import { InfoCard } from '../components/InfoCard';
import { HistoryServiceCard } from '../components/HistoryServiceCard';
import { CekSerialNumberSkeleton } from '../skeleton/CekSerialNumberSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';

export function CekSerialNumberScreen() {
    const {
        barcode,
        productInfo,
        historyServices,
        isLoading,
        hasSearched,
        updateBarcode,
        handleSearch
    } = useCekSerialNumber();

    const onSearchSubmit = () => {
        Keyboard.dismiss();
        handleSearch();
    };

    const getProductInfoData = () => {
        if (!productInfo) return [];
        return [
            { label: 'Code Product', value: productInfo.code_product },
            { label: 'Name Product', value: productInfo.nm_product },
            { label: 'Description', value: productInfo.product_deskripsi },
            { label: 'Delivery Order', value: productInfo.do_code },
            { label: 'Warranty Start', value: productInfo.waranty_start },
            { label: 'Warranty Time', value: productInfo.waranty_time ? `${productInfo.waranty_time} Bulan` : '-' },
            { label: 'Warranty End', value: productInfo.waranty_end },
            { label: 'Warranty Status', value: productInfo.waranty_end_raw && new Date(productInfo.waranty_end_raw) >= new Date() ? 'ACTIVE' : 'EXPIRED' },
        ];
    };

    const getCustomerInfoData = () => {
        if (!productInfo) return [];
        return [
            { label: 'Customer', value: productInfo.customer },
            { label: 'Address', value: productInfo.customer_address },
            { label: 'Kabupaten/Kota', value: productInfo.kabupaten },
            { label: 'Provinsi', value: productInfo.provinsi },
            { label: 'Phone', value: productInfo.customer_phone },
            { label: 'Mobile', value: productInfo.customer_mobile },
        ];
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "CEK SERIAL NUMBER"}
                isLoading={isLoading}
            />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2 z-10">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 shadow-sm mb-2">
                        <PackageSearch color={theme.colors.primary} size={20} />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900 h-full"
                            style={{ paddingVertical: 0, lineHeight: 22 }}
                            placeholder="Input Serial Number..."
                            placeholderTextColor="#9ca3af"
                            value={barcode}
                            onChangeText={updateBarcode}
                            onSubmitEditing={onSearchSubmit}
                            returnKeyType="search"
                            autoCapitalize="none"
                            includeFontPadding={false}
                            textAlignVertical="center"
                        />
                        <TouchableOpacity
                            className="px-3 h-8 rounded-lg items-center justify-center ml-2"
                            style={{ backgroundColor: theme.colors.primary }}
                            onPress={onSearchSubmit}
                        >
                            <Text className="text-white text-xs font-bold">Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    hasSearched ? (
                        <RefreshControl 
                            refreshing={isLoading} 
                            onRefresh={handleSearch} 
                            colors={[theme.colors.primary]} 
                        />
                    ) : undefined
                }
            >
                {isLoading ? (
                    <CekSerialNumberSkeleton />
                ) : (
                    hasSearched && (
                        productInfo ? (
                            <Animated.View entering={FadeIn.duration(400)}>
                                <InfoCard
                                    title="Product Information"
                                    data={getProductInfoData()}
                                    index={0}
                                />

                                <InfoCard
                                    title="Customer Information"
                                    data={getCustomerInfoData()}
                                    index={1}
                                />

                                <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mt-4 mb-3">
                                    <Text className="text-lg font-extrabold text-gray-800">History Services</Text>
                                    <Text className="text-xs text-gray-500">Riwayat servis untuk serial number ini.</Text>
                                </Animated.View>

                                {historyServices.length > 0 ? (
                                    historyServices.map((item, index) => (
                                        <HistoryServiceCard
                                            key={index}
                                            item={item}
                                            index={index + 3}
                                        />
                                    ))
                                ) : (
                                    <Animated.View entering={FadeInUp.delay(300)}>
                                        <View className="bg-white p-6 rounded-xl border border-gray-200 items-center justify-center">
                                            <Text className="text-gray-500 text-sm">Tidak ada riwayat services.</Text>
                                        </View>
                                    </Animated.View>
                                )}
                            </Animated.View>
                        ) : (
                            <Animated.View entering={FadeInUp.duration(400)}>
                                <EmptyState
                                    title="Tidak Ditemukan"
                                    message="Serial Number yang Anda cari tidak ditemukan atau belum terdaftar."
                                />
                            </Animated.View>
                        )
                    )
                )}

                {!hasSearched && !isLoading && (
                    <View className="flex-1 items-center justify-center mt-20 opacity-50">
                        <PackageSearch color="#d1d5db" size={80} strokeWidth={1} />
                        <Text className="text-gray-400 mt-4 text-center font-medium">Masukkan Serial Number{"\n"}lalu tekan Search</Text>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
