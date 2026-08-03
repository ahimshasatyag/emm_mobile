import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../../utils/helpers/date';
import { theme } from '../../../theme/theme';
import { X, Check, Trash2, Save, Calendar } from 'lucide-react-native';
import { ToastMessages } from '../../../components/ui/ToastMessages';

interface VisitModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (visit: {
        date_visit: string;
        visit_activity: string;
    }) => void;
    onDelete?: () => void;
    initialData?: {
        date_visit: string;
        visit_activity: string;
    } | null;
    isReadOnly?: boolean;
}

export const VisitModal = ({ visible, onDismiss, onSave, onDelete, initialData, isReadOnly = false }: VisitModalProps) => {
    const [dateVisit, setDateVisit] = useState('');
    const [visitActivity, setVisitActivity] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({ visible: false, type: 'info', message: '' });

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (event.type === 'set' && selectedDate) {
            if (Platform.OS === 'ios') {
                setShowDatePicker(false);
            }
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            setDateVisit(`${year}-${month}-${day}`);
        } else if (event.type === 'dismissed') {
            setShowDatePicker(false);
        }
    };

    // Reset atau isi form saat modal dibuka
    useEffect(() => {
        if (visible) {
            if (initialData) {
                setDateVisit(initialData.date_visit);
                setVisitActivity(initialData.visit_activity);
            } else {
                const today = new Date().toISOString().split('T')[0];
                setDateVisit(today);
                setVisitActivity('');
            }
        }
    }, [visible, initialData]);

    const handleSave = () => {
        if (!dateVisit) {
            setToastConfig({ visible: true, type: 'error', message: 'Mohon isi tanggal kunjungan' });
            return;
        }
        if (!visitActivity) {
            setToastConfig({ visible: true, type: 'error', message: 'Mohon isi deskripsi kegiatan' });
            return;
        }

        onSave({
            date_visit: dateVisit,
            visit_activity: visitActivity
        });
        onDismiss();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onDismiss}
        >
            <ToastMessages
                visible={toastConfig.visible}
                title='Validasi'
                type={toastConfig.type as 'success' | 'error' | 'warning' | 'info'}
                message={toastConfig.message}
                onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '80%' }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">Tambah Visit</Text>
                        <TouchableOpacity onPress={onDismiss} className="bg-gray-100 p-2 rounded-full">
                            <X color="#6b7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
                        {/* Tanggal Kunjungan */}
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Tanggal</Text>
                            {isReadOnly ? (
                                <View className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 flex-row items-center justify-between">
                                    <Text className="text-gray-900">{dateVisit ? formatDate(new Date(dateVisit + 'T00:00:00')) : ''}</Text>
                                    <Calendar color="#9ca3af" size={20} />
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white flex-row items-center justify-between"
                                >
                                    <Text className="text-gray-900">{dateVisit ? formatDate(new Date(dateVisit + 'T00:00:00')) : 'Pilih Tanggal'}</Text>
                                    <Calendar color="#9ca3af" size={20} />
                                </TouchableOpacity>
                            )}

                            {showDatePicker && (
                                <DateTimePicker
                                    value={dateVisit ? new Date(dateVisit + 'T00:00:00') : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>

                        {/* Kegiatan */}
                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Kegiatan</Text>
                            <TextInput
                                className={`px-4 py-3 rounded-xl border border-gray-200 text-gray-900 h-32 ${isReadOnly ? 'bg-gray-100' : 'bg-white'}`}
                                value={visitActivity}
                                onChangeText={setVisitActivity}
                                multiline
                                textAlignVertical="top"
                                placeholder="Deskripsi kegiatan..."
                                editable={!isReadOnly}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!isReadOnly && (
                        <View className="pt-4 border-t border-gray-100 flex-row gap-3">
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
                                <Text className="text-white font-bold text-lg">Simpan Visit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
