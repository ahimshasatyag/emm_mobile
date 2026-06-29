import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, CheckCircle2, Edit2, RefreshCw } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut, LinearTransition, FadeIn } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { formatRp } from '../../../utils/helpers/money';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { useProductPrice } from '../hooks/useProductPrice';
import { ProductPriceFormSkeleton } from '../skeleton/ProductPriceFormSkeleton';

export function ProductPriceEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const assetId = route.params?.id;

    const { prices, editPrice, loadPrices } = useProductPrice();

    const [isSaving, setIsSaving] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [price, setPrice] = useState('');
    const [agentPrice, setAgentPrice] = useState('');
    const [deliveryTerm, setDeliveryTerm] = useState('FRANCO JKT');

    // Dummy state for options table since it's not in the main data type yet
    const [options, setOptions] = useState([
        { id: '1', name: 'Option 1', amount: '10' },
        { id: '2', name: 'Option 2', amount: '20' },
    ]);

    const [historyPrice] = useState([
        { id: '1', waktu: '26-06-2026 10:00:00', price: '15.00', created_by: 'Admin' },
        { id: '2', waktu: '25-06-2026 09:30:00', price: '14.50', created_by: 'User1' },
    ]);

    const handleOptionChange = (index: number, val: string) => {
        const newOptions = [...options];
        newOptions[index].amount = val;
        setOptions(newOptions);
    };

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
        }
    }, [currentPrice]);

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

    const handleSave = async () => {
        if (!price.trim() || !agentPrice.trim()) {
            Alert.alert('Error', 'Harga Jual dan Harga Agen wajib diisi.');
            return;
        }

        setIsSaving(true);
        try {
            await editPrice(assetId, {
                id_product: assetId,
                product_price: price,
                product_price_agent: agentPrice,
                delivery_term: deliveryTerm
            } as any);
            Alert.alert('Sukses', 'Harga produk berhasil diperbarui', [
                { text: 'OK', onPress: () => setIsEditing(false) }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal memperbarui harga produk');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRenewPrice = () => {
        Alert.alert(
            "RENEW PRICE",
            "Apakah anda yakin ?",
            [
                { text: "Tidak !", style: "cancel" },
                {
                    text: "Ya !",
                    onPress: () => {
                        Alert.alert("Berhasil !", "Berhasil RENEW PRICE");
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        if (currentPrice) {
            setPrice(currentPrice.product_price);
            setAgentPrice(currentPrice.product_price_agent);
            setDeliveryTerm(currentPrice.delivery_term || 'FRANCO JKT');
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
                title={isInitializing ? "MEMUAT DATA..." : (isEditing ? "EDIT HARGA" : "DETAIL HARGA")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
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
                        <ProductPriceFormSkeleton />
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
                                value={currentPrice.code_product}
                                editable={false}
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Nama Produk</Text>
                            <TextInput
                                className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                value={currentPrice.nm_product}
                                editable={false}
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Brand</Text>
                            <TextInput
                                className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                value={currentPrice.nm_product_brand}
                                editable={false}
                            />
                        </View>

                        <View className="flex-row space-x-4 mb-5 gap-4">
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Price (USD) <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    value={price}
                                    onChangeText={setPrice}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Agent Price (USD) <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    value={agentPrice}
                                    onChangeText={setAgentPrice}
                                    editable={isEditing}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View className="flex-row space-x-4 mb-5 gap-4">
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kurs</Text>
                                <TextInput
                                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 h-14 text-gray-500 font-medium opacity-70"
                                    value={currentPrice.kurs}
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
                    </Animated.View>

                    <Animated.View
                        key={`options-table-${isEditing}`}
                        entering={FadeInUp.delay(75)}
                        layout={LinearTransition.springify()}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                    >
                        <Text className="text-sm font-bold text-gray-700 mb-4">Tabel Option</Text>
                        <View className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                            <View className="flex-row border-b border-gray-200 bg-gray-50 p-3">
                                <Text className="w-10 font-bold text-gray-700 text-xs text-center">No</Text>
                                <Text className="flex-1 font-bold text-gray-700 text-xs px-2">Nama Option</Text>
                                <Text className="w-32 font-bold text-gray-700 text-xs text-right pr-2">Harga USD</Text>
                            </View>
                            {options.map((opt, index) => (
                                <View key={opt.id} className="flex-row border-b border-gray-100 p-3 items-center">
                                    <Text className="w-10 text-center text-gray-600 text-xs font-bold">{index + 1}</Text>
                                    <Text className="flex-1 text-gray-800 text-xs px-2">{opt.name}</Text>
                                    <View className="w-32 pl-2">
                                        <TextInput
                                            className={`bg-gray-50 border border-gray-200 rounded-lg px-2 h-10 text-gray-900 text-xs text-right ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                            value={opt.amount}
                                            onChangeText={(val) => handleOptionChange(index, val)}
                                            editable={isEditing}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            ))}
                            {options.length === 0 && (
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
                                    <Text className="text-white font-bold text-sm">Edit Harga</Text>
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
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                >
                                    <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                </Button>

                                <Button
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-indigo-600"
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg">Simpan</Text>
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
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6"
                        >
                            <Text className="text-sm font-bold text-gray-700 mb-4">History Price</Text>
                            <View className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                                <View className="flex-row border-b border-gray-200 bg-gray-50 p-3">
                                    <Text className="flex-1 font-bold text-gray-700 text-xs px-2">Tgl Modified</Text>
                                    <Text className="w-24 font-bold text-gray-700 text-xs text-right px-2">Price</Text>
                                    <Text className="flex-1 font-bold text-gray-700 text-xs px-2 text-right">Created by</Text>
                                </View>
                                {historyPrice.map((history) => (
                                    <View key={history.id} className="flex-row border-b border-gray-100 p-3 items-center">
                                        <Text className="flex-1 text-gray-800 text-xs px-2">{history.waktu}</Text>
                                        <Text className="w-24 text-gray-800 text-xs text-right px-2 font-medium">{history.price}</Text>
                                        <Text className="flex-1 text-gray-600 text-xs px-2 text-right">{history.created_by}</Text>
                                    </View>
                                ))}
                                {historyPrice.length === 0 && (
                                    <View className="p-4 items-center">
                                        <Text className="text-gray-400 text-xs">Belum ada history perubahan harga.</Text>
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
