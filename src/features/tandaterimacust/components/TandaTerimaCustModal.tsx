import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Save, Trash2, Upload, Camera } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface TandaTerimaCustModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (data: { keterangan: string; fileName: string }) => void;
    initialData?: { keterangan?: string; file?: string; nama?: string } | null;
    onDelete?: () => void;
    readOnly?: boolean;
}

export const TandaTerimaCustModal: React.FC<TandaTerimaCustModalProps> = ({
    visible,
    onDismiss,
    onSave,
    initialData,
    onDelete,
    readOnly = false
}) => {
    const [keterangan, setKeterangan] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setKeterangan(initialData.keterangan || '');
                setFileName(initialData.file || initialData.nama || '');
            } else {
                setKeterangan('');
                setFileName('');
            }
        }
    }, [visible, initialData]);

    const handleUpload = () => {
        // Mock upload action
        setFileName(`Gambar_${Math.floor(Math.random() * 1000)}.jpg`);
    };

    const handleSave = () => {
        if (!fileName) return; // Prevent saving without file
        onSave({
            keterangan: keterangan,
            fileName: fileName,
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
                <View className="bg-white rounded-t-3xl min-h-[50%]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">
                            {readOnly ? 'Detail File' : (initialData ? 'Edit File' : 'Tambah File')}
                        </Text>
                        <TouchableOpacity onPress={onDismiss} className="p-2 bg-gray-100 rounded-full">
                            <X color="#6B7280" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-5">
                        <View className="mb-4">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Upload Gambar {!readOnly && <Text className="text-red-500">*</Text>}</Text>
                            <TouchableOpacity 
                                onPress={handleUpload}
                                disabled={readOnly}
                                className={`border border-dashed ${readOnly ? 'border-gray-200' : 'border-gray-300'} rounded-xl bg-gray-50 h-32 justify-center items-center mb-5 overflow-hidden`}
                            >
                                {fileName ? (
                                    <View className="items-center">
                                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-2">
                                            <Camera size={20} color={theme.colors.primary} />
                                        </View>
                                        <Text className="text-gray-700 font-medium">{fileName}</Text>
                                        {!readOnly && <Text className="text-blue-500 text-xs mt-1">Ganti Gambar</Text>}
                                    </View>
                                ) : (
                                    <>
                                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-2">
                                            <Upload size={20} color="#9ca3af" />
                                        </View>
                                        <Text className="text-gray-500 font-medium">{readOnly ? 'Tidak ada gambar' : 'Ketuk untuk upload gambar'}</Text>
                                        {!readOnly && <Text className="text-gray-400 text-xs mt-1">Format: JPG, PNG (Max 5MB)</Text>}
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Keterangan</Text>
                            <TextInput
                                className={`border border-gray-200 rounded-xl ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'} p-4`}
                                placeholder={readOnly ? '-' : 'Tuliskan keterangan...'}
                                value={keterangan}
                                onChangeText={setKeterangan}
                                editable={!readOnly}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                style={{ minHeight: 80 }}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer / Action Buttons */}
                    {!readOnly && (
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
                                disabled={!fileName}
                                className="flex-1 py-4 rounded-2xl flex-row items-center justify-center"
                                style={{ 
                                    backgroundColor: theme.colors.primary, 
                                    opacity: fileName ? 1 : 0.5,
                                    elevation: fileName ? 4 : 0, 
                                    shadowColor: theme.colors.primary, 
                                    shadowOffset: { width: 0, height: 4 }, 
                                    shadowOpacity: fileName ? 0.3 : 0, 
                                    shadowRadius: 8 
                                }}
                            >
                                <Save color="#fff" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
