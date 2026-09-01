import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Edit2, RefreshCw, X, ArrowLeft, Pencil } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut, LinearTransition, FadeIn, FadeInDown } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { formatRp, formatUsd, formatInputNumber, parseInputNumber } from '../../../utils/helpers/money';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useProductPrice } from '../hooks/useProductPrice';
import { ProductPriceEditSkeleton } from '../skeleton/ProductPriceEditSkeleton';

export function ProductPriceEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const assetId = route.params?.id;

    const { prices, editPrice, loadPrices, validateForm } = useProductPrice();

    const [isSaving, setIsSaving] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [isModalRenewVisible, setIsModalRenewVisible] = useState(false);
    const [price, setPrice] = useState('');
    const [agentPrice, setAgentPrice] = useState('');
    const [deliveryTerm, setDeliveryTerm] = useState('FRANCO JKT');
    const [options, setOptions] = useState<any[]>([]);
    const currentPrice = prices.find(p => p.id_product === assetId);

    useEffect(() => {
        const init = async () => {
            if (prices.length === 0) {
                await loadPrices();
            }
            setIsInitializing(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (currentPrice) {
            setPrice(currentPrice.product_price);
            setAgentPrice(currentPrice.product_price_agent);
            setDeliveryTerm(currentPrice.delivery_term || 'FRANCO JKT');
            if (currentPrice.options) {
                setOptions(currentPrice.options);
            }
        }
    }, [currentPrice]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].amount = value;
        setOptions(newOptions);
    };

    useEffect(() => {
        if (route.params?.showSuccessToast) {
            setToastState({
                visible: true,
                type: 'success',
                message: route.params.successMessage || 'Berhasil'
            });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [route.params]);

    const deliveryTermData = [
        { label: 'FRANCO JKT', value: 'FRANCO JKT' },
        { label: 'FOB CHINA', value: 'FOB CHINA' },
    ];

    const estIdr = useMemo(() => {
        const p = parseFloat(price || '0');
        const k = parseFloat(currentPrice?.kurs || '0');
        if (isNaN(p) || isNaN(k)) return '0';
        let hasil = p * k;
        hasil = Math.ceil(hasil / 1000000) * 1000000;
        return hasil.toString();
    }, [price, currentPrice?.kurs]);

    const handleSave = () => {
        const errorMsg = validateForm({
            id_product: assetId,
            price,
            agentPrice,
            deliveryTerm,
            kurs_bank: currentPrice?.kurs || '15000'
        });
        if (errorMsg) {
            setToastState({
                visible: true,
                type: 'error',
                message: errorMsg
            });
            return;
        }

        setIsModalConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsModalConfirmVisible(false);
        setIsSaving(true);
        try {
            await editPrice(assetId, {
                id_product: assetId,
                product_price: price,
                product_price_agent: agentPrice,
                delivery_term: deliveryTerm,
                kurs_bank: currentPrice?.kurs || ''
            } as any);
            setToastState({
                visible: true,
                type: 'success',
                message: 'Harga produk berhasil diperbarui'
            });
            setIsEditing(false);
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error.message || 'Gagal memperbarui harga produk'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRenewPrice = () => {
        setIsModalRenewVisible(true);
    };

    const confirmRenewPrice = async () => {
        setIsModalRenewVisible(false);
        setToastState({
            visible: true,
            type: 'success',
            message: 'Berhasil RENEW PRICE'
        });
    };

    const handleCancel = () => {
        if (currentPrice) {
            setPrice(currentPrice.product_price);
            setAgentPrice(currentPrice.product_price_agent);
            setDeliveryTerm(currentPrice.delivery_term || '');
        }
        setIsEditing(false);
    };

    const onRefresh = () => {
        setIsInitializing(true);
        setTimeout(() => setIsInitializing(false), 1500);
    };

    if (!currentPrice && !isInitializing) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="ERROR" showBackButton={true} onBackPress={() => navigation.goBack()} />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500 font-medium">Data harga tidak ditemukan.</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isInitializing ? "MEMUAT DATA..." : (isEditing ? "EDIT PRODUCT PRICE" : "DETAIL PRODUCT PRICE")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ToastMessages
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.type === 'success' ? 'Berhasil' : 'Peringatan'}
                message={toastState.message}
                onClose={() => setToastState(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan perubahan harga ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
            />

            <ModalConfirm
                visible={isModalRenewVisible}
                title="RENEW PRICE"
                message="Apakah Anda yakin ingin melakukan renew price?"
                confirmText="Ya !"
                cancelText="Tidak !"
                onCancel={() => setIsModalRenewVisible(false)}
                onConfirm={confirmRenewPrice}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isInitializing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isInitializing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductPriceEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                        >
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kode Produk</Text>
                                <TextInput
                                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                    value={currentPrice?.code_product || ''}
                                    editable={false}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Produk</Text>
                                <TextInput
                                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                    value={currentPrice?.nm_product || ''}
                                    editable={false}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Brand</Text>
                                <TextInput
                                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                    value={currentPrice?.nm_product_brand || ''}
                                    editable={false}
                                />
                            </View>

                            <View className="flex-row space-x-4 mb-5 gap-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Price (USD) <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                        value={isEditing ? (price ? formatInputNumber(String(price)) : '') : (price ? formatUsd(price) : price)}
                                        onChangeText={(val) => setPrice(parseInputNumber(String(val)))}
                                        editable={isEditing}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Agent Price (USD) <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                        value={isEditing ? (agentPrice ? formatInputNumber(String(agentPrice)) : '') : (agentPrice ? formatUsd(agentPrice) : agentPrice)}
                                        onChangeText={(val) => setAgentPrice(parseInputNumber(String(val)))}
                                        editable={isEditing}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View className="flex-row space-x-4 mb-5 gap-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Kurs <Text className="font-normal text-gray-400">(Kurs: {formatRp(currentPrice?.kurs || '0')})</Text></Text>
                                    <TextInput
                                        className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                        value={currentPrice?.kurs ? formatRp(currentPrice.kurs) : ''}
                                        editable={false}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Est. IDR</Text>
                                    <TextInput
                                        className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 h-14 text-emerald-700 font-bold opacity-90"
                                        value={formatRp(estIdr)}
                                        editable={false}
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Delivery Term <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={deliveryTermData}
                                        labelField="label"
                                        valueField="value"
                                        value={deliveryTerm}
                                        disable={!isEditing}
                                        onChange={(val) => setDeliveryTerm(val.value)}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                    />
                                </View>
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-4 mt-2">Tabel Option</Text>
                            <View className="border-y border-gray-200 bg-white -mx-6">
                                <View className="flex-row border-b border-gray-200 bg-gray-50 p-3 px-6">
                                    <Text className="w-10 font-bold text-gray-700 text-xs text-center">No</Text>
                                    <Text className="flex-1 font-bold text-gray-700 text-xs px-2">Nama Option</Text>
                                    <Text className="w-32 font-bold text-gray-700 text-xs text-right pr-2">Harga USD</Text>
                                </View>
                                {options && options.map((opt, index) => (
                                    <View key={opt.id_product_price_opt || index} className="flex-row border-b border-gray-100 p-3 px-6 items-center">
                                        <Text className="w-10 text-center text-gray-600 text-xs font-bold">{index + 1}</Text>
                                        <Text className="flex-1 text-gray-800 text-xs px-2">{opt.nm_product_opt}</Text>
                                        <View className="w-32 pl-2">
                                            <TextInput
                                                className={`bg-gray-50 border border-gray-200 rounded-lg px-2 h-10 text-gray-900 text-xs text-right ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                                value={isEditing ? (opt.amount ? formatInputNumber(opt.amount) : '') : (opt.amount ? formatUsd(opt.amount) : opt.amount)}
                                                onChangeText={(val) => handleOptionChange(index, parseInputNumber(val))}
                                                editable={isEditing}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                ))}
                                {(!options || options.length === 0) && (
                                    <View className="p-4 items-center">
                                        <Text className="text-gray-400 text-xs">Tidak ada option.</Text>
                                    </View>
                                )}
                            </View>


                        </Animated.View>

                        <Animated.View
                            key={`actions-${isEditing}`}
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row space-x-3 gap-3"
                        >
                            {!isEditing ? (
                                <>
                                    <Button
                                        onPress={() => setIsEditing(true)}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Edit2 color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-sm">Edit Product Price</Text>
                                    </Button>
                                    <Button
                                        onPress={handleRenewPrice}
                                        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-sky-500"
                                        style={{ elevation: 2, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <RefreshCw color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-sm">Renew Price</Text>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={handleCancel}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center border-gray-200"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-sm" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-indigo-600"
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Save color="white" size={20} className="mr-2" />
                                                <Text className="text-white font-bold text-sm">Simpan</Text>
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Animated.View>

                        {!isEditing && (
                            <Animated.View
                                key="history-table"
                                entering={FadeInUp.delay(125)}
                                layout={LinearTransition.springify()}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6 mb-8"
                            >
                                <Text className="text-sm font-bold text-gray-700 mb-4">History Price</Text>
                                <View className="border-y border-gray-200 bg-white -mx-6">
                                    <View className="flex-row border-b border-gray-200 bg-gray-50 p-3 px-6">
                                        <Text className="flex-1 font-bold text-gray-700 text-xs px-2">Tgl Modified</Text>
                                        <Text className="w-24 font-bold text-gray-700 text-xs text-right px-2">Price</Text>
                                        <Text className="flex-1 font-bold text-gray-700 text-xs px-2 text-right">Created by</Text>
                                    </View>
                                    {currentPrice?.history && currentPrice.history.length > 0 ? (
                                        currentPrice.history.map((history: any, index: number) => (
                                            <View key={index} className="flex-row border-b border-gray-100 p-3 px-6 items-center">
                                                <Text className="flex-1 text-gray-800 text-xs px-2">{history.waktu}</Text>
                                                <Text className="w-24 text-gray-800 text-xs text-right px-2 font-medium">{history.product_price ? formatUsd(history.product_price) : history.product_price}</Text>
                                                <Text className="flex-1 text-gray-600 text-xs px-2 text-right">{history.username}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <View className="p-4 items-center">
                                            <Text className="text-gray-400 text-xs">Belum ada history data.</Text>
                                        </View>
                                    )}
                                </View>
                            </Animated.View>
                        )}

                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
