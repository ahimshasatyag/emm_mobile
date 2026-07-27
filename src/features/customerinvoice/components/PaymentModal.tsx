import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Save, Calendar, CheckSquare, Square } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useCustomerInvoice } from '../hooks/useCustomerInvoice';
import { formatInputNumber } from '../../../utils/helpers/money';

interface PaymentModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (data: any) => void;
}

const PAYMENT_METHODS = [
    { label: 'Transfer', value: 'transfer' },
    { label: 'Tunai', value: 'tunai' },
    { label: 'Giro', value: 'giro' },
];

const BANK_OPTIONS = [
    { label: 'BCA', value: 'BCA' },
    { label: 'Mandiri', value: 'MANDIRI' },
    { label: 'BNI', value: 'BNI' },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onDismiss, onSave }) => {
    const { validatePayment } = useCustomerInvoice();
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [bank, setBank] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [isDp, setIsDp] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (visible) {
            setPaymentMethod('');
            setAmount('');
            setPaymentDate(new Date());
            setBank('');
            setKeterangan('');
            setIsDp(false);
            setToast({ visible: false, message: '', type: 'error' });
        }
    }, [visible]);

    const handleSave = () => {
        const payload = {
            paymentMethod,
            amount: parseInt(amount.replace(/[^0-9]/g, '')) || 0,
            paymentDate,
            bank,
            keterangan,
            isDp
        };

        const errorMsg = validatePayment(payload);
        if (errorMsg) {
            setToast({ visible: true, message: errorMsg, type: 'error' });
            return;
        }

        onSave(payload);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
            <ToastMessages
                visible={toast.visible}
                title="Validasi"
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl h-[85%] flex-shrink">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">Tambah Payment</Text>
                        <TouchableOpacity onPress={onDismiss} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        className="p-5 flex-shrink"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* Payment Method */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Payment Method <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-xl bg-white">
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={PAYMENT_METHODS}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Payment Method"
                                    value={paymentMethod}
                                    onChange={opt => setPaymentMethod(opt.value)}
                                />
                            </View>
                        </View>

                        {/* Amount */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Amount <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                value={amount}
                                onChangeText={(val) => setAmount(formatInputNumber(val))}
                                keyboardType="numeric"
                                placeholder="Masukkan jumlah"
                            />
                        </View>

                        {/* Date */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Date <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-white flex-row justify-between items-center"
                            >
                                <Text className="text-gray-900">
                                    {paymentDate.toISOString().split('T')[0]}
                                </Text>
                                <Calendar size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={paymentDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setPaymentDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
                        </View>

                        {/* Bank Tujuan */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Bank Tujuan</Text>
                            <View className="border border-gray-200 rounded-xl bg-white">
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={BANK_OPTIONS}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Bank Tujuan"
                                    value={bank}
                                    onChange={opt => setBank(opt.value)}
                                />
                            </View>
                        </View>

                        {/* Keterangan */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Keterangan</Text>
                            <TextInput
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900 h-24"
                                value={keterangan}
                                onChangeText={setKeterangan}
                                placeholder="Masukkan keterangan..."
                                multiline
                                textAlignVertical="top"
                                onFocus={() => {
                                    setTimeout(() => {
                                        scrollViewRef.current?.scrollToEnd({ animated: true });
                                    }, 100);
                                }}
                            />
                        </View>

                        {/* DP Checkbox */}
                        <TouchableOpacity
                            className="flex-row items-center mb-6"
                            onPress={() => setIsDp(!isDp)}
                        >
                            {isDp ? (
                                <CheckSquare size={24} color={theme.colors.primary} />
                            ) : (
                                <Square size={24} color="#9CA3AF" />
                            )}
                            <Text className="ml-2 font-semibold text-gray-700">Tandai sebagai DP (Down Payment)</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Footer */}
                    <View className="p-5 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={handleSave}
                            className="py-4 rounded-2xl flex-row items-center justify-center"
                            style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                        >
                            <Save color="#fff" size={20} className="mr-2" />
                            <Text className="text-white font-bold text-lg">Simpan Payment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
