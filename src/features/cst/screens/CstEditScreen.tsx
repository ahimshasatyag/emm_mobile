import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, RefreshControl, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Undo2, XCircle, CheckCircle2, FileText, Image as ImageIcon, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCst } from '../hooks/useCst';
import { CstEditSkeleton } from '../skeleton/CstEditSkeleton';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { ImageModal } from '../components/ImageModal';
import { getAfsImageUrl } from '../../../utils/helpers/image';
import { formatDate } from '../../../utils/helpers/date';

export function CstEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id: cstCode, showSuccessToast, successMessage } = route.params || {};

    const { currentCst, isLoading, loadCstDetail, handleCloseCst, handleCancelCst, resetCurrentCst } = useCst();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'lkt' | 'expense'>('lkt');
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);

    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        confirmText: '',
        onConfirm: () => { }
    });

    const [modalCancelConfig, setModalCancelConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        confirmText: '',
        onConfirm: () => { }
    });

    useEffect(() => {
        if (showSuccessToast && successMessage) {
            setToast({ visible: true, type: 'success', message: successMessage });
            navigation.setParams({ showSuccessToast: undefined, successMessage: undefined });
        }
    }, [showSuccessToast, successMessage, navigation]);

    useEffect(() => {
        if (cstCode) {
            loadCstDetail(cstCode);
        }
        return () => {
            resetCurrentCst();
        };
    }, [cstCode, loadCstDetail, resetCurrentCst]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        if (cstCode) {
            await loadCstDetail(cstCode);
            await new Promise(resolve => setTimeout(resolve, 600)); // Simulasi animasi refresh
        }
        setIsRefreshing(false);
    }, [cstCode, loadCstDetail]);

    const onDone = () => {
        setModalConfig({
            visible: true,
            title: "Apakah anda yakin?",
            message: "Anda akan Done CST ini!",
            confirmText: "Ya, Done!",
            onConfirm: async () => {
                setModalConfig(prev => ({ ...prev, visible: false }));
                const success = await handleCloseCst(cstCode);
                if (success) {
                    setToast({ visible: true, type: 'success', message: 'Data berhasil di-done' });
                }
            }
        });
    };

    const onCancel = () => {
        setModalCancelConfig({
            visible: true,
            title: "Apakah anda yakin?",
            message: "Anda akan cancel CST ini!",
            confirmText: "Ya, Cancel!",
            onConfirm: async () => {
                setModalCancelConfig(prev => ({ ...prev, visible: false }));
                const success = await handleCancelCst(cstCode);
                if (success) {
                    setToast({ visible: true, type: 'success', message: 'Data berhasil dicancel' });
                }
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'text-yellow-600';
            case 'OUTSTANDING': return 'text-blue-600';
            case 'ON PROGRESS': return 'text-orange-600';
            case 'DONE': return 'text-green-600';
            case 'CANCEL': return 'text-red-600';
            case 'PENDING': return 'text-gray-800';
            default: return 'text-gray-800';
        }
    };

    const isGaransi = (endStr: string, currentStr: string) => {
        if (!endStr || !currentStr) return false;
        return new Date(endStr) >= new Date(currentStr);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <ModalConfirm
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, visible: false }))}
            />

            <ModalCancel
                visible={modalCancelConfig.visible}
                title={modalCancelConfig.title}
                message={modalCancelConfig.message}
                confirmText={modalCancelConfig.confirmText}
                onConfirm={modalCancelConfig.onConfirm}
                onCancel={() => setModalCancelConfig(prev => ({ ...prev, visible: false }))}
            />

            <ImageModal
                visible={isImageModalVisible}
                onClose={() => setIsImageModalVisible(false)}
                imageUrl={currentCst?.image ? getAfsImageUrl(currentCst.image) : null}
            />

            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "DETAIL CST"}
                showBackButton={true}
                onBackPress={() => navigation.navigate('Drawer', { screen: 'CstListScreen' })}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {isLoading || isRefreshing || !currentCst ? (
                    <CstEditSkeleton />
                ) : (
                    <Animated.View entering={FadeInDown.springify()} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">

                        {/* Action Buttons */}
                        <View className="flex-row items-center mb-2 space-x-2">

                            {currentCst.f_cancel === 0 && currentCst.status === 'OUTSTANDING' && (
                                <TouchableOpacity
                                    className="flex-row items-center bg-red-600 px-3 py-2 rounded-lg"
                                    onPress={onCancel}
                                >
                                    <XCircle color="#fff" size={16} />
                                    <Text className="text-white text-xs font-bold ml-1.5">Cancel</Text>
                                </TouchableOpacity>
                            )}

                            {currentCst.f_cancel === 0 && currentCst.status === 'ON PROGRESS' && (
                                <TouchableOpacity
                                    className="flex-row items-center bg-green-600 px-3 py-2 rounded-lg ml-2"
                                    onPress={onDone}
                                >
                                    <CheckCircle2 color="#fff" size={16} />
                                    <Text className="text-white text-xs font-bold ml-1.5">Done</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Title & Status */}
                        <View className="mb-2">
                            <Text className="text-xl font-bold text-gray-900">{currentCst.cst_code}</Text>
                            <Text className={`text-sm font-semibold italic mt-1 ${getStatusColor(currentCst.f_cancel ? 'CANCEL' : currentCst.status)}`}>
                                Status : ({currentCst.f_cancel ? 'CANCELLED' : currentCst.status})
                            </Text>
                        </View>

                        {/* CUSTOMER SECTION */}
                        <View className="mt-2">
                            <Text className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                Customer
                            </Text>

                            <View className="space-y-3">
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Customer Name</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <View className="flex-1">
                                        <Text className="text-xs font-bold text-gray-800">{currentCst.nm_customers}</Text>
                                        <Text className="text-xs italic text-gray-500 mt-0.5">{currentCst.customers_address}</Text>
                                    </View>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Requestor</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.nm_karyawan}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">CSR Code</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <TouchableOpacity
                                        className="flex-1"
                                        onPress={() => navigation.navigate('CsrEditScreen', { id: currentCst.csr_code, from: 'Cst' })}
                                    >
                                        <Text className="text-xs font-bold text-blue-600 underline">{currentCst.csr_code}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Date Request</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.csr_date ? formatDate(new Date(currentCst.csr_date)) : '-'}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Lokasi</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.lokasi}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Sts Pemasangan</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs font-semibold text-gray-800">
                                        {currentCst.sts_pasang === '1' ? 'Service' : 'Pasang Baru'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* LAPORAN KERUSAKAN */}
                        <View className="mt-6">
                            <Text className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                Laporan Kerusakan
                            </Text>

                            <View className="space-y-4">
                                <View>
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Catatan Kerusakan :</Text>
                                    <View className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <Text className="text-xs text-gray-800">{currentCst.lap_kerusakan}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-xs text-gray-500 font-medium mb-1">Images :</Text>
                                    <View className="h-32 w-full bg-gray-100 rounded-lg border border-gray-200 items-center justify-center overflow-hidden">
                                        {currentCst.image ? (
                                            <TouchableOpacity 
                                                className="w-full h-full"
                                                onPress={() => setIsImageModalVisible(true)}
                                            >
                                                <Image source={{ uri: getAfsImageUrl(currentCst.image) }} className="w-full h-full" resizeMode="cover" />
                                            </TouchableOpacity>
                                        ) : (
                                            <View className="items-center">
                                                <ImageIcon color="#9CA3AF" size={32} />
                                                <Text className="text-xs text-gray-400 mt-2">No Image Available</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* PRODUCT TO SERVICE */}
                        <View className="mt-6">
                            <Text className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                Product To Service
                            </Text>

                            <View className="space-y-3">
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Serial Number</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs font-bold text-gray-800">{currentCst.barcode}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Product Name</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.code_product} - {currentCst.nm_product}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Category</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.nm_product_kategori}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Delivery Order</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.do_code}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Warranty Start</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.waranty_start ? formatDate(new Date(currentCst.waranty_start)) : '-'}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Warranty Time</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.waranty_time} Month</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Warranty End</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.waranty_end ? formatDate(new Date(currentCst.waranty_end)) : '-'}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Warranty Status</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    {isGaransi(currentCst.waranty_end, currentCst.cst_date) ? (
                                        <Text className="flex-1 text-xs font-bold text-green-600">GARANSI</Text>
                                    ) : (
                                        <Text className="flex-1 text-xs font-bold text-red-600">TIDAK GARANSI</Text>
                                    )}
                                </View>
                                <View className="flex-row">
                                    <Text className="w-1/3 text-xs text-gray-500 font-medium">Keterangan SO</Text>
                                    <Text className="w-4 text-xs text-gray-500">:</Text>
                                    <Text className="flex-1 text-xs text-gray-800">{currentCst.keterangan}</Text>
                                </View>
                            </View>
                        </View>

                        {/* LKT LIST & EXPENSE TABS */}
                        <View className="flex-row justify-between items-center mt-6 mb-2">
                            <Text className="text-lg font-bold text-gray-800">LKT & Expense</Text>
                            {(!currentCst.lkt_list || currentCst.lkt_list.length === 0) && (
                                <TouchableOpacity
                                    className="flex-row items-center px-4 py-2 rounded-lg"
                                    style={{ backgroundColor: theme.colors.primary }}
                                    onPress={() => navigation.navigate('LktFormScreen', { cstCode: currentCst.cst_code, lapKerusakan: currentCst.lap_kerusakan })}
                                >
                                    <Plus color="#fff" size={16} />
                                    <Text className="text-white text-xs font-bold ml-1.5">Add New LKT</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View className="flex-row space-x-2">
                            <TouchableOpacity
                                className={`flex-1 p-3 rounded-lg items-center shadow-sm mr-2 ${activeTab === 'lkt' ? 'bg-white border-b-2' : 'bg-gray-100 border border-gray-200'}`}
                                style={activeTab === 'lkt' ? { borderBottomColor: theme.colors.primary } : undefined}
                                onPress={() => setActiveTab('lkt')}
                            >
                                <FileText color={activeTab === 'lkt' ? theme.colors.primary : "#9CA3AF"} size={20} />
                                <Text
                                    className="text-xs font-bold mt-1"
                                    style={{ color: activeTab === 'lkt' ? theme.colors.primary : '#6b7280' }}
                                >
                                    LKT List
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`flex-1 p-3 rounded-lg items-center shadow-sm ${activeTab === 'expense' ? 'bg-white border-b-2' : 'bg-gray-100 border border-gray-200'}`}
                                style={activeTab === 'expense' ? { borderBottomColor: theme.colors.primary } : undefined}
                                onPress={() => setActiveTab('expense')}
                            >
                                <FileText color={activeTab === 'expense' ? theme.colors.primary : "#9CA3AF"} size={20} />
                                <Text
                                    className="text-xs font-bold mt-1"
                                    style={{ color: activeTab === 'expense' ? theme.colors.primary : '#6b7280' }}
                                >
                                    Expense
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* CONTAINER UTAMA (Tab Content) */}
                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2 min-h-[150px]">
                            {activeTab === 'lkt' ? (
                                <View className="flex-1">
                                    {(!currentCst.lkt_list || currentCst.lkt_list.length === 0) ? (
                                        <View className="flex-1 items-center justify-center py-6">
                                            <Text className="text-sm text-gray-400 italic">Belum ada LKT.</Text>
                                        </View>
                                    ) : (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="mt-2">
                                            <View className="min-w-[800px] bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                {/* Table Header */}
                                                <View className="flex-row bg-gray-100 border-b border-gray-200 py-3 px-4">
                                                    <Text className="w-10 text-xs font-bold text-gray-700">No</Text>
                                                    <Text className="w-24 text-xs font-bold text-gray-700">LKT</Text>
                                                    <Text className="w-32 text-xs font-bold text-gray-700">Tgl LKT</Text>
                                                    <Text className="flex-1 min-w-[150px] text-xs font-bold text-gray-700">Keterangan</Text>
                                                    <Text className="w-32 text-xs font-bold text-gray-700">Service Amount</Text>
                                                    <Text className="w-36 text-xs font-bold text-gray-700">Tot Biaya Sparepart</Text>
                                                    <Text className="w-24 text-xs font-bold text-gray-700">Status</Text>
                                                </View>

                                                {/* Table Body */}
                                                {currentCst.lkt_list.map((lkt: any, index: number) => (
                                                    <TouchableOpacity
                                                        key={lkt.id_afs_lkt}
                                                        className="flex-row py-3 px-4 border-b border-gray-100 items-center bg-white"
                                                        onPress={() => navigation.navigate('LktEditScreen', { id: lkt.lkt_code })}
                                                    >
                                                        <Text className="w-10 text-xs text-gray-800">{index + 1}</Text>
                                                        <Text className="w-24 text-xs font-bold text-gray-800">{lkt.lkt_code?.slice(-5) || '-'}</Text>
                                                        <Text className="w-32 text-xs text-gray-800">{formatDate(lkt.starting_date) || '-'}</Text>
                                                        <Text className="flex-1 min-w-[150px] text-xs text-gray-800">{lkt.description || '-'}</Text>
                                                        <Text className="w-32 text-xs text-gray-800">
                                                            {new Intl.NumberFormat('id-ID').format(lkt.service_amount || 0)}
                                                        </Text>
                                                        <Text className="w-36 text-xs text-gray-800">0</Text>
                                                        <View className="w-24">
                                                            {(() => {
                                                                const isCancel = lkt.f_cancel === 1 || lkt.f_cancel === '1';
                                                                const rawStatus = (lkt.flag_done || lkt.status || 'DRAFT').toString().toUpperCase();
                                                                const statusText = isCancel ? 'CANCEL' : rawStatus;
                                                                
                                                                if (isCancel) {
                                                                    return (
                                                                        <View className="px-2 py-1 rounded-full items-center bg-red-100">
                                                                            <Text className="text-[10px] font-bold uppercase text-red-800">{statusText}</Text>
                                                                        </View>
                                                                    );
                                                                }
                                                                if (statusText === 'ON PROGRESS') {
                                                                    return (
                                                                        <View className="px-2 py-1 rounded-full items-center bg-orange-100">
                                                                            <Text className="text-[10px] font-bold uppercase text-orange-800">{statusText}</Text>
                                                                        </View>
                                                                    );
                                                                }
                                                                if (statusText === 'DONE' || statusText === 'CLOSE') {
                                                                    return (
                                                                        <View className="px-2 py-1 rounded-full items-center bg-green-100">
                                                                            <Text className="text-[10px] font-bold uppercase text-green-800">{statusText}</Text>
                                                                        </View>
                                                                    );
                                                                }
                                                                if (statusText === 'DRAFT') {
                                                                    return (
                                                                        <View className="px-2 py-1 rounded-full items-center bg-gray-500">
                                                                            <Text className="text-[10px] font-bold uppercase text-white">{statusText}</Text>
                                                                        </View>
                                                                    );
                                                                }
                                                                
                                                                return (
                                                                    <View className="px-2 py-1 rounded-full items-center bg-gray-100">
                                                                        <Text className="text-[10px] font-bold uppercase text-gray-800">{statusText}</Text>
                                                                    </View>
                                                                );
                                                            })()}
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    )}
                                </View>
                            ) : (
                                <View className="flex-1 items-center justify-center">
                                    <Text className="text-sm text-gray-400 italic">Modul Expense belum tersedia pada simulasi ini.</Text>
                                </View>
                            )}
                        </View>

                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
