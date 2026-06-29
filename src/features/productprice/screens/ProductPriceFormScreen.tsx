import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, CheckCircle2, Plus, Trash2 } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut, FadeIn } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { useProductPrice } from '../hooks/useProductPrice';
import { ProductPriceMultipleSkeleton } from '../skeleton/ProductPriceMultipleSkeleton';

type TableItem = {
    id: string;
    idProduct: string;
    priceNow: string;
    price: string;
    agentPrice: string;
    kurs: string;
    estimationIdr: string;
    deliveryTerm: string;
};

const PRODUCT_OPTIONS = [
    { label: 'PRD-001 - Produk A', value: 'PRD-001', priceNow: '50000', delivery: 'FRANCO JKT' },
    { label: 'PRD-002 - Produk B', value: 'PRD-002', priceNow: '150000', delivery: 'FOB CHINA' },
    { label: 'PRD-003 - Produk C', value: 'PRD-003', priceNow: '75000', delivery: 'FRANCO JKT' },
];

const DELIVERY_OPTIONS = [
    { label: 'FRANCO JKT', value: 'FRANCO JKT' },
    { label: 'FOB CHINA', value: 'FOB CHINA' },
];

export function ProductPriceFormScreen() {
    const navigation = useNavigation<any>();
    const { addPrice } = useProductPrice();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [items, setItems] = useState<TableItem[]>([
        {
            id: Date.now().toString(),
            idProduct: '',
            priceNow: '',
            price: '',
            agentPrice: '',
            kurs: '15000',
            estimationIdr: '',
            deliveryTerm: 'FRANCO JKT'
        }
    ]);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const onRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const handleAddItem = () => {
        setItems(prev => [
            ...prev,
            {
                id: Date.now().toString() + Math.random().toString(),
                idProduct: '',
                priceNow: '',
                price: '',
                agentPrice: '',
                kurs: '15000',
                estimationIdr: '',
                deliveryTerm: 'FRANCO JKT'
            }
        ]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof TableItem, value: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'price' || field === 'kurs') {
                    const numPrice = parseFloat(updated.price) || 0;
                    const numKurs = parseFloat(updated.kurs) || 0;
                    const est = numPrice * numKurs;
                    updated.estimationIdr = est > 0 ? est.toString() : '';
                }
                return updated;
            }
            return item;
        }));
    };

    const handleSave = async () => {
        if (items.length === 0) {
            Alert.alert('Error', 'Tambahkan minimal 1 barang.');
            return;
        }

        const isValid = items.every(item => item.idProduct.trim() && item.price.trim() && item.agentPrice.trim() && item.kurs.trim() && item.deliveryTerm.trim());

        if (!isValid) {
            Alert.alert('Error', 'Harap isi semua field yang wajib pada semua baris.');
            return;
        }

        setIsSaving(true);
        try {
            for (const item of items) {
                await addPrice({
                    id_product: item.idProduct,
                    product_price_lama: item.priceNow,
                    product_price: item.price,
                    product_price_agent: item.agentPrice,
                    kurs_bank: item.kurs,
                    estimation_idr: item.estimationIdr,
                    delivery_term: item.deliveryTerm
                });
            }
            Alert.alert('Sukses', 'Harga produk berhasil ditambahkan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan harga produk');
        } finally {
            setIsSaving(false);
        }
    };

    const COL_WIDTH = {
        name: 220,
        priceNow: 140,
        priceUpdate: 140,
        priceAgent: 140,
        kurs: 120,
        estimation: 140,
        delivery: 140,
        action: 60
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator title={isLoading ? "MEMUAT DATA..." : "TAMBAH PRODUCT PRICE"} showBackButton={true} onBackPress={() => navigation.goBack()} />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductPriceMultipleSkeleton />
                    </Animated.View>
                ) : (
                <Animated.View key="content" entering={FadeIn.duration(600)}>

                    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Daftar Barang</Text>
                            <TouchableOpacity
                                onPress={handleAddItem}
                                className="flex-row items-center px-4 py-2 rounded-full shadow-sm"
                                style={{ backgroundColor: theme.colors.primary }}
                            >
                                <Plus color="white" size={16} />
                                <Text className="text-white font-bold ml-1">Tambah Barang</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border border-gray-200 rounded-2xl bg-white" contentContainerStyle={{ flexGrow: 1 }}>
                            <View>
                                {/* Table Header */}
                                <View className="flex-row border-b border-gray-200 bg-gray-50 p-4 rounded-t-2xl">
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.name, paddingRight: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Product Name</Text></View>
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceNow, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Now</Text></View>
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceUpdate, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Update</Text></View>
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceAgent, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Agent</Text></View>
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.kurs, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Kurs</Text></View>
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.estimation, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Estimation IDR</Text></View>
                                    <View className="border-r border-gray-200" style={{ width: COL_WIDTH.delivery, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Delivery Term</Text></View>
                                    <View style={{ width: COL_WIDTH.action }}><Text className="font-bold text-gray-700 text-xs text-center">Aksi</Text></View>
                                </View>

                                {/* Table Body */}
                                {items.map((item, index) => (
                                    <View key={item.id} className="flex-row border-b border-gray-100 p-4 items-center">
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.name, paddingRight: 8 }}>
                                            <View className="border border-gray-200 rounded-lg bg-gray-50">
                                                <Dropdown
                                                    style={{ height: 40, paddingHorizontal: 12 }}
                                                    data={PRODUCT_OPTIONS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Pilih Barang"
                                                    value={item.idProduct}
                                                    onChange={(val) => {
                                                        updateItem(item.id, 'idProduct', val.value);
                                                        updateItem(item.id, 'priceNow', val.priceNow);
                                                        updateItem(item.id, 'deliveryTerm', val.delivery);
                                                    }}
                                                    selectedTextStyle={{ color: '#111827', fontSize: 12 }}
                                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 12 }}
                                                />
                                            </View>
                                        </View>
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceNow, paddingHorizontal: 8 }}>
                                            <TextInput
                                                className="bg-gray-100 border border-gray-200 rounded-lg px-3 h-10 text-gray-500 text-xs"
                                                value={item.priceNow}
                                                editable={false}
                                                placeholder="Otomatis"
                                            />
                                        </View>
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceUpdate, paddingHorizontal: 8 }}>
                                            <TextInput
                                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 h-10 text-gray-900 text-xs"
                                                value={item.price}
                                                onChangeText={(val) => updateItem(item.id, 'price', val)}
                                                keyboardType="numeric"
                                                placeholder="0"
                                            />
                                        </View>
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceAgent, paddingHorizontal: 8 }}>
                                            <TextInput
                                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 h-10 text-gray-900 text-xs"
                                                value={item.agentPrice}
                                                onChangeText={(val) => updateItem(item.id, 'agentPrice', val)}
                                                keyboardType="numeric"
                                                placeholder="0"
                                            />
                                        </View>
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.kurs, paddingHorizontal: 8 }}>
                                            <TextInput
                                                className="bg-gray-100 border border-gray-200 rounded-lg px-3 h-10 text-gray-500 text-xs"
                                                value={item.kurs}
                                                editable={false}
                                            />
                                        </View>
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.estimation, paddingHorizontal: 8 }}>
                                            <TextInput
                                                className="bg-gray-100 border border-gray-200 rounded-lg px-3 h-10 text-gray-500 text-xs"
                                                value={item.estimationIdr}
                                                editable={false}
                                                placeholder="0"
                                            />
                                        </View>
                                        <View className="border-r border-gray-200" style={{ width: COL_WIDTH.delivery, paddingHorizontal: 8 }}>
                                            <View className="border border-gray-200 rounded-lg bg-gray-50">
                                                <Dropdown
                                                    style={{ height: 40, paddingHorizontal: 12 }}
                                                    data={DELIVERY_OPTIONS}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Pilih"
                                                    value={item.deliveryTerm}
                                                    onChange={(val) => updateItem(item.id, 'deliveryTerm', val.value)}
                                                    selectedTextStyle={{ color: '#111827', fontSize: 12 }}
                                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 12 }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: COL_WIDTH.action, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => handleRemoveItem(item.id)} className="bg-red-50 p-2 rounded-full">
                                                <Trash2 color="red" size={16} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                                {items.length === 0 && (
                                    <View className="p-8 items-center justify-center">
                                        <Text className="text-gray-400">Belum ada barang, silakan tambah barang.</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    <Button
                        onPress={handleSave}
                        disabled={isSaving}
                        className="h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600 mb-8"
                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <CheckCircle2 color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan Semua Harga</Text>
                            </>
                        )}
                    </Button>
                </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
