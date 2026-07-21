import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { useUserForm } from '../hooks/useUserForm';
import { UserEditSkeleton } from '../skeleton/UserEditSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown } from 'react-native-element-dropdown';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

const levelAksesData = [
    { label: 'Super Admin', value: 'Super Admin' },
    { label: 'Admin', value: 'Admin' },
    { label: 'HRD', value: 'HRD' },
    { label: 'Teknisi', value: 'Teknisi' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Finance', value: 'Finance' }
];

export function UserEditScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId } = (route.params as { userId?: string }) || {};

    const [isEditing, setIsEditing] = useState(false);

    const {
        formData,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
        loadUser,
        validateForm,
        setError,
    } = useUserForm(userId);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<ToastType>('error');
    const [toastTitle, setToastTitle] = useState('Validasi');

    const onSavePress = async () => {
        const validationError = validateForm();
        if (validationError) {
            setToastMsg(validationError);
            setToastType('error');
            setToastTitle('Validasi');
            setToastVisible(true);
            return;
        }
        setConfirmModalVisible(true);
    };

    const handleConfirmSave = async () => {
        setConfirmModalVisible(false);
        const success = await handleSave();
        if (success) {
            setIsEditing(false);
            setToastMsg('Data pengguna berhasil diperbarui!');
            setToastType('success');
            setToastTitle('Sukses');
            setToastVisible(true);
            loadUser(); // Refresh data to reflect changes
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadUser(); // Re-fetch to discard changes
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadUser();
        setIsRefreshing(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator
                title={isFetching || isRefreshing ? 'MEMUAT DATA...' : (isEditing ? 'EDIT PENGGUNA' : 'DETAIL PENGGUNA')}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isFetching || isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <UserEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>

                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white p-5 rounded-3xl border border-gray-100"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Username</Text>
                                <TextInput
                                    className="h-12 bg-gray-100 px-4 rounded-xl border border-gray-200 text-gray-500"
                                    value={formData.username}
                                    placeholder="Contoh: andi_admin"
                                    autoCapitalize="none"
                                    editable={false} // Username is always readonly in edit
                                />
                            </Animated.View>

                            {isEditing && (
                                <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Password Baru</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-[#9e0b0f]"
                                        cursorColor={theme.colors.primary}
                                        value={formData.password}
                                        onChangeText={(text) => updateField('password', text)}
                                        placeholder="Kosongkan jika tidak diubah"
                                        secureTextEntry
                                        editable={isEditing}
                                    />
                                </Animated.View>
                            )}

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Lengkap</Text>
                                <TextInput
                                    className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                    cursorColor={theme.colors.primary}
                                    value={formData.name}
                                    onChangeText={(text) => updateField('name', text)}
                                    placeholder="Contoh: Andi Wijaya"
                                    editable={isEditing}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Level Akses</Text>
                                <View className={`border rounded-xl ${isEditing ? 'border-gray-200 bg-gray-50 focus:border-[#9e0b0f]' : 'border-gray-200 bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={levelAksesData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Level Akses..."
                                        value={formData.level}
                                        onChange={item => isEditing && updateField('level', item.value)}
                                        disable={!isEditing}
                                        selectedTextStyle={{ color: isEditing ? '#111827' : '#6b7280' }}
                                    />
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => isEditing && updateField('status', 'Active')}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Active' ? (isEditing ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && formData.status !== 'Active' && 'opacity-50'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Active' ? (isEditing ? 'text-green-700' : 'text-gray-600') : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => isEditing && updateField('status', 'Inactive')}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Inactive' ? (isEditing ? 'bg-gray-100 border-gray-400' : 'bg-gray-200 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && formData.status !== 'Inactive' && 'opacity-50'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Inactive' ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </Animated.View>

                        {/* Bottom Actions */}
                        <Animated.View
                            key={`actions-${isEditing}`}
                            entering={FadeInUp.delay(300)}
                            layout={LinearTransition.springify()}
                            className="mt-4 flex-row gap-3"
                        >
                            {!isEditing ? (
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit2 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit Pengguna</Text>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={handleCancel}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>

                                    <Button
                                        onPress={onSavePress}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Save color="white" size={20} className="mr-2" />
                                                <Text className="text-white font-bold text-lg">Simpan</Text>
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <ModalConfirm
                visible={confirmModalVisible}
                title="Simpan Perubahan"
                message="Anda yakin ingin menyimpan perubahan data pengguna ini?"
                confirmText="Ya, Update"
                cancelText="Batal"
                onConfirm={handleConfirmSave}
                onCancel={() => setConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastTitle}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </KeyboardAvoidingView>
    );
}
