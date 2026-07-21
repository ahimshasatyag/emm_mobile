import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { useCounterEdit } from '../hooks/useCounterEdit';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { CounterEditSkeleton } from '../skeleton/CounterEditSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function CounterEditScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = (route.params as { id: string }) || { id: '' };

    const [isEditing, setIsEditing] = useState(false);

    const {
        formData,
        displayData,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
        loadCounter,
        validateForm,
    } = useCounterEdit(id);

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
            setToastMsg('Data counter berhasil diperbarui!');
            setToastType('success');
            setToastTitle('Sukses');
            setToastVisible(true);
            loadCounter();
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadCounter();
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={isFetching ? 'MEMUAT DATA...' : (isEditing ? 'EDIT COUNTER' : 'DETAIL COUNTER')} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={loadCounter} colors={[theme.colors.primary]} />
                }
            >
                {isFetching ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <CounterEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        {/* Error inline removed as it is handled by Toast */}

                        <Animated.View 
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)} 
                            layout={LinearTransition.springify()}
                            className="bg-white p-5 rounded-3xl border border-gray-100 mb-6"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kode Counter</Text>
                                <TextInput
                                    className="h-12 px-4 rounded-xl border bg-gray-100 border-gray-200 text-gray-500 font-bold"
                                    value={displayData.id_counter}
                                    editable={false}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Periode</Text>
                                <TextInput
                                    className="h-12 px-4 rounded-xl border bg-gray-100 border-gray-200 text-gray-500 font-bold"
                                    value={displayData.periode}
                                    editable={false}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Counter</Text>
                                <TextInput
                                    className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-500'} font-bold`}
                                    value={formData.no_counter}
                                    onChangeText={(text) => updateField('no_counter', text)}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    editable={isEditing}
                                />
                            </Animated.View>
                        </Animated.View>

                        {/* Bottom Actions */}
                        <Animated.View 
                            key={`actions-${isEditing}`} 
                            entering={FadeInUp.delay(400)} 
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
                                    <Text className="text-white font-bold text-lg">Edit Counter</Text>
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
                                                <Text className="text-white font-bold text-lg">Update</Text>
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
                title="Simpan Perubahan Counter"
                message="Anda yakin ingin menyimpan perubahan data counter ini?"
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
