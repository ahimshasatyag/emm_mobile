import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useUserForm } from '../hooks/useUserForm';
import { UserFormSkeleton } from '../skeleton/UserFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
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

export function UserFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
        validateForm,
        setError,
    } = useUserForm();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const onSavePress = async () => {
        const validationError = validateForm();
        if (validationError) {
            setToastMsg(validationError);
            setToastVisible(true);
            return;
        }
        setConfirmModalVisible(true);
    };

    const handleConfirmSave = async () => {
        setConfirmModalVisible(false);
        const success = await handleSave();
        if (success) {
            (navigation as any).navigate('Drawer', {
                screen: 'UserList',
                params: {
                    toastMessage: 'Data pengguna baru berhasil ditambahkan!',
                    toastType: 'success'
                }
            });
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate a network request for the form
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsRefreshing(false);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={isFetching || isRefreshing ? "MEMUAT DATA..." : "TAMBAH PENGGUNA"} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isFetching || isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <UserFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View 
                            entering={FadeInUp.delay(50)} 
                            className="bg-white p-5 rounded-3xl border border-gray-100"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Username</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-[#9e0b0f]"
                                    cursorColor={theme.colors.primary}
                                    value={formData.username}
                                    onChangeText={(text) => updateField('username', text)}
                                    placeholder="Contoh: andi_admin"
                                    autoCapitalize="none"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Password</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-[#9e0b0f]"
                                    cursorColor={theme.colors.primary}
                                    value={formData.password}
                                    onChangeText={(text) => updateField('password', text)}
                                    placeholder="Min. 8 kar (Huruf, angka, simbol)"
                                    secureTextEntry
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Lengkap</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-[#9e0b0f]"
                                    cursorColor={theme.colors.primary}
                                    value={formData.name}
                                    onChangeText={(text) => updateField('name', text)}
                                    placeholder="Contoh: Andi Wijaya"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Level Akses</Text>
                                <View className="border border-gray-200 rounded-lg bg-gray-50">
                                    <Dropdown
                                        style={{ height: 50, paddingHorizontal: 16 }}
                                        data={levelAksesData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Level Akses..."
                                        value={formData.level}
                                        onChange={item => updateField('level', item.value)}
                                    />
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => updateField('status', 'Active')}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Active' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => updateField('status', 'Inactive')}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Inactive' ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Inactive' ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </Animated.View>

                        {/* Save Button */}
                        <Animated.View entering={FadeInUp.delay(600)} className="mt-4">
                            <Button
                                onPress={onSavePress}
                                disabled={isSaving}
                                className="h-14 rounded-xl flex-row items-center justify-center"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">
                                            Simpan Pengguna
                                        </Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>

            <ModalConfirm
                visible={confirmModalVisible}
                title="Simpan Pengguna"
                message="Anda yakin ingin menyimpan data pengguna ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                onConfirm={handleConfirmSave}
                onCancel={() => setConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toastVisible}
                type="error"
                title="Validasi"
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </KeyboardAvoidingView>
    );
}
