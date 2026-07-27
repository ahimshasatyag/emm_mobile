import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { CheckSquare, Square, Search, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { PurchaseRequisitionListPRSkeleton } from '../skeleton/PurchaseRequisitionListPRSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { validateCreateQuotation } from '../hooks/usePurchaseRequisitions';

interface PRDetailItem {
    id_pr_dtl: string;
    id_pr: string;
    code_pr: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    nm_users: string;
    qty: number;
    qty_po: number;
    selected: boolean;
}

const DUMMY_LIST: PRDetailItem[] = [
    { id_pr_dtl: 'PRD-001', id_pr: 'PR-202310-001', code_pr: 'PR-202310-001', id_product: 'PRD001', code_product: 'P001', nm_product: 'Laptop Dell XPS 13', nm_users: 'admin', qty: 2, qty_po: 2, selected: false },
    { id_pr_dtl: 'PRD-002', id_pr: 'PR-202310-001', code_pr: 'PR-202310-001', id_product: 'PRD002', code_product: 'P002', nm_product: 'Mouse Wireless Logitech', nm_users: 'admin', qty: 5, qty_po: 5, selected: false },
    { id_pr_dtl: 'PRD-003', id_pr: 'PR-202310-002', code_pr: 'PR-202310-002', id_product: 'PRD003', code_product: 'P003', nm_product: 'Kertas HVS A4', nm_users: 'john_doe', qty: 10, qty_po: 10, selected: false },
];

export function PurchaseRequisitionListPRScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState<PRDetailItem[]>(DUMMY_LIST);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerQuery = searchQuery.toLowerCase();
        return items.filter(item =>
            item.code_pr.toLowerCase().includes(lowerQuery) ||
            item.nm_product.toLowerCase().includes(lowerQuery) ||
            item.nm_users.toLowerCase().includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const handleToggleSelect = (index: number) => {
        const actualIndex = items.findIndex(i => i.id_pr_dtl === filteredItems[index].id_pr_dtl);
        if (actualIndex > -1) {
            const newItems = [...items];
            newItems[actualIndex].selected = !newItems[actualIndex].selected;
            setItems(newItems);
        }
    };

    const handleQtyPoChange = (index: number, text: string) => {
        const actualIndex = items.findIndex(i => i.id_pr_dtl === filteredItems[index].id_pr_dtl);
        if (actualIndex > -1) {
            const newItems = [...items];
            const val = parseInt(text.replace(/[^0-9]/g, ''), 10);
            const num = isNaN(val) ? 0 : val;
            // Prevent qty_po from exceeding qty based on check_qty logic in PHP
            newItems[actualIndex].qty_po = num > newItems[actualIndex].qty ? newItems[actualIndex].qty : num;
            setItems(newItems);
        }
    };

    const handleCreateQuotation = () => {
        const selectedItems = items.filter(i => i.selected);
        const errorMsg = validateCreateQuotation(selectedItems);
        if (errorMsg) {
            setToast({ visible: true, type: 'error', message: errorMsg, title: 'Peringatan' });
            return;
        }
        setIsConfirmModalVisible(true);
    };

    const confirmCreateQuotation = () => {
        setIsConfirmModalVisible(false);
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            
            // Navigate back to Drawer's QuotationsAPListScreen and clear stack
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Drawer',
                        params: {
                            screen: 'QuotationsAPListScreen',
                            params: {
                                timestamp: Date.now(),
                                showToast: true,
                                toastMessage: 'Berhasil Menyimpan Quotation\nCode PO: QO-202310-001',
                                toastType: 'success'
                            }
                        }
                    }
                ]
            });
        }, 1000);
    };

    const renderItem = ({ item, index }: { item: PRDetailItem, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)} className="mb-3">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleToggleSelect(index)}
                className="bg-white rounded-xl border shadow-sm overflow-hidden flex-row"
                style={{ borderColor: item.selected ? theme.colors.primary : '#e5e7eb' }}
            >
                <View
                    className="w-12 items-center justify-center"
                    style={{ backgroundColor: item.selected ? `${theme.colors.primary}15` : '#f9fafb' }}
                >
                    {item.selected ? (
                        <CheckSquare color={theme.colors.primary} size={24} />
                    ) : (
                        <Square color="#9CA3AF" size={24} />
                    )}
                </View>
                <View className="flex-1 p-3">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-gray-500">{item.code_pr}</Text>
                            <Text className="text-sm font-bold text-gray-800 mt-1">{item.code_product} - {item.nm_product}</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center mt-2">
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-1">Request By</Text>
                            <Text className="text-xs font-medium text-gray-700">{item.nm_users}</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Text className="text-xs text-gray-500 mb-1">Qty Req</Text>
                            <Text className="text-xs font-bold text-gray-900">{item.qty}</Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-xs text-gray-500 mb-1">Qty App</Text>
                            <TextInput
                                className="border border-gray-300 rounded bg-gray-50 text-center py-1 px-2 text-xs font-bold text-gray-900 w-16"
                                keyboardType="numeric"
                                value={item.qty_po.toString()}
                                onChangeText={(t) => handleQtyPoChange(index, t)}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const hasSelected = items.some(i => i.selected);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Konfirmasi Create"
                message="Apakah Anda yakin ingin membuat quotation dari item yang dipilih?"
                confirmText="Ya, Create"
                cancelText="Batal"
                onConfirm={confirmCreateQuotation}
                onCancel={() => setIsConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Error' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "LIST PR DETAILS"} showBackButton={true} onBackPress={() => navigation.goBack()} />

            <View className="px-4 py-3">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari kode PR, produk, user..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <FlatList
                data={isRefreshing ? [] : filteredItems}
                keyExtractor={item => item.id_pr_dtl}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
                ListEmptyComponent={() => {
                    if (isRefreshing) {
                        return (
                            <Animated.View exiting={FadeOut.duration(300)} style={{ marginHorizontal: -16 }}>
                                <PurchaseRequisitionListPRSkeleton />
                            </Animated.View>
                        );
                    }
                    return null;
                }}
            />

            {(hasSelected && !isRefreshing) && (
                <Animated.View entering={FadeInUp} className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
                    <Button
                        onPress={handleCreateQuotation}
                        disabled={isSaving}
                        className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                        <ShoppingBag color="white" size={20} className="mr-2" />
                        <Text className="text-white font-bold text-lg">
                            Create Quotation ({items.filter(i => i.selected).length})
                        </Text>
                    </Button>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
}
