import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { X, Calendar, CheckSquare, Square, Save, Trash2 } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from '../../../theme/theme';
import { formatDate } from '../../../utils/helpers/date';

interface PaymentModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (data: any) => void;
    onDelete?: () => void;
    initialData?: any;
    isReadOnly?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onDismiss, onSave, onDelete, initialData, isReadOnly = false }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [noGiro, setNoGiro] = useState('');
    const [bankName, setBankName] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [isDp, setIsDp] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const y = selectedDate.getFullYear();
            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const d = String(selectedDate.getDate()).padStart(2, '0');
            setDate(`${y}-${m}-${d}`);
        }
    };

    // Reset or populate form when modal opens
    useEffect(() => {
        if (visible) {
            if (initialData) {
                setPaymentMethod(initialData.paymentMethod || '');
                setNoGiro(initialData.noGiro || '');
                setBankName(initialData.bankName || '');
                setDate(initialData.date || '');
                setAmount(initialData.amount?.toString() || '');
                setKeterangan(initialData.keterangan || '');
                setIsDp(initialData.dp || false);
            } else {
                setPaymentMethod('');
                setNoGiro('');
                setBankName('');
                setDate('');
                setAmount('');
                setKeterangan('');
                setIsDp(false);
            }
        }
    }, [visible, initialData]);

    const handleSave = () => {
        onSave({
            id: initialData?.id || Date.now().toString(),
            paymentMethod,
            noGiro,
            bankName,
            date,
            amount,
            keterangan,
            dp: isDp
        });
        onDismiss();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl h-[85%] flex-shrink">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">Detail Payment</Text>
                        <TouchableOpacity onPress={onDismiss} className="p-2 bg-gray-100 rounded-full">
                            <X color="#6B7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView 
                        ref={scrollViewRef}
                        className="p-5 flex-shrink"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Payment Method</Text>
                            <View className="border border-gray-200 rounded-xl bg-white">
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={[
                                        { label: 'TUNAI', value: 'TUNAI' },
                                        { label: 'TRANSFER', value: 'TRANSFER' },
                                        { label: 'GIRO', value: 'GIRO' },
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Payment Method"
                                    value={paymentMethod}
                                    onChange={(item) => setPaymentMethod(item.value)}
                                    disable={isReadOnly}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">No. Giro</Text>
                            <TextInput
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                placeholder="Masukkan No. Giro"
                                placeholderTextColor="#9CA3AF"
                                value={noGiro}
                                onChangeText={setNoGiro}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Bank Name</Text>
                            <View className="border border-gray-200 rounded-xl bg-white">
                                <Dropdown
                                    style={{ height: 50, paddingHorizontal: 16 }}
                                    data={[
                                        { label: 'BCA', value: 'BCA' },
                                        { label: 'MANDIRI', value: 'MANDIRI' },
                                        { label: 'BNI', value: 'BNI' },
                                        { label: 'BRI', value: 'BRI' },
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Nama Bank"
                                    value={bankName}
                                    onChange={(item) => setBankName(item.value)}
                                    disable={isReadOnly}
                                    selectedTextStyle={{ fontSize: 14, color: '#111827' }}
                                    placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Date</Text>
                            <TouchableOpacity
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-white flex-row justify-between items-center"
                                onPress={() => !isReadOnly && setShowDatePicker(true)}
                            >
                                <Text className={`flex-1 text-sm ${date ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {date ? formatDate(new Date(date)) : 'DD-MM-YYYY'}
                                </Text>
                                {!isReadOnly && <Calendar color="#9CA3AF" size={20} />}
                            </TouchableOpacity>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Amount</Text>
                            <TextInput
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-900"
                                placeholder="Masukkan Amount"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                editable={!isReadOnly}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Keterangan</Text>
                            <TextInput
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900 h-24"
                                placeholder="Tambahkan keterangan opsional..."
                                placeholderTextColor="#9CA3AF"
                                value={keterangan}
                                onChangeText={setKeterangan}
                                multiline
                                editable={!isReadOnly}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity 
                            className="flex-row items-center mb-6"
                            onPress={() => !isReadOnly && setIsDp(!isDp)}
                            activeOpacity={isReadOnly ? 1 : 0.7}
                        >
                            {isDp ? (
                                <CheckSquare color={theme.colors.primary} size={24} />
                            ) : (
                                <Square color="#9CA3AF" size={24} />
                            )}
                            <Text className="ml-2 font-semibold text-gray-700">Tandai sebagai DP (Down Payment)</Text>
                        </TouchableOpacity>

                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!isReadOnly && (
                        <View className="p-4 border-t border-gray-100 flex-row gap-3">
                            {initialData && onDelete && (
                                <TouchableOpacity
                                    onPress={() => {
                                        onDelete();
                                        onDismiss();
                                    }}
                                    className="p-4 rounded-2xl items-center justify-center bg-red-50 border border-red-100"
                                >
                                    <Trash2 color="#ef4444" size={20} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleSave}
                                className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary, elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="#fff" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan Payment</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>

            {showDatePicker && !isReadOnly && (
                <DateTimePicker
                    value={date ? new Date(date) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </Modal>
    );
};
