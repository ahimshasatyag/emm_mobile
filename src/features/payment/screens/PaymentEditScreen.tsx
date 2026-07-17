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
import { formatRp } from '../../../utils/helpers/money';

export const PaymentEditScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const id = route.params?.id;
    const isEdit = !!id;

    const [isEditMode, setIsEditMode] = useState(!id || route.params?.mode === 'edit');
    const [isSplitMode, setIsSplitMode] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const isReadOnly = !isEditMode;

    const { updateExistingPayment } = usePayment();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    useEffect(() => {
        if (isEdit) {
            loadPaymentDetail();
        }
    }, [id]);

    const loadPaymentDetail = async () => {
        setIsLoading(true);
        try {
            const payment = await api.fetchPaymentById(id);
            if (payment) {
                // Populate data based on mock structure or expected API structure
                setCustomer(payment.id_customers || 'CUST-A');
                setInvoice(payment.id_invoice || 'INV-001');
                setBankTujuan(payment.id_bank || 'BCA');
                setJumlahInvoice('1000000'); // Mocked invoice amount

                // Mocking a payment detail from the single payment object since it's an edit
                setPaymentDetails([{
                    id: payment.id?.toString() || '1',
                    paymentMethod: 'Transfer',
                    noGiro: payment.no_giro || '',
                    bankName: payment.id_bank || '',
                    date: payment.date_payment || new Date().toISOString().slice(0, 10),
                    amount: payment.v_amount?.toString() || '0',
                    keterangan: payment.payment_ref || '',
                    dp: payment.f_dp === '1'
                }]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load payment detail');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDetail = (detail: any) => {
        if (editingDetail) {
            setPaymentDetails(paymentDetails.map(item => item.id === detail.id ? detail : item));
        } else {
            setPaymentDetails([...paymentDetails, detail]);
        }
        setEditingDetail(null);
    };

    const handleDeleteDetail = (detailId: string) => {
        setPaymentDetails(paymentDetails.filter(item => item.id !== detailId));
        setEditingDetail(null);
    };

    const handleRowClick = (detail: any) => {
        setEditingDetail(detail);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Adapt back to expected API format if needed, here just mocking success
            if (isEdit) {
                // await updateExistingPayment(id, { ... });
                Alert.alert('Success', 'Payment updated successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save payment');
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
                                        onPress={() => Alert.alert('Print', 'Fitur Print belum diimplementasikan')}
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
                                data={[
                                    { label: 'Customer A', value: 'CUST-A' },
                                    { label: 'Customer B', value: 'CUST-B' },
                                ]}
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
                                data={[
                                    { label: 'INV-001', value: 'INV-001' },
                                    { label: 'INV-002', value: 'INV-002' },
                                ]}
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
                                data={[
                                    { label: 'BCA | PT Eka Maju Mesinindo', value: 'BCA' },
                                    { label: 'MANDIRI | PT Eka Maju Mesinindo', value: 'MANDIRI' },
                                ]}
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
                            <Text className="font-bold text-gray-800">Riwayat Pembayaran</Text>
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

            <ModalCancel
                visible={isCancelModalVisible}
                title="Hapus Data"
                message="Apakah anda yakin ingin membatalkan atau menghapus data ini? Aksi ini tidak dapat dibatalkan."
                onCancel={() => setIsCancelModalVisible(false)}
                onConfirm={() => {
                    setIsCancelModalVisible(false);
                    navigation.goBack();
                }}
            />
        </KeyboardAvoidingView>
    );
};
