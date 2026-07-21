import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { useSettingForm } from '../hooks/useSettingForm';
import { SettingFormSkeleton } from '../skeleton/SettingFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function SettingFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        isSaving,
        error,
        isLoading,
        updateField,
        save,
        loadData,
        validateForm,
    } = useSettingForm();

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
        const success = await save();
        if (success) {
            (navigation as any).navigate('Drawer', {
                screen: 'SettingList',
                params: {
                    toastMessage: 'Data setting berhasil ditambahkan!',
                    toastType: 'success'
                }
            });
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={isLoading ? 'MEMUAT DATA...' : 'TAMBAH SETTING'} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <SettingFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        {/* Error inline removed as it is handled by Toast */}

                        <Animated.View entering={FadeInUp.delay(50)} className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                            
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Label</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500"
                                    value={formData.setting_label}
                                    onChangeText={(text) => updateField('setting_label', text)}
                                    placeholder="Contoh: Alamat Perusahaan"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Key</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500"
                                    value={formData.setting_key}
                                    onChangeText={(text) => updateField('setting_key', text)}
                                    placeholder="Contoh: COMPANY_ADDRESS"
                                    autoCapitalize="characters"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Note (Catatan)</Text>
                                <TextInput
                                    className="min-h-[80px] bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500"
                                    value={formData.setting_note}
                                    onChangeText={(text) => updateField('setting_note', text)}
                                    placeholder="Tuliskan catatan..."
                                    multiline
                                    textAlignVertical="top"
                                />
                            </Animated.View>
                            
                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Value</Text>
                                <TextInput
                                    className="min-h-[100px] bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500"
                                    value={formData.setting_value}
                                    onChangeText={(text) => updateField('setting_value', text)}
                                    placeholder="Nilai pengaturan..."
                                    multiline
                                    textAlignVertical="top"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => updateField('setting_flag', '1')}
                                        activeOpacity={0.7}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.setting_flag === '1' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.setting_flag === '1' ? 'text-green-700' : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => updateField('setting_flag', '0')}
                                        activeOpacity={0.7}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.setting_flag === '0' ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.setting_flag === '0' ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>

                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(600)}>
                            <Button
                                onPress={onSavePress}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan Setting</Text>
                                    </>
                                )}
                            </Button>
                        </Animated.View>

                    </Animated.View>
                )}
            </ScrollView>

            <ModalConfirm
                visible={confirmModalVisible}
                title="Simpan Setting Baru"
                message="Anda yakin ingin menyimpan data setting baru ini?"
                confirmText="Ya, Simpan"
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
