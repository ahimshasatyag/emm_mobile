import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated as RNAnimated, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Plus, FileText, Trash2, CheckSquare, Square, ChevronDown } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useBrosur } from '../hooks/useBrosur';
import { BrosurSkeleton } from '../skeleton/BrosurSkeleton';
import { BrosurProductSelector } from '../components/BrosurProductSelector';
import { BrosurProduct } from '../types/brosur.types';

interface SelectedRow {
    id: string; // Unique ID for the row (since multiple of the same product might be added or we need keys)
    product: BrosurProduct | null;
}

export function BrosurScreen() {
    const navigation = useNavigation<any>();
    const { availableProducts, isLoading, loadProducts, generateBrosur } = useBrosur();

    const [rows, setRows] = useState<SelectedRow[]>([]);
    const [isCoverChecked, setIsCoverChecked] = useState(true);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadProducts(),
                        new Promise(resolve => setTimeout(resolve, 600))
                    ]);
                } catch (e) {
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadProducts])
    );

    const handleRefresh = async () => {
        setIsInitializing(true);
        try {
            await Promise.all([
                loadProducts(),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
        } finally {
            setIsInitializing(false);
        }
    };

    const handleAddRow = () => {
        if (availableProducts.length === 0) {
            Alert.alert('Perhatian', 'Data Barang Kosong atau masih dimuat.');
            return;
        }
        setRows(prev => [...prev, { id: Date.now().toString(), product: null }]);
    };

    const handleRemoveRow = (id: string) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    const handleOpenSelector = (rowId: string) => {
        setActiveRowId(rowId);
        setSelectorVisible(true);
    };

    const handleSelectProduct = (product: BrosurProduct) => {
        if (activeRowId) {
            setRows(prev => prev.map(row => {
                if (row.id === activeRowId) {
                    return { ...row, product };
                }
                return row;
            }));
        }
        setSelectorVisible(false);
        setActiveRowId(null);
    };

    const handleGenerate = async () => {
        const selectedIds = rows
            .filter(r => r.product !== null)
            .map(r => r.product!.id_product);

        // Remove duplicates to match PHP logic (if $.inArray(val, id_product) == -1)
        const uniqueIds = Array.from(new Set(selectedIds));

        if (uniqueIds.length === 0) {
            Alert.alert('Perhatian', 'Data Barang Kosong. Silakan pilih barang terlebih dahulu.');
            return;
        }

        setIsGenerating(true);
        await generateBrosur(uniqueIds, isCoverChecked);
        setIsGenerating(false);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="BROSUR" 
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            {/* Content Area */}
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && !isInitializing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {isInitializing ? (
                    <Animated.View exiting={FadeOut.duration(300)} className="p-4">
                        <BrosurSkeleton />
                    </Animated.View>
                ) : (
                    <View className="flex-1">
                        {/* Toolbar */}
                        <View className="px-4 py-4 bg-white border-b border-gray-200">
                            <View className="flex-row justify-between mb-3">
                                <TouchableOpacity
                                    onPress={handleAddRow}
                                    activeOpacity={0.7}
                                    className="flex-row items-center px-4 py-2.5 rounded-lg bg-blue-500 mr-2 flex-1 justify-center"
                                >
                                    <Plus color="#fff" size={18} />
                                    <Text className="ml-2 font-bold text-white">Tambah</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleGenerate}
                                    disabled={isGenerating}
                                    activeOpacity={0.7}
                                    className={`flex-row items-center px-4 py-2.5 rounded-lg flex-1 justify-center ${
                                        isGenerating ? 'bg-gray-400' : 'bg-green-500'
                                    }`}
                                >
                                    <FileText color="#fff" size={18} />
                                    <Text className="ml-2 font-bold text-white">
                                        {isGenerating ? 'Memproses...' : 'Generate'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                onPress={() => setIsCoverChecked(!isCoverChecked)}
                                activeOpacity={0.7}
                                className="flex-row items-center py-2"
                            >
                                {isCoverChecked ? (
                                    <CheckSquare color={theme.colors.primary} size={22} />
                                ) : (
                                    <Square color="#9ca3af" size={22} />
                                )}
                                <Text className="ml-3 font-semibold text-gray-700">Gunakan Cover Brosur</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 px-4 py-4">
                            <View className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-10">
                                {/* Table Header */}
                            <View className="flex-row bg-gray-50 border-b border-gray-200 px-4 py-3">
                                <Text className="flex-1 font-bold text-gray-600 text-center uppercase text-xs tracking-wider">Nama Barang</Text>
                                <Text className="w-16 font-bold text-gray-600 text-center uppercase text-xs tracking-wider">Aksi</Text>
                            </View>

                            {/* Table Body */}
                            {rows.length === 0 ? (
                                <View className="p-8 items-center justify-center">
                                    <Text className="text-gray-400 text-center">Belum ada barang yang ditambahkan. Klik 'Tambah' untuk memulai.</Text>
                                </View>
                            ) : (
                                rows.map((row, index) => (
                                    <Animated.View 
                                        key={row.id}
                                        entering={FadeIn.duration(300)}
                                        exiting={FadeOut.duration(200)}
                                        layout={Layout.springify()}
                                        className={`flex-row items-center px-4 py-3 ${
                                            index < rows.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                    >
                                        {/* Product Select Button */}
                                        <TouchableOpacity 
                                            activeOpacity={0.7}
                                            onPress={() => handleOpenSelector(row.id)}
                                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 mr-4 bg-gray-50"
                                        >
                                            <Text className={`text-sm ${row.product ? 'text-gray-800 font-semibold' : 'text-gray-400'}`} numberOfLines={1}>
                                                {row.product ? `${row.product.code_product} - ${row.product.nm_product}` : 'Pilih Barang...'}
                                            </Text>
                                            <ChevronDown color="#9ca3af" size={16} />
                                        </TouchableOpacity>

                                        {/* Delete Button */}
                                        <TouchableOpacity 
                                            activeOpacity={0.7}
                                            onPress={() => handleRemoveRow(row.id)}
                                            className="w-10 h-10 bg-red-50 rounded-lg items-center justify-center border border-red-100"
                                        >
                                            <Trash2 color="#ef4444" size={18} />
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))
                            )}
                        </View>
                    </View>
                </View>
            )}
            </ScrollView>

            <BrosurProductSelector 
                visible={selectorVisible}
                products={availableProducts}
                onClose={() => setSelectorVisible(false)}
                onSelect={handleSelectProduct}
            />
        </View>
    );
}
