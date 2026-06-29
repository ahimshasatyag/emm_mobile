import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CheckCircle, Trash2, Edit2, Save, X, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductPriceReq } from '../hooks/useProductPriceReq';
import { ProductPriceReqEditSkeleton } from '../skeleton/ProductPriceReqEditSkeleton';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';

export function ProductPriceReqEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params || {};

    const {
        selectedRequest,
        isDetailLoading,
        isActionLoading,
        products,
        loadRequestDetail,
        loadProducts,
        resetDetail,
        updateExistingRequest,
        changeRequestStatus
    } = useProductPriceReq();

    const [isInitializing, setIsInitializing] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    const [priceAcc, setPriceAcc] = useState('');

    const isDraft = selectedRequest?.status === 'DRAFT';
    const isConfirm = selectedRequest?.status === 'CONFIRM';
    const isSuccess = selectedRequest?.status === 'SUCCESS';
    const isCancel = selectedRequest?.status === 'CANCEL';

    const loadData = async () => {
        try {
            await loadProducts();
            if (id) {
                await loadRequestDetail(id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);
            await loadData();
            await new Promise(res => setTimeout(res, 600));
            setIsInitializing(false);
        };
        init();
        return () => resetDetail();
    }, [id]);

    useEffect(() => {
        if (selectedRequest && products.length > 0) {
            setSelectedProductId(selectedRequest.id_product);
            if (selectedRequest.product_price_acc) {
                setPriceAcc(selectedRequest.product_price_acc.toString());
            }
        }
    }, [selectedRequest, products]);

    const handleSave = async () => {
        if (!selectedProductId) {
            Alert.alert('Perhatian', 'Silakan pilih produk terlebih dahulu');
            return;
        }

        const payload: any = { id_product: selectedProductId };
        if (isConfirm && priceAcc) {
            payload.product_price_acc = Number(priceAcc);
        }

        try {
            const success = await updateExistingRequest(id, payload);
            if (success) {
                Alert.alert('Sukses', 'Berhasil memperbarui pengajuan');
                setIsEditing(false);
            }
        } catch (error) {
            // Handled by hook
        }
    };

    const handleConfirm = () => {
        Alert.alert(
            'Konfirmasi',
            'Apakah anda yakin ingin mengonfirmasi pengajuan ini?',
            [
                { text: 'Tidak, batalkan!', style: 'cancel' },
                {
                    text: 'Ya, confirm!',
                    onPress: async () => {
                        const success = await changeRequestStatus(id, 'CONFIRM');
                        if (success) {
                            Alert.alert('Sukses', 'Status diubah menjadi CONFIRM');
                            setIsEditing(false);
                        }
                    }
                }
            ]
        );
    };

    const handleDelete = () => {
        Alert.alert(
            'Hapus',
            'Apakah anda yakin ingin menghapus/cancel pengajuan ini?',
            [
                { text: 'Tidak, batalkan!', style: 'cancel' },
                {
                    text: 'Ya, hapus!',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await changeRequestStatus(id, 'CANCEL');
                        if (success) {
                            navigation.goBack();
                        }
                    }
                }
            ]
        );
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (selectedRequest) {
            setSelectedProductId(selectedRequest.id_product);
            if (selectedRequest.product_price_acc) {
                setPriceAcc(selectedRequest.product_price_acc.toString());
            } else {
                setPriceAcc('');
            }
        }
    };

    const isLoading = isInitializing || isDetailLoading;
    const canSelectProduct = isEditing && isDraft;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT PRODUCT PRICE REQUEST" : "DETAIL PRODUCT PRICE REQUEST")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl refreshing={isLoading && !isInitializing} onRefresh={loadData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductPriceReqEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            {/* Status Section as Text */}
                            <View className="flex-row justify-end items-center mb-6 pb-4 border-b border-gray-100">
                                <Text className={`text-sm font-bold ${selectedRequest?.status === 'SUCCESS' ? 'text-green-600' :
                                    selectedRequest?.status === 'CONFIRM' ? 'text-yellow-600' :
                                        selectedRequest?.status === 'CANCEL' ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                    {selectedRequest?.status || '-'}
                                </Text>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Product <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!canSelectProduct && 'opacity-70'}`}>
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
                                        disable={!canSelectProduct}
                                        selectedTextStyle={{ color: canSelectProduct ? '#111827' : '#6B7280', fontSize: 14 }}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        inputSearchStyle={{ height: 40, fontSize: 14, borderRadius: 8 }}
                                        iconColor={canSelectProduct ? '#9CA3AF' : 'transparent'}
                                    />
                                </View>
                            </View>

                            {(isConfirm || isSuccess) && (
                                <View className="mb-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Product Price Acc</Text>
                                    <TextInput
                                        className={`px-4 py-3 rounded-xl border ${(isEditing && isConfirm) ? 'bg-gray-50 border-gray-200 focus:border-indigo-500 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                        keyboardType="numeric"
                                        value={priceAcc}
                                        onChangeText={setPriceAcc}
                                        placeholder="Belum ada harga Acc"
                                        editable={isEditing && isConfirm}
                                    />
                                    {isEditing && isConfirm && <Text className="text-xs text-gray-400 mt-1">Mengisi harga dan menyimpan akan menyimulasikan data sukses.</Text>}
                                </View>
                            )}
                        </Animated.View>

                        {/* Extra Actions for Draft (Confirm & Delete) in View Mode */}
                        {!isEditing && isDraft && (
                            <Animated.View
                                entering={FadeInUp.delay(80)}
                                layout={LinearTransition.springify()}
                                className="flex-row mt-2 mb-2 gap-3"
                            >
                                <Button
                                    onPress={handleDelete}
                                    disabled={isActionLoading}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    style={{ backgroundColor: '#EF4444' }}
                                >
                                    <Trash2 color="white" size={18} className="mr-2" />
                                    <Text className="text-white font-bold text-sm">Hapus</Text>
                                </Button>
                                <Button
                                    onPress={handleConfirm}
                                    disabled={isActionLoading}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    style={{ backgroundColor: '#22C55E' }}
                                >
                                    <CheckCircle color="white" size={18} className="mr-2" />
                                    <Text className="text-white font-bold text-sm">Confirm</Text>
                                </Button>
                            </Animated.View>
                        )}

                        <Animated.View
                            key={`actions-${isEditing}`}
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row mt-2 gap-3"
                        >
                            {!isEditing ? (
                                (!isSuccess && !isCancel) && (
                                    <Button
                                        onPress={() => setIsEditing(true)}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Edit2 color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit Request</Text>
                                    </Button>
                                )
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={handleCancelEdit}
                                        disabled={isActionLoading}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
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
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
