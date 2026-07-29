import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useSopForm } from '../hooks/useSopForm';
import { Save, Upload } from 'lucide-react-native';
import { SopFormSkeleton } from '../skeleton/SopFormSkeleton';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

type RootStackParamList = {
    SopFormScreen: { divisi: string };
    SopListScreen: { divisi: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SopFormRouteProp = RouteProp<RootStackParamList, 'SopFormScreen'>;

export const SopFormScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<SopFormRouteProp>();
    const { divisi } = route.params;

    const { formData, handleChange, handleSave, validateForm, isSaving, loading, isRefreshing, onRefresh } = useSopForm(undefined, divisi);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

    const onSavePress = () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            setToastType('error');
            setToastMessage(errorMsg);
            setToastVisible(true);
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const handleConfirmSave = () => {
        setIsModalConfirmVisible(false);
        handleSave((id: string) => {
            navigation.replace('SopEditScreen' as any, { 
                id_sop: id, 
                showSuccessToast: true 
            });
        }).catch((err: any) => {
            setToastType('error');
            setToastMessage(err.message || 'Terjadi kesalahan');
            setToastVisible(true);
        });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastType === 'error' ? 'Validasi' : 'Sukses'}
                message={toastMessage}
                onClose={() => setToastVisible(false)}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan SOP ini?"
                cancelText="Batal!"
                confirmText="Simpan!"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={handleConfirmSave}
                isLoading={isSaving}
            />

            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : `TAMBAH DAFTAR INDUK DOCUMENT ${divisi}`} showBackButton={true} />
            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <SopFormSkeleton />
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                            {/* Divisi */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Divisi <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-500 bg-gray-100"
                                    value={formData.divisi}
                                    editable={false}
                                />
                            </View>

                            {/* No Document */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">No Document <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.code_sop}
                                    onChangeText={(val) => handleChange('code_sop', val)}
                                    placeholder="Masukkan No SOP"
                                />
                            </View>

                            {/* Nama Document */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Nama Document <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.nm_sop}
                                    onChangeText={(val) => handleChange('nm_sop', val)}
                                    placeholder="Masukkan Nama SOP"
                                />
                            </View>

                            {/* Mock PDF Upload */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">File PDF <Text className="text-red-500">*</Text></Text>
                                <TouchableOpacity
                                    className="border-2 border-dashed border-gray-300 rounded-lg h-32 items-center justify-center bg-gray-50"
                                    onPress={() => handleChange('file_pdf', 'dummy_uploaded_file.pdf')}
                                >
                                    {formData.file_pdf ? (
                                        <>
                                            <Text className="text-gray-700 font-bold mb-1">{formData.file_pdf}</Text>
                                            <Text className="text-gray-500 text-xs">Tap to change file</Text>
                                        </>
                                    ) : (
                                        <>
                                            <Upload color="#9ca3af" size={32} className="mb-2" />
                                            <Text className="text-gray-500 font-medium">Upload File PDF</Text>
                                            <Text className="text-gray-400 text-xs mt-1">Max size 1MB</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="flex-row gap-4 mt-2 mb-8">
                            <TouchableOpacity
                                onPress={onSavePress}
                                className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary }}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};
