import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useEmployeeDivisiForm } from '../hooks/useEmployeeDivisiForm';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { EmployeeDivisiFormSkeleton } from '../skeleton/EmployeeDivisiFormSkeleton';

export function EmployeeDivisiFormScreen() {
    const navigation = useNavigation<any>();
    const { formData, updateField, save, isLoading, isSaving, validateForm } = useEmployeeDivisiForm();

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    const handleSavePress = () => {
        const validationError = validateForm();
        if (validationError) {
            setToastState({
                visible: true,
                type: 'error',
                message: validationError
            });
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const confirmSave = async () => {
        setIsModalConfirmVisible(false);
        try {
            const success = await save();
            if (success) {
                const newId = typeof success === 'string' ? success : null;
                navigation.replace('EmployeeDivisiEdit', {
                    id: newId,
                    showSuccessToast: true
                });
            } else {
                throw new Error("Gagal menyimpan data");
            }
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error?.message || 'Gagal menyimpan divisi'
            });
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator title={isLoading ? "MEMUAT DATA..." : (isSaving ? "MENYIMPAN DATA..." : "TAMBAH DIVISI")} showBackButton={true} onBackPress={() => navigation.goBack()} />

            <ToastMessages
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.type === 'success' ? 'Sukses' : 'Validasi'}
                message={toastState.message}
                onClose={() => setToastState({ ...toastState, visible: false })} />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Konfirmasi"
                message="Apakah Anda yakin ingin menyimpan divisi ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onCancel={() => setIsModalConfirmVisible(false)}
                onConfirm={confirmSave}
                isLoading={isSaving} />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <EmployeeDivisiFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View entering={FadeInUp.delay(50)} layout={LinearTransition.springify()} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Divisi <Text className="text-red-500">*</Text></Text>
                                <TextInput className="bg-gray-50 px-4 py-3 rounded-xl border text-gray-900" style={{ borderColor: focusedField === 'nm_karyawan_divisi' ? theme.colors.primary : '#e5e7eb' }} placeholder="Masukkan nama divisi" value={formData.nm_karyawan_divisi} onChangeText={(text) => updateField('nm_karyawan_divisi', text)} onFocus={() => setFocusedField('nm_karyawan_divisi')} onBlur={() => setFocusedField(null)} />
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(100)} layout={LinearTransition.springify()} className="flex-row mt-4 gap-3">
                            <Button onPress={handleSavePress} disabled={isSaving} className="flex-1 h-14 rounded-xl flex-row items-center justify-center" style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                                <Save color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                            </Button>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
