import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useProductBrands } from '../hooks/useProductBrands';
import { ProductBrandFormData } from '../types/productbrand.types';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { ProductBrandFormSkeleton } from '../skeleton/ProductBrandFormSkeleton';

export function ProductBrandFormScreen() {
    const navigation = useNavigation<any>();
    const { addBrand, isLoading, refreshData } = useProductBrands();
    
    const [formData, setFormData] = useState<ProductBrandFormData>({
        nm_product_brand: ''
    });

    const handleSave = async () => {
        if (!formData.nm_product_brand.trim()) {
            Alert.alert('Error', 'Brand Name wajib diisi!');
            return;
        }

        try {
            await addBrand(formData);
            navigation.goBack();
        } catch (error) {
            // Error is handled by hook
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator 
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH MEREK"} 
                showBackButton={true} 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refreshData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductBrandFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View 
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Brand Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    placeholder="Masukkan nama merek"
                                    value={formData.nm_product_brand}
                                    onChangeText={(text) => setFormData({ ...formData, nm_product_brand: text })}
                                />
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
                                disabled={isLoading}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                            >
                                <ArrowLeft color={theme.colors.primary} size={20} className="mr-2" />
                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Kembali</Text>
                            </Button>
                            
                            <Button
                                onPress={handleSave}
                                disabled={isLoading}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isLoading ? (
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
