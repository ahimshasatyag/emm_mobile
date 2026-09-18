import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Save, Edit2, X, Trash2 } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useEmployeePosisiForm } from '../hooks/useEmployeePosisiForm';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { EmployeePosisiEditSkeleton } from '../skeleton/EmployeePosisiEditSkeleton';

export function EmployeePosisiEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const posisiId = route.params?.id;
    const { formData, updateField, save, remove, isLoading, isSaving, initialLoadDone, validateForm, loadData } = useEmployeePosisiForm(posisiId);

    const [isEditing, setIsEditing] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [toastState, setToastState] = useState({
        visible: false,
        type: 'success' as ToastType,
        message: ''
    });

    useEffect(() => {
        if (route.params?.showSuccessToast) {
            setToastState({
                visible: true,
                type: 'success',
                message: 'Posisi berhasil ditambahkan'
            });
            navigation.setParams({ showSuccessToast: undefined });
        }
    }, [route.params?.showSuccessToast]);

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
                setToastState({
                    visible: true,
                    type: 'success',
                    message: 'Posisi berhasil diperbarui'
                });
                setIsEditing(false);
            } else {
                throw new Error("Gagal menyimpan data");
            }
        } catch (error: any) {
            setToastState({
                visible: true,
                type: 'error',
                message: error?.message || 'Gagal memperbarui posisi'
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    const handleDelete = () => {
        Alert.alert("Hapus Posisi", "Apakah Anda yakin ingin menghapus posisi ini?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Hapus",
                style: "destructive",
                onPress: async () => {
                    const success = await remove();
                    if (success) {
                        navigation.navigate('EmployeePosisiList', {
                            toastMessage: 'Posisi berhasil dihapus',
                            toastType: 'success'
                        });
                    } else {
                        setToastState({
                            visible: true,
                            type: 'error',
                            message: 'Gagal menghapus data'
                        });
                    }
                }
            }
        ]);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={!initialLoadDone || isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT POSISI" : "DETAIL POSISI")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ToastMessages visible={toastState.visible} type={toastState.type} title={toastState.type === 'success' ? 'Sukses' : 'Validasi'} message={toastState.message} onClose={() => setToastState({ ...toastState, visible: false })} />

            <ModalConfirm visible={isModalConfirmVisible} title="Konfirmasi" message="Apakah Anda yakin ingin menyimpan perubahan posisi ini?" confirmText="Ya, Simpan" cancelText="Batal" onCancel={() => setIsModalConfirmVisible(false)} onConfirm={confirmSave} isLoading={isSaving} />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isLoading && initialLoadDone} onRefresh={loadData} colors={[theme.colors.primary]} />}>
                {(!initialLoadDone && isLoading) ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <EmployeePosisiEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View key={`form-container-${isEditing}`} entering={FadeInUp.delay(50)} layout={LinearTransition.springify()} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                            <View>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Posisi <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`px-4 py-3 rounded-xl border ${isEditing ? 'bg-gray-50 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                    style={isEditing ? { borderColor: focusedField === 'nm_karyawan_posisi' ? theme.colors.primary : '#e5e7eb' } : undefined}
                                    placeholder="Masukkan nama posisi"
                                    value={formData.nm_karyawan_posisi}
                                    onChangeText={(text) => updateField('nm_karyawan_posisi', text)}
                                    editable={isEditing}
                                    onFocus={() => setFocusedField('nm_karyawan_posisi')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </Animated.View>

                        <Animated.View key={`actions-${isEditing}`} entering={FadeInUp.delay(100)} layout={LinearTransition.springify()} className="flex-row mt-4 gap-3">
                            {!isEditing ? (
                                <>
                                    <Button onPress={() => setIsEditing(true)} className="flex-1 h-14 rounded-xl flex-row items-center justify-center" style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                                        <Edit2 color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit</Text>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" onPress={handleCancel} className="flex-1 h-14 rounded-xl flex-row items-center justify-center">
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button onPress={handleSavePress} disabled={isSaving} className="flex-1 h-14 rounded-xl flex-row items-center justify-center" style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                                    </Button>
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
