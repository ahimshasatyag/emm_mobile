import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X } from 'lucide-react-native';

export type NotifModalType = 'cair' | 'batal';

interface NotifModalProps {
    visible: boolean;
    type: NotifModalType;
    onDismiss: () => void;
    onConfirm: (data: { date: Date, reason?: string }) => void;
}

export const NotifModal = ({ visible, type, onDismiss, onConfirm }: NotifModalProps) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [reason, setReason] = useState('');

    const isCair = type === 'cair';

    // Reset state when modal is opened
    useEffect(() => {
        if (visible) {
            setDate(new Date());
            setReason('');
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-center items-center bg-black/50"
            >
                <View className="bg-white rounded-3xl w-10/12 p-8 items-center shadow-2xl mx-4 relative overflow-hidden" style={{ maxHeight: '90%' }}>
                    {/* Top Right Close Button */}
                    <TouchableOpacity
                        onPress={onDismiss}
                        style={{ position: 'absolute', top: 16, right: 16, zIndex: 50, padding: 8 }}
                    >
                        <X size={24} color="#9CA3AF" strokeWidth={2} />
                    </TouchableOpacity>

                    <Text className="text-2xl font-bold text-slate-800 mb-2 text-center mt-2">
                        {isCair ? 'Sudah cair ?' : 'Yakin membatalkan ?'}
                    </Text>

                    {isCair && (
                        <Text className="text-lg text-gray-500 mb-6 text-center">
                            Masukkan Tanggal Cair
                        </Text>
                    )}

                    <View className="w-full mb-6 items-center">
                        {!isCair && (
                            <Text className="text-base font-bold text-gray-600 mb-2 mt-2">
                                Tanggal Batal
                            </Text>
                        )}
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="border border-gray-200 rounded-xl py-3 w-48 bg-white items-center justify-center mb-4"
                        >
                            <Text className="text-gray-800 text-lg">
                                {date.toISOString().split('T')[0]}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) setDate(selectedDate);
                                }}
                            />
                        )}

                        {!isCair && (
                            <View className="w-full mt-2">
                                <Text className="text-base font-bold text-gray-600 mb-2">
                                    Masukkan Alasan Batal
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-xl p-4 w-full text-gray-800 bg-white text-base"
                                    placeholder="Ketik alasan pembatalan di sini..."
                                    placeholderTextColor="#9CA3AF"
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={{ minHeight: 100 }}
                                />
                            </View>
                        )}
                    </View>

                    <View className="flex-row justify-center w-full mt-4">
                        <TouchableOpacity
                            onPress={() => onConfirm({ date, reason: isCair ? undefined : reason })}
                            className="py-3 w-28 rounded-md mx-2 items-center"
                            style={{ backgroundColor: '#DD6B55' }}
                        >
                            <Text className="text-white font-bold text-base">Ya</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onDismiss}
                            className="py-3 w-28 rounded-md mx-2 items-center"
                            style={{ backgroundColor: '#A5A5A5' }}
                        >
                            <Text className="text-white font-bold text-base">Tidak</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
