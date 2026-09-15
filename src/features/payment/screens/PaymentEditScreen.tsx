import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { Plus, Save, X, Pencil, Printer, Split, Trash2, CornerDownLeft } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { usePayment } from '../hooks/usePayment';
import { PaymentEditSkeleton } from '../skeleton/PaymentEditSkeleton';
import { theme } from '../../../theme/theme';
import * as api from '../api/paymentApi';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { PaymentTable } from '../components/PaymentTable';
import { PaymentModal } from '../components/PaymentModal';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { formatRp } from '../../../utils/helpers/money';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export const PaymentEditScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const id = route.params?.id;
    const isEdit = !!id;

    const [isEditMode, setIsEditMode] = useState(!id || route.params?.mode === 'edit');
    const [isSplitMode, setIsSplitMode] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const isReadOnly = !isEditMode;

    const { updateExistingPayment, cancelExistingPayment, splitExistingPayment, fetchPaymentDetail, loadSupportData, fetchCustomerDetailByInvoice } = usePayment();
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Support Data Options
    const [invoiceOptions, setInvoiceOptions] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [bankOptions, setBankOptions] = useState<any[]>([]);

    useEffect(() => {
        if (route.params?.successMessage) {
            setToast({ visible: true, message: route.params.successMessage, type: 'success' });
            navigation.setParams({ successMessage: undefined });
        }
    }, [route.params?.successMessage]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const isPageLoading = isLoading || isRefreshing;

    // Form States
    const [customer, setCustomer] = useState('');
    const [invoice, setInvoice] = useState('');
    const [bankTujuan, setBankTujuan] = useState('');

    // Read-only values from the image
    const [jumlahInvoice, setJumlahInvoice] = useState('0');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
    const [editingDetail, setEditingDetail] = useState<any>(null);

    // Menghitung otomatis total payment dan sisa tagihan
    const totalPayment = paymentDetails.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const sisaTagihan = (parseFloat(jumlahInvoice) || 0) - totalPayment;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const supportData = await loadSupportData();
            setCustomerOptions(supportData.data_customers_invoice.map((c: any) => ({ label: c.nm_customers, value: c.id_customers })));
            setInvoiceOptions(supportData.data_invoice.map((i: any) => ({ label: i.code_invoice, value: i.id_invoice })));
            setBankOptions(supportData.data_bank.map((b: any) => ({ label: `${b.code_bank} | ${b.nm_bank}`, value: b.id_bank })));

            if (isEdit && id) {
                const payment = await fetchPaymentDetail(id);
                if (payment) {
                    setCustomer(payment.id_customers || '');
                    setInvoice(payment.id_invoice || '');
                    setBankTujuan(payment.id_bank || '');

                    if (payment.id_invoice) {
                        const invDetail = await fetchCustomerDetailByInvoice(payment.id_invoice);
                        if (invDetail && invDetail.length > 0) {
                            setJumlahInvoice(invDetail[0].ntot_balance?.toString() || '0');
                        }
                    }

                    // Backend currently returns a single payment or list of payments under an ID?
                    // According to our interface, Payment is one object
                    let pmMethod = 'TUNAI';
                    if (payment.id_payment_method === '2') pmMethod = 'GIRO';
                    if (payment.id_payment_method === '3') pmMethod = 'TRANSFER';

                    setPaymentDetails([{
                        id: payment.id_payment_schdl?.toString() || '1',
                        paymentMethod: pmMethod,
                        noGiro: payment.no_giro || '',
                        bankName: payment.id_bank || '',
                        date: payment.date_payment || new Date().toISOString().slice(0, 10),
                        amount: payment.v_amount?.toString() || '0',
                        keterangan: payment.payment_ref || '',
                        dp: payment.f_dp === '1'
                    }]);
                }
            }
        } catch (error) {
            console.error(error);
            setToast({ visible: true, message: 'Failed to load data', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [id, isEdit, loadSupportData, fetchPaymentDetail, fetchCustomerDetailByInvoice]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAddDetail = (detail: any) => {
        if (editingDetail) {
            setPaymentDetails(paymentDetails.map(item => item.id === detail.id ? detail : item));
            setToast({ visible: true, message: 'Data payment berhasil diubah', type: 'success' });
        } else {
            setPaymentDetails([...paymentDetails, detail]);
            setToast({ visible: true, message: 'Data payment berhasil ditambahkan', type: 'success' });
        }
        setEditingDetail(null);
    };

    const handleDeleteDetail = (detailId: string) => {
        setPaymentDetails(paymentDetails.filter(item => item.id !== detailId));
        setToast({ visible: true, message: 'Data payment berhasil dihapus', type: 'success' });
        setEditingDetail(null);
    };

    const handleRowClick = (detail: any) => {
        setEditingDetail(detail);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        if (!customer || !invoice || !bankTujuan || paymentDetails.length === 0) {
            setToast({ visible: true, message: 'Semua field wajib diisi', type: 'error' });
            return;
        }
        setIsConfirmModalVisible(true);
    };

    const confirmSubmit = async () => {
        setIsConfirmModalVisible(false);
        setIsSaving(true);
        try {
            const paymentsPayload = paymentDetails.map(d => {
                let id_pm = d.paymentMethod;
                if (id_pm === 'TUNAI') id_pm = '1';
                else if (id_pm === 'GIRO') id_pm = '2';
                else if (id_pm === 'TRANSFER') id_pm = '3';

                return {
                    id_payment_method: id_pm,
                    date_payment: d.date,
                    v_amount: d.amount,
                    payment_ref: d.keterangan,
                    no_giro: d.noGiro,
                    bank_giro_id: null,
                    nkurs: 1,
                    dp: d.dp ? '1' : '0'
                };
            });

            if (isEdit && id) {
                if (isSplitMode) {
                    await splitExistingPayment(id, {
                        id_invoice: invoice,
                        id_customers: customer,
                        id_bank: bankTujuan,
                        payments: paymentsPayload,
                    });
                    setToast({ visible: true, message: 'Payment berhasil displit!', type: 'success' });
                } else {
                    await updateExistingPayment(id, {
                        id_invoice: invoice,
                        id_customers: customer,
                        id_bank: bankTujuan,
                        payments: paymentsPayload,
                        // Assuming update uses same payload
                        date_payment: new Date().toISOString(),
                        v_amount: parseFloat(jumlahInvoice),
                        payment_ref: '',
                        no_giro: '',
                        bank_giro_id: '',
                        nkurs: 1,
                        f_dp: '0'
                    });
                    setToast({ visible: true, message: 'Payment berhasil diupdate!', type: 'success' });
                }
            }
            setIsEditMode(false);
            setIsSplitMode(false);
        } catch (error: any) {
            setToast({ visible: true, message: error.message || 'Failed to save payment', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const title = isPageLoading ? 'MEMUAT DATA...' : (isSplitMode ? 'SPLIT PAYMENT' : isReadOnly ? 'DETAIL PAYMENT' : isEdit ? 'EDIT PAYMENT' : 'TAMBAH PAYMENT');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-50"
        >
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'success' ? 'Success' : 'Validasi'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <ModalCancel
                visible={isCancelModalVisible}
                title="Hapus Payment"
                message="Apakah Anda yakin ingin menghapus payment ini? Tindakan ini tidak dapat dibatalkan."
                onCancel={() => setIsCancelModalVisible(false)}
                onConfirm={async () => {
                    setIsCancelModalVisible(false);
                    try {
                        await cancelExistingPayment(id);
                        setToast({ visible: true, message: 'Payment berhasil dibatalkan', type: 'success' });
                        navigation.goBack();
                    } catch (error: any) {
                        setToast({ visible: true, message: error.message || 'Gagal membatalkan payment', type: 'error' });
                    }
                }}
                confirmText="Hapus"
                cancelText="Batal"
            />
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Update Data Payment"
                message="Apakah Anda yakin ingin update data payment ini?"
                onCancel={() => setIsConfirmModalVisible(false)}
                onConfirm={confirmSubmit}
                confirmText="Update"
                cancelText="Batal"
            />
            <HeaderNavigator
                title={title}
                showBackButton={true}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isPageLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <PaymentEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">

                        <Animated.View entering={FadeInUp.delay(100)} className="mb-4">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isEditMode && (
                                    <TouchableOpacity
                                        className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2"
                                        onPress={() => {
                                            if (!id) navigation.goBack();
                                            else {
                                                setIsEditMode(false);
                                                setIsSplitMode(false);
                                            }
                                        }}
                                    >
                                        <CornerDownLeft size={14} color="white" />
                                        <Text className="text-white text-xs font-bold ml-1">Back</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    className={`px-3 py-2 rounded flex-row items-center mr-2 ${isEditMode ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    onPress={() => {
                                        if (isEditMode) {
                                            handleSave();
                                        } else {
                                            setIsEditMode(true);
                                        }
                                    }}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <>
                                            {isEditMode ? <Save size={14} color="white" /> : <Pencil size={14} color="white" />}
                                            <Text className="text-white text-xs font-bold ml-1">{isEditMode ? 'Simpan' : 'Edit'}</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                {!isEditMode && (
                                    <>
                                        <TouchableOpacity
                                            className="bg-orange-500 px-3 py-2 rounded flex-row items-center mr-2"
                                            onPress={() => {
                                                setIsSplitMode(true);
                                                setIsEditMode(true);
                                            }}
                                        >
                                            <Split size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Split</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="bg-gray-600 px-3 py-2 rounded flex-row items-center mr-2"
                                            onPress={() => setToast({ visible: true, message: 'Fitur Print belum diimplementasikan', type: 'error' })}
                                        >
                                            <Printer size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Print</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="bg-red-600 px-3 py-2 rounded flex-row items-center mr-2"
                                            onPress={() => setIsCancelModalVisible(true)}
                                        >
                                            <Trash2 size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Hapus</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </ScrollView>
                        </Animated.View>

                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            <Text className="text-sm font-bold text-gray-700 mb-2">Customer <Text className="text-red-500">*</Text></Text>
                            <View className={`border border-gray-200 rounded-xl mb-4 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}>
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    data={customerOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Customer"
                                    value={customer}
                                    onChange={(item) => setCustomer(item.value)}
                                    disable={isReadOnly}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-2">Invoice <Text className="text-red-500">*</Text></Text>
                            <View className={`border border-gray-200 rounded-xl mb-4 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}>
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    data={invoiceOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Invoice"
                                    value={invoice}
                                    onChange={(item) => setInvoice(item.value)}
                                    disable={isReadOnly}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>

                            <View className="flex-row justify-between mb-4">
                                <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Jumlah Invoice</Text>
                                    <TextInput
                                        className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formatRp(parseFloat(jumlahInvoice) || 0)}
                                        editable={false}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Sisa Tagihan</Text>
                                    <TextInput
                                        className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                        value={formatRp(sisaTagihan)}
                                        editable={false}
                                    />
                                </View>
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-2">Bank Tujuan <Text className="text-red-500">*</Text></Text>
                            <View className={`border border-gray-200 rounded-xl mb-4 ${isReadOnly ? 'bg-gray-100' : 'bg-gray-50'}`}>
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    data={bankOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Bank Tujuan"
                                    value={bankTujuan}
                                    onChange={(item) => setBankTujuan(item.value)}
                                    disable={isReadOnly}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>

                            <View className="h-px bg-gray-200 my-4" />

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Payment</Text>
                                {isEditMode && (!isEdit || isSplitMode) && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setEditingDetail(null);
                                            setIsModalVisible(true);
                                        }}
                                        className="flex-row items-center px-3 py-1.5 rounded-lg"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        <Plus size={16} color="#ffffff" />
                                        <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <PaymentTable
                                details={paymentDetails}
                                onRowClick={handleRowClick}
                            />
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            <PaymentModal
                visible={isModalVisible}
                onDismiss={() => {
                    setIsModalVisible(false);
                    setEditingDetail(null);
                }}
                onSave={handleAddDetail}
                onDelete={editingDetail ? () => handleDeleteDetail(editingDetail.id) : undefined}
                initialData={editingDetail}
                isReadOnly={isReadOnly}
            />

        </KeyboardAvoidingView>
    );
};
