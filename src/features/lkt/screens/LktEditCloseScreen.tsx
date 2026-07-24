import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Eye, UploadCloud, Check, CornerDownLeft, FileImage } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';

export function LktEditCloseScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};

    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({ visible: false, type: 'success', message: '' });

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'],
            });
            
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setFile(result.assets[0]);
                setShowPreview(true); // Auto show preview like modern apps, or we can wait for button click.
            }
        } catch (err) {
            console.error("Error picking document", err);
        }
    };

    const handleSaveClose = () => {
        setIsConfirmModalVisible(true);
    };

    const confirmSaveClose = () => {
        setIsConfirmModalVisible(false);
        
        setTimeout(() => {
            navigation.navigate('LktEditScreen', {
                showSuccessToast: true,
                successMessage: 'Berhasil menyimpan bast dan close lkt!'
            });
        }, 100);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Save dan Close LKT?"
                message="Save untuk menyimpan bast dan close lkt!"
                confirmText="Ya, Simpan!"
                cancelText="Tidak, batalkan!"
                onConfirm={confirmSaveClose}
                onCancel={() => setIsConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'error' ? 'Error' : 'Sukses'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title="TUTUP LKT"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
                <Animated.View entering={FadeInDown.springify()} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    
                    <View className="mb-6">
                        <Text className="text-xl font-extrabold text-slate-800">CST-EMM/2025/07/03624</Text>
                        <Text className="text-sm font-bold text-gray-700 mt-2">Silahkan Upload Foto Lampiran BAST</Text>
                    </View>

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity 
                            className="bg-gray-500 px-4 py-2.5 rounded-lg flex-row items-center mr-3"
                            onPress={() => navigation.goBack()}
                        >
                            <CornerDownLeft size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1.5">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="bg-emerald-600 px-4 py-2.5 rounded-lg flex-row items-center"
                            onPress={handleSaveClose}
                        >
                            <Check size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1.5">Save & Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <View className="flex-row mb-2">
                            <Text className="text-xs font-bold text-gray-700 w-24">Gambar</Text>
                            <Text className="text-xs font-bold text-gray-700 mr-2">:</Text>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Upload Image</Text>
                                
                                <TouchableOpacity 
                                    className="border-2 border-dashed border-gray-300 rounded-xl bg-white items-center justify-center py-6 mb-2"
                                    onPress={pickDocument}
                                >
                                    <UploadCloud size={32} color="#9ca3af" />
                                    <Text className="text-xs text-gray-500 mt-2 text-center px-4">
                                        Tap to select image (png, jpg, jpeg, bmp)
                                    </Text>
                                    <Text className="text-[10px] text-red-500 mt-1 italic">ukuran image max 500kb</Text>
                                </TouchableOpacity>

                                {file && (
                                    <View className="mt-2">
                                        <TouchableOpacity 
                                            className="bg-blue-500 px-3 py-2 rounded flex-row items-center self-start mb-3"
                                            onPress={() => setShowPreview(!showPreview)}
                                        >
                                            <Eye size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1.5">Lihat Preview</Text>
                                        </TouchableOpacity>

                                        {showPreview && (
                                            <View className="border border-gray-200 p-2 rounded-lg bg-white items-center">
                                                <Image 
                                                    source={{ uri: file.uri }} 
                                                    style={{ width: '100%', height: 250, resizeMode: 'contain' }} 
                                                    className="rounded"
                                                />
                                                <Text className="text-[10px] text-gray-500 mt-2">{file.name}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                </Animated.View>
            </ScrollView>

        </View>
    );
}
