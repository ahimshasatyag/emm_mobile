import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductPriceReq } from '../hooks/useProductPriceReq';
import { ProductPriceReqFormSkeleton } from '../skeleton/ProductPriceReqFormSkeleton';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';

export function ProductPriceReqFormScreen() {
    const navigation = useNavigation<any>();

    const { 
        isActionLoading,
        products,
        loadProducts,
        resetDetail,
        createNewRequest
    } = useProductPriceReq();

    const [isInitializing, setIsInitializing] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);
            try {
                await loadProducts();
                resetDetail();
                await new Promise(res => setTimeout(res, 600));
            } finally {
                setIsInitializing(false);
            }
        };
        init();
        return () => resetDetail();
    }, []);

    const handleSave = async () => {
        if (!selectedProductId) {
            Alert.alert('Perhatian', 'Silakan pilih produk terlebih dahulu');
            return;
        }

        try {
            const success = await createNewRequest({ id_product: selectedProductId });
            if (success) {
                Alert.alert('Sukses', 'Berhasil membuat pengajuan');
                navigation.goBack();
            }
        } catch (error) {
            // Error handled by hook
        }
    };

    const isLoading = isInitializing;

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator 
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH PRODUCT PRICE REQUEST"} 
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductPriceReqFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View 
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Pilih Produk <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={products.map(p => ({ label: `${p.code_product} | ${p.nm_product}`, value: p.id_product }))}
                                        search
                                        searchPlaceholder="Cari kode atau nama produk..."
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Produk..."
                                        value={selectedProductId}
                                        onChange={item => setSelectedProductId(item.value)}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        inputSearchStyle={{ height: 40, fontSize: 14, borderRadius: 8 }}
                                    />
                                </View>
                            </View>
                        </Animated.View>

                        <Animated.View 
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row mt-4 gap-3"
                        >
                            <Button
                                variant="outline"
                                onPress={() => navigation.goBack()}
                                disabled={isActionLoading}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                            >
                                <ArrowLeft color={theme.colors.primary} size={20} className="mr-2" />
                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Kembali</Text>
                            </Button>
                            
                            <Button
                                onPress={handleSave}
                                disabled={isActionLoading}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isActionLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan</Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
