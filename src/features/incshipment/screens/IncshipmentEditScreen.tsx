import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { IncshipmentTable } from '../components/IncshipmentTable';
import { IncshipmentEditSkeleton } from '../skeleton/IncshipmentEditSkeleton';
import { useIncshipment } from '../hooks/useIncshipment';
import { theme } from '../../../theme/theme';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function IncshipmentEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const {
        selectedItem,
        isLoadingDetail,
        isSaving,
        loadDetail,
        handleAssignSN,
        handlePrintBarcode,
        handleReceiveGoods,
        validateReceive,
        clearSelection
    } = useIncshipment();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedDetailIds, setSelectedDetailIds] = useState<string[]>([]);
    
    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: 'assign' | 'print' | 'receive' | null;
    }>({
        visible: false,
        title: '',
        message: '',
        type: null
    });
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType; title?: string }>({
        visible: false,
        message: '',
        type: 'success'
    });

    useFocusEffect(
        useCallback(() => {
            loadDetail(id);
            return () => {
                clearSelection();
            };
        }, [id, loadDetail, clearSelection])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await loadDetail(id);
        setIsRefreshing(false);
    }, [id, loadDetail]);

    const toggleSelectDetail = (detailId: string) => {
        setSelectedDetailIds(prev => 
            prev.includes(detailId) 
                ? prev.filter(item => item !== detailId) 
                : [...prev, detailId]
        );
    };

    const onPressAssignSN = () => {
        setModalConfig({
            visible: true,
            title: "Assign Barcode?",
            message: "Anda akan membuat barcode semua mesin!",
            type: 'assign'
        });
    };

    const onPressPrintBarcode = () => {
        setModalConfig({
            visible: true,
            title: "Print Barcode?",
            message: "Anda akan print barcode semua mesin!",
            type: 'print'
        });
    };

    const onPressReceive = () => {
        const errorMsg = validateReceive(selectedDetailIds);
        if (errorMsg) {
            setToast({
                visible: true,
                type: 'error',
                title: 'Validasi',
                message: errorMsg
            });
            return;
        }

        setModalConfig({
            visible: true,
            title: "Receive?",
            message: "Anda tidak dapat mengubah data ini lagi ketika sudah di confirm!",
            type: 'receive'
        });
    };

    const handleConfirmModal = async () => {
        const { type } = modalConfig;
        setModalConfig(prev => ({ ...prev, visible: false }));

        if (type === 'assign') {
            try {
                await handleAssignSN(id);
                setToast({ visible: true, type: 'success', message: 'Assign Serial Number berhasil!' });
            } catch (error) {
                setToast({ visible: true, type: 'error', message: 'Gagal Assign Serial Number' });
            }
        } else if (type === 'print') {
            try {
                await handlePrintBarcode(id);
                setToast({ visible: true, type: 'success', message: 'Print Barcode berhasil!' });
            } catch (error) {
                setToast({ visible: true, type: 'error', message: 'Gagal Print Barcode' });
            }
        } else if (type === 'receive') {
            try {
                await handleReceiveGoods(id, selectedDetailIds);
                setToast({ visible: true, type: 'success', message: 'Receive Berhasil!' });
                setSelectedDetailIds([]);
            } catch (error) {
                setToast({ visible: true, type: 'error', message: 'Gagal Receive Goods' });
            }
        }
    };

    // Computed flags
    const isReadyToReceive = selectedItem?.status_incoming === 'READY TO RECEIVE';
    const isReceived = selectedItem?.status_incoming === 'RECEIVED';
    const showAssignSNBtn = isReadyToReceive && selectedItem?.f_assign_barcode === 0;
    const showReceiveBtn = isReadyToReceive && selectedItem?.f_assign_barcode === 1 && selectedItem?.f_print_barcode === 1;
    const showPrintBtn = isReadyToReceive && selectedItem?.f_assign_barcode === 1 && selectedItem?.f_print_barcode === 0;

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.title || (toast.type === 'error' ? 'Gagal' : 'Sukses')}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText="Ya!"
                cancelText="Tidak"
                onConfirm={handleConfirmModal}
                onCancel={() => setModalConfig(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator title={selectedItem ? `Detail ${selectedItem.code}` : "INCOMING SHIPMENT DETAIL"} showBackButton={true} />

            <ScrollView 
                className="flex-1 p-4"
                refreshControl={
                    <RefreshControl refreshing={isRefreshing || isSaving} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isLoadingDetail || isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <IncshipmentEditSkeleton />
                    </Animated.View>
                ) : !selectedItem ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-gray-500">Data tidak ditemukan.</Text>
                    </View>
                ) : (
                    <Animated.View key="content" entering={FadeInUp.duration(400)}>
                    {/* Action Buttons */}
                    <View className="flex-row flex-wrap mb-4 space-x-2">
                        {showAssignSNBtn && (
                            <TouchableOpacity
                                onPress={onPressAssignSN}
                                className="bg-emerald-500 px-4 py-2 rounded-lg mr-2 mb-2"
                            >
                                <Text className="text-white font-bold text-sm">Assign Serial Number</Text>
                            </TouchableOpacity>
                        )}
                        {showPrintBtn && (
                            <TouchableOpacity
                                onPress={onPressPrintBarcode}
                                className="bg-emerald-500 px-4 py-2 rounded-lg mr-2 mb-2"
                            >
                                <Text className="text-white font-bold text-sm">Print Barcode</Text>
                            </TouchableOpacity>
                        )}
                        {showReceiveBtn && (
                            <TouchableOpacity
                                onPress={onPressReceive}
                                className="bg-emerald-500 px-4 py-2 rounded-lg mr-2 mb-2"
                            >
                                <Text className="text-white font-bold text-sm">Receive Goods</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Main Card combining Header Info and Details Table */}
                    <View 
                        className="bg-white rounded-3xl border border-gray-100 mb-6 overflow-hidden"
                        style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15 }}
                    >
                        {/* Header Info */}
                        <View className="p-6 border-b border-gray-100">
                            <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Supplier</Text>
                                    <Text className="text-sm font-bold text-gray-900">{selectedItem.nm_suppliers}</Text>
                                </View>
                                <View className="flex-1 items-end">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Status</Text>
                                    <View className={`px-2 py-1 rounded-md border ${
                                        isReceived ? 'bg-emerald-100 border-emerald-200' : 'bg-orange-100 border-orange-200'
                                    }`}>
                                        <Text className={`text-xs font-bold ${
                                            isReceived ? 'text-emerald-700' : 'text-orange-700'
                                        }`}>{selectedItem.status_incoming}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-row mb-3">
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Purchase Order</Text>
                                    <Text className="text-[13px] text-gray-900">{selectedItem.code_po}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Gudang</Text>
                                    <Text className="text-[13px] text-gray-900">{selectedItem.nm_gudang}</Text>
                                </View>
                            </View>
                            <View className="flex-row mb-3">
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Creation Date</Text>
                                    <Text className="text-[13px] text-gray-900">{selectedItem.date_create}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Receive Date</Text>
                                    <Text className="text-[13px] text-gray-900">{selectedItem.date_receive || '-'}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Print Barcode</Text>
                                    <Text className="text-[13px] text-gray-900">
                                        {selectedItem.f_print_barcode === 1 ? 'YA' : 'TIDAK'}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-medium mb-1">OK to Receive</Text>
                                    <Text className="text-[13px] text-gray-900">
                                        {selectedItem.f_ok_receive === 1 ? 'YA' : 'TIDAK'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Details Table */}
                        <View className="p-6">
                            <Text className="text-sm font-bold text-gray-800 mb-4">Detail Barang</Text>
                            <IncshipmentTable
                                details={selectedItem.details || []}
                                showCheckbox={showReceiveBtn}
                                selectedIds={selectedDetailIds}
                                onToggleSelect={toggleSelectDetail}
                            />
                        </View>
                    </View>

                    <View className="h-10" />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
