import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, RefreshControl, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { PoEditSkeleton } from '../skeleton/PoEditSkeleton';
import { PoTable } from '../components/PoTable';
import { IncshipmentTab } from '../components/IncshipmentTab';
import { usePo } from '../hooks/usePo';
import Animated, { FadeInUp, FadeInDown, FadeOut, FadeIn } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { ErrorState } from '../../../components/shared/ErrorState';
import { Button } from '../../../components/ui/button';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function PoEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params;

    const { selectedItem, isLoadingDetail, isSaving, error, loadDetail, handleSave, clearSelection } = usePo();

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'po' | 'incoming'>('po');
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const [form, setForm] = useState({
        id_suppliers: '',
        nm_suppliers: '',
        supplier_reference: '',
        id_gudang: '',
        id_mata_uang: '',
        order_date: '',
        destination_warehouse: '',
        notes: '',
        files: ''
    });

    const [details, setDetails] = useState<any[]>([]);

    const suppliersOptions = [
        { label: 'PT. Maju Mundur', value: 'SUP-01' },
        { label: 'CV. Sukses Selalu', value: 'SUP-02' },
    ];

    const gudangOptions = [
        { label: 'Gudang Utama', value: 'GDG-01' },
        { label: 'Gudang Cabang', value: 'GDG-02' },
    ];

    const currencyOptions = [
        { label: 'IDR - Rupiah', value: 'IDR' },
        { label: 'USD - US Dollar', value: 'USD' },
    ];

    const initialize = useCallback(async () => {
        setIsInitializing(true);
        try {
            await Promise.all([
                loadDetail(id),
                new Promise(resolve => setTimeout(resolve, 800))
            ]);
        } finally {
            setIsInitializing(false);
        }
    }, [id, loadDetail]);

    useEffect(() => {
        initialize();
        return () => {
            clearSelection();
        };
    }, [initialize, clearSelection]);

    useEffect(() => {
        if (route.params?.toast) {
            setToast(route.params.toast);
        }
    }, [route.params?.toast]);

    useEffect(() => {
        if (selectedItem) {
            setForm({
                id_suppliers: selectedItem.id_suppliers || '',
                nm_suppliers: selectedItem.nm_suppliers || '',
                supplier_reference: selectedItem.supplier_reference || '',
                id_gudang: selectedItem.id_gudang || '',
                id_mata_uang: selectedItem.id_mata_uang || 'IDR',
                order_date: selectedItem.order_date || '',
                destination_warehouse: selectedItem.destination_warehouse || '',
                notes: selectedItem.notes || '',
                files: selectedItem.files || ''
            });
            setDetails(selectedItem.details || []);
        }
    }, [selectedItem]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadDetail(id);
        } finally {
            setIsRefreshing(false);
        }
    }, [id, loadDetail]);

    if (error && !isInitializing && !isLoadingDetail) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="DETAIL PO" />
                <ErrorState error={error} onRetry={initialize} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Peringatan' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title={isInitializing ? "MEMUAT DATA..." : "DETAIL PO"}
                showBackButton
                onBackPress={() => {
                    navigation.navigate('Drawer', { screen: 'PoListScreen' });
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    {isInitializing || isRefreshing ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <PoEditSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View key="content" entering={FadeIn.duration(600)}>
                            {error && (
                                <View className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                    <Text className="text-red-600 font-medium">{error}</Text>
                                </View>
                            )}

                            <View className="flex-row justify-start mb-4">
                                <Button
                                    onPress={() => navigation.navigate('IncshipmentEditScreen', { id: 'INC-DUMMY' })}
                                    className="px-4 py-2 rounded-xl flex-row items-center shadow-sm"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    <Text className="text-sm font-bold text-white">Incoming Shipment</Text>
                                </Button>
                            </View>

                            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                                <View className="p-6">
                                    <View className="space-y-4">
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Supplier</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{form.nm_suppliers || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Supplier Ref.</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{form.supplier_reference || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Gudang</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{gudangOptions.find(g => g.value === form.id_gudang)?.label || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Mata Uang</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{currencyOptions.find(c => c.value === form.id_mata_uang)?.label || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Order Date</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{form.order_date || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Destination</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{form.destination_warehouse || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Notes</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{form.notes || '-'}</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-sm text-gray-500 w-1/3">Files</Text>
                                            <Text className="text-sm text-gray-500 w-4">:</Text>
                                            <Text className="text-sm text-gray-900 flex-1">{form.files || '-'}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* TABS AND TAB CONTENT */}
                                <View className="flex-row bg-white border-t border-gray-100 px-2 pt-2">
                                    <TouchableOpacity
                                        onPress={() => setActiveTab('po')}
                                        className={`flex-1 py-3 items-center border-b-2`}
                                        style={{ borderColor: activeTab === 'po' ? theme.colors.primary : 'transparent' }}
                                    >
                                        <Text className="font-bold" style={{ color: activeTab === 'po' ? theme.colors.primary : '#9ca3af' }}>Purchase Order</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setActiveTab('incoming')}
                                        className={`flex-1 py-3 items-center border-b-2`}
                                        style={{ borderColor: activeTab === 'incoming' ? theme.colors.primary : 'transparent' }}
                                    >
                                        <Text className="font-bold text-center" style={{ color: activeTab === 'incoming' ? theme.colors.primary : '#9ca3af' }}>Incoming Shipment & Invoice</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className="bg-white min-h-[150px] pb-4">
                                    {activeTab === 'po' && (
                                        <View className="p-4 pt-4">
                                            <PoTable
                                                items={details}
                                            />
                                        </View>
                                    )}

                                    {activeTab === 'incoming' && (
                                        <View>
                                            <IncshipmentTab details={[]} />
                                        </View>
                                    )}
                                </View>
                            </View>


                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
