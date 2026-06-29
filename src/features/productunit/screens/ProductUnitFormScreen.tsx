import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ruler, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { useProductUnits } from '../hooks/useProductUnits';
import { ProductUnitFormData } from '../types/productunit.types';
import { ProductUnitFormSkeleton } from '../skeleton/ProductUnitFormSkeleton';

export function ProductUnitFormScreen() {
    const navigation = useNavigation();
    const { addUnit, isLoading } = useProductUnits();
    
    const [formData, setFormData] = useState<ProductUnitFormData>({
        nm_product_satuan: ''
    });

    const [errors, setErrors] = useState<{ nm_product_satuan?: string }>({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate fetch for form initialization
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.nm_product_satuan.trim()) {
            newErrors.nm_product_satuan = 'Nama Satuan wajib diisi';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await addUnit(formData);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan satuan produk');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator title="TAMBAH SATUAN" showBackButton={true} />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductUnitFormSkeleton />
                    </Animated.View>
                ) : (
                <Animated.View key="content" entering={FadeInDown.duration(400).springify()}>
                    
                    <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">


                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                                Nama Satuan <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className={`bg-gray-50 border ${errors.nm_product_satuan ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 h-14 text-gray-900 font-medium`}
                                placeholder="Contoh: PCS, LITER, KG"
                                value={formData.nm_product_satuan}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, nm_product_satuan: text });
                                    if (errors.nm_product_satuan) {
                                        setErrors({ ...errors, nm_product_satuan: undefined });
                                    }
                                }}
                                editable={!isLoading}
                            />
                            {errors.nm_product_satuan && (
                                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.nm_product_satuan}</Text>
                            )}
                        </View>
                    </View>

                    <Animated.View entering={FadeInUp.delay(200).springify()}>
                        <Button 
                            onPress={handleSave} 
                            disabled={isLoading}
                            className="h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                            style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <CheckCircle2 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Simpan Satuan</Text>
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
