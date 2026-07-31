import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Download } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { SalesContractEditSkeleton } from '../skeleton/SalesContractEditSkeleton';
import { useSalesContract } from '../hooks/useSalesContract';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

type RootStackParamList = {
    SalesContractEdit: { id: string; showSuccessToast?: boolean };
    SalesContractList: undefined;
};

export function SalesContractEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'SalesContractEdit'>>();
    const { id, showSuccessToast } = route.params;

    const { getContractById, currentContract, isLoading } = useSalesContract();

    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as ToastType });

    useEffect(() => {
        if (showSuccessToast) {
            setToast({ visible: true, message: "Sales Contract berhasil dibuat", type: 'success' });
        }
    }, [showSuccessToast]);

    useEffect(() => {
        getContractById(id);
    }, [id]);

    const onRefresh = () => {
        if (id) {
            getContractById(id);
        }
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return value;
        return num.toLocaleString('id-ID');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages 
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title={!currentContract || isLoading ? "MEMUAT DATA..." : "DETAIL SALES CONTRACT"}
                showBackButton
                onBackPress={() => {
                    if (showSuccessToast) {
                        navigation.navigate('Drawer', { screen: 'SalesContractList' });
                    } else {
                        navigation.goBack();
                    }
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
                >
                    {!currentContract || isLoading ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <SalesContractEditSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View key="content" entering={FadeIn.duration(600)}>
                            {/* Actions */}
                            <View className="mb-4 flex-row justify-end">
                                <TouchableOpacity
                                    className="flex-row items-center px-4 py-2 bg-green-500 rounded-lg shadow-sm"
                                    onPress={() => {
                                        // Dummy Download Action
                                    }}
                                >
                                    <Download size={16} color="white" />
                                    <Text className="ml-2 font-bold text-white text-xs">Download PDF</Text>
                                </TouchableOpacity>
                            </View>

                            {/* SO & Customer Info */}
                            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                                <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Informasi SO</Text>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">SO Code</Text>
                                    <TextInput
                                        value={currentContract.code_so}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>
                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Customer</Text>
                                    <TextInput
                                        value={currentContract.nm_customers}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>
                            </View>

                            {/* Company & Personal Info */}
                            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                                <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Data Customer</Text>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Company</Text>
                                    <TextInput
                                        value={currentContract.f_company ? "Ya" : "Tidak"}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>

                                {currentContract.f_company && (
                                    <View className="mb-3">
                                        <Text className="text-xs text-gray-500 mb-1">Nama Lengkap</Text>
                                        <TextInput
                                            value={currentContract.nama_lengkap}
                                            editable={false}
                                            className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                        />
                                    </View>
                                )}

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">NIK</Text>
                                    <TextInput
                                        value={currentContract.nik}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>

                                {currentContract.f_company && (
                                    <>
                                        <View className="mb-3">
                                            <Text className="text-xs text-gray-500 mb-1">NIB</Text>
                                            <TextInput
                                                value={currentContract.nib}
                                                editable={false}
                                                className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                            />
                                        </View>
                                        <View className="mb-3">
                                            <Text className="text-xs text-gray-500 mb-1">NPWP</Text>
                                            <TextInput
                                                value={currentContract.npwp}
                                                editable={false}
                                                className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                            />
                                        </View>
                                    </>
                                )}

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Alamat</Text>
                                    <TextInput
                                        value={currentContract.alamat || currentContract.customers_address}
                                        editable={false}
                                        multiline
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 h-20"
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>

                            {/* Calculation Info */}
                            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                                <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Kalkulasi</Text>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Tgl Contract</Text>
                                    <TextInput
                                        value={currentContract.date_contract}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Total</Text>
                                    <TextInput
                                        value={formatCurrency(currentContract.n_amount)}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>

                                <View className="flex-row justify-between mb-3">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-xs text-gray-500 mb-1">DP (%)</Text>
                                        <TextInput
                                            value={String(currentContract.dp_persen || '')}
                                            editable={false}
                                            className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                        />
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <Text className="text-xs text-gray-500 mb-1">DP (Nominal)</Text>
                                        <TextInput
                                            value={formatCurrency(currentContract.dp_nominal)}
                                            editable={false}
                                            className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                        />
                                    </View>
                                </View>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Sisa</Text>
                                    <TextInput
                                        value={formatCurrency(currentContract.n_sisa)}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Lama Cicilan</Text>
                                    <TextInput
                                        value={String(currentContract.lama_cicilan || '')}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>

                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Jumlah Cicilan Rp</Text>
                                    <TextInput
                                        value={formatCurrency(currentContract.jml_cicilan_rp)}
                                        editable={false}
                                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                                    />
                                </View>
                            </View>

                            {/* Items */}
                            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
                                <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Daftar Barang</Text>
                                {currentContract.items?.map((item, index) => {
                                    const subTotal = Number(item.product_price) * Number(item.n_qty);
                                    return (
                                        <View key={index} className="mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <Text className="font-bold text-gray-800 text-sm mb-1">{item.code_product} - {item.nm_product}</Text>
                                            <View className="flex-row justify-between mt-2">
                                                <View>
                                                    <Text className="text-xs text-gray-500">Qty: {item.n_qty}</Text>
                                                    <Text className="text-xs text-gray-500">Harga: {formatCurrency(item.product_price)}</Text>
                                                </View>
                                                <View className="items-end">
                                                    <Text className="text-xs text-gray-500">Sub Total</Text>
                                                    <Text className="text-sm font-bold text-blue-600">{formatCurrency(subTotal)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
