import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, Text, TextInput, Alert, TouchableOpacity, RefreshControl, Platform, Keyboard } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useDo } from '../hooks/useDo';
import { theme } from '../../../theme/theme';
import { CheckCircle, Info, Truck, Edit, Split, Printer, X, Save, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '../../../components/ui/button';
import { DoProductTable } from '../components/DoProductTable';
import { DoEditSkeleton } from '../skeleton/DoEditSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export const DoEditScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;
    const { detail, loadingDetail, getDetail, submitAction, resetDetail, validateDoAction } = useDo();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [showDatePicker, setShowDatePicker] = useState<'' | 'date_do' | 'date_estimasi' | 'date_delivery'>('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [modalConfig, setModalConfig] = useState<{ 
        visible: boolean; 
        type: 'save_edit' | 'action' | null; 
        title: string; 
        message: string; 
        confirmText: string; 
        actionParams?: { actionName: string, actionValue: string } 
    }>({
        visible: false,
        type: null,
        title: '',
        message: '',
        confirmText: ''
    });

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const enterEditMode = () => {
        setFormData(JSON.parse(JSON.stringify(detail)));
        setIsEditMode(true);
    };

    const handleSaveEdit = () => {
        setModalConfig({
            visible: true,
            type: 'save_edit',
            title: 'Konfirmasi',
            message: 'Apakah anda yakin ingin menyimpan perubahan?',
            confirmText: 'Simpan'
        });
    };

    const updatePlat = (id_do_dtl: string | number, newPlat: string) => {
        setFormData((prev: any) => ({
            ...prev,
            items: prev.items.map((item: any) => item.id_do_dtl === id_do_dtl ? { ...item, leasing_plat: newPlat } : item)
        }));
    };

    const handleFocusPlat = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (id) await getDetail(id);
        setRefreshing(false);
    }, [id, getDetail]);

    useFocusEffect(
        useCallback(() => {
            if (id) getDetail(id);
            return () => resetDetail();
        }, [id, getDetail, resetDetail])
    );

    const handleAction = (actionName: string, actionValue: string) => {
        const errorMsg = validateDoAction(actionName, detail);
        if (errorMsg) {
            setToast({ visible: true, message: errorMsg, type: 'error' });
            return;
        }

        setModalConfig({
            visible: true,
            type: 'action',
            title: `Konfirmasi ${actionName}`,
            message: `Apakah anda yakin ingin melakukan ${actionName} pada DO ini?`,
            confirmText: `Ya, ${actionName}`,
            actionParams: { actionName, actionValue }
        });
    };

    const handleConfirmModal = async () => {
        const currentConfig = { ...modalConfig };
        setModalConfig(prev => ({ ...prev, visible: false }));

        if (currentConfig.type === 'save_edit') {
            setTimeout(() => {
                setToast({ visible: true, message: 'Data berhasil diperbarui!', type: 'success' });
                setIsEditMode(false);
            }, 300);
        } else if (currentConfig.type === 'action' && currentConfig.actionParams) {
            setIsSubmitting(true);
            const { actionName, actionValue } = currentConfig.actionParams;
            const res = await submitAction(id, actionValue);
            setIsSubmitting(false);
            
            setTimeout(() => {
                if (res) {
                    setToast({ visible: true, message: `${actionName} berhasil!`, type: 'success' });
                    getDetail(id);
                } else {
                    setToast({ visible: true, message: `${actionName} gagal!`, type: 'error' });
                }
            }, 300);
        }
    };    const renderActionButtons = () => {
        const btns = [];
        if (detail.status_do === 'DRAFT DELIVERY ORDER') {
            btns.push(
                <TouchableOpacity key="confirm" onPress={() => handleAction('Confirm', 'CONFIRM')} className="bg-green-500 px-5 py-2.5 rounded-xl flex-row justify-center items-center self-start">
                    <CheckCircle size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Confirm</Text>
                </TouchableOpacity>
            );
        }
        if (detail.status_do === 'WAITING AVAILABILITY') {
            btns.push(
                <TouchableOpacity key="avail" onPress={() => handleAction('Check Availability', 'AVAILABILITY')} className="flex-1 bg-orange-500 py-3 rounded-xl flex-row justify-center items-center mr-2">
                    <Info size={18} color="white" />
                    <Text className="text-white font-bold ml-2 text-center leading-tight">Check Availability</Text>
                </TouchableOpacity>
            );
            if (detail.flag_payment === '0') {
                btns.push(
                    <TouchableOpacity key="payment" onPress={() => handleAction('Check Payment', 'PAYMENT')} className="flex-1 bg-blue-500 py-3 rounded-xl flex-row justify-center items-center ml-2">
                        <Info size={18} color="white" />
                        <Text className="text-white font-bold ml-2 text-center leading-tight">Check Payment</Text>
                    </TouchableOpacity>
                );
            }
        }
        if (detail.status_do === 'READY TO DELIVER') {
            return (
                <View className="flex-row flex-wrap mb-2 justify-between">
                    <TouchableOpacity key="deliver" onPress={() => handleAction('Delivered', 'DELIVERED')} className="w-[48%] bg-blue-600 py-3 rounded-xl flex-row justify-center items-center mb-3">
                        <Truck size={18} color="white" />
                        <Text className="text-white font-bold ml-2">Delivered</Text>
                    </TouchableOpacity>

                    <TouchableOpacity key="edit" onPress={enterEditMode} className="w-[48%] bg-gray-500 py-3 rounded-xl flex-row justify-center items-center mb-3">
                        <Edit size={18} color="white" />
                        <Text className="text-white font-bold ml-2">Edit</Text>
                    </TouchableOpacity>

                    {detail.items && detail.items.length > 1 && (
                        <TouchableOpacity key="split" onPress={() => navigation.navigate('DoEditSplitScreen', { id })} className="w-[48%] bg-purple-500 py-3 rounded-xl flex-row justify-center items-center mb-3">
                            <Split size={18} color="white" />
                            <Text className="text-white font-bold ml-2">Split</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity key="print" onPress={() => setToast({ visible: true, message: 'Fitur Print SJ belum tersedia', type: 'info' })} className="w-[48%] bg-teal-500 py-3 rounded-xl flex-row justify-center items-center mb-3">
                        <Printer size={18} color="white" />
                        <Text className="text-white font-bold ml-2">Print SJ</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (detail.status_do === 'DELIVERED') {
            btns.push(
                <TouchableOpacity key="print-delivered" onPress={() => setToast({ visible: true, message: 'Fitur Print SJ belum tersedia', type: 'info' })} className="bg-teal-500 px-5 py-2.5 rounded-xl flex-row justify-center items-center self-start">
                    <Printer size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Print SJ</Text>
                </TouchableOpacity>
            );
        }
        return btns.length > 0 ? (
            <View className="flex-row mb-4">
                {btns}
            </View>
        ) : null;
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'success' ? 'Sukses' : toast.type === 'error' ? 'Gagal' : 'Info'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <ModalConfirm
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText="Batal"
                onConfirm={handleConfirmModal}
                onCancel={() => setModalConfig(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator 
                title={(refreshing || loadingDetail) ? 'MEMUAT DATA...' : `${isEditMode ? 'EDIT' : 'DETAIL'} ${detail?.code_do || ''}`} 

                showBackButton={true} 
            />

            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                contentContainerStyle={{ paddingBottom: (isEditMode && keyboardVisible) ? 300 : 20 }}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(loadingDetail || !detail) ? (
                    <DoEditSkeleton />
                ) : (
                    <View className="p-4">
                        {!isEditMode && renderActionButtons()}
                        {/* Info Pelanggan */}
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
                            <Text className="text-xs font-bold text-gray-400 mb-3 uppercase">Informasi Pelanggan</Text>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Customer</Text>
                                <Text className="text-sm text-gray-800">{detail.nm_customers}</Text>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Alamat</Text>
                                <Text className="text-sm text-gray-800">{detail.customers_address}</Text>
                            </View>
                            <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                            <Text className="text-xs font-bold text-gray-400 mb-4 uppercase">Informasi Biaya Tambahan</Text>

                            <View className="mb-4">
                                <Text className="text-xs text-gray-500 mb-2">Biaya Freight</Text>
                                <View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.freight === '1' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">EMM</Text>
                                    </View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.freight === '2' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">Customer bayar ditempat</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.freight === '3' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800 flex-shrink">
                                            Customer Charge <Text className="text-xs font-normal text-gray-400">(Sudah include di harga mesin){detail.freight === '3' && detail.freight_amount ? ` - Rp ${detail.freight_amount}` : ''}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500 mb-2">Biaya Forklift</Text>
                                <View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.forklift === '1' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">EMM</Text>
                                    </View>
                                    <View className="flex-row items-center mb-2">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.forklift === '2' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800">Customer sediakan sendiri</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 rounded-full border border-gray-300 items-center justify-center mr-2">
                                            {detail.forklift === '3' && <View className="w-2 h-2 rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-sm text-gray-800 flex-shrink">
                                            Customer Charge <Text className="text-xs font-normal text-gray-400">(Sudah include di harga mesin){detail.forklift === '3' && detail.forklift_amount ? ` - Rp ${detail.forklift_amount}` : ''}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                            <Text className="text-xs font-bold text-gray-400 mb-3 uppercase">Jadwal & Referensi</Text>

                            <View className="mb-3 flex-row justify-between">
                                <View className="flex-1 mr-2">
                                    <Text className="text-xs text-gray-500 mb-1">Creation Date</Text>
                                    {isEditMode ? (
                                        <TouchableOpacity onPress={() => setShowDatePicker('date_do')} className="flex-row items-center border border-gray-200 rounded-lg p-2 bg-gray-50">
                                            <Text className="text-sm flex-1">{formData?.date_do || '-'}</Text>
                                            <Calendar size={16} color="#9ca3af" />
                                        </TouchableOpacity>
                                    ) : (
                                        <Text className="text-sm font-medium text-gray-800">{detail.date_do}</Text>
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 mb-1">Scheduled Time</Text>
                                    {isEditMode ? (
                                        <TouchableOpacity onPress={() => setShowDatePicker('date_estimasi')} className="flex-row items-center border border-gray-200 rounded-lg p-2 bg-gray-50">
                                            <Text className="text-sm flex-1">{formData?.date_estimasi || '-'}</Text>
                                            <Calendar size={16} color="#9ca3af" />
                                        </TouchableOpacity>
                                    ) : (
                                        <Text className="text-sm font-medium text-gray-800">{detail.date_estimasi}</Text>
                                    )}
                                </View>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500 mb-1">Tanggal Delivered</Text>
                                {isEditMode ? (
                                    <TouchableOpacity onPress={() => setShowDatePicker('date_delivery')} className="flex-row items-center border border-gray-200 rounded-lg p-2 bg-gray-50">
                                        <Text className="text-sm flex-1">{formData?.date_delivery || '-'}</Text>
                                        <Calendar size={16} color="#9ca3af" />
                                    </TouchableOpacity>
                                ) : (
                                    <Text className="text-sm font-medium text-gray-800">{detail.date_delivery || '-'}</Text>
                                )}
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500 mb-1">Keterangan DO</Text>
                                {isEditMode ? (
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 min-h-[60px]"
                                        value={formData?.keterangan || ''}
                                        onChangeText={text => setFormData({ ...formData, keterangan: text })}
                                        multiline
                                        textAlignVertical="top"
                                    />
                                ) : (
                                    <Text className="text-sm text-gray-800 italic">{detail.keterangan || '-'}</Text>
                                )}
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-500">Source Document (SO)</Text>
                                <Text className="text-sm font-bold text-blue-600">{detail.code_so}</Text>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500">Keterangan SO</Text>
                                <Text className="text-sm text-gray-800 italic">{detail.keterangan_so || '-'}</Text>
                            </View>
                            <View className="h-[1px] bg-gray-200 my-4 mx-[-16px]" />
                            <Text className="text-xs font-bold text-gray-400 mb-3 uppercase">Daftar Barang ({detail.items.length})</Text>
                            <View className="mx-[-16px]">
                                <DoProductTable
                                    items={isEditMode ? formData?.items : detail.items}
                                    isEditMode={isEditMode}
                                    onUpdatePlat={updatePlat}
                                    onFocusPlat={handleFocusPlat}
                                />
                            </View>
                        </View>

                        {isEditMode && (
                            <View className="flex-row gap-4 mb-4">
                                <Button
                                    variant="outline"
                                    onPress={() => setIsEditMode(false)}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                >
                                    <X color={theme.colors.primary} size={20} className="mr-2" />
                                    <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                </Button>
                                <Button
                                    onPress={handleSaveEdit}
                                    className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
                                    style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Save color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Simpan</Text>
                                </Button>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {showDatePicker !== '' && (
                <DateTimePicker
                    value={formData && formData[showDatePicker] ? new Date(formData[showDatePicker]) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        if (selectedDate && event.type !== 'dismissed') {
                            const dateStr = selectedDate.toISOString().split('T')[0];
                            setFormData({ ...formData, [showDatePicker]: dateStr });
                        }
                        setShowDatePicker('');
                    }}
                />
            )}

            {/* Overlay loading submit */}
            {isSubmitting && (
                <View className="absolute inset-0 bg-black/30 justify-center items-center z-50">
                    <View className="bg-white px-6 py-4 rounded-xl flex-row items-center">
                        <Text className="text-gray-800 font-bold ml-2">Memproses...</Text>
                    </View>
                </View>
            )}
        </View>
    );
};
