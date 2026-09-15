import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Plus, Save } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { PaymentTable } from '../components/PaymentTable';
import { PaymentModal } from '../components/PaymentModal';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { formatRp } from '../../../utils/helpers/money';
import { PaymentFormSkeleton } from '../skeleton/PaymentFormSkeleton';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { usePayment } from '../hooks/usePayment';
import { PaymentSupportData, InvoiceCustomer, Bank } from '../types/payment';

export const PaymentFormScreen = () => {
    const navigation = useNavigation<any>();
    const { validateForm, loadSupportData, fetchCustomerDetailByInvoice, createNewPayment } = usePayment();
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [customer, setCustomer] = useState('');
    const [invoice, setInvoice] = useState('');
    const [bankTujuan, setBankTujuan] = useState('');

    const [supportData, setSupportData] = useState<PaymentSupportData | null>(null);
    const [invoiceOptions, setInvoiceOptions] = useState<any[]>([]);
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [bankOptions, setBankOptions] = useState<any[]>([]);

    // Read-only values from the image
    const [jumlahInvoice, setJumlahInvoice] = useState('0');

    const [isSaving, setIsSaving] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
    const [editingDetail, setEditingDetail] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const data = await loadSupportData();
            setSupportData(data);
            setCustomerOptions(data.data_customers_invoice.map((c: any) => ({ label: c.nm_customers, value: c.id_customers })));
            setInvoiceOptions(data.data_invoice.map((i: any) => ({ label: i.code_invoice, value: i.id_invoice })));
            setBankOptions(data.data_bank.map((b: any) => ({ label: `${b.code_bank} | ${b.nm_bank}`, value: b.id_bank })));
        } catch (error) {
            setToast({ visible: true, message: 'Gagal memuat support data', type: 'error' });
        } finally {
            setIsRefreshing(false);
        }
    }, [loadSupportData]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (invoice) {
            fetchCustomerDetailByInvoice(invoice).then(res => {
                if (res && res.length > 0) {
                    const detail = res[0];
                    setCustomer(detail.id_customers);
                    setJumlahInvoice(detail.ntot_balance?.toString() || '0');
                }
            }).catch(e => console.error(e));
        } else {
            setJumlahInvoice('0');
        }
    }, [invoice]);

    // Menghitung otomatis total payment dan sisa tagihan
    const totalPayment = paymentDetails.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const sisaTagihan = (parseFloat(jumlahInvoice) || 0) - totalPayment;

    const handleAddDetail = (detail: any) => {
        if (editingDetail) {
            setPaymentDetails(paymentDetails.map(item => item.id === detail.id ? detail : item));
            setToast({ visible: true, message: 'Data Payment berhasil diubah', type: 'success' });
        } else {
            setPaymentDetails([...paymentDetails, detail]);
            setToast({ visible: true, message: 'Data Payment berhasil ditambahkan', type: 'success' });
        }
        setEditingDetail(null);
    };

    const handleDeleteDetail = (id: string) => {
        setPaymentDetails(paymentDetails.filter(item => item.id !== id));
        setToast({ visible: true, message: 'Data payment berhasil dihapus', type: 'success' });
        setEditingDetail(null);
    };

    const handleRowClick = (detail: any) => {
        setEditingDetail(detail);
        setIsModalVisible(true);
    };

    const handleSubmit = () => {
        const error = validateForm({ customer, invoice, bankTujuan, paymentDetails });
        if (error) {
            setToast({ visible: true, message: error, type: 'error' });
            return;
        }
        setIsConfirmModalVisible(true);
    };

    const confirmSubmit = async () => {
        setIsConfirmModalVisible(false);
        setIsSaving(true);
        try {
            // Map paymentDetails ke format payload yang diharapkan backend
            const paymentsPayload = paymentDetails.map(d => {
                // paymentMethod di modal saat ini string TUNAI/TRANSFER/GIRO. Di backend butuh ID.
                // Idealnya modal pakai id_payment_method dari supportData, tapi untuk sekarang kita map manual
                // atau asumsikan kita ubah dropdown modal nanti. Jika dropdown modal = 'TUNAI', id = 1, dsb.
                let id_pm = d.paymentMethod;
                if (id_pm === 'TUNAI') id_pm = '1';
                else if (id_pm === 'GIRO') id_pm = '2';
                else if (id_pm === 'TRANSFER') id_pm = '3';

                return {
                    id_payment_method: id_pm,
                    date_payment: d.date,
                    v_amount: d.amount,
                    payment_ref: d.keterangan, // asumsikan keterangan = payment_ref
                    no_giro: d.noGiro,
                    bank_giro_id: null, // modal saat ini blm support pilih bank giro
                    nkurs: 1, // default
                    dp: d.dp ? '1' : '0'
                };
            });

            await createNewPayment({
                id_invoice: invoice,
                id_customers: customer,
                id_bank: bankTujuan,
                payments: paymentsPayload,
                date_payment: new Date().toISOString(), // tambahan required type lokal
                v_amount: parseFloat(jumlahInvoice),
                payment_ref: '',
                no_giro: '',
                bank_giro_id: '',
                nkurs: 1,
                f_dp: '0'
            });
            navigation.goBack();
        } catch (error: any) {
            setToast({ visible: true, message: error.message || 'Failed to save payment', type: 'error' });
            setIsSaving(false);
        }
    };

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
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Simpan Payment"
                message="Apakah Anda yakin ingin menyimpan data payment ini?"
                onCancel={() => setIsConfirmModalVisible(false)}
                onConfirm={confirmSubmit}
                confirmText="Simpan"
                cancelText="Batal"
            />
            <HeaderNavigator
                title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH PAYMENT"}
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
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <PaymentFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)} className="p-4">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            <Text className="text-sm font-bold text-gray-700 mb-2">Customer <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    data={customerOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Customer"
                                    value={customer}
                                    onChange={(item) => setCustomer(item.value)}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>

                            <Text className="text-sm font-bold text-gray-700 mb-2">Invoice <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    data={invoiceOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Invoice"
                                    value={invoice}
                                    onChange={(item) => setInvoice(item.value)}
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
                            <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                                <Dropdown
                                    style={{ height: 48, paddingHorizontal: 16 }}
                                    data={bankOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Bank Tujuan"
                                    value={bankTujuan}
                                    onChange={(item) => setBankTujuan(item.value)}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>

                            <View className="h-px bg-gray-200 my-4" />

                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-bold text-gray-800">Payment</Text>
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
                            </View>

                            <PaymentTable
                                details={paymentDetails}
                                onRowClick={handleRowClick}
                            />
                        </View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            <Button
                                onPress={handleSubmit}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan Payment</Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>

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
            />
        </KeyboardAvoidingView>
    );
};
