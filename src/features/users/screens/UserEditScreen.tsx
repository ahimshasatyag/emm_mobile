import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { useUserForm } from '../hooks/useUserForm';
import { UserEditSkeleton } from '../skeleton/UserEditSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown } from 'react-native-element-dropdown';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function UserEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const userId = route.params?.userId;

    // Get levels dynamically from the state
    const levels = useAppSelector(state => state.users.levels);
    const levelAksesData = levels.map(l => ({
        label: l.nm_users_level,
        value: l.id_users_level.toString()
    }));

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
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        if (route.params?.toastMessage) {
            setToastMsg(route.params.toastMessage);
            setToastType(route.params.toastType || 'success');
            setToastVisible(true);
            (navigation as any).setParams({ toastMessage: undefined, toastType: undefined });
        }
    }, [route.params?.toastMessage]);

    const onSavePress = () => {
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
                    toastMessage: 'Data pengguna berhasil diperbarui!',
                    toastType: 'success'
                }
            });
        }
    };

    const handleRefresh = async () => {
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
                title={isFetching || isRefreshing ? "MEMUAT DATA..." : (isEditable ? "EDIT PENGGUNA" : "DETAIL PENGGUNA")} 
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
                        <UserEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <Animated.View 
                            entering={FadeInUp.delay(50)} 
                            className="bg-white p-5 rounded-3xl border border-gray-100"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            {/* Read-Only Username */}
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Username</Text>
                                <View className="h-12 bg-gray-100 px-4 justify-center rounded-xl border border-gray-200">
                                    <Text className="text-gray-500">{formData.username}</Text>
                                </View>
                                <Text className="text-xs text-gray-400 mt-1 italic">* Username tidak dapat diubah</Text>
                            </Animated.View>

                            {/* Password Optional */}
                            {isEditable && (
                                <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Password Baru (Opsional)</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-[#9e0b0f]"
                                        cursorColor={theme.colors.primary}
                                        value={formData.password}
                                        onChangeText={(text) => updateField('password', text)}
                                        placeholder="Kosongkan jika tidak ingin mengubah password"
                                        secureTextEntry
                                    />
                                </Animated.View>
                            )}

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Lengkap</Text>
                                <TextInput
                                    className={`h-12 px-4 rounded-xl border text-gray-900 ${isEditable ? 'bg-gray-50 border-gray-200 focus:border-[#9e0b0f]' : 'bg-gray-100 border-gray-200 opacity-80'}`}
                                    cursorColor={theme.colors.primary}
                                    value={formData.nm_users}
                                    onChangeText={(text) => updateField('nm_users', text)}
                                    placeholder="Contoh: Andi Wijaya"
                                    editable={isEditable}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Level Akses</Text>
                                <View className={`border border-gray-200 rounded-lg ${isEditable ? 'bg-gray-50' : 'bg-gray-100 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 50, paddingHorizontal: 16 }}
                                        data={levelAksesData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Level Akses..."
                                        value={formData.id_users_level?.toString()}
                                        onChange={item => updateField('id_users_level', item.value)}
                                        disable={!isEditable}
                                    />
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className={`flex-row gap-4 ${!isEditable ? 'opacity-80' : ''}`}>
                                    <TouchableOpacity
                                        disabled={!isEditable}
                                        onPress={() => updateField('is_active', '1')}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.is_active === '1' || formData.is_active === 1 ? 'bg-green-50 border-green-500' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.is_active === '1' || formData.is_active === 1 ? 'text-green-700' : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        disabled={!isEditable}
                                        onPress={() => updateField('is_active', '0')}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.is_active === '0' || formData.is_active === 0 ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.is_active === '0' || formData.is_active === 0 ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </Animated.View>

                        {/* Actions */}
                        <Animated.View entering={FadeInUp.delay(600)} className="mt-6 flex-row gap-4">
                            {!isEditable ? (
                                <Button
                                    onPress={() => setIsEditable(true)}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-gray-800"
                                >
                                    <Edit2 color="white" size={18} className="mr-2" />
                                    <Text className="text-white font-bold text-base">Edit Data</Text>
                                </Button>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsEditable(false);
                                            loadUser(); // Reset data from DB
                                        }}
                                        className="flex-1 h-14 rounded-xl border border-gray-300 bg-white items-center justify-center flex-row"
                                        disabled={isSaving}
                                    >
                                        <X color="#6B7280" size={20} className="mr-2" />
                                        <Text className="text-gray-600 font-bold text-base">Batal</Text>
                                    </TouchableOpacity>

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
                                                <Save color="white" size={18} className="mr-2" />
                                                <Text className="text-white font-bold text-base">
                                                    Perbarui
                                                </Text>
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
                title="Perbarui Pengguna"
                message="Anda yakin ingin menyimpan perubahan pada pengguna ini?"
                confirmText="Ya, Perbarui"
                cancelText="Batal"
                onConfirm={handleConfirmSave}
                onCancel={() => setConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                title={toastType === 'success' ? 'Berhasil' : 'Validasi'}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </KeyboardAvoidingView>
    );
}
