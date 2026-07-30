import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';
import { X, Calendar } from 'lucide-react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from '../../../utils/helpers/date';

interface ModalCreateInvoiceProps {
    visible: boolean;
    onConfirm: (date: string) => void;
    onCancel: () => void;
}

export const ModalCreateInvoice: React.FC<ModalCreateInvoiceProps> = ({
    visible,
    onConfirm,
    onCancel
}) => {
    const [invoiceDate, setInvoiceDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const y = selectedDate.getFullYear();
            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const d = String(selectedDate.getDate()).padStart(2, '0');
            setInvoiceDate(`${y}-${m}-${d}`);
        }
    };

    const handleConfirm = () => {
        onConfirm(invoiceDate);
        setInvoiceDate(''); // reset after confirm
    };

    const handleCancel = () => {
        onCancel();
        setInvoiceDate(''); // reset after cancel
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-4">
                <View className="bg-white rounded-xl w-full max-w-[340px] pt-8 pb-6 px-6 items-center shadow-xl relative">
                    <TouchableOpacity
                        className="absolute top-3 right-3 p-1"
                        onPress={handleCancel}
                    >
                        <X size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <Text className="text-lg font-bold text-gray-700 mb-2">Create Invoice ?</Text>
                    <Text className="text-[15px] text-gray-700 mb-6">Masukkan Tgl invoice</Text>

                    <TouchableOpacity
                        className="w-full border border-gray-200 rounded-lg px-3 py-3 mb-8 bg-white flex-row justify-between items-center"
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text className={`flex-1 text-sm ${invoiceDate ? 'text-gray-900' : 'text-gray-400'}`}>
                            {invoiceDate ? formatDate(new Date(invoiceDate)) : 'DD-MM-YYYY'}
                        </Text>
                        <Calendar color="#cbd5e1" size={20} />
                    </TouchableOpacity>

                    <View className="flex-row justify-center w-full px-2">
                        <TouchableOpacity
                            className="py-2.5 px-6 rounded mr-2 flex-1 items-center"
                            style={{ backgroundColor: theme.colors.primary }}
                            onPress={handleConfirm}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold">Ya!</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="py-2.5 px-6 rounded ml-2 flex-1 items-center"
                            style={{ backgroundColor: '#a0a0a0' }}
                            onPress={handleCancel}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold">Tidak!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={invoiceDate ? new Date(invoiceDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </Modal>
    );
};
