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

export const PaymentFormScreen = () => {
    const navigation = useNavigation();
    const { validateForm } = usePayment();
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [customer, setCustomer] = useState('');
    const [invoice, setInvoice] = useState('');
    const [bankTujuan, setBankTujuan] = useState('');

    // Read-only values from the image
    const [jumlahInvoice, setJumlahInvoice] = useState('0');

    const [isSaving, setIsSaving] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
    const [editingDetail, setEditingDetail] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

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
            navigation.replace('PaymentEdit', { id: 'NEW-PAYMENT-ID', successMessage: 'Payment berhasil dibuat!' });
        } catch (error) {
            setToast({ visible: true, message: 'Failed to save payment', type: 'error' });
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
                                    data={[
                                        { label: 'Customer A', value: 'CUST-A' },
                                        { label: 'Customer B', value: 'CUST-B' },
                                    ]}
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
                                    data={[
                                        { label: 'INV-001', value: 'INV-001' },
                                        { label: 'INV-002', value: 'INV-002' },
                                    ]}
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
                                    data={[
                                        { label: 'BCA | PT Eka Maju Mesinindo', value: 'BCA' },
                                        { label: 'MANDIRI | PT Eka Maju Mesinindo', value: 'MANDIRI' },
                                    ]}
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
