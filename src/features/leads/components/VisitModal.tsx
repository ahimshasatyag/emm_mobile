import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { theme } from '../../../theme/theme';
import { X, Check, Trash2, Save } from 'lucide-react-native';

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
            alert('Mohon isi tanggal kunjungan');
            return;
        }
        if (!visitActivity) {
            alert('Mohon isi deskripsi kegiatan');
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
                            <TextInput
                                className={`px-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-bold ${isReadOnly ? 'bg-gray-100' : 'bg-white'}`}
                                value={dateVisit}
                                onChangeText={setDateVisit}
                                placeholder="YYYY-MM-DD"
                                editable={!isReadOnly}
                            />
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
