import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, RefreshControl, StyleSheet } from 'react-native';
import { Save, ArrowLeft, RefreshCcw, DollarSign, Building, Truck } from 'lucide-react-native';
import Animated, { FadeOut, LinearTransition, FadeInUp } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { formatRp } from '../../../utils/helpers/money';
import { dummyProductPrices } from '../data/dummy';
import { ProductPrice } from '../types/productprice.types';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductPriceMultipleSkeleton } from '../skeleton/ProductPriceMultipleSkeleton';

export function ProductPriceMultipleScreen() {
    const navigation = useNavigation();

    const [items, setItems] = useState<ProductPrice[]>([]);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async () => {
        // Simulate network request
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setItems(dummyProductPrices);
                resolve();
            }, 1000);
        });
    };

    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);
            await loadData();
            setIsInitializing(false);
        };
        init();
    }, []);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleChange = (index: number, field: keyof ProductPrice, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto calculate est_idr if product_price or kurs changes
        if (field === 'product_price' || field === 'kurs') {
            const price = parseFloat(newItems[index].product_price || '0');
            const kurs = parseFloat(newItems[index].kurs || '0');
            if (!isNaN(price) && !isNaN(kurs)) {
                // PHP calculation: bulatkanKeAtas1JT(price * kurs)
                let hasil = price * kurs;
                hasil = Math.ceil(hasil / 1000000) * 1000000;
                newItems[index].est_idr = hasil.toString();
            }
        }

        setItems(newItems);
    };

    const handleSave = () => {
        // Show success alert
        Alert.alert("Success", "Multiple prices updated successfully!", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    const deliveryTermData = [
        { label: 'FRANCO JKT', value: 'FRANCO JKT' },
        { label: 'FOB CHINA', value: 'FOB CHINA' },
    ];

    const COL_WIDTH = {
        no: 40,
        name: 220,
        priceUpdate: 140,
        priceAgent: 140,
        kurs: 120,
        estimation: 140,
        delivery: 140
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={(isInitializing || isRefreshing) ? "MEMUAT DATA..." : "EDIT MULTIPLE UPDATE"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(isInitializing || isRefreshing) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <ProductPriceMultipleSkeleton />
                    </Animated.View>
                ) : (
                <Animated.View key="content" entering={FadeInUp.delay(100).springify()}>
                    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                        <View className="mb-4">
                            <Text className="text-lg font-bold text-gray-800">Daftar Barang (Multiple)</Text>
                        </View>

                        <Animated.View layout={LinearTransition.springify()}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border border-gray-200 rounded-2xl bg-white" contentContainerStyle={{ flexGrow: 1 }}>
                                <View>
                                        {/* Table Header */}
                                        <View className="flex-row border-b border-gray-200 bg-gray-50 p-4 rounded-t-2xl">
                                            <View className="border-r border-gray-200" style={{ width: COL_WIDTH.no, paddingRight: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2 text-center">No</Text></View>
                                            <View className="border-r border-gray-200" style={{ width: COL_WIDTH.name, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Product Name</Text></View>
                                            <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceUpdate, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Update</Text></View>
                                            <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceAgent, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Price Agent</Text></View>
                                            <View className="border-r border-gray-200" style={{ width: COL_WIDTH.kurs, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Kurs</Text></View>
                                            <View className="border-r border-gray-200" style={{ width: COL_WIDTH.estimation, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Estimation IDR</Text></View>
                                            <View style={{ width: COL_WIDTH.delivery, paddingHorizontal: 8 }}><Text className="font-bold text-gray-700 text-xs pl-2">Delivery Term</Text></View>
                                        </View>

                                        {/* Table Body */}
                                        {items.map((item, index) => (
                                            <View key={item.id_product} className="flex-row border-b border-gray-100 p-4 items-center">
                                                <View className="border-r border-gray-200" style={{ width: COL_WIDTH.no, paddingRight: 8 }}>
                                                    <Text className="text-center text-gray-600 text-xs font-bold">{index + 1}</Text>
                                                </View>
                                                <View className="border-r border-gray-200 justify-center" style={{ width: COL_WIDTH.name, paddingHorizontal: 8 }}>
                                                    <Text className="text-gray-800 text-xs font-bold">{item.code_product}</Text>
                                                    <Text className="text-gray-500 text-xs" numberOfLines={1}>{item.nm_product}</Text>
                                                </View>
                                                <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceUpdate, paddingHorizontal: 8 }}>
                                                    <TextInput
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 h-10 text-gray-900 text-xs"
                                                        value={item.product_price}
                                                        onChangeText={(val) => handleChange(index, 'product_price', val)}
                                                        keyboardType="numeric"
                                                        placeholder="0"
                                                    />
                                                </View>
                                                <View className="border-r border-gray-200" style={{ width: COL_WIDTH.priceAgent, paddingHorizontal: 8 }}>
                                                    <TextInput
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 h-10 text-gray-900 text-xs"
                                                        value={item.product_price_agent}
                                                        onChangeText={(val) => handleChange(index, 'product_price_agent', val)}
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
                                                        className="bg-gray-100 border border-gray-200 rounded-lg px-3 h-10 text-gray-500 text-xs font-bold"
                                                        style={{ color: '#047857' }}
                                                        value={formatRp(item.est_idr || '0')}
                                                        editable={false}
                                                    />
                                                </View>
                                                <View style={{ width: COL_WIDTH.delivery, paddingHorizontal: 8 }}>
                                                    <View className="border border-gray-200 rounded-lg bg-gray-50">
                                                        <Dropdown
                                                            style={{ height: 40, paddingHorizontal: 12 }}
                                                            data={deliveryTermData}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Pilih"
                                                            value={item.delivery_term || 'FRANCO JKT'}
                                                            onChange={(val) => handleChange(index, 'delivery_term', val.value)}
                                                            selectedTextStyle={{ color: '#111827', fontSize: 12 }}
                                                            placeholderStyle={{ color: '#9CA3AF', fontSize: 12 }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                        </Animated.View>
                    </View>
                </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
